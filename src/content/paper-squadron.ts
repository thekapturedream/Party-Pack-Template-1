/** The Paper Plane Template Pack — ten planes, each a traditional fold that is
 *  known to fly, described once and drawn for both paper sizes.
 *
 *  Two rules shaped the selection. First, ten planes that all fly the same way
 *  is one plane; each of these has a different job in the air, and the flight
 *  log is scored on those jobs. Second, nothing here is anybody's invention:
 *  every sequence is a traditional fold — the dart, the Nakamura lock, the
 *  nose-band glider, the concertina nose — of the kind taught in school
 *  playgrounds for decades. What this pack adds is the drawing, the printed
 *  crease pattern, the livery and the testing, not a claim on the folds.
 */
import type { Plane, Squadron, Step } from './plane-types.ts';

const p = (x: number, y: number) => ({ x, y });

/** The triangle a locked glider leaves showing.
 *
 *  Fold the point down so the tip lands at (0.5, 2c), then fold the two new
 *  corners in to the centre. The corner flaps meet the centre line exactly at
 *  the tip, and what is left showing below them is this triangle. Folding it
 *  back up is the lock. The numbers fall out of the geometry, so a change to
 *  the nose fold moves the lock with it. */
function lockTriangle(c: number) {
  const y = 1.5 * c;
  return { base: y, left: p((1 - c) / 2, y), right: p((1 + c) / 2, y), tip: p(0.5, 2 * c) };
}

/** Fold the sheet in half the long way and open it flat. Every plane starts
 *  here, because every later fold is measured against that crease. */
const centreCrease = (h: number): Step => ({
  move: { kind: 'crease', from: p(0.5, 0), to: p(0.5, h) },
  caption: 'Fold the sheet in half the long way, press it flat, then open it out again.',
  tip: 'Line the short edges up before you press, not after.',
});

/** Fold both top corners in so their edges meet on the centre crease. */
const cornersIn = (h: number, from = 0): Step => ({
  move: { kind: 'bisect', hinge: p(0.5, from), edge: p(0, from), onto: p(0.5, h) },
  both: true,
  caption: 'Fold both top corners in so their edges meet on the middle crease.',
  tip: 'Start at the point and work outwards.',
});

/** Fold the plane in half along the centre crease. */
const halve = (h: number, mountain: boolean): Step => ({
  move: { kind: 'point', from: p(0, h), onto: p(1, h) },
  halve: true,
  mountain,
  caption: mountain
    ? 'Turn the plane over and fold it in half, so your folds end up on the outside.'
    : 'Fold the whole plane in half along the middle crease, flaps inside.',
  tip: 'Hold the flaps down with a thumb as the sides come together.',
});

const noseLeft: Step = {
  move: { kind: 'turn', deg: -90 },
  caption: 'Turn it so the nose points left and the long folded edge is underneath. That edge is the body.',
};

const wings = (depth: number, noseDepth?: number): Step => ({
  move: { kind: 'wing', depth, noseDepth },
  caption: 'Fold one wing down to the body, then turn the plane over and fold the other to match.',
  tip: 'Both wings on the same line, or it turns.',
});

export const planes: Plane[] = [
  {
    id: 'sparrow',
    number: 1,
    name: 'Sparrow',
    serial: 'PS-01',
    tagline: 'Four folds. Start here.',
    flightNote: 'A slow, forgiving glide across a room. It is the plane to learn to throw with, '
      + 'because it does the same thing every time.',
    best: 'Accuracy',
    level: 1,
    speed: 2, glide: 3, stability: 5,
    launch: 'Hold it under the body, level with your shoulder, and push it forward gently. Do not throw it hard — '
      + 'the Sparrow flies furthest when it is pushed, not launched.',
    trim: 'Diving into the floor? Bend the back corner of each wing up by a few millimetres. Climbing then '
      + 'dropping? Bend them back down.',
    wing: { depth: 0.115, dihedral: 15 },
    steps: (h) => [centreCrease(h), cornersIn(h), halve(h, false), noseLeft, wings(0.115)],
    livery: { scheme: 'chevron', accent: 'hi', motto: 'First flight' },
  },
  {
    id: 'arrow',
    number: 2,
    name: 'Arrow',
    serial: 'PS-02',
    tagline: 'The classic dart. Fastest in the pack.',
    flightNote: 'Straight and quick, and it will not turn unless you make it. It trades hang time for speed, '
      + 'so it wins races and loses hang-time contests.',
    best: 'Speed',
    level: 1,
    speed: 5, glide: 2, stability: 4,
    launch: 'Pinch the body near the nose and throw it hard and flat, level with your eyes. '
      + 'Aim at a point on the far wall, not at the floor.',
    trim: 'Rolling to one side? One wing is folded lower than the other. Open both out and refold them together.',
    wing: { depth: 0.085, dihedral: 10 },
    steps: (h) => [
      centreCrease(h),
      cornersIn(h),
      {
        move: { kind: 'bisect', hinge: p(0.5, 0), edge: p(0, 0.5), onto: p(0.5, h) },
        both: true,
        caption: 'Fold both new slanted edges in to the crease. The nose gets long and sharp.',
        tip: 'These two folds are what make it fast.',
      },
      halve(h, false), noseLeft, wings(0.085),
    ],
    livery: { scheme: 'racing', accent: 'hi', motto: 'Fast and flat' },
  },
  {
    id: 'hawk',
    number: 3,
    name: 'Hawk',
    serial: 'PS-03',
    tagline: 'The locked glider. Stays up longest.',
    flightNote: 'The folded nose tucks under a locking triangle, so the Hawk holds its shape and glides '
      + 'instead of diving. Thrown gently and high, it is the one still in the air when the others have landed.',
    best: 'Hang time',
    level: 3,
    speed: 2, glide: 5, stability: 5,
    launch: 'Hold it under the body and let it go forward and slightly upward, at about walking pace. '
      + 'Thrown hard it climbs, stalls and drops.',
    trim: 'Stalling — rearing up and falling back? Bend the back corners of the wings down a little.',
    wing: { depth: 0.12, dihedral: 18 },
    steps: (h) => [
      centreCrease(h),
      cornersIn(h),
      {
        move: { kind: 'point', from: p(0.5, 0), onto: p(0.5, 0.78) },
        caption: 'Fold the point down so the tip lands on the crease, below the two flaps.',
        tip: 'The lower the tip, the heavier the nose.',
      },
      {
        move: { kind: 'bisect', hinge: p(0.5, 0.39), edge: p(0.11, 0.39), onto: p(0.5, h) },
        both: true,
        caption: 'Fold both top corners in again. A small triangle is left sticking out.',
        tip: 'Leave the triangle showing. It holds the plane together.',
      },
      {
        move: {
          kind: 'flap',
          from: lockTriangle(0.39).left,
          to: lockTriangle(0.39).right,
          region: [lockTriangle(0.39).left, lockTriangle(0.39).right, lockTriangle(0.39).tip],
        },
        caption: 'Fold that small triangle up over the two flaps. This is the lock.',
        tip: 'Now the flaps cannot come undone in the air.',
      },
      halve(h, true), noseLeft, wings(0.12),
    ],
    livery: { scheme: 'star', accent: 'air', motto: 'Stay up' },
  },
  {
    id: 'condor',
    number: 4,
    name: 'Condor',
    serial: 'PS-04',
    tagline: 'Wide wings, heavy nose, slow float.',
    flightNote: 'A thick folded band along the nose gives it weight at the front and a big wing behind, '
      + 'which is exactly what a glider wants. It crosses a room slowly and lands flat.',
    best: 'Hang time',
    level: 2,
    speed: 1, glide: 5, stability: 4,
    launch: 'Two fingers under the body, a gentle push forward, nose very slightly up. Let go, do not flick.',
    trim: 'Turning the same way every time? Bend the back corner of the wing it turns towards upward, a little.',
    wing: { depth: 0.055, dihedral: 20 },
    steps: (h) => [
      centreCrease(h),
      {
        move: { kind: 'point', from: p(0.5, 0), onto: p(0.5, 0.34) },
        caption: 'Fold the top edge down in a straight band, about a sixth of the way down.',
        tip: 'Same width all the way across, or it leans.',
      },
      cornersIn(h, 0.17),
      halve(h, false), noseLeft, wings(0.055),
    ],
    livery: { scheme: 'target', accent: 'air', motto: 'Slow and low' },
  },
  {
    id: 'delta',
    number: 5,
    name: 'Delta',
    serial: 'PS-05',
    tagline: 'Half the paper, twice the wing.',
    flightNote: 'Folding the sheet in half before you start makes a short, wide plane with a thick nose. '
      + 'Short and wide is stable, so this is the one that flies straight in a draughty room.',
    best: 'Stunts',
    level: 2,
    speed: 3, glide: 4, stability: 5,
    launch: 'Throw it firmly and level. Aimed upward at about forty-five degrees it will climb, turn over '
      + 'and come down flat, which is the easiest stunt in the pack.',
    trim: 'Bend both back wing corners up by the same amount to make it loop. Bend them down to stop it.',
    wing: { depth: 0.1, dihedral: 14 },
    steps: (h) => [
      centreCrease(h),
      {
        move: { kind: 'point', from: p(0.5, 0), onto: p(0.5, h) },
        caption: 'Fold the sheet in half the short way, top edge down to bottom edge.',
        tip: 'Treat the new folded edge as the top of the paper from now on.',
      },
      cornersIn(h, h / 2),
      {
        move: { kind: 'point', from: p(0.5, h / 2), onto: p(0.5, h / 2 + 0.34) },
        caption: 'Fold the sharp point back down on itself, so the nose is blunt and thick.',
        tip: 'A heavy nose is the point: weight at the front keeps it steady.',
      },
      halve(h, false), noseLeft, wings(0.1),
    ],
    livery: { scheme: 'delta', accent: 'hi', motto: 'Hold the line' },
  },
  {
    id: 'bulldog',
    number: 6,
    name: 'Bulldog',
    serial: 'PS-06',
    tagline: 'Blunt nose. Safe indoors.',
    flightNote: 'A dart with its sharp point folded away, so it can be thrown hard in a room full of people '
      + 'without anyone minding. It bounces off walls and keeps flying.',
    best: 'Speed',
    level: 2,
    speed: 4, glide: 3, stability: 4,
    launch: 'Throw it hard and flat. It is built to be thrown hard.',
    trim: 'Nose-diving? The blunt fold has come undone. Press it flat again and put a small piece of tape '
      + 'under the nose.',
    wing: { depth: 0.1, dihedral: 12 },
    steps: (h) => [
      centreCrease(h),
      cornersIn(h),
      {
        move: { kind: 'bisect', hinge: p(0.5, 0), edge: p(0, 0.5), onto: p(0.5, h) },
        both: true,
        caption: 'Fold both new slanted edges in to the middle crease, as though you were making a dart.',
      },
      {
        move: { kind: 'point', from: p(0.5, 0), onto: p(0.5, 0.4) },
        caption: 'Fold the sharp point back down on itself into a blunt nose.',
        tip: 'This is what makes it safe indoors. Do not skip it.',
      },
      halve(h, false), noseLeft, wings(0.1),
    ],
    livery: { scheme: 'hazard', accent: 'hi', motto: 'Hit and run' },
  },
  {
    id: 'hammer',
    number: 7,
    name: 'Hammer',
    serial: 'PS-07',
    tagline: 'Three folded noses. Built for distance.',
    flightNote: 'The nose is folded over three times, so almost all the weight is at the front and the wing '
      + 'is a long clean triangle behind it. That is the shape distance records are set with.',
    best: 'Distance',
    level: 4,
    speed: 4, glide: 4, stability: 3,
    launch: 'Arm back past your ear, throw hard and slightly upward. This is the one plane in the pack that '
      + 'rewards throwing as hard as you can.',
    trim: 'Veering off? Check the three nose folds stack squarely. One crooked fold sends it sideways.',
    wing: { depth: 0.075, dihedral: 10 },
    steps: (h) => [
      centreCrease(h),
      {
        move: { kind: 'point', from: p(0.5, 0), onto: p(0.5, 0.26) },
        caption: 'Fold the top edge down in a narrow straight band.',
        tip: 'Square it against the middle crease. Everything after depends on it.',
      },
      {
        move: { kind: 'point', from: p(0.5, 0.13), onto: p(0.5, 0.39) },
        caption: 'Fold the new top edge down again, the same width.',
      },
      {
        move: { kind: 'point', from: p(0.5, 0.26), onto: p(0.5, 0.52) },
        caption: 'And once more. The nose is six layers thick now.',
        tip: 'Run a thumbnail along each fold. Thick folds spring open.',
      },
      cornersIn(h, 0.39),
      halve(h, false), noseLeft, wings(0.075),
    ],
    livery: { scheme: 'bolt', accent: 'hi', motto: 'Send it' },
  },
  {
    id: 'boomerang',
    number: 8,
    name: 'Boomerang',
    serial: 'PS-08',
    tagline: 'Throw it away. It comes back.',
    flightNote: 'Swept wings, deep at the nose and shallow at the tail, make it turn all the way round. Thrown '
      + 'upward and to one side it curves out, comes about and lands near your feet.',
    best: 'Comeback',
    level: 3,
    speed: 3, glide: 4, stability: 3,
    launch: 'Stand in the middle of the room. Nose up at about forty-five degrees, tilt the whole plane over to '
      + 'the left, throw firmly. It curves right round.',
    trim: 'Not coming back? Bend the left wing\'s back corner up more, and throw more steeply.',
    wing: { depth: 0.05, noseDepth: 0.13, dihedral: 22 },
    steps: (h) => [
      centreCrease(h),
      {
        move: { kind: 'point', from: p(0.5, 0), onto: p(0.5, h * 0.42) },
        caption: 'Fold the top edge down a long way, about a fifth of the sheet.',
        tip: 'Much deeper than the other planes. That is what makes it short and wide.',
      },
      cornersIn(h, h * 0.21),
      {
        move: { kind: 'point', from: p(0.5, h * 0.21), onto: p(0.5, h * 0.42) },
        caption: 'Fold the point down over the flaps to hold them shut.',
        tip: 'Press hard. It is all that stops the nose opening in the turn.',
      },
      halve(h, false), noseLeft, wings(0.05, 0.13),
    ],
    livery: { scheme: 'tiger', accent: 'hi', motto: 'Round we go' },
  },
  {
    id: 'kestrel',
    number: 9,
    name: 'Kestrel',
    serial: 'PS-09',
    tagline: 'Locked nose, narrow wing. Flies where you point it.',
    flightNote: 'A locked nose like the Hawk, but folded narrower, so it holds a line instead of floating. '
      + 'This is the plane to throw through a hoop.',
    best: 'Accuracy',
    level: 4,
    speed: 4, glide: 4, stability: 5,
    launch: 'Sight along the body like an arrow, hold it near the nose, and throw smoothly at the target. '
      + 'Smooth beats hard for accuracy every time.',
    trim: 'Drifting left or right? Bend the back corner of the opposite wing up by a millimetre or two. '
      + 'Adjust one wing only, and adjust it a little.',
    wing: { depth: 0.09, dihedral: 14 },
    steps: (h) => [
      centreCrease(h),
      cornersIn(h),
      {
        move: { kind: 'point', from: p(0.5, 0), onto: p(0.5, 0.5) },
        caption: 'Fold the point down so the tip lands on the crease, level with the corners.',
      },
      {
        move: { kind: 'bisect', hinge: p(0.5, 0.25), edge: p(0.25, 0.25), onto: p(0.5, h) },
        both: true,
        caption: 'Fold both top corners in again, leaving the tip showing.',
      },
      {
        move: {
          kind: 'flap',
          from: lockTriangle(0.25).left,
          to: lockTriangle(0.25).right,
          region: [lockTriangle(0.25).left, lockTriangle(0.25).right, lockTriangle(0.25).tip],
        },
        caption: 'Fold the tip back up over the flaps. That is the lock.',
        tip: 'The Hawk\'s trick, folded tighter: faster and straighter.',
      },
      halve(h, true), noseLeft, wings(0.09),
    ],
    livery: { scheme: 'night', accent: 'air', motto: 'On the nose' },
  },
  {
    id: 'moth',
    number: 10,
    name: 'Moth',
    serial: 'PS-10',
    tagline: 'Almost all wing. Barely falls.',
    flightNote: 'Short body, enormous wing, thrown so gently it hardly counts as a throw. Indoors and still, '
      + 'the Moth takes longer to reach the floor than anything else in the pack.',
    best: 'Hang time',
    level: 2,
    speed: 1, glide: 5, stability: 3,
    launch: 'Hold it level above your head and let go. That is all. Any push at all and it tips over.',
    trim: 'Tipping over on release? Bend both back wing corners up very slightly, and open the wings out flatter.',
    wing: { depth: 0.055, dihedral: 24 },
    steps: (h) => [
      centreCrease(h),
      {
        move: { kind: 'point', from: p(0.5, 0), onto: p(0.5, h) },
        caption: 'Fold the sheet in half the short way, top edge down to bottom edge.',
      },
      {
        move: { kind: 'point', from: p(0.5, h / 2), onto: p(0.5, h / 2 + 0.24) },
        caption: 'Fold a band down along the new top edge to make a nose.',
        tip: 'Without this band the Moth has no nose weight and only tumbles.',
      },
      cornersIn(h, h / 2 + 0.12),
      halve(h, false), noseLeft, wings(0.055),
    ],
    livery: { scheme: 'checker', accent: 'ink', motto: 'Take your time' },
  },
];

export const paperSquadron: Squadron = {
  seriesName: 'Kapture Flight School',
  title: 'Paper Plane Template Pack',
  subtitle: 'Ten paper planes that fly, with the folds drawn out and the designs already printed',
  edition: 'First edition',
  ageRange: 'Ages 6–12',
  audience: 'One child and one roll of sticky tape, or a whole class',
  planes,
  publisher: 'The Kapture',
  publisherUrl: 'thekapture.com',
  version: '1.0',
};
