import type { MetadataRoute } from "next";
import { publicEvents } from "@/data/public-agenda";
import { loadPublicContents } from "@/lib/public-contents-server";

const baseUrl = "https://ait-mesbah.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publications = await loadPublicContents();
  return [
    ...publications.map(item => ({ url: `${baseUrl}/publications/${item.slug}`, lastModified: item.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...publicEvents.map(event => ({ url: `${baseUrl}/agenda/${event.slug}`, lastModified: event.updatedAt, changeFrequency: "weekly" as const, priority: 0.72 })),
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/village`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${baseUrl}/carte-vivante`, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/decouvrir`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/histoire-memoire/archives/retour-des-champs-1966`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/histoire-memoire/archives/pichet-ait-mesbah-peabody`, changeFrequency: "monthly", priority: 0.65 },
    { url: `${baseUrl}/projets`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${baseUrl}/histoire-memoire`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/amar-imache`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guerre-algerie`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/vivre`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/comite-village`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/jcam`,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/asam`,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/association-imache-amar`,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/agenda`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${baseUrl}/publications`, changeFrequency: "weekly", priority: 0.82 },
    {
      url: `${baseUrl}/agir`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/diaspora`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contribuer`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/confidentialite`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/credits`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
