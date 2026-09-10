/** Flat-folding geometry.
 *
 *  Every fold diagram and every printed crease line in this product is
 *  computed here rather than drawn by hand, for one reason: a fold diagram
 *  that is nearly right is worse than none. A child who cannot make the model
 *  blames themselves, and a parent asks for a refund.
 *
 *  The sheet is a unit-width rectangle: x runs 0 → 1 across the paper and
 *  y runs 0 → `height` down it, so the same fold sequence describes the model
 *  on A4 and on US Letter and the diagrams are drawn at the proportions of the
 *  paper they will print on.
 *
 *  The model is a set of facets. Each facet carries the flat polygon it
 *  currently occupies and an affine map back to where it lies on the unfolded
 *  sheet. Folding splits facets along a line and reflects the moving side;
 *  composing the reflection into that map is what lets us print the crease
 *  pattern on the template and work out which part of the sheet ends up on the
 *  outside of the finished plane.
 */

export interface Pt { x: number; y: number }
export type Poly = Pt[];
export type Seg = [Pt, Pt];

/** x' = a·x + c·y + e ;  y' = b·x + d·y + f */
export interface Mat { a: number; b: number; c: number; d: number; e: number; f: number }

export const ID: Mat = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

const EPS = 1e-9;

export const pt = (x: number, y: number): Pt => ({ x, y });

/** Apply `m` to `p`. */
export function apply(m: Mat, p: Pt): Pt {
  return { x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f };
}

/** The map that applies `second` after `first`. */
export function compose(second: Mat, first: Mat): Mat {
  return {
    a: second.a * first.a + second.c * first.b,
    b: second.b * first.a + second.d * first.b,
    c: second.a * first.c + second.c * first.d,
    d: second.b * first.c + second.d * first.d,
    e: second.a * first.e + second.c * first.f + second.e,
    f: second.b * first.e + second.d * first.f + second.f,
  };
}

/** A line through `p` along the unit vector `d`. */
export interface Line { p: Pt; d: Pt }

export function lineThrough(a: Pt, b: Pt): Line {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  if (len < EPS) throw new Error('Degenerate line: the two points are the same');
  return { p: a, d: { x: (b.x - a.x) / len, y: (b.y - a.y) / len } };
}

/** The line through `hinge` that bisects the angle from `hinge`→`from` to
 *  `hinge`→`to`. Folding on it lays the first ray exactly onto the second,
 *  which is how almost every paper plane fold is actually described:
 *  "bring this edge onto that line". */
export function bisector(hinge: Pt, from: Pt, to: Pt): Line {
  const u = unit(from, hinge);
  const v = unit(to, hinge);
  const d = { x: u.x + v.x, y: u.y + v.y };
  const len = Math.hypot(d.x, d.y);
  if (len < EPS) throw new Error('Degenerate bisector: the two rays are opposite');
  return { p: hinge, d: { x: d.x / len, y: d.y / len } };
}

/** The perpendicular bisector of `a`→`b`. Folding on it lands `a` on `b`. */
export function perpBisector(a: Pt, b: Pt): Line {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  if (len < EPS) throw new Error('Degenerate perpendicular bisector: the two points are the same');
  return { p: mid, d: { x: -(b.y - a.y) / len, y: (b.x - a.x) / len } };
}

function unit(to: Pt, from: Pt): Pt {
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  return { x: (to.x - from.x) / len, y: (to.y - from.y) / len };
}

/** Positive on the left of the line's direction, negative on the right. */
export function side(l: Line, p: Pt): number {
  return l.d.x * (p.y - l.p.y) - l.d.y * (p.x - l.p.x);
}

export function reflectPt(l: Line, p: Pt): Pt {
  const vx = p.x - l.p.x;
  const vy = p.y - l.p.y;
  const along = vx * l.d.x + vy * l.d.y;
  const ax = along * l.d.x;
  const ay = along * l.d.y;
  return { x: l.p.x + 2 * ax - vx, y: l.p.y + 2 * ay - vy };
}

/** The affine map that reflects in `l`. */
export function reflectMat(l: Line): Mat {
  const { x: dx, y: dy } = l.d;
  const a = dx * dx - dy * dy;
  const b = 2 * dx * dy;
  // Reflection about the line through the origin, then translated to pass
  // through l.p.
  const e = l.p.x - (a * l.p.x + b * l.p.y);
  const f = l.p.y - (b * l.p.x - a * l.p.y);
  return { a, b, c: b, d: -a, e, f };
}

export function rotateMat(deg: number, about: Pt): Mat {
  const r = (deg * Math.PI) / 180;
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  return {
    a: cos, b: sin, c: -sin, d: cos,
    e: about.x - cos * about.x + sin * about.y,
    f: about.y - sin * about.x - cos * about.y,
  };
}

/** Mirror in the vertical line x = `x`. */
export function mirrorMat(x: number): Mat {
  return { a: -1, b: 0, c: 0, d: 1, e: 2 * x, f: 0 };
}

export const applyPoly = (m: Mat, poly: Poly): Poly => poly.map((p) => apply(m, p));
export const applySeg = (m: Mat, s: Seg): Seg => [apply(m, s[0]), apply(m, s[1])];

/** Sutherland–Hodgman: the part of `poly` on the `keep` side of `l`.
 *  `keep` is +1 for the left of the line's direction, −1 for the right. */
export function clip(poly: Poly, l: Line, keep: 1 | -1): Poly {
  const out: Poly = [];
  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const next = poly[(i + 1) % poly.length];
    const sc = side(l, cur) * keep;
    const sn = side(l, next) * keep;
    if (sc >= -EPS) out.push(cur);
    if ((sc > EPS && sn < -EPS) || (sc < -EPS && sn > EPS)) {
      const t = sc / (sc - sn);
      out.push({ x: cur.x + t * (next.x - cur.x), y: cur.y + t * (next.y - cur.y) });
    }
  }
  return dedupe(out);
}

function dedupe(poly: Poly): Poly {
  const out: Poly = [];
  for (const p of poly) {
    const last = out[out.length - 1];
    if (!last || Math.hypot(last.x - p.x, last.y - p.y) > 1e-7) out.push(p);
  }
  if (out.length > 1) {
    const first = out[0];
    const last = out[out.length - 1];
    if (Math.hypot(first.x - last.x, first.y - last.y) < 1e-7) out.pop();
  }
  return out;
}

export function area(poly: Poly): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a) / 2;
}

export function centroid(poly: Poly): Pt {
  let cx = 0, cy = 0, a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const cross = p.x * q.y - q.x * p.y;
    a += cross;
    cx += (p.x + q.x) * cross;
    cy += (p.y + q.y) * cross;
  }
  if (Math.abs(a) < EPS) {
    const n = poly.length || 1;
    return { x: poly.reduce((s, p) => s + p.x, 0) / n, y: poly.reduce((s, p) => s + p.y, 0) / n };
  }
  return { x: cx / (3 * a), y: cy / (3 * a) };
}

export function inside(poly: Poly, p: Pt, tol = 1e-6): boolean {
  let hits = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    // On an edge counts as inside.
    const cross = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len > EPS && Math.abs(cross) / len < tol) {
      const t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / (len * len);
      if (t >= -tol && t <= 1 + tol) return true;
    }
    if ((a.y > p.y) !== (b.y > p.y)) {
      const xAt = a.x + ((p.y - a.y) / (b.y - a.y)) * (b.x - a.x);
      if (xAt > p.x) hits++;
    }
  }
  return hits % 2 === 1;
}

/** Where `l` crosses `poly`, as a single segment. Empty if it misses. */
export function crossSegment(poly: Poly, l: Line): Seg | null {
  const left = clip(poly, l, 1);
  if (left.length < 2) return null;
  // The shared boundary of the two halves is the chord we want. Take the
  // extreme points of the left half that lie on the line.
  const on = left.filter((p) => Math.abs(side(l, p)) < 1e-7);
  if (on.length < 2) return null;
  let best: Seg = [on[0], on[1]];
  let bestLen = -1;
  for (let i = 0; i < on.length; i++) {
    for (let j = i + 1; j < on.length; j++) {
      const len = Math.hypot(on[i].x - on[j].x, on[i].y - on[j].y);
      if (len > bestLen) { bestLen = len; best = [on[i], on[j]]; }
    }
  }
  return bestLen > 1e-7 ? best : null;
}

/** The inverse of an affine map. Throws rather than return nonsense: every
 *  transform this engine makes is a reflection, rotation or mirror, all of
 *  which are invertible, so a singular one means a bug upstream. */
export function invertMat(m: Mat): Mat {
  const det = m.a * m.d - m.b * m.c;
  if (Math.abs(det) < 1e-12) throw new Error('Singular transform');
  return {
    a: m.d / det,
    b: -m.b / det,
    c: -m.c / det,
    d: m.a / det,
    e: (m.c * m.f - m.d * m.e) / det,
    f: (m.b * m.e - m.a * m.f) / det,
  };
}

export function bbox(polys: Poly[]): { x0: number; y0: number; x1: number; y1: number } {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const poly of polys) {
    for (const p of poly) {
      x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y);
      x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
    }
  }
  return { x0, y0, x1, y1 };
}
