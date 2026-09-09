// Assembles the customer download: the two paper folders, a plain-text readme
// for people who open the zip before they open a PDF, and the zip itself.
import { mkdir, rm, copyFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { vanishingExhibit as kit } from '../src/content/vanishing-exhibit.ts';

const slug = kit.title.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
const root = `release/${slug}-v${kit.version}`;

await rm('release', { recursive: true, force: true });
await mkdir(`${root}/A4`, { recursive: true });
await mkdir(`${root}/US-Letter`, { recursive: true });

for (const [src, dest] of [['A4', 'A4'], ['Letter', 'US-Letter']]) {
  for (const f of await readdir(`dist/${src}`)) {
    if (f.startsWith('Free-Sample')) continue; // published separately, free
    await copyFile(`dist/${src}/${f}`, `${root}/${dest}/${f}`);
  }
}

await writeFile(`${root}/READ-ME-FIRST.txt`, `${kit.title.toUpperCase()}
${kit.seriesName} — ${kit.edition}, version ${kit.version}
${kit.ageRange} · ${kit.players} · ${kit.prepMinutes} minutes to set up · ${kit.playMinutes} to play

OPEN THIS FIRST
  A4/00_Start-Here_A4.pdf            if your printer takes A4 (UK, Europe, most of the world)
  US-Letter/00_Start-Here_Letter.pdf if your printer takes US Letter (USA, Canada)

Use one folder and ignore the other. They contain the same game.

WHAT IS IN EACH FOLDER
  00 Start Here    1 sheet   what to print, in what order
  01 Host Guide    6 sheets  setup, running order, hints, the finale, troubleshooting
  02 Player Pack   8 sheets  briefing, six evidence sheets, the Recovery Slip
  03 Hint Cards    2 sheets  eighteen hint cards and six Curator cards, to cut out
  04 Answer Key    2 sheets  every answer, with a worked solution
  05 Party Extras  6 sheets  door sign, invitations, badges, tokens, labels, certificates

PRINTING
  Black and white is fine throughout. Print single-sided.
  Set your printer to 100% or "actual size", not "fit to page".

LICENCE
  Print it as often as you like for your own parties, classroom, library or club.
  Please do not resell it, pass the files on, or charge admission to run it.
  (c) ${kit.publisher} — ${kit.publisherUrl}

${kit.edition.toUpperCase()}
  Puzzle logic and print layout have been checked end to end. A room full of
  nine-year-olds has not. Tell us what dragged and what landed at ${kit.publisherUrl}
  and you get every later version of this kit free.
`);

execFileSync('zip', ['-r', '-q', `${slug}-v${kit.version}.zip`, `${slug}-v${kit.version}`], { cwd: 'release' });
console.log(`release/${slug}-v${kit.version}.zip`);
