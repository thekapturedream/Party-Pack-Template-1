import type { Squadron } from '../../../content/plane-types.ts';
import { html, sheet, framed, runfoot, type PaperSize } from '../../shell.ts';

/** The part that turns folding into flying, and flying into a competition.
 *
 *  Three sheets. The record card is per-pilot and gets filled in over an
 *  afternoon. The fly-off card scores six pilots at once on three different
 *  measures, so that the child with the strongest arm does not win everything.
 *  The challenge cards are for the moment interest dips. */

function head(tab: string, note: string): string {
  return `<header class="runhead"><span class="tab tab--hi">${tab}</span>
    <span class="runhead__note">${note}</span></header>`;
}

function logSheet(kit: Squadron): string {
  const rows = kit.planes.map((p) => `
    <tr>
      <td style="width:8mm;padding-left:2mm;font-family:var(--font-signage);font-weight:700">${p.number}</td>
      <td style="width:32mm;padding-left:2mm"><strong style="font-family:var(--font-text)">${p.name}</strong></td>
      <td style="width:22mm"></td><td style="width:22mm"></td><td style="width:22mm"></td>
      <td></td>
    </tr>`).join('');

  return sheet(framed(head('Record card', 'Flight log &middot; sheet 1 of 3'), `
    <div class="stack-3" style="height:100%;display:flex;flex-direction:column">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:var(--space-4)">
        <div>
          <h1 class="display" style="font-size:28pt">Flight log</h1>
          <p class="small" style="margin:var(--space-1) 0 0">One card per pilot. Three throws each; write down
          the best one.</p>
        </div>
        <div style="display:flex;gap:var(--space-4);align-items:flex-end">
          <div><div class="label">Pilot</div><div style="width:46mm;border-bottom:var(--rule-medium) solid var(--ink);height:8mm"></div></div>
          <div><div class="label">Date</div><div style="width:26mm;border-bottom:var(--rule-medium) solid var(--ink);height:8mm"></div></div>
        </div>
      </div>

      <table class="log">
        <thead><tr>
          <th style="width:8mm"></th><th style="width:32mm">Plane</th>
          <th style="width:22mm">Distance&nbsp;m</th><th style="width:22mm">Seconds up</th>
          <th style="width:22mm">Target hits</th><th>What it did, and what I bent</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="cols cols--3" style="gap:var(--space-3)">
        <div class="panel panel--tint">
          <div class="panel__title">Distance</div>
          <p class="small" style="margin:0">Throw from behind a line. Measure to where the nose first touches the
          floor, not to where it slid to.</p>
        </div>
        <div class="panel panel--tint">
          <div class="panel__title">Seconds up</div>
          <p class="small" style="margin:0">Start the stopwatch as it leaves your hand, stop it when it touches
          anything. Indoors, out of any draught.</p>
        </div>
        <div class="panel panel--tint">
          <div class="panel__title">Target hits</div>
          <p class="small" style="margin:0">Five throws at the target rings on sheet 3 of Hangar Extras. Count how
          many land inside the outer ring.</p>
        </div>
      </div>

      <div class="panel panel--air grow" style="display:flex;flex-direction:column">
        <div class="panel__title">The record to beat</div>
        <div class="cols cols--3" style="margin-bottom:var(--space-2)">
          ${[['Furthest', 'm'], ['Longest in the air', 'sec'], ['Most target hits', 'of 5']].map(([k, u]) =>
            `<div><div class="label label--air">${k}</div>
              <div style="display:flex;align-items:baseline;gap:var(--space-2);border-bottom:var(--rule-medium) solid var(--ink);
                height:11mm"><span style="margin-top:auto;font-family:var(--font-data);color:var(--ink-faint)">${u}</span></div></div>`).join('')}
        </div>
        <div class="scratch grow"><div class="scratch__title">Notes &mdash; what worked</div></div>
      </div>
    </div>`, runfoot(`${kit.seriesName} &middot; Flight log`, 'Sheet 1 of 3')));
}

function flyOffSheet(kit: Squadron): string {
  const pilots = 6;
  const bandRows = (label: string, unit: string) => `
    <tr><td style="padding-left:2mm;font-family:var(--font-signage);font-weight:600;text-transform:uppercase;
      letter-spacing:0.1em;font-size:9pt;width:34mm">${label}<div class="caption"
      style="text-transform:none;letter-spacing:0">${unit}</div></td>
      ${Array.from({ length: pilots }, () => '<td></td>').join('')}</tr>`;

  return sheet(framed(head('Fly-off', 'Flight log &middot; sheet 2 of 3'), `
    <div class="stack-3" style="height:100%;display:flex;flex-direction:column">
      <div>
        <h1 class="display" style="font-size:28pt">The fly-off</h1>
        <p class="lead" style="max-width:132mm;margin-top:var(--space-1)">Three contests, not one. Pilots win
        different ones, which is the point of having ten different planes.</p>
      </div>

      <table class="log">
        <thead><tr><th style="width:34mm">Pilot</th>
          ${Array.from({ length: pilots }, () => '<th></th>').join('')}</tr></thead>
        <tbody>
          <tr><td style="padding-left:2mm;font-family:var(--font-signage);font-weight:600;text-transform:uppercase;
            letter-spacing:0.1em;font-size:9pt">Plane flown</td>
            ${Array.from({ length: pilots }, () => '<td></td>').join('')}</tr>
          ${bandRows('Distance', 'metres, best of three')}
          ${bandRows('Hang time', 'seconds, best of three')}
          ${bandRows('Accuracy', 'hits out of five')}
          ${bandRows('Comeback', 'did it return? Y / N')}
          ${bandRows('Total points', '3 for a win, 1 for a place')}
        </tbody>
      </table>

      <div class="cols cols--2" style="gap:var(--space-4)">
        <div class="panel panel--warn">
          <div class="panel__title">The rules, such as they are</div>
          <ol class="steps small">
            <li>Everyone throws from behind the same line.</li>
            <li>Three throws each per contest. The best one counts.</li>
            <li>A plane may be trimmed between throws. It may not be rebuilt mid-contest.</li>
            <li>One piece of sticky tape per plane, and no more.</li>
            <li>A plane that hits the ceiling counts. A plane that hits a person does not.</li>
          </ol>
        </div>
        <div class="panel panel--tint">
          <div class="panel__title">Setting it up</div>
          <ul class="bullets small">
            <li>A hallway or a hall. Mark the throwing line with the runway strip from Hangar Extras.</li>
            <li>A tape measure, or count floor tiles and say how wide one is.</li>
            <li>A phone stopwatch for hang time. Two people: one throws, one times.</li>
            <li>Target rings taped to a wall at chest height, about six metres back.</li>
          </ul>
        </div>
      </div>

      <div class="panel panel--air grow" style="display:flex;flex-direction:column">
        <div class="panel__title">Champion of the day</div>
        <div class="cols cols--3" style="margin-top:var(--space-1)">
          ${['Distance', 'Hang time', 'Accuracy'].map((k) =>
            `<div><div class="label label--air">${k}</div>
              <div style="border-bottom:var(--rule-medium) solid var(--ink);height:12mm"></div></div>`).join('')}
        </div>
        <div class="scratch grow" style="margin-top:var(--space-3)"><div class="scratch__title">What happened</div></div>
      </div>
    </div>`, runfoot(`${kit.seriesName} &middot; Flight log`, 'Sheet 2 of 3')));
}

const CHALLENGES: { title: string; body: string; plane: string }[] = [
  { title: 'The corridor', body: 'Fly the length of a hallway without touching a wall. Three tries.', plane: 'Kestrel or Arrow' },
  { title: 'Five seconds', body: 'Keep any plane in the air for five whole seconds, indoors, from a standing throw.', plane: 'Hawk, Condor or Moth' },
  { title: 'Through the hoop', body: 'Someone holds a hoop, or their arms in a circle, six paces away. Get one through.', plane: 'Kestrel' },
  { title: 'The return', body: 'Throw a plane away from you and have it land closer to you than where it turned round.', plane: 'Boomerang' },
  { title: 'Blind launch', body: 'Close your eyes, throw, and land inside the target rings. Five tries, count the hits.', plane: 'Sparrow' },
  { title: 'The long one', body: 'Beat your own furthest throw by two whole metres. Trim between tries.', plane: 'Hammer' },
  { title: 'Head to head', body: 'Two planes, thrown at the same moment on a count of three. Furthest wins.', plane: 'Arrow against Hammer' },
  { title: 'The stack', body: 'Land a plane on a chair, then on a table, then on a sofa. In that order.', plane: 'Condor' },
  { title: 'One breath', body: 'Fold a Sparrow from a fresh sheet before someone finishes counting to sixty.', plane: 'Sparrow' },
  { title: 'The loop', body: 'Throw upward at forty-five degrees and get the plane to turn over completely.', plane: 'Delta' },
  { title: 'Whole squadron', body: 'Fold all ten planes. Fly each one once. Write every result in the log.', plane: 'All ten' },
  { title: 'Left and right', body: 'Trim one plane to turn left, then trim it back to fly straight. Prove both.', plane: 'Any glider' },
];

function challengeSheet(kit: Squadron): string {
  const cards = CHALLENGES.map((c, i) => `
    <div class="cutcard snip">
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <span class="label label--hi">Challenge ${i + 1}</span>
        <span class="label">${kit.seriesName}</span>
      </div>
      <h3 style="margin:1.5mm 0 1mm;font-family:var(--font-display);font-size:12pt">${c.title}</h3>
      <p class="small" style="margin:0">${c.body}</p>
      <div style="margin-top:auto;padding-top:2mm;border-top:var(--hairline) solid var(--rule)">
        <span class="caption">Try it with the <strong>${c.plane}</strong></span>
      </div>
    </div>`).join('');

  return sheet(`<div class="cutgrid" style="grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,1fr)">
    ${cards}</div>`, { flush: true, cls: 'challenge' });
}

export function flightLog(kit: Squadron, size: PaperSize): string {
  return html('flight', `${kit.title} — Flight Log`, size,
    [logSheet(kit), flyOffSheet(kit), challengeSheet(kit)],
    `.challenge { padding: 10mm; }`);
}
