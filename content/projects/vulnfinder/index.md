---
title: "vulnfinder"
description: "Source-to-sink vulnerability research that runs inside Claude Code"
date: 2026-06-13
draft: false
showToc: true
tags: ["CVE", "AI", "LLM", "Security-Research", "Open-Source", "Claude", "Automation"]
categories: ["Tool", "automated"]
cover:
image: "/images/vulnfinder.png"
alt: "vulnfinder"
caption: "secure the system"
relative: false
---

> **Find the bug devs forgot.**

**[vulnfinder](https://vulnfinderio.github.io)** is source-to-sink vulnerability research packaged as a plugin that runs inside Claude Code. Point it at a repository and it walks a disciplined eight-phase methodology that hunts reportable, non-duplicate, CVSS v4 >= 4.0 bugs, and stops before the noise. It is the same process I have used to land my own CVEs, turned into something anyone can run on their own subscription. **21 assigned CVEs and counting.**

🔗 Site + leaderboard: [vulnfinderio](https://vulnfinderio.github.io)

{{<seperator>}}

## Why I built it

I first built a heavier "cve-hunter" web platform: a Cloudflare Worker, a database, and a desktop companion driving a signed runner protocol. It worked, but it was token-hungry and clunky. A scan of a single-file repo (`jshttp/cookie`) burned roughly half of a Codex quota, because the companion ran each methodology phase as a separate cold model thread with no prompt-cache reuse.

The fix was to stop owning the agent loop. Instead of running my own model, I shipped the methodology as a plugin that rides on the agent you already pay for. The same `jshttp/cookie` run that cost about 48% on the old platform now costs around 5% of a Claude session, one warm cached session instead of eight cold ones.

{{<dots>}}

## The methodology

vulnfinder runs eight phases in one warm session, using native read, search, and git tools:

> **Recon → Architecture → Intent → History + GHSA → Attack surface → Deep analysis → Validation → Report**

It hunts across **eleven vulnerability archetypes** (A through J, plus BOOT), covering things like scope and auth mismatches, unsafe archive handling, and parser bypasses. A calibrated set of rejection patterns keeps findings reportable, so it does not waste a run on by-design behavior, duplicates, or severity inflation.

The output is a structured `report.md` under `reports/<owner>-<repo>/`. Findings are public-only and Medium severity or higher.

{{<dots>}}

## Install and run

**Claude Code (recommended):**

```bash
/plugin marketplace add vulnfinderio/vulnfinder
/plugin install vulnfinder@vulnfinder
```

**One-liner** (wraps the two commands above):

```bash
# macOS / Linux
curl -fsSL https://vulnfinderio.github.io/install.sh | bash

# Windows (PowerShell)
irm https://vulnfinderio.github.io/install.ps1 | iex

# any OS, via npm
npx vulnfinder@latest
```

Restart Claude Code, then point it at any public repo, git URL, or local path:

```bash
/vulnfinder:vulnfinder owner/repo
```

You can also just tell Claude `vulnfinder owner/repo` and the skill loads on its own.

{{<dots>}}

## What is inside

| Path | What |
|---|---|
| `skills/vulnfinder/SKILL.md` | the eight-phase methodology + eleven archetypes |
| `skills/vulnfinder/references/rejection-patterns.md` | the calibration that keeps findings reportable |
| `commands/vulnfinder.md` | `/vulnfinder`, the orchestrator |
| `commands/pre-report-check.md` | `/pre-report-check`, the validation gate |
| `commands/python-web-audit.md` | `/python-web-audit`, Python web deep-dive |
| `tools/ghsa-for-repo.py` | GHSA dedupe checker |

{{<dots>}}

## The flywheel

vulnfinder is more than the plugin. A small backend turns confirmed wins into a public scoreboard:

- **Outcome verification.** Confirmed bugs are auto-detected from GitHub advisory credits after you sign in, with no manual claiming.
- **Peer verification** of findings, plus a researcher leaderboard as the incentive.
- **Cross-platform reach.** A browser workspace and a local Companion app (macOS `.dmg` and Windows `.exe`) sit alongside the CLI plugin.
- **Backend.** A Cloudflare Worker + D1 handles the leaderboard, GitHub OAuth, and an hourly advisory-credit sync. It is hardened with hashed sessions, single-use OAuth state, and constant-time admin checks.

{{<dots>}}

## Track record

**21 accepted bugs** disclosed across multiple projects (vm2, goshs, PraisonAI, Gotenberg, nginx-ui, and others), ranging from Critical (CVSS 10.0) down to Low (CVSS 2.1).

Code is **Apache-2.0**. The methodology content is **CC-BY-4.0**, use it, build on it, keep the attribution.

{{<seperator>}}
