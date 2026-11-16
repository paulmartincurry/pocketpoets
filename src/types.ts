// POCKET POETS — COMBAT TYPES & DATA SPECIFICATION

import {
  SeasonType,
  LiteraryAffinity,
  StatusEffectType,
  MoveEffectType,
  PoemMove,
  PoetData,
  PoetDialogue,
  PoetArenaStage,
  ChapterGateSpec,
} from '../poetsData';

export type {
  SeasonType,
  LiteraryAffinity,
  StatusEffectType,
  MoveEffectType,
  PoemMove,
  PoetData,
  PoetDialogue,
  PoetArenaStage,
  ChapterGateSpec,
};

/**
 * Token-based Stun Action Consumption State
 * Tracks the exact 1-skipped-action lifecycle and immunity window.
 */
export interface CombatantStunState {
  stunTokens: number; // 0 or 1
  stunImmuneTurns: number; // 0 or 1
  justGainedImmunityThisRound?: boolean;
}

export interface CombatantModifiers {
  buffActive: boolean;
  buffTurns: number;
  debuffActive: boolean;
  debuffTurns: number;
  stun: CombatantStunState;
}

export interface StunApplyResult {
  applied: boolean;
  isImmune: boolean;
  message: string;
}

export interface StunConsumeResult {
  consumed: boolean;
  message?: string;
}
