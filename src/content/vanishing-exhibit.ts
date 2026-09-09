import type { Kit } from './types.ts';
import { clockFace, floorPlan, decoderStrip } from '../render/figures.ts';

/**
 * The Vanishing Exhibit — the first kit in the Marlow Museum Mysteries series.
 *
 * Design rules the puzzles obey, in play order:
 *   1. every answer is a single word a child can spell;
 *   2. each puzzle uses a different kind of thinking (elimination, space,
 *      code, time, arithmetic, perception) so no one child dominates;
 *   3. two puzzles cross-reference earlier sheets, which rewards keeping the
 *      papers laid out rather than binning them;
 *   4. puzzles 4 and 5 are self-checking — two independent routes reach the
 *      same number, so a team knows it is right without asking the host.
 * The six key letters spell MIRROR, and the finale is hidden at a mirror.
 */
export const vanishingExhibit: Kit = {
  seriesName: 'Marlow Museum Mysteries',
  title: 'The Vanishing Exhibit',
  subtitle: 'A printable escape room for one birthday afternoon',
  edition: 'Playtest edition',
  ageRange: 'Ages 9–12',
  players: '3–12 players',
  prepMinutes: 15,
  playMinutes: '45–60 minutes',
  finalWord: 'MIRROR',
  finalePlace: 'taped to the back of a mirror, or tucked behind one',
  publisher: 'Kapture',
  publisherUrl: 'thekapture.com',
  version: '1.0',

  briefing: [
    'The Marlow Museum opens its new gallery at ten o’clock tomorrow morning. The centrepiece is the Clockwork Cartographer, a brass automaton that draws a map of any room it is placed in.',
    'Last night it vanished from Case 12.',
    'Nothing was forced. Nothing else was taken. The only people in the building were four members of staff, and every one of them says they saw nothing.',
    'You are the museum’s Junior Curators. You have until ten o’clock to find the Cartographer, and you have six pieces of evidence to work with.',
  ],

  puzzles: [
    {
      id: 'night-log',
      kind: 'Sign-in record',
      number: 1,
      title: 'The Night Log',
      intro: 'Every person who enters the museum after six o’clock signs the night log. Here is last night’s page.',
      task: 'Only one member of staff could have been in the Clock Gallery when the Cartographer vanished. Who?',
      answer: 'MIRA',
      keyLetterIndex: 1,
      minutes: 6,
      evidence: `
        <div class="doc">
          <div class="doc__head"><span>Marlow Museum &mdash; Night Log</span><span>Page 41</span></div>
          <table class="ledger">
            <thead>
              <tr><th>Name</th><th>Role</th><th>Signed in</th><th>Signed out</th><th>Pass</th></tr>
            </thead>
            <tbody>
              <tr><td>Ines Bell</td><td>Archivist</td><td class="num">18:10</td><td class="num">21:20</td><td>Level 2</td></tr>
              <tr><td>Theo Grant</td><td>Night guard</td><td class="num">20:00</td><td class="num">23:00</td><td>Level 1</td></tr>
              <tr><td>Mira Kell</td><td>Conservator</td><td class="num">19:45</td><td class="num">22:10</td><td>Level 2</td></tr>
              <tr><td>Dev Anand</td><td>Volunteer</td><td class="num">21:00</td><td class="num">21:25</td><td>Level 2</td></tr>
            </tbody>
          </table>
        </div>
        <div class="panel panel--tint" style="margin-top:var(--space-3)">
          <div class="panel__title">Attached: security note</div>
          <ul class="bullets small">
            <li>The Cartographer was seen in Case 12 at <strong>21:30</strong> and was gone by <strong>21:45</strong>.</li>
            <li>The Clock Gallery can only be reached by the East Stair.</li>
            <li>The East Stair door opens for a <strong>Level 2</strong> pass only.</li>
          </ul>
        </div>`,
      solution: [
        'The thief had to be inside the whole time from 21:30 to 21:45.',
        'Ines Bell signed out at 21:20 and Dev Anand at 21:25, so both had already left.',
        'Theo Grant was there, but a Level 1 pass will not open the East Stair.',
        'Mira Kell was inside from 19:45 to 22:10 and holds a Level 2 pass. Answer: MIRA.',
      ],
      hints: [
        { level: 1, text: 'Start with the clock, not the people. Which of them were still in the building at 21:45?' },
        { level: 2, text: 'Two of them had already signed out. Cross those two off. Now look at the pass column.' },
        { level: 3, text: 'Only one person was both inside at 21:45 and holding a Level 2 pass. Write their first name.' },
      ],
    },

    {
      id: 'floor-plan',
      kind: 'Floor plan and note',
      number: 2,
      title: 'The Locker Note',
      intro: 'Mira Kell’s locker was empty except for a folded note and a museum floor plan.',
      task: 'Follow Mira’s route on the plan. Which room does it end in?',
      answer: 'LIBRARY',
      keyLetterIndex: 2,
      minutes: 7,
      evidence: `
        <div class="cols cols--aside">
          <div>${floorPlan()}</div>
          <div class="stack-2">
            <div class="panel panel--tint">
              <div class="panel__title">Found in the locker</div>
              <p class="hand" style="margin:0">I moved it. I had to.<br/>Walk it yourself and you will
              understand.</p>
            </div>
            <div class="panel">
              <div class="panel__title">The route</div>
              <p class="small" style="margin-bottom:var(--space-2)"><strong>Start in the Entrance, facing north.</strong></p>
              <ol class="steps small">
                <li>Walk forward one room.</li>
                <li>Turn right.</li>
                <li>Walk forward one room.</li>
                <li>Turn left.</li>
                <li>Walk forward one room.</li>
                <li>Turn left.</li>
                <li>Walk forward two rooms. Stop.</li>
              </ol>
            </div>
          </div>
        </div>`,
      solution: [
        'Entrance, facing north. Forward one room lands in the Atrium.',
        'Turn right (now facing east), forward one room: Portrait Hall.',
        'Turn left (facing north), forward one room: Fossil Hall.',
        'Turn left (facing west), forward two rooms: Clock Gallery, then the Library. Answer: LIBRARY.',
      ],
      hints: [
        { level: 1, text: 'Put a finger on the Entrance and keep it on the plan. Turning left or right turns you, it does not move you.' },
        { level: 2, text: 'After step three you should be standing in the Portrait Hall. Check that before you carry on.' },
        { level: 3, text: 'The last instruction crosses the top of the plan from right to left and passes through the Clock Gallery.' },
      ],
    },

    {
      id: 'cipher',
      kind: 'Coded card',
      number: 3,
      title: 'The Curator’s Cipher',
      intro: 'The Library desk holds a locked catalogue drawer and a card written in the museum’s old shelving code.',
      task: 'Decode the card using the catalogue key. Write down the last word of the message.',
      answer: 'DRAWER',
      keyLetterIndex: 2,
      minutes: 8,
      evidence: `
        <div class="stack-2">
          <div class="doc center">
            <div class="doc__head"><span>Shelving card</span><span>Marlow Library</span></div>
            <p style="font-size:15pt;letter-spacing:0.18em;margin:var(--space-2) 0;font-weight:700">YMJ&nbsp;PJD&nbsp;NX&nbsp;NS&nbsp;YMJ&nbsp;YTU&nbsp;IWFBJW</p>
          </div>
          ${decoderStrip()}
        </div>`,
      solution: [
        'The key shifts every letter five places forward, so reading it back means going five places the other way.',
        'YMJ PJD NX NS YMJ YTU IWFBJW decodes to THE KEY IS IN THE TOP DRAWER.',
        'Answer: DRAWER.',
      ],
      hints: [
        { level: 1, text: 'The two rows of the key line up. Find each coded letter in the bottom row and read straight up.' },
        { level: 2, text: 'The first word is three letters and it is the commonest word in English. That tells you the key is working.' },
        { level: 3, text: 'The message is THE KEY IS IN THE TOP ______. You only need the last word.' },
      ],
    },

    {
      id: 'stopped-clock',
      kind: 'Security photograph',
      number: 4,
      title: 'The Stopped Clock',
      intro: 'The top drawer holds a key and a photograph of the Clock Gallery, taken by the security camera at the true moment the Cartographer vanished.',
      task: 'The Star clock stopped exactly half an hour before the true time in the photograph. Fill in the missing word.',
      answer: 'QUARTER',
      keyLetterIndex: 4,
      minutes: 7,
      evidence: `
        <div class="cols cols--3" style="align-items:start">
          <div class="center stack-2">
            ${clockFace(10, 25)}
            <div><div class="label">The Tower clock</div><p class="small" style="margin:0">Runs 40 minutes fast</p></div>
          </div>
          <div class="center stack-2">
            ${clockFace(9, 20)}
            <div><div class="label">The Brass clock</div><p class="small" style="margin:0">Runs 25 minutes slow</p></div>
          </div>
          <div class="center stack-2">
            ${clockFace(null, null)}
            <div><div class="label">The Star clock</div><p class="small" style="margin:0">Stopped. Hands removed as evidence.</p></div>
          </div>
        </div>
        <div class="panel panel--tint" style="margin-top:var(--space-3)">
          <p class="small" style="margin:0">Both working clocks were photographed at the same instant, and it was evening.
          Work out the <strong>true</strong> time first. Then take away half an hour.</p>
          <p style="margin:var(--space-2) 0 0;font-size:var(--size-h3);font-weight:700">The Star clock stopped at ____________ past nine.</p>
        </div>`,
      solution: [
        'The Tower clock reads 10:25 in the evening and runs 40 minutes fast, so the true time is 21:45.',
        'The Brass clock reads 9:20 and runs 25 minutes slow, so the true time is 21:45 as well. The two clocks agree, which is how the team knows it is right.',
        'Half an hour before 21:45 is 21:15, which is quarter past nine. Answer: QUARTER.',
      ],
      hints: [
        { level: 1, text: 'A clock that is fast shows a later time than it really is. So take the extra minutes off.' },
        { level: 2, text: 'Work out the true time from the Tower clock, then check it against the Brass clock. They should give you the same answer.' },
        { level: 3, text: 'The true time is 21:45. Half an hour earlier is 21:15. How do you say 21:15 out loud?' },
      ],
    },

    {
      id: 'ledger',
      kind: 'Ledger page',
      number: 5,
      title: 'The Acquisitions Ledger',
      intro: 'The key opens the ledger cupboard. One page lists everything the museum has ever bought, and Mira has pencilled a sum in the margin.',
      task: 'Work out the catalogue number, then find the object it belongs to.',
      answer: 'COMPASS',
      keyLetterIndex: 2,
      minutes: 6,
      evidence: `
        <div class="cols cols--aside">
          <div class="doc">
            <div class="doc__head"><span>Acquisitions ledger</span><span>Marlow Museum</span></div>
            <table class="ledger">
              <thead><tr><th>Cat. no.</th><th>Object</th><th>Acquired</th></tr></thead>
              <tbody>
                <tr><td class="num">112</td><td>Brass Sextant</td><td class="num">1901</td></tr>
                <tr><td class="num">208</td><td>Ship&rsquo;s Lantern</td><td class="num">1888</td></tr>
                <tr><td class="num">314</td><td>Compass Rose</td><td class="num">1894</td></tr>
                <tr><td class="num">407</td><td>Ivory Rule</td><td class="num">1912</td></tr>
                <tr><td class="num">512</td><td>Star Chart</td><td class="num">1877</td></tr>
              </tbody>
            </table>
          </div>
          <div class="panel panel--brass">
            <div class="panel__title">Pencilled in the margin</div>
            <p class="hand" style="margin:0 0 var(--space-2)">Where I put it, the Cartographer has company.</p>
            <hr class="rule" style="margin-bottom:var(--space-2)"/>
            <p class="small" style="margin-bottom:var(--space-2)"><strong>A</strong> = how many rooms are on the museum floor plan</p>
            <p class="small" style="margin-bottom:var(--space-2)"><strong>B</strong> = how many names are in the night log</p>
            <p class="small" style="margin:0"><strong>Catalogue number = (A &times; 30) + (B &times; 11)</strong></p>
          </div>
        </div>`,
      solution: [
        'The floor plan from puzzle 2 has 9 rooms. The night log from puzzle 1 has 4 names.',
        '(9 × 30) + (4 × 11) = 270 + 44 = 314.',
        'Catalogue number 314 is the Compass Rose. Answer: COMPASS.',
      ],
      hints: [
        { level: 1, text: 'The two numbers you need are not on this sheet. They are on sheets you have already solved.' },
        { level: 2, text: 'Count the rooms on the floor plan, including the Entrance and the Café. Then count the names in the night log.' },
        { level: 3, text: 'A is 9 and B is 4. Work out the sum and look the number up in the ledger.' },
      ],
    },

    {
      id: 'mirror-note',
      kind: 'Handwritten note',
      number: 6,
      title: 'The Backwards Note',
      intro: 'Tucked inside the Compass Rose case is one last note from Mira. It looks like nonsense until you find the right way to look at it.',
      task: 'Read the note. Write down the direction it names.',
      answer: 'NORTH',
      keyLetterIndex: 3,
      minutes: 5,
      evidence: `
        <div class="doc center" style="padding:var(--space-5) var(--space-3)">
          <div class="doc__head"><span>Found in case 314</span><span>Marlow Museum</span></div>
          <div class="mirror" style="margin:var(--space-4) 0;text-align:right">
            <p style="font-size:13pt;line-height:1.7;letter-spacing:0.04em;margin:0;font-weight:700">
              I DID NOT STEAL IT.<br/>
              THE CASE LOCK WAS BROKEN AND<br/>
              SOMEONE MEANT TO TAKE IT TONIGHT.<br/>
              SO I HID IT WHERE IT COULD KEEP WATCH.<br/>
              THE CARTOGRAPHER IS FACING NORTH.
            </p>
          </div>
        </div>
        <div class="panel panel--slate" style="margin-top:var(--space-3)">
          <p class="small" style="margin:0"><strong>Three ways to read it.</strong> Hold the sheet up to a mirror.
          Hold it up to a window and read it from the back. Or hold a phone in front of it in selfie mode.</p>
        </div>`,
      solution: [
        'The note is printed in mirror writing.',
        'It reads: I DID NOT STEAL IT. THE CASE LOCK WAS BROKEN AND SOMEONE MEANT TO TAKE IT TONIGHT. SO I HID IT WHERE IT COULD KEEP WATCH. THE CARTOGRAPHER IS FACING NORTH.',
        'Answer: NORTH.',
      ],
      hints: [
        { level: 1, text: 'The letters are not scrambled. They are the right way up but the wrong way round.' },
        { level: 2, text: 'Try holding the sheet flat against a window with the writing facing away from you.' },
        { level: 3, text: 'The last line ends with a direction on a compass. It is not south, east or west.' },
      ],
    },
  ],
};
