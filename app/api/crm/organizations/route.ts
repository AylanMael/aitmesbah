import {NextRequest,NextResponse} from "next/server";
import {createOrganizationRecord,listOrganizations} from "@/lib/firebase/organization-admin";
import {CRM_HEADERS,crmError,exactBody,requireCrmActor,validateCrmMutation,validateCrmRead} from "@/lib/firebase/crm-request";
async function actorAny(permissions:string[]){for(const permission of permissions){try{return await requireCrmActor(permission);}catch{}}throw Object.assign(new Error("permission insuffisante"),{http:403});}
export async function GET(request:NextRequest){try{validateCrmRead(request);const actor=await actorAny(["organization.list","organization.member.manage","role.local.manage"]);return NextResponse.json(await listOrganizations(actor.uid,Object.fromEntries(request.nextUrl.searchParams)),{headers:CRM_HEADERS});}catch(error){return crmError(error);}}
export async function POST(request:NextRequest){try{validateCrmMutation(request);const actor=await requireCrmActor("organization.create");return NextResponse.json(await createOrganizationRecord(actor.uid,exactBody(await request.json(),["name","type","declaredScope"])),{status:201,headers:CRM_HEADERS});}catch(error){return crmError(error);}}
