# Portfolio Site — Julia Plavinsky (@julipel)

Premium dark-theme portfolio built with **Next.js 15**, **TypeScript**, and **Tailwind CSS v4**.

Includes GitHub repository analysis, project showcase, and commercial case studies.

## Quick start

```bash
cd portfolio-site
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (static export → `out/`) |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

## Static export (GitHub Pages)

```bash
npm run build
# Deploy the `out/` directory
```

Set `NEXT_PUBLIC_SITE_URL` to your deployed URL for correct sitemap and Open Graph URLs.

## Structure

```
src/
  app/           # App Router pages, sitemap, robots
  components/    # UI, sections, ArchitectureDiagram
  data/          # projects, analysis, profile, expertise, process
  lib/           # SEO helpers
```

## Homepage sections

1. **Hero** — positioning, stats, CTA
2. **Expertise** — focus areas + tech matrix
3. **Analysis** — GitHub maturity ranking
4. **Projects** — filterable grid (category + maturity)
5. **Commercial** — 5 B2B case studies
6. **Evolution** — PEr07 → RAG--ChromaDB- story
7. **Process** — Discovery → MVP → Deploy → Metrics
8. **Contact** — GitHub, email, Telegram

## Documentation

- [REPOSITORY_ANALYSIS.md](./REPOSITORY_ANALYSIS.md) — full Russian analysis report

## Tech

- Next.js 15 (App Router, static export)
- TypeScript
- Tailwind CSS 4
- SEO: metadata, JSON-LD, sitemap.xml, robots.txt
