// Builds a product's shop listing images.
//
//   node scripts/store-images.mjs paper-squadron
//   node scripts/store-images.mjs vanishing-exhibit
//
// Needs `node src/build.ts <product> --html` and `node scripts/preview.mjs
// <product>` to have run first: the compositions are built from screenshots of
// the real printed pages.
const slug = process.argv[2];
const KNOWN = ['vanishing-exhibit', 'paper-squadron'];
if (!KNOWN.includes(slug)) {
  throw new Error(`Usage: node scripts/store-images.mjs <${KNOWN.join('|')}>`);
}
await import(`./store/${slug}-images.mjs`);
