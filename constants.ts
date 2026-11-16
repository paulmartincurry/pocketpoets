import {SpriteConfig} from './utils/helper';

/**
 * Visual Theme definitions for Pocket Poets: Classic Game Boy Color / Handheld Retro Palette
 * Palette:
 * - Electric Gold / Yellow: #FFDE00 (accents: #CCA700 / #FFEB66)
 * - Cobalt / Sapphire Blue: #3B4CCA (accents: #2A3693 / #5A6CE8)
 * - Crimson / Ruby Red: #EE1515 (accents: #B80D0D / #FF4B4B)
 * - Pure White: #FFFFFF
 * - Deep Ink Black: #000000
 */
export const THEME = {
  fontFamily: '"Press Start 2P", "Courier New", Courier, monospace',
  
  // Clean retro foundation & surfaces
  white: '#FFFFFF',
  surfaceLight: '#FFFFFF',
  surfaceCard: '#FFFDE7',
  surfaceMuted: '#F4F5F9',
  
  // Electric Gold / Yellow
  goldLight: '#FFEB66',
  goldPrimary: '#FFDE00',
  goldDark: '#CCA700',
  goldDeep: '#997D00',

  // Cobalt / Sapphire Blue
  cobaltLight: '#5A6CE8',
  cobaltPrimary: '#3B4CCA',
  cobaltDark: '#2A3693',
  cobaltDeep: '#1B2368',

  // Crimson / Ruby Red
  crimsonLight: '#FF4B4B',
  crimsonPrimary: '#EE1515',
  crimsonDark: '#B80D0D',
  crimsonDeep: '#7A0909',

  // Deep Ink Black & High-Contrast Outlines
  inkBlack: '#000000',
  borderBlack: '#000000',
  textDark: '#000000',
  textSecondary: '#242424',
  textMuted: '#4B5563',
  
  // Retro GBC Battle Bars
  gbcHpGreen: '#10B981',
  gbcHpYellow: '#FFDE00',
  gbcHpRed: '#EE1515',
  gbcInspBlue: '#3B4CCA',
};

/**
 * Configuration for the game.
 */
export const CONFIG = {
  // GAME - Base battle stage resolution (640x360 widescreen 16:9 retro proportion)
  title: {
    value: 'Pocket Poets',
    type: 'string',
    label: 'Game Title',
    group: 'GAME',
  },
  baseCanvasWidth: {
    value: 640,
    type: 'number',
    label: 'Base Canvas Width',
    group: 'GAME',
  },
  baseCanvasHeight: {
    value: 360,
    type: 'number',
    label: 'Base Canvas Height',
    group: 'GAME',
  },

  // SYSTEM
  targetFPS: {
    value: 60,
    type: 'number',
    label: 'Target FPS',
    group: 'SYSTEM',
  },
  stepMs: {
    value: 1000 / 60,
    type: 'number',
    label: 'Step MS',
    group: 'SYSTEM',
  },
  maxSubSteps: {
    value: 5,
    type: 'number',
    label: 'Max Sub Steps',
    group: 'SYSTEM',
  },

  // THEME
  backgroundColor: {
    value: '#FFFFFF',
    type: 'color',
    label: 'Background Color',
    group: 'THEME',
  },
  primaryColor: {
    value: '#FFDE00',
    type: 'color',
    label: 'Primary Color',
    group: 'THEME',
  },
  fontFamily: {
    value: 'monospace',
    type: 'string',
    label: 'Font Family',
    group: 'THEME',
  },

  // AUDIO
  defaultMusicVolume: {
    value: 0.5,
    type: 'number',
    label: 'Default Music Volume',
    group: 'AUDIO',
  },
  defaultSfxVolume: {
    value: 0.7,
    type: 'number',
    label: 'Default SFX Volume',
    group: 'AUDIO',
  },

  // RULES & BATTLE TUNING
  playerMaxHp: {
    value: 100,
    type: 'number',
    label: 'Base Player Max HP',
    group: 'Rules',
  },
  enemyMaxHp: {
    value: 100,
    type: 'number',
    label: 'Base Opponent Max HP',
    group: 'Rules',
  },
  basePoetLevel: {
    value: 50,
    type: 'number',
    label: 'Battle Poet Level',
    group: 'Rules',
  },
  inspBasicGain: {
    value: 10,
    type: 'number',
    label: 'Basic Move INSP Generation',
    group: 'Rules',
  },

  // ASSETS - Aspect ratios and dimensions derived from read_assets_metadata
  assetEmilyDickinsonAspectRatio: {
    value: 0.705, // 588 / 834
    type: 'number',
    label: 'Emily Dickinson Aspect Ratio',
    group: 'ASSETS',
  },
  assetEdgarAllanPoeAspectRatio: {
    value: 0.834, // 680 / 815
    type: 'number',
    label: 'Edgar Allan Poe Aspect Ratio',
    group: 'ASSETS',
  },
  assetWaltWhitmanAspectRatio: {
    value: 0.809, // 649 / 802
    type: 'number',
    label: 'Walt Whitman Aspect Ratio',
    group: 'ASSETS',
  },
  assetWilliamBlakeAspectRatio: {
    value: 0.919, // 813 / 885
    type: 'number',
    label: 'William Blake Aspect Ratio',
    group: 'ASSETS',
  },
  assetSapphoAspectRatio: {
    value: 0.783, // 557 / 711
    type: 'number',
    label: 'Sappho Aspect Ratio',
    group: 'ASSETS',
  },
  assetWilliamShakespeareAspectRatio: {
    value: 0.904, // 659 / 729
    type: 'number',
    label: 'William Shakespeare Aspect Ratio',
    group: 'ASSETS',
  },
  assetDanteAlighieriAspectRatio: {
    value: 0.856, // 617 / 721
    type: 'number',
    label: 'Dante Alighieri Aspect Ratio',
    group: 'ASSETS',
  },
  assetRobertFrostAspectRatio: {
    value: 0.896, // 782 / 873
    type: 'number',
    label: 'Robert Frost Aspect Ratio',
    group: 'ASSETS',
  },
  assetLangstonHughesAspectRatio: {
    value: 0.774, // 638 / 824
    type: 'number',
    label: 'Langston Hughes Aspect Ratio',
    group: 'ASSETS',
  },
  assetSylviaPlathAspectRatio: {
    value: 0.802, // 659 / 822
    type: 'number',
    label: 'Sylvia Plath Aspect Ratio',
    group: 'ASSETS',
  },
  assetRumiAspectRatio: {
    value: 0.785, // 557 / 710
    type: 'number',
    label: 'Rumi Aspect Ratio',
    group: 'ASSETS',
  },
  assetMatsuoBashoAspectRatio: {
    value: 0.940, // 648 / 689
    type: 'number',
    label: 'Matsuo Basho Aspect Ratio',
    group: 'ASSETS',
  },
  assetMayaAngelouAspectRatio: {
    value: 0.888, // 658 / 741
    type: 'number',
    label: 'Maya Angelou Aspect Ratio',
    group: 'ASSETS',
  },
  assetPabloNerudaAspectRatio: {
    value: 1.021, // 790 / 774
    type: 'number',
    label: 'Pablo Neruda Aspect Ratio',
    group: 'ASSETS',
  },
  assetLiBaiAspectRatio: {
    value: 1.041, // 763 / 733
    type: 'number',
    label: 'Li Bai Aspect Ratio',
    group: 'ASSETS',
  },
  assetSorJuanaAspectRatio: {
    value: 0.941, // 638 / 678
    type: 'number',
    label: 'Sor Juana Aspect Ratio',
    group: 'ASSETS',
  },
  assetRabindranathTagoreAspectRatio: {
    value: 0.994, // 803 / 808
    type: 'number',
    label: 'Rabindranath Tagore Aspect Ratio',
    group: 'ASSETS',
  },
  assetMahmoudDarwishAspectRatio: {
    value: 1.0, // 800 / 800
    type: 'number',
    label: 'Mahmoud Darwish Aspect Ratio',
    group: 'ASSETS',
  },
  assetAnnaAkhmatovaAspectRatio: {
    value: 0.787, // 647 / 822
    type: 'number',
    label: 'Anna Akhmatova Aspect Ratio',
    group: 'ASSETS',
  },
  assetCharlesBaudelaireAspectRatio: {
    value: 0.854, // 689 / 807
    type: 'number',
    label: 'Charles Baudelaire Aspect Ratio',
    group: 'ASSETS',
  },
  assetMaryOliverAspectRatio: {
    value: 0.85,
    type: 'number',
    label: 'Mary Oliver Aspect Ratio',
    group: 'ASSETS',
  },
  assetCharlesBukowskiAspectRatio: {
    value: 0.85,
    type: 'number',
    label: 'Charles Bukowski Aspect Ratio',
    group: 'ASSETS',
  },
  assetFedericoGarciaLorcaAspectRatio: {
    value: 0.85,
    type: 'number',
    label: 'Federico Garcia Lorca Aspect Ratio',
    group: 'ASSETS',
  },
  assetJohnKeatsAspectRatio: {
    value: 0.85,
    type: 'number',
    label: 'John Keats Aspect Ratio',
    group: 'ASSETS',
  },
  assetBgArenaAspectRatio: {
    value: 1.792, // 1376 / 768
    type: 'number',
    label: 'Arena Background Aspect Ratio',
    group: 'ASSETS',
  },
  assetCaptureBookAspectRatio: {
    value: 1.074, // 896 / 834
    type: 'number',
    label: 'Capture Book Aspect Ratio',
    group: 'ASSETS',
  },
  assetMuseCalliopeAspectRatio: {
    value: 0.614, // 556 / 906
    type: 'number',
    label: 'Muse Calliope Aspect Ratio',
    group: 'ASSETS',
  },
  assetQuillAspectRatio: {
    value: 0.956, // 700 / 732
    type: 'number',
    label: 'Quill Icon Aspect Ratio',
    group: 'ASSETS',
  },

  // Template compatibility placeholder
  playerSprite: {
    value: undefined as SpriteConfig | undefined,
    type: 'sprite',
    label: 'Player Sprite',
    group: 'Visuals',
  },
};

/**
 * Central Battle Configuration Object (Point 7)
 */
export const BATTLE_CONFIG = {
  // Fixed max health by region / home
  healthByRegion: {
    SPRING: 100,
    SUMMER: 120,
    AUTUMN: 140,
    WINTER: 160,
    SUMMIT: 200,
  } as const,

  // Season multipliers:
  // Spring beats Summer (1.5x) | weak to Winter (0.75x)
  // Summer beats Autumn (1.5x) | weak to Spring (0.75x)
  // Autumn beats Winter (1.5x) | weak to Summer (0.75x)
  // Winter beats Spring (1.5x) | weak to Autumn (0.75x)
  // Polar opposites (Spring <-> Autumn, Summer <-> Winter) & Same-Season: Neutral (1.0x)
  seasonAdvantageMultiplier: 1.5,
  seasonDisadvantageMultiplier: 0.75,
  seasonNeutralMultiplier: 1.0,

  // Rebalanced Move Archetype Values
  heavyDamage: 32,
  heavyReadings: 3,

  lightDamage: 18,
  lightReadings: 6,

  healPercent: 0.30, // 30% of user's Max HP
  healAmount: 30, // Legacy fallback
  healReadings: 2,

  buffMultiplier: 1.35,
  buffDuration: 3,
  buffReadings: 2,

  debuffMultiplier: 0.70,
  debuffDuration: 3,
  debuffReadings: 2,

  statusReadings: 2,

  // Capture Windows
  baseCaptureWindow: 0.25, // <= 25% max health
  statusCaptureWindow: 0.35, // <= 35% max health with "Lost for Words"
};

// Merge customized config values if present (injected by Playground)
const {playgroundConfig} = globalThis as {
  playgroundConfig?: Record<string, unknown>;
};
if (playgroundConfig) {
  for (const [key, value] of Object.entries(playgroundConfig)) {
    if (key in CONFIG) {
      Object.assign(CONFIG[key as keyof typeof CONFIG], {value});
    }
  }
}

/**
 * Type helper for reading values in game code
 */
export type ConfigKey = keyof typeof CONFIG;

/**
 * Gets a configuration value by key.
 * @param key The configuration key.
 * @return The configuration value.
 */
export function getConfig<K extends ConfigKey>(
  key: K,
): (typeof CONFIG)[K]['value'] {
  return CONFIG[key].value;
}

/**
 * Optional presets
 */
export const PRESETS = {};
