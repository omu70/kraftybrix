import { execSync } from "node:child_process";

/**
 * Runs during the Vercel build.
 * If DATABASE_URL is set, it creates/updates the database tables automatically
 * (prisma db push) — so the store owner never needs a terminal.
 * If not set, it skips silently (demo mode still builds fine).
 */
if (process.env.DATABASE_URL) {
  console.log("• DATABASE_URL found — syncing tables (prisma db push)…");
  try {
    execSync("npx prisma db push --skip-generate --accept-data-loss", { stdio: "inherit" });
    console.log("✓ Tables ready.");
  } catch (e) {
    console.error("! prisma db push failed — continuing build:", e?.message ?? e);
  }
} else {
  console.log("• No DATABASE_URL set — skipping table sync (demo mode).");
}
