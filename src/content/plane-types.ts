/** Shared shapes for a pack of paper planes. One pack = one Squadron object. */
import type { Step } from '../render/fold/model.ts';

export type { Step };

/** 1 is "a six-year-old can do it alone", 5 is "sit down with a grown-up". */
export type Level = 1 | 2 | 3 | 4 | 5;
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Livery {
  /** Which of the drawn schemes this plane wears. */
  scheme: 'chevron' | 'checker' | 'bolt' | 'star' | 'racing' | 'tiger' | 'hazard' | 'target' | 'delta' | 'night';
  /** The one accent the scheme is allowed. Everything else is ink on paper. */
  accent: 'hi' | 'air' | 'ink';
  /** Two or three words printed large along the plane, in the squadron's hand. */
  motto: string;
}

export interface Plane {
  /** Stable id: filenames, the flight log, the challenge cards. */
  id: string;
  /** Position in the pack, 1-based. Doubles as the template sheet number. */
  number: number;
  /** THE ARROW. Set in caps by the layout, not by the content. */
  name: string;
  /** Stencilled on the fin and used in the log: PS-01 … PS-10. */
  serial: string;
  /** Six words on what makes this one different. */
  tagline: string;
  /** What it does in the air, in a sentence a child reads out. */
  flightNote: string;
  /** The record this plane is the one to beat at. */
  best: 'Distance' | 'Hang time' | 'Accuracy' | 'Speed' | 'Stunts' | 'Comeback';
  level: Level;
  speed: Rating;
  glide: Rating;
  stability: Rating;
  /** How to launch it. This matters more than the folding and is where most
   *  disappointment comes from. */
  launch: string;
  /** What to bend when it misbehaves. */
  trim: string;
  /** The wing fold, as a fraction of the paper's width above the spine, and the
   *  angle to open the wings to. */
  wing: { depth: number; noseDepth?: number; dihedral: number };
  /** The fold sequence, given the paper's height as a multiple of its width.
   *  A4 and US Letter are different shapes, so the same plane has slightly
   *  different creases on each and both are drawn from this one description. */
  steps: (h: number) => Step[];
  livery: Livery;
}

export interface Squadron {
  seriesName: string;
  title: string;
  subtitle: string;
  edition: string;
  ageRange: string;
  /** Who it is really for, in the words the shop listing uses. */
  audience: string;
  planes: Plane[];
  publisher: string;
  publisherUrl: string;
  version: string;
}

/** Print side up or down? Derived, never stored: a plane whose "fold it in
 *  half" step is a mountain fold ends up showing the face that started
 *  upwards, and a valley fold shows the face that started down. Getting this
 *  wrong hides the livery inside the plane, so it is computed from the folds
 *  rather than typed in twice. */
export function printSideUp(plane: Plane): boolean {
  const halve = plane.steps(A4).find((s) => s.halve);
  if (!halve) throw new Error(`${plane.name}: no step is marked as the fold in half`);
  return halve.mountain === true;
}

/** The step number of "fold it in half", 1-based, for cross-references. */
export function halveStepNumber(plane: Plane): number {
  return plane.steps(A4).findIndex((s) => s.halve) + 1;
}

/** A4's height as a multiple of its width. Only used to ask questions about a
 *  fold sequence that do not depend on the paper, such as which way the plane
 *  is folded in half. */
const A4 = 297 / 210;
