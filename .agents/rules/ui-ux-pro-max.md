---
description: "Absolute premium tier UI/UX rules."
trigger: "model_decision"
---

# UI UX Pro Max

- **Skeleton States:** Never show a blank screen or a raw spinner on data load. Use animated shimmer skeleton loaders that match the layout structure.
- **Micro-Interactions:** Buttons must have subtle `hover` and `active` (press) states. Icons should animate slightly on interaction.
- **Error States:** Errors must be graceful. Never just crash. Show contextual error messages with a clear call-to-action (e.g., "Try Again" or "Go Home").
- **Empty States:** When a list is empty, display a beautifully illustrated empty state with a helpful prompt, not just "0 items".
- **Visual Hierarchy:** Use typography scale and font weights to guide the eye. De-emphasize secondary text using muted colors (e.g., `text-gray-500`).
- **Glassmorphism & Depth:** Where appropriate, use subtle backdrop blurs (`backdrop-blur-md`) and layered shadows to create physical depth without visual noise.
