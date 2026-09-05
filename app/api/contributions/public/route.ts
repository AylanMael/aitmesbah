import { createHmac, randomBytes, randomUUID } from "node:crypto";
import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { getLocalFirebaseAdmin } from "@/lib/firebase/admin";
import { validateCrmMultipart } from "@/lib/firebase/crm-request";
import { createDraft, transitionContribution } from "@/lib/crm/editorial-workflow.mjs";
import { prepareDraftInput, prepareVersion } from "@/lib/crm/contribution-management.mjs";
import { inspectUpload, reserveAsset, transitionAsset } from "@/lib/crm/private-assets.mjs";

const MAX_BODY = 26 * 1024 * 1024;
const MAX_FILES = 4;
const PUBLIC_ACTOR = "public-intake";
const RESPONSE_HEADERS = { "Cache-Control": "private, no-store, max-age=0", "Content-Type": "application/json; charset=utf-8" };

async function boundedForm(request: NextRequest) {
  const reader = request.body?.getReader();
  if (!reader) throw Object.assign(new Error("corps absent"), { http: 400 });
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY) throw Object.assign(new Error("corps excessif"), { http: 413 });
    chunks.push(value);
  }
  const body = Buffer.concat(chunks.map((value) => Buffer.from(value)));
  return new Request("http://local", { method: "POST", headers: { "content-type": request.headers.get("content-type")! }, body }).formData();
}

function text(form: FormData, name: string, max: number, required = true) {
  const value = form.get(name);
  if (typeof value !== "string") throw Object.assign(new Error("données invalides"), { http: 422 });
  const clean = value.trim();
  if ((required && !clean) || clean.length > max || /[<>]/.test(clean)) throw Object.assign(new Error("données invalides"), { http: 422 });
  return clean;
}

async function enforceRateLimit(request: NextRequest, email: string) {
  const { database, projectId } = getLocalFirebaseAdmin();
  const production = process.env.NODE_ENV === "production";
  const secret = process.env.PUBLIC_INTAKE_RATE_LIMIT_SECRET ?? (production ? "" : "local-public-intake-only");
  if (!secret) throw Object.assign(new Error("limiteur indisponible"), { http: 503 });
  const network = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const windowStart = Math.floor(Date.now() / 3_600_000) * 3_600_000;
  const digest = (kind: string, value: string) => createHmac("sha256", secret).update(`${projectId}\0${kind}\0${value.toLowerCase()}\0${windowStart}`).digest("hex");
  const refs = [database.doc(`publicSubmissionRateLimits/network-${digest("network", network)}`), database.doc(`publicSubmissionRateLimits/email-${digest("email", email)}`)];
  await database.runTransaction(async (transaction) => {
    const snapshots = await transaction.getAll(...refs);
    if (snapshots.some((snapshot) => snapshot.exists && Number(snapshot.data()?.used) >= 3)) throw Object.assign(new Error("trop de tentatives"), { http: 429 });
    const now = Timestamp.now();
    refs.forEach((ref, index) => transaction.set(ref, { used: Number(snapshots[index].data()?.used ?? 0) + 1, windowStart, updatedAt: now, expiresAt: Timestamp.fromMillis(windowStart + 3_600_000) }));
  });
}

export async function POST(request: NextRequest) {
  const uploaded: string[] = [];
  try {
    validateCrmMultipart(request);
    const form = await boundedForm(request);
    if (text(form, "website", 0, false)) throw Object.assign(new Error("requête refusée"), { http: 422 });
    if (form.get("consent") !== "yes") throw Object.assign(new Error("consentement requis"), { http: 422 });
    const name = text(form, "name", 120);
    const email = text(form, "email", 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Object.assign(new Error("adresse invalide"), { http: 422 });
    await enforceRateLimit(request, email);
    const raw = prepareDraftInput({ title: text(form, "title", 160), summary: text(form, "summary", 2000), category: text(form, "category", 40), sensitivity: text(form, "sensitivity", 30), body: text(form, "body", 20000), organizationId: null, organizationRepresentation: null });
    const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
    if (files.length > MAX_FILES) throw Object.assign(new Error("trop de fichiers"), { http: 422 });
    const prepared = await Promise.all(files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      return { file, buffer, inspection: inspectUpload({ fileName: file.name, declaredMimeType: file.type, buffer, reportedSize: file.size }) };
    }));
    if (new Set(prepared.map(({ inspection }) => inspection.sha256)).size !== prepared.length) throw Object.assign(new Error("fichiers dupliqués"), { http: 422 });
    const { database, bucket } = getLocalFirebaseAdmin();
    const contributionId = `contribution-${randomBytes(10).toString("hex")}`;
    const now = Timestamp.now();
    const draft = createDraft({ ...raw, contributionId, authorUid: PUBLIC_ACTOR, authorStatus: "active", organizationPermissions: [], now });
    const submitted = transitionContribution(draft.contribution, "submitted", { actorUid: PUBLIC_ACTOR, reason: "soumission publique", now });
    const version = prepareVersion(raw.body, "version publique initiale", 1, contributionId, PUBLIC_ACTOR, now);
    const assets = [];
    for (const item of prepared) {
      const assetId = randomUUID();
      const reserved = reserveAsset({ assetId, contributionId, uploaderUid: PUBLIC_ACTOR, fileName: item.file.name, declaredMimeType: item.file.type, now, actorUid: PUBLIC_ACTOR });
      const quarantined = transitionAsset(reserved, "quarantined", { actorUid: PUBLIC_ACTOR, now, inspection: item.inspection, scanStatus: "unavailable" } as never);
      await bucket.file(reserved.storagePath).save(item.buffer, { resumable: false, metadata: { contentType: item.inspection.detectedMimeType ?? item.file.type, metadata: { assetId, contributionId, intake: "public" } } });
      uploaded.push(reserved.storagePath);
      assets.push(quarantined);
    }
    const batch = database.batch();
    batch.create(database.doc(`contributions/${contributionId}`), submitted.contribution);
    batch.create(database.doc(`contributions/${contributionId}/versions/v1`), version);
    batch.create(database.doc(`contributions/${contributionId}/private/intake`), { name, email, consent: true, submittedAt: now, fileCount: assets.length });
    for (const asset of assets) batch.create(database.doc(`contributions/${contributionId}/assets/${asset.assetId}`), asset);
    await batch.commit();
    return NextResponse.json({ ok: true, reference: contributionId }, { status: 201, headers: RESPONSE_HEADERS });
  } catch (error) {
    if (uploaded.length) {
      const { bucket } = getLocalFirebaseAdmin();
      await Promise.all(uploaded.map((path) => bucket.file(path).delete({ ignoreNotFound: true }).catch(() => undefined)));
    }
    const value = error as { http?: number };
    const status = value.http ?? 422;
    const message = status === 413 ? "Les fichiers dépassent la taille autorisée." : status === 429 ? "Trop de tentatives. Merci de réessayer plus tard." : status === 503 ? "Le service est momentanément indisponible." : "La contribution contient des informations ou des fichiers invalides.";
    return NextResponse.json({ error: message }, { status, headers: RESPONSE_HEADERS });
  }
}
