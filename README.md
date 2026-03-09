# Advanced Digital Retail Shopping Platform (ADRSP)

A full-featured e-commerce web application built as a Problem Based Learning (PBL) project for KL University Hyderabad.

## Live Demo
> Deploy via Vercel — connect this repo and deploy instantly.

---

## Features

### Frontend (FWD)
- 18 product categories powered by [DummyJSON API](https://dummyjson.com)
- Product pages with INR pricing (1 USD = ₹83.5)
- Add to Bag, Cart, and Checkout flow (3-step)
- Light / Dark theme toggle
- User authentication (Sign Up / Sign In) via localStorage
- Customer Reviews with star ratings
- AI-powered features via Gemini 1.5 Flash:
  - Price prediction insight
  - Price comparison (Our Store vs Flipkart vs Amazon)
  - Deal finder banner
  - Review polish

### Backend / DSA (Java)
| File | CO | Data Structure |
|------|----|----------------|
| `ProductSearch.java` | CO-1 | Linear Search, Binary Search |
| `ProductSort.java` | CO-1 | Bubble, Quick, Merge Sort |
| `Cart.java` | CO-2 | Doubly Linked List |
| `BrowsingHistory.java` | CO-3 | Stack (Array + Linked List) |
| `OrderProcessing.java` | CO-3 | Queue (Linked List + Circular) |
| `ProductLookup.java` | CO-4 | Hashing (Division, Mid-Square, Folding, Multiplication) + Collision handling |

---

## Tech Stack
- HTML, CSS, Vanilla JavaScript
- [DummyJSON API](https://dummyjson.com) — product data
- [Gemini 1.5 Flash API](https://ai.google.dev) — AI features
- Google Fonts — DM Serif Display + DM Sans
- Java — DSA implementations

---

## Project Structure
```
├── index.html
├── product.html
├── cart.html
├── checkout.html
├── login.html
├── signup.html
├── [category].html        ← 18 category pages
├── script.js
├── style.css
├── ai-features.js / .css
├── reviews.js / .css
├── sidebar-nav.js
└── dsa/
    ├── ProductSearch.java
    ├── ProductSort.java
    ├── Cart.java
    ├── BrowsingHistory.java
    ├── OrderProcessing.java
    └── ProductLookup.java
```

---

## Setup
No build tools needed. Open `index.html` directly in a browser or deploy to Vercel.

---

## Team
- **Aniketh** — KL University Hyderabad, CSE
