# moxwold-site

Interactive company site for **Moxwold AS** — a kinetic-typography landing page plus
an animated About page with company, services, contact, and registration details.
Vanilla HTML/CSS/JS, with no build step or dependencies beyond Google Fonts.

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

## Local music revision

The original homepage layout is retained; About starts directly with its black
company introduction. The homepage replaces CONSULTING with MUSIC.
The scramble uses its original character set plus one
musical note at a time. About describes the company's software, music production
and consulting services without personal profiles or project/client credits.

Local-only preview (no push or publication): http://127.0.0.1:4178/

```sh
python3 -m http.server 4178 --bind 127.0.0.1 --directory /Users/axel/Developer/Moxwold/moxwold-site
node --test tests/site.test.mjs
```

Reuse the existing preview server if it is running. No audio playback is enabled.
