import { configurationError } from "./environment-errors.mjs";
import { assertRemoteProjectId } from "./public-config.mjs";

export const STAGING_PROJECT_SENTINEL="REPLACE_WITH_APPROVED_STAGING_PROJECT_ID";
export const STAGING_CANONICAL_ORIGIN="https://staging.aitmesbah.example";
export const STAGING_CANONICAL_HOST="staging.aitmesbah.example";
export const STAGING_REGION="europe-west4";
const FORBIDDEN_PROJECTS=new Set(["demo-aitmesbah","aitmesbah-d945d","ccs-compta",STAGING_PROJECT_SENTINEL,"REPLACE_WITH_APPROVED_PRODUCTION_PROJECT_ID"]);
const PLACEHOLDER=/replace|example|fictitious|test.only|dummy|placeholder/i;

function required(value,code){if(typeof value!=="string"||value===""||value!==value.trim())configurationError(code);return value;}
function noEmulators(env){for(const key of ["FIREBASE_AUTH_EMULATOR_HOST","FIRESTORE_EMULATOR_HOST","FIREBASE_STORAGE_EMULATOR_HOST"]){if(env[key]!==undefined)configurationError("STAGING_EMULATORS_FORBIDDEN");}if(env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS!=="false")configurationError("STAGING_EMULATORS_FORBIDDEN");}
export function assertStagingHmacSecret(value){
  const secret=required(value,"STAGING_SECRET_INVALID");
  if(Buffer.byteLength(secret,"utf8")<32||PLACEHOLDER.test(secret)||/^(.)\1+$/.test(secret))configurationError("STAGING_SECRET_INVALID");
  return secret;
}
export function createStagingPolicy(env,{activateRemote=false}={}){
  if(env.AITMESBAH_APP_ENV!=="staging"||env.NEXT_PUBLIC_AITMESBAH_APP_ENV!=="staging")configurationError("APP_ENV_CONFLICT");
  noEmulators(env);
  const projectId=assertRemoteProjectId(env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  if(FORBIDDEN_PROJECTS.has(projectId)||projectId===env.AITMESBAH_PRODUCTION_PROJECT_ID)configurationError("REMOTE_PROJECT_CONFLICT");
  if(env.GCLOUD_PROJECT!==projectId)configurationError("STAGING_PROJECT_CONFLICT");
  if(env.AITMESBAH_REGION!==STAGING_REGION)configurationError("STAGING_REGION_INVALID");
  if(env.AITMESBAH_CANONICAL_URL!==STAGING_CANONICAL_ORIGIN||env.AITMESBAH_ALLOWED_HOSTS!==STAGING_CANONICAL_HOST||env.AITMESBAH_ALLOWED_ORIGINS!==STAGING_CANONICAL_ORIGIN)configurationError("STAGING_ENDPOINT_INVALID");
  if(env.AITMESBAH_APP_CHECK!=="observe")configurationError("STAGING_APP_CHECK_INVALID");
  if(env.AITMESBAH_RATE_LIMIT_BACKEND!=="distributed-required")configurationError("STAGING_RATE_LIMIT_REQUIRED");
  assertStagingHmacSecret(env.CRM_CURSOR_HMAC_SECRET);
  if(env.AITMESBAH_REMOTE_ACTIVATION!=="disabled"||activateRemote)configurationError("REMOTE_INITIALIZATION_BLOCKED");
  return Object.freeze({appEnv:"staging",projectId,region:STAGING_REGION,canonicalUrl:STAGING_CANONICAL_ORIGIN,hosts:Object.freeze(new Set([STAGING_CANONICAL_HOST])),origins:Object.freeze(new Set([STAGING_CANONICAL_ORIGIN])),appCheck:"observe",rateLimit:Object.freeze({distributedRequired:true,configured:false}),remoteInitializationAllowed:false});
}
