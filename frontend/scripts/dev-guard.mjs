import { createServer } from "node:net";

/**
 * Next.js silently falls back to the next free port when the requested one is
 * taken, so a second `npm run dev` keeps running — and keeps compiling into the
 * same .next directory as the first. Two webpack compilers racing on one output
 * directory delete each other's chunks, which surfaces later as
 * "Cannot find module './xxx.js'" and a missing routes-manifest.json.
 *
 * Refuse to start instead of silently corrupting the build cache.
 */

const port = Number(process.env.PORT ?? 3000);
const probe = createServer();

probe.once("error", (error) => {
  if (error.code !== "EADDRINUSE") throw error;

  process.stderr.write(
    `\n  Port ${port} kullanımda — büyük ihtimalle zaten çalışan bir "npm run dev" var.\n\n` +
      `  İkinci bir dev sunucusu aynı .next klasörüne yazar ve build cache'ini bozar\n` +
      `  (kayıp chunk'lar, her sayfada 500, kaybolan içerik).\n\n` +
      `  Çalışan sunucuyu kullan, ya da onu Ctrl+C ile durdurup tekrar dene.\n` +
      `  Cache zaten bozulduysa: npm run dev:reset && npm run dev\n\n`,
  );
  process.exit(1);
});

probe.once("listening", () => probe.close(() => process.exit(0)));

probe.listen(port);
