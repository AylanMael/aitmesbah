export const CRM_RATE_LIMIT_POLICY = Object.freeze({
  backend: "distributed-required",
  unavailable: "fail-closed-for-sensitive-mutations",
  response: Object.freeze({ status: 429, retryAfterHeader: "Retry-After" }),
  key: "HMAC(server-secret, uid-or-normalized-network-key); never store raw identifiers",
  categories: Object.freeze({
    session: { windowSeconds: 60, maximum: 10 },
    accountAndMembershipMutation: { windowSeconds: 60, maximum: 20 },
    upload: { windowSeconds: 300, maximum: 10 },
    download: { windowSeconds: 60, maximum: 60 },
    deletion: { windowSeconds: 300, maximum: 10 },
    auditRead: { windowSeconds: 60, maximum: 30 },
    editorialDecision: { windowSeconds: 60, maximum: 30 },
  }),
});

export const STAGING_RATE_LIMIT_CONTRACT = Object.freeze({
  backend: "distributed-required",
  namespace: "staging-isolated",
  partitionKey: "HMAC(server-secret, uid-or-normalized-network-key)",
  persistRawNetworkAddress: false,
  sensitiveBackendFailure: "fail-closed",
  ordinaryReadBackendFailure: "degrade-only-with-explicit-approved-policy",
  exceeded: Object.freeze({status:429,retryAfterSeconds:{minimum:1,maximum:300}}),
  categories: CRM_RATE_LIMIT_POLICY.categories,
});
