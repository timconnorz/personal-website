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

// Read-only Listmonk calls that mirror what addSubscriber needs:
//   1. GET /api/health: Listmonk is up, can reach its database, and accepts our credentials.
//   2. GET /api/lists/:id: the newsletter list exists and the API user can see it.
//   3. GET /api/subscribers?per_page=1: the API user has subscriber access. Only the
//      status is used; the subscriber data is never read or returned.
// 2 and 3 only run once 1 passes, so bad credentials are reported once, as "auth rejected".
export function listmonkCheck(env: Env = process.env, fetchImpl: typeof fetch = fetch): Check {
  return ["listmonk", async () => {
    const { LISTMONK_URL, LISTMONK_USERNAME, LISTMONK_PASSWORD, NEWSLETTER_LIST_ID } = env;
    // Missing config is already reported by the env check.
    if (!LISTMONK_URL || !LISTMONK_USERNAME || !LISTMONK_PASSWORD) return;

    const get = async (path: string) => {
      try {
        return await fetchImpl(`${LISTMONK_URL}${path}`, {
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
    };
    const unhealthy = (res: Response) => {
      console.error(`health check "listmonk" got unhealthy response, status ${res.status}`);
      return "unhealthy response";
    };

    const health = await get("/api/health");
    if (health.status === 401 || health.status === 403) throw new HealthError("auth rejected");
    const data = health.ok ? await health.json().catch(() => null) : null;
    if (data?.data !== true) throw new HealthError(unhealthy(health));

    const [list, subscribers] = await Promise.all([
      NEWSLETTER_LIST_ID ? get(`/api/lists/${encodeURIComponent(NEWSLETTER_LIST_ID)}`) : null,
      get("/api/subscribers?per_page=1"),
    ]);
    const problems: string[] = [];
    if (list && !list.ok) {
      if (list.status === 400 || list.status === 404) problems.push("newsletter list not found");
      else if (list.status === 403) problems.push("no permission to read newsletter list");
      else problems.push(unhealthy(list));
    }
    if (!subscribers.ok) {
      if (subscribers.status === 403) problems.push("no permission to read subscribers");
      else problems.push(unhealthy(subscribers));
    }
    if (problems.length) throw new HealthError(problems.filter((p, i) => problems.indexOf(p) === i).join("; "));
  }];
}

export function getHealth(): Promise<HealthResult> {
  return runChecks([envCheck(), listmonkCheck()]);
}
