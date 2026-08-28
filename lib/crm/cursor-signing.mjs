import assert from "node:assert/strict";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const MAX_CURSOR_LENGTH = 768;
function secret(value = process.env.CRM_CURSOR_HMAC_SECRET) {
  if (typeof value !== "string" || Buffer.byteLength(value, "utf8") < 32) throw new Error("secret de curseur indisponible");
  return value;
}
export function canonicalFingerprint(value) { return createHash("sha256").update(JSON.stringify(value)).digest("base64url"); }
export function signCursor(payload, { purpose, secretValue } = {}) {
  assert.equal(typeof purpose, "string"); assert.ok(purpose.length >= 3 && purpose.length <= 80);
  const envelopePayload = { v: 1, ...payload }, encodedPayload = Buffer.from(JSON.stringify(envelopePayload)).toString("base64url");
  const signature = createHmac("sha256", secret(secretValue)).update(`${purpose}:${encodedPayload}`).digest("base64url");
  return Buffer.from(JSON.stringify({ p: encodedPayload, s: signature })).toString("base64url");
}
export function verifyCursor(cursor, { purpose, secretValue } = {}) {
  try {
    assert.equal(typeof cursor, "string"); assert.ok(cursor.length > 0 && cursor.length <= MAX_CURSOR_LENGTH); assert.match(cursor, /^[A-Za-z0-9_-]+$/);
    const envelope = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")); assert.deepEqual(Object.keys(envelope).sort(), ["p", "s"]);
    const expected = createHmac("sha256", secret(secretValue)).update(`${purpose}:${envelope.p}`).digest();
    const supplied = Buffer.from(envelope.s, "base64url"); assert.equal(supplied.length, expected.length); assert.ok(timingSafeEqual(supplied, expected));
    const payload = JSON.parse(Buffer.from(envelope.p, "base64url").toString("utf8")); assert.equal(payload.v, 1); return Object.freeze(payload);
  } catch { throw new TypeError("curseur invalide"); }
}
export const CURSOR_MAX_LENGTH = MAX_CURSOR_LENGTH;
