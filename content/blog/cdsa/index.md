---
title: "HTB - Certified Defensive Security Analyst (CDSA) Review 2025"
description: "A completely new guy in defesive side passing in a month..."
date: 2025-05-11
draft: false
tags: ["HTB", "CDSA", "Blue Team", "Certification", "SOC", "2025"]
categories: ["Certifications", "Defensive"]
showToc: true
---

{{< figure src="/images/blog/blog-4-CDSA/cdsa.png" alt="HTB CDSA" caption=" " align="center" >}}

> _“Every new challenge is a chance to discover a stronger version of yourself”_


## Overview

Finally, I am happy to say that I am now HTB CDSA certified! Defenetaly it was good one to get and in this blog I will be sharing my journey from deciding to take this cert and actualy getting it. This will be long, so bare with it! Less go...

## Why this exam?

I am a huge fan of [HTB Academy](https://academy.hackthebox.com/) and it's content and I recommend that paltform to everyone to learn. I was just going through each of their job role path and though to give it a try for their [SOC Analyst Path](https://academy.hackthebox.com/path/preview/soc-analyst) a try in the December but I quit that in few days after doing few % and then I talked with people, look at study materials and some YT vidos of course - I figured out that Defensive side of security is best suited for me and I enjoy it more than Web-Pentesting (I hate BURP!).
{{<newline>}}
{{<newline>}}
I will come to [my background](/blog/cdsa/#my-background) and [timeline](/blog/cdsa/#my-timeline) of my study and how long I took to prepare for the exam later in the module. But this is how I decided to take the exam.

### who is it for

Below is what HTB has to say:
<!-- {{< figure src="/images/blog/blog-4-CDSA/cdsa-sec.jpg" alt="HTB CDSA" caption=" " align="center" >}} -->
{{< figure src="/images/blog/blog-4-CDSA/targeted.png" alt="targeted people" caption=" " align="center" >}}

But I do believe that this content (**Content**) is absoulately helpful for any Pentester or any Red teamer to understand how your actual attack works behind the scene and how it can be detected. For example, mimikatz can be easily detected, which is known by anyone but how it's getting detected? that's what you wil learn in this path.

I highly recommend anyone who wants to explore how blue team works or how incident response team works as well as to the red teamers and pentester to understand how defending team operates, which could give you more ways to bypass certain things with clear understanding.

## Pre-requisites

{{< figure src="/images/blog/blog-4-CDSA/pre-re.png" alt="Pre-requisites" caption="" align="center" >}}

It is advisable to have a bit of knowledge in web and AD infrastructure penetration testing concepts, as per HTB. If you are very new, I suggest taking the [Pre-Requisites](https://academy.hackthebox.com/path/preview/soc-analyst-prerequisites) path as it will be really helpful. Of course, the attacks or the offensive knowledge needed for the exam will be taught in the path itself.

**Personal suggestion**: But I still recommend to have some short of AD pentesting knowledge, which will help you to understand the full flow from attacking an infra to defending it. You can have this in that Pre-Requisites path and I strongly suggest you to at least do [AD module](https://academy.hackthebox.com/course/preview/introduction-to-active-directory) from that.

### Pricing


The SOC Analyst path is available at HTB Academy platform and fortunately there are multiple afforable subscription models for different users. I used their student subscription which is only $8 per months if you have a .edu email and I am using that from almost 1.5 years now. This will give you access to all the modules in the SOC Analyst path, the pre-requisites path and even access to all their main certifications paths (CPTS, CBBH and CDSA).

And yes, a voucher ($210) comes with two attempts. To qualify for the second attempt, you need to submit a report detailing your progress.

{{< figure src="/images/blog/blog-4-CDSA/pricing.png" alt="pricing" caption="" align="center" >}}


If you don’t have a .edu email fortunately there are some other affordable subscriptions, which you can find [here](https://academy.hackthebox.com/billing/monthly-billing). Though if you want to learn more about academy pricing, [this is the place](https://help.hackthebox.com/en/articles/5720974-academy-subscriptions).

## My background

A little bit of myself to give you context, whcih I am diiving into Defensive and Offensive categories.

**Defense side**
- No defensive side knowledge
- No DFIR knowledge
- Never touched ELK-stack, and Splunk only for college assignment
- Never did any sherlock or let's defend lab (cause I wasn't even aware lol)
- Basic knowledge of Malware 
- Average with Assembly

{{<newline>}}

**Offensive side**
- OSCP, eJPTv2 and some more
- Bachelor's degree in IT (stong networking and OS knowledge)
- Master's degree in Cybersecurity (on-going, still it was beneficial for Splunk)
- Solid understanding of AD Infra and Attacks
- Some boxes on [HTB](https://app.hackthebox.com/profile/1143652) and [THM](https://tryhackme.com/p/mysticmido)

## Course overview

Overall this path was great to start awaken defensive side and CDSA path consists of the following 15 modules: (if you meet the pre-requisites, all the 15 modules are much easier to learn)

{{< figure src="/images/blog/blog-4-CDSA/allmodule.png" alt="All Modules" caption="" align="center" >}}

Below is my personal review of each module,

### Module/Path review

**Incident Handling Process**: This module covers the core stages of incident handling. It’s a foundational overview meant to prepare you for more technical, SOC-focused modules. And seriously for exam, this module may not worth but in reality this worth the most than any other modules!
{{<newline>}}

**Security Monitoring & SIEM Fundamentals**: Core SIEM fundamentals and you will learn basic use of Elastic Stack. Setup of ELK, finding events and triaging process. 
{{<newline>}}

**Windows Event Logs & Finding Evil**: You will learn about Windows Event Logs and Sysmon Logs, how to detect threats like DLL hijacking and credential dumping. It also explores ETW, and hands-on techniques to investigate malicious activity with tools like Get-WinEvent and Event Viewer.
{{<newline>}}

**Introduction to Threat Hunting & Hunting With Elastic**: Threat Hunting and CTI fundamentals are covered here as well as at the end, you will have to asses a phishing scenario from phishing mail to how it implemented RAT. (tough one for me)
{{<newline>}}

**Understanding Log Sources & Investigating with Splunk**: You are introduced to Splunk and you'll know how to use diverse log sources and it's importance using Splunk
{{<newline>}}

**Windows Attacks & Defense**: Almost all type of basic attacks of AD infra is covered here and you will enjoy a lot if you know AD stuff before-hand :&#41;
Also. It taught how to set up a honeypot and understand how event IDs for detecting the attacks can vary when a honeypot is used. (most useful for real-life)
{{<newline>}}

**Intro to Network Traffic Analysis**: Networking knowledge and analysis with tools like: Wireshark and Tcpdump
{{<newline>}}

**Intermediate Network Traffic Analysis**: Detailed module on networking concepts like: ARP, 802.11, ICMP tunneling, XSS and SSL detection, TCP and TLS handshake. (I don't know wju this module is rated easy and previous rated as Medium)
{{<newline>}}

**Working with IDS/IPS**: Understanding of IDS and IPS tools with Suricata, Snort, and Zeek
{{<newline>}}

**Introduction to Malware Analysis**: Static and Dynamic detection method of malware on Windows and Linux with code analysis and debugging. (If you aren't familiar with Assembly, I suggest completing Intro to [Assembly Language module](https://academy.hackthebox.com/course/preview/intro-to-assembly-language))

**JavaScript Deobfuscation**: You'll learn how to decode and analyze obfuscated JavaScript, which is common practice by attackers
{{<newline>}}

**YARA & Sigma for SOC Analysts**: YARA and Sigma rules are important and you will understand why and how it's used. Also you can checkout my blog for that as well!
{{<newline>}}

**Introduction to Digital Forensics**: DFIR! Best module to learn the most of it. So many new tools and full-fledge investigation of scenario on DFIR. This is my personal favourite module as well and best skill assessment in whole path!
{{<newline>}}

**Detecting Windows Attacks with Splunk**: Most easiest one if you know AD stuff. You wil complete this in like a couple of hours
{{<newline>}}

**Security Incident Reporting**: Basically they will tell you how to write a report in real-life as well as in exam.
{{<newline>}}


### My timeline

It took me one and half month from starting the path to ending the exam. I started path in Feb and started exam in around 20th March. 

But I tracked my time with [Toggle Track](https://toggl.com/) cause I want just curious whether it really takes that much of time which HTB tells us. I figured out I completed modules with lesser time.

{{< figure src="/images/blog/blog-4-CDSA/toggle.png" alt="Toggle Track" caption=" " align="center" >}}

All modules were not tracked here but I get all of those done in line 70 hours roughly. Which is around 6 hours/day and 12-13 days. This was just my curiosity, ignore it lol.

But yes as I mentioned in [start](/blog/cdsa/#why-this-exam), I started early but it was all blank in the Feb after I come from winter break.

## EXAM!!

### reporting & note taking

## Tips - sherlocks?

## After the exam

## Path feedback and improvements suggetions

## mentions

## Finally it's done! what's next?

{{<seperator>}}