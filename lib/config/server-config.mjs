import { parseAppEnvironment, resolveAppEnvironment } from "./app-environment.mjs";
import { assertLocalProjectId } from "./public-config.mjs";
import { configurationError } from "./environment-errors.mjs";

export const LOCAL_HOSTS=Object.freeze(new Set(["localhost:3100","127.0.0.1:3100"]));
export const LOCAL_ORIGINS=Object.freeze(new Set(["http://localhost:3100","http://127.0.0.1:3100"]));
const LOCAL_EMULATORS=Object.freeze({auth:"127.0.0.1:9099",firestore:"127.0.0.1:8080",storage:"127.0.0.1:9199"});
const DURATION=12*60*60;
export function cookiePolicyFor(appEnv) {
  parseAppEnvironment(appEnv);
  const name=appEnv==="local"?"aitmesbah_session_local":appEnv==="staging"?"__Host-aitmesbah_session_staging":"__Host-aitmesbah_session";
  const policy=Object.freeze({name,httpOnly:true,secure:appEnv!=="local",sameSite:"strict",path:"/",maxAge:DURATION});
  if (name.startsWith("__Host-")&&(!policy.secure||policy.path!=="/"||"domain" in policy)) configurationError("COOKIE_POLICY_INVALID");
  return policy;
}
function emulator(value, expected) { if (value!==expected) configurationError("LOCAL_EMULATOR_INVALID"); return value; }
export function assertExactHost(value, allowed=LOCAL_HOSTS) { if(typeof value!=="string"||value!==value.trim()||value.includes("*")||!allowed.has(value)) configurationError("HOST_INVALID"); return value; }
export function assertExactOrigin(value, allowed=LOCAL_ORIGINS) { let url; try{url=new URL(value);}catch{configurationError("ORIGIN_INVALID");} if(value!==value.trim()||value.includes("*")||url.username||url.password||url.hash||url.search||url.pathname!=="/"||!allowed.has(url.origin)) configurationError("ORIGIN_INVALID"); return url.origin; }
export function validateHmacSecret(value,{local=false}={}) { if(typeof value!=="string"||Buffer.byteLength(value,"utf8")<32) configurationError("HMAC_SECRET_INVALID"); if(!local&&value.startsWith("TEST_ONLY_")) configurationError("HMAC_SECRET_INVALID"); return value; }
export function loadLocalHmacSecret(env) { return validateHmacSecret(env.CRM_CURSOR_HMAC_SECRET,{local:true}); }
export function createServerConfig(env,{requireHmac=false,activateRemote=false}={}) {
  const appEnv=resolveAppEnvironment(env);
  if(appEnv!=="local") {
    if(!env.AITMESBAH_CANONICAL_URL||!env.AITMESBAH_ALLOWED_HOSTS||!env.AITMESBAH_ALLOWED_ORIGINS||!env.CRM_CURSOR_HMAC_SECRET) configurationError("REMOTE_CONFIG_INCOMPLETE");
    validateHmacSecret(env.CRM_CURSOR_HMAC_SECRET);
    let canonical; try{canonical=new URL(env.AITMESBAH_CANONICAL_URL);}catch{configurationError("REMOTE_URL_INVALID");}
    if(canonical.protocol!=="https:"||canonical.username||canonical.password||canonical.hash||canonical.origin.includes("localhost")||canonical.origin.includes("127.0.0.1")) configurationError("REMOTE_URL_INVALID");
    const hosts=new Set(env.AITMESBAH_ALLOWED_HOSTS.split(",")),origins=new Set(env.AITMESBAH_ALLOWED_ORIGINS.split(","));
    if(hosts.size===0||origins.size===0||[...hosts,...origins].some(value=>!value||value!==value.trim()||value.includes("*"))) configurationError("REMOTE_ALLOWLIST_INVALID");
    for(const origin of origins){let parsed;try{parsed=new URL(origin);}catch{configurationError("REMOTE_ALLOWLIST_INVALID");}if(parsed.protocol!=="https:"||parsed.origin!==origin||parsed.username||parsed.password||parsed.pathname!=="/"||parsed.search||parsed.hash)configurationError("REMOTE_ALLOWLIST_INVALID");}
    if(activateRemote) configurationError("REMOTE_INITIALIZATION_BLOCKED");
    return Object.freeze({appEnv,canonicalUrl:canonical.origin,hosts,origins,remoteInitializationAllowed:false,cookie:cookiePolicyFor(appEnv),appCheck:appEnv==="staging"?"observe":env.AITMESBAH_APP_CHECK,rateLimit:Object.freeze({distributedRequired:true,configured:Boolean(env.AITMESBAH_RATE_LIMIT_BACKEND)})});
  }
  const projectId=assertLocalProjectId(env.GCLOUD_PROJECT);
  const emulators=Object.freeze({auth:emulator(env.FIREBASE_AUTH_EMULATOR_HOST,LOCAL_EMULATORS.auth),firestore:emulator(env.FIRESTORE_EMULATOR_HOST,LOCAL_EMULATORS.firestore),storage:emulator(env.FIREBASE_STORAGE_EMULATOR_HOST,LOCAL_EMULATORS.storage)});
  if(env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS!=="true") configurationError("LOCAL_EMULATORS_REQUIRED");
  if(env.NEXT_PUBLIC_AITMESBAH_APP_ENV!=="local") configurationError("APP_ENV_CONFLICT");
  if(requireHmac) validateHmacSecret(env.CRM_CURSOR_HMAC_SECRET,{local:true});
  return Object.freeze({appEnv,projectId,emulators,hosts:LOCAL_HOSTS,origins:LOCAL_ORIGINS,cookie:cookiePolicyFor(appEnv),appCheck:"disabled-local",rateLimit:Object.freeze({distributedRequired:false,configured:false,productive:false})});
}
