---
title: "Dream Job-1"
date: 2025-03-06
retire_date: 2025-03-06
description: "HTB sherlock"
tags:
  [
    "htb",
    "easy",
    "Dream Job-1",
    "MITRE",
    "TTPs",
    "Incident Response",
    "IR",
    "DFIR",
    "IOCs",
    "VirusTotal",
    "Lazarus Group",
    "sandbox bypass"
  ]
difficulty: "Very Easy"
event: "HackTheBox"
author: "ArthurWho"
cover:
  image: "/images/ctf/htb/dream-job-1.png"
  alt: "Dream Job 1"
  relative: true
---

{{< sherlock-info-shortcode >}}

## What we gain?

- Threat Intelligence
- MITRE ATT&ACK

## Scenario

You are a junior threat intelligence analyst at a Cybersecurity firm. You have been tasked with investigating a Cyber espionage campaign known as Operation Dream Job. The goal is to gather crucial information about this operation.

## Provided artifacts

3 MD5 hashes in form of IOCs

1. 7bb93be636b332d0a142ff11aedb5bf0ff56deabba3aa02520c85bd99258406f
2. adce894e3ce69c9822da57196707c7a15acee11319ccc963b84d83c23c3ea802
3. 0160375e19e606d06f672be6e43f70fa70093d2a30031affd2929a5c446d07c1

## Task 1

_Question: Who conducted Operation Dream Job?_

By reading the sherlock info we can answer this question easily

**Answer**: Lazarus Group

## Task 2

_Question: When was this operation first observed?_

just simple google dorking let us to the MITRE attack website and we can read more about the group and understand their TTPs. Under campaigns we can see "Operation Dream Job" and when it's first seen

[Lazarus Group](https://attack.mitre.org/groups/G0032/)

{{< figure src="/images/ctf/htb/sherlock/campaign.png" alt="campaign" caption=" " align="center" >}}

**Answer**: September 2019

## Task 3

_Question: There are 2 campaigns associated with Operation Dream Job. One is `Operation North Star`, what is the other?_

Just visiting the page can give us this answer

{{< figure src="/images/ctf/htb/sherlock/interception.png" alt="interception" caption=" " align="center" >}}

[Lazarus Campaign](https://attack.mitre.org/groups/G0032/)

**Answer**: Operation Interception

## Task 4

_Question: During Operation Dream Job, there were the two system binaries used for proxy execution. One was `Regsvr32`, what was the other?_

We can read through various different TTPs methods used under this particular campaign and we see mention of those two binaries under [T1218](https://attack.mitre.org/techniques/T1218/)

{{< figure src="/images/ctf/htb/sherlock/rundll32.png" alt="rundll32" caption=" " align="center" >}}

**Answer**: Rundll32

## Task 5

_Question: What lateral movement technique did the adversary use?_

Upon [mapping on layer](https://mitre-attack.github.io/attack-navigator//#layerURL=https%3A%2F%2Fattack.mitre.org%2Fcampaigns%2FC0022%2FC0022-enterprise-layer.json) we can clearly see lateral movement techniques, which can also be found on the same campaign page too.

{{< figure src="/images/ctf/htb/sherlock/internal.png" alt="internal" caption=" " align="center" >}}

**Answer**: [Internal Spearphishing](https://attack.mitre.org/techniques/T1534)

## Task 6

_Question: What is the technique ID for the previous answer?_

On the same image we can see the technique ID.

**Answer**: T1534

## Task 7

_Question: What Remote Access Trojan did the Lazarus Group use in Operation Dream Job?_

In the MITRE page scroll down to the Software section reveals with the answer.

{{< figure src="/images/ctf/htb/sherlock/DRATzarus.png" alt="DRATzarus" caption=" " align="center" >}}

**Answer**: DRATzarus

## Task 8

_Question: What technique did the malware use for execution?_

Click on DRATzarus and go to its ATT&CK navigate layer. You will find the answer under
the Execution Technique

{{< figure src="/images/ctf/htb/sherlock/native.png" alt="native" caption=" " align="center" >}}

**Answer**: Native API

## Task 9

_Question: What technique did the malware use to avoid detection in a sandbox?_

Reading the techniques on the campaign page reveals us with sandbox bypass techniques

{{< figure src="/images/ctf/htb/sherlock/sandbox.png" alt="sandbox" caption=" " align="center" >}}

**Answer**: [Time Based Evasion](https://attack.mitre.org/techniques/T1497/003)

## Task 10

_Question: To answer the remaining questions, utilize VirusTotal and refer to the IOCs.txt file. What is the name associated with the first hash provided in the IOC file?_

For this we will copy the hash from the file and look it up on [VirusTotal](https://www.virustotal.com/gui/file/7bb93be636b332d0a142ff11aedb5bf0ff56deabba3aa02520c85bd99258406f/details).

VirusTotal is an online service that analyzes files and URLs for potential threats by
scanning them with multiple antivirus engines. It helps users quickly identify malware,
phishing sites, and other malicious content.

{{< figure src="/images/ctf/htb/sherlock/IEXPLORE.png" alt="IEXPLORE" caption=" " align="center" >}}

**Answer**: IEXPLORE.EXE

## Task 11

_Question: When was the file associated with the second hash in the IOC first created?_

Same process we will search the hash on virus total. Look in the Details tab in the history
section we will find our answer.

{{< figure src="/images/ctf/htb/sherlock/timestamp.png" alt="timestamp" caption=" " align="center" >}}

**Answer**: 2020-05-12 19:26:17

## Task 12

_Question: What is the name of the parent execution file associated with the second hash in the IOC?_

Again same process search the hash in VirusTotal, this time look in the Relations tab
under the Execution Parent section we will find our answer.

{{< figure src="/images/ctf/htb/sherlock/BAE_HPC_SE.iso.png" alt="BAE_HPC_SE.iso" caption=" " align="center" >}}

**Answer**: [BAE_HPC_SE.iso](https://www.virustotal.com/gui/file/56dabf1ddd5c9a93a6f35dd7f210367baee545296838d321dfea6ee49575c9af)

## Task 13

_Question: Examine the third hash provided. What is the file name likely used in the campaign that aligns with the adversary's known tactics?_

We will find this answer in the Details tab under the Names section. As we know, the
victims of this operation were job seekers so the most appropriate answer would be related to that.

{{< figure src="/images/ctf/htb/sherlock/salarydoc.png" alt="salarydoc" caption=" " align="center" >}}

**Answer**: Salary_Lockheed_Martin_job_opportunities_confidential.doc

## Task 14

_Question: Which URL was contacted on 2022-08-03 by the file associated with the third hash in the IOC file?_

Again, utilizing VirusTotal we will find the answer in the Relations tab under Contacted
URLs section.

{{< figure src="/images/ctf/htb/sherlock/urldoc.png" alt="urldoc" caption=" " align="center" >}}

**Answer**: https://markettrendingcenter.com/lk_job_oppor.docx
