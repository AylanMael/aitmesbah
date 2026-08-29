import { configurationError } from "./environment-errors.mjs";

export const APP_ENVIRONMENTS = Object.freeze(["local", "staging", "production"]);

export function parseAppEnvironment(value) {
  if (typeof value !== "string" || value === "" || value !== value.trim() || !APP_ENVIRONMENTS.includes(value)) {
    configurationError("APP_ENV_INVALID");
  }
  return value;
}

export function resolveAppEnvironment(env) {
  const server = parseAppEnvironment(env.AITMESBAH_APP_ENV);
  const publicValue = env.NEXT_PUBLIC_AITMESBAH_APP_ENV;
  if (publicValue !== undefined && parseAppEnvironment(publicValue) !== server) configurationError("APP_ENV_CONFLICT");
  return server;
}
