import { mkdir, writeFile, rm } from 'node:fs/promises';
import { chromium, type Browser } from 'playwright';
import { vanishingExhibit } from './content/vanishing-exhibit.ts';
import type { Kit } from './content/types.ts';
import type { PaperSize } from './render/shell.ts';
import { playerPack } from './render/documents/player-pack.ts';
import { hostGuide } from './render/documents/host-guide.ts';
import { answerKey } from './render/documents/answer-key.ts';
import { hintCards } from './render/documents/hint-cards.ts';
import { partyExtras } from './render/documents/party-extras.ts';
import { startHere } from './render/documents/start-here.ts';
import { freeSample } from './render/documents/free-sample.ts';

interface DocSpec {
  slug: string;
  render: (kit: Kit, size: PaperSize) => string;
  /** Documents the buyer prints; the sample is published separately. */
  inBundle: boolean;
}

const DOCUMENTS: DocSpec[] = [
  { slug: '00_Start-Here', render: startHere, inBundle: true },
  { slug: '01_Host-Guide', render: hostGuide, inBundle: true },
  { slug: '02_Player-Pack', render: playerPack, inBundle: true },
  { slug: '03_Hint-Cards', render: hintCards, inBundle: true },
  { slug: '04_Answer-Key', render: answerKey, inBundle: true },
  { slug: '05_Party-Extras', render: partyExtras, inBundle: true },
  { slug: 'Free-Sample', render: freeSample, inBundle: false },
];

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

async function main() {
  const kit = vanishingExhibit;
  const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const specs = only.length ? DOCUMENTS.filter((d) => only.some((o) => d.slug.includes(o))) : DOCUMENTS;
  const keepHtml = process.argv.includes('--html');

  if (!only.length) await rm(OUT, { recursive: true, force: true });
  const browser = await chromium.launch();

  for (const size of SIZES) {
    const dir = `${OUT}/${size}`;
    await mkdir(dir, { recursive: true });
    for (const spec of specs) {
      const markup = spec.render(kit, size);
      const file = `${dir}/${spec.slug}_${size}.pdf`;
      if (keepHtml) {
        await mkdir(`${OUT}/html`, { recursive: true });
        await writeFile(`${OUT}/html/${spec.slug}_${size}.html`, markup);
      }
      await renderPdf(browser, markup, size, file);
      process.stdout.write(`  ${file}\n`);
    }
  }

  await browser.close();
}

await main();
