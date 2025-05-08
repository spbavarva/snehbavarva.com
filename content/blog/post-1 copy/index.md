---
title: "Hunt Evil with - YARA"
description: "Basic understanding of YARA rules"
date: 2025-04-15
draft: false
tags: ["YARA", "Threat Detection", "Ransomware", "WannaCry", "Sigma"]
showToc: true
---
As we know that YARA is one of the most powerful tools if used correctly. We can analyze disk artifacts, memory images, or even live endpoint telemetry. Also, YARA rules allow to detect known malware patterns, identify suspicious behavior.

In this blog, we'll walk through real-world hunting scenarios. We’ll build and test rules against malware samples like WannaCry, Dharma, APT17, and Turla. We’ll also explore how YARA integrates with memory forensics and event telemetry (ETW) for runtime detection.

But before that,

## What is YARA?

> `YARA ("Yet Another Ridiculous Acronym") is a pattern-matching tool for`
> `identifying malware families based on string signatures, binary patterns, metadata.`

Too much? it's just rules that helps to detect patterns. Okay let's see where it's useful:

- Malware detection and classification
- File analysis and classification
- IOC detection
- Community-driven rule sharing
- Custom security solution
- Custom YARA rules
- Incident Response
- Proactive Threat Hunting

{{<newline>}}

{{< figure src="/images/blog/blog-2-YARA/yara_intro.webp" alt="bonus" caption=" " align="center" >}}


## How actually it works

The image below illustrates the basic workflow of YARA detection. 

{{< figure src="/images/blog/blog-2-YARA/how-it-works.png" alt="bonus" caption=" " align="center" >}}

Analysts observe suspicious strings, binary patterns, or structural behaviors in known malware samples. These are then translated into YARA rules. The YARA scan engine uses these rules—along with optional modules—to evaluate files, memory, or network traffic for matches. If a file contains characteristics that satisfy the conditions in a rule, it's flagged as potentially malicious.

_Below is simple YARA rule:_

```bash
rule my_rule {
    meta:
        author = "Sneh"
        description = "Detects test strings"
    strings:
        $a = "test"
        $b = "string"
        $c = "rule"
    condition:
        all of them
}
```

{{<newline>}}

**A rule contains:**

- Metadata: for attribution/documentation

- Strings: literal strings, hex patterns, or regex

- Condition: logic to match the strings


### Real World Example of Detecting WannaCry

```bash
rule Ransomware_WannaCry {
    meta:
        author = "Madhukar Raina"
        description = "Detects WannaCry ransomware"
    strings:
        $s1 = "tasksche.exe"
        $s2 = "www.iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea.com"
        $s3 = "mssecsvc.exe"
    condition:
        all of them
}
```
{{<newline>}}

This rule detects the presence of WannaCry ransomware by matching three key indicators observed in the malware: its dropped executable (`tasksche.exe`), the kill-switch domain used for sandbox evasion, and the service binary (`mssecsvc.exe`) it installs. Requiring all three strings ensures high confidence in detection while minimizing false positives.

{{<dots>}}

## Developing YARA rules

we can do this manually and automatically. so let's look into both ways:

### Manually writing YARA rules

As we know that YARA rule is made up of three main blocks: `meta`, `strings`, and `condition`.

So, we just have to write what we want to detect but this is the pain in the butt as it takes a lot of research. Here’s an example rule to detect UPX-packed binaries, commonly used to compress or obfuscate malware:

```bash
rule UPX_packed_executable {
    meta:
        description = "Detects UPX-packed executables"

    strings:
        $string_1 = "UPX0"
        $string_2 = "UPX1"
        $string_3 = "UPX2"

    condition:
        all of them
}
```

This rule checks for classic UPX section names in binaries (UPX0, UPX1, UPX2) which are indicators that the file has been packed using the UPX packer—often a red flag during malware triage.

{{<seperator>}}

### Using yarGen for Rule Generation

yarGen is an automated tool that helps generate YARA rules from a malware sample by identifying unique strings and entropy sections.

**Setup:**
```shell
pip install -r requirements.txt
python yarGen.py --update
```
{{<newline>}}

🔗 [yarGen](https://github.com/Neo23x0/yarGen)

**Generate Rules:**
```shell
python3 yarGen.py -m /temp/file_name -o sample.yar
```
{{<newline>}}
**Test Rules:**
```bash
yara sample.yar /home/Samples/fles-to-detect-rules-on/
```
{{<newline>}}
yarGen is useful when you're dealing with large volumes of unknown malware and want quick initial detection logic.

{{<seperator>}}

### Some advanced Rules from Real Malware

**APT17 – ZoxPNG RAT**

```bash
rule APT17_Malware_Oct17_Gen {
    meta:
        description = "Detects APT17 malware"
        author = "Florian Roth"

    strings:
        $s1 = "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64...)" fullword ascii
        $s2 = "hWritePipe2 Error:%d" fullword ascii
        ...
    condition:
        uint16(0) == 0x5a4d and filesize < 200KB and
        ( pe.imphash() == "414bbd566b700ea021cfae3ad8f4d9b9" or
          1 of ($s*) or
          6 of them )
}
```
This rule uses both string-based matching and imphash verification to detect APT17 implants based on HTTP headers and command-and-control strings.

**Turla – Neuron Backdoor (Written in .NET)**

```bash
rule neuron_functions_classes_and_vars {
    strings:
        $class1 = "StorageUtils"
        $func1 = "AddConfigAsString"
        ...
    condition:
        uint16(0) == 0x5A4D and $dotnetMagic and 6 of them
}
```
The rule targets .NET class/function names unique to Turla’s Neuron malware and uses the BSJB magic header to identify .NET binaries.

{{<dots>}}

## Hunting Evil in the Windows

### Scanning Suspicious Executables with YARA

By opening suspicious `.exe` files in a hex editor like HxD, we can find hardcoded artifacts left by threat actors - like `.pdb` paths or unique string patterns.

{{< figure src="/images/blog/blog-2-YARA/2.png" alt="bonus" caption=" " align="center" >}}

You can identify these strings by running:
```bas
hexdump dharma_sample.exe -C | grep crysis -n3
```

{{<newline>}}

**Example of Detecting above (Dharma) Ransomware**

```bash
rule ransomware_dharma {
    meta:
        author = "Madhukar Raina"
        version = "1.0"
        description = "Simple rule to detect strings from Dharma ransomware"

    strings:
        $string_pdb = { 433A5C6372797369735C52656C656173655C5044425C7061796C6F61642E706462 }
        $string_ssss = { 73 73 73 73 73 62 73 73 73 }

    condition:
        all of them
}
```

{{<newline>}}

**Then scan the sample:**

```bash
yara64.exe -s C:\Rules\yara\dharma_ransomware.yar C:\Samples\YARASigma\ -r
```

{{<seperator>}}


### Scanning Running Processes (Detecting Meterpreter)

To detect in-memory payloads like Metasploit’s Meterpreter, we can scan active processes using YARA rules that look for shellcode byte sequences, kernel32 API references, and known checksum values.

```bash
rule meterpreter_reverse_tcp_shellcode {
    meta:
        author = "FDD @ Cuckoo sandbox"
        description = "Metasploit reverse_tcp shellcode"
    strings:
        $s1 = { fce8 8?00 0000 60 }
        $s2 = { 648b ??30 }
        $s3 = { 4c77 2607 }
        $s4 = "ws2_"
        $s5 = { 2980 6b00 }
        $s6 = { ea0f dfe0 }
        $s7 = { 99a5 7461 }
    condition:
        5 of them
}
```

Now run the scanner for each process:

```powershell
Get-Process | ForEach-Object { "Scanning with Yara for meterpreter shellcode on PID"
+$_.id; & "yara64.exe" "C:\Rules\yara\meterpreter_shellcode.yar" $_.id }
```
{{<newline>}}
From the results, the meterpreter shellcode seems to have infiltrated a process with `PID 9084`. We can also guide the YARA scanner with a specific PID as follows.

{{< figure src="/images/blog/blog-2-YARA/scan-result.png" alt="bonus" caption=" " align="center" >}}

Now run rule over it:
```powershell
yara64.exe C:\Rules\yara\meterpreter_shellcode.yar 9084 --print-strings
```
{{<newline>}}
{{< figure src="/images/blog/blog-2-YARA/4.webp" alt="bonus" caption=" " align="center" >}}


{{<seperator>}}

### Hunting with ETW Logs using SilkETW
{{<newline>}}
{{< figure src="/images/blog/blog-2-YARA/hunt.png" alt="bonus" caption=" " align="center" >}}

**SilkETW** is an open-source tool to work with Event Tracing for Windows (ETW) data. SilkETW provides enhanced visibility and analysis of Windows events for security monitoring, threat hunting, and incident response purposes. The best part of SilkETW is that it also has an option to **integrate YARA rules**. It includes YARA functionality to filter or tag event data.

**Example of PowerShell Command Detection**

```bash
rule powershell_hello_world_yara {
	strings:
		$s0 = "Write-Host" ascii wide nocase
		$s1 = "Hello" ascii wide nocase
		$s2 = "from" ascii wide nocase
		$s3 = "PowerShell" ascii wide nocase
	condition:
		3 of ($s*)
}
```

**Start ETW logging:**
```bas
.\SilkETW.exe -t user -pn Microsoft-Windows-PowerShell -ot file -p ./etw_ps_logs.json -l verbose -y C:\Rules\yara -yo Matches
```

now in the new session apply following command
```powershell
Invoke-Command -ScriptBlock {Write-Host "Hello from PowerShell"}
```


{{< figure src="/images/blog/blog-2-YARA/detect.png" alt="bonus" caption=" " align="center" >}}



{{<dots>}}

YARA is not fun as it seems after some hit ad try but defenitely it's good one to begin your SOC analyst fundamental.

_Next time_, I’ll be diving into **Sigma** rules, another powerful framework that turns log data into actionable detections.
Stay tuned, and feel free to reach out if you'd like to connect or collaborate:

[🔗 Contact Me](https://www.snehbavarva.com/contact)

[📅 Schedule via Calendly](https://calendly.com/bavarvasneh/30min)

{{<seperator>}}