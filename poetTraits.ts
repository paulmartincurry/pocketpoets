// =============================================================================
// SIGNATURE TRAITS
// -----------------------------------------------------------------------------
// One rule per poet, so that the 23rd duel is not the first duel with a new
// portrait. Each rule is meant to be true to the poet and small enough to say in
// a sentence. Names and descriptions are DRAFT COPY for Paul.
//
// The numbers live in this file only. The game (App.tsx) and the balance
// simulator both call the functions below, so they cannot disagree.
//
// To retune a trait: change its number here, run the simulator, read the table.
// To switch every trait off: set TRAITS_ENABLED to false.
// =============================================================================

export const TRAITS_ENABLED = true;

export interface PoetTrait {
  /** short name shown in capitals */
  name: string;
  /** one plain sentence: what it does */
  text: string;
}

export const POET_TRAITS: Record<string, PoetTrait> = {
  // ---- Spring
  WHITMAN: { name: 'Multitudes', text: 'Every verse he recites makes the next one hit 6% harder, up to 30%.' },
  MARY_OLIVER: { name: 'Attention', text: 'Her light verses hit 25% harder. She notices the small things.' },
  HUGHES: { name: 'A Dream Deferred', text: 'His last heavy verse of a duel explodes: 60% harder.' },
  RUMI: { name: 'The Guest House', text: 'He welcomes what arrives: recovers 6 HP whenever a heavy verse lands on him.' },
  DARWISH: { name: 'On This Earth', text: 'His healing verses restore half again as much.' },
  // ---- Summer
  NERUDA: { name: 'Odes', text: 'Two more readings of his light verse. He always has another ode.' },
  LORCA: { name: 'Duende', text: 'Below a third of his strength his verses hit 35% harder.' },
  ANGELOU: { name: 'Still I Rise', text: 'She cannot be weakened.' },
  BLAKE: { name: 'Contraries', text: 'Every second verse he recites hits 40% harder.' },
  // ---- Autumn
  BASHO: { name: 'Lightness', text: 'He always recites first.' },
  LI_BAI: { name: 'Drinking Alone', text: 'His boost lasts two rounds longer.' },
  SOR_JUANA: { name: 'The Reply', text: 'She cannot be made Lost for Words. They tried.' },
  BUKOWSKI: { name: 'Roll the Dice', text: 'His heavy verses hit 50% harder or 25% softer. He does not know which either.' },
  baudelaire: { name: 'Spleen', text: 'His heavy verses feed him: a quarter of the damage comes back as HP.' },
  // ---- Winter
  FROST: { name: 'Miles to Go', text: 'One more reading of every verse.' },
  DICKINSON: { name: 'Slant', text: 'Her verses are never resisted, whatever the season.' },
  POE: { name: 'Nevermore', text: 'His verses hit 40% harder on a poet who is, or has just been, Lost for Words.' },
  PLATH: { name: 'Lady Lazarus', text: 'Once a duel, a blow that should finish her leaves her standing at a quarter strength.' },
  THOREAU: { name: 'Deliberately', text: 'He recovers 5 HP at the end of every round.' },
  // ---- Summit
  SAPPHO: { name: 'Fragments', text: 'Heavy verses take 20% less from her. What is left is enough.' },
  SHAKESPEARE: { name: 'Comedy and Tragedy', text: 'Above half strength he hits 20% harder. Below it he takes 20% less.' },
  KEATS: { name: 'Bright Star', text: 'Steadfast: no single verse can take more than a quarter of his strength.' },
  DANTE: { name: 'Terza Rima', text: 'Every third verse he recites hits 60% harder.' },
};

const on = (id: string, key: string) => TRAITS_ENABLED && id === key;

export interface TraitDamageContext {
  attackerId: string;
  defenderId: string;
  moveType: string; // 'HEAVY' | 'LIGHT'
  attackerHp: number;
  attackerMaxHp: number;
  defenderHp: number;
  defenderMaxHp: number;
  /** verses the attacker has already recited this duel, not counting this one */
  versesBefore: number;
  /** readings left of this verse after this recital */
  readingsLeftAfter: number;
  defenderLostForWords: boolean;
  /** a number from 0 to 1 (only Bukowski uses it) */
  roll: number;
}

/** Everything that scales one damaging verse. Returns the multiplier and, when a trait fired, its name. */
export function traitDamageMultiplier(c: TraitDamageContext): { mult: number; fired: string | null } {
  let mult = 1;
  let fired: string | null = null;
  const a = c.attackerId;
  const d = c.defenderId;
  const heavy = c.moveType === 'HEAVY';

  if (on(a, 'WHITMAN') && c.versesBefore > 0) { mult *= 1 + Math.min(0.3, 0.06 * c.versesBefore); fired = 'MULTITUDES'; }
  if (on(a, 'MARY_OLIVER') && !heavy) { mult *= 1.25; fired = 'ATTENTION'; }
  if (on(a, 'HUGHES') && heavy && c.readingsLeftAfter <= 0) { mult *= 1.6; fired = 'A DREAM DEFERRED'; }
  if (on(a, 'LORCA') && c.attackerHp <= c.attackerMaxHp * 0.35) { mult *= 1.35; fired = 'DUENDE'; }
  if (on(a, 'BLAKE') && c.versesBefore % 2 === 1) { mult *= 1.4; fired = 'CONTRARIES'; }
  if (on(a, 'BUKOWSKI') && heavy) { mult *= c.roll < 0.5 ? 1.5 : 0.75; fired = 'ROLL THE DICE'; }
  if (on(a, 'POE') && c.defenderLostForWords) { mult *= 1.4; fired = 'NEVERMORE'; }
  if (on(a, 'SHAKESPEARE') && c.attackerHp > c.attackerMaxHp * 0.5) { mult *= 1.2; fired = 'COMEDY'; }
  if (on(a, 'DANTE') && c.versesBefore % 3 === 2) { mult *= 1.6; fired = 'TERZA RIMA'; }

  if (on(d, 'SAPPHO') && heavy) { mult *= 0.8; fired = fired ?? 'FRAGMENTS'; }
  if (on(d, 'SHAKESPEARE') && c.defenderHp <= c.defenderMaxHp * 0.5) { mult *= 0.8; fired = fired ?? 'TRAGEDY'; }
  return { mult, fired };
}

/** Dickinson: a season multiplier below 1 is lifted to 1. */
export const traitSeasonMultiplier = (attackerId: string, seasonMultiplier: number): number =>
  on(attackerId, 'DICKINSON') && seasonMultiplier < 1 ? 1 : seasonMultiplier;

/** Keats: the most one verse can take from him. Infinity for everyone else. */
export const traitDamageCap = (defenderId: string, defenderMaxHp: number): number =>
  on(defenderId, 'KEATS') ? Math.round(defenderMaxHp * 0.25) : Infinity;

/** Rumi: HP he recovers when a verse of this type lands on him. */
export const traitHealWhenHit = (defenderId: string, moveType: string): number =>
  on(defenderId, 'RUMI') && moveType === 'HEAVY' ? 6 : 0;

/** Baudelaire: HP returned to the attacker from damage dealt. */
export const traitLifesteal = (attackerId: string, moveType: string, damage: number): number =>
  on(attackerId, 'baudelaire') && moveType === 'HEAVY' ? Math.round(damage * 0.25) : 0;

/** Darwish */
export const traitHealMultiplier = (poetId: string): number => (on(poetId, 'DARWISH') ? 1.5 : 1);

/** Li Bai */
export const traitBuffBonusTurns = (poetId: string): number => (on(poetId, 'LI_BAI') ? 2 : 0);

/** Angelou */
export const traitDebuffImmune = (poetId: string): boolean => on(poetId, 'ANGELOU');

/** Sor Juana */
export const traitStunImmune = (poetId: string): boolean => on(poetId, 'SOR_JUANA');

/** Bashō */
export const traitAlwaysFirst = (poetId: string): boolean => on(poetId, 'BASHO');

/** Neruda (light verse) and Frost (every verse) */
export const traitExtraReadings = (poetId: string, moveType: string): number => {
  if (on(poetId, 'NERUDA') && moveType === 'LIGHT') return 2;
  if (on(poetId, 'FROST')) return 1;
  return 0;
};

/** Plath: the share of her strength she stands back up with, once a duel. 0 for everyone else. */
export const traitReviveFraction = (poetId: string): number => (on(poetId, 'PLATH') ? 0.25 : 0);

/** Thoreau */
export const traitRoundEndHeal = (poetId: string): number => (on(poetId, 'THOREAU') ? 5 : 0);

/** Who recites first this round. True when the enemy does. */
export const enemyRecitesFirst = (playerId: string, playerSpd: number, enemyId: string, enemySpd: number): boolean => {
  const p = traitAlwaysFirst(playerId);
  const e = traitAlwaysFirst(enemyId);
  if (p !== e) return e;
  return enemySpd > playerSpd;
};
