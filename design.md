---
version: "1.0.0"
name: "ONEdesign"
description: "AI design system for nebulaONE."
colors:
  primitive:
    white: "#FFFFFF"
    black: "#1E2529"
    grey-100: "#F9FAFB"
    grey-200: "#ECF0F3"
    grey-300: "#DFE2E8"
    grey-400: "#C4CDD5"
    grey-500: "#919EAB"
    grey-600: "#637381"
    grey-700: "#454F5B"
    grey-800: "#212B36"
    grey-900: "#161C24"
    blue-light: "#37C5F0"
    blue: "#4759A7"
    blue-dark: "#000041"
    purple: "#6B52A2"
    success-light: "#66DE77"
    success-main: "#0F913B"
    success-dark: "#07683B"
    warning-light: "#F8C46D"
    warning-main: "#E88310"
    warning-dark: "#A74D08"
    error-light: "#F38A7D"
    error-main: "#D82934"
    error-dark: "#9B1435"
    info-light: "#91E7EF"
    info-main: "#44ADDA"
    info-dark: "#1B76AC"
    viz-astronaut-blue: "#003F5C"
    viz-barf-green: "#A1A600"
    viz-burnt-yellow: "#DFA800"
    viz-carmine-pink: "#F95D6A"
    viz-celtic-blue: "#096ADC"
    viz-irish-green: "#0F913B"
    viz-lavender: "#665191"
    viz-lavender-blue: "#9CBAEC"
    viz-lime-green: "#43982C"
    viz-mango: "#FF7C43"
    viz-medium-turquoise: "#37C5F0"
    viz-muddy-yellow: "#C0A700"
    viz-navy-blue: "#2F4B7C"
    viz-onion-green: "#649E1A"
    viz-orange: "#FFA600"
    viz-pea-green: "#83A200"
    viz-periwinkle-blue: "#6DA2FA"
    viz-picton-blue: "#41B6FA"
    viz-pink-lemonade: "#E32F6C"
    viz-plum: "#A05195"
    viz-raspberry: "#D45087"
    viz-rich-lilac: "#C36DCD"
    viz-rose-madder: "#D82934"
  semantic:
    primary: "{colors.primitive.blue}"
    primary-strong: "{colors.primitive.blue-dark}"
    accent: "{colors.primitive.blue-light}"
    accent-secondary: "{colors.primitive.purple}"
    surface: "{colors.primitive.white}"
    surface-subtle: "{colors.primitive.grey-100}"
    surface-muted: "{colors.primitive.grey-200}"
    text: "{colors.primitive.grey-900}"
    text-muted: "{colors.primitive.grey-600}"
    text-subtle: "{colors.primitive.grey-500}"
    text-on-primary: "{colors.primitive.white}"
    border: "{colors.primitive.grey-300}"
    border-strong: "{colors.primitive.grey-400}"
    action-primary: "{colors.primitive.grey-800}"
    action-hover: "{colors.primitive.grey-900}"
    action-pressed: "#000000"
    action-disabled: "{colors.primitive.grey-400}"
    success: "{colors.primitive.success-main}"
    warning: "{colors.primitive.warning-main}"
    error: "{colors.primitive.error-main}"
    info: "{colors.primitive.info-main}"
    focus: "{colors.primitive.blue-light}"
    data-1: "{colors.primitive.blue}"
    data-2: "{colors.primitive.purple}"
    data-3: "{colors.primitive.info-main}"
    data-4: "{colors.primitive.success-main}"
    data-5: "{colors.primitive.warning-main}"
    data-viz-1: "{colors.primitive.viz-astronaut-blue}"
    data-viz-2: "{colors.primitive.viz-celtic-blue}"
    data-viz-3: "{colors.primitive.viz-lavender}"
    data-viz-4: "{colors.primitive.viz-irish-green}"
    data-viz-5: "{colors.primitive.viz-orange}"
typography:
  primitive:
    family-sans: "Segoe UI, system-ui, -apple-system, sans-serif"
    family-mono: "SFMono-Regular, ui-monospace, Consolas, Menlo, monospace"
    weight-regular: 400
    weight-medium: 600
    weight-bold: 700
  display:
    family: "{typography.primitive.family-sans}"
    size: "64px"
    weight: 700
    line-height: "80px"
    letter-spacing: "0px"
  heading-1: {family: "{typography.primitive.family-sans}", size: "64px", weight: 700, line-height: "80px", letter-spacing: "0px"}
  heading-2: {family: "{typography.primitive.family-sans}", size: "48px", weight: 700, line-height: "64px", letter-spacing: "0px"}
  heading-3: {family: "{typography.primitive.family-sans}", size: "32px", weight: 700, line-height: "48px", letter-spacing: "0px"}
  heading-4: {family: "{typography.primitive.family-sans}", size: "24px", weight: 700, line-height: "36px", letter-spacing: "0px"}
  heading-5: {family: "{typography.primitive.family-sans}", size: "20px", weight: 700, line-height: "30px", letter-spacing: "0px"}
  heading-6: {family: "{typography.primitive.family-sans}", size: "14px", weight: 700, line-height: "21px", letter-spacing: "0px"}
  body: {family: "{typography.primitive.family-sans}", size: "16px", weight: 400, line-height: "24px", letter-spacing: "0px"}
  body-small: {family: "{typography.primitive.family-sans}", size: "14px", weight: 400, line-height: "22px", letter-spacing: "0px"}
  label: {family: "{typography.primitive.family-sans}", size: "16px", weight: 600, line-height: "24px", letter-spacing: "0px"}
  caption: {family: "{typography.primitive.family-sans}", size: "12px", weight: 400, line-height: "18px", letter-spacing: "0px"}
  control: {family: "{typography.primitive.family-sans}", size: "14px", weight: 600, line-height: "22px", letter-spacing: "0px"}
spacing:
  primitive: {"4": "4px", "6": "6px", "8": "8px", "12": "12px", "16": "16px", "24": "24px", "32": "32px", "48": "48px", "64": "64px", "96": "96px"}
  3xs: "{spacing.primitive.4}"
  2xs: "{spacing.primitive.6}"
  xs: "{spacing.primitive.8}"
  sm: "{spacing.primitive.12}"
  md: "{spacing.primitive.16}"
  lg: "{spacing.primitive.24}"
  xl: "{spacing.primitive.32}"
  2xl: "{spacing.primitive.48}"
  3xl: "{spacing.primitive.64}"
  4xl: "{spacing.primitive.96}"
rounded:
  primitive: {xs: "4px", sm: "6px", md: "8px", lg: "12px", pill: "9999px"}
  control: "{rounded.primitive.md}"
  card: "{rounded.primitive.lg}"
  pill: "{rounded.primitive.pill}"
elevation:
  primitive:
    shadow-4: "0 4px 8px 0 #919EAB29"
    shadow-8: "0 8px 16px 0 #919EAB29"
    shadow-card: "0 0 16px 0 #919EAB33"
  low: "{elevation.primitive.shadow-4}"
  medium: "{elevation.primitive.shadow-8}"
  high: "{elevation.primitive.shadow-card}"
  z-base: 0
  z-sticky: 100
  z-dropdown: 200
  z-overlay: 300
  z-dialog: 400
  z-toast: 500
motion:
  primitive:
    duration-fast: "120ms"
    duration-standard: "200ms"
    duration-slow: "320ms"
    easing-standard: "cubic-bezier(0.2, 0, 0, 1)"
    easing-emphasized: "cubic-bezier(0.2, 0, 0, 1)"
    easing-linear: "linear"
  feedback: {duration: "{motion.primitive.duration-fast}", easing: "{motion.primitive.easing-standard}"}
  transition: {duration: "{motion.primitive.duration-standard}", easing: "{motion.primitive.easing-standard}"}
  entrance: {duration: "{motion.primitive.duration-slow}", easing: "{motion.primitive.easing-emphasized}"}
  exit: {duration: "{motion.primitive.duration-standard}", easing: "{motion.primitive.easing-standard}"}
breakpoints:
  primitive: {mobile: "0px", tablet: "768px", desktop: "1024px", wide: "1440px"}
  content-max: "1200px"
  reading-max: "720px"
  gutter-mobile: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "32px"
components:
  primitive:
    border-width: "1px"
    focus-width: "2px"
    control-height: "40px"
    touch-target: "44px"
  button: {radius: "{rounded.control}", height: "{components.primitive.control-height}", text: "{typography.control}", focus: "{colors.focus}"}
  input: {radius: "{rounded.control}", height: "{components.primitive.control-height}", text: "{typography.body-small}", border: "{colors.border}"}
  card: {radius: "{rounded.card}", border: "{colors.border}", elevation: "{elevation.low}", padding: "{spacing.lg}"}
  focus-ring: {color: "{colors.focus}", width: "{components.primitive.focus-width}", offset: "2px"}
---

# Overview

This design system defines portable guidance for creating clear, consistent, accessible digital interfaces. It covers visual language, content hierarchy, layout, depth, motion, and interaction foundations. It is intentionally independent of any product, brand, frontend framework, or component library.

The system is guided by clarity, consistency, purposeful restraint, accessibility by default, progressive disclosure, and evidence-based adaptation. Interfaces should feel calm, useful, precise, welcoming, and dependable. Product teams may adapt brand colors, content widths, and component details when documented decisions preserve the principles and accessibility requirements here.

The default accessibility target is WCAG 2.2 AA. Product-dependent decisions are adaptable defaults; they must be validated against the actual content, language, input methods, and user needs of each product.

# Colors

## Architecture

Use primitive tokens as the source palette and semantic tokens as the role-based interface contract. Product surfaces should reference semantic roles such as `{colors.surface}` and `{colors.text}`, not raw palette values. This allows themes and product adaptations without changing component intent.

## Token roles

| Token | Resolved value | Intended use |
|---|---|---|
| `{colors.surface}` | `#FFFFFF` | Default page and component surface |
| `{colors.surface-subtle}` | `#F9FAFB` | Quiet grouping surface |
| `{colors.surface-muted}` | `#ECF0F3` | Secondary panels and disabled backgrounds |
| `{colors.text}` | `#161C24` | Primary readable text |
| `{colors.text-muted}` | `#637381` | Supporting text and descriptions |
| `{colors.text-subtle}` | `#919EAB` | Non-essential metadata only |
| `{colors.border}` | `#DFE2E8` | Default separators and outlines |
| `{colors.border-strong}` | `#C4CDD5` | Emphasized boundaries |
| `{colors.primary}` | `#4759A7` | Brand emphasis, links, and selected states |
| `{colors.action-primary}` | `#212B36` | Primary CTA fill, with white text |
| `{colors.action-hover}` | `#161C24` | Primary CTA hover fill |
| `{colors.action-pressed}` | `#000000` | Primary CTA pressed fill |
| `{colors.focus}` | `#37C5F0` | Keyboard focus indicator |
| `{colors.success}` | `#0F913B` | Successful or complete state |
| `{colors.warning}` | `#E88310` | Caution requiring attention |
| `{colors.error}` | `#D82934` | Error, invalid, or destructive state |
| `{colors.info}` | `#44ADDA` | Informational state |
| `{colors.data-1}`–`{colors.data-5}` | `#4759A7`, `#6B52A2`, `#44ADDA`, `#0F913B`, `#E88310` | Ordered data series |

Use color roles consistently for surfaces, text, borders, actions, feedback, focus, and data visualization. Every feedback state must also have a text label, icon, pattern, or other non-color cue. Do not use color alone to communicate status, selection, required fields, errors, or data categories.

## Data-visualization color palette

When generating data visualizations, use the `colors.primitive.viz-*` colors defined in this file and listed in the ordered palette below. This palette is the default for categorical series, charts, maps, and dashboards; do not substitute unrelated colors or the general-purpose `{colors.data-1}`–`{colors.data-5}` palette. Start at the first color and add colors only as needed. For sequential data, use a documented light-to-dark ramp derived from one hue in this palette rather than treating categorical colors as a scale.

| Token | Name | Resolved value | Intended use |
|---|---|---|---|
| `{colors.primitive.viz-astronaut-blue}` | Astronaut Blue | `#003F5C` | First series or strongest baseline |
| `{colors.primitive.viz-barf-green}` | Barf Green | `#A1A600` | Secondary categorical series |
| `{colors.primitive.viz-burnt-yellow}` | Burnt Yellow | `#DFA800` | Highlighted comparison |
| `{colors.primitive.viz-carmine-pink}` | Carmine Pink | `#F95D6A` | Alerting or contrasting series |
| `{colors.primitive.viz-celtic-blue}` | Celtic Blue | `#096ADC` | Blue categorical series |
| `{colors.primitive.viz-irish-green}` | Irish Green | `#0F913B` | Positive or growth series |
| `{colors.primitive.viz-lavender}` | Lavender | `#665191` | Purple categorical series |
| `{colors.primitive.viz-lavender-blue}` | Lavender Blue | `#9CBAEC` | Light secondary series |
| `{colors.primitive.viz-lime-green}` | Lime Green | `#43982C` | Green comparison series |
| `{colors.primitive.viz-mango}` | Mango | `#FF7C43` | Warm comparison series |
| `{colors.primitive.viz-medium-turquoise}` | Medium Turquoise | `#37C5F0` | Accent series |
| `{colors.primitive.viz-muddy-yellow}` | Muddy Yellow | `#C0A700` | Yellow comparison series |
| `{colors.primitive.viz-navy-blue}` | Navy Blue | `#2F4B7C` | Dark blue series |
| `{colors.primitive.viz-onion-green}` | Onion Green | `#649E1A` | Green comparison series |
| `{colors.primitive.viz-orange}` | Orange | `#FFA600` | Warm accent series |
| `{colors.primitive.viz-pea-green}` | Pea Green | `#83A200` | Green comparison series |
| `{colors.primitive.viz-periwinkle-blue}` | Periwinkle Blue | `#6DA2FA` | Light blue series |
| `{colors.primitive.viz-picton-blue}` | Picton Blue | `#41B6FA` | Bright blue series |
| `{colors.primitive.viz-pink-lemonade}` | Pink Lemonade | `#E32F6C` | Pink comparison series |
| `{colors.primitive.viz-plum}` | Plum | `#A05195` | Purple comparison series |
| `{colors.primitive.viz-raspberry}` | Raspberry | `#D45087` | Pink comparison series |
| `{colors.primitive.viz-rich-lilac}` | Rich Lilac | `#C36DCD` | Light purple series |
| `{colors.primitive.viz-rose-madder}` | Rose Madder | `#D82934` | Red or critical series |

Test adjacent series for distinguishability and provide a legend, direct labels, or both. Do not encode a single value with red/green alone; use labels, symbols, patterns, or position as additional cues. Text and essential marks must still meet the applicable WCAG 2.2 AA contrast requirement against their background.

Text and meaningful UI graphics must meet WCAG 2.2 AA contrast: at least 4.5:1 for normal text, 3:1 for large text, and 3:1 for essential graphical objects and user-interface components. Focus indicators must be clearly visible and should provide at least 3:1 contrast against adjacent colors. Check contrast on the actual surface, including themes and state changes.

# Typography

The default family is `{typography.primitive.family-sans}`. Use the first available font, then the system sans-serif fallback. Use `{typography.primitive.family-mono}` only for code, identifiers, or tabular technical values. Do not rely on a custom font being installed.

| Token | Size | Weight | Line height | Letter spacing | Use |
|---|---:|---:|---:|---:|---|
| `{typography.display}` | 64px | 700 | 80px | 0px | Rare page-level display |
| `{typography.heading-1}` | 64px | 700 | 80px | 0px | Primary page heading |
| `{typography.heading-2}` | 48px | 700 | 64px | 0px | Major section heading |
| `{typography.heading-3}` | 32px | 700 | 48px | 0px | Subsection heading |
| `{typography.heading-4}` | 24px | 700 | 36px | 0px | Component or content group heading |
| `{typography.heading-5}` | 20px | 700 | 30px | 0px | Compact heading |
| `{typography.heading-6}` | 14px | 700 | 21px | 0px | Small heading or overline companion |
| `{typography.body}` | 16px | 400 | 24px | 0px | Default reading text |
| `{typography.body-small}` | 14px | 400 | 22px | 0px | Supporting or dense text |
| `{typography.label}` | 16px | 600 | 24px | 0px | Labels and prominent metadata |
| `{typography.control}` | 14px | 600 | 22px | 0px | Buttons and compact controls |
| `{typography.caption}` | 12px | 400 | 18px | 0px | Supplementary metadata |

Use one semantic heading level per hierarchy; do not choose a heading only for its visual size. Maintain readable line lengths, preferably `{breakpoints.reading-max}` or less for long-form text. Do not set essential information in all caps, overly tight tracking, or text smaller than 12px. Text must remain usable when zoomed to 200% and when users increase text spacing.

# Layout

## Spacing

The spacing scale is based on a small set of repeatable values.

| Token | Resolved value | Typical use |
|---|---:|---|
| `{spacing.3xs}` | 4px | Fine icon or text adjustment |
| `{spacing.2xs}` | 6px | Compact internal gap |
| `{spacing.xs}` | 8px | Related control or label gap |
| `{spacing.sm}` | 12px | Small component padding |
| `{spacing.md}` | 16px | Default control and content gap |
| `{spacing.lg}` | 24px | Card padding and group separation |
| `{spacing.xl}` | 32px | Section-internal separation |
| `{spacing.2xl}` | 48px | Major group separation |
| `{spacing.3xl}` | 64px | Section separation |
| `{spacing.4xl}` | 96px | Page-level separation |

Use the smallest token that preserves clear grouping. Related items use smaller gaps; unrelated groups use larger gaps. Align content to a shared grid. The adaptable default grid is 12 columns with 24px gutters and a maximum content width of `{breakpoints.content-max}`.

On mobile, use `{breakpoints.gutter-mobile}` gutters and a single-column flow. At tablet widths, use `{breakpoints.gutter-tablet}` and allow two-column layouts where content remains readable. At desktop widths, use `{breakpoints.gutter-desktop}`, the 12-column grid, and up to `{breakpoints.content-max}` content width. Wide layouts may add whitespace without widening reading measures.

Interactive controls must provide at least `{components.primitive.touch-target}` square touch area, including when the visible icon is smaller. Avoid density that forces precision tapping, horizontal scrolling for ordinary content, or loss of context at narrow widths.

# Elevation and depth

Use `{rounded.primitive.xs}`, `{rounded.primitive.sm}`, `{rounded.primitive.md}`, and `{rounded.primitive.lg}` for progressively larger or more prominent surfaces. Use `{rounded.pill}` only for pills, tags, or fully rounded controls. Default borders use `{components.primitive.border-width}` and `{colors.border}`; use `{colors.border-strong}` for boundaries that must remain visible without shadow.

Use `{elevation.low}` for cards and restrained raised surfaces, `{elevation.medium}` for menus and sticky elements, and `{elevation.high}` for dialogs or prominent overlays. Do not combine strong borders and heavy shadows without a clear hierarchy. Layering follows `{elevation.z-base}`, `{elevation.z-sticky}`, `{elevation.z-dropdown}`, `{elevation.z-overlay}`, `{elevation.z-dialog}`, and `{elevation.z-toast}`. Menus should sit above page content; dialogs should sit above overlays; transient notifications should remain above dialogs only when essential.

# Motion

Use `{motion.feedback}` for immediate state feedback, `{motion.transition}` for ordinary property changes, `{motion.entrance}` for meaningful entrances, and `{motion.exit}` for dismissals. Motion should clarify cause and effect, preserve spatial relationships, and never delay access to content or controls.

Respect reduced-motion preferences by removing non-essential movement, parallax, looping animation, and large transforms. Keep instant state changes and essential status feedback understandable without animation. Avoid decorative motion that distracts, causes discomfort, obscures content, or interferes with reading and input.

# Do’s and Don’ts

## Colors

- Do use semantic roles such as `{colors.primary}` and `{colors.error}`.
- Do verify contrast on every surface and interaction state.
- Do pair color with text, icons, patterns, or position.
- Don’t use raw primitives as undocumented component decisions.
- Don’t use low-contrast `{colors.text-subtle}` for essential information.

## Typography

- Do use `{typography.body}` for default reading content and a clear semantic heading hierarchy.
- Do keep long-form measures near `{breakpoints.reading-max}`.
- Don’t use size alone to communicate hierarchy.
- Don’t truncate essential content or rely on tiny captions to carry meaning.

## Layout and responsiveness

- Do use the spacing scale and align related content to shared edges.
- Do reflow content for mobile rather than simply shrinking desktop layouts.
- Do preserve `{components.primitive.touch-target}` targets.
- Don’t require horizontal scrolling for ordinary reading or forms.

## Components

- Do use `{components.card}` defaults as a starting point and adapt only with a documented reason.
- Do provide clear hover, pressed, selected, disabled, and focus states.
- Don’t introduce one-off radii, shadows, or spacing values without a system-level need.

## Accessibility

- Do target WCAG 2.2 AA and test with keyboard, zoom, screen readers, touch, and high-contrast settings.
- Do keep focus visible using `{components.focus-ring}`.
- Do provide meaningful names, instructions, and error recovery.
- Don’t remove focus indicators or make color the only status cue.

## Forms and validation

- Do place labels before fields, describe expected formats, and preserve entered values after errors.
- Do associate errors with the relevant field and summarize them in a clear, readable way.
- Do distinguish required fields with text or a documented convention.
- Don’t validate only on color, placeholder text, or an icon without explanation.

## Motion

- Do use `{motion.feedback}` and `{motion.transition}` for purposeful feedback.
- Do honor reduced-motion preferences.
- Don’t use looping, flashing, parallax, or delayed transitions that interfere with usability.

## CTA button

Primary CTAs use the application-wide black action style in `src/components/ui/button.css`: `#212B36` with white text, `#161C24` on hover, and `#000000` while pressed. Disabled CTAs use `#C4CDD5` with `#454F5B` text. Use `Button variant="default"` for primary actions. Secondary, navigation, card, and destructive controls retain their own roles. This user-requested action palette supersedes the earlier blue primary-button default without changing brand or data colours.

## Iconography

Use the [Solar icon library](https://icon-sets.iconify.design/solar/) through Iconify. Use outline (`linear`) icons by default. Use duotone (`duotone`) icons for navigation elements.

## Illustrations

Use the [unDraw illustration library](https://undraw.co/illustrations). Set the illustration accent color to `{colors.primitive.purple}` (`#6B52A2`).
