import { describe, it, expect } from 'vitest';
import { fuzzyMatchName, fuzzyMatchNames } from '../fuzzy-match';
import {
  normalizeName,
  normalizeArabicName,
  generatePhoneticCodes,
  splitNameTokens,
} from '../name-normalizer';

// ---- Name Normalizer Tests ----

describe('normalizeName', () => {
  it('converts to lowercase and trims', () => {
    expect(normalizeName('  JOHN SMITH  ')).toBe('john smith');
  });

  it('removes diacritics', () => {
    expect(normalizeName('José García')).toBe('jose garcia');
  });

  it('removes honorifics', () => {
    expect(normalizeName('Dr. John Smith')).toBe('john smith');
    expect(normalizeName('Sheikh Ahmed Hassan')).toBe('ahmed hassan');
    expect(normalizeName('General Muhammad Ali')).toBe('muhammad ali');
  });

  it('removes name prefixes (al-, el-, bin, ibn, abu)', () => {
    const result = normalizeName('Mohammed Al-Rahman');
    expect(result).not.toContain('al');
    expect(result).toContain('mohammed');
    expect(result).toContain('rahman');
  });

  it('removes punctuation', () => {
    expect(normalizeName("O'Brien-Smith")).toBe('obrien smith');
  });

  it('collapses multiple spaces', () => {
    expect(normalizeName('John   Michael   Smith')).toBe('john michael smith');
  });
});

describe('normalizeArabicName', () => {
  it('maps Mohammed variants to muhammad', () => {
    expect(normalizeArabicName('mohammed')).toBe('muhammad');
    expect(normalizeArabicName('mohamed')).toBe('muhammad');
    expect(normalizeArabicName('mohammad')).toBe('muhammad');
  });

  it('maps Ahmed variants to ahmad', () => {
    expect(normalizeArabicName('ahmed')).toBe('ahmad');
    expect(normalizeArabicName('ahmet')).toBe('ahmad');
  });

  it('maps Hussein variants to husayn', () => {
    expect(normalizeArabicName('hussein')).toBe('husayn');
    expect(normalizeArabicName('hussain')).toBe('husayn');
  });

  it('maps Osama to usama', () => {
    expect(normalizeArabicName('osama')).toBe('usama');
  });

  it('maps Abdul variants to abd', () => {
    expect(normalizeArabicName('abdul')).toBe('abd');
    expect(normalizeArabicName('abdel')).toBe('abd');
  });

  it('maps Hassan to hasan', () => {
    expect(normalizeArabicName('hassan')).toBe('hasan');
  });

  it('maps Laden to ladin', () => {
    expect(normalizeArabicName('laden')).toBe('ladin');
  });

  it('leaves non-variant names unchanged', () => {
    expect(normalizeArabicName('john')).toBe('john');
    expect(normalizeArabicName('smith')).toBe('smith');
  });
});

describe('generatePhoneticCodes', () => {
  it('returns soundex and metaphone codes for each token', () => {
    const codes = generatePhoneticCodes('John Smith');
    expect(codes.soundex).toHaveLength(2);
    expect(codes.metaphone).toHaveLength(2);
  });

  it('returns consistent codes for the same input', () => {
    const a = generatePhoneticCodes('Smith');
    const b = generatePhoneticCodes('Smith');
    expect(a.soundex).toEqual(b.soundex);
    expect(a.metaphone).toEqual(b.metaphone);
  });

  it('generates valid Soundex codes (letter + 3 digits)', () => {
    const codes = generatePhoneticCodes('Robert');
    expect(codes.soundex[0]).toMatch(/^[A-Z]\d{3}$/);
  });
});

describe('splitNameTokens', () => {
  it('splits on whitespace', () => {
    expect(splitNameTokens('John Michael Smith')).toEqual(['John', 'Michael', 'Smith']);
  });

  it('handles multiple spaces', () => {
    expect(splitNameTokens('John   Smith')).toEqual(['John', 'Smith']);
  });

  it('returns empty array for empty string', () => {
    expect(splitNameTokens('')).toEqual([]);
  });
});

// ---- Fuzzy Match Tests ----

describe('fuzzyMatchName', () => {
  describe('exact matches', () => {
    it('returns score 1.0 for identical names', () => {
      const result = fuzzyMatchName('John Smith', 'John Smith');
      expect(result).not.toBeNull();
      expect(result!.score).toBe(1.0);
      expect(result!.matchType).toBe('exact');
    });

    it('handles case/whitespace normalization as exact', () => {
      const result = fuzzyMatchName('JOHN SMITH', 'john smith');
      expect(result).not.toBeNull();
      expect(result!.score).toBe(1.0);
      expect(result!.matchType).toBe('exact');
    });
  });

  describe('Arabic name variants', () => {
    it('Mohammed Al-Rahman vs Muhammad Al Rahman >= 0.9', () => {
      const result = fuzzyMatchName('Mohammed Al-Rahman', 'Muhammad Al Rahman');
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThanOrEqual(0.9);
    });

    it('Osama bin Laden vs Usama bin Ladin >= 0.85', () => {
      const result = fuzzyMatchName('Osama bin Laden', 'Usama bin Ladin');
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThanOrEqual(0.85);
    });

    it('Ahmed Hassan vs Ahmad Hasan >= 0.9', () => {
      const result = fuzzyMatchName('Ahmed Hassan', 'Ahmad Hasan');
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThanOrEqual(0.9);
    });

    it('Hussein vs Hussain matches well', () => {
      const result = fuzzyMatchName('Hussein', 'Hussain');
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThanOrEqual(0.9);
    });

    it('Abdul Rahman vs Abdel Rahman matches well', () => {
      const result = fuzzyMatchName('Abdul Rahman', 'Abdel Rahman');
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThanOrEqual(0.9);
    });
  });

  describe('phonetic matches', () => {
    it('Mikhail vs Michael >= 0.7', () => {
      const result = fuzzyMatchName('Mikhail', 'Michael');
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThanOrEqual(0.7);
    });

    it('Sergei vs Sergey >= 0.8', () => {
      const result = fuzzyMatchName('Sergei', 'Sergey');
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThanOrEqual(0.8);
    });
  });

  describe('name reordering', () => {
    it('Smith John vs John Smith >= 0.9', () => {
      const result = fuzzyMatchName('Smith John', 'John Smith');
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThanOrEqual(0.9);
    });

    it('handles three-part name reordering', () => {
      const result = fuzzyMatchName('Smith John Michael', 'John Michael Smith');
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThanOrEqual(0.8);
    });
  });

  describe('partial matches', () => {
    it('John vs John Smith has moderate score', () => {
      const result = fuzzyMatchName('John', 'John Smith', { threshold: 0.5 });
      expect(result).not.toBeNull();
      expect(result!.score).toBeGreaterThanOrEqual(0.5);
      expect(result!.score).toBeLessThan(0.8);
    });
  });

  describe('non-matches', () => {
    it('John Smith vs Jane Doe returns null', () => {
      const result = fuzzyMatchName('John Smith', 'Jane Doe');
      expect(result).toBeNull();
    });

    it('Ahmed Hassan vs Bob Wilson returns null', () => {
      const result = fuzzyMatchName('Ahmed Hassan', 'Bob Wilson');
      expect(result).toBeNull();
    });

    it('completely different names return null', () => {
      const result = fuzzyMatchName('Alexander Petrov', 'Wang Xiaoming');
      expect(result).toBeNull();
    });
  });

  describe('threshold configuration', () => {
    it('respects custom threshold', () => {
      // This pair should be above 0.5 but potentially below 0.9
      const lowThreshold = fuzzyMatchName('Jon', 'John', { threshold: 0.5 });
      expect(lowThreshold).not.toBeNull();

      const highThreshold = fuzzyMatchName('Jon', 'John', { threshold: 0.99 });
      expect(highThreshold).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles empty strings', () => {
      const result = fuzzyMatchName('', '');
      expect(result).not.toBeNull();
      expect(result!.score).toBe(1.0);
    });

    it('handles names with diacritics', () => {
      const result = fuzzyMatchName('José García', 'Jose Garcia');
      expect(result).not.toBeNull();
      expect(result!.score).toBe(1.0);
    });

    it('handles names with honorifics', () => {
      const result = fuzzyMatchName('Dr. John Smith', 'John Smith');
      expect(result).not.toBeNull();
      expect(result!.score).toBe(1.0);
    });
  });
});

// ---- Batch Matching Tests ----

describe('fuzzyMatchNames', () => {
  const candidates = [
    'John Smith',
    'Jane Doe',
    'Muhammad Al Rahman',
    'Ahmad Hassan',
    'Bob Wilson',
  ];

  it('returns matches sorted by score descending', () => {
    const results = fuzzyMatchNames('Mohammed Al-Rahman', candidates);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].candidate).toBe('Muhammad Al Rahman');

    for (let i = 1; i < results.length; i++) {
      expect(results[i].score).toBeLessThanOrEqual(results[i - 1].score);
    }
  });

  it('excludes results below threshold', () => {
    const results = fuzzyMatchNames('John Smith', candidates, { threshold: 0.95 });
    // Only exact match should pass
    expect(results.length).toBe(1);
    expect(results[0].candidate).toBe('John Smith');
  });

  it('returns empty array when no matches', () => {
    const results = fuzzyMatchNames('Completely Unrelated Name', candidates);
    // All should be below default threshold
    for (const r of results) {
      expect(r.score).toBeGreaterThanOrEqual(0.6);
    }
  });

  it('handles empty candidates array', () => {
    const results = fuzzyMatchNames('John Smith', []);
    expect(results).toEqual([]);
  });
});
