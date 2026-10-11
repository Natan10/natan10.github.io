# Music player: the `/music` command

> Status: spec, not yet implemented. Decided in a grilling session on 2026-10-11.
> UI mock: [`docs/mocks/music-player.html`](../mocks/music-player.html) (standalone, open it in a browser and resize).

## Intent

The owner wants visitors to be able to play music from the landing page, linked to their public Spotify playlist
("Natan Profile"). It must feel native to the terminal/Vim design, never play on its own, and not slow the page down or
contact Spotify for visitors who never ask for it. Nothing is measured: the site is not deployed.

After this ships, a visitor runs `/music` (prompt or hero chip), a small player strip opens above the statusline with
playback controls, and `/music off` or `[x]` closes it.

## Decisions

| # | Decision | Why |
| --- | --- | --- |
| D1 | Playback uses the **official Spotify embed iframe** (`open.spotify.com/embed/playlist/<id>`). | Needs no login, API keys or backend. The Web Playback SDK needs Premium and OAuth for every visitor; self-hosted audio has licensing problems and is not linked to the playlist. |
| D2 | The trigger is a new **`/music`** command (alias `:music`) with a hero chip, autocomplete and a `/help` entry. | Reuses the command registry, prompt and chips instead of a separate button. |
| D3 | The player is a **pinned strip above the statusline**, not a modal. | Music keeps playing while the visitor scrolls and runs other commands. |
| D4 | **Nothing from Spotify loads until `/music` runs.** No autoplay, ever. | Browsers block autoplay and it is rude; keeps the page fast, tracker-free by default and readable without JavaScript. |
| D5 | **Controls only**: the embed's compact 80px height (cover, current track, previous/next, add, menu, play/pause). No track list. | Smallest footprint on phones. The full list is one click away through "open in Spotify". |
| D6 | The strip is **responsive**: full width above the statusline below 768px; from 768px up it is docked bottom-right, 480px wide. | Breakpoints from `docs/design.md`; avoids a 1400px-wide bar. |
| D7 | The iframe carries `color-scheme: light` and its container is `#1f1f1f`. | The page is `color-scheme: dark` and the embed is not; the mismatch makes the browser paint white behind the embed's rounded corners. `#1f1f1f` is the embed's measured dark background, so the corners blend in. |
| D8 | The embed is requested with `theme=0` (dark). Its internal rounded corners and colours cannot be themed; the wrapper is square with a 1px border. | Works with all six palettes; the one compromise against the zero-radius rule. |
| D9 | **Music stops when the visitor switches EN/PT**, and the strip starts closed on the new page. | EN and PT are separate root layouts reached by a full page load. Keeping playback alive would mean merging them or switching client-side, a large refactor for one edge case. |
| D10 | The strip has its **own header row** rendered by us: `♪ Natan Profile`, `open in Spotify ↗`, `[x]`. | If an ad blocker, network failure or CSP blocks the iframe, the link and close button still work. |
| D11 | A plain **"Spotify playlist ↗" link** is added to the Contact section, built from the same constant. | Reachable without JavaScript or the command, and visible to search engines. |
| D12 | Opening the player **does not move focus** into the iframe. | Avoids a keyboard trap and keeps the `j/k/gg/G` scroll keys working. No global shortcut (such as `m`) is added. |
| D13 | The playlist is stored once in `src/content/shared.ts` as the **id `4lrm0AHTGIV9BH77rG8qVt`** (the public URL and embed URL are derived from it). | Same in both languages; the `?si=` share-tracking token is dropped. |

## Behaviour

- `/music` (or `:music`) with the strip closed: opens the strip, creates the iframe, and prints one output line that
  also contains the plain playlist URL. Focus stays in the prompt.
- `/music` with the strip open: prints an "already open" line and changes nothing.
- `/music off`, or the `[x]` button: removes the iframe (this stops playback), hides the strip and prints a "closed"
  line. `/music off` with the strip closed prints a "not open" line.
- `/music <anything else>`: prints an error naming the argument, then a usage line (`/music | /music off`).
- While the strip is open the page gets extra bottom padding equal to the strip plus the statusline, so no content is
  hidden behind it, and the statusline shows a `♪ music` segment.
- Layout: header row 28px, embed 80px, sitting on top of the 32px statusline. Below 768px it spans the full width with
  a top border in `primary`; from 768px it is 480px wide, docked at the right margin, with a 1px `primary` border and the
  design system's flat 4px black offset shadow.

## Criteria

Each becomes a check with a proof when the feature is built.

### Loading and privacy

1. When `/` or `/pt` loads, then no request is made to `open.spotify.com` or any other Spotify domain, and the page
   contains no `iframe`.
2. When `/music` runs, then exactly one `iframe` exists whose `src` is
   `https://open.spotify.com/embed/playlist/4lrm0AHTGIV9BH77rG8qVt` with `theme=0`, and it has no `autoplay` behaviour
   (it plays only after the visitor presses play inside it).
3. While JavaScript is disabled, the page is fully readable and the Contact section still contains the plain
   "Spotify playlist" link to `https://open.spotify.com/playlist/4lrm0AHTGIV9BH77rG8qVt`.

### Command

4. `/music` and `:music` are in the command registry, `/help`, Tab autocomplete and the hero chips, in both languages;
   the command name is identical in EN and PT.
5. When `/music` runs with the strip closed, then the strip is visible, focus stays on the prompt, and the output has
   one line containing the playlist URL.
6. When `/music` runs with the strip open, then the output says it is already open and no second iframe is created.
7. When `/music off` runs, or `[x]` is pressed, then the iframe is removed from the DOM, the strip is hidden, and the
   output says it was closed.
8. When `/music off` runs with the strip closed, then the output says it is not open.
9. When `/music foo` runs, then the output echoes the command, prints an error that names `foo`, then the usage line.

### Layout

10. Below 768px the strip spans the full viewport width and its bottom edge touches the top of the statusline; from
    768px it is 480px wide, right-aligned to the page margin.
11. Always, the strip is 28px (header) plus 80px (embed) tall, at every width.
12. While the strip is open, the last line of page content can be scrolled fully above the strip at 390px and 1280px
    widths.
13. Always, the strip's corners are square and the area around the embed shows no white pixels, in the warm theme and
    in the five alternate themes.
14. While the strip is open, the statusline shows `♪ music`; when it is closed, it does not.

### Resilience

15. When the iframe cannot load (blocked or offline), then the header row (`open in Spotify ↗` and `[x]`) is still
    visible and operable, and an error message appears in place of the embed.
16. When the visitor switches language, then the strip is closed on the new page and no iframe exists.

### Accessibility

17. Always, the iframe has a translated `title`, `[x]` is a focusable button with a translated accessible name, and the
    strip is a labelled landmark (`aside`) named in the active language.
18. Always, `npm test`'s accessibility checks (axe) pass with the strip open, in both languages and all six themes.
19. When the strip opens, then `document.activeElement` is unchanged, and the `j/k/gg/G` keys still scroll the page.

### Language

20. Always, every new string exists in English and Portuguese; a missing key is a type error and fails `npm run build`
    (the same dictionary mechanism as the rest of the interface).
21. Always, the strip header, the `/help` line and the command output are Portuguese on `/pt`; command names, `[x]`,
    the `♪` glyph and the playlist title (`Natan Profile`) are identical to `/`.

## Texts to write (EN / PT)

Drafts for review; they follow the existing dictionaries' tone (short, terminal-like, verb-first).

| Key | EN | PT |
| --- | --- | --- |
| `/music` description | open the Spotify playlist player | abrir o player da playlist do Spotify |
| opened | `♪ opening playlist "Natan Profile": press play. Fallback: <url>` | `♪ abrindo a playlist "Natan Profile": aperte play. Alternativa: <url>` |
| already open | `music player already open: /music off to close` | `player de música já aberto: /music off para fechar` |
| closed | `music player closed` | `player de música fechado` |
| not open | `music player is not open` | `o player de música não está aberto` |
| unknown argument | `unknown argument: <arg>` / `usage: /music | /music off` | `argumento desconhecido: <arg>` / `uso: /music | /music off` |
| open link | `open in Spotify ↗` | `abrir no Spotify ↗` |
| close button name | `Close music player` | `Fechar player de música` |
| iframe title | `Spotify playlist: Natan Profile` | `Playlist do Spotify: Natan Profile` |
| landmark name | `Music player` | `Player de música` |
| contact link | `Spotify playlist` | `Playlist no Spotify` |

## Tests to add

Playwright specs in `tests/e2e/`, with the Spotify iframe request stubbed (`page.route`) so the tests do not depend on
the network: no Spotify request before `/music` (1), command open/close/already/unknown flows (5–9), layout at 390px
and 1280px (10–12), blocked-embed fallback (15), language switch closes the strip (16), axe with the strip open
(18), focus unchanged (19), and an EN/PT parity check for the new strings (20–21). Criteria 2 and 13 also get a
manual look at the real embed, because the embed's own pixels are outside the test's control.

## Unresolved

- **The EN/PT texts above and the "unknown argument" behaviour** were proposed in the last question round; the owner
  asked for the spec before answering. Treated as accepted unless changed during implementation review.
- **The test plan** above was proposed in the same round and is treated the same way.
- **Embed behaviour is outside our control.** Visitors who are not logged in to Spotify hear 30-second previews with a
  "Preview" badge that cannot be hidden. If Spotify changes the embed's compact layout or background, D5 and D7 need a
  re-check.

## Out of scope

- Keeping music playing across the EN/PT switch (D9).
- A custom-built player UI, the Web Playback SDK or any Spotify login.
- A global keyboard shortcut for the player, and an indicator of whether the music is currently playing.
- A track list inside the strip.
