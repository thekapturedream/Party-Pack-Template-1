/** Printable figures. Everything is drawn in SVG or CSS so it stays crisp
 *  at any print size and costs almost no ink. */

const ROOMS = [
  ['Library', 'Clock Gallery', 'Fossil Hall'],
  ['Map Room', 'Atrium', 'Portrait Hall'],
  ['Store Room', 'Entrance', 'Café'],
];

/** Ground-floor plan of the Marlow Museum: a 3 × 3 block of rooms, north up. */
export function floorPlan(): string {
  const cells = ROOMS.flatMap((row, r) =>
    row.map((name, c) => {
      const isEntrance = name === 'Entrance';
      return `<div style="
        border:0.25mm solid var(--ink);
        ${r < 2 ? 'border-bottom:0;' : ''}${c < 2 ? 'border-right:0;' : ''}
        aspect-ratio:1.35;display:flex;align-items:center;justify-content:center;
        text-align:center;padding:2mm;font-size:8.5pt;line-height:1.25;
        ${isEntrance ? 'background:var(--paper-deep);font-weight:700;' : ''}">${name}</div>`;
    }),
  ).join('');

  return `<figure style="margin:0">
    <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2)">
      <span class="label">Ground floor</span>
      <span style="flex:1;height:0.25mm;background:var(--rule)"></span>
      <span class="label">N &uarr;</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr)">${cells}</div>
    <figcaption class="caption" style="margin-top:var(--space-2)">
      Every room opens into the rooms it touches. The shaded room is the front Entrance.
    </figcaption>
  </figure>`;
}

/** An analogue clock. Pass nulls for a clock with its hands removed. */
export function clockFace(hours: number | null, minutes: number | null): string {
  const R = 46;
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    const outer = R - 3;
    const inner = i % 3 === 0 ? R - 10 : R - 7;
    return `<line x1="${50 + inner * Math.sin(a)}" y1="${50 - inner * Math.cos(a)}"
      x2="${50 + outer * Math.sin(a)}" y2="${50 - outer * Math.cos(a)}"
      stroke="#16181c" stroke-width="${i % 3 === 0 ? 2.4 : 1.1}" stroke-linecap="round"/>`;
  }).join('');

  const numerals = [12, 3, 6, 9].map((n, i) => {
    const a = (i * 90 * Math.PI) / 180;
    const r = R - 18;
    return `<text x="${50 + r * Math.sin(a)}" y="${50 - r * Math.cos(a) + 3.4}"
      text-anchor="middle" font-family="Georgia, serif" font-size="9.5" fill="#16181c">${n}</text>`;
  }).join('');

  let hands = '';
  if (hours !== null && minutes !== null) {
    const minAngle = (minutes * 6 * Math.PI) / 180;
    const hourAngle = (((hours % 12) + minutes / 60) * 30 * Math.PI) / 180;
    hands =
      `<line x1="50" y1="50" x2="${50 + 24 * Math.sin(hourAngle)}" y2="${50 - 24 * Math.cos(hourAngle)}"
        stroke="#16181c" stroke-width="4" stroke-linecap="round"/>` +
      `<line x1="50" y1="50" x2="${50 + 34 * Math.sin(minAngle)}" y2="${50 - 34 * Math.cos(minAngle)}"
        stroke="#16181c" stroke-width="2.6" stroke-linecap="round"/>` +
      `<circle cx="50" cy="50" r="2.6" fill="#16181c"/>`;
  } else {
    hands = `<circle cx="50" cy="50" r="2.6" fill="none" stroke="#6d747d" stroke-width="1.2"/>`;
  }

  return `<svg viewBox="0 0 100 100" width="100%" style="max-width:36mm" role="img">
    <circle cx="50" cy="50" r="${R}" fill="#ffffff" stroke="#16181c" stroke-width="1.6"/>
    ${ticks}${numerals}${hands}
  </svg>`;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const CIPHER_SHIFT = 5;

/** Two aligned rows: plain letters above, the museum's shelving code below. */
export function decoderStrip(): string {
  const cell = (t: string, strong: boolean) =>
    `<td style="border:0.25mm solid var(--rule);padding:1.2mm 0;text-align:center;
      font-family:var(--font-document);font-size:8pt;
      ${strong ? 'font-weight:700;background:var(--paper-deep);' : ''}">${t}</td>`;
  const plain = ALPHABET.map((l) => cell(l, false)).join('');
  const coded = ALPHABET.map((_, i) => cell(ALPHABET[(i + CIPHER_SHIFT) % 26], true)).join('');
  return `<figure style="margin:0">
    <div class="label" style="margin-bottom:var(--space-2)">The catalogue key</div>
    <table style="width:100%;border-collapse:collapse;table-layout:fixed">
      <tr><th style="width:16mm;text-align:left;font-size:7pt;letter-spacing:0.1em;text-transform:uppercase">Letter</th>${plain}</tr>
      <tr><th style="text-align:left;font-size:7pt;letter-spacing:0.1em;text-transform:uppercase">Code</th>${coded}</tr>
    </table>
    <figcaption class="caption" style="margin-top:var(--space-2)">
      Find a coded letter in the shaded row, then read straight up to the letter it stands for.
    </figcaption>
  </figure>`;
}
