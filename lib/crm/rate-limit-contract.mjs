import { createHash, createHmac } from "node:crypto";

export const RATE_LIMIT_POLICY_VERSION = "staging-8p4c-v1";
export const LOCAL_RATE_LIMIT_NAMESPACE = "local:demo-aitmesbah:rate-limit:v1";
export const MAX_RATE_LIMIT_COUNTERS = 6;
export const MAX_ROTATION_KEYS = 12;
export const HMAC_OVERLAP_SECONDS = 600;
export const MAX_RETRY_AFTER_SECONDS = 300;

export const RATE_LIMIT_CATEGORIES = Object.freeze([
  "csrfBootstrap",
  "session",
  "ordinaryRead",
  "privilegedMutation",
  "contentMutation",
  "editorialDecision",
  "assetMutation",
  "upload",
  "download",
  "deletion",
  "auditRead",
]);

const profile = (category, counters) => Object.freeze({
  category,
  counters: Object.freeze(counters.map(counter => Object.freeze({
    ...counter,
    windows: Object.freeze(counter.windows.map(window => Object.freeze(window))),
  }))),
});

export const STAGING_RATE_LIMIT_PROFILES = Object.freeze({
  csrfBootstrap: profile("csrfBootstrap", [
    { identity: "network", windows: [{ seconds: 60, maximum: 30 }] },
  ]),
  sessionCreate: profile("session", [
    { identity: "uid", windows: [{ seconds: 60, maximum: 10 }, { seconds: 10, maximum: 3 }] },
    { identity: "network", windows: [{ seconds: 60, maximum: 50 }, { seconds: 10, maximum: 15 }] },
  ]),
  sessionLogout: profile("session", [
    { identity: "uid", windows: [{ seconds: 60, maximum: 30 }, { seconds: 10, maximum: 10 }] },
    { identity: "session", windows: [{ seconds: 60, maximum: 30 }, { seconds: 10, maximum: 10 }] },
  ]),
  ordinaryRead: profile("ordinaryRead", [
    { identity: "uid", windows: [{ seconds: 60, maximum: 60 }] },
  ]),
  privilegedMutation: profile("privilegedMutation", [
    { identity: "uid", windows: [{ seconds: 60, maximum: 20 }, { seconds: 10, maximum: 5 }] },
    { identity: "resource", windows: [{ seconds: 60, maximum: 10 }, { seconds: 10, maximum: 3 }] },
  ]),
  contentCreate: profile("contentMutation", [
    { identity: "uid", windows: [{ seconds: 60, maximum: 20 }] },
  ]),
  contentUpdate: profile("contentMutation", [
    { identity: "uid", windows: [{ seconds: 60, maximum: 20 }] },
    { identity: "resource", windows: [{ seconds: 60, maximum: 10 }] },
  ]),
  editorialDecision: profile("editorialDecision", [
    { identity: "uid", windows: [{ seconds: 60, maximum: 30 }] },
    { identity: "resource", windows: [{ seconds: 60, maximum: 10 }] },
  ]),
  assetMutation: profile("assetMutation", [
    { identity: "uid", windows: [{ seconds: 60, maximum: 20 }] },
    { identity: "resource", windows: [{ seconds: 60, maximum: 10 }] },
  ]),
  upload: profile("upload", [
    { identity: "uid", windows: [{ seconds: 300, maximum: 10 }, { seconds: 30, maximum: 2 }] },
    { identity: "network", windows: [{ seconds: 300, maximum: 50 }, { seconds: 30, maximum: 10 }] },
    { identity: "resource", windows: [{ seconds: 300, maximum: 10 }, { seconds: 30, maximum: 2 }] },
  ]),
  download: profile("download", [
    { identity: "uid", windows: [{ seconds: 60, maximum: 60 }, { seconds: 10, maximum: 15 }] },
    { identity: "resource", windows: [{ seconds: 60, maximum: 30 }, { seconds: 10, maximum: 10 }] },
  ]),
  deletion: profile("deletion", [
    { identity: "uid", windows: [{ seconds: 300, maximum: 10 }, { seconds: 30, maximum: 2 }] },
    { identity: "resource", windows: [{ seconds: 300, maximum: 2 }, { seconds: 30, maximum: 1 }] },
  ]),
  auditRead: profile("auditRead", [
    { identity: "uid", windows: [{ seconds: 60, maximum: 30 }] },
  ]),
});

const IDENTITY_KINDS = new Set(["uid", "network", "resource", "session"]);
const GENERATION_ID = /^[a-z][a-z0-9-]{0,31}$/;
const LOCAL_SECRET = /^local-test-only-hmac-[A-Za-z0-9_-]{16,128}$/;
const NAMESPACE = /^(local|staging|production):[a-z0-9][a-z0-9-]{2,62}:rate-limit:v[1-9][0-9]*$/;

function closedError(message) {
  return Object.assign(new Error(message), { code: "rate-limit-contract-invalid" });
}

function exactKeys(value, expected, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw closedError(`${label} invalide`);
  const actual = Object.keys(value).sort(), wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) throw closedError(`${label} invalide`);
}

export function validateLocalHmacGenerations(generations) {
  exactKeys(generations, generations?.previous ? ["current", "previous"] : ["current"], "générations HMAC");
  const values = [generations.current, ...(generations.previous ? [generations.previous] : [])];
  if (values.length > 2) throw closedError("trop de générations HMAC");
  for (const value of values) {
    exactKeys(value, ["id", "secret"], "génération HMAC");
    if (!GENERATION_ID.test(value.id) || !LOCAL_SECRET.test(value.secret)) throw closedError("génération HMAC locale invalide");
  }
  if (generations.previous?.id === generations.current.id) throw closedError("générations HMAC identiques");
  return Object.freeze({ current: generations.current, ...(generations.previous ? { previous: generations.previous } : {}) });
}

function rawIdentity(value, kind) {
  if (!IDENTITY_KINDS.has(kind) || typeof value !== "string" || value.length < 1 || value.length > 512 || value !== value.trim() || /[\u0000-\u001f\u007f]/u.test(value)) {
    throw closedError(`identité ${kind} invalide`);
  }
  return value;
}

function pseudonym(secret, namespace, profileName, category, kind, raw) {
  return createHmac("sha256", secret)
    .update(namespace).update("\0")
    .update(RATE_LIMIT_POLICY_VERSION).update("\0")
    .update(profileName).update("\0")
    .update(category).update("\0")
    .update(kind).update("\0")
    .update(raw)
    .digest("base64url");
}

function opaqueCounterKey({ namespace, profileName, category, generationId, identity, pseudonymousValue, windowSeconds, windowStartMs }) {
  return createHash("sha256")
    .update("rate-limit-key-v1\0")
    .update(namespace).update("\0")
    .update(RATE_LIMIT_POLICY_VERSION).update("\0")
    .update(profileName).update("\0")
    .update(category).update("\0")
    .update(generationId).update("\0")
    .update(identity).update("\0")
    .update(pseudonymousValue).update("\0")
    .update(String(windowSeconds)).update("\0")
    .update(String(windowStartMs))
    .digest("hex");
}

export function buildRateLimitPlan({ namespace, profileName, identities, generations, nowMs, cost = 1 }) {
  if (typeof namespace !== "string" || !NAMESPACE.test(namespace)) throw closedError("namespace de quota invalide");
  const selected = STAGING_RATE_LIMIT_PROFILES[profileName];
  if (!selected) throw closedError("profil de quota inconnu");
  if (!Number.isSafeInteger(nowMs) || nowMs < 0) throw closedError("horloge serveur invalide");
  if (cost !== 1) throw closedError("coût de quota invalide");
  const expectedIdentities = selected.counters.map(counter => counter.identity);
  exactKeys(identities, expectedIdentities, "identités de quota");
  const safeGenerations = validateLocalHmacGenerations(generations);
  const generationValues = [safeGenerations.current, ...(safeGenerations.previous ? [safeGenerations.previous] : [])];
  const logicalCounters = [];
  for (const counter of selected.counters) {
    const raw = rawIdentity(identities[counter.identity], counter.identity);
    for (const window of counter.windows) {
      const windowMs = window.seconds * 1000;
      const windowStartMs = Math.floor(nowMs / windowMs) * windowMs;
      const windowEndMs = windowStartMs + windowMs;
      const generationKeys = generationValues.map(generation => {
        const pseudonymousValue = pseudonym(generation.secret, namespace, profileName, selected.category, counter.identity, raw);
        return Object.freeze({
          opaqueKey: opaqueCounterKey({ namespace, profileName, category: selected.category, generationId: generation.id, identity: counter.identity, pseudonymousValue, windowSeconds: window.seconds, windowStartMs }),
          generationId: generation.id,
          current: generation.id === safeGenerations.current.id,
        });
      });
      logicalCounters.push(Object.freeze({
        namespace,
        profileName,
        category: selected.category,
        identity: counter.identity,
        maximum: window.maximum,
        windowSeconds: window.seconds,
        windowStartMs,
        windowEndMs,
        generationKeys: Object.freeze(generationKeys),
      }));
    }
  }
  if (logicalCounters.length > MAX_RATE_LIMIT_COUNTERS) throw closedError("maximum de compteurs dépassé");
  const keyEvaluations = logicalCounters.reduce((total, counter) => total + counter.generationKeys.length, 0);
  if (keyEvaluations > MAX_ROTATION_KEYS) throw closedError("maximum de clés dépassé");
  return Object.freeze({
    policyVersion: RATE_LIMIT_POLICY_VERSION,
    namespace,
    profileName,
    category: selected.category,
    cost,
    nowMs,
    currentGenerationId: safeGenerations.current.id,
    keyEvaluations,
    logicalCounters: Object.freeze(logicalCounters),
  });
}

export function retryAfterSeconds(plan, exceededCounters) {
  if (!Array.isArray(exceededCounters) || exceededCounters.length === 0) throw closedError("compteurs dépassés absents");
  const longest = Math.max(...exceededCounters.map(counter => Math.ceil((counter.windowEndMs - plan.nowMs) / 1000)));
  return Math.min(MAX_RETRY_AFTER_SECONDS, Math.max(1, longest));
}
