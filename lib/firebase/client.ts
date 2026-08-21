"use client";
import { getApp,getApps,initializeApp } from "firebase/app";
import { connectAuthEmulator,getAuth,inMemoryPersistence,setPersistence } from "firebase/auth";
let configured=false;
export async function getLocalFirebaseAuth(){const projectId=process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;if(process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS!=="true"||!projectId?.startsWith("demo-")||projectId==="aitmesbah-d945d"||projectId==="ccs-compta")throw new Error("Connexion locale indisponible");const app=getApps().length?getApp():initializeApp({projectId,apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY??"demo-api-key",authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN??`${projectId}.firebaseapp.com`});const auth=getAuth(app);if(!configured){connectAuthEmulator(auth,"http://127.0.0.1:9099",{disableWarnings:true});await setPersistence(auth,inMemoryPersistence);configured=true;}return auth;}
