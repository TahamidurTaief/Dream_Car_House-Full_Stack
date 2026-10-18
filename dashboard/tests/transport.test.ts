import { test } from "node:test";
import assert from "node:assert/strict";
import { requestDashboard } from "../lib/server/transport";
import { validateSafeRedirect, hasPermission, type DashboardUser } from "../lib/server/auth";

const baseOptions = {
  origin: "http://127.0.0.1:8000",
  path: "access/" as const,
  cookie: "sessionid=test-session-id",
  decode: (data: unknown) => (typeof data === "string" ? data : undefined),
};

test("missing credentials or session cookie rejects without fetching", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", () => {
    throw Error("must not fetch");
  });
  const res = await requestDashboard({ ...baseOptions, cookie: undefined, credential: undefined });
  assert.equal(res.ok, false);
  assert.equal(!res.ok && res.error.code, "UNAUTHENTICATED");
  assert.equal(fetch.mock.callCount(), 0);
});

test("transport rejects bad configuration without fetching", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", () => {
    throw Error("must not fetch");
  });
  for (const origin of [undefined, "invalid", "ftp://host", "https://user:password@host", "https://host/api/"]) {
    const result = await requestDashboard({ ...baseOptions, origin });
    assert.equal(!result.ok && result.error.code, "CONFIGURATION");
  }
  assert.equal(fetch.mock.callCount(), 0);
});

test("HTTP errors and status codes normalize safely without leaking backend bodies", async (t) => {
  for (const [status, code] of [
    [401, "UNAUTHENTICATED"],
    [403, "FORBIDDEN"],
    [404, "NOT_FOUND"],
    [429, "THROTTLED"],
    [500, "UNAVAILABLE"],
  ] as const) {
    const mock = t.mock.method(
      globalThis,
      "fetch",
      async () => new Response("private-backend-detail", { status })
    );
    const result = await requestDashboard(baseOptions);
    assert.equal(!result.ok && result.error.code, code);
    assert.equal(JSON.stringify(result).includes("private-backend-detail"), false);
    mock.mock.restore();
  }
});

test("validates envelope and payload at runtime", async (t) => {
  for (const body of ["<html>", '{"success":false}', '{"success":true,"data":12}', "{}"]) {
    const mock = t.mock.method(globalThis, "fetch", async () => new Response(body));
    const result = await requestDashboard(baseOptions);
    assert.equal(!result.ok && result.error.code, "INVALID_RESPONSE");
    mock.mock.restore();
  }
  t.mock.method(globalThis, "fetch", async (_url: string | URL | Request, init?: RequestInit) => {
    assert.equal(init?.cache, "no-store");
    assert.equal(init?.redirect, "error");
    return Response.json({ success: true, data: "validated" });
  });
  assert.deepEqual(await requestDashboard(baseOptions), { ok: true, data: "validated", cookies: [] });
});

test("network failure and timeout are distinct", async (t) => {
  const mock = t.mock.method(globalThis, "fetch", async () => {
    throw Error("private host");
  });
  const result = await requestDashboard(baseOptions);
  assert.equal(!result.ok && result.error.code, "UNAVAILABLE");
  mock.mock.restore();

  t.mock.method(
    globalThis,
    "fetch",
    (_url: string | URL | Request, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new DOMException("aborted", "AbortError"))
        );
      })
  );
  const timeout = await requestDashboard({ ...baseOptions, timeoutMs: 10 });
  assert.equal(!timeout.ok && timeout.error.code, "TIMEOUT");
});

test("validateSafeRedirect prevents open redirects and allows relative paths", () => {
  assert.equal(validateSafeRedirect("/workspace"), "/workspace");
  assert.equal(validateSafeRedirect("/workspace?sort=id"), "/workspace?sort=id");
  assert.equal(validateSafeRedirect("https://evil.com"), "/workspace");
  assert.equal(validateSafeRedirect("//evil.com"), "/workspace");
  assert.equal(validateSafeRedirect("/\\evil.com"), "/workspace");
  assert.equal(validateSafeRedirect(null), "/workspace");
  assert.equal(validateSafeRedirect(undefined), "/workspace");
});

test("hasPermission verifies model permissions and superuser bypass", () => {
  const staffUser: DashboardUser = {
    id: 1,
    username: "staff",
    email: "staff@example.com",
    is_staff: true,
    is_superuser: false,
    permissions: ["inventory.view_inventory"],
  };

  const superUser: DashboardUser = {
    id: 2,
    username: "admin",
    email: "admin@example.com",
    is_staff: true,
    is_superuser: true,
    permissions: [],
  };

  assert.equal(hasPermission(staffUser, "inventory.view_inventory"), true);
  assert.equal(hasPermission(staffUser, "inventory.add_inventory"), false);
  assert.equal(hasPermission(superUser, "inventory.add_inventory"), true);
});
