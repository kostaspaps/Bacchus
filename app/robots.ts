import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api", "/auth"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "anthropic-ai", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"], allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
