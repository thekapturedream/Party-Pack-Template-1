// Fails the build if anything overflows its sheet. Print has no scrollbar, so
// overflow silently truncates — this is the only way to catch it reliably.
//
//   node scripts/check-fit.mjs                  every product
//   node scripts/check-fit.mjs paper-squadron   one product
import { chromium } from 'playwright';
import { readdir } from 'node:fs/promises';

const only = process.argv.slice(2);
const products = (await readdir('dist', { withFileTypes: true }))
  .filter((d) => d.isDirectory() && (only.length === 0 || only.includes(d.name)))
  .map((d) => d.name);
if (products.length === 0) throw new Error('Nothing built. Run: node src/build.ts --html');

const browser = await chromium.launch();
const page = await browser.newPage();
let bad = 0;
let checked = 0;

for (const product of products) {
  const dir = `dist/${product}/html`;
  let files;
  try {
    files = await readdir(dir);
  } catch {
    console.error(`SKIPPED   ${product} — no HTML. Run: node src/build.ts ${product} --html`);
    bad++;
    continue;
  }
  for (const f of files) {
    await page.goto(`file://${process.cwd()}/${dir}/${f}`);
    await page.evaluate(() => document.fonts.ready);
    const overflows = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.sheet')).flatMap((s, i) => {
        const slack = s.scrollHeight - s.clientHeight;
        const wide = s.scrollWidth - s.clientWidth;
        return slack > 1 || wide > 1 ? [{ page: i + 1, over: slack, wide }] : [];
      }));
    checked++;
    for (const o of overflows) {
      console.error(`OVERFLOW  ${product}/${f}  page ${o.page}  +${o.over}px tall  +${o.wide}px wide`);
      bad++;
    }
  }
}
await browser.close();
console.log(bad === 0 ? `fit check: ${checked} files, all sheets fit` : `fit check: ${bad} problem(s)`);
process.exit(bad === 0 ? 0 : 1);
