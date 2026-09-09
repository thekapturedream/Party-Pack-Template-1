import type { Kit } from '../../content/types.ts';
import { html, sheet, framed, runhead, runfoot, type PaperSize } from '../shell.ts';

/** The lead magnet: one real puzzle, its three hints and its solution, so a
 *  parent can judge the quality and the reading age before paying. */
export function freeSample(kit: Kit, size: PaperSize): string {
  const p = kit.puzzles.find((x) => x.id === 'cipher')!;

  const cover = sheet(`
    <header class="runhead">
      <span class="tab tab--evidence">Free sample</span>
      <span class="runhead__note">${kit.seriesName} &middot; one puzzle of six</span>
    </header>
    <div class="sheet__body">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-4)">
        <div>
          <div class="label label--evidence">Case file 12</div>
          <h1 class="display" style="max-width:13ch;margin-top:var(--space-1)">${kit.title}</h1>
        </div>
        <span class="stamp" style="margin-top:4mm;white-space:nowrap">Try before you buy</span>
      </div>
      <p class="lead" style="max-width:108mm;margin-top:var(--space-3)">This is evidence 3 of 6, printed exactly as it
      appears in the kit, with its three hints and its solution. Try it on your child before you decide.</p>

      <div class="cols cols--3" style="margin:var(--space-4) 0;padding:var(--space-3) 0;
        border-top:var(--rule-medium) solid var(--ink);border-bottom:var(--hairline) solid var(--rule)">
        <div><div class="label">For</div><div>${kit.ageRange}<br/>${kit.players}</div></div>
        <div><div class="label">Setting up</div><div>${kit.prepMinutes} minutes</div></div>
        <div><div class="label">Playing</div><div>${kit.playMinutes}</div></div>
      </div>

      <div class="panel grow" style="display:flex;flex-direction:column">
        <div class="panel__title">What the full kit contains</div>
        <div class="cols cols--2">
          <ul class="bullets small">
            <li>Six evidence sheets that build on each other, with a working-out space on every one</li>
            <li>A six-page host guide: setup, running order, hint policy, the finale, troubleshooting</li>
            <li>Eighteen cut-out hint cards, three strengths per puzzle</li>
            <li>Six Curator cards so you can check answers without the answer key</li>
          </ul>
          <ul class="bullets small">
            <li>A worked answer key, one page per puzzle</li>
            <li>Door sign, invitations, badges, hint tokens, envelope labels, certificates</li>
            <li>Every file in A4 and US Letter</li>
            <li>Black and white printing throughout. No props, no apps, no batteries</li>
          </ul>
        </div>
        <div style="margin-top:auto;padding-top:var(--space-3);border-top:var(--hairline) dashed var(--rule);
          display:flex;justify-content:space-between;align-items:baseline;gap:var(--space-3)">
          <span class="label">The full kit</span>
          <span class="small" style="flex:1"><strong>${kit.publisherUrl}</strong></span>
        </div>
      </div>
    </div>
    <footer class="runfoot">
      <span>${kit.publisher} &middot; ${kit.seriesName}</span>
      <span>${kit.edition} &middot; v${kit.version}</span>
    </footer>`, { tint: true, punched: true });

  const puzzle = sheet(framed(
    runhead(`Evidence ${p.number} of ${kit.puzzles.length}`, kit.title),
    `<div class="stack-4">
      <div class="stack-2">
        <div class="label label--brass">${p.kind}</div>
        <h1 class="display" style="font-size:30pt">${p.title}</h1>
        <p class="lead" style="max-width:118mm">${p.intro}</p>
      </div>
      ${p.evidence}
      <div class="panel panel--host">
        <div class="panel__title">Your task</div>
        <p class="lead" style="margin:0;color:var(--ink)">${p.task}</p>
      </div>
      <div class="answer">
        <span class="answer__label">Answer</span>
        <span class="answer__boxes">${Array.from({ length: p.answer.length }, (_, i) =>
          `<span class="answer__box${i + 1 === p.keyLetterIndex ? ' answer__box--marked' : ''}"></span>`).join('')}</span>
        <span class="answer__hint">In the full kit, the gold letter goes<br/>on the Recovery Slip.</span>
      </div>
    </div>`,
    runfoot(`${kit.seriesName} &middot; free sample`, kit.publisherUrl),
  ));

  const solution = sheet(framed(
    runhead('Hints and solution &middot; host only', kit.title),
    `<div class="stack-4">
      <h1>How this puzzle is meant to run</h1>
      <div class="cols cols--3">
        ${p.hints.map((h) => `<div class="panel">
          <div class="panel__title">Hint ${h.level}</div>
          <p class="small" style="margin:0">${h.text}</p></div>`).join('')}
      </div>
      <div class="panel panel--slate">
        <div class="panel__title">Solution &mdash; ${p.answer}</div>
        <ol class="steps small">${p.solution.map((s) => `<li>${s}</li>`).join('')}</ol>
      </div>
      <div class="panel panel--host">
        <div class="panel__title">What the other five puzzles ask for</div>
        <ul class="bullets small">
          ${kit.puzzles.filter((x) => x.id !== p.id).map((x) =>
            `<li><strong>${x.title}.</strong> ${x.task}</li>`).join('')}
        </ul>
        <p class="small" style="margin-top:var(--space-2)">No two puzzles use the same kind of thinking, so no single
        child runs away with the game. Two of them send the team back to sheets they have already solved.</p>
      </div>
      <div class="panel panel--tint center">
        <p class="lead" style="margin:0">The full kit is at <strong>${kit.publisherUrl}</strong></p>
      </div>
    </div>`,
    runfoot(`${kit.seriesName} &middot; free sample`, kit.publisherUrl),
  ), { tint: true });

  return html(`${kit.title} — Free Sample`, size, [cover, puzzle, solution]);
}
