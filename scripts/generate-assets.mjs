// Generates favicon/apple icons from the heritage emblem and 1200x630 OG images.
// Run: node scripts/generate-assets.mjs   (sharp is a devDependency)
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const IVORY = { r: 244, g: 239, b: 229, alpha: 1 };
const logo = "public/images/heritage/bacchus_logo.png";

await mkdir("public/og", { recursive: true });

// 32px favicon: emblem on ivory (downscaled from the 83x70 source)
const emblem32 = await sharp(logo).resize({ width: 28, height: 24, fit: "inside" }).png().toBuffer();
await sharp({ create: { width: 32, height: 32, channels: 4, background: IVORY } })
  .composite([{ input: emblem32, gravity: "centre" }])
  .png()
  .toFile("app/icon.png");

// 180px apple touch icon: emblem at 1.5x on ivory, no heavy upscale
const emblem124 = await sharp(logo).resize({ width: 124, height: 105, fit: "inside", kernel: "lanczos3" }).png().toBuffer();
await sharp({ create: { width: 180, height: 180, channels: 4, background: IVORY } })
  .composite([{ input: emblem124, gravity: "centre" }])
  .png()
  .toFile("app/apple-icon.png");

// OG images 1200x630 with a soft wine gradient at the bottom
const gradient = Buffer.from(
  `<svg width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="55%" stop-color="#1B0B11" stop-opacity="0"/><stop offset="100%" stop-color="#1B0B11" stop-opacity=".85"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/></svg>`,
);
const wordmark = (sub) =>
  Buffer.from(
    `<svg width="1200" height="630"><text x="64" y="530" font-family="Georgia, 'Times New Roman', serif" font-size="88" letter-spacing="14" fill="#F4EFE5">BACCHUS</text><text x="68" y="580" font-family="Helvetica, Arial, sans-serif" font-size="20" letter-spacing="6" fill="#F4EFE5" opacity=".85">${sub}</text></svg>`,
  );

await sharp("public/images/restaurant/bacchus-from-the-sea-close.jpg")
  .resize(1200, 630, { fit: "cover", position: "attention" })
  .composite([{ input: gradient }, { input: wordmark("MESSONGHI BEACH • CORFU") }])
  .jpeg({ quality: 82 })
  .toFile("public/og/home.jpg");

await sharp("public/images/restaurant/wedding-table-sea.jpg")
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .composite([{ input: gradient }, { input: wordmark("BOOK A TABLE • MESSONGHI, CORFU") }])
  .jpeg({ quality: 82 })
  .toFile("public/og/book.jpg");

console.log("assets: app/icon.png app/apple-icon.png public/og/home.jpg public/og/book.jpg");
