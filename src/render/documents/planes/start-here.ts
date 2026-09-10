import type { Squadron } from '../../../content/plane-types.ts';
import { html, sheet, framed, runfoot, paperLabel, type PaperSize } from '../../shell.ts';
import { PRODUCTS } from '../../../products.ts';

/** The first thing a buyer opens. One page, no story: what is in the download,
 *  what to print first, and the one printer setting that matters. */
export function planeStartHere(kit: Squadron, size: PaperSize): string {
  const docs = PRODUCTS.find((p) => p.slug === 'paper-squadron')!.documents.filter((d) => d.inBundle);
  const total = docs.reduce((t, d) => t + d.sheets, 0);

  const page = sheet(framed(
    `<header class="runhead"><span class="tab">Start here</span>
      <span class="runhead__note">${kit.seriesName} &middot; ${paperLabel(size)} &middot; v${kit.version}</span></header>`,
    `<div class="stack-2">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-4)">
        <div class="stack-2" style="flex:1">
          <div class="label label--hi">Ten planes &middot; ${kit.ageRange}</div>
          <h1 class="display" style="font-size:29pt;max-width:12ch">${kit.title}</h1>
          <p class="small" style="max-width:120mm;margin:0">${kit.subtitle}.</p>
        </div>
        <span class="fin" style="margin-top:4mm;white-space:nowrap">${kit.edition}</span>
      </div>

      <div class="panel panel--warn">
        <div class="panel__title">If you read nothing else</div>
        <ol class="steps">
          <li>Print your printer's <strong>${paperLabel(size)}</strong> folder. Ignore the other one.</li>
          <li>Set the print dialog to <strong>100%</strong> or <strong>actual size</strong>. Not &ldquo;fit to page&rdquo;.
            The corner ticks on each template are there to prove it worked.</li>
          <li>Print the template and the fold sheet for the plane you want, then start with
            plane 1, the Sparrow. It takes four folds.</li>
        </ol>
      </div>

      <div class="panel">
        <div class="panel__title">What is in this download</div>
        <table class="ledger ledger--text ledger--tight">
          <tbody>
            ${docs.map((d) => `<tr>
              <td style="width:50mm"><strong>${d.slug.replace('_', ' ').replace(/-/g, ' ')}</strong></td>
              <td class="small">${d.summary}</td>
              <td class="num" style="white-space:nowrap;width:18mm">${d.sheets} sheet${d.sheets === 1 ? '' : 's'}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <p class="caption" style="margin-top:var(--space-2)">${total} sheets in total, in A4 and US Letter.</p>
      </div>

      <div class="cols cols--2">
        <div class="panel panel--tint">
          <div class="panel__title">Printing</div>
          <ul class="bullets small">
            <li>Ordinary printer paper. Not card: card will not fly.</li>
            <li>Black and white works. Nothing needs colour.</li>
            <li>Nothing prints on the part that folds away, so a template costs
              about half the ink you would expect.</li>
          </ul>
        </div>
        <div class="panel panel--adult">
          <div class="panel__title">For the grown-up</div>
          <p class="small" style="margin:0">Planes 1, 2 and 4 suit a six-year-old alone; 7 and 9 want you
          alongside. Sheet 5 of <strong>01 Flight School</strong> is written for you: what to do when a plane will
          not fly, and how to run a fly-off without tears.</p>
        </div>
      </div>
    </div>`,
    runfoot(`${kit.seriesName} &middot; ${kit.title} v${kit.version}`, kit.publisherUrl),
  ), { tint: true });

  return html('flight', `${kit.title} — Start Here`, size, [page]);
}
