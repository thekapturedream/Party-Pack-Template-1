/** The fold sequence: a small vocabulary for describing a paper plane the way
 *  a person describes one, and the machine that turns it into geometry.
 *
 *  A plane is a list of Steps. Each step names a fold in the terms the caption
 *  will use — "bring this edge onto that line", "land this corner on that one"
 *  — and the model works out the crease, the resulting shape, and where that
 *  crease lies on the unfolded sheet.
 */
import {
  type Pt, type Poly, type Seg, type Mat, type Line,
  ID, apply, applyPoly, area, bisector, bbox, centroid, clip, compose, crossSegment,
  inside, invertMat, lineThrough, mirrorMat, perpBisector, pt, reflectMat, reflectPt, rotateMat, side,
} from './geometry.ts';

export type Move =
  /** Fold and unfold, leaving a crease to line things up against. */
  | { kind: 'crease'; from: Pt; to: Pt }
  /** Fold so the edge running `hinge`→`edge` lies along `hinge`→`onto`. */
  | { kind: 'bisect'; hinge: Pt; edge: Pt; onto: Pt }
  /** Fold so the point `from` lands on the point `onto`. */
  | { kind: 'point'; from: Pt; onto: Pt }
  /** Fold on the stated crease; the side containing `moving` is what moves. */
  | { kind: 'line'; from: Pt; to: Pt; moving: Pt }
  /** Fold up one loose flap lying on top of the model, leaving everything
   *  under it alone — the locking tuck that holds a glider's nose shut. The
   *  silhouette does not change, so this only adds a folded edge. */
  | { kind: 'flap'; from: Pt; to: Pt; region: Poly }
  /** Fold the wings down. The crease runs parallel to the spine — the folded
   *  edge the plane is held by — `depth` above it, tapering from `noseDepth` at
   *  the nose if the two differ. The model stops being flat here, so this
   *  records the crease and leaves the shape alone; the finished plane is drawn
   *  from the side view and this crease. */
  | { kind: 'wing'; depth: number; noseDepth?: number }
  | { kind: 'turnOver' }
  | { kind: 'turn'; deg: number };

export interface Step {
  move: Move;
  /** The instruction, in the words a child reads. */
  caption: string;
  /** The one thing that goes wrong on this step, if anything does. */
  tip?: string;
  /** Draw the crease as a mountain (dash-dot) rather than a valley (dashed). */
  mountain?: boolean;
  /** Do the same fold again, mirrored across the centre line, in this one step.
   *  "Fold both top corners in" is one instruction and two folds. */
  both?: boolean;
  /** Marks "now fold the whole plane in half". Everything printed on the sheet
   *  outside the fold lines up to this point ends up on the outside of the
   *  finished plane, which is where the livery has to go. */
  halve?: boolean;
}

interface Facet {
  poly: Poly;
  /** Maps this facet's current position back to the flat sheet. */
  toSheet: Mat;
  /** How many times this facet has been folded. Zero means it has never moved,
   *  so it is still showing the face it started on. */
  moves: number;
}

export interface CreaseMark {
  seg: Seg;
  /** 1-based step that makes this crease. */
  step: number;
  mountain: boolean;
  /** A wing crease is folded last, after the plane is already three-dimensional. */
  wing: boolean;
  /** How many times the paper this crease is pressed into had already been
   *  folded. Zero means the crease falls on paper that is still lying flat and
   *  facing you, which is the only kind worth printing on a template: the rest
   *  are underneath, and printing them turns the sheet into a cobweb. */
  depth: number;
}

/** One drawable state of the model. */
export interface Frame {
  outline: Poly;
  /** Folded paper edges you can see: the boundaries of layers lying on top. */
  edges: Seg[];
  /** Creases made and unfolded, drawn faint. */
  creases: Seg[];
  /** The fold this frame is asking you to make, if any. A both-sides step
   *  carries two creases. */
  fold?: { segs: Seg[]; mountain: boolean; arrows: Arrow[]; wing: boolean };
  /** Set on a turn-over or turn frame instead of `fold`. */
  gesture?: 'turnOver' | 'turn';
  step: Step;
  index: number;
}

export interface Arrow { from: Pt; to: Pt; bulge: number; double: boolean }

export class Plane {
  readonly height: number;
  private outline: Poly;
  private facets: Facet[];
  private edges: Seg[] = [];
  private creases: Seg[] = [];

  readonly frames: Frame[] = [];
  readonly pattern: CreaseMark[] = [];
  /** Regions of the flat sheet that end up on the outside of the finished
   *  plane. Populated at the "fold it in half" step. */
  artZone: Poly[] = [];

  constructor(height: number, steps: Step[]) {
    this.height = height;
    const sheet: Poly = [pt(0, 0), pt(1, 0), pt(1, height), pt(0, height)];
    this.outline = sheet;
    this.facets = [{ poly: sheet, toSheet: ID, moves: 0 }];
    steps.forEach((step, i) => this.run(step, i));
    if (this.artZone.length === 0) this.artZone = this.unmovedInSheetCoords();
  }

  /** The finished plane seen from the side: the last flat state. */
  get sideView(): Poly { return this.outline; }

  /** The facets that never moved, in the finished model's own coordinates,
   *  each with the map back to where it lies on the flat sheet. These are the
   *  outside of the finished plane, so pulling the livery through the inverse
   *  of that map draws the plane as it will actually look. */
  get outerFacets(): { poly: Poly; fromSheet: Mat }[] {
    return this.facets
      .filter((f) => f.moves === 0)
      .map((f) => ({ poly: f.poly, fromSheet: invertMat(f.toSheet) }));
  }

  private run(step: Step, index: number) {
    const before: Frame = {
      outline: this.outline,
      edges: [...this.edges],
      creases: [...this.creases],
      step,
      index,
    };

    const m = step.move;
    if (m.kind === 'turnOver' || m.kind === 'turn') {
      before.gesture = m.kind;
      this.frames.push(before);
      const c = centroid(this.outline);
      const mat = m.kind === 'turnOver' ? mirrorMat(c.x) : rotateMat(m.deg, c);
      this.transform(mat);
      return;
    }

    if (m.kind === 'flap') {
      const line = lineThrough(m.from, m.to);
      const away: 1 | -1 = side(line, centroid(m.region)) > 0 ? -1 : 1;
      const moving = clip(m.region, line, away === 1 ? -1 : 1);
      const folded = moving.map((q) => reflectPt(line, q));
      before.fold = {
        segs: [crossSegment(m.region, line) ?? [m.from, m.to]],
        mountain: step.mountain === true,
        arrows: [{ from: centroid(moving), to: centroid(folded), bulge: 0.5, double: false }],
        wing: false,
      };
      this.frames.push(before);
      this.recordWithin(line, m.region, index + 1, step.mountain === true, false);
      this.edges = [...this.edges, ...boundarySegs(folded, line)];
      return;
    }

    const lines = this.linesFor(m, step.both === true);
    const arrows: Arrow[] = [];
    const segs: Seg[] = [];

    for (const { line, moving } of lines) {
      const chord = crossSegment(this.outline, line);
      if (!chord) throw new Error(`Step ${index + 1} "${step.caption}": the crease misses the paper`);
      segs.push(chord);
      this.record(line, index + 1, step.mountain === true, m.kind === 'wing');
      if (m.kind === 'crease') {
        arrows.push(this.creaseArrow(line, chord));
      } else if (m.kind === 'wing') {
        arrows.push(this.wingArrow(line, chord));
      } else {
        arrows.push(this.foldArrow(line, moving!));
      }
    }

    before.fold = { segs, mountain: step.mountain === true, arrows, wing: m.kind === 'wing' };
    this.frames.push(before);

    if (step.halve) this.artZone = this.unmovedInSheetCoords();
    if (m.kind === 'crease' || m.kind === 'wing') return;
    for (const { line, moving } of lines) this.applyFold(line, moving!, index + 1, step.caption);
  }

  /** Turns a move into the crease line (or two, for a both-sides step) and a
   *  point on the side of the paper that moves. */
  private linesFor(m: Move, both: boolean): { line: Line; moving: Pt }[] {
    const one = (): { line: Line; moving: Pt } => {
      switch (m.kind) {
        case 'crease': return { line: lineThrough(m.from, m.to), moving: m.from };
        case 'wing': return { line: this.wingLine(m.depth, m.noseDepth ?? m.depth), moving: pt(0, 0) };
        case 'bisect': return { line: bisector(m.hinge, m.edge, m.onto), moving: m.edge };
        case 'point': return { line: perpBisector(m.from, m.onto), moving: m.from };
        case 'line': return { line: lineThrough(m.from, m.to), moving: m.moving };
        case 'flap': throw new Error('A flap fold is handled before this point');
        default: throw new Error('unreachable');
      }
    };
    const first = one();
    if (!both) return [first];
    const mir = mirrorMat(0.5);
    const a = apply(mir, first.line.p);
    const b = apply(mir, { x: first.line.p.x + first.line.d.x, y: first.line.p.y + first.line.d.y });
    return [first, { line: lineThrough(a, b), moving: apply(mir, first.moving) }];
  }

  private applyFold(line: Line, moving: Pt, stepNo: number, caption: string) {
    const movingSide: 1 | -1 = side(line, moving) > 0 ? 1 : -1;
    const keepSide: 1 | -1 = movingSide === 1 ? -1 : 1;

    const kept = clip(this.outline, line, keepSide);
    const movedRegion = clip(this.outline, line, movingSide);
    const reflected = movedRegion.map((p) => reflectPt(line, p));

    // The whole product depends on the diagrams being right, so refuse to draw
    // a fold that does not lie flat rather than draw it wrong. A flap that
    // lands outside the paper under it needs a different instruction.
    for (const p of reflected) {
      if (!inside(kept, p, 2e-3)) {
        throw new Error(
          `Step ${stepNo} "${caption}": the flap does not land on the paper ` +
          `(${p.x.toFixed(3)}, ${p.y.toFixed(3)}). Use a 'wing' move if it is meant to stand up.`);
      }
    }

    const mat = reflectMat(line);
    const next: Facet[] = [];
    for (const f of this.facets) {
      const stay = clip(f.poly, line, keepSide);
      if (area(stay) > 1e-7) next.push({ poly: stay, toSheet: f.toSheet, moves: f.moves });
      const move = clip(f.poly, line, movingSide);
      if (area(move) > 1e-7) {
        next.push({
          poly: applyPoly(mat, move),
          toSheet: compose(f.toSheet, mat),
          moves: f.moves + 1,
        });
      }
    }
    this.facets = next;
    this.outline = kept;
    this.edges = [
      ...splitSegs(this.edges, line, movingSide, mat),
      ...boundarySegs(reflected, line),
    ];
    this.creases = splitSegs(this.creases, line, movingSide, mat);
    if (area(movedRegion) < 1e-7) throw new Error(`Step ${stepNo} "${caption}": nothing moves`);
  }

  /** Adds the crease to the pattern printed on the template, in sheet coords. */
  private record(line: Line, step: number, mountain: boolean, wing: boolean) {
    for (const f of this.facets) {
      const chord = crossSegment(f.poly, line);
      if (!chord) continue;
      this.pattern.push({
        seg: [apply(f.toSheet, chord[0]), apply(f.toSheet, chord[1])],
        step,
        mountain,
        wing,
        depth: f.moves,
      });
    }
  }

  /** As `record`, but only where the crease actually runs through the flap. */
  private recordWithin(line: Line, region: Poly, step: number, mountain: boolean, wing: boolean) {
    const chord = crossSegment(region, line);
    if (!chord) return;
    for (const f of this.facets) {
      const within = crossSegment(f.poly, line);
      if (!within) continue;
      const lo = Math.min(chord[0].x, chord[1].x) - 1e-6;
      const hi = Math.max(chord[0].x, chord[1].x) + 1e-6;
      const a = { x: Math.min(Math.max(within[0].x, lo), hi), y: within[0].y };
      const b = { x: Math.min(Math.max(within[1].x, lo), hi), y: within[1].y };
      if (Math.hypot(a.x - b.x, a.y - b.y) < 1e-6) continue;
      this.pattern.push({
        seg: [apply(f.toSheet, a), apply(f.toSheet, b)],
        step, mountain, wing, depth: f.moves,
      });
    }
  }

  private unmovedInSheetCoords(): Poly[] {
    return this.facets.filter((f) => f.moves === 0).map((f) => applyPoly(f.toSheet, f.poly));
  }

  private transform(mat: Mat) {
    this.outline = applyPoly(mat, this.outline);
    this.edges = this.edges.map((s) => [apply(mat, s[0]), apply(mat, s[1])] as Seg);
    this.creases = this.creases.map((s) => [apply(mat, s[0]), apply(mat, s[1])] as Seg);
    this.facets = this.facets.map((f) => ({
      poly: applyPoly(mat, f.poly),
      toSheet: compose(f.toSheet, invertMat(mat)),
      moves: f.moves,
    }));
  }

  private foldArrow(line: Line, moving: Pt): Arrow {
    const movingSide: 1 | -1 = side(line, moving) > 0 ? 1 : -1;
    const region = clip(this.outline, line, movingSide);
    // Start from the point that travels furthest, so the arrow reads as motion
    // rather than as a decoration in the middle of the shape.
    let best = 0;
    for (const p of region) best = Math.max(best, Math.abs(side(line, p)));
    // Several corners can travel the same distance — a folded band moves both
    // its ends equally. Starting the arrow from the middle of them puts it on
    // the part of the paper that is actually being picked up.
    const far = region.filter((p) => Math.abs(side(line, p)) > best - 1e-6);
    const from = {
      x: far.reduce((t, p) => t + p.x, 0) / far.length,
      y: far.reduce((t, p) => t + p.y, 0) / far.length,
    };
    const to = reflectPt(line, from);
    // A both-sides step draws two arrows. Bowing each one away from the middle
    // of the paper makes the pair mirror each other, which is what tells a
    // child at a glance that it is one instruction done twice.
    const c = centroid(this.outline);
    const away = (b: number) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const len = Math.hypot(dx, dy) || 1e-6;
      const cx = (from.x + to.x) / 2 - (dy / len) * b * len * 0.5;
      const cy = (from.y + to.y) / 2 + (dx / len) * b * len * 0.5;
      return Math.hypot(cx - c.x, cy - c.y);
    };
    return { from, to, bulge: away(0.5) >= away(-0.5) ? 0.5 : -0.5, double: false };
  }

  private creaseArrow(line: Line, chord: Seg): Arrow {
    const mid = { x: (chord[0].x + chord[1].x) / 2, y: (chord[0].y + chord[1].y) / 2 };
    const n = { x: -line.d.y, y: line.d.x };
    const r = Math.max(0.07, Math.hypot(chord[1].x - chord[0].x, chord[1].y - chord[0].y) * 0.22);
    return {
      from: { x: mid.x + n.x * r, y: mid.y + n.y * r },
      to: { x: mid.x - n.x * r, y: mid.y - n.y * r },
      bulge: 0.5,
      double: true,
    };
  }

  /** The wing crease, in the current side view: parallel to the spine — the
   *  lowest edge, which is the folded edge the plane hangs from — and `depth`
   *  above it. Authoring it this way means a fold sheet can say "about two
   *  centimetres up from the bottom fold" and mean exactly that. */
  private wingLine(depth: number, noseDepth: number): Line {
    const b = bbox([this.outline]);
    return lineThrough(pt(b.x0 - 0.02, b.y1 - noseDepth), pt(b.x1 + 0.02, b.y1 - depth));
  }

  /** The spine of the finished plane and how deep the body is, for the front
   *  view. Only meaningful once the plane has been folded in half and turned. */
  wingGeometry(depth: number, noseDepth: number): { body: number; span: number; length: number } {
    const b = bbox([this.outline]);
    return { body: (depth + noseDepth) / 2, span: b.y1 - b.y0 - (depth + noseDepth) / 2, length: b.x1 - b.x0 };
  }

  private wingArrow(line: Line, chord: Seg): Arrow {
    const mid = { x: (chord[0].x + chord[1].x) / 2, y: (chord[0].y + chord[1].y) / 2 };
    const n = { x: -line.d.y, y: line.d.x };
    // Point the arrow away from the body of the plane.
    const c = centroid(this.outline);
    const away = (c.x - mid.x) * n.x + (c.y - mid.y) * n.y > 0 ? -1 : 1;
    const r = 0.16;
    return {
      from: { x: mid.x + n.x * r * away * 0.15, y: mid.y + n.y * r * away * 0.15 },
      to: { x: mid.x + n.x * r * away, y: mid.y + n.y * r * away },
      bulge: 0.35,
      double: false,
    };
  }

  /** The union bounding box of every frame, so all the steps of one plane are
   *  drawn at the same scale and the model visibly shrinks as it is folded. */
  get extent(): number {
    const boxes = this.frames.map((f) => bbox([f.outline]));
    const w = Math.max(...boxes.map((b) => b.x1 - b.x0));
    const h = Math.max(...boxes.map((b) => b.y1 - b.y0));
    return Math.max(w, h);
  }
}

/** Splits every segment at the fold line and reflects the part that moves. */
function splitSegs(segs: Seg[], line: Line, movingSide: 1 | -1, mat: Mat): Seg[] {
  const out: Seg[] = [];
  for (const [a, b] of segs) {
    const sa = side(line, a) * movingSide;
    const sb = side(line, b) * movingSide;
    if (sa >= 0 && sb >= 0) { out.push([apply(mat, a), apply(mat, b)]); continue; }
    if (sa <= 0 && sb <= 0) { out.push([a, b]); continue; }
    const t = sa / (sa - sb);
    const cut = { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
    const movingFirst = sa > 0;
    out.push(movingFirst ? [apply(mat, a), apply(mat, cut)] : [a, cut]);
    out.push(movingFirst ? [cut, b] : [apply(mat, cut), apply(mat, b)]);
  }
  return out;
}

/** The edges of a folded flap, minus the crease it turns on — that one is
 *  already part of the silhouette. */
function boundarySegs(poly: Poly, line: Line): Seg[] {
  const out: Seg[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const onLine = Math.abs(side(line, a)) < 1e-6 && Math.abs(side(line, b)) < 1e-6;
    if (!onLine) out.push([a, b]);
  }
  return out;
}
