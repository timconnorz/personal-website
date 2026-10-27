// Run with `npm test` (node's built-in runner; Node 22.6+ strips the TS types).
import { test } from "node:test";
import assert from "node:assert/strict";
import { runChecks, envCheck, listmonkCheck } from "../lib/health.ts";

const fullEnv = {
  LISTMONK_URL: "https://listmonk.example",
  LISTMONK_USERNAME: "u",
  LISTMONK_PASSWORD: "p",
  NEWSLETTER_LIST_ID: "3",
};
const okFetch = async () => Response.json({ data: true });
const SECRET = "postgres://admin:hunter2@db.internal:5432/prod";
const quiet = (t) => t.mock.method(console, "error", () => {});

test("healthy: 200 with no errors", async () => {
  const res = await runChecks([envCheck(fullEnv), listmonkCheck(fullEnv, okFetch)]);
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { errors: [] });
});

test("missing env var: 503 naming the var, never its value", async () => {
  const env = { ...fullEnv, LISTMONK_PASSWORD: undefined };
  const res = await runChecks([envCheck(env), listmonkCheck(env, okFetch)]);
  assert.equal(res.status, 503);
  assert.deepEqual(res.body, { errors: ["env: LISTMONK_PASSWORD missing"] });
});

test("listmonk rejects credentials: 503 auth rejected", async () => {
  const res = await runChecks([listmonkCheck(fullEnv, async () => new Response("", { status: 401 }))]);
  assert.equal(res.status, 503);
  assert.deepEqual(res.body, { errors: ["listmonk: auth rejected"] });
});

test("listmonk 500: 503 unhealthy response", async (t) => {
  quiet(t);
  const res = await runChecks([listmonkCheck(fullEnv, async () => new Response(SECRET, { status: 500 }))]);
  assert.deepEqual(res.body, { errors: ["listmonk: unhealthy response"] });
});

test("hanging dependency times out without blocking the response", async () => {
  const start = Date.now();
  const res = await runChecks([["listmonk", () => new Promise(() => {})], envCheck(fullEnv)], 50);
  assert.ok(Date.now() - start < 1000);
  assert.deepEqual(res.body, { errors: ["listmonk: timeout after 50ms"] });
});

test("leak: a thrown secret never reaches the response", async (t) => {
  const logged = quiet(t);
  const res = await runChecks([["db", async () => { throw new Error(SECRET); }]]);
  const body = JSON.stringify(res.body);
  for (const s of ["hunter2", "admin", "db.internal", "5432"]) assert.ok(!body.includes(s), s);
  assert.equal(res.status, 503);
  assert.deepEqual(res.body, { errors: ["db: check failed"] });
  assert.equal(logged.mock.callCount(), 1); // still logged server-side
});

test("leak: a fetch error carrying a secret becomes a fixed string", async (t) => {
  quiet(t);
  const res = await runChecks([listmonkCheck(fullEnv, async () => { throw new TypeError(SECRET); })]);
  const body = JSON.stringify(res.body);
  for (const s of ["hunter2", "admin", "db.internal", "5432"]) assert.ok(!body.includes(s), s);
  assert.deepEqual(res.body, { errors: ["listmonk: unreachable"] });
});
