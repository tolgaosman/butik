---
description: "Best practices and standards for Framer Motion animations."
trigger: "model_decision"
---

# Framer Motion

- **Performance First:** Animate only `transform` and `opacity`. Never animate `width`, `height`, `top`, or `left` directly as it causes layout thrashing.
- **Layout Animations:** Use the `layout` prop for smooth structural changes, and `layoutId` to animate elements seamlessly between different components.
- **Easing Curves:** Avoid default linear or basic easing. Use organic cubic-bezier curves (e.g., `ease: [0.32, 0.72, 0, 1]`) for premium-feeling spring physics and transitions.
- **AnimatePresence:** Wrap components in `<AnimatePresence>` for exit animations, ensuring unmounting looks just as smooth as mounting.
- **Staggered Children:** Use `variants` on parents with `staggerChildren` to create cascading entrance animations for lists and grids.
