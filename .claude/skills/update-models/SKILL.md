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

Launch **parallel research agents** using the Task tool (subagent_type: "general-purpose", model: "sonnet", max_turns: 30) — one per provider. Using Sonnet 4.6 gives each agent a 1M token context window for thorough research. Each agent should perform **multiple targeted searches** to ensure thorough coverage.

### Critical: Incremental file output (prevents data loss)

Before launching agents, create the output directory:
```bash
mkdir -p /tmp/models-research
```

Each agent **MUST write findings to its output file after every search** — not just at the end. This ensures no data is lost if the agent hits its context limit or turn limit.

**Every agent prompt MUST include these instructions:**

> **OUTPUT RULES (NON-NEGOTIABLE):**
> 1. Your output file is `/tmp/models-research/<provider>.md`
> 2. After EACH search, immediately append any new models found to your output file using the Write tool
> 3. Use this format in the file — one model per line:
>    ```
>    | Model Name | YYYY-MM-DD | Key Detail | Source URL |
>    ```
> 4. Start the file with a markdown table header: `| Model | Date | Details | Source |` and `|---|---|---|---|`
> 5. At the top of the file, keep a status line: `STATUS: IN PROGRESS` (update to `STATUS: COMPLETE` when done)
> 6. Write to the file FREQUENTLY — after every 1-2 searches. Do not batch all writes to the end.
> 7. If you are running low on context or turns, immediately write everything you have and mark status as `STATUS: PARTIAL - ran out of context`

### Agent instructions template

For each provider agent, instruct it to:
1. Search for the provider's **main model line** releases — **write findings to file**
2. Search separately for **specialized variants** (coding models, reasoning modes, vision/multimodal, speed/efficiency variants) — **write findings to file**
3. Search for the provider's **model release notes or changelog page** and extract dates — **write findings to file**
4. Cross-reference with a general search like `"<provider> AI model releases <year>"` for anything missed — **write findings to file**
5. Update status to COMPLETE when done

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

**Zhipu / Z.ai agent** — Search for:
- GLM series (ChatGLM, GLM-4, GLM-4.5, GLM-4.7, GLM-5, etc.)
- Specialized variants (Vision, Air, coding-focused models)
- Check zhipuai.cn, docs.z.ai/release-notes, and github.com/zai-org

**Microsoft agent** — Search for:
- Phi series (Phi-3, Phi-3.5, Phi-4, Phi-4-mini, Phi-5, etc.)
- All size variants (mini, small, medium) and specialized (multimodal, reasoning)
- Check azure.microsoft.com/en-us/blog and techcommunity.microsoft.com

**Moonshot agent** — Search for:
- Kimi series (Kimi k1.5, Kimi k2, etc.)
- Check kimi.moonshot.cn and moonshotai.com

**Cohere agent** — Search for:
- Command series (Command R, Command R+, Command A, Command R7B, etc.)
- Embed and Rerank model updates
- Check cohere.com/blog and docs.cohere.com/changelog

**Amazon agent** — Search for:
- Nova series (Nova Micro, Nova Lite, Nova Pro, Nova Premier, etc.)
- Titan models
- Check aws.amazon.com/bedrock and aws.amazon.com/blogs/aws

**ByteDance agent** — Search for:
- Doubao series (Doubao-1.5-pro, Doubao-1.5-thinking, Doubao-Seed, etc.)
- Check volcengine.com and bytedance AI announcements

**MiniMax agent** — Search for:
- MiniMax-Text series (MiniMax-Text-01, MiniMax-M1, etc.)
- Speech and multimodal models
- Check minimaxi.com and github.com/MiniMax-AI

**Other providers agent** — Search for:
- AI21 (Jamba), Stability AI, EleutherAI
- Any significant new entrants or open-source models making headlines
- Search `"notable AI model releases <year>"` to catch anything missed

## Step 3: Compile & Deduplicate

After all agents return, read all output files from `/tmp/models-research/`:
1. Read each provider's `.md` file from `/tmp/models-research/`
2. Check the STATUS line — note any agents that are `PARTIAL` (their results may be incomplete, flag for manual review)
3. Collect all discovered models into a single list
4. Cross-reference against existing entries in `index.html` to remove duplicates
5. Filter out unreleased/rumored models — only include publicly released ones

## Step 4: Verification Round

Run one final verification agent (subagent_type: "general-purpose", model: "sonnet", max_turns: 20) to search for:
- `"AI model releases <current month> <current year>"` and `"AI model releases <previous month> <current year>"`
- `"new AI models this week"` or `"latest AI model launches"`
- Check llm-stats.com, artificialanalysis.ai, or similar aggregator sites

This agent MUST write findings to `/tmp/models-research/verification.md` using the same incremental format as other agents.

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
| Zhipu | `zhipu` |
| Microsoft | `microsoft` |
| Moonshot | `moonshot` |
| Cohere | `cohere` |
| Amazon | `amazon` |
| ByteDance | `bytedance` |
| MiniMax | `minimax` |
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
