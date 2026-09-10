// The shared machinery behind the shop images and the Pinterest pins.
//
// Both are built from the product's own design tokens and from screenshots of
// real printed pages, so a listing image can never promise something the PDF
// does not contain. The compositions themselves live one file per product.
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';

const THEMES = {
  museum: ['src/design/museum/tokens.css', 'src/design/museum/sheet.css', 'assets/fonts/fonts.css'],
  flight: ['src/design/flight/tokens.css', 'src/design/flight/sheet.css', 'assets/fonts/flight.css'],
};

export async function loadTheme(name) {
  const [tokens, sheet, fonts] = THEMES[name];
  return {
    tokens: await readFile(tokens, 'utf8'),
    sheet: await readFile(sheet, 'utf8'),
    page: await readFile('src/design/page.css', 'utf8'),
    fonts: await readFile(fonts, 'utf8'),
  };
}

/** A screenshot of one printed sheet, as a data URI. */
export async function pagePng(product, name) {
  const bytes = await readFile(`dist/${product}/preview/${name}.png`);
  return `data:image/png;base64,${bytes.toString('base64')}`;
}

/** Renders each composition to PNG and to JPEG. The shop upload path is
 *  size-sensitive and these are flat-colour compositions that compress
 *  cleanly, so both are worth having. */
export async function renderAll({ theme, out, css, images, scale = 2.5, bare = false, jpegOnly = false, quality = 88 }) {
  await mkdir(out, { recursive: true });
  const t = await loadTheme(theme);
  const browser = await chromium.launch();
  for (const img of images) {
    const page = await browser.newPage({
      viewport: { width: img.w, height: img.h },
      deviceScaleFactor: scale,
    });
    // A pin is a self-contained composition and brings its own rules; loading
    // the print page system underneath it would quietly change its type.
    const base = bare ? '' : `<style>${t.page}</style><style>${t.sheet}</style>`;
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"/>
      <style>${t.fonts}</style><style>${t.tokens}</style>${base}
      <style>body{width:${img.w}px;height:${img.h}px;margin:0}${css}</style>
      </head><body>${img.body}</body></html>`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    if (!jpegOnly) await page.screenshot({ path: `${out}/${img.name}.png` });
    await page.screenshot({ path: `${out}/${img.name}.jpg`, type: 'jpeg', quality });
    await page.close();
    console.log(`${out}/${img.name}.${jpegOnly ? 'jpg' : 'png'}`);
  }
  await browser.close();
}
