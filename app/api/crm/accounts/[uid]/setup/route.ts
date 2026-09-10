import {NextRequest,NextResponse} from "next/server";
import {sendAccountSetupEmail} from "@/lib/firebase/account-admin";
import {CRM_HEADERS,crmError,exactBody,requireCrmActor,validateCrmMutation} from "@/lib/firebase/crm-request";

export async function POST(request:NextRequest,{params}:{params:Promise<{uid:string}>}){try{validateCrmMutation(request);const {uid}=await params;if(!/^[A-Za-z0-9_-]{3,128}$/.test(uid))throw new TypeError("uid invalide");exactBody(await request.json(),[]);const actor=await requireCrmActor("member.approve");return NextResponse.json(await sendAccountSetupEmail(actor,uid),{headers:CRM_HEADERS});}catch(error){return crmError(error);}}
