---
title: "Hunt Evil with - Sigma"
description: "Basic understanding of Sigma rules and it's importance"
date: 2025-04-17
draft: true
tags: ["Sigma", "Threat Detection", "Threat Hunting", "SIEM", "Splunk", "Windows Security", "Cybersecurity", "Log Analysis"]
showToc: true
---
Another Threat Detectin thing, because from LSASS memory dumps to weird Notepad behaviour, threat detection has never been easier to standardize. This post walks through about Sigma rules, how to develop them and how to hunt in Windows with Splunk.

But before that,

## What is Sigma?

> `Sigma is like YARA, but for logs. It’s a generic signature format for SIEM systems, written in YAML, and lets us describe detection logic in a platform-agnostic way.`

- universal log analytics tool
- community-driven rule sharing
- incident response
- proactive threat hunting
- seamless integration with automation tools
- customization for specific environment
- gap identification


## how it works

basically it's written in YAML but but but!!! here comes the magic of it!

`sigmac` Sigma converter change those rule in query format which can be used in SIEMs'

{{< figure src="/images/blog/blog-3-Sigma/1.png" alt="bonus" caption=" " align="center" >}}

### Sigma Rule – Explained Visually

Sigma rules are YAML-based, platform-agnostic detections for logs. Below is a detailed breakdown of how they work using visual examples.

The first image below explains the structure and fields of a Sigma rule:

{{< figure src="/images/blog/blog-3-Sigma/2.png" alt="bonus" caption=" " align="center" >}}

Key Elements:

{{< indent10 >}} • title : The purpose of the rule. Example: Potential LethalHTA Technique Execution.{{< /indent10 >}}
{{< indent10 >}} • id: A unique identifier (UUID) for tracking and referencing the rule.{{< /indent10 >}}
{{< indent10 >}} • status: Indicates whether the rule is test, stable, or deprecated.{{< /indent10 >}}
{{< indent10 >}} • description: A summary of what the rule detects and why.{{< /indent10 >}}
{{< indent10 >}} • references: Helpful URLs or documents supporting the rule’s logic.{{< /indent10 >}}
{{< indent10 >}} • author & date: Credit to the rule creator and its creation date.{{< /indent10 >}}
{{< indent10 >}} • tags: MITRE ATT&CK techniques or context tags like attack.defense_evasion.{{< /indent10 >}}
{{< indent10 >}} • logsource: Tells Sigma what logs to look at (e.g., process_creation on Windows).{{< /indent10 >}}
{{< indent10 >}} • detection: Defines the search conditions (explained in more detail below 👇).{{< /indent10 >}}
{{< indent10 >}} • falsepositives: Known legitimate activity that might match the rule.{{< /indent10 >}}
{{< indent10 >}} • level: The severity if this rule triggers (low, medium, high, or critical).{{< /indent10 >}}


#### Understanding the Detection Logic (Search Identifiers & Conditions)

The second image explains how Sigma uses search identifiers and conditions in the detection section:

{{< figure src="/images/blog/blog-3-Sigma/3.png" alt="bonus" caption=" " align="center" >}}


Inside the detection field:

    selection1 and selection2: These are search identifiers that define what to look for in logs.
        For example, selection1 checks if Image ends with cmd.exe or powershell.exe.
        selection2 looks for ParentImage values like winword.exe or excel.exe.

    condition: Combines selections using logical operations.
        In this case: selection1 AND selection2 means both conditions must match.

{{<dots>}}

## Developing Sigma Rule

Let’s take an example: detecting credential dumping attempts by looking for access to LSASS memory using suspicious permission flags.

When attackers try to dump credentials from lsass.exe, they usually request special access permissions. One suspicious flag is 0x1010, which implies the process is trying to read and query LSASS memory.

{{< figure src="/images/blog/blog-3-Sigma/4.png" alt="bonus" caption=" " align="center" >}}

We want to detect:

        Event ID: 10
        TargetImage: lsass.exe
        GrantedAccess: 0x1010
{{<newline>}}
why `0x1010` is important?
because it implies both reading and querying information from the process

now we can use this, YEAH BABY!

```YAML
title: LSASS Access with rare GrantedAccess flag 
status: experimental
description: This rule will detect when a process tries to access LSASS memory with suspicious access flag 0x1010
date: 2023/07/08
tags:
    - attack.credential_access
    - attack.t1003.001
logsource:
    category: process_access
    product: windows
detection:
    selection:
        TargetImage|endswith: '\lsass.exe'
        GrantedAccess|endswith: '0x1010'
    condition: selection
```
this below is how we can transform our rule into query
here with `sigmac`, YAML to powershell-query

```powershell
python sigmac -t powershell 'C:\Rules\sigma\proc_access_win_lsass_access.yml'
```

now we can use that rule which this `sigmac` gave

```powershell
Get-WinEvent -Path C:\Events\YARASigma\lab_events.evtx | where {($_.ID -eq "10" -and $_.message -match "TargetImage.*.*\\lsass.exe" -and $_.message -match "GrantedAccess.*.*0x1010") } | select TimeCreated,Id,RecordId,ProcessId,MachineName,Message
```

but this give us false positive many times, so always be cautious
{{<dots>}}
## Hunting with Sigma in Splunk

Now that we've developed a Sigma rule, let’s move to the real fun—threat hunting with Sigma in Splunk!

Thanks to sigmac, we can convert our Sigma rules into Splunk Query Language (SPL) and start hunting right away 🔥

### #1 – LSASS Dump via MiniDump Function (comsvcs.dll)

Attackers often abuse comsvcs.dll via rundll32.exe to dump LSASS memory. first translate rule to SPL

```powershell
python sigmac -t splunk C:\Tools\chainsaw\sigma\rules\windows\process_access\proc_access_win_lsass_dump_comsvcs_dll.yml -c .\config\splunk-windows.yml
```

now we can easily use that query to detect minidump in Splunk

{{< figure src="/images/blog/blog-3-Sigma/5.png" alt="bonus" caption=" " align="center" >}}

### #2 – Notepad Spawning Suspicious Child Process

Why would Notepad spawn PowerShell or other binaries? That’s suspicious!

Convert the rule like this:

```powershell
python sigmac -t splunk C:\Rules\sigma\proc_creation_win_notepad_susp_child.yml -c .\config\splunk-windows.yml
```

Then run the query in Splunk to find anomalies.

{{< figure src="/images/blog/blog-3-Sigma/6.png" alt="bonus" caption=" " align="center" >}}

{{<dots>}}

Sigma makes threat detection feel less like guesswork and more like detective work. It’s clean, flexible, and super handy when you’re digging through logs trying to make sense of weird behavior. Definitely a tool worth keeping in your SOC toolkit!

[🔗 Contact Me](https://www.snehbavarva.com/contact)

[📅 Schedule via Calendly](https://calendly.com/bavarvasneh/30min)

{{<seperator>}}
