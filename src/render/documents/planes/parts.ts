/** Pieces shared by more than one printed document in the plane pack. */
import type { Plane as PlaneSpec, Squadron } from '../../../content/plane-types.ts';
import { Plane } from '../../fold/model.ts';
import { HI, AIR, INK, FAINT } from '../../fold/draw.ts';
import { paperRatio, type PaperSize } from '../../shell.ts';

/** The folded model for one plane at one paper size. Built once per document,
 *  because folding it is the expensive part of rendering a sheet. */
export function model(spec: PlaneSpec, size: PaperSize): Plane {
  const h = 1 / paperRatio(size);
  return new Plane(h, spec.steps(h));
}

export function sheetHeight(size: PaperSize): number {
  return 1 / paperRatio(size);
}

/** A five-square rating bar. Squares rather than stars: it reads as a
 *  measurement, not a review score. */
export function bars(value: number, tone: 'ink' | 'hi' | 'air' = 'ink'): string {
  const cls = tone === 'ink' ? '' : ` bars--${tone}`;
  return `<span class="bars${cls}">${Array.from({ length: 5 }, (_, i) =>
    `<i class="${i < value ? 'on' : ''}"></i>`).join('')}</span>`;
}

/** The plane's numbers, as one strip across the page. It reads as an
 *  instrument panel and, unlike a column beside the title, it costs the same
 *  height whatever is in it. */
export function spec(spec: PlaneSpec): string {
  const cell = (k: string, v: string) =>
    `<div><div class="spec__k">${k}</div><div class="spec__v">${v}</div></div>`;
  return `<div class="spec spec--strip">
    ${cell('Best at', spec.best)}
    ${cell('Folds', `${spec.level === 1 ? 'Easiest' : spec.level >= 4 ? 'Hardest' : 'Middling'} ${bars(spec.level, 'hi')}`)}
    ${cell('Speed', bars(spec.speed))}
    ${cell('Glide', bars(spec.glide))}
    ${cell('Steadiness', bars(spec.stability))}
  </div>`;
}

/** The line key, printed on every sheet that carries a diagram. A child who
 *  learns these four marks can follow any sheet in the pack. */
export function foldKey(): string {
  const swatch = (inner: string) =>
    `<svg viewBox="0 0 40 8" style="width:13mm;height:2.6mm;overflow:visible">${inner}</svg>`;
  const l = (stroke: string, w: number, dash: string) =>
    swatch(`<line x1="1" y1="4" x2="39" y2="4" stroke="${stroke}" stroke-width="${w}" stroke-dasharray="${dash}"/>`);
  return `<div class="foldkey">
    <div>${swatch(`<line x1="1" y1="4" x2="39" y2="4" stroke="${INK}" stroke-width="2.4"/>`)}<span class="k">edge of the paper</span></div>
    <div>${l(HI, 2.4, '6 4')}<span class="k">fold here now</span></div>
    <div>${l(HI, 2.4, '7 3 1.5 3')}<span class="k">fold the other way</span></div>
    <div>${l(FAINT, 1.6, '4 3')}<span class="k">a crease you already made</span></div>
    <div>${l(AIR, 1.6, '4 3')}<span class="k">where the wings fold</span></div>
  </div>`;
}

export function runfootPlanes(kit: Squadron, right: string): string {
  return `<footer class="runfoot"><span>${kit.seriesName} &middot; ${kit.title}</span><span>${right}</span></footer>`;
}
