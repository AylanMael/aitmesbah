import "server-only";
import assert from "node:assert/strict";
import { applicationDefault,getApps,initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { assertDemoProject } from "@/lib/crm/session-policy.mjs";

export function getLocalFirebaseAdmin(){const projectId=process.env.GCLOUD_PROJECT;assertDemoProject(projectId);assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,"127.0.0.1:9099");assert.equal(process.env.FIRESTORE_EMULATOR_HOST,"127.0.0.1:8080");assert.equal(process.env.FIREBASE_STORAGE_EMULATOR_HOST,"127.0.0.1:9199");process.env.METADATA_SERVER_DETECTION="none";const app=getApps()[0]??initializeApp({projectId,credential:applicationDefault(),storageBucket:`${projectId}.appspot.com`});return {projectId,auth:getAuth(app),database:getFirestore(app),bucket:getStorage(app).bucket(`${projectId}.appspot.com`)};}
