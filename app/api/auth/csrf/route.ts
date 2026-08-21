import { NextResponse } from "next/server";
import { csrfCookiePolicy,generateCsrfToken } from "@/lib/crm/session-policy.mjs";
const headers={"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","Referrer-Policy":"same-origin"};
export async function GET(){const token=generateCsrfToken();const response=NextResponse.json({csrfToken:token},{headers});response.cookies.set({...csrfCookiePolicy(),value:token});return response;}
