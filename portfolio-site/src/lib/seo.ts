import type { Metadata } from "next";
import { profile } from "@/data/profile";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://julipel.github.io/portfolio";

export const siteConfig = {
  name: `${profile.name} — AI Portfolio`,
  url: siteUrl,
  description: profile.tagline,
  ogImage: `${siteUrl}/og-image.png`,
  author: profile.name,
  github: profile.github,
} as const;

export function createPageMetadata({
  title,
  description,
  path = "",
}: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${profile.name}` : siteConfig.name;
  const desc = description ?? siteConfig.description;
  const url = `${siteConfig.url}${path}`;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url,
      title: fullTitle,
      description: desc,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    keywords: [
      "AI engineer",
      "RAG",
      "ChromaDB",
      "Telegram bot",
      "n8n automation",
      "LLM",
      profile.name,
    ],
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: siteConfig.url,
    sameAs: [profile.github],
    jobTitle: profile.title,
    knowsAbout: profile.focusAreas,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: { "@type": "Person", name: profile.name },
  };
}
