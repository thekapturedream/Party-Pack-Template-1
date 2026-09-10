/** Drawing the fold diagrams.
 *
 *  One line language, used everywhere, so a child learns it once:
 *
 *    thick solid    the edge of the paper
 *    thin solid     a folded edge — paper lying on paper
 *    grey dashed    a crease already made
 *    orange dashed  fold here, now, valley (the crease comes towards you)
 *    orange dash-dot fold here, now, mountain (the crease goes away from you)
 *    orange arrow   which way the paper moves
 *
 *  Colour only ever repeats what the line style already says, so the sheets
 *  survive a black-and-white printer, which is how most of them get printed.
 */
import type { Frame, Plane, Arrow } from './model.ts';
import { bbox, centroid, type Poly, type Pt, type Seg } from './geometry.ts';

const INK = '#14161a';
const FAINT = '#9aa0a8';
const HI = '#dd4c17';
const AIR = '#1d5c96';

const S = 100; // sheet width in SVG user units
const n = (v: number) => (Math.round(v * S * 100) / 100).toString();

const polyPath = (p: Poly) => p.map((q, i) => `${i ? 'L' : 'M'}${n(q.x)} ${n(q.y)}`).join(' ') + ' Z';

function line(s: Seg, stroke: string, width: number, dash?: string): string {
  return `<line x1="${n(s[0].x)}" y1="${n(s[0].y)}" x2="${n(s[1].x)}" y2="${n(s[1].y)}" stroke="${stroke}" `
    + `stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
}

/** Valley is dashed, mountain is dash-dot. The distinction matters: a mountain
 *  fold made as a valley gives a plane that will not close. */
const foldDash = (mountain: boolean) => (mountain ? '5 2.4 1.2 2.4' : '5 3');

/** The three points a curved arrow can reach outside the model: its ends and
 *  the peak of its curve. */
function arrowExtent(a: Arrow): Pt[] {
  const dx = a.to.x - a.from.x;
  const dy = a.to.y - a.from.y;
  const len = Math.hypot(dx, dy) || 1e-6;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = (a.from.x + a.to.x) / 2 + nx * a.bulge * len * 0.5;
  const cy = (a.from.y + a.to.y) / 2 + ny * a.bulge * len * 0.5;
  return [a.from, a.to, { x: (a.from.x + a.to.x) / 4 + cx / 2, y: (a.from.y + a.to.y) / 4 + cy / 2 }];
}

function arrowPath(a: Arrow, colour: string): string {
  const dx = a.to.x - a.from.x;
  const dy = a.to.y - a.from.y;
  const len = Math.hypot(dx, dy) || 1e-6;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = (a.from.x + a.to.x) / 2 + nx * a.bulge * len * 0.5;
  const cy = (a.from.y + a.to.y) / 2 + ny * a.bulge * len * 0.5;
  const head = (at: Pt, from: Pt) => {
    const hx = at.x - from.x;
    const hy = at.y - from.y;
    const hl = Math.hypot(hx, hy) || 1e-6;
    const ux = hx / hl;
    const uy = hy / hl;
    const size = 3.4 / S;
    const back = { x: at.x - ux * size, y: at.y - uy * size };
    const w = size * 0.46;
    return `<path d="M${n(at.x)} ${n(at.y)} L${n(back.x - uy * w)} ${n(back.y + ux * w)} `
      + `L${n(back.x + uy * w)} ${n(back.y - ux * w)} Z" fill="${colour}"/>`;
  };
  return `<path d="M${n(a.from.x)} ${n(a.from.y)} Q${n(cx)} ${n(cy)} ${n(a.to.x)} ${n(a.to.y)}" `
    + `fill="none" stroke="${colour}" stroke-width="1.1" stroke-linecap="round"/>`
    + head(a.to, { x: cx, y: cy })
    + (a.double ? head(a.from, { x: cx, y: cy }) : '');
}

/** A loop arrow beside the model, for "turn it over" and "turn it round". */
function gestureMark(box: { x0: number; y0: number; x1: number; y1: number }, kind: 'turnOver' | 'turn'): string {
  const cx = (box.x0 + box.x1) / 2;
  const y = box.y1 + (box.y1 - box.y0) * 0.09 + 0.03;
  const r = Math.max(0.06, (box.x1 - box.x0) * 0.16);
  if (kind === 'turnOver') {
    return `<path d="M${n(cx - r)} ${n(y)} A ${n(r)} ${n(r * 0.42)} 0 1 0 ${n(cx + r)} ${n(y)}" fill="none" `
      + `stroke="${HI}" stroke-width="1.1" stroke-linecap="round"/>`
      + arrowHeadAt({ x: cx + r, y }, { x: cx + r * 0.5, y: y - r * 0.35 }, HI);
  }
  return `<path d="M${n(cx - r)} ${n(y)} A ${n(r)} ${n(r)} 0 0 1 ${n(cx + r)} ${n(y)}" fill="none" `
    + `stroke="${HI}" stroke-width="1.1" stroke-linecap="round"/>`
    + arrowHeadAt({ x: cx + r, y }, { x: cx + r * 0.7, y: y - r * 0.5 }, HI);
}

function arrowHeadAt(at: Pt, from: Pt, colour: string): string {
  const hx = at.x - from.x;
  const hy = at.y - from.y;
  const hl = Math.hypot(hx, hy) || 1e-6;
  const ux = hx / hl;
  const uy = hy / hl;
  const size = 3.4 / S;
  const back = { x: at.x - ux * size, y: at.y - uy * size };
  const w = size * 0.46;
  return `<path d="M${n(at.x)} ${n(at.y)} L${n(back.x - uy * w)} ${n(back.y + ux * w)} `
    + `L${n(back.x + uy * w)} ${n(back.y - ux * w)} Z" fill="${colour}"/>`;
}

export interface StepArt { svg: string; step: number }

/** One step of a fold sequence: the model as it is now, and the fold to make.
 *  Every step of one plane is drawn at the same scale, so the model visibly
 *  shrinks as it is folded — which is the single strongest cue that you are on
 *  the right step. */
export function stepSvg(frame: Frame, extent: number, pad = 0.14): string {
  // Arrows and gesture marks live outside the paper, so the frame has to be
  // sized to the whole drawing, not just the model.
  const marks: Poly = [];
  for (const a of frame.fold?.arrows ?? []) marks.push(...arrowExtent(a));
  const box = bbox([frame.outline]);
  if (frame.gesture) {
    const r = Math.max(0.06, (box.x1 - box.x0) * 0.16);
    const y = box.y1 + (box.y1 - box.y0) * 0.09 + 0.03;
    marks.push({ x: (box.x0 + box.x1) / 2 - r, y }, { x: (box.x0 + box.x1) / 2 + r, y: y + r * 0.5 });
  }
  const all = bbox(marks.length ? [frame.outline, marks] : [frame.outline]);
  const cx = (all.x0 + all.x1) / 2;
  const cy = (all.y0 + all.y1) / 2;
  const half = Math.max(extent * (1 + pad), all.x1 - all.x0, all.y1 - all.y0) / 2;
  const view = { x0: cx - half, y0: cy - half, w: half * 2, h: half * 2 };

  const parts: string[] = [];
  parts.push(`<path d="${polyPath(frame.outline)}" fill="#ffffff" stroke="none"/>`);
  for (const c of frame.creases) parts.push(line(c, FAINT, 0.45, '3 2.4'));
  for (const e of frame.edges) parts.push(line(e, INK, 0.5));
  parts.push(`<path d="${polyPath(frame.outline)}" fill="none" stroke="${INK}" stroke-width="1.15" stroke-linejoin="round"/>`);

  if (frame.fold) {
    for (const s of frame.fold.segs) {
      parts.push(line(s, HI, 1.1, foldDash(frame.fold.mountain)));
    }
    for (const a of frame.fold.arrows) parts.push(arrowPath(a, HI));
  }
  if (frame.gesture) parts.push(gestureMark(box, frame.gesture));

  return `<svg viewBox="${n(view.x0)} ${n(view.y0)} ${n(view.w)} ${n(view.h)}" `
    + `role="img" aria-label="Step ${frame.index + 1}: ${escapeAttr(frame.step.caption)}">${parts.join('')}</svg>`;
}

/** The finished plane: plan view from above, and the head-on view that shows
 *  the wing angle. The plan is the side view mirrored about the spine, so it is
 *  the real outline of the plane rather than an artist's impression. */
export function finishedSvg(plane: Plane, depth: number, noseDepth: number, dihedralDeg = 14): string {
  const side = plane.sideView;
  const box = bbox([side]);
  const spineY = box.y1;

  // The plan is the side view mirrored in the spine, so it is the real outline
  // of the finished plane rather than an artist's impression of one. Only the
  // chain above the spine gets mirrored: taking the whole closed polygon would
  // trace a figure of eight.
  const upper = chainAboveSpine(side, spineY);
  const plan = [...upper, ...[...upper].reverse().slice(1, -1).map((p) => ({ x: p.x, y: 2 * spineY - p.y }))];
  const planBox = bbox([plan]);
  const planW = planBox.x1 - planBox.x0;

  const wingLines: Seg[] = [
    [{ x: box.x0, y: spineY - noseDepth }, { x: box.x1, y: spineY - depth }],
    [{ x: box.x0, y: spineY + noseDepth }, { x: box.x1, y: spineY + depth }],
  ];

  // Head-on view, at the same scale, clear of the plan.
  const g = plane.wingGeometry(depth, noseDepth);
  const a = (dihedralDeg * Math.PI) / 180;
  const tipX = g.span * Math.cos(a);
  const tipY = g.span * Math.sin(a);
  const gap = planW * 0.12;
  const fx = planBox.x1 + gap + tipX;
  const fy = (planBox.y0 + planBox.y1) / 2;
  const front =
    `<line x1="${n(fx)}" y1="${n(fy)}" x2="${n(fx)}" y2="${n(fy + g.body)}" stroke="${INK}" stroke-width="1.15" stroke-linecap="round"/>`
    + `<line x1="${n(fx)}" y1="${n(fy)}" x2="${n(fx - tipX)}" y2="${n(fy - tipY)}" stroke="${INK}" stroke-width="1.15" stroke-linecap="round"/>`
    + `<line x1="${n(fx)}" y1="${n(fy)}" x2="${n(fx + tipX)}" y2="${n(fy - tipY)}" stroke="${INK}" stroke-width="1.15" stroke-linecap="round"/>`;

  const capH = 5.2 / S;
  const view = {
    x0: planBox.x0 - gap * 0.5,
    y0: Math.min(planBox.y0, fy - tipY) - gap * 0.5,
    w: (fx + tipX + gap * 0.5) - (planBox.x0 - gap * 0.5),
    h: Math.max(planBox.y1, fy + g.body) - Math.min(planBox.y0, fy - tipY) + gap * 0.5 + capH,
  };

  const label = (x: number, t: string) =>
    `<text x="${n(x)}" y="${n(view.y0 + view.h - 0.6 / S)}" text-anchor="middle" `
    + `font-family="Barlow Condensed, sans-serif" font-size="3.6" letter-spacing="0.6" fill="${FAINT}">${t}</text>`;

  return `<svg viewBox="${n(view.x0)} ${n(view.y0)} ${n(view.w)} ${n(view.h)}" role="img" aria-label="The finished plane, seen from above and head on">
    <path d="${polyPath(plan)}" fill="#ffffff" stroke="${INK}" stroke-width="1.15" stroke-linejoin="round"/>
    ${wingLines.map((l) => line(l, INK, 0.5)).join('')}
    ${front}
    ${label((planBox.x0 + planBox.x1) / 2, 'From above')}
    ${label(fx, 'Head on')}
  </svg>`;
}

/** The crease pattern, in flat-sheet coordinates, for printing on a template.
 *  Faint enough to disappear once the plane is folded, dark enough to line a
 *  fold up against. */
export function creaseLines(plane: Plane, opts: { colour?: string; width?: number } = {}): string {
  const colour = opts.colour ?? FAINT;
  const width = opts.width ?? 0.42;
  return printableCreases(plane)
    .map((c) => line(c.seg, c.wing ? AIR : colour, width, c.mountain ? '4 2 1 2' : '4 2.6'))
    .join('');
}

/** The creases worth printing: the ones pressed into paper that is still flat
 *  and facing the folder, mirrored so both halves of the symmetrical sheet
 *  carry the same guides. */
export function printableCreases(plane: Plane): Plane['pattern'] {
  const flat = dedupePattern(plane.pattern.filter((c) => c.depth === 0));
  const both = flat.flatMap((c) => [c, {
    ...c,
    seg: [{ x: 1 - c.seg[0].x, y: c.seg[0].y }, { x: 1 - c.seg[1].x, y: c.seg[1].y }] as Seg,
  }]);
  return dedupePattern(both);
}

/** The same crease pattern, with the step number printed at one end of each
 *  distinct crease, so the template and the fold sheet refer to each other. */
export function creaseNumbers(plane: Plane): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of printableCreases(plane)) {
    const key = keyOf(c.seg);
    if (seen.has(key)) continue;
    seen.add(key);
    const mid = { x: (c.seg[0].x + c.seg[1].x) / 2, y: (c.seg[0].y + c.seg[1].y) / 2 };
    out.push(`<text x="${n(mid.x)}" y="${n(mid.y)}" font-family="Barlow Condensed, sans-serif" font-size="3" `
      + `fill="${FAINT}" text-anchor="middle" dy="-1">${c.step}</text>`);
  }
  return out.join('');
}

export function dedupePattern(pattern: Plane['pattern']): Plane['pattern'] {
  const seen = new Map<string, (typeof pattern)[number]>();
  for (const c of pattern) {
    const key = keyOf(c.seg);
    const prev = seen.get(key);
    if (!prev || c.step < prev.step) seen.set(key, c);
  }
  return [...seen.values()].sort((a, b) => a.step - b.step);
}

function keyOf(s: Seg): string {
  const r = (v: number) => Math.round(v * 400) / 400;
  const a = `${r(s[0].x)},${r(s[0].y)}`;
  const b = `${r(s[1].x)},${r(s[1].y)}`;
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** Walks the side view from one end of the spine, over the top, to the other,
 *  so the result is an open chain that can be mirrored into a plan. */
function chainAboveSpine(poly: Poly, spineY: number): Poly {
  const onSpine = (p: Pt) => Math.abs(p.y - spineY) < 1e-6;
  const start = poly.findIndex((p, i) => onSpine(p) && !onSpine(poly[(i + 1) % poly.length]));
  if (start < 0) return poly;
  const out: Poly = [poly[start]];
  for (let k = 1; k <= poly.length; k++) {
    const p = poly[(start + k) % poly.length];
    out.push(p);
    if (onSpine(p)) break;
  }
  return out;
}

export function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export { INK, FAINT, HI, AIR, S, n, polyPath, line as svgLine };
