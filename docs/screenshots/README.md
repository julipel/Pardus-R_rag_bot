# Screenshots for portfolio

This folder holds **visual assets** for [PORTFOLIO.md](../../PORTFOLIO.md). SVG placeholders ship with the repo so GitHub renders a complete case study before you add real captures.

## Replace placeholders with PNG (recommended)

| # | Placeholder (committed) | Replace with | What to capture |
|---|-------------------------|--------------|-----------------|
| 1 | `01-hero-overview.svg` | `01-hero-overview.png` | Architecture slide, or split: Telegram + terminal + folder tree |
| 2 | `02-telegram-help.svg` | `02-telegram-help.png` | `/start` and `/help` in Telegram |
| 3 | `03-telegram-qa.svg` | `03-telegram-qa.png` | User question + RAG answer (e.g. technical params or safety) |
| 4 | `04-console-interactive.svg` | `04-console-interactive.png` | `python main.py` → mode `1`, one full Q&A with retrieval logs |
| 5 | `05-console-stats.svg` | `05-console-stats.png` | Console `stats` output |
| 6 | `06-logs-export.svg` | `06-logs-export.png` | Telegram `/logs` CSV file or Excel view of export |

After adding PNGs, update [PORTFOLIO.md](../../PORTFOLIO.md) image paths from `.svg` to `.png` (or keep both and prefer PNG in markdown).

## Capture tips

- **Resolution:** 1280×720 or 1440×900; crop UI chrome if needed.  
- **Privacy:** Redact API keys, real user IDs, and phone numbers.  
- **Telegram:** Use a test bot and test chat; BotFather token must not appear.  
- **Console:** Dark or light theme — stay consistent across all shots.  
- **Format:** PNG for UI; SVG only for diagrams you draw yourself.

## Quick commands to generate content for screenshots

```bash
source .venv/bin/activate
python main.py
# Mode 1: ask "Какие технические параметры у аппарата Пардус-Р?"
# Type: stats
# Type: logs
```

```bash
# Telegram: run mode 3 with TELEGRAM_BOT_TOKEN set
# Send /start, /help, then a product question
```

## Optional: video demo

For LinkedIn or portfolio sites, record a 30–60 s screen capture:

1. Demo mode (`2`) or one Telegram Q&A  
2. Show cache hit on repeated question  
3. Show `/stats` or `stats` output  

Store under `docs/screenshots/demo.mp4` (add to `.gitignore` if file is large).
