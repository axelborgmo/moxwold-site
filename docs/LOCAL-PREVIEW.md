# Music and software revision — 25 October 2026

The homepage keeps its original identity: SOFTWARE · MUSIC · OSLO, original
email placement and glyph vocabulary, and exactly one ♪ per active replay.
About contains only the introduction, unnumbered services and contact area.
There are no personal profiles, project credits, client lists, genre lists,
repeated company labels or audio playback.

## Latest requested changes

- Removed the full company-information block from About.
- Aligned introduction and services to the navigation inset and reduced the
  introduction's top/bottom spacing; removed its old viewport-height floor.
- Software/music emphasis responds to pointer proximity with bounded translation
  and chromatic separation. Layout/font metrics do not change with the pointer.
- Pointer effects are event-driven, settle to rest, and reset on blur or reduced
  motion; coarse pointers do not animate. No timers or periodic monitoring added.
- Required business details are reached through a small Company details link on
  both main pages, rather than shown as a large block in the About page flow.

## Verified before publication

- `node --test tests/site.test.mjs`: nine passing tests. Includes 29 deterministic
  actual-scramble simulations and tests of bounded/resettable pointer targets.
- Inline JavaScript syntax, JSON-LD, three-page links and sitemap pass.
- Browser: About sections are intro, practice, contact; the company table is absent.
- Pointer test: software translated3.48px/0.24px, shadow separation changed from
  3px to6.06px; music also reacted. This is visible text motion, not cursor-only.
- Reduced-motion emulation: transforms none, static3px emphasis, cursor hidden.
  Emulation removed afterward.
- Home/About/company pages checked at actual CSS widths320,390,768,1280 with no
  document-level horizontal overflow. Temporary viewport override reset.
- Company-details links work; browser console had no logged errors.

## Business-disclosure sources

Registered company details and VAT/Foretaksregisteret status read from the public
Enhetsregister API on25Oct2026. The page uses the registered business address.

- https://data.brreg.no/enhetsregisteret/api/enheter/935872200
- https://info.altinn.no/starte-og-drive/drive-bedrift/juridiske-og-regulatoriske-krav/krav-til-informasjon-om-foretaket-pa-nettsider-og-forretningsdokumenter/
- https://www.regjeringen.no/no/dokumenter/otprp-nr-31-2002-2003-/id172159/?ch=16

Production: https://moxwold.com/ . Local preview is used only during verification.
The existing free public GitHub Pages route is retained; no hosting/DNS/mail or
account-permission changes are part of this revision. Deployment receipts and
spending-guard restoration evidence are stored privately outside the repository.
