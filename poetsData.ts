// POCKET POETS — MASTER ROSTER, SEASONS, MOVES & DIALOGUE SPECIFICATION
// Types: Exactly 4 Seasons (SPRING, SUMMER, AUTUMN, WINTER)
// Cycle: Spring beats Winter. Winter beats Autumn. Autumn beats Summer. Summer beats Spring.

import { BATTLE_CONFIG } from './constants';
export { BATTLE_CONFIG };

export type SeasonType = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';
export type LiteraryAffinity = SeasonType; // Backward-compatibility alias

export type StatusEffectType =
  | 'NONE'
  | 'LOST_FOR_WORDS'
  | 'SLEEP'
  | 'BURN'
  | 'FREEZE'
  | 'CONFUSE'
  | 'FLINCH'
  | 'PARALYZE'
  | 'INSPIRED'
  | 'TRANQUILITY';

export type MoveEffectType =
  | 'HEAVY'
  | 'LIGHT'
  | 'HEAL'
  | 'BUFF'
  | 'DEBUFF'
  | 'STATUS';

export interface PoemMove {
  id: string;
  name: string;
  tag: string;
  poemTitle: string;
  effectType: MoveEffectType;
  damage?: number; // 40 for HEAVY, 10 for LIGHT
  healAmount?: number; // 30 for HEAL
  maxReadings: number; // 2 for HEAVY, 6 for LIGHT, 2 for HEAL, 1 for BUFF, 1 for DEBUFF, 2 for STATUS
  powerLabel: string;
  descriptionShort: string;
  stanzas: string[];
  progressiveStanzas?: string[][]; // Progressive sequential stanzas across repeated casts
  category?: 'PHYSICAL' | 'SPECIAL' | 'HEAL' | 'STATUS' | 'MASTERPIECE';
  affinity?: SeasonType;
  power?: number;
  inspCost?: number;
  inspGainOnHit?: number;
  accuracy?: number;
  critRate?: number;
}

export function getMoveCurrentStanza(move: PoemMove, castCount = 1): string[] {
  if (move.progressiveStanzas && move.progressiveStanzas.length > 0) {
    const idx = (Math.max(1, castCount) - 1) % move.progressiveStanzas.length;
    return move.progressiveStanzas[idx];
  }
  return move.stanzas || [];
}

export function getMoveStanzaIndex(move: PoemMove, castCount = 1): number {
  if (move.progressiveStanzas && move.progressiveStanzas.length > 0) {
    return (Math.max(1, castCount) - 1) % move.progressiveStanzas.length;
  }
  return 0;
}

export function getPoetShortName(fullName: string): string {
  if (!fullName) return '';
  const trimmed = fullName.trim();
  if (trimmed.toLowerCase().includes('sor juana')) return 'Sor Juana';
  if (trimmed.toLowerCase().includes('li bai')) return 'Li Bai';
  if (trimmed.toLowerCase().includes('mary oliver')) return 'Oliver';
  const parts = trimmed.split(/\s+/);
  return parts[parts.length - 1] || trimmed;
}

export interface PoetDialogue {
  intro: string;
  preFight: string;
  midFight: string;
  escaped: string;
  captured: string;
  lose: string;
}

export interface PoetData {
  id: string;
  name: string;
  title: string;
  lifespan: string;
  birthplace: string;
  movement: string;
  season: SeasonType;
  affinity: SeasonType; // alias
  tier: 1 | 2 | 3 | 4 | 5;
  chapter: 1 | 2 | 3 | 4 | 5;
  chapterName: string;
  locationDescription: string;
  worldCoords: { x: number; y: number };
  fightingStyle: string;
  tacticalAdvice: string;
  bio: string;
  quote: string;
  dialogue: PoetDialogue;
  preBattleDialogue: string[];
  sourceNote: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  defaultArenaId?: string;
  spriteAssetKey?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  portraitPalette: {
    skin: string;
    skinShadow: string;
    skinHighlight: string;
    hair: string;
    hairHighlight: string;
    hairShadow: string;
    clothing: string;
    clothingHighlight: string;
    clothingShadow: string;
    accent: string;
    hat?: string;
    accessory?: string;
  };
  moves: PoemMove[];
}

// Exactly 4 Seasons Config
export const SEASON_CONFIG: Record<
  SeasonType,
  {
    name: string;
    short: string;
    color: string;
    bg: string;
    badgeBg: string;
    border: string;
    symbol: string;
    beats: SeasonType;
    weakTo: SeasonType;
    paletteHue: string;
  }
> = {
  SPRING: {
    name: 'Spring',
    short: 'SPRING',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.12)',
    badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    border: '#059669',
    symbol: '🌸',
    beats: 'WINTER',
    weakTo: 'SUMMER',
    paletteHue: 'rgba(16, 185, 129, 0.08)',
  },
  SUMMER: {
    name: 'Summer',
    short: 'SUMMER',
    color: '#EAB308',
    bg: 'rgba(234, 179, 8, 0.12)',
    badgeBg: 'bg-amber-50 text-amber-950 border-amber-300',
    border: '#CA8A04',
    symbol: '☀️',
    beats: 'SPRING',
    weakTo: 'AUTUMN',
    paletteHue: 'rgba(234, 179, 8, 0.08)',
  },
  AUTUMN: {
    name: 'Autumn',
    short: 'AUTUMN',
    color: '#D97706',
    bg: 'rgba(217, 119, 6, 0.12)',
    badgeBg: 'bg-orange-50 text-orange-950 border-orange-300',
    border: '#B45309',
    symbol: '🍂',
    beats: 'SUMMER',
    weakTo: 'WINTER',
    paletteHue: 'rgba(217, 119, 6, 0.08)',
  },
  WINTER: {
    name: 'Winter',
    short: 'WINTER',
    color: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.12)',
    badgeBg: 'bg-sky-50 text-sky-950 border-sky-300',
    border: '#0284C7',
    symbol: '❄️',
    beats: 'AUTUMN',
    weakTo: 'SPRING',
    paletteHue: 'rgba(56, 189, 248, 0.08)',
  },
};

export const AFFINITY_CONFIG = SEASON_CONFIG;

// Calculate seasonal type effectiveness:
// Spring beats Winter; Winter beats Autumn; Autumn beats Summer; Summer beats Spring.
export const calculateSeasonMultiplier = (
  attackerSeason: SeasonType,
  defenderSeason: SeasonType,
): number => {
  if (attackerSeason === defenderSeason) return BATTLE_CONFIG.seasonNeutralMultiplier;
  if (SEASON_CONFIG[attackerSeason].beats === defenderSeason) return BATTLE_CONFIG.seasonAdvantageMultiplier;
  if (SEASON_CONFIG[attackerSeason].weakTo === defenderSeason) return BATTLE_CONFIG.seasonDisadvantageMultiplier;
  return BATTLE_CONFIG.seasonNeutralMultiplier;
};

export const calculateAffinityMultiplier = calculateSeasonMultiplier;

export interface ChapterGateSpec {
  chapter: 1 | 2 | 3 | 4 | 5;
  season: SeasonType;
  name: string;
  subtitle: string;
  badge: string;
  paletteColor: string;
  poetIds: string[];
  unlockRequirement: string;
  description: string;
}

export const CHAPTER_GATES: ChapterGateSpec[] = [
  {
    chapter: 1,
    season: 'SPRING',
    name: 'Chapter I: Spring',
    subtitle: 'Green Realm (4 Poets: Oliver, Hughes, Whitman, Rumi)',
    badge: 'SPRING',
    paletteColor: '#10B981',
    poetIds: ['MARY_OLIVER', 'HUGHES', 'WHITMAN', 'RUMI'],
    unlockRequirement: 'Unlocked from Start',
    description: 'Encounter Mary Oliver, Langston Hughes, Walt Whitman, and Rumi across the verdant spring commons.',
  },
  {
    chapter: 2,
    season: 'SUMMER',
    name: 'Chapter II: Summer',
    subtitle: 'Gold Realm (4 Poets: Neruda, Lorca, Angelou, Blake)',
    badge: 'SUMMER',
    paletteColor: '#EAB308',
    poetIds: ['NERUDA', 'LORCA', 'ANGELOU', 'BLAKE'],
    unlockRequirement: 'Requires defeating all 4 Chapter I poets',
    description: 'Duel Pablo Neruda, Federico García Lorca, Maya Angelou, and William Blake under golden sunlight.',
  },
  {
    chapter: 3,
    season: 'AUTUMN',
    name: 'Chapter III: Autumn',
    subtitle: 'Rust Realm (4 Poets: Basho, Li Bai, Sor Juana, Bukowski)',
    badge: 'AUTUMN',
    paletteColor: '#D97706',
    poetIds: ['BASHO', 'LI_BAI', 'SOR_JUANA', 'BUKOWSKI'],
    unlockRequirement: 'Requires defeating all 4 Chapter II poets',
    description: 'Traverse amber foliage with Matsuo Bashō, Li Bai, Sor Juana Inés de la Cruz, and Charles Bukowski.',
  },
  {
    chapter: 4,
    season: 'WINTER',
    name: 'Chapter IV: Winter',
    subtitle: 'White-Blue Realm (4 Poets: Frost, Dickinson, Poe, Plath)',
    badge: 'WINTER',
    paletteColor: '#38BDF8',
    poetIds: ['FROST', 'DICKINSON', 'POE', 'PLATH'],
    unlockRequirement: 'Requires defeating all 4 Chapter III poets',
    description: 'Venture through winter frosts with Robert Frost, Emily Dickinson, Edgar Allan Poe, and Sylvia Plath.',
  },
  {
    chapter: 5,
    season: 'SPRING', // Apex mixed seasons
    name: 'Chapter V: The Gauntlet',
    subtitle: 'Parnassus Citadel & Summit (Sappho -> Shakespeare -> Keats -> Dante)',
    badge: 'THE GAUNTLET',
    paletteColor: '#A855F7',
    poetIds: ['SAPPHO', 'SHAKESPEARE', 'KEATS', 'DANTE'],
    unlockRequirement: 'Requires all 16 prior poets (Chapters I–IV)',
    description: 'The supreme gauntlet in exact order: Sappho (Spring), Shakespeare (Summer), Keats (Autumn in his rented room), and Dante (Winter at the Summit).',
  },
];

export interface PoetArenaStage {
  id: string;
  name: string;
  poetId: string;
  poetName: string;
  subtitle: string;
  bgAssetKey: string;
  themeColor: string;
  accentColor: string;
  description: string;
  stageTrait: string;
  quoteSnippet: string;
  particleType: string;
}

export const POET_ARENAS: PoetArenaStage[] = [
  {
    id: 'GOTHIC_RAVEN_STUDY',
    name: 'The Gothic Raven Study',
    poetId: 'POE',
    poetName: 'Edgar Allan Poe',
    subtitle: 'Chamber of Midnight Dreary',
    bgAssetKey: 'bg_poe_study',
    themeColor: '#701a75',
    accentColor: '#e11d48',
    description: 'A shadowy Victorian study illuminated by candlelight and the ominous gaze of the Raven.',
    stageTrait: 'Winter Chill: Winter season moves deal +15% resonance.',
    quoteSnippet: '“Once upon a midnight dreary, while I pondered, weak and weary...”',
    particleType: 'gothic_embers',
  },
  {
    id: 'MISTY_BAMBOO_GROVE',
    name: 'The Misty Bamboo Grove',
    poetId: 'BASHO',
    poetName: 'Matsuo Bashō',
    subtitle: 'Quiet Way of Narrow Roads',
    bgAssetKey: 'bg_basho_grove',
    themeColor: '#0d9488',
    accentColor: '#10b981',
    description: 'A serene bamboo sanctuary with ancient stone lanterns and the still ripples of the historic pond.',
    stageTrait: 'Autumn Stillness: Recover +5 extra Inspiration on hit.',
    quoteSnippet: '“The old pond — / A frog leaps in, / The sound of water.”',
    particleType: 'bamboo_leaves',
  },
  {
    id: 'GLOBE_THEATRE_STAGE',
    name: 'The Globe Theatre Stage',
    poetId: 'SHAKESPEARE',
    poetName: 'William Shakespeare',
    subtitle: 'The Wooden O of London',
    bgAssetKey: 'bg_shakespeare_globe',
    themeColor: '#ca8a04',
    accentColor: '#f59e0b',
    description: 'The legendary Elizabethan thrust stage under torchlight with soaring dramatic acoustics.',
    stageTrait: 'Summer Soliloquy: Summer season moves deal +10 bonus impact.',
    quoteSnippet: '“All the world’s a stage, and all the men and women merely players.”',
    particleType: 'theatre_sparkles',
  },
  {
    id: 'AMHERST_SUNLIT_SOLARIUM',
    name: 'The Amherst Sunlit Solarium',
    poetId: 'DICKINSON',
    poetName: 'Emily Dickinson',
    subtitle: 'The White Parlor of Slant Light',
    bgAssetKey: 'bg_dickinson_solarium',
    themeColor: '#0284c7',
    accentColor: '#fbbf24',
    description: 'A quiet 19th-century parlor bathed in slant winter afternoon illumination.',
    stageTrait: 'Slant Light: Healing stanzas recover +5 additional vitality.',
    quoteSnippet: '“There’s a certain Slant of light, / Winter Afternoons...”',
    particleType: 'sunlight_petals',
  },
  {
    id: 'SNOWY_WOODS_AT_DUSK',
    name: 'The Snowy Woods at Dusk',
    poetId: 'FROST',
    poetName: 'Robert Frost',
    subtitle: 'Promises to Keep in Twilight',
    bgAssetKey: 'bg_frost_woods',
    themeColor: '#1e3a5f',
    accentColor: '#60a5fa',
    description: 'A quiet New England pine forest shrouded in gentle dusk snowfall.',
    stageTrait: 'Winter Solitude: Defensive moves boost DEF stage by +1.',
    quoteSnippet: '“The woods are lovely, dark and deep, / But I have promises to keep...”',
    particleType: 'alpine_snow',
  },
  {
    id: 'PERSIAN_MOSAIC_COURTYARD',
    name: 'The Persian Mosaic Courtyard',
    poetId: 'RUMI',
    poetName: 'Rumi',
    subtitle: 'Sanctuary of the Mystic Rose',
    bgAssetKey: 'bg_rumi_courtyard',
    themeColor: '#d97706',
    accentColor: '#10b981',
    description: 'An exquisite turquoise tiled courtyard surrounded by cypress trees and fountain starlight.',
    stageTrait: 'Spring Renewal: Inspiration generation increased by +10.',
    quoteSnippet: '“Out beyond ideas of wrongdoing and rightdoing there is a field. I’ll meet you there.”',
    particleType: 'mosaic_stars',
  },
  {
    id: 'MID_CENTURY_RAIN_STUDY',
    name: 'The Mid-Century Rain-Slicked Study',
    poetId: 'PLATH',
    poetName: 'Sylvia Plath',
    subtitle: 'Glass & Electric Solitude',
    bgAssetKey: 'bg_plath_study',
    themeColor: '#dc2626',
    accentColor: '#f43f5e',
    description: 'A moody modernist study with cold rain cascading down tall glass panes.',
    stageTrait: 'Fierce Cadence: Strike verses ignore 25% of opponent DEF.',
    quoteSnippet: '“Out of the ash / I rise with my red hair / And I eat men like air.”',
    particleType: 'rain_droplets',
  },
  {
    id: 'GOLDEN_RISING_SUN_SANCTUARY',
    name: 'The Golden Rising Sun Sanctuary',
    poetId: 'ANGELOU',
    poetName: 'Maya Angelou',
    subtitle: 'Dawn Terrace of Unbroken Resilience',
    bgAssetKey: 'bg_angelou_sanctuary',
    themeColor: '#b45309',
    accentColor: '#fbbf24',
    description: 'A radiant open-air terrace overlooking a golden sunrise and flying bird silhouette.',
    stageTrait: 'Unbroken Spirit: Surviving a major hit grants +15 Inspiration.',
    quoteSnippet: '“You may trod me in the very dirt / But still, like dust, I’ll rise.”',
    particleType: 'golden_feathers',
  },
];

export const getArenaById = (id: string): PoetArenaStage => {
  return POET_ARENAS.find((a) => a.id === id) || POET_ARENAS[0];
};

export const getArenaForPoet = (poetId: string): PoetArenaStage => {
  const matching = POET_ARENAS.find((a) => a.poetId === poetId);
  if (matching) return matching;
  if (['DICKINSON', 'WHITMAN'].includes(poetId)) return getArenaById('AMHERST_SUNLIT_SOLARIUM');
  if (['POE'].includes(poetId)) return getArenaById('GOTHIC_RAVEN_STUDY');
  if (['BASHO', 'LI_BAI', 'MARY_OLIVER'].includes(poetId)) return getArenaById('MISTY_BAMBOO_GROVE');
  if (['SHAKESPEARE', 'DANTE'].includes(poetId)) return getArenaById('GLOBE_THEATRE_STAGE');
  if (['FROST', 'KEATS'].includes(poetId)) return getArenaById('SNOWY_WOODS_AT_DUSK');
  if (['PLATH', 'BUKOWSKI', 'BAUDELAIRE', 'baudelaire'].includes(poetId)) return getArenaById('MID_CENTURY_RAIN_STUDY');
  if (['ANGELOU', 'HUGHES', 'SOR_JUANA'].includes(poetId)) return getArenaById('GOLDEN_RISING_SUN_SANCTUARY');
  return getArenaById('PERSIAN_MOSAIC_COURTYARD');
};

// ============================================================================
// THE 20 AUTHORITATIVE POETS (STANDARDIZED TEMPLATE)
// Fixed Max HP:
// Spring (100): Oliver, Hughes, Whitman, Rumi
// Summer (120): Neruda, Lorca, Angelou, Blake
// Autumn (140): Basho, Li Bai, Sor Juana, Bukowski
// Winter (160): Frost, Dickinson, Poe, Plath
// Summit (200): Sappho, Shakespeare, Keats, Dante
// ============================================================================

export const ALL_POETS: PoetData[] = [
  // ==========================================================================
  // CHAPTER I: SPRING (100 HP)
  // 1. Mary Oliver, 2. Langston Hughes, 3. Walt Whitman, 4. Rumi
  // ==========================================================================

  // 1. Mary Oliver (Spring) - 100 HP
  {
    id: 'MARY_OLIVER',
    name: 'Mary Oliver',
    title: 'The Poet of Wild Geese',
    lifespan: '1935–2019',
    birthplace: 'Maple Heights, Ohio',
    movement: 'Nature Devotion',
    season: 'SPRING',
    affinity: 'SPRING',
    tier: 1,
    chapter: 1,
    chapterName: 'Chapter I: Spring',
    locationDescription: 'Oliver’s Island in River X:53, Y:19 (with wild geese and dog)',
    worldCoords: { x: 53, y: 19 },
    fightingStyle: 'Gentle Reverence & Wild Geese Awakening',
    tacticalAdvice: 'Sustains HP with Soft Animal and strikes with Wild Geese.',
    defaultArenaId: 'SNOWY_WOODS_AT_DUSK',
    bio: 'Pulitzer Prize winner who walked the ponds and dunes of Provincetown, celebrating flora, fauna, and the gift of living with attentive awe.',
    quote: '“Tell me, what is it you plan to do with your one wild and precious life?”',
    dialogue: {
      intro: "Morning. Mary Oliver. You caught me out in the woods, though I'm always out in the woods. Or writing.",
      preFight: 'Tell me, what is it you plan to do with your one wild and precious life?',
      midFight: 'The wild geese are calling across the high air—keep your footing!',
      escaped: 'The world offers itself to your imagination; go softly into the trees.',
      captured: "You paid attention. You were astonished. Come on, then—let's tell about it.",
      lose: "You paid attention. You were astonished. Come on, then—let's tell about it.",
    },
    preBattleDialogue: [
      '“Tell me, what is it you plan to do with your one wild and precious life?”',
      '“Meanwhile the wild geese, high in the clean blue air, are heading home again.”',
    ],
    sourceNote: 'Alludes to “Wild Geese” and “The Summer Day”.',
    hp: BATTLE_CONFIG.healthByRegion.SPRING,
    atk: 48,
    def: 54,
    spd: 52,
    spriteAssetKey: 'poet_mary_oliver',
    primaryColor: '#059669',
    secondaryColor: '#34d399',
    accentColor: '#fbbf24',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#b45309',
      skinHighlight: '#ffedd5',
      hair: '#94a3b8',
      hairHighlight: '#cbd5e1',
      hairShadow: '#64748b',
      clothing: '#065f46',
      clothingHighlight: '#047857',
      clothingShadow: '#022c22',
      accent: '#34d399',
    },
    moves: [
      {
        id: 'WILD_GEESE',
        name: 'Wild Geese',
        tag: 'HEAVY',
        poemTitle: 'Wild Geese',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Meanwhile the world goes on.',
          'Meanwhile the sun and the clear pebbles of the rain',
          'are moving across the landscapes.',
        ],
        progressiveStanzas: [
          ['You do not have to be good.', 'You only have to let the soft animal of your body love what it loves.'],
          ['Tell me about despair, yours, and I will tell you mine.', 'Meanwhile the world goes on.'],
          ['Meanwhile the wild geese, high in the clean blue air,', 'are heading home again.'],
          ['Whoever you are, no matter how lonely,', 'the world offers itself to your imagination.'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'THE_SUMMER_DAY',
        name: 'The Summer Day',
        tag: 'LIGHT',
        poemTitle: 'The Summer Day',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'Who made the world?',
          'Who made the swan, and the black bear?',
          'Who made the grasshopper?',
        ],
        progressiveStanzas: [
          ['Who made the world? Who made the swan, and the black bear?', 'Who made the grasshopper?'],
          ['This grasshopper, I mean—the one who has flung herself out of the grass,', 'the one who is eating sugar out of my hand.'],
          ['I do know how to pay attention, how to fall down into the grass,', 'how to kneel down in the grass, how to be idle and blessed.'],
          ['Tell me, what else should I have done? Doesn’t everything die at last, and too soon?', 'Tell me, what is it you plan to do with your one wild and precious life?'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'SOFT_ANIMAL',
        name: 'Soft Animal',
        tag: 'HEAL',
        poemTitle: 'Wild Geese',
        effectType: 'HEAL',
        healAmount: BATTLE_CONFIG.healAmount,
        maxReadings: BATTLE_CONFIG.healReadings,
        powerLabel: '+30% HP',
        descriptionShort: 'HEAL: Restores 30% Max HP (2 readings).',
        stanzas: [
          'You only have to let the soft animal of your body',
          'love what it loves.',
        ],
        progressiveStanzas: [
          ['You do not have to walk on your knees', 'for a hundred miles through the desert repenting.'],
          ['You only have to let the soft animal of your body', 'love what it loves.'],
          ['Meanwhile the sun and the clear pebbles of the rain', 'are moving across the landscapes.'],
          ['Calls to you like the wild geese, harsh and exciting—', 'announcing your place in the family of things.'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'WHITE_PINE',
        name: 'White Pine',
        tag: 'STATUS',
        poemTitle: 'White Pine',
        effectType: 'STATUS',
        maxReadings: BATTLE_CONFIG.statusReadings,
        powerLabel: 'STATUS',
        descriptionShort: 'STATUS: Lost for words — target skips turn (2 readings).',
        stanzas: [
          'The pine trees say: you have lingered long enough.',
          'The needles absorb the quiet wind.',
        ],
        progressiveStanzas: [
          ['The pine trees say: you have lingered long enough.', 'The needles absorb the quiet wind.'],
          ['The sun pours down into the green crowns,', 'a golden wash across the bark.'],
          ['Step into the quiet shade of the hemlocks and pines,', 'where the needle-strewn floor forgets all haste.'],
          ['Listen: you are not separate from this peace.', 'Here in the woods, your heart finds its home.'],
        ],
        affinity: 'SPRING',
      },
    ],
  },

  // Mahmoud Darwish (Spring) - 100 HP (The Harbor Reading Alcove Duelist)
  {
    id: 'DARWISH',
    name: 'Mahmoud Darwish',
    title: 'Poet of Olive and Exile',
    lifespan: '1941–2008',
    birthplace: 'al-Birwa, Palestine',
    movement: 'Lyric Resistance / Exile',
    season: 'SPRING',
    affinity: 'SPRING',
    tier: 1,
    chapter: 1,
    chapterName: 'Chapter I: Spring',
    locationDescription: 'Canto I: Shaded Reading Alcove in Eastern Meadow (X:21, Y:13)',
    worldCoords: { x: 21, y: 13 },
    fightingStyle: 'Lyric Longing & Unconquered Memory',
    tacticalAdvice: 'A gentle master of Spring affinity. Strikes with On This Earth and sustains with Think of Others.',
    defaultArenaId: 'PERSIAN_MOSAIC_COURTYARD',
    bio: 'National poet of Palestine whose lyrical verses intertwined love, exile, memory, and the enduring fragrance of home and olive groves.',
    quote: '“We have on this earth what makes life worth living.”',
    dialogue: {
      intro: 'Salaam, traveler. Mahmoud Darwish. You find me in this quiet reading alcove beneath the coastal olives.',
      preFight: '“We have on this earth what makes life worth living.” Let us test our stanzas under the olive branches!',
      midFight: '“Where should the birds fly after the last sky?” Stand firm beneath the olives!',
      escaped: 'Every exile carries a country in their pocket. Go in peace.',
      captured: 'Your stanzas carry the soil of belonging. I shall walk with you toward Parnassus.',
      lose: 'Your stanzas carry the soil of belonging. I shall walk with you toward Parnassus.',
    },
    preBattleDialogue: [
      '“We have on this earth what makes life worth living.”',
      '“Where should the birds fly after the last sky?”',
    ],
    sourceNote: 'Alludes to “On This Earth”, “Identity Card”, and “Think of Others”.',
    hp: BATTLE_CONFIG.healthByRegion.SPRING,
    atk: 52,
    def: 50,
    spd: 52,
    spriteAssetKey: 'poet_mahmoud_darwish',
    primaryColor: '#059669',
    secondaryColor: '#34d399',
    accentColor: '#ca8a04',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#c2410c',
      skinHighlight: '#ffedd5',
      hair: '#0f172a',
      hairHighlight: '#1e293b',
      hairShadow: '#020617',
      clothing: '#1e293b',
      clothingHighlight: '#334155',
      clothingShadow: '#0f172a',
      accent: '#991b1b',
    },
    moves: [
      {
        id: 'ON_THIS_EARTH',
        name: 'On This Earth',
        tag: 'HEAVY',
        poemTitle: 'On This Earth',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'We have on this earth what makes life worth living:',
          'the scent of bread at dawn, a woman’s thoughts on men,',
          'the works of Aeschylus, the beginning of love.',
        ],
        progressiveStanzas: [
          ['We have on this earth what makes life worth living:', 'the scent of bread at dawn, a woman’s thoughts on men.'],
          ['The works of Aeschylus, the beginning of love,', 'grass on a stone, mothers who live on a flute’s sigh.'],
          ['And the invaders’ fear of memories.', 'We have on this earth the hour of twilight.'],
          ['We have on this earth what makes life worth living:', 'the lady of the earth, the mother of beginnings and endings.'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'THINK_OF_OTHERS',
        name: 'Think of Others',
        tag: 'HEAL',
        poemTitle: 'Think of Others',
        effectType: 'HEAL',
        healAmount: BATTLE_CONFIG.healAmount,
        maxReadings: BATTLE_CONFIG.healReadings,
        powerLabel: '+30% HP',
        descriptionShort: 'HEAL: Restores 30% Max HP (2 readings).',
        stanzas: [
          'As you prepare your breakfast, think of others',
          '(do not forget the pigeon’s food).',
          'As you conduct your wars, think of others.',
        ],
        progressiveStanzas: [
          ['As you prepare your breakfast, think of others', '(do not forget the pigeon’s food).'],
          ['As you return home, to the warmth of your house,', 'think of others (do not forget the tent people).'],
          ['As you sleep and count the stars, think of others', '(those who have nowhere to sleep).'],
          ['As you think of others distant,', 'think of yourself (say: “If only I were a candle in the dark”).'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'IDENTITY_CARD',
        name: 'Identity Card',
        tag: 'BUFF',
        poemTitle: 'Identity Card',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'Write down:',
          'I am an Arab,',
          'and my identity card number is fifty thousand.',
        ],
        progressiveStanzas: [
          ['Write down:', 'I am an Arab, and my identity card number is fifty thousand.'],
          ['I have eight children', 'and the ninth will arrive after summer. Will you be angry?'],
          ['My roots were entrenched before the birth of time,', 'before the opening of the eras, before the cypress and the olive.'],
          ['Write down at the top of the first page:', 'I do not hate people, nor do I encroach on what is theirs.'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'RITA_AND_RIFLE',
        name: 'Rita and the Rifle',
        tag: 'LIGHT',
        poemTitle: 'Rita and the Rifle',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'Between Rita and my eyes',
          'there is a rifle.',
          'And whoever knows Rita kneels and prays.',
        ],
        progressiveStanzas: [
          ['Between Rita and my eyes', 'there is a rifle.'],
          ['And whoever knows Rita kneels and prays', 'to the divinity in those honey-colored eyes.'],
          ['I remember Rita the way a sparrow remembers its stream,', 'ah, Rita, between us a million sparrows and a customs barrier.'],
          ['Her name was a feast in my mouth,', 'Rita’s body was a wedding in my blood.'],
        ],
        affinity: 'SPRING',
      },
    ],
  },

  // 2. Langston Hughes (Spring) - 100 HP
  {
    id: 'HUGHES',
    name: 'Langston Hughes',
    title: 'Poet Laureate of Harlem',
    lifespan: '1901–1967',
    birthplace: 'Joplin, Missouri',
    movement: 'Harlem Renaissance',
    season: 'SPRING',
    affinity: 'SPRING',
    tier: 1,
    chapter: 1,
    chapterName: 'Chapter I: Spring',
    locationDescription: 'Northeast Corner of Town Square X:36, Y:19',
    worldCoords: { x: 36, y: 19 },
    fightingStyle: 'Blues Syncopation & Dynamic Resilience',
    tacticalAdvice: 'Strengthens with Deep Rivers and strikes with Dream Deferred.',
    defaultArenaId: 'GOLDEN_RISING_SUN_SANCTUARY',
    bio: 'Leader of the Harlem Renaissance who gave voice to Black American life with syncopated blues and jazz cadences.',
    quote: '“Hold fast to dreams / For if dreams die / Life is a broken-winged bird / That cannot fly.”',
    dialogue: {
      intro: "Hey now. Langston Hughes. I'm on in a minute, stick around.",
      preFight: 'What happens to a dream deferred?',
      midFight: "The rhythm's shifting into a midnight tempo now—stay on the beat!",
      escaped: 'Hold fast to dreams.',
      captured: "You held fast to the dream. Put my notebook in your satchel, friend.",
      lose: "You held fast to the dream. Put my notebook in your satchel, friend.",
    },
    preBattleDialogue: [
      '“My soul has grown deep like the rivers.”',
      '“What happens to a dream deferred? Does it explode?”',
    ],
    sourceNote: 'Alludes to “The Negro Speaks of Rivers” and “Harlem”.',
    hp: BATTLE_CONFIG.healthByRegion.SPRING,
    atk: 54,
    def: 48,
    spd: 56,
    spriteAssetKey: 'poet_langston_hughes',
    primaryColor: '#ea580c',
    secondaryColor: '#fb923c',
    accentColor: '#facc15',
    portraitPalette: {
      skin: '#92400e',
      skinShadow: '#451a03',
      skinHighlight: '#b45309',
      hair: '#171717',
      hairHighlight: '#262626',
      hairShadow: '#0a0a0a',
      clothing: '#7c2d12',
      clothingHighlight: '#9a3412',
      clothingShadow: '#431407',
      accent: '#fb923c',
      hat: '#451a03',
    },
    moves: [
      {
        id: 'DREAM_DEFERRED',
        name: 'Dream Deferred',
        tag: 'HEAVY',
        poemTitle: 'Harlem',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'What happens to a dream deferred?',
          'Does it dry up like a raisin in the sun?',
          'Or does it explode?',
        ],
        progressiveStanzas: [
          ['What happens to a dream deferred?', 'Does it dry up like a raisin in the sun?'],
          ['Or fester like a sore—', 'And then run? Does it stink like rotten meat?'],
          ['Or crust and sugar over—', 'like a syrupy sweet? Maybe it just sags like a heavy load.'],
          ['Or does it explode?', 'The deferred dream shatters the silent air!'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'DEEP_RIVERS',
        name: 'Deep Rivers',
        tag: 'LIGHT',
        poemTitle: 'The Negro Speaks of Rivers',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'I’ve known rivers:',
          'I’ve known rivers ancient as the world.',
          'My soul has grown deep like the rivers.',
        ],
        progressiveStanzas: [
          ['I’ve known rivers:', 'I’ve known rivers ancient as the world and older than the flow of human blood.'],
          ['I bathed in the Euphrates when dawns were young.', 'I built my hut near the Congo and it lulled me to sleep.'],
          ['I looked upon the Nile and raised the pyramids above it.', 'I heard the singing of the Mississippi when Abe Lincoln went down to New Orleans.'],
          ['I’ve known rivers; ancient, dusky rivers.', 'My soul has grown deep like the rivers.'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'HOLD_FAST',
        name: 'Hold Fast',
        tag: 'BUFF',
        poemTitle: 'Dreams',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'Hold fast to dreams',
          'For if dreams die',
          'Life is a broken-winged bird that cannot fly.',
        ],
        progressiveStanzas: [
          ['Hold fast to dreams', 'For if dreams die, life is a broken-winged bird that cannot fly.'],
          ['Hold fast to dreams', 'For when dreams go, life is a barren field frozen with snow.'],
          ['Across the wintry plain,', 'the heart guards the ember of tomorrow.'],
          ['The wing mends in the singing wind;', 'the bird takes flight once more!'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'I_TOO',
        name: 'I, Too',
        tag: 'HEAL',
        poemTitle: 'I, Too',
        effectType: 'HEAL',
        healAmount: BATTLE_CONFIG.healAmount,
        maxReadings: BATTLE_CONFIG.healReadings,
        powerLabel: '+30% HP',
        descriptionShort: 'HEAL: Restores 30% Max HP (2 readings).',
        stanzas: [
          'I, too, sing America.',
          'I am the darker brother.',
          'Tomorrow, I’ll be at the table.',
        ],
        progressiveStanzas: [
          ['I, too, sing America.', 'I am the darker brother. They send me to eat in the kitchen.'],
          ['But I laugh, and eat well,', 'and grow strong. Tomorrow, I’ll be at the table.'],
          ['When company comes,', 'nobody’ll dare say to me, “Eat in the kitchen,” then.'],
          ['Besides, they’ll see how beautiful I am and be ashamed—', 'I, too, am America.'],
        ],
        affinity: 'SPRING',
      },
    ],
  },

  // 3. Walt Whitman (Spring) - 100 HP
  {
    id: 'WHITMAN',
    name: 'Walt Whitman',
    title: 'The Good Gray Bard',
    lifespan: '1819–1892',
    birthplace: 'West Hills, New York',
    movement: 'Transcendental / Free Verse',
    season: 'SPRING',
    affinity: 'SPRING',
    tier: 1,
    chapter: 1,
    chapterName: 'Chapter I: Spring',
    locationDescription: 'Meadow X:46, Y:20',
    worldCoords: { x: 46, y: 20 },
    fightingStyle: 'Cosmic Vitality & Unbound Free Verse',
    tacticalAdvice: 'Possesses large HP. Powers up with Multitudes and strikes with Barbaric Yawp.',
    defaultArenaId: 'AMHERST_SUNLIT_SOLARIUM',
    bio: 'Father of American free verse who celebrated democracy, nature, and the cosmic harmony of humanity.',
    quote: '“I celebrate myself, and sing myself, and what I assume you shall assume.”',
    dialogue: {
      intro: 'I celebrate myself, and sing myself.',
      preFight: 'I sound my barbaric yawp over the roofs of the world!',
      midFight: 'I contain multitudes! Do I contradict myself?',
      escaped: 'I stop somewhere waiting for you down the road.',
      captured: 'For every atom belonging to me as good belongs to you.',
      lose: 'The voyage is closed and done; rest in peace.',
    },
    preBattleDialogue: [
      '“I sound my barbaric yawp over the roofs of the world!”',
      '“I contain multitudes! Do I contradict myself?”',
    ],
    sourceNote: 'Alludes to “Song of Myself” and “Leaves of Grass”.',
    hp: BATTLE_CONFIG.healthByRegion.SPRING,
    atk: 56,
    def: 52,
    spd: 48,
    spriteAssetKey: 'poet_walt_whitman',
    primaryColor: '#0ea5e9',
    secondaryColor: '#38bdf8',
    accentColor: '#10b981',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#b45309',
      skinHighlight: '#ffedd5',
      hair: '#e2e8f0',
      hairHighlight: '#ffffff',
      hairShadow: '#94a3b8',
      clothing: '#334155',
      clothingHighlight: '#475569',
      clothingShadow: '#1e293b',
      accent: '#0ea5e9',
      hat: '#78716c',
    },
    moves: [
      {
        id: 'BARBARIC_YAWP',
        name: 'Barbaric Yawp',
        tag: 'HEAVY',
        poemTitle: 'Song of Myself',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'I too am not a bit tamed, I too am untranslatable,',
          'I sound my barbaric yawp over the roofs of the world.',
        ],
        progressiveStanzas: [
          ['I too am not a bit tamed, I too am untranslatable,', 'I sound my barbaric yawp over the roofs of the world.'],
          ['The last scud of day holds back for me,', 'It flings my likeness after the rest on the shadow’d wilds.'],
          ['I depart as air, I shake my white locks at the runaway sun,', 'I effuse my flesh in eddies, and drift it in lacy jags.'],
          ['I bequeath myself to the dirt to grow from the grass I love,', 'If you want me again look for me under your boot-soles.'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'BODY_ELECTRIC',
        name: 'Body Electric',
        tag: 'HEAL',
        poemTitle: 'I Sing the Body Electric',
        effectType: 'HEAL',
        healAmount: BATTLE_CONFIG.healAmount,
        maxReadings: BATTLE_CONFIG.healReadings,
        powerLabel: '+30% HP',
        descriptionShort: 'HEAL: Restores 30% Max HP (2 readings).',
        stanzas: [
          'I sing the body electric,',
          'The armies of those I love engirth me.',
        ],
        progressiveStanzas: [
          ['I sing the body electric,', 'The armies of those I love engirth me and I engirth them.'],
          ['O my body! I dare not desert the likes of you in other men nor women,', 'Each part belonging to the soul, divine and clear.'],
          ['The love of the body of man or woman balks account,', 'the body itself balks account.'],
          ['O I say now these are the soul!', 'If these are not the soul, what is the soul?'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'MULTITUDES',
        name: 'Multitudes',
        tag: 'BUFF',
        poemTitle: 'Song of Myself',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'Do I contradict myself?',
          'Very well then I contradict myself,',
          '(I am large, I contain multitudes.)',
        ],
        progressiveStanzas: [
          ['Do I contradict myself?', 'Very well then I contradict myself, (I am large, I contain multitudes.)'],
          ['I concentrate toward them that are nigh, the will has decided,', 'I wait on the door-slab of the world.'],
          ['Who has done his day’s work? who will soonest be through with his supper?', 'Who wishes to walk with me?'],
          ['Will you speak before I am gone?', 'Will you prove already too late?'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'OPEN_ROAD',
        name: 'Open Road',
        tag: 'LIGHT',
        poemTitle: 'Song of the Open Road',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'Afoot and light-hearted I take to the open road,',
          'Healthy, free, the world before me.',
        ],
        progressiveStanzas: [
          ['Afoot and light-hearted I take to the open road,', 'Healthy, free, the world before me.'],
          ['The long brown path before me leading wherever I choose,', 'Henceforth I ask not good-fortune, I myself am good-fortune.'],
          ['From this hour I ordain myself loos’d of limits and imaginary lines,', 'Going where I list, my own master total and absolute.'],
          ['Camerado, I give you my hand! Will you give me yourself?', 'Shall we stick by each other as long as we live?'],
        ],
        affinity: 'SPRING',
      },
    ],
  },

  // 4. Rumi (Spring) - 100 HP
  {
    id: 'RUMI',
    name: 'Rumi',
    title: 'The Mystic of Khorasan',
    lifespan: '1207–1273',
    birthplace: 'Balkh (Modern Afghanistan)',
    movement: 'Sufi Mystic',
    season: 'SPRING',
    affinity: 'SPRING',
    tier: 1,
    chapter: 1,
    chapterName: 'Chapter I: Spring',
    locationDescription: 'Rumi’s Sundial Courtyard X:7, Y:33',
    worldCoords: { x: 7, y: 33 },
    fightingStyle: 'Ecstatic Whirling & Divine Radiance',
    tacticalAdvice: 'Uses Reed Flute to skip foe turn and Ecstatic Whirl for heavy Spring damage.',
    defaultArenaId: 'PERSIAN_MOSAIC_COURTYARD',
    bio: '13th-century Persian Sufi mystic whose ecstatic odes celebrate transcendent love and spiritual union.',
    quote: '“Out beyond ideas of wrongdoing and rightdoing there is a field. I’ll meet you there.”',
    dialogue: {
      intro: "Khosh amadid. Rumi. I turn, it's how I pray.",
      preFight: 'Come, come, whoever you are.',
      midFight: 'Out beyond ideas of winning and losing, there is a field. Meet me there.',
      escaped: 'The wound is the place where the light enters you.',
      captured: 'You are not a drop in the ocean; you are the entire ocean in a drop. I will walk with you.',
      lose: 'You are not a drop in the ocean; you are the entire ocean in a drop. I will walk with you.',
    },
    preBattleDialogue: [
      '“I’ll meet you there in the circle of the sun.”',
      '“The wound is the place where the Light enters you.”',
    ],
    sourceNote: 'Alludes to Masnavi and Mathnawi.',
    hp: BATTLE_CONFIG.healthByRegion.SPRING,
    atk: 50,
    def: 52,
    spd: 58,
    spriteAssetKey: 'poet_rumi',
    primaryColor: '#d97706',
    secondaryColor: '#fbbf24',
    accentColor: '#10b981',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#b45309',
      skinHighlight: '#ffedd5',
      hair: '#f8fafc',
      hairHighlight: '#ffffff',
      hairShadow: '#cbd5e1',
      clothing: '#047857',
      clothingHighlight: '#059669',
      clothingShadow: '#064e3b',
      accent: '#fbbf24',
      hat: '#064e3b',
    },
    moves: [
      {
        id: 'ECSTATIC_WHIRL',
        name: 'Ecstatic Whirl',
        tag: 'HEAVY',
        poemTitle: 'The Masnavi',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Dance, when you’re broken open.',
          'Dance, if you’ve torn the bandage off.',
          'Dance in the middle of the fighting.',
        ],
        progressiveStanzas: [
          ['Dance, when you’re broken open.', 'Dance, if you’ve torn the bandage off.'],
          ['Dance in the middle of the fighting.', 'Dance in your blood. Dance when you’re perfectly free.'],
          ['The soul takes flight in turning,', 'shedding the dust of sorrow in the celestial arc.'],
          ['In the center of the turning circle,', 'the beloved smiles, and all is one.'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'THE_GUEST_HOUSE',
        name: 'The Guest House',
        tag: 'HEAL',
        poemTitle: 'The Guest House',
        effectType: 'HEAL',
        healAmount: BATTLE_CONFIG.healAmount,
        maxReadings: BATTLE_CONFIG.healReadings,
        powerLabel: '+30% HP',
        descriptionShort: 'HEAL: Restores 30% Max HP (2 readings).',
        stanzas: [
          'This being human is a guest house.',
          'Every morning a new arrival.',
          'Welcome and entertain them all!',
        ],
        progressiveStanzas: [
          ['This being human is a guest house.', 'Every morning a new arrival.'],
          ['A joy, a depression, a meanness,', 'some momentary awareness comes as an unexpected visitor.'],
          ['Welcome and entertain them all!', 'Even if they are a crowd of sorrows who violently sweep your house.'],
          ['Be grateful for whoever comes,', 'because each has been sent as a guide from beyond.'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'REED_FLUTE',
        name: 'Reed Flute',
        tag: 'DEBUFF',
        poemTitle: 'Song of the Reed',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'Listen to the story told by the reed,',
          'of being separated.',
        ],
        progressiveStanzas: [
          ['Listen to the story told by the reed,', 'of being separated from the reed-bed.'],
          ['“Since I was cut from the reed-bed,', 'my wailing has caused men and women to weep.”'],
          ['Anyone who lives far from his source', 'longs to return to the state of union.'],
          ['The reed is hurt by fire, not by wind;', 'whoever lacks this fire, let him be nothing!'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'FIELD_BEYOND',
        name: 'Field Beyond',
        tag: 'LIGHT',
        poemTitle: 'A Great Wagon',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'When the soul lies down in that grass,',
          'the world is too full to talk about.',
        ],
        progressiveStanzas: [
          ['Out beyond ideas of wrongdoing and rightdoing', 'there is a field. I’ll meet you there.'],
          ['When the soul lies down in that grass,', 'the world is too full to talk about.'],
          ['Ideas, language, even the phrase “each other”', 'no longer make any sense.'],
          ['The breeze at dawn has secrets to tell you.', 'Don’t go back to sleep.'],
        ],
        affinity: 'SPRING',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER II: SUMMER (120 HP)
  // 5. Pablo Neruda, 6. Federico Garcia Lorca, 7. Maya Angelou, 8. William Blake
  // ==========================================================================

  // 5. Pablo Neruda (Summer) - 120 HP
  {
    id: 'NERUDA',
    name: 'Pablo Neruda',
    title: 'The Poet of Earth and Sea',
    lifespan: '1904–1973',
    birthplace: 'Parral, Chile',
    movement: 'Surrealist / Earthy Lyric',
    season: 'SUMMER',
    affinity: 'SUMMER',
    tier: 2,
    chapter: 2,
    chapterName: 'Chapter II: Summer',
    locationDescription: 'Neruda’s Patio X:33, Y:40',
    worldCoords: { x: 33, y: 40 },
    fightingStyle: 'Surreal Oceanic Flow & Abundant Earth',
    tacticalAdvice: 'Applies Lost for words with Keeping Quiet and deals heavy Summer damage with Ocean Surge.',
    defaultArenaId: 'PERSIAN_MOSAIC_COURTYARD',
    bio: 'Nobel laureate Chilean poet whose odes celebrated love, sea tempests, and the geological soul of South America.',
    quote: '“I love you without knowing how, or when, or from where.”',
    dialogue: {
      intro: 'Hola, compañero. Neruda. Sit. The sea does the talking in here.',
      preFight: 'Tonight I can write the saddest lines.',
      midFight: 'The Pacific tide is coming in—let the verses crash against the rocks!',
      escaped: 'Like a wave receding into the southern sea, I am gone.',
      captured: 'Poetry arrived in search of me, and today it found us both. Let’s go.',
      lose: 'Poetry arrived in search of me, and today it found us both. Let’s go.',
    },
    preBattleDialogue: [
      '“Tonight I can write the saddest lines under the summer stars.”',
      '“You can cut all the flowers, but you cannot keep Spring from coming.”',
    ],
    sourceNote: 'Alludes to “Twenty Love Poems” and “Canto General”.',
    hp: BATTLE_CONFIG.healthByRegion.SUMMER,
    atk: 58,
    def: 50,
    spd: 48,
    spriteAssetKey: 'poet_pablo_neruda',
    primaryColor: '#059669',
    secondaryColor: '#34d399',
    accentColor: '#f43f5e',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#c2410c',
      skinHighlight: '#ffedd5',
      hair: '#3f3f46',
      hairHighlight: '#52525b',
      hairShadow: '#27272a',
      clothing: '#065f46',
      clothingHighlight: '#059669',
      clothingShadow: '#064e3b',
      accent: '#34d399',
      hat: '#27272a',
    },
    moves: [
      {
        id: 'OCEAN_SURGE',
        name: 'Ocean Surge',
        tag: 'HEAVY',
        poemTitle: 'Ode to the Sea',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Here on the island the sea, and so much sea,',
          'overflows, arrives, bursts.',
        ],
        progressiveStanzas: [
          ['Here on the island the sea, and so much sea,', 'overflows, arrives, bursts.'],
          ['It says yes, then no, then no, then no,', 'in blue, in foam, in gallops.'],
          ['The ocean smashes its green fist against the stones,', 'swallowing solitude in towering spray.'],
          ['It cannot remain still. My name is sea,', 'it repeats, crashing upon the southern shore.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'RED_TOMATO',
        name: 'Red Tomato',
        tag: 'HEAL',
        poemTitle: 'Ode to Tomatoes',
        effectType: 'HEAL',
        healAmount: BATTLE_CONFIG.healAmount,
        maxReadings: BATTLE_CONFIG.healReadings,
        powerLabel: '+30% HP',
        descriptionShort: 'HEAL: Restores 30% Max HP (2 readings).',
        stanzas: [
          'The street filled with tomatoes,',
          'midday, summer, light is halved like a tomato.',
        ],
        progressiveStanzas: [
          ['The street filled with tomatoes,', 'midday, summer, light is halved like a tomato.'],
          ['Its juices run through the streets,', 'we must, unfortunately, murder it.'],
          ['The knife sinks into its living flesh,', 'a red viscera, a cool, profound sun.'],
          ['It sheds its peace over the salad bowl,', 'and summer laughs with oil and salt.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'KEEPING_QUIET',
        name: 'Keeping Quiet',
        tag: 'DEBUFF',
        poemTitle: 'Keeping Quiet',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'Now we will count to twelve',
          'and we will all keep still.',
        ],
        progressiveStanzas: [
          ['Now we will count to twelve', 'and we will all keep still.'],
          ['For once on the face of the earth,', 'let’s not speak in any language; let’s stop for one second.'],
          ['It would be an exotic moment without rush,', 'without engines; we would all be together in a sudden strangeness.'],
          ['If we were not so single-minded about keeping our lives moving,', 'perhaps a huge silence might interrupt this sadness.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'SONNET_SEVENTEEN',
        name: 'Sonnet Seventeen',
        tag: 'LIGHT',
        poemTitle: '100 Love Sonnets',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'I love you as certain dark things are to be loved,',
          'in secret, between the shadow and the soul.',
        ],
        progressiveStanzas: [
          ['I love you as certain dark things are to be loved,', 'in secret, between the shadow and the soul.'],
          ['I love you as the plant that never blooms', 'but carries in itself the light of hidden flowers.'],
          ['I love you without knowing how, or when, or from where,', 'I love you straightforwardly, without complexities or pride.'],
          ['So close that your hand on my chest is my hand,', 'so close that your eyes close as I fall asleep.'],
        ],
        affinity: 'SUMMER',
      },
    ],
  },

  // 6. Federico Garcia Lorca (Summer) - 120 HP
  {
    id: 'LORCA',
    name: 'Federico García Lorca',
    title: 'The Andalusian Duende',
    lifespan: '1898–1936',
    birthplace: 'Fuente Vaqueros, Spain',
    movement: 'Duende / Andalusian Vanguard',
    season: 'SUMMER',
    affinity: 'SUMMER',
    tier: 2,
    chapter: 2,
    chapterName: 'Chapter II: Summer',
    locationDescription: 'Lorca’s Olive Grove X:6, Y:26 (with moon & guitar)',
    worldCoords: { x: 6, y: 26 },
    fightingStyle: 'Flamenco Duende & Nocturnal Moon Cadence',
    tacticalAdvice: 'Applies Lost for words with Weeping Guitar and strikes fiercely with Duende Strike.',
    defaultArenaId: 'PERSIAN_MOSAIC_COURTYARD',
    bio: 'Renowned Spanish poet and dramatist whose Romancero gitano and duende explored the dark, passionate soul of folk song.',
    quote: '“Green, how I want you green. Green wind. Green branches.”',
    dialogue: {
      intro: "Buenas. Federico. Lorca if you're being formal, and nobody is.",
      preFight: 'Verde que te quiero verde.',
      midFight: 'Hear that? The duende is waking up in the floorboards!',
      escaped: 'Into the olive groves under the crescent moon I slip away.',
      captured: 'Green wind, green boughs, and a worthy voice. My guitar is yours.',
      lose: 'Green wind, green boughs, and a worthy voice. My guitar is yours.',
    },
    preBattleDialogue: [
      '“The duende does not come from the throat; it climbs up from the soles of your feet.”',
      '“The guitar begins its weeping; it is impossible to silence it.”',
    ],
    sourceNote: 'Alludes to “Romance Sonámbulo” and “Llanto por Ignacio Sánchez Mejías”.',
    hp: BATTLE_CONFIG.healthByRegion.SUMMER,
    atk: 52,
    def: 47,
    spd: 59,
    spriteAssetKey: 'poet_federico_garcia_lorca',
    primaryColor: '#b91c1c',
    secondaryColor: '#dc2626',
    accentColor: '#10b981',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#b45309',
      skinHighlight: '#ffedd5',
      hair: '#18181b',
      hairHighlight: '#27272a',
      hairShadow: '#09090b',
      clothing: '#1c1917',
      clothingHighlight: '#292524',
      clothingShadow: '#0c0a09',
      accent: '#dc2626',
    },
    moves: [
      {
        id: 'DUENDE_STRIKE',
        name: 'Duende Strike',
        tag: 'HEAVY',
        poemTitle: 'Teoria y Juego del Duende',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'The duende loves the rim of the wound.',
          'It tears through the musician’s cloak.',
        ],
        progressiveStanzas: [
          ['The duende does not come from the throat;', 'it climbs up from the soles of your feet.'],
          ['The duende loves the rim of the wound,', 'and draws near places where forms fuse into yearning.'],
          ['It rejects all sweet geometry;', 'it breaks styles and burns the blood like powdered glass.'],
          ['Through the empty archway walks a dark wind', 'waking the ancient mystery of Andalusia.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'WEEPING_GUITAR',
        name: 'Weeping Guitar',
        tag: 'BUFF',
        poemTitle: 'La Guitarra',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'Empieza el llanto de la guitarra.',
          'Es imposible callarla.',
        ],
        progressiveStanzas: [
          ['Empieza el llanto de la guitarra.', 'Se rompen las copas de la madrugada.'],
          ['Es inútil callarla.', 'Llora monótona como llora el agua.'],
          ['Llora por cosas lejanas.', 'Arena del Sur caliente que pide camelias blancas.'],
          ['¡Oh guitarra!', 'Corazón malherido por cinco espadas.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'GREEN_WIND',
        name: 'Green Wind',
        tag: 'STATUS',
        poemTitle: 'Romance Sonambulo',
        effectType: 'STATUS',
        maxReadings: BATTLE_CONFIG.statusReadings,
        powerLabel: 'STATUS',
        descriptionShort: 'STATUS: Lost for words — target skips turn (2 readings).',
        stanzas: [
          'Verde viento. Verdes ramas.',
          'El barco sobre la mar y el caballo en la montaña.',
        ],
        progressiveStanzas: [
          ['Verde que te quiero verde.', 'Verde viento. Verdes ramas.'],
          ['El barco sobre la mar', 'y el caballo en la montaña.'],
          ['Con la sombra en la cintura', 'ella sueña en su baranda.'],
          ['Bajo la luna gitana,', 'las cosas la están mirando y ella no puede mirarlas.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'FIVE_AFTERNOON',
        name: 'Five Afternoon',
        tag: 'LIGHT',
        poemTitle: 'Llanto por Ignacio',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'A las cinco de la tarde.',
          'Eran las cinco en punto de la tarde.',
        ],
        progressiveStanzas: [
          ['A las cinco de la tarde.', 'Eran las cinco en punto de la tarde.'],
          ['Un niño trajo la blanca sábana', 'a las cinco de la tarde.'],
          ['Una espuerta de cal ya prevenida', 'a las cinco de la tarde.'],
          ['Lo demás era muerte y sólo muerte', 'a las cinco de la tarde.'],
        ],
        affinity: 'SUMMER',
      },
    ],
  },

  // 7. Maya Angelou (Summer) - 120 HP
  {
    id: 'ANGELOU',
    name: 'Maya Angelou',
    title: 'Voice of Unbroken Resilience',
    lifespan: '1928–2014',
    birthplace: 'St. Louis, Missouri',
    movement: 'Lyrical Empowerment',
    season: 'SUMMER',
    affinity: 'SUMMER',
    tier: 2,
    chapter: 2,
    chapterName: 'Chapter II: Summer',
    locationDescription: 'Angelou’s Dais on East Side of Square X:34, Y:25',
    worldCoords: { x: 34, y: 25 },
    fightingStyle: 'Unbroken Resilience & Triumphant Rise',
    tacticalAdvice: 'Bolsters power with Phenomenal Stride and strikes with Still I Rise.',
    defaultArenaId: 'GOLDEN_RISING_SUN_SANCTUARY',
    bio: 'Celebrated poet and civil rights icon whose booming verse lifted generations with dignity and pride.',
    quote: '“You may write me down in history / With your bitter, twisted lies, / You may trod me in the very dirt / But still, like dust, I’ll rise.”',
    dialogue: {
      intro: 'Well, good afternoon. Maya Angelou. Come stand here a minute, look at that.',
      preFight: 'You may write me down in history with your bitter, twisted lies.',
      midFight: 'You can’t use up creativity—the more you use, the more you have!',
      escaped: 'Into a daybreak that’s wondrously clear, I rise away.',
      captured: 'Still we rise. Pack the legal pad and the cards, baby, we’re climbing higher.',
      lose: 'Still we rise. Pack the legal pad and the cards, baby, we’re climbing higher.',
    },
    preBattleDialogue: [
      '“You may trod me in the very dirt, but still, like dust, I’ll rise!”',
      '“Just like moons and like suns, with the certainty of tides, I’ll rise.”',
    ],
    sourceNote: 'Alludes to “Still I Rise” and “Phenomenal Woman”.',
    hp: BATTLE_CONFIG.healthByRegion.SUMMER,
    atk: 56,
    def: 56,
    spd: 49,
    spriteAssetKey: 'poet_maya_angelou',
    primaryColor: '#e11d48',
    secondaryColor: '#f43f5e',
    accentColor: '#fbbf24',
    portraitPalette: {
      skin: '#78350f',
      skinShadow: '#451a03',
      skinHighlight: '#92400e',
      hair: '#1c1917',
      hairHighlight: '#292524',
      hairShadow: '#0c0a09',
      clothing: '#9f1239',
      clothingHighlight: '#be123c',
      clothingShadow: '#881337',
      accent: '#fbbf24',
      hat: '#e11d48',
    },
    moves: [
      {
        id: 'STILL_I_RISE',
        name: 'Still I Rise',
        tag: 'HEAVY',
        poemTitle: 'Still I Rise',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'You may shoot me with your words,',
          'You may cut me with your eyes,',
          'But still, like air, I’ll rise.',
        ],
        progressiveStanzas: [
          ['You may write me down in history with your bitter, twisted lies,', 'You may trod me in the very dirt, but still, like dust, I’ll rise.'],
          ['Just like moons and like suns, with the certainty of tides,', 'Just like hopes springing high, still I’ll rise.'],
          ['You may shoot me with your words, you may cut me with your eyes,', 'You may kill me with your hatefulness, but still, like air, I’ll rise.'],
          ['Out of the huts of history’s shame I rise;', 'Bringing the gifts that my ancestors gave, I am the dream and the hope of the slave.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'PHENOMENAL_STRIDE',
        name: 'Phenomenal Stride',
        tag: 'BUFF',
        poemTitle: 'Phenomenal Woman',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'It’s the span of my hips,',
          'The stride of my step,',
          'The curl of my lips.',
        ],
        progressiveStanzas: [
          ['Pretty women wonder where my secret lies.', 'I’m not cute or built to suit a fashion model’s size.'],
          ['It’s in the reach of my arms, the span of my hips,', 'The stride of my step, the curl of my lips.'],
          ['Men themselves have wondered what they see in me.', 'They try so much but they can’t touch my inner mystery.'],
          ['I’m a woman phenomenally.', 'Phenomenal woman, that’s me.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'CAGED_BIRD_SONG',
        name: 'Caged Bird Song',
        tag: 'HEAL',
        poemTitle: 'Caged Bird',
        effectType: 'HEAL',
        healAmount: BATTLE_CONFIG.healAmount,
        maxReadings: BATTLE_CONFIG.healReadings,
        powerLabel: '+30% HP',
        descriptionShort: 'HEAL: Restores 30% Max HP (2 readings).',
        stanzas: [
          'The caged bird sings with a fearful trill',
          'of things unknown but longed for still.',
        ],
        progressiveStanzas: [
          ['A free bird leaps on the back of the wind', 'and floats downstream till the current ends and dips his wing in the orange sun rays.'],
          ['But a bird that stalks down his narrow cage', 'can seldom see through his bars of rage; his wings are clipped and his feet are tied.'],
          ['The caged bird sings with a fearful trill', 'of things unknown but longed for still and his tune is heard on the distant hill.'],
          ['For the caged bird', 'sings of freedom.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'MORNING_PULSE',
        name: 'Morning Pulse',
        tag: 'LIGHT',
        poemTitle: 'On the Pulse of Morning',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'Lift up your eyes upon',
          'This day breaking for you.',
          'Give birth again To the dream.',
        ],
        progressiveStanzas: [
          ['A Rock, A River, A Tree', 'Hosts to species long since departed, marked the mastodon.'],
          ['Lift up your faces, you have a searching need', 'For this bright morning dawning for you.'],
          ['History, despite its wrenching pain,', 'Cannot be unlived, but if faced with courage, need not be lived again.'],
          ['Lift up your eyes upon this day breaking for you.', 'Give birth again to the dream.'],
        ],
        affinity: 'SUMMER',
      },
    ],
  },

  // 8. William Blake (Summer) - 120 HP
  {
    id: 'BLAKE',
    name: 'William Blake',
    title: 'The Visionary Mystic',
    lifespan: '1757–1827',
    birthplace: 'London, England',
    movement: 'Romantic / Prophetic',
    season: 'SUMMER',
    affinity: 'SUMMER',
    tier: 2,
    chapter: 2,
    chapterName: 'Chapter II: Summer',
    locationDescription: 'Blake’s Kiln Yard X:13, Y:32',
    worldCoords: { x: 13, y: 32 },
    fightingStyle: 'Visionary Furnace & Fiery Contraries',
    tacticalAdvice: 'Debuffs foe with Mind-Forg’d Chains and strikes with Tyger Blaze.',
    defaultArenaId: 'PERSIAN_MOSAIC_COURTYARD',
    bio: 'Visionary poet and engraver whose prophetic works balanced the Songs of Innocence and Experience in burning symmetry.',
    quote: '“Tyger Tyger, burning bright, / In the forests of the night.”',
    dialogue: {
      intro: "Good morrow. Blake. I'm engraving, mind the plates.",
      preFight: 'Tyger Tyger, burning bright.',
      midFight: 'The furnaces of Los are roaring—show me your fearful symmetry!',
      escaped: 'The fiery vision dissolves into the London smoke.',
      captured: "If the doors of perception were cleansed, every stanza would shine like that. I'll join your press.",
      lose: "If the doors of perception were cleansed, every stanza would shine like that. I'll join your press.",
    },
    preBattleDialogue: [
      '“Tyger Tyger, burning bright in the forests of the night!”',
      '“Did he who made the Lamb make thee?”',
    ],
    sourceNote: 'Alludes to “The Tyger”, “The Lamb”, and “Auguries of Innocence”.',
    hp: BATTLE_CONFIG.healthByRegion.SUMMER,
    atk: 58,
    def: 50,
    spd: 48,
    spriteAssetKey: 'poet_william_blake',
    primaryColor: '#f59e0b',
    secondaryColor: '#fbbf24',
    accentColor: '#dc2626',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#c2410c',
      skinHighlight: '#ffedd5',
      hair: '#b45309',
      hairHighlight: '#f59e0b',
      hairShadow: '#78350f',
      clothing: '#b45309',
      clothingHighlight: '#d97706',
      clothingShadow: '#78350f',
      accent: '#fbbf24',
    },
    moves: [
      {
        id: 'TYGER_BLAZE',
        name: 'Tyger Blaze',
        tag: 'HEAVY',
        poemTitle: 'The Tyger',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Tyger Tyger, burning bright,',
          'In the forests of the night;',
          'What immortal hand or eye,',
          'Could frame thy fearful symmetry?',
        ],
        progressiveStanzas: [
          ['Tyger Tyger, burning bright,', 'In the forests of the night; What immortal hand or eye, could frame thy fearful symmetry?'],
          ['In what distant deeps or skies', 'Burnt the fire of thine eyes? On what wings dare he aspire? What the hand, dare seize the fire?'],
          ['And what shoulder, & what art,', 'Could twist the sinews of thy heart? And when thy heart began to beat, what dread hand? & what dread feet?'],
          ['When the stars threw down their spears', 'And water’d heaven with their tears: Did he smile his work to see? Did he who made the Lamb make thee?'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'THE_LAMB',
        name: 'The Lamb',
        tag: 'LIGHT',
        poemTitle: 'The Lamb',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'Little Lamb who made thee',
          'Dost thou know who made thee',
          'Gave thee life & bid thee feed.',
        ],
        progressiveStanzas: [
          ['Little Lamb who made thee', 'Dost thou know who made thee? Gave thee life & bid thee feed by the stream & o’er the mead.'],
          ['Gave thee clothing of delight,', 'Softest clothing wooly bright; Gave thee such a tender voice, making all the vales rejoice!'],
          ['Little Lamb I’ll tell thee,', 'Little Lamb I’ll tell thee! He is called by thy name, for he calls himself a Lamb.'],
          ['He is meek & he is mild,', 'He became a little child: I a child & thou a lamb, we are called by his name.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'FEARFUL_SYMMETRY',
        name: 'Fearful Symmetry',
        tag: 'BUFF',
        poemTitle: 'The Tyger',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'What the hammer? what the chain,',
          'In what furnace was thy brain?',
        ],
        progressiveStanzas: [
          ['What the hammer? what the chain,', 'In what furnace was thy brain? What the anvil? what dread grasp, dare its deadly terrors clasp!'],
          ['To see a World in a Grain of Sand', 'And a Heaven in a Wild Flower, hold Infinity in the palm of your hand and Eternity in an hour.'],
          ['A Robin Red breast in a Cage', 'Puts all Heaven in a Rage. A skylark wounded in the wing, a Cherubim does cease to sing.'],
          ['Tyger Tyger burning bright,', 'In the forests of the night: What immortal hand or eye, dare frame thy fearful symmetry?'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'MIND_CHAINS',
        name: 'Mind-Forg’d Chains',
        tag: 'DEBUFF',
        poemTitle: 'London',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'In every cry of every Man,',
          'In every Infant’s cry of fear,',
          'The mind-forg’d manacles I hear.',
        ],
        progressiveStanzas: [
          ['I wander thro’ each charter’d street,', 'Near where the charter’d Thames does flow, and mark in every face I meet marks of weakness, marks of woe.'],
          ['In every cry of every Man,', 'In every Infant’s cry of fear, in every voice, in every ban, the mind-forg’d manacles I hear.'],
          ['How the Chimney-sweeper’s cry', 'Every black’ning Church appalls; and the hapless Soldier’s sigh runs in blood down Palace walls.'],
          ['The youthful Harlot’s curse', 'Blasts the new-born Infant’s tear, and blights with plagues the Marriage hearse.'],
        ],
        affinity: 'SUMMER',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER III: AUTUMN (140 HP)
  // 9. Matsuo Basho, 10. Li Bai, 11. Sor Juana Ines de la Cruz, 12. Charles Bukowski
  // ==========================================================================

  // 9. Matsuo Basho (Autumn) - 140 HP
  {
    id: 'BASHO',
    name: 'Matsuo Bashō',
    title: 'The Zen Haiku Master',
    lifespan: '1644–1694',
    birthplace: 'Iga Province, Japan',
    movement: 'Zen Haiku',
    season: 'AUTUMN',
    affinity: 'AUTUMN',
    tier: 3,
    chapter: 3,
    chapterName: 'Chapter III: Autumn',
    locationDescription: 'Basho’s Bank along River X:50, Y:31',
    worldCoords: { x: 50, y: 31 },
    fightingStyle: 'Haiku Stillness & Water Ripple Defense',
    tacticalAdvice: 'Applies Lost for words with Autumn Crow and deals Autumn damage with Old Pond Splash.',
    defaultArenaId: 'MISTY_BAMBOO_GROVE',
    bio: 'Supreme master of haiku who wandered Edo Japan, capturing transient moments of stillness in three distilled lines.',
    quote: '“The old pond / A frog leaps in / The sound of water.”',
    dialogue: {
      intro: 'The moon and sun are travelers of eternity.',
      preFight: 'An old pond. A frog jumps in.',
      midFight: 'Do not seek to follow in the footsteps of the wise; seek what they sought.',
      escaped: 'On a withered branch a crow alights; autumn twilight.',
      captured: 'Lightness in the verse, stillness in the pond. My walking staff is yours.',
      lose: 'Lightness in the verse, stillness in the pond. My walking staff is yours.',
    },
    preBattleDialogue: [
      '“The old pond: a frog leaps in, the sound of water.”',
      '“Summer grasses: all that remains of warriors’ dreams.”',
    ],
    sourceNote: 'Alludes to Oku no Hosomichi and classical haiku.',
    hp: BATTLE_CONFIG.healthByRegion.AUTUMN,
    atk: 46,
    def: 58,
    spd: 54,
    spriteAssetKey: 'poet_matsuo_basho',
    primaryColor: '#0d9488',
    secondaryColor: '#2dd4bf',
    accentColor: '#10b981',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#b45309',
      skinHighlight: '#ffedd5',
      hair: '#71717a',
      hairHighlight: '#a1a1aa',
      hairShadow: '#3f3f46',
      clothing: '#134e4a',
      clothingHighlight: '#0f766e',
      clothingShadow: '#042f2e',
      accent: '#2dd4bf',
      hat: '#a8a29e',
    },
    moves: [
      {
        id: 'OLD_POND_SPLASH',
        name: 'Old Pond Splash',
        tag: 'HEAVY',
        poemTitle: 'The Old Pond',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          '古池や (Furu ike ya)',
          '蛙飛びこむ (Kawazu tobikomu)',
          '水の音 (Mizu no oto)',
        ],
        progressiveStanzas: [
          ['古池や (An ancient pond)', '蛙飛びこむ (A frog leaps in)', '水の音 (The sound of water)'],
          ['五月雨を (Gathering early summer rains)', 'あつめて早し (Rushing swiftly onward)', '最上川 (The Mogami River)'],
          ['荒海や (Rough stormy sea)', '佐渡によこたふ (Reaching across to Sado)', '天の河 (The River of Heaven)'],
          ['旅に病んで (Fallen sick on a journey)', '夢は枯野を (My dreams wander over)', 'かけ廻る (A withered field)'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'SUMMER_GRASSES',
        name: 'Summer Grasses',
        tag: 'DEBUFF',
        poemTitle: 'Summer Grasses',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          '夏草や (Natsugusa ya)',
          '兵どもが (Tsuwamono-domo ga)',
          '夢の跡 (Yume no ato)',
        ],
        progressiveStanzas: [
          ['夏草や (Summer grasses)', '兵どもが (All that remains)', '夢の跡 (Of warriors’ dreams)'],
          ['道のべの (By the roadside)', '木槿は馬に (Rose of Sharon petals)', '食はれけり (Eaten by my horse)'],
          ['野を横に (Across the wide field)', '馬牽きむけよ (Turn the horse toward)', 'ほととぎす (The cuckoo’s call)'],
          ['さまざまの (Many, many things)', '事思ひ出す (Come to mind now)', '桜かな (Cherry blossoms)'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'AUTUMN_CROW',
        name: 'Autumn Crow',
        tag: 'STATUS',
        poemTitle: 'Autumn Crow',
        effectType: 'STATUS',
        maxReadings: BATTLE_CONFIG.statusReadings,
        powerLabel: 'STATUS',
        descriptionShort: 'STATUS: Lost for words — target skips turn (2 readings).',
        stanzas: [
          '枯枝に (Kareeda ni)',
          '烏のとまりけり (Karasu no tomarikeri)',
          '秋の暮 (Aki no kure)',
        ],
        progressiveStanzas: [
          ['枯枝に (On a withered bough)', '烏のとまりけり (A solitary crow perches)', '秋の暮 (Autumn twilight)'],
          ['行春や (Spring passing)', '鳥啼き魚の (Birds weep and the eyes of fish)', '目は泪 (Are filled with tears)'],
          ['月見づる (Gazing at the moon)', '座頭の如く (Like a blind wanderer)', '歩みけり (Walking on alone)'],
          ['秋深き (Autumn deepening)', '隣は何を (What does the neighbor do?)', 'する人ぞ (How does he live?)'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'CICADA_STILLNESS',
        name: 'Cicada Stillness',
        tag: 'LIGHT',
        poemTitle: 'Stillness',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          '閑さや (Shizukesa ya)',
          '岩にしみ入る (Iwa ni shimi-iru)',
          '蝉の声 (Semi no koe)',
        ],
        progressiveStanzas: [
          ['閑さや (Stillness)', '岩にしみ入る (Seeping into the mountain stone)', '蝉の声 (The voice of the cicada)'],
          ['初時雨 (First winter rain)', '猿も小蓑を (Even the little monkey)', 'ほしげなり (Seems to want a tiny raincoat)'],
          ['名月や (Harvest moon)', '池をめぐりて (Pacing around the pond)', '夜もすがら (All through the night)'],
          ['草の戸も (Even my grass hut)', '住み替る代ぞ (Will change owners now)', '雛の家 (A doll’s house)'],
        ],
        affinity: 'AUTUMN',
      },
    ],
  },

  // 10. Li Bai (Autumn) - 140 HP
  {
    id: 'LI_BAI',
    name: 'Li Bai',
    title: 'The Poet Immortal',
    lifespan: '701–762',
    birthplace: 'Tang Empire, China',
    movement: 'Tang Classical / Daoist',
    season: 'AUTUMN',
    affinity: 'AUTUMN',
    tier: 3,
    chapter: 3,
    chapterName: 'Chapter III: Autumn',
    locationDescription: 'Li Bai’s Pavilion over Koi Pond X:6, Y:18',
    worldCoords: { x: 6, y: 18 },
    fightingStyle: 'Daoist Swiftness & Celestial Torrent',
    tacticalAdvice: 'Applies Lost for words with Drunken Shadow and strikes with River Torrent.',
    defaultArenaId: 'MISTY_BAMBOO_GROVE',
    bio: 'Celestial genius of the Tang Dynasty, renowned for wine-fueled moonlit reveries and spontaneous lyrics of lightness.',
    quote: '“I raise my cup and invite the moon / To drink with my shadow, and we are three.”',
    dialogue: {
      intro: 'I raise my cup and invite the moon.',
      preFight: 'The Yellow River comes from heaven, rushing to the sea!',
      midFight: 'Another cup! The moon is just starting to listen!',
      escaped: 'Riding the back of a celestial whale, I return to the sky.',
      captured: "A match worthy of the immortals! Lead the way up the peak, I'll bring the gourd.",
      lose: "A match worthy of the immortals! Lead the way up the peak, I'll bring the gourd.",
    },
    preBattleDialogue: [
      '“The Yellow River comes from heaven, rushing to the sea!”',
      '“Life in this world is but a big dream; why toil our lives away?”',
    ],
    sourceNote: 'Alludes to “Bring in the Wine” and “Drinking Alone Under the Moon”.',
    hp: BATTLE_CONFIG.healthByRegion.AUTUMN,
    atk: 57,
    def: 45,
    spd: 58,
    spriteAssetKey: 'poet_li_bai',
    primaryColor: '#0891b2',
    secondaryColor: '#67e8f9',
    accentColor: '#facc15',
    portraitPalette: {
      skin: '#fef08a',
      skinShadow: '#d97706',
      skinHighlight: '#fffbeb',
      hair: '#1e293b',
      hairHighlight: '#334155',
      hairShadow: '#0f172a',
      clothing: '#155e75',
      clothingHighlight: '#0e7490',
      clothingShadow: '#083344',
      accent: '#67e8f9',
      hat: '#0e7490',
    },
    moves: [
      {
        id: 'RIVER_TORRENT',
        name: 'River Torrent',
        tag: 'HEAVY',
        poemTitle: 'Bring in the Wine',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          '君不见黄河之水天上来 (Yellow River waters come from heaven)',
          '奔流到海不复回 (Rushing to the ocean, never to return!)',
        ],
        progressiveStanzas: [
          ['君不见黄河之水天上来 (See how the Yellow River’s waters come from heaven)', '奔流到海不复回 (Rushing to the ocean, never to return!)'],
          ['君不见高堂明镜悲白发 (See how in bright mirrors gray hair brings grief)', '朝如青丝暮成雪 (Silk threads at dawn, by dusk like winter snow!)'],
          ['人生得意须尽欢 (In life, when fortune smiles, drink to your fill)', '莫使金樽空对月 (Never let the golden goblet face the moon empty!)'],
          ['天生我材必有用 (Heaven gave me talent and surely a purpose)', '千金散尽还复来 (A thousand gold pieces scattered will return again!)'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'MOON_INVITATION',
        name: 'Moon Invitation',
        tag: 'BUFF',
        poemTitle: 'Drinking Alone Under the Moon',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          '举杯邀明月 (I raise my cup to invite the moon)',
          '对影成三人 (Facing my shadow, we are three!)',
        ],
        progressiveStanzas: [
          ['花间一壶酒 (A jug of wine amid the blossoms)', '独酌无相亲 (Drinking alone with no friend near)'],
          ['举杯邀明月 (I raise my cup to invite the moon)', '对影成三人 (Facing my shadow, we become three!)'],
          ['月既不解饮 (The moon knows nothing of drinking wine)', '影徒随我身 (My shadow only tags along behind)'],
          ['暂伴月将影 (For now with the moon and shadow together)', '行乐须及春 (One must make merry while springtime lasts!)'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'MOUNTAIN_WATERFALL',
        name: 'Mountain Waterfall',
        tag: 'LIGHT',
        poemTitle: 'Waterfall at Mount Lu',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          '飞流直下三千尺 (Flying torrent plunged three thousand feet straight down)',
          '疑是银河落九天 (Suspecting the Milky Way fell from ninth heaven)',
        ],
        progressiveStanzas: [
          ['日照香炉生紫烟 (Sunlight on Incense Burner Peak weaves purple haze)', '遥看瀑布挂前川 (Far off, a waterfall hangs across the river gorge)'],
          ['飞流直下三千尺 (Its flying torrent plunges three thousand feet)', '疑是银河落九天 (As if the Milky Way had fallen from high heaven!)'],
          ['问余何意栖碧山 (You ask why I dwell in green mountain shades)', '笑而不答心自闲 (I smile and do not answer; my heart is at peace)'],
          ['桃花流水窅然去 (Peach blossoms on the water drift far away)', '别有天地非人间 (Here is another world, beyond the realm of men)'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'DRUNKEN_SHADOW',
        name: 'Drunken Shadow',
        tag: 'DEBUFF',
        poemTitle: 'Drinking Alone Under the Moon',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'I dance and my shadow tumbles,',
          'I sing and the moon wanders.',
        ],
        progressiveStanzas: [
          ['我歌月徘徊 (I sing and the moon wanders round and round)', '我舞影零乱 (I dance and my shadow tumbles scattered in the night)'],
          ['醒时同交欢 (While sober, we share delight together)', '醉后各分散 (When drunk, each parts on their own lonely road)'],
          ['永结无情游 (Bound forever in a friendship free of care)', '相期邈云汉 (We pledge to meet beyond the distant Milky Way)'],
          ['长风破浪会有时 (A time will come to ride the wind and break the waves)', '直挂云帆济沧海 (To hoist cloud sails across the deep blue sea!)'],
        ],
        affinity: 'AUTUMN',
      },
    ],
  },

  // 11. Sor Juana Ines de la Cruz (Autumn) - 140 HP
  {
    id: 'SOR_JUANA',
    name: 'Sor Juana Inés de la Cruz',
    title: 'The Tenth Muse of Mexico',
    lifespan: '1648–1695',
    birthplace: 'San Jerónimo Nepantla, New Spain',
    movement: 'Baroque Intellectual',
    season: 'AUTUMN',
    affinity: 'AUTUMN',
    tier: 3,
    chapter: 3,
    chapterName: 'Chapter III: Autumn',
    locationDescription: 'Athenaeum Archive Alcove on West Side X:23, Y:17',
    worldCoords: { x: 23, y: 17 },
    fightingStyle: 'Baroque Dialectic & Intellectual Sublimity',
    tacticalAdvice: 'Applies Lost for words with Primero Sueño and lowers foe damage with Foolish Men.',
    defaultArenaId: 'GOLDEN_RISING_SUN_SANCTUARY',
    bio: 'Baroque nun whose formidable intellect, philosophical sonnets, and defense of women’s right to study astonished New Spain.',
    quote: '“Foolish men who accuse / women without reason...”',
    dialogue: {
      intro: 'Who has forbidden women to engage in private studies?',
      preFight: 'Foolish men, who accuse women without reason.',
      midFight: 'Your syllogisms are sharp, Reader—let us test your counter-meter!',
      escaped: 'The cloister gates close; my thoughts remain free.',
      captured: 'Understanding is the highest crown. I will lend my quills to your anthology.',
      lose: 'Understanding is the highest crown. I will lend my quills to your anthology.',
    },
    preBattleDialogue: [
      '“Foolish men who accuse women without reason, behold your defeat!”',
      '“Pyramidal shadow climbs toward the stars; my intellect awakens.”',
    ],
    sourceNote: 'Alludes to “Hombres Necios” and “Primero Sueño”.',
    hp: BATTLE_CONFIG.healthByRegion.AUTUMN,
    atk: 53,
    def: 55,
    spd: 52,
    spriteAssetKey: 'poet_sor_juana',
    primaryColor: '#c026d3',
    secondaryColor: '#e879f9',
    accentColor: '#fbbf24',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#c2410c',
      skinHighlight: '#ffedd5',
      hair: '#18181b',
      hairHighlight: '#27272a',
      hairShadow: '#09090b',
      clothing: '#f8fafc',
      clothingHighlight: '#ffffff',
      clothingShadow: '#cbd5e1',
      accent: '#c026d3',
      hat: '#09090b',
    },
    moves: [
      {
        id: 'PRIMERO_SUENO',
        name: 'Primero Sueño',
        tag: 'HEAVY',
        poemTitle: 'Primero Sueño',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Piramidal, funesta, de la tierra',
          'nacida sombra, al Cielo encaminaba.',
        ],
        progressiveStanzas: [
          ['Piramidal, funesta, de la tierra', 'nacida sombra, al Cielo encaminaba.'],
          ['El orbe celestial en vano mira', 'los rayos oscuros de la noche pura.'],
          ['Hacia el Olimpo la razón se eleva', 'rompiendo nieblas con serena lumbre.'],
          ['Vencida la tiniebla por el alma,', 'triunfa la luz del entendimiento eterno.'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'RATIONAL_SOUL',
        name: 'Rational Soul',
        tag: 'LIGHT',
        poemTitle: 'Respuesta a Sor Filotea',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'Have they not a rational soul as men do?',
          'My mind ascends through truth.',
        ],
        progressiveStanzas: [
          ['Have they not a rational soul as men do?', 'My mind ascends through truth.'],
          ['Who has forbidden women to study?', 'The light of wisdom belongs to all who seek.'],
          ['I study so that I may be less ignorant,', 'not so that I may know more than others.'],
          ['The soul knows neither male nor female', 'in the divine realm of truth.'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'FOOLISH_MEN',
        name: 'Foolish Men',
        tag: 'DEBUFF',
        poemTitle: 'Hombres Necios',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'Hombres necios que acusáis a la mujer sin razón,',
          'sin ver que sois la ocasión de lo mismo que culpáis.',
        ],
        progressiveStanzas: [
          ['Hombres necios que acusáis a la mujer sin razón,', 'sin ver que sois la ocasión de lo mismo que culpáis.'],
          ['Si con ansia sin igual solicitáis su desdén,', '¿por qué queréis que obren bien si las incitáis al mal?'],
          ['Combatís su resistencia y luego, con gravedad,', 'decís que fue liviandad lo que hizo la diligencia.'],
          ['¿O cuál es más de culpar, aunque cualquiera mal haga:', 'la que peca por la paga o el que paga por pecar?'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'PAINTED_DECEIT',
        name: 'Painted Deceit',
        tag: 'BUFF',
        poemTitle: 'A su Retrato',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'Este que ves, engaño colorido,',
          'es cauteloso engaño del sentido.',
        ],
        progressiveStanzas: [
          ['Este que ves, engaño colorido,', 'que del arte ostentando los primores.'],
          ['Con falsos silogismos de colores', 'es cauteloso engaño del sentido.'],
          ['Es un vano artificio del cuidado,', 'una flor al viento delicada.'],
          ['Es un afán caduco y, bien mirado,', 'es cadáver, es polvo, es sombra, es nada.'],
        ],
        affinity: 'AUTUMN',
      },
    ],
  },

  // 12. Charles Bukowski (Autumn) - 140 HP
  {
    id: 'BUKOWSKI',
    name: 'Charles Bukowski',
    title: 'The Hard-Bitten Realist',
    lifespan: '1920–1994',
    birthplace: 'Andernach, Germany / Los Angeles, CA',
    movement: 'Dirty Realism',
    season: 'AUTUMN',
    affinity: 'AUTUMN',
    tier: 3,
    chapter: 3,
    chapterName: 'Chapter III: Autumn',
    locationDescription: 'Inside Nightingale & Quill Taproom X:12, Y:5',
    worldCoords: { x: 30, y: 30 },
    fightingStyle: 'Taproom Tenacity & Bluebird Defiance',
    tacticalAdvice: 'Heals with Bluebird Guard and smashes with Roll The Dice.',
    defaultArenaId: 'MID_CENTURY_RAIN_STUDY',
    bio: 'Underground poet of the Skid Row typewriter, dive bars, and horse tracks whose stripped-down lines captured survival and grit.',
    quote: '“there’s a bluebird in my heart that wants to get out but I’m too tough for him.”',
    dialogue: {
      intro: 'There’s a bluebird in my heart that wants to get out.',
      preFight: 'What matters most is how well you walk through the fire.',
      midFight: 'We have our pact, and it’s good enough to make a man weep.',
      escaped: 'I’m heading out the back door into the rain.',
      captured: 'The free soul is rare, but you know it when you see it.',
      lose: 'The typewriter clatters to a halt. Goodnight.',
    },
    preBattleDialogue: [
      '“Don’t try. But if you’re going to try, go all the way.”',
      '“We have our pact, and it’s good enough to make a man weep.”',
    ],
    sourceNote: 'Alludes to “Bluebird” and “Roll the Dice”.',
    hp: BATTLE_CONFIG.healthByRegion.AUTUMN,
    atk: 58,
    def: 56,
    spd: 45,
    spriteAssetKey: 'poet_charles_bukowski',
    primaryColor: '#78350f',
    secondaryColor: '#b45309',
    accentColor: '#38bdf8',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#b45309',
      skinHighlight: '#ffedd5',
      hair: '#44403c',
      hairHighlight: '#78716c',
      hairShadow: '#292524',
      clothing: '#292524',
      clothingHighlight: '#44403c',
      clothingShadow: '#1c1917',
      accent: '#38bdf8',
    },
    moves: [
      {
        id: 'BLUEBIRD_GUARD',
        name: 'Bluebird Guard',
        tag: 'HEAL',
        poemTitle: 'Bluebird',
        effectType: 'HEAL',
        healAmount: BATTLE_CONFIG.healAmount,
        maxReadings: BATTLE_CONFIG.healReadings,
        powerLabel: '+30% HP',
        descriptionShort: 'HEAL: Restores 30% Max HP (2 readings).',
        stanzas: [
          'there’s a bluebird in my heart that wants to get out',
          'but I’m too tough for him, I say, stay in there.',
        ],
        progressiveStanzas: [
          ['there’s a bluebird in my heart that wants to get out', 'but I’m too tough for him, I say, stay in there, I’m not going to let anybody see you.'],
          ['there’s a bluebird in my heart that wants to get out', 'but I pour whiskey on him and inhale cigarette smoke and the whores and the bartenders never know.'],
          ['there’s a bluebird in my heart that wants to get out', 'but I’m too tough for him, I say, stay down, do you want to mess me up?'],
          ['I only let him out at night sometimes when everybody’s asleep.', 'I say, I know that you’re there, so don’t be sad. Then we sleep together with our secret pact.'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'ROLL_THE_DICE',
        name: 'Roll The Dice',
        tag: 'HEAVY',
        poemTitle: 'Roll the Dice',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'if you’re going to try, go all the way.',
          'there is no other feeling like that.',
        ],
        progressiveStanzas: [
          ['if you’re going to try, go all the way.', 'otherwise, don’t even start.'],
          ['if you’re going to try, go all the way.', 'this could mean losing girlfriends, wives, relatives, jobs and maybe your mind.'],
          ['it could mean freezing on a park bench, it could mean jail, it could mean derision, mockery, isolation.', 'isolation is the gift, all the others are a test of your endurance.'],
          ['you will ride life straight to perfect laughter,', 'it’s the only good fight there is.'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'BEER_TAP_SLAM',
        name: 'Beer Tap Slam',
        tag: 'LIGHT',
        poemTitle: 'The Laughing Heart',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'the glass clatters down upon the scarred counter.',
          'another line echoes in the smoke.',
        ],
        progressiveStanzas: [
          ['the glass clatters down upon the scarred counter.', 'another line echoes in the smoke of the room.'],
          ['you have to die a few times before you can really live.', 'the keys hit the ribbon with the sound of machine guns.'],
          ['some people never go crazy. what truly horrible lives they must lead.', 'the night rolls onward toward morning.'],
          ['be on the watch. there are ways out.', 'there is light somewhere.'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'LAUGHING_HEART',
        name: 'Laughing Heart',
        tag: 'BUFF',
        poemTitle: 'The Laughing Heart',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'your life is your life.',
          'don’t let it be clubbed into dank submission.',
          'the gods wait to delight in you.',
        ],
        progressiveStanzas: [
          ['your life is your life. don’t let it be clubbed into dank submission.', 'be on the watch. there are ways out.'],
          ['it may not be much light but it beats the darkness.', 'the gods wait to delight in you.'],
          ['know your power while you have it.', 'the days run away like wild horses over the hills.'],
          ['you can’t beat death but you can beat death in life, sometimes.', 'and the more often you learn to do it, the more light there will be.'],
        ],
        affinity: 'AUTUMN',
      },
    ],
  },

  // 12b. Charles Baudelaire (Autumn) - 140 HP
  {
    id: 'baudelaire',
    name: 'Charles Baudelaire',
    title: 'The Poet of Spleen and Ideal',
    lifespan: '1821–1867',
    birthplace: 'Paris, France',
    movement: 'Symbolism / Modernity',
    season: 'AUTUMN',
    affinity: 'AUTUMN',
    tier: 3,
    chapter: 3,
    chapterName: 'Chapter III: Autumn',
    locationDescription: 'The Rented Room in The Town X:3, Y:3',
    worldCoords: { x: 3, y: 3 },
    fightingStyle: 'Spleen & Ideal Melancholy',
    tacticalAdvice: 'Debuffs outgoing damage with Spleen et Idéal and strikes with Fleurs du Mal.',
    defaultArenaId: 'MID_CENTURY_RAIN_STUDY',
    bio: 'Pioneering French poet whose masterwork Les Fleurs du mal revolutionized modern lyricism, uncovering dark beauty and the eternal tension of spleen and ideal.',
    quote: '“Hypocrite lecteur, — mon semblable, — mon frère!”',
    dialogue: {
      intro: 'Let us descend into the spleen and the ideal.',
      preFight: 'Let us descend into the spleen and the ideal.',
      midFight: "The albatross's giant wings prevent him from walking...",
      escaped: 'Very well. The city has grown tedious anyway.',
      captured: 'You have extracted beauty from the dark. I am with you.',
      lose: 'You have extracted beauty from the dark. I am with you.',
    },
    preBattleDialogue: [
      '“Let us descend into the spleen and the ideal.”',
      '“The albatross\'s giant wings prevent him from walking...”',
    ],
    sourceNote: 'Alludes to Les Fleurs du mal and Le Spleen de Paris.',
    hp: 140,
    atk: 55,
    def: 48,
    spd: 52,
    spriteAssetKey: 'poet_charles_baudelaire',
    primaryColor: '#581c87',
    secondaryColor: '#7e22ce',
    accentColor: '#eab308',
    portraitPalette: {
      skin: '#fef3c7',
      skinShadow: '#c2410c',
      skinHighlight: '#ffffff',
      hair: '#18181b',
      hairHighlight: '#27272a',
      hairShadow: '#09090b',
      clothing: '#18181b',
      clothingHighlight: '#27272a',
      clothingShadow: '#09090b',
      accent: '#7e22ce',
    },
    moves: [
      {
        id: 'FLEURS_DU_MAL',
        name: 'Fleurs du Mal',
        tag: 'HEAVY',
        poemTitle: 'Les Fleurs du Mal',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'To extract beauty from evil...',
          'A strange blossom sprung from darkness.',
          'There where everything is order and beauty, luxury, calm, and voluptuousness.',
        ],
        progressiveStanzas: [
          ['To extract beauty from evil and sorrow,', 'a strange blossom sprung from subterranean darkness.'],
          ['The sun gives the fields a deeper gold,', 'the rivers are dressed in silk and twilight.'],
          ['There where everything is order and beauty,', 'luxury, calm, and voluptuousness.'],
          ['O Death, old captain, it is time! Let us weigh anchor!', 'This country bores us, O Death! Let us set sail into the Unknown!'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'SPLEEN_ET_IDEAL',
        name: 'Spleen et Idéal',
        tag: 'DEBUFF',
        poemTitle: 'Spleen et Idéal',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'When the low, heavy sky weighs like a lid...',
          'And from the all-encircling horizon',
          'Spleen pours its sullen shadow over the world.',
        ],
        progressiveStanzas: [
          ['When the low, heavy sky weighs like a lid', 'on the groaning spirit, victim of long ennuis.'],
          ['And from the all-encircling horizon', 'it pours over us a day more gloomy than nights.'],
          ['When the earth is changed into a humid dungeon,', 'where Hope, like a bat, beats the walls with her timid wings.'],
          ['And long hearses, without drums or music,', 'defile slowly in my soul; Hope vanquished weeps.'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'ALBATROSS_WING',
        name: 'Albatross Wing',
        tag: 'LIGHT',
        poemTitle: "L'Albatros",
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'The Poet resembles the prince of clouds',
          'Who haunts the storm and laughs at the archer;',
          'Exiled on the ground amidst jeers,',
          'His giant wings prevent him from walking.',
        ],
        progressiveStanzas: [
          ['Often, to amuse themselves, the men of the crew', 'catch albatrosses, vast birds of the seas.'],
          ['Scarcely have they placed them on the planks', 'than these kings of the azure, clumsy and shameful, let their great white wings drag.'],
          ['The Poet resembles the prince of clouds', 'who haunts the storm and laughs at the archer.'],
          ['Exiled on the ground amidst the jeers,', 'his giant wings prevent him from walking.'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'PARISIAN_NOCTURNE',
        name: 'Parisian Nocturne',
        tag: 'STATUS',
        poemTitle: 'Tableaux Parisiens',
        effectType: 'STATUS',
        maxReadings: BATTLE_CONFIG.statusReadings,
        powerLabel: 'STATUS',
        descriptionShort: 'STATUS: Lost for words — target skips turn (2 readings).',
        stanzas: [
          'Fourmillante cité, cité pleine de rêves...',
          'Where specters in broad daylight clutch at passing travelers.',
        ],
        progressiveStanzas: [
          ['Fourmillante cité, cité pleine de rêves,', 'où le spectre en plein jour raccroche le passant!'],
          ['Mystères partout coulent comme des sèves', 'dans les canaux étroits du colosse puissant.'],
          ['Hypocrite lecteur, — mon semblable, — mon frère!', 'You know this delicate monster, Ennui.'],
          ['Under the cold streetlamp, poetry flares', 'like an emerald gleaming in the Parisian mist.'],
        ],
        affinity: 'AUTUMN',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER IV: WINTER (160 HP)
  // 13. Robert Frost, 14. Emily Dickinson, 15. Edgar Allan Poe, 16. Sylvia Plath
  // ==========================================================================

  // 13. Robert Frost (Winter) - 160 HP
  {
    id: 'FROST',
    name: 'Robert Frost',
    title: 'The New England Realist',
    lifespan: '1874–1963',
    birthplace: 'San Francisco, California',
    movement: 'Pastoral / Realist',
    season: 'WINTER',
    affinity: 'WINTER',
    tier: 4,
    chapter: 4,
    chapterName: 'Chapter IV: Winter',
    locationDescription: 'Birch Woods in the Snow X:48, Y:43',
    worldCoords: { x: 48, y: 43 },
    fightingStyle: 'Pastoral Fortitude & Glacial Stride',
    tacticalAdvice: 'Applies Lost for words with Stopping By Woods and boosts damage with Mending Wall.',
    defaultArenaId: 'SNOWY_WOODS_AT_DUSK',
    bio: 'Four-time Pulitzer winner celebrated for realistic depictions of rural New England and philosophical nature verse.',
    quote: '“Two roads diverged in a wood, and I— / I took the one less traveled by.”',
    dialogue: {
      intro: 'Two roads diverged in a yellow wood.',
      preFight: 'The woods are lovely, dark and deep.',
      midFight: "The woods are lovely, dark and deep, and this match isn't over yet.",
      escaped: 'I have promises to keep, and miles to go before I sleep.',
      captured: 'You took the less-traveled line, and that has made all the difference.',
      lose: 'You took the less-traveled line, and that has made all the difference.',
    },
    preBattleDialogue: [
      '“The woods are lovely, dark and deep.”',
      '“From what I’ve tasted of desire, I hold with those who favor fire.”',
    ],
    sourceNote: 'Alludes to “The Road Not Taken” and “Stopping by Woods”.',
    hp: BATTLE_CONFIG.healthByRegion.WINTER,
    atk: 50,
    def: 59,
    spd: 46,
    spriteAssetKey: 'poet_robert_frost',
    primaryColor: '#16a34a',
    secondaryColor: '#4ade80',
    accentColor: '#3b82f6',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#b45309',
      skinHighlight: '#ffedd5',
      hair: '#e2e8f0',
      hairHighlight: '#ffffff',
      hairShadow: '#94a3b8',
      clothing: '#14532d',
      clothingHighlight: '#166534',
      clothingShadow: '#052e16',
      accent: '#78350f',
    },
    moves: [
      {
        id: 'ROAD_NOT_TAKEN',
        name: 'Road Not Taken',
        tag: 'LIGHT',
        poemTitle: 'The Road Not Taken',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'Two roads diverged in a yellow wood,',
          'And I took the one less traveled by.',
        ],
        progressiveStanzas: [
          ['Two roads diverged in a yellow wood,', 'And sorry I could not travel both and be one traveler, long I stood.'],
          ['Then took the other, as just as fair,', 'And having perhaps the better claim, because it was grassy and wanted wear.'],
          ['And both that morning equally lay', 'In leaves no step had trodden black. Oh, I kept the first for another day!'],
          ['Two roads diverged in a wood, and I—', 'I took the one less traveled by, and that has made all the difference.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'STOPPING_BY_WOODS',
        name: 'Stopping By Woods',
        tag: 'DEBUFF',
        poemTitle: 'Stopping by Woods on a Snowy Evening',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'The woods are lovely, dark and deep,',
          'And miles to go before I sleep.',
        ],
        progressiveStanzas: [
          ['Whose woods these are I think I know.', 'His house is in the village though; he will not see me stopping here.'],
          ['My little horse must think it queer', 'To stop without a farmhouse near between the woods and frozen lake.'],
          ['He gives his harness bells a shake', 'To ask if there is some mistake. The only other sound’s the sweep of easy wind.'],
          ['The woods are lovely, dark and deep,', 'But I have promises to keep, and miles to go before I sleep.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'FIRE_AND_ICE',
        name: 'Fire and Ice',
        tag: 'HEAVY',
        poemTitle: 'Fire and Ice',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Some say the world will end in fire,',
          'Some say in ice.',
        ],
        progressiveStanzas: [
          ['Some say the world will end in fire,', 'Some say in ice.'],
          ['From what I’ve tasted of desire', 'I hold with those who favor fire.'],
          ['But if it had to perish twice,', 'I think I know enough of hate to say that for destruction ice is also great.'],
          ['And would suffice.', 'The cold frost seals the silent peak.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'MENDING_WALL',
        name: 'Mending Wall',
        tag: 'BUFF',
        poemTitle: 'Mending Wall',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'Good fences make good neighbors.',
          'Something there is that doesn’t love a wall.',
        ],
        progressiveStanzas: [
          ['Something there is that doesn’t love a wall,', 'That sends the frozen-ground-swell under it.'],
          ['We keep the wall between us as we go.', 'To each the boulders that have fallen to each.'],
          ['Before I built a wall I’d ask to know', 'What I was walling in or walling out.'],
          ['He will not go behind his father’s saying,', 'And he says again: “Good fences make good neighbors.”'],
        ],
        affinity: 'WINTER',
      },
    ],
  },

  // 14. Emily Dickinson (Winter) - 160 HP
  {
    id: 'DICKINSON',
    name: 'Emily Dickinson',
    title: 'The Belle of Amherst',
    lifespan: '1830–1886',
    birthplace: 'Amherst, Massachusetts',
    movement: 'Lyrical Solitude / Transcendental',
    season: 'WINTER',
    affinity: 'WINTER',
    tier: 4,
    chapter: 4,
    chapterName: 'Chapter IV: Winter',
    locationDescription: 'Dickinson’s Walled Garden X:13, Y:18',
    worldCoords: { x: 13, y: 18 },
    fightingStyle: 'Slant Verse & Defensive Sanctuary',
    tacticalAdvice: 'Recovers HP with Hope Feathers and strikes with Slant Strike before casting Death Carriage.',
    defaultArenaId: 'AMHERST_SUNLIT_SOLARIUM',
    bio: 'One of America’s most profound poets, whose dashed rhythms and slant rhymes contemplated death, eternity, and hope.',
    quote: '“Hope is the thing with feathers that perches in the soul.”',
    dialogue: {
      intro: 'You can stay there. Emily. No closer.',
      preFight: "I'm Nobody! Who are you?",
      midFight: "The Soul selects her own Society—and right now she's testing yours!",
      escaped: 'Tell all the truth but tell it slant.',
      captured: 'You told the truth, and you told it slant. Tie my fascicles in your pack.',
      lose: 'You told the truth, and you told it slant. Tie my fascicles in your pack.',
    },
    preBattleDialogue: [
      '“I’m Nobody! Who are you?”',
      '“Because I could not stop for Death, he kindly stopped for me.”',
    ],
    sourceNote: 'Alludes to poems 314, 260, and 479.',
    hp: BATTLE_CONFIG.healthByRegion.WINTER,
    atk: 50,
    def: 58,
    spd: 52,
    spriteAssetKey: 'poet_emily_dickinson',
    primaryColor: '#0284c7',
    secondaryColor: '#38bdf8',
    accentColor: '#f59e0b',
    portraitPalette: {
      skin: '#fde68a',
      skinShadow: '#d97706',
      skinHighlight: '#fef3c7',
      hair: '#291a10',
      hairHighlight: '#5c3d2e',
      hairShadow: '#150d08',
      clothing: '#1e293b',
      clothingHighlight: '#334155',
      clothingShadow: '#0f172a',
      accent: '#f8fafc',
    },
    moves: [
      {
        id: 'SLANT_STRIKE',
        name: 'Slant Strike',
        tag: 'HEAVY',
        poemTitle: 'Tell all the truth but tell it slant',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Tell all the truth but tell it slant —',
          'Success in Circuit lies.',
        ],
        progressiveStanzas: [
          ['Tell all the truth but tell it slant —', 'Success in Circuit lies.'],
          ['Too bright for our infirm Delight', 'The Truth’s superb surprise.'],
          ['As Lightning to the Children eased', 'With explanation kind,'],
          ['The Truth must dazzle gradually', 'Or every man be blind —'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'IM_NOBODY',
        name: "I'm Nobody",
        tag: 'LIGHT',
        poemTitle: 'I’m Nobody! Who are you?',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'I’m Nobody! Who are you?',
          'Are you – Nobody – too?',
        ],
        progressiveStanzas: [
          ['I’m Nobody! Who are you?', 'Are you – Nobody – too?'],
          ['Then there’s a pair of us!', 'Don’t tell! they’d advertise — you know!'],
          ['How dreary — to be — Somebody!', 'How public — like a Frog —'],
          ['To tell one’s name — the livelong June —', 'To an admiring Bog!'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'HOPE_FEATHERS',
        name: 'Hope Feathers',
        tag: 'HEAL',
        poemTitle: 'Hope is the thing with feathers',
        effectType: 'HEAL',
        healAmount: BATTLE_CONFIG.healAmount,
        maxReadings: BATTLE_CONFIG.healReadings,
        powerLabel: '+30% HP',
        descriptionShort: 'HEAL: Restores 30% Max HP (2 readings).',
        stanzas: [
          '“Hope” is the thing with feathers -',
          'That perches in the soul -',
          'And sings the tune without the words.',
        ],
        progressiveStanzas: [
          ['“Hope” is the thing with feathers —', 'That perches in the soul — and sings the tune without the words.'],
          ['And sweetest — in the Gale — is heard —', 'And sore must be the storm that could abash the little Bird.'],
          ['I’ve heard it in the chillest land —', 'And on the strangest Sea — yet never, in Extremity,'],
          ['It asked a crumb —', 'of Me.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'DEATH_CARRIAGE',
        name: 'Death Carriage',
        tag: 'STATUS',
        poemTitle: 'Because I could not stop for Death',
        effectType: 'STATUS',
        maxReadings: BATTLE_CONFIG.statusReadings,
        powerLabel: 'STATUS',
        descriptionShort: 'STATUS: Lost for words — target skips turn (2 readings).',
        stanzas: [
          'The Carriage held but just Ourselves –',
          'And Immortality.',
        ],
        progressiveStanzas: [
          ['Because I could not stop for Death —', 'He kindly stopped for me — The Carriage held but just Ourselves — and Immortality.'],
          ['We slowly drove — He knew no haste', 'And I had put away my labor and my leisure too, for His Civility —'],
          ['We passed the School, where Children strove', 'At Recess — in the Ring — We passed the Fields of Gazing Grain — We passed the Setting Sun —'],
          ['Since then — ’tis Centuries — and yet', 'Feels shorter than the Day I first surmised the Horses’ Heads were toward Eternity —'],
        ],
        affinity: 'WINTER',
      },
    ],
  },

  // 15. Edgar Allan Poe (Winter) - 160 HP
  {
    id: 'POE',
    name: 'Edgar Allan Poe',
    title: 'Master of the Macabre',
    lifespan: '1809–1849',
    birthplace: 'Boston, Massachusetts',
    movement: 'Gothic / Macabre',
    season: 'WINTER',
    affinity: 'WINTER',
    tier: 4,
    chapter: 4,
    chapterName: 'Chapter IV: Winter',
    locationDescription: 'The Crypt / Mausoleum X:13, Y:44',
    worldCoords: { x: 13, y: 44 },
    fightingStyle: 'Gothic Melancholy & Disruptive Curses',
    tacticalAdvice: 'Applies Lost for words with The Bells and debuffs with Annabel Sea before striking with Raven’s Shadow.',
    defaultArenaId: 'GOTHIC_RAVEN_STUDY',
    bio: 'Pioneer of American Gothic verse whose rhythmic musical terror and melancholic themes transformed dark literature.',
    quote: '“Deep into that darkness peering, long I stood there wondering, fearing.”',
    dialogue: {
      intro: 'Good evening. Poe. Quietly, please.',
      preFight: 'Once upon a midnight dreary.',
      midFight: 'Louder—louder! Is that the beating of the meter beneath the floorboards?!',
      escaped: 'Deep into that darkness peering, long I stood there wondering, fearing.',
      captured: 'Nevermore shall I doubt your craft. The raven and I are at your service.',
      lose: 'Nevermore shall I doubt your craft. The raven and I are at your service.',
    },
    preBattleDialogue: [
      '“Once upon a midnight dreary.”',
      '“Prophet! said I, thing of evil! prophet still, if bird or devil!”',
    ],
    sourceNote: 'Alludes to “The Raven” and “The Bells”.',
    hp: BATTLE_CONFIG.healthByRegion.WINTER,
    atk: 57,
    def: 48,
    spd: 52,
    spriteAssetKey: 'poet_edgar_allan_poe',
    primaryColor: '#701a75',
    secondaryColor: '#c084fc',
    accentColor: '#e11d48',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#c2410c',
      skinHighlight: '#fef3c7',
      hair: '#18181b',
      hairHighlight: '#3f3f46',
      hairShadow: '#09090b',
      clothing: '#09090b',
      clothingHighlight: '#27272a',
      clothingShadow: '#000000',
      accent: '#6b21a8',
    },
    moves: [
      {
        id: 'RAVENS_SHADOW',
        name: 'Raven’s Shadow',
        tag: 'HEAVY',
        poemTitle: 'The Raven',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Quoth the Raven: “Nevermore!”',
          'And my soul from out that shadow shall be lifted nevermore.',
        ],
        progressiveStanzas: [
          ['Once upon a midnight dreary, while I pondered, weak and weary,', 'Over many a quaint and curious volume of forgotten lore—'],
          ['Open here I flung the shutter, when, with many a flirt and flutter,', 'In there stepped a stately Raven of the saintly days of yore.'],
          ['Then this ebony bird beguiling my sad fancy into smiling,', 'Quoth the Raven: “Nevermore.”'],
          ['And my soul from out that shadow that lies floating on the floor', 'Shall be lifted — nevermore!'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'THE_BELLS',
        name: 'The Bells',
        tag: 'DEBUFF',
        poemTitle: 'The Bells',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'Hear the sledges with the bells—',
          'Silver bells!',
          'What a world of merriment their melody foretells!',
        ],
        progressiveStanzas: [
          ['Hear the sledges with the bells — silver bells!', 'What a world of merriment their melody foretells!'],
          ['Hear the mellow wedding bells — golden bells!', 'What a world of happiness their harmony foretells!'],
          ['Hear the loud alarum bells — brazen bells!', 'What a tale of terror, now, their turbulency tells!'],
          ['Hear the tolling of the bells — iron bells!', 'Keeping time, time, time, in a sort of Runic rhyme!'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'ANNABEL_SEA',
        name: 'Annabel Sea',
        tag: 'STATUS',
        poemTitle: 'Annabel Lee',
        effectType: 'STATUS',
        maxReadings: BATTLE_CONFIG.statusReadings,
        powerLabel: 'STATUS',
        descriptionShort: 'STATUS: Lost for words — target skips turn (2 readings).',
        stanzas: [
          'In a kingdom by the sea,',
          'And the stars never rise, but I feel the bright eyes.',
        ],
        progressiveStanzas: [
          ['It was many and many a year ago, in a kingdom by the sea,', 'That a maiden there lived whom you may know by the name of Annabel Lee.'],
          ['I was a child and she was a child, in this kingdom by the sea,', 'But we loved with a love that was more than love — I and my Annabel Lee.'],
          ['The angels, not half so happy in Heaven, went envying her and me—', 'Yes! that was the reason that the wind came out of the cloud by night.'],
          ['And so, all the night-tide, I lie down by the side', 'Of my darling — my darling — my life and my bride, in her tomb by the sounding sea.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'DREAM_WITHIN',
        name: 'Dream Within',
        tag: 'LIGHT',
        poemTitle: 'A Dream Within a Dream',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'All that we see or seem',
          'Is but a dream within a dream.',
        ],
        progressiveStanzas: [
          ['Take this kiss upon the brow! And, in parting from you now,', 'Thus much let me avow: you are not wrong, who deem that my days have been a dream.'],
          ['I stand amid the roar of a surf-tormented shore,', 'And I hold within my hand grains of the golden sand —'],
          ['How few! yet how they creep through my fingers to the deep,', 'While I weep — while I weep! O God! can I not grasp them with a tighter clasp?'],
          ['Is all that we see or seem', 'But a dream within a dream?'],
        ],
        affinity: 'WINTER',
      },
    ],
  },

  // 16. Sylvia Plath (Winter) - 160 HP
  {
    id: 'PLATH',
    name: 'Sylvia Plath',
    title: 'The Fierce Confessional',
    lifespan: '1932–1963',
    birthplace: 'Boston, Massachusetts',
    movement: 'Confessional',
    season: 'WINTER',
    affinity: 'WINTER',
    tier: 4,
    chapter: 4,
    chapterName: 'Chapter IV: Winter',
    locationDescription: 'Plath’s Kitchen Garden X:27, Y:40',
    worldCoords: { x: 27, y: 40 },
    fightingStyle: 'High-Impact Confessional & Phoenix Rebirth',
    tacticalAdvice: 'Strikes fiercely with Red Hair Rising and debuffs enemy with Black Shoe.',
    defaultArenaId: 'MID_CENTURY_RAIN_STUDY',
    bio: 'Electrifying 20th-century poet whose intense verse channeled psychological fury, personal myth, and rebirth.',
    quote: '“Out of the ash / I rise with my red hair / And I eat men like air.”',
    dialogue: {
      intro: "Oh. Hi. Sylvia. I've been up since four, don't mind the cups.",
      preFight: 'The tulips are too excitable, it is winter here.',
      midFight: 'The air is crisp as a bell at four in the morning—let’s see what you’ve got left!',
      escaped: 'Out of the ash I rise with my red hair.',
      captured: 'Pure, silver, and exact. Leave the teacups, I’m coming with you.',
      lose: 'Pure, silver, and exact. Leave the teacups, I’m coming with you.',
    },
    preBattleDialogue: [
      '“The tulips are too excitable, it is winter here.”',
      '“You do not do, you do not do any more, black shoe.”',
    ],
    sourceNote: 'Alludes to “Lady Lazarus” and “Daddy”.',
    hp: BATTLE_CONFIG.healthByRegion.WINTER,
    atk: 60,
    def: 45,
    spd: 55,
    spriteAssetKey: 'poet_sylvia_plath',
    primaryColor: '#dc2626',
    secondaryColor: '#f87171',
    accentColor: '#f43f5e',
    portraitPalette: {
      skin: '#fff1f2',
      skinShadow: '#fda4af',
      skinHighlight: '#ffffff',
      hair: '#9f1239',
      hairHighlight: '#be123c',
      hairShadow: '#4c0519',
      clothing: '#881337',
      clothingHighlight: '#9f1239',
      clothingShadow: '#4c0519',
      accent: '#ef4444',
    },
    moves: [
      {
        id: 'RED_HAIR_RISING',
        name: 'Red Hair Rising',
        tag: 'HEAVY',
        poemTitle: 'Lady Lazarus',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Out of the ash I rise with my red hair',
          'And I eat men like air.',
        ],
        progressiveStanzas: [
          ['I have done it again.', 'One year in every ten I manage it — a sort of walking miracle.'],
          ['Dying is an art, like everything else.', 'I do it exceptionally well. I do it so it feels like hell.'],
          ['Herr God, Herr Lucifer,', 'Beware. Beware.'],
          ['Out of the ash I rise with my red hair', 'And I eat men like air.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'ARIEL_ARROW',
        name: 'Ariel Arrow',
        tag: 'LIGHT',
        poemTitle: 'Ariel',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'Something else',
          'Hauls me through air —',
          'Thighs, hair; Flakes from my heels.',
        ],
        progressiveStanzas: [
          ['Stasis in darkness.', 'Then the substanceless blue pour of tor and distances.'],
          ['God’s lioness, how one we grow,', 'pivot of heels and knees! — The furrow splits and passes.'],
          ['Something else hauls me through air —', 'thighs, hair; flakes from my heels.'],
          ['And I am the arrow, the dew that flies', 'suicidal, at one with the drive into the red eye, the cauldron of morning.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'BLACK_SHOE',
        name: 'Black Shoe',
        tag: 'BUFF',
        poemTitle: 'Daddy',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'You do not do, you do not do',
          'Any more, black shoe.',
        ],
        progressiveStanzas: [
          ['You do not do, you do not do', 'any more, black shoe in which I have lived like a foot.'],
          ['For thirty years, poor and white,', 'barely daring to breathe or Achoo.'],
          ['I have always been scared of you,', 'with your Luftwaffe, your gobbledygoo.'],
          ['There’s a stake in your fat black heart', 'and the villagers never liked you. Daddy, daddy, you bastard, I’m through.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'MIRROR_REFLECTION',
        name: 'Mirror Reflection',
        tag: 'DEBUFF',
        poemTitle: 'Mirror',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'I am silver and exact. I have no preconceptions.',
          'Whatever I see I swallow immediately.',
        ],
        progressiveStanzas: [
          ['I am silver and exact. I have no preconceptions.', 'Whatever I see I swallow immediately.'],
          ['Just as it is, unmisted by love or dislike.', 'I am not cruel, only truthful — the eye of a little god.'],
          ['Now I am a lake. A woman bends over me,', 'searching my reaches for what she really is.'],
          ['In me she has drowned a young girl, and in me an old woman', 'rises toward her day after day, like a terrible fish.'],
        ],
        affinity: 'WINTER',
      },
    ],
  },

  // Henry David Thoreau (Winter) - 160 HP (The Hermitage Duelist)
  {
    id: 'THOREAU',
    name: 'Henry David Thoreau',
    title: 'The Walden Naturalist',
    lifespan: '1817–1862',
    birthplace: 'Concord, Massachusetts',
    movement: 'Transcendental / Solitude',
    season: 'WINTER',
    affinity: 'WINTER',
    tier: 4,
    chapter: 4,
    chapterName: 'Chapter IV: Winter',
    locationDescription: 'The Hermitage in the Treeline X:6, Y:8',
    worldCoords: { x: 6, y: 8 },
    fightingStyle: 'Deliberate Living & Unyielding Simplicity',
    tacticalAdvice: 'The Hermitage duelist. Strikes with Walden Solitude and debuffs with Simplify.',
    defaultArenaId: 'SNOWY_WOODS_AT_DUSK',
    bio: 'Author of Walden and Civil Disobedience who retreated to the woods to live deliberately and confront the essential facts of life.',
    quote: '“I went to the woods because I wished to live deliberately.”',
    dialogue: {
      intro: 'I went to the woods because I wished to live deliberately.',
      preFight: 'Simplify, simplify!',
      midFight: "The mass of men lead lives of quiet desperation—show me you're awake!",
      escaped: 'Time is but the stream I go a-fishing in.',
      captured: "I went to the woods to live deliberately; now I'll walk the rest of the peak with you.",
      lose: "I went to the woods to live deliberately; now I'll walk the rest of the peak with you.",
    },
    preBattleDialogue: [
      '“Simplify, simplify!”',
      '“The mass of men lead lives of quiet desperation—show me you’re awake!”',
    ],
    sourceNote: 'Alludes to Walden and Civil Disobedience.',
    hp: BATTLE_CONFIG.healthByRegion.WINTER,
    atk: 52,
    def: 56,
    spd: 48,
    spriteAssetKey: 'poet_robert_frost',
    primaryColor: '#166534',
    secondaryColor: '#4ade80',
    accentColor: '#ca8a04',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#b45309',
      skinHighlight: '#ffedd5',
      hair: '#451a03',
      hairHighlight: '#542c16',
      hairShadow: '#291409',
      clothing: '#166534',
      clothingHighlight: '#15803d',
      clothingShadow: '#14532d',
      accent: '#ca8a04',
    },
    moves: [
      {
        id: 'WALDEN_STRIKE',
        name: 'Walden Solitude',
        tag: 'HEAVY',
        poemTitle: 'Walden',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'I went to the woods because I wished to live deliberately,',
          'to front only the essential facts of life.',
        ],
        progressiveStanzas: [
          ['I went to the woods because I wished to live deliberately,', 'to front only the essential facts of life.'],
          ['And see if I could not learn what it had to teach,', 'and not, when I came to die, discover that I had not lived.'],
          ['I did not wish to live what was not life, living is so dear;', 'nor did I wish to practise resignation, unless it was quite necessary.'],
          ['I wanted to live deep and suck out all the marrow of life,', 'to drive life into a corner, and reduce it to its lowest terms.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'SIMPLIFY_MIND',
        name: 'Simplify',
        tag: 'DEBUFF',
        poemTitle: 'Where I Lived, and What I Lived For',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'Our life is frittered away by detail.',
          'Simplify, simplify!',
        ],
        progressiveStanzas: [
          ['Our life is frittered away by detail.', 'An honest man has hardly need to count more than his ten fingers.'],
          ['Simplicity, simplicity, simplicity!', 'I say, let your affairs be as two or three, and not a hundred or a thousand.'],
          ['Instead of a million count half a dozen,', 'and keep your accounts on your thumb-nail.'],
          ['Simplify, simplify!', 'Instead of three meals a day, if it be necessary eat but one; instead of a hundred dishes, five.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'QUIET_DESPERATION',
        name: 'Quiet Desperation',
        tag: 'BUFF',
        poemTitle: 'Economy',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'The mass of men lead lives of quiet desperation.',
          'What is called resignation is confirmed desperation.',
        ],
        progressiveStanzas: [
          ['The mass of men lead lives of quiet desperation.', 'What is called resignation is confirmed desperation.'],
          ['From the desperate city you go into the desperate country,', 'and have to console yourself with the bravery of minks and muskrats.'],
          ['A stereotyped but unconscious despair is concealed', 'even under what are called the games and amusements of mankind.'],
          ['There is no play in them, for this comes after work.', 'Be not simply good, be good for something.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'DELIBERATE_LIFE',
        name: 'Deliberate Living',
        tag: 'LIGHT',
        poemTitle: 'Walden',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'I wanted to live deep and suck out all the marrow of life,',
          'to live so sturdily and Spartan-like.',
        ],
        progressiveStanzas: [
          ['Time is but the stream I go a-fishing in.', 'I drink at it; but while I drink I see the sandy bottom and detect how shallow it is.'],
          ['Its thin current slides away, but eternity remains.', 'I would drink deeper; fish in the sky, whose bottom is pebbly with stars.'],
          ['If a man does not keep pace with his companions,', 'perhaps it is because he hears a different drummer.'],
          ['Let him step to the music which he hears,', 'however measured or far away.'],
        ],
        affinity: 'WINTER',
      },
    ],
  },

  // ==========================================================================
  // CHAPTER V: THE GAUNTLET / SUMMIT (200 HP)
  // 17. Sappho (Spring), 18. Shakespeare (Summer), 19. Keats (Autumn), 20. Dante (Winter)
  // ==========================================================================

  // 17. Sappho (Summit / Spring) - 200 HP
  {
    id: 'SAPPHO',
    name: 'Sappho',
    title: 'The Tenth Muse',
    lifespan: 'c. 630 – c. 570 BCE',
    birthplace: 'Lesbos, Ancient Greece',
    movement: 'Classical Lyric',
    season: 'SPRING',
    affinity: 'SPRING',
    tier: 5,
    chapter: 5,
    chapterName: 'Chapter V: The Gauntlet',
    locationDescription: 'Sappho’s Cliff Northwest at Top Edge X:5, Y:2',
    worldCoords: { x: 5, y: 2 },
    fightingStyle: 'Aegean Lyric & Dazzling Cadence',
    tacticalAdvice: 'First trial of the Gauntlet. Uses Lost for words with Tremor of Love and deals swift Spring damage.',
    defaultArenaId: 'PERSIAN_MOSAIC_COURTYARD',
    bio: 'Revered in antiquity as the Tenth Muse, Sappho created intensely musical lyrics celebrating beauty and Aphrodite.',
    quote: '“Someone will remember us, I say, even in another time.”',
    dialogue: {
      intro: "Chaire. Sappho. Most of what I wrote is gone. What's left is enough.",
      preFight: '“Someone will remember us, I say, even in another time.”',
      midFight: 'Love shakes my heart like a mountain wind falling on the oaks!',
      escaped: '“I don\'t know what to do. Two states of mind in me.”',
      captured: 'Someone will remember us in another time—and they will remember this song.',
      lose: 'Someone will remember us in another time—and they will remember this song.',
    },
    preBattleDialogue: [
      '“Someone will remember us, I say, even in another time.”',
      '“Someone will remember us, I say, even in another time.”',
    ],
    sourceNote: 'Alludes to Fragment 1, Fragment 31, and Fragment 160.',
    hp: BATTLE_CONFIG.healthByRegion.SUMMIT,
    atk: 56,
    def: 52,
    spd: 58,
    spriteAssetKey: 'poet_sappho',
    primaryColor: '#7c3aed',
    secondaryColor: '#a78bfa',
    accentColor: '#ec4899',
    portraitPalette: {
      skin: '#fef08a',
      skinShadow: '#d97706',
      skinHighlight: '#fffbeb',
      hair: '#b45309',
      hairHighlight: '#fde047',
      hairShadow: '#78350f',
      clothing: '#6d28d9',
      clothingHighlight: '#7c3aed',
      clothingShadow: '#4c1d95',
      accent: '#eab308',
      hat: '#ca8a04',
    },
    moves: [
      {
        id: 'TENTH_MUSE_LYRE',
        name: 'Tenth Muse Lyre',
        tag: 'HEAVY',
        poemTitle: 'Fragment 160',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Someone, I tell you,',
          'in another time will remember us.',
        ],
        progressiveStanzas: [
          ['Someone, I tell you,', 'in another time will remember us.'],
          ['Although they are only breath,', 'untouchable words which I command are not in vain.'],
          ['The stars around the fair moon veil their luminous faces', 'when at her full she shines across the Aegean.'],
          ['I declare that someone will remember us,', 'even in an age yet to come.'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'GOLDEN_SANDAL',
        name: 'Golden Sandal',
        tag: 'LIGHT',
        poemTitle: 'Fragment 110',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'Golden sandals bound upon feet of dawn,',
          'swift across Aegean waves.',
        ],
        progressiveStanzas: [
          ['Golden sandals bound upon feet of dawn,', 'swift across Aegean waves.'],
          ['Love shook my heart,', 'like the wind on the mountain rushing on the oak trees.'],
          ['I don’t know what to do:', 'two states of mind in me.'],
          ['Spring’s messenger, the sweet-voiced nightingale,', 'greets the mountain crest at last.'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'APHRODITE_HYMN',
        name: 'Aphrodite Hymn',
        tag: 'BUFF',
        poemTitle: 'Ode to Aphrodite',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'Deathless Aphrodite of the spangled mind,',
          'weaver of wiles, I beseech you.',
        ],
        progressiveStanzas: [
          ['Deathless Aphrodite of the spangled mind,', 'child of Zeus, weaver of wiles, I beseech you.'],
          ['Do not overpower my heart with grief,', 'but come to me now, if ever before you heard my voice.'],
          ['Yoking your golden chariot, beautiful swift sparrows', 'whirring their dense wings brought you from heaven across the sky.'],
          ['Come to me now again; release me from heavy sorrow,', 'and be yourself my ally in the fight.'],
        ],
        affinity: 'SPRING',
      },
      {
        id: 'TREMOR_OF_LOVE',
        name: 'Tremor of Love',
        tag: 'DEBUFF',
        poemTitle: 'Fragment 31',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'A delicate fire runs beneath my skin,',
          'my eyes see nothing, my ears hum.',
        ],
        progressiveStanzas: [
          ['He seems to me equal to the gods, that man', 'who sits opposite you and listens to your sweet speech.'],
          ['For when I look at you for a moment,', 'then I can no longer speak; my tongue breaks in silence.'],
          ['A delicate fire runs beneath my skin,', 'my eyes see nothing, my ears hum with sound.'],
          ['Cold sweat pours down me, and trembling', 'takes hold of all my body; I am greener than grass.'],
        ],
        affinity: 'SPRING',
      },
    ],
  },

  // 18. William Shakespeare (Summit / Summer) - 200 HP
  {
    id: 'SHAKESPEARE',
    name: 'William Shakespeare',
    title: 'The Immortal Bard',
    lifespan: '1564–1616',
    birthplace: 'Stratford-upon-Avon, England',
    movement: 'Renaissance Drama',
    season: 'SUMMER',
    affinity: 'SUMMER',
    tier: 5,
    chapter: 5,
    chapterName: 'Chapter V: The Gauntlet',
    locationDescription: 'Shakespeare’s Stage at Citadel X:26, Y:4',
    worldCoords: { x: 26, y: 4 },
    fightingStyle: 'Dramatic Soliloquy & Iambic Perfection',
    tacticalAdvice: 'Second trial of the Gauntlet. Boosts stats with Summer’s Day and deals devastating Summer damage.',
    defaultArenaId: 'GLOBE_THEATRE_STAGE',
    bio: 'The greatest dramatist and sonneteer in the English language, whose mastery of iambic pentameter shaped world literature.',
    quote: '“Shall I compare thee to a summer’s day?”',
    dialogue: {
      intro: 'Well met. Shakespeare. Will, if we\'re going to do this.',
      preFight: '"Shall I compare thee to a summer\'s day?"',
      midFight: 'Rough winds do shake the darling buds of May!',
      escaped: '"Exit, pursued by a bear."',
      captured: '"So long as men can breathe or eyes can see, so long lives this, and this gives life to thee."',
      lose: '"Exit, pursued by a bear."',
    },
    preBattleDialogue: [
      '"Shall I compare thee to a summer\'s day?"',
      '"Shall I compare thee to a summer\'s day?"',
    ],
    sourceNote: 'Alludes to Sonnet 18 and As You Like It.',
    hp: BATTLE_CONFIG.healthByRegion.SUMMIT,
    atk: 58,
    def: 53,
    spd: 52,
    spriteAssetKey: 'poet_william_shakespeare',
    primaryColor: '#ca8a04',
    secondaryColor: '#fde047',
    accentColor: '#854d0e',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#c2410c',
      skinHighlight: '#ffedd5',
      hair: '#2c150c',
      hairHighlight: '#4a2516',
      hairShadow: '#1a0c07',
      clothing: '#6e141e',
      clothingHighlight: '#8f1c29',
      clothingShadow: '#380b10',
      accent: '#fbbf24',
    },
    moves: [
      {
        id: 'SUMMERS_DAY',
        name: 'Summer’s Day',
        tag: 'BUFF',
        poemTitle: 'Sonnet 18',
        effectType: 'BUFF',
        maxReadings: BATTLE_CONFIG.buffReadings,
        powerLabel: 'BUFF x1.35',
        descriptionShort: 'BUFF: Damage x1.35 for 3 turns (2 readings).',
        stanzas: [
          'Shall I compare thee to a summer’s day?',
          'Thou art more lovely and more temperate.',
        ],
        progressiveStanzas: [
          ['Shall I compare thee to a summer’s day?', 'Thou art more lovely and more temperate.'],
          ['Rough winds do shake the darling buds of May,', 'And summer’s lease hath all too short a date.'],
          ['Sometime too hot the eye of heaven shines,', 'And often is his gold complexion dimm’d.'],
          ['So long as men can breathe or eyes can see,', 'So long lives this, and this gives life to thee.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'ROUGH_WINDS',
        name: 'Rough Winds',
        tag: 'LIGHT',
        poemTitle: 'Sonnet 18',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'Rough winds do shake the darling buds of May,',
          'And summer’s lease hath all too short a date.',
        ],
        progressiveStanzas: [
          ['Rough winds do shake the darling buds of May,', 'And summer’s lease hath all too short a date.'],
          ['And every fair from fair sometime declines,', 'By chance, or nature’s changing course, untrimm’d.'],
          ['But thy eternal summer shall not fade,', 'Nor lose possession of that fair thou ow’st.'],
          ['Nor shall death brag thou wander’st in his shade,', 'When in eternal lines to time thou grow’st.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'WOODEN_O_DRAMA',
        name: 'Wooden O Drama',
        tag: 'DEBUFF',
        poemTitle: 'Henry V',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'Can this cockpit hold the vasty fields of France?',
          'Or may we cram within this wooden O the very casques?',
        ],
        progressiveStanzas: [
          ['O for a Muse of fire, that would ascend', 'The brightest heaven of invention!'],
          ['A kingdom for a stage, princes to act', 'And monarchs to behold the swelling scene!'],
          ['Can this cockpit hold the vasty fields of France?', 'Or may we cram within this wooden O the very casques?'],
          ['Piece out our imperfections with your thoughts;', 'Into a thousand parts divide one man, and make imaginary puissance.'],
        ],
        affinity: 'SUMMER',
      },
      {
        id: 'BARE_RUIND_CHOIRS',
        name: 'Bare Ruin’d Choirs',
        tag: 'HEAVY',
        poemTitle: 'Sonnet 73',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Bare ruin’d choirs, where late the sweet birds sang.',
          'In me thou see’st the glowing of such fire.',
        ],
        progressiveStanzas: [
          ['That time of year thou mayst in me behold', 'When yellow leaves, or none, or few, do hang upon those boughs.'],
          ['Bare ruin’d choirs, where late the sweet birds sang.', 'In me thou see’st the twilight of such day as after sunset fadeth in the west.'],
          ['In me thou see’st the glowing of such fire', 'That on the ashes of his youth doth lie, as the death-bed whereon it must expire.'],
          ['This thou perceiv’st, which makes thy love more strong,', 'To love that well which thou must leave ere long.'],
        ],
        affinity: 'SUMMER',
      },
    ],
  },

  // 19. John Keats (Summit / Autumn) - 200 HP
  {
    id: 'KEATS',
    name: 'John Keats',
    title: 'The Young Romantic of Hampstead',
    lifespan: '1795–1821',
    birthplace: 'London, England / Rome, Italy',
    movement: 'Romantic Ode',
    season: 'AUTUMN',
    affinity: 'AUTUMN',
    tier: 5,
    chapter: 5,
    chapterName: 'Chapter V: The Gauntlet',
    locationDescription: 'Keats’s Rented Room at Citadel Stairs X:25, Y:14',
    worldCoords: { x: 25, y: 14 },
    fightingStyle: 'Negative Capability & Autumn Opulence',
    tacticalAdvice: 'Third trial of the Gauntlet. Heals with Season of Mists and pierces defenses with Nightingale Wing.',
    defaultArenaId: 'SNOWY_WOODS_AT_DUSK',
    bio: 'One of the greatest lyric poets in history who penned the immortal odes to a Nightingale, Grecian Urn, and Autumn in Hampstead before dying at 25.',
    quote: '“Beauty is truth, truth beauty.”',
    dialogue: {
      intro: 'Hello. Keats. I\'m twenty-five. I\'ll be twenty-five for a while.',
      preFight: '"Beauty is truth, truth beauty."',
      midFight: 'Was it a vision, or a waking dream? Fled is that music:—Do I wake or sleep?',
      escaped: '"Was it a vision, or a waking dream? Fled is that music."',
      captured: '"Here lies one whose name was writ in water."',
      lose: '"Was it a vision, or a waking dream? Fled is that music."',
    },
    preBattleDialogue: [
      '“Beauty is truth, truth beauty.”',
      '“Beauty is truth, truth beauty.”',
    ],
    sourceNote: 'Alludes to “Ode to a Nightingale” and “Ode on a Grecian Urn”.',
    hp: BATTLE_CONFIG.healthByRegion.SUMMIT,
    atk: 56,
    def: 52,
    spd: 54,
    spriteAssetKey: 'poet_john_keats',
    primaryColor: '#9333ea',
    secondaryColor: '#a855f7',
    accentColor: '#f59e0b',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#b45309',
      skinHighlight: '#ffedd5',
      hair: '#78350f',
      hairHighlight: '#b45309',
      hairShadow: '#451a03',
      clothing: '#581c87',
      clothingHighlight: '#7e22ce',
      clothingShadow: '#3b0764',
      accent: '#fbbf24',
    },
    moves: [
      {
        id: 'NIGHTINGALE_WING',
        name: 'Nightingale Wing',
        tag: 'HEAVY',
        poemTitle: 'Ode to a Nightingale',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Away! away! for I will fly to thee,',
          'Not charioted by Bacchus and his pards,',
          'But on the viewless wings of Poesy.',
        ],
        progressiveStanzas: [
          ['My heart aches, and a drowsy numbness pains', 'My sense, as though of hemlock I had drunk.'],
          ['O, for a draught of vintage! that hath been', 'Cool’d a long age in the deep-delved earth, tasting of Flora and the country green.'],
          ['Away! away! for I will fly to thee,', 'Not charioted by Bacchus and his pards, but on the viewless wings of Poesy.'],
          ['Thou wast not born for death, immortal Bird!', 'No hungry generations tread thee down; the voice I hear this passing night was heard in ancient days.'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'BRIGHT_STAR',
        name: 'Bright Star',
        tag: 'LIGHT',
        poemTitle: 'Bright Star',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'Bright star, would I were stedfast as thou art—',
          'Not in lone splendour hung aloft the night.',
        ],
        progressiveStanzas: [
          ['Bright star, would I were stedfast as thou art—', 'Not in lone splendour hung aloft the night;'],
          ['Watching, with eternal lids apart,', 'Like nature’s patient, sleepless Eremite,'],
          ['The moving waters at their priestlike task', 'Of pure ablution round earth’s human shores,'],
          ['Pillow’d upon my fair love’s ripening breast,', 'To feel for ever its soft fall and swell, and so live ever—or else swoon to death.'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'GRECIAN_URN',
        name: 'Grecian Urn',
        tag: 'STATUS',
        poemTitle: 'Ode on a Grecian Urn',
        effectType: 'STATUS',
        maxReadings: BATTLE_CONFIG.statusReadings,
        powerLabel: 'STATUS',
        descriptionShort: 'STATUS: Lost for words — target skips turn (2 readings).',
        stanzas: [
          'Thou still unravish’d bride of quietness,',
          'Thou foster-child of silence and slow time.',
        ],
        progressiveStanzas: [
          ['Thou still unravish’d bride of quietness,', 'Thou foster-child of silence and slow time.'],
          ['Heard melodies are sweet, but those unheard', 'Are sweeter; therefore, ye soft pipes, play on.'],
          ['Ah, happy, happy boughs! that cannot shed', 'Your leaves, nor ever bid the Spring adieu.'],
          ['“Beauty is truth, truth beauty,”—that is all', 'Ye know on earth, and all ye need to know.'],
        ],
        affinity: 'AUTUMN',
      },
      {
        id: 'ENDYMION_JOY',
        name: 'Endymion Joy',
        tag: 'HEAL',
        poemTitle: 'Endymion',
        effectType: 'HEAL',
        healAmount: BATTLE_CONFIG.healAmount,
        maxReadings: BATTLE_CONFIG.healReadings,
        powerLabel: '+30% HP',
        descriptionShort: 'HEAL: Restores 30% Max HP (2 readings).',
        stanzas: [
          'A thing of beauty is a joy for ever:',
          'Its loveliness increases; it will never pass into nothingness.',
        ],
        progressiveStanzas: [
          ['A thing of beauty is a joy for ever:', 'Its loveliness increases; it will never pass into nothingness.'],
          ['But still will keep a bower quiet for us,', 'and a sleep full of sweet dreams, and health, and quiet breathing.'],
          ['Therefore, on every morrow, are we wreathing', 'a flowery band to bind us to the earth.'],
          ['Some shape of beauty moves away the pall', 'from our dark spirits. Such the sun, the moon, trees old, and young.'],
        ],
        affinity: 'AUTUMN',
      },
    ],
  },

  // 20. Dante Alighieri (Summit / Winter) - 200 HP
  {
    id: 'DANTE',
    name: 'Dante Alighieri',
    title: 'The Florentine Pilgrim',
    lifespan: '1265–1321',
    birthplace: 'Florence, Italy',
    movement: 'Allegorical / Visionary',
    season: 'WINTER',
    affinity: 'WINTER',
    tier: 5,
    chapter: 5,
    chapterName: 'Chapter V: The Gauntlet',
    locationDescription: 'Dante’s Summit at Citadel Apex X:33, Y:3',
    worldCoords: { x: 33, y: 3 },
    fightingStyle: 'Infernal Terza Rima & Empyrean Radiance',
    tacticalAdvice: 'Final Sovereign Master of the Gauntlet. Weakens foe with Infernal Gate and unleashes Whirlwind Flame.',
    defaultArenaId: 'GLOBE_THEATRE_STAGE',
    bio: 'Supreme medieval visionary whose Divine Comedy traversed the nine circles of Inferno, terraces of Purgatorio, and starry spheres of Paradiso.',
    quote: '“The love that moves the sun and the other stars.”',
    dialogue: {
      intro: 'Salve. Dante. You came a long way to be wrong about the season.',
      preFight: '\"Abandon all hope, you who enter here.\"',
      midFight: 'Here must all distrust be left behind; here all cowardice must end!',
      escaped: '\"In the middle of the journey of our life, I found myself in a dark wood.\"',
      captured: 'And thence we came forth to look again upon the stars. The laurel of Parnassus is yours.',
      lose: 'And thence we came forth to look again upon the stars. The laurel of Parnassus is yours.',
    },
    preBattleDialogue: [
      '\"Abandon all hope, you who enter here.\"',
      '\"Abandon all hope, you who enter here.\"',
    ],
    sourceNote: 'Alludes to Inferno, Canto I & III and Paradiso, Canto XXXIII.',
    hp: BATTLE_CONFIG.healthByRegion.SUMMIT,
    atk: 60,
    def: 56,
    spd: 50,
    spriteAssetKey: 'poet_dante_alighieri',
    primaryColor: '#b91c1c',
    secondaryColor: '#ef4444',
    accentColor: '#f59e0b',
    portraitPalette: {
      skin: '#fed7aa',
      skinShadow: '#c2410c',
      skinHighlight: '#ffedd5',
      hair: '#292524',
      hairHighlight: '#44403c',
      hairShadow: '#1c1917',
      clothing: '#991b1b',
      clothingHighlight: '#b91c1c',
      clothingShadow: '#7f1d1d',
      accent: '#15803d',
      hat: '#b91c1c',
    },
    moves: [
      {
        id: 'DARK_WOOD',
        name: 'Dark Wood',
        tag: 'HEAVY',
        poemTitle: 'Inferno: Canto I',
        effectType: 'HEAVY',
        damage: BATTLE_CONFIG.heavyDamage,
        maxReadings: BATTLE_CONFIG.heavyReadings,
        powerLabel: '32 DMG',
        descriptionShort: 'HEAVY: 32 damage (3 readings).',
        stanzas: [
          'Midway upon the journey of our life',
          'I found myself within a forest dark,',
          'For the straightforward pathway had been lost.',
        ],
        progressiveStanzas: [
          ['Midway upon the journey of our life', 'I found myself within a forest dark, for the straightforward pathway had been lost.'],
          ['Ah me! how hard a thing it is to say', 'What was this forest savage, rough, and stern, which in the very thought renews the fear.'],
          ['So bitter is it, death is little more;', 'But of the good to treat, which there I found, speak will I of the other things I saw.'],
          ['I cannot well repeat how there I entered,', 'So full was I of slumber at the moment in which I had abandoned the true way.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'WHIRLWIND_FLAME',
        name: 'Whirlwind Flame',
        tag: 'LIGHT',
        poemTitle: 'Inferno: Canto V',
        effectType: 'LIGHT',
        damage: BATTLE_CONFIG.lightDamage,
        maxReadings: BATTLE_CONFIG.lightReadings,
        powerLabel: '18 DMG',
        descriptionShort: 'LIGHT: 18 damage (6 readings).',
        stanzas: [
          'The infernal hurricane that never rests',
          'Drives on the spirits with its violent sweep.',
        ],
        progressiveStanzas: [
          ['The infernal hurricane that never rests', 'Hurtles the spirits onward in its rapine; whirling them round and smiting, it molests them.'],
          ['When they arrive before the precipice,', 'There are the shrieks, the plaints, and the laments, there they blaspheme the puissance divine.'],
          ['I understood that unto such a torment', 'The carnal malefactors were condemned, who reason subjugate to appetite.'],
          ['Love, that on gentle heart doth swiftly seize,', 'Love, that denial takes from none beloved, brought me with him to this eternal death.'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'INFERNAL_GATE',
        name: 'Infernal Gate',
        tag: 'DEBUFF',
        poemTitle: 'Inferno: Canto III',
        effectType: 'DEBUFF',
        maxReadings: BATTLE_CONFIG.debuffReadings,
        powerLabel: 'DEBUFF x0.7',
        descriptionShort: 'DEBUFF: Target damage x0.70 for 3 turns (2 readings).',
        stanzas: [
          'Through me the way into the suffering city,',
          'Abandon all hope, ye who enter here!',
        ],
        progressiveStanzas: [
          ['Through me the way is to the city dolent;', 'Through me the way is to eternal dole; through me the way among the people lost.'],
          ['Justice incited my sublime Creator;', 'Created me divine Omnipotence, the highest Wisdom and the primal Love.'],
          ['Before me there were no created things,', 'Only eterne, and I eternal last. All hope abandon, ye who enter in!'],
          ['These words in sombre colour I beheld', 'Written upon the summit of a gate; whence I: “Their meaning, Master, is to me hard.”'],
        ],
        affinity: 'WINTER',
      },
      {
        id: 'SUN_AND_STARS',
        name: 'Sun and Stars',
        tag: 'HEAL',
        poemTitle: 'Paradiso: Canto XXXIII',
        effectType: 'HEAL',
        healAmount: BATTLE_CONFIG.healAmount,
        maxReadings: BATTLE_CONFIG.healReadings,
        powerLabel: '+30% HP',
        descriptionShort: 'HEAL: Restores 30% Max HP (2 readings).',
        stanzas: [
          'Even as a wheel that equally is moved,',
          'The Love that moves the sun and other stars.',
        ],
        progressiveStanzas: [
          ['Here vigour failed the lofty fantasy;', 'But now was turning my desire and will, even as a wheel that equally is moved,'],
          ['The Love which moves the sun and the other stars.', 'My mind in contemplation was suspended, gazing steadfastly and motionless.'],
          ['O grace abundant, by whereof I presumed', 'To fix my look across the eternal light so far that there I consumed my vision!'],
          ['And thence we came forth to look again upon the stars.'],
        ],
        affinity: 'WINTER',
      },
    ],
  },
];

export const getPoetById = (id: string): PoetData => {
  if (!id) return ALL_POETS[0];
  const norm = id.toUpperCase();
  const lower = id.toLowerCase();
  return (
    ALL_POETS.find(
      (p) =>
        p.id === id ||
        p.id.toUpperCase() === norm ||
        p.id.toLowerCase() === lower ||
        (norm === 'BAUDELAIRE' && (p.id === 'baudelaire' || p.id === 'BAUDELAIRE'))
    ) || ALL_POETS[0]
  );
};

export function getPoetCrossPairingDialogue(
  playerPoet: PoetData,
  opponentPoet: PoetData,
): string[] {
  // Uses authentic dialogue lines
  return [
    `“${opponentPoet.dialogue.preFight}”`,
    `“${playerPoet.dialogue.preFight}”`,
  ];
}

// Universal portrait drawing
export const drawPoetPortrait = (
  ctx: CanvasRenderingContext2D,
  poet: PoetData,
  x: number,
  y: number,
  size = 80,
  isBackSprite = false,
  imageAsset?: HTMLImageElement | null,
  facingLeft = false,
) => {
  ctx.save();
  if (imageAsset && imageAsset.complete && imageAsset.naturalWidth > 0) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const imgW = imageAsset.naturalWidth;
    const imgH = imageAsset.naturalHeight;
    const scale = Math.min(size / imgW, size / imgH);
    const drawW = Math.round(imgW * scale);
    const drawH = Math.round(imgH * scale);
    const drawX = Math.round(x + (size - drawW) / 2);
    const drawY = Math.round(y + (size - drawH) / 2);

    if (facingLeft || isBackSprite) {
      ctx.save();
      ctx.translate(drawX + drawW, drawY);
      ctx.scale(-1, 1);
      ctx.drawImage(imageAsset, 0, 0, drawW, drawH);
      ctx.restore();
    } else {
      ctx.drawImage(imageAsset, drawX, drawY, drawW, drawH);
    }
  } else {
    // Stylized colored silhouette with season emblem fallback
    ctx.fillStyle = poet.primaryColor;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, 8);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(SEASON_CONFIG[poet.season]?.symbol || '📜', x + size / 2, y + size / 2 + 8);
  }
  ctx.restore();
};

export function drawPoetArenaAtmosphere(
  ctx: CanvasRenderingContext2D,
  arena: PoetArenaStage,
  width: number,
  height: number,
  animTime: number,
) {
  // Ambient weather particles based on season/arena
  ctx.save();
  ctx.fillStyle = arena.themeColor;
  ctx.globalAlpha = 0.15;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

export function drawPoetArenaBackdrop(
  ctx: CanvasRenderingContext2D,
  arena: PoetArenaStage,
  width: number,
  height: number,
  animTime: number,
  customBgImage?: HTMLImageElement | null,
) {
  ctx.save();
  if (customBgImage && customBgImage.complete && customBgImage.naturalWidth > 0) {
    ctx.drawImage(customBgImage, 0, 0, width, height);
  } else {
    // Gradient sky
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, arena.themeColor);
    grad.addColorStop(1, '#09050d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }
  drawPoetArenaAtmosphere(ctx, arena, width, height, animTime);
  ctx.restore();
}
