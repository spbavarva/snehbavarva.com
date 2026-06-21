---
title: "SOAR + EDR Emulation"
description: "Emulating adversary techniques and automating D&R with LimaCharlie & Tines"
date: 2025-09-14
draft: false
kind: "Lab"
tags:
  [
    "SOAR",
    "EDR",
    "Automation",
    "Windows",
    "powershell",
    "Incident Response",
    "MITRE ATT&CK"
  ]
categories: ["automated", "Tool", "Incident Response", "Security Automation"]
showToc: true
cover:
  image: "/images/soar-edr-workflow.jpg"
  alt: "SOAR + EDR Playbook Architecture"
  caption: "SOAR + EDR Workflow"
  relative: false
---

This project demonstrates how **LimaCharlie EDR** and **Tines SOAR** can be integrated to automate the incident lifecycle — from detection to containment — in a controlled Windows Cloud lab.

I emulated real-world attacker behavior using MITRE ATT&CK techniques (PowerShell cradle, scheduled task persistence, masquerading, UAC bypass) and automated both **detection & response workflows**.

## Playbook Overview

**Goal**: emulate real attacker behavior (PowerShell cradle → persistence → masquerade → UAC bypass) and prove end-to-end detection + response with LimaCharlie → Tines → Slack → Host isolation. 

{{<newline>}}
**Outcome**: alerts routed to Slack; analyst approval triggers host isolation in LimaCharlie.

**Environment**: Windows 10 VM (soar-edr), LimaCharlie (EDR), Tines (SOAR), Slack (notifications).

### Technical Report

{{< pdf src="/images/soar-edr-report.pdf" height="900" >}}

{{<seperator>}}

## Architecture

{{< figure src="/images/soar-edr.jpg" alt="SOAR + EDR Architecture" caption="LimaCharlie detects → Tines orchestrates → Slack notifies & isolates" align="center" >}}

## Workflow Implementation

{{< figure src="/images/soar-edr-workflow.jpg"
    alt="SOAR + EDR Workflow"
    caption="Implemented Tines workflow operationalizing the detection-to-response pipeline"
    align="center" >}}

{{<seperator>}}

## Key Features

- **Detection Rules**: Custom LimaCharlie rules for PowerShell cradle (T1059.001), scheduled tasks (T1053.005), masquerading (T1036), and UAC bypass (T1548.002).
- **Automated Response**: Alerts routed through Tines → Slack → Analyst approval → Host isolation in LimaCharlie.
- **Coverage**: Achieved ~50% automation across simulated attack scenarios, reducing manual triage effort by ~40%.
- **End-to-End Workflow**: Detection → Slack alert → Analyst approval → Containment & documentation.

{{<seperator>}}

## Detections — Snippets

### PowerShell cradle (IEX / DownloadString)

```yaml
DETECT 
events: 
  - NEW_PROCESS 
op: and 
rules: 
  - op: is windows 
  - case sensitive: false 
    op: ends with 
    path: event/FILE_PATH 
    value: \WindowsPowerShell\v1.0\powershell.exe 
  - op: or 
    rules: 
      - case sensitive: false 
        op: contains 
        path: event/COMMAND_LINE 
        value: IEX 
      - case sensitive: false 
        op: contains 
        path: event/COMMAND_LINE 
        value: DownloadString(  
 
RESPONSE 
- action: report 
  metadata: 
    falsepositives: 
      - Admin scripts or software updaters using PowerShell download (rare) 
    level: high 
    tags: 
      - attack.execution 
      - attack.t1059.001 
  name: Mido - PS Cradle (IEX/DownloadString)
```

### Scheduled task create (schtasks /create)

```yaml
DETECT 
events: 
  - NEW_PROCESS 
  - EXISTING_PROCESS 
op: and 
rules: 
  - op: is windows 
  - case sensitive: false 
    op: ends with
    path: event/FILE_PATH 
    value: \system32\schtasks.exe  
  - op: or 
    rules: 
      - case sensitive: false 
        op: contains 
        path: event/COMMAND_LINE 
        value: ExplorerUpdater 
 
RESPONSE 
- action: report 
  metadata: 
    falsepositives: 
      - Legit admin/IT automation creating tasks 
    level: medium 
    tags: 
      - attack.persistence 
      - attack.t1053.005 
  name: Mido - Scheduled Task Create (SOAR-EDR)
```

### Masquerade svchost.exe in AppData

```yaml
DETECT 
events: 
  - NEW_PROCESS 
  - EXISTING_PROCESS 
op: and 
rules: 
  - op: is windows 
  - case sensitive: false 
    op: is 
    path: event/FILE_PATH 
    value: C:\Users\Administrator\AppData\Local\svchost.exe 
  - case sensitive: false 
    op: ends with 
    path: event/PARENT/FILE_PATH 
    value: \WindowsPowerShell\v1.0\powershell.exe 
 
RESPONSE 
- action: report 
  metadata: 
    level: high 
    tags: 
      - attack.defense_evasion 
      - attack.t1036 
  name: Mido - Masquerade (svchost in AppData)
```
### UAC bypass registry add (fodhelper path)

```yaml
DETECT 
events: 
  - NEW_PROCESS 
  - EXISTING_PROCESS 
op: and 
rules: 
  - op: is windows 
  - case sensitive: false 
    op: ends with 
    path: event/FILE_PATH 
    value: \system32\reg.exe 
  - case sensitive: false 
    op: contains 
    path: event/COMMAND_LINE 
    value: add HKCU\Software\Classes\ms-settings\Shell\Open\command 

RESPONSE 
- action: report 
  metadata: 
    level: high 
    tags: 
      - attack.privilege_escalation 
      - attack.t1548.002 
  name: Mido - UAC Bypass Registry (fodhelper)
```
(Full rules live in the PDF)

## Indicators of Compromise (IoCs)

Process Executions: 
```p
powershell.exe -nop -w hidden ...DownloadString(...)
schtasks.exe /create ... 
AppData\Local\svchost.exe 
reg.exe add ...ms-settings\Shell\Open\command
fodhelper.exe
```
{{<newline>}}

Paths: 
```p
C:\Users\Administrator\AppData\Local\svchost.exe
HKCU\Software\Classes\ms-settings\Shell\Open\command
```
{{<newline>}}

Task: 
```p
ExplorerUpdater (every 1 minute → notepad.exe)
```
{{<newline>}}

Hashes (from logs):

```
PowerShell: 38f4384643b3fa0de714d2367b712c2e0fa1c89e2cfd131ae6b831ad962b1033
Notepad: 7d453801b059e4dab59b1b159ccd713e1d3593faa537c6ac5bbc2ce6c1e78a4d
```

(All IOCs in the PDF)


## Impact

- Validated effectiveness of **SOAR + EDR playbooks** for rapid containment.
- Cut **time-to-containment by ~30%** in lab simulations.
- Showcased how chained MITRE ATT&CK techniques can be detected and remediated in real-time.

{{<seperator>}}

## Author

Built by [Sneh aka mystic_mido](https://github.com/spbavarva)

{{<seperator>}}
