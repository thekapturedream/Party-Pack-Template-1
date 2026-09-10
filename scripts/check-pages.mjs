// Fails if a built PDF has a different number of pages from the sheet count the
// catalogue declares. Those numbers are quoted on the Start Here sheet, in the
// zip's readme and in the shop listing, so a document that quietly gains or
// loses a page makes three documents wrong at once.
//
//   node scripts/check-pages.mjs                  every product
//   node scripts/check-pages.mjs paper-squadron   one product
import { readFile } from 'node:fs/promises';
import { PDFDocument } from 'pdf-lib';
import { PRODUCTS } from '../src/products.ts';

const only = process.argv.slice(2);
const products = only.length ? PRODUCTS.filter((p) => only.includes(p.slug)) : PRODUCTS;
if (products.length === 0) throw new Error(`No such product. Known: ${PRODUCTS.map((p) => p.slug).join(', ')}`);

let bad = 0;
let checked = 0;

for (const product of products) {
  for (const size of ['A4', 'Letter']) {
    for (const doc of product.documents) {
      const path = `dist/${product.slug}/${size}/${doc.slug}_${size}.pdf`;
      const pdf = await PDFDocument.load(await readFile(path));
      const pages = pdf.getPageCount();
      checked++;
      if (pages !== doc.sheets) {
        console.error(`PAGES  ${path}  has ${pages}, catalogue says ${doc.sheets}`);
        bad++;
      }
    }
  }
}

console.log(bad === 0
  ? `page check: ${checked} PDFs, every page count matches the catalogue`
  : `page check: ${bad} mismatch(es)`);
process.exit(bad === 0 ? 0 : 1);
