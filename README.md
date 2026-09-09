# The Vanishing Exhibit

A printable escape room for a children's birthday party, ages 9–12. Six puzzles,
45–60 minutes of play, 15 minutes of setup, and a host guide written so the adult
running it never has to solve anything.

Everything is authored as code and rendered to print-ready PDFs in A4 and US Letter.

```
npm install
node src/build.ts            # PDFs into dist/
node scripts/check-fit.mjs   # fails if any sheet overflows its page
node scripts/package.mjs     # customer zip into release/
```

See `CLAUDE.md` for the design system, the puzzle invariants, and the Wix notes.
