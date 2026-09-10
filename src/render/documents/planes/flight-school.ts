import type { Squadron } from '../../../content/plane-types.ts';
import { html, sheet, framed, runfoot, type PaperSize } from '../../shell.ts';
import { foldKey } from './parts.ts';
import { HI, AIR, INK, FAINT } from '../../fold/draw.ts';

/** The part of the pack that is not about any one plane.
 *
 *  Almost every "it doesn't work" is one of four things: a soft crease, a bad
 *  throw, wings at the wrong angle, or a plane thrown in a room with a draught.
 *  Five sheets, one per cause, plus a page written for the adult. */

function head(tab: string, note: string): string {
  return `<header class="runhead"><span class="tab tab--hi">${tab}</span>
    <span class="runhead__note">${note}</span></header>`;
}

/** A small captioned figure, drawn rather than photographed so it stays crisp
 *  and costs nothing to print. */
function figure(svg: string, caption: string, height = '30mm'): string {
  return `<figure style="margin:0">
    <div style="height:${height};display:flex;align-items:center;justify-content:center">${svg}</div>
    <figcaption class="caption" style="margin-top:1.5mm;text-align:center">${caption}</figcaption>
  </figure>`;
}

const thumbFold = `<svg viewBox="0 0 120 60" style="height:100%">
  <path d="M8 46 L60 46 L60 14 Z" fill="#fff" stroke="${INK}" stroke-width="2"/>
  <path d="M60 46 L112 46 L60 14 Z" fill="#f5f3ee" stroke="${INK}" stroke-width="1"/>
  <line x1="60" y1="14" x2="60" y2="46" stroke="${HI}" stroke-width="2.4"/>
  <circle cx="60" cy="30" r="7" fill="none" stroke="${AIR}" stroke-width="2"/>
  <path d="M60 30 L96 20" stroke="${AIR}" stroke-width="2" stroke-linecap="round"/>
</svg>`;

const gripFigure = `<svg viewBox="0 0 150 70" style="height:100%">
  <path d="M12 44 L96 26 L138 36 L96 46 Z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
  <line x1="12" y1="44" x2="96" y2="44" stroke="${FAINT}" stroke-width="1"/>
  <path d="M26 56 q10 -14 22 -12" fill="none" stroke="${AIR}" stroke-width="3" stroke-linecap="round"/>
  <path d="M26 30 q10 12 22 10" fill="none" stroke="${AIR}" stroke-width="3" stroke-linecap="round"/>
  <text x="60" y="66" font-family="Barlow Condensed" font-size="9" fill="${FAINT}">hold here, under the body</text>
</svg>`;

const dihedralFigure = (deg: number, label: string, tone: string) => `<svg viewBox="0 0 120 70" style="height:100%">
  <line x1="60" y1="34" x2="60" y2="52" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
  <line x1="60" y1="34" x2="${60 - 46 * Math.cos((deg * Math.PI) / 180)}" y2="${34 - 46 * Math.sin((deg * Math.PI) / 180)}"
    stroke="${tone}" stroke-width="2.6" stroke-linecap="round"/>
  <line x1="60" y1="34" x2="${60 + 46 * Math.cos((deg * Math.PI) / 180)}" y2="${34 - 46 * Math.sin((deg * Math.PI) / 180)}"
    stroke="${tone}" stroke-width="2.6" stroke-linecap="round"/>
  <text x="60" y="66" text-anchor="middle" font-family="Barlow Condensed" font-size="10" fill="${FAINT}">${label}</text>
</svg>`;

const trimFigure = (up: boolean) => `<svg viewBox="0 0 130 64" style="height:100%">
  <path d="M10 38 L92 22 L124 30 L92 40 Z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M10 38 L28 38 L28 ${up ? 28 : 48} L10 ${up ? 30 : 46} Z" fill="${HI}" stroke="${INK}" stroke-width="1.2"/>
  <path d="M34 ${up ? 20 : 54} q10 ${up ? -6 : 6} 18 0" fill="none" stroke="${HI}" stroke-width="2" stroke-linecap="round"/>
  <text x="70" y="60" text-anchor="middle" font-family="Barlow Condensed" font-size="10" fill="${FAINT}">
    back corners bent ${up ? 'UP' : 'DOWN'}</text>
</svg>`;

const glidePath = (kind: 'stall' | 'dive' | 'good') => {
  const d = kind === 'stall'
    ? 'M6 52 Q40 6 66 18 Q76 24 74 52'
    : kind === 'dive'
      ? 'M6 14 Q34 18 52 52'
      : 'M6 20 Q46 26 118 50';
  return `<svg viewBox="0 0 130 64" style="height:100%">
    <line x1="0" y1="56" x2="130" y2="56" stroke="${FAINT}" stroke-width="1.2" stroke-dasharray="4 3"/>
    <path d="${d}" fill="none" stroke="${AIR}" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`;
};

function foldingSheet(kit: Squadron): string {
  return sheet(framed(head('01 &middot; Folding', 'Flight school &middot; sheet 1 of 5'), `
    <div class="stack-3">
      <h1 class="display" style="font-size:27pt">A soft fold is a bad plane.</h1>
      <p class="lead" style="max-width:130mm">Nearly every plane that will not fly was folded gently. Paper only
      remembers a fold that has been forced. Four things fix almost all of it.</p>

      <div class="cols cols--2" style="gap:var(--space-4)">
        <div class="panel panel--tint">
          <div class="panel__title">1. Line it up, then press</div>
          <p class="small">Bring the two edges together and hold them there before any part of the crease is
          flattened. Press from the middle outwards. Press first and line up after, and the fold slides.</p>
          ${figure(thumbFold, 'Hold the corner, press outwards from the crease', '26mm')}
        </div>
        <div class="panel panel--tint">
          <div class="panel__title">2. Use a hard edge</div>
          <p class="small">Fold on a table, not on your lap. Run a thumbnail, a ruler or the back of a spoon along
          every crease. A crease you can feel a ridge on will hold.</p>
        </div>
      </div>

      <div class="cols cols--2" style="gap:var(--space-4)">
        <div class="panel panel--tint">
          <div class="panel__title">3. Both sides the same</div>
          <p class="small">A plane is symmetrical or it turns. Whenever a step says <em>both</em>, do the second
          fold by matching it against the first, not by measuring again. Fold one wing, then fold the plane over
          and match the other to it.</p>
        </div>
        <div class="panel panel--tint">
          <div class="panel__title">4. Follow the printed lines</div>
          <p class="small">The grey dashes on every template are the folds, printed exactly where the geometry
          puts them. Fold along the line and the plane comes out right the first time. The blue dashes are where
          the wings go, and they come last.</p>
        </div>
      </div>

      <div class="panel">
        <div class="panel__title">The five marks used on every diagram</div>
        ${foldKey()}
      </div>

      <div class="panel panel--warn">
        <div class="panel__title">The one mistake that ruins a template</div>
        <p class="small" style="margin:0">If your printer is set to &ldquo;fit to page&rdquo; or &ldquo;shrink
        oversized pages&rdquo;, the printed fold lines land in the wrong place and nothing will line up. Check the
        four corner ticks on the template: they should sit the same distance in from all four edges. If they do
        not, print again at 100%.</p>
      </div>
    </div>`, runfoot(`${kit.seriesName} &middot; Flight school`, 'Sheet 1 of 5')), { tint: true });
}

function throwingSheet(kit: Squadron): string {
  return sheet(framed(head('02 &middot; Throwing', 'Flight school &middot; sheet 2 of 5'), `
    <div class="stack-3">
      <h1 class="display" style="font-size:27pt">Most planes are thrown wrong.</h1>
      <p class="lead" style="max-width:130mm">A glider thrown hard climbs, stops and falls. A dart thrown gently
      never gets going. The plane decides how it wants to be launched, and the fold sheet for each one says which.</p>

      <div class="cols cols--2">
        <div class="panel panel--adult" style="border-left-color:var(--hi)">
          <div class="panel__title">Darts &mdash; Arrow, Bulldog, Hammer, Kestrel</div>
          <p class="small">Pinch the body near the nose, between finger and thumb. Bring your arm past your ear.
          Throw hard, level with your eyes, at a point on the far wall.</p>
        </div>
        <div class="panel panel--adult">
          <div class="panel__title">Gliders &mdash; Sparrow, Hawk, Condor, Moth</div>
          <p class="small">Rest the body on two fingers underneath. Push it forward at about walking pace, nose
          very slightly up. Let go, do not flick. Thrown hard, a glider will not glide.</p>
        </div>
      </div>

      <div class="cols cols--3" style="gap:var(--space-3)">
        ${figure(gripFigure, 'A glider is pushed, not thrown', '28mm')}
        ${figure(glidePath('good'), 'Right: a long shallow glide', '28mm')}
        ${figure(glidePath('stall'), 'Wrong: it climbs, stops, drops', '28mm')}
      </div>

      <div class="panel">
        <div class="panel__title">Four things that are not the plane's fault</div>
        <table class="ledger ledger--text ledger--tight">
          <tbody>
            <tr><td style="width:44mm"><strong>Wind</strong></td><td class="small">Fly indoors, or on a still
              morning. A paper plane weighs less than the breeze does.</td></tr>
            <tr><td><strong>Throwing downward</strong></td><td class="small">Aim level or very slightly up. Aiming
              at the floor is the commonest mistake there is.</td></tr>
            <tr><td><strong>Damp paper</strong></td><td class="small">A plane left on a radiator or a wet table
              goes soft and will not hold its shape. Print another.</td></tr>
            <tr><td><strong>Not enough room</strong></td><td class="small">A good glider needs eight metres before
              it has finished doing anything interesting. A hallway beats a bedroom.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="panel panel--air">
        <div class="panel__title">Why it flies at all</div>
        <p class="small" style="margin:0">Air has to go somewhere when the wing pushes through it, and it comes
        off the back of the wing pointing slightly downward. The wing gets pushed the opposite way, upward. That
        is lift, and it is why the wings must be flat, smooth and the same on both sides. Every crease in the
        wrong place is a place where the air trips over.</p>
      </div>
    </div>`, runfoot(`${kit.seriesName} &middot; Flight school`, 'Sheet 2 of 5')), { tint: true });
}

function trimmingSheet(kit: Squadron): string {
  return sheet(framed(head('03 &middot; Trimming', 'Flight school &middot; sheet 3 of 5'), `
    <div class="stack-3">
      <h1 class="display" style="font-size:27pt">Bend the back corners.<br/>That is the whole secret.</h1>
      <p class="lead" style="max-width:130mm">A plane that dives, stalls or turns is not a failed plane. It is an
      untrimmed one. Two small bends fix nearly everything, and this page is the one to keep out while you fly.</p>

      <div class="cols cols--3" style="gap:var(--space-3)">
        ${figure(dihedralFigure(2, 'Too flat: it will roll over', INK), 'Wings almost level', '26mm')}
        ${figure(dihedralFigure(16, 'About right', HI), 'A shallow V, seen head on', '26mm')}
        ${figure(dihedralFigure(38, 'Too much: it wallows', INK), 'Wings held up too far', '26mm')}
      </div>

      <div class="panel">
        <div class="panel__title">What it is doing, and what to do about it</div>
        <table class="ledger ledger--text ledger--tight">
          <tbody>
            <tr><td style="width:52mm"><strong>Dives into the floor</strong></td>
              <td class="small">Bend the back corners of <em>both</em> wings up, about the width of a fingernail. Try again.</td></tr>
            <tr><td><strong>Rears up, stops, falls</strong></td>
              <td class="small">The opposite: bend both back corners down a little, or throw it more gently.</td></tr>
            <tr><td><strong>Rolls onto its back</strong></td>
              <td class="small">The wings are too flat. Open them into a wider V.</td></tr>
            <tr><td><strong>Always turns left</strong></td>
              <td class="small">Bend the back corner of the <em>right</em> wing up a little. One wing only.</td></tr>
            <tr><td><strong>Always turns right</strong></td>
              <td class="small">Bend the back corner of the <em>left</em> wing up a little.</td></tr>
            <tr><td><strong>Nose keeps opening</strong></td>
              <td class="small">Press the nose folds again, hard. One small piece of tape under the nose is allowed.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="cols cols--2" style="gap:var(--space-3)">
        ${figure(trimFigure(true), 'Corners up: the nose comes up', '22mm')}
        ${figure(trimFigure(false), 'Corners down: the nose goes down', '22mm')}
      </div>

      <div class="panel panel--warn">
        <div class="panel__title">Change one thing at a time</div>
        <p class="small" style="margin:0">Bend one thing, throw it, look. Bending three things at once and throwing
        it hard tells you nothing. Small bends: a millimetre or two does more than you expect.</p>
      </div>
    </div>`, runfoot(`${kit.seriesName} &middot; Flight school`, 'Sheet 3 of 5')), { tint: true });
}

function whichPlaneSheet(kit: Squadron): string {
  const rows = kit.planes.map((p) => `
    <tr>
      <td style="width:9mm"><span class="step-no step-no--open">${p.number}</span></td>
      <td style="width:30mm"><strong>${p.name}</strong> <span class="caption">${p.serial}</span></td>
      <td style="width:24mm" class="small">${p.best}</td>
      <td class="small">${p.tagline}</td>
      <td style="width:20mm;white-space:nowrap;font-size:var(--size-caption)">${'&#9632;'.repeat(p.level)}<span
        style="color:var(--rule)">${'&#9632;'.repeat(5 - p.level)}</span></td>
    </tr>`).join('');

  return sheet(framed(head('04 &middot; The squadron', 'Flight school &middot; sheet 4 of 5'), `
    <div class="stack-3">
      <h1 class="display" style="font-size:27pt">Which one to make.</h1>
      <p class="small" style="max-width:130mm">Ten planes, no two of which do the same thing in the air. Pick by
      what you want to happen, not by which looks hardest.</p>

      <div class="panel">
        <div class="panel__title">All ten</div>
        <table class="ledger ledger--text ledger--tight">
          <thead><tr><th></th><th>Plane</th><th>Best at</th><th>What it does</th><th>Folds</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>

      <div class="panel panel--tint">
        <div class="panel__title">Where to start</div>
        <p class="small" style="margin:0"><strong>First time folding:</strong> Sparrow, then Arrow.
        <strong>To win something:</strong> Hammer for distance, Hawk or Moth for hang time, Kestrel through a hoop,
        Arrow for a race. <strong>To show someone:</strong> Boomerang, the only one that comes back.</p>
      </div>

      <div class="panel panel--air">
        <div class="panel__title">Fly them against each other</div>
        <p class="small" style="margin:0"><strong>04 Flight Log</strong> has a record card, a fly-off scorecard for
        six pilots, and twelve challenge cards to cut out when someone says they are bored.</p>
      </div>
    </div>`, runfoot(`${kit.seriesName} &middot; Flight school`, 'Sheet 4 of 5')), { tint: true });
}

function adultSheet(kit: Squadron): string {
  return sheet(framed(head('05 &middot; For the grown-up', 'Flight school &middot; sheet 5 of 5'), `
    <div class="stack-3">
      <h1 class="display" style="font-size:24pt">Read this if it is going badly.</h1>
      <p class="small" style="max-width:132mm">For whoever is standing next to the child. The moment a paper plane
      goes wrong is the moment the afternoon can go wrong with it.</p>

      <div class="panel panel--adult">
        <div class="panel__title">The order that works</div>
        <ol class="steps">
          <li><strong>Fold the Sparrow yourself first,</strong> while they watch. Under a minute, and it sets the
            standard for how hard to press.</li>
          <li><strong>Let them fly it before folding a second.</strong> The reward has to come early.</li>
          <li><strong>Then let them pick.</strong> Sheet 4 lists all ten by what they do.</li>
          <li><strong>Only trim after three throws.</strong> One bad throw is a bad throw, not a bad plane.</li>
        </ol>
      </div>

      <div class="cols cols--2" style="gap:var(--space-4)">
        <div class="panel panel--warn">
          <div class="panel__title">When it will not fly</div>
          <ul class="bullets small">
            <li>Nine times in ten the creases are soft. Press them again along a table edge.</li>
            <li>Check both wings are folded on the same line: look down the nose.</li>
            <li>Check the room. A hallway on a still day, not a living room with a window open.</li>
            <li>If the nose keeps opening, a small piece of tape underneath is not cheating.</li>
          </ul>
        </div>
        <div class="panel panel--tint">
          <div class="panel__title">Running a fly-off without tears</div>
          <ul class="bullets small">
            <li>Score three things &mdash; furthest, longest up, closest to the target. Different children win
              different ones, which is the point of having ten planes.</li>
            <li>Three throws each, best counts. One throw is luck.</li>
            <li>Hand out all three certificates, sheet 4 of <strong>05 Hangar Extras</strong>.</li>
            <li><strong>Safety:</strong> paper planes are pointed, so not at faces. Indoors, reach for the Bulldog,
              whose nose is folded back for exactly this reason.</li>
          </ul>
        </div>
      </div>

      <div class="panel">
        <div class="panel__title">What this is actually teaching</div>
        <table class="ledger ledger--text ledger--tight">
          <tbody>
            <tr><td style="width:44mm"><strong>Following a diagram</strong></td><td class="small">Turning a
              sequence of pictures into an object is a real skill, and a rare one.</td></tr>
            <tr><td><strong>Cause and effect</strong></td><td class="small">Bend one thing, throw it, watch what
              changed. That is an experiment, and it is sheet 3.</td></tr>
            <tr><td><strong>Measuring</strong></td><td class="small">A tape measure and a stopwatch turn a game
              into data.</td></tr>
          </tbody>
        </table>
      </div>

    </div>`, runfoot(`${kit.seriesName} &middot; Flight school`, 'Sheet 5 of 5')), { tint: true });
}

export function flightSchool(kit: Squadron, size: PaperSize): string {
  return html('flight', `${kit.title} — Flight School`, size, [
    foldingSheet(kit), throwingSheet(kit), trimmingSheet(kit), whichPlaneSheet(kit), adultSheet(kit),
  ]);
}
