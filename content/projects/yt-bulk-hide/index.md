---
title: "YouTube Bulk Hide"
description: "Chrome extension to bulk-hide and auto-hide videos from your YouTube subscriptions feed"
date: 2026-04-19
draft: false
ptype: "Tool"
showToc: true
tags: ["Chrome-Extension", "JavaScript", "Productivity", "YouTube", "Tool"]
categories: ["Tool"]
---

**YouTube Bulk Hide** is a Chrome extension (Manifest V3) that lets you select and hide multiple videos from your YouTube subscriptions feed at once, plus set auto-hide rules for channels and title keywords. It scratches a personal itch: a subscriptions feed full of stuff I do not want to scroll past one tile at a time.

🔗 [github.com/spbavarva/yt-bulk-hide](https://github.com/spbavarva/yt-bulk-hide)

{{<seperator>}}

## What it does

- **Bulk select and hide.** Hover any video tile on your subscriptions page and a checkbox appears in the corner. Check as many as you want, then click **Hide selected** (or press `Shift+Alt+H`).
- **Auto-hide rules.** From the settings popup, add channel names or title keywords (one per line, case-insensitive substring match). Matching videos are hidden automatically on page load.

{{<dots>}}

## The interesting part: how the hiding works

The obvious way to hide a video is to reconstruct YouTube's internal `youtubei/v1/feedback` API call. That is 2 to 3 times faster, but it needs the full auth dance (`SAPISIDHASH`, `X-Goog-AuthUser`, visitor data) and breaks every time YouTube rotates its header contracts.

Instead, the extension programmatically opens each tile's 3-dot menu and clicks the native **Hide** item. It is exactly what happens when you hide a video by hand, so it is as stable as YouTube's own UI. DOM interaction only breaks when YouTube restructures tile markup, which is rare, versus header contracts that change often. A deliberate trade of speed for durability.

To stay safe, hiding throttles at about 250 ms per video to avoid menu-open race conditions, so hiding 40 videos takes roughly 10 seconds.

{{<dots>}}

## Under the hood

```
manifest.json       MV3 manifest
background.js       Service worker, routes the keyboard shortcut
content.js          Injected on the subscriptions page, core logic
content.css         Checkbox + toolbar styles
popup.html/css/js   Settings popup for auto-hide rules
icons/              16 / 48 / 128 px icons
```

No network calls, no tracking, no permissions beyond the YouTube subscriptions page. It is built for personal use and loads as an unpacked extension in Developer mode.

{{<dots>}}

## Room to grow

The code is written to be extended:

- **Regex keywords** by swapping the substring check in `applyAutoHide()` for a guarded `RegExp`.
- **Hide by video age** by parsing the published-time text on each tile and filtering anything older than N days.
- **Bulk undo** by keeping references to hidden tiles and re-clicking YouTube's own short-lived Undo link.

{{<seperator>}}
