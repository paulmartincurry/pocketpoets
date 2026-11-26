// =============================================================================
// LINES WITH JOBS
// -----------------------------------------------------------------------------
// Draft copy, waiting on Paul. Three kinds of line that the mountain was missing:
//
//   WIN_LINES     what a poet says when they have beaten you (the defeat screen).
//   TALK_EXTRAS   bystanders who teach, point, and notice. Each entry is matched
//                 to a speaker by a word in their name.
//                   always  said first, every time (the season lessons)
//                   before  said first until every poet in `who` has joined you
//                           (points you at them)
//                   after   said first once they all have (the place has changed)
//
// Rules for anything added here: the poet's own time and idiom, plain, no jokes,
// nothing that knows it is in a game. A lesson is a remark about weather.
// =============================================================================

export const WIN_LINES: Record<string, string> = {
  WHITMAN: 'Rest, Camerado. We will go again when you are ready.',
  MARY_OLIVER: "It's all right. Go and look at something for a while.",
  DARWISH: 'Sit a moment. There is no shame in it.',
  HUGHES: "That's all right. Come back for the next set.",
  RUMI: 'You are tired. Sit. Tomorrow you will turn more easily.',
  NERUDA: 'Come back when you have eaten something, compañero.',
  LORCA: 'Not tonight. It did not come for you tonight.',
  ANGELOU: "You'll do better, baby. I have no doubt of it.",
  BLAKE: 'Go and look again. You saw only with the eye.',
  BASHO: 'Rest. The road will still be there.',
  LI_BAI: 'Sit. Have a cup. We will try again when the moon is up.',
  SOR_JUANA: 'Go back to your books. I say it kindly.',
  BUKOWSKI: 'Go home, kid. Come back tomorrow.',
  baudelaire: 'Enough for today. Go.',
  FROST: "That'll do for today. Mind the path, it's getting dark.",
  DICKINSON: 'You may go down now. I shall not mind if you come again.',
  POE: 'Go quietly. Close the gate behind you.',
  PLATH: "No. Not yet. Come back when it's finished.",
  THOREAU: "Go home and sleep on it. I'll be here.",
  SAPPHO: 'Go down and rest. The star will rise again tomorrow.',
  SHAKESPEARE: "Go to, friend. Rest thee. We'll have it again.",
  KEATS: 'I am sorry. Come again when you have rested.',
  DANTE: 'You are not ready. Go down, and come back by the right road.',
};

export interface TalkExtra {
  who?: string[];
  always?: string;
  before?: string;
  after?: string;
}

/** Keyed by a word that appears in the speaker's name (upper case). */
export const TALK_EXTRAS: Record<string, TalkExtra> = {
  YEATS: {
    who: ['HUGHES'],
    before: 'If you want Hughes, he is at the Nightingale. I could hear the piano from the street.',
    after: 'Hughes has gone up with you. The street is quieter at night.',
  },
  CATHERINE: {
    who: ['BLAKE'],
    before: 'Mr. Blake is at the press. Mind him, he does not hear when he is working.',
    after: 'Mr. Blake has gone up with you. I am keeping the plates wet.',
  },
  AKHMATOVA: {
    always: 'Winter finishes what autumn begins. In Leningrad it came early.',
  },
  KHAYY: {
    who: ['SOR_JUANA', 'BUKOWSKI'],
    before: 'Sor Juana is in the library. Bukowski is in the Goat. You will have to go in to them.',
    after: 'They have gone with you. The library is dark and the Goat is quiet.',
  },
  GINSBERG: {
    who: ['BUKOWSKI'],
    after: 'He went with you? He never goes anywhere.',
  },
  ELIOT: {
    who: ['SOR_JUANA'],
    after: 'Sor Juana has gone with you. She left the lamp lit.',
  },
  BERRY: {
    who: ['THOREAU'],
    always: 'Spring always gets the better of winter. I have watched for it sixty years and never seen it fail.',
    after: 'Henry went up with you. He left the door open, as he does.',
  },
  DONNE: {
    who: ['POE', 'DICKINSON'],
    before: 'Poe is in the graveyard. Miss Dickinson is in the white house, and seldom comes down.',
    after: 'The graveyard is quiet now. So is the white house.',
  },
  MILTON: {
    who: ['SAPPHO', 'SHAKESPEARE', 'KEATS', 'DANTE'],
    before: 'There are four up here. Sappho first. Then Will, then Keats, then the Florentine.',
    after: 'They have all spoken. I can hear the spring from here.',
  },
};

/** The lines a speaker says first, given who has already joined the Reader. */
export const extraTalkLines = (speakerName: string, capturedIds: string[]): string[] => {
  const name = speakerName.toUpperCase();
  const key = Object.keys(TALK_EXTRAS).find((k) => name.includes(k));
  if (!key) return [];
  const x = TALK_EXTRAS[key];
  const gone = !!x.who && x.who.every((id) => capturedIds.includes(id));
  const out: string[] = [];
  if (gone && x.after) out.push(x.after);
  if (!gone && x.before) out.push(x.before);
  if (x.always) out.push(x.always);
  return out;
};
