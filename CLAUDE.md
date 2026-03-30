# Contentkeeper

## Content Sync System Design

### Technical Stack

- HTML 4.0
- CSS 3
- Javascript (stick to Vanilla)
- Svelte 5
- markdown
- MDSVEX

#### Important Git note
Use appropriate https://gitmoji.dev git emoji when creating git commits.

### Overview

An agent-driven content management system that syncs articles from an IA Writer cloud folder to Svelte routes, builds statically, and deploys via FTP. The agent should be capable of doing secondary things as well, such creating a sitemap.xml for the site as well as an rss feed.

### Route Structure

```
src/routes/[year]/[month]/[slug]/+page.svx
```

Example: `src/routes/2026/02/the-contentkeeper/+page.svx`

### Content Flow

1. **Source**: IA Writer folder (symlinked at `content/`)
   1.2. Each article is contained in a folder that is the article name converted into a slug. Each article folder contains article.md as it’s main file, along with media that might be called and other formats for publication.
2. **Filter**: Ignore folders starting with `_` (drafts)
3. **Publish criteria**: `Published:` date in frontmatter is in the past
4. **On sync**:
   - Move folder (remove `_` prefix if present)
   - Copy `article.md` → `+page.svx`
   - Associated images are images cited in the article.md file with the pattern `![image caption](image_url.jpg|image.png)`. Copy any associated media to a `media/` subfolder in the route folder.
   - Image urls in the article.md file may
   - Update `Modified:` date in front matter

### Agent Capabilities

- **Manual trigger**: User asks agent to sync
- **Scheduled**: Cron runs Thursdays at 9am
- **Build**: Run `npm run build` after sync
- **Deploy**: FTP static output to banapana.com

### Frontmatter Schema for article.md files

```yaml
Title: 'The Contentkeeper'
Subtitle: 'Agentic Content Management'
Author: R.E. Warner
Summary: 'AI agents are fundamentally changing...'
Section: It's Thinking
Column: --
Tags: #CMS, #content, #blog, #AI
Created: 2026-01-27
Modified: 2026-02-11
Published: 2026-02-12
Status: draft
```

Notes on frontmatter fields: 
- `Title`: The main title of the article (required) [text]
- `Subtitle`: A brief subtitle or tagline (optional) [text]
- `Author`: The author's name (required) [default: R.E. Warner]
- `Summary`: A short summary or abstract (optional) [maximum 250 characters]
- `Section`: One of six sections to which the article belongs [Fabertising | It's Thinking | Social Butterfly | Made You Look | Meme Safari | Mind Control | Banapana] [default: Banapana]
- `Column`: The column to which the article belongs (optional) [text|--]
- `Tags`: A comma-separated list of hashtags for the article
- `Created`: The date the article was created [YYYY-MM-DD]
- `Modified`: The date the article was last modified [YYYY-MM-DD]
- `Published`: The date the article was published (optional) [YYYY-MM-DD]
- `Status`: The status of the article [pitch | draft | ready | published]

### Components

1. **Sync script** — Reads content, converts to routes
2. **Cron config** — Thursday 9am + manual
3. **FTP deploy** — Upload build output

## Usage

### Commands

```bash
# Sync content from IA Writer to routes
npm run sync

# Build the static site (includes sitemap and RSS generation)
npm run build

# Deploy to banapana.com (requires FTP credentials)
FTP_USER=your-username FTP_PASSWORD=your-password npm run deploy

# Full pipeline: sync + build + deploy
FTP_USER=your-username FTP_PASSWORD=your-password npm run sync:deploy
```

### Cron Setup (Thursdays at 9am)

```bash
# Edit crontab
crontab -e

# Add this line:
0 9 * * 5 cd /path/to/banapana && FTP_USER=xxx FTP_PASSWORD=xxx npm run cron
```

### Environment Variables

Create a `.env` file (add to `.gitignore`):

```
FTP_USER=your-ftp-username
FTP_PASSWORD=your-ftp-password
```

Then run deploy without passing variables:

```bash
npm run sync:deploy
```

### Article Frontmatter

Articles in `content/` should have this frontmatter. Use double quotes for fields with punctuation:

```yaml
---
Title: [title] (no quotes)
Subtitle: [subtitle] (no quotes)
Author: [name] (default: R. E. Warner)
Summary: [250 characters]
Section: [section name] ( Made You Look | Mind Control | Meme Safari | Social Butterfly | It’s Thinking | Fabertising | defaults: Banapana)
Column: [column title]
Tags: [#hastag list]
Created: YYYY-MM-DD
Modified: YYYY-MM-DD
Status: [status] (pitch | draft | ready| published)
---
```

- `Status: published` OR `Published:` date in the past = article gets synced
- `Status: draft` or folder starting with `_` = ignored
- `Created:` is used as publication date if `Published:` is not set
- Fields with colons, quotes, or special characters should be wrapped in double quotes
