/** The printed side of a template sheet.
 *
 *  Two decisions do most of the work here.
 *
 *  The livery is clipped to the part of the sheet that ends up on the outside
 *  of the finished plane. The fold engine already knows which part that is, so
 *  nothing is printed where it will be folded away. That halves the ink a
 *  template costs and it is why the designs still read once the plane is made
 *  — a full-bleed pattern comes out as a jumble of fragments.
 *
 *  And nothing is dark-filled. Real aircraft are mostly white with hard marks
 *  on them, which is lucky, because a home printer asked to lay down a page of
 *  solid colour produces a damp, curled sheet that will not fly.
 */
import type { Livery, Plane as PlaneSpec } from '../content/plane-types.ts';
import type { Plane } from './fold/model.ts';
import { creaseLines, HI, AIR, INK, FAINT, n, S } from './fold/draw.ts';
import { bbox, inside, type Poly } from './fold/geometry.ts';

const accentOf = (l: Livery) => (l.accent === 'hi' ? HI : l.accent === 'air' ? AIR : INK);

/** Marks are drawn once and mirrored, so both wings match. A wing that reads
 *  differently from its partner looks like a mistake rather than a design. */
function mirrored(inner: string): string {
  return `${inner}<g transform="translate(${n(1)} 0) scale(-1 1)">${inner}</g>`;
}

interface Zone { x0: number; y0: number; x1: number; y1: number }

/** The panel a wing marking gets: the largest clear rectangle that is
 *  outboard of the fuselage fold, inside the part of the sheet that survives
 *  to the outside of the finished plane, and clear of the paper's edge where a
 *  home printer will not print.
 *
 *  It is searched for rather than assumed, because the surviving area is a
 *  different shape on every plane in the pack — the Delta keeps a triangle in
 *  the bottom half of the sheet, the Sparrow keeps almost everything. Using a
 *  bounding box instead put half of the Hawk's roundel on paper that folds
 *  away. */
function wingPanel(model: Plane, depth: number, h: number): Zone {
  const zone: Poly[] = model.artZone.length
    ? model.artZone
    : [[{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: h }, { x: 0, y: h }]];
  const box = bbox(zone);
  const edge = 0.045;                      // printer margin, plus a little
  const xMin = 0.5 + depth + 0.025;        // outboard of the fuselage fold
  const xMax = Math.min(box.x1, 1 - edge);
  const yMin = Math.max(box.y0, 0) + edge;
  const yMax = Math.min(box.y1, h) - edge;

  const ROWS = 72;
  const COLS = 44;
  const rows: { y: number; x0: number; x1: number }[] = [];
  for (let i = 0; i <= ROWS; i++) {
    const y = yMin + ((yMax - yMin) * i) / ROWS;
    let lo = Infinity;
    let hi = -Infinity;
    for (let j = 0; j <= COLS; j++) {
      const x = xMin + ((xMax - xMin) * j) / COLS;
      if (zone.some((poly) => inside(poly, { x, y }))) {
        lo = Math.min(lo, x);
        hi = Math.max(hi, x);
      }
    }
    rows.push({ y, x0: lo, x1: hi });
  }

  let best: Zone = { x0: xMin, y0: yMin, x1: xMax, y1: yMax };
  let bestArea = 0;
  for (let i = 0; i < rows.length; i++) {
    if (!Number.isFinite(rows[i].x0)) continue;
    let lo = rows[i].x0;
    let hi = rows[i].x1;
    for (let j = i + 1; j < rows.length; j++) {
      if (!Number.isFinite(rows[j].x0)) break;
      lo = Math.max(lo, rows[j].x0);
      hi = Math.min(hi, rows[j].x1);
      const w = hi - lo;
      const tall = rows[j].y - rows[i].y;
      if (w <= 0.04 || tall <= 0.08) continue;
      const area = w * tall;
      if (area > bestArea) {
        bestArea = area;
        best = { x0: lo, y0: rows[i].y, x1: hi, y1: rows[j].y };
      }
    }
  }
  return best;
}

/** How big the plane's name can be set inside a panel, and how much of the
 *  panel's length that name then eats. Short wide planes like the Delta get a
 *  small name and a big mark; long thin ones get the opposite. Deciding this
 *  from the panel rather than fixing a split is what stops the Delta's badge
 *  coming out four millimetres across. */
const ADVANCE = 0.78;  // Archivo Black is wide; measured, not guessed at
const TAIL = 0.13;      // share of the panel the tail band takes

function nameSize(spec: PlaneSpec, z: Zone): { size: number; run: number } {
  const w = z.x1 - z.x0;
  const hh = z.y1 - z.y0;
  const maxRun = hh * 0.32;
  const size = Math.max(2.8, Math.min(w * S * 0.26, (maxRun * S) / (spec.name.length * ADVANCE), 6.8));
  return { size, run: (spec.name.length * ADVANCE * size) / S };
}

/** The panel from nose to tail: the mark, then the name, then a tail band. */
function markZone(spec: PlaneSpec, z: Zone): Zone {
  const hh = z.y1 - z.y0;
  const { run } = nameSize(spec, z);
  return { ...z, y1: z.y1 - run - hh * (TAIL + 0.07) };
}

/** A solid band at the tail with the plane's number reversed out of it. It is
 *  the only reversed element in the pack, it is small, and it earns its ink:
 *  it is how a room full of children tell whose plane is whose. */
function tailBand(spec: PlaneSpec, z: Zone, flip: boolean): string {
  const w = z.x1 - z.x0;
  const hh = z.y1 - z.y0;
  const bh = Math.min(hh * TAIL, w * 0.44);
  const y = z.y1 - bh;
  const cx = z.x0 + w * 0.43;
  const cy = y + bh * 0.5;
  const size = bh * S * 0.66;
  const numeral = `<text x="${n(cx)}" y="${n(cy)}" text-anchor="middle" dominant-baseline="central"
      font-family="Archivo Black, sans-serif" font-size="${size.toFixed(2)}" fill="#ffffff">${spec.number}</text>`;
  return `<rect x="${n(z.x0)}" y="${n(y)}" width="${n(w * 0.86)}" height="${n(bh)}" fill="${INK}"/>`
    + (flip
      ? `<g transform="translate(${n(cx)} 0) scale(-1 1) translate(${n(-cx)} 0)">${numeral}</g>`
      : numeral);
}

/** Repeated marks are laid out along whichever way the panel is longer, so a
 *  short wide wing gets them side by side and a long thin one gets them in a
 *  column. */
function along(z: Zone, count: number): { cx: number; cy: number; cell: number }[] {
  const w = z.x1 - z.x0;
  const hh = z.y1 - z.y0;
  const horizontal = w > hh;
  const cell = Math.min(horizontal ? w / count : w, horizontal ? hh : hh / count);
  return Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    return horizontal
      ? { cx: z.x0 + w * t, cy: z.y0 + hh / 2, cell }
      : { cx: z.x0 + w / 2, cy: z.y0 + hh * t, cell };
  });
}

const SCHEMES: Record<Livery['scheme'], (z: Zone, a: string) => string> = {
  /** Three swept chevrons, pointing the way the plane goes. */
  chevron: (z, a) => along(z, 3).map((c, i) => {
    const half = c.cell * 0.46;
    const rise = c.cell * 0.34;
    return `<path d="M${n(c.cx - half)} ${n(c.cy + rise / 2)} L${n(c.cx)} ${n(c.cy - rise / 2)} `
      + `L${n(c.cx + half)} ${n(c.cy + rise / 2)}" fill="none" stroke="${i === 1 ? a : INK}" `
      + `stroke-width="${n(c.cell * 0.19)}" stroke-linejoin="miter"/>`;
  }).join(''),

  /** Two stripes down the length: the plainest livery there is, and the one
   *  that survives being folded better than any pattern. */
  racing: (z, a) => {
    const w = z.x1 - z.x0;
    const hh = z.y1 - z.y0;
    return `<rect x="${n(z.x0 + w * 0.14)}" y="${n(z.y0)}" width="${n(w * 0.3)}" height="${n(hh)}" fill="${a}"/>`
      + `<rect x="${n(z.x0 + w * 0.54)}" y="${n(z.y0)}" width="${n(w * 0.13)}" height="${n(hh)}" fill="${INK}"/>`;
  },

  /** A star roundel, the oldest wing marking there is. */
  star: (z, a) => {
    const cx = (z.x0 + z.x1) / 2;
    const r = Math.min((z.x1 - z.x0) * 0.46, (z.y1 - z.y0) * 0.46);
    const cy = z.y0 + r * 1.06;
    const pts: string[] = [];
    for (let i = 0; i < 10; i++) {
      const ang = (Math.PI / 5) * i - Math.PI / 2;
      const rr = i % 2 === 0 ? r * 0.62 : r * 0.25;
      pts.push(`${n(cx + rr * Math.cos(ang))} ${n(cy + rr * Math.sin(ang))}`);
    }
    return `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.95)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`
      + `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.78)}" fill="none" stroke="${a}" stroke-width="3.2"/>`
      + `<polygon points="${pts.join(' ')}" fill="${a}"/>`;
  },

  /** Concentric rings: outline only, so it costs almost nothing to print. */
  target: (z, a) => {
    const cx = (z.x0 + z.x1) / 2;
    const r = Math.min((z.x1 - z.x0) * 0.46, (z.y1 - z.y0) * 0.46);
    const cy = z.y0 + r * 1.06;
    return [0.95, 0.68, 0.41].map((t, i) =>
      `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * t)}" fill="none" stroke="${i === 1 ? a : INK}" stroke-width="${i === 1 ? 3.4 : 1.8}"/>`)
      .join('') + `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r * 0.14)}" fill="${a}"/>`;
  },

  /** Stepped triangles, echoing the shape of the plane they are printed on. */
  delta: (z, a) => along(z, 3).map((c, i) => {
    const size = c.cell * (0.88 - i * 0.16);
    const x = c.cx - size / 2;
    const y = c.cy - size / 2;
    return `<polygon points="${n(x)} ${n(y + size)} ${n(x + size)} ${n(y + size)} ${n(x)} ${n(y)}" `
      + `fill="${i === 0 ? a : 'none'}" stroke="${INK}" stroke-width="1.6"/>`;
  }).join(''),

  /** Hazard stripes across a band: the marking that says "this end first". */
  hazard: (z, a) => {
    const w = z.x1 - z.x0;
    const bandH = (z.y1 - z.y0) * 0.42;
    const id = `hz${Math.round(z.x0 * 1000)}${Math.round(z.y0 * 1000)}`;
    const step = Math.max(w * 0.24, 0.028);
    const stripes = Array.from({ length: 14 }, (_, i) => {
      const x = z.x0 - bandH + i * step * 2;
      return `<path d="M${n(x)} ${n(z.y0 + bandH)} L${n(x + bandH)} ${n(z.y0)} `
        + `L${n(x + bandH + step)} ${n(z.y0)} L${n(x + step)} ${n(z.y0 + bandH)} Z" fill="${a}"/>`;
    }).join('');
    return `<clipPath id="${id}"><rect x="${n(z.x0)}" y="${n(z.y0)}" width="${n(w)}" height="${n(bandH)}"/></clipPath>`
      + `<g clip-path="url(#${id})">${stripes}</g>`
      + `<rect x="${n(z.x0)}" y="${n(z.y0)}" width="${n(w)}" height="${n(bandH)}" fill="none" stroke="${INK}" stroke-width="1.6"/>`;
  },

  /** A bolt down the wing. Nothing subtle, and the seven-year-olds are right. */
  bolt: (z, a) => {
    const w = z.x1 - z.x0;
    const hh = (z.y1 - z.y0) * 0.94;
    const x = z.x0 + w * 0.04;
    const y = z.y0;
    const d = `M${n(x + w * 0.62)} ${n(y)} L${n(x)} ${n(y + hh * 0.54)} `
      + `L${n(x + w * 0.4)} ${n(y + hh * 0.54)} L${n(x + w * 0.1)} ${n(y + hh)} `
      + `L${n(x + w * 0.92)} ${n(y + hh * 0.38)} L${n(x + w * 0.46)} ${n(y + hh * 0.38)} Z`;
    return `<path d="${d}" fill="${a}" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/>`;
  },

  /** Claw marks, raked back along the wing. */
  tiger: (z, a) => {
    const w = z.x1 - z.x0;
    const hh = z.y1 - z.y0;
    return Array.from({ length: 5 }, (_, i) => {
      const y = z.y0 + hh * (0.08 + i * 0.2);
      const len = w * (0.95 - Math.abs(i - 2) * 0.16);
      return `<path d="M${n(z.x0 + w * 0.03)} ${n(y)} Q${n(z.x0 + len * 0.6)} ${n(y + hh * 0.03)} `
        + `${n(z.x0 + len)} ${n(y + hh * 0.09)}" fill="none" stroke="${i % 2 ? a : INK}" `
        + `stroke-width="${n(Math.min(w * 0.13, hh * 0.05))}" stroke-linecap="round"/>`;
    }).join('');
  },

  /** A spearhead pointing the way the plane goes: the restrained one, and the
   *  only mark in the pack that is mostly outline. */
  night: (z, a) => {
    const w = z.x1 - z.x0;
    const hh = z.y1 - z.y0;
    const size = Math.min(w * 0.92, hh * 0.92);
    const cx = (z.x0 + z.x1) / 2;
    const cy = (z.y0 + z.y1) / 2;
    const head = (t: number, fill: string) =>
      `<polygon points="${n(cx)} ${n(cy - size * 0.5 * t)} ${n(cx + size * 0.42 * t)} ${n(cy + size * 0.5 * t)} `
      + `${n(cx)} ${n(cy + size * 0.24 * t)} ${n(cx - size * 0.42 * t)} ${n(cy + size * 0.5 * t)}" `
      + `fill="${fill}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>`;
    return head(1, 'none') + head(0.5, a);
  },

  /** A checkerboard band, half of it left as paper. */
  checker: (z, a) => {
    const w = z.x1 - z.x0;
    const hh = z.y1 - z.y0;
    const cols = w >= hh ? 5 : 3;
    const cell = w / cols;
    const rows = Math.max(2, Math.min(6, Math.round(hh / cell)));
    const out: string[] = [];
    const y0 = z.y0 + (hh - rows * cell) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if ((r + c) % 2) continue;
        out.push(`<rect x="${n(z.x0 + c * cell)}" y="${n(y0 + r * cell)}" width="${n(cell)}" height="${n(cell)}" fill="${a}"/>`);
      }
    }
    out.push(`<rect x="${n(z.x0)}" y="${n(y0)}" width="${n(cell * cols)}" height="${n(cell * rows)}" `
      + `fill="none" stroke="${INK}" stroke-width="1.5"/>`);
    return out.join('');
  },
};

/** Name, serial and motto, set along the wing so they read nose to tail once
 *  the plane is folded. The right-hand wing is flipped, because the two wings
 *  are mirror images of one another and unflipped text would print upside down
 *  on one of them. */
function wingText(spec: PlaneSpec, z: Zone): string {
  const w = z.x1 - z.x0;
  const { size } = nameSize(spec, z);
  const x = (z.x0 + z.x1) / 2 - w * 0.12;
  const y = markZone(spec, z).y1 + (z.y1 - z.y0) * 0.04;
  const g = (flip: boolean) => `<g transform="translate(${n(x)} ${n(y)}) rotate(90)${flip ? ' scale(1 -1)' : ''}">
      <text x="0" y="0" font-family="Archivo Black, sans-serif" font-size="${size.toFixed(2)}"
        letter-spacing="${(size * 0.05).toFixed(2)}" fill="${INK}">${spec.name.toUpperCase()}</text>
      <text x="0" y="${(size * 0.9).toFixed(2)}" font-family="Share Tech Mono, monospace"
        font-size="${(size * 0.38).toFixed(2)}" letter-spacing="${(size * 0.1).toFixed(2)}"
        fill="${FAINT}">${spec.serial} &#183; ${spec.best.toUpperCase()}</text>
    </g>`;
  return `${g(false)}<g transform="translate(${n(1)} 0) scale(-1 1)">${g(true)}</g>`;
}

/** The whole printed face of one template sheet. */
export function liveryArt(spec: PlaneSpec, model: Plane, h: number): string {
  const z = wingPanel(model, spec.wing.depth, h);
  const accent = accentOf(spec.livery);
  const id = `art${spec.id}`;
  const zone: Poly[] = model.artZone;
  const clip = zone.map((poly) => `<polygon points="${poly.map((p) => `${n(p.x)} ${n(p.y)}`).join(' ')}"/>`).join('');

  return `<clipPath id="${id}">${clip}</clipPath>
    <g clip-path="url(#${id})">
      ${mirrored(SCHEMES[spec.livery.scheme](markZone(spec, z), accent))}
      ${tailBand(spec, z, false)}
      <g transform="translate(${n(1)} 0) scale(-1 1)">${tailBand(spec, z, true)}</g>
      ${wingText(spec, z)}
    </g>`;
}

/** A whole template sheet: livery, crease pattern, and the small print that
 *  tells you which way up to start. */
export function templateSvg(spec: PlaneSpec, model: Plane, h: number, faceUp: boolean): string {
  return `<svg viewBox="0 0 ${n(1)} ${n(h)}" preserveAspectRatio="none" role="img"
    aria-label="${spec.name} template: the livery and the fold lines, printed on the sheet you fold">
    ${liveryArt(spec, model, h)}
    ${creaseLines(model)}
    ${cornerTicks(h)}
    ${faceLabel(spec, h, faceUp)}
  </svg>`;
}

/** Right-angle ticks just inside the corners. They are the only reliable way a
 *  buyer can tell whether their printer scaled the page: if the ticks are not
 *  the same distance from all four edges, the print is not at 100%. */
function cornerTicks(h: number): string {
  const m = 0.028;
  const len = 0.03;
  const corner = (x: number, y: number, sx: number, sy: number) =>
    `<path d="M${n(x + sx * len)} ${n(y)} L${n(x)} ${n(y)} L${n(x)} ${n(y + sy * len)}" `
    + `fill="none" stroke="${FAINT}" stroke-width="0.7"/>`;
  return corner(m, m, 1, 1) + corner(1 - m, m, -1, 1) + corner(m, h - m, 1, -1) + corner(1 - m, h - m, -1, -1);
}

function faceLabel(spec: PlaneSpec, h: number, faceUp: boolean): string {
  const t = faceUp
    ? 'Start with this side FACING YOU'
    : 'Start with this side FACE DOWN on the table';
  return `<text x="${n(0.5)}" y="${n(h - 0.018)}" text-anchor="middle" font-family="Barlow Condensed, sans-serif"
    font-size="3" letter-spacing="0.9" fill="${FAINT}">${spec.serial} &#183; ${spec.name.toUpperCase()} &#183; ${t}</text>`;
}
