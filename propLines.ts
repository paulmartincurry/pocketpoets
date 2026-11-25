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
    'She has seen more ocean than you have. She is not impressed by the view.',
  ]],
  ['CLIFFS', ['33,5', '31,7', '28,9', '33,21', '30,23', '27,24', '24,25', '21,26'], 'AGAVE', [
    'Agave. It flowers once, magnificently, and then it dies. Poets find this relatable.',
  ]],
  ['CLIFFS', ['15,7', '16,7', '17,7', '18,7', '19,7', '21,7', '22,7', '23,7', '24,7', '18,10', '19,10', '21,10', '22,10', '23,10', '24,10'], 'GRAPE TRELLIS', [
    'Grapes on a trellis, going purple in the salt air.',
    'Every one of these will be wine or a metaphor by autumn.',
  ]],
  ['CLIFFS', ['6,12'], 'THE LAMB', [
    "'Little Lamb, who made thee? / Dost thou know who made thee?'",
    'The lamb does not know. The lamb is eating.',
  ]],
  ['CLIFFS', ['10,12'], 'THE TYGER', [
    "'Tyger Tyger, burning bright, / In the forests of the night.'",
    'A striped cat asleep by the forge door. Fearful symmetry, at rest.',
  ]],
  ['CLIFFS', ['14,12'], 'ANVIL', [
    "'What the hammer? what the chain? / In what furnace was thy brain?'",
    'Still warm.',
  ]],
  ['CLIFFS', ['33,11', '32,26', '35,12', '6,25'], 'BOULDER', [
    'A boulder. It was here before the poems and has outlasted several movements.',
  ]],
  ['CLIFFS', ['7,15', '8,15', '9,15', '11,15', '12,15', '13,15', '17,16', '17,17', '17,18'], 'DRY-STONE WALL', [
    'No mortar. Every stone is held up by the ones it holds up.',
  ]],
  ['CLIFFS', ['31,17', '32,17'], 'LIMESTONE BENCH', [
    'Sun-warm limestone with lavender behind it. Built for sitting and saying nothing.',
  ]],
  ['CLIFFS', ['33,19'], 'CAIRN', [
    'Stones stacked by everyone who made it this far. Add one in your head.',
  ]],
  ['CLIFFS', ['20,20'], 'WOOL SOCKS', [
    'One pair of thick wool socks, drying on a line. Somebody thought these deserved an ode.',
    'They were right.',
  ]],
  ['CLIFFS', ['19,16', '20,16', '21,16', '19,17', '20,17', '21,17', '19,18', '20,18', '21,18', '19,19', '20,19', '21,19'], 'THE ODE GARDEN', [
    'Artichokes, tomatoes, onions. Three rows of ordinary things somebody bothered to praise.',
  ]],
  ['CLIFFS', ['29,20', '8,21'], 'AMPHORA', [
    'A clay jar older than the alphabet you read in. It held oil, then wine, then nothing.',
  ]],
  ['CLIFFS', ['22,21'], 'BIRDCAGE', [
    'A birdcage on a post. The door is open. The cage is empty.',
    'You know why.',
  ]],
  ['CLIFFS', ['27,21'], 'ANCHOR', [
    "A ship's anchor in the yard of a house on dry land. The owner collects the sea in pieces.",
  ]],
  ['CLIFFS', ['13,25'], 'BRINDED COW', [
    "'Glory be to God for dappled things / For skies of couple-colour as a brinded cow.'",
    'The cow accepts the glory and goes on chewing.',
  ]],
  ['CLIFFS', ['10,25'], 'THE WINDHOVER', [
    "'I caught this morning morning's minion.' A kestrel, hanging on the wind like it is nailed there.",
  ]],
  ['CLIFFS', ['27,27'], 'GULL ROCK', [
    'A gull on a rock, screaming at the Aegean. No form, no meter, total commitment.',
  ]],

  // ----------------------------------------------------------------- THE RUINS
  ['RUINS', ['6,8'], 'THE MOUNTAIN GOAT', [
    'THE MOUNTAIN GOAT. A plain board on a chain. No hours posted. It opens when he wakes up.',
  ]],
  ['RUINS', ['29,10'], 'STACK OF BOOKS', [
    'Books stacked by the library door. She owned four thousand. They made her give them up.',
    'She signed the paper in her own blood. Then she kept thinking anyway.',
  ]],
  ['RUINS', ['14,11'], 'JUG AND THREE CUPS', [
    'One jug. Three cups. One for him, one for the moon, one for his shadow.',
    'Nobody else was invited. It was still a party.',
  ]],
  // Seen from either bank: the Reader stands on the bank (18,10 or 22,10) and faces the water.
  ['RUINS', ['20,10', '19,10', '21,10'], 'THE MOON IN THE WATER', [
    'The moon, sitting in the stream. They say he drowned reaching for it.',
    'Probably not true. Worth believing.',
  ]],
  // The bluebird sits on the bar's roof; the Reader faces the wall under it (9,8).
  ['RUINS', ['9,8'], 'BLUEBIRD', [
    'A bluebird on the roof of a bar. The man inside says he keeps one too, and only lets it out at night.',
    'It sings a little. Nobody in there is going to mention it.',
  ]],
  ['RUINS', ['24,11'], 'WET BLACK BOUGH', [
    "'The apparition of these faces in the crowd: / Petals on a wet, black bough.'",
    'Fourteen words. It took him a year to get it down to that.',
  ]],
  ['RUINS', ['32,11'], 'LILACS', [
    "'April is the cruellest month, breeding / Lilacs out of the dead land.'",
    'They smell fine. That is the cruel part.',
  ]],
  ['RUINS', ['11,7'], 'SUNFLOWER', [
    "'Ah Sun-flower! weary of time, / Who countest the steps of the Sun.'",
    'Dusty, bent, growing out of rubble. Still a sunflower.',
  ]],
  ['RUINS', ['8,13'], 'SUNDIAL', [
    'A sundial set by an astronomer who fixed the calendar and then wrote about how little time there is.',
    'It is later than it was when you started reading this.',
  ]],
  ['RUINS', ['9,14'], 'LOAF AND JUG', [
    "'A Jug of Wine, a Loaf of Bread, and Thou / Beside me singing in the Wilderness.'",
    'Two out of three are here.',
  ]],
  ['RUINS', ['4,15', '7,15', '11,15', '14,15', '5,18', '12,18'], 'BROKEN COLUMN', [
    'Half a column. It used to hold up a roof. Now it holds up the idea of one.',
  ]],
  ['RUINS', ['25,18'], 'STONE LANTERN', [
    'A stone lantern under a coat of moss. Nobody has lit it in three hundred years. It still looks like evening.',
  ]],
  ['RUINS', ['32,19'], 'BANANA PLANT', [
    'A banana plant. Useless in this climate. Torn by every wind.',
    'A student gave him one like it. He liked it so much he took its name.',
  ]],
  ['RUINS', ['33,22'], 'STONE BASIN', [
    'A cracked basin of rainwater with one red leaf on it.',
    'An old pond, more or less. Waiting on a frog.',
  ]],

  // -------------------------------------------------------------- THE TREELINE
  ['TREELINE', ['10,7', '11,7'], 'BEE BOX', [
    'A clean wood box, square as a chair. It hums.',
    'She ordered it. Now she has to live with it.',
  ]],
  ['TREELINE', ['7,9'], 'BLACK SHOE', [
    'One black shoe, left out in the snow. Just the one.',
  ]],
  ['TREELINE', ['31,9'], 'THE BELL', [
    "'Never send to know for whom the bell tolls; it tolls for thee.'",
    'You did not ask. It told you anyway.',
  ]],
  // The graveyard yard is fenced and its gate is a door, so the Reader reads these through
  // the railings: 29,8 is the fence tile in front of the raven.
  ['TREELINE', ['29,7', '29,8'], 'RAVEN', [
    "A raven on the graveyard fence. Quoth the Raven: 'Nevermore.'",
    'It only knows the one word. It has built a career on it.',
  ]],
  ['TREELINE', ['31,13'], 'THE SNOW MAN', [
    "'One must have a mind of winter.'",
    'Three balls of snow and two pieces of coal. Nothing that is not there, and the nothing that is.',
  ]],
  ['TREELINE', ['11,16'], 'THE LITTLE HORSE', [
    "'He gives his harness bells a shake / To ask if there is some mistake.'",
    'There is no farmhouse near. The horse has noticed.',
  ]],
  ['TREELINE', ['33,19'], 'CHOPPING BLOCK', [
    'A chopping block with the axe left in it. Wood warms you twice. Once here.',
  ]],
  ['TREELINE', ['25,20'], 'FIREWOOD', [
    'Split birch, stacked with more care than most stanzas.',
  ]],
  ['TREELINE', ['27,20'], 'LIT WINDOW', [
    'One lit window. A man in there went to the woods to live deliberately and still leaves the lamp on.',
  ]],
  ['TREELINE', ['32,21'], 'SLED AND SNOWSHOES', [
    'A sled and a pair of snowshoes. He walked to town more often than the book lets on.',
  ]],
  ['TREELINE', ['1,23', '2,23'], 'THE CARRIAGE', [
    "'Because I could not stop for Death / He kindly stopped for me.'",
    'It is parked. The driver is patient. He has all the time there is.',
  ]],
  // The bird sits on her eave; the Reader faces the wall under it (7,22).
  ['TREELINE', ['7,21', '7,22'], 'THE THING WITH FEATHERS', [
    "'Hope is the thing with feathers / That perches in the soul.'",
    'It is perched on the eave, singing the tune without the words. It has not asked you for a crumb.',
  ]],
  ['TREELINE', ['3,24', '5,24'], 'BENT BIRCH', [
    "'One could do worse than be a swinger of birches.'",
    'Bent to the ground and not broken. Ice did it, he says. He would rather a boy had.',
  ]],
  ['TREELINE', ['16,25'], 'THE FORK', [
    "'Two roads diverged in a yellow wood.' A signpost with two arms and no opinion.",
    'Both roads are worn about the same. He admits it in the second stanza. Nobody reads the second stanza.',
  ]],

  // ---------------------------------------------------------------- THE SUMMIT
  ['SUMMIT', ['13,1', '22,1'], 'LAUREL', [
    'A laurel wreath on a flat stone. Nobody is wearing it. That is the whole game.',
  ]],
  ['SUMMIT', ['14,2'], 'THE FORBIDDEN TREE', [
    "'Of Man's first disobedience, and the fruit / Of that forbidden tree.'",
    'Something is coiled in the branches. It has all the best lines.',
  ]],
  ['SUMMIT', ['21,2'], 'TABLET OVER THE GATE', [
    "'All hope abandon, ye who enter here.'",
    'Carved deep. He meant it. He still wrote two more books to get you out.',
  ]],
  ['SUMMIT', ['22,5'], 'THE DARK WOOD', [
    "'Midway upon the journey of our life / I found myself within a forest dark.'",
    'One black tree. It only takes one.',
  ]],
  ['SUMMIT', ['3,11'], 'APPLE ON THE TOP BOUGH', [
    "'Like the sweet apple which reddens upon the topmost bough.'",
    'The pickers did not forget it. They could not reach it.',
  ]],
  ['SUMMIT', ['11,11'], 'GRECIAN URN', [
    "'Thou still unravish'd bride of quietness.'",
    'The lovers on it never touch and never get old. He was twenty-three. He knew which was the better deal.',
  ]],
  ['SUMMIT', ['14,9'], 'NIGHTINGALE', [
    "'Thou wast not born for death, immortal Bird!'",
    'It is singing. Do you wake or sleep?',
  ]],

  // ----------------------------------------------------------------- INTERIORS
  ['KITCHEN', ['1,3'], 'WOODBOX', [
    'Kindling, split small. The stove eats before anyone else in this house.',
  ]],
  ['HERMITAGE', ['9,10'], 'BOOTS', [
    'A pair of boots by the door, still wet. He has been out measuring the pond again.',
  ]],
  ['MOUNTAIN_GOAT', ['7,4', '8,4', '9,4'], 'BAR STOOL', [
    'A cedar stool worn smooth. Better men than you have fallen off it.',
  ]],
  ['BLUE_HOUSE', ['11,4'], 'WRITING DESK', [
    'A dictionary, a thesaurus and a deck of cards. Solitaire keeps the small mind busy so the big one can work.',
    'Not his. A friend left them and he will not move them.',
  ]],
  ['BLUE_HOUSE', ['14,8'], 'TABLE', [
    'Shells, bottles, a brass compass. He never bought one thing when he could buy the whole shelf.',
  ]],
  ['FORGE', ['4,2'], 'BELLOWS', [
    'A leather bellows. One good breath and the whole fire changes its mind.',
  ]],
  ['LUNCH_COUNTER', ['3,3', '4,3', '6,3', '8,3', '9,3', '10,3', '12,3'], 'LUNCH COUNTER', [
    'Formica, coffee rings, a napkin with half a poem on it. He gets an hour. He uses all of it.',
  ]],
  ['LUNCH_COUNTER', ['7,3'], 'SANDWICH', [
    'A liver sausage sandwich, one bite gone. Lunch is a poem if you write it down fast enough.',
  ]],
  ['LUNCH_COUNTER', ['2,6', '3,6', '2,9'], 'BOOTH', [
    'A booth with a cold plate on the table. Somebody ate the plums. They were delicious, apparently.',
  ]],
  ['NIGHTINGALE', ['7,2', '7,3', '7,4'], 'STAGE RAIL', [
    'A brass rail between the stage and everybody else. It has been leaned on by people about to be famous.',
  ]],
  ['NIGHTINGALE', ['11,3', '12,3', '13,3'], 'THE BAR', [
    'The bar. Sticky in the good places. The blues come free with the second drink.',
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
    'Drowned in the Irish Sea. The stone is here. He is not.',
  ] },
  'GRAVEYARD:10,9': { name: 'LUCY', lines: [
    "'But she is in her grave, and, oh, / The difference to me!'",
    'She lived unknown, and few could know when she ceased to be. One did. He wrote five poems.',
  ] },
  'GRAVEYARD:3,10': { name: 'THE LADY OF SHALOTT', lines: [
    "'She has a lovely face; / God in his mercy lend her grace.'",
    'She looked out the window once. That was all it took.',
  ] },
  'GRAVEYARD:3,8': { name: 'PORPHYRIA', lines: [
    "'And all night long we have not stirred, / And yet God has not said a word!'",
    'Do not ask her lover how it happened. He will tell you, calmly, and that is the problem.',
  ] },
  'GRAVEYARD:13,8': { name: 'BARBARA ALLEN', lines: [
    "'Sweet William died for me today, / I'll die for him tomorrow.'",
    'A rose grows from one grave and a briar from the other. They have tied themselves in a knot.',
  ] },
  'GRAVEYARD:4,9': { name: 'LUCINDA MATLOCK', lines: [
    "'It takes life to love Life.'",
    'Spoon River. Ninety-six years, twelve children, and no patience for your complaining.',
  ] },
  'GRAVEYARD:12,9': { name: 'THE ALBATROSS', lines: [
    "'Instead of the cross, the Albatross / About my neck was hung.'",
    'A very small stone. Somebody with a long grey beard keeps leaving flowers and stopping wedding guests.',
  ] },
  'GRAVEYARD:4,10': { name: 'SELIMA', lines: [
    "'Not all that tempts your wand'ring eyes / And heedless hearts, is lawful prize.'",
    "A favourite cat, drowned in a tub of goldfishes. 'Nor all that glisters, gold.'",
  ] },
  // Read through the railings (the yard itself cannot be walked into): north fence at 27,4
  // and 30,4, south fence at 30,8. The stones stand at 27,5 / 30,5 / 29,6.
  'TREELINE:27,4': { name: 'ONE WHO DIED FOR BEAUTY', lines: [
    "'I died for Beauty, but was scarce / Adjusted in the Tomb.'",
    'The moss has reached the lips and is working on the name.',
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
  NERUDA: 'I have written odes to socks and onions, Reader. I have none for the unready. Finish {season} first.',
  LORCA: 'The duende does not come because you knocked. It comes when you have bled a little. Finish {season}.',
  ANGELOU: "You'll get here. I can see that from the way you walk. But not today. Finish {season} first.",
  BLAKE: 'No bird soars too high if he soars with his own wings. Yours are still wet. Finish {season}.',
  BASHO: 'You took a shortcut. The road noticed. Walk {season} to its end, then come sit.',
  LI_BAI: 'Sit. Drink. But no duel. The moon tells me you have not finished {season}, and the moon does not gossip.',
  SOR_JUANA: 'They made me wait a lifetime for a library. You can wait for a duel. Finish {season}.',
  BUKOWSKI: "Kid, you haven't earned the hangover yet. Go finish {season}. I'll be here. I'm always here.",
  FROST: 'You have promises to keep, and miles to go before we duel. Finish {season}.',
  DICKINSON: 'I could not stop for you today. {season} is not finished with you. Come back when it is.',
  POE: 'The raven says not yet. It is a small vocabulary, but it has never once been wrong. Finish {season}.',
  PLATH: 'The bees are not ready for you. Neither am I. Finish {season} first.',
  SAPPHO: 'The apple is on the top bough for a reason. Finish {season}, then reach.',
  KEATS: 'I have less time than anyone on this mountain, and still I will make you wait. Finish {season}.',
  SHAKESPEARE: 'Ripeness is all, Reader, and thou art green. Finish {season}.',
  DANTE: 'There is an order to these things. I wrote it down, in three volumes. Finish {season} first.',
};
