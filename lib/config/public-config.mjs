import { parseAppEnvironment } from "./app-environment.mjs";
import { configurationError } from "./environment-errors.mjs";

const REMOTE_PLACEHOLDER=/replace|example|fictitious|test.only|dummy|placeholder/i;
function exactBoolean(value) { if (value === "true") return true; if (value === "false") return false; configurationError("BOOLEAN_INVALID"); }
function required(value, code) { if (typeof value !== "string" || !value || value !== value.trim()) configurationError(code); return value; }
export function assertLocalProjectId(value) {
  const projectId = required(value, "PROJECT_ID_INVALID");
  if (!projectId.startsWith("demo-")) configurationError("PROJECT_ID_NOT_DEMO");
  return projectId;
}
export function assertRemoteProjectId(value) {
  const projectId=required(value,"REMOTE_PROJECT_INVALID");
  if(projectId.startsWith("demo-")||REMOTE_PLACEHOLDER.test(projectId)||!(/^[a-z][a-z0-9-]{5,29}$/).test(projectId))configurationError("REMOTE_PROJECT_INVALID");
  return projectId;
}
function assertPublicShape(config) {
  for (const key of Object.keys(config)) if (/secret|private|credential|cookie|token|iam|service.?account/i.test(key)) configurationError("PUBLIC_SECRET_FORBIDDEN");
  return config;
}
export function createPublicConfig(env) {
  const appEnv = parseAppEnvironment(env.NEXT_PUBLIC_AITMESBAH_APP_ENV);
  const projectId = required(env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "PUBLIC_CONFIG_INCOMPLETE");
  const useEmulators = exactBoolean(env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS);
  if (appEnv === "local") {
    assertLocalProjectId(projectId);
    if (!useEmulators) configurationError("LOCAL_EMULATORS_REQUIRED");
    return Object.freeze(assertPublicShape({appEnv,projectId,apiKey:required(env.NEXT_PUBLIC_FIREBASE_API_KEY,"PUBLIC_CONFIG_INCOMPLETE"),authDomain:required(env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,"PUBLIC_CONFIG_INCOMPLETE"),useEmulators,authEmulatorUrl:"http://127.0.0.1:9099",appCheck:"disabled-local"}));
  }
  if (useEmulators) configurationError("REMOTE_EMULATORS_FORBIDDEN");
  assertRemoteProjectId(projectId);
  configurationError("REMOTE_INITIALIZATION_BLOCKED");
}
