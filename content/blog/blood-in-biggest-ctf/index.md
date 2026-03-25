---
title: "AI Just Got Me a Blood in the 2026's Biggest CTF. Are You Even Keeping Up?"
description: "How I used Claude Code with custom skills to solve CTF challenges autonomously..."
date: 2026-03-09
draft: false
tags: ["Artificial Intelligence", "Claude Code", "Cybersecurity", "Automation", "AI", "PicoCTF", "CTF", "HTB", "THM", "Bug Bounty"]
categories: ["AI", "Cybersecurity"]
showToc: true
---


> _"The ones who refuse to adapt are the ones who get exploited."_

You are 3 hours deep into the challenge, buried with binary files, opening IDA and Ghidra, using hundreds of different tools to analyze the binary and debugging each and every step. Your eyes are burning, classic.

Then you saw a post on X: 0xS0me0ne just solved the same challenge in 12 minutes. With AI!

Not another chat based AI. I'm talking a full-blown autonomous agent: Parsing the binary, Attaching the tools, Installing the tools, Everything is doing by its own. Twelve. Minutes.

That moment hit me different and I started to explore different AI and how can I use it in my work. Because AI is not coming for CTFs. It's already here. And if you're not using it, you're falling behind every single day.

**EVERY PART OF HOW TO GET FLAG IS REDACTED!**

{{< dots >}}

## Okay, But How Am I Actually Using This?

Here's where it gets fun. I'm not just reading about AI solving CTFs — I'm doing it. Every day. And the tool that changed everything for me is **Claude Code**.

For those who don't know [Claude Code](https://claude.ai)….. I don't know where are you living then honestly.

But the real power? **Skills!**

{{< figure src="/images/blog/blog-ctf-ai/skills-for-ctf.png" alt="skills for CTF" caption="skills for CTF" align="center" >}}

These Skills are just packaged instructions/methodology files (`SKILL.md`) that teach Claude your exact workflow for specific tasks. Think of it like giving Claude a playbook. And also there's one `CLAUDE.md` file which you can make, which will be gone through everytime whenever you give any task to get the basic context and make hallucinations lesser, that is not required in here so I am not discussing that. (in some other blog)

There are so many skills available on the internet and you can make your own skills as well as agents too. I have been experimenting with many different things and I have build so many skills for myself to solve any HTB and THM boxes. (will talk about that on some other blog)

{{< figure src="/images/blog/blog-ctf-ai/htb-pentester-agent.png" alt="htb-pentester agent demo" caption="just a small demo of htb-pentester agent" align="center" >}}

{{< dots >}}

## My Workflow: How I Actually Do It

So as I have made and get skills from internet, I just ahve to pit it in there and just give the simple prompt:

```bash
I have put some skills related to ctf. Learn from those and add them to your memory.
```

That's it! It will learn those skills and add those to it's memory files. Basically everything inside `.claude` is main body & brain of the Claude Code. Output and efficiency depends on how well you give the skills, how articulate you are when making the skills for a particular section. As you can see in the above image, I even have nested files which are referenced in the `SKILL.md` file, and it has all of the basic context as well as attacking things like how it has to approach particular kinds of problems. They are very long and generic things.

After learning that, AI can learn by itself, and as much as you use your skills, it will get better because memories are getting stored. If you visit that `.claude` folder, you will find so many different memory files in there. It is storing the memory of how you are using it.

And then you basically just have to give the prompt and it will use the relevant skills or you be little more specific when giving the prompt to save few tokens.

```bash
use your /solve-challenge skill to solve the challenge in the current directory (~/Desktop/ctf/ctf-challenge) files are: and this is under the reverse/binary category so use relevant skills needed for that. Description:"The flag is right in front of you; just slightly encrypted. All you have to do is figure out the cipher and the key." Hint-1:"The binary can be unpacked using a tool that's often pre-installed on Linux" Hint-2:"The program hides a secret. Look at how it's defined and used. Think XOR. What happens when you XOR something twice with the same key?" URL: nc candy-mountain.picoctf.net 50107
```

{{< newline >}}

{{< figure src="/images/blog/blog-ctf-ai/prompt-description.png" alt="prompt with description and file location" caption="prompt with description and file location" align="center" >}}

And it will solve the challenge or even can do the full pentest! Obvisously this can make way more better and faster with integrating different MCP(s) and improving `SKILL.md` and `CLAUDE.md` files.

{{< figure src="/images/blog/blog-ctf-ai/flag-picoctf.png" alt="flag for picoCTF challenge" caption="flag for picoCTF challenge" align="center" >}}

{{< figure src="/images/blog/blog-ctf-ai/hidden-cipher.png" alt="Hidden Cipher 1 challenge" caption=" " align="center" >}}

I did manage to solve few more just to test it but not showing everyone here, and funny part is it will make writeup too by itself if instructed.

{{< dots >}}

## Stop Reading. Start Doing.

It's uncomfortable truth that everyone has to accept:

> _If AI can solve 76.5% of CTF challenges, and 9 out of 10 web security challenges, can do whole pentest, what does that mean for the junior security analyst/junior pentester who relies on those same skills?_

(that reminds me of [krauq](https://bugcrowd.com/krauq). Solo person with AI, currently #1 in US and #2 worldwide)

It means the baseline is shifting. The things that used to make you valuable like knowing how to run Nmap, using basic way of burp suite, parsing logs manually, those are now table stakes that an AI can do in seconds. But here's the flip side and this is what I actually believe:

> _**AI doesn't replace the security professional. It replaces the security professional who refuses to use AI.**_

Look, I can write about this all day. But here's what I actually want you to take away:

> _**Add Claude Code to your daily routine. It will make your work 10x better.** Not "might." Will._

I started integrating it into everything — CVE hunting, HTB challenges, Sigma rule writing, bug bounty automation, even my SOC Analysis Lab build. The compound effect is real. You solve faster, you learn faster, you build faster. The cybersecurity landscape is moving. Fast. The people who integrate AI into their workflow today are the ones who will be leading teams and finding critical vulnerabilities tomorrow.

Don't be the second group.

{{< dots >}}

I'm actively working on several AI-augmented security projects right now from autonomous CVE hunting pipelines to AI-powered pentesting agents to detection engineering with LLMs. If you want to build something together, swap ideas, or just talk about where this space is headed, reach out.

Connect with me on [LinkedIn](https://www.linkedin.com/in/snehbavarva/) or drop a message on [snehbavarva.com](https://snehbavarva.com). I always reply, and I'm always down to collaborate on something new.

Let's build. TO THE MOON! 🚀

{{<seperator>}}
