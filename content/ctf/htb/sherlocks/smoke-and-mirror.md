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

## Scenario

Byte Doctor Reyes is investigating a stealthy post-breach attack where several expected security logs and Windows Defender alerts appear to be missing. He suspects the attacker employed defense evasion techniques to disable or manipulate security controls, significantly complicating detection efforts. Using the exported event logs, your objective is to uncover how the attacker compromised the system's defenses to remain undetected.

## Provided artifacts


## Task 1

_Question: The attacker disabled LSA protection on the compromised host by modifying a registry key. What is the full path of that registry key?_

## Task 2

_Question: Which PowerShell command did the attacker first execute to disable Windows Defender?_

## Task 3

_Question: The attacker loaded an AMSI patch written in PowerShell. Which function in the DLL is being patched by the script to effectively disable AMSI?_

## Task 4

_Question: Which command did the attacker use to restart the machine in Safe Mode?_

## Task 5

_Question: Which PowerShell command did the attacker use to disable PowerShell command history logging?_
