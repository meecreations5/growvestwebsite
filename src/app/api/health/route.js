export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      status: "ok",
      service: "growvest-public-website",
      release: process.env.NEXT_PUBLIC_APP_VERSION || "23.0.0",
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" },
    },
  );
}
