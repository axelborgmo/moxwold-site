# Minimal local music revision — 25 October 2026

User superseded the portfolio redesign. The original homepage and About page
were restored from the repository's baseline, with these requested edits only:

- Homepage subtitle: SOFTWARE · MUSIC · OSLO, with original email placement.
- Original glyph vocabulary and animation, with a single ♪ in one slot per replay.
- About: independent Norwegian technology and music company.
- About opens directly on the black company introduction; the white ABOUT hero
  and its unused animation code are removed. Navigation is light on black.
- Removed the introductory Moxwold/Established2025 label and repeated footer.
  Company details remain in the company-information section only.
- Software and music have the same emphasis; the software-development em dash
  is removed. About's cursor gently stretches with motion (maximum1.22×).
- Services: Software development, Music production, Consulting; no numbers.
- Consulting covers software and music projects; no "hands-on technology" wording.
- Music production description has no genre list.
- No personal biography, clients, project credits, research paper or audio playback.
- Removed task-created separate Music/Software pages and their unused shared assets.

Existing fonts, crop marks, grain, layout and original About color sections remain.
No colored Software/Music hover treatments remain because those new links are gone.
The original interval wake-up was not reintroduced; animation uses animation frames
and visibility/resize events. Replay remains keyboard accessible.

## Checks

- `node --test tests/site.test.mjs`: seven passing tests, including 29 deterministic
  simulations of the actual scramble. Every active frame has exactly one note,
  the other symbols use the original vocabulary, and each replay restores MOXWOLD.
- Both inline scripts compile; JSON-LD parses; local links and two-page sitemap validate.
- Browser readback confirms original home layout and company-only About content,
  unnumbered services in the requested order, and no personal/client/project copy.
- Both pages checked at actual CSS widths320,390,768,1280: no document-level
  horizontal overflow. Temporary viewport override reset afterward.
- Live replay readback showed exactly one note and the original glyph vocabulary.
- Follow-up About change: black opening and light navigation verified at widths
  320,390,768,1280 with no horizontal overflow or header/content overlap; no logged
  browser errors. Viewport override reset and result left open at the introduction.
- Refinement verified in browser: software/music use identical computed font and
  text-shadow; intro label/footer absent; one visible organization number remains
  in company information. Cursor movement produced a gentle1.208× stretch in the
  sampled frame. Rechecked320/390/768/1280 without overflow or header overlap.

Local preview: http://127.0.0.1:4178/ . The requested preview server/tab remain open.
No push, publication, DNS, email, hosting or other external changes were made.
