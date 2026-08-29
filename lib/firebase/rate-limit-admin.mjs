import { Timestamp } from "firebase-admin/firestore";

import {
  RATE_LIMIT_COUNTER_COLLECTION,
  RATE_LIMIT_POLICY_VERSION,
  buildRateLimitPlan,
  retryAfterSeconds,
} from "../crm/rate-limit-contract.mjs";

const LOCAL_PROJECT_ID = "demo-aitmesbah";
const LOOPBACK_EMULATORS = Object.freeze({
  FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
  FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080",
  FIREBASE_STORAGE_EMULATOR_HOST: "127.0.0.1:9199",
});

export class RateLimitUnavailableError extends Error {
  constructor(message = "limiteur indisponible", options) {
    super(message, options);
    this.name = "RateLimitUnavailableError";
    this.code = "rate-limit-unavailable";
  }
}

export function assertLocalRateLimitEnvironment(environment = process.env) {
  const projectId = environment.GCLOUD_PROJECT ?? environment.GOOGLE_CLOUD_PROJECT;
  if (environment.AITMESBAH_APP_ENV != null && environment.AITMESBAH_APP_ENV !== "local") throw new RateLimitUnavailableError();
  if (projectId !== LOCAL_PROJECT_ID || !projectId.startsWith("demo-")) throw new RateLimitUnavailableError();
  for (const [name, expected] of Object.entries(LOOPBACK_EMULATORS)) {
    if (environment[name] !== expected) throw new RateLimitUnavailableError();
  }
  return true;
}

function counterData(snapshot, logical, document) {
  if (!snapshot.exists) return { used: 0, createdAt: null };
  const data = snapshot.data();
  const valid = data
    && data.schemaVersion === 1
    && data.policyVersion === RATE_LIMIT_POLICY_VERSION
    && data.category === logical.category
    && data.identityKind === logical.identity
    && data.generationId === document.generationId
    && data.windowSeconds === logical.windowSeconds
    && data.windowStartMs === logical.windowStartMs
    && data.windowEndMs === logical.windowEndMs
    && Number.isSafeInteger(data.used)
    && data.used >= 0
    && typeof data.expiresAt?.toMillis === "function"
    && data.expiresAt.toMillis() === logical.windowEndMs
    && typeof data.createdAt?.toMillis === "function";
  if (!valid) throw new RateLimitUnavailableError("compteur incohérent");
  return { used: data.used, createdAt: data.createdAt };
}

export async function consumeLocalFirestoreRateLimit({ database, profileName, identities, generations, nowMs = Date.now(), cost = 1 }) {
  assertLocalRateLimitEnvironment();
  if (!database || typeof database.runTransaction !== "function") throw new RateLimitUnavailableError();
  let plan;
  try {
    plan = buildRateLimitPlan({ profileName, identities, generations, nowMs, cost });
  } catch (error) {
    throw new RateLimitUnavailableError("contrat de quota invalide", { cause: error });
  }
  try {
    return await database.runTransaction(async transaction => {
      const flattened = plan.logicalCounters.flatMap(logical => logical.documents.map(document => ({ logical, document })));
      const references = flattened.map(({ document }) => database.collection(RATE_LIMIT_COUNTER_COLLECTION).doc(document.documentId));
      const snapshots = await transaction.getAll(...references);
      const states = snapshots.map((snapshot, index) => counterData(snapshot, flattened[index].logical, flattened[index].document));
      const exceeded = [];
      let offset = 0;
      for (const logical of plan.logicalCounters) {
        const generationStates = states.slice(offset, offset + logical.documents.length);
        offset += logical.documents.length;
        const total = generationStates.reduce((sum, state) => sum + state.used, 0);
        if (total + plan.cost > logical.maximum) exceeded.push(logical);
      }
      if (exceeded.length) {
        return Object.freeze({
          allowed: false,
          retryAfterSeconds: retryAfterSeconds(plan, exceeded),
          policyVersion: plan.policyVersion,
        });
      }
      offset = 0;
      const now = Timestamp.fromMillis(plan.nowMs);
      for (const logical of plan.logicalCounters) {
        const generationStates = states.slice(offset, offset + logical.documents.length);
        const currentIndex = logical.documents.findIndex(document => document.current);
        const currentDocument = logical.documents[currentIndex];
        const currentState = generationStates[currentIndex];
        offset += logical.documents.length;
        const reference = database.collection(RATE_LIMIT_COUNTER_COLLECTION).doc(currentDocument.documentId);
        transaction.set(reference, {
          schemaVersion: 1,
          policyVersion: plan.policyVersion,
          category: logical.category,
          identityKind: logical.identity,
          generationId: currentDocument.generationId,
          windowSeconds: logical.windowSeconds,
          windowStartMs: logical.windowStartMs,
          windowEndMs: logical.windowEndMs,
          used: currentState.used + plan.cost,
          createdAt: currentState.createdAt ?? now,
          updatedAt: now,
          expiresAt: Timestamp.fromMillis(logical.windowEndMs),
        });
      }
      return Object.freeze({ allowed: true, retryAfterSeconds: null, policyVersion: plan.policyVersion });
    });
  } catch (error) {
    if (error instanceof RateLimitUnavailableError) throw error;
    throw new RateLimitUnavailableError("transaction de quota indisponible", { cause: error });
  }
}
