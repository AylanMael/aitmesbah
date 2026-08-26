import {NextRequest} from "next/server";
import {getAssetDownload} from "@/lib/firebase/asset-admin";
import {CRM_HEADERS,crmError,requireCrmActor,validateCrmRead} from "@/lib/firebase/crm-request";

function quotedFileName(value:string){return value.replace(/[^A-Za-z0-9._-]/g,"_").slice(0,120)||"fichier";}
export async function GET(request:NextRequest,{params}:{params:Promise<{contributionId:string;assetId:string}>}){try{validateCrmRead(request);let current=null;for(const permission of ["asset.self.manage","asset.assigned.read"])try{current=await requireCrmActor(permission);break;}catch{}if(!current)throw Object.assign(new Error("permission insuffisante"),{http:403});const {contributionId,assetId}=await params,{bytes,fileName,contentType}=await getAssetDownload(current.uid,contributionId,assetId);return new Response(new Uint8Array(bytes),{headers:{...CRM_HEADERS,"Content-Type":contentType,"Content-Disposition":`attachment; filename="${quotedFileName(fileName)}"`,"Cache-Control":"private, no-store, max-age=0"}});}catch(error){return crmError(error);}}
