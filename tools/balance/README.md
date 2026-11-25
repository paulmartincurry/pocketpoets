# Balance simulator

Plays the whole climb hundreds of times at three skill levels and prints, for every duel,
how often it is won on the first try, how many rounds it takes and how many poets fall.

It reads the game's own numbers (`poetsData.ts`, `poetTraits.ts`), so changing a trait or a
damage value and re-running shows the effect straight away. It is not part of the game build.

    npm run balance                # 400 climbs, the game as it is
    npm run balance -- 400 99 10 none
                                   # climbs, lineup size, capture books, Summit rest (full|none)
                                   # (99 and none = the old rules: everyone fights, no rest)

The three players:

- **novice** only ever presses the strongest attack and never opens the Anthology.
- **average** heals when hurt and uses a blank book when the capture window opens.
- **skilled** also opens with a boost, silences a telegraphed heavy verse, and leads with
  the poet whose season suits the opponent.

`NOTRAITS=1 npm run balance` runs the same climbs with signature traits switched off.
The turn order was checked against the live game (same play style, same results).

## Difficulty dials (difficulty.ts)

The simulator and the game both read `difficulty.ts`:

- `HOME_EDGE` / `HOME_GUARD`: a few poets hit harder and take less on their own ground
  (the four on the Summit, plus one hard duel each in Autumn and Winter).
- `BOOK_THRESHOLD`: the Summit four must be at a fifth of their strength before the blank book works.
- `SUMMIT_LOSS_RESUMES`: lose on the Summit and you come back to the poet who beat you.
- `SUMMIT_POETS_WAIT`: a beaten Summit poet cannot lead until all four are beaten.

Try values without editing the file:

    EDGE="DANTE:1.5,PLATH:1.4" GUARD="DANTE:0.6" BOOK="DANTE:0.2" node node_modules/.cache/balance.js 200

The four players in the table:

- `novice` never learns: big button only, no book, never opens the Anthology. A floor, not a target.
- `learner` is who the game is tuned for: starts as the novice; after two losses heals and uses the
  book; after five also picks a lead by season.
- `average` and `skilled` play without mistakes. Real people do not, so read their loss counts as a minimum.

Duels tip quickly from "always won" to "rarely won" as a dial moves (two rested poets either
last the distance or they do not), so tune one poet at a time and aim for close wins
(about one poet lost, eight to ten rounds), not for a win percentage.
