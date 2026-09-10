import type { Squadron } from '../../../content/plane-types.ts';
import { printSideUp } from '../../../content/plane-types.ts';
import { html, sheet, framed, runfoot, paperLabel, type PaperSize } from '../../shell.ts';
import { stepSvg, finishedSvg } from '../../fold/draw.ts';
import { templateSvg } from '../../livery.ts';
import { foldKey, model, sheetHeight, spec as specBlock } from './parts.ts';

/** One whole plane, given away.
 *
 *  It is a complete plane rather than a taste of one: a sample that cannot be
 *  flown proves nothing. The Sparrow is the right one to give away because it
 *  is the easiest — the sample has to succeed on a kitchen table, first go,
 *  with no help. */
export function planeFreeSample(kit: Squadron, size: PaperSize): string {
  const p = kit.planes[0];
  const m = model(p, size);
  const h = sheetHeight(size);
  const faceUp = printSideUp(p);

  const cover = sheet(framed(
    `<header class="runhead"><span class="tab tab--hi">Free plane</span>
      <span class="runhead__note">${kit.seriesName} &middot; ${paperLabel(size)}</span></header>`,
    `<div class="stack-3">
      <div class="stack-2">
        <div class="label label--hi">One plane from the pack of ten, free</div>
        <h1 class="display" style="font-size:36pt;max-width:12ch">The Sparrow</h1>
        <p class="lead" style="max-width:126mm">Four folds. It flies slowly and straight across a room, and it is
        the plane to learn to throw with. Print the third sheet, fold it, and go.</p>
      </div>

      <div class="cols cols--2" style="gap:var(--space-4)">
        <div class="panel panel--warn">
          <div class="panel__title">What to do</div>
          <ol class="steps">
            <li>Print all three sheets at <strong>100%</strong>, not &ldquo;fit to page&rdquo;.</li>
            <li>Put sheet 3 on the table, printed side <strong>${faceUp ? 'facing you' : 'face down'}</strong>.</li>
            <li>Follow the four steps on sheet 2. Press every crease hard.</li>
            <li>Push it forward gently, level with your shoulder. Do not throw it hard.</li>
          </ol>
        </div>
        <div class="panel panel--tint">
          <div class="panel__title">If it dives</div>
          <p class="small" style="margin:0">Bend the back corner of each wing up, about the width of a fingernail,
          and try again. If it rears up and drops, bend them back down. That one adjustment fixes most paper
          planes ever folded.</p>
        </div>
      </div>

      <div class="panel">
        <div class="panel__title">This is one of ten</div>
        <table class="ledger ledger--text">
          <tbody>
            ${kit.planes.slice(0, 5).map((x) => `<tr>
              <td style="width:9mm;font-family:var(--font-signage);font-weight:700;color:var(--hi)">${x.number}</td>
              <td style="width:32mm"><strong>${x.name}</strong></td>
              <td class="small">${x.tagline}</td>
              <td class="num small" style="width:24mm;white-space:nowrap">${x.best}</td></tr>`).join('')}
            <tr><td colspan="4" class="small" style="color:var(--ink-faint)">&hellip; and five more, including the
              one that comes back to you.</td></tr>
          </tbody>
        </table>
        <p class="small" style="margin-top:var(--space-2);margin-bottom:0">The full pack has all ten planes, the
        printed templates, a flight log, target rings and certificates.
        <strong>${kit.publisherUrl}</strong></p>
      </div>
    </div>`,
    runfoot(`${kit.seriesName} &middot; ${kit.title}`, kit.publisherUrl),
  ), { tint: true });

  const cells = m.frames.map((f, i) => `
    <div class="stepcell">
      <div class="stepcell__art">${stepSvg(f, m.extent)}</div>
      <div class="stepcell__cap">
        <span class="step-no">${i + 1}</span>
        <p>${f.step.caption}${f.step.tip ? `<br/><span class="caption">${f.step.tip}</span>` : ''}</p>
      </div>
    </div>`).join('');

  const folds = sheet(`
    <header class="runhead">
      <span class="tab tab--hi">${p.serial} &middot; How to fold</span>
      <span class="runhead__note">Free sample &middot; sheet 2 of 3</span>
    </header>
    <div class="sheet__body">
      <div style="display:flex;align-items:flex-end;gap:var(--space-4)">
        <h1 class="display" style="font-size:32pt;line-height:0.9">${p.name.toUpperCase()}</h1>
        <p class="small" style="flex:1;margin:0 0 1mm">${p.flightNote}</p>
      </div>
      <div style="margin:var(--space-2) 0 var(--space-3)">${specBlock(p)}</div>
      <div class="steps-grid" style="grid-template-columns:repeat(3,1fr);--art-h:30mm">
        ${cells}
      </div>
      <div class="finished" style="margin-top:var(--space-3)">
        <div class="finished__art">${finishedSvg(m, p.wing.depth, p.wing.noseDepth ?? p.wing.depth, p.wing.dihedral)}</div>
        <div class="finished__cap">
          <div style="display:flex;gap:var(--space-2);align-items:flex-start">
            <span class="step-no step-no--hi">&#10003;</span>
            <p class="small" style="margin:0">Open the wings out until they look like this from the front. Flat
            wings dive; wings held up in a shallow V fly straight.</p>
          </div>
        </div>
      </div>
      <div class="grow" style="margin-top:var(--space-3);display:flex;align-items:flex-end">${foldKey()}</div>
      <dl class="notes" style="margin:var(--space-2) 0 0">
        <div><dt>How to throw it</dt><dd>${p.launch}</dd></div>
        <div><dt>If it will not fly right</dt><dd>${p.trim}</dd></div>
      </dl>
    </div>
    <footer class="runfoot"><span>${kit.seriesName} &middot; ${p.name} ${p.serial}</span>
      <span>The full pack of ten: ${kit.publisherUrl}</span></footer>`);

  const template = sheet(templateSvg(p, m, h, faceUp), { flush: true, cls: 'template' });

  return html('flight', `${kit.title} — Free Sample`, size, [cover, folds, template]);
}
