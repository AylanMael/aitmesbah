import { NextRequest,NextResponse } from "next/server";
import { inviteAccount,listAccounts } from "@/lib/firebase/account-admin";
import { CRM_HEADERS,crmError,exactBody,requireCrmActor,validateCrmMutation } from "@/lib/firebase/crm-request";
export async function GET(request:NextRequest){try{const actor=await requireCrmActor("profile.assigned.read");return NextResponse.json(await listAccounts(actor,Object.fromEntries(request.nextUrl.searchParams)),{headers:CRM_HEADERS});}catch(error){return crmError(error);}}
export async function POST(request:NextRequest){try{validateCrmMutation(request);const actor=await requireCrmActor("member.approve");const body=exactBody(await request.json(),["displayName","email"]);return NextResponse.json(await inviteAccount(actor,body),{status:201,headers:CRM_HEADERS});}catch(error){return crmError(error);}}
