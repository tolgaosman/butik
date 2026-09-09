---
description: "Rules for advanced frontend design systems and component architecture."
trigger: "model_decision"
---

# Frontend Design

- **Component Composition:** Build small, reusable, and single-responsibility components. Use a standard `components/ui/` directory.
- **Tailwind Mastery:** Use Tailwind CSS intentionally. Avoid overly long inline class strings by using `cva` (class-variance-authority) or `clsx`/`tailwind-merge` for complex variants.
- **Responsive by Default:** All layouts must gracefully handle mobile, tablet, and desktop viewports. Start mobile-first.
- **Accessibility (a11y):** Ensure proper `aria-` attributes, keyboard navigability, and sufficient color contrast.
- **State Management:** Use React Context for global state only when necessary (e.g., Auth, Cart). Rely on server components and props for data passing where possible.
