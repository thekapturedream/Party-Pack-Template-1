import type { Kit } from '../../content/types.ts';
import { html, sheet, type PaperSize } from '../shell.ts';

const COLS = 3;
const ROWS = 4;
const PER_PAGE = COLS * ROWS;

/** Eighteen hint cards, three per puzzle, plus six Curator answer cards that
 *  fill the second sheet so the host can check work without the answer key. */
export function hintCards(kit: Kit, size: PaperSize): string {
  const hintCard = (puzzleNo: number, title: string, level: number, text: string) => `
    <div class="cutcard">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:2mm">
        <span class="label">Evidence ${puzzleNo}</span>
        <span class="label label--brass">Hint ${level}</span>
      </div>
      <div style="font-family:var(--font-display);font-size:11pt;font-weight:600;margin:1.5mm 0 2mm">${title}</div>
      <hr class="rule" style="margin-bottom:2mm"/>
      <p class="small" style="margin:0">${text}</p>
    </div>`;

  const curatorCard = (puzzleNo: number, title: string, answer: string, letter: string) => `
    <div class="cutcard" style="background:var(--paper-tint);border-color:var(--ink-faint)">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:2mm">
        <span class="label">Evidence ${puzzleNo}</span>
        <span class="label label--seal">Curator only</span>
      </div>
      <div style="font-family:var(--font-display);font-size:11pt;font-weight:600;margin:1.5mm 0 2mm">${title}</div>
      <hr class="rule" style="margin-bottom:2mm"/>
      <div style="font-family:var(--font-document);font-size:13pt;font-weight:700;letter-spacing:0.08em">${answer}</div>
      <div class="caption" style="margin-top:1mm">Recovery Slip letter: <strong style="color:var(--brass)">${letter}</strong></div>
    </div>`;

  const cards = [
    ...kit.puzzles.flatMap((p) => p.hints.map((h) => hintCard(p.number, p.title, h.level, h.text))),
    ...kit.puzzles.map((p) => curatorCard(p.number, p.title, p.answer, p.answer[p.keyLetterIndex - 1])),
  ];

  const pages: string[] = [];
  for (let i = 0; i < cards.length; i += PER_PAGE) {
    const slice = cards.slice(i, i + PER_PAGE);
    while (slice.length < PER_PAGE) slice.push('<div class="cutcard"></div>');
    pages.push(sheet(
      `<div class="cutgrid" style="grid-template-columns:repeat(${COLS},1fr);grid-template-rows:repeat(${ROWS},1fr)">
        ${slice.join('')}
      </div>`,
      { flush: true },
    ));
  }

  return html(`${kit.title} — Hint Cards`, size, pages, `.sheet { padding: 10mm; }`);
}
