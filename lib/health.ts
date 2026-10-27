// Health checks for GET /health, polled daily by the project monitor.
//
// The response is public. Only a HealthError's message reaches it, and every
// HealthError message is a literal written in this file (plus numbers we compute
// or names of missing env vars). Anything else a check throws is logged
// server-side and reported as "<name>: check failed".
//
// Kept free of Next.js and local imports so it can be tested with plain `node --test`.

export class HealthError extends Error {}

export type Check = [name: string, run: () => Promise<void>];
export type HealthResult = { status: number; body: { errors: string[] } };

export const TIMEOUT_MS = 3000;

// The newsletter signup (app/actions.ts addSubscriber) can't work without these.
// The Textbelt vars are left out on purpose: the SMS to Tim is fire-and-forget
// and never affects visitors.
export const REQUIRED_ENV = [
  "LISTMONK_URL",
  "LISTMONK_USERNAME",
  "LISTMONK_PASSWORD",
  "NEWSLETTER_LIST_ID",
];

type Env = Record<string, string | undefined>;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new HealthError(`timeout after ${ms}ms`)), ms);
  });
  return Promise.race([p, timeout]).finally(() => clearTimeout(timer));
}

export async function runChecks(checks: Check[], timeoutMs = TIMEOUT_MS): Promise<HealthResult> {
  const results = await Promise.allSettled(
    checks.map(([, run]) => withTimeout(Promise.resolve().then(run), timeoutMs)),
  );
  const errors = results.flatMap((r, i) => {
    if (r.status === "fulfilled") return [];
    const name = checks[i][0];
    if (r.reason instanceof HealthError) return [`${name}: ${r.reason.message}`];
    console.error(`health check "${name}" failed`, r.reason); // Railway logs only
    return [`${name}: check failed`];
  });
  return { status: errors.length ? 503 : 200, body: { errors } };
}

export function envCheck(env: Env = process.env): Check {
  return ["env", async () => {
    const missing = REQUIRED_ENV.filter((k) => !env[k]);
    if (missing.length) throw new HealthError(`${missing.join(", ")} missing`);
  }];
}

// GET /api/health is Listmonk's own read-only health endpoint; it also confirms
// Listmonk can reach its database and that our credentials are accepted.
export function listmonkCheck(env: Env = process.env, fetchImpl: typeof fetch = fetch): Check {
  return ["listmonk", async () => {
    const { LISTMONK_URL, LISTMONK_USERNAME, LISTMONK_PASSWORD } = env;
    // Missing config is already reported by the env check.
    if (!LISTMONK_URL || !LISTMONK_USERNAME || !LISTMONK_PASSWORD) return;

    let res: Response;
    try {
      res = await fetchImpl(`${LISTMONK_URL}/api/health`, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${LISTMONK_USERNAME}:${LISTMONK_PASSWORD}`).toString("base64")}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (err) {
      console.error('health check "listmonk" request failed', err);
      throw new HealthError("unreachable");
    }

    if (res.status === 401 || res.status === 403) throw new HealthError("auth rejected");
    const data = res.ok ? await res.json().catch(() => null) : null;
    if (data?.data !== true) {
      console.error(`health check "listmonk" got unhealthy response, status ${res.status}`);
      throw new HealthError("unhealthy response");
    }
  }];
}

export function getHealth(): Promise<HealthResult> {
  return runChecks([envCheck(), listmonkCheck()]);
}
