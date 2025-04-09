---
title: "ONE STOP SHOP"
description: "Built fully-fledged ecommerce platform protected against OWASP Top 10"
date: 2023-12-09
draft: false
showToc: true
tags: ["OWASP", "Security"]
cover:
  image: "/images/projects/OSS/XSS-protected.png"
  alt: "XSS-protected"
  caption: " "
  relative: false
---

It was basically my undergrade College Project and Built a responsive e-commerce platform using MERN stack with Razorpay integration for payments. Implemented features like product filtering, user reviews, delivery instructions, and secure data stored in MongoDB.

Added protections against attacks such as XSS, CSRF, Broken Auth., Path traversal, local file inclusion and more OWASP attacks

it was mainly web development project but I started learning about Cybersecurity at the same time so did some secure coding practice and tested for every OWASP Top 10 and my project successfully passed every check at that time. You can check my repo for project and leave below thing as it's just pure GPT.

🔗 [Backend](https://github.com/spbavarva/one-shop-stop-backend?tab=readme-ov-file)

🔗 [Frontend](https://github.com/spbavarva/one-shop-stop-frontend)

## 🛍️ One Shop Stop – Secure MERN Stack E-commerce Platform

**One Shop Stop** is a full-featured, responsive e-commerce platform built using the **MERN stack** (MongoDB, Express, React, Node.js). It integrates **Razorpay** for secure payment processing and prioritizes both functionality and security to provide a seamless user experience for customers and sellers.

{{<seperator>}}

### 🌐 Key Features

- 🔎 **Product Search & Filtering:** Easily browse, search, and filter products by categories or keywords.
- 🛒 **Shopping Cart:** Add multiple items, review your selections, and securely check out.
- 🗣️ **User Reviews & Feedback:** Customers can leave ratings and reviews to help others make informed decisions.
- 💬 **Delivery Instructions:** Personalized delivery options included at checkout.
- 🔐 **Secure Registration & Login:** Role-based access and protected authentication flow for users and admins.
- 💳 **Razorpay Integration:** Safe and smooth transactions through Razorpay’s payment gateway.

{{<dots>}}

### 🔐 Security Enhancements

Security was a top priority in the development process. The platform is protected against multiple OWASP Top 10 vulnerabilities:

- ✅ **XSS (Cross-Site Scripting):** DOMPurify and input sanitization are used across all user inputs to prevent malicious script injection.
- ✅ **CSRF (Cross-Site Request Forgery):** Routes are CSRF-protected with token validation in sensitive operations.
- ✅ **Path Traversal & Local File Inclusion (LFI):** All routes are controlled via React Router, and uploads are validated to reject any file types like `.php`, `.phtml`, etc.
- ✅ **Broken Authentication:** Proper session and token management ensures secure user identity.
- ✅ **Secure Upload Handling:** Files are validated and sanitized before being stored, preventing injection and traversal attacks.

> _“If a user tries to upload a file with unsafe extensions, the system immediately blocks it and notifies them with a warning.”_

{{<dots>}}

### 📈 Admin & Seller Tools

Sellers and admins can:

- View analytics and graphs for customer behavior
- Manage product inventory and orders efficiently
- Identify popular products by category or demographic
- Maintain a database of recurring customers and preferences



### 📦 Scalable & Future-Proof

Designed with scalability in mind, One Shop Stop can easily expand to support a growing catalog and user base. The modular architecture allows integration of additional services, such as AI-based recommendations or multi-language support.

{{<dots>}}

### 🎯 Conclusion

> _"One Shop Stop aims to become a globally accessible and secure e-commerce platform, balancing intuitive design with enterprise-grade protection."_

This project reflects real-world e-commerce challenges and solutions with a focus on modern security practices, cloud integration, and data-driven decision-making.

{{<seperator>}}
