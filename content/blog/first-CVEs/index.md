---
title: "How my curiousity gave me 2 CVEs!"
description: "Journey of CVEs finding path...."
date: 2025-06-04
draft: false
tags:
  [
    "CVE",
    "CVE-2025-46203",
    "CVE-2025-46204",
    "FirstCVE",
    "OpenSource",
    "AppSec",
    "SecurityResearch",
    "Cybersecurity"
  ]
categories: ["CVE", "OpenSource"]
showToc: true
---

>  _“Curiosity will conquer fear even more than bravery will.”_
> _~James Stephens_

Trust me it was all curiosity for getting these CVEs!

## How I started about CVEs

Like many in cybersecurity, I always wanted a CVE published under my name. It doesn't bring monetary rewards, but it provides a genuine sense of accomplishment that I've contributed something meaningful, helping secure software that others rely on

### My initial (and Failed) attempt(s)

A good friend of mine had 33 CVEs, and this motivated me immensely. Inspired, I started seriously looking into vulnerability hunting in November 2024. I read countless blogs, cloned many GitHub repositories onto a dedicated VM, ran numerous applications, conducted source code analyses, and tested various random ideas.

Interestingly, I found several bugs in some applications. However, I hit a roadblock! I didn't know how to properly register these bugs or create valid Proof-of-Concepts (PoCs). Simply because I can see my vulnerabilities in the code but when I try to exploit them, it's all in the local environment and on main application it never worked. This happened with 4-5 bugs and I dropped the idea of getting CVE back then and come back to it later on.

{{< dots >}}

## Changing the mindset

By the end of April 2025, my perspective shifted. Now, my goal wasn't just to earn a CVE; I genuinely wanted to contribute to cybersecurity and help secure others.

Surprisingly, one podcast of [Armann](https://www.linkedin.com/in/armaan-sidana/) came on my YouTube feed. It had only few hundreds views and looks very generic, I was just sitting and thought to just start in the background and do my other work.
I heard that guy got 7 CVEs under his name and got curious about how he found that.

I did some OSINT on the guy and check where he found his CVEs. I thought okay let's give it a try on that Unifiedtransform application (3k ⭐, 1.3k forks on GitHub).

{{<seperator>}}

### Discovering the bugs

I set up Unifiedtransform locally and followed the official instructions to get familiar with the application. It had three distinct roles: Admin, Teacher, and Student. After exploring thoroughly as an admin, an intriguing thought crossed my mind:

> _What if I tried accessing an admin-only endpoint as a teacher?_

and that was my "aha!" moment!💡

(I have detailed the Proof-of-Concepts for both my CVEs clearly on GitHub)

🔗 [CVE-2025-46203](https://github.com/spbavarva/CVE-2025-46203)
🔗 [CVE-2025-46204](https://github.com/spbavarva/CVE-2025-46204)

### Found bugs now what?

I was super happy that now I have proper bugs which are not duplicates and it's on popular repo. I just have to contact the vendor, make PoC and register for the CVEs. But how to proceed with disclosure?

For this process, I can't thank enough to Florian. Who wrote amazing writeup titled ["found-a-vulnerability-3-easy-steps-to-submitting-a-cve"](https://medium.com/@dub-flow/found-a-vulnerability-3-easy-steps-to-submitting-a-cve-012148533650) on his medium on what to do after finding a vulnerability.

I followed his process. Raise the issue for vendor, made PoCs, registered on CVE forms.

And as he mentioned, waiting is the worst part!
{{<seperator>}}

### After submission

After submitting, I expected a response within a week or two. However, the wait stretched to an anxious six weeks before finally receiving my CVE IDs.

Even after CVE numbers were assigned, I mistakenly listed the software version as 'X' in my initial submission, overlooking the guidelines. I had to correct this mistake twice, which taught me a valuable lesson:

Always read the guidelines thoroughly before finalizing your submissions!
{{<seperator>}}

## FINALLY!!

I got my first two CVEs on my name and day can't be better!

- [CVE-2025-46203](https://www.cve.org/CVERecord?id=CVE-2025-46203)
{{<newline>}}
- [CVE-2025-46204](https://www.cve.org/CVERecord?id=CVE-2025-46204)
{{<newline>}}
{{<newline>}}

{{< figure src="/images/blog/blog-5-CVE/finally.gif" alt="FINALLY" caption="" align="center" >}}


## What I learned

- The importance of patience
- Clear documentation is everything
- Even “simple” bugs matter
- Open source needs more eyes

{{< dots >}}

## What's next

I will keep continueing looking for open source work and next time I will try to find on something even more popular thing.

I'm motivated more than ever to continue contributing to open source security. My next goal is targeting even more popular projects and uncovering impactful vulnerabilities.

I’d love to connect with others interested in security research! Feel free to reach out via my [contact](/contact) page, schedule a meeting on Calendly/Topmate, or connect directly on [LinkedIn](https://www.linkedin.com/in/snehbavarva/). Let's secure software together!

{{<seperator>}}
