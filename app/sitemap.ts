import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1, alternates: { languages: { en: `${SITE_URL}/`, el: `${SITE_URL}/el` } } },
    { url: `${SITE_URL}/el`, lastModified: now, changeFrequency: "weekly", priority: 0.9, alternates: { languages: { en: `${SITE_URL}/`, el: `${SITE_URL}/el` } } },
    { url: `${SITE_URL}/book`, lastModified: now, changeFrequency: "monthly", priority: 0.9, alternates: { languages: { en: `${SITE_URL}/book`, el: `${SITE_URL}/el/book` } } },
    { url: `${SITE_URL}/el/book`, lastModified: now, changeFrequency: "monthly", priority: 0.8, alternates: { languages: { en: `${SITE_URL}/book`, el: `${SITE_URL}/el/book` } } },
  ];
}
