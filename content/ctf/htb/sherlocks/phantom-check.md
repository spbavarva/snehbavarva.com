---
title: "Phantom Check"
date: 2025-06-06
retire_date: 2025-06-06
description: "HTB sherlock"
tags: ["htb", "very easy"]
difficulty: "Very Easy"
event: "HackTheBox"
author: "iamr007"
showToc: true
cover:
  image: "/images/ctf/htb/phantom.png"
  alt: "Phantom Check"
  relative: true
---


{{< sherlock-info-shortcode >}}

## What we gain?
Ability to create detection rules by identifying specific WMI queries, comparing processes for virtual machine detection, and analyzing registry keys or file paths associated with virtual environments.

## Scenario

Talion suspects that the threat actor carried out anti-virtualization checks to avoid detection in sandboxed environments. Your task is to analyze the event logs and identify the specific techniques used for virtualization detection. Byte Doctor requires evidence of the registry checks or processes the attacker executed to perform these checks.

## Provided artifacts
- Microsoft-Windows-Powershell.evtx
- Windows-Powershell-Operational.evtx

## Task 1

_Question: Which WMI class did the attacker use to retrieve model and manufacturer information for virtualization detection?_

As we are provided with the 2 event log files and question is asking about WMI classes, it means we have to look for the usage of WMI in the powershell query.

we can use [windows event viewer](https://learn.microsoft.com/en-us/shows/inside/event-viewer) or [Hayabusa](https://github.com/Yamato-Security/hayabusa). As I heard a lot about Hayabusa and I am also learning, we will use that.

According to the task, the attacker did use a WMI [(Windows Management Instrumentation)](https://learn.microsoft.com/en-us/windows/win32/wmisdk/wmi-start-page) query to gather system information in order to determine whether the current environment is a virtual machine. we can search for every command run with *wmi* query

```powershell
hayabusa-3.3.0-win-x64.exe search -f "Microsoft-Windows-Powershell.evtx" -k "Wmi" -J -o "wmi_result.json"
```
{{< newline >}}

{{< figure src="/images/ctf/htb/sherlock/hayabusa-terminal-start.png" alt="hayabusa" caption=" " align="center" >}}

{{< figure src="/images/ctf/htb/sherlock/wmi_class.png" alt="WMI class" caption=" " align="center" >}}

We can clearly see the command line and which class has been used by attacker.

**Answer**: Win32_ComputerSystem

## Task 2

_Question: Which WMI query did the attacker execute to retrieve the current temperature value of the machine?_

In the same json output file we can see all usage of the WMI and which query performed by attacker. 

{{< figure src="/images/ctf/htb/sherlock/thermal-query.png" alt="Thermal Query" caption=" " align="center" >}}

**Answer**: SELECT * FROM MSAcpi_ThermalZoneTemperature

## Task 3

_Question: The attacker loaded a PowerShell script to detect virtualization. What is the function name of the script?_

From question it's evident that it's kind of information gathering activity attacker is performing. We will run hayabusa with all available rules to detect the script execution.

```powershell
hayabusa-3.3.0-win-x64.exe csv-timeline -f "Windows-Powershell-Operational.evtx"  -o "powershell_timeline2.csv"
```

One of the script blocks found through this rule (at `2025-04-09 09:20:53`) indeed contains a function that implements the VM detection capability described in the task.

{{< figure src="/images/ctf/htb/sherlock/check-vm.png" alt="Check-VM" caption=" " align="center" >}}

**Answer**: Check-VM

## Task 4

_Question: Which registry key did the above script query to retrieve service details for virtualization detection?_

Going through the same identified script we find that the script retrives service details from 'HKLM:\SYSTEM\ControlSet001\Services'

```powershell
hayabusa-3.3.0-win-x64.exe search -f "Windows-Powershell-Operational.evtx" -k "HKLM" -J -o "HKLM_result.json"
```

{{< figure src="/images/ctf/htb/sherlock/HKLM.png" alt="HKLM" caption=" " align="center" >}}

**Answer**: HKLM:\SYSTEM\ControlSet001\Services

## Task 5

_Question: The VM detection script can also identify VirtualBox. Which processes is it comparing to determine if the system is running VirtualBox?_

We scroll down until we come across the 'VirtualBox' comment in the script. Just below it, we can see that the script retrieves process details using the 'Get-Process' cmdlet and compares them with 'vboxservice.exe' and 'vboxtray.exe' to determine whether it's running in a VirtualBox environment

**Answer**: vboxservice.exe, vboxtray.exe

## Task 6

_Question: The VM detection script prints any detection with the prefix ‘This is a’. Which two virtualization platforms did the script detect?_

Thoroughly analyzing the script, we do observe that it prints virtual machine detection results using the phrase 'This is a' followed by the name of the VM. To  ind the output, we search for the string 'This is a' within the 'Microsoft-Windows-PowerShell' logs and confirm that, according to the script, the operating system is running inside either 'Hyper-V' or 'VMware'

**Answer**: Hyper-V, Vmware

{{< seperator >}}