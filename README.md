# Banapana

A publication about the effects of media on minds, live at [banapana.com](https://banapana.com).

## What It Is

Banapana is a long-running study of how media shapes cognition, culture, and behavior. Articles cover attention, persuasion, platform dynamics, information ecosystems, and the slow rewiring of how people think.

The system is a flat-file CMS with a natural language interface. Articles are written in Markdown with YAML frontmatter and stored in a folder synced from [iA Writer](https://ia.writer). An agent handles publishing: it reads the folder, promotes ready articles into the site's route structure, builds a static site, and deploys.

## How It Works

Content lives in the `content/` directory (a symlink to an iA Writer cloud folder). Each article is a folder containing `article.md` and any associated media. An article is ready to publish when its `Published:` date is in the past or its `Status:` is `published`.

On sync, the agent:
- Copies `article.md` to `src/routes/[year]/[month]/[slug]/+page.svx`
- Copies referenced images to a `media/` subfolder in the route
- Builds the static site (including sitemap and RSS feed)
- Deploys via FTP to banapana.com

## Article Frontmatter

```yaml
Title: 'Article Title'
Subtitle: 'Optional subtitle'
Summary: 'Brief description for RSS and previews'
Tags: #tag1, #tag2
Created: 2026-01-27
Published: 2026-02-12
Status: published
Cover: media/cover.jpg
```

- `Status: published` or a `Published:` date in the past triggers sync
- `Created:` is used as the publication date if `Published:` is not set
- Folders prefixed with `_` are treated as drafts and ignored

## Commands

```bash
# Start dev server (http://localhost:2222)
npm run dev

# Sync content from iA Writer to routes
npm run sync

# Build static site (includes sitemap + RSS)
npm run build

# Deploy to banapana.com
npm run deploy

# Full pipeline: sync + build + deploy
npm run sync:deploy
```

## Environment

Create a `.env` file with FTP credentials:

```
FTP_USER=your-ftp-username
FTP_PASSWORD=your-ftp-password
```

## Stack

- [SvelteKit](https://kit.svelte.dev) — static site framework
- [MDsveX](https://mdsvex.pngwn.io) — Markdown + Svelte in `.svx` files
- [iA Writer](https://ia.writer) — writing environment, synced via cloud folder
- FTP deploy via [basic-ftp](https://github.com/patrickjuchli/basic-ftp)
