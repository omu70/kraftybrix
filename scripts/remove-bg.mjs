/**
 * Batch white-background removal for product images via remove.bg.
 *
 * Usage:
 *   1. Get an API key at https://www.remove.bg/api  (50 free/mo)
 *   2. REMOVE_BG_KEY=xxxx node scripts/remove-bg.mjs
 *
 * Reads every CloudFront image URL from src/lib/products.ts, removes the
 * background, and writes transparent PNGs to public/products/<slug>.png.
 * Then set USE_LOCAL_IMAGES and the site will float products on dark.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { products } from "../src/lib/products.ts";

const KEY = process.env.REMOVE_BG_KEY;
if (!KEY) {
  console.error("Set REMOVE_BG_KEY env var. Get one at https://www.remove.bg/api");
  process.exit(1);
}

await mkdir("public/products", { recursive: true });

for (const p of products) {
  const src = p.images?.[0]?.url;
  if (!src?.startsWith("http")) continue;
  process.stdout.write(`• ${p.slug} … `);
  try {
    const form = new FormData();
    form.append("image_url", src);
    form.append("size", "auto");
    const res = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": KEY },
      body: form,
    });
    if (!res.ok) {
      console.log(`failed (${res.status})`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(`public/products/${p.slug}.png`, buf);
    console.log("done");
  } catch (e) {
    console.log("error", e.message);
  }
}
console.log("\nAll done. Point product images at /products/<slug>.png to float on dark.");
