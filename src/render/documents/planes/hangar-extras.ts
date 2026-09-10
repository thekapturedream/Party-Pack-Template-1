import type { Squadron } from '../../../content/plane-types.ts';
import { html, sheet, framed, runfoot, type PaperSize } from '../../shell.ts';
import { AIR, HI, INK, FAINT } from '../../fold/draw.ts';

/** Everything that is not a plane and not an instruction: the things that turn
 *  an afternoon of folding into an event. None of it is needed to fly a plane,
 *  which is why it is the last file and says so on the contents page. */

function head(tab: string, note: string): string {
  return `<header class="runhead"><span class="tab tab--hi">${tab}</span>
    <span class="runhead__note">${note}</span></header>`;
}

/** A pair of wings, the badge every squadron has ever used. */
function wingsMark(w = 46): string {
  return `<svg viewBox="0 0 120 34" style="width:${w}mm">
    <path d="M60 8 l7 9 l-7 9 l-7 -9 Z" fill="${HI}" stroke="${INK}" stroke-width="1.4"/>
    ${[0, 1, 2].map((i) => {
      const y = 11 + i * 5.5;
      const len = 40 - i * 7;
      return `<path d="M52 ${y} L${52 - len} ${y + 2.5}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
        + `<path d="M68 ${y} L${68 + len} ${y + 2.5}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
    }).join('')}
  </svg>`;
}

function badgesSheet(kit: Squadron): string {
  const badge = () => `
    <div class="cutcard snip" style="align-items:center;text-align:center;justify-content:center">
      ${wingsMark(40)}
      <div class="label label--ink" style="margin-top:2mm">${kit.seriesName}</div>
      <div style="font-family:var(--font-display);font-size:13pt;line-height:1.05;margin:1mm 0 2mm">TEST PILOT</div>
      <div style="width:100%;border-bottom:var(--hairline) solid var(--ink);height:7mm"></div>
      <div class="caption" style="margin-top:1mm">name</div>
    </div>`;
  return sheet(`<div class="cutgrid" style="grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(4,1fr)">
    ${Array.from({ length: 8 }, badge).join('')}</div>`, { flush: true, cls: 'extras' });
}

function licenceSheet(kit: Squadron): string {
  const licence = () => `
    <div class="cutcard snip">
      <div style="display:flex;justify-content:space-between;align-items:center;
        border-bottom:var(--rule-medium) solid var(--ink);padding-bottom:1.5mm">
        <span class="label label--ink">Pilot's licence</span>
        <span class="label">${kit.seriesName}</span>
      </div>
      <div style="display:flex;gap:var(--space-3);margin-top:var(--space-2);flex:1">
        <div style="flex:1">
          <div class="caption">Name</div>
          <div style="border-bottom:var(--hairline) solid var(--ink);height:7mm"></div>
          <div class="caption" style="margin-top:1.5mm">Squadron</div>
          <div style="border-bottom:var(--hairline) solid var(--ink);height:7mm"></div>
          <div style="display:flex;gap:var(--space-3);margin-top:1.5mm">
            <div style="flex:1"><div class="caption">Best plane</div>
              <div style="border-bottom:var(--hairline) solid var(--ink);height:7mm"></div></div>
            <div style="width:20mm"><div class="caption">Date</div>
              <div style="border-bottom:var(--hairline) solid var(--ink);height:7mm"></div></div>
          </div>
        </div>
        <div style="width:24mm;border:var(--hairline) dashed var(--rule);display:flex;align-items:center;
          justify-content:center;text-align:center">
          <span class="caption">draw<br/>yourself</span>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:var(--space-2);
        padding-top:1.5mm;border-top:var(--hairline) solid var(--rule)">
        <span class="caption">Ten planes flown &middot; ${'&#9633; '.repeat(10)}</span>
      </div>
    </div>`;
  return sheet(`<div class="cutgrid" style="grid-template-columns:1fr;grid-template-rows:repeat(4,1fr)">
    ${Array.from({ length: 4 }, licence).join('')}</div>`, { flush: true, cls: 'extras' });
}

function runwaySheet(kit: Squadron): string {
  const rings = `<svg viewBox="0 0 200 200" style="width:100%;max-width:96mm">
    ${[96, 74, 52, 30].map((r, i) =>
      `<circle cx="100" cy="100" r="${r}" fill="none" stroke="${i === 1 ? HI : INK}" stroke-width="${i === 1 ? 4 : 2.4}"/>`).join('')}
    <circle cx="100" cy="100" r="10" fill="${HI}"/>
    ${[[100, 26, '10'], [100, 178, '10'], [26, 105, '5'], [178, 105, '5']].map(([x, y, t]) =>
      `<text x="${x}" y="${y}" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-size="15"
        font-weight="700" fill="${FAINT}">${t}</text>`).join('')}
    <text x="100" y="106" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-size="13"
      font-weight="700" fill="#fff">25</text>
  </svg>`;

  return sheet(framed(head('Runway &amp; target', 'Hangar extras &middot; sheet 3 of 5'), `
    <div class="stack-3" style="height:100%;display:flex;flex-direction:column">
      <div>
        <h1 class="display" style="font-size:28pt">Somewhere to<br/>aim, and a line<br/>to throw from.</h1>
        <p class="small" style="margin-top:var(--space-2);max-width:124mm">Cut both out. Tape the target to a wall
        at chest height. Lay the runway strip on the floor and throw from behind it.</p>
      </div>

      <div style="display:flex;gap:var(--space-4);align-items:flex-start;flex:1;min-height:0">
        <div class="panel" style="flex:1;display:flex;flex-direction:column;align-items:center;padding:var(--space-3)">
          <div class="panel__title" style="align-self:flex-start">Target &mdash; tape to a wall</div>
          ${rings}
          <p class="caption" style="margin-top:var(--space-2);text-align:center">Score by the ring the nose lands in.
          Missing the paper altogether is nought.</p>
        </div>
        <div style="width:56mm">
          <div class="panel panel--tint">
            <div class="panel__title">How to use it</div>
            <ul class="bullets small" style="margin:0">
              <li>Six paces back for the first go, further as it gets easy.</li>
              <li>Five throws each. Add up the rings.</li>
              <li>Fifty out of fifty has never been done in this house.</li>
            </ul>
          </div>
          <div class="panel panel--warn" style="margin-top:var(--space-3)">
            <div class="panel__title">Throwing line</div>
            <p class="small" style="margin:0">Cut the strip below and lay it on the floor. Toes behind it, or the
            throw does not count.</p>
          </div>
        </div>
      </div>

      <div style="border:var(--hairline) dashed var(--ink-faint);padding:var(--space-2) var(--space-3);
        display:flex;align-items:center;gap:var(--space-3);background:var(--paper)">
        <span style="font-family:var(--font-display);font-size:15pt;white-space:nowrap">THROW FROM HERE</span>
        <span style="flex:1;height:4mm;background:repeating-linear-gradient(90deg,var(--ink) 0 6mm,transparent 6mm 12mm)"></span>
        <span class="label">${kit.seriesName}</span>
      </div>
    </div>`, runfoot(`${kit.seriesName} &middot; Hangar extras`, 'Sheet 3 of 5')));
}

function certificatesSheet(kit: Squadron): string {
  const cert = (title: string, sub: string) => `
    <div class="cutcard snip" style="align-items:center;text-align:center;justify-content:center;
      border-style:dashed;padding:var(--space-4)">
      ${wingsMark(34)}
      <div class="label label--hi" style="margin-top:2mm">${kit.seriesName}</div>
      <div style="font-family:var(--font-display);font-size:17pt;line-height:1.05;margin:2mm 0 1mm">${title}</div>
      <p class="caption" style="margin:0 0 3mm;max-width:80mm">${sub}</p>
      <div style="width:78%;border-bottom:var(--rule-medium) solid var(--ink);height:8mm"></div>
      <div class="caption" style="margin-top:1mm">awarded to</div>
      <div style="display:flex;gap:var(--space-5);margin-top:3mm;width:78%">
        <div style="flex:1"><div style="border-bottom:var(--hairline) solid var(--ink);height:6mm"></div>
          <div class="caption">result</div></div>
        <div style="flex:1"><div style="border-bottom:var(--hairline) solid var(--ink);height:6mm"></div>
          <div class="caption">date</div></div>
      </div>
    </div>`;
  return sheet(`<div class="cutgrid" style="grid-template-columns:1fr;grid-template-rows:repeat(3,1fr)">
    ${cert('Longest flight', 'For the plane that went furthest before it touched the floor')}
    ${cert('Longest in the air', 'For the plane that stayed up longest, measured on a stopwatch')}
    ${cert('Best shot', 'For the most throws landed inside the target rings')}
  </div>`, { flush: true, cls: 'extras' });
}

function doorSheet(kit: Squadron): string {
  return sheet(framed(head('Hangar door', 'Hangar extras &middot; sheet 5 of 5'), `
    <div style="display:flex;flex-direction:column;height:100%;text-align:center;align-items:center">
      <div style="margin-top:var(--space-5)">${wingsMark(78)}</div>
      <div class="label label--hi" style="margin-top:var(--space-4);font-size:11pt">${kit.seriesName}</div>
      <h1 class="display" style="font-size:52pt;margin-top:var(--space-2);line-height:0.95">FLIGHT<br/>TESTING<br/>IN PROGRESS</h1>
      <p class="lead" style="max-width:110mm;margin-top:var(--space-4)">Ten planes. Three records to beat.
      Knock before entering, and do not open the window.</p>
      <div style="margin-top:auto;width:100%;border-top:var(--rule-heavy) solid var(--ink);padding-top:var(--space-3);
        display:flex;justify-content:space-between;align-items:baseline">
        <span class="label label--ink">Chief test pilot</span>
        <span style="flex:1;margin:0 var(--space-3);border-bottom:var(--hairline) solid var(--ink);height:8mm"></span>
        <span class="label">${kit.publisherUrl}</span>
      </div>
    </div>`, ''), { tint: true });
}

export function hangarExtras(kit: Squadron, size: PaperSize): string {
  return html('flight', `${kit.title} — Hangar Extras`, size, [
    badgesSheet(kit), licenceSheet(kit), runwaySheet(kit), certificatesSheet(kit), doorSheet(kit),
  ], `.extras { padding: 10mm; }`);
}
