import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { resolveCrmSession } from "./session";
import {PRIVATE_RESPONSE_HEADERS,validateRequestSecurity} from "@/lib/crm/request-security.mjs";
import {createServerConfig} from "@/lib/config/server-config.mjs";
export const CRM_HEADERS=PRIVATE_RESPONSE_HEADERS;
export async function requireCrmActor(permission:string){const session=await resolveCrmSession();if(session.state!=="authorized")throw Object.assign(new Error(session.state),{http:session.state==="unauthenticated"?401:403});if(!session.permissions.includes(permission))throw Object.assign(new Error("permission insuffisante"),{http:403});return {uid:session.uid,permissions:session.permissions,status:"active" as const};}
function securityInput(request:NextRequest,kind:string,maxBytes:number){const config=createServerConfig(process.env);return {kind,method:request.method,host:request.headers.get("host"),forwardedHost:request.headers.get("x-forwarded-host"),origin:request.headers.get("origin"),fetchSite:request.headers.get("sec-fetch-site"),fetchMode:request.headers.get("sec-fetch-mode"),fetchDestination:request.headers.get("sec-fetch-dest"),csrfHeader:request.headers.get("x-csrf-token"),csrfCookie:request.cookies.get(config.csrfCookie.name)?.value,contentType:request.headers.get("content-type"),contentLength:Number(request.headers.get("content-length")??0),maxBytes,allowedHosts:config.hosts,allowedOrigins:config.origins};}
export function validateCrmMutation(request:NextRequest){validateRequestSecurity(securityInput(request,"mutation",16_384));}
export function validateCrmMultipart(request:NextRequest){const type=request.headers.get("content-type")??"";if(!type.toLowerCase().startsWith("multipart/form-data; boundary="))throw Object.assign(new Error("multipart requis"),{http:415});validateRequestSecurity(securityInput(request,"upload",26*1024*1024));}
export function validateCrmRead(request:NextRequest){validateRequestSecurity(securityInput(request,"read",0));}
export function crmError(error:unknown){
 const value=error as {http?:number;code?:unknown;message?:string};
 const numericCode=typeof value.code==="number"?value.code:undefined;
 const providerCode=typeof value.code==="string"?value.code:undefined;
 const accountExists=providerCode==="auth/email-already-exists"||providerCode==="auth/uid-already-exists";
 const providerUnavailable=["auth/insufficient-permission","auth/internal-error"].includes(providerCode??"");
 const status=value.http??numericCode??(accountExists||providerCode==="quota-exceeded"?409:providerUnavailable?503:value.message?.includes("conflit")?409:value.message?.includes("invalide")||value.message?.includes("inconnu")?422:500);
 const message=accountExists?"Un compte utilise déjà cette adresse électronique.":providerUnavailable?"Le service de gestion des comptes est momentanément indisponible.":status===409?"La modification demandée est impossible.":status===404?"Compte introuvable.":status===401?"Session requise.":status===403?"Action non autorisée.":status===422?"Données invalides.":"Opération impossible.";
 return NextResponse.json({error:message},{status,headers:CRM_HEADERS});
}
export function exactBody(value:unknown,fields:string[]){if(!value||typeof value!=="object"||Array.isArray(value))throw new TypeError("corps invalide");const keys=Object.keys(value).sort(),expected=[...fields].sort();if(keys.length!==expected.length||keys.some((key,index)=>key!==expected[index]))throw new TypeError("champs inconnus");return value as Record<string,unknown>;}
