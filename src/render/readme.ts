/** The plain-text file a buyer meets if they open the zip before they open a
 *  PDF. It is the only part of the product that has to work with no layout at
 *  all, so it says the two things that go wrong most: which folder to use, and
 *  what to set the print scaling to. */
import type { Kit } from '../content/types.ts';
import type { Squadron } from '../content/plane-types.ts';
import type { DocSpec } from '../products.ts';

const line = (d: DocSpec) =>
  `  ${d.slug.replace('_', ' ').replace(/-/g, ' ').padEnd(18)} ${String(d.sheets).padStart(2)} sheets  ${d.summary}`;

export function museumReadme(kit: Kit, docs: DocSpec[]): string {
  return `${kit.title.toUpperCase()}
${kit.seriesName} — ${kit.edition}, version ${kit.version}
${kit.ageRange} · ${kit.players} · ${kit.prepMinutes} minutes to set up · ${kit.playMinutes} to play

OPEN THIS FIRST
  A4/00_Start-Here_A4.pdf            if your printer takes A4 (UK, Europe, most of the world)
  US-Letter/00_Start-Here_Letter.pdf if your printer takes US Letter (USA, Canada)

Use one folder and ignore the other. They contain the same game.

WHAT IS IN EACH FOLDER
${docs.map(line).join('\n')}

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
`;
}

export function flightReadme(kit: Squadron, docs: DocSpec[]): string {
  return `${kit.title.toUpperCase()}
${kit.seriesName} — ${kit.edition}, version ${kit.version}
${kit.ageRange} · ten planes · ordinary printer paper · no glue, no scissors, no tape

OPEN THIS FIRST
  A4/00_Start-Here_A4.pdf            if your printer takes A4 (UK, Europe, most of the world)
  US-Letter/00_Start-Here_Letter.pdf if your printer takes US Letter (USA, Canada)

Use one folder and ignore the other. Every plane is drawn twice, once for each
paper size, so the printed fold lines land in exactly the right place on both.

WHAT IS IN EACH FOLDER
${docs.map(line).join('\n')}

THE ONE SETTING THAT MATTERS
  Print at 100%, or "actual size". NOT "fit to page" or "shrink oversized pages".
  If the printer scales the page, the printed fold lines move and nothing lines
  up. Every template has four corner ticks: they should sit the same distance in
  from all four edges. If they do not, print again at 100%.

PRINTING
  Ordinary printer paper, 80gsm. Not card — card will not fly.
  Black and white works: nothing in the pack needs colour to be understood.
  Single-sided. Nothing uses both sides of a sheet.
  Nothing is printed on the part of a template that folds away, so the templates
  cost about half the ink you would expect.

WHERE TO START
  Plane 1, the Sparrow. Four folds, and it flies straight away.
  Then read 01 Flight School sheet 3, which is about bending the back corners of
  the wings. That one page fixes most paper planes ever folded.

LICENCE
  Print it as often as you like at home, in a classroom, a library or a club.
  Please do not resell it, pass the files on, or charge admission to run it.
  (c) ${kit.publisher} — ${kit.publisherUrl}

${kit.edition.toUpperCase()}
  Every fold sequence is computed rather than traced, and every sheet has been
  checked to fit both paper sizes. What has not happened is ten children folding
  all ten planes on a wet Saturday. Tell us what was hard at ${kit.publisherUrl}
  and you get every later version of this pack free.
`;
}
