import { NextRequest,NextResponse } from "next/server";
import { reconcileLocalActivationEmail } from "@/lib/firebase/activation-admin.mjs";
import { getLocalFirebaseAdmin } from "@/lib/firebase/admin";
import { activationEnvelope,activationEnvironment,activationHeaders,activationSecret,clearActivationCookie,continuationCookie,genericActivation,isTerminalActivationError,retryableActivation } from "@/lib/firebase/activation-http";

export async function POST(request:NextRequest){try{activationEnvelope(request);const body=await request.json(),token=continuationCookie(request);if(!token||!body||Object.keys(body).join(",")!=="idToken"||typeof body.idToken!=="string")return clearActivationCookie(genericActivation());const {auth,database}=getLocalFirebaseAdmin();await reconcileLocalActivationEmail(database,auth,token,body.idToken,{secret:activationSecret(),environment:activationEnvironment(),nowMs:Date.now()});return clearActivationCookie(NextResponse.json({ok:true,state:"mfa_enrollment_pending"},{headers:activationHeaders}));}catch(error){return isTerminalActivationError(error)?clearActivationCookie(genericActivation()):retryableActivation();}}
