---
name: Terminal VIM Minimal
colors:
  surface: '#1a1208'
  surface-dim: '#1a1208'
  surface-bright: '#42372b'
  surface-container-lowest: '#150d04'
  surface-container-low: '#231a0f'
  surface-container: '#271e13'
  surface-container-high: '#32281d'
  surface-container-highest: '#3e3327'
  on-surface: '#f2dfce'
  on-surface-variant: '#c7c8b6'
  inverse-surface: '#f2dfce'
  inverse-on-surface: '#392f23'
  outline: '#919282'
  outline-variant: '#46483a'
  surface-tint: '#c0ce7a'
  primary: '#c4d27e'
  on-primary: '#2c3400'
  primary-container: '#a9b665'
  on-primary-container: '#3d4700'
  inverse-primary: '#59641c'
  secondary: '#9ed0c5'
  on-secondary: '#003730'
  secondary-container: '#1d4f46'
  on-secondary-container: '#8dbfb4'
  tertiary: '#ffb6c9'
  on-tertiary: '#541d30'
  tertiary-container: '#e898ad'
  on-tertiary-container: '#6a2e41'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dcea93'
  primary-fixed-dim: '#c0ce7a'
  on-primary-fixed: '#191e00'
  on-primary-fixed-variant: '#414b03'
  secondary-fixed: '#baede1'
  secondary-fixed-dim: '#9ed0c5'
  on-secondary-fixed: '#00201b'
  on-secondary-fixed-variant: '#1d4f46'
  tertiary-fixed: '#ffd9e1'
  tertiary-fixed-dim: '#ffb1c5'
  on-tertiary-fixed: '#3a071b'
  on-tertiary-fixed-variant: '#703346'
  background: '#1a1208'
  on-background: '#f2dfce'
  surface-variant: '#3e3327'
typography:
  headline-xl:
    fontFamily: JetBrains Mono
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: JetBrains Mono
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.08em
spacing:
  gutter: 1rem
  gutter-mobile: 0.5rem
  margin: 1.5rem
  margin-mobile: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system translates the precision, ergonomics, and visual vernacular of modal terminal editors (Vim/Neovim) into an ultra-focused developer portfolio and personal landing page. The aesthetic merges terminal brutalism with high-craft software ergonomics. It strips away standard web chrome in favor of text-user-interface (TUI) primitives: segmented status lines, explicit modal indicators (`-- NORMAL --`, `-- INSERT --`, `-- COMMAND --`), discrete buffer split windows, command bar inputs, and syntax-aware typography.

The target audience comprises software engineers, systems hackers, engineering leadership, and open-source contributors who revere craftsmanship, keyboard-driven navigation, and zero-bloat interfaces. The interface evokes feelings of high agency, focused flow state, deep technical authenticity, and nostalgic computational utility without feeling kitschy or unpolished.

## Colors

The shipped default is the **warm** palette: a dark brown canvas with olive-green, teal and rose accents. It is defined as tokens in `src/app/globals.css` (`@theme`) and mirrored in the front matter above. Five alternate palettes (Gruvbox, Dracula, Nord, Monokai, Solarized Dark) are applied with `html[data-theme="<name>"]` overrides in the same file, switched by the `:theme <name>` command and persisted in `localStorage`. Themes change colours only, never layout. All text and UI colours meet WCAG AA contrast (enforced by `tests/e2e/accessibility.spec.ts`).

### Warm (Default Core)
- **Canvas (`#1a1208`)**: `background` / `surface`. Base substrate.
- **Surface containers (`#231a0f` to `#3e3327`)**: `surface-container-low` through `-highest` for buffer panes, popups and pressed states.
- **Text Main (`#f2dfce`)**: `on-surface`. Secondary text is `on-surface-variant` (`#c7c8b6`); muted gutters and placeholders use `outline` (`#959687`).
- **Primary (`#c4d27e`)**: Olive green. `-- NORMAL --` accents, links, focus rings, active targets. Text on it is `on-primary` (`#2c3400`).
- **Secondary (`#9ed0c5`)**: Teal. Types, navigation and buffer identifiers.
- **Tertiary (`#ffb6c9`)**: Rose. Decorative brackets and keyword highlights.
- **Error (`#ffb4ab`)**: Errors and `TODO` placeholder markers.
- **Borders (`#46483a`)**: `outline-variant` for inactive pane borders.

### Alternate themes
Each alternate overrides the same token names, so components never reference a theme directly. Base and primary per theme:
- **Gruvbox**: Base `#282828`, Primary `#c1c33f`, Text `#ebdbb2`.
- **Dracula**: Base `#282a36`, Primary `#cbabf9`, Text `#f8f8f2`.
- **Nord**: Base `#2e3440`, Primary `#96c7d6`, Text `#eceff4`.
- **Monokai**: Base `#272822`, Primary `#a6e22e`, Text `#f8f8f2`.
- **Solarized Dark**: Base `#002b36`, Primary `#c9ab47`, Text `#eee8d5`.

Primaries are lightened from the canonical palette values where needed to reach AA contrast.

## Typography

The type system is strictly monospaced via `JetBrains Mono`. Visual hierarchy is governed by weight, casing, syntax color tokens, and column indentations rather than proportional scale disparities.

- Enable font features by default: `font-feature-settings: "liga" 1, "calt" 1, "zero" 1;` (slashed zeroes, standard coding ligatures).
- Headings simulate ASCII documentation headers or Markdown markers (`# `, `## `, `### `) rendered in muted neutrals alongside high-contrast semantic content.
- Code blocks, command lines, and terminal outputs match the base body scale (`body-md` / `14px`) to preserve authentic 80x24 character grid harmony.
- Inline status and metadata utilize uppercase formatting (`label-sm` or `label-md`) with deliberate tracking to resemble terminal terminal-mode indicators.

## Layout & Spacing

The layout embraces the strict, character-cell discipline of window buffers. The screen is organized as a primary terminal shell composed of:
1. **Main Buffer Viewport**: Employs a 12-column split-pane layout for desktop (`w-full` with fixed sidebars mimicking file trees like `nvim-tree` or `oil.nvim`).
2. **Statusline**: Fixed height, edge-to-edge airline/lualine layout sitting directly above the command prompt.
3. **Commandline / Mini-buffer**: Dedicated bottom execution row (`:w`, `:theme dracula`, `/search`).

### Breakpoints & Reflow
- **Desktop (>= 1024px)**: Dual or triple buffer splits allowed (e.g., file-tree 25%, main editor pane 50%, live REPL / preview 25%).
- **Tablet (768px - 1023px)**: Single main buffer with collapsible side drawer; statusline collapses file encoding and git branch details to icons.
- **Mobile (< 768px)**: Stacked single-buffer experience. Statusline condenses strictly to mode badge, short filename, and line position (`NORMAL | index.md | 42:10`). All outer canvas margins shrink to `margin-mobile: 0.75rem`.

## Elevation & Depth

No soft drop-shadows or diffused blurs exist in this design system. Depth and structural hierarchy are articulated strictly through **TUI Box Borders**, **Tonal Layering**, and **Monochrome Outline Offsets**:

1. **Base Layer (Elevation 0 - Canvas)**: Deep `background` (`#1a1208`) representing the terminal workspace.
2. **Active Buffer / Window Pane (Elevation 1)**: Flat `surface-container-low` framed by a 1px solid border (`outline-variant` for inactive windows, `secondary` or `primary` for active focused windows).
3. **Floating Windows & Pickers (Elevation 2 - Telescope / FZF Modals)**: Framed with double-line or rounded Unicode/ASCII box-drawing lines (e.g., `┌─┐│└─┘` or `╔═╗║╚═╝`). Uses an opaque `surface-container-low` background accompanied by a flat, un-blurred 4px offset shadow (`box-shadow: 4px 4px 0px 0px #000000`). The only window docked to the bottom edge, the music player strip, uses the same offset mirrored upward: the `shadow-flat-up` token (`4px -4px 0 0 #000000`) in `globals.css`.
4. **Tooltips & Completion Menus (Elevation 3 - CMP / LSP Popups)**: Inverted high-contrast box with a 1px highlight border in `primary`.

## Shapes

The design system enforces `roundedness: 0` (strict 0px corner radii). Every corner is razor-sharp to uphold raw terminal authenticity.

- Interactive buttons, tags, chips, modal windows, buffer panels, and input fields must feature square corners (`border-radius: 0px`).
- Powerline / Airline statusline arrows are implemented via sharp vector Chevrons or SVG equivalents with zero softening.
- Focus rings are rendered as solid 1px or 2px non-offset outlines matching the active theme's primary or secondary color.

## Components

### Mode Indicators & Vim Statusline (Lualine/Airline)
- **Structure**: A continuous, zero-gap horizontal bar divided into discrete powerline blocks.
- **Section A (Mode)**: High-contrast inverted block displaying `-- NORMAL --` (`primary` bg, `on-primary` text), `-- INSERT --` (`secondary` bg, `on-secondary` text), or `-- COMMAND --` (`tertiary` bg, `on-tertiary` text).
- **Section B (Branch & Diagnostics)**: Muted background (`surface-container-high`) displaying Git branch icon `main` and diagnostic badges (`E:0 W:1`).
- **Section C (File & Path)**: Subtle background (`surface-container-low`) displaying current buffer path and modified indicator `[+]`.
- **Section Z (Position & Percentage)**: Inverted block at right edge displaying `Ln 14, Col 2 [85%]`.

### Command Bar (`:`) & Quick Search (`/`)
- Fixed at the absolute bottom or invoked as a centered floating telescope modal.
- Prefixed with terminal prompt markers: `:` for commands, `/` for search, `>` for fuzzy actions.
- Real-time autocompletion dropdown floats directly adjacent, styled like Vim LSP `cmp` with `[Type]`, `[Snippet]`, and `[File]` annotations.
- Accepts interactive commands like `:theme nord`, `:w portfolio.pdf`, or `:q!`.

### Buttons
- **Primary Action**: Solid rectangular block with `primary` accent, `on-primary` foreground, and bold weight. Displays cursor block `█` on hover.
- **Secondary / Ghost Action**: `surface-container-low` background with 1px `outline-variant` border. Hover swaps to `on-surface` text and shifts the background to `surface-container-high`.
- **Keyboard Shortcut Affordance**: Buttons optionally include embedded key shortcuts rendered in brackets: `[ <CR> ]` for enter, `[ y ]` for copy.

### Chips & Syntax Tags
- Compact mono badges enclosed in ASCII braces or brackets: `[ TypeScript ]`, `< React >`, `{ Rust }`.
- Zero border radius, 1px perimeter border tinted to corresponding syntax highlight tokens (keywords = purple, types = cyan, functions = green).

### Input Fields & Textareas
- Seamless dark background matching the buffer pane (`surface-container-low`).
- Framed with 1px border `outline-variant`, switching to 1px `primary` on focus.
- Blinking block cursor (`animation: blink 1s step-end infinite`) styled via CSS pseudo-elements.
- Integrated line-number gutter along the left margin for multi-line textarea editors.

### Checkboxes & Radio Buttons
- Pure TUI ASCII simulation:
  - Unchecked Checkbox: `[ ]`
  - Checked Checkbox: `[x]` (rendered in `primary`)
  - Unselected Radio: `( )`
  - Selected Radio: `(*)` (rendered in `secondary`)
- Toggled via click or keyboard spacebar when focused.

### Buffer Cards & Project Panes
- Styled like isolated Vim window panes.
- Top pane border contains an inline title: `┌─ projects/terminal-portfolio.ts ─────────┐`.
- Bottom pane border acts as a localized mini-statusline: `└─ 74L, 2180B ────────────────── [ts] ─┘`.
- Gutter displays sequential line numbers (`01`, `02`, `03`) in neutral muted tones (`outline`), highlighting the active row number in `tertiary`.
