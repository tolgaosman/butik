import { rmSync } from "node:fs";

/**
 * .next is fully derived output. Wipe it when a build was interrupted or two
 * dev servers raced on it — a half-written cache surfaces as 500s on every
 * route rather than as a compile error.
 */

rmSync(".next", { recursive: true, force: true });
process.stdout.write("  .next temizlendi.\n");
