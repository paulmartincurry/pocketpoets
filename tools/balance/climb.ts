// @ts-nocheck  (a Node script, not part of the game build)
// Plays the whole climb many times at three skill levels and prints, per duel:
// first-try win rate / rounds / poets lost.   usage: node climb.js [climbs] [cap] [books] [rest]
//   cap   lineup size (default: the game's LINEUP_SIZE; 99 = everyone you have recruited, the old rule)
//   rest  Summit: 'full' (rested between the four duels, the game's rule) or 'none' (the old carry-over)
import { ALL_POETS, CHAPTER_GATES, POLICIES, duel, mulberry, byId } from './engine';
import { calculateSeasonMultiplier, LINEUP_SIZE } from '../../poetsData';
const N = +(process.argv[2] ?? 400), cap = +(process.argv[3] ?? LINEUP_SIZE), BOOKS = +(process.argv[4] ?? 10), REST = process.argv[5] ?? 'full'; const HOME = (process.argv[6] ?? '1,1,1,1,1').split(',').map(Number);
const DMG = (process.argv[7] ?? '1,1,1,1,1').split(',').map(Number);
const chapterOf = (id: string) => CHAPTER_GATES.findIndex((c) => c.poetIds.includes(id));
const order = CHAPTER_GATES.flatMap((c) => c.poetIds).filter((id) => id !== 'WHITMAN'); const SUMMIT = ['SAPPHO', 'SHAKESPEARE', 'KEATS', 'DANTE'];
function arrange(owned: string[], enemyId: string, kind: string): string[] {
  if (kind === 'novice') return owned.slice(0, cap); // never opens the Anthology: first come, first to fight
  const e = byId(enemyId); const score = (id: string) => { const p = byId(id); return calculateSeasonMultiplier(p.season, e.season) * 2 - calculateSeasonMultiplier(e.season, p.season) + p.hp / 400; };
  return [...owned].sort((a, b) => score(b) - score(a)).slice(0, cap);
}
const kinds = ['novice', 'average', 'skilled']; const rows: Record<string, string[]> = {}; const totals: string[] = [];
for (const kind of kinds) {
  const stat: Record<string, { first: number; rounds: number; fallen: number; n: number }> = {}; let lost = 0, clears = 0, worst = 0;
  for (let c = 0; c < N; c++) {
    const rnd = mulberry(c * 7919 + cap * 31 + kind.length); const owned = ['WHITMAN']; let books = kind === 'novice' ? 0 : BOOKS; let lostThis = 0;
    for (const enemyId of order) { if (SUMMIT.includes(enemyId)) continue;
      const s = (stat[enemyId] ||= { first: 0, rounds: 0, fallen: 0, n: 0 }); s.n++;
      for (let tries = 1; ; tries++) { const r = duel(arrange(owned, enemyId, kind), enemyId, POLICIES[kind], rnd, { books, enemyHpScale: HOME[chapterOf(enemyId)], enemyDmgScale: DMG[chapterOf(enemyId)] }); books -= r.booksUsed; if (tries === 1) { s.rounds += r.rounds; s.fallen += r.fallen; if (r.win) s.first++; } if (r.win || tries >= 40) break; lostThis++; }
      owned.push(enemyId); }
    for (let attempts = 1; ; attempts++) { let carry: any = undefined; let ok = true; 
      for (const boss of SUMMIT) { const team = arrange(owned, boss, kind); const s = (stat[boss] ||= { first: 0, rounds: 0, fallen: 0, n: 0 }); const r = duel(team, boss, POLICIES[kind], rnd, { books, carry: REST === 'full' ? undefined : carry, enemyHpScale: HOME[4], enemyDmgScale: DMG[4] }); books -= r.booksUsed;
        if (attempts === 1) { s.n++; s.rounds += r.rounds; s.fallen += r.fallen; if (r.win) s.first++; }
        if (!r.win) { ok = false; break; } carry = Object.fromEntries(r.lineupAfter.map((x) => [x.id, { hp: x.hp, readings: x.readings }])); }
      if (ok) { if (attempts === 1) clears++; break; } lostThis++; if (attempts >= 40) break; }
    lost += lostThis; worst = Math.max(worst, lostThis);
  }
  for (const id of order) { const s = stat[id]; (rows[id] ||= []).push(s && s.n ? `${String(Math.round((100 * s.first) / s.n)).padStart(3)}% ${(s.rounds / s.n).toFixed(1).padStart(5)} ${(s.fallen / s.n).toFixed(1)}`.padEnd(20) : '  -1%   0.0 0.0'.padEnd(20)); }
  totals.push(`${kind.padEnd(8)} ${(lost / N).toFixed(1).padStart(5)} lost duels per climb (worst ${worst}), Summit cleared first try ${Math.round((100 * clears) / N)}%`);
}
console.log(`lineup ${cap >= 99 ? 'unlimited' : cap}, ${BOOKS} books, summit rest: ${REST}, home hp ${HOME.join('/')} dmg ${DMG.join('/')}, traits ${process.env.NOTRAITS ? 'OFF' : 'on'} — ${N} climbs each`);
console.log('duel'.padEnd(13) + kinds.map((k) => (k + ' win% rnds lost').padEnd(20)).join(''));
for (const id of order) console.log(id.padEnd(13) + rows[id].join(''));
console.log(totals.join('\n'));
