# Design System — hello-word-8

> Source of truth: the approved `index.html` (preview: http://localhost:8080/design/7c698426-2e62-4589-b4b1-fc19dcc93406).
> Every value below is extracted from it. Changing a value here without changing the approved design is a defect.

Last updated: 2025-08-19

## 1. Foundations

### 1.1 Color

Semantic tokens. Name by job, never by hue.

| Token | Value | Used for |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-text` | `#000000` | Body text |

#### Contrast audit

| Foreground | Background | Ratio | Passes |
|---|---|---|---|
| `--color-text` | `--color-bg` | `21:1` | AA / AA Large |

### 1.2 Spacing

Base unit: `4px`. Approved design uses no authored spacing scale beyond browser defaults and centered layout.

| Token | Value |
|---|---|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-12` | `48px` |

### 1.3 Typography

Font families:

- Body: `Arial, Helvetica, sans-serif`
- Headings: `Arial, Helvetica, sans-serif`
- Mono: not used

| Token | Size | Line height | Weight | Used for |
|---|---|---|---|---|
| `--text-xs` | `12px` | `1.2` | `400` | Not used |
| `--text-sm` | `14px` | `1.4` | `400` | Not used |
| `--text-base` | `16px` | `1.5` | `400` | Not used |
| `--text-lg` | `18px` | `1.5` | `400` | Not used |
| `--text-xl` | `20px` | `1.2` | `400` | Not used |
| `--text-2xl` | `32px` | `1` | `400` | Not used |
| `--text-3xl` | `clamp(2rem, 8vw, 6rem)` | `1` | `400` | Main display text |

Heading levels are used in order and never skipped for visual sizing. Only `h1` appears.

### 1.4 Radius, border, shadow, motion

| Token | Value | Used for |
|---|---|---|
| `--radius-sm` | `0` | Not used |
| `--radius-md` | `0` | Not used |
| `--radius-lg` | `0` | Not used |
| `--radius-full` | `0` | Not used |
| `--border-width` | `0` | No borders |
| `--shadow-sm` | `none` | No shadows |
| `--shadow-md` | `none` | No shadows |
| `--shadow-lg` | `none` | No shadows |
| `--duration-fast` | `0ms` | No motion |
| `--duration-base` | `0ms` | No motion |
| `--easing` | `linear` | No motion |

Motion respects `prefers-reduced-motion: reduce`: there is no authored motion to reduce.

### 1.5 Layout and breakpoints

| Name | Min width | Container | Columns | Gutter |
|---|---|---|---|---|
| `sm` | `640px` | `100%` | `1` | `0` |
| `md` | `768px` | `100%` | `1` | `0` |
| `lg` | `1024px` | `100%` | `1` | `0` |
| `xl` | `1280px` | `100%` | `1` | `0` |

Z-index scale (only these values are allowed):

| Layer | Value |
|---|---|
| Base | `0` |
| Sticky header | `0` |
| Dropdown | `0` |
| Modal backdrop | `0` |
| Modal | `0` |
| Toast | `0` |

## 2. Components

One subsection per reusable component. This product has no reusable interactive components beyond the static display.

### 2.1 Hello Word display

**Purpose** — Single static landing display. Use for exactly one centered line of text on plain canvas. Not for input, navigation, or action.

**Anatomy** — `[main] [h1]`

**Variants**

| Variant | Tokens | When to use |
|---|---|---|
| Default | `--color-bg`, `--color-text`, `--text-3xl` | Only screen in product |

**Sizes**

| Size | Height | Padding | Text token |
|---|---|---|---|
| Default | Full viewport | None | `--text-3xl` |

**States** — every row must be filled in.

| State | Visual change | Tokens |
|---|---|---|
| Default | Centered black text on white background | `--color-bg`, `--color-text`, `--text-3xl` |
| Hover | No change | None |
| Focus (keyboard) | No interactive focus target exists | None |
| Active / pressed | No change | None |
| Disabled | No disabled state | None |
| Loading | No loading state | None |
| Error | No error state | None |
| Empty | No empty state; screen content is the text itself | None |

**Accessibility** — single `main` landmark with `aria-label="Hello Word display"`; text is semantic `h1`; minimum hit target not applicable because no controls.

## 3. Content and formatting

- Voice and tone in one line: plain, neutral, no decoration.
- Date, time, number, and currency formats: not used.
- Capitalization rule for buttons, headings, and labels: title case not used; page text uses exact product copy `Hello Word`.
- Empty-state and error-message wording pattern: not used.

## 4. Known deviations

| Where | Deviation | Why it stands | Follow-up |
|---|---|---|---|
| `html, body` | `height: 100%` plus `body`/`main` `min-height: 100vh` duplicates full-viewport sizing | Approved mockup uses both to guarantee full-screen centering | None |
| Typography | `font-size: clamp(2rem, 8vw, 6rem)` not part of fixed scale | Approved mockup uses fluid display sizing for the only text | None |
| Z-index scale | All layers set to `0` because no layered UI exists | Single-screen product has no overlays or sticky surfaces | None |
| `--viewport-height` | Full-height helper token in `globals.css` | Used by page shell for viewport centering | None |

## 5. Change log

| Date | Change | Design PR |
|---|---|---|
| 2025-08-19 | Initial design system for static Hello Word screen | pending |
