---
title: "SmartyPants"
date: 2025-02-27
retire_date: 2025-02-27
description: "HTB sherlock"
tags:
  [
    "htb",
    easy",
    "SmartyPants",
    "Hayabusa",
    "WMI",
    "Incident Response",
    "IR",
    "DFIR"
  ]
difficulty: "Very Easy"
event: "HackTheBox"
author: "CyberJunkie"
cover:
  image: "/images/ctf/htb/smartypants.png"
  alt: "Phantom Check"
  relative: true
---

{{< sherlock-info-shortcode >}}

## What we gain?

## Scenario

Forela's CTO, Dutch, stores important files on a separate Windows system because the domain environment at Forela is frequently breached due to its exposure across various industries. On 24 January 2025, our worst fears were realised when an intruder accessed the fileserver, installed utilities to aid their actions, stole critical files, and then deleted them, rendering them unrecoverable. The team was immediately informed of the extortion attempt by the intruders, who are now demanding money. While our legal team addresses the situation, we must quickly perform triage to assess the incident's extent. Note from the manager: We enabled SmartScreen Debug Logs across all our machines for enhanced visibility a few days ago, following a security research recommendation. These logs can provide quick insights, so ensure they are utilised.

## Provided artifacts


## Task 1

_Question: The attacker logged in to the machine where Dutch saves critical files, via RDP on 24th January 2025. Please determine the timestamp of this login._

## Task 2

_Question: The attacker downloaded a few utilities that aided them for their sabotage and extortion operation. What was the first tool they downloaded and installed?_

## Task 3

_Question: They then proceeded to download and then execute the portable version of a tool that could be used to search for files on the machine quickly and efficiently. What was the full path of the executable?_

## Task 4

_Question: What is the execution time of the tool from task 3?_

## Task 5

_Question: The utility was used to search for critical and confidential documents stored on the host, which the attacker could steal and extort the victim. What was the first document that the attacker got their hands on and breached the confidentiality of that document?_

## Task 6

_Question: Find the name and path of second stolen document as well._

## Task 7

_Question: The attacker installed a Cloud utility as well to steal and exfiltrate the documents. What is name of the cloud utility?_

## Task 8

_Question: When was this utility executed?_

## Task 9

_Question: The Attacker also proceeded to destroy the data on the host so it is unrecoverable. What utility was used to achieve this?_

## Task 10

_Question: The attacker cleared 2 important logs, thinking they covered all their tracks. When was the security log cleared?_