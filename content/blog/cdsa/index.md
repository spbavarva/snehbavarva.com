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

Finally, I am happy to say that I am now HTB CDSA certified! Definitely it was good one to get and in this blog I will be sharing my journey from deciding to take this cert and actually getting it. This will be long, so bear with it! Less go...

## Why this exam?

I am a huge fan of [HTB Academy](https://academy.hackthebox.com/) and it's content and I recommend the platform to anyone looking to learn. I was just going through each of their job role path and though to give it a try for their [SOC Analyst Path](https://academy.hackthebox.com/path/preview/soc-analyst) a try in the December but I quit that in few days after doing few % and then I talked with people, look at study materials and some YT videos of course - I figured out that Defensive side of security is best suited for me and I enjoy it more than Web-Pentesting (I hate BURP!).
{{<newline>}}
{{<newline>}}
I will come to [my background](/blog/cdsa/#my-background) and [timeline](/blog/cdsa/#my-timeline) of my study and how long I took to prepare for the exam later in the module. But this is how I decided to take the exam.

### who is it for

Below is what HTB has to say:

<!-- {{< figure src="/images/blog/blog-4-CDSA/cdsa-sec.jpg" alt="HTB CDSA" caption=" " align="center" >}} -->

{{< figure src="/images/blog/blog-4-CDSA/targeted.png" alt="targeted people" caption=" " align="center" >}}

But I do believe that this content (**Content**) is absolutely helpful for any Pentester or any Red teamer to understand how your actual attack works behind the scene and how it can be detected. For example, mimikatz can be easily detected, which is known by anyone but how it's getting detected? that's what you wil learn in this path.

I highly recommend anyone who wants to explore how blue team works or how incident response team works as well as to the red teamers and pentester to understand how defending team operates, which could give you more ways to bypass certain things with clear understanding.

{{<dots>}}


## Pre-Requisites

{{< figure src="/images/blog/blog-4-CDSA/pre-re.png" alt="Pre-requisites" caption="" align="center" >}}

It is advisable to have a bit of knowledge in web and AD infrastructure penetration testing concepts, as per HTB. If you are very new, I suggest taking the [Pre-Requisites](https://academy.hackthebox.com/path/preview/soc-analyst-prerequisites) path as it will be really helpful. Of course, the attacks or the offensive knowledge needed for the exam will be taught in the path itself.

**Personal suggestion**: But I still recommend to have some short of AD pentesting knowledge, which will help you to understand the full flow from attacking an infra to defending it. You can have this in that Pre-Requisites path and I strongly suggest you to at least do [AD module](https://academy.hackthebox.com/course/preview/introduction-to-active-directory) from that.

### Pricing

The SOC Analyst path is available at HTB Academy platform and fortunately there are multiple affordable subscription models for different users. I used their student subscription which is only $8 per months if you have a .edu email and I am using that from almost 1.5 years now. This will give you access to all the modules in the SOC Analyst path, the pre-requisites path and even access to all their main certifications paths (CPTS, CBBH and CDSA).

And yes, a voucher ($210) comes with two attempts. To qualify for the second attempt, you need to submit a report detailing your progress.

{{< figure src="/images/blog/blog-4-CDSA/pricing.png" alt="pricing" caption="" align="center" >}}

If you don’t have a .edu email fortunately there are some other affordable subscriptions, which you can find [here](https://academy.hackthebox.com/billing/monthly-billing). Though if you want to learn more about academy pricing, [this is the place](https://help.hackthebox.com/en/articles/5720974-academy-subscriptions).

{{<dots>}}


## My background

A little bit of myself to give you context, which I am dividing into Defensive and Offensive categories.

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

{{<dots>}}

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

**Detecting Windows Attacks with Splunk**: Most easiest one if you know AD stuff. You will complete this in like a couple of hours
{{<newline>}}

**Security Incident Reporting**: Basically they will tell you how to write a report in real-life as well as in exam.
{{<newline>}}

### My timeline

It took me one and half month from starting the path to ending the exam. I started path in Feb and started exam in around 20th March.

But I tracked my time with [Toggle Track](https://toggl.com/) cause I want just curious whether it really takes that much of time which HTB tells us. I figured out I completed modules with lesser time.

{{< figure src="/images/blog/blog-4-CDSA/toggle.png" alt="Toggle Track" caption=" " align="center" >}}

All modules were not tracked here but I get all of those done in line 70 hours roughly. Which is around 6 hours/day and 12-13 days. This was just my curiosity, ignore it lol.

But yes as I mentioned in [start](/blog/cdsa/#why-this-exam), I started early but it was all blank in the Feb after I come from winter break.

{{<dots>}}


## EXAM!!

Now comes the most interesting part! As you might have know that it's a 7 days long exam and you have to investigate 2 incidents and submit a report on them. Along with you have to find 17/20 in order to pass the exam. You can read some details about exam objective in below image which was taken from [Sysreptor](https://docs.sysreptor.com/assets/reports/HTB-CDSA-Report.pdf). (I will come on this later in the [note taking](/blog/cdsa/#reporting--note-taking) section)

{{< figure src="/images/blog/blog-4-CDSA/exam-objective.png" alt="Exam Objective" caption="" align="center" >}}

I found 19 flags in two and half days and it took me 4 days to write a report on that. I knew that report will take more time than finding flags and I was dedicating 8 hours/day for these whole 6 and half days of my exam. First flag was took the most of my time and cause of wording as I was dumb-dumb to not understand that silly thing and god damn, **DO NOT FORGET TO REFRESH YOUR EXAM PANEL BEFORE SUBMITTING FLAG!**

{{<newline>}}

I don't know if it was only with me or not, but I was giving right flag all the time but it wasn't expecting that and after F 7-8 hours when I hit the refresh button on my browser and submitted the same thing, it accepted!

But yeah rest of the part was just natural and you will feel like you are lost but you knew that you saw something similar in your SOC analyst path, just revisit that module and make your strategy. 7 days are more than enough for this exam and even if it's not, there's 2nd attempt.

It may happen that you feel completely lost for particular question, just skip it after 1-2 hours and go to next one. You will find answer for that later. None of those flags are hard once you understand the gist of those incidents. But seriously whatever you need to pass, it's right in there in the modules. So, use that!

### reporting & note taking

#### Note Taking

obviously there are plenty of note-taking apps like Obsidian, Notion, OneNote, Joplin, etc. I personally use Obsidian. Just keep your study notes ready, which you made about Path and I hope you understand every commands and queries which was provided in the path. Because just copy-pasting won't help you in the exam.

**Pro Tip:** You have to understand like if there's spawn of `cmd.exe` from `notepad.exe` then you should know which place you have to look after, how to find user from that, what event ID to focus on to get further information, etc.

Take screenshots of your findings and put every SIEM queries and commands in your notes which you have used during your exam. This will be helpful when you start doing report writing.

#### Reporting

There are mainly two options for you here:

1. Word Template
2. [Sysreptor](https://docs.sysreptor.com/htb-reporting-with-sysreptor/)

Word template provided during the exam. Also, you can refer to the last module of the SOC Analyst Path for reporting, as I mentioned earlier in the [module review](/blog/cdsa/#modulepath-review) that in this module they basically tells us what type of report they want. Here's their [Google Doc](https://docs.google.com/document/d/e/2PACX-1vTkpIEicOwy8tRNAxKa4f4cMpc7wrUHRM5Nr_A_bObpzDQg5pAvj7jniHa_uVWQCuHLr21hQO64BsVi/pub) as well.

I started with Sysreptor as everyone said that we don't have to worry about formatting and all, but in 1-2 hours I figured out that naah, it's not for me. I need full control of my document and I want to format it and highlight things as I want.

Also for reporting, I would advice you to make a timeline first in your notes or somewhere then start report. I used below template,

```HTML
Time:
Activity:
Description:
Discovery Method:
```

This is just rough template for each activity in the incident. First prepare something like this then start reporting. This will save you a lot of time because you have to chain your findings as you can see in [Security Incident Reporting Module](https://academy.hackthebox.com/course/preview/security-incident-reporting).

And huge thanks to [MITRE FRAMEWORK](https://attack.mitre.org/), it will really help you a lot during reporting of your incident and after completing this exam, I understand the true importance of it.

### Tips - sherlocks?

1. Of course, take proper notes and screenshots is must
2. Once again, report rigorously because that's what which will be graded at the end
3. Make a timeline of incidents
4. Stay organized with your workspace and naming conventions
5. If you are stuck but familiar with situation, go and refer that module
6. If you find any answer by luck, try to reverse engineer it. (It worked for me on multiple occasions)
7. Don't stress yourself, you got plenty of time

{{<newline>}}

There are many more tips like this but I understand that if you are staring this exam then you have basic understanding of your routine, health, and sleep. This exam is structured as any full time person can also tackle it by doing 6-7 hours/day.

#### Extra prep

Personally I haven't done much of it. But yes, I did [BOTS (Boss of the SOC)](https://bots.splunk.com/) Splunk challenges and definitely I can recommend that as that will be most closest to the actual exam. (which is still not close but still)

And as everyone said, I tried few sherlocks but those are completely different from what I have learned from SOC Analyst Path on the HTB Academy. I mean you can use that knowledge but it's still completely different and after taking the exam I can even verify that. You don't need to do any sherlocks for exam.

But but but, it's really great exercise to do in general to improve your knowledge and decide whether you want to do more sherlocks before attempting exam or not only after experiencing that. Personally I did the following sherlocks:

- [Meerkat](https://app.hackthebox.com/sherlocks/Meerkat)
- [Loggy](https://app.hackthebox.com/sherlocks/Loggy)
- [Brutus](https://app.hackthebox.com/sherlocks/Brutus)
- [UFO-1](https://app.hackthebox.com/sherlocks/UFO-1)
- [Noxious](https://app.hackthebox.com/sherlocks/Noxious)
- [Unit42](https://app.hackthebox.com/sherlocks/Unit42)

{{<newline>}}

Also, [DFIR Report site](https://thedfirreport.com/) contains various incident response reports and going through them gives you idea of reporting and also familiarizes you with various incidents and how to detect it.

### After the exam

You found the flags, wrote full report on both incidents, now time for that most relaxing point when you upload your PDF and hit that **SUBMIT** button!!!!

{{< figure src="/images/blog/blog-4-CDSA/relax.gif" alt="realx" caption="" align="center" >}}

Finally you did that, shut down your thing and go get your stuff and leave for, THE MOON 🚀

In 18-20 business days you will hear back from HTB with some briefing of your report and you can order your Physical cert.
That pin is absolutely worth it!

{{<dots>}}


## Path feedback and improvements Suggestions

As I mentioned about every modules and they are really very well structured and detailed, still I found some of the modules are really vague and below are my Suggestions:

1. Like in [Detecting Windows Attacks with Splunk](https://academy.hackthebox.com/course/preview/detecting-windows-attacks-with-splunk) module, it wasn't clear that if we found something then whether it's false positive or actual movement of advisory. I know people can understand this with their experience with working but still it won't hurt HTB to include 1-2 paragraph about that.

2. Although [DFIR](https://academy.hackthebox.com/course/preview/introduction-to-digital-forensics) module was best but still there was not enough information about KAPE files and how to use Velociraptor tool. That module can be improved with few more sections.

3. [Malware Analysis](https://academy.hackthebox.com/course/preview/introduction-to-malware-analysis) module can be more challenging and more practical with scenario to investigate rather than just telling about how to use this and that. Something similar to DFIR module.

4. Little bit of Phishing part is covered in [Threat Hunting & Hunting With Elastic](https://academy.hackthebox.com/course/preview/introduction-to-threat-hunting--hunting-with-elastic) but that's the most common attack in the real life, I believe phishing attack should be cover with various scenarios and how to detect it.

5. Business Email Compromise should be included in this Path as it's one of the most important part for any Analyst in the company.

{{<dots>}}

## Mentions

Definitely first one would be HTB team who even refunded me money for accident purchase of another voucher. You are really great and content over HTB Academy is no match for any other platforms out there right now. It's the BEST!

Also huge thanks to my mate **Hypercure (HC)**, who helped me a lot and motivated me to learn more and **Sunny Singh**, who shared me his experience in this field.
**zzzz** and **timmytrill**, our dank discussions 🚀 is flying high!

{{<dots>}}

## Finally it's done! what's next?

Finally, I want to emphasize that you can undertake this exam without any prior defensive knowledge before starting the SOC Analyst path. All you need is time and a commitment to complete it.

But still there's many more things to cover and I am aiming for more SOC and IR stuff cause.....

{{< figure src="/images/blog/blog-4-CDSA/grind.gif" alt="grind" caption="" align="center" >}}


<!-- https://academy.hackthebox.com/achievement/badge/174316a0-0ae3-11f0-864f-bea50ffe6cb4 -->
{{<seperator>}}
