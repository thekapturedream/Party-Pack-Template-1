// Assembles a customer download: the two paper folders, a plain-text readme for
// people who open the zip before they open a PDF, and the zip itself.
//
//   node scripts/package.mjs paper-squadron
//   node scripts/package.mjs                 every product
import { mkdir, rm, copyFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { PRODUCTS } from '../src/products.ts';

const only = process.argv.slice(2);
const products = only.length ? PRODUCTS.filter((p) => only.includes(p.slug)) : PRODUCTS;
if (products.length === 0) throw new Error(`No such product. Known: ${PRODUCTS.map((p) => p.slug).join(', ')}`);

if (!only.length) await rm('release', { recursive: true, force: true });

for (const product of products) {
  const stem = `${product.releaseName}-v${product.version}`;
  const root = `release/${stem}`;
  await rm(root, { recursive: true, force: true });
  await mkdir(`${root}/A4`, { recursive: true });
  await mkdir(`${root}/US-Letter`, { recursive: true });

  for (const [src, dest] of [['A4', 'A4'], ['Letter', 'US-Letter']]) {
    for (const f of await readdir(`dist/${product.slug}/${src}`)) {
      if (f.startsWith('Free-Sample')) continue; // published separately, free
      await copyFile(`dist/${product.slug}/${src}/${f}`, `${root}/${dest}/${f}`);
    }
  }

  await writeFile(`${root}/READ-ME-FIRST.txt`, product.readme(product.documents.filter((d) => d.inBundle)));
  await rm(`release/${stem}.zip`, { force: true });
  execFileSync('zip', ['-r', '-q', `${stem}.zip`, stem], { cwd: 'release' });
  console.log(`release/${stem}.zip`);
}
