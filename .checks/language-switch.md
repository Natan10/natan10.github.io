# Language switch: English and Portuguese

Profile: `light` (the project declares none), handoff `on`. Nothing has been injected or recomputed beyond what `light` runs.

Sources:

- `.tasks/language-switch.md` - the task: 37 criteria, the `Decided` doors, the `Out of scope` list and the confirmed defaults. Check `C<n>` below is criterion `n` of that file.
- `.design/language-switch.md` - the design the task was cut from, amended during planning.
- Owner, 2026-10-10, in conversation - job titles stay in English; the Portuguese bio uses gender-neutral wording; `/language` (with alias `:language`) switches language; the toggle is `EN | PT`.
- Design / screens - none. No screen is drawn; the interface is the existing page plus one control, so there is no binding source and the `ui` steps do not apply.

## Out of scope

- A Portuguese CV file - the owner has not supplied one; the CV stays English on both pages.
- Language detection from the browser or location - a shared link must open the same way for everyone.
- Remembering a visitor's language between visits - the URL is the state.
- Third languages and right-to-left text - nobody has asked.
- Translating job titles, command names, theme names, section ids, file paths, technology names, company names and the ASCII banner - identifiers or proper nouns, or the owner's choice.
- Analytics of any kind - none exists and none is added now.
- A themed 404 page - Next's plain 404 is accepted.

## Landing

Touches the app routes and layout (`src/app`), the content layer (`src/content`), the command registry and a new language module (`src/lib`), every terminal component, and the browser tests. Reuses the existing section frame, the section-text helpers, the theme store and its pre-paint script, and the `:theme` command's message shapes (`E474`, `themes:` / `active:`) as the pattern for `/language`.

| One-way door | Literal shape | Alternative rejected |
| --- | --- | --- |
| Language is the URL | `/` = `en` (`<html lang="en">`), `/pt` = `pt` (`<html lang="pt-BR">`); each page canonical to itself, each declares the other as `hreflang` alternate; no stored preference, no detection | `/en` + `/pt` with an `Accept-Language` redirect: needs a proxy and a matcher library, rewrites shared links per visitor, moves every `/` link and test; client-only switch: unreadable without JavaScript, no shareable link |
| Two root layouts, one per language | route groups `(en)` and `(pt)`, each with its own root layout, metadata and social image route (`/opengraph-image-<hash>`, `/pt/opengraph-image-<hash>`); no layout above them | one `[lang]` root layout with `/` rewritten to `/en` in a proxy: adds a proxy the project does not have |
| Language-independent values are stated once | shared module holds ids, role, company, stack, level, link, stars, contact, tags, cv; each language supplies `Record<Id, text>` keyed by the same ids, so a missing or extra key is a type error | two complete content documents: nothing stops drift in entry counts or levels |
| Interface text is a typed dictionary per language | one `Dictionary` type; English is the source; Portuguese is `satisfies` the same type; values are plain strings with `{name}` placeholders (they cross the server-to-client boundary, so no functions); the command registry keeps only names, aliases, kind, target and chip presence | a translation library: a new dependency for two languages with no plurals; inline `lang === "pt"` conditionals: parity is unchecked |
| Command text is keyed by command name | `Dictionary.commands` is a mapped type over the registry's `name` values; section commands require `description` and `result`, chip commands require `chip` | optional fields: a missing Portuguese result would pass the type check |

- Nothing else in this change is hard to reverse

## Checks

### S1 - Locale · 3 files · 4 KB · ~1k

**C1** - `/` answers 200 with `<html lang="en">` and is the English page that exists today
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C1\]"`

**C2** - `/pt` answers 200 with `<html lang="pt-BR">` and exactly one `h1` containing "Natan Moreira"
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C2\]"`

**C3** - `/pt/anything` answers 404
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C3\]"`

**C4** - With JavaScript disabled, `/pt` contains the sections `user, experience, skills, projects, takeaways, contact` in that order, each framed with its English `[CMD: /…]` label
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C4\]"`

**C5** - Every browser test that exists today and loads `/` passes unchanged
Proof: `npx playwright test tests/e2e/accessibility.spec.ts tests/e2e/command-prompt.spec.ts tests/e2e/content-sections.spec.ts tests/e2e/identity.spec.ts tests/e2e/keyboard-statusline-themes.spec.ts tests/e2e/metadata.spec.ts tests/e2e/responsive.spec.ts tests/e2e/walking-skeleton.spec.ts` (none of these files is edited by this change)

### S2 - Content · 6 files · 21 KB · ~5k

**C6** - On `/pt` the identity section shows Portuguese bio, location and availability; name and tags equal `/`; the job title is `Software Engineer`; the bio contains no gendered adjective from a fixed list (`apaixonado`, `apaixonada`, `comprometido`, `comprometida`, `dedicado`, `dedicada`, `motivado`, `motivada`)
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C6\]"`

**C7** - On `/pt` the experience section has the same number of entries, order, companies, stack chips, roles and achievements-per-entry as `/`, and its period, location and achievements text differ from `/`
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C7\]"`

**C8** - On `/pt` skills have the same labels, order and bars as `/`, and the group headings read `Frontend, Backend, Dados, Cloud, Práticas, IA`
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C8\]"`

**C9** - On `/pt` projects have the same names, links, stacks and stars as `/` with different descriptions; takeaways have the same count and order with different text; contact entries equal `/`
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C9\]"`

**C10** - On `/pt` the CV link has the same `href` and `download` as on `/` and reads `Baixar CV em inglês (cv.pdf)`
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C10\]"`

**C11** - On `/pt` each section frame's `{lines}L, {bytes}B` counter equals the line count and UTF-8 byte length of that section's text, with accented letters as 2 bytes
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C11\]"`

**C12** - A missing translatable Portuguese field, a missing Portuguese dictionary entry, and a missing command text are each a type error
Proof: `npx playwright test tests/e2e/parity.spec.ts -g "\[C12\]"` (runs `tsc --noEmit` over `tests/types/parity.test-d.ts`, whose `@ts-expect-error` lines fail if the types stop rejecting)

**C13** - Skill levels, stacks, links, company and project names, stars and contact values are identical on `/` and `/pt`
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C13\]"`

### S3 - Interface text · 9 files · 24 KB · ~6k

**C14** - On `/pt` no English interface string that has a different Portuguese entry appears in the visible text or accessible names; the labelled regions carry Portuguese names; terminal tokens equal `/`
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C14\]"`

**C15** - `/help` on `/pt` prints a Portuguese heading and one line per command in registry order with its Portuguese description; names and aliases (including `/language` and `:language`) are unchanged
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C15\]"`

**C16** - Unknown input `foo` on `/pt` echoes the command, prints a Portuguese message starting `E492:` and ending `foo`, then a Portuguese hint to try `/help`
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C16\]"`

**C17** - Each of the six section commands on `/pt`, typed, scrolls to and highlights its section and prints its Portuguese result line keeping its pseudo-file path
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C17\]"` (table-driven over all 6 section commands)

**C18** - `:w`, `:q`, `:theme`, `:theme nord` on `/pt` print Portuguese output, and `:theme xx` prints `E474:` with a Portuguese message and the unchanged theme names
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C18\]"`

**C19** - The macro chips on `/pt` show the same 7 bracketed command names as `/` with different captions
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C19\]"`

### S4 - Language switch · 6 files · 14 KB · ~4k

**C20** - Switching from `/` with the skills frame top at or above the viewport top and the projects frame below goes to `/pt#skills` with skills in view; from `/pt` the EN item goes to `/#skills`
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C20\]"`

**C21** - Switching from the top of `/` goes to `/pt` with no fragment
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C21\]"`

**C22** - With JavaScript disabled the other item is a link to `/pt` (or `/`) with no fragment and following it loads that page
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C22\]"`

**C23** - `/language pt` and `:language pt` on `/` go to `/pt` by the C20/C21 rule; `/language en` and `:language en` on `/pt` go to `/`
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C23\]"`

**C24** - `/language` with no argument lists `en | pt` and names the active language, in the active language
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C24\]"`

**C25** - `/language xx` prints `E474:` with an unknown-language message and `en | pt`, in the active language, and does not navigate
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C25\]"`

**C26** - `/language` naming the active language says so and leaves the URL unchanged
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C26\]"`

**C27** - A theme saved before switching is applied (`data-theme` set) on the target page before first paint
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C27\]"`

**C28** - After switching, the output stream shows only the boot card and prompt history is empty
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C28\]"`

**C29** - The toggle is in the hero beside the macro chips with items `EN` and `PT`; the active one is `aria-current="true"` and not a link; the other is a link named `English` or `Português` with the matching `lang`; each item is at least 44px tall at 375px width; keyboard focus shows a 2px outline
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C29\]"`

### S5 - Metadata · 4 files · 4 KB · ~1k

**C30** - `/` has title `Natan Moreira — Software Engineer`, canonical `/`, and alternates `en` → `/` and `pt-BR` → `/pt`
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C30\]"`

**C31** - `/pt` has a Portuguese description containing "Natan Moreira", title `Natan Moreira — Software Engineer`, canonical `/pt`, and the same two alternates
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C31\]"`

**C32** - Each page's `og:image` and `twitter:image` resolve with 200 and `image/png`, and the `/pt` image URL is a different route from the `/` one
Proof: `npx playwright test tests/e2e/language.spec.ts -g "\[C32\]"`

### S6 - Fit and finish · 5 files · 20 KB · ~5k

**C33** - `/pt` has zero axe violations in each of the six themes, including page-language rules
Proof: `npx playwright test tests/e2e/language-quality.spec.ts -g "\[C33\]"` (table-driven over the 6 themes)

**C34** - `/pt` has no horizontal overflow at 375, 768, 1024 and 1280px in each of the six themes
Proof: `npx playwright test tests/e2e/language-quality.spec.ts -g "\[C34\]"` (table-driven over 6 themes × 4 widths)

**C35** - The keyboard focus pass over `/pt` reaches at least 17 focusable elements, each with a visible outline of at least 2px
Proof: `npx playwright test tests/e2e/language-quality.spec.ts -g "\[C35\]"`

**C36** - The README's content-editing section names where each language's content and interface text live and documents `/pt` and `/language`
Proof: `npx playwright test tests/e2e/language-quality.spec.ts -g "\[C36\]"`

**C37** - `npm run lint`, `npm run build` and `npm test` all pass
Proof: `npm run lint && npm run build && npm test`

## Swept

- validation: C12, C25, C3
- failure modes: C12, C22
- idempotency and retry: C26
- authorization: not in scope - public static pages, no sign-in or roles
- concurrency: not in scope - the pages hold no shared mutable state; the language is carried by the route
- data lifecycle: not in scope - the language is not stored (Out of scope); the saved theme is untouched, C27 observes it
- external-dependency failure: not in scope - no runtime calls to other services; the font is self-hosted and the social images are built with the site
- state transitions: C20, C21, C23, C28
- observability: not in scope - no analytics exist and none is added now

## Handoff

Batch: S1-S6 = 1 + 5 + 6 + 4 + 1 + 5 = about 22k tokens of reading, all in one app of 40 files, so one batch and no handoff. Surface changes are inside the same modules (routes, content, terminal components), so there is no cheaper boundary.
