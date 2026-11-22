---
title: "SourceDeck"
description: "A personal project that follows public accounts, collects every new photo and video once, and delivers it to where creators work"
date: 2026-11-10
draft: false
ptype: "Product"
showToc: true
tags: ["Web-App", "Python", "Security", "Threat-Modeling", "Automation", "Product"]
categories: ["Product"]
cover:
  image: "/images/sourcedeck.png"
  alt: "SourceDeck"
  caption: "every source you follow, in one place"
  relative: false
---

> **Stop checking ten apps for footage.**

**[SourceDeck](https://sourcedeck.pages.dev/)** is a personal project I built to show how I design, run and secure a real product end to end. It is not a business: no real payments are taken, and checkout runs on Stripe's test mode only. It follows the public accounts your videos depend on, collects every new photo, clip and story the moment it is posted, and delivers it to where you work: team channels, cloud folders, or signed webhooks on your own servers. Sorted by source, never duplicated, ready for your edit.

It is designed for news and explainer channels, nature and documentary editors, social media teams, and researchers and archivists. It collects 25K to 30K new photos and videos a day.

Try the live sandbox (no sign-up, simulated accounts): **[sourcedeck.pages.dev/try](https://sourcedeck.pages.dev/try/)**

Full engineering case study: **[How SourceDeck is built](https://sourcedeck.pages.dev/engineering/)**

{{<seperator>}}

## What it does

- **Follow sources.** Add public profiles or channels, pick stories, posts, videos or all three, and choose how far back to start.
- **Collect once.** Sources are checked around the clock within each platform's limits, and every item is stored exactly once (keyed by its platform ID) in the best available quality.
- **One library.** Search and filter by source, topic, type or day, download originals in one click, and save collections per project.
- **Deliver anywhere.** Route each source or topic to a channel, folder or webhook. Duplicates are skipped, quiet hours are respected, failed deliveries are retried, and every delivery is logged.
- **Your brand on every post.** Build captions from parts like source name, date and links, and add a watermark to outgoing media.
- **Room for the team.** Shared workspaces with Owner, Admin, Editor and Viewer roles.

![SourceDeck](/images/sourcedeck.png#center)

{{<dots>}}

## How it is built

Three constraints shaped every decision: correctness over cleverness (a creator on a deadline needs each item exactly once, on time, and duplicates and gaps are both failures), security from day one, and keeping it small enough for one person to run.

Work flows through a pipeline where every hop is a row in a durable queue, so a restart resumes exactly where it stopped:

1. **Collectors** check each source and hand new items to the core.
2. **The core** runs the durable job queue, deduplicates by item ID, and enforces plan limits.
3. **The pacer** delivers each item to every matching destination while respecting each destination's rate limits, with backoff.
4. **A self-healing residential "station"** runs a full browser for pages that need one. It dials out over SSH and opens no inbound ports.

**Stack:** Python 3.12 with asyncio, aiohttp for the dashboard and API, SQLite in WAL mode, systemd services, Caddy for TLS, and Playwright for browser-based collection. Checkout uses Stripe in test mode only; no real payments are taken.

{{<dots>}}

## Security first

I threat modeled SourceDeck with STRIDE and mapped every threat to a concrete control:

- **Sign-in:** passkeys on every plan, a 12+ character password check, and a lockout after 5 failed tries.
- **Sessions:** hashed session tokens, SameSite cookies, and a strict CSP.
- **Exactly-once payments:** payment webhooks are signature checked, and processed event IDs are recorded inside a database transaction, so a replayed payment event changes nothing.
- **SSRF protection:** webhook destinations must be HTTPS, and private address ranges are refused.
- **Data at rest:** sensitive fields are encrypted with AES-256-GCM, with nightly backups.
- **Operator access:** operator sessions need a fresh passkey every 12 hours, suspensions need two people, and the operator audit log is hash chained so tampering is visible.

{{<dots>}}

## What I would do next

Being honest about the gaps is part of the design. Next on the list: anchor the audit chain outside the server, re-check webhook IPs at send time (to close DNS rebinding), lock the station's SSH key to a single command, measure real SLOs, and encrypt backups.

The engineering page also includes an interactive, sample-data replica of the dashboard and operator console that runs right in your browser: **[try it here](https://sourcedeck.pages.dev/engineering/)**.

{{<seperator>}}
