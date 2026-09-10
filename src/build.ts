// Renders every document of a product to A4 and US Letter.
//
//   node src/build.ts                       every product
//   node src/build.ts paper-squadron        one product
//   node src/build.ts paper-squadron 02_    one document of it
//   node src/build.ts --html                also keep the HTML, for the scripts
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { chromium, type Browser } from 'playwright';
import { PRODUCTS, type Product } from './products.ts';
import type { PaperSize } from './render/shell.ts';

const SIZES: PaperSize[] = ['A4', 'Letter'];
const OUT = 'dist';

async function renderPdf(browser: Browser, markup: string, size: PaperSize, path: string) {
  const page = await browser.newPage();
  await page.setContent(markup, { waitUntil: 'load' });
  await page.evaluate(() => (document as Document & { fonts: FontFaceSet }).fonts.ready);
  await page.pdf({
    path,
    format: size,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: false,
  });
  await page.close();
}

async function buildProduct(browser: Browser, p: Product, docFilters: string[], keepHtml: boolean) {
  const specs = docFilters.length
    ? p.documents.filter((d) => docFilters.some((f) => d.slug.includes(f)))
    : p.documents;

  for (const size of SIZES) {
    const dir = `${OUT}/${p.slug}/${size}`;
    await mkdir(dir, { recursive: true });
    for (const spec of specs) {
      const markup = spec.render(size);
      if (keepHtml) {
        await mkdir(`${OUT}/${p.slug}/html`, { recursive: true });
        await writeFile(`${OUT}/${p.slug}/html/${spec.slug}_${size}.html`, markup);
      }
      const file = `${dir}/${spec.slug}_${size}.pdf`;
      await renderPdf(browser, markup, size, file);
      process.stdout.write(`  ${file}\n`);
    }
  }
}

async function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const slugs = PRODUCTS.map((p) => p.slug);
  const wanted = args.filter((a) => slugs.includes(a));
  const docFilters = args.filter((a) => !slugs.includes(a));
  const products = wanted.length ? wanted.map((s) => PRODUCTS.find((p) => p.slug === s)!) : PRODUCTS;
  const keepHtml = process.argv.includes('--html');

  if (!wanted.length && !docFilters.length) await rm(OUT, { recursive: true, force: true });
  const browser = await chromium.launch();
  for (const p of products) await buildProduct(browser, p, docFilters, keepHtml);
  await browser.close();
}

await main();
