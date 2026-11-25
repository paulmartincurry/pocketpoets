// @ts-nocheck  (a Node script, not part of the game build)
// Headless model of a Pocket Poets duel. Damage, seasons, tiers and traits come from the
// game's own files (poetsData.ts, poetTraits.ts), so the numbers cannot drift from the game.
// The turn flow is rewritten from App.tsx and was checked against live play:
//   - the enemy telegraphs its verse; the player commits before anyone moves
//   - the faster poet recites first; a capture attempt always goes before the enemy
//   - Lost for Words costs one action, then one round of immunity
//   - boosts and weakens tick down at round end; a fallen poet is replaced automatically
import { ALL_POETS, BATTLE_CONFIG, CHAPTER_GATES, calculateSeasonMultiplier, calculateTierMultiplier } from '../../poetsData';
import * as TRreal from '../../poetTraits';
import { homeEdge as fileEdge, homeGuard as fileGuard, bookThreshold as fileBook } from '../../difficulty';
// EDGE="KEATS:1.4,POE:1.5" and BOOK="DANTE:0.2" try values without editing difficulty.ts
const envMap = (v?: string) => Object.fromEntries((v ?? '').split(',').filter(Boolean).map((x) => { const [k, n] = x.split(':'); return [k, +n]; }));
const EDGE_TRY = envMap(process.env.EDGE), BOOK_TRY = envMap(process.env.BOOK), READ_TRY = envMap(process.env.READ), GUARD_TRY = envMap(process.env.GUARD);
const homeGuard = (id: string) => GUARD_TRY[id] ?? fileGuard(id);
const homeEdge = (id: string) => EDGE_TRY[id] ?? fileEdge(id);
const bookThreshold = (id: string, base: number, bonus: number, lost: boolean) => BOOK_TRY[id] !== undefined ? BOOK_TRY[id] + (lost ? bonus - base : 0) : fileBook(id, base, bonus, lost);
export { ALL_POETS, CHAPTER_GATES, BATTLE_CONFIG };
export type Poet = (typeof ALL_POETS)[number];
export type Move = Poet['moves'][number];
export const CFG = { traits: !process.env.NOTRAITS, firstDuelEase: 0 };
const off: any = { traitDamageMultiplier: () => ({ mult: 1, fired: null }), traitSeasonMultiplier: (_: string, m: number) => m, traitDamageCap: () => Infinity, traitHealWhenHit: () => 0, traitLifesteal: () => 0, traitHealMultiplier: () => 1, traitBuffBonusTurns: () => 0, traitDebuffImmune: () => false, traitStunImmune: () => false, traitExtraReadings: () => 0, traitReviveFraction: () => 0, traitRoundEndHeal: () => 0, enemyRecitesFirst: (_p: string, ps: number, _e: string, es: number) => es > ps };
const TR: typeof TRreal = new Proxy({}, { get: (_t, k: string) => (CFG.traits ? (TRreal as any)[k] : off[k]) }) as any;
export const byId = (id: string) => ALL_POETS.find((p) => p.id === id)!;

export interface Side { poet: Poet; hp: number; readings: Record<string, number>; buff: number; debuff: number; stun: number; immune: number; gainedImmune: boolean; verses: number; revived: boolean; }
export const maxReadings = (_poet: Poet, m: Move) => m.maxReadings; // Neruda's and Frost's extra readings are already in the game data
export const fresh = (poet: Poet, hp?: number, readings?: Record<string, number>): Side => ({ poet, hp: hp ?? poet.hp, readings: readings ?? Object.fromEntries(poet.moves.map((m) => [m.id, maxReadings(poet, m)])), buff: 0, debuff: 0, stun: 0, immune: 0, gainedImmune: false, verses: 0, revived: false });
const avail = (s: Side) => s.poet.moves.filter((m) => (s.readings[m.id] ?? 0) > 0);

export function enemyIntent(e: Side, p: Side, usedStatusLast: boolean, rnd: () => number): Move | null {
  if (e.stun > 0) return null;
  let valid = avail(e); if (!valid.length) valid = [...e.poet.moves];
  const canStatus = !(p.stun > 0 || p.immune > 0 || usedStatusLast || TR.traitStunImmune(p.poet.id));
  if (!canStatus) { const ns = valid.filter((m) => m.effectType !== 'STATUS'); if (ns.length) valid = ns; }
  const f = (t: string) => valid.find((m) => m.effectType === t);
  if (f('HEAL') && e.hp <= e.poet.hp * 0.4 && rnd() < 0.65) return f('HEAL')!;
  if (f('BUFF') && e.buff <= 0 && rnd() < 0.5) return f('BUFF')!;
  if (f('DEBUFF') && p.debuff <= 0 && !TR.traitDebuffImmune(p.poet.id) && rnd() < 0.4) return f('DEBUFF')!;
  if (f('STATUS') && canStatus && rnd() < 0.4) return f('STATUS')!;
  if (f('HEAVY') && rnd() < 0.6) return f('HEAVY')!;
  if (f('LIGHT') && rnd() < 0.75) return f('LIGHT')!;
  return valid[Math.floor(rnd() * valid.length)];
}

function act(a: Side, d: Side, m: Move, rnd: () => number, dmgScale = 1) {
  a.readings[m.id] = Math.max(0, (a.readings[m.id] ?? 0) - 1);
  const versesBefore = a.verses; a.verses++;
  switch (m.effectType) {
    case 'HEAL': a.hp = Math.min(a.poet.hp, a.hp + Math.round(Math.max(BATTLE_CONFIG.healAmount, Math.round(a.poet.hp * BATTLE_CONFIG.healPercent)) * TR.traitHealMultiplier(a.poet.id))); break;
    case 'BUFF': a.buff = BATTLE_CONFIG.buffDuration + TR.traitBuffBonusTurns(a.poet.id); break;
    case 'DEBUFF': if (!TR.traitDebuffImmune(d.poet.id)) d.debuff = BATTLE_CONFIG.debuffDuration; break;
    case 'STATUS': if (!(d.stun > 0 || d.immune > 0) && !TR.traitStunImmune(d.poet.id)) d.stun = 1; break;
    default: {
      const base = m.effectType === 'HEAVY' ? BATTLE_CONFIG.heavyDamage : BATTLE_CONFIG.lightDamage;
      const season = TR.traitSeasonMultiplier(a.poet.id, calculateSeasonMultiplier(a.poet.season, d.poet.season));
      const t = TR.traitDamageMultiplier({ attackerId: a.poet.id, defenderId: d.poet.id, moveType: m.effectType, attackerHp: a.hp, attackerMaxHp: a.poet.hp, defenderHp: d.hp, defenderMaxHp: d.poet.hp, versesBefore, readingsLeftAfter: a.readings[m.id], defenderLostForWords: d.stun > 0 || d.immune > 0, roll: rnd() });
      let dmg = Math.max(1, Math.round(base * (a.buff > 0 ? BATTLE_CONFIG.buffMultiplier : 1) * (a.debuff > 0 ? BATTLE_CONFIG.debuffMultiplier : 1) * season * calculateTierMultiplier(a.poet.hp, d.poet.hp) * t.mult * dmgScale));
      dmg = Math.min(dmg, TR.traitDamageCap(d.poet.id, d.poet.hp));
      d.hp = Math.max(0, d.hp - dmg);
      if (d.hp <= 0 && !d.revived && TR.traitReviveFraction(d.poet.id) > 0) { d.revived = true; d.hp = Math.round(d.poet.hp * TR.traitReviveFraction(d.poet.id)); }
      else if (d.hp > 0) d.hp = Math.min(d.poet.hp, d.hp + TR.traitHealWhenHit(d.poet.id, m.effectType));
      a.hp = Math.min(a.poet.hp, a.hp + TR.traitLifesteal(a.poet.id, m.effectType, dmg));
    }
  }
}

export type Policy = (me: Side, foe: Side, intent: Move | null, canCapture: boolean) => Move | 'CAPTURE';
const pick = (s: Side, t: string) => avail(s).find((m) => m.effectType === t);
export const inWindow = (e: Side, skipped: boolean) => e.hp > 0 && e.hp <= e.poet.hp * bookThreshold(e.poet.id, BATTLE_CONFIG.baseCaptureWindow, BATTLE_CONFIG.statusCaptureWindow, e.stun > 0 || skipped);
// with every verse spent, the light one can still be said from memory (same in the game)
const attack = (s: Side) => pick(s, 'HEAVY') ?? pick(s, 'LIGHT') ?? (avail(s).length ? avail(s)[0] : s.poet.moves.find((m) => m.effectType === 'LIGHT') ?? s.poet.moves[0]);
export const POLICIES: Record<string, Policy> = {
  // presses the big button and nothing else
  novice: (me) => attack(me),
  // heals when hurt, binds when the window opens
  average: (me, foe, _i, cap) => { if (cap && inWindow(foe, false)) return 'CAPTURE'; const h = pick(me, 'HEAL'); if (h && me.hp < me.poet.hp * 0.4) return h; return attack(me); },
  heals: (me, foe, i, cap) => POLICIES.average(me, foe, i, cap),
  // also opens with a boost, and silences a telegraphed heavy or heal
  skilled: (me, foe, intent, cap) => {
    if (cap && inWindow(foe, false)) return 'CAPTURE';
    const h = pick(me, 'HEAL'); if (h && me.hp < me.poet.hp * 0.45) return h;
    const b = pick(me, 'BUFF'); if (b && me.buff <= 0 && me.verses <= 1) return b;
    const st = pick(me, 'STATUS'); if (st && foe.stun <= 0 && foe.immune <= 0 && intent && intent.effectType === 'HEAVY' && me.hp < me.poet.hp * 0.6) return st;
    return attack(me);
  },
};

export interface DuelResult { win: boolean; rounds: number; fallen: number; captured: boolean; booksUsed: number; lineupAfter: { id: string; hp: number; readings: Record<string, number> }[]; }
export function duel(lineupIds: string[], enemyId: string, policy: Policy, rnd: () => number, opts: { books?: number; carry?: Record<string, { hp: number; readings: Record<string, number> }>; enemyHpScale?: number; enemyDmgScale?: number; smart?: number } = {}): DuelResult {
  const carry = opts.carry; const team = lineupIds.map((id) => fresh(byId(id), carry?.[id]?.hp, carry?.[id] ? { ...carry[id].readings } : undefined));
  let idx = team.findIndex((s) => s.hp > 0); if (idx < 0) idx = 0;
  let p = team[idx]; const e = fresh(byId(enemyId)); { const extra = READ_TRY[enemyId] ?? 0; if (extra) for (const k of Object.keys(e.readings)) e.readings[k] += extra; } if (opts.enemyHpScale) e.hp = Math.round(e.hp * opts.enemyHpScale);
  const books0 = opts.books ?? 99; let books = books0; let rounds = 0, fallen = 0, usedStatusLast = false, captured = false;
  while (rounds < 200) {
    rounds++; let usedStatusThis = false;
    const intent = enemyIntent(e, p, usedStatusLast, rnd);
    const enemyTurn = () => { if (e.stun > 0) { e.stun = 0; e.immune = 1; e.gainedImmune = true; return; } const m = intent ?? e.poet.moves[0]; if (m.effectType === 'STATUS') usedStatusThis = true; act(e, p, m, rnd, (opts.enemyDmgScale ?? 1) * homeEdge(e.poet.id)); };
    let choice: Move | 'CAPTURE' | null = p.stun > 0 ? null : policy(p, e, intent, books > 0);
    if (choice && choice !== 'CAPTURE' && (p.readings[choice.id] ?? 0) <= 0) choice = attack(p);
    const playerTurn = () => { if (p.stun > 0) { p.stun = 0; p.immune = 1; p.gainedImmune = true; return; } if (choice && choice !== 'CAPTURE') act(p, e, choice, rnd, homeGuard(e.poet.id)); };
    if (choice === 'CAPTURE') { books--; if (inWindow(e, false)) { captured = true; break; } enemyTurn(); }
    else if (TR.enemyRecitesFirst(p.poet.id, p.poet.spd, e.poet.id, e.poet.spd)) { enemyTurn(); if (p.hp > 0 && e.hp > 0) playerTurn(); }
    else { playerTurn(); if (e.hp > 0) enemyTurn(); }
    if (e.hp <= 0) break;
    if (p.hp <= 0) { fallen++; const n = team.findIndex((s, i) => i > idx && s.hp > 0); if (n < 0) break; idx = n; p = team[idx]; }
    for (const s of [p, e]) { if (s.immune > 0) { if (s.gainedImmune) s.gainedImmune = false; else s.immune = 0; } if (s.buff > 0) s.buff--; if (s.debuff > 0) s.debuff--; if (s.hp > 0) s.hp = Math.min(s.poet.hp, s.hp + TR.traitRoundEndHeal(s.poet.id)); }
    usedStatusLast = usedStatusThis;
  }
  return { win: captured || e.hp <= 0, rounds, fallen, captured, booksUsed: books0 - books, lineupAfter: team.map((s) => ({ id: s.poet.id, hp: s.hp, readings: s.readings })) };
}
export function mulberry(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
