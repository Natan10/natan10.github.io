# Language switch: English and Portuguese

> Plan from this document. Each slice below carries its own shape - copy it, do not re-derive it.
> Status: draft - decision committed by the owner, 2026-10-10; the five defaults listed under Work await the owner's review

## Situation

- Project: not shipped yet; all eight tickets of the landing page are done and nothing is deployed
- Decision: committed by the owner, 2026-10-10, in conversation
- In flight: copies the existing `:theme` command and shared command registry as the precedent for a switch that is also typed at the prompt; nothing else is in flight, and the CV file is specified nowhere and stays out
- At stake: reverted in an afternoon while nothing is deployed; the URL shape becomes expensive to change once links are shared

## Problem

Absence. The page is for recruiters in Brazil and in other countries. Recruiters from other countries read English, and the owner confirmed English is what recruiters use. Brazilian recruiters and companies cannot read the owner's experience in their own language, so they read English as a second language or ask the owner for a Portuguese version. Nothing is measured: the site is not deployed, so there is no visitor data and nobody has instrumented the substitute. The owner's statement of who the audience is stands in for it.

## Success

- Worked if: a Brazilian recruiter opens a Portuguese link and reads every section, label and message in Portuguese with no English sentence left except proper nouns and technology names; recruiters from other countries still land on English at `/`
- Going wrong: Portuguese visitors never appear in whatever visit counts exist, or the owner still gets asked for a Portuguese version of the page content
- Review: 30 days after the first deploy - the owner

## Boundary

In: Portuguese (Brazil) and English for the page content, the page's labels and fixed text, the command descriptions and messages printed at the prompt, the page title, description and social preview.

Out:
- A Portuguese CV file - the owner has not supplied one; the CV download stays English on both pages and says so.
- Language detection from the browser or location - a shared link must open the same way for everyone.
- Remembering a visitor's language between visits - the URL is the state.
- Third languages and right-to-left text - no one has asked.
- Translating command names, theme names, section ids and technology names - they are identifiers or proper nouns.

Unchanged: the root route stays English at its current address, so every existing test and link keeps working; section anchors are identical on both pages; the theme choice and its persistence do not depend on language; `cv.pdf`.

## Prior art

- Next.js's own guide puts the language in the URL sub-path and loads one dictionary per language, answering 404 for an unsupported language - we take the sub-path and the one-dictionary-per-language shape.
- The same guide redirects visitors by their `Accept-Language` header through a proxy and a matcher library - we do not, because we have one default language and a shared Portuguese link must not be rewritten for the visitor who opens it.
- The failure teams report is untranslated or missing strings reaching production - Key decisions 3 and 5 exist to stop it.

## Shape

The language is the route: English at `/` and Portuguese at `/pt`, each rendered completely at build time with its own page language attribute, and neither resolved on the client. All visible text comes from one active language, split into the personal content and the interface text, and a missing Portuguese entry fails the build. Switching language is a plain navigation to the other route, triggered from a visible control or a new `/language` command; it carries nothing over; the other language opens at its top. The heavier alternative - every language under its own prefix (`/en`, `/pt`) with a redirect from `/` by `Accept-Language` - wins only if a third language or automatic detection is wanted, and neither is.

## Key decisions

1. **The URL is the language: English at `/`, Portuguese at `/pt`, no stored preference and no detection.** This is the one decision that is expensive to reverse once a Portuguese link is shared. The two routes must not be able to resolve each other's content.
2. **Both languages are fully present in the HTML without JavaScript.** The landing-page spec requires every section to be readable with scripts off; language is therefore decided by the route, never by code running in the browser, and never by a flash-prone client switch.
3. **Content parity is enforced by the types, and language-independent values are stated once.** Every translatable field exists in both languages and a missing one is a build error. Skill levels, stacks, links, company and project names, stars and contact values are not translatable and are stated once, so the two pages cannot disagree on them or on how many entries each section has. English stays the source and the Portuguese is a translation of it.
4. **Identifiers and proper nouns are never translated.** Command names (`/user`, `/help`, `:theme`, `:w`, `:q`, `:c`), the new `/language`, theme names, section ids, company names, technology names, the ASCII banner and the owner's name stay as they are. Commands accepted at the prompt are the same on both pages.
5. **No literal English string may remain on the Portuguese page.** Every other visible string - labels, hints, `/help` descriptions, the `E492`-style messages, accessible names, the page title, description and social preview - comes from the active language. This is checkable by a test that loads `/pt` and fails on a list of known English sentences.
6. **Switching language is a navigation and resets the page.** The output stream, prompt history and scroll position start fresh, so the other language opens at its top; the theme survives because it is stored separately. A section anchor was dropped (owner, 2026-10-10): the toggle sits in the hero, so reaching it scrolls the visitor away from the section being read.
7. **Portuguese means Brazilian Portuguese (`pt-BR`)**, in the page's language attribute, the metadata and the wording.

## Work

| Slice | Delivers | Status |
|---|---|---|
| [Locale](#locale) | `/` in English and `/pt` in Portuguese render the same page, each with its own page language attribute | clear |
| [Content](#content) | Every profile, experience, skill, project, contact and takeaway field exists in both languages, type-checked | open — 1 default taken |
| [Interface Text](#interface-text) | Labels, hints, `/help` descriptions, error messages and accessible names come from the active language | clear |
| [Language Switch](#language-switch) | A visible control and `/language` move the visitor to the other route, at its top | open — 1 default taken |
| [Metadata](#metadata) | Page title, description, social preview and language alternates exist per language | clear |

Order: Locale → Content → Interface Text → Language Switch → Metadata.

Already handled by existing code: a visitor with a theme saved keeps it after switching, because the theme is stored apart from the route; an unknown `/xx` route answers 404 as any unknown route does.

Derivable from the repository, left to the plan: the dictionary shape, how client components receive the active language, how the pre-paint theme script is shared by both root layouts - all as the content layer and theme store do them today.

Defaults taken, awaiting the owner:
1. The CV download stays English on `/pt` and is labelled "CV (English)" there.
2. Portuguese is Brazilian (`pt-BR`).
3. Translation is written by Claude and reviewed by the owner before deploy.
4. The visible control sits in the hero beside the macro chips, as a two-state `EN | PT` toggle, and `/language` with no argument lists the languages and the active one, as `:theme` does.
5. Each page is its own canonical address in search results, and each declares the other as its language alternate. (Corrected: the first draft made `/` canonical for both, which would drop `/pt` from search.)
6. Natural-language phrases anywhere on the page, decorative terminal text included, are translated; terminal tokens (`NORMAL`, `COMMAND`, `UTF-8`, `VIM 9.1`, `BUF #1`, `[RO]`, file paths, the prompt string, and error codes such as `E492`) stay as they are.
7. Job titles stay in English on both pages and in the page title (the owner, 2026-10-10). The Portuguese bio avoids gendered wording until the owner says which grammatical gender to use.
8. An unknown route shows Next's plain 404 page instead of the themed one, because two root layouts leave no shared layout above them.

### Locale

**Delivers** `/` and `/pt` as two static pages sharing every component. **Status: clear.** This is the door of Key decision 1.

| State | What should happen | Caller sees |
|---|---|---|
| Visit `/` | English page, page language `en` | 200 |
| Visit `/pt` | Portuguese page, page language `pt-BR` | 200 |
| Visit `/pt/anything` or an unknown language | Not found; the page is Next's unthemed 404 (default 8) | 404 |
| Scripts disabled on `/pt` | Every section already readable in Portuguese | 200, full content |
| Existing English links and tests | Unchanged | 200 |

Alternatives considered: one dynamic `[lang]` segment with `/` redirecting to `/en` - wins if a third language is wanted.

### Content

**Delivers** the personal content in two languages with parity checked by the build. **Status: open — 1 default taken.**

| State | What should happen | Caller sees |
|---|---|---|
| Field present in English, missing in Portuguese | Build fails | type error |
| Skill names and levels, stacks, company and project names, links | Stated once, identical on both pages | identical text |
| Skill group headings | Translated where the word differs (`Practices` → `Práticas`, `Data` → `Dados`, `AI` → `IA`) | Portuguese headings |
| Job titles | Stay in English | `Software Engineer`, `Senior Frontend Engineer` |
| Portuguese bio wording that is gendered (adjectives) | Avoided until the owner chooses (default 7) | gender-neutral text |
| Period and location text (`07/2025 – Present`, `Fortaleza, Brazil`) | Translated where it contains words (`Present` → `Atual`) | Portuguese text |
| Photo alternative text | Translated | Portuguese alt text |
| Section frame counters (lines, bytes, `OK`/`TODO` tag) | Computed from the active language's text | numbers differ per language |

Open, default taken:
1. Who writes the Portuguese - Claude writes it, the owner reviews it before deploy.

### Interface Text

**Delivers** every non-content string in the page in both languages. **Status: clear.**

| State | What should happen | Caller sees |
|---|---|---|
| Hero text, chip captions, prompt placeholder and buttons, statusline, boot card | In the active language | Portuguese text on `/pt` |
| `/help` | Lists every command with its description in the active language; names unchanged (Key decision 4) | Portuguese descriptions |
| Unknown input | The `E492` message and the hint to try `/help` in the active language | Portuguese message |
| `:q` in-character reply, `:w` confirmation, theme messages | In the active language | Portuguese message |
| Accessible names, live-region results, screen-reader-only text | In the active language | Portuguese on `/pt` |
| English sentence left on `/pt` | A test fails (Key decision 5) | failing test |

### Language Switch

**Delivers** the way to move between the two pages. **Status: open — 1 default taken.**

| State | What should happen | Caller sees |
|---|---|---|
| Click the toggle on `/` | Go to `/pt`, at its top | Portuguese page |
| Click the toggle on `/pt` | Go to `/`, at its top | English page |
| `/language pt` on `/` | Same as the toggle; no echo, because the page resets (Key decision 6) | Portuguese page |
| `/language en` on `/pt` | Same as the toggle | English page |
| `/language` | Lists `en | pt` and the active one | output lines |
| `/language xx` | Rejects with the valid options, as `:theme` does | error line in the active language |
| `/language` for the language already active | No navigation; says it is already active | output line |
| Keyboard use | The toggle is reachable by Tab with a visible focus outline and an accessible name naming the target language | - |
| Theme set before switching | Kept after the switch | same colours |

Open, default taken:
1. Where the control sits - in the hero beside the macro chips, since the top bar was removed.

### Metadata

**Delivers** per-language title, description, social preview and search alternates. **Status: clear.**

| State | What should happen | Caller sees |
|---|---|---|
| `/` metadata | English title and description; page language `en`; canonical `/`; declares `/pt` as its Portuguese alternate | head tags |
| `/pt` metadata | Portuguese description; title follows default 7; page language `pt-BR`; canonical `/pt`; declares `/` as its English alternate | head tags |
| Social preview | Each page references its own image route; a single image file shared at the top of the app would attach to neither page (verified on a throwaway build) | image resolves, `image/png` |
| Missing public site URL at build | Same behaviour as today | - |

## Sources

- Next.js internationalization guide, bundled with the installed version - sub-path routing, one dictionary per language, a 404 for an unsupported language.
- Next.js route groups reference - multiple root layouts, and the full page load on switching between them, which is acceptable for a language switch (Key decision 6).
- `.specs/landing-page.md` - the requirement that every section is readable without JavaScript.
