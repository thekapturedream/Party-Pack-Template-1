// Screenshots every .sheet in a built HTML file, for visual QA.
import { chromium } from 'playwright';
import { readdir, mkdir } from 'node:fs/promises';

const dir = 'dist/html';
const out = 'dist/preview';
await mkdir(out, { recursive: true });
const filter = process.argv[2] ?? 'A4';
const files = (await readdir(dir)).filter((f) => f.includes(filter));

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
for (const f of files) {
  await page.goto(`file://${process.cwd()}/${dir}/${f}`);
  await page.evaluate(() => document.fonts.ready);
  const sheets = await page.$$('.sheet');
  for (let i = 0; i < sheets.length; i++) {
    await sheets[i].screenshot({ path: `${out}/${f.replace(/_A4\.html|_Letter\.html/, '')}-${String(i + 1).padStart(2, '0')}.png` });
  }
  console.log(f, sheets.length, 'sheets');
}
await browser.close();
