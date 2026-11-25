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
