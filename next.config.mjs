/** @type {import("next").NextConfig} */
const allowIndexing =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  serverExternalPackages: ["firebase-admin"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.growvest.info" }],
        destination: "https://growvest.info/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
      { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
    ];

    if (!allowIndexing) {
      headers.push({ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" });
    }

    return [
      {
        source: "/(.*)",
        headers,
      },
    ];
  },
};

export default nextConfig;
