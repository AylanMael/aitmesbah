import { readFile } from "node:fs/promises";
import test, { after, before } from "node:test";
import {
  assertFails,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { getBytes, ref, uploadBytes } from "firebase/storage";

import {
  PROJECT_ID,
  assertLocalEmulatorSafety,
  createAuthenticationEmulatorUser,
} from "./test-helpers.mjs";

let environment;

before(async () => {
  assertLocalEmulatorSafety();
  environment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    storage: {
      host: "127.0.0.1",
      port: 9199,
      rules: await readFile("storage.rules", "utf8"),
    },
  });
});

after(async () => {
  await environment?.cleanup();
});

test("Storage refuse lecture et écriture non authentifiées", async () => {
  const storage = environment.unauthenticatedContext().storage();
  const reference = ref(storage, "private/anonymous.txt");
  await assertFails(getBytes(reference));
  await assertFails(uploadBytes(reference, new Uint8Array([1])));
});

test("Storage refuse lecture et écriture authentifiées", async () => {
  const uid = await createAuthenticationEmulatorUser("storage-user");
  const storage = environment.authenticatedContext(uid).storage();
  const reference = ref(storage, "private/authenticated.txt");
  await assertFails(getBytes(reference));
  await assertFails(uploadBytes(reference, new Uint8Array([1])));
});

test("Storage refuse faux administrateur et type MIME favorable", async () => {
  const storage = environment
    .authenticatedContext("fake-storage-admin", { admin: true })
    .storage();
  const reference = ref(storage, "organizations/organization-a/image.png");
  await assertFails(getBytes(reference));
  await assertFails(
    uploadBytes(reference, new Uint8Array([137, 80, 78, 71]), {
      contentType: "image/png",
      customMetadata: { approved: "true" },
    }),
  );
});
