import type { Kit } from '../../content/types.ts';
import { html, sheet, framed, runhead, runfoot, type PaperSize } from '../shell.ts';

export function answerKey(kit: Kit, size: PaperSize): string {
  const letters = kit.puzzles.map((p) => p.answer[p.keyLetterIndex - 1]);

  const quickRows = kit.puzzles.map((p, i) => `
    <tr>
      <td class="num" style="width:12mm">${p.number}</td>
      <td style="width:44mm"><strong>${p.title}</strong></td>
      <td style="font-family:var(--font-document);font-size:11pt;letter-spacing:0.08em">${p.answer}</td>
      <td style="width:34mm" class="caption">letter ${p.keyLetterIndex}</td>
      <td style="width:14mm;text-align:right;font-family:var(--font-document);font-size:13pt;font-weight:700;color:var(--brass)">${letters[i]}</td>
    </tr>`).join('');

  const page1 = sheet(framed(
    runhead('Answer key &middot; host only', kit.title),
    `<div class="stack-4">
      <div class="stack-2">
        <div class="label label--seal">Do not leave this sheet on the table</div>
        <h1>Every answer, at a glance</h1>
      </div>
      <div class="panel">
        <table class="ledger" style="font-family:var(--font-text)"><tbody>${quickRows}</tbody></table>
      </div>
      <div class="panel panel--slate">
        <div class="panel__title">The final word</div>
        <div style="display:flex;gap:2.5mm;margin-top:var(--space-1)">
          ${letters.map((l) => `<span style="width:15mm;height:18mm;border:0.6mm solid var(--ink);background:var(--paper);
            display:flex;align-items:center;justify-content:center;font-family:var(--font-display);
            font-size:19pt;font-weight:700">${l}</span>`).join('')}
        </div>
        <p class="small" style="margin-top:var(--space-3)">Send them to a mirror. The envelope is taped to the back of one.</p>
      </div>
      <div class="panel panel--host">
        <div class="panel__title">Two built-in safety nets</div>
        <ul class="bullets small">
          <li><strong>The clocks check themselves.</strong> The Tower and Brass clocks give the same true time by two
          different routes. A team that gets 21:45 twice knows it is right without asking you.</li>
          <li><strong>The ledger sum only lands on a number that exists.</strong> Any arithmetic slip produces a
          catalogue number that is not in the ledger, so the mistake announces itself.</li>
        </ul>
      </div>
    </div>`,
    runfoot(`${kit.title} &middot; Answer key`, '1 / 2'),
  ), { tint: true });

  const solutions = kit.puzzles.map((p) => `
    <div class="panel" style="break-inside:avoid">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:var(--space-3)">
        <div class="panel__title" style="margin:0">${p.number}. ${p.title}</div>
        <div style="font-family:var(--font-document);font-weight:700">${p.answer}
          <span class="caption">&rarr; ${p.answer[p.keyLetterIndex - 1]}</span></div>
      </div>
      <ol class="steps small" style="margin-top:var(--space-2)">
        ${p.solution.map((s) => `<li>${s}</li>`).join('')}
      </ol>
    </div>`).join('');

  const page2 = sheet(framed(
    runhead('Worked solutions', kit.title),
    `<div>
      <h1 style="margin-bottom:var(--space-3)">How each one is solved</h1>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3)">${solutions}</div>
    </div>`,
    runfoot(`${kit.title} &middot; Answer key`, '2 / 2'),
  ));

  return html('museum', `${kit.title} — Answer Key`, size, [page1, page2]);
}
