import { parseAppEnvironment } from "./app-environment.mjs";
import { configurationError } from "./environment-errors.mjs";

const FORBIDDEN_PROJECTS = new Set(["aitmesbah-d945d", "ccs-compta"]);
function exactBoolean(value) { if (value === "true") return true; if (value === "false") return false; configurationError("BOOLEAN_INVALID"); }
function required(value, code) { if (typeof value !== "string" || !value || value !== value.trim()) configurationError(code); return value; }
export function assertLocalProjectId(value) {
  const projectId = required(value, "PROJECT_ID_INVALID");
  if (FORBIDDEN_PROJECTS.has(projectId)) configurationError("PROJECT_ID_FORBIDDEN");
  if (!projectId.startsWith("demo-")) configurationError("PROJECT_ID_NOT_DEMO");
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
  configurationError("REMOTE_INITIALIZATION_BLOCKED");
}
