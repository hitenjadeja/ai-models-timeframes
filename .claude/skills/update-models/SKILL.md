---
name: update-models
description: Research recent AI model releases and update the timeline data in index.html
---

# Update AI Models Timeline

Research the latest AI model releases and update `index.html` with any missing models. Use agent teams to parallelize research across providers.

## Step 1: Read Current Data

Read `index.html` and extract all existing model entries from the `vis.DataSet` items array. For each provider, note:
- The **latest entry date** so you know where to start searching
- The **highest existing `id`** value so new entries use incrementing IDs
- Any gaps in the timeline (e.g., missing minor versions between major ones)

## Step 2: Research New Releases (Agent Teams)

Launch **parallel research agents** using the Task tool (subagent_type: "general-purpose") — one per provider. Each agent should perform **multiple targeted searches** to ensure thorough coverage.

### Agent instructions template

For each provider agent, instruct it to:
1. Search for the provider's **main model line** releases
2. Search separately for **specialized variants** (coding models, reasoning modes, vision/multimodal, speed/efficiency variants)
3. Search for the provider's **model release notes or changelog page** and extract dates
4. Cross-reference with a general search like `"<provider> AI model releases <year>"` for anything missed
5. Return a structured list of models found with: name, release date, key detail, and source URL

### Provider-specific search guidance

Launch these agents in parallel:

**OpenAI agent** — Search for:
- GPT series (GPT-4o, GPT-4.1, GPT-5, GPT-5.1, GPT-5.2, GPT-5.3, etc.)
- GPT mini/nano variants (GPT-4o mini, GPT-4.1 mini/nano, etc.)
- o-series reasoning models (o1, o3, o4, etc. and their mini/pro variants)
- **Codex models** (GPT-5.1-Codex, GPT-5.2-Codex, GPT-5.3-Codex, Codex-Max, Codex-Spark, etc.)
- Check openai.com/index and help.openai.com model release notes

**Anthropic agent** — Search for:
- Claude major versions (Claude 3, 3.5, 3.7, 4, 4.5, 4.6, 5, etc.)
- All tier variants (Opus, Sonnet, Haiku) for each version
- Check anthropic.com/news and platform.claude.com/docs/release-notes

**Google agent** — Search for:
- Gemini numbered releases (2.0, 2.5, 3.0, etc.)
- All variants: Pro, Flash, Flash-Lite, Ultra, Nano
- **Specialized modes**: Deep Think, Deep Research, and any other named reasoning/research modes released as distinct models
- Check ai.google.dev/gemini-api/docs/changelog and blog.google

**Meta agent** — Search for:
- Llama versions (3, 3.1, 3.2, 3.3, 4, etc.)
- All size variants and specialized releases (Scout, Maverick, Behemoth)
- Check ai.meta.com/blog

**Mistral agent** — Search for:
- Mistral numbered models (Small, Medium, Large, and version numbers)
- Mixtral MoE models
- **Codestral** coding models (25.01, 25.08, etc.)
- Ministral series (edge/small models)
- Check mistral.ai/news and docs.mistral.ai/getting-started/models

**xAI agent** — Search for:
- Grok versions (3, 3 mini, 4, 4 Heavy, 4 Fast, 4.1, 5, etc.)
- Check x.ai/news and docs.x.ai/developers/release-notes

**DeepSeek agent** — Search for:
- DeepSeek V-series (V3, V3 0324, V3.1, V3.2, V3.2-Exp, V4, etc.)
- DeepSeek R-series reasoning models (R1, R2, etc.)
- **Specialized variants** (Speciale, Terminus, Coder, etc.)
- Check api-docs.deepseek.com/updates

**Alibaba agent** — Search for:
- Qwen numbered versions (2.5, 3, 3.5, etc.)
- API-only models (Qwen-Max, Qwen3-Max, Qwen3-Max-Thinking, etc.)
- Specialized: Qwen-Coder, Qwen-VL (vision), Qwen-Omni
- Check qwen.ai and github.com/QwenLM

**Other providers agent** — Search for:
- Cohere (Command R/R+), AI21 (Jamba), Stability AI, EleutherAI
- Any significant new entrants or open-source models making headlines
- Search `"notable AI model releases <year>"` to catch anything missed

## Step 3: Compile & Deduplicate

After all agents return:
1. Collect all discovered models into a single list
2. Cross-reference against existing entries in `index.html` to remove duplicates
3. Filter out unreleased/rumored models — only include publicly released ones

## Step 4: Verification Round

Run one final verification agent to search for:
- `"AI model releases <current month> <current year>"` and `"AI model releases <previous month> <current year>"`
- `"new AI models this week"` or `"latest AI model launches"`
- Check llm-stats.com, artificialanalysis.ai, or similar aggregator sites

This catches very recent releases that provider-specific searches might miss.

## Step 5: Update index.html

For each new model found, add an entry to the `items` DataSet array in `index.html` following this exact format:

```javascript
{ id: <next_id>, content: '<Model Name>', start: 'YYYY-MM-DD', group: '<group_id>', className: '<group_id>', title: '<Model Name> (<key detail>)\\n<Month Day, Year>' },
```

### Group IDs and ClassNames

| Provider | group / className |
|----------|------------------|
| OpenAI | `openai` |
| Anthropic | `anthropic` |
| Google | `google` |
| Meta | `meta` |
| Mistral | `mistral` |
| xAI | `xai` |
| DeepSeek | `deepseek` |
| Alibaba | `alibaba` |
| Other | `other` |

### Rules

- Use the **public release/announcement date** (not leak or rumor dates)
- `content` should be the short model name (e.g., "GPT-4o", "Claude 3.5 Sonnet")
- `title` is the tooltip: model name with key detail on first line, date on second line, separated by `\\n`
- Key details in parentheses: parameter count, context window, "Open source", "Reasoning", "MoE", "Agentic coding", etc.
- Keep entries sorted chronologically within each provider's comment block
- If a new provider needs adding, also add it to the `groups` DataSet, the CSS classes, and the legend HTML
- Increment IDs from the current maximum
- Include **specialized/variant models** if they represent a distinct release (e.g., Codex, Deep Think, Fast variants) — don't skip them just because a base model already exists

## Step 6: Update Footer

Update the "Last updated" date in the `<footer>` to the current month and year.

## Step 7: Update Timeline Range

If new models extend beyond the current `end` date in the timeline options, update `end` and `max` to accommodate them (keep ~3 months padding after the latest entry).

## Step 8: Summary

Report:
- **Added**: List of all new models added with dates and providers
- **Already present**: Models that were already in the timeline
- **Skipped (not yet released)**: Models found but not added because they're unconfirmed/unreleased
- **Uncertain**: Models where the date or details were unclear, with source URLs
