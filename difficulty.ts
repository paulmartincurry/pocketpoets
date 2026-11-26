// =============================================================================
// DIFFICULTY: the shape of the climb
// -----------------------------------------------------------------------------
// The target: pick it up, lose a couple of times until you get the hang of it,
// then beat it. A careful player should lose two or three duels over a climb;
// a careless one, eight or so; nobody should hit a duel they cannot win.
//
// Three dials, all per poet, all applying only when that poet is the one you
// are challenging on the climb (never when the poet fights for you, never in
// Free Duel):
//
//   HOME_EDGE        how much harder the poet hits on their own ground
//   HOME_GUARD       how much of each verse aimed at them lands (1 = all of it)
//   BOOK_THRESHOLD   how tired the poet must be before the blank book works
//                    (share of full strength; everyone else uses 0.25)
//
// Tune with `npm run balance`, which reads this file.
// =============================================================================

// 26 Nov 2026: Paul asked for the Summit half a notch harder. Shakespeare, Keats and Dante
// moved a small step; Sappho, the first of the four, stayed. Shakespeare tips from always
// beaten to almost never beaten near guard 0.5 / edge 1.6, so do not go there.
export const HOME_EDGE: Record<string, number> = {
  BUKOWSKI: 1.45, // Autumn's hard duel
  PLATH: 1.55, // Winter's hard duel
  SAPPHO: 1.15,
  SHAKESPEARE: 1.48,
  KEATS: 1.3,
  DANTE: 1.37,
};

export const BOOK_THRESHOLD: Record<string, number> = { SAPPHO: 0.2, SHAKESPEARE: 0.2, KEATS: 0.2, DANTE: 0.2 };

/** A Summit loss sends you back to the poet who beat you, not to the first of the four. */
export const SUMMIT_LOSS_RESUMES = true;

export const HOME_GUARD: Record<string, number> = {
  BUKOWSKI: 0.68,
  PLATH: 0.62,
  SAPPHO: 0.8,
  SHAKESPEARE: 0.56,
  // Keats needs none: Bright Star already caps every verse at a quarter of his strength
  DANTE: 0.64,
};

/** A beaten Summit poet is yours, but stays on the Summit until the last of the four is beaten.
 *  (Otherwise Sappho, a Spring poet with 200 strength, leads against Dante and the finale is the easiest duel of the four.) */
export const SUMMIT_POETS_WAIT = true;
export const SUMMIT_POET_IDS = ['SAPPHO', 'SHAKESPEARE', 'KEATS', 'DANTE'];
export const summitPoetWaits = (poetId: string, capturedIds: string[]): boolean =>
  SUMMIT_POETS_WAIT && SUMMIT_POET_IDS.includes(poetId) && !SUMMIT_POET_IDS.every((id) => capturedIds.includes(id));
export const onHomeGround = (enemyPoetId: string): boolean => (HOME_EDGE[enemyPoetId] ?? 1) !== 1 || (HOME_GUARD[enemyPoetId] ?? 1) !== 1;

export const homeEdge = (enemyPoetId: string): number => HOME_EDGE[enemyPoetId] ?? 1;
export const homeGuard = (enemyPoetId: string): number => HOME_GUARD[enemyPoetId] ?? 1;

/** The blank book's window for this poet. `lostForWords` widens it by the usual ten points. */
export const bookThreshold = (enemyPoetId: string, base: number, bonus: number, lostForWords: boolean): number => {
  const own = BOOK_THRESHOLD[enemyPoetId];
  const b = own ?? base;
  return lostForWords ? b + (bonus - base) : b;
};
