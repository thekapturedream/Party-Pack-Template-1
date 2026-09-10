import type { Kit, Puzzle } from '../../content/types.ts';
import { html, sheet, type PaperSize } from '../shell.ts';

const ORDINAL = ['', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

function answerField(p: Puzzle): string {
  const boxes = Array.from({ length: p.answer.length }, (_, i) =>
    `<span class="answer__box${i + 1 === p.keyLetterIndex ? ' answer__box--marked' : ''}"></span>`).join('');
  return `<div class="answer">
    <span class="answer__label">Answer</span>
    <span class="answer__boxes">${boxes}</span>
    <span class="answer__hint">Copy the letter in the gold box<br/>to line ${p.number} of the Recovery Slip.</span>
  </div>`;
}

function evidenceHead(kit: Kit, p: Puzzle): string {
  return `<header class="runhead">
    <span class="tab tab--evidence">Evidence ${p.number} of ${kit.puzzles.length}</span>
    <span class="runhead__note">Case 12 &middot; Marlow Museum</span>
  </header>`;
}

function puzzleSheet(kit: Kit, p: Puzzle): string {
  return sheet(`
    ${evidenceHead(kit, p)}
    <div class="sheet__body">
      <div class="stack-4 grow" style="display:flex;flex-direction:column">
        <div style="display:flex;align-items:flex-start;gap:var(--space-4)">
          <div class="stack-2" style="flex:1">
            <div class="label label--evidence">${p.kind}</div>
            <h1>${p.title}</h1>
            <p class="lead" style="max-width:112mm">${p.intro}</p>
          </div>
          <span class="stamp stamp--sm" style="margin-top:2mm;white-space:nowrap">No. ${p.number}</span>
        </div>
        ${p.evidence}
        <div class="panel panel--host">
          <div class="panel__title">Your task</div>
          <p style="margin:0;font-size:var(--size-lead);font-weight:600">${p.task}</p>
        </div>
        ${answerField(p)}
        <div class="scratch grow">
          <div class="scratch__title">Working out</div>
        </div>
      </div>
    </div>
    <footer class="runfoot">
      <span>${kit.seriesName} &middot; ${kit.title}</span>
      <span>Stuck? Ask the Curator for a hint.</span>
    </footer>`, { punched: true });
}

function coverSheet(kit: Kit): string {
  return sheet(`
    <header class="runhead">
      <span class="tab">${kit.seriesName}</span>
      <span class="runhead__note">Player pack &middot; one per team</span>
    </header>
    <div class="sheet__body">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-4)">
        <div>
          <div class="label label--evidence">Case file 12</div>
          <h1 class="display" style="max-width:13ch;margin-top:var(--space-1)">${kit.title}</h1>
        </div>
        <span class="stamp" style="margin-top:4mm;white-space:nowrap">Unsolved</span>
      </div>

      <div style="display:flex;gap:var(--space-5);margin:var(--space-4) 0;padding:var(--space-2) 0;
        border-top:var(--rule-medium) solid var(--ink);border-bottom:var(--hairline) solid var(--rule)">
        <div><div class="label">Missing</div><div class="small">Clockwork Cartographer</div></div>
        <div><div class="label">Last seen</div><div class="small">21:30, Case 12</div></div>
        <div><div class="label">Deadline</div><div class="small">10:00 tomorrow</div></div>
        <div><div class="label">Assigned to</div><div class="small">Junior Curators</div></div>
      </div>

      <div class="doc grow" style="display:flex;flex-direction:column">
        <div class="doc__head"><span>Curator&rsquo;s summary</span><span>Marlow Museum</span></div>
        <div class="stack-2" style="font-size:10.5pt">
          ${kit.briefing.map((para) => `<p>${para}</p>`).join('')}
        </div>
        <div style="margin-top:var(--space-4);padding-top:var(--space-3);border-top:var(--hairline) dashed var(--rule)">
          <div class="label label--ink" style="margin-bottom:var(--space-2)">Exhibits enclosed</div>
          <div class="cols cols--2" style="gap:var(--space-1) var(--space-5);font-size:9.5pt">
            ${kit.puzzles.map((x) => `<div style="display:flex;gap:var(--space-2);align-items:baseline">
              <span style="font-family:var(--font-signage);font-weight:600;color:var(--evidence)">${x.number}</span>
              <span>${x.kind}</span></div>`).join('')}
          </div>
        </div>
        <div style="margin-top:auto;padding-top:var(--space-4);display:flex;justify-content:space-between;
          align-items:flex-end;gap:var(--space-4)">
          <div>
            <div class="label">Signed</div>
            <div class="hand" style="margin-top:1mm">A. Marlow, Keeper</div>
          </div>
          <span class="stamp stamp--sm stamp--ink" style="transform:rotate(2deg);white-space:nowrap">Six exhibits enclosed</span>
        </div>
      </div>

      <div class="cols cols--3" style="margin-top:var(--space-4)">
        <div><div class="label label--ink">How it works</div>
          <p class="small" style="margin:0">Six pieces of evidence. Each one gives you a word.</p></div>
        <div><div class="label label--ink">Then what</div>
          <p class="small" style="margin:0">One letter from each word goes on the Recovery Slip.</p></div>
        <div><div class="label label--ink">To win</div>
          <p class="small" style="margin:0">Read the six letters. Say the word they spell to the Curator.</p></div>
      </div>
    </div>`, { tint: true, punched: true });
}

function recoverySheet(kit: Kit): string {
  const rows = kit.puzzles.map((p) => `
    <tr>
      <td style="padding:0 0 var(--space-2);width:13mm">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:9mm;height:9mm;
          background:var(--ink);color:var(--paper);font-family:var(--font-signage);font-weight:600;
          font-size:11pt">${p.number}</span>
      </td>
      <td style="padding:0 var(--space-3) var(--space-2) 0">
        <div style="display:flex;align-items:baseline;gap:var(--space-2)">
          <span style="font-family:var(--font-display);font-weight:700;font-size:12pt;white-space:nowrap">${p.title}</span>
          <span style="flex:1;border-bottom:0.3mm dotted var(--rule)"></span>
        </div>
        <div class="caption">Take the ${ORDINAL[p.keyLetterIndex]} letter of your answer</div>
      </td>
      <td style="padding:0 0 var(--space-2);width:20mm;text-align:right">
        <span style="display:inline-block;width:14mm;height:15mm;border:var(--rule-medium) solid var(--brass);
          background:var(--brass-tint)"></span>
      </td>
    </tr>`).join('');

  return sheet(`
    <header class="runhead">
      <span class="tab">The Recovery Slip</span>
      <span class="runhead__note">Case 12 &middot; final step</span>
    </header>
    <div class="sheet__body">
      <div class="stack-4 grow" style="display:flex;flex-direction:column">
        <div class="stack-2">
          <h1>Six answers. Six letters.<br/>One word.</h1>
          <p class="lead" style="max-width:112mm">Write each letter in the gold box beside its evidence. Then read the
          six letters downwards and say the word out loud to the Curator.</p>
        </div>
        <table style="width:100%;border-collapse:collapse">${rows}</table>
        <div class="panel panel--evidence">
          <div class="panel__title">The word is</div>
          <div style="display:flex;gap:2.5mm;margin-top:var(--space-1)">
            ${Array.from({ length: kit.finalWord.length }, () =>
              `<span style="width:15mm;height:18mm;border:0.7mm solid var(--ink);background:var(--paper)"></span>`).join('')}
          </div>
        </div>
        <div class="scratch grow"><div class="scratch__title">Working out</div></div>
      </div>
    </div>
    <footer class="runfoot">
      <span>${kit.seriesName} &middot; ${kit.title}</span>
      <span>Say it to the Curator. Do not open anything yourself.</span>
    </footer>`, { tint: true, punched: true });
}

export function playerPack(kit: Kit, size: PaperSize): string {
  return html('museum', `${kit.title} — Player Pack`, size, [
    coverSheet(kit),
    ...kit.puzzles.map((p) => puzzleSheet(kit, p)),
    recoverySheet(kit),
  ]);
}
