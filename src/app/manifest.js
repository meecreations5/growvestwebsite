export default function manifest() {
  return {
    name: "GrowVest — Your Conscious Wealth Partner",
    short_name: "GrowVest",
    description: "Fulfill Your Bucket List. Experience the Wealth Every Moment.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0B0B0F",
    theme_color: "#1F4ED8",
    orientation: "portrait-primary",
    categories: ["finance", "business", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
