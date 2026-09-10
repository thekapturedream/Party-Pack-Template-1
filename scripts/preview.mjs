// Screenshots every .sheet of a product, for visual QA.
//
//   node scripts/preview.mjs paper-squadron        A4, every document
//   node scripts/preview.mjs paper-squadron 02_    one document
import { chromium } from 'playwright';
import { readdir, mkdir } from 'node:fs/promises';

const product = process.argv[2];
if (!product) throw new Error('Usage: node scripts/preview.mjs <product-slug> [document filter] [Letter]');
const filter = process.argv[3] ?? '';
const size = process.argv.includes('Letter') ? 'Letter' : 'A4';

const dir = `dist/${product}/html`;
const out = `dist/${product}/preview`;
await mkdir(out, { recursive: true });
const files = (await readdir(dir)).filter((f) => f.endsWith(`_${size}.html`) && f.includes(filter));

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
for (const f of files) {
  await page.goto(`file://${process.cwd()}/${dir}/${f}`);
  await page.evaluate(() => document.fonts.ready);
  const sheets = await page.$$('.sheet');
  for (let i = 0; i < sheets.length; i++) {
    const stem = f.replace(/_(A4|Letter)\.html$/, '');
    await sheets[i].screenshot({ path: `${out}/${stem}-${String(i + 1).padStart(2, '0')}.png` });
  }
  console.log(f, sheets.length, 'sheets');
}
await browser.close();
