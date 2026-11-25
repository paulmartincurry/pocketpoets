// =============================================================================
// THE COMMONPLACE BOOK
// -----------------------------------------------------------------------------
// A commonplace book is where a reader copies out lines worth keeping. Every prop
// on the mountain that quotes a line of verse is an entry. Examine it and the line
// the game shows you is copied into the book; the book keeps count.
//
// This file only lists WHICH props count (by screen and by the name shown in the
// dialogue box). The lines themselves are never stored here: the book records
// whatever the game actually showed the Reader.
//
// FOUND_ON_THE_MOUNTAIN was gathered by examining every tile in the game and
// keeping the props whose text quotes verse. Props added later through
// propLines.ts are picked up automatically when one of their lines opens with a quote.
// =============================================================================
import { PROP_LINES, GRAVES } from './propLines';

export const CANTOS: { id: string; name: string; screens: string[] }[] = [
  { id: 'HARBOR', name: 'The Harbor', screens: ['HARBOR', 'BOATHOUSE'] },
  { id: 'TOWN', name: 'The Town', screens: ['TOWN', 'CAFE_DE_FLORE', 'SHAKESPEARE_CO', 'RENTED_ROOM', 'LYRIC_SANCTUARY', 'LUNCH_COUNTER', 'NIGHTINGALE'] },
  { id: 'CLIFFS', name: 'The Cliffs', screens: ['CLIFFS', 'FORGE', 'BLUE_HOUSE'] },
  { id: 'RUINS', name: 'The Ruins', screens: ['RUINS', 'MOUNTAIN_GOAT', 'LIBRARY'] },
  { id: 'TREELINE', name: 'The Treeline', screens: ['TREELINE', 'WHITE_HOUSE', 'KITCHEN', 'HERMITAGE', 'GRAVEYARD'] },
  { id: 'SUMMIT', name: 'The Summit', screens: ['SUMMIT'] },
];

const FOUND_ON_THE_MOUNTAIN: Record<string, string[]> = {
  HARBOR: ["SKIFF", "SIGNPOST", "MILESTONE", "CRATES", "CROSSING-BAR LIGHTHOUSE"],
  BOATHOUSE: ["CRIMSON CRAB", "HOOK-JAWED FISH", "ARRIVAL LEDGER", "BOOKBINDER'S BENCH"],
  TOWN: ["PARK BENCH", "PARISIAN BOUQUINISTE", "GINGER CAT", "GAS STREETLAMP"],
  CAFE_DE_FLORE: ["MARBLE BISTRO TABLE"],
  SHAKESPEARE_CO: ["ROLLING LIBRARY LADDER"],
  RENTED_ROOM: ["CARVED WALNUT BED", "MANTELPIECE & REMEDY", "GRAND ROMAN WINDOW"],
  LUNCH_COUNTER: ["COKE & NOTES", "JAZZ PHOTOGRAPH", "COFFEE CARAFES", "LETTERBOARD MENU", "PIE DISPLAY", "CERAMIC BOWL", "VINTAGE JUKEBOX", "ICE CREAM SUNDAE"],
  NIGHTINGALE: ["ANTIQUE SONGBOOK", "UPRIGHT PIANO", "BRASS SCONCE", "DRINK SLATE", "CABARET TABLE", "CABARET POSTER", "BACK-BAR SHELVES"],
  CLIFFS: ["SEA BOULDER", "THE LAMB", "LIMESTONE BENCH", "THE TYGER", "COASTAL CAIRN", "SHIP'S LANTERN", "VINEYARD PERGOLA", "ANVIL", "BRINDED COW", "CITRUS TREE", "THE WINDHOVER", "BRASS TELESCOPE"],
  FORGE: ["ILLUMINATED BROADSIDES", "STONE FORGE HEARTH", "QUENCHING TROUGH"],
  BLUE_HOUSE: ["BOOKSHELF", "ARMCHAIR", "CEDAR SEA-CHEST", "CITRUS TREE", "CASEMENT WINDOW"],
  RUINS: ["WHITE MOUNTAIN GOAT", "SUNFLOWER", "LOAF AND JUG", "ANCIENT RED OAK TREE", "ARCHED ROMAN LIMESTONE BRIDGE", "FALLEN TRAVERTINE COLUMN DRUMS", "WET BLACK BOUGH", "CALLIGRAPHY DESK", "TEA PAVILION PILLARS & DECK", "ARCHAIC TORSO", "LILACS"],
  MOUNTAIN_GOAT: ["BASHŌ'S RELICS", "TIMBER TABLE", "MOUNTAIN ARCHWAY", "THE GREAT HEARTH & KETTLE"],
  LIBRARY: ["ROLLING LADDER", "CLERESTORY WINDOW", "CELESTIAL GLOBE", "MOORE'S READING LECTERN"],
  TREELINE: ["THE CARRIAGE", "THE LITTLE HORSE", "BENT BIRCH", "THE FORK", "SNOW-DUSTED PINE", "THE SNOW MAN", "THE BELL", "SILAS, THE HIRED MAN", "ONE WHO DIED FOR BEAUTY", "ONE WHO DIED FOR TRUTH", "THE THING WITH FEATHERS"],
  WHITE_HOUSE: ["TOWN WINDOW", "WALNUT BED", "GARDEN WINDOW"],
  KITCHEN: ["TYPEWRITER & MANUSCRIPT", "AGA STOVE", "BAKING BOARD"],
  HERMITAGE: ["HEARTH RUG", "RIVER-STONE HEARTH", "COLERIDGE'S DESK", "FIREWOOD CRADLE", "PINE BOOKSHELF"],
  GRAVEYARD: ["SELIMA", "LUCINDA MATLOCK", "MAUSOLEUM GUARDIANS", "THE LADY OF SHALOTT", "PORPHYRIA", "LUCY", "LYCIDAS", "THE ALBATROSS", "BARBARA ALLEN", "CELTIC CROSS"],
  SUMMIT: ["GRECIAN URN", "APPLE ON THE TOP BOUGH", "THE FORBIDDEN TREE", "VIEWING TERRACE", "STAGE RAILING", "TABLET OVER THE GATE", "THE DARK WOOD", "MARBLE DRUM", "NIGHTINGALE", "YORICK"],
};

/** True when a line of dialogue quotes verse (opens a quotation of some length). */
export const quotesVerse = (text: string): boolean => /[“"'‘][A-ZÀ-Ý][^“”"]{14,}/.test(text);

export interface CommonplaceEntry {
  key: string; // SCREEN:NAME
  canto: string;
  title: string;
}

export const commonplaceKey = (screen: string, speakerName: string): string => `${screen}:${speakerName.toUpperCase()}`;

const cantoOf = (screen: string): string => CANTOS.find((c) => c.screens.includes(screen))?.id ?? 'HARBOR';

const collected = new Map<string, CommonplaceEntry>();
const add = (screen: string, name: string) => {
  const key = commonplaceKey(screen, name);
  if (!collected.has(key)) collected.set(key, { key, canto: cantoOf(screen), title: name.toUpperCase() });
};
for (const [screen, names] of Object.entries(FOUND_ON_THE_MOUNTAIN)) for (const name of names) add(screen, name);
for (const table of [PROP_LINES, GRAVES]) {
  for (const [tileKey, prop] of Object.entries(table)) {
    if (prop.lines.some(quotesVerse)) add(tileKey.split(':')[0], prop.name);
  }
}

export const COMMONPLACE: CommonplaceEntry[] = CANTOS.flatMap((c) => [...collected.values()].filter((e) => e.canto === c.id));
export const COMMONPLACE_KEYS: Set<string> = new Set(COMMONPLACE.map((e) => e.key));
