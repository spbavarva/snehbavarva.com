---
title: "React2Shell — CVE-2025–55182: Critical Vulnerability in React Server"
description: "Technical breakdown of React2Shell (CVE-2025-55182)"
date: 2026-02-13
draft: true
tags: ["React", "CVE-2025-55182", "RCE", "CVE", "React2shell", "javascript", "Appsec", "Deserialiozation", "PrototypeChain", "ReactServerComponents", "RCS", "FrameworkSecurity", "Vulnerability", "VulnerabilityResearch", "testing", "Git"]
categories: ["Appsec"]
showToc: true
---

{{< figure src="/images/blog/blog-7-react2shell/all-data.webp" alt="all data image" caption=" " align="center" >}}

Vuln with easy chain and **CVSS:10**

After so long i have been writing blog and I have been researching on this vuln. I know time has passed on this but still I haven’t looked at this with my own view so hence here it is.

Also I have prepared content with [NotebookLM](https://notebooklm.google/) this time to see how it looks.

with my next blog, I will be solving a react2shell challenge which will be more helpful.


## 5 Realities Behind the React2Shell Vulnerability
The rapid industry-wide adoption of React Server Components (RSC) has introduced a new layer of abstraction to the modern web stack. While these components offer significant performance gains, they also create a complex new attack surface. The discovery of the **React2Shell** vulnerability (**CVE-2025–55182**) serves as a definitive case study in how framework-level logic can be weaponized.
{{<newline>}}

Affecting React **19.0.0** (and patched in 19.0.1), this was not a traditional application-level bug caused by a developer forgetting to sanitize a form input. Instead, it was a systemic failure in the trust boundaries of React’s internal **Flight Protocol**, specifically during the deserialization of untrusted data. As a security researcher, the ingenuity of this exploit lies in how it chains basic JavaScript behaviors to achieve Remote Code Execution (RCE).
{{<newline>}}

Here are the five technical realities behind the React2Shell vulnerability.

{{< dots >}}

### 1. The “Thenable” Trap: JavaScript Duck-Typing as an Attack Vector

In JavaScript, engines often determine if an object is a Promise not by its class, but by the presence of a `.then` property—a concept known as "duck-typing." These objects are called **thenables**. React’s internal logic relies on this behavior to handle asynchronous data streaming.


The vulnerability stems from a lack of type-validation during deserialization. When the Flight parser encounters a thenable, it attempts to resolve it by calling: `value.then.call(value, resolve, reject)`


The framework assumes it is interacting with a legitimate `Chunk` object. However, an attacker can provide a plain object that "pretends" to be a Promise. By hijacking the `this` context, the attacker forces React to call its own internal `Chunk.prototype.then` method, but with the attacker’s malicious object as the context.


>_“The process is dangerous if: The input is untrusted [and] the code assumes the data is safe.”_


This highlights a failure in modern JS frameworks that prioritize performance-oriented streaming over strict schema enforcement.

{{< dots >}}

### 2. The Flight Protocol: Why Standard JSON Wasn’t Enough

Standard JSON is too limited for the requirements of React Server Components. It cannot represent functions, promises, or the complex cyclical references required to stream UI updates. To bridge this gap, React uses the **Flight Protocol**, a custom format that allows for the “revival” of complex objects on the server.

{{< figure src="/images/blog/blog-7-react2shell/table-data.webp" alt="table data image" caption=" " align="center" >}}

Because the Flight Protocol must reconstruct “live” objects, the deserialization process involves far more risk than a simple ```JSON.parse``` call, creating a gateway for prototype-pollution-adjacent logic.

{{< dots >}}

### 3. The Payload Tool: The Array-to-Function Constructor Chain

{{< figure src="/images/blog/blog-7-react2shell/exploit-data.webp" alt="exploit data image" caption=" " align="center" >}}

To achieve RCE, an attacker needs access to the `Function` constructor, which can transform strings into executable code. The React2Shell exploit retrieves this constructor without ever explicitly including the word "Function" in the payload string.


The attacker utilizes a precise reference — specifically `$1:then:constructor` to navigate the JavaScript prototype chain:

1. `[]` is an empty Array.
2. `[].constructor` points to the `Array` global object.
3. `Array.constructor` points to the `Function` constructor.

{{<newline>}}

By guiding the framework through this chain, the attacker “harvests” the `Function` constructor and stores it within the payload's internal references. This harvested constructor becomes the engine for the final execution.

{{< dots >}}

### 4. The “Imposter” Object: Exploiting Context Injection

{{< figure src="/images/blog/blog-7-react2shell/chain-data.webp" alt="chain data image" caption=" " align="center" >}}

The core of the delivery mechanism involves crafting an “imposter” object that mimics the internal structure of a React `ResolvedChunk`. The attacker provides an object with a `status: "resolved_model"` and a custom `_response` field.


Because this object matches the expected “shape” of a legitimate framework object, the internal `initializeModelChunk` function accepts it as trusted and proceeds to "revive" it. During this revival process, the `Function` constructor harvested in the previous step is stored in the imposter object’s `_formData` field.


>_“This is a framework-level bug, not an application bug.”_


This is a classic case of context injection. By the time React realizes it is processing user data, the attacker has already overwritten the framework’s internal metadata with instructions to execute the stored `Function` constructor.

{{< dots >}}

### 5. The “Comment Trick”: Precision Execution and the NaN Bypass

The final execution occurs within the “Case B” (Blob) logic of the `parseModelString` function. Here, the framework attempts to reconstruct a data entry by concatenating a `prefix` and an `id`.


The attacker uses a reference like `$B`. When the parser processes this, it executes `parseInt(value.slice(2), 16)`. Since `$B` sliced from index 2 results in an empty string, `parseInt("")` returns `NaN`. The parser then appends this to the attacker's `_prefix`.


To prevent a `SyntaxError` that would crash the process before the payload executes, the attacker appends `//` (a JavaScript comment) to their code. If the injected code is ``console.log('☠️')//``, the final string becomes: ``console.log('☠️')//NaN``


The comment ensures the `NaN` is ignored, allowing the malicious code to execute with surgical precision.

{{< dots >}}

## Conclusion

The fix in React 19.0.1 moved beyond simple patches. The framework now uses non-injectable Symbols for key internal identifiers. Because Symbols are unique and non-serializable, an attacker cannot “type” a Symbol into a Flight string to impersonate a framework key. This creates an impassable boundary between user-supplied data and internal framework state.


React2Shell reminds us that as our frameworks become more powerful, their internal protocols become as sensitive as the application code we write on top of them.


**Final Thought:** Should we begin treating framework-level security with the same scrutiny as our own application code, or have our modern abstractions become too complex to fully audit?



{{<seperator>}}