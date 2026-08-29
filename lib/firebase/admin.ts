import "server-only";
import { applicationDefault,getApps,initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { createServerConfig } from "@/lib/config/server-config.mjs";

export function getLocalFirebaseAdmin(){const config=createServerConfig(process.env,{activateRemote:true});if(!("projectId" in config))throw new Error("Configuration locale indisponible");process.env.METADATA_SERVER_DETECTION="none";const {projectId}=config;const app=getApps()[0]??initializeApp({projectId,credential:applicationDefault(),storageBucket:`${projectId}.appspot.com`});return {projectId,auth:getAuth(app),database:getFirestore(app),bucket:getStorage(app).bucket(`${projectId}.appspot.com`)};}
