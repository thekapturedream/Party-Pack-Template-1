/** Shared shapes for a party pack. One kit = one Kit object. */

export interface Hint {
  /** Ascending nudge strength: 1 is a gentle poke, 3 all but gives it away. */
  level: 1 | 2 | 3;
  text: string;
}

export interface Puzzle {
  /** Stable id used in filenames, hint cards and the answer key. */
  id: string;
  /** Position in play order, 1-based. */
  number: number;
  title: string;
  /** Eyebrow above the title: what the evidence physically is. */
  kind: string;
  /** One line the host can read aloud to set the scene. */
  intro: string;
  /** What the players are being asked to work out. */
  task: string;
  /** Answer, upper case, no spaces. */
  answer: string;
  /** 1-based index of the letter this puzzle contributes to the final word. */
  keyLetterIndex: number;
  /** Minutes a typical team of 9–12 year olds needs. */
  minutes: number;
  /** What the answer key tells the host, step by step. */
  solution: string[];
  hints: Hint[];
  /** Rendered inside the puzzle sheet: the in-world evidence. */
  evidence: string;
}

export interface Kit {
  seriesName: string;
  title: string;
  subtitle: string;
  edition: string;
  ageRange: string;
  players: string;
  prepMinutes: number;
  playMinutes: string;
  finalWord: string;
  /** Where the host hides the finale, phrased for the host guide. */
  finalePlace: string;
  briefing: string[];
  puzzles: Puzzle[];
  publisher: string;
  publisherUrl: string;
  version: string;
}
