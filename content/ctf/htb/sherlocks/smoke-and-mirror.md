---
title: "Operation Blackout 2025: Smoke & Mirrors"
date: 2025-06-06
retire_date: 2025-06-06
description: "HTB sherlock"
tags:
  [
    "htb",
    easy",
    "Phantom Check",
    "Hayabusa",
    "WMI",
    "Incident Response",
    "IR",
    "DFIR"
  ]
difficulty: "Very Easy"
event: "HackTheBox"
author: "iamr007"
cover:
  image: "/images/ctf/htb/smoke.png"
  alt: "Phantom Check"
  relative: true
---

{{< sherlock-info-shortcode >}}

## what we gain?

- Identify malicious use of PowerShell
- Interpreting Windows Registry Modification
- How windows security features can be disable

## Scenario

Byte Doctor Reyes is investigating a stealthy post-breach attack where several expected security logs and Windows Defender alerts appear to be missing. He suspects the attacker employed defense evasion techniques to disable or manipulate security controls, significantly complicating detection efforts. Using the exported event logs, your objective is to uncover how the attacker compromised the system's defenses to remain undetected.

## Provided artifacts

- Microsoft-Windows-Powershell.evtx
- Microsoft-Windows-Powershell-Operational.evtx
- Microsoft-Windows-Sysmon-Operational.evtx

## Task 1

_Question: The attacker disabled LSA protection on the compromised host by modifying a registry key. What is the full path of that registry key?_

It directly saya that we have to find the registry key and we can do it with [windows event viewer](https://learn.microsoft.com/en-us/shows/inside/event-viewer) or [Hayabusa](https://github.com/Yamato-Security/hayabusa). We will run hayabusa with all available rules to detect the script execution.

```powershell
hayabusa-3.3.0-win-x64.exe csv-timeline -f "Windows-Powershell-Operational.evtx"  -o "task1.csv"
```

{{< figure src="/images/ctf/htb/sherlock/reg_key.png" alt="REG KEY" caption=" " align="center" >}}


**Answer**: HKLM\SYSTEM\CurrentControlSet\Control\LSA

## Task 2

_Question: Which PowerShell command did the attacker first execute to disable Windows Defender?_

The most commonly used PowerShell cmdlet to disable Windows Defender is `Set-MpPreference`. we can just do Ctrl+F in excel and find it!

{{< figure src="/images/ctf/htb/sherlock/disable.png" alt="disable command" caption=" " align="center" >}}

**Answer**: Set-MpPreference -DisableIOAVProtection $true -DisableEmailScanning $true -DisableBlockAtFirstSeen $true

## Task 3

_Question: The attacker loaded an AMSI patch written in PowerShell. Which function in the DLL is being patched by the script to effectively disable AMSI?_

By reviewing the various command in the same file flagged by Hayabusa, a script with relevant functionality was identified. It contains a function named `Disable-Protection`, which, upon successful execution, outputs Protection Disabled. The script performs the following actions:

- Obtains a handle to the amsi.dll module (which is used by Windows Defender)
- Locates the AmsiScanBuffer function
- Removes write protection from the memory region
- Overwrites the function’s start with 0x31, 0xC0, 0xC3, which [corresponds](https://www.cs.uaf.edu/2006/fall/cs301/lecture/11_20_dynamic_binary.html) to RET, effectively forcing the function to immediately [return](https://www.r-tec.net/r-tec-blog-bypass-amsi-in-2025.html) with success code.

{{< figure src="/images/ctf/htb/sherlock/amsibuffer.png" alt="amsibuffer" caption=" " align="center" >}}

**Answer**: AmsiScanBuffer

## Task 4

_Question: Which command did the attacker use to restart the machine in Safe Mode?_

To restart a windows machine in Safe Mode, the command must include the string `safeboot`. Searching for this in the same excel we can see the full command used by an attacker to do Safe Mode reboot.

{{< figure src="/images/ctf/htb/sherlock/safeboot.png" alt="safeboot command" caption=" " align="center" >}}

**Answer**: bcdedit.exe /set safeboot network

## Task 5

_Question: Which PowerShell command did the attacker use to disable PowerShell command history logging?_

The PowerShell command `Set-PSReadlineOption` customizes the behavior of the PSReadLine module during command-line editing. Searching for its usage in the same logs reveals that the attacker executed the following command to disable history logging.

{{< figure src="/images/ctf/htb/sherlock/ps_history.png" alt="PS history disbale command" caption=" " align="center" >}}

**Answer**: Set-PSReadlineOption -HistorySaveStyle SaveNothing


## What's next and connect?

Few more [sherlock writeups](/ctf/htb/sherlocks/) by me and [HTB CDSA](/blog/cdsa/) exam blog! Feel free to check it out and below are couple of ways to conect me!

🔗 [Contact Me](/contact)

📅 [Schedule via Calendly](https://calendly.com/bavarvasneh/30min)