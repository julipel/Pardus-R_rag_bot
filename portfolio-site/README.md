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
  components/    # UI and sections
  data/          # projects, analysis, profile
  lib/           # SEO helpers
```

## Documentation

- [REPOSITORY_ANALYSIS.md](./REPOSITORY_ANALYSIS.md) — full Russian analysis report

## Tech

- Next.js 15 (App Router, static export)
- TypeScript
- Tailwind CSS 4
- SEO: metadata, JSON-LD, sitemap.xml, robots.txt
