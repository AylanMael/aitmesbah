import assert from "node:assert/strict";
import { timingSafeEqual } from "node:crypto";

export const LOCAL_CRM_HOSTS = Object.freeze(["localhost:3100", "127.0.0.1:3100"]);
export const PRIVATE_RESPONSE_HEADERS = Object.freeze({
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
});

function reject(message, http = 403) { throw Object.assign(new Error(message), { http }); }
function equalSecret(left, right) { if (typeof left !== "string" || typeof right !== "string") return false; const a = Buffer.from(left), b = Buffer.from(right); return a.length === b.length && timingSafeEqual(a, b); }
export function assertLocalHost(host, forwardedHost, allowedHosts=LOCAL_CRM_HOSTS) {
  if (typeof host !== "string" || !host || host !== host.trim() || host.includes(",") || host.includes("@")) reject("hôte interdit");
  if (forwardedHost != null && forwardedHost !== "") {
    if (forwardedHost !== forwardedHost.trim() || forwardedHost.includes(",") || forwardedHost.includes("@") || !allowedHosts.includes(forwardedHost)) reject("hôte transféré interdit");
    if (allowedHosts.includes(host) && forwardedHost !== host) reject("hôte transféré interdit");
    return forwardedHost;
  }
  if (!allowedHosts.includes(host)) reject("hôte interdit");
  return host;
}
export function assertLocalOrigin(origin, host, { required,allowedOrigins=null }) {
  if (origin == null || origin === "") { if (required) reject("origine requise"); return null; }
  if (origin === "null" || origin !== origin.trim() || origin.includes(",") || origin.includes("@")) reject("origine interdite");
  let parsed; try { parsed = new URL(origin); } catch { reject("origine interdite"); }
  const expected=allowedOrigins??[`http://${host}`];
  if (!expected.includes(parsed.origin) || parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) reject("origine interdite");
  return parsed.origin;
}
export function assertFetchMetadata({ site, mode, destination }) {
  if (site === "cross-site") reject("requête intersite interdite");
  if (site != null && !["same-origin", "same-site", "none"].includes(site)) reject("fetch metadata invalide");
  if (mode != null && !["navigate", "same-origin", "cors", "no-cors"].includes(mode)) reject("fetch metadata invalide");
  if (destination != null && typeof destination !== "string") reject("fetch metadata invalide");
  return true;
}
export function validateRequestSecurity(input) {
  const allowedHosts=input.allowedHosts?[...input.allowedHosts]:LOCAL_CRM_HOSTS,allowedOrigins=input.allowedOrigins?[...input.allowedOrigins]:null;
  const host = assertLocalHost(input.host, input.forwardedHost,allowedHosts);
  assertFetchMetadata({ site: input.fetchSite, mode: input.fetchMode, destination: input.fetchDestination });
  const mutation = ["mutation", "upload", "session"].includes(input.kind);
  const methods = input.kind === "read" ? ["GET"] : input.kind === "upload" ? ["POST"] : input.kind === "session" ? ["POST", "DELETE"] : ["POST", "PATCH", "DELETE"];
  if (input.method != null && !methods.includes(input.method)) reject("méthode interdite", 405);
  assertLocalOrigin(input.origin, host, { required: mutation,allowedOrigins });
  if (mutation) {
    if (!input.csrfHeader || !equalSecret(input.csrfHeader, input.csrfCookie)) reject("CSRF invalide");
    if (!Number.isFinite(input.contentLength) || input.contentLength < 0 || input.contentLength > input.maxBytes) reject("corps excessif", 413);
    if (input.kind !== "upload" && input.contentType?.split(";")[0].toLowerCase() !== "application/json") reject("contenu interdit", 415);
  }
  return true;
}
export function rejectInexactFilters(raw, allowed = ["limit", "cursor"]) {
  if (Object.entries(raw).some(([key, value]) => value != null && value !== "" && !allowed.includes(key))) reject("combinaison de filtres non paginable", 400);
  return true;
}
export function assertNoPermissiveCors(headers) {
  assert.notEqual(headers["Access-Control-Allow-Origin"], "*");
  return true;
}
