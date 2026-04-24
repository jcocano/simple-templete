// Generates the app icon artifacts from `assets/icon.svg`:
//   build/icon.png        → 512×512 plain artwork (Linux + Windows runtime)
//   build/icon-macos.png  → 512×512 squircle+bg variant (macOS Dock runtime)
//   build/icon.icns       → macOS bundle, built from the squircle master
//   build/icon.ico        → Windows bundle, built from the plain master
//
// Why two PNG variants: macOS icons are expected to be a filled squircle
// tile (Big Sur conventions) — the OS does not apply a mask. Linux taskbars
// and Windows title-bars render the raw PNG without shape masking, so they
// get the plain transparent artwork.
//
// Cross-platform (pure JS — no brew/iconutil required). Rerun this after
// editing assets/icon.svg:
//   npm run build:icons

import sharp from 'sharp';
import png2icons from 'png2icons';
import { writeFile } from 'fs/promises';

const SRC = 'assets/icon.svg';
const OUT = 'build';

// --- Plain master (Linux / Windows runtime / Windows .ico) ---
const plainMaster = await sharp(SRC)
  .resize(1024, 1024)
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(plainMaster)
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/icon.png`);

// --- macOS squircle master ---
// Big Sur-era icons use a squircle tile ≈22% corner radius on a 1024 canvas
// with the artwork centered inside a small inset. Simple rounded rect with
// rx = 225 is a close-enough approximation to Apple's true squircle.
const MAC_SIZE = 1024;
const MAC_RADIUS = 225;
const MAC_INSET = 220;          // padding on each side → artwork at 584×584 (≈57%)

const macBgSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${MAC_SIZE}" height="${MAC_SIZE}">` +
    `<rect x="0" y="0" width="${MAC_SIZE}" height="${MAC_SIZE}" ` +
      `rx="${MAC_RADIUS}" ry="${MAC_RADIUS}" fill="#FFFFFF"/>` +
  `</svg>`
);

const macArtwork = await sharp(SRC)
  .resize(MAC_SIZE - MAC_INSET * 2, MAC_SIZE - MAC_INSET * 2)
  .png()
  .toBuffer();

const macMaster = await sharp(macBgSvg)
  .composite([{ input: macArtwork, top: MAC_INSET, left: MAC_INSET }])
  .png({ compressionLevel: 9 })
  .toBuffer();

// 512×512 variant for app.dock.setIcon at runtime
await sharp(macMaster)
  .resize(512, 512)
  .png({ compressionLevel: 9 })
  .toFile(`${OUT}/icon-macos.png`);

// --- macOS .icns (multi-resolution, built from the squircle master) ---
const icns = png2icons.createICNS(macMaster, png2icons.BILINEAR, 0);
if (!icns) throw new Error('icns generation failed');
await writeFile(`${OUT}/icon.icns`, icns);

// --- Windows .ico (plain master, 9 resolutions 16 → 256) ---
const ico = png2icons.createICO(plainMaster, png2icons.BILINEAR, 0, false, true);
if (!ico) throw new Error('ico generation failed');
await writeFile(`${OUT}/icon.ico`, ico);

console.log(
  `Wrote ${OUT}/icon.png · ${OUT}/icon-macos.png · ${OUT}/icon.icns · ${OUT}/icon.ico`
);
