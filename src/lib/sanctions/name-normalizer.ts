import { doubleMetaphone } from 'double-metaphone';

// ---- Arabic Transliteration Variants ----

const ARABIC_VARIANTS: Record<string, string> = {
  // Mohammed variants
  mohammed: 'muhammad',
  mohamed: 'muhammad',
  muhammed: 'muhammad',
  mohammad: 'muhammad',
  mohamad: 'muhammad',
  // Ahmed variants
  ahmed: 'ahmad',
  ahmet: 'ahmad',
  // Hussein variants
  hussein: 'husayn',
  husain: 'husayn',
  hussain: 'husayn',
  husein: 'husayn',
  // Osama/Usama
  osama: 'usama',
  // Abdul variants
  abdul: 'abd',
  abdel: 'abd',
  abdoul: 'abd',
  // Compound Abdul names
  abdulrahman: 'abd rahman',
  abdelrahman: 'abd rahman',
  abdulaziz: 'abd aziz',
  abdelaziz: 'abd aziz',
  abdulkarim: 'abd karim',
  abdelkarim: 'abd karim',
  abdulmalik: 'abd malik',
  abdelmalik: 'abd malik',
  abdulhamid: 'abd hamid',
  abdelhamid: 'abd hamid',
  abdallah: 'abd allah',
  abdullah: 'abd allah',
  // Khaled variants
  khaled: 'khalid',
  // Hassan variants
  hassan: 'hasan',
  // Ibrahim variants
  ibraheem: 'ibrahim',
  // Youssef variants
  youssef: 'yusuf',
  yousef: 'yusuf',
  yusuf: 'yusuf',
  yosef: 'yusuf',
  // Ali variants
  aali: 'ali',
  // Ismail variants
  ismail: 'ismail',
  ismael: 'ismail',
  // Nasser variants
  nasser: 'nasir',
  nasir: 'nasir',
  // Omar variants
  umar: 'umar',
  omar: 'umar',
  // Salah variants
  saleh: 'salih',
  salih: 'salih',
  salah: 'salih',
  // Laden/Ladin
  laden: 'ladin',
};

// ---- Honorifics and Titles ----

const HONORIFICS = new Set([
  'dr', 'mr', 'mrs', 'ms', 'miss', 'prof', 'professor',
  'sheikh', 'shaikh', 'haji', 'hajj', 'hajji',
  'general', 'gen', 'colonel', 'col', 'major', 'maj',
  'captain', 'capt', 'lieutenant', 'lt', 'commander', 'cmdr',
  'sir', 'lord', 'lady', 'dame', 'reverend', 'rev',
  'president', 'minister', 'senator', 'ambassador',
  'mullah', 'maulana', 'imam', 'ayatollah',
]);

// ---- Name Prefixes (stored separately, removed from primary matching) ----

// These prefixes are only removed when followed by a hyphen or when they appear
// as standalone tokens before another token (not at the end of the name).
const HYPHENATED_PREFIXES = ['al-', 'el-'];
const STANDALONE_PREFIXES = ['bin', 'ibn', 'abu'];

/**
 * Normalize a name for comparison.
 * Removes diacritics, honorifics, punctuation, and normalizes whitespace.
 */
export function normalizeName(name: string): string {
  let normalized = name.toLowerCase();

  // Remove diacritics/accents
  normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Remove punctuation (periods, commas, hyphens) -- apostrophes join adjacent chars
  normalized = normalized.replace(/["""()]/g, ' ');
  normalized = normalized.replace(/'/g, '');
  normalized = normalized.replace(/[.,\-]/g, ' ');

  // Remove honorifics
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const filtered = tokens.filter((t) => !HONORIFICS.has(t.replace(/\./g, '')));

  normalized = filtered.join(' ');

  // Remove hyphenated prefixes (al-something, el-something)
  for (const prefix of HYPHENATED_PREFIXES) {
    const base = prefix.replace('-', '');
    normalized = normalized.replace(new RegExp(`\\b${base}\\s+(?=\\S)`, 'g'), '');
  }

  // Remove standalone prefixes (bin, ibn, abu) only as separate tokens
  const tokens2 = normalized.split(/\s+/).filter(Boolean);
  const filtered2 = tokens2.filter((t) => !STANDALONE_PREFIXES.includes(t));
  normalized = filtered2.join(' ');

  // Collapse multiple spaces and trim
  normalized = normalized.replace(/\s+/g, ' ').trim();

  return normalized;
}

/**
 * Normalize Arabic name transliteration variants.
 * Apply AFTER normalizeName.
 */
export function normalizeArabicName(name: string): string {
  const tokens = name.split(/\s+/);
  const mapped = tokens.map((token) => ARABIC_VARIANTS[token] ?? token);

  // Some mapped values may contain spaces (e.g., 'abd rahman'), so rejoin and split again
  return mapped.join(' ').replace(/\s+/g, ' ').trim();
}

// ---- Soundex Implementation ----

const SOUNDEX_MAP: Record<string, string> = {
  b: '1', f: '1', p: '1', v: '1',
  c: '2', g: '2', j: '2', k: '2', q: '2', s: '2', x: '2', z: '2',
  d: '3', t: '3',
  l: '4',
  m: '5', n: '5',
  r: '6',
};

function soundex(word: string): string {
  if (!word) return '';

  const upper = word.toUpperCase();
  let result = upper[0];
  let prevCode = SOUNDEX_MAP[upper[0].toLowerCase()] ?? '';

  for (let i = 1; i < upper.length; i++) {
    const code = SOUNDEX_MAP[upper[i].toLowerCase()] ?? '';
    if (code && code !== prevCode) {
      result += code;
      if (result.length === 4) break;
    }
    prevCode = code || prevCode;
  }

  return result.padEnd(4, '0');
}

export interface PhoneticCodes {
  soundex: string[];
  metaphone: string[];
}

/**
 * Generate phonetic codes for each token in a name.
 * Returns Soundex and Double Metaphone codes for each token.
 */
export function generatePhoneticCodes(name: string): PhoneticCodes {
  const tokens = splitNameTokens(name);
  const soundexCodes: string[] = [];
  const metaphoneCodes: string[] = [];

  for (const token of tokens) {
    soundexCodes.push(soundex(token));
    const [primary] = doubleMetaphone(token);
    metaphoneCodes.push(primary);
  }

  return { soundex: soundexCodes, metaphone: metaphoneCodes };
}

/**
 * Split a full name into individual tokens.
 */
export function splitNameTokens(fullName: string): string[] {
  return fullName.split(/\s+/).filter(Boolean);
}
