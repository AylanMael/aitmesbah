import {NextRequest,NextResponse} from "next/server";
import {listDeletionRequests} from "@/lib/firebase/asset-admin";
import {CRM_HEADERS,crmError,requireCrmActor,validateCrmRead} from "@/lib/firebase/crm-request";

export async function GET(request:NextRequest){try{validateCrmRead(request);const actor=await requireCrmActor("asset.deletion.manage"),query=Object.fromEntries(request.nextUrl.searchParams);return NextResponse.json(await listDeletionRequests(actor.uid,query),{headers:CRM_HEADERS});}catch(error){return crmError(error);}}
