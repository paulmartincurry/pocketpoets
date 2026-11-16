import { DUELIST_BATTLE_BARKS, DuelistBattleBark } from '../overworldData';
import { getPoetById, PoetData, PoemMove } from '../poetsData';
import { BATTLE_CONFIG } from '../constants';
import { CombatantStunState, StunApplyResult, StunConsumeResult } from './types';

export { DUELIST_BATTLE_BARKS };
export type { DuelistBattleBark };

export function getMidFightBark(poetId: string): string {
  const custom = DUELIST_BATTLE_BARKS[poetId];
  if (custom?.midFight) return custom.midFight;
  const poet = getPoetById(poetId);
  return poet.dialogue.midFight;
}

export function getDefeatedBark(poetId: string): string {
  const custom = DUELIST_BATTLE_BARKS[poetId];
  if (custom?.defeated) return custom.defeated;
  const poet = getPoetById(poetId);
  return poet.dialogue.lose;
}

export function getRecruitedBark(poetId: string): string {
  const custom = DUELIST_BATTLE_BARKS[poetId];
  if (custom?.recruited) return custom.recruited;
  const poet = getPoetById(poetId);
  return poet.dialogue.captured;
}

/**
 * Checks if target combatant is immune to "Lost for Words" (STATUS).
 * Immune if target already has stunTokens > 0 OR stunImmuneTurns > 0.
 */
export function isTargetImmuneToStun(stun: CombatantStunState): boolean {
  return stun.stunTokens > 0 || stun.stunImmuneTurns > 0;
}

/**
 * Applies "Lost for Words" (STATUS) to a combatant.
 * If target has stunTokens > 0 OR stunImmuneTurns > 0, target is IMMUNE.
 * Otherwise, applies stunTokens = 1.
 */
export function applyStunToCombatant(
  targetName: string,
  stun: CombatantStunState
): StunApplyResult {
  if (isTargetImmuneToStun(stun)) {
    return {
      applied: false,
      isImmune: true,
      message: `${targetName} is immune to Lost for Words!`,
    };
  }
  stun.stunTokens = 1;
  return {
    applied: true,
    isImmune: false,
    message: `${targetName} is Lost for Words!`,
  };
}

/**
 * Consumes the Stun Token when target's scheduled action arrives.
 * Fast Stun (Attacker acted first, target's turn later this round) OR Slow Stun (next round).
 * Consumes stunTokens = 0, sets stunImmuneTurns = 1, justGainedImmunityThisRound = true.
 */
export function consumeCombatantStun(
  targetName: string,
  stun: CombatantStunState,
  isInterruptedInSameRound = false
): StunConsumeResult {
  if (stun.stunTokens > 0) {
    stun.stunTokens = 0;
    stun.stunImmuneTurns = 1;
    stun.justGainedImmunityThisRound = true;
    const message = isInterruptedInSameRound
      ? `${targetName} is Lost for Words — their telegraphed stanza is interrupted!`
      : `${targetName} is Lost for Words and cannot recite this turn.`;
    return {
      consumed: true,
      message,
    };
  }
  return {
    consumed: false,
  };
}

/**
 * Round-End Immunity Tick-Down:
 * After both combatants' actions resolved:
 * If combatant.stunImmuneTurns > 0:
 *   If combatant.justGainedImmunityThisRound, reset justGainedImmunityThisRound = false.
 *   Otherwise, decrement combatant.stunImmuneTurns = 0.
 */
export function tickCombatantRoundEndImmunity(stun: CombatantStunState): void {
  if (stun.stunImmuneTurns > 0) {
    if (stun.justGainedImmunityThisRound) {
      stun.justGainedImmunityThisRound = false;
    } else {
      stun.stunImmuneTurns = 0;
    }
  }
}

/**
 * Evaluates whether Enemy AI is allowed to select a STATUS move.
 * Cannot choose STATUS if:
 * 1) player.stunTokens > 0
 * 2) player.stunImmuneTurns > 0
 * 3) Enemy used STATUS on immediately preceding round
 */
export function canEnemyAiSelectStatus(
  playerStunTokens: number,
  playerStunImmuneTurns: number,
  enemyUsedStatusLastRound: boolean
): boolean {
  if (playerStunTokens > 0) return false;
  if (playerStunImmuneTurns > 0) return false;
  if (enemyUsedStatusLastRound) return false;
  return true;
}

/**
 * Checks if target enemy is within the Blank Book capture window.
 * Threshold is <= 35% Max HP if enemy.stunTokens > 0 OR if enemy was skipped by stun this round.
 * Otherwise, base threshold is <= 25% Max HP.
 */
export function checkCaptureWindow(
  enemyHp: number,
  enemyMaxHp: number,
  enemyStunTokens: number,
  enemySkippedThisRoundByStun: boolean
): boolean {
  const isBonusWindow = enemyStunTokens > 0 || enemySkippedThisRoundByStun;
  const thresholdPct = isBonusWindow
    ? BATTLE_CONFIG.statusCaptureWindow
    : BATTLE_CONFIG.baseCaptureWindow;
  return enemyHp <= enemyMaxHp * thresholdPct;
}
