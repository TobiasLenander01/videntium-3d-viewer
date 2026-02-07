# Tailwind CSS v4.0 Technical Reference

## 1. Core Architecture: The Oxide Engine

Tailwind v4.0 is a ground-up rewrite featuring a new high-performance engine called **Oxide**, built with **Rust**.

* **Performance:** Full builds are up to **5x faster**, and incremental rebuilds can be over **100x faster**, often completing in microseconds.
* **Zero-Configuration:** All template files are discovered automatically. The engine ignores files in `.gitignore` and binary extensions (images, videos, etc.) by default.
* **Unified Toolchain:** No external plugins like `postcss-import` are required; it handles `@import` rules and vendor prefixing (via Lightning CSS) out of the box.

## 2. Configuration Strategy: CSS-First

The biggest shift in v4.0 is moving from `tailwind.config.js` to a **CSS-first configuration**.

* **The `@theme` Block:** Customizations are defined directly in your CSS file using the `@theme` directive.
* **Native CSS Variables:** Design tokens (colors, spacing, fonts) are automatically exposed as native CSS variables (e.g., `--color-blue-500`) for use anywhere in your styles or inline styles.
* **Dynamic Utility Values:** Utilities for spacing, sizing, and grids now accept arbitrary values without requiring manual theme extension or the `[...]` syntax.

## 3. Key New Features & Utilities

* **3D Transforms:** Built-in APIs for 3D space manipulation, including `rotate-x-*`, `rotate-y-*`, `translate-z-*`, and `perspective-*`.
* **Container Queries:** First-class support for `@container` without external plugins. Includes support for range-based queries using `@min-*` and `@max-*`.
* **Expanded Gradients:** New utilities for **radial** and **conic** gradients, as well as the ability to set interpolation modes (e.g., `oklch`, `srgb`) using modifiers.
* **Modern CSS Interoperability:** Deep integration with native **Cascade Layers** (`@layer`), registered custom properties (`@property`), and `color-mix()` for opacity adjustments.
* **Advanced Variants:** Includes the `not-*` variant (negating pseudo-classes or media queries) and `@starting-style` support for entry animations without JavaScript.

## 4. Installation & Integration

For projects using **Vite**, Tailwind v4.0 offers a dedicated first-party plugin for maximum performance.

### Vite Setup

1. **Install:** `npm install tailwindcss @tailwindcss/vite`.
2. **Config:** Add `tailwindcss()` to your `vite.config.ts`.
3. **Entry Point:** Add `@import "tailwindcss";` to your main CSS file.

## 5. Migration & Compatibility

* **Upgrade Tool:** An automated tool is available via `npx @tailwindcss/upgrade` to migrate configs and dependencies.
* **Browser Support:** Designed for modern browsers (Safari 16.4+, Chrome 111+, Firefox 128+). For legacy support, stay on v3.4.
* **Default Changes:** Border colors and ring utilities now default to `currentColor` instead of `gray-200`.