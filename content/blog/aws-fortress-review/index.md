---
title: "AWS Fortress - Hack The Box Review"
description: "fairly easy exam if you follow just one resource..."
date: 2025-06-20
draft: false
tags: ["AWS", "Cloud", "Cloudsec", "Certification", "CloudSec", "Cloud Security", "HTB", "Fortress", "Reverse Engineering", "OWASP"]
categories: ["HTB", "Cloud"]
showToc: true
---

{{< figure src="/images/blog/blog-6-AWS-fortress/aws-fortress.png" alt="AWS Fortress" caption=" " align="center" >}}

> _“Persistence is the payload that always executes.”_

## Why I decided this?

So I am active in [season 8 of HTB](https://app.hackthebox.com/competitive/8/overview) for the first time and while exploring I reach to the Hacker rank, ([my HTB Profile](https://app.hackthebox.com/profile/1143652)), and [HTB Fortresses](https://app.hackthebox.com/fortresses) are unlocked at this rank. I was just exploring and I saw there's a fortress by created by AWS and as I have some cloud background, thought it would be good to test my Cloud Security skills, [official ariticle by HTB](https://www.hackthebox.com/blog/amazon-web-services-fortress).

And also it has only 10 flags so my guess was that it won't be as hard as [Sorcery: Linux Insane](https://app.hackthebox.com/machines/665) of this season! (and actually that one was more tough than this whole fortress lol). It took me roughly 4-5 days for this to solve. Cool so enough talk about background, let me tell you my review on it.

## Initial Thoughts

As it was hosted on HTB, I knew that it will be CTF style thing like their other boxes. But not all flags was like that, in fact some of them are actually like vulnerabilities which is common at some point but as I progress with more flags, it was getting CTF styled.

### Pre-requisites

- Basic understanding of AWS services (IAM, Lambda, DynamoDB, SQS)
- Strong understanding of OWASP Top 10!
- Intermediate familiarity with AWS CLI and Python scripting
- Binary analysis and debugging skills
- Strong recon/FUZZing skill

## My Experince

I was able to complete it within 3-4 days as doing it for 5-6 hours/day and completing AWS Fortress felt very relieved and I get to test my penetration testing techniques, including enumeration, OWASP exploitation, privilege escalation, and reverse engineering. Each challenge required careful attention to detail and encouraged using diverse tools and techniques.

But still I didn't felt that I get to learn more about Cloud Pentesting, which was my expectation.

### The Good

- **Some realistic scenarios**: Some tasks mimic real-world security flaws in AWS environments, including common misconfigurations.

- **Variety of Vulnerabilities**: Indeed it covers a wide range of vulnerabilities, including web application flaws, AWS IAM misconfigurations, SQS, Lambda (etc) exploitation, and binary reversing.

- **Structured Learning Path**: Each step progressively increases in complexity, and need you to FUZZ more and more.

- **Hands-on AWS Experience**: Practical exposure to AWS CLI, services like Lambda, DynamoDB, IAM, SQS, and more.

### The Bad

- Not a lot of AWS things as expected to be.

- **Guesswork**: Some solutions were not intuitively discoverable without nudges from community forums or external help.

- **Lack of Clear Guidance**: Certain tasks were dependent on deep technical assumptions, requiring substantial trial and error.

### What to Look for When Solving

**Enumerate thoroughly**: Domains, services, and potential vulnerable endpoints. Just ENUM!!
**Inspect code**: Hidden credentials and tokens often reside here.
**Leverage internal servers**: OWASP things
**AWS CLI Commands**: Familiarity with commands like aws sts get-caller-identity, aws s3api, and aws lambda invoke will greatly assist.
**Binary Analysis**: Using tools such as Ghidra, IDA, strings, and ltrace for reversing and analyzing binaries.

## Who is it for?

AWS Fortress is ideal for intermediate to advanced cybersecurity practitioners, particularly those with an interest in:
- Pentesters
- Addicted to HTB content, haha
- Cybersecurity enthusiasts looking for mixture of penetration testing skills and Web testing.
- Security researchers and SOC analysts aiming to understand AWS misconfigurations

### Additional Recommendations

- Try to make automation scripts as whenever you think you have to repeat things, it will save a lot of time!
- Of course, document each step meticulously. Organization helps significantly when backtracking.
- Combine manual inspection with automated enumeration tools for efficient vulnerability discovery.
- Engage with the community forums for subtle hints but strive to solve challenges independently for maximum learning.


## What's next?

{{< figure src="/images/blog/blog-6-AWS-fortress/chill.gif" alt="Simple GIF" caption=" " align="center" >}}

It was really fun one and indeed I completed AWS fortress and Sorcery in the same week! Really it was insane week but grind doesn't stop here!!

Rasta I am coming there! Feel free to reach out via my [contact](/contact) page, schedule a meeting on Calendly/Topmate, or connect directly on [LinkedIn](https://www.linkedin.com/in/snehbavarva/).

{{<seperator>}}
