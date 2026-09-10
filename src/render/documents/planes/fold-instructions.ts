import type { Plane as PlaneSpec, Squadron } from '../../../content/plane-types.ts';
import { printSideUp } from '../../../content/plane-types.ts';
import { html, sheet, type PaperSize } from '../../shell.ts';
import { stepSvg, finishedSvg } from '../../fold/draw.ts';
import { foldKey, model, spec as specBlock } from './parts.ts';

/** One sheet per plane. Everything a folder needs is on this page: what the
 *  plane does, every fold drawn at the same scale so the model visibly shrinks,
 *  what the finished plane looks like from two angles, and how to throw it.
 *
 *  The page is deliberately one sheet per plane rather than a continuous
 *  booklet: it gets laid on the table next to the paper, and it gets creased. */
function planeSheet(kit: Squadron, p: PlaneSpec, size: PaperSize): string {
  const m = model(p, size);
  const faceUp = printSideUp(p);
  const cells = m.frames.map((f, i) => `
    <div class="stepcell">
      <div class="stepcell__art">${stepSvg(f, m.extent)}</div>
      <div class="stepcell__cap">
        <span class="step-no">${i + 1}</span>
        <p>${f.step.caption}${f.step.tip ? `<br/><span class="caption">${f.step.tip}</span>` : ''}</p>
      </div>
    </div>`).join('');

  // Four across reads well; more than eight steps needs five and a smaller
  // drawing, which is still legible because the models are simple line art.
  const cols = m.frames.length > 8 ? 5 : 4;
  const artH = m.frames.length > 8 ? '19mm' : '21mm';

  return sheet(`
    <header class="runhead">
      <span class="tab tab--hi">${p.serial} &middot; How to fold</span>
      <span class="runhead__note">Plane ${p.number} of ${kit.planes.length} &middot; ${kit.seriesName}</span>
    </header>
    <div class="sheet__body">
      <div style="display:flex;align-items:flex-end;gap:var(--space-4)">
        <h1 class="display" style="font-size:32pt;line-height:0.9">${p.name.toUpperCase()}</h1>
        <p class="small" style="flex:1;margin:0 0 1mm">${p.flightNote}</p>
      </div>

      <div style="margin:var(--space-2) 0">${specBlock(p)}</div>

      <div class="panel panel--warn" style="margin-bottom:var(--space-3);padding:1.8mm var(--space-3)">
        <p class="small" style="margin:0"><strong>Before you start.</strong> Template sheet ${p.number} on the table,
        printed side <strong>${faceUp ? 'facing you' : 'face down'}</strong>, unprinted end pointing away from you.
        ${faceUp ? 'The design still finishes on the outside.' : 'Every fold then goes the same way.'}</p>
      </div>

      <div class="steps-grid" style="grid-template-columns:repeat(${cols},1fr);--art-h:${artH}">
        ${cells}
      </div>

      <div class="finished" style="margin-top:var(--space-2)">
        <div class="finished__art">${finishedSvg(m, p.wing.depth, p.wing.noseDepth ?? p.wing.depth, p.wing.dihedral)}</div>
        <div class="finished__cap">
          <div style="display:flex;gap:var(--space-2);align-items:flex-start">
            <span class="step-no step-no--hi">&#10003;</span>
            <p class="small" style="margin:0">Open the wings out until they look like this from the front. Flat
            wings dive; wings held up in a shallow V fly straight. Look down the nose to check the two wings
            match.</p>
          </div>
        </div>
      </div>

      <div class="grow" style="margin-top:var(--space-2);display:flex;align-items:flex-end">${foldKey()}</div>

      <dl class="notes" style="margin:var(--space-2) 0 0">
        <div><dt>How to throw it</dt><dd>${p.launch}</dd></div>
        <div><dt>If it will not fly right</dt><dd>${p.trim}</dd></div>
      </dl>
    </div>
    <footer class="runfoot">
      <span>${kit.seriesName} &middot; ${p.name} ${p.serial}</span>
      <span>Template sheet ${p.number} &middot; ${p.tagline}</span>
    </footer>`);
}

export function foldInstructions(kit: Squadron, size: PaperSize): string {
  return html('flight', `${kit.title} — Fold Instructions`, size,
    kit.planes.map((p) => planeSheet(kit, p, size)));
}
