// tslint:disable
/* eslint-disable */

/**
 * poetryEngine.ts
 * Core rule-based poetry engine supporting:
 * 1. Haiku (5-7-5 syllables) — Mentor Matsuo (Lotus Pond)
 * 2. Limerick (AABBA rhyme scheme) — Mentor Edward (Tavern Hearth)
 * 3. Cinquain (2-4-6-8-2 syllables) — Mentor Clara (Garden Herbarium)
 */

export type PoeticFormId = 'HAIKU' | 'LIMERICK' | 'CINQUAIN';

export interface PoeticFormSpec {
  id: PoeticFormId;
  name: string;
  structureLabel: string;
  mentorName: string;
  mentorTitle: string;
  mentorLocation: string;
  mentorAvatar: string;
  mentorSeal: string;
  sealColor: string;
  themeColor: string;
  lineCount: number;
  syllableTarget?: number[];
  rhymeScheme?: string[];
  explanation: string;
  exampleTitle: string;
  exampleLines: string[];
  exampleExplanation: string;
  writingTips: string[];
  suggestedThemes: string[];
  sampleStarters: Array<{ title: string; lines: string[] }>;
}

export interface UserComposedPoem {
  id: string;
  formId: PoeticFormId;
  title: string;
  lines: string[];
  author: string;
  mentorName: string;
  location: string;
  seal: string;
  sealColor: string;
  timestamp: number;
}

export interface ValidationResult {
  isValid: boolean;
  overallFeedback: string;
  mentorReaction: 'PASSED' | 'FAILED';
  lineResults: Array<{
    lineIndex: number;
    text: string;
    syllables: number;
    targetSyllables?: number;
    rhymeTag?: string;
    rhymeGroup?: string;
    isSyllableValid?: boolean;
    isRhymeValid?: boolean;
    feedback?: string;
  }>;
}

// ============================================================================
// 1. ROBUST SYLLABLE COUNTING ALGORITHM
// ============================================================================

// Known irregular words / contractions dictionary
const SYLLABLE_OVERRIDES: Record<string, number> = {
  // 1 syllable
  the: 1, a: 1, an: 1, and: 1, or: 1, but: 1, in: 1, on: 1, at: 1, to: 1, for: 1, of: 1, with: 1,
  by: 1, from: 1, up: 1, down: 1, through: 1, though: 1, thought: 1, brought: 1, night: 1, light: 1,
  bright: 1, sight: 1, heart: 1, soul: 1, frog: 1, pond: 1, splash: 1, leap: 1, jump: 1, leaf: 1,
  tree: 1, stone: 1, moon: 1, sun: 1, star: 1, stream: 1, breeze: 1, wind: 1, sky: 1, sea: 1,
  fire: 1, flame: 1, time: 1, rhyme: 1, line: 1, word: 1, verse: 1, quill: 1, ink: 1, bard: 1,
  drake: 1, lake: 1, sake: 1, make: 1, take: 1, break: 1, dream: 1, spring: 1, fall: 1, sound: 1,
  green: 1, cool: 1, soft: 1, deep: 1, dark: 1, wild: 1, bloom: 1, rose: 1, herb: 1, vine: 1,

  // 2 syllables
  haiku: 2, limerick: 3, cinquain: 2, poet: 2, poetry: 3, poem: 2, quiet: 2, silence: 2,
  water: 2, river: 2, ripple: 2, ripples: 2, ocean: 2, meadow: 2, garden: 2, lotus: 2,
  blossom: 2, petals: 2, morning: 2, evening: 2, twilight: 2, midnight: 2, autumn: 2,
  winter: 2, summer: 2, nature: 2, beauty: 2, ancient: 2, sudden: 2, gentle: 2, softly: 2,
  peaceful: 2, yellow: 2, scarlet: 2, crimson: 2, golden: 2, silver: 2, tavern: 2, hearth: 1,
  whisper: 2, shadow: 2, feather: 2, paper: 2, stanzas: 2, music: 2, rhythm: 2, cadence: 2,
  unfold: 2, delight: 2, inspire: 2, herbarium: 4, botanical: 4,

  // 3 syllables
  beautiful: 3, dragonfly: 3, butterfly: 3, melodious: 4, harmony: 3, emerald: 3,
  solitude: 3, memory: 3, forgotten: 3, radiant: 3, delicate: 3, listening: 3,
  unfolding: 3, blossoming: 3, evergreen: 3,
};

/**
 * Counts syllables in an individual word using rule-based linguistics:
 * - Diphthongs and vowel groups
 * - Silent trailing 'e' (handling 'le', 'ee', etc.)
 * - '-ed', '-es' word endings
 */
export function countWordSyllables(rawWord: string): number {
  if (!rawWord) return 0;
  const word = rawWord.toLowerCase().replace(/[^a-z']/g, '').trim();
  if (!word) return 0;

  // Dictionary override
  if (SYLLABLE_OVERRIDES[word] !== undefined) {
    return SYLLABLE_OVERRIDES[word];
  }

  // Short words (<= 3 chars) usually have 1 syllable
  if (word.length <= 3) return 1;

  let cleaned = word;

  // Handle special endings
  // -le (apple, table, ripple) counts as syllable if preceded by consonant
  let leBonus = 0;
  if (/[bcdfghjklmnpqrstvwxyz]le$/.test(cleaned) && !/([aeiou])le$/.test(cleaned)) {
    leBonus = 1;
    cleaned = cleaned.replace(/le$/, '');
  }

  // Remove silent trailing 'e' (make, home, stone, but not ee/ye)
  if (cleaned.endsWith('e') && !cleaned.endsWith('ee') && !cleaned.endsWith('ye') && cleaned.length > 2) {
    cleaned = cleaned.slice(0, -1);
  }

  // Remove non-syllabic '-ed' (walked, jumped, played, unless preceded by t or d)
  if (cleaned.endsWith('ed') && !cleaned.endsWith('ted') && !cleaned.endsWith('ded') && cleaned.length > 3) {
    cleaned = cleaned.slice(0, -2);
  }

  // Remove '-es' unless preceded by s, z, x, ch, sh
  if (cleaned.endsWith('es') && !/[szx]|ch|sh/i.test(cleaned.slice(-4, -2)) && cleaned.length > 3) {
    cleaned = cleaned.slice(0, -2);
  }

  // Count vowel groups (including 'y' as vowel if not first letter)
  const vowelGroupMatches = cleaned.match(/[aeiouy]{1,2}/g);
  let count = vowelGroupMatches ? vowelGroupMatches.length : 0;

  // Add leBonus
  count += leBonus;

  // Minimum 1 syllable for any word containing letters
  return Math.max(1, count);
}

/**
 * Counts total syllables across a line of text.
 */
export function countLineSyllables(line: string): number {
  if (!line || !line.trim()) return 0;
  const words = line
    .trim()
    .split(/\s+/)
    .filter((w) => w.replace(/[^a-zA-Z]/g, '').length > 0);

  return words.reduce((total, word) => total + countWordSyllables(word), 0);
}

// ============================================================================
// 2. RHYME EXTRACTION & PHONETIC COMPARISON
// ============================================================================

/**
 * Extracts phonetic rhyming suffix of the final word in a line.
 */
export function extractLineRhymeKey(line: string): string {
  if (!line || !line.trim()) return '';
  const words = line
    .trim()
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return '';
  const lastWord = words[words.length - 1];

  // Specific phonetic sound normalization map
  const phoneticMap: Array<{ pattern: RegExp; key: string }> = [
    // Long I / Y (time, rhyme, chime, sublime, climb)
    { pattern: /(?:ime|yme|imb)$/, key: 'IME' },
    { pattern: /(?:ight|ite|yte)$/, key: 'ITE' },
    { pattern: /(?:ine|ign)$/, key: 'INE' },
    { pattern: /(?:ire|yre|yre)$/, key: 'IRE' },
    { pattern: /(?:ide|yed)$/, key: 'IDE' },
    { pattern: /(?:y|ie|ye|igh)$/, key: 'EYE' },

    // Long A (day, play, say, sway, weigh, grey)
    { pattern: /(?:ay|ey|eigh|ai)$/, key: 'AY' },
    { pattern: /(?:ake|eak)$/, key: 'AKE' },
    { pattern: /(?:ame|aim)$/, key: 'AME' },
    { pattern: /(?:ate|ait|eight)$/, key: 'ATE' },
    { pattern: /(?:ain|ane|eign)$/, key: 'AIN' },
    { pattern: /(?:ace|ase)$/, key: 'ACE' },

    // Long E (sea, tree, bee, plea, me)
    { pattern: /(?:ee|ea|ey|ie)$/, key: 'EE' },
    { pattern: /(?:eet|eat)$/, key: 'EET' },
    { pattern: /(?:eep|eap)$/, key: 'EEP' },
    { pattern: /(?:eed|ead)$/, key: 'EED' },

    // Long O (glow, slow, flow, though, so, doe)
    { pattern: /(?:ow|oe|ough|oh|o)$/, key: 'OH' },
    { pattern: /(?:old|ould)$/, key: 'OLD' },
    { pattern: /(?:ote|oat)$/, key: 'OTE' },
    { pattern: /(?:one|own)$/, key: 'ONE' },

    // Short sounds & common endings
    { pattern: /(?:ond|awnd)$/, key: 'OND' },
    { pattern: /(?:art|eart)$/, key: 'ART' },
    { pattern: /(?:ound|ownd)$/, key: 'OUND' },
    { pattern: /(?:ing)$/, key: 'ING' },
    { pattern: /(?:all|all)$/, key: 'ALL' },
    { pattern: /(?:ook)$/, key: 'OOK' },
    { pattern: /(?:un|unn)$/, key: 'UN' },
    { pattern: /(?:at|att)$/, key: 'AT' },
    { pattern: /(?:ar|arr)$/, key: 'AR' },
    { pattern: /(?:ool|ule)$/, key: 'OOL' },
    { pattern: /(?:op|opp)$/, key: 'OP' },
    { pattern: /(?:ear|eer|ier)$/, key: 'EER' },
    { pattern: /(?:air|are|ear)$/, key: 'AIR' },
  ];

  for (const { pattern, key } of phoneticMap) {
    if (pattern.test(lastWord)) return key;
  }

  // Fallback: extract trailing vowel+consonants (last 2-3 characters)
  const fallbackMatch = lastWord.match(/[aeiouy][a-z]{1,3}$/);
  if (fallbackMatch) {
    return fallbackMatch[0].toUpperCase();
  }

  return lastWord.slice(-3).toUpperCase();
}

/**
 * Checks if two rhyme keys or ending words rhyme.
 */
export function checkLinesRhyme(line1: string, line2: string): boolean {
  const k1 = extractLineRhymeKey(line1);
  const k2 = extractLineRhymeKey(line2);
  if (!k1 || !k2) return false;
  if (k1 === k2) return true;

  // Suffix fallback: if last 2 characters match identically
  const w1 = line1.trim().toLowerCase().replace(/[^a-z]/g, '');
  const w2 = line2.trim().toLowerCase().replace(/[^a-z]/g, '');
  if (w1.length >= 2 && w2.length >= 2 && w1.slice(-2) === w2.slice(-2)) {
    return true;
  }

  return false;
}

// ============================================================================
// 3. THE 3 FORMS & MENTORS SPECIFICATION
// ============================================================================

export const POETIC_FORMS: Record<PoeticFormId, PoeticFormSpec> = {
  HAIKU: {
    id: 'HAIKU',
    name: 'Haiku',
    structureLabel: '5-7-5 Syllables (3 Lines)',
    mentorName: 'Master Matsuo',
    mentorTitle: 'Zen Haiku Master',
    mentorLocation: 'Lotus Pond & Bamboo Springs',
    mentorAvatar: 'BASHO',
    mentorSeal: 'Lotus Zen Seal 🪷',
    sealColor: '#059669',
    themeColor: '#10B981',
    lineCount: 3,
    syllableTarget: [5, 7, 5],
    explanation:
      'A Haiku captures a fleeting moment of nature in 3 distilled lines: exactly 5 syllables in Line 1, 7 in Line 2, and 5 in Line 3. Listen to the natural cadence of each beat.',
    exampleTitle: 'The Ancient Pond (Matsuo)',
    exampleLines: [
      'An ancient green pond,',
      'A frog leaps into water,',
      'Sound of cool ripples.',
    ],
    exampleExplanation:
      'Line 1 has 5 beats (An-an-cient-green-pond), Line 2 has 7 beats (A-frog-leaps-in-to-wa-ter), and Line 3 has 5 beats (Sound-of-cool-rip-ples).',
    writingTips: [
      'Focus on a sensory image: water, rain, blossoms, moonlight, or wind.',
      'Check your beat counts with our live syllable counter beside each line!',
      'Line 1: 5 beats • Line 2: 7 beats • Line 3: 5 beats.',
    ],
    suggestedThemes: ['Lotus Pond', 'Bamboo Wind', 'Morning Mist', 'Autumn Moon', 'Summer Rain'],
    sampleStarters: [
      {
        title: 'Morning Lotus',
        lines: ['Soft pink lotus blooms,', 'Dewdrops fall upon the pond,', 'Morning sunlight warms.'],
      },
      {
        title: 'Bamboo Whisper',
        lines: ['Green bamboo bends low,', 'Whispering in summer breeze,', 'Peaceful quiet glade.'],
      },
    ],
  },

  LIMERICK: {
    id: 'LIMERICK',
    name: 'Limerick',
    structureLabel: 'A-A-B-B-A Rhyme Scheme (5 Lines)',
    mentorName: 'Edward the Bard',
    mentorTitle: 'Tavern Limerick Bard',
    mentorLocation: 'The Quill & Ink Salon Hearth',
    mentorAvatar: 'BLAKE',
    mentorSeal: 'Tavern Hearth Seal 🍻',
    sealColor: '#D97706',
    themeColor: '#FFDE00',
    lineCount: 5,
    rhymeScheme: ['A', 'A', 'B', 'B', 'A'],
    explanation:
      'A Limerick is a lively, humorous five-line song! Lines 1, 2, and 5 share the "A" rhyme, while lines 3 and 4 are shorter and share the "B" rhyme.',
    exampleTitle: 'The Writer by the Hearth',
    exampleLines: [
      'There once was a writer of rhyme,',
      'Who fancied a verse in good time.',
      'He sat by the fire,',
      'To tune up his lyre,',
      'And crafted a rhythm sublime!',
    ],
    exampleExplanation:
      'Lines 1, 2, and 5 end on matching "A" rhymes ("rhyme", "time", "sublime"). Lines 3 and 4 end on "B" rhymes ("fire", "lyre").',
    writingTips: [
      'Lines 1, 2, and 5 must rhyme together (e.g., play / day / stay).',
      'Lines 3 and 4 are short and punchy, rhyming with each other (e.g., bright / night).',
      'Watch the live rhyme badges to make sure both A and B rhyme groups match!',
    ],
    suggestedThemes: ['The Cozy Tavern', 'The Wandering Bard', 'Spilled Black Ink', 'The Lost Goose Quill'],
    sampleStarters: [
      {
        title: 'The Scribe in Town',
        lines: [
          'A traveler walked into town,',
          'With neither a worry nor frown.',
          'With paper and ink,',
          'He stopped for a drink,',
          'And wrote the whole history down!',
        ],
      },
    ],
  },

  CINQUAIN: {
    id: 'CINQUAIN',
    name: 'Cinquain',
    structureLabel: '2-4-6-8-2 Syllable Pyramid (5 Lines)',
    mentorName: 'Clara the Herbalist',
    mentorTitle: 'Herbarium Cinquain Poet',
    mentorLocation: 'The Botanical Greenhouse Atrium',
    mentorAvatar: 'PLATH',
    mentorSeal: 'Botanical Blossom Seal 🌸',
    sealColor: '#3B4CCA',
    themeColor: '#3B4CCA',
    lineCount: 5,
    syllableTarget: [2, 4, 6, 8, 2],
    explanation:
      'A Cinquain is an elegant 5-line syllable pyramid: 2, 4, 6, 8, and 2 beats. It builds step by step to a rich climax before a gentle two-beat closing.',
    exampleTitle: 'Botanical Blossom (Clara)',
    exampleLines: [
      'Blossom,',
      'Unfolding slow,',
      'Reaching into the light,',
      'Petals aglow in morning sun,',
      'Bloom bright.',
    ],
    exampleExplanation:
      'Line 1 has 2 beats (Blos-som). Line 2 has 4 (Un-fold-ing-slow). Line 3 has 6 (Reach-ing-in-to-the-light). Line 4 has 8 (Pet-als-a-glow-in-morn-ing-sun). Line 5 has 2 (Bloom-bright).',
    writingTips: [
      'Line 1: 2 beats (The Subject)',
      'Line 2: 4 beats (Description)',
      'Line 3: 6 beats (Action or movement)',
      'Line 4: 8 beats (Feeling or vivid imagery)',
      'Line 5: 2 beats (Summary or gentle close)',
    ],
    suggestedThemes: ['Herb Garden', 'Night Sky', 'Quiet River', 'Ancient Oak', 'Golden Flame'],
    sampleStarters: [
      {
        title: 'Morning Lavender',
        lines: [
          'Purple,',
          'Fresh garden scent,',
          'Waving in gentle breeze,',
          'Droplets of dew upon each leaf,',
          'Pure peace.',
        ],
      },
    ],
  },
};

// ============================================================================
// 4. RULE VALIDATOR WITH PRECISE CONSTRUCTIVE FEEDBACK
// ============================================================================

export function validatePoemSubmission(
  formId: PoeticFormId,
  title: string,
  lines: string[],
): ValidationResult {
  const spec = POETIC_FORMS[formId];
  const lineResults: ValidationResult['lineResults'] = [];
  const errors: string[] = [];

  // Check empty lines
  const filledLines = lines.map((l) => (l || '').trim());
  const hasEmpty = filledLines.slice(0, spec.lineCount).some((l) => l.length === 0);

  if (!title.trim()) {
    errors.push('Please give your poem a title.');
  }

  if (hasEmpty) {
    errors.push(`Please fill in all ${spec.lineCount} lines of your ${spec.name}.`);
  }

  // --- 1. HAIKU VALIDATION (5-7-5) ---
  if (formId === 'HAIKU') {
    const targets = [5, 7, 5];
    for (let i = 0; i < 3; i++) {
      const text = filledLines[i] || '';
      const count = countLineSyllables(text);
      const target = targets[i];
      const isValid = count === target;

      let feedback = '';
      if (text.length > 0 && count !== target) {
        const diff = count - target;
        if (diff > 0) {
          feedback = `Line ${i + 1} has ${count} beats (${diff} too many). Trim ${diff === 1 ? 'one beat' : `${diff} beats`}!`;
          errors.push(feedback);
        } else {
          const need = -diff;
          feedback = `Line ${i + 1} has ${count} beats (${need} too few). Add ${need === 1 ? 'one beat' : `${need} beats`}!`;
          errors.push(feedback);
        }
      }

      lineResults.push({
        lineIndex: i,
        text,
        syllables: count,
        targetSyllables: target,
        isSyllableValid: isValid,
        feedback,
      });
    }
  }

  // --- 2. LIMERICK VALIDATION (AABBA) ---
  else if (formId === 'LIMERICK') {
    // Extract rhyme keys for all 5 lines
    const rhymeKeys = filledLines.map((l) => extractLineRhymeKey(l));

    // Check A group (Lines 1, 2, 5)
    const k1 = rhymeKeys[0];
    const k2 = rhymeKeys[1];
    const k5 = rhymeKeys[4];

    const a12Match = checkLinesRhyme(filledLines[0], filledLines[1]);
    const a15Match = checkLinesRhyme(filledLines[0], filledLines[4]);
    const a25Match = checkLinesRhyme(filledLines[1], filledLines[4]);
    const aValid = a12Match && (a15Match || a25Match);

    if (filledLines[0] && filledLines[1] && !a12Match) {
      errors.push("Lines 1 and 2 don't rhyme! End them with matching sounds (e.g. 'time' and 'rhyme').");
    }
    if (filledLines[4] && filledLines[0] && !(a15Match || a25Match)) {
      errors.push("Line 5 must rhyme with lines 1 and 2 (the 'A' rhyme family).");
    }

    // Check B group (Lines 3, 4)
    const bMatch = checkLinesRhyme(filledLines[2], filledLines[3]);
    if (filledLines[2] && filledLines[3] && !bMatch) {
      errors.push("Lines 3 and 4 don't rhyme with each other! Give them a shared 'B' rhyme (e.g. 'fire' and 'lyre').");
    }

    for (let i = 0; i < 5; i++) {
      const text = filledLines[i] || '';
      const count = countLineSyllables(text);
      const group = (i === 0 || i === 1 || i === 4) ? 'A' : 'B';
      const isRhymeValid = (group === 'A' ? aValid : bMatch);

      lineResults.push({
        lineIndex: i,
        text,
        syllables: count,
        rhymeTag: rhymeKeys[i] || '—',
        rhymeGroup: group,
        isRhymeValid,
      });
    }
  }

  // --- 3. CINQUAIN VALIDATION (2-4-6-8-2) ---
  else if (formId === 'CINQUAIN') {
    const targets = [2, 4, 6, 8, 2];
    for (let i = 0; i < 5; i++) {
      const text = filledLines[i] || '';
      const count = countLineSyllables(text);
      const target = targets[i];
      const isValid = count === target;

      let feedback = '';
      if (text.length > 0 && count !== target) {
        const diff = count - target;
        if (diff > 0) {
          feedback = `Line ${i + 1} has ${count} beats (${diff} too many). Aim for ${target}!`;
          errors.push(feedback);
        } else {
          const need = -diff;
          feedback = `Line ${i + 1} has ${count} beats (${need} too few). Aim for ${target}!`;
          errors.push(feedback);
        }
      }

      lineResults.push({
        lineIndex: i,
        text,
        syllables: count,
        targetSyllables: target,
        isSyllableValid: isValid,
        feedback,
      });
    }
  }

  const isValid = errors.length === 0;

  let overallFeedback = '';
  if (isValid) {
    if (formId === 'HAIKU') {
      overallFeedback =
        '“Exquisite cadence! Your Haiku ripples with serene stillness. I have stamped it with the Lotus Zen Seal in your Journal and hung it upon the Wishing Branch!”';
    } else if (formId === 'LIMERICK') {
      overallFeedback =
        '“Splendid wit and rollicking rhythm! Your A-A-B-B-A meter sings across the hearth. Stamped with the Tavern Seal and pinned to the village board!”';
    } else {
      overallFeedback =
        '“A breathtaking syllable pyramid! The 2-4-6-8-2 structure blooms with true harmony. Stamped with the Botanical Blossom Seal and preserved in the Herbarium!”';
    }
  } else {
    overallFeedback = errors[0] || 'Check the syllable and rhyme structure of your poem.';
  }

  return {
    isValid,
    overallFeedback,
    mentorReaction: isValid ? 'PASSED' : 'FAILED',
    lineResults,
  };
}
