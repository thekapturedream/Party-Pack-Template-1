import type { Kit } from '../../content/types.ts';
import { html, sheet, framed, runhead, runfoot, paperLabel, type PaperSize } from '../shell.ts';

/** The first thing a buyer opens. One page, no story, no decoration:
 *  what is in the download and what to print first. */
export function startHere(kit: Kit, size: PaperSize): string {
  const page = sheet(framed(
    `<header class="runhead"><span class="tab">Start here</span>
      <span class="runhead__note">${kit.seriesName} &middot; ${paperLabel(size)} &middot; v${kit.version}</span></header>`,
    `<div class="stack-3">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-4)">
        <div class="stack-2" style="flex:1">
          <div class="label label--evidence">Case file 12</div>
          <h1 class="display" style="font-size:30pt;max-width:13ch">${kit.title}</h1>
          <p class="small" style="max-width:118mm;margin:0">${kit.subtitle}. ${kit.ageRange}, ${kit.players},
          ${kit.prepMinutes} minutes to set up and ${kit.playMinutes} to play.</p>
        </div>
        <span class="stamp stamp--ink" style="margin-top:4mm;white-space:nowrap">${kit.edition}</span>
      </div>

      <div class="panel panel--host">
        <div class="panel__title">If you read nothing else</div>
        <ol class="steps">
          <li>Print <strong>01 Host Guide</strong>. Page 2 is the whole setup.</li>
          <li>Print one <strong>02 Player Pack</strong> per team of three or four.</li>
          <li>Print <strong>03 Hint Cards</strong> and cut them up.</li>
          <li>Keep <strong>04 Answer Key</strong> for yourself, off the table.</li>
          <li>Print whatever you like from <strong>05 Party Extras</strong>. None of it is required.</li>
        </ol>
      </div>

      <div class="panel">
        <div class="panel__title">What is in this download</div>
        <table class="ledger ledger--text">
          <tbody>
            <tr><td style="width:52mm"><strong>00 Start Here</strong></td><td class="small">This page.</td><td class="num" style="white-space:nowrap;width:18mm">1 sheet</td></tr>
            <tr><td><strong>01 Host Guide</strong></td><td class="small">Setup, running order, hints, the finale, troubleshooting.</td><td class="num" style="white-space:nowrap">6 sheets</td></tr>
            <tr><td><strong>02 Player Pack</strong></td><td class="small">Briefing, six evidence sheets, the Recovery Slip.</td><td class="num" style="white-space:nowrap">8 sheets</td></tr>
            <tr><td><strong>03 Hint Cards</strong></td><td class="small">Eighteen hint cards and six Curator cards.</td><td class="num" style="white-space:nowrap">2 sheets</td></tr>
            <tr><td><strong>04 Answer Key</strong></td><td class="small">Every answer, with a worked solution.</td><td class="num" style="white-space:nowrap">2 sheets</td></tr>
            <tr><td><strong>05 Party Extras</strong></td><td class="small">Door sign, invitations, badges, tokens, labels, certificates.</td><td class="num" style="white-space:nowrap">6 sheets</td></tr>
          </tbody>
        </table>
        <p class="caption" style="margin-top:var(--space-2)">Every file comes in A4 and US Letter. Use the folder that matches your printer.</p>
      </div>

      <div class="cols cols--2">
        <div class="panel panel--tint">
          <div class="panel__title">Printing</div>
          <ul class="bullets small">
            <li>Black and white is fine. Print single-sided.</li>
            <li>Set scaling to <strong>100%</strong> or <strong>actual size</strong>, not &ldquo;fit to page&rdquo;.</li>
            <li>Plain paper is fine; card suits the badges and certificates.</li>
          </ul>
        </div>
        <div class="panel panel--tint">
          <div class="panel__title">About the ${kit.edition.toLowerCase()}</div>
          <p class="small" style="margin:0">Puzzle logic and print layout have been checked end to end. A room full of
          nine-year-olds has not. Tell us what dragged and what landed at ${kit.publisherUrl}, and you get every later
          version of this kit free.</p>
        </div>
      </div>

    </div>`,
    runfoot(`${kit.seriesName} &middot; ${kit.title} v${kit.version}`, kit.publisherUrl),
  ), { tint: true });

  return html('museum', `${kit.title} — Start Here`, size, [page]);
}
