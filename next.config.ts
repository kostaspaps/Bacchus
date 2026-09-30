import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 430, 640, 768, 1024, 1280, 1440, 1728, 2048],
  },
  poweredByHeader: false,
  async redirects() {
    // 301s from the legacy PHP site (see docs/MIGRATION.md)
    return [
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/photos.php", destination: "/#gallery", permanent: true },
      { source: "/contact.php", destination: "/#find", permanent: true },
      { source: "/menu.html", destination: "/#menu", permanent: true },
      { source: "/menu.php", destination: "/#menu", permanent: true },
      { source: "/images/Food/17.JPG", destination: "/images/heritage/dimitris-and-yana-early-years.jpg", permanent: true },
      { source: "/images/Food/:path*", destination: "/#gallery", permanent: true },
      { source: "/images/Restaurant/:path*", destination: "/#gallery", permanent: true },
      { source: "/images/bacchus.png", destination: "/images/heritage/bacchus_logo.png", permanent: true },
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
