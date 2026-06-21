---
title: "0day.digest"
description: "Automated threat-intelligence feed for AI, CVEs, supply-chain attacks, and appsec research"
date: 2026-04-26
draft: false
ptype: "Product"
tags:
  [
    "Threat Intelligence",
    "GitHub Actions",
    "Python",
    "Vulnerability Research",
    "Security Automation",
    "AI Security",
    "AppSec"
  ]
categories: ["automated", "Tool", "Threat Intelligence", "Security Automation"]
showToc: true
cover:
  image: "/images/projects/0day-digest/0day-digest-cover.png"
  alt: "0day.digest project cover"
  caption: "0day.digest"
  relative: false
---

**0day.digest** is my automated threat-intelligence feed for tracking emerging vulnerabilities, CVE disclosures, supply-chain compromises, developer-tooling attacks, attacker infrastructure, and high-signal AI/security research.

Live: [0day.digest](https://spbavarva.github.io/0day.digest/)

Github: [0day.digest](https://github.com/spbavarva/0day.digest)

{{< figure src="/images/projects/0day-digest/0day-digest-cover.png" alt="0day.digest cover" caption="0day.digest threat-intelligence feed" align="center" >}}

{{<seperator>}}

## Why I Built This

Security news moves fast, but most feeds are too noisy to be useful when I am trying to focus on exploitation, appsec testing, cloud security, or detection engineering.

I built **0day.digest** to turn daily security and AI research into a smaller, reviewable signal feed. The goal is simple: collect the important items, filter the noise, and publish short notes that are useful for actual security work.

The site is intentionally not a normal blog. It is closer to a practitioner feed: short posts, source links, severity labels, tags, and occasional longer threat-research writeups.

{{<seperator>}}

## What It Tracks

- Emerging CVEs and actively exploited vulnerabilities
- Supply-chain attacks across npm, PyPI, GitHub Actions, containers, and developer tooling
- AI and LLM security research, including prompt injection, sandbox bypasses, and agentic workflow risks
- Breaches, credential leaks, ransomware activity, and attacker infrastructure
- Application security research that can become useful for testing, exploit analysis, or detection logic
- Cloud and DevSecOps security items with real practitioner impact

{{<seperator>}}

## Publishing Workflow

The main part of this project is the review-gated publishing pipeline.

```text
Curated RSS sources
  -> scripts/fetch_feeds.py
  -> raw feed cache
  -> AI triage prompt
  -> candidate Jekyll drafts
  -> GitHub pull request
  -> human review with checkboxes
  -> selected drafts promoted into _posts
  -> GitHub Pages deploy
```

The automation does not publish blindly. Every digest run creates a pull request first, so I can review the AI-generated drafts, uncheck low-signal items, edit titles or tags, and only then merge.

{{<seperator>}}

## How It Works

### Feed Collection

`scripts/fetch_feeds.py` reads the curated feed list from `rss-sources.md`, fetches recent items, removes already-seen links, deduplicates near-identical headlines, and writes both machine-readable JSON and human-readable Markdown cache files.

### AI Triage

The GitHub Actions workflow runs a triage prompt against the latest raw feed dump. It classifies items as relevant or skippable, assigns severity, chooses tags, and creates candidate Jekyll drafts in the expected front matter format.

### Review Gate

The digest pull request includes checkbox lines for every candidate post. When the PR is merged, `scripts/apply_selections.py` reads the PR body and deletes unchecked drafts before publishing.

### Draft Promotion

`scripts/promote_drafts.py` moves approved drafts into `_posts/`, cleans up digest summary files, and lets the normal GitHub Pages deployment ship the site.

{{<seperator>}}

## Content Model

The site has three main content surfaces:

- **Daily Signal**: short, source-backed threat notes grouped by date.
- **Must-Know**: the highest-priority items, usually critical supply-chain compromises, exploited zero-days, major breaches, or credential leaks.
- **Threat Research**: longer writeups for exploit chains, malware analysis, post-mortems, and deeper application security research.

Every Daily Signal post uses structured metadata:

```yaml
categories: [Daily Signal]
tags: [supply-chain, cve, appsec]
severity: critical | high | medium | informational
must_know: true | false
sources:
  - name: Source Name
    url: https://example.com/article
```

{{<seperator>}}

## Key Features

- **Automated intelligence collection** from curated AI, cybersecurity, threat-research, cloud, and advisory feeds.
- **Deduplication and seen tracking** to prevent the same story from resurfacing every run.
- **AI-assisted triage** that converts raw feed dumps into draft posts with severity, tags, summaries, and source links.
- **Pull-request review gate** for editorial control before anything is published.
- **Checkbox-based selection** so publishing decisions can happen directly from the PR body.
- **Jekyll/GitHub Pages deployment** for a lightweight static site with no backend to maintain.

{{<seperator>}}

## Technical Stack

| Area | Tools |
| ---- | ----- |
| Site | Jekyll, Chirpy theme, GitHub Pages |
| Automation | GitHub Actions |
| Feed ingestion | Python, requests, feedparser |
| Triage | Claude Code CLI, structured prompt workflow |
| Publishing | Pull requests, draft promotion scripts |
| Content | Markdown, YAML front matter, tags, severity metadata |

{{<seperator>}}

## Impact

- Built a repeatable workflow for turning daily threat research into actionable security notes.
- Improved signal quality by keeping AI-generated drafts behind a human review step.
- Created a personal knowledge feed for exploit analysis, appsec testing, threat hunting, and detection engineering.
- Reduced manual tracking effort by centralizing CVEs, supply-chain incidents, AI/security research, and practitioner-relevant advisories in one place.

{{<seperator>}}

## Author

Built by [Sneh aka mystic_mido](https://github.com/spbavarva)

If you find it useful, check out the live feed: [0day.digest](https://spbavarva.github.io/0day.digest/)

{{<seperator>}}
