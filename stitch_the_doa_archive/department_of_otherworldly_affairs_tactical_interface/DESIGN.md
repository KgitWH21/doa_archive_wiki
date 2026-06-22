---
name: Department of Otherworldly Affairs Tactical Interface
colors:
  surface: '#071325'
  surface-dim: '#071325'
  surface-bright: '#2e394d'
  surface-container-lowest: '#030e20'
  surface-container-low: '#101c2e'
  surface-container: '#142032'
  surface-container-high: '#1f2a3d'
  surface-container-highest: '#2a3548'
  on-surface: '#d7e3fc'
  on-surface-variant: '#d1c5b0'
  inverse-surface: '#d7e3fc'
  inverse-on-surface: '#253144'
  outline: '#9a907d'
  outline-variant: '#4e4636'
  surface-tint: '#ecc155'
  primary: '#ecc155'
  on-primary: '#3e2e00'
  primary-container: '#b8922a'
  on-primary-container: '#3d2d00'
  inverse-primary: '#775a00'
  secondary: '#b7c7eb'
  on-secondary: '#21304d'
  secondary-container: '#374765'
  on-secondary-container: '#a6b5d9'
  tertiary: '#66d9cc'
  on-tertiary: '#003732'
  tertiary-container: '#29a89c'
  on-tertiary-container: '#003631'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdf97'
  primary-fixed-dim: '#ecc155'
  on-primary-fixed: '#251a00'
  on-primary-fixed-variant: '#5a4400'
  secondary-fixed: '#d7e2ff'
  secondary-fixed-dim: '#b7c7eb'
  on-secondary-fixed: '#0a1b37'
  on-secondary-fixed-variant: '#374765'
  tertiary-fixed: '#84f5e8'
  tertiary-fixed-dim: '#66d9cc'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#071325'
  on-background: '#d7e3fc'
  surface-variant: '#2a3548'
typography:
  headline-lg:
    fontFamily: Rajdhani
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Rajdhani
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Rajdhani
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Rajdhani
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 22px
  label-caps:
    fontFamily: Share Tech Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.1em
  label-sm:
    fontFamily: Share Tech Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 14px
  status-strip:
    fontFamily: Share Tech Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 12px
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  hazard-height: 20px
  container-padding: 16px
  gutter: 12px
---

## Brand & Style

The design system establishes a high-stakes, "eyes only" atmosphere appropriate for a clandestine intelligence archive. The aesthetic combines **Modern Brutalism** with **Tactile/Military** influences, evoking the sensation of a secure digital terminal accessed in a low-light field environment.

The UI should feel authoritative, technical, and slightly cold, punctuated by urgent warning motifs. The target audience—lore enthusiasts and "operatives"—should feel like they are interacting with a classified government database. Motion should be utilitarian (abrupt cuts, scanning lines, or flickering terminal effects) rather than decorative.

Visual hallmarks include:
- **Hazard Motifs:** Diagonal gold/dark gold stripes signifying restricted zones.
- **Monospaced Utility:** Heavy use of fixed-width fonts for meta-data and system status.
- **Structural Integrity:** Use of visible borders and segmented panels to imply a rigid information hierarchy.

## Colors

The palette is anchored in deep "Midnight Intelligence" blues and "Tactical Navy." 

- **Primary Background (#0A1628):** Used for the deepest layer of the UI and form inputs.
- **Surface Color (#0D1E3A):** Used for containers, headers, and cards to create subtle depth against the background.
- **Gold Accent (#B8922A):** Used for critical actions, status stripes, and highlighting restricted content.
- **Warm Cream (#E8D5A3):** High-readability heading color that feels like aged parchment or high-contrast terminal text.
- **Muted Blue-Gray (#7A9CB8):** Used for body text and descriptive metadata to lower visual noise.
- **Success Teal (#26A69A):** Specifically designates "Unclassified" or "Safe" status.
- **Error Red (#E24244):** Reserved for "Access Denied" states, "Classified" warnings, and critical system failures.

## Typography

The typography system relies on a dual-font approach to distinguish between "System/Machine" output and "Human/Archive" content.

- **Share Tech Mono:** Utilized for the "UI Chrome." This includes labels, tags, eyebrows, button text, and the diagonal status banners. It communicates a technical, monospaced military feel. All status text in banners must be uppercase with expanded letter spacing.
- **Rajdhani:** Utilized for all narrative content. Its condensed, squared-off letterforms maintain the technical aesthetic while providing the legibility required for reading long-form archive entries.

**Scale Adjustments:**
- Mobile titles should never exceed 28px to ensure complex archive designations do not wrap excessively.
- Body text should maintain a 16px minimum for field readability.

## Layout & Spacing

The layout follows a **Mobile-First Fixed Grid** philosophy. The content is contained within a rigid frame defined by the top and bottom hazard banners.

- **Hazard Banners:** Every screen is bookended by a 20px fixed-height banner featuring diagonal gold stripes.
- **Header Section:** Screen titles sit on a Surface Color (#0D1E3A) block with a 1px solid Gold (#B8922A) bottom border.
- **Padding:** A standard 16px (md) margin is applied to the main content area.
- **Vertical Rhythm:** Elements are separated by 12px or 16px increments to maintain a dense, information-rich "document" feel.
- **Reflow:** On wider screens, the central content area is capped at 600px to maintain the "mobile terminal" aspect ratio, centering the archive within the viewport.

## Elevation & Depth

This design system eschews traditional shadows in favor of **Tonal Layering** and **Line Work**. 

- **Depth via Borders:** Elevation is communicated through border weight and opacity. Entry cards use a 1px Gold border at 30% opacity to sit slightly above the primary background.
- **Gated Surfaces:** High-security or "Gated" panels use 100% opacity Gold borders to demand immediate attention.
- **Structural Lines:** Horizontal rules (HR) should be used to segment data within a single card, typically 1px solid Navy (#0A1628) or Muted Blue (#7A9CB8) at low opacity.
- **Backdrop Blurs:** The "Booker" chat interface may use a subtle backdrop blur on its container to separate the active terminal session from the background archive.

## Shapes

The shape language is primarily **Industrial and Angular**. 

- **Corners:** Use a consistent 0.25rem (Soft) radius for cards and inputs to prevent the UI from feeling overly sharp/hostile, while maintaining a precise, military-spec appearance.
- **Buttons:** Primary CTA buttons should be rectangular or have minimal rounding.
- **Status Badges:** Use "clipped corner" effects (via CSS clip-path) where possible for classification tags (e.g., "UNCLASSIFIED") to mimic physical military tags.

## Components

### Buttons
- **Primary:** Solid Gold (#B8922A) background with Primary Background (#0A1628) text. Bold, Uppercase Share Tech Mono.
- **Secondary/Ghost:** Surface Color background, 1px Gold border (30% opacity). 
- **Action/Destructive:** 1px Error Red (#E24244) border with Red text.

### Entry Cards
- **Structure:** Surface Color (#0D1E3A) background, 30% Gold border. 
- **Header:** Contains eyebrow metadata in Muted Blue-Gray, Status Badge in top right.
- **Footer:** Inline action links (e.g., "READ ENTRY") in uppercase Share Tech Mono with a small trailing arrow.

### Form Inputs
- **Field:** Primary Background (#0A1628) fill with a 1px Muted Blue-Gray border. 
- **Focus State:** 1px Gold border.
- **Error State:** 1px Red border with a red warning icon and Rajdhani error text below the field.

### Booker Chat
- **User Bubble:** Surface Color (#0D1E3A) with a subtle blue tint. Right-aligned.
- **Booker Bubble:** Darker background with a persistent Gold left-accent bar. 
- **Results Badges:** Small, pill-shaped tags appearing below Booker’s responses to link directly to archive entries.

### Status Indicators
- **Unclassified:** Success Teal (#26A69A) dot or badge.
- **Restricted/Classified:** Gold (#B8922A) or Red (#E24244) with a lock icon.
- **Hazard Tape:** Used for "Alert" bars that span the full width of a container.