import { getHealth } from "@/lib/health";

// Never prerender or cache: every request must run the checks.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const headers = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const { status, body } = await getHealth();
    return Response.json(body, { status, headers });
  } catch (err) {
    console.error("health endpoint failed", err);
    return Response.json({ errors: ["health: check failed"] }, { status: 503, headers });
  }
}
