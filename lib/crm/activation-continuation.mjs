import assert from "node:assert/strict";
import { createHmac,timingSafeEqual } from "node:crypto";

export const ACTIVATION_CONTINUATION_DURATION_MS=15*60*1000;
const DOMAIN="aitmesbah:activation-continuation:v1";
const ENVS=Object.freeze(["local","staging","production"]);
const STATES=Object.freeze(["password_pending","email_verification_pending"]);
const ID=/^[A-Za-z0-9_-]{3,128}$/;
const encode=value=>Buffer.from(value,"utf8").toString("base64url");
const decode=value=>Buffer.from(value,"base64url").toString("utf8");
function validSecret(secret){assert.ok(typeof secret==="string"&&Buffer.byteLength(secret,"utf8")>=32,"continuation indisponible");return secret;}
function exact(value){assert.ok(value&&typeof value==="object"&&!Array.isArray(value));assert.deepEqual(Object.keys(value).sort(),["activationId","environment","expiresAt","issuedAt","state","uid","version"].sort());}
function validateClaims(value){exact(value);assert.ok(ID.test(value.activationId)&&ID.test(value.uid));assert.ok(ENVS.includes(value.environment)&&STATES.includes(value.state));assert.ok(Number.isSafeInteger(value.version)&&value.version>=1);assert.ok(Number.isSafeInteger(value.issuedAt)&&Number.isSafeInteger(value.expiresAt)&&value.expiresAt>value.issuedAt&&value.expiresAt-value.issuedAt<=ACTIVATION_CONTINUATION_DURATION_MS);return value;}
function signature(payload,secret){return createHmac("sha256",validSecret(secret)).update(`${DOMAIN}.${payload}`).digest();}
export function createActivationContinuation(claims,{secret,nowMs}){validateClaims(claims);assert.equal(claims.issuedAt,nowMs);const payload=encode(JSON.stringify(claims)),mac=signature(payload,secret).toString("base64url");return `${payload}.${mac}`;}
export function verifyActivationContinuation(token,{secret,environment,expectedState,nowMs}){assert.ok(typeof token==="string"&&token.length<=4096);const parts=token.split(".");assert.equal(parts.length,2);const expected=signature(parts[0],secret),actual=Buffer.from(parts[1],"base64url");assert.ok(actual.length===expected.length&&timingSafeEqual(actual,expected),"continuation invalide");let claims;try{claims=JSON.parse(decode(parts[0]));}catch{throw new Error("continuation invalide");}validateClaims(claims);assert.equal(claims.environment,environment,"environnement invalide");assert.equal(claims.state,expectedState,"état invalide");assert.ok(nowMs>=claims.issuedAt&&nowMs<claims.expiresAt,"continuation expirée");return Object.freeze(claims);}
export function activationCookiePolicy(environment){assert.ok(ENVS.includes(environment));return Object.freeze({name:environment==="local"?"aitmesbah_activation_local":environment==="staging"?"__Host-aitmesbah_activation_staging":"__Host-aitmesbah_activation",httpOnly:true,secure:environment!=="local",sameSite:"strict",path:"/",maxAge:ACTIVATION_CONTINUATION_DURATION_MS/1000});}
