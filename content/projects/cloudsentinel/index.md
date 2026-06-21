---
title: "CloudSentinel"
description: "AI-powered AWS security scanner with attack path reasoning"
date: 2026-03-07
draft: false
kind: "Product"
tags: ["AWS", "Security", "AI", "Python", "Claude", "Attack-Path", "Cloud"]
categories: ["automated", "Tool"]
showToc: true
cover:
  image: "/images/cloudsentinel-dashboard.png"
  alt: "CloudSentinel Dashboard"
  caption: "CloudSentinel example"
  relative: false
---



## CloudSentinel

**CloudSentinel** is an AI-powered AWS security scanner that finds misconfigurations and chains them together into real attack paths.
Its like having a pentester review your AWS account, but automated.

Github: [CloudSentinel](https://github.com/spbavarva/CloudSentinel)

{{<seperator>}}

## how I come with this?

So I was working on Cloud Security Project based on AWS for my university project with my friend (R1ZZG0D) and when we were done with it and we have to check it's costs and check the misconfigs at the end for final submission, then we looked at the prowler and other open source tools and, they were like way more than any small company or startup would need.

That's when we decide to create a tool that can do this automatically and efficiently.

## Working of it

### What it is

It is something that reasons about cloud security the way a red teamer would — not just flag issues, but connect the dots.

Most AWS security tools dump a checklist of "this is bad, fix it." CloudSentinel actually thinks about how an attacker would move through your account. It traces paths like `Internet → open SSH on EC2 → IAM role → S3 bucket with customer data` and tells you exactly which link to break first.

### What it's not

- It is not a replacement of prowler.

- It is not a handler of your AWS account and manage your console directly. 

- It is not Cloude Security pentest tool.


## Features

- Scans **4 AWS services**: EC2, S3, IAM, VPC (more coming)
- Real AWS CLI based data collection
- AI-powered analysis using Claude — no generic checklist, actual reasoning
- **Evidence-based attack paths** — every hop in the chain is backed by real scan data
- Severity classification with context (open SSH on a public instance ≠ open SSH on an unattached SG)
- Copy-paste **fix commands** for every finding
- Real-time progress via **Server-Sent Events** (SSE)


{{<seperator>}}


## How It Works

The pipeline is simple:

1. **Scanner** collects raw AWS CLI data for a service (+ minimal cross-service dependency data)
2. **Parser** structures the raw output
3. **Analysis Bridge** builds a prompt with the right service skill file
4. **Claude AI** analyzes everything and returns structured JSON findings + attack paths
5. **Frontend** renders it all in a nice dashboard

{{< figure src="/images/cloudsentinel-architecture.png" alt="CloudSentinel Architecture" caption=" " align="center" >}}

The key thing is the **dependency context**. When scanning EC2, we also grab the IAM roles attached to instances and what those roles can access. This is how we prove attack chains across service boundaries without scanning the entire account.

{{<seperator>}}


## Installation

### Backend

```bash
git clone https://github.com/spbavarva/CloudSentinel.git
cd CloudSentinel
pip install -r requirements.txt
```

### Frontend

```bash
cd cloud-scan-guardian
npm install
```

You also need [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) installed and authenticated. No API key needed — CloudSentinel pipes prompts through the CLI directly.

{{<seperator>}}


## Usage

### Start the API Server

```bash
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
```

### Start the Frontend

```bash
cd cloud-scan-guardian
npm run dev
```

Then open the dashboard, enter your AWS credentials, pick the services you want to scan, and hit scan.

{{< figure src="/images/cloudsentinel-scan-config.png" alt="Scan Configuration" caption=" " align="center" >}}

The frontend streams progress events in real time — you can see exactly what stage the scan is at.

{{< figure src="/images/cloudsentinel-scanning.png" alt="Scanning Progress" caption=" " align="center" >}}

{{<seperator>}}


### CLI Mode

You can also run scans directly from the terminal without the frontend:

```bash
python3 cloudsentinel.py --service ec2 --region us-east-1
```

{{<seperator>}}


## What the Output Looks Like

CloudSentinel returns structured JSON with:
- **Findings** — each misconfiguration with severity, impact, and a real `aws cli` fix command
- **Attack Paths** — multi-step exploitation chains with evidence status (`CONFIRMED` or `INFERRED`) for every hop
- **Narrative** — a short executive summary a busy engineer can read in 5 seconds
- **Quick Wins** — top 3-5 fixes sorted by impact-to-effort ratio

{{< figure src="/images/cloudsentinel-findings.png" alt="Findings View" caption=" " align="center" >}}

{{< figure src="/images/cloudsentinel-attack-path.png" alt="Attack Path View" caption=" " align="center" >}}

Every finding includes the actual resource IDs from your account. No generic "your bucket might be public" — it says exactly which bucket, which policy, and gives you the exact CLI command to fix it.

{{<seperator>}}


## Adding New Services

The architecture is built so anyone can add a new service scanner easily. To add something like RDS:

1. Create `rds_scanner.py` — copy any existing scanner, change the AWS CLI commands
2. Create `rds_skill.md` — write the RDS-specific patterns and severity rules
3. Add `"rds"` to the `SUPPORTED_SERVICES` set in `cloudsentinel.py`
4. That's it. The orchestrator, parser, and AI pipeline all work generically.

The frontend just needs the new service added to the dropdown — the JSON output format is the same across all services.

{{<seperator>}}

## Author

Built by [Sneh aka mystic_mido](https://github.com/spbavarva)
{{<newline>}}
If you like it, give it a star on [GitHub](https://github.com/spbavarva/CloudSentinel)!
