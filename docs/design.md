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

The baseline palette defaults to Gruvbox Dark Hard, calibrated for high-contrast legibility against deep terminal backgrounds. The token architecture is built to pivot instantly across iconic themes (Gruvbox, Dracula, Nord, Monokai, Solarized Dark) via CSS root variables without structural re-layouts.

### Gruvbox Dark Hard (Default Core)
- **Primary (`#a9b665`)**: Terminal Green. Used for `-- NORMAL --` mode status accents, execution indicators, diff additions, and active cursor targets.
- **Secondary (`#7daea3`)**: Terminal Aqua/Cyan. Applied to types, interfaces, navigation links, and buffer identifiers.
- **Tertiary (`#d3869b`)**: Terminal Purple/Magenta. Reserved for `-- VISUAL --` mode banners, decorative brackets, and keyword highlights.
- **Neutral (`#928374`)**: Terminal Muted Gray. Dictates line numbers, non-active statuslines, subtle gridlines, and gutter symbols.
- **Canvas Base (`#1d2021`)**: Background substrate.
- **Surface Elevation (`#282828`)**: Buffer panes, floating dialog windows, and popup menus.
- **Text Main (`#ebdbb2`)**: Default foreground text.
- **Accent Warning/Command (`#d8a657`)**: Yellow/Gold for `-- COMMAND --` state and search highlights.
- **Accent Danger (`#ea6962`)**: Terminal Red for error markers, linting breaks, and `-- REPLACE --` state.

### Multi-Theme Mapping Strategy
When swapping theme toggles, tokens remap consistently:
- **Dracula**: Base `#282a36`, Primary `#50fa7b` (Green), Secondary `#8be9fd` (Cyan), Tertiary `#bd93f9` (Purple), Text `#f8f8f2`.
- **Nord**: Base `#2e3440`, Primary `#a3be8c` (Green), Secondary `#88c0d0` (Frost Cyan), Tertiary `#b48ead` (Purple), Text `#eceff4`.
- **Monokai**: Base `#272822`, Primary `#a6e22e` (Green), Secondary `#66d9ef` (Blue/Cyan), Tertiary `#ae81ff` (Purple), Text `#f8f8f2`.
- **Solarized Dark**: Base `#002b36`, Primary `#859900` (Green), Secondary `#2aa198` (Cyan), Tertiary `#6c71c4` (Violet), Text `#839496`.

## Typography

The type system is strictly monospaced via `JetBrains Mono`. Visual hierarchy is governed by weight, casing, syntax color tokens, and column indentations rather than proportional scale disparities.

- Enable font features by default: `font-feature-settings: "liga" 1, "calt" 1, "zero" 1;` (slashed zeroes, standard coding ligatures).
- Headings simulate ASCII documentation headers or Markdown markers (`# `, `## `, `### `) rendered in muted neutrals alongside high-contrast semantic content.
- Code blocks, command lines, and terminal outputs match the base body scale (`body-md` / `14px`) to preserve authentic 80x24 character grid harmony.
- Inline status and metadata utilize uppercase formatting (`label-sm` or `label-md`) with deliberate tracking to resemble terminal terminal-mode indicators.

## Layout & Spacing

The layout embraces the strict, character-cell discipline of window buffers. The screen is organized as a primary terminal shell composed of:
1. **Top Tabline / Buffer Bar**: Displays open virtual buffers (`[1: index.md]`, `[2: projects.rs]`, `[3: contact.sh]`).
2. **Main Buffer Viewport**: Employs a 12-column split-pane layout for desktop (`w-full` with fixed sidebars mimicking file trees like `nvim-tree` or `oil.nvim`).
3. **Statusline**: Fixed height, edge-to-edge airline/lualine layout sitting directly above the command prompt.
4. **Commandline / Mini-buffer**: Dedicated bottom execution row (`:w`, `:theme dracula`, `/search`).

### Breakpoints & Reflow
- **Desktop (>= 1024px)**: Dual or triple buffer splits allowed (e.g., file-tree 25%, main editor pane 50%, live REPL / preview 25%).
- **Tablet (768px - 1023px)**: Single main buffer with collapsible side drawer; statusline collapses file encoding and git branch details to icons.
- **Mobile (< 768px)**: Stacked single-buffer experience. Statusline condenses strictly to mode badge, short filename, and line position (`NORMAL | index.md | 42:10`). All outer canvas margins shrink to `margin-mobile: 0.75rem`.

## Elevation & Depth

No soft drop-shadows or diffused blurs exist in this design system. Depth and structural hierarchy are articulated strictly through **TUI Box Borders**, **Tonal Layering**, and **Monochrome Outline Offsets**:

1. **Base Layer (Elevation 0 - Canvas)**: Deep `#1d2021` representing the terminal workspace.
2. **Active Buffer / Window Pane (Elevation 1)**: Flat `#282828` framed by a 1px solid border (`#3c3836` for inactive windows, `#7daea3` or `#a9b665` for active focused windows).
3. **Floating Windows & Pickers (Elevation 2 - Telescope / FZF Modals)**: Framed with double-line or rounded Unicode/ASCII box-drawing lines (e.g., `┌─┐│└─┘` or `╔═╗║╚═╝`). Uses an opaque background `#282828` accompanied by a flat, un-blurred 4px offset shadow (`box-shadow: 4px 4px 0px 0px #000000`).
4. **Tooltips & Completion Menus (Elevation 3 - CMP / LSP Popups)**: Inverted high-contrast box with a 1px highlight border in primary green.

## Shapes

The design system enforces `roundedness: 0` (strict 0px corner radii). Every corner is razor-sharp to uphold raw terminal authenticity.

- Interactive buttons, tags, chips, modal windows, buffer panels, and input fields must feature square corners (`border-radius: 0px`).
- Powerline / Airline statusline arrows are implemented via sharp vector Chevrons or SVG equivalents with zero softening.
- Focus rings are rendered as solid 1px or 2px non-offset outlines matching the active theme's primary or secondary color.

## Components

### Mode Indicators & Vim Statusline (Lualine/Airline)
- **Structure**: A continuous, zero-gap horizontal bar divided into discrete powerline blocks.
- **Section A (Mode)**: High-contrast inverted block displaying `-- NORMAL --` (Green `#a9b665` bg, `#1d2021` text), `-- INSERT --` (Blue/Cyan `#7daea3` bg, `#1d2021` text), or `-- COMMAND --` (Yellow `#d8a657` bg, `#1d2021` text).
- **Section B (Branch & Diagnostics)**: Muted background (`#3c3836`) displaying Git branch icon `main` and diagnostic badges (`E:0 W:1`).
- **Section C (File & Path)**: Subtle background (`#282828`) displaying current buffer path and modified indicator `[+]`.
- **Section Z (Position & Percentage)**: Inverted block at right edge displaying `Ln 14, Col 2 [85%]`.

### Command Bar (`:`) & Quick Search (`/`)
- Fixed at the absolute bottom or invoked as a centered floating telescope modal.
- Prefixed with terminal prompt markers: `:` for commands, `/` for search, `>` for fuzzy actions.
- Real-time autocompletion dropdown floats directly adjacent, styled like Vim LSP `cmp` with `[Type]`, `[Snippet]`, and `[File]` annotations.
- Accepts interactive commands like `:theme nord`, `:w portfolio.pdf`, or `:q!`.

### Buttons
- **Primary Action**: Solid rectangular block with primary accent color (`#a9b665`), dark foreground (`#1d2021`), and bold weight. Displays cursor block `█` on hover.
- **Secondary / Ghost Action**: `#282828` background with 1px border (`#504945`). Hover state swaps to foreground text `#ebdbb2` and shifts background to `#3c3836`.
- **Keyboard Shortcut Affordance**: Buttons optionally include embedded key shortcuts rendered in brackets: `[ <CR> ]` for enter, `[ y ]` for copy.

### Chips & Syntax Tags
- Compact mono badges enclosed in ASCII braces or brackets: `[ TypeScript ]`, `< React >`, `{ Rust }`.
- Zero border radius, 1px perimeter border tinted to corresponding syntax highlight tokens (keywords = purple, types = cyan, functions = green).

### Input Fields & Textareas
- Seamless dark background matching the buffer pane (`#1d2021` or `#282828`).
- Framed with 1px border `#3c3836`, switching to 1px `#a9b665` on focus.
- Blinking block cursor (`animation: blink 1s step-end infinite`) styled via CSS pseudo-elements.
- Integrated line-number gutter along the left margin for multi-line textarea editors.

### Checkboxes & Radio Buttons
- Pure TUI ASCII simulation:
  - Unchecked Checkbox: `[ ]`
  - Checked Checkbox: `[x]` (rendered in green `#a9b665`)
  - Unselected Radio: `( )`
  - Selected Radio: `(*)` (rendered in cyan `#7daea3`)
- Toggled via click or keyboard spacebar when focused.

### Buffer Cards & Project Panes
- Styled like isolated Vim window panes.
- Top pane border contains an inline title: `┌─ projects/terminal-portfolio.ts ─────────┐`.
- Bottom pane border acts as a localized mini-statusline: `└─ 74L, 2180B ────────────────── [ts] ─┘`.
- Gutter displays sequential line numbers (`01`, `02`, `03`) in neutral muted tones (`#928374`), highlighting the active row number in gold `#d8a657`.
