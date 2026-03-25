---
title: "CRTO 2026 Review and Preparation Guide"
description: "My honest review of the Certified Red Team Operator exam, failed attempts, and tips..."
date: 2026-03-24
draft: false
tags: ["Cybersecurity", "Ethical Hacking", "Security", "Red Team", "Hacking", "CRTO", "Zero Point Security", "Cobalt Strike", "Red Team", "Red Team Operator", "CRTO Review", "CRTO Guide"]
categories: ["Certifications", "Red Team"]
showToc: true
---

{{< figure src="/images/blog/blog-crto/crto1.png" alt="CRTO Badge" caption=" " align="center" >}}

> _"The harder the challenge, the stronger your beacon"_

## Overview

After so long, I am finally now Certified Red Team Operator (**CRTO**)! I have bought this course since 4-5 months but finally able to do it in the previous month. That's not my timeline, I just procrastined a lot with this. I don't need to tell you how good CRTO and Zero Point Security is. You already know about it if you are planning to prepare for it. This blog will cover what to expect, how hard was it, ideal timeline and whether it's worth or not. Let's go...

## New CRTO and Exam format

As you know that in the 2025, CRTO has changed and updated to the new portal. Now you don't require to obtain the flags and do it in CTF style. Your main objective will be to reach the final machine and drop your file on the disk in OPSEC safe way. And all of these things you have to do it with Cobalt Strike.

You will have 24 hours to complete it and you can save your state in between across 7 days of span. And you have unlimited attemptes (7 days of cool down period after each exam attempt) and for the lab, you can access it once a day before doing the same lab again. (It was truly unlimited attempts and lab were able to spawn 3 times a day I belive in start, but Rasta had to change it because people were spawing it again & again lol, and Cobalt Strike is not free, Rasta was getting looted lol)

**BEST LABS & EXAM FORMAT!**

{{< figure src="/images/blog/blog-crto/benefits.png" alt="benefits from official website" caption="benefits from official website" align="center" >}}

### Pricing

It's the best part. It supports PPP according to your country, which makes it most valuable cert. You can check it at checkout. Offsec, learn from Rasta!

### Course Review

I don't think so I need to tell this but it has the one of the finest and detailed course. Especially the Keberos and Cross Domain part. I already knew about both from varous sources but when I studied these from here! It was neatly explained. Kerberos module goes really deep and I don't know if any other platform has this clean and easy to understand explaination.

I won't talk much about this as if you are planning for this, then you know how good and reputable this course is. And best part is, you will have lab in almost every module. So you will able to applly everything you have learned on the modules. (Also each lab has guided on screen instructions, which will help you get familiar with Cobalt Strike and how it works.)

{{< figure src="/images/blog/blog-crto/course-content.png" alt="Course content with labs, and videos" caption="Course content with labs, and videos" align="center" >}}

{{< dots >}}

## Note Taking

If you are someone like me who is coming from HTB Academy, then you will notice each modules are really short and very few commands. You can fit entire module in the single one note (except some modules).

{{< figure src="/images/blog/blog-crto/notes.png" alt="CRTO Notes" caption=" " align="center" >}}

Take detailed notes because they are goldmines. content itself is very short in the original course, but your notes and your words will help you whenever you want it during exam and after exam as well whenever you do anything with C2 related. I also recommend you to make seperate note for each labs as well.
I know all stuffs which is in the lab is already in the modules but still!

{{< figure src="/images/blog/blog-crto/notes-2.png" alt="CRTO Notes" caption=" " align="center" >}}

{{< dots >}}

## Exam Environment (Tools)

You will have one foothold machine and your own attacker machine, from where you will be running **Cobalt Strike**, and unline labs, you have to create your own artifact kit, load scrips, create profile etc. Once you have done that correctly, you are golden.

I mostly used **ldapsearch, SCShell, kerberos BOF, and SharpADWS** during exam. All tools and scripts are available in the exam as well which was in the lab, so you won't need to download anything from internet.

### Difficulty (Failed Attempts)

Yes, I failed twice before passing. 1st run took me around 13-14 hours in span of 6 days (sometimes university exams are headache more than ever, lol), and since it was 6 days or 7, i don't know but I started immediately for my next attempt.

It took me 3 hours now. Both time I did almost same mistake and reach till 75 and 84 respectively. I revisted initial modules about making kit and profile and after a week I started again and it took me 1 hour something this time. (I do not want to post grading page, as it covers where you need to do OPSEC safe way and spoil the fun for you)

So technically speaking, this exam is not hard, if you have done labs properly and have notes, this would be easy-medium. And this unlimited attempts makes it BEST cert ever. You get Cobalt Strike and lifetime update on quality content, what else we need!!

{{< dots >}}

## Recommendations and Tips

I don't think there's anything I need to say as course itself is more than sufficient. But still if I have to add something then it would be:

- **Take detailed notes, especially for labs**
- **Use `ldapsearch` in the environment**, and prepare default search queries from course and AI
- **Document as you are moving forward in the exam** (because your beacon would die if it's not persistent and you have to redo it)
- **Look at your command!** (you might be pasting same computer name from labs)
- Struggling the start? re-visit modules related to it

I know this is very vague review but I just want to tell that Course is more than enough to pass but if you still need anything else, [An0nUD4Y](https://github.com/An0nUD4Y/CRTO-Notes) is still relevant.

CRTO, Zero-Point discord, Rasta and community are the best!

## Mentions

Huge thanks to **Mitchell**, man you are the best!

**zzzz**, **timmytrill** our discussion flying high! 🚀 Always appriciated you guys.

## What's next?

Currently I am on to a Cloud project similar to the Prowler but focused on service-by-service scanning and some other Vulnerability research (got success with 6 CVEs so far).
But most importantly, I am looking for a full time job. I am going to gradute in this May 2026 and I really appriciate if I can get any help in my journey. Thank you for reading :)

To connect with me, [LinkedIn](https://www.linkedin.com/in/snehbavarva/) or [snehbavarva.com](https://snehbavarva.com) make sure to drop a message after connecting!

{{<seperator>}}
