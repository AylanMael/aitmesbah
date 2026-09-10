import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const formSource = () => readFile(new URL("../../components/contribute/ContributionIntakeForm.tsx", import.meta.url), "utf8");
const routeSource = () => readFile(new URL("../../app/api/contributions/public/route.ts", import.meta.url), "utf8");

test("le consentement public provient réellement de la case cochée", async () => {
  const source = await formSource();
  assert.match(source, /name="consent" value="yes" type="checkbox" required/);
  assert.doesNotMatch(source, /body\.set\("consent"/);
});

test("la soumission publique reste limitée, privée et auditée", async () => {
  const source = await routeSource();
  assert.match(source, /PUBLIC_INTAKE_RATE_LIMIT_SECRET.*CRM_CURSOR_HMAC_SECRET/);
  assert.match(source, /RATE_LIMITS = \{ network: 15, email: 5 \}/);
  assert.match(source, /snapshots\.some\(\(snapshot, index\).*counters\[index\]\.limit/);
  assert.match(source, /contributions\/\$\{contributionId\}\/private\/intake/);
  assert.match(source, /transitionAsset\(reserved, "quarantined"/);
  assert.match(source, /normalizeLegacyAudit\(draft\.auditEvent/);
  assert.match(source, /normalizeLegacyAudit\(submitted\.auditEvent/);
});
