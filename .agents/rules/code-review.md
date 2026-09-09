---
description: "Self-review protocols and checklist before completing tasks."
trigger: "model_decision"
---

# Code Review

Before finalizing any PR or major task, you must self-review:

- **Regressions:** Have I broken any existing functionality? Have I broken any existing UI layouts?
- **Type Safety:** Are there any `any` types or `@ts-ignore` directives that could be fixed?
- **Performance:** Am I fetching unnecessary data? Am I causing unnecessary re-renders in React?
- **Readability:** Are variables and functions named expressively?
- **Edge Cases:** What happens on empty states, loading states, API errors, or when the user is logged out?
- **Cleanup:** Have I removed all debug `console.log` statements and unused imports?
