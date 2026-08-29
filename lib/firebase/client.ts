"use client";
import { getApp,getApps,initializeApp } from "firebase/app";
import { connectAuthEmulator,getAuth,inMemoryPersistence,setPersistence } from "firebase/auth";
import { createPublicConfig } from "@/lib/config/public-config.mjs";
let configured=false;
export async function getLocalFirebaseAuth(){const config=createPublicConfig({NEXT_PUBLIC_AITMESBAH_APP_ENV:process.env.NEXT_PUBLIC_AITMESBAH_APP_ENV,NEXT_PUBLIC_FIREBASE_PROJECT_ID:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,NEXT_PUBLIC_FIREBASE_API_KEY:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_USE_EMULATORS:process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS});const app=getApps().length?getApp():initializeApp({projectId:config.projectId,apiKey:config.apiKey,authDomain:config.authDomain});const auth=getAuth(app);if(!configured){connectAuthEmulator(auth,config.authEmulatorUrl,{disableWarnings:true});await setPersistence(auth,inMemoryPersistence);configured=true;}return auth;}
