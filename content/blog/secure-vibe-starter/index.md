---
title: "Secure Vibe Coding in 2026: The Files, Prompts and Rules of Use and Research"
description: "How to run agentic engineering in 2026 without shipping the next breach. Exact files, prompts, and rules — organized by stage."
date: 2026-05-03
draft: false
tags: ["Cybersecurity", "Vibe Coding", "AI Security", "Supply Chain", "Claude Code", "Cursor", "Security", "Agentic Engineering", "MCP", "OWASP"]
categories: ["Security", "AI", "Development"]
showToc: true
---

{{< figure src="/images/blog/blog-secure-vibe-coding/hero.png" alt="Secure Vibe Coding 2026" caption=" " align="center" >}}

> _"For every 10 working features your AI ships, roughly 9 are exploitable."_
> — CMU Research, 2025

## Overview

AI is getting better and making apps is easier than ever but Security isn't following the same flow.

**Secure Vibe Coding** is the future but still when you do normal change in code? Bad flow? Feature update? and it breaks somewhere or introduce novel vulnerability or completely new attack surface. It happens to me on my side gigs and projects and certainly happened to you lot more time in the production lifecycle.

You prompted to Cursor/Claude Code. It made an architecture which **_looks_** flawless. You passed that check and deployed it. After few commits or PR merge, one value gets changed and core logic or database is exposed and someone can bypass the subscription paywall. (this is very bad happened to me recently :/) Or even maybe your agent started deleting things on its own, [Replit agent that nuked the production database even after being explicitly told to freeze changes](https://news.ycombinator.com/item?id=44632270) or [OpenClaw clearing inbox folder](https://medium.com/@dingzhanjun/analyzing-the-incident-of-openclaw-deleting-emails-a-technical-deep-dive-56e50028637b)!

The thing is, AI knows what SQLi and XSS is, it knows RLS (Row Level Security), it considers everything but it just doesn't apply it consistently. It has way more info than one person could have about everything but nobody mentions which policy has to work where, which is why the half vibe coded app still leaking user's data by tweaking User ID with RLS turned on.

This post is about fixes and research I have been doing. This is for _"How to run agentic engineering in 2026 without shipping the next breach"_. I divided this in 3 stages/tiers. Choose the tier which matches your current needs.

- **[Tier 1](#tier-1-personal-projects-mvps)**: Personal projects, MVPs, weekend builds
- **[Tier 2](#tier-2-real-users-real-database-but-at-small-scale)**: Launched for real users, real database, but still at small scale
- **[Tier 3](#tier-3-mid-size-production-agents-with-tools-and-dozens-of-teammates-on-vcs)**: Mid size production scale, agents with tools, dozens of team shipping daily on VCS

> Every file I talk about here, put them in root of your project, your agent will pick it up. (at least work safely for tier 1 category, rest you need to modify according to your needs but concept remains same)

## How Actually These Files Work

- **Cursor** reads `.cursorrules` and `AGENTS.md` automatically
- **Claude Code** reads `CLAUDE.md` automatically + anything in `.claude/`
- **Windsurf** reads `.windsurfrules`
- **GitHub Copilot** reads `.github/copilot-instructions.md`
- **Codex CLI** reads agent definitions from `~/.codex/agents/` (global) or `.codex/agents/` (project)

{{< figure src="/images/blog/blog-secure-vibe-coding/file-setup.png" alt="Project root showing files next to package.json" caption="Every file goes in the root of your project" align="center" >}}

{{< dots >}}

## Tier 1: Personal Projects, MVPs

This is for people who builds something randomly or creating MVPs for their product, or college projects. Many things will be basic here but I have seen many people who are not much into security or not updated they still tend to skip things or they just don't know as many things happening everyday. (Especially this will be helpful for you, [AJ](https://www.aadityasinhjadeja.com/).)

These 9 things and you are already making your MVP lot more secure.

### 1. Drop `CLAUDE.md` in Your Project Root

This is really the most important thing in the post. Seriously. Keep it under 200 lines (for better context window and also longer files gets ignored! Many people have reported this in the Claude community).

What you don't know is, wrap critical sections in `<important>` tags so it survives context compaction.

You will find this file [here](https://github.com/spbavarva/secure-vibe-starter/blob/main/Tier-1/CLAUDE.md). All files are available in [this GitHub repo](https://github.com/spbavarva/secure-vibe-starter).

{{< figure src="/images/blog/blog-secure-vibe-coding/claude-md.png" alt="sample CLAUDE.md file" caption="sample CLAUDE.md file" align="center" >}}

The dependency block is most important! That will save you from many supply chain attacks. You get saved from it in the prompt layer.

### 2. Use Plan Mode Before Every Feature. Always

Most people use it at starting of project, even me, and then stop using it when implementing new feature or making huge change.

It's simple math. If a feature has 20 decisions to make and agent is 80% accurate per decision then end-to-end accuracy is 1.15%. It is really simple thing that will save lot of tokens and you can review every code changes it will be going to do. My workflow now:

```markdown
1. Enter plan mode
2. Type: "I want to add [feature]. Read CLAUDE.md and the relevant files.
   Ask me 3-5 clarifying questions about edge cases and security before
   proposing a plan."
3. Answer the questions
4. Get the plan, edit it inline if needed
5. Exit plan mode, let it implement
```

### 3. Create `.gitignore` Before the First Commit

If LLM forgot to create it before committing then it will be in git history. Also don't forget to include `.claude/sessions/` or `.codex/sessions/` as they contain other chats metadata and check your LLM `.claude/settings` file as well. (I got a bug through it on open source since LLM was auto accepting edits even on default mode)

Sample `.gitignore` file [here](https://github.com/spbavarva/secure-vibe-starter/blob/main/Tier-1/sample.gitignore).

### 4. Use Managed Auth From Starting

Pick anyone: Auth0, Clerk, Supabase Auth, Lucia, Firebase Auth. But tell agent _"Use Auth0 for authentication. Protect all routes with server middleware. No client-side auth check and no custom JWT."_

You may not believe but there are many breaches because of this. Enrichlead was totally shutdown in 2 days because of it. Few examples:

- Enrichlead — March 2025 (Source: [Reddit](https://www.reddit.com/r/ProgrammerHumor/comments/1jdfhlo/securityjustinterfereswithvibes/))
- Base44 — July 2025 (Source: [WIZ](https://www.wiz.io/blog/critical-vulnerability-base44))
- Tea app breach — July 2025 (Source: [Hacker News](https://news.ycombinator.com/item?id=44716529))
- Cursor CurXecute / MCPoison — August 2025 (Source: [Tenable](https://www.tenable.com/blog/faq-cve-2025-54135-cve-2025-54136-vulnerabilities-in-cursor-curxecute-mcpoison))
- Loveable exposure — April 2026 (Source: [Loveable.dev](https://lovable.dev/blog/our-response-to-the-april-2026-incident))

### 5. Create Sample `.env.example` as Template Before Committing

If the AI pastes a key directly in code, catch it immediately and tell it to move it. The `CLAUDE.md` rules make this rare, but it still slips through.

Sample file [here](https://github.com/spbavarva/secure-vibe-starter/blob/main/Tier-1/.env.example).

### 6. Private by Default Deploys

Vercel, Netlify, Supabase, Railway: They all have a "preview deployments are private" option. (I got to know about this recently)

Also: no `console.log(user)` or `console.log(session)` in production. If your style is to debug via logging, then don't forget to remove it.

### 7. A Self-Review System

Use new LLM (Preferably **GPT 5.5 — xhigh**) or at least new session for this:

```markdown
Now act as a Senior Security Engineer reviewing the code written by commit history.
Be adversarial. Don't reassure me. Check for:
1. Injection (SQL, XSS, command, prompt, etc)
2. Auth/authorization bypasses (especially client-side checks)
3. Secrets exposure (logs, errors, env-like vars hitting the client)
4. Missing input validation
5. Insecure defaults (open CORS, no rate limit, wildcard permissions)
6. Hallucinated dependencies (verify each new import exists on npm/PyPI)

For each finding: file, line, severity, fix. No reassurance.
```

### 8. CAPTCHA

[Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/). It's free and invisible with just one tag. Put on every public form. It will save your future Cloud bills.

It's really powerful against headless browsers and especially scrapers. (That's why I hate them too!)

### 9. Verify the Package Exists Before You Install It

This is why supply chain attacks are affecting a lot and slopsquatting is eating a lot of people in 2026. LLMs still sometimes invent package names which are not popular enough. It auto installs attacker controlled npm/PyPI.

January 2026 `react-codeshift` : [Aikido security research](https://www.aikido.dev/blog/agent-skills-spreading-hallucinated-npx-commands)
A hallucinated npm package called `react-codeshift` spread to 237 repos through AI-generated agent skill files. Nobody made it on purpose. The AI invented the name, somebody could have registered it, and every agent that read those skills would have installed it.

{{< figure src="/images/blog/blog-secure-vibe-coding/tier2-banner.png" alt="Secure by Design" caption=" " align="center" >}}

{{< dots >}}

## Tier 2: Real Users, Real Database, but at Small Scale

You have made some progress and launched it for the real world and now you have Postgres, Stripe and real traffic on your Analytics. (50–100 paying users maybe)

Now you need proper architecture and threat modelling in your code. I came up with these additional 10 methods on top of 9 previous methods for this tier.

**Things get real from here!**

### 1. Write Planning Files BEFORE LLM Writes Code

Just planning mode isn't sufficient now. We need solid files to provide context and save tokens as well. More you let your model guess, more hallucination and security risk it will have. I have come up with 4 files architecture for this with additional bonus file:

- `PRD.md` — what you are building and why
- `ARCHITECTURE.md` — DFD flow, stacks, components, and how they connect
- `DATA_MODEL.md` — your all tables, relations, RLS policies
- `THREAT_MODEL.md` — what you are protecting and from whom

And add them in your `CLAUDE.md` / `AGENTS.md` so it will read them every time before new session. (you have to play smart here, try to make these files as much by yourself so it will have only required things)

You will find all files on this GitHub repo, [here](https://github.com/spbavarva/secure-vibe-starter/tree/main/Tier-2/planning-files).

{{< figure src="/images/blog/blog-secure-vibe-coding/threat-model.png" alt="sample THREAT_MODEL.md file" caption="sample THREAT_MODEL.md file" align="center" >}}

Threat model file is most important to protect from breaches because Indirect prompt injection hit 84% success rates against Cursor and Copilot in [Liu et al.'s November 2025](https://aclanthology.org/2025.emnlp-main.372/) study and you are (mostly) protected from it, thanks to that file. The MCP STDIO issue is a whole storm covered in Tier 3.

**BONUS — Indexes of Functions (IOF)**

I noticed one more thing which is useful: **Indexes of Functions**.

Idea is simple. You have a bit mature codebase now and thousands of LOC and your agent burns more tokens when reading a file. Simple fix: create [a small .md](https://github.com/spbavarva/secure-vibe-starter/blob/main/Tier-2/planning-files/BONUS.md) for every big source file next to it, listing every function with its parameters and one-line purpose. So `db.py` gets `db.md` and `api.py` gets `api.md`.

You will consume more tokens to generate them, but you can use local LLMs or a cheap model for this (I don't consider Gemini 3.1 Pro as SOTA model, it's just stupidly dumb and slow). That's it. And add in your `CLAUDE.md` file that _"read `bot.md` to find what you are looking from `bot.py` when adding feature related to it."_

{{< figure src="/images/blog/blog-secure-vibe-coding/bonus-db-md.png" alt="sample bonus file — database.py as db.md" caption="sample bonus file — database.py as db.md" align="center" >}}

### 2. Have RLS From Day One and Then Break It

Every Supabase tutorial says to turn on RLS, which becomes new normal for small architecture. But do you know the policy has to actually work? AI knows it, but we need to tell them!

```markdown
You are now User B with the anon key and a valid session.
User A has rows you should NOT be able to read.
Try to read them. List every query, header, and parameter you'd use.
Then fix the RLS to make those queries return nothing.
Then try again as User B and confirm.
```

[Reya Vir](https://medium.com/towards-artificial-intelligence/why-early-commitment-helps-ai-solve-structured-problems-d9dd63d9e04d) did a great job to highlight this problem with her own methods. She says _"Coding agents are optimized to eliminate errors, not understand them."_ Which means, if a "Permission Denied" error fires during a DB query, the agent will happily resolve it by setting the policy to `USING (true)`. And this above prompt will catch that exactly.

### 3. Rate Limit on the Backend!

Please never do rate limit on the frontend. It's a security theater. AI is smart enough to implement it on the backend but you need to tell! Otherwise depending upon your other memory with LLM and your way of working, for easiness it can use frontend rate limiting.

I am not going into much technicality here why backend rate limiting is superior, you maybe need to use `express-rate-limit` only for that. Read [this Reddit post](https://www.reddit.com/r/webdev/comments/1q0ysat/advice_on_secure_ecommerce_development_frontend/) comments and OP's question for more.

### 4. Sensitive API Calls Go Through Your Backend. Always

Stripe, SendGrid, OpenAI, Anthropic, Twilio — backend only. The agent _MAY_ suggest a "convenient" frontend fetch with the key in a meta tag. It's never convenient. It's a $900 bill.

### 5. Move Secrets From `.env` to Real Vault

Now having `.env` is not ideal as you have real users and data. [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/), [GCP Secret Manager](https://cloud.google.com/security/products/secret-manager), [Doppler](https://www.doppler.com/), [Infisical](https://infisical.com/) all have vault to handle secrets. Any one would cost less than a $20 LLM plan.

### 6. Security Agent

Now we need a dedicated security agent to review the codebase regularly. Create `.claude/agents/security-reviewer.md`.

You can find this file [here](https://github.com/spbavarva/secure-vibe-starter/blob/main/Tier-2/agents/security-reviewer.md).

{{< figure src="/images/blog/blog-secure-vibe-coding/security-reviewer.png" alt="sample security-reviewer.md file" caption="sample security-reviewer.md file" align="center" >}}

Then in your session: _"Use the security-reviewer subagent to review my last commit."_ It cannot write. It only reports and can say NO. This is the basic helper-model pattern at the file system level.

### 7. Block Sketchy Installs at the Hook Layer

Now we need to be careful with how our LLM's `settings.json` file is written. Sample file is [here](https://github.com/spbavarva/secure-vibe-starter/blob/main/Tier-2/block-sketchy-install/settings.json).

{{< figure src="/images/blog/blog-secure-vibe-coding/settings-json.png" alt="sample LLM settings.json" caption="sample LLM settings.json" align="center" >}}

Basic idea is, it will block any package install until you confirm it. LLM cannot decide to skip them. The deny entries for `--no-verify` and `-n` matters really — it was found as a real bypass in [Claude Code GH issue March 2026](https://github.com/anthropics/claude-code/issues/40117).

### 8. Pre-Commit Hooks for Secrets and Obvious Vulns

These packages should be there when you start building. (optional but recommended)

```bash
brew install gitleaks
pip install pre-commit
pre-commit install
```

And `.pre-commit-config.yaml` which you will find [here](https://github.com/spbavarva/secure-vibe-starter/blob/main/Tier-2/pre-commit/.pre-commit-config.yaml) on the GitHub repo.

{{< figure src="/images/blog/blog-secure-vibe-coding/pre-commit.png" alt="sample .pre-commit-config.yaml" caption="sample .pre-commit-config.yaml" align="center" >}}

### 9. Security Scan in CI on Every PR

A security workflow must be there on your GitHub. I am just giving a simple file with Snyk, SBOM, and Semgrep but you should customize according to your requirements.

Sample file can be found [here](https://github.com/spbavarva/secure-vibe-starter/blob/main/Tier-2/workflow/security.yaml).

{{< figure src="/images/blog/blog-secure-vibe-coding/security-yaml.png" alt="sample security.yaml" caption="sample security.yaml" align="center" >}}

### 10. Reset Context

This should be a no brainer and after Opus 4.7 managing context window is a real struggle. It eats a lot more tokens to compact and then accuracy would drop as context window grows. And since you have the above files already, you don't need to provide context from beginning in every new session.

{{< dots >}}

## Tier 3: Mid-Size Production, Agents With Tools, and Dozens of Teammates on VCS

You need to be very careful here if you are using AI for your code now because things can go wrong very fast. You shouldn't do vibe coding a feature randomly. With my research I came up with 10 ways to make your **Vibe Coding, SECURE**.

### 1. JIT Permissions for Every Agent

Just like normal user accounts, we will treat agents/subagents the same. No long-lived service accounts with `role:admin` (you don't have any real unused service account right? 👀)

We will strictly follow RBAC at least. Agents must be scoped to exactly the resources and operations they need with ephemeral tokens via AWS STS, GCP short-lived tokens, GitHub fine-grained PATs.

### 2. Run the Security Agent in the CI, Not Just Locally

The Tier 2 security reviewer agent was working on your machine, but in Tier 3 it runs in the CI pipeline on every PR. Pair it with the code reviewer agent (for correctness) and the docs reviewer agent (for consistency). These three agents running in parallel and reading all of your PR with their own context should make your PR code safe before merging it.

### 3. Human in the Loop

Before you do any actions related to: deletes, payments, permission changes, customer-facing sends, or production deploys, the LLM should draft a summary, and then you validate it. The [Replit incident](https://news.ycombinator.com/item?id=44632270) happened because there was no human in the loop.

### 4. Policy-as-Code (PaC)

Use [**OPA**](https://www.openpolicyagent.org/) or [**Cedar**](https://cedarpolicy.com/en) like VCS, which are reviewable and it tells _"This agent can call this tool only when these conditions hold."_

### 5. Scan IaC in CI on Every Terraform/K8s Change

You most likely would be doing this, I hope! But still you need to be more careful because supply chain attacks didn't leave [Trivy — March 2026](https://www.paloaltonetworks.com/blog/cloud-security/trivy-supply-chain-attack/) as well.

Block the merge on `privileged: true`, `0.0.0.0/0`, `Action: "*"`, missing `aws_s3_bucket_public_access_block`, and the rest. The agent has seen these in training data thousands of times.

### 6. MCP vs CLI — Better Approach

As we know MCP is going down on the hype and it's not that useful because it basically gets context of every tool on the first run and you burn on the context window. That's where [Corsair](https://corsair.dev/mcp-vs-cli) study and their own method comes into picture.

The fundamental solution they are providing is calling only required tools by their own way. I don't have any affiliations with them but the idea is really nice to implement and that really does consume a lot less tokens and context window.

### 7. MCP Servers — Read This Carefully

In April 2026, [OX Security disclosed](https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/) a design-level command injection across Anthropic's official MCP SDKs in Python, TypeScript, Java, and Rust. Roughly 200,000 vulnerable instances were affected. Cursor, Windsurf, Claude Code, Gemini-CLI, GitHub Copilot — all were affected through their MCP JSON config. [Windsurf CVE-2026-30615](https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/) is a 0-click: open a public repo with a malicious MCP config and get RCE.

If your stack uses an MCP server, do all of this (**HIGHLY RECOMMENDED**):

- **Disable STDIO MCP servers if you don't need them.**
- **If you must use STDIO, allowlist commands by absolute path.** Don't accept relative paths or `env` wrappers.
- **Never install MCP servers from public marketplaces without review.**
- **Sandbox every MCP server in a container.** Read-only filesystem except the working dir. No outbound network except an allowlist.
- **Patch list:** LiteLLM ([CVE-2026-30623](https://docs.litellm.ai/blog/mcp-stdio-command-injection-april-2026)), Flowise ([CVE-2026-40933](https://www.sentinelone.com/vulnerability-database/cve-2026-40933/)), Cursor ([CVE-2026-30615](https://venturebeat.com/security/mcp-stdio-flaw-200000-ai-agent-servers-exposed-ox-security-audit)), Windsurf ([CVE-2026-30615](https://venturebeat.com/security/mcp-stdio-flaw-200000-ai-agent-servers-exposed-ox-security-audit)), Agent Zero ([CVE-2026-30624](https://venturebeat.com/security/mcp-stdio-flaw-200000-ai-agent-servers-exposed-ox-security-audit)). Update or isolate.
- **Audit every MCP tool invocation.**

### 8. Serve Security Context Through a Hardened MCP Server

Simple conceptual sketch:

```typescript
// security-context-server.ts
// Run in a sandboxed container. HTTP transport only. Auth required.
// No STDIO. No marketplace. Internal use only.

server.tool("get_threat_model", async () => {
  return readFile("./THREAT_MODEL.md");
});

server.tool("check_dependency", async ({ name, version }) => {
  return await verifyPackage(name, version);
  // Calls Socket.dev / Snyk / npm registry
});

server.tool("validate_iac", async ({ file }) => {
  return await scanIaC(file);  // tfsec / Checkov in a sandbox
});

server.tool("get_rls_pattern", async ({ table }) => {
  return getRLSTemplate(table);
});
```

The reasoning is that agent pulls security context on demand and rules live outside the context window. HTTP+auth and not STDIO, sandboxed and logged.

### 9. Cost Cap Per Agent Session

Set max token per session, max tool calls per session, max thinking cap. [Claude Code session budget](https://code.claude.com/docs/en/costs) settings and [code intelligence plugins](https://code.claude.com/docs/en/discover-plugins#code-intelligence) — use these things and with your own workflow decide how much tokens and $ to spend.

### 10. Audit Log Every Agent Action

Make a dedicated audit DB for all your agent calls. It will help tremendously when something goes wrong. It's simple and very effective.

{{< dots >}}

## Final Thoughts

This is my research on what I was studying in the last month — finding the core root causes of recent supply chain attacks, tracking the majority of them, and finding how we can get protected against them while using AI.

The _"vibe coding is dead"_ takes are mostly right. What's left is agentic engineering, which is actually better because you write the specs, the agent executes, and you review and ship it. You'll ship a much more mature tool this way, developed fast and more feature-rich.

But that won't work if you skip the basic parts. You need to adopt: planning mode, threat modeling, security agent review, context reset, verifying the dependency, blocking the install hook bypasses, auditing and logging the MCP calls.

Try to do this on your every project, starting with Tier 1. That will develop your muscle memory, and you will be more secure as a developer.

You can find all files of this post in this GitHub repo: [**secure-vibe-starter**](https://github.com/spbavarva/secure-vibe-starter)
Leave it a star, create an issue or discuss directly with me if you have any more suggestions.

Also published on [Medium](https://medium.com/@snehbavarva/secure-vibe-coding-in-2026-the-files-prompts-and-rules-of-use-and-research-e821021ee908).

{{<seperator>}}