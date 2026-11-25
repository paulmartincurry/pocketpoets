// tslint:disable
/* eslint-disable */
import React, {
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type RefObject,
} from 'react';

/**  --- Overlay component ---
 * A full-screen UI overlay component used to display game states
 * such as Start Menus, Pause Screens, Game Over, and Victory screens.
 * It renders a semi-transparent background with a title, optional description,
 * and a primary action button.
 */

type OverlayTone = 'neutral' | 'danger' | 'victory';

interface OverlayProps {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
  icon?: React.ReactNode;
  tone?: OverlayTone;
  autoFocus?: boolean;
}

const TONE_CLASS: Record<OverlayTone, string> = {
  neutral: 'bg-[#000000]/65 backdrop-blur-[2px]',
  danger: 'bg-[#7A0909]/75 backdrop-blur-[2px]',
  victory: 'bg-[#1B2368]/75 backdrop-blur-[2px]',
};

const BUTTON_CLASS: Record<OverlayTone, string> = {
  neutral: 'hover:bg-[#FFDE00]',
  danger: 'hover:bg-[#EE1515]',
  victory: 'hover:bg-[#3B4CCA]',
};

/**
 * @param title - The main, large heading text to display (e.g., "GAME OVER").
 * @param description - Optional subtitle text to display below the title (e.g., "Final Score: 42").
 * @param actionLabel - The text to display inside the primary action button (e.g., "PLAY AGAIN").
 * @param onAction - Callback function executed when the user clicks the primary action button.
 * @param icon - Optional React node (like a Lucide icon) rendered inside the action button next to the label.
 * @param tone - The visual theme of the overlay which dictates background and hover colors. Defaults to 'neutral'. ('neutral' | 'danger' | 'victory')
 */
/** Focuses the referenced element on mount to ensure Enter works. */
export function useAutoFocus<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    // Only focus if enabled is true
    if (enabled && ref.current) {
      ref.current.focus();
    }
  }, [enabled]);
  return ref;
}

export function Overlay({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  tone = 'neutral',
  autoFocus = true,
}: OverlayProps) {
  const buttonRef = useAutoFocus<HTMLButtonElement>(autoFocus);

  return (
    <div
      className={`absolute inset-0 ${TONE_CLASS[tone]} overflow-y-auto touch-auto`}>
      <div className="min-h-full flex flex-col items-center p-4">
        <div className="m-auto flex flex-col items-center w-full max-w-md">
          <h1 className="text-3xl md:text-5xl font-black mb-4 text-yellow-400 text-center">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-2xl mb-8 text-center">
              {description}
            </p>
          )}
          <button
            ref={buttonRef}
            autoFocus={autoFocus}
            onClick={onAction}
            data-testid="start-button"
            className={`bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-lg md:text-xl transition-colors flex items-center gap-2 ${BUTTON_CLASS[tone]}`}>
            {icon}
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export interface MenuOverlayProps {
  children: React.ReactNode;
  tone?: OverlayTone;
  zIndex?: number;
}

/**
 * A highly resilient menu wrapper that statically decouples scrolling from flexbox alignment.
 * It strictly avoids the clipping bug on mobile by preventing flex justify-center from being assigned
 * to the overflow-y-auto boundary. Plugs seamlessly into the AI's generation workflows.
 * The inner children should provide their own box styling (e.g., w-full max-w-md bg-slate-900 rounded).
 */
export function MenuOverlay({
  children,
  tone = 'neutral',
  zIndex = 40,
}: MenuOverlayProps) {
  return (
    <div
      className={`absolute inset-0 ${TONE_CLASS[tone]} overflow-y-auto touch-auto`}
      style={{zIndex}}>
      <div className="min-h-full flex flex-col items-center p-3 sm:p-4">
        <div className="m-auto w-full flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Actions that can be triggered by the user. */
export type InputAction =
  | 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'confirm'
  | 'cancel'
  | 'tap';

/** Represents the state of the pointer (mouse or touch). */
export interface PointerState {
  /** The X coordinate of the pointer. */
  x: number;
  /** The Y coordinate of the pointer. */
  y: number;
  /** Whether the pointer is currently pressed down. */
  down: boolean;
}

/** A snapshot of the input state at a specific frame. */
export interface InputSnapshot {
  /** Map of actions to their active state. */
  actions: Record<InputAction, boolean>;
  /** The current state of the pointer. */
  pointer: PointerState;
}

interface LogicalSize {
  width: number;
  height: number;
}

const ACTION_KEYS: Record<string, InputAction> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  a: 'left',
  d: 'right',
  w: 'up',
  s: 'down',
  Enter: 'confirm',
  ' ': 'confirm',
  Space: 'confirm',
  Spacebar: 'confirm',
  e: 'confirm',
  E: 'confirm',
  z: 'confirm',
  Z: 'confirm',
  Escape: 'cancel',
  x: 'cancel',
  X: 'cancel',
};

/**
 * Initializes all input actions to a default 'false' state.
 */
const createEmptyActions = (): Record<InputAction, boolean> => ({
  left: false,
  right: false,
  up: false,
  down: false,
  confirm: false,
  cancel: false,
  tap: false,
});

/**
 * Calculates the pointer's logical X/Y coordinates on the canvas.
 */
const getPointerPosition = (
  event: PointerEvent,
  canvas: HTMLCanvasElement,
  logicalSize?: LogicalSize,
): {x: number; y: number} => {
  const rect = canvas.getBoundingClientRect();
  const width = logicalSize?.width ?? rect.width;
  const height = logicalSize?.height ?? rect.height;
  const x = (event.clientX - rect.left) * (width / rect.width);
  const y = (event.clientY - rect.top) * (height / rect.height);
  return {x, y};
};

/**
 * Hook to capture and manage user input (keyboard and pointer).
 * @param canvasRef Reference to the game canvas element.
 * @param enabled Whether input capture is enabled.
 * @param logicalSize Optional logical size of the canvas for coordinate scaling.
 * @returns A mutable ref containing the current input snapshot.
 */
export const useInput = (
  canvasRef: RefObject<HTMLCanvasElement>,
  enabled = true,
  logicalSize?: LogicalSize,
): MutableRefObject<InputSnapshot> => {
  const inputRef = useRef<InputSnapshot>({
    actions: createEmptyActions(),
    pointer: {x: 0, y: 0, down: false},
  });

  useEffect(() => {
    if (!enabled) {
      inputRef.current.actions = createEmptyActions();
      inputRef.current.pointer = {x: 0, y: 0, down: false};
      return;
    }

    // The game reads keys once per animation frame. A very quick tap (key down and up
    // inside one frame, or during a slow frame) used to vanish before the game looked.
    // So every press is held for at least MIN_PRESS_MS, long enough to be seen.
    const MIN_PRESS_MS = 80;
    const pressedAt: Record<string, number> = {};
    const releaseTimers: Record<string, number> = {};

    const handleKeyDown = (event: KeyboardEvent) => {
      let action = ACTION_KEYS[event.key];
      if (!action) {
        if (
          event.code === 'Space' ||
          event.code === 'Enter' ||
          event.code === 'KeyE' ||
          event.code === 'KeyZ'
        ) {
          action = 'confirm';
        } else if (event.code === 'Escape' || event.code === 'KeyX') {
          action = 'cancel';
        }
      }
      if (!action) return;
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          ' ',
          'Space',
          'Spacebar',
        ].includes(event.key) ||
        event.code === 'Space'
      ) {
        event.preventDefault();
      }
      if (releaseTimers[action] !== undefined) {
        window.clearTimeout(releaseTimers[action]);
        delete releaseTimers[action];
      }
      if (!inputRef.current.actions[action]) pressedAt[action] = performance.now();
      inputRef.current.actions[action] = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      let action = ACTION_KEYS[event.key];
      if (!action) {
        if (
          event.code === 'Space' ||
          event.code === 'Enter' ||
          event.code === 'KeyE' ||
          event.code === 'KeyZ'
        ) {
          action = 'confirm';
        } else if (event.code === 'Escape' || event.code === 'KeyX') {
          action = 'cancel';
        }
      }
      if (!action) return;
      const releasedAction = action;
      const heldFor = performance.now() - (pressedAt[releasedAction] ?? 0);
      if (heldFor >= MIN_PRESS_MS) {
        inputRef.current.actions[releasedAction] = false;
        return;
      }
      if (releaseTimers[releasedAction] !== undefined) window.clearTimeout(releaseTimers[releasedAction]);
      releaseTimers[releasedAction] = window.setTimeout(() => {
        inputRef.current.actions[releasedAction] = false;
        delete releaseTimers[releasedAction];
      }, MIN_PRESS_MS - heldFor);
    };

    const canvas = canvasRef.current;
    const handlePointerDown = (event: PointerEvent) => {
      if (!canvas) return;
      if (typeof canvas.setPointerCapture === 'function') {
        canvas.setPointerCapture(event.pointerId);
      }
      inputRef.current.pointer = {
        ...getPointerPosition(event, canvas, logicalSize),
        down: true,
      };
      inputRef.current.actions.tap = true;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!canvas) return;
      inputRef.current.pointer = {
        ...getPointerPosition(event, canvas, logicalSize),
        down: inputRef.current.pointer.down,
      };
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!canvas) return;
      if (
        typeof canvas.releasePointerCapture === 'function' &&
        canvas.hasPointerCapture(event.pointerId)
      ) {
        canvas.releasePointerCapture(event.pointerId);
      }
      inputRef.current.pointer = {
        ...getPointerPosition(event, canvas, logicalSize),
        down: false,
      };
      inputRef.current.actions.tap = false;
    };

    const handleBlur = () => {
      for (const key of Object.keys(releaseTimers)) {
        window.clearTimeout(releaseTimers[key]);
        delete releaseTimers[key];
      }
      inputRef.current.actions = createEmptyActions();
      if (inputRef.current.pointer) {
        inputRef.current.pointer.down = false;
      }
      inputRef.current.actions.tap = false;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleBlur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (canvas) {
      canvas.addEventListener('pointerdown', handlePointerDown);
      canvas.addEventListener('pointermove', handlePointerMove);
      canvas.addEventListener('pointerup', handlePointerUp);
      canvas.addEventListener('pointercancel', handlePointerUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (canvas) {
        canvas.removeEventListener('pointerdown', handlePointerDown);
        canvas.removeEventListener('pointermove', handlePointerMove);
        canvas.removeEventListener('pointerup', handlePointerUp);
        canvas.removeEventListener('pointercancel', handlePointerUp);
      }
    };
  }, [canvasRef, enabled]);

  return inputRef;
};

/**
 * audio.ts — procedural sound effects via the Web Audio API.
 *
 * No asset files, no network: every sound is synthesized on the fly. Import the
 * shared `gameAudio` singleton, insert required SFX methods, and call them:
 *
 *   import { gameAudio } from './utils/helper';
 *
 *   // After inserting playArcadeLaser:
 *   gameAudio.playArcadeLaser();         // on shoot
 *
 * Autoplay: browsers block audio until the first user gesture. This module
 * unlocks itself on the first pointer/key/touch event, and every play call also
 * resumes the context — so it is safe to call any method at any time; calls made
 * before the first interaction simply no-op instead of throwing.
 *
 * Volume & mute are global (master): gameAudio.setVolume(0.4),
 * gameAudio.toggleMute().
 */

interface Beat {
  ctx: AudioContext;
  out: GainNode;
  now: number;
}

class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private sfxMaster: GainNode | null = null;
  private muted = false; // SFX muted
  private volume = 0.85; // master SFX headroom balance
  private duckingCallback?: (holdMs?: number, duckAmount?: number) => void;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('playground-mute', (e: Event) => {
        const customEvent = e as CustomEvent<{muted: boolean}>;
        this.setMuted(customEvent.detail.muted);
      });
    }
  }

  /** Set callback to trigger spotlight ducking in SoundtrackEngine */
  public setDuckingCallback(cb: (holdMs?: number, duckAmount?: number) => void) {
    this.duckingCallback = cb;
  }

  /** Trigger event-driven spotlight ducking helper */
  public triggerDucking(holdMs = 450, duckAmount = 0.82) {
    if (this.duckingCallback) {
      try {
        this.duckingCallback(holdMs, duckAmount);
      } catch {
        // Safe
      }
    }
  }

  // --- Context lifecycle -----------------------------------------------------

  /**
   * Lazily create the AudioContext + master gain on first use. Returns null when
   * Web Audio is unavailable (e.g. during SSR), in which case all play calls
   * become no-ops.
   */
  private ensure(): AudioContext | null {
    if (this.ctx && this.ctx.state !== 'closed') return this.ctx;
    if (typeof window === 'undefined') return null;

    const Ctor =
      window.AudioContext ||
      (window as unknown as {webkitAudioContext?: typeof AudioContext})
        .webkitAudioContext;
    if (!Ctor) {
      console.warn('[audio] Web Audio API not supported');
      return null;
    }

    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.sfxMaster = this.ctx.createGain();
    this.master.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.sfxMaster.gain.setValueAtTime(
      this.muted ? 0 : 1,
      this.ctx.currentTime,
    );
    this.sfxMaster.connect(this.master);
    this.master.connect(this.ctx.destination);
    this.attachUnlock();
    return this.ctx;
  }

  /** Resume the context on the first user gesture (one-shot). */
  private attachUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      void this.ctx?.resume().catch(() => {});
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    window.addEventListener('touchstart', unlock);
  }

  /** Manually resume the context — call from a click handler if needed. */
  resume() {
    const ctx = this.ensure();
    if (ctx && ctx.state === 'suspended') void ctx.resume().catch(() => {});
  }

  /** Prepare to play a one-shot. Returns null when muted or unavailable. */
  private begin(): Beat | null {
    const ctx = this.ensure();
    const out = this.sfxMaster;
    if (!ctx || !out || this.muted) return null;
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
    return {ctx, out, now: ctx.currentTime};
  }

  // --- Master controls -------------------------------------------------------

  /** Set master volume (0..1). Affects SFX. */
  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master && this.ctx && !this.muted) {
      this.master.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  /** Toggle global SFX mute. Returns the new muted state. */
  toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.sfxMaster && this.ctx) {
      this.sfxMaster.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
  }

  getMuteState(): boolean {
    return this.muted;
  }

  // --- Synthesis helpers -----------------------------------------------------

  /** Schedule one enveloped oscillator. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private blip(
    b: Beat,
    at: number,
    o: {
      freq: number;
      freqTo?: number;
      dur: number;
      type?: OscillatorType;
      gain?: number;
      glide?: 'exp' | 'lin';
    },
  ) {
    const {ctx, out} = b;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();

    osc.type = o.type ?? 'square';
    osc.frequency.setValueAtTime(o.freq, at);
    if (o.freqTo !== undefined) {
      if ((o.glide ?? 'exp') === 'lin') {
        osc.frequency.linearRampToValueAtTime(o.freqTo, at + o.dur);
      } else {
        // Exponential ramps cannot target 0.
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(1, o.freqTo),
          at + o.dur,
        );
      }
    }

    const peak = o.gain ?? 0.15;
    g.gain.setValueAtTime(peak, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + o.dur);

    osc.connect(g);
    g.connect(out);
    osc.start(at);
    osc.stop(at + o.dur + 0.02);
  }

  /** Schedule a filtered white-noise burst (impacts, explosions). */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private noiseBurst(
    b: Beat,
    at: number,
    o: {
      dur: number;
      gain?: number;
      from?: number;
      to?: number;
      type?: BiquadFilterType;
      Q?: number;
      pink?: boolean;
    },
  ) {
    const {ctx, out} = b;
    const len = Math.max(1, Math.floor(ctx.sampleRate * o.dur));
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    if (o.pink) {
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.12;
      }
    } else {
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    }

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = o.type ?? 'lowpass';
    if (o.Q !== undefined) filter.Q.setValueAtTime(o.Q, at);
    filter.frequency.setValueAtTime(o.from ?? 1000, at);
    if (o.to !== undefined) {
      filter.frequency.exponentialRampToValueAtTime(
        Math.max(1, o.to),
        at + o.dur,
      );
    }

    const g = ctx.createGain();
    g.gain.setValueAtTime(o.gain ?? 0.18, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + o.dur);

    src.connect(filter);
    filter.connect(g);
    g.connect(out);
    src.start(at);
    src.stop(at + o.dur);
  }

  /** Small random multiplier so rapid-fire sounds don't feel robotic. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private vary(amount = 0.05): number {
    return 1 + (Math.random() * 2 - 1) * amount;
  }

  // --- Sound effects ---------------------------------------------------------

  /** Generic one-shot tone — escape hatch for custom blips. */
  playTone(o: {
    type?: OscillatorType;
    freq: number;
    freqTo?: number;
    dur?: number;
    gain?: number;
  }) {
    const b = this.begin();
    if (!b) return;
    this.blip(b, b.now, {
      type: o.type,
      freq: o.freq,
      freqTo: o.freqTo,
      dur: o.dur ?? 0.15,
      gain: o.gain,
    });
  }

  /**
   * Slide-Advance Sound for Prologue:
   * Soft, low-passed paper/wood brush (~900Hz) paired with a subtle (0.04 gain),
   * long-decay sine harmonic note quantized to the tonic pentatonic scale.
   * During Movement III (Slides 9–12), shifts harmonic chime down an octave (C3, G3).
   */
  playPrologueAdvance(slideIndex: number) {
    const b = this.begin();
    if (!b) return;

    // Movement III: Slides 9 to 12 (0-indexed 8, 9, 10, 11)
    const isMovement3 = slideIndex >= 8 && slideIndex <= 11;

    // Soft, low-passed paper/wood brush (~900Hz)
    this.noiseBurst(b, b.now, {
      dur: 0.085,
      gain: 0.07,
      from: 920,
      to: 420,
      type: 'lowpass',
      pink: true,
    });
    this.blip(b, b.now, {
      type: 'triangle',
      freq: 240,
      freqTo: 90,
      dur: 0.04,
      gain: 0.045,
    });

    // Harmonic sine chime quantized to tonic pentatonic scale
    // Normal (Movements I, II, IV): C4, D4, E4, G4, A4 (261.63, 293.66, 329.63, 392.00, 440.00)
    // Movement III (Slides 9-12): C3, G3 (130.81, 196.00)
    const scale = isMovement3
      ? [130.81, 196.00]
      : [261.63, 293.66, 329.63, 392.00, 440.00];

    const freq = scale[slideIndex % scale.length];

    const osc = b.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, b.now);

    const g = b.ctx.createGain();
    g.gain.setValueAtTime(0.0001, b.now);
    g.gain.linearRampToValueAtTime(0.04, b.now + 0.008); // subtle 0.04 gain
    g.gain.exponentialRampToValueAtTime(0.0001, b.now + 0.85); // long decay

    osc.connect(g);
    g.connect(b.out);
    osc.start(b.now);
    osc.stop(b.now + 0.9);
  }

  /**
   * Canto Chapter Card Audio Cue:
   * Soft vellum page brush paired with a quiet, warm low sine fifth interval (D3/A3 fifth: 146.83Hz / 220.00Hz)
   * at gentle low gain ~0.022 with a warm 480Hz low-pass filter and smooth rounded decay.
   */
  playCantoCardChime() {
    const b = this.begin();
    if (!b) return;

    // Soft vellum paper rustle (warm low-passed filtered pink noise brush, 480Hz down to 220Hz)
    this.noiseBurst(b, b.now, {
      dur: 0.12,
      gain: 0.022,
      from: 480,
      to: 220,
      type: 'lowpass',
      pink: true,
    });
    this.blip(b, b.now, {
      type: 'triangle',
      freq: 140,
      freqTo: 65,
      dur: 0.06,
      gain: 0.016,
    });

    // Quiet, warm low sine fifth interval (D3: 146.83 Hz, A3: 220.00 Hz) at smooth low gain 0.022
    const notes = [146.83, 220.00];
    notes.forEach((freq) => {
      const osc = b.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, b.now);

      const flt = b.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(480, b.now);

      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, b.now);
      g.gain.linearRampToValueAtTime(0.022, b.now + 0.04);
      g.gain.setValueAtTime(0.022, b.now + 0.18);
      g.gain.exponentialRampToValueAtTime(0.0001, b.now + 1.1);

      osc.connect(flt);
      flt.connect(g);
      g.connect(b.out);
      osc.start(b.now);
      osc.stop(b.now + 1.15);
    });
  }

  playGbBootChime() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    this.blip(b, b.now, { type: 'triangle', freq: 523.25 * v, freqTo: 261.63 * v, dur: 0.18, gain: 0.05 });
    const dingTime = b.now + 0.28;
    this.blip(b, dingTime, { type: 'sine', freq: 1046.5 * v, dur: 0.4, gain: 0.08 });
    this.blip(b, dingTime, { type: 'triangle', freq: 1318.51 * v, dur: 0.4, gain: 0.06 });
  }

  playGbTitleTheme() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    const arpeggio = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    arpeggio.forEach((freq, i) => {
      this.blip(b, b.now + i * 0.06, { type: 'sine', freq: freq * v, dur: 0.12, gain: 0.04 });
    });
    const chordTime = b.now + arpeggio.length * 0.06;
    const chords = [523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq) => {
      this.blip(b, chordTime, { type: 'triangle', freq: freq * v, dur: 0.5, gain: 0.05 });
    });
  }

  playJumpLandingThud() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    this.blip(b, b.now, { type: 'sine', freq: 130 * v, freqTo: 35 * v, dur: 0.14, gain: 0.12 });
    this.noiseBurst(b, b.now, { dur: 0.08, gain: 0.06, from: 250, to: 50 });
  }

  /** Soft, octave-lowered micro-tone with sparkling upper-mid presence (2.2kHz) and punchy 3ms attack transient. */
  playHoverMicroTone() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.02);
    const dur = 0.055;
    const osc = b.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880 * v, b.now);

    const osc2 = b.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1760 * v, b.now);

    const flt = b.ctx.createBiquadFilter();
    flt.type = 'bandpass';
    flt.frequency.setValueAtTime(2200, b.now);
    flt.Q.setValueAtTime(1.5, b.now);

    const g = b.ctx.createGain();
    g.gain.setValueAtTime(0.0001, b.now);
    g.gain.linearRampToValueAtTime(0.32, b.now + 0.003); // punchy 3ms attack transient
    g.gain.exponentialRampToValueAtTime(0.0001, b.now + dur);

    osc.connect(flt);
    osc2.connect(flt);
    flt.connect(g);
    g.connect(b.out);
    osc.start(b.now);
    osc2.start(b.now);
    osc.stop(b.now + dur + 0.01);
    osc2.stop(b.now + dur + 0.01);
  }

  playTypewriterBeep() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.05);
    // Subtle whisper-soft wooden typewriter key clack: muted bandpass ~380Hz with fast 25ms decay (~0.038 peak gain)
    this.blip(b, b.now, { type: 'triangle', freq: 380 * v, freqTo: 210 * v, dur: 0.025, gain: 0.038 });
    this.noiseBurst(b, b.now, {
      dur: 0.025,
      gain: 0.028,
      from: 420 * v,
      to: 340 * v,
      type: 'bandpass',
      Q: 2.0,
      pink: true,
    });
  }

  playHpDrainTick() {
    const b = this.begin();
    if (!b) return;
    // Soft, warm drop of dark ink into glazed ceramic well (240Hz -> 130Hz sine, ultra-quiet, zero click)
    this.blip(b, b.now, { type: 'sine', freq: 240, freqTo: 130, dur: 0.026, gain: 0.025 });
  }

  playLowHpAlarm() {
    const b = this.begin();
    if (!b) return;
    // Warm, rounded warning pulse: soft triangle wave filtered through 800Hz LPF with smooth envelope
    const notes = [
      { f: 440.0, time: b.now, dur: 0.08 },
      { f: 392.0, time: b.now + 0.08, dur: 0.10 },
    ];
    notes.forEach((n) => {
      const osc = b.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, n.time);

      const flt = b.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(800, n.time);

      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, n.time);
      g.gain.linearRampToValueAtTime(0.08, n.time + 0.012); // smooth 12ms attack
      g.gain.exponentialRampToValueAtTime(0.0001, n.time + n.dur);

      osc.connect(flt);
      flt.connect(g);
      g.connect(b.out);
      osc.start(n.time);
      osc.stop(n.time + n.dur + 0.01);
    });
  }

  /** Warm triangle wave menu cancel with 3ms attack. */
  playMenuCancel() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.02);
    [
      { f: 440.00 * v, time: b.now, dur: 0.08 },
      { f: 329.63 * v, time: b.now + 0.05, dur: 0.12 },
    ].forEach((note) => {
      const osc = b.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, note.time);

      const flt = b.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(1400, note.time);

      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, note.time);
      g.gain.linearRampToValueAtTime(0.32, note.time + 0.003); // 3ms attack transient
      g.gain.exponentialRampToValueAtTime(0.0001, note.time + note.dur);

      osc.connect(flt);
      flt.connect(g);
      g.connect(b.out);
      osc.start(note.time);
      osc.stop(note.time + note.dur + 0.01);
    });
  }

  playSuperEffectiveImpact() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(400, 0.86);
    const v = this.vary(0.02);
    // Warm rounded sub-bass drop (sine 115Hz -> 36Hz)
    this.blip(b, b.now, { type: 'sine', freq: 115 * v, freqTo: 36 * v, dur: 0.26, gain: 0.32, glide: 'exp' });
    // Warm low-passed body (filtered below 850Hz to prevent harsh highs or clipping)
    this.noiseBurst(b, b.now, { dur: 0.12, gain: 0.18, from: 850 * v, to: 220 * v, type: 'lowpass', pink: true });
    // Tactile heavy impression body
    this.blip(b, b.now + 0.012, { type: 'triangle', freq: 260 * v, freqTo: 95 * v, dur: 0.16, gain: 0.22 });
  }

  private footstepWoodIsLeft = true;

  playFootstepWood() {
    const b = this.begin();
    if (!b) return;
    const isLeft = this.footstepWoodIsLeft;
    this.footstepWoodIsLeft = !this.footstepWoodIsLeft;
    const footMultiplier = isLeft ? 1.0 : 0.93;
    const jitter = 1 + (Math.random() * 0.06 - 0.03); // ±3% random jitter
    const v = footMultiplier * jitter;
    // Goldilocks sweet spot wooden step: ~750Hz low-pass filter, crisp and audible 0.15 peak gain
    this.blip(b, b.now, { type: 'triangle', freq: 220 * v, freqTo: 80 * v, dur: 0.06, gain: 0.15 });
    this.noiseBurst(b, b.now, { dur: 0.03, gain: 0.12, from: 750 * v, to: 240 * v, type: 'lowpass', pink: true });
  }

  playFootstepStone() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.04);
    // Goldilocks sweet spot stone step: ~750Hz low-pass filter, crisp and audible 0.15 peak gain
    this.noiseBurst(b, b.now, { dur: 0.035, gain: 0.14, from: 750 * v, to: 280 * v, type: 'lowpass', pink: true });
    this.blip(b, b.now, { type: 'sine', freq: 240 * v, freqTo: 110 * v, dur: 0.03, gain: 0.15 });
  }

  /** Soft muffled snow crunch with ~750Hz low-pass filter and satisfying 0.15 peak gain. */
  playFootstepSnow() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.05);
    this.noiseBurst(b, b.now, {
      dur: 0.06,
      gain: 0.15,
      from: 750 * v,
      to: 320 * v,
      type: 'lowpass',
      pink: true,
    });
    this.blip(b, b.now, { type: 'sine', freq: 120 * v, freqTo: 60 * v, dur: 0.05, gain: 0.12 });
  }

  playRetroJump() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    this.blip(b, b.now, { type: 'triangle', freq: 220 * v, freqTo: 640 * v, dur: 0.12, gain: 0.32 });
  }

  /** Rapid 3-tap low knock via Web Audio synth (~120Hz damped triangle/sine pulses) */
  playPorlockKnock() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.02);
    // Rapid 3-tap low knock at offsets 0, 110ms, 220ms (~120Hz damped pulses)
    [0.0, 0.11, 0.22].forEach((offset) => {
      const at = b.now + offset;
      const dur = 0.065;
      this.blip(b, at, { type: 'triangle', freq: 120 * v, freqTo: 45 * v, dur, gain: 0.40 });
      this.blip(b, at, { type: 'sine', freq: 85 * v, freqTo: 35 * v, dur: dur * 1.1, gain: 0.32 });
      this.noiseBurst(b, at, { dur: 0.035, gain: 0.18, from: 350 * v, to: 110 * v, type: 'lowpass', pink: true });
    });
  }

  playDoorKnock() {
    this.playPorlockKnock();
  }

  /** Wooden key click: warm 3ms initial attack transient, soft 1800Hz lowpass. Brittle during Dante slides. */
  playCrispClick(brittle = false) {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.02);
    const dur = brittle ? 0.038 : 0.05;
    const osc = b.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime((brittle ? 1180 : 620) * v, b.now);

    const flt = b.ctx.createBiquadFilter();
    if (brittle) {
      flt.type = 'highpass';
      flt.frequency.setValueAtTime(1400 * v, b.now);
    } else {
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(1800, b.now);
    }

    const g = b.ctx.createGain();
    g.gain.setValueAtTime(0.0001, b.now);
    g.gain.linearRampToValueAtTime(brittle ? 0.26 : 0.30, b.now + 0.004); // smooth 4ms attack transient
    g.gain.exponentialRampToValueAtTime(0.0001, b.now + dur);

    osc.connect(flt);
    flt.connect(g);
    g.connect(b.out);
    osc.start(b.now);
    osc.stop(b.now + dur + 0.01);

    // Subtle wooden/brittle tap noise
    if (brittle) {
      this.noiseBurst(b, b.now, { dur: 0.02, gain: 0.14, from: 2200 * v, to: 1600 * v, type: 'highpass', pink: true });
    } else {
      this.noiseBurst(b, b.now, { dur: 0.015, gain: 0.11, from: 1800 * v, to: 800 * v, type: 'lowpass', pink: true });
    }
  }

  /** Crisp 25ms wooden tick (triangle wave 680Hz -> 320Hz) for chibi character sprite rotation. */
  playSpriteRotateTick() {
    const b = this.begin();
    if (!b) return;
    this.blip(b, b.now, { type: 'triangle', freq: 680, freqTo: 320, dur: 0.025, gain: 0.22 });
  }

  /** Soft 75ms bandpass-filtered noise burst (1100Hz, Q: 1.8) for attire toggle cloth rustle. */
  playClothRustle() {
    const b = this.begin();
    if (!b) return;
    this.noiseBurst(b, b.now, {
      dur: 0.075,
      gain: 0.16,
      from: 1100,
      to: 950,
      type: 'bandpass',
      Q: 1.8,
      pink: true,
    });
  }

  /** Warm harmonic two-tone select chime with 3ms attack transient, peak ~0.36. */
  playConfirmSelect() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.02);
    [
      { f: 523.25 * v, time: b.now, dur: 0.09 },
      { f: 783.99 * v, time: b.now + 0.065, dur: 0.15 },
    ].forEach((note) => {
      const osc = b.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, note.time);

      const flt = b.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(2400, note.time);

      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, note.time);
      g.gain.linearRampToValueAtTime(0.36, note.time + 0.003); // 3ms attack transient
      g.gain.exponentialRampToValueAtTime(0.0001, note.time + note.dur);

      osc.connect(flt);
      flt.connect(g);
      g.connect(b.out);
      osc.start(note.time);
      osc.stop(note.time + note.dur + 0.01);
    });
  }

  playErrorBuzz() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    [
      { f: 174.61 * v, time: b.now, dur: 0.15 },
      { f: 164.81 * v, time: b.now + 0.05, dur: 0.18 },
    ].forEach((n) => {
      const osc = b.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, n.time);

      const flt = b.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(800, n.time);

      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, n.time);
      g.gain.linearRampToValueAtTime(0.24, n.time + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, n.time + n.dur);

      osc.connect(flt);
      flt.connect(g);
      g.connect(b.out);
      osc.start(n.time);
      osc.stop(n.time + n.dur + 0.01);
    });
  }

  /** Tactile "Leather Folio Whoosh & Warm Brass Latch" with soft attack and rolling off above 1600Hz */
  playArcadeLaser() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(600, 0.50);
    const v = this.vary(0.02);
    const dur = 0.24;

    // Warm parchment folio whoosh (filtered bandpass below 1200Hz, no harsh high hiss)
    this.noiseBurst(b, b.now, {
      dur: 0.18,
      gain: 0.28,
      from: 500 * v,
      to: 1200 * v,
      type: 'bandpass',
      Q: 1.4,
      pink: true,
    });

    const dm9 = [146.83, 174.61, 220.00, 261.63, 329.63];
    dm9.forEach((freq, idx) => {
      const osc = b.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * v, b.now);

      const flt = b.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(800 * v, b.now);

      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, b.now);
      g.gain.linearRampToValueAtTime(0.10 / (idx * 0.4 + 1), b.now + 0.012); // soft 12ms attack
      g.gain.exponentialRampToValueAtTime(0.0001, b.now + dur);

      osc.connect(flt);
      flt.connect(g);
      g.connect(b.out);
      osc.start(b.now);
      osc.stop(b.now + dur + 0.02);
    });

    // Mellow latch tone
    this.blip(b, b.now + 0.14, { type: 'sine', freq: 587 * v, freqTo: 392 * v, dur: 0.04, gain: 0.20 });
  }

  playGunshotBlast() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    this.blip(b, b.now, { type: 'sine', freq: 130 * v, freqTo: 38 * v, dur: 0.15, gain: 0.36 });
    this.noiseBurst(b, b.now, { dur: 0.08, gain: 0.28, from: 1100 * v, to: 350 * v, type: 'lowpass', pink: true });
  }

  /** Heavy Folio Slam & Ink Stamp Impact: deep leather-bound book snap + deckle-edge page air-rush (strictly low-passed below 1000Hz, zero click) */
  playSwordClash() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(350, 0.88);
    const v = this.vary(0.02);

    // Deep leather-bound book snapping shut: low 85Hz sub-thud
    this.blip(b, b.now, { type: 'sine', freq: 85 * v, freqTo: 42 * v, dur: 0.16, gain: 0.32, glide: 'exp' });

    // Soft 240Hz wooden table impact
    this.blip(b, b.now + 0.004, { type: 'triangle', freq: 240 * v, freqTo: 95 * v, dur: 0.08, gain: 0.22 });

    // Crisp air-rush of deckle-edge paper pages (low-passed below 950Hz, zero mechanical/bell transients)
    this.noiseBurst(b, b.now, {
      dur: 0.09,
      gain: 0.18,
      from: 950 * v,
      to: 320 * v,
      type: 'lowpass',
      pink: true,
    });
  }

  /** Tactile wooden letterpress strike: solid type-block impression on timber bed (warm, rounded impact) */
  playMeleePunch() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.03);

    // Wooden bed compression thud
    this.blip(b, b.now, { type: 'triangle', freq: 140 * v, freqTo: 55 * v, dur: 0.11, gain: 0.26 });
    this.blip(b, b.now, { type: 'sine', freq: 75 * v, freqTo: 35 * v, dur: 0.14, gain: 0.20 });

    // Letterpress type-block impression contact (warm lowpass below 650Hz)
    this.noiseBurst(b, b.now, {
      dur: 0.045,
      gain: 0.18,
      from: 650 * v,
      to: 260 * v,
      type: 'lowpass',
      pink: true,
    });
  }

  /** Vellum Shield Deflection: thick ream of manuscript paper absorbing an impact with a muted, papery thud (smooth 500Hz-800Hz low-pass) */
  playShieldBlock() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.03);

    // Muted papery thud
    this.blip(b, b.now, { type: 'triangle', freq: 120 * v, freqTo: 48 * v, dur: 0.12, gain: 0.24 });
    this.blip(b, b.now, { type: 'sine', freq: 80 * v, freqTo: 36 * v, dur: 0.14, gain: 0.20 });

    // Manuscript vellum absorption rustle smoothed with warm 500Hz-800Hz filter
    this.noiseBurst(b, b.now, {
      dur: 0.09,
      gain: 0.16,
      from: 720 * v,
      to: 240 * v,
      type: 'lowpass',
      pink: true,
    });
  }

  /** Wax Seal Fracture & Brass Plinth Impact: warm tactile crack + heavy solid-brass signet stamp + rich sub-bass bloom */
  playChiptuneExplosion() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(450, 0.85);
    const v = this.vary(0.02);

    // Warm tactile crack of sealing wax (bandpass below 1100Hz, no sharp high spikes)
    this.noiseBurst(b, b.now, {
      dur: 0.035,
      gain: 0.24,
      from: 1100 * v,
      to: 450 * v,
      type: 'bandpass',
      Q: 1.5,
      pink: true,
    });
    this.blip(b, b.now, { type: 'triangle', freq: 420 * v, freqTo: 180 * v, dur: 0.035, gain: 0.22 });

    // Heavy solid-brass signet stamp impact
    const stampAt = b.now + 0.015;
    this.blip(b, stampAt, { type: 'triangle', freq: 280 * v, freqTo: 110 * v, dur: 0.16, gain: 0.28 });
    this.noiseBurst(b, stampAt, { dur: 0.07, gain: 0.18, from: 850 * v, to: 300 * v, type: 'lowpass', pink: true });

    // Rich sub-bass bloom
    this.blip(b, stampAt + 0.01, { type: 'sine', freq: 60 * v, freqTo: 30 * v, dur: 0.32, gain: 0.34, glide: 'exp' });
  }

  playCoinPickup() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    this.blip(b, b.now, { type: 'sine', freq: 1174.66 * v, dur: 0.1, gain: 0.35 });
    this.blip(b, b.now + 0.07, { type: 'sine', freq: 1760.00 * v, dur: 0.18, gain: 0.35 });
  }

  playPowerupChime() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      this.blip(b, b.now + i * 0.06, { type: 'sine', freq: freq * v, dur: 0.15, gain: 0.28 });
    });
  }

  playPotionGulp() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    this.blip(b, b.now, { type: 'sine', freq: 440 * v, freqTo: 180 * v, dur: 0.15, gain: 0.35 });
    this.blip(b, b.now + 0.12, { type: 'sine', freq: 380 * v, freqTo: 150 * v, dur: 0.18, gain: 0.32 });
  }

  playVictoryFanfare() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(1200, 0.40);
    const v = this.vary();
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, i) => {
      this.blip(b, b.now + i * 0.1, { type: 'sawtooth', freq: freq * v, dur: 0.4, gain: 0.28 });
      this.blip(b, b.now + i * 0.1, { type: 'sine', freq: freq * v, dur: 0.4, gain: 0.22 });
    });
    const chordTime = notes.length * 0.1;
    notes.forEach((freq) => {
      this.blip(b, b.now + chordTime, { type: 'triangle', freq: freq * v, dur: 0.8, gain: 0.32 });
    });
  }

  playDefeatMotif() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(1200, 0.40);
    const v = this.vary();
    const notes = [311.13, 261.63, 246.94, 196.00];
    notes.forEach((freq, i) => {
      this.blip(b, b.now + i * 0.15, { type: 'sawtooth', freq: freq * v, dur: 0.3, gain: 0.32 });
      this.blip(b, b.now + i * 0.15, { type: 'sine', freq: freq * 0.5 * v, dur: 0.35, gain: 0.26 });
    });
  }

  playLevelUpStinger() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(1000, 0.40);
    const v = this.vary();
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      this.blip(b, b.now + i * 0.07, { type: 'sine', freq: freq * v, dur: 0.25, gain: 0.28 });
    });
    const tailTime = notes.length * 0.07;
    this.noiseBurst(b, b.now + tailTime, { dur: 0.8, gain: 0.22, from: 3000, to: 6000 });
    for (let i = 0; i < 5; i++) {
      this.blip(b, b.now + tailTime + i * 0.1, {
        type: 'sine',
        freq: (2000 + i * 500) * this.vary(0.1),
        dur: 0.2,
        gain: 0.20
      });
    }
  }

  playHearthCrackle() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    this.noiseBurst(b, b.now, { dur: 0.15, gain: 0.26, from: 2400 * v, to: 400 * v });
    this.blip(b, b.now + 0.04, { type: 'triangle', freq: 330 * v, freqTo: 140 * v, dur: 0.18, gain: 0.22 });
    this.blip(b, b.now + 0.12, { type: 'sine', freq: 880 * v, dur: 0.1, gain: 0.18 });
  }

  /** Tactile Parchment Page Turn: crisp 2ms attack, 2.8kHz–1.8kHz upper-mid presence, peak ~0.36. */
  playPageTurn() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    // Crisp paper flutter in 1.8kHz–3.5kHz range
    this.noiseBurst(b, b.now, { dur: 0.13, gain: 0.36, from: 3400 * v, to: 1600 * v, pink: true });
    this.blip(b, b.now + 0.002, { type: 'sine', freq: 980 * v, freqTo: 440 * v, dur: 0.07, gain: 0.26 });
  }

  playShoreWaveChime() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary();
    this.blip(b, b.now, { type: 'sine', freq: 587.33 * v, dur: 0.35, gain: 0.28 });
    this.blip(b, b.now + 0.1, { type: 'sine', freq: 880.0 * v, dur: 0.45, gain: 0.26 });
    this.blip(b, b.now + 0.22, { type: 'triangle', freq: 1174.66 * v, dur: 0.5, gain: 0.24 });
    this.noiseBurst(b, b.now, { dur: 0.4, gain: 0.18, from: 1200, to: 300 });
  }

  /** 5-note plucked tortoiseshell lyre glissando with 2ms attack, 2.2kHz presence, peak ~0.38. */
  playLyreGlissando() {
    this.playWindChime();
  }

  playWindChime() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(750, 0.50);
    const v = this.vary(0.015);
    const notes = [293.66, 349.23, 440.00, 523.25, 659.25];
    notes.forEach((freq, idx) => {
      const at = b.now + idx * 0.045;
      const dur = 0.75 - idx * 0.05;
      const osc = b.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * v, at);
      const osc2 = b.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2 * v, at);
      const flt = b.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(2800, at);
      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(0.38, at + 0.002); // 2ms attack transient
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      osc.connect(flt);
      osc2.connect(flt);
      flt.connect(g);
      g.connect(b.out);
      osc.start(at);
      osc2.start(at);
      osc.stop(at + dur + 0.02);
      osc2.stop(at + dur + 0.02);
    });
  }

  playRestSwell() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.01);
    const swellTones = [220.0, 329.63, 440.0, 554.37, 659.25, 880.0];
    swellTones.forEach((freq, idx) => {
      const at = b.now + idx * 0.08;
      this.blip(b, at, { type: 'sine', freq: freq * v, dur: 1.4, gain: 0.16 });
    });
  }

  playFootstepMud() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.08);
    this.noiseBurst(b, b.now, { dur: 0.07, gain: 0.28, from: 650 * v, to: 180 * v });
    this.blip(b, b.now, { type: 'sine', freq: 160 * v, freqTo: 60 * v, dur: 0.08, gain: 0.26 });
  }

  playClockChime() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.02);
    this.blip(b, b.now, { type: 'sine', freq: 659.25 * v, dur: 0.45, gain: 0.32 });
    this.blip(b, b.now + 0.15, { type: 'sine', freq: 523.25 * v, dur: 0.6, gain: 0.35 });
    this.blip(b, b.now + 0.15, { type: 'triangle', freq: 1046.5 * v, dur: 0.35, gain: 0.22 });
  }

  playAlembicBubble() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.12);
    this.blip(b, b.now, { type: 'sine', freq: 580 * v, freqTo: 920 * v, dur: 0.06, gain: 0.26 });
    this.blip(b, b.now + 0.05, { type: 'sine', freq: 640 * v, freqTo: 1080 * v, dur: 0.07, gain: 0.26 });
    this.blip(b, b.now + 0.11, { type: 'sine', freq: 720 * v, freqTo: 1200 * v, dur: 0.06, gain: 0.24 });
  }

  playIceSkateGlide() {
    const b = this.begin();
    if (!b) return;
    const v = this.vary(0.05);
    // Smooth ice glide with ~750Hz low-pass filter and satisfying 0.14 peak gain
    this.noiseBurst(b, b.now, { dur: 0.08, gain: 0.14, from: 750 * v, to: 320 * v, type: 'lowpass', pink: true });
    this.blip(b, b.now + 0.002, { type: 'sine', freq: 360 * v, freqTo: 240 * v, dur: 0.04, gain: 0.10 });
  }

  // --- PROCEDURAL WILDLIFE VOICINGS ---

  /** Hollow water-droplet plop: 2ms transient, 1.8kHz–2.6kHz droplet snap + 220Hz body, peak ~0.40. */
  playFrogPlop() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(450, 0.55);
    const v = this.vary(0.04);
    const dur = 0.14;
    const osc = b.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(680 * v, b.now);
    osc.frequency.exponentialRampToValueAtTime(220 * v, b.now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(540 * v, b.now + dur);

    const g = b.ctx.createGain();
    g.gain.setValueAtTime(0.0001, b.now);
    g.gain.linearRampToValueAtTime(0.40, b.now + 0.002); // 2ms attack transient
    g.gain.exponentialRampToValueAtTime(0.0001, b.now + dur);

    osc.connect(g);
    g.connect(b.out);
    osc.start(b.now);
    osc.stop(b.now + dur + 0.01);
    this.noiseBurst(b, b.now + 0.002, { dur: 0.08, gain: 0.28, from: 2400 * v, to: 600 * v, pink: true });
  }

  /** Warm two-note goose call: 3ms transient, 1.8kHz presence, peak ~0.36. */
  playGooseHonk() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(450, 0.55);
    const v = this.vary(0.04);
    [
      { f: 420 * v, time: b.now, dur: 0.11 },
      { f: 540 * v, time: b.now + 0.09, dur: 0.16 },
    ].forEach((note) => {
      const osc = b.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, note.time);
      const bpf = b.ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(1800, note.time);
      bpf.Q.setValueAtTime(2.2, note.time);
      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, note.time);
      g.gain.linearRampToValueAtTime(0.36, note.time + 0.003); // 3ms attack transient
      g.gain.exponentialRampToValueAtTime(0.0001, note.time + note.dur);
      osc.connect(bpf);
      bpf.connect(g);
      g.connect(b.out);
      osc.start(note.time);
      osc.stop(note.time + note.dur + 0.01);
    });
  }

  /** Friendly double woof: 2ms transient, 1.8kHz presence, peak ~0.38. */
  playDogBark() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(450, 0.55);
    const v = this.vary(0.05);
    [0.0, 0.13].forEach((offset) => {
      const at = b.now + offset;
      const dur = 0.10;
      const osc = b.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280 * v, at);
      osc.frequency.exponentialRampToValueAtTime(160 * v, at + dur);
      const flt = b.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(1800, at);
      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(0.38, at + 0.002); // 2ms attack transient
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      osc.connect(flt);
      flt.connect(g);
      g.connect(b.out);
      osc.start(at);
      osc.stop(at + dur + 0.01);
      this.noiseBurst(b, at, { dur: 0.04, gain: 0.25, from: 2200, to: 400, pink: true });
    });
  }

  /** Soft purr-trill + gentle descending meow: 3ms transient, 1.8kHz presence, peak ~0.35. */
  playCatMeow() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(450, 0.55);
    const v = this.vary(0.03);
    const dur = 0.32;
    const osc = b.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(680 * v, b.now);
    osc.frequency.linearRampToValueAtTime(740 * v, b.now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(460 * v, b.now + dur);

    const lfo = b.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(26, b.now);
    const lfoG = b.ctx.createGain();
    lfoG.gain.setValueAtTime(22, b.now);
    lfoG.gain.linearRampToValueAtTime(6, b.now + 0.1);
    lfoG.gain.linearRampToValueAtTime(0, b.now + 0.2);
    lfo.connect(lfoG);
    lfoG.connect(osc.frequency);
    lfo.start(b.now);
    lfo.stop(b.now + dur);

    const flt = b.ctx.createBiquadFilter();
    flt.type = 'lowpass';
    flt.frequency.setValueAtTime(2200, b.now);

    const g = b.ctx.createGain();
    g.gain.setValueAtTime(0.0001, b.now);
    g.gain.linearRampToValueAtTime(0.35, b.now + 0.003); // 3ms attack transient
    g.gain.exponentialRampToValueAtTime(0.0001, b.now + dur);

    osc.connect(flt);
    flt.connect(g);
    g.connect(b.out);
    osc.start(b.now);
    osc.stop(b.now + dur + 0.02);
  }

  playEspressoMachine() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(550, 0.50);
    const v = this.vary(0.04);
    // Warm steam hiss and bubbling extraction
    this.noiseBurst(b, b.now, { dur: 0.38, gain: 0.22, from: 2400 * v, to: 800 * v, pink: true });
    this.blip(b, b.now + 0.08, { type: 'sine', freq: 520 * v, freqTo: 780 * v, dur: 0.12, gain: 0.18 });
    this.blip(b, b.now + 0.18, { type: 'sine', freq: 620 * v, freqTo: 920 * v, dur: 0.14, gain: 0.20 });
  }

  /** Soft fluttering throat-coo: 3ms transient, peak ~0.35. */
  playPigeonCoo() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(450, 0.55);
    const v = this.vary(0.03);
    const dur = 0.28;
    const carrier = b.ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(360 * v, b.now);
    carrier.frequency.linearRampToValueAtTime(320 * v, b.now + dur);

    const amMod = b.ctx.createOscillator();
    amMod.type = 'sine';
    amMod.frequency.setValueAtTime(24, b.now);
    const amGain = b.ctx.createGain();
    amGain.gain.setValueAtTime(0.4, b.now);

    const mainGain = b.ctx.createGain();
    mainGain.gain.setValueAtTime(0.0001, b.now);
    mainGain.gain.linearRampToValueAtTime(0.35, b.now + 0.003); // 3ms attack transient
    mainGain.gain.exponentialRampToValueAtTime(0.0001, b.now + dur);

    amMod.connect(amGain.gain);
    carrier.connect(amGain);
    amGain.connect(mainGain);
    mainGain.connect(b.out);

    carrier.start(b.now);
    amMod.start(b.now);
    carrier.stop(b.now + dur + 0.02);
    amMod.stop(b.now + dur + 0.02);
  }

  /** Stoic mountain bleat: 3ms transient, peak ~0.36. */
  playGoatBleat() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(450, 0.55);
    const v = this.vary(0.03);
    const dur = 0.35;
    const osc = b.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(360 * v, b.now);

    const vib = b.ctx.createOscillator();
    vib.type = 'sine';
    vib.frequency.setValueAtTime(14, b.now);
    const vibG = b.ctx.createGain();
    vibG.gain.setValueAtTime(18, b.now);
    vib.connect(vibG);
    vibG.connect(osc.frequency);
    vib.start(b.now);
    vib.stop(b.now + dur);

    const flt = b.ctx.createBiquadFilter();
    flt.type = 'lowpass';
    flt.frequency.setValueAtTime(1600, b.now);
    flt.Q.setValueAtTime(2.2, b.now);

    const g = b.ctx.createGain();
    g.gain.setValueAtTime(0.0001, b.now);
    g.gain.linearRampToValueAtTime(0.36, b.now + 0.003); // 3ms attack transient
    g.gain.exponentialRampToValueAtTime(0.0001, b.now + dur);

    osc.connect(flt);
    flt.connect(g);
    g.connect(b.out);
    osc.start(b.now);
    osc.stop(b.now + dur + 0.02);
  }

  /** Woodland winter whistle: 2ms transient, sparkling 2.2kHz–3.5kHz pure whistle, peak ~0.36. */
  playCardinalChirp() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(450, 0.55);
    const v = this.vary(0.02);
    const dur = 0.22;
    const osc = b.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2093 * v, b.now);
    osc.frequency.exponentialRampToValueAtTime(2637 * v, b.now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1760 * v, b.now + dur);

    const g = b.ctx.createGain();
    g.gain.setValueAtTime(0.0001, b.now);
    g.gain.linearRampToValueAtTime(0.36, b.now + 0.002); // 2ms attack transient
    g.gain.exponentialRampToValueAtTime(0.0001, b.now + dur);

    osc.connect(g);
    g.connect(b.out);
    osc.start(b.now);
    osc.stop(b.now + dur + 0.01);
  }

  /** Atmospheric corvid caw: 3ms transient, 1.6kHz presence, peak ~0.38. */
  playRavenCaw() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(450, 0.55);
    const v = this.vary(0.04);
    const dur = 0.32;
    const osc = b.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320 * v, b.now);
    osc.frequency.exponentialRampToValueAtTime(210 * v, b.now + dur);

    const flt = b.ctx.createBiquadFilter();
    flt.type = 'bandpass';
    flt.frequency.setValueAtTime(750, b.now);
    flt.Q.setValueAtTime(2.2, b.now);

    const g = b.ctx.createGain();
    g.gain.setValueAtTime(0.0001, b.now);
    g.gain.linearRampToValueAtTime(0.38, b.now + 0.003); // 3ms attack transient
    g.gain.exponentialRampToValueAtTime(0.0001, b.now + dur);

    osc.connect(flt);
    flt.connect(g);
    g.connect(b.out);
    osc.start(b.now);
    osc.stop(b.now + dur + 0.02);
    this.noiseBurst(b, b.now, { dur: 0.25, gain: 0.22, from: 1800 * v, to: 450 * v, pink: true });
  }

  /** Warm hive chord hum: 4ms transient, peak ~0.34. */
  playBeeHum() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(550, 0.55);
    const v = this.vary(0.02);
    const dur = 0.55;
    [196 * v, 293.66 * v].forEach((f) => {
      const osc = b.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, b.now);

      const lfo = b.ctx.createOscillator();
      lfo.frequency.setValueAtTime(6.5, b.now);
      const lfoG = b.ctx.createGain();
      lfoG.gain.setValueAtTime(4.0, b.now);
      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      lfo.start(b.now);
      lfo.stop(b.now + dur);

      const flt = b.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(1200, b.now);

      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, b.now);
      g.gain.linearRampToValueAtTime(0.34, b.now + 0.004); // 4ms attack transient
      g.gain.exponentialRampToValueAtTime(0.0001, b.now + dur);

      osc.connect(flt);
      flt.connect(g);
      g.connect(b.out);
      osc.start(b.now);
      osc.stop(b.now + dur + 0.02);
    });
  }

  // --- MUSICAL & TACTILE PROPS ---

  /** Spanish nylon-string chord strum: 2ms transient per pluck, 1.8kHz presence, peak ~0.38. */
  playGuitarStrum() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(850, 0.50);
    const v = this.vary(0.015);
    const chord = [82.41, 123.47, 174.61, 207.65, 246.94, 329.63];
    chord.forEach((freq, idx) => {
      const at = b.now + idx * 0.035;
      const dur = 0.85 - idx * 0.04;
      const osc = b.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * v, at);
      const flt = b.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(2200, at);
      flt.frequency.exponentialRampToValueAtTime(650, at + dur);
      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(0.38, at + 0.002); // 2ms attack transient
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      osc.connect(flt);
      flt.connect(g);
      g.connect(b.out);
      osc.start(at);
      osc.stop(at + dur + 0.02);
    });
  }

  /** Soft ascending two-tone flute/chime (440Hz -> 659.25Hz) for poet recruitment farewell dissolve */
  playFarewellChime() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(450, 0.65);
    const v = this.vary(0.01);
    const notes = [
      { f: 440.0 * v, time: b.now, dur: 0.22 },
      { f: 659.25 * v, time: b.now + 0.14, dur: 0.35 },
    ];
    notes.forEach((note) => {
      const osc = b.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, note.time);
      const osc2 = b.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(note.f * 2, note.time);
      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, note.time);
      g.gain.linearRampToValueAtTime(0.28, note.time + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, note.time + note.dur);
      osc.connect(g);
      osc2.connect(g);
      g.connect(b.out);
      osc.start(note.time);
      osc2.start(note.time);
      osc.stop(note.time + note.dur + 0.02);
      osc2.stop(note.time + note.dur + 0.02);
    });
  }

  /** Resonant wrought-iron anvil ring: warm metallic overtone without piercing high frequencies */
  playAnvilRing() {
    const b = this.begin();
    if (!b) return;
    this.triggerDucking(650, 0.50);
    const v = this.vary(0.02);
    this.blip(b, b.now, { type: 'triangle', freq: 440 * v, freqTo: 180 * v, dur: 0.04, gain: 0.32 });
    this.noiseBurst(b, b.now, { dur: 0.035, gain: 0.20, from: 1600 * v, to: 700 * v, type: 'lowpass', pink: true });
    [880 * v, 1320 * v].forEach((freq, idx) => {
      const osc = b.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, b.now + 0.002);
      const flt = b.ctx.createBiquadFilter();
      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(1500, b.now);
      flt.Q.setValueAtTime(4.0, b.now);
      const g = b.ctx.createGain();
      g.gain.setValueAtTime(0.0001, b.now + 0.002);
      g.gain.linearRampToValueAtTime(idx === 0 ? 0.32 : 0.22, b.now + 0.006); // 4ms transient
      g.gain.exponentialRampToValueAtTime(0.0001, b.now + 0.55);
      osc.connect(flt);
      flt.connect(g);
      g.connect(b.out);
      osc.start(b.now + 0.002);
      osc.stop(b.now + 0.58);
    });
  }

  playCatPurr() {
    this.playCatMeow();
  }

  playFountainSplash() {
    this.playShoreWaveChime();
  }

  playSfx(name?: string, ...args: unknown[]) {
    this.playCrispClick();
  }
}

/** Shared singleton — import and use anywhere. */
export const gameAudio = new GameAudio();

// ============================================================================
// GENERAL UTILITIES & MATH HELPERS
// ============================================================================

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

export const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const formatTime = (seconds: number): string => {
  const clamped = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(clamped / 60);
  const remaining = clamped % 60;
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
};

export const prepareCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void => {
  const scale = window.devicePixelRatio || 1;
  const displayWidth = Math.floor(width * scale);
  const displayHeight = Math.floor(height * scale);

  if (
    ctx.canvas.width !== displayWidth ||
    ctx.canvas.height !== displayHeight
  ) {
    ctx.canvas.width = displayWidth;
    ctx.canvas.height = displayHeight;
  }

  ctx.setTransform(scale, 0, 0, scale, 0, 0);
};

export const createFixedStepper = (stepMs: number, maxSubSteps = 5) => {
  let lastTime = 0;
  let accumulator = 0;

  return (time: number, onStep: (deltaSeconds: number) => void): void => {
    if (lastTime === 0) {
      lastTime = time;
      return;
    }

    const frameMs = Math.min(time - lastTime, stepMs * maxSubSteps);
    lastTime = time;
    accumulator += frameMs;

    let steps = 0;
    while (accumulator >= stepMs && steps < maxSubSteps) {
      onStep(stepMs / 1000);
      accumulator -= stepMs;
      steps += 1;
    }
  };
};

/**
 * A 2D coordinate representing a position in the game world.
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * An entity within the game.
 */
export interface Entity extends Position {
  id: string;
  type: string;
  width: number;
  height: number;
  vx: number;
  vy: number;
  [key: string]: any; // Allow flexible properties
}

/**
 * The current phase of the game.
 */
export type GamePhase =
  | 'START'
  | 'PLAYING'
  | 'PAUSED'
  | 'GAME_OVER'
  | 'VICTORY'
  | 'LEVEL_COMPLETE';

/**
 * The overall state of the game.
 */
export interface GameState {
  status: GamePhase;
  score: number;
  level: number;
  timer?: number;
  moves?: number;
  lives?: number;
  [key: string]: any; // Allow flexible properties
}

/**
 * The music track to be used in the game.
 */
export interface MusicTrack {
  name: string;
  url: string;
  description: string;
}

declare global {
  interface Window {
    PlaygroundSDK: any;
  }
}

/**
 * Configuration for a sprite sheet.
 */
export interface SpriteConfig {
  url: string;
  frameWidth?: number;
  frameHeight?: number;
  frameCount?: number;
}

/**
 * Preloads all assets defined in the manifest.
 * Returns a dictionary of loaded images (keyed by manifest ID) and a loading state.
 *
 * WARNING: Generated sprites already have transparent backgrounds removed server-side.
 * Do not run client-side `ctx.getImageData()` loops to strip backgrounds. If you ever
 * call `ctx.getImageData()`, wrap it in `try / catch` and fall back to raw `ctx.drawImage()`
 * in case an external asset fell back to `no-cors` loading.
 */
export function useAssets(manifest: Record<string, string>) {
  const [assets, setAssets] = useState<Record<string, HTMLImageElement | null>>(
    {},
  );
  const [isReady, setIsReady] = useState(false);

  // Stringify the manifest to prevent infinite re-renders if an inline object is passed
  const manifestStr = JSON.stringify(manifest);

  useEffect(() => {
    const currentManifest = JSON.parse(manifestStr) as Record<string, string>;
    const urls = Object.entries(currentManifest);
    if (urls.length === 0) {
      setIsReady(true);
      return;
    }

    let loadedCount = 0;
    const loadedAssets: Record<string, HTMLImageElement | null> = {};

    urls.forEach(([id, url]) => {
      const img = new Image();
      let retriedWithoutCors = false;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        loadedAssets[id] = img; // Keyed by manifest ID for easy lookup
        loadedCount++;
        if (loadedCount === urls.length) {
          setAssets(loadedAssets);
          setIsReady(true);
        }
      };
      img.onerror = () => {
        if (!retriedWithoutCors) {
          retriedWithoutCors = true;
          img.removeAttribute('crossorigin');
          img.src = url;
          return;
        }
        console.warn(`[AssetPreloader] Failed to load asset: ${id} at ${url}`);
        loadedAssets[id] = null;
        loadedCount++;
        if (loadedCount === urls.length) {
          setAssets(loadedAssets);
          setIsReady(true);
        }
      };
      img.src = url;
    });
  }, [manifestStr]);

  return {assets, isReady};
}

/**
 * Safely draws an entire image asset on the canvas. If the asset failed to load,
 * falls back to rendering a primitive geometric shape to prevent crashing.
 *
 * Note: Draws from top-left (consistent with standard Canvas drawImage).
 *
 * WARNING: This draws the WHOLE source image (5-arg drawImage) and does not support
 * frame extraction. For animated spritesheets, use the `html-sprite-renderer` skill
 * (`SpriteRenderer` class) instead.
 */
export function drawAsset(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null | undefined,
  x: number,
  y: number,
  w: number,
  h: number,
  fallbackDraw: (ctx: CanvasRenderingContext2D) => void,
) {
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x, y, w, h);
  } else {
    fallbackDraw(ctx);
  }
}

/**
 * Robust background drawing function.
 * If a background image is provided, it draws it covering the full canvas width and height.
 * If camera coordinates are provided, it can optionally do parallax scrolling.
 * If the image fails to load, it falls back to a solid color.
 */
export function drawBackground(
  ctx: CanvasRenderingContext2D,
  bgImg: HTMLImageElement | null | undefined,
  canvasWidth: number,
  canvasHeight: number,
  fallbackColor = '#222222',
  camX = 0,
  camY = 0,
) {
  if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
    // Parallax logic: scroll the background slightly slower than the camera
    const parallaxFactor = 0.5;
    const bgX = (camX * parallaxFactor) % canvasWidth;
    const bgY = (camY * parallaxFactor) % canvasHeight;

    // Draw a 2x2 grid of the background image to ensure the whole screen is covered during scrolling
    ctx.drawImage(bgImg, -bgX, -bgY, canvasWidth, canvasHeight);
    ctx.drawImage(bgImg, -bgX + canvasWidth, -bgY, canvasWidth, canvasHeight);
    ctx.drawImage(bgImg, -bgX, -bgY + canvasHeight, canvasWidth, canvasHeight);
    ctx.drawImage(
      bgImg,
      -bgX + canvasWidth,
      -bgY + canvasHeight,
      canvasWidth,
      canvasHeight,
    );
  } else {
    // Fallback to solid color
    ctx.fillStyle = fallbackColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
}

/**
 * Detect mobile/touch devices.
 * Checks user agent, pointer capability, and viewport width.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    const ua =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    const touch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
    const small = window.innerWidth < 768;
    return ua || touch || small;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          window.matchMedia('(pointer: coarse)').matches ||
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0,
      );
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
