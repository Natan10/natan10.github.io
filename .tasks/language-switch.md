# Language switch: English and Portuguese

> Build this with **tlc-implement** (`.claude/skills/tlc-implement`).
> Every criterion below becomes a check with a proof, referenced by its number. Nothing under
> `Unresolved` gets settled while building.

## Intent

Today the page exists in English only. Recruiters from other countries read English, and the owner confirmed that is what they use. Brazilian recruiters and companies, where the owner's last three employers are, have to read a terminal-style page in their second language or ask the owner for a Portuguese version. Nothing is measured: the site is not deployed, so there are no visitor figures and nothing is instrumented.

After this ships, the same page exists in Brazilian Portuguese at `/pt`, and English stays at `/`. A visitor switches with a toggle in the hero or the `/language` command; the other language opens at its top. A Portuguese link can be shared and always opens in Portuguese. Content and labels switch; command names stay in English. Source: `.design/language-switch.md` (draft, decision committed by the owner, 2026-10-10).

37 criteria in 6 slices · 4 one-way doors · 1 unresolved: 0 block, 1 blocks go-live, 0 open

## Criteria

### Locale

1. When `/` is requested, then the response is 200, the page language is `en`, and the page is the English page that exists today.
2. When `/pt` is requested, then the response is 200, the page language is `pt-BR`, and the page has exactly one `h1` containing "Natan Moreira".
3. When `/pt/anything` is requested, then the response is 404.
4. While JavaScript is disabled, `/pt` contains the sections `user`, `experience`, `skills`, `projects`, `takeaways` and `contact`, in that order, each framed with its English command label (`[CMD: /user]` … `[CMD: /contact]`), and is readable without any script.
5. Always, every browser test that exists today and loads `/` passes unchanged.

### Content

6. When `/pt` is read, then the identity section shows the Portuguese bio, location and availability text; the name and the tags are identical to `/`; the job title stays in English (`Software Engineer`); the bio uses gender-neutral wording and no gendered adjectives (for example a noun phrase instead of "apaixonado" or "apaixonada").
7. When `/pt` is read, then the experience section has the same number of entries as `/`, in the same order, with the same companies and stack chips; each entry has the same number of achievements as on `/`; location and achievements are Portuguese text written verb-first with the subject implied, in the present tense for the current role and the past tense for earlier ones, as the English is; the current role's period reads `07/2025 – Atual`; the role stays in English (for example `Senior Frontend Engineer`).
8. When `/pt` is read, then the skills section lists the same labels in the same order with the same bars and percentages as `/`; the group headings read `Frontend`, `Backend`, `Dados`, `Cloud`, `Práticas`, `IA`.
9. When `/pt` is read, then the projects have the same names, links, stacks and stars as `/`, with Portuguese descriptions; the takeaways have the same count and order as `/`, with Portuguese titles and details; the contact entries have the same labels, values and links as `/`.
10. When `/pt` is read, then the CV link in contact has the same `href` and `download` name as on `/` and its text is `Baixar CV em inglês (Natanael_Moreira_Resume.pdf)`.
11. Always, the byte counter of each section frame on `/pt` equals the UTF-8 byte length of that section's lines (an accented letter counts as 2 bytes), and its line counter equals the number of those lines.
12. If a translatable Portuguese field is missing, then `npm run build` fails with a type error.
13. Always, values that are not translatable (skill levels, stacks, links, company and project names, stars, contact values) are identical on `/` and `/pt`.

### Interface text

14. Always, on `/pt` no English interface string that has a different Portuguese entry appears in the visible text or the accessible names of the page, outside the translated content, and the page's labelled regions (`Session boot log`, `Command output`, the prompt's `Command` label, the stack and tag lists) carry Portuguese names; decorative phrases (the hero's hardware line, the boot card sentences, the diagnostics text) are translated, while terminal tokens (`NORMAL`, `COMMAND`, `UTF-8`, `VIM 9.1`, `BUF #1`, `[RO]`, the prompt string, `NODE: node-01a.sfo3`, the `BAUD … TERM` line, the `cv` label, error codes) are identical to `/`, and the `[SESSION BOOT: …]` line is translated.
15. When `/help` runs on `/pt`, then the output prints a Portuguese heading and one line per command in registry order, each with its Portuguese description, and the command names and aliases are unchanged (`/user`, `:theme`, `/clear`, `:c`, `:w`, `:q`, `/language` and its alias `:language`).
16. When unknown input `foo` runs on `/pt`, then the output echoes the command, prints a Portuguese message that begins with the code `E492:` and ends with `foo`, then a Portuguese hint to try `/help`.
17. When a section command (`/user`, `/experience`, `/skills`, `/projects`, `/contact`, `/takeaways`) runs on `/pt`, typed or from a chip, then the section scrolls into view and highlights, and the output prints that section's Portuguese result line, which keeps its pseudo-file path (for `/skills`, `~/.terminal/skills.json`).
18. When `:w`, `:q`, `:theme` or `:theme nord` runs on `/pt`, then the output is Portuguese; `:theme xx` prints `E474:` followed by a Portuguese message and the valid theme names unchanged.
19. Always, the macro chips on `/pt` show the same bracketed command names as on `/` (seven chips) with Portuguese captions.

### Language switch

20. Given `/` scrolled to the skills section, when the PT item is clicked, then the URL becomes `/pt` with no fragment and the page is scrolled to the top; from `/pt` the EN item gives `/` the same way.
21. With JavaScript on, the toggle link's `href` is exactly `/pt` on `/` and `/` on `/pt`.
22. While JavaScript is disabled, the other language's item is a link to `/pt` (or `/`) with no fragment, and following it loads that page.
23. When `/language pt` (or `:language pt`) runs on `/`, then the page navigates to `/pt`; when `/language en` (or `:language en`) runs on `/pt`, then it navigates to `/`; neither adds a fragment.
24. When `/language` runs with no argument, then the output lists `en | pt` and names the active language, as `:theme` does (`themes: …` / `active: …`), in the active language.
25. If `/language xx` runs, then the output prints `E474:` followed by an unknown-language message and the valid options `en | pt`, in the active language; the page does not navigate.
26. When `/language` names the language already active, then the output says it is already active and the URL does not change.
27. Always, a theme saved before switching is applied to the target page before first paint (`data-theme` is set on the page's root element when the page loads).
28. When the language is switched, then the output stream shows only the boot card and the prompt history is empty on the target page.
29. The toggle is in the top-right corner of the hero card, above the macro chips, with two items `EN` and `PT`; the active item is marked `aria-current="true"` and is not a link; the other item is a link whose accessible name is the language's own name (`English` or `Português`) with the matching `lang` attribute; at 375px width each item is at least 44px tall; keyboard focus shows a 2px outline.

### Metadata

30. When `/` is requested, then the title is `Natan Moreira — Software Engineer`, the canonical address is `/`, and the page declares `/pt` as its `pt-BR` alternate and `/` as its `en` alternate.
31. When `/pt` is requested, then the description is Portuguese text containing "Natan Moreira", the title is `Natan Moreira — Software Engineer`, the canonical address is `/pt`, and the page declares both alternates as in 30.
32. When either page is requested, then its `og:image` and `twitter:image` URLs resolve with 200 and `image/png`, and the image URL on `/pt` is a different route from the one on `/`.

### Fit and finish

33. Always, `/pt` passes the automated accessibility scan with zero violations in each of the six themes (`warm`, `gruvbox`, `dracula`, `nord`, `monokai`, `solarized`), including the page-language checks.
34. Always, `/pt` has no horizontal overflow at 375px, 768px, 1024px and 1280px in each of the six themes.
35. Always, the keyboard focus pass over `/pt` reaches at least 17 focusable elements, each with a visible 2px focus outline.
36. The README's content-editing section names where each language's content and interface text live, and documents `/pt` and the `/language` command.
37. When `npm run lint`, `npm run build` and `npm test` run, then all pass.

## Out of scope

- A Portuguese CV file - the owner has not supplied one; the CV download stays English on both pages and says so (criterion 10).
- Language detection from the browser or location - a shared link must open the same way for everyone.
- Remembering a visitor's language between visits - the URL is the state.
- Third languages and right-to-left text - nobody has asked.
- Translating job titles - the owner wants them in English, on both pages and in the page title.
- Translating command names, theme names, section ids, file paths, technology names, company names and the ASCII banner - they are identifiers or proper nouns.
- A visit counter or any analytics - none exists in the project, and the owner confirmed none is added now.

## Observable

| Surface | Decision | Landing |
| --- | --- | --- |
| screen `/` | empty, loading, error, unauthorised states | n/a - static page with no data, no sign-in and nothing to load |
| screen `/pt` | empty, loading, error, unauthorised states | n/a - same reason as `/` |
| screen `/pt` | density and ordering | 7, 8, 34 |
| screen `/pt` | destructive action confirms | existing - the output log is already discarded by `/clear` and reload; 28 states the case |
| screen unknown route | shape of the 404 page | 3 - Next's plain 404 page is accepted (owner confirmed) |
| control language toggle | states, focus, tap target, accessible name | 29 |
| control language toggle | works without scripts | 22 |
| command `/language` | output format and valid arguments | 24, 25 |
| command `/language` | alias | 15, 23 |
| command `/language` | exit behaviour when it fails halfway | n/a - a failed navigation leaves the current page as it was; the browser reports it |
| copy Portuguese text | structure and depth | 7, 9 |
| copy Portuguese text | tone | 7, 9 |
| copy Portuguese text | what the reader does next | 10, 29 |
| collection skills | grouping criterion, ordering | 8 |
| collection skills | duplicates and the exception that does not fit | n/a - same labels and groups as `/` |
| copy social preview | per-language image | 32 |

## Swept

- validation: 12, 25, 3
- failure modes: 12, 22
- idempotency and retry: 26
- authorization: n/a - public static pages with no sign-in or roles
- concurrency and ordering: n/a - the pages hold no shared or mutable state, and the language is carried by the route
- data lifecycle: n/a - the language is not stored anywhere (Out of scope); the saved theme is untouched, as 27 observes
- external-dependency failure: n/a - no runtime calls to other services; the font is self-hosted and the social images are built with the site
- state transitions: 20, 21, 23, 28
- observability: n/a - no analytics exist and none is added now (owner confirmed); revisit 30 days after the first deploy

## Impact

| Front | What changes |
|---|---|
| domain | new term: `language` - `en` at `/` or `pt` at `/pt` (page language `en` or `pt-BR`), carried by the route, lives in the route structure |
| domain | existing term: `content` meant the page's text; now means one language's text plus language-independent values stated once. Who reads it today: every section component, the identity component, the section-text helpers, the social image, the site-wide values, and the CV download in the terminal provider |
| domain | existing term: `site` (name, title, description) meant one description; now the description is per language, and the title stays English on both pages. Who reads it: the layout metadata, the hero, the social image |
| domain | existing term: command registry meant names plus English descriptions, results and chip captions; now it keeps names, aliases, kind, target and chip presence, and the texts come from the active language. Who reads it: `/help`, the macro chips, autocomplete suggestions, the terminal provider |
| domain | existing term: root layout meant one; now two, one per language, with no layout above them. Who relies on it today: the page metadata, the font, the theme pre-paint script, the global stylesheet, the favicon and the social image. Verified on a throwaway build: the favicon applies to both pages; a single social image at the top of the app attaches to neither page and appears only on the 404 page, so each language route owns its image |
| domain | new term: `/language` - the command that switches language, in the shared command registry |
| stored data | nothing to migrate; the saved theme in the browser is unchanged, and the social image URL gains a build hash (`/opengraph-image-<hash>`), which matters to nobody because the site is not deployed |

## Decided

| Decision | Shape | Alternative rejected |
|---|---|---|
| Language is the URL | `/` = `en`, page language `en`; `/pt` = `pt`, page language `pt-BR`; each page canonical to itself, each declares the other as alternate; no stored preference, no detection | `/en` and `/pt` with a redirect from `/` by `Accept-Language`: needs a proxy and a matcher library, rewrites shared links per visitor, and moves every existing `/` link and test; client-only switch: not readable without JavaScript and has no shareable link |
| Two root layouts, one per language | A route group per language, each with its own root layout, its own page-language attribute, its own metadata and its own social image route; no layout above them. Closes: any route outside the two groups has no layout, so unknown routes show Next's plain 404 page (owner accepted); switching language is a full page load, which is acceptable | One `[lang]` root layout with `/` rewritten to `/en` in a proxy: adds a proxy and rewrite semantics the project does not have; it wins if a third language is wanted |
| Language-independent values are stated once | Skill levels, stacks, links, company and project names, stars and contact values exist once and are shared; the Portuguese supplies only translatable text, so section entry counts cannot differ | Two complete content documents: nothing stops one from drifting from the other, and a missing entry would only show as a shorter page |
| Interface text is a typed dictionary per language | One shape for both languages, English as the source, a missing Portuguese entry is a type error, and the registry's descriptions, results and chip captions move into it | A translation library: a new dependency for two languages with no plurals or formatting, it wins if a third language arrives; inline language conditionals: nothing checks parity, which is the failure other teams report |

## Surface

| Route | In | Out | Status | Criteria |
|---|---|---|---|---|
| `GET /` | - | English page | 200 | 1, 30 |
| `GET /pt` | - | Portuguese page | 200 | 2, 31 |
| `GET /pt/<anything>` | - | not found | 404 | 3 |
| `GET` each page's social image route | - | `image/png` | 200 | 32 |

## Sources

- `.design/language-switch.md` - the design, amended during this plan in five places: canonical addresses (each page is its own canonical), `/language` no longer echoes (the page resets), social image per language route, language-independent values stated once, and the 404 page; Portuguese wording defaults 6 to 8 added.
- Next.js internationalization guide and route-groups reference, bundled with the installed version - sub-path routing, one dictionary per language, and the full page load between root layouts.
- Throwaway build of two root layouts (verified 2026-10-10): `/` renders with page language `en`, `/pt` with `pt-BR`, the favicon applies to both, and a social image placed at the top of the app attaches to neither page.
- Owner, 2026-10-10, in conversation - job titles stay in English and the Portuguese bio uses gender-neutral wording; defaults for the 404 page, the terminal phrases, the `:language` alias, the section kept on switching, analytics and the tone of the Portuguese were confirmed.
- `.specs/landing-page.md` - every section readable without JavaScript.

This task is the record of decision. If a linked document diverges, ask before building.

## Unresolved

| # | Kind | Question | Until answered |
|---|---|---|---|
| 1 | blocks go-live | Does the owner review the Portuguese copy before deploy? The first draft is written by Claude, and the owner is its only native reader. | Criteria 6 to 10 and 16 to 18 are satisfied by the draft text; the site is not live, so nothing ships until this is closed |
