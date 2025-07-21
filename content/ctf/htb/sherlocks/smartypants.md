---
title: "SmartyPants"
date: 2025-02-27
retire_date: 2025-02-27
description: "HTB sherlock"
tags:
  [
    "htb",
    easy",
    "SmartyPants",
    "Hayabusa",
    "WMI",
    "Incident Response",
    "IR",
    "DFIR", "Hayabusa"
  ]
difficulty: "Very Easy"
event: "HackTheBox"
author: "CyberJunkie"
cover:
  image: "/images/ctf/htb/smartypants.png"
  alt: "Phantom Check"
  relative: true
---

{{< sherlock-info-shortcode >}}

## What we gain?

- Hayabusa hands-on
- User Behavior DFIR
- Event Log Analysis

## Scenario

Forela's CTO, Dutch, stores important files on a separate Windows system because the domain environment at Forela is frequently breached due to its exposure across various industries. On 24 January 2025, our worst fears were realised when an intruder accessed the fileserver, installed utilities to aid their actions, stole critical files, and then deleted them, rendering them unrecoverable. The team was immediately informed of the extortion attempt by the intruders, who are now demanding money. While our legal team addresses the situation, we must quickly perform triage to assess the incident's extent. Note from the manager: We enabled SmartScreen Debug Logs across all our machines for enhanced visibility a few days ago, following a security research recommendation. These logs can provide quick insights, so ensure they are utilised.

## Provided artifacts

- lots of log filed (.evtx)

## Task 1

_Question: The attacker logged in to the machine where Dutch saves critical files, via RDP on 24th January 2025. Please determine the timestamp of this login._

We first have to determine what's the suspicious user because it is asking for the logon timestamp. I'll be using [Hayabusa](https://github.com/Yamato-Security/hayabusa). Below command will give us all of the login success and failed attempts.

```powershell
hayabusa-3.3.0-win-x64.exe logon-summary -d ..\Logs\ -U -o logon-summary
```

- -d for directory input
- -U for UTC time
- -o for output file

{{<newline>}}

{{< figure src="/images/ctf/htb/sherlock/logon_success_dutch.png" alt="hayabusa" caption=" " align="center" >}}

Now we can see that Dutch user is suspicious and we can search for his events in all log files.

```powershell
hayabusa-3.3.0-win-x64.exe search -d ..\Logs\ -k "Dutch" -q -U -s -o dutch-all-logs
```
{{<newline>}}


- -k for keyword search
- -q for silent output
- -s for sorting the output

we will have a bunch of information all together! I just opened it in the notepad and lok at the hint of the question.

**Hint**: Use Microsoft-Windows-TerminalServices-RemoteConnectionManager/Operational Log and filter for event id 1149
{{<newline>}}

{{< figure src="/images/ctf/htb/sherlock/filter-event-for-dutch.png" alt="hayabusa" caption=" " align="center" >}}

I just filtered for that specific event log as suggested in the log and boom! I was able to find it.

**Answer**: 2025-01-24 10:15:14

## Task 2

_Question: The attacker downloaded a few utilities that aided them for their sabotage and extortion operation. What was the first tool they downloaded and installed?_

Now as we know that we have to look for events only after attacker logged in via RDP session, I just look below of that event and found many suspicious things.

{{< figure src="/images/ctf/htb/sherlock/2-7-questions.png" alt="hayabusa" caption=" " align="center" >}}

We can see that attacker downloaded WinRAR and question is asking for the same.

**Answer**: winrar


## Task 3

_Question: They then proceeded to download and then execute the portable version of a tool that could be used to search for files on the machine quickly and efficiently. What was the full path of the executable?_

We noticed another executable called Everything.exe executed after the activity of WinRAR. If we Google it we find that tool is a search and indexing tool that works faster than the built-in Windows search to find Windows folders and files located anywhere on disk. Threat actors use this tool to quickly find critical files, and documents to exfiltrate.

**Answer**: C:\Users\Dutch\Downloads\Everything.exe

## Task 4

_Question: What is the execution time of the tool from task 3?_

**Answer**: 2025-01-24 10:17:33

## Task 5

_Question: The utility was used to search for critical and confidential documents stored on the host, which the attacker could steal and extort the victim. What was the first document that the attacker got their hands on and breached the confidentiality of that document?_

Moving on according to the timeline from logs, we notice the path of the document. The first file according to the timeline was the "Ministry of defense audit.pdf".

**Answer**: C:\Users\Dutch\Documents\2025- Board of directors Documents\Ministry Of Defense Audit.pdf

## Task 6

_Question: Find the name and path of second stolen document as well._

I immediately see another event of document access right after the first one.

**Answer**: C:\Users\Dutch\Documents\2025- Board of directors Documents\2025-BUDGET-ALLOCATION-CONFIDENTIAL.pdf

## Task 7

_Question: The attacker installed a Cloud utility as well to steal and exfiltrate the documents. What is name of the cloud utility?_

After a minute when the threat actor accessed the documents, we saw evidence of execution of a file called `MegaSyncSetup64.exe` and we know that Mega is a cloud service provider.

**Answer**: MEGAsync

## Task 8

_Question: When was this utility executed?_

We find another entry related to Mega, this time executing from the Appdata folder, indicating it was installed.

{{< figure src="/images/ctf/htb/sherlock/8-10-questions.png" alt="hayabusa" caption=" " align="center" >}}

**Answer**: 2025-01-24 10:22:19

## Task 9

_Question: The Attacker also proceeded to destroy the data on the host so it is unrecoverable. What utility was used to achieve this?_

Further down the timeline, we find the execution of another setup from the downloads folder called "file_shredder_setup.exe". Just common sense or a google search can give the answer here.

**Answer**: File Shredder

## Task 10

_Question: The attacker cleared 2 important logs, thinking they covered all their tracks. When was the security log cleared?_

Just right below the above event, we can see this event of clearing the log.

**Answer**: 2025-01-24 10:28:41

## What's next and connect?

Few more [sherlock writeups](/ctf/htb/sherlocks/) by me and [HTB CDSA](/blog/cdsa/) exam blog! Feel free to check it out and below are couple of ways to conect me!

🔗 [Contact Me](/contact)

📅 [Schedule via Calendly](https://calendly.com/bavarvasneh/30min)