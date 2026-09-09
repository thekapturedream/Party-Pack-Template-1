import type { Kit } from '../../content/types.ts';
import { html, sheet, framed, runhead, runfoot, paperLabel, type PaperSize } from '../shell.ts';

const foot = (kit: Kit, n: number) =>
  runfoot(`${kit.title} &middot; Host Guide`, `${n} / 6`);

const head = (kit: Kit, note: string) => runhead('Host Guide', note);

function cover(kit: Kit, size: PaperSize): string {
  const rows = kit.puzzles.map((p) => `
    <tr>
      <td style="width:10mm;font-family:var(--font-signage);font-weight:600;color:var(--evidence)">${p.number}</td>
      <td style="width:48mm"><strong>${p.title}</strong></td>
      <td class="small">${p.kind}</td>
      <td class="num" style="width:16mm">${p.minutes} min</td>
    </tr>`).join('');

  return sheet(`
    <header class="runhead">
      <span class="tab">Host guide</span>
      <span class="runhead__note">${kit.seriesName} &middot; ${paperLabel(size)} &middot; v${kit.version}</span>
    </header>
    <div class="sheet__body">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-4)">
        <div>
          <div class="label label--evidence">Case file 12</div>
          <h1 class="display" style="max-width:13ch;margin-top:var(--space-1)">${kit.title}</h1>
          <p class="lead" style="margin-top:var(--space-3);max-width:104mm">${kit.subtitle}.</p>
        </div>
        <span class="stamp stamp--ink" style="margin-top:4mm;white-space:nowrap">${kit.edition}</span>
      </div>

      <div class="cols cols--3" style="margin:var(--space-4) 0;padding:var(--space-3) 0;
        border-top:var(--rule-medium) solid var(--ink);border-bottom:var(--hairline) solid var(--rule)">
        <div><div class="label">For</div><div>${kit.ageRange}<br/>${kit.players}</div></div>
        <div><div class="label">Setting up</div><div>${kit.prepMinutes} minutes<br/>the day before</div></div>
        <div><div class="label">Playing</div><div>${kit.playMinutes}<br/>start to finish</div></div>
      </div>

      <div class="panel panel--host">
        <div class="panel__title">Read page 2 and you can run the whole thing</div>
        <p style="margin:0">You do not need to solve the puzzles first. You do not need props, apps or batteries.
        You need a printer, scissors, an envelope and a mirror somewhere in the house. Everything else is in this pack.</p>
      </div>

      <div class="panel grow" style="margin-top:var(--space-4);display:flex;flex-direction:column">
        <div class="panel__title">What the children actually do</div>
        <table class="ledger ledger--text"><tbody>${rows}</tbody></table>
        <p class="small" style="margin-top:var(--space-3)">No two puzzles use the same kind of thinking, so no single
        child runs away with the game. Two of them send the team back to sheets they have already solved, which is what
        keeps a table of nine-year-olds working together rather than in parallel.</p>
        <div style="margin-top:auto;padding-top:var(--space-3);border-top:var(--hairline) dashed var(--rule);
          display:flex;justify-content:space-between;align-items:baseline;gap:var(--space-3)">
          <span class="label">Ends with</span>
          <span class="small" style="flex:1">One six-letter word, said out loud, and an envelope hidden at a mirror.</span>
        </div>
      </div>
    </div>
    <footer class="runfoot">
      <span>${kit.publisher} &middot; ${kit.publisherUrl}</span>
      <span>1 / 6</span>
    </footer>`, { tint: true, punched: true });
}

function whatYouNeed(kit: Kit): string {
  return sheet(framed(
    head(kit, 'Before the day'),
    `<div class="stack-4">
      <div class="stack-2">
        <h1>Setting up takes fifteen minutes</h1>
        <p class="lead" style="max-width:112mm">Do it the day before and the party itself needs nothing from you but
        a chair and the hint cards.</p>
      </div>
      <div class="cols cols--2">
        <div class="panel">
          <div class="panel__title">What to print</div>
          <table class="ledger" style="font-family:var(--font-text)">
            <tbody>
              <tr><td><strong>Player Pack</strong><div class="caption">8 sheets. One copy per team.</div></td><td class="num">&times; teams</td></tr>
              <tr><td><strong>Hint Cards</strong><div class="caption">2 sheets. 18 hint cards and 6 Curator cards.</div></td><td class="num">&times; 1</td></tr>
              <tr><td><strong>Answer Key</strong><div class="caption">2 sheets. For you only.</div></td><td class="num">&times; 1</td></tr>
              <tr><td><strong>Party Extras</strong><div class="caption">Invitations, badges, door sign, certificates.</div></td><td class="num">as needed</td></tr>
            </tbody>
          </table>
          <p class="caption" style="margin-top:var(--space-2)">Black and white is fine throughout. Nothing uses a
          full-page background.</p>
        </div>
        <div class="panel panel--tint">
          <div class="panel__title">What you need from the house</div>
          <ul class="ticks small">
            <li>Scissors, for the hint cards and badges</li>
            <li>One envelope, any size</li>
            <li>A mirror the children can reach</li>
            <li>Sticky tape</li>
            <li>Pencils, one per player</li>
            <li>A small prize or the cake, for the finale</li>
          </ul>
          <hr class="rule" style="margin:var(--space-3) 0"/>
          <div class="panel__title">Nice, not needed</div>
          <ul class="bullets small">
            <li>A clipboard per team</li>
            <li>A timer where everyone can see it</li>
          </ul>
        </div>
      </div>
      <div class="panel panel--host">
        <div class="panel__title">The fifteen minutes, in order</div>
        <ol class="steps">
          <li><strong>Print.</strong> One Player Pack per team of three or four. Two teams is the sweet spot.</li>
          <li><strong>Cut the hint cards</strong> along the dashed lines and keep them in six piles, one per evidence sheet.</li>
          <li><strong>Write the finale card.</strong> It is the last page of the Party Extras. Put it in the envelope with the prize.</li>
          <li><strong>Tape the envelope</strong> to the back of a mirror, or tuck it behind one. That is the whole hiding place.</li>
          <li><strong>Put the door sign up</strong> and lay Evidence 1 on the table. Keep sheets 2 to 6 face down beside you.</li>
        </ol>
      </div>
      <div class="cols cols--2">
        <div class="panel panel--tint">
          <div class="panel__title">If you have five minutes, not fifteen</div>
          <p class="small" style="margin:0">Print the Player Pack and the Answer Key. Read hints off the answer key
          instead of cutting cards, skip the extras, hide the prize behind a mirror and start. The children will not
          notice anything missing.</p>
        </div>
        <div class="panel panel--tint">
          <div class="panel__title">Before you walk away from the printer</div>
          <ul class="bullets small">
            <li>Check the floor plan on Evidence 2 is a complete square with nine rooms.</li>
            <li>If it looks wrong, your printer is scaling. Set it to 100% and print that sheet again.</li>
          </ul>
        </div>
      </div>
    </div>`,
    foot(kit, 2),
  ));
}

function runningIt(kit: Kit): string {
  const rows = kit.puzzles.map((p) => `
    <tr>
      <td class="num" style="width:16mm">${p.minutes} min</td>
      <td><strong>Evidence ${p.number}. ${p.title}</strong><div class="caption">${p.kind}</div></td>
      <td style="width:26mm;text-align:right;font-family:var(--font-document)">${p.answer}</td>
    </tr>`).join('');

  return sheet(framed(
    head(kit, 'On the day'),
    `<div class="stack-4">
      <div class="stack-2">
        <h1>You are the Curator</h1>
        <p class="lead" style="max-width:112mm">Your job is three things: read the briefing, hand out the next sheet,
        and give hints when a team asks. That is all.</p>
      </div>
      <div class="cols cols--2">
        <div class="panel panel--tint">
          <div class="panel__title">The opening, word for word</div>
          <p class="small" style="margin:0">&ldquo;Junior Curators. The Clockwork Cartographer was in Case 12 at half past
          nine last night. By quarter to ten it was gone. Nothing was forced and nothing else was taken. The museum
          opens at ten tomorrow. You have six pieces of evidence and one hour.&rdquo;</p>
          <p class="caption" style="margin-top:var(--space-2)">Then hand out the Player Packs, cover page up.</p>
        </div>
        <div class="panel">
          <div class="panel__title">Two rules the players need</div>
          <ol class="steps small">
            <li>Keep every sheet you solve. You will need two of them again.</li>
            <li>When you have an answer, write it in the boxes and put your hand up. The Curator hands out the next sheet.</li>
          </ol>
          <hr class="rule" style="margin:var(--space-3) 0"/>
          <div class="panel__title">If you are running two teams</div>
          <p class="small" style="margin:0">Give both teams the same sheet at once and let them race. Nobody is ever locked
          out of the next puzzle.</p>
        </div>
      </div>
      <div class="panel panel--host">
        <div class="panel__title">The running order</div>
        <table class="ledger" style="font-family:var(--font-text);margin-top:var(--space-1)">
          <tbody>${rows}
            <tr><td class="num">5 min</td><td><strong>The Recovery Slip</strong><div class="caption">Six letters, read downwards.</div></td><td style="text-align:right;font-family:var(--font-document)">${kit.finalWord}</td></tr>
            <tr><td class="num">5 min</td><td><strong>The finale</strong></td><td style="text-align:right">&mdash;</td></tr>
          </tbody>
        </table>
        <p class="caption" style="margin-top:var(--space-2)">Total playing time is around ${kit.playMinutes}.
        Nine-year-olds tend to need the upper end; twelve-year-olds the lower.</p>
      </div>
    </div>`,
    foot(kit, 3),
  ));
}

function hintsPage(kit: Kit): string {
  return sheet(framed(
    head(kit, 'Hints'),
    `<div class="stack-4">
      <div class="stack-2">
        <h1>Give hints early and cheerfully</h1>
        <p class="lead" style="max-width:112mm">A stuck child does not enjoy being stuck. The hints are written in three
        strengths so you can nudge without solving.</p>
      </div>
      <div class="cols cols--3">
        <div class="panel"><div class="panel__title">Hint 1</div><p class="small" style="margin:0">Points at the right
        part of the sheet. Give it as soon as a team has been quiet for two minutes.</p></div>
        <div class="panel"><div class="panel__title">Hint 2</div><p class="small" style="margin:0">Gives them the method.
        Give it if they have tried something and it did not work.</p></div>
        <div class="panel"><div class="panel__title">Hint 3</div><p class="small" style="margin:0">Almost the answer.
        Give it rather than let a puzzle run past ten minutes.</p></div>
      </div>
      <div class="panel panel--tint">
        <div class="panel__title">How to hand them over</div>
        <p class="small">Keep the eighteen cards in six piles in front of you. When a team asks, take the top card from
        that pile and read it aloud, or hand it over and let them read it. Handing it over works better with older
        children, who like the feeling of spending something.</p>
        <p class="small" style="margin:0"><strong>The three-hint budget.</strong> If you want a competitive edge between
        two teams, give each team three hint tokens at the start (they are on the Party Extras sheet) and make them pay
        one per hint. Teams that finish with tokens left get a line on their certificate.</p>
      </div>
      <div class="cols cols--2">
        <div class="panel panel--host">
          <div class="panel__title">If a team is racing ahead</div>
          <ul class="bullets small">
            <li>Ask them to write the story of what Mira did, in three sentences, before you hand over the next sheet.</li>
            <li>Ask them to check the other team&rsquo;s working rather than telling them the answer.</li>
            <li>Hold the next sheet until both teams are ready. Nobody minds a thirty-second pause.</li>
          </ul>
        </div>
        <div class="panel panel--host">
          <div class="panel__title">If a team is falling behind</div>
          <ul class="bullets small">
            <li>Read the task aloud again. Half of all sticking points are a task that was skimmed.</li>
            <li>Go straight to hint 2. There is no prize for making them suffer through hint 1 first.</li>
            <li>Sit down with them for one puzzle. A grown-up at the table changes the mood in about a minute.</li>
          </ul>
        </div>
      </div>
    </div>`,
    foot(kit, 4),
  ));
}

function finalePage(kit: Kit): string {
  return sheet(framed(
    head(kit, 'The finale'),
    `<div class="stack-4">
      <div class="stack-2">
        <h1>The word is ${kit.finalWord}</h1>
        <p class="lead" style="max-width:112mm">When a team says it out loud, you say: &ldquo;Then go and look.&rdquo;
        Nothing more. Let them work out which mirror.</p>
      </div>
      <div class="cols cols--2">
        <div class="panel panel--host">
          <div class="panel__title">Setting the finale up</div>
          <ol class="steps small">
            <li>Fill in the Recovery Certificate on the Party Extras sheet, one per player.</li>
            <li>Put the finale card, the certificates and a small prize in the envelope.</li>
            <li>Tape the envelope ${kit.finalePlace}.</li>
            <li>If your only mirror is somewhere awkward, use a hand mirror on a shelf. The word still works.</li>
          </ol>
        </div>
        <div class="panel panel--tint">
          <div class="panel__title">The ending, and why it matters</div>
          <p class="small">Mira Kell did not steal the Cartographer. The case lock was broken, she knew someone
          intended to take it that night, and she hid it where it could keep watch over the gallery &mdash; facing north,
          in the one place in the museum that shows you the whole room at once.</p>
          <p class="small" style="margin:0">Say that out loud when they open the envelope. Children who spend an hour
          deciding a person is guilty enjoy being told they were only half right.</p>
        </div>
      </div>
      <div class="panel">
        <div class="panel__title">Three ways to finish bigger</div>
        <div class="cols cols--3">
          <div><strong class="small">Cake as the prize</strong><p class="small" style="margin:0">Put a note in the
          envelope instead: &ldquo;the Cartographer is in the kitchen.&rdquo; Walk them through.</p></div>
          <div><strong class="small">A photograph</strong><p class="small" style="margin:0">Line the team up with the
          envelope and the door sign. It is the picture parents actually keep.</p></div>
          <div><strong class="small">A second round</strong><p class="small" style="margin:0">Hide the certificates
          somewhere else and let the fastest solver of the day choose the hiding place.</p></div>
        </div>
      </div>
      <div class="panel panel--slate">
        <div class="panel__title">A note on tears</div>
        <p class="small" style="margin:0">The most common problem at this age is not difficulty, it is one child solving
        everything. If that starts, give each player one evidence sheet to own and make the rule that only the owner may
        write the answer. It fixes it immediately and nobody has to be told off.</p>
      </div>
    </div>`,
    foot(kit, 5),
  ));
}

function troubleshooting(kit: Kit): string {
  return sheet(framed(
    head(kit, 'Adjusting and troubleshooting'),
    `<div class="stack-4">
      <div class="stack-2">
        <h1>Making it fit your party</h1>
      </div>
      <div class="cols cols--2">
        <div class="panel">
          <div class="panel__title">Younger players, seven and eight</div>
          <ul class="bullets small">
            <li>Hand out hint 1 for every puzzle before they start. It reframes the puzzle rather than spoiling it.</li>
            <li>Do the cipher together on a whiteboard or a sheet of paper.</li>
            <li>Read the clocks with them. Analogue time is the single hardest step in the kit.</li>
          </ul>
        </div>
        <div class="panel">
          <div class="panel__title">Older players, thirteen and up</div>
          <ul class="bullets small">
            <li>Run it as a timed race between two teams and put the clock where everyone can see it.</li>
            <li>Do not give the shift on the cipher. Let them break it.</li>
            <li>Withhold the Recovery Slip until every answer is in. Working out how the letters combine is a puzzle in itself.</li>
          </ul>
        </div>
      </div>
      <div class="panel panel--tint">
        <div class="panel__title">Common snags</div>
        <table class="ledger" style="font-family:var(--font-text)">
          <tbody>
            <tr><td style="width:56mm"><strong>The route puzzle keeps ending in the wrong room</strong></td>
              <td class="small">They are moving on the turns. Say: turning changes the way you face, it does not change the room you are in.</td></tr>
            <tr><td><strong>The clocks are producing two different times</strong></td>
              <td class="small">They have added where they should subtract. Fast clock: take the minutes off. Slow clock: add them on.</td></tr>
            <tr><td><strong>The ledger sum will not come out</strong></td>
              <td class="small">They have not gone back to sheets 1 and 2. Slide those two sheets in front of them without a word.</td></tr>
            <tr><td><strong>They read the mirror note but cannot find the answer</strong></td>
              <td class="small">Ask them to read only the last line again.</td></tr>
            <tr><td><strong>A player has finished and is bored</strong></td>
              <td class="small">Make them the Assistant Curator. They hold the hint cards and decide when to give one.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="cols cols--2">
        <div class="panel panel--host">
          <div class="panel__title">Reading and accessibility</div>
          <ul class="bullets small">
            <li>Every sheet can be read aloud. No puzzle depends on colour to be solved.</li>
            <li>The mirror note can also be read by holding the sheet to a window from behind, which is easier than a mirror for a child in a wheelchair.</li>
            <li>Print at 141% onto A3 if anyone needs large print. Nothing in the layout breaks.</li>
          </ul>
        </div>
        <div class="panel panel--host">
          <div class="panel__title">Licence, in plain words</div>
          <ul class="bullets small">
            <li>Print it as many times as you like, for your own parties.</li>
            <li>Use it in a classroom, a library or a scout hut.</li>
            <li>Do not resell it, share the files, or run it as a paid event.</li>
          </ul>
          <p class="caption" style="margin-top:var(--space-2)">&copy; ${kit.publisher}. ${kit.title}, version ${kit.version}.
          Questions and playtest notes: ${kit.publisherUrl}</p>
        </div>
      </div>
    </div>`,
    foot(kit, 6),
  ));
}

export function hostGuide(kit: Kit, size: PaperSize): string {
  return html(`${kit.title} — Host Guide`, size, [
    cover(kit, size),
    whatYouNeed(kit),
    runningIt(kit),
    hintsPage(kit),
    finalePage(kit),
    troubleshooting(kit),
  ]);
}
