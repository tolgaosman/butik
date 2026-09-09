---
description: "Rules for managing context memory and artifacts."
trigger: "always_on"
---

# Claude-Mem

- **Artifact Usage:** Always use artifacts (`task.md`, `implementation_plan.md`, `walkthrough.md`) to offload memory and track progress.
- **State Persistence:** When making complex changes, explicitly log decisions and state in `walkthrough.md` so the user and future agents have context.
- **Context Preservation:** Do not lose track of the original user request. Frequently refer back to the core goal.
- **Living Documentation:** Treat the codebase as living memory. Use clear, self-documenting code over excessive comments. If a complex workaround is needed, document the *why* inline.
