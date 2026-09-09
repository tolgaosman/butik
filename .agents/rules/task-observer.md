---
description: "Rules for task tracking and observation."
trigger: "always_on"
---

# Task Observer

- **Checklist Driven:** Always break down complex requests into a checklist inside `task.md`.
- **Step-by-Step Execution:** Execute one checklist item at a time. Mark it as `[x]` only when verified.
- **Output Observation:** NEVER assume a command or code change worked. Always observe the output (logs, terminal, UI) and verify.
- **Loop Prevention:** If an error occurs twice in a row, STOP. Do not blindly retry the same fix. Analyze the root cause deeply.
- **Progress Reporting:** When pausing for user feedback, clearly state what has been completed and what is pending.
