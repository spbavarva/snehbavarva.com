---
title: "Obsidian sync from windows"
description: "Free and Automated way to sync your Obsidian notes from windows to GitHub"
date: 2025-05-08
draft: false
tags: ["Sync", "Obsidian", "Windows", "FREE", "notes", "powershell"]
categories: ["Notes", "Tool"]
showToc: true

---




## Overview

This PowerShell-based automation sets up your Obsidian vault to sync with a private GitHub repo every 15 minutes. 

- Automatic commit + push of your notes
- SSH key generation and registration
- Runs entirely on Windows Task Scheduler
{{<newline>}}

{{<newline>}}

---


## Getting Started

### Prerequisites

- [Git for Windows](https://git-scm.com/download/win)
- Obsidian vault (already created or new)
- A GitHub account
{{<newline>}}
{{<newline>}}

---

### Vault + GitHub Setup

Open PowerShell as **an administrator** in your Obsidian vault folder.

#### Generate SSH key

```powershell
ssh-keygen -t ed25519 -C "YOUR_EMAIL@gmail.com"
```
{{<newline>}}

When prompted:  (I recommend using Vault path for smooth flow and not default key path)
> `Enter file in which to save the key:` 
> ➜ Type: _**D:\your_obsidian_vault\id_ed25519**_

#### Enable and start SSH agent

```powershell
Set-Service -Name ssh-agent -StartupType Automatic
Start-Service ssh-agent
```
{{<newline>}}
```powershell
ssh-add D:\your_obsidian_vault\id_ed25519
```
{{<newline>}}
you should see output like: "_Identity added: path_"

#### Add key to GitHub

```powershell
Get-Content D:\your_obsidian_vault\id_ed25519.pub
```

Copy the full key (output start from `ssh-ed <SNIP> YOUR_EMAIL@gmail.com`) → Go to GitHub → **Settings → SSH and GPG Keys → New SSH Key** → Paste and save.

Test the connection:

```powershell
ssh -T git@github.com
```
prompt `yes` and you should see `Hi @your_username! blah blah`


### Create private GitHub repo

- Name it: `obsidian-sync`
- ✅ Mark it private
- ❌ Do not initialize with README or .gitignore

#### Initialize Git in your vault

```powershell
git init
git remote add origin git@github.com:yourusername/obsidian-sync.git
```

```markdown
{{< highlight powershell "style=monokai" >}}
Set-Content .gitignore ".obsidian/cache/`n.obsidian/workspace`n.obsidian/plugins`nid_ed25519`nid_ed25519.pub`nscripts/"
git add .
git commit -m "Clean initial commit: safe sync setup"
git branch -M main
git push -f origin main
{{< /highlight >}}
```

sdf

```powershell
skdf jwefwejifbwejifbwefiwebfwijfwebfkwjhfbwekhbfwekhfb wekjrfhnwekjrfbnwekjfbnw wekjfbnwkjfbnwkjfwfkbn wkejrfbnwkjfbwknfbwkwbf
```



{{<dots>}}

## Automation Script

Make new .ps1 file in the same directory and copy content from [this one-time PowerShell script setup_obsidian_sync.ps1](https://github.com/spbavarva/obsidian-sync-windows/blob/main/setup_obsidian_sync.ps1) and in same administartor pwershell.exe to automate syncing:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
.\setup_obsidian_sync.ps1 -VaultPath "D:\your_obsidian_vault" -PrivateKeyPath "D:\your_obsidian_vault\id_ed25519"
```
{{<newline>}}
This will:
- Generate `sync_obsidian.ps1` and `load_ssh_key.ps1`
- Create two scheduled tasks:
    1. SSH key loader at login
    2. Auto-sync every 15 minutes (runs silently in the background)

{{<newline>}}

{{<dots>}}

## Usage

Just update your notes in Obsidian - every 15 minutes the changes will be committed and pushed.

To test immediately:

```powershell
Start-ScheduledTask -TaskName "Obsidian_Auto_Sync"
```

You can verify pushes by checking your GitHub repository.


---