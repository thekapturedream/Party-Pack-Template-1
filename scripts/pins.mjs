// Builds a product's Pinterest pins, 2:3 vertical.
//
//   node scripts/pins.mjs paper-squadron
//   node scripts/pins.mjs vanishing-exhibit
//
// Needs `node src/build.ts <product> --html` and `node scripts/preview.mjs
// <product>` first: the pins are built from the real printed pages.
const slug = process.argv[2];
const KNOWN = ['vanishing-exhibit', 'paper-squadron'];
if (!KNOWN.includes(slug)) throw new Error(`Usage: node scripts/pins.mjs <${KNOWN.join('|')}>`);
await import(`./store/${slug}-pins.mjs`);
