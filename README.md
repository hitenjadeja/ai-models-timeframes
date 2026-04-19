# AI Models Timeline

An interactive visual timeline of AI model releases from major providers, spanning 2020 through 2026.

**Live demo:** https://hitenjadeja.github.io/ai-models-timeframes/

## What it shows

- Release dates for frontier and notable models from OpenAI, Anthropic, Google DeepMind, Meta, Mistral, xAI, Alibaba, DeepSeek, and many more
- Colour-coded by provider with a clickable legend for filtering
- Zoomable and pannable timeline built with [vis-timeline](https://visjs.github.io/vis-timeline/)
- A dark, gradient UI designed to work well projected or on a big screen

The underlying data is compiled from public announcements, provider release notes, and product pages.

## Update cadence

Updated roughly monthly as new models ship. The most recent update is always reflected in the latest commit on `main`.

## Run locally

No build step. Just open the file:

```bash
open index.html
```

Or serve it over a local HTTP server if you prefer:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Fork and host your own copy

GitHub Pages will serve this straight from your fork:

1. Fork this repo on GitHub
2. In your fork, go to **Settings → Pages**
3. Under *Build and deployment*, set **Source** to `Deploy from a branch`, select the `main` branch and `/ (root)` folder, then Save
4. After a minute your copy will be live at `https://<your-username>.github.io/ai-models-timeframes/`

## Update the data yourself

The timeline data lives as a JavaScript array inside `index.html`. There are two ways to refresh it:

**Manual edit.** Open `index.html`, find the `items` array near the bottom of the `<script>` block, and add, edit, or remove entries. Each entry uses the shape `{ id, content, start, group }` where `group` corresponds to a provider. Commit and push; GitHub Pages will redeploy automatically.

**With Claude Code.** This repo ships with a custom skill at `.claude/skills/update-models/SKILL.md`. Inside Claude Code, run `/update-models` and it will guide you through researching recent releases across providers and producing a clean commit.

## Contributing

Pull requests are welcome for corrections, newly released models, UI polish, or accessibility improvements. Please keep entries factual and cite your source in the PR description (official announcement, release notes, or product page).

## License

[MIT](./LICENSE)
