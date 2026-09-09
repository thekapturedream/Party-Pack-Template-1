// Fails the build if anything overflows its sheet. Print has no scrollbar, so
// overflow silently truncates — this is the only way to catch it reliably.
import { chromium } from 'playwright';
import { readdir } from 'node:fs/promises';

const dir = 'dist/html';
const files = await readdir(dir);
const browser = await chromium.launch();
const page = await browser.newPage();
let bad = 0;

for (const f of files) {
  await page.goto(`file://${process.cwd()}/${dir}/${f}`);
  await page.evaluate(() => document.fonts.ready);
  const overflows = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.sheet')).flatMap((s, i) => {
      const slack = s.scrollHeight - s.clientHeight;
      const wide = s.scrollWidth - s.clientWidth;
      return slack > 1 || wide > 1 ? [{ page: i + 1, over: slack, wide }] : [];
    }));
  for (const o of overflows) {
    console.error(`OVERFLOW  ${f}  page ${o.page}  +${o.over}px tall  +${o.wide}px wide`);
    bad++;
  }
}
await browser.close();
console.log(bad === 0 ? 'fit check: all sheets fit' : `fit check: ${bad} overflowing sheet(s)`);
process.exit(bad === 0 ? 0 : 1);
