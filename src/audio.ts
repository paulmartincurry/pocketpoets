/**
 * src/audio.ts
 * Pocket Poets — Geography-Based Soundtrack Engine
 * Professional 5-Point Mix, Frequency Separation & Dynamic Ducking Architecture:
 *
 * 1. GAIN RE-STAGING (Master Balance):
 *    - Baseline music master gain: 0.20 (overworld & interiors) / 0.24 (poet duels).
 * 2. EVENT-DRIVEN SPOTLIGHT DUCKING:
 *    - soundtrackEngine.triggerSfxDucking(holdMs = 450, duckAmount = 0.82):
 *      Ducks music by only 15-18% (to 82-88%) over 35ms, holds for holdMs, glides back over 380ms.
 * 3. SELECTIVE STEM STRIPPING DURING DIALOGUE / MENUS:
 *    - Silences Voice 1 (lead melody) during dialogue so synth never talks over poet verse.
 *    - Voice 2 (warm Juno chord pads) and Voice 3 (sub-bass) hum gently underneath as atmospheric bed.
 *    - Blooms Voice 1 gracefully back in on the next musical measure when dialogue closes.
 * 4. SPECTRAL CARVING (Frequency Separation):
 *    - Overworld music master filter kept in warm 1200Hz–1400Hz pocket, giving wide headroom
 *      to 1.5kHz–4kHz tactile SFX (page turns, typewriter bells, bird whistles, clicks).
 * 5. PUNCHY ATTACK TRANSIENTS:
 *    - Phase-aligned stem playback with zero dead-air loop architecture.
 */

import { gameAudio } from '../utils/helper';

export type ZoneId =
  | 'HARBOR'
  | 'TOWN'
  | 'CLIFFS'
  | 'RUINS'
  | 'TREELINE'
  | 'SUMMIT'
  | 'INTERIORS'
  | 'BATTLE'
  | 'BOSS_DUEL'
  | 'VICTORY'
  | 'VICTORY_FANFARE';

export type TrackId =
  // Primary Geography Zones & Battle Modes
  | 'HARBOR'
  | 'TOWN'
  | 'CLIFFS'
  | 'RUINS'
  | 'TREELINE'
  | 'SUMMIT'
  | 'INTERIORS'
  | 'BATTLE'
  | 'DUEL'
  | 'BOSS_DUEL'
  | 'VICTORY'
  | 'VICTORY_FANFARE'
  | 'EPILOGUE'
  // Overworld Rooms / Screens
  | 'NIGHTINGALE'
  | 'LUNCH_COUNTER'
  | 'RENTED_ROOM'
  | 'FORGE'
  | 'BLUE_HOUSE'
  | 'MOUNTAIN_GOAT'
  | 'LIBRARY'
  | 'KITCHEN'
  | 'HERMITAGE'
  | 'GRAVEYARD'
  | 'WHITE_HOUSE'
  | 'LYRIC_SANCTUARY'
  | 'BOATHOUSE'
  | 'ROOM_BOATHOUSE'
  | 'CAFE_DE_FLORE'
  | 'ROOM_CAFE_DE_FLORE'
  | 'SHAKESPEARE_CO'
  | 'ROOM_SHAKESPEARE_CO'
  // UI & Menu Screens
  | 'TITLE'
  | 'MENU'
  | 'ANTHOLOGY'
  | 'OPENING_SCENE'
  | 'NAME_ENTRY'
  | 'GAME_OVER'
  // Legacy / Region Aliases
  | 'COASTAL'
  | 'CIVIC_AUTUMN'
  | 'COZY_INTERIORS'
  | 'WINTER_GOTHIC'
  | 'APEX'
  | 'OVERWORLD'
  | 'VILLAGE'
  | 'STREAM'
  | 'ZEN'
  | 'GOTHIC'
  | 'INDOOR_COZY'
  | 'DINER'
  | 'CREDITS'
  | 'GRAND_TOUR_MAP';

// Complete equal-temperament frequency map (A4 = 440 Hz)
export const NOTE_FREQ: Record<string, number> = {
  // Octave 1
  C1: 32.70, Cs1: 34.65, Db1: 34.65, D1: 36.71, Ds1: 38.89, Eb1: 38.89, E1: 41.20, Es1: 43.65, F1: 43.65, Fs1: 46.25, Gb1: 46.25, G1: 49.00, Gs1: 51.91, Ab1: 51.91, A1: 55.00, As1: 58.27, Bb1: 58.27, B1: 61.74, Bs1: 65.41,
  // Octave 2
  C2: 65.41, Cs2: 69.30, Db2: 69.30, D2: 73.42, Ds2: 77.78, Eb2: 77.78, E2: 82.41, Es2: 87.31, F2: 87.31, Fs2: 92.50, Gb2: 92.50, G2: 98.00, Gs2: 103.83, Ab2: 103.83, A2: 110.00, As2: 116.54, Bb2: 116.54, B2: 123.47, Bs2: 130.81,
  // Octave 3
  C3: 130.81, Cs3: 138.59, Db3: 138.59, D3: 146.83, Ds3: 155.56, Eb3: 155.56, E3: 164.81, Es3: 174.61, F3: 174.61, Fs3: 185.00, Gb3: 185.00, G3: 196.00, Gs3: 207.65, Ab3: 207.65, A3: 220.00, As3: 233.08, Bb3: 233.08, B3: 246.94, Bs3: 261.63,
  // Octave 4
  C4: 261.63, Cs4: 277.18, Db4: 277.18, D4: 293.66, Ds4: 311.13, Eb4: 311.13, E4: 329.63, Es4: 349.23, F4: 349.23, Fs4: 369.99, Gb4: 369.99, G4: 392.00, Gs4: 415.30, Ab4: 415.30, A4: 440.00, As4: 466.16, Bb4: 466.16, B4: 493.88, Bs4: 523.25,
  // Octave 5
  C5: 523.25, Cs5: 554.37, Db5: 554.37, D5: 587.33, Ds5: 622.25, Eb5: 622.25, E5: 659.25, Es5: 698.46, F5: 698.46, Fs5: 739.99, Gb5: 739.99, G5: 783.99, Gs5: 830.61, Ab5: 830.61, A5: 880.00, As5: 932.33, Bb5: 932.33, B5: 987.77, Bs5: 1046.50,
  // Octave 6
  C6: 1046.50, Cs6: 1108.73, Db6: 1108.73, D6: 1174.66, Ds6: 1244.51, Eb6: 1244.51, E6: 1318.51, F6: 1396.91, Fs6: 1479.98, Gb6: 1479.98, G6: 1567.98, Gs6: 1661.22, Ab6: 1661.22, A6: 1760.00, As6: 1864.66, Bb6: 1864.66, B6: 1975.53,
  // Rest
  REST: 0,
};

export function getFreq(name: string): number {
  if (!name || name === 'REST' || name === '-') return 0;
  if (name === 'B#3' || name === 'Bs3') return 261.63;
  if (name === 'B#4' || name === 'Bs4') return 523.25;
  if (name === 'B#2' || name === 'Bs2') return 130.81;
  const normalized = name.replace('#', 's');
  return NOTE_FREQ[normalized] || NOTE_FREQ[name] || 0;
}

function createNoiseBuffer(ctx: BaseAudioContext, seconds = 4.0): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.ceil(sampleRate * seconds);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

// ============================================================================
// 1. ANALOG SYNTH VOICES WITH MIDNIGHT TAPE VOICING
// ============================================================================

/**
 * VOICE 1 (LEAD):
 * Soft blooming envelope (0.085s attack, 1.1s release on non-battle tracks)
 * + 0.32 Hz sine LFO tape wow/flutter (±3.5 cents)
 * + 420ms stereo tape delay with 1100Hz LPF feedback loop and 0.38 feedback gain.
 */
export function synthVoice1Lead(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  dur: number,
  freq: number,
  vol = 0.5,
  prevFreq?: number,
  addDelay = true,
  delayGain = 0.38,
  isBattle = false,
) {
  if (freq <= 0 || dur <= 0.01) return;

  const actualDur = dur * 0.94;
  const attackTime = isBattle ? 0.02 : 0.085;
  const releaseTail = isBattle ? 0.04 : 1.1;

  const oscTri = ctx.createOscillator();
  const oscSaw = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  oscTri.type = 'triangle';
  oscSaw.type = 'sawtooth';
  oscSaw.detune.setValueAtTime(5, time);

  // Analog Tape Wow/Flutter: 0.32 Hz sine LFO, ±3.5 cents pitch modulation
  const wowLfo = ctx.createOscillator();
  const wowGain = ctx.createGain();
  wowLfo.type = 'sine';
  wowLfo.frequency.setValueAtTime(0.32, time);
  wowGain.gain.setValueAtTime(3.5, time);
  wowLfo.connect(wowGain);
  wowGain.connect(oscTri.detune);
  wowGain.connect(oscSaw.detune);
  wowLfo.start(time);
  wowLfo.stop(time + actualDur + releaseTail + 0.05);

  if (prevFreq && prevFreq > 0 && Math.abs(prevFreq - freq) > 5) {
    oscTri.frequency.setValueAtTime(prevFreq, time);
    oscTri.frequency.exponentialRampToValueAtTime(freq, time + 0.035);
    oscSaw.frequency.setValueAtTime(prevFreq, time);
    oscSaw.frequency.exponentialRampToValueAtTime(freq, time + 0.035);
  } else {
    oscTri.frequency.setValueAtTime(freq, time);
    oscSaw.frequency.setValueAtTime(freq, time);
  }

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, time);
  filter.frequency.exponentialRampToValueAtTime(1100, time + actualDur);
  filter.Q.setValueAtTime(1.1, time);

  if (actualDur > 0.3) {
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(4.6, time);
    lfoGain.gain.setValueAtTime(0, time);
    lfoGain.gain.setValueAtTime(0, time + 0.12);
    lfoGain.gain.linearRampToValueAtTime(freq * 0.007, time + 0.26);
    lfo.connect(lfoGain);
    lfoGain.connect(oscTri.frequency);
    lfoGain.connect(oscSaw.frequency);
    lfo.start(time + 0.1);
    lfo.stop(time + actualDur);
  }

  const peak = vol * 0.32;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(peak, time + attackTime);
  gain.gain.setValueAtTime(peak * 0.88, time + actualDur);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + actualDur + releaseTail);

  oscTri.connect(filter);
  oscSaw.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  oscTri.start(time);
  oscSaw.start(time);
  oscTri.stop(time + actualDur + releaseTail + 0.05);
  oscSaw.stop(time + actualDur + releaseTail + 0.05);

  // Stereo Tape Delay: 420ms delay, 1100Hz LPF feedback loop, 0.38 feedback gain
  if (addDelay && actualDur > 0.05) {
    const delayTime = time + 0.420;
    const delayDur = Math.max(0.08, actualDur);

    const dOsc = ctx.createOscillator();
    const dGain = ctx.createGain();
    const dFilter = ctx.createBiquadFilter();

    dOsc.type = 'triangle';
    dOsc.frequency.setValueAtTime(freq, delayTime);

    // Tape wow on delay line
    const dWow = ctx.createOscillator();
    const dWowGain = ctx.createGain();
    dWow.type = 'sine';
    dWow.frequency.setValueAtTime(0.32, delayTime);
    dWowGain.gain.setValueAtTime(3.5, delayTime);
    dWow.connect(dWowGain);
    dWowGain.connect(dOsc.detune);
    dWow.start(delayTime);
    dWow.stop(delayTime + delayDur + releaseTail + 0.05);

    dFilter.type = 'lowpass';
    dFilter.frequency.setValueAtTime(1100, delayTime);

    const dPeak = peak * (delayGain || 0.38);
    dGain.gain.setValueAtTime(0.0001, delayTime);
    dGain.gain.linearRampToValueAtTime(dPeak, delayTime + attackTime);
    dGain.gain.setValueAtTime(dPeak * 0.88, delayTime + delayDur);
    dGain.gain.exponentialRampToValueAtTime(0.0001, delayTime + delayDur + releaseTail);

    dOsc.connect(dFilter);
    dFilter.connect(dGain);
    dGain.connect(dest);

    dOsc.start(delayTime);
    dOsc.stop(delayTime + delayDur + releaseTail + 0.05);

    // Feedback tap at 840ms with 0.38 feedback gain multiplier
    const delayTime2 = time + 0.840;
    const dOsc2 = ctx.createOscillator();
    const dGain2 = ctx.createGain();
    const dFilter2 = ctx.createBiquadFilter();

    dOsc2.type = 'triangle';
    dOsc2.frequency.setValueAtTime(freq, delayTime2);
    dFilter2.type = 'lowpass';
    dFilter2.frequency.setValueAtTime(1100, delayTime2);

    const dPeak2 = dPeak * 0.38;
    dGain2.gain.setValueAtTime(0.0001, delayTime2);
    dGain2.gain.linearRampToValueAtTime(dPeak2, delayTime2 + attackTime);
    dGain2.gain.setValueAtTime(dPeak2 * 0.88, delayTime2 + delayDur);
    dGain2.gain.exponentialRampToValueAtTime(0.0001, delayTime2 + delayDur + releaseTail);

    dOsc2.connect(dFilter2);
    dFilter2.connect(dGain2);
    dGain2.connect(dest);

    dOsc2.start(delayTime2);
    dOsc2.stop(delayTime2 + delayDur + releaseTail + 0.05);
  }
}

export const synthOutrunLead = synthVoice1Lead;
export const synthHeroicLead = synthVoice1Lead;
export const synthLead = synthVoice1Lead;
export const synthDebussyLead = synthVoice1Lead;
export const synthVangelisLead = synthVoice1Lead;

/**
 * VOICE 2 (PAD / CHORDS):
 * Lush warm poly-synth pad with soft blooming ADSR (0.085s attack, 1.1s release tail)
 * and 0.32 Hz sine tape wow/flutter (±3.5 cents).
 */
export function synthVoice2Pad(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  dur: number,
  freq: number,
  vol = 0.3,
  filterCutoff = 1400,
  isBattle = false,
) {
  if (freq <= 0 || dur <= 0.01) return;

  const actualDur = dur * 0.96;
  const attackTime = isBattle ? 0.04 : 0.085;
  const releaseTail = isBattle ? 0.05 : 1.1;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(freq, time);
  osc1.detune.setValueAtTime(-5, time);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq, time);
  osc2.detune.setValueAtTime(5, time);

  // Analog Tape Wow/Flutter: 0.32 Hz sine LFO, ±3.5 cents depth
  const wowLfo = ctx.createOscillator();
  const wowGain = ctx.createGain();
  wowLfo.type = 'sine';
  wowLfo.frequency.setValueAtTime(0.32, time);
  wowGain.gain.setValueAtTime(3.5, time);
  wowLfo.connect(wowGain);
  wowGain.connect(osc1.detune);
  wowGain.connect(osc2.detune);
  wowLfo.start(time);
  wowLfo.stop(time + actualDur + releaseTail + 0.05);

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(4.2, time);
  lfoGain.gain.setValueAtTime(freq * 0.005, time);
  lfo.connect(lfoGain);
  lfoGain.connect(osc1.frequency);
  lfoGain.connect(osc2.frequency);
  lfo.start(time);
  lfo.stop(time + actualDur + releaseTail);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterCutoff, time);
  filter.Q.setValueAtTime(1.0, time);

  const peak = vol * 0.25;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(peak, time + attackTime);
  gain.gain.setValueAtTime(peak * 0.9, time + actualDur);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + actualDur + releaseTail);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + actualDur + releaseTail + 0.05);
  osc2.stop(time + actualDur + releaseTail + 0.05);
}

export const synthJunoChorusPad = synthVoice2Pad;
export const synthAnalogPad = synthVoice2Pad;
export const synthWarmPad = synthVoice2Pad;
export const synthWendyCarlosBrass = synthVoice2Pad;

/**
 * VOICE 2 (ELECTRIC PIANO / BELL TONE):
 * Bell-like warm Rhodes/electric piano tone with sweet chime overtone and tape drift.
 */
export function synthElectricPiano(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  dur: number,
  freq: number,
  vol = 0.35,
  isBattle = false,
) {
  if (freq <= 0 || dur <= 0.01) return;
  const actualDur = dur * 0.95;
  const attackTime = isBattle ? 0.008 : 0.085;
  const releaseTail = isBattle ? 0.05 : 1.1;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, time);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq * 2, time);
  osc2.detune.setValueAtTime(3, time);

  // Analog Tape Wow/Flutter: 0.32 Hz sine LFO, ±3.5 cents depth
  const wowLfo = ctx.createOscillator();
  const wowGain = ctx.createGain();
  wowLfo.type = 'sine';
  wowLfo.frequency.setValueAtTime(0.32, time);
  wowGain.gain.setValueAtTime(3.5, time);
  wowLfo.connect(wowGain);
  wowGain.connect(osc1.detune);
  wowGain.connect(osc2.detune);
  wowLfo.start(time);
  wowLfo.stop(time + actualDur + releaseTail + 0.05);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, time);
  filter.frequency.exponentialRampToValueAtTime(650, time + actualDur);

  const peak = vol * 0.28;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(peak, time + attackTime);
  gain.gain.exponentialRampToValueAtTime(peak * 0.38, time + actualDur * 0.45);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + actualDur + releaseTail);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + actualDur + releaseTail + 0.05);
  osc2.stop(time + actualDur + releaseTail + 0.05);
}

export const synthRhodesEP = synthElectricPiano;

/**
 * VOICE 2 (ARPEGGIATOR / PLUCK):
 * Musical plucks/arpeggios with blooming ADSR (0.085s attack, 1.1s release on non-battle tracks)
 * and 0.32 Hz tape wow/flutter (±3.5 cents).
 */
export function synthVoice2Arp(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  dur: number,
  freq: number,
  vol = 0.35,
  filterCutoff = 1500,
  addExtraDelay = false,
  isBattle = false,
) {
  if (freq <= 0 || dur <= 0.01) return;

  const actualDur = dur * 0.9;
  const attackTime = isBattle ? 0.005 : 0.085;
  const releaseTail = isBattle ? 0.04 : 1.1;

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(freq, time);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(freq, time);
  osc2.detune.setValueAtTime(4, time);

  // Analog Tape Wow/Flutter: 0.32 Hz sine LFO, ±3.5 cents depth
  const wowLfo = ctx.createOscillator();
  const wowGain = ctx.createGain();
  wowLfo.type = 'sine';
  wowLfo.frequency.setValueAtTime(0.32, time);
  wowGain.gain.setValueAtTime(3.5, time);
  wowLfo.connect(wowGain);
  wowGain.connect(osc1.detune);
  wowGain.connect(osc2.detune);
  wowLfo.start(time);
  wowLfo.stop(time + actualDur + releaseTail + 0.05);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterCutoff, time);
  filter.frequency.exponentialRampToValueAtTime(filterCutoff * 0.5, time + actualDur);
  filter.Q.setValueAtTime(1.6, time);

  const peak = vol * 0.26;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(peak, time + attackTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + actualDur + releaseTail);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + actualDur + releaseTail + 0.05);
  osc2.stop(time + actualDur + releaseTail + 0.05);

  if (addExtraDelay) {
    const delayTime = time + 0.420;
    const dOsc = ctx.createOscillator();
    const dGain = ctx.createGain();
    const dFilter = ctx.createBiquadFilter();

    dOsc.type = 'triangle';
    dOsc.frequency.setValueAtTime(freq, delayTime);
    dFilter.type = 'lowpass';
    dFilter.frequency.setValueAtTime(1100, delayTime);

    dGain.gain.setValueAtTime(0.0001, delayTime);
    dGain.gain.linearRampToValueAtTime(peak * 0.38, delayTime + attackTime);
    dGain.gain.exponentialRampToValueAtTime(0.0001, delayTime + actualDur + releaseTail);

    dOsc.connect(dFilter);
    dFilter.connect(dGain);
    dGain.connect(dest);

    dOsc.start(delayTime);
    dOsc.stop(delayTime + actualDur + releaseTail + 0.05);
  }
}

export const synthBachArp = synthVoice2Arp;
export const synthArp = synthVoice2Arp;
export const synthChipArp = synthVoice2Arp;
export const synthMoonlightArp = synthVoice2Arp;
export const synthBachFanfareArp = synthVoice2Arp;
export const synthGlassBell = synthVoice2Arp;

/**
 * VOICE 3 (BASS):
 * Deep, smooth analog saw/sub bass with warmth. Smooth rolling 8th-note waves or sustained sub-bass swells.
 */
export function synthVoice3Bass(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  dur: number,
  freq: number,
  vol = 0.85,
  filterCutoff = 220,
  octaveDouble = false,
) {
  if (freq <= 0 || dur <= 0.01) return;

  const actualDur = dur * 0.92;
  const oscSaw = ctx.createOscillator();
  const oscSub = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  oscSaw.type = 'sawtooth';
  oscSaw.frequency.setValueAtTime(freq, time);

  oscSub.type = 'sine';
  oscSub.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterCutoff, time);
  filter.frequency.exponentialRampToValueAtTime(filterCutoff * 0.65, time + actualDur);
  filter.Q.setValueAtTime(1.6, time);

  const peak = vol * 0.36;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(peak, time + 0.015);
  gain.gain.setValueAtTime(peak * 0.88, time + actualDur * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + actualDur);

  oscSaw.connect(filter);
  oscSub.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  oscSaw.start(time);
  oscSub.start(time);
  oscSaw.stop(time + actualDur + 0.02);
  oscSub.stop(time + actualDur + 0.02);

  if (octaveDouble) {
    const oscOct = ctx.createOscillator();
    const octGain = ctx.createGain();
    oscOct.type = 'sawtooth';
    oscOct.frequency.setValueAtTime(freq * 2, time);
    octGain.gain.setValueAtTime(0.0001, time);
    octGain.gain.linearRampToValueAtTime(peak * 0.45, time + 0.015);
    octGain.gain.exponentialRampToValueAtTime(0.0001, time + actualDur);

    oscOct.connect(filter);
    oscOct.start(time);
    oscOct.stop(time + actualDur + 0.02);
  }
}

export const synthDeepSubBass = synthVoice3Bass;
export const synthOutrunSawBass = synthVoice3Bass;
export const synthBass = synthVoice3Bass;
export const synthBouncyBass = synthVoice3Bass;
export const synthStaccatoPizz = synthVoice3Bass;
export const synthVivaldiPrestoBass = synthVoice3Bass;

/**
 * VOICE 4 (DRUMS):
 * Warm heartbeat kick, brushed/tight snare, and soft hats.
 */
export function synthVoice4Kick(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  vol = 0.85,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(115, time);
  osc.frequency.exponentialRampToValueAtTime(36, time + 0.075);

  gain.gain.setValueAtTime(vol * 0.88, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);

  const click = ctx.createOscillator();
  const clickGain = ctx.createGain();
  click.type = 'triangle';
  click.frequency.setValueAtTime(300, time);
  click.frequency.exponentialRampToValueAtTime(55, time + 0.012);
  clickGain.gain.setValueAtTime(vol * 0.25, time);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.014);

  click.connect(clickGain);
  clickGain.connect(dest);
  click.start(time);
  click.stop(time + 0.02);

  osc.connect(gain);
  gain.connect(dest);
  osc.start(time);
  osc.stop(time + 0.24);
}

export const synthPunchyKick = synthVoice4Kick;
export const synthKick = synthVoice4Kick;

export function synthVoice4Snare(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  vol = 0.65,
  noiseBuf?: AudioBuffer,
) {
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(70, time + 0.05);

  oscGain.gain.setValueAtTime(vol * 0.42, time);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);

  osc.connect(oscGain);
  oscGain.connect(dest);
  osc.start(time);
  osc.stop(time + 0.08);

  if (noiseBuf) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1900, time);
    bp.Q.setValueAtTime(0.9, time);

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(550, time);

    const noiseGain = ctx.createGain();
    const peak = vol * 0.62;
    noiseGain.gain.setValueAtTime(0.0001, time);
    noiseGain.gain.linearRampToValueAtTime(peak, time + 0.003);
    noiseGain.gain.setValueAtTime(peak * 0.68, time + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);

    src.connect(hp);
    hp.connect(bp);
    bp.connect(noiseGain);
    noiseGain.connect(dest);

    src.start(time);
    src.stop(time + 0.12);
  }
}

export const synthGatedSnare = synthVoice4Snare;
export const synthSnappySnare = synthVoice4Snare;
export const synthSnare = synthVoice4Snare;
export const synthBrushedSnare = synthVoice4Snare;

export function synthVoice4Hat(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  vol = 0.25,
  noiseBuf?: AudioBuffer,
  open = false,
) {
  if (!noiseBuf) return;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(7000, time);

  const gain = ctx.createGain();
  const dur = open ? 0.12 : 0.035;
  gain.gain.setValueAtTime(vol * (open ? 0.32 : 0.22), time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  src.connect(hp);
  hp.connect(gain);
  gain.connect(dest);

  src.start(time);
  src.stop(time + dur + 0.01);
}

export const synthHiHat = synthVoice4Hat;
export const synthHat = synthVoice4Hat;

/**
 * OCEAN SURF PINK NOISE SWELL
 */
export function synthOceanSurf(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  dur: number,
  noiseBuf?: AudioBuffer,
  vol = 0.09,
) {
  if (!noiseBuf) return;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.setValueAtTime(0.85, time);

  const gain = ctx.createGain();

  const riseDur = dur * 0.38;
  filter.frequency.setValueAtTime(170, time);
  filter.frequency.exponentialRampToValueAtTime(780, time + riseDur);
  filter.frequency.exponentialRampToValueAtTime(150, time + dur);

  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(vol * 0.14, time + riseDur);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(dest);

  src.start(time);
  src.stop(time + dur + 0.05);
}

export function synthAmbientSwell(
  ctx: BaseAudioContext,
  dest: AudioNode,
  time: number,
  dur: number,
  noiseBuf?: AudioBuffer,
  vol = 0.05,
) {
  if (!noiseBuf) return;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuf;

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(450, time);
  lp.frequency.linearRampToValueAtTime(900, time + dur * 0.5);
  lp.frequency.linearRampToValueAtTime(400, time + dur);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(vol * 0.08, time + dur * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

  src.connect(lp);
  lp.connect(gain);
  gain.connect(dest);

  src.start(time);
  src.stop(time + dur + 0.05);
}

// ============================================================================
// 2. MIXER & VELVET PERCUSSION FILTER ROUTING
// ============================================================================

export type StepNote =
  | [step: number, dur: number, note: string]
  | [step: number, dur: number, note: string, vol: number];

function setupSidechainMixer(
  ctx: BaseAudioContext,
  destBed: AudioNode,
  kickSteps: number[],
  stepSec: number,
  totalSteps: number,
  isHalfTime = false,
  isOverworldOrInterior = false,
): { sidechainGain: GainNode; drumBus: GainNode } {
  const sidechainGain = ctx.createGain();
  const drumBus = ctx.createGain();

  sidechainGain.gain.setValueAtTime(1.0, 0);

  // Velvet Percussion: Route Voice 4 (Drums) during Overworld through 850Hz 12dB LPF
  if (isOverworldOrInterior) {
    drumBus.gain.setValueAtTime(0.75, 0);
    const drumFilter = ctx.createBiquadFilter();
    drumFilter.type = 'lowpass';
    drumFilter.frequency.setValueAtTime(850, 0);
    drumFilter.Q.setValueAtTime(0.707, 0);
    drumBus.connect(drumFilter);
    drumFilter.connect(destBed);
  } else {
    drumBus.gain.setValueAtTime(1.0, 0);
    drumBus.connect(destBed);
  }

  sidechainGain.connect(destBed);

  for (let s = 0; s < totalSteps; s++) {
    const stepInBar = s % 16;
    if (kickSteps.includes(stepInBar)) {
      const t = s * stepSec;
      sidechainGain.gain.setValueAtTime(1.0, t);
      const dipLevel = isHalfTime ? 0.45 : 0.28;
      const recoveryTime = isHalfTime ? 0.22 : 0.16;
      sidechainGain.gain.linearRampToValueAtTime(dipLevel, t + 0.016);
      sidechainGain.gain.exponentialRampToValueAtTime(1.0, t + recoveryTime);
    }
  }

  return { sidechainGain, drumBus };
}

export interface StemTrackBuffers {
  lead: AudioBuffer;
  bed: AudioBuffer;
  bpm: number;
}

interface TrackDef {
  bpm: number;
  bars: number;
  steps: number;
  render: (ctx: BaseAudioContext, destLead: AudioNode, destBed: AudioNode, noiseBuf: AudioBuffer) => void;
}

// ============================================================================
// 3. THE 9 GEOGRAPHY-BASED COMPOSITIONS (WITH SEPARATED STEMS & CAESURA)
// ============================================================================

/**
 * 1. HARBOR (Screen 1 & Title): "Lanterns on the Pier"
 * Debussy "Rêverie" / Pentatonic Wave Motif, 74 BPM, Fmaj7 / Dm9.
 */
function renderHarborLanterns(
  ctx: BaseAudioContext,
  destLead: AudioNode,
  destBed: AudioNode,
  noiseBuf: AudioBuffer,
) {
  const bpm = 74;
  const bars = 24;
  const beatSec = 60 / bpm;
  const stepSec = beatSec / 4;
  const totalSteps = bars * 16;

  const mixer = setupSidechainMixer(ctx, destBed, [0, 8], stepSec, totalSteps, true, true);

  // Drums
  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    synthVoice4Kick(ctx, mixer.drumBus, bStart * stepSec, 0.65);
    synthVoice4Kick(ctx, mixer.drumBus, (bStart + 8) * stepSec, 0.5);
    synthVoice4Snare(ctx, mixer.drumBus, (bStart + 4) * stepSec, 0.28, noiseBuf);
    synthVoice4Snare(ctx, mixer.drumBus, (bStart + 12) * stepSec, 0.28, noiseBuf);
    for (let s = 0; s < 16; s += 2) {
      synthVoice4Hat(ctx, mixer.drumBus, (bStart + s) * stepSec, s % 4 === 0 ? 0.18 : 0.1, noiseBuf);
    }
  }

  const harborChords = [
    { bass: 'F1', pad: ['A3', 'C4', 'E4'], name: 'Fmaj7' },
    { bass: 'F2', pad: ['A3', 'C4', 'E4'], name: 'Fmaj7' },
    { bass: 'D2', pad: ['F3', 'A3', 'C4', 'E4'], name: 'Dm9' },
    { bass: 'D2', pad: ['F3', 'A3', 'C4', 'E4'], name: 'Dm9' },
    { bass: 'Bb1', pad: ['D3', 'F3', 'A3', 'C4'], name: 'Bbmaj7' },
    { bass: 'Bb1', pad: ['D3', 'F3', 'A3', 'C4'], name: 'Bbmaj7' },
    { bass: 'C2', pad: ['E3', 'G3', 'C4', 'D4'], name: 'Cadd9' },
    { bass: 'C2', pad: ['E3', 'G3', 'C4', 'D4'], name: 'Cadd9' },
  ];

  const wavePattern = ['F3', 'A3', 'C4', 'D4', 'E4', 'D4', 'C4', 'A3', 'F3', 'G3', 'C4', 'D4', 'C4', 'A3', 'G3', 'F3'];

  for (let bar = 0; bar < bars; bar++) {
    const chord = harborChords[bar % 8];
    const bStart = bar * 16;

    // Bass (Voice 3) -> destBed
    const bFreq = getFreq(chord.bass);
    if (bFreq > 0) {
      synthVoice3Bass(ctx, mixer.sidechainGain, bStart * stepSec, beatSec * 3.8, bFreq, 0.78, 190);
      synthVoice3Bass(ctx, mixer.sidechainGain, (bStart + 8) * stepSec, beatSec * 1.8, bFreq * 1.5, 0.42, 210);
    }

    // Juno Pads (Voice 2) -> destBed
    for (const pNote of chord.pad) {
      const pFreq = getFreq(pNote);
      if (pFreq > 0) {
        synthVoice2Pad(ctx, mixer.sidechainGain, bStart * stepSec, 15 * stepSec, pFreq, 0.28, 1400, false);
      }
    }

    // Wave Arp (Voice 2) -> destBed
    for (let s = 0; s < 16; s++) {
      const aFreq = getFreq(wavePattern[s % wavePattern.length]);
      if (aFreq > 0) {
        synthVoice2Arp(ctx, mixer.sidechainGain, (bStart + s) * stepSec, stepSec, aFreq, 0.24, 1500, true, false);
      }
    }
  }

  // Debussy "Rêverie" Lead Melody (Voice 1) -> destLead
  const reverieMelody: StepNote[] = [
    [0, 6, 'A4'], [6, 6, 'C5'], [12, 8, 'D5'], [20, 4, 'C5'], [24, 4, 'A4'],
    [28, 6, 'G4'], [34, 2, 'F4'], [36, 8, 'G4'], [44, 12, 'A4'], [56, 8, 'REST'],
    [96, 6, 'C5'], [102, 6, 'D5'], [108, 8, 'F5'], [116, 4, 'E5'], [120, 4, 'D5'],
    [124, 6, 'C5'], [130, 2, 'A4'], [132, 8, 'C5'], [140, 12, 'D5'], [152, 8, 'REST'],
    [192, 6, 'F5'], [198, 6, 'D5'], [204, 4, 'C5'], [208, 4, 'A4'], [212, 4, 'G4'], [216, 4, 'F4'],
    [220, 8, 'G4'], [228, 8, 'A4'], [236, 16, 'D4'], [252, 4, 'REST'],
    [288, 6, 'A4'], [294, 6, 'C5'], [300, 8, 'D5'], [308, 4, 'C5'], [312, 4, 'A4'],
    [316, 6, 'G4'], [322, 2, 'F4'], [324, 8, 'G4'], [332, 16, 'F4'],
  ];

  let prevFreq = 0;
  for (const n of reverieMelody) {
    const freq = getFreq(n[2]);
    if (freq > 0) {
      synthVoice1Lead(ctx, destLead, n[0] * stepSec, n[1] * stepSec, freq, 0.52, prevFreq, true, 0.38, false);
      prevFreq = freq;
    } else {
      prevFreq = 0;
    }
  }
}

/**
 * 2. TOWN (Screen 2): "Midnight Boulevard"
 * Erik Satie "Gymnopédie No. 1", 78 BPM, D Dorian.
 */
function renderTownMidnightBoulevard(
  ctx: BaseAudioContext,
  destLead: AudioNode,
  destBed: AudioNode,
  noiseBuf: AudioBuffer,
) {
  const bpm = 78;
  const bars = 24;
  const beatSec = 60 / bpm;
  const stepSec = beatSec / 4;
  const totalSteps = bars * 16;

  const mixer = setupSidechainMixer(ctx, destBed, [0, 8], stepSec, totalSteps, false, true);

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    synthVoice4Kick(ctx, mixer.drumBus, bStart * stepSec, 0.72);
    synthVoice4Kick(ctx, mixer.drumBus, (bStart + 8) * stepSec, 0.6);
    synthVoice4Snare(ctx, mixer.drumBus, (bStart + 4) * stepSec, 0.42, noiseBuf);
    synthVoice4Snare(ctx, mixer.drumBus, (bStart + 12) * stepSec, 0.42, noiseBuf);
    for (let s = 0; s < 16; s++) {
      synthVoice4Hat(ctx, mixer.drumBus, (bStart + s) * stepSec, s % 4 === 0 ? 0.18 : 0.11, noiseBuf);
    }
  }

  const satieTownChords = [
    { bass: 'G1', pad: ['B3', 'D4', 'Fs4'], arp: ['G3', 'B3', 'D4', 'Fs4'] },
    { bass: 'G2', pad: ['B3', 'D4', 'Fs4'], arp: ['B3', 'D4', 'Fs4', 'B4'] },
    { bass: 'D2', pad: ['A3', 'Cs4', 'Fs4'], arp: ['D3', 'A3', 'Cs4', 'Fs4'] },
    { bass: 'D2', pad: ['A3', 'Cs4', 'Fs4'], arp: ['A3', 'Cs4', 'Fs4', 'A4'] },
    { bass: 'E2', pad: ['G3', 'B3', 'D4', 'Fs4'], arp: ['E3', 'G3', 'B3', 'Fs4'] },
    { bass: 'E2', pad: ['G3', 'B3', 'D4', 'Fs4'], arp: ['G3', 'B3', 'D4', 'Fs4'] },
    { bass: 'D2', pad: ['A3', 'Cs4', 'Fs4'], arp: ['D3', 'A3', 'Cs4', 'Fs4'] },
    { bass: 'A1', pad: ['G3', 'A3', 'D4', 'E4'], arp: ['A3', 'D4', 'E4', 'G4'] },
  ];

  for (let bar = 0; bar < bars; bar++) {
    const chord = satieTownChords[bar % 8];
    const bStart = bar * 16;

    const bFreq = getFreq(chord.bass);
    if (bFreq > 0) {
      synthVoice3Bass(ctx, mixer.sidechainGain, bStart * stepSec, beatSec * 3.8, bFreq, 0.78, 200);
      synthVoice3Bass(ctx, mixer.sidechainGain, (bStart + 8) * stepSec, beatSec * 1.8, bFreq * 1.5, 0.45, 220);
    }

    for (const pNote of chord.pad) {
      const pFreq = getFreq(pNote);
      if (pFreq > 0) {
        synthVoice2Pad(ctx, mixer.sidechainGain, bStart * stepSec, 15 * stepSec, pFreq, 0.28, 1350, false);
      }
    }

    for (let s = 0; s < 16; s++) {
      const aFreq = getFreq(chord.arp[s % chord.arp.length]);
      if (aFreq > 0) {
        synthVoice2Arp(ctx, mixer.sidechainGain, (bStart + s) * stepSec, stepSec, aFreq, 0.24, 1400, false, false);
      }
    }
  }

  // Lead Melody -> destLead
  const satieTownMelody: StepNote[] = [
    [4, 4, 'Fs4'], [8, 4, 'A4'], [12, 8, 'B4'], [20, 4, 'A4'], [24, 4, 'Fs4'],
    [28, 4, 'E4'], [32, 8, 'D4'], [40, 4, 'Fs4'], [44, 12, 'E4'], [56, 8, 'REST'],
    [100, 4, 'Fs4'], [104, 4, 'A4'], [108, 8, 'B4'], [116, 4, 'A4'], [120, 4, 'Fs4'],
    [124, 4, 'E4'], [128, 8, 'D4'], [136, 4, 'Fs4'], [140, 16, 'D4'], [156, 4, 'REST'],
    [196, 4, 'B4'], [200, 4, 'Cs5'], [204, 8, 'D5'], [212, 4, 'Cs5'], [216, 4, 'B4'],
    [220, 4, 'A4'], [224, 8, 'Fs4'], [232, 4, 'A4'], [236, 12, 'B4'], [248, 8, 'REST'],
    [292, 4, 'Fs4'], [296, 4, 'A4'], [300, 8, 'B4'], [308, 4, 'A4'], [312, 4, 'Fs4'],
    [316, 4, 'E4'], [320, 8, 'Fs4'], [328, 4, 'E4'], [332, 16, 'D4'],
  ];

  let prevFreq = 0;
  for (const n of satieTownMelody) {
    const freq = getFreq(n[2]);
    if (freq > 0) {
      synthVoice1Lead(ctx, destLead, n[0] * stepSec, n[1] * stepSec, freq, 0.5, prevFreq, true, 0.38, false);
      prevFreq = freq;
    } else {
      prevFreq = 0;
    }
  }

  synthAmbientSwell(ctx, mixer.drumBus, 0, totalSteps * stepSec, noiseBuf, 0.05);
}

/**
 * 3. CLIFFS (Screen 3): "Andalusian Sea Breeze"
 * Spanish Dorian pluck motif, 82 BPM.
 */
function renderCliffsAndalusianBreeze(
  ctx: BaseAudioContext,
  destLead: AudioNode,
  destBed: AudioNode,
  noiseBuf: AudioBuffer,
) {
  const bpm = 82;
  const bars = 24;
  const beatSec = 60 / bpm;
  const stepSec = beatSec / 4;
  const totalSteps = bars * 16;

  const mixer = setupSidechainMixer(ctx, destBed, [0, 4, 8, 12], stepSec, totalSteps, false, true);

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    for (let beat = 0; beat < 4; beat++) {
      const step = bStart + beat * 4;
      synthVoice4Kick(ctx, mixer.drumBus, step * stepSec, beat === 0 ? 0.76 : 0.62);
      if (beat === 1 || beat === 3) {
        synthVoice4Snare(ctx, mixer.drumBus, step * stepSec, 0.48, noiseBuf);
      }
    }
    for (let s = 0; s < 16; s++) {
      synthVoice4Hat(ctx, mixer.drumBus, (bStart + s) * stepSec, s % 2 === 0 ? 0.18 : 0.12, noiseBuf);
    }
  }

  const spanishPluckPattern = [
    ['D3', 'A3', 'D4', 'F4', 'A4', 'F4', 'D4', 'A3', 'D4', 'F4', 'A4', 'F4', 'D4', 'A3', 'F3', 'A3'],
    ['E3', 'B3', 'E4', 'G4', 'B4', 'G4', 'E4', 'B3', 'E4', 'G4', 'B4', 'G4', 'E4', 'B3', 'G3', 'B3'],
    ['F3', 'C4', 'F4', 'A4', 'C5', 'A4', 'F4', 'C4', 'F4', 'A4', 'C5', 'A4', 'F4', 'C4', 'A3', 'C4'],
    ['E3', 'B3', 'E4', 'G4', 'B4', 'G4', 'E4', 'B3', 'E4', 'G4', 'B4', 'G4', 'E4', 'B3', 'G3', 'E3'],
  ];
  const spanishBasses = ['D2', 'E2', 'F2', 'E2'];

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    const pattern = spanishPluckPattern[bar % 4];
    const bassNote = spanishBasses[bar % 4];

    const bFreq = getFreq(bassNote);
    if (bFreq > 0) {
      synthVoice3Bass(ctx, mixer.sidechainGain, bStart * stepSec, beatSec * 3.8, bFreq, 0.8, 220);
      synthVoice3Bass(ctx, mixer.sidechainGain, (bStart + 8) * stepSec, beatSec * 1.8, bFreq * 1.5, 0.45, 230);
    }

    for (let s = 0; s < 16; s++) {
      const pFreq = getFreq(pattern[s]);
      if (pFreq > 0) {
        synthVoice2Arp(ctx, mixer.sidechainGain, (bStart + s) * stepSec, stepSec, pFreq, 0.32, 1400, false, false);
      }
    }
  }

  // Lead Melody -> destLead
  const spanishDorianMelody: StepNote[] = [
    [0, 6, 'A4'], [6, 2, 'C5'], [8, 4, 'B4'], [12, 4, 'G4'], [16, 6, 'A4'], [22, 2, 'F4'],
    [24, 4, 'E4'], [28, 4, 'D4'], [32, 6, 'E4'], [38, 2, 'G4'], [40, 4, 'F4'], [44, 4, 'E4'],
    [48, 12, 'D4'], [60, 4, 'REST'],
    [96, 6, 'D5'], [102, 2, 'C5'], [104, 4, 'B4'], [108, 4, 'G4'], [112, 6, 'A4'], [118, 2, 'B4'],
    [120, 4, 'C5'], [124, 4, 'D5'], [128, 6, 'E5'], [134, 2, 'D5'], [136, 4, 'C5'], [140, 4, 'B4'],
    [144, 12, 'A4'], [156, 4, 'REST'],
    [192, 6, 'A4'], [198, 2, 'C5'], [200, 4, 'B4'], [204, 4, 'G4'], [208, 6, 'A4'], [214, 2, 'F4'],
    [216, 4, 'E4'], [220, 4, 'D4'], [224, 6, 'E4'], [230, 2, 'G4'], [232, 4, 'F4'], [236, 4, 'E4'],
    [240, 12, 'D4'], [252, 4, 'REST'],
    [288, 6, 'F4'], [294, 2, 'G4'], [296, 4, 'A4'], [300, 4, 'B4'], [304, 6, 'C5'], [310, 2, 'B4'],
    [316, 4, 'A4'], [320, 4, 'G4'], [324, 6, 'F4'], [330, 2, 'E4'], [332, 16, 'D4'],
  ];

  let prevFreq = 0;
  for (const n of spanishDorianMelody) {
    const freq = getFreq(n[2]);
    if (freq > 0) {
      synthVoice1Lead(ctx, destLead, n[0] * stepSec, n[1] * stepSec, freq, 0.54, prevFreq, true, 0.38, false);
      prevFreq = freq;
    } else {
      prevFreq = 0;
    }
  }

  synthAmbientSwell(ctx, mixer.drumBus, 0, totalSteps * stepSec, noiseBuf, 0.06);
}

/**
 * 4. RUINS (Screen 4): "Autumn Leaves & Flowing Water"
 * Debussy "Pagodes" / Pure D Minor Pentatonic, 76 BPM.
 */
function renderRuinsAutumnLeaves(
  ctx: BaseAudioContext,
  destLead: AudioNode,
  destBed: AudioNode,
  noiseBuf: AudioBuffer,
) {
  const bpm = 76;
  const bars = 24;
  const beatSec = 60 / bpm;
  const stepSec = beatSec / 4;
  const totalSteps = bars * 16;

  const mixer = setupSidechainMixer(ctx, destBed, [0, 8], stepSec, totalSteps, true, true);

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    synthVoice4Kick(ctx, mixer.drumBus, bStart * stepSec, 0.58);
    synthVoice4Kick(ctx, mixer.drumBus, (bStart + 8) * stepSec, 0.44);
    synthVoice4Snare(ctx, mixer.drumBus, (bStart + 4) * stepSec, 0.24, noiseBuf);
    synthVoice4Snare(ctx, mixer.drumBus, (bStart + 12) * stepSec, 0.24, noiseBuf);
    for (let s = 0; s < 16; s += 2) {
      synthVoice4Hat(ctx, mixer.drumBus, (bStart + s) * stepSec, s % 4 === 0 ? 0.15 : 0.08, noiseBuf);
    }
  }

  const pagodesArp = ['D4', 'F4', 'G4', 'A4', 'C5', 'D5', 'C5', 'A4', 'G4', 'F4', 'D4', 'C4', 'D4', 'F4', 'A4', 'C5'];
  const ruinsChords = [
    { bass: 'D2', pad: ['F3', 'A3', 'C4'] },
    { bass: 'D2', pad: ['F3', 'A3', 'C4'] },
    { bass: 'F2', pad: ['A3', 'C4', 'G4'] },
    { bass: 'F2', pad: ['A3', 'C4', 'G4'] },
    { bass: 'G2', pad: ['C4', 'D4', 'G4'] },
    { bass: 'G2', pad: ['C4', 'D4', 'G4'] },
    { bass: 'D2', pad: ['G3', 'C4', 'F4'] },
    { bass: 'D2', pad: ['F3', 'A3', 'C4'] },
  ];

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    const chord = ruinsChords[bar % 8];

    const bFreq = getFreq(chord.bass);
    if (bFreq > 0) {
      synthVoice3Bass(ctx, mixer.sidechainGain, bStart * stepSec, beatSec * 3.8, bFreq, 0.72, 180);
    }

    for (const pNote of chord.pad) {
      const pFreq = getFreq(pNote);
      if (pFreq > 0) {
        synthVoice2Pad(ctx, mixer.sidechainGain, bStart * stepSec, 15 * stepSec, pFreq, 0.26, 1300, false);
      }
    }

    for (let s = 0; s < 16; s++) {
      const aFreq = getFreq(pagodesArp[s]);
      if (aFreq > 0) {
        synthVoice2Arp(ctx, mixer.sidechainGain, (bStart + s) * stepSec, stepSec, aFreq, 0.26, 1400, true, false);
      }
    }
  }

  // Lead Melody -> destLead
  const pagodesMelody: StepNote[] = [
    [0, 8, 'A4'], [8, 4, 'C5'], [12, 8, 'D5'], [20, 4, 'C5'], [24, 4, 'A4'],
    [28, 6, 'G4'], [34, 2, 'A4'], [36, 8, 'F4'], [44, 12, 'D4'], [56, 8, 'REST'],
    [96, 4, 'F4'], [100, 4, 'G4'], [104, 8, 'A4'], [112, 6, 'C5'], [118, 2, 'A4'],
    [120, 4, 'G4'], [124, 6, 'F4'], [130, 2, 'D4'], [132, 16, 'D4'], [148, 12, 'REST'],
    [192, 8, 'D5'], [200, 4, 'F5'], [204, 8, 'D5'], [212, 4, 'C5'], [216, 4, 'A4'],
    [220, 6, 'C5'], [226, 2, 'A4'], [228, 8, 'G4'], [236, 12, 'A4'], [248, 8, 'REST'],
    [288, 6, 'A4'], [294, 2, 'C5'], [296, 8, 'D5'], [304, 4, 'C5'], [308, 4, 'A4'],
    [312, 6, 'G4'], [318, 2, 'F4'], [320, 8, 'D4'], [328, 16, 'D4'],
  ];

  let prevFreq = 0;
  for (const n of pagodesMelody) {
    const freq = getFreq(n[2]);
    if (freq > 0) {
      synthVoice1Lead(ctx, destLead, n[0] * stepSec, n[1] * stepSec, freq, 0.48, prevFreq, true, 0.38, false);
      prevFreq = freq;
    } else {
      prevFreq = 0;
    }
  }

  synthAmbientSwell(ctx, mixer.drumBus, 0, totalSteps * stepSec, noiseBuf, 0.05);
}

/**
 * 5. TREELINE (Screen 5): "Starlight on Fresh Snow"
 * Gustav Holst "In the Bleak Midwinter", 70 BPM.
 */
function renderTreelineSnowStarlight(
  ctx: BaseAudioContext,
  destLead: AudioNode,
  destBed: AudioNode,
  noiseBuf: AudioBuffer,
) {
  const bpm = 70;
  const bars = 24;
  const beatSec = 60 / bpm;
  const stepSec = beatSec / 4;
  const totalSteps = bars * 16;

  const mixer = setupSidechainMixer(ctx, destBed, [0, 8], stepSec, totalSteps, true, true);

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    synthVoice4Kick(ctx, mixer.drumBus, bStart * stepSec, 0.45);
    synthVoice4Kick(ctx, mixer.drumBus, (bStart + 8) * stepSec, 0.34);
    for (let s = 0; s < 16; s += 4) {
      synthVoice4Hat(ctx, mixer.drumBus, (bStart + s) * stepSec, 0.1, noiseBuf);
    }
  }

  const midwinterChords = [
    { bass: 'F1', pad: ['A3', 'C4', 'F4'] },
    { bass: 'F2', pad: ['A3', 'C4', 'F4'] },
    { bass: 'G1', pad: ['Bb3', 'D4', 'F4'] },
    { bass: 'G2', pad: ['Bb3', 'D4', 'F4'] },
    { bass: 'A1', pad: ['C4', 'F4', 'A4'] },
    { bass: 'Bb1', pad: ['D4', 'F4', 'A4'] },
    { bass: 'C2', pad: ['C4', 'F4', 'A4'] },
    { bass: 'C2', pad: ['G3', 'C4', 'E4'] },
  ];

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    const chord = midwinterChords[bar % 8];

    const bFreq = getFreq(chord.bass);
    if (bFreq > 0) {
      synthVoice3Bass(ctx, mixer.sidechainGain, bStart * stepSec, beatSec * 3.8, bFreq, 0.75, 170);
    }

    for (const pNote of chord.pad) {
      const pFreq = getFreq(pNote);
      if (pFreq > 0) {
        synthElectricPiano(ctx, mixer.sidechainGain, bStart * stepSec, beatSec * 3.8, pFreq, 0.3, false);
        synthVoice2Pad(ctx, mixer.sidechainGain, bStart * stepSec, 15 * stepSec, pFreq, 0.24, 1250, false);
      }
    }

    const starlightNotes = ['C5', 'F5', 'A5', 'C6', 'A5', 'F5', 'G5', 'C6'];
    for (let s = 0; s < 16; s += 2) {
      const sFreq = getFreq(starlightNotes[(s / 2) % starlightNotes.length]);
      if (sFreq > 0) {
        synthVoice2Arp(ctx, mixer.sidechainGain, (bStart + s) * stepSec, stepSec * 2, sFreq, 0.2, 1350, true, false);
      }
    }
  }

  // Lead Melody -> destLead
  const midwinterMelody: StepNote[] = [
    [0, 6, 'A4'], [6, 2, 'A4'], [8, 4, 'G4'], [12, 4, 'F4'], [16, 8, 'G4'], [24, 4, 'G4'], [28, 4, 'A4'],
    [32, 4, 'F4'], [36, 4, 'G4'], [40, 4, 'A4'], [44, 4, 'Bb4'], [48, 8, 'C5'], [56, 4, 'A4'], [60, 4, 'G4'],
    [96, 6, 'F4'], [102, 2, 'A4'], [104, 4, 'G4'], [108, 4, 'F4'], [112, 4, 'G4'], [116, 4, 'A4'], [120, 8, 'F4'],
    [128, 4, 'D4'], [132, 4, 'F4'], [136, 4, 'E4'], [140, 4, 'D4'], [144, 8, 'C4'], [152, 8, 'F4'],
    [192, 6, 'A4'], [198, 2, 'A4'], [200, 4, 'G4'], [204, 4, 'F4'], [208, 8, 'G4'], [216, 4, 'G4'], [220, 4, 'A4'],
    [224, 4, 'F4'], [228, 4, 'G4'], [232, 4, 'A4'], [236, 4, 'Bb4'], [240, 8, 'C5'], [248, 4, 'A4'], [252, 4, 'G4'],
    [288, 6, 'F4'], [294, 2, 'A4'], [296, 4, 'G4'], [300, 4, 'F4'], [304, 4, 'G4'], [308, 4, 'A4'], [312, 8, 'F4'],
    [320, 4, 'D4'], [324, 4, 'F4'], [328, 4, 'E4'], [332, 4, 'D4'], [336, 8, 'C4'], [344, 8, 'F4'],
  ];

  let prevFreq = 0;
  for (const n of midwinterMelody) {
    const freq = getFreq(n[2]);
    if (freq > 0) {
      synthElectricPiano(ctx, destLead, n[0] * stepSec, n[1] * stepSec, freq, 0.52, false);
      synthVoice1Lead(ctx, destLead, n[0] * stepSec, n[1] * stepSec, freq, 0.44, prevFreq, true, 0.38, false);
      prevFreq = freq;
    } else {
      prevFreq = 0;
    }
  }

  synthAmbientSwell(ctx, mixer.drumBus, 0, totalSteps * stepSec, noiseBuf, 0.04);
}

/**
 * 6. SUMMIT (Screen 6): "Above the Sea of Clouds"
 * Maurice Ravel "Pavane pour une infante défunte", 74 BPM.
 */
function renderSummitClouds(
  ctx: BaseAudioContext,
  destLead: AudioNode,
  destBed: AudioNode,
  noiseBuf: AudioBuffer,
) {
  const bpm = 74;
  const bars = 24;
  const beatSec = 60 / bpm;
  const stepSec = beatSec / 4;
  const totalSteps = bars * 16;
  const totalSec = totalSteps * stepSec;

  const mixer = setupSidechainMixer(ctx, destBed, [0, 8], stepSec, totalSteps, true, true);

  synthVoice3Bass(ctx, mixer.sidechainGain, 0, totalSec, getFreq('G1'), 0.88, 140);

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    synthVoice4Kick(ctx, mixer.drumBus, bStart * stepSec, 0.62);
    synthVoice4Kick(ctx, mixer.drumBus, (bStart + 8) * stepSec, 0.5);
    synthVoice4Snare(ctx, mixer.drumBus, (bStart + 4) * stepSec, 0.32, noiseBuf);
    synthVoice4Snare(ctx, mixer.drumBus, (bStart + 12) * stepSec, 0.32, noiseBuf);
    for (let s = 0; s < 16; s += 2) {
      synthVoice4Hat(ctx, mixer.drumBus, (bStart + s) * stepSec, 0.14, noiseBuf);
    }
  }

  const pavaneChords = [
    { bass: 'E2', pad: ['G3', 'B3', 'D4'], name: 'Em7' },
    { bass: 'D2', pad: ['Fs3', 'A3', 'B3'], name: 'D6' },
    { bass: 'C2', pad: ['E3', 'G3', 'B3'], name: 'Cmaj7' },
    { bass: 'B1', pad: ['D3', 'Fs3', 'A3'], name: 'Bm7' },
    { bass: 'A1', pad: ['C3', 'E3', 'G3'], name: 'Am7' },
    { bass: 'G1', pad: ['B2', 'D3', 'Fs3'], name: 'Gmaj7' },
    { bass: 'C2', pad: ['E3', 'G3', 'B3'], name: 'Cmaj7' },
    { bass: 'D2', pad: ['Fs3', 'A3', 'C4'], name: 'D7' },
  ];

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    const chord = pavaneChords[bar % 8];

    const bFreq = getFreq(chord.bass);
    if (bFreq > 0) {
      synthVoice3Bass(ctx, mixer.sidechainGain, bStart * stepSec, beatSec * 3.8, bFreq, 0.8, 220);
      synthVoice3Bass(ctx, mixer.sidechainGain, (bStart + 8) * stepSec, beatSec * 1.8, bFreq * 1.5, 0.42, 230);
    }

    for (const pNote of chord.pad) {
      const pFreq = getFreq(pNote);
      if (pFreq > 0) {
        synthVoice2Pad(ctx, mixer.sidechainGain, bStart * stepSec, 15 * stepSec, pFreq, 0.32, 1400, false);
      }
    }
  }

  // Lead Melody -> destLead
  const pavaneMelody: StepNote[] = [
    [0, 6, 'B4'], [6, 2, 'A4'], [8, 4, 'G4'], [12, 4, 'Fs4'], [16, 8, 'G4'], [24, 4, 'A4'], [28, 4, 'B4'],
    [32, 8, 'D5'], [40, 4, 'B4'], [44, 4, 'G4'], [48, 10, 'A4'], [58, 2, 'G4'], [60, 4, 'Fs4'],
    [96, 12, 'G4'], [108, 4, 'REST'],
    [112, 6, 'G4'], [118, 2, 'A4'], [120, 4, 'B4'], [124, 4, 'C5'], [128, 8, 'B4'], [136, 4, 'A4'], [140, 4, 'G4'],
    [144, 12, 'Fs4'], [156, 4, 'REST'],
    [192, 6, 'B5'], [198, 2, 'A5'], [200, 4, 'G5'], [204, 4, 'Fs5'], [208, 8, 'G5'], [216, 4, 'A5'], [220, 4, 'B5'],
    [224, 8, 'D6'], [232, 4, 'B5'], [236, 4, 'G5'], [240, 10, 'A5'], [250, 2, 'G5'], [252, 4, 'Fs5'],
    [288, 16, 'G5'],
    [304, 4, 'E5'], [308, 4, 'Fs5'], [312, 4, 'G5'], [316, 4, 'A5'], [320, 8, 'B5'], [328, 8, 'A5'], [336, 16, 'G5'],
  ];

  let prevFreq = 0;
  for (const n of pavaneMelody) {
    const freq = getFreq(n[2]);
    if (freq > 0) {
      synthVoice1Lead(ctx, destLead, n[0] * stepSec, n[1] * stepSec, freq, 0.54, prevFreq, true, 0.38, false);
      prevFreq = freq;
    } else {
      prevFreq = 0;
    }
  }

  synthAmbientSwell(ctx, mixer.drumBus, 0, totalSteps * stepSec, noiseBuf, 0.05);
}

/**
 * 7. INTERIORS (All interior rooms & Epilogue): "Velvet Booths & Warm Hearths"
 * 72 BPM, low-passed 750Hz cutoff.
 */
function renderInteriorsVelvetHearths(
  ctx: BaseAudioContext,
  destLead: AudioNode,
  destBed: AudioNode,
  noiseBuf: AudioBuffer,
) {
  const bpm = 72;
  const bars = 24;
  const beatSec = 60 / bpm;
  const stepSec = beatSec / 4;
  const totalSteps = bars * 16;

  const mixer = setupSidechainMixer(ctx, destBed, [0, 8], stepSec, totalSteps, true, true);

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    synthVoice4Kick(ctx, mixer.drumBus, bStart * stepSec, 0.52);
    synthVoice4Kick(ctx, mixer.drumBus, (bStart + 8) * stepSec, 0.4);
    synthVoice4Snare(ctx, mixer.drumBus, (bStart + 4) * stepSec, 0.24, noiseBuf);
    synthVoice4Snare(ctx, mixer.drumBus, (bStart + 12) * stepSec, 0.24, noiseBuf);
    for (let s = 0; s < 16; s += 2) {
      synthVoice4Hat(ctx, mixer.drumBus, (bStart + s) * stepSec, 0.1, noiseBuf);
    }
  }

  const loungeChords = [
    { bass: 'F1', pad: ['A3', 'C4', 'E4'] },
    { bass: 'F2', pad: ['A3', 'C4', 'E4'] },
    { bass: 'E1', pad: ['G3', 'B3', 'D4'] },
    { bass: 'E2', pad: ['G3', 'B3', 'D4'] },
    { bass: 'D2', pad: ['F3', 'A3', 'C4'] },
    { bass: 'D2', pad: ['F3', 'A3', 'C4'] },
    { bass: 'C2', pad: ['E3', 'G3', 'B3'] },
    { bass: 'C2', pad: ['E3', 'G3', 'B3'] },
  ];

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    const chord = loungeChords[bar % 8];

    const bFreq = getFreq(chord.bass);
    if (bFreq > 0) {
      synthVoice3Bass(ctx, mixer.sidechainGain, bStart * stepSec, beatSec * 3.8, bFreq, 0.78, 180);
      synthVoice3Bass(ctx, mixer.sidechainGain, (bStart + 8) * stepSec, beatSec * 1.8, bFreq * 1.5, 0.42, 190);
    }

    for (const pNote of chord.pad) {
      const pFreq = getFreq(pNote);
      if (pFreq > 0) {
        synthElectricPiano(ctx, mixer.sidechainGain, bStart * stepSec, beatSec * 3.8, pFreq, 0.32, false);
        synthVoice2Pad(ctx, mixer.sidechainGain, bStart * stepSec, 15 * stepSec, pFreq, 0.25, 750, false);
      }
    }
  }

  // Lead Melody -> destLead
  const loungeMelody: StepNote[] = [
    [4, 4, 'E4'], [8, 4, 'G4'], [12, 8, 'A4'], [20, 4, 'G4'], [24, 4, 'E4'],
    [28, 4, 'D4'], [32, 8, 'C4'], [40, 4, 'E4'], [44, 12, 'D4'], [56, 8, 'REST'],
    [100, 4, 'E4'], [104, 4, 'G4'], [108, 8, 'A4'], [116, 4, 'B4'], [120, 4, 'C5'],
    [124, 4, 'B4'], [128, 8, 'A4'], [136, 4, 'G4'], [140, 16, 'E4'], [156, 4, 'REST'],
    [196, 4, 'C5'], [200, 4, 'B4'], [204, 8, 'A4'], [212, 4, 'G4'], [216, 4, 'E4'],
    [220, 4, 'D4'], [224, 8, 'E4'], [232, 4, 'D4'], [236, 12, 'C4'], [248, 8, 'REST'],
    [292, 4, 'E4'], [296, 4, 'G4'], [300, 8, 'A4'], [308, 4, 'G4'], [312, 4, 'E4'],
    [316, 4, 'D4'], [320, 8, 'E4'], [328, 4, 'D4'], [332, 16, 'C4'],
  ];

  let prevFreq = 0;
  for (const n of loungeMelody) {
    const freq = getFreq(n[2]);
    if (freq > 0) {
      synthVoice1Lead(ctx, destLead, n[0] * stepSec, n[1] * stepSec, freq, 0.46, prevFreq, true, 0.38, false);
      prevFreq = freq;
    } else {
      prevFreq = 0;
    }
  }

  synthAmbientSwell(ctx, mixer.drumBus, 0, totalSteps * stepSec, noiseBuf, 0.04);
}

/**
 * 8. POET DUELS: Handel "Passacaglia" / Daft Punk "Veridis Quo"
 * Standard Duels: 102 BPM. Summit Boss Duels: 112 BPM.
 */
function renderPoetDuelsPassacaglia(
  ctx: BaseAudioContext,
  destLead: AudioNode,
  destBed: AudioNode,
  noiseBuf: AudioBuffer,
  isBoss = false,
) {
  const bpm = isBoss ? 112 : 102;
  const bars = 16;
  const stepSec = 60 / (bpm * 4);
  const totalSteps = bars * 16;
  const filterCutoff = isBoss ? 2400 : 1600;

  const mixer = setupSidechainMixer(ctx, destBed, [0, 4, 8, 12], stepSec, totalSteps, false, false);

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    for (let beat = 0; beat < 4; beat++) {
      const step = bStart + beat * 4;
      synthVoice4Kick(ctx, mixer.drumBus, step * stepSec, isBoss ? 0.95 : 0.88);
      if (beat === 1 || beat === 3) {
        synthVoice4Snare(ctx, mixer.drumBus, step * stepSec, isBoss ? 0.85 : 0.75, noiseBuf);
      }
    }
    for (let s = 0; s < 16; s++) {
      const isOpen = isBoss ? (s % 2 === 1) : (s === 2 || s === 6 || s === 10 || s === 14);
      synthVoice4Hat(
        ctx,
        mixer.drumBus,
        (bStart + s) * stepSec,
        isOpen ? 0.3 : 0.2,
        noiseBuf,
        isOpen,
      );
    }
  }

  const veridisQuoArps: string[][] = [
    ['D3', 'F3', 'A3', 'D4', 'A3', 'F3', 'D3', 'F3', 'A3', 'D4', 'F4', 'D4', 'A3', 'F3', 'D3', 'A2'],
    ['Bb2', 'D3', 'F3', 'Bb3', 'F3', 'D3', 'Bb2', 'D3', 'F3', 'Bb3', 'D4', 'Bb3', 'F3', 'D3', 'Bb2', 'F2'],
    ['C3', 'E3', 'G3', 'C4', 'G3', 'E3', 'C3', 'E3', 'G3', 'C4', 'E4', 'C4', 'G3', 'E3', 'C3', 'G2'],
    ['A2', 'C3', 'E3', 'A3', 'E3', 'C3', 'A2', 'C3', 'E3', 'A3', 'C4', 'A3', 'E3', 'C3', 'A2', 'E2'],
  ];

  const passacagliaBasses = ['D2', 'Bb1', 'C2', 'A1'];

  for (let bar = 0; bar < bars; bar++) {
    const bStart = bar * 16;
    const arp = veridisQuoArps[bar % 4];
    const bassNote = passacagliaBasses[bar % 4];

    const bFreq = getFreq(bassNote);
    if (bFreq > 0) {
      synthVoice3Bass(
        ctx,
        mixer.sidechainGain,
        bStart * stepSec,
        stepSec * 15,
        bFreq,
        isBoss ? 0.95 : 0.85,
        isBoss ? 260 : 200,
        isBoss,
      );
    }

    for (let s = 0; s < 16; s++) {
      const aFreq = getFreq(arp[s]);
      if (aFreq > 0) {
        synthVoice2Arp(
          ctx,
          mixer.sidechainGain,
          (bStart + s) * stepSec,
          stepSec,
          aFreq,
          isBoss ? 0.42 : 0.35,
          filterCutoff,
          false,
          true,
        );
      }
    }
  }

  // Melodic Counterpoint Lead -> destLead
  const duelLead: StepNote[] = isBoss
    ? [
        [0, 8, 'D5'], [8, 8, 'F5'], [16, 8, 'D5'], [24, 4, 'A4'], [28, 4, 'C5'],
        [32, 8, 'Bb4'], [40, 8, 'D5'], [48, 8, 'Bb4'], [56, 4, 'F4'], [60, 4, 'A4'],
        [64, 8, 'C5'], [72, 8, 'E5'], [80, 8, 'C5'], [88, 4, 'G4'], [92, 4, 'B4'],
        [96, 8, 'A4'], [104, 8, 'C5'], [112, 12, 'A4'], [124, 4, 'REST'],
        [128, 8, 'D6'], [136, 8, 'F6'], [144, 8, 'D6'], [152, 4, 'A5'], [156, 4, 'C6'],
        [160, 8, 'Bb5'], [168, 8, 'D6'], [176, 8, 'Bb5'], [184, 4, 'F5'], [188, 4, 'A5'],
        [192, 8, 'C6'], [200, 8, 'E6'], [208, 8, 'C6'], [216, 4, 'G5'], [220, 4, 'B5'],
        [224, 8, 'A5'], [232, 8, 'C6'], [240, 16, 'D6'],
      ]
    : [
        [0, 8, 'D4'], [8, 8, 'F4'], [16, 8, 'D4'], [24, 4, 'A3'], [28, 4, 'C4'],
        [32, 8, 'Bb3'], [40, 8, 'D4'], [48, 8, 'Bb3'], [56, 4, 'F3'], [60, 4, 'A3'],
        [64, 8, 'C4'], [72, 8, 'E4'], [80, 8, 'C4'], [88, 4, 'G3'], [92, 4, 'B3'],
        [96, 8, 'A3'], [104, 8, 'C4'], [112, 12, 'A3'], [124, 4, 'REST'],
        [128, 8, 'D5'], [136, 8, 'F5'], [144, 8, 'D5'], [152, 4, 'A4'], [156, 4, 'C5'],
        [160, 8, 'Bb4'], [168, 8, 'D5'], [176, 8, 'Bb4'], [184, 4, 'F4'], [188, 4, 'A4'],
        [192, 8, 'C5'], [200, 8, 'E5'], [208, 8, 'C5'], [216, 4, 'G4'], [220, 4, 'B4'],
        [224, 8, 'A4'], [232, 8, 'C5'], [240, 16, 'D5'],
      ];

  let prevLeadFreq = 0;
  for (const n of duelLead) {
    const freq = getFreq(n[2]);
    if (freq > 0) {
      synthVoice1Lead(
        ctx,
        destLead,
        n[0] * stepSec,
        n[1] * stepSec,
        freq,
        isBoss ? 0.55 : 0.48,
        prevLeadFreq,
        true,
        isBoss ? 0.32 : 0.28,
        true,
      );
      prevLeadFreq = freq;
    } else {
      prevLeadFreq = 0;
    }
  }

  synthAmbientSwell(ctx, mixer.drumBus, 0, totalSteps * stepSec, noiseBuf, 0.06);
}

/**
 * 9. VICTORY: Major Resolution Pad & Picardy Swell
 */
function renderVictoryMajorResolution(
  ctx: BaseAudioContext,
  destLead: AudioNode,
  destBed: AudioNode,
  noiseBuf: AudioBuffer,
) {
  const bpm = 90;
  const bars = 8;
  const beatSec = 60 / bpm;
  const stepSec = beatSec / 4;
  const totalSteps = bars * 16;
  const totalSec = totalSteps * stepSec;

  const mixer = setupSidechainMixer(ctx, destBed, [0], stepSec, totalSteps, true, false);

  const victoryIntro = ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'G4', 'C5'];
  for (let s = 0; s < 16; s++) {
    const freq = getFreq(victoryIntro[s % 8]);
    if (freq > 0) {
      synthVoice2Arp(ctx, destBed, s * stepSec, stepSec, freq, 0.3, 1400, false, false);
    }
  }

  const stingerNotes: StepNote[] = [
    [16, 4, 'G4'],
    [20, 4, 'C5'],
    [24, 8, 'E5'],
  ];
  for (const n of stingerNotes) {
    const freq = getFreq(n[2]);
    if (freq > 0) {
      synthVoice1Lead(ctx, destLead, n[0] * stepSec, n[1] * stepSec, freq, 0.48, 0, true, 0.38, false);
    }
  }

  const padStartTime = 24 * stepSec;
  const padDuration = totalSec - padStartTime;

  synthVoice3Bass(ctx, mixer.sidechainGain, padStartTime, padDuration, getFreq('C2'), 0.88, 180);
  synthVoice3Bass(ctx, mixer.sidechainGain, padStartTime, padDuration, getFreq('C1'), 0.75, 120);

  const cMajorTones = ['E3', 'G3', 'B3', 'D4', 'E4', 'G4'];
  for (const note of cMajorTones) {
    const f = getFreq(note);
    if (f > 0) {
      synthVoice2Pad(ctx, destBed, padStartTime, padDuration, f, 0.35, 1400, false);
    }
  }

  synthAmbientSwell(ctx, mixer.drumBus, 0, totalSec, noiseBuf, 0.04);
}

// Track registry mapping
const TRACK_REGISTRY: Record<string, TrackDef> = {
  HARBOR: {
    bpm: 74,
    bars: 24,
    steps: 384,
    render: (ctx, destLead, destBed, noiseBuf) => renderHarborLanterns(ctx, destLead, destBed, noiseBuf),
  },
  TOWN: {
    bpm: 78,
    bars: 24,
    steps: 384,
    render: (ctx, destLead, destBed, noiseBuf) => renderTownMidnightBoulevard(ctx, destLead, destBed, noiseBuf),
  },
  CLIFFS: {
    bpm: 82,
    bars: 24,
    steps: 384,
    render: (ctx, destLead, destBed, noiseBuf) => renderCliffsAndalusianBreeze(ctx, destLead, destBed, noiseBuf),
  },
  RUINS: {
    bpm: 76,
    bars: 24,
    steps: 384,
    render: (ctx, destLead, destBed, noiseBuf) => renderRuinsAutumnLeaves(ctx, destLead, destBed, noiseBuf),
  },
  TREELINE: {
    bpm: 70,
    bars: 24,
    steps: 384,
    render: (ctx, destLead, destBed, noiseBuf) => renderTreelineSnowStarlight(ctx, destLead, destBed, noiseBuf),
  },
  SUMMIT: {
    bpm: 74,
    bars: 24,
    steps: 384,
    render: (ctx, destLead, destBed, noiseBuf) => renderSummitClouds(ctx, destLead, destBed, noiseBuf),
  },
  INTERIORS: {
    bpm: 72,
    bars: 24,
    steps: 384,
    render: (ctx, destLead, destBed, noiseBuf) => renderInteriorsVelvetHearths(ctx, destLead, destBed, noiseBuf),
  },
  BATTLE: {
    bpm: 102,
    bars: 16,
    steps: 256,
    render: (ctx, destLead, destBed, noiseBuf) => renderPoetDuelsPassacaglia(ctx, destLead, destBed, noiseBuf, false),
  },
  BOSS_DUEL: {
    bpm: 112,
    bars: 16,
    steps: 256,
    render: (ctx, destLead, destBed, noiseBuf) => renderPoetDuelsPassacaglia(ctx, destLead, destBed, noiseBuf, true),
  },
  VICTORY: {
    bpm: 90,
    bars: 8,
    steps: 128,
    render: (ctx, destLead, destBed, noiseBuf) => renderVictoryMajorResolution(ctx, destLead, destBed, noiseBuf),
  },
  VICTORY_FANFARE: {
    bpm: 90,
    bars: 8,
    steps: 128,
    render: (ctx, destLead, destBed, noiseBuf) => renderVictoryMajorResolution(ctx, destLead, destBed, noiseBuf),
  },
};

// ============================================================================
// 4. ZONE-TO-TRACK ROUTING MAPPER
// ============================================================================

export const BOSS_POET_IDS = ['SAPPHO', 'SHAKESPEARE', 'KEATS', 'DANTE'];

export function isBossPoet(poetId?: string): boolean {
  if (!poetId) return false;
  return BOSS_POET_IDS.includes(poetId.toUpperCase().trim());
}

export function isInteriorRoom(roomIdOrZone: string): boolean {
  const id = (roomIdOrZone || '').toUpperCase().trim().replace(/^ROOM_/, '');
  return [
    'INTERIORS',
    'BOATHOUSE',
    'CAFE_DE_FLORE',
    'SHAKESPEARE_CO',
    'COZY_INTERIORS',
    'INDOOR_COZY',
    'NIGHTINGALE',
    'LUNCH_COUNTER',
    'DINER',
    'RENTED_ROOM',
    'FORGE',
    'BLUE_HOUSE',
    'MOUNTAIN_GOAT',
    'LIBRARY',
    'KITCHEN',
    'HERMITAGE',
    'WHITE_HOUSE',
    'GRAVEYARD',
    'LYRIC_SANCTUARY',
    'EPILOGUE',
    'CREDITS',
    'ANTHOLOGY',
  ].includes(id);
}

/**
 * Overworld music master filters kept in a warm, supportive 1200Hz–1400Hz pocket.
 * This separates the soundtrack from the 1.5kHz–4kHz presence range where tactile SFX live.
 */
export function getOutdoorCutoffForRoom(roomIdOrZone: string): number {
  const zone = getZoneForRoom(roomIdOrZone);
  switch (zone) {
    case 'HARBOR':
      return 1300;
    case 'TOWN':
      return 1350;
    case 'CLIFFS':
      return 1400;
    case 'RUINS':
      return 1300;
    case 'TREELINE':
      return 1250;
    case 'SUMMIT':
      return 1400;
    default:
      return 1350;
  }
}

export function getZoneForRoom(roomIdOrScreen: string, isBattle = false, enemyPoetId?: string): ZoneId {
  if (isBattle) {
    if (isBossPoet(enemyPoetId)) {
      return 'BOSS_DUEL';
    }
    return 'BATTLE';
  }
  const raw = (roomIdOrScreen || '').toUpperCase().trim();
  const id = raw.replace(/^ROOM_/, '');

  if (id === 'BOSS_DUEL') return 'BOSS_DUEL';
  if (id === 'BATTLE' || id === 'DUEL') return 'BATTLE';
  if (id === 'VICTORY' || id === 'VICTORY_FANFARE') return 'VICTORY_FANFARE';

  // 1. HARBOR (Screen 1 & Title, Menu, Opening Scene, Name Entry)
  if (
    id === 'HARBOR' ||
    id === 'TITLE' ||
    id === 'MENU' ||
    id === 'NAME_ENTRY' ||
    id === 'OPENING_SCENE' ||
    id === 'GAME_OVER' ||
    id === 'GAMEOVER' ||
    id === 'GRAND_TOUR_MAP'
  ) {
    return 'HARBOR';
  }

  // 2. TOWN (Screen 2)
  if (id === 'TOWN' || id === 'VILLAGE' || id === 'CIVIC_AUTUMN' || id === 'OVERWORLD') {
    return 'TOWN';
  }

  // 3. CLIFFS (Screen 3)
  if (id === 'CLIFFS' || id === 'COASTAL') {
    return 'CLIFFS';
  }

  // 4. RUINS (Screen 4)
  if (id === 'RUINS' || id === 'ZEN' || id === 'STREAM') {
    return 'RUINS';
  }

  // 5. TREELINE (Screen 5)
  if (id === 'TREELINE' || id === 'WINTER_GOTHIC' || id === 'GOTHIC') {
    return 'TREELINE';
  }

  // 6. SUMMIT (Screen 6)
  if (id === 'SUMMIT' || id === 'APEX') {
    return 'SUMMIT';
  }

  // 7. ALL INTERIORS (All interior rooms, Epilogue, Credits, Anthology)
  if (isInteriorRoom(id)) {
    return 'INTERIORS';
  }

  return 'HARBOR';
}

// Populate aliases & direct screen lookups in TRACK_REGISTRY
const ALL_SCREEN_KEYS = [
  'HARBOR', 'CLIFFS', 'TOWN', 'RUINS', 'NIGHTINGALE', 'LUNCH_COUNTER', 'DINER',
  'RENTED_ROOM', 'FORGE', 'BLUE_HOUSE', 'MOUNTAIN_GOAT', 'LIBRARY',
  'TREELINE', 'KITCHEN', 'HERMITAGE', 'GRAVEYARD', 'WHITE_HOUSE',
  'SUMMIT', 'LYRIC_SANCTUARY', 'BOATHOUSE', 'ROOM_BOATHOUSE', 'CAFE_DE_FLORE', 'ROOM_CAFE_DE_FLORE', 'SHAKESPEARE_CO', 'ROOM_SHAKESPEARE_CO', 'MENU', 'OPENING_SCENE', 'NAME_ENTRY',
  'OVERWORLD', 'VILLAGE', 'STREAM', 'ZEN', 'GOTHIC', 'INDOOR_COZY', 'GRAND_TOUR_MAP',
  'EPILOGUE', 'CREDITS', 'BOSS_DUEL', 'DUEL', 'TITLE', 'COASTAL', 'CIVIC_AUTUMN',
  'WINTER_GOTHIC', 'APEX', 'COZY_INTERIORS', 'ANTHOLOGY'
];

ALL_SCREEN_KEYS.forEach((key) => {
  if (TRACK_REGISTRY[key]) return;
  const zone = getZoneForRoom(key);
  TRACK_REGISTRY[key] = TRACK_REGISTRY[zone];
  TRACK_REGISTRY[`ROOM_${key}`] = TRACK_REGISTRY[zone];
});

// ============================================================================
// 5. SOUNDTRACK ENGINE SINGLETON & CONTROLLER (5-POINT MIX ARCHITECTURE)
// ============================================================================

class SoundtrackEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private duckingGain: GainNode | null = null;
  private duckingFilter: BiquadFilterNode | null = null;

  // Dedicated Audio Buses
  private overworldBusGain: GainNode | null = null;
  private battleBusGain: GainNode | null = null;
  private victoryBusGain: GainNode | null = null;
  private surfBusGain: GainNode | null = null;

  // Active state & dual-source crossfade slots
  private activeTrackId: TrackId | string | null = null;
  private activeZoneId: ZoneId | null = null;
  private pendingZoneId: ZoneId | null = null;
  private isSwitching = false;
  private activeBpm = 74;
  private isBattleActive = false;

  // Continuous Clock
  private masterClockStartTime = 0;

  // Active Overworld Stem Sources
  private currentLeadSource: AudioBufferSourceNode | null = null;
  private currentBedSource: AudioBufferSourceNode | null = null;
  private currentLeadGain: GainNode | null = null;
  private currentBedGain: GainNode | null = null;
  private currentTrackGain: GainNode | null = null;

  // Active Battle Stem Sources
  private battleLeadSource: AudioBufferSourceNode | null = null;
  private battleBedSource: AudioBufferSourceNode | null = null;
  private battleLeadGain: GainNode | null = null;
  private battleBedGain: GainNode | null = null;
  private battleTrackGain: GainNode | null = null;

  // Active Victory player node slot
  private victorySourceNode: AudioBufferSourceNode | null = null;
  private victoryTrackGain: GainNode | null = null;

  // Ocean Surf looping source
  private surfSourceNode: AudioBufferSourceNode | null = null;

  // Multi-Stem Buffer Cache
  private bufferCache: Partial<Record<string, StemTrackBuffers>> = {};
  private renderPromises: Partial<Record<string, Promise<StemTrackBuffers>>> = {};

  // Master Gain Re-Staging: 0.20 Overworld baseline / 0.24 Duels
  private readonly overworldMasterGain = 0.20;
  private readonly duelMasterGain = 0.24;
  private volume = 0.20;
  private isMuted = false;
  private isDucked = false;
  private isCrisis = false;
  private currentPrologueMovement = -1;

  // Spotlight Ducking timer
  private spotlightTimer: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedMute = localStorage.getItem('poetmon_music_muted');
        if (savedMute !== null) {
          this.isMuted = savedMute === 'true';
        }
      } catch {
        // Ignore
      }
      // Never preload all buffers on tick 0 in constructor to prevent startup timeout
    }
  }

  public ensureContext(): AudioContext | null {
    if (this.ctx && this.ctx.state !== 'closed') return this.ctx;
    if (typeof window === 'undefined') return null;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return null;

    try {
      const ctx = new AudioContextClass();
      const master = ctx.createGain();
      const music = ctx.createGain();
      const ducking = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1350, ctx.currentTime);
      filter.Q.setValueAtTime(0.707, ctx.currentTime);

      // Initial Gain Balance: 0.20 Overworld baseline
      master.gain.setValueAtTime(this.isMuted ? 0 : this.volume, ctx.currentTime);
      music.gain.setValueAtTime(1.0, ctx.currentTime);
      ducking.gain.setValueAtTime(1.0, ctx.currentTime);

      // Audio Graph
      ducking.connect(filter);
      filter.connect(music);
      music.connect(master);
      master.connect(ctx.destination);

      // Sub-Buses
      const overworldBus = ctx.createGain();
      overworldBus.gain.setValueAtTime(1.0, ctx.currentTime);
      overworldBus.connect(ducking);

      const battleBus = ctx.createGain();
      battleBus.gain.setValueAtTime(1.0, ctx.currentTime);
      battleBus.connect(ducking);

      const victoryBus = ctx.createGain();
      victoryBus.gain.setValueAtTime(1.0, ctx.currentTime);
      victoryBus.connect(ducking);

      const surfBus = ctx.createGain();
      surfBus.gain.setValueAtTime(1.0, ctx.currentTime);
      surfBus.connect(ducking);

      this.ctx = ctx;
      this.masterGain = master;
      this.musicGain = music;
      this.duckingGain = ducking;
      this.duckingFilter = filter;

      this.overworldBusGain = overworldBus;
      this.battleBusGain = battleBus;
      this.victoryBusGain = victoryBus;
      this.surfBusGain = surfBus;

      this.attachUnlock();
      return ctx;
    } catch (e) {
      console.warn('[audio] Failed to initialize AudioContext:', e);
      return null;
    }
  }

  private attachUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      if (this.ctx && this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => {});
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
  }

  public async preloadAllBuffers(): Promise<void> {
    // Buffers are lazily generated on demand to prevent blocking the startup thread
  }

  /** Renders separate sample-aligned Voice 1 Lead and Voice 2/3/4 Accompaniment Bed stems */
  public async getTrackBuffer(zoneOrTrack: string): Promise<StemTrackBuffers | null> {
    if (this.bufferCache[zoneOrTrack]) {
      return this.bufferCache[zoneOrTrack]!;
    }

    if (this.renderPromises[zoneOrTrack]) {
      return this.renderPromises[zoneOrTrack]!;
    }

    const def =
      TRACK_REGISTRY[zoneOrTrack] ||
      TRACK_REGISTRY[getZoneForRoom(zoneOrTrack)] ||
      TRACK_REGISTRY['HARBOR'];
    if (!def) return null;

    const promise = (async (): Promise<StemTrackBuffers> => {
      const OfflineCtxClass =
        typeof window !== 'undefined'
          ? window.OfflineAudioContext ||
            (window as unknown as { webkitOfflineAudioContext?: typeof OfflineAudioContext }).webkitOfflineAudioContext
          : null;

      const sampleRate = 32000;

      if (!OfflineCtxClass) {
        // Return small silent buffer when OfflineAudioContext is unavailable
        const dummyLead = new AudioBuffer({ length: 128, numberOfChannels: 2, sampleRate });
        const dummyBed = new AudioBuffer({ length: 128, numberOfChannels: 2, sampleRate });
        const fallbackStems: StemTrackBuffers = { lead: dummyLead, bed: dummyBed, bpm: def.bpm };
        this.bufferCache[zoneOrTrack] = fallbackStems;
        delete this.renderPromises[zoneOrTrack];
        return fallbackStems;
      }

      const stepSec = 60 / (def.bpm * 4);
      // Cap render duration to max 128 steps (8 bars) for lightning-fast buffer rendering
      const actualSteps = Math.min(128, def.steps);
      const totalDur = actualSteps * stepSec;
      const numSamples = Math.ceil(sampleRate * totalDur);

      try {
        const offlineLead = new OfflineCtxClass(2, numSamples, sampleRate);
        const offlineBed = new OfflineCtxClass(2, numSamples, sampleRate);

        const noiseLead = createNoiseBuffer(offlineLead, 3.0);
        const noiseBed = createNoiseBuffer(offlineBed, 3.0);

        // Offline Lead Context: route Voice 1 to destination, silence bed
        const dummyBed = offlineLead.createGain();
        dummyBed.gain.setValueAtTime(0, 0);
        def.render(offlineLead, offlineLead.destination, dummyBed, noiseLead);

        // Offline Bed Context: route Voice 2/3/4 to destination, silence lead
        const dummyLead = offlineBed.createGain();
        dummyLead.gain.setValueAtTime(0, 0);
        def.render(offlineBed, dummyLead, offlineBed.destination, noiseBed);

        // Rendering a track can take several seconds on a normal machine. Nothing
        // waits on it (every caller is fire-and-forget), so give it real time.
        // The guard only exists so a render that never finishes can't hang forever.
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Audio render timeout')), 30000),
        );

        const [leadBuf, bedBuf] = await Promise.race([
          Promise.all([
            offlineLead.startRendering(),
            offlineBed.startRendering(),
          ]),
          timeoutPromise,
        ]);

        const stems: StemTrackBuffers = { lead: leadBuf, bed: bedBuf, bpm: def.bpm };
        this.bufferCache[zoneOrTrack] = stems;
        delete this.renderPromises[zoneOrTrack];
        return stems;
      } catch (err) {
        console.warn(`[audio] Offline audio rendering bypassed for ${zoneOrTrack}:`, err);
        const dummyLead = new AudioBuffer({ length: 128, numberOfChannels: 2, sampleRate });
        const dummyBed = new AudioBuffer({ length: 128, numberOfChannels: 2, sampleRate });
        const fallbackStems: StemTrackBuffers = { lead: dummyLead, bed: dummyBed, bpm: def.bpm };
        // Don't remember the silent stand-in: caching it made the track mute for
        // the rest of the session. Leaving it out lets the next request try again.
        delete this.renderPromises[zoneOrTrack];
        return fallbackStems;
      }
    })();

    this.renderPromises[zoneOrTrack] = promise;
    return promise;
  }

  private startSurfLoop(): void {
    const ctx = this.ctx;
    if (!ctx || !this.surfBusGain || this.surfSourceNode) return;

    try {
      const sampleRate = ctx.sampleRate || 32000;
      const length = Math.min(sampleRate * 2, 64000); // Lightweight 2.0s buffer instead of 8.0s
      const buf = ctx.createBuffer(1, length, sampleRate);
      const data = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        const t = (i / sampleRate);
        const swell = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin((t / 2.0) * Math.PI * 2));
        data[i] = pink * 0.038 * swell;
      }

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const surfFilter = ctx.createBiquadFilter();
      surfFilter.type = 'lowpass';
      surfFilter.frequency.setValueAtTime(550, ctx.currentTime);

      src.connect(surfFilter);
      surfFilter.connect(this.surfBusGain);
      src.start(0);
      this.surfSourceNode = src;
    } catch {
      // Safe fallback
    }
  }

  // =========================================================================
  // PROLOGUE 4-MOVEMENT CONCEPTUAL AUDIO ARCHITECTURE & OCEAN SURF
  // =========================================================================
  /**
   * Cohesive 4-Movement Conceptual Audio Architecture:
   * Movement 0 (Movement I — Spring & Summer: Slides 1 to 6 / indices 0 to 5):
   *   Voice 2 (Juno chords), Voice 3 (Sub-bass), Voice 4 (gentle percussion) active.
   *   Smoothly opens Juno low-pass filter to 1750Hz over 1.5s (room feels warm, resonant, full of air).
   *
   * Movement 1 (Movement II — Autumn: Slides 7 to 8 / indices 6 to 7):
   *   On Slide 7 ("You're both arguing about the beginning..."), glides Juno LPF down to 850Hz over 2.0s.
   *   Chords become warm, veiled, and autumnal.
   *
   * Movement 2 (Movement III — Winter & Eternity: Slides 9 to 12 / indices 8 to 11):
   *   On Slide 9 ("Winter. The rest is weather."), glides Juno LPF down to a stark, hollow 360Hz over 1.5s.
   *   CRITICAL: Keeps this stark 360Hz winter filter state steady across Slides 9, 10, 11, and 12!
   *   Does NOT jump back up when Shakespeare speaks on Slide 11.
   *
   * Movement 3 (Movement IV — The Reader's Threshold: Slide 13 / index 12):
   *   On Slide 13 ("Why not ask the reader?"), glides filter down to 75Hz over 1.2s, fading Voice 2 chords to 0.0
   *   leaving ONLY Voice 3 (the deep sub-bass pulse) humming alone in pitch dark as Whitman's question hangs.
   */
  public setPrologueMovement(movementIndex: number): void {
    if (this.currentPrologueMovement === movementIndex && movementIndex === 2) {
      // Steady state check: keep stark 360Hz winter filter steady across Slides 9-12
      return;
    }
    this.currentPrologueMovement = movementIndex;
    if (!this.ctx || this.ctx.state === 'closed' || !this.duckingFilter) return;
    const now = this.ctx.currentTime;

    try {
      this.duckingFilter.frequency.cancelScheduledValues(now);
      const curFreq = Math.max(40, this.duckingFilter.frequency.value);
      this.duckingFilter.frequency.setValueAtTime(curFreq, now);

      if (movementIndex === 0) {
        // Movement I: 1750Hz over 1.5s
        this.duckingFilter.frequency.exponentialRampToValueAtTime(1750, now + 1.5);
      } else if (movementIndex === 1) {
        // Movement II: 850Hz over 2.0s
        this.duckingFilter.frequency.exponentialRampToValueAtTime(850, now + 2.0);
      } else if (movementIndex === 2) {
        // Movement III: stark, hollow 360Hz over 1.5s
        this.duckingFilter.frequency.exponentialRampToValueAtTime(360, now + 1.5);
      } else if (movementIndex === 3) {
        // Movement IV: 75Hz over 1.2s (sub-bass only)
        this.duckingFilter.frequency.exponentialRampToValueAtTime(75, now + 1.2);
      }
    } catch {
      // Safe
    }
  }

  /**
   * Helper that maps 0-indexed slide (0..12) to the appropriate 4-movement stage
   */
  public setPrologueSlide(slideIndex: number): void {
    if (slideIndex <= 5) {
      this.setPrologueMovement(0);
    } else if (slideIndex <= 7) {
      this.setPrologueMovement(1);
    } else if (slideIndex <= 11) {
      this.setPrologueMovement(2);
    } else {
      this.setPrologueMovement(3);
    }
  }

  /**
   * When advancing past Slide 13, fade out sub-bass into complete silence and darkness over 300ms.
   */
  public fadePrologueToSilence(fadeMs = 300): void {
    if (!this.ctx || this.ctx.state === 'closed' || !this.masterGain) {
      this.stop(0.05);
      return;
    }
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const fadeSec = Math.max(0.05, fadeMs / 1000);
    try {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + fadeSec);
    } catch {
      // Safe
    }
    setTimeout(() => {
      this.stop(0.05);
      this.currentPrologueMovement = -1;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.overworldMasterGain, this.ctx.currentTime);
      }
      if (this.duckingFilter && this.ctx) {
        this.duckingFilter.frequency.cancelScheduledValues(this.ctx.currentTime);
        this.duckingFilter.frequency.setValueAtTime(1350, this.ctx.currentTime);
      }
    }, fadeMs + 20);
  }

  /**
   * Legacy helper: Central golden beacon Juno LPF transition.
   */
  public setPrologueJunoFilter(freq: number, rampMs = 1200): void {
    if (!this.ctx || this.ctx.state === 'closed' || !this.duckingFilter) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const rampSec = Math.max(0.05, rampMs / 1000);
    try {
      this.duckingFilter.frequency.cancelScheduledValues(now);
      this.duckingFilter.frequency.setValueAtTime(this.duckingFilter.frequency.value, now);
      this.duckingFilter.frequency.exponentialRampToValueAtTime(Math.max(40, freq), now + rampSec);
    } catch {
      // Safe
    }
  }

  /**
   * Legacy helper: Whitman slide sub-bass fade.
   */
  public fadeToSubBassOnly(fadeMs = 250): void {
    this.setPrologueMovement(3);
  }

  /**
   * Smoothly fade ocean surf pink-noise generator gain (e.g. 800ms fade-in on Harbor arrival).
   */
  public fadeSurf(targetGain: number, durationMs = 800): void {
    if (!this.ctx || this.ctx.state === 'closed' || !this.surfBusGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const durSec = Math.max(0.05, durationMs / 1000);
    try {
      this.surfBusGain.gain.cancelScheduledValues(now);
      this.surfBusGain.gain.setValueAtTime(this.surfBusGain.gain.value, now);
      this.surfBusGain.gain.linearRampToValueAtTime(targetGain, now + durSec);
    } catch {
      // Safe
    }
  }

  // =========================================================================
  // 2. EVENT-DRIVEN SPOTLIGHT DUCKING HELPER
  // =========================================================================
  /**
   * Ducks music master gain to 55% of its current level over 35ms,
   * holds for holdMs milliseconds, then glides back up to normal volume over 380ms.
   */
  public triggerSfxDucking(holdMs = 450, duckAmount = 0.55): void {
    if (!this.ctx || this.ctx.state === 'closed' || !this.duckingGain || this.isMuted) return;
    const ctx = this.ctx;

    if (this.spotlightTimer !== null) {
      clearTimeout(this.spotlightTimer);
      this.spotlightTimer = null;
    }

    const now = ctx.currentTime;
    const baseTarget = this.isDucked ? 0.35 : 1.0;
    const targetDuck = baseTarget * duckAmount;

    try {
      this.duckingGain.gain.cancelScheduledValues(now);
      this.duckingGain.gain.setValueAtTime(this.duckingGain.gain.value, now);
      // Ducks smoothly to 55% over 35ms
      this.duckingGain.gain.linearRampToValueAtTime(targetDuck, now + 0.035);
    } catch {
      // Safe
    }

    // Holds for holdMs, then glides back up over 380ms
    this.spotlightTimer = window.setTimeout(() => {
      this.spotlightTimer = null;
      const currentCtx = this.ctx;
      if (!currentCtx || currentCtx.state === 'closed' || !this.duckingGain) return;
      try {
        const recoverTarget = this.isDucked ? 0.35 : 1.0;
        currentCtx.resume().catch(() => {});
        this.duckingGain.gain.cancelScheduledValues(currentCtx.currentTime);
        this.duckingGain.gain.setValueAtTime(this.duckingGain.gain.value, currentCtx.currentTime);
        this.duckingGain.gain.linearRampToValueAtTime(recoverTarget, currentCtx.currentTime + 0.380);
      } catch {
        // Safe
      }
    }, holdMs);
  }

  // =========================================================================
  // 3. SELECTIVE STEM STRIPPING & MEASURE-ALIGNED BLOOM
  // =========================================================================
  /**
   * When dialogue/menus open (isDucked = true):
   * - Silences Voice 1 (lead melody) immediately over 35ms.
   * - Voice 2 (pads) and Voice 3 (sub-bass) hum gently underneath as an atmospheric bed.
   * When dialogue closes (isDucked = false):
   * - Voice 1 gracefully blooms back in on the next measure.
   */
  public setDucking(isDucked: boolean): void {
    this.isDucked = isDucked;
    if (!this.ctx || this.ctx.state === 'closed' || !this.duckingGain || !this.duckingFilter) return;
    const ctx = this.ctx;

    const now = ctx.currentTime;

    if (isDucked) {
      // Silence Voice 1 Lead immediately so it doesn't talk over the dialogue
      if (this.currentLeadGain) {
        this.currentLeadGain.gain.cancelScheduledValues(now);
        this.currentLeadGain.gain.setValueAtTime(this.currentLeadGain.gain.value, now);
        this.currentLeadGain.gain.linearRampToValueAtTime(0.0001, now + 0.035);
      }
      if (this.battleLeadGain) {
        this.battleLeadGain.gain.cancelScheduledValues(now);
        this.battleLeadGain.gain.setValueAtTime(this.battleLeadGain.gain.value, now);
        this.battleLeadGain.gain.linearRampToValueAtTime(0.0001, now + 0.035);
      }
    } else {
      // Gracefully restore Voice 1 immediately with smooth 60ms attack curve
      if (this.currentLeadGain) {
        this.currentLeadGain.gain.cancelScheduledValues(now);
        this.currentLeadGain.gain.setValueAtTime(this.currentLeadGain.gain.value, now);
        this.currentLeadGain.gain.linearRampToValueAtTime(1.0, now + 0.06);
      }
      if (this.battleLeadGain) {
        this.battleLeadGain.gain.cancelScheduledValues(now);
        this.battleLeadGain.gain.setValueAtTime(this.battleLeadGain.gain.value, now);
        this.battleLeadGain.gain.linearRampToValueAtTime(1.0, now + 0.06);
      }
    }

    if (this.activeZoneId) {
      this.updateZoneFilter(this.activeZoneId, false);
    }
  }

  public async play(trackId: TrackId | string, crossfadeDuration = 0.22): Promise<void> {
    const raw = (trackId || '').toUpperCase().trim();
    let targetZone: ZoneId;

    if (raw === 'BOSS_DUEL') {
      targetZone = 'BOSS_DUEL';
    } else if (raw === 'BATTLE' || raw === 'DUEL') {
      targetZone = 'BATTLE';
    } else if (raw === 'EPILOGUE' || raw === 'CREDITS') {
      targetZone = 'INTERIORS';
    } else if (raw === 'VICTORY' || raw === 'VICTORY_FANFARE') {
      targetZone = 'VICTORY_FANFARE';
    } else {
      targetZone = getZoneForRoom(trackId);
    }

    const isBattle = targetZone === 'BATTLE' || targetZone === 'BOSS_DUEL';
    const isVictory = targetZone === 'VICTORY_FANFARE' || targetZone === 'VICTORY';

    const ctx = this.ensureContext();
    if (!ctx || !this.overworldBusGain || !this.battleBusGain || !this.victoryBusGain || !this.duckingFilter || !this.masterGain) return;

    if (ctx.state === 'suspended') {
      void ctx.resume().catch(() => {});
    }

    // 1. VICTORY FANFARE / PICARDY RESOLUTION
    if (isVictory) {
      this.playVictoryFanfare();
      return;
    }

    // 2. POET DUELS (Gain re-staged to 0.24)
    if (isBattle) {
      this.isBattleActive = true;
      this.activeTrackId = trackId;
      this.activeZoneId = targetZone;
      this.activeBpm = targetZone === 'BOSS_DUEL' ? 112 : 102;

      // Master Gain Re-Staging: 0.24 for duels
      this.volume = this.duelMasterGain;
      if (!this.isMuted) {
        this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, ctx.currentTime);
        this.masterGain.gain.linearRampToValueAtTime(this.duelMasterGain, ctx.currentTime + 0.15);
      }

      // Restore and boost battle bus gain to 1.0
      this.battleBusGain.gain.cancelScheduledValues(ctx.currentTime);
      this.battleBusGain.gain.setValueAtTime(Math.max(0.001, this.battleBusGain.gain.value), ctx.currentTime);
      this.battleBusGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.15);

      this.victoryBusGain.gain.cancelScheduledValues(ctx.currentTime);
      this.victoryBusGain.gain.setValueAtTime(this.victoryBusGain.gain.value, ctx.currentTime);
      this.victoryBusGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      this.overworldBusGain.gain.cancelScheduledValues(ctx.currentTime);
      this.overworldBusGain.gain.setValueAtTime(this.overworldBusGain.gain.value, ctx.currentTime);
      this.overworldBusGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      if (this.surfBusGain) {
        this.surfBusGain.gain.cancelScheduledValues(ctx.currentTime);
        this.surfBusGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      }

      this.updateZoneFilter(targetZone, false);

      // If this battle track is already loaded and playing, do not tear down and restart
      if (this.battleLeadSource && this.battleBedSource && this.activeZoneId === targetZone) {
        return;
      }

      const stems = await this.getTrackBuffer(targetZone);
      if (!stems || !this.isBattleActive) return;

      const oldLeadSource = this.battleLeadSource;
      const oldBedSource = this.battleBedSource;
      const oldBattleGain = this.battleTrackGain;

      const newLeadSource = ctx.createBufferSource();
      newLeadSource.buffer = stems.lead;
      newLeadSource.loop = true;

      const newBedSource = ctx.createBufferSource();
      newBedSource.buffer = stems.bed;
      newBedSource.loop = true;

      if (this.isCrisis) {
        newLeadSource.playbackRate.setValueAtTime(1.05, ctx.currentTime);
        newBedSource.playbackRate.setValueAtTime(1.05, ctx.currentTime);
      }

      const leadGain = ctx.createGain();
      leadGain.gain.setValueAtTime(1.0, ctx.currentTime);

      const bedGain = ctx.createGain();
      bedGain.gain.setValueAtTime(1.0, ctx.currentTime);

      const battleTrackGain = ctx.createGain();
      battleTrackGain.gain.setValueAtTime(1.0, ctx.currentTime);

      newLeadSource.connect(leadGain);
      leadGain.connect(battleTrackGain);

      newBedSource.connect(bedGain);
      bedGain.connect(battleTrackGain);

      battleTrackGain.connect(this.battleBusGain);

      const startTime = ctx.currentTime;
      newLeadSource.start(startTime, 0);
      newBedSource.start(startTime, 0);

      this.battleLeadSource = newLeadSource;
      this.battleBedSource = newBedSource;
      this.battleLeadGain = leadGain;
      this.battleBedGain = bedGain;
      this.battleTrackGain = battleTrackGain;
      this.pendingZoneId = null;
      this.isSwitching = false;

      if (oldLeadSource && oldBedSource && oldBattleGain) {
        oldBattleGain.gain.cancelScheduledValues(ctx.currentTime);
        oldBattleGain.gain.setValueAtTime(Math.max(0.0001, oldBattleGain.gain.value), ctx.currentTime);
        oldBattleGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

        const stopTime = ctx.currentTime + 0.10;
        try {
          oldLeadSource.stop(stopTime);
          oldBedSource.stop(stopTime);
        } catch {
          // Safe
        }

        setTimeout(() => {
          try {
            oldLeadSource.disconnect();
            oldBedSource.disconnect();
            oldBattleGain.disconnect();
          } catch {
            // Safe
          }
        }, 140);
      }
      return;
    }

    // 3. OVERWORLD TRANSITIONS (Gain re-staged to 0.20)
    this.volume = this.overworldMasterGain;
    if (!this.isMuted) {
      this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.overworldMasterGain, ctx.currentTime + 0.20);
    }

    if (this.isBattleActive || this.victorySourceNode) {
      this.isBattleActive = false;

      this.victoryBusGain.gain.cancelScheduledValues(ctx.currentTime);
      this.victoryBusGain.gain.setValueAtTime(this.victoryBusGain.gain.value, ctx.currentTime);
      this.victoryBusGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      this.battleBusGain.gain.cancelScheduledValues(ctx.currentTime);
      this.battleBusGain.gain.setValueAtTime(this.battleBusGain.gain.value, ctx.currentTime);
      this.battleBusGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      this.overworldBusGain.gain.cancelScheduledValues(ctx.currentTime);
      this.overworldBusGain.gain.setValueAtTime(Math.max(0.001, this.overworldBusGain.gain.value), ctx.currentTime);
      this.overworldBusGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.25);

      // Capture old sources locally to avoid killing newly instantiated battle nodes if the player re-enters quickly
      const oldBattleLead = this.battleLeadSource;
      const oldBattleBed = this.battleBedSource;
      const oldBattleGain = this.battleTrackGain;
      const oldVictorySource = this.victorySourceNode;
      const oldVictoryGain = this.victoryTrackGain;

      this.battleLeadSource = null;
      this.battleBedSource = null;
      this.battleLeadGain = null;
      this.battleBedGain = null;
      this.battleTrackGain = null;
      this.victorySourceNode = null;
      this.victoryTrackGain = null;

      setTimeout(() => {
        try {
          if (oldBattleLead) {
            oldBattleLead.stop();
            oldBattleLead.disconnect();
          }
          if (oldBattleBed) {
            oldBattleBed.stop();
            oldBattleBed.disconnect();
          }
          if (oldBattleGain) {
            oldBattleGain.disconnect();
          }
          if (oldVictorySource) {
            oldVictorySource.stop();
            oldVictorySource.disconnect();
          }
          if (oldVictoryGain) {
            oldVictoryGain.disconnect();
          }
        } catch {
          // Safe
        }
      }, 260);
    }

    const previousZone = this.activeZoneId;
    const wasInterior = previousZone === 'INTERIORS';
    const isInterior = targetZone === 'INTERIORS';
    const isInteriorTransition = wasInterior || isInterior;

    if (this.activeZoneId === targetZone && this.currentLeadSource) {
      this.activeTrackId = trackId;
      this.updateZoneFilter(targetZone, false);
      return;
    }

    this.activeTrackId = trackId;
    this.activeZoneId = targetZone;
    const def = TRACK_REGISTRY[targetZone] || TRACK_REGISTRY['HARBOR'];
    this.activeBpm = def ? def.bpm : 74;

    const targetBufferKey = targetZone in TRACK_REGISTRY ? targetZone : (raw in TRACK_REGISTRY ? raw : 'HARBOR');
    const stems = await this.getTrackBuffer(targetBufferKey);
    if (!stems || this.activeZoneId !== targetZone) return;

    const oldLeadSource = this.currentLeadSource;
    const oldBedSource = this.currentBedSource;
    const oldGain = this.currentTrackGain;

    if (this.masterClockStartTime === 0) {
      this.masterClockStartTime = ctx.currentTime;
    }

    let startOffset = 0;
    if (isInteriorTransition && wasInterior && isInterior) {
      const elapsed = ctx.currentTime - this.masterClockStartTime;
      startOffset = Math.max(0, elapsed % stems.bed.duration);
    } else if (isInteriorTransition) {
      const elapsed = ctx.currentTime - this.masterClockStartTime;
      startOffset = Math.max(0, elapsed % stems.bed.duration);
    } else {
      startOffset = 0;
      this.masterClockStartTime = ctx.currentTime;
    }

    this.updateZoneFilter(targetZone, isInteriorTransition);

    if (this.surfBusGain) {
      this.surfBusGain.gain.cancelScheduledValues(ctx.currentTime);
      this.surfBusGain.gain.setValueAtTime(this.surfBusGain.gain.value, ctx.currentTime);
      if (targetZone === 'HARBOR') {
        if (!this.surfSourceNode) {
          this.startSurfLoop();
        }
        this.surfBusGain.gain.linearRampToValueAtTime(0.58, ctx.currentTime + 0.15);
      } else {
        this.surfBusGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      }
    }

    if (oldGain && oldLeadSource && oldBedSource) {
      oldGain.gain.cancelScheduledValues(ctx.currentTime);
      oldGain.gain.setValueAtTime(Math.max(0.0001, oldGain.gain.value), ctx.currentTime);
      oldGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + crossfadeDuration);

      const stopTime = ctx.currentTime + crossfadeDuration + 0.02;
      try {
        oldLeadSource.stop(stopTime);
        oldBedSource.stop(stopTime);
      } catch {
        // Safe
      }

      setTimeout(() => {
        try {
          oldLeadSource.disconnect();
          oldBedSource.disconnect();
          oldGain.disconnect();
        } catch {
          // Safe
        }
      }, Math.round((crossfadeDuration + 0.06) * 1000));
    }

    const newLeadSource = ctx.createBufferSource();
    newLeadSource.buffer = stems.lead;
    newLeadSource.loop = true;

    const newBedSource = ctx.createBufferSource();
    newBedSource.buffer = stems.bed;
    newBedSource.loop = true;

    const leadGain = ctx.createGain();
    const targetLeadGain = this.isDucked ? 0.0001 : 1.0;
    leadGain.gain.setValueAtTime(targetLeadGain, ctx.currentTime);

    const bedGain = ctx.createGain();
    bedGain.gain.setValueAtTime(1.0, ctx.currentTime);

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(1.0, ctx.currentTime);

    newLeadSource.connect(leadGain);
    leadGain.connect(trackGain);

    newBedSource.connect(bedGain);
    bedGain.connect(trackGain);

    trackGain.connect(this.overworldBusGain);

    const startTime = ctx.currentTime;
    newLeadSource.start(startTime, startOffset);
    newBedSource.start(startTime, startOffset);

    this.currentLeadSource = newLeadSource;
    this.currentBedSource = newBedSource;
    this.currentLeadGain = leadGain;
    this.currentBedGain = bedGain;
    this.currentTrackGain = trackGain;
    this.pendingZoneId = null;
    this.isSwitching = false;
  }

  public start(trackId?: TrackId | string): Promise<void> {
    return this.play(trackId || 'HARBOR');
  }

  public switchRoom(roomId: string, isBattle = false, enemyPoetId?: string): Promise<void> {
    if (isBattle) {
      if (isBossPoet(enemyPoetId)) {
        return this.play('BOSS_DUEL');
      }
      return this.play('BATTLE');
    }
    const zone = getZoneForRoom(roomId, false, enemyPoetId);
    return this.play(zone);
  }

  /**
   * SPECTRAL CARVING: Overworld music filter kept in warm 1200Hz–1400Hz pocket
   * so it doesn't fight the 1.5kHz–4kHz range where tactile SFX sparkle.
   */
  private updateZoneFilter(zone: ZoneId, isTransition = false): void {
    const ctx = this.ctx;
    if (!ctx || !this.duckingFilter) return;

    let targetCutoff = 1350; // warm 1200Hz-1400Hz baseline
    if (zone === 'INTERIORS') {
      targetCutoff = 750;
    } else if (zone === 'HARBOR') {
      targetCutoff = 1300;
    } else if (zone === 'TOWN') {
      targetCutoff = 1350;
    } else if (zone === 'CLIFFS') {
      targetCutoff = 1400;
    } else if (zone === 'RUINS') {
      targetCutoff = 1300;
    } else if (zone === 'TREELINE') {
      targetCutoff = 1250;
    } else if (zone === 'SUMMIT') {
      targetCutoff = 1400;
    } else if (zone === 'BATTLE') {
      targetCutoff = 1800;
    } else if (zone === 'BOSS_DUEL') {
      targetCutoff = 2200;
    } else if (zone === 'VICTORY' || zone === 'VICTORY_FANFARE') {
      targetCutoff = 1800;
    }

    if (this.isDucked) {
      targetCutoff = Math.min(targetCutoff, 850);
    }

    const rampTime = isTransition ? 0.18 : 0.22;

    try {
      this.duckingFilter.frequency.cancelScheduledValues(ctx.currentTime);
      const curFreq = Math.max(100, this.duckingFilter.frequency.value);
      this.duckingFilter.frequency.setValueAtTime(curFreq, ctx.currentTime);
      this.duckingFilter.frequency.exponentialRampToValueAtTime(targetCutoff, ctx.currentTime + rampTime);
    } catch {
      // Safe
    }
  }

  public setCrisis(isCrisis: boolean): void {
    this.isCrisis = isCrisis;
    if (!this.ctx || this.ctx.state === 'closed') return;
    const ctx = this.ctx;

    const rate = isCrisis ? 1.06 : 1.0;
    if (this.battleLeadSource) {
      try {
        this.battleLeadSource.playbackRate.setValueAtTime(this.battleLeadSource.playbackRate.value, ctx.currentTime);
        this.battleLeadSource.playbackRate.linearRampToValueAtTime(rate, ctx.currentTime + 0.2);
      } catch {
        // Safe
      }
    }
    if (this.battleBedSource) {
      try {
        this.battleBedSource.playbackRate.setValueAtTime(this.battleBedSource.playbackRate.value, ctx.currentTime);
        this.battleBedSource.playbackRate.linearRampToValueAtTime(rate, ctx.currentTime + 0.2);
      } catch {
        // Safe
      }
    }
  }

  private playPicardyChordSwell(): void {
    const ctx = this.ctx;
    if (!ctx || ctx.state === 'closed' || !this.victoryBusGain) return;

    const now = ctx.currentTime + 0.01;
    const tones = [
      { note: 'C2', dur: 2.8, vol: 0.7, type: 'bass' },
      { note: 'G2', dur: 2.8, vol: 0.5, type: 'bass' },
      { note: 'C3', dur: 3.2, vol: 0.35, type: 'pad' },
      { note: 'G3', dur: 3.2, vol: 0.35, type: 'pad' },
      { note: 'C4', dur: 3.5, vol: 0.38, type: 'pad' },
      { note: 'E4', dur: 3.5, vol: 0.42, type: 'pad' },
      { note: 'G4', dur: 3.5, vol: 0.38, type: 'pad' },
      { note: 'B4', dur: 3.0, vol: 0.28, type: 'ep' },
      { note: 'D5', dur: 2.8, vol: 0.30, type: 'ep' },
    ];

    for (const t of tones) {
      const f = getFreq(t.note);
      if (f > 0) {
        if (t.type === 'bass') {
          synthVoice3Bass(ctx, this.victoryBusGain, now, t.dur, f, t.vol, 180);
        } else if (t.type === 'ep') {
          synthElectricPiano(ctx, this.victoryBusGain, now, t.dur, f, t.vol, false);
        } else {
          synthVoice2Pad(ctx, this.victoryBusGain, now, t.dur, f, t.vol, 1600, false);
        }
      }
    }
  }

  public playVictoryFanfare(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.victoryBusGain || !this.battleBusGain) return;

    this.activeTrackId = 'VICTORY_FANFARE';
    this.activeZoneId = 'VICTORY_FANFARE';

    this.battleBusGain.gain.cancelScheduledValues(ctx.currentTime);
    this.battleBusGain.gain.setValueAtTime(this.battleBusGain.gain.value, ctx.currentTime);
    this.battleBusGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.10);

    this.victoryBusGain.gain.cancelScheduledValues(ctx.currentTime);
    this.victoryBusGain.gain.setValueAtTime(0.001, ctx.currentTime);
    this.victoryBusGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.04);

    this.updateZoneFilter('VICTORY_FANFARE', true);
    this.playPicardyChordSwell();

    void (async () => {
      const stems = await this.getTrackBuffer('VICTORY');
      if (!stems || (this.activeZoneId !== 'VICTORY_FANFARE' && this.activeZoneId !== 'VICTORY')) return;

      const oldVicSource = this.victorySourceNode;
      const oldVicGain = this.victoryTrackGain;

      const vicSource = ctx.createBufferSource();
      vicSource.buffer = stems.bed;
      vicSource.loop = true;

      const vicGain = ctx.createGain();
      vicGain.gain.setValueAtTime(0.001, ctx.currentTime);
      vicGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.22);

      vicSource.connect(vicGain);
      vicGain.connect(this.victoryBusGain!);

      vicSource.start(ctx.currentTime + 0.02, 0);

      this.victorySourceNode = vicSource;
      this.victoryTrackGain = vicGain;

      if (oldVicSource && oldVicGain) {
        oldVicGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        setTimeout(() => {
          try {
            oldVicSource.stop();
            oldVicSource.disconnect();
            oldVicGain.disconnect();
          } catch {
            // Safe
          }
        }, 150);
      }
    })();
  }

  public setMusicEnabled(enabled: boolean): void {
    this.setMuted(!enabled);
  }

  public toggleMusic(): boolean {
    return this.toggleMute();
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      localStorage.setItem('poetmon_music_muted', String(muted));
    } catch {
      // Ignore
    }

    if (!this.ctx || this.ctx.state === 'closed' || !this.masterGain) return;

    const target = muted ? 0 : this.volume;
    try {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.08);
    } catch {
      // Safe
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (!this.ctx || this.ctx.state === 'closed' || !this.masterGain || this.isMuted) return;

    try {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    } catch {
      // Safe
    }
  }

  public stop(fadeDuration = 0.22): void {
    this.activeTrackId = null;
    this.activeZoneId = null;
    this.isBattleActive = false;
    const ctx = this.ctx;

    if (!ctx) return;

    if (this.currentTrackGain && (this.currentLeadSource || this.currentBedSource)) {
      const leadSrc = this.currentLeadSource;
      const bedSrc = this.currentBedSource;
      const gain = this.currentTrackGain;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + fadeDuration);
      setTimeout(() => {
        try {
          leadSrc?.stop();
          bedSrc?.stop();
          leadSrc?.disconnect();
          bedSrc?.disconnect();
          gain.disconnect();
        } catch {
          // Safe
        }
      }, 250);
      this.currentLeadSource = null;
      this.currentBedSource = null;
      this.currentLeadGain = null;
      this.currentBedGain = null;
      this.currentTrackGain = null;
    }

    if (this.battleTrackGain && (this.battleLeadSource || this.battleBedSource)) {
      const leadSrc = this.battleLeadSource;
      const bedSrc = this.battleBedSource;
      const gain = this.battleTrackGain;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + fadeDuration);
      setTimeout(() => {
        try {
          leadSrc?.stop();
          bedSrc?.stop();
          leadSrc?.disconnect();
          bedSrc?.disconnect();
          gain.disconnect();
        } catch {
          // Safe
        }
      }, 250);
      this.battleLeadSource = null;
      this.battleBedSource = null;
      this.battleLeadGain = null;
      this.battleBedGain = null;
      this.battleTrackGain = null;
    }

    if (this.victoryTrackGain && this.victorySourceNode) {
      const src = this.victorySourceNode;
      const gain = this.victoryTrackGain;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + fadeDuration);
      setTimeout(() => {
        try {
          src.stop();
          src.disconnect();
          gain.disconnect();
        } catch {
          // Safe
        }
      }, 250);
      this.victorySourceNode = null;
      this.victoryTrackGain = null;
    }
  }

  public getActiveTrackId(): TrackId | string | null {
    return this.activeTrackId;
  }

  public getActiveZoneId(): ZoneId | null {
    return this.activeZoneId;
  }

  public startBattle(duelistId?: string): Promise<void> {
    if (isBossPoet(duelistId)) {
      return this.play('BOSS_DUEL');
    }
    return this.play('BATTLE');
  }

  public playBattleMusic(duelistId?: string): Promise<void> {
    return this.startBattle(duelistId);
  }
}

export const soundtrackEngine = new SoundtrackEngine();

// Connect GameAudio spotlight ducking callback to SoundtrackEngine
gameAudio.setDuckingCallback((holdMs, duckAmount) => {
  soundtrackEngine.triggerSfxDucking(holdMs, duckAmount);
});

export function triggerSfxDucking(holdMs = 450, duckAmount = 0.82): void {
  soundtrackEngine.triggerSfxDucking(holdMs, duckAmount);
}

export function playSfx(name: string, ...args: unknown[]): void {
  const audioMap = gameAudio as unknown as Record<string, (...a: unknown[]) => void>;
  if (typeof audioMap[name] === 'function') {
    audioMap[name](...args);
  } else {
    gameAudio.playCrispClick();
  }
}

export { gameAudio } from '../utils/helper';

export function playBattleMusic(duelistId?: string): Promise<void> {
  return soundtrackEngine.playBattleMusic(duelistId);
}

export function playPrologueAdvance(slideIndex: number): void {
  gameAudio.playPrologueAdvance(slideIndex);
}

export function playCantoCardChime(): void {
  gameAudio.playCantoCardChime();
}

export function playPorlockKnock(): void {
  gameAudio.playPorlockKnock();
}

export function playDoorKnock(): void {
  gameAudio.playDoorKnock();
}

export function setPrologueMovement(movementIndex: number): void {
  soundtrackEngine.setPrologueMovement(movementIndex);
}

export function setPrologueSlide(slideIndex: number): void {
  soundtrackEngine.setPrologueSlide(slideIndex);
}

export function fadePrologueToSilence(fadeMs = 300): void {
  soundtrackEngine.fadePrologueToSilence(fadeMs);
}

export function setMusicEnabled(enabled: boolean): void {
  soundtrackEngine.setMusicEnabled(enabled);
}

export function getMusicEnabled(): boolean {
  return !soundtrackEngine.getMuted();
}

export function toggleMusicEnabled(): boolean {
  return !soundtrackEngine.toggleMusic();
}

export function setDucking(isDucked: boolean): void {
  soundtrackEngine.setDucking(isDucked);
}

export function startBattle(duelistId?: string): Promise<void> {
  return soundtrackEngine.switchRoom('BATTLE', true, duelistId);
}

export function switchRoom(roomId: string, isBattle = false, enemyPoetId?: string): Promise<void> {
  return soundtrackEngine.switchRoom(roomId, isBattle, enemyPoetId);
}
