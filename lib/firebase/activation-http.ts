import { NextRequest,NextResponse } from "next/server";
import { activationCookiePolicy } from "@/lib/crm/activation-continuation.mjs";
import { csrfCookiePolicy } from "@/lib/crm/session-policy.mjs";
import { PRIVATE_RESPONSE_HEADERS,validateRequestSecurity } from "@/lib/crm/request-security.mjs";
import { validateHmacSecret } from "@/lib/config/server-config.mjs";

export const activationHeaders=PRIVATE_RESPONSE_HEADERS;
export function activationEnvironment(){if(process.env.AITMESBAH_APP_ENV!=="local")throw new Error("activation indisponible");return "local" as const;}
export function activationSecret(){return validateHmacSecret(process.env.CRM_ACTIVATION_HMAC_SECRET,{local:true});}
export function activationEnvelope(request:NextRequest){try{validateRequestSecurity({kind:"mutation",method:request.method,host:request.headers.get("host"),forwardedHost:request.headers.get("x-forwarded-host"),origin:request.headers.get("origin"),fetchSite:request.headers.get("sec-fetch-site"),fetchMode:request.headers.get("sec-fetch-mode"),fetchDestination:request.headers.get("sec-fetch-dest"),csrfHeader:request.headers.get("x-csrf-token"),csrfCookie:request.cookies.get(csrfCookiePolicy().name)?.value,contentType:request.headers.get("content-type"),contentLength:Number(request.headers.get("content-length")??0),maxBytes:16_384});}catch{throw Object.assign(new Error("activation impossible"),{code:"ACTIVATION_REJECTED"});}}
export function continuationCookie(request:NextRequest){return request.cookies.get(activationCookiePolicy(activationEnvironment()).name)?.value;}
export function genericActivation(status=400){return NextResponse.json({error:"Activation impossible."},{status,headers:activationHeaders});}
export function retryableActivation(){return NextResponse.json({error:"Activation momentanément indisponible."},{status:503,headers:activationHeaders});}
export function isTerminalActivationError(error:unknown){return Boolean(error&&typeof error==="object"&&"code" in error&&error.code==="ACTIVATION_REJECTED");}
export function clearActivationCookie(response:NextResponse){response.cookies.set({...activationCookiePolicy(activationEnvironment()),value:"",maxAge:0});return response;}
