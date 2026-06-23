# moxwold-site

Single-page interactive site for **Moxwold AS** — a self-contained kinetic-typography
art piece (vanilla HTML/CSS/JS, no build step, no dependencies beyond Google Fonts).

**Live (staging):** https://axelborgmo.github.io/moxwold-site/

## Put it on moxwold.com — one DNS change (~2 min)

Email (Fastmail MX) is NOT affected — only the website A record changes.

At Domeneshop → domene.shop → *Mine domener* → moxwold.com → *DNS*:

1. Remove the existing A record:  `@  →  185.134.245.113`  (Domeneshop parking)
2. Add four A records on `@` (apex) → GitHub Pages:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
3. Add CNAME:  `www  →  axelborgmo.github.io.`
4. Leave every MX / TXT (email) record untouched.

Then in this repo: add a file named `CNAME` containing `moxwold.com`, and set
**Settings → Pages → Custom domain = moxwold.com**, tick **Enforce HTTPS**.
GitHub issues the TLS certificate automatically (minutes).
