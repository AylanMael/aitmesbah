import { NextRequest,NextResponse } from "next/server";
import { activationCookiePolicy } from "@/lib/crm/activation-continuation.mjs";
import { reconcileLocalActivationPassword } from "@/lib/firebase/activation-admin.mjs";
import { getLocalFirebaseAdmin } from "@/lib/firebase/admin";
import { activationEnvelope,activationEnvironment,activationHeaders,activationSecret,clearActivationCookie,continuationCookie,genericActivation,isTerminalActivationError,retryableActivation } from "@/lib/firebase/activation-http";

export async function POST(request:NextRequest){try{activationEnvelope(request);const body=await request.json(),token=continuationCookie(request);if(!token||!body||Object.keys(body).join(",")!=="idToken"||typeof body.idToken!=="string")return clearActivationCookie(genericActivation());const {auth,database}=getLocalFirebaseAdmin(),environment=activationEnvironment(),result=await reconcileLocalActivationPassword(database,auth,token,body.idToken,{secret:activationSecret(),environment,nowMs:Date.now()});const response=NextResponse.json({ok:true,next:"/verification-email"},{headers:activationHeaders});response.cookies.set({...activationCookiePolicy(environment),value:result.continuation});return response;}catch(error){return isTerminalActivationError(error)?clearActivationCookie(genericActivation()):retryableActivation();}}
