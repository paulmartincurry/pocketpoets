// =============================================================================
// PROP LINES, GRAVES AND GATE REFUSALS
// -----------------------------------------------------------------------------
// Everything in this file is DRAFT COPY waiting on Paul. Edit the strings freely;
// nothing else needs to change.
//
//   PROP_LINES   what a prop says when the Reader examines it. Keyed by screen
//                and tile. These are the props that used to say nothing.
//   GRAVES       the eleven headstones. Each is the grave of someone who dies
//                in a poem (not a poet).
//   GATE_LINES   what a poet says when the Reader asks for a duel too early.
//                {season} becomes the season still unfinished.
//
// Quoted verse here is public domain only. Props that belong to poets still in
// copyright are described, not quoted.
// =============================================================================

export interface PropLine {
  name: string;
  lines: string[];
}

type PropEntry = [screen: string, tiles: string[], name: string, lines: string[]];

const ENTRIES: PropEntry[] = [
  // ---------------------------------------------------------------- THE CLIFFS
  ['CLIFFS', ['32,3'], "SHIP'S FIGUREHEAD", [
    'A wooden woman off the bow of a wrecked schooner. Somebody carried her up a cliff rather than leave her.',
    'The paint has gone from her face on the windward side.',
  ]],
  ['CLIFFS', ['33,5', '31,7', '28,9', '33,21', '30,23', '27,24', '24,25', '21,26'], 'AGAVE', [
    'Agave. It flowers once, after many years, and then it dies.',
  ]],
  ['CLIFFS', ['15,7', '16,7', '17,7', '18,7', '19,7', '21,7', '22,7', '23,7', '24,7', '18,10', '19,10', '21,10', '22,10', '23,10', '24,10'], 'VINEYARD PERGOLA', [
    'Grapes on a trellis, going purple in the salt air.',
    'They will be picked in autumn.',
  ]],
  ['CLIFFS', ['6,12'], 'THE LAMB', [
    "'Little Lamb, who made thee? / Dost thou know who made thee?'",
    'A lamb in the grass by the forge, eating.',
  ]],
  ['CLIFFS', ['10,12'], 'THE TYGER', [
    "'Tyger Tyger, burning bright, / In the forests of the night.'",
    'A striped cat asleep by the forge door.',
  ]],
  ['CLIFFS', ['14,12'], 'ANVIL', [
    "'What the hammer? what the chain? / In what furnace was thy brain?'",
    'Still warm.',
  ]],
  ['CLIFFS', ['33,11', '32,26', '35,12', '6,25'], 'BOULDER', [
    'A boulder, warm on the side that faces the sea.',
  ]],
  ['CLIFFS', ['7,15', '8,15', '9,15', '11,15', '12,15', '13,15', '17,16', '17,17', '17,18'], 'DRY-STONE WALL', [
    'A dry-stone wall. No mortar. It has stood a long time.',
  ]],
  ['CLIFFS', ['31,17', '32,17'], 'LIMESTONE BENCH', [
    'Sun-warm limestone with lavender growing behind it.',
  ]],
  ['CLIFFS', ['33,19'], 'CAIRN', [
    'Stones stacked by people who came this way before you.',
  ]],
  ['CLIFFS', ['20,20'], 'WOOL SOCKS', [
    'A pair of thick wool socks, drying on a line.',
    'A friend knitted them for him. He wrote them an ode.',
  ]],
  ['CLIFFS', ['19,16', '20,16', '21,16', '19,17', '20,17', '21,17', '19,18', '20,18', '21,18', '19,19', '20,19', '21,19'], 'THE ODE GARDEN', [
    'Artichokes, tomatoes, onions. He wrote an ode to each.',
  ]],
  ['CLIFFS', ['29,20', '8,21'], 'AMPHORA', [
    'A clay jar, very old. It held oil once, and then wine.',
  ]],
  ['CLIFFS', ['22,21'], 'BIRDCAGE', [
    'A birdcage on a post. The door is open. The cage is empty.',
  ]],
  ['CLIFFS', ['27,21'], 'ANCHOR', [
    "A ship's anchor in the yard of a house on dry land. He collects things from ships.",
  ]],
  ['CLIFFS', ['13,25'], 'BRINDED COW', [
    "'Glory be to God for dappled things / For skies of couple-colour as a brinded cow.'",
    'A brindled cow, chewing.',
  ]],
  ['CLIFFS', ['7,20'], 'BLACK PONY', [
    'A small black pony, saddled, with olives in the saddlebag.',
    'Its rider is bound for Córdoba. He does not expect to arrive.',
  ]],
  ['CLIFFS', ['30,15', '8,17', '11,17', '14,17', '2,20', '6,20', '12,20', '16,20'], 'OLIVE TREE', [
    'An old olive tree. The trunk is split and it still bears.',
    'There are groves of these all round Granada.',
  ]],
  ['CLIFFS', ['10,25'], 'THE WINDHOVER', [
    "'I caught this morning morning's minion.' A kestrel, holding still on the wind.",
  ]],
  ['CLIFFS', ['27,27'], 'GULL ROCK', [
    'A gull on a rock, calling at the sea.',
  ]],

  // ----------------------------------------------------------------- THE RUINS
  ['RUINS', ['6,8'], 'THE MOUNTAIN GOAT', [
    'THE MOUNTAIN GOAT. A plain board on a chain. No hours posted.',
  ]],
  ['RUINS', ['29,10'], 'STACK OF BOOKS', [
    'Books stacked by the library door. She owned four thousand. They made her give them up.',
    'She signed the paper in her own blood.',
  ]],
  ['RUINS', ['14,11'], 'JUG AND THREE CUPS', [
    'One jug. Three cups. One for him, one for the moon, one for his shadow.',
    'He drank alone that night and wrote it down.',
  ]],
  // Seen from either bank: the Reader stands on the bank (18,10 or 22,10) and faces the water.
  ['RUINS', ['20,10', '19,10', '21,10'], 'THE MOON IN THE WATER', [
    'The moon, sitting in the stream. They say he drowned reaching for it.',
    'It is a story. People have told it for a thousand years.',
  ]],
  // The bluebird sits on the bar's roof; the Reader faces the wall under it (9,8).
  ['RUINS', ['9,8'], 'BLUEBIRD', [
    'A bluebird on the roof of the bar.',
    'It sings a little and stops.',
  ]],
  ['RUINS', ['24,11'], 'WET BLACK BOUGH', [
    "'The apparition of these faces in the crowd: / Petals on a wet, black bough.'",
    'He cut it down from thirty lines. It took him a year.',
  ]],
  ['RUINS', ['32,11'], 'LILACS', [
    "'April is the cruellest month, breeding / Lilacs out of the dead land.'",
    'Lilacs, in flower, growing out of broken stone.',
  ]],
  ['RUINS', ['11,7'], 'SUNFLOWER', [
    "'Ah Sun-flower! weary of time, / Who countest the steps of the Sun.'",
    'Dusty and bent, growing out of the rubble.',
  ]],
  ['RUINS', ['8,13'], 'SUNDIAL', [
    'A sundial. The astronomer who set it also reformed the calendar.',
  ]],
  ['RUINS', ['9,14'], 'LOAF AND JUG', [
    "'A Jug of Wine, a Loaf of Bread, and Thou / Beside me singing in the Wilderness.'",
    'A loaf and a jug, set out under the tree.',
  ]],
  ['RUINS', ['4,15', '7,15', '11,15', '14,15', '5,18', '12,18', '9,18', '15,18'], 'BROKEN COLUMN', [
    'Half a column. It held up a roof once.',
  ]],
  ['RUINS', ['25,18'], 'STONE LANTERN', [
    'A stone lantern under a coat of moss. It has not been lit in a long time.',
  ]],
  ['RUINS', ['32,19'], 'BANANA PLANT', [
    'A banana plant. The wind has torn the leaves.',
    'A student gave him one like it. He took his name from it.',
  ]],
  ['RUINS', ['33,22'], 'STONE BASIN', [
    'A cracked basin of rainwater with one red leaf on it.',
    'The water is very still.',
  ]],

  // -------------------------------------------------------------- THE TREELINE
  ['TREELINE', ['10,7', '11,7'], 'BEE BOX', [
    'A white wooden hive. It hums.',
    'She keeps bees. Her father kept them too.',
  ]],
  ['TREELINE', ['7,9'], 'BLACK SHOE', [
    'One black shoe, left out in the snow. Just the one.',
  ]],
  ['TREELINE', ['31,9'], 'THE BELL', [
    "'Never send to know for whom the bell tolls; it tolls for thee.'",
    'A bell on a post. The rope is frayed where hands have pulled it.',
  ]],
  // The graveyard yard is fenced and its gate is a door, so the Reader reads these through
  // the railings: 29,8 is the fence tile in front of the raven.
  ['TREELINE', ['29,7', '29,8'], 'RAVEN', [
    "A raven on the graveyard fence. Quoth the Raven: 'Nevermore.'",
    'It watches you and does not move.',
  ]],
  ['TREELINE', ['31,13'], 'THE SNOW MAN', [
    "'One must have a mind of winter.'",
    'A snowman with two pieces of coal for eyes.',
  ]],
  ['TREELINE', ['11,16'], 'THE LITTLE HORSE', [
    "'He gives his harness bells a shake / To ask if there is some mistake.'",
    'A small horse in harness, standing in the snow.',
  ]],
  ['TREELINE', ['33,19'], 'CHOPPING BLOCK', [
    'A chopping block with the axe left in it.',
  ]],
  ['TREELINE', ['25,20'], 'FIREWOOD', [
    'Split birch, stacked carefully against the wall.',
  ]],
  ['TREELINE', ['27,20'], 'LIT WINDOW', [
    'One lit window. He reads late.',
  ]],
  ['TREELINE', ['32,21'], 'SLED AND SNOWSHOES', [
    'A sled and a pair of snowshoes. It is a mile and a half to the village.',
  ]],
  ['TREELINE', ['1,23', '2,23'], 'THE CARRIAGE', [
    "'Because I could not stop for Death / He kindly stopped for me.'",
    'A carriage, standing at the gate. The driver waits.',
  ]],
  // The bird sits on her eave; the Reader faces the wall under it (7,22).
  ['TREELINE', ['7,21', '7,22'], 'THE THING WITH FEATHERS', [
    "'Hope is the thing with feathers / That perches in the soul.'",
    'A small bird on the eave, singing.',
  ]],
  ['TREELINE', ['3,24', '5,24'], 'BENT BIRCH', [
    "'One could do worse than be a swinger of birches.'",
    'A birch bent to the ground by ice.',
  ]],
  ['TREELINE', ['16,25'], 'THE FORK', [
    "'Two roads diverged in a yellow wood.' A signpost with two arms.",
    'Both roads look about equally worn.',
  ]],

  // ---------------------------------------------------------------- THE SUMMIT
  ['SUMMIT', ['13,1', '22,1'], 'LAUREL', [
    'A laurel wreath on a flat stone.',
  ]],
  ['SUMMIT', ['14,2'], 'THE FORBIDDEN TREE', [
    "'Of Man's first disobedience, and the fruit / Of that forbidden tree.'",
    'Something is coiled in the branches.',
  ]],
  ['SUMMIT', ['21,2'], 'TABLET OVER THE GATE', [
    "'All hope abandon, ye who enter here.'",
    'The letters are cut deep into the stone.',
  ]],
  ['SUMMIT', ['22,5'], 'THE DARK WOOD', [
    "'Midway upon the journey of our life / I found myself within a forest dark.'",
    'One black tree, standing by itself.',
  ]],
  ['SUMMIT', ['3,11'], 'APPLE ON THE TOP BOUGH', [
    "'Like the sweet apple which reddens upon the topmost bough.'",
    'The pickers did not forget it. They could not reach it.',
  ]],
  ['SUMMIT', ['11,11'], 'GRECIAN URN', [
    "'Thou still unravish'd bride of quietness.'",
    'The figures on it are running and never arrive.',
  ]],
  ['SUMMIT', ['30,16'], 'YORICK', [
    "'Alas, poor Yorick! I knew him, Horatio: a fellow of infinite jest.'",
    'A skull on a plinth.',
  ]],
  ['SUMMIT', ['23,22', '32,22'], 'THE TWO MASKS', [
    'Comedy and Tragedy, side by side on a pillar.',
  ]],
  ['SUMMIT', ['14,9'], 'NIGHTINGALE', [
    "'Thou wast not born for death, immortal Bird!'",
    'It is singing somewhere above you. You cannot see it.',
  ]],

  // ----------------------------------------------------------------- INTERIORS
  ['KITCHEN', ['1,3'], 'WOODBOX', [
    'Kindling, split small, for the stove.',
  ]],
  ['HERMITAGE', ['9,10'], 'BOOTS', [
    'A pair of boots by the door, still wet. He has been out measuring the pond again.',
  ]],
  ['MOUNTAIN_GOAT', ['7,4', '8,4', '9,4'], 'BAR STOOL', [
    'A cedar stool, worn smooth.',
  ]],
  ['BLUE_HOUSE', ['11,4'], 'WRITING DESK', [
    'A dictionary, a thesaurus and a deck of cards.',
    'They are not his. A friend left them here.',
  ]],
  ['BLUE_HOUSE', ['14,8'], 'TABLE', [
    'Shells, bottles, a brass compass. He collects everything.',
  ]],
  ['FORGE', ['4,2'], 'BELLOWS', [
    'A leather bellows, cracked along the fold.',
  ]],
  ['LUNCH_COUNTER', ['3,3', '4,3', '6,3', '8,3', '9,3', '10,3', '12,3'], 'LUNCH COUNTER', [
    'Formica, coffee rings, a napkin with half a poem on it.',
  ]],
  ['LUNCH_COUNTER', ['7,3'], 'SANDWICH', [
    'A liver sausage sandwich, one bite gone.',
  ]],
  ['LUNCH_COUNTER', ['2,6', '3,6', '2,9'], 'BOOTH', [
    'A booth with a cold plate on the table.',
  ]],
  ['NIGHTINGALE', ['7,2', '7,3', '7,4'], 'STAGE RAIL', [
    'A brass rail between the stage and the tables.',
  ]],
  ['NIGHTINGALE', ['11,3', '12,3', '13,3'], 'THE BAR', [
    'The bar. The wood is sticky under your hand.',
  ]],
];

export const PROP_LINES: Record<string, PropLine> = {};
for (const [screen, tiles, name, lines] of ENTRIES) {
  for (const tile of tiles) PROP_LINES[`${screen}:${tile}`] = { name, lines };
}

// -----------------------------------------------------------------------------
// THE ELEVEN HEADSTONES. Eight inside the graveyard, three on the Treeline by
// its fence. Annabel Lee, Lenore and Ulalume already had their stones.
// -----------------------------------------------------------------------------
export const GRAVES: Record<string, PropLine> = {
  'GRAVEYARD:12,6': { name: 'LYCIDAS', lines: [
    "'For Lycidas is dead, dead ere his prime, / Young Lycidas, and hath not left his peer.'",
    'Drowned in the Irish Sea. He was never found.',
  ] },
  'GRAVEYARD:10,9': { name: 'LUCY', lines: [
    "'But she is in her grave, and, oh, / The difference to me!'",
    'She lived unknown. He wrote five poems for her.',
  ] },
  'GRAVEYARD:3,10': { name: 'THE LADY OF SHALOTT', lines: [
    "'She has a lovely face; / God in his mercy lend her grace.'",
    'She looked out of her window toward Camelot, once.',
  ] },
  'GRAVEYARD:3,8': { name: 'PORPHYRIA', lines: [
    "'And all night long we have not stirred, / And yet God has not said a word!'",
    'She came in from the storm to see him. He tells it calmly.',
  ] },
  'GRAVEYARD:13,8': { name: 'BARBARA ALLEN', lines: [
    "'Sweet William died for me today, / I'll die for him tomorrow.'",
    'A rose grows from one grave and a briar from the other. They have grown together in a knot.',
  ] },
  'GRAVEYARD:4,9': { name: 'LUCINDA MATLOCK', lines: [
    "'It takes life to love Life.'",
    'Spoon River. Ninety-six years, twelve children.',
  ] },
  'GRAVEYARD:12,9': { name: 'THE ALBATROSS', lines: [
    "'Instead of the cross, the Albatross / About my neck was hung.'",
    'A very small stone. Someone leaves flowers here.',
  ] },
  'GRAVEYARD:4,10': { name: 'SELIMA', lines: [
    "'Not all that tempts your wand'ring eyes / And heedless hearts, is lawful prize.'",
    "A favourite cat, drowned in a tub of goldfishes. 'Nor all that glisters, gold.'",
  ] },
  // Read through the railings (the yard itself cannot be walked into): north fence at 27,4
  // and 30,4, south fence at 30,8. The stones stand at 27,5 / 30,5 / 29,6.
  'TREELINE:27,4': { name: 'ONE WHO DIED FOR BEAUTY', lines: [
    "'I died for Beauty, but was scarce / Adjusted in the Tomb.'",
    'Moss has grown over the name.',
  ] },
  'TREELINE:30,4': { name: 'ONE WHO DIED FOR TRUTH', lines: [
    "'When One who died for Truth, was lain / In an adjoining Room.'",
    'They talk between the stones at night. Themself are one, he says. They are brethren.',
  ] },
  'TREELINE:30,8': { name: 'SILAS, THE HIRED MAN', lines: [
    "'Home is the place where, when you have to go there, / They have to take you in.'",
    'He came back to ditch the meadow. He did not get to it.',
  ] },
};

// -----------------------------------------------------------------------------
// GATE REFUSALS. One per gated poet, in that poet's voice.
// -----------------------------------------------------------------------------
export const GATE_LINES: Record<string, string> = {
  NERUDA: 'Not yet, compañero. Finish {season} first. I will keep the fire.',
  LORCA: 'Not today. You have not finished {season}. Come back and we will sing.',
  ANGELOU: "You'll get here. But not today, baby. Finish {season} first.",
  BLAKE: 'Not yet. The plate is still in the acid. Finish {season} and come back.',
  BASHO: 'You have come too soon. Walk {season} to its end, then sit with me.',
  LI_BAI: 'Sit. Drink. But no duel until you have finished {season}.',
  SOR_JUANA: 'Not yet. Finish {season}, and then we will dispute.',
  BUKOWSKI: "Not now, kid. Go finish {season}. I'll be here.",
  FROST: 'Not yet. Finish {season}. I have this wall to mend anyway.',
  DICKINSON: 'Not today. {season} is not finished. Come back when it is.',
  POE: 'Not yet. Quietly, now. Finish {season} first.',
  PLATH: "Not yet. I'm working. Finish {season} first.",
  SAPPHO: 'Not yet. Finish {season}. I will be here when the star is up.',
  KEATS: 'Forgive me, not yet. Finish {season} first.',
  SHAKESPEARE: 'Not yet, friend. Finish {season}, and come again.',
  DANTE: 'There is an order to these things. Finish {season} first.',
};
