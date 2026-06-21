---
title: "Source Code Review Challenges"
description: "Hands-on secure-code-review challenges built from real, public vulnerabilities across many languages and stacks"
date: 2026-06-18
draft: false
showToc: true
tags: ["Secure-Code-Review", "Vulnerabilities", "CVE", "Supply-Chain", "DevSecOps", "Python", "TypeScript", "Java"]
categories: ["Security"]
---

**Source Code Review Challenges** is a growing set of hands-on secure-code-review exercises I build from real, public vulnerabilities. Each one is a small, realistic mini-app with a single planted bug, drawn from HackerOne / Bugcrowd reports, published CVEs, or well-known incidents. The goal is to practice reading code for vulnerabilities the way you would in a real review or interview, across languages and modern stacks, not just one comfort zone.

🔗 [github.com/spbavarva/source-code-review-challenges](https://github.com/spbavarva/source-code-review-challenges)

{{<seperator>}}

## Why I built it

Most "vuln practice" is exploit-first: you get a running target and a payload. Code review is the opposite skill: you have the source and have to spot the bug before anything is exploited. That is what a real secure-code-review or a security-engineering interview tests, and there are not many good challenge sets for it that span more than one language.

So I started building my own, roughly one challenge at a time, each grounded in a real disclosure so the lesson is genuine and verifiable. Every challenge links back to the public vulnerability it is based on.

{{<dots>}}

## How each challenge is packaged

- **README** with a realistic scenario (and a spoiler note), so you know what app you are reviewing.
- **The review target** (`app/` or `src/`), a small fake app that contains exactly one bug.
- **A Dockerized PoC harness** (`simulate/`), so you can spin it up and prove the finding, payload-centric, not exfil theater.
- **A plain `solution.md`** with root cause, proof of concept, and remediation, kept short and easy to read.

A few principles I hold to: one single bug per challenge (no piling on), solutions written plainly, and coverage that spans languages and stacks rather than staying in Python or JS.

{{<dots>}}

## The challenges so far

| # | Vulnerability | Stack | Grounded in |
|---|---|---|---|
| 01 | TOCTOU race condition | Python / FastAPI | classic time-of-check-to-time-of-use |
| 02 | React2Shell RSC deserialization | Next.js / TypeScript | CVE-2025-55182 |
| 03 | CI/CD pwn-request (Actions secrets exfil) | GitHub Actions YAML | s1ngularity / Nx, CVE-2025-10894 |
| 04 | npm dependency confusion | Node / `.npmrc` | Shai-Hulud / TeamPCP worm |
| 05 | Unsafe YAML deserialization | Python / Flask | Docling CVE-2026-24009, MS-SWIFT CVE-2025-50460 |
| 06 | JWT signature not verified | Java | pac4j-jwt CVE-2026-29000 (CVSS 10.0) |

The set leans into timely, under-served review surfaces, supply-chain and CI/CD config, IaC, and auth glue, because that is exactly the reviewable code where modern incidents actually happen.

{{<dots>}}

## How to use it

Clone the repo, pick a challenge, and read `app/` (or `src/`) cold. Try to find the single bug and write down root cause plus a fix before opening `solution.md`. When you want to confirm it, the `simulate/` harness runs the proof in Docker. Contributions are welcome.

{{<seperator>}}
