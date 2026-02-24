import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screenName, screenIdentity } from '../screening-service';

// ---- Mock Supabase ----

function createChainMock(resolvedValue: { data: unknown[]; error: null } = { data: [], error: null }) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  const methods = ['select', 'or', 'ilike', 'in', 'eq', 'limit', 'order', 'range'];

  for (const method of methods) {
    chain[method] = vi.fn();
  }

  // Every method returns the chain itself so calls can be chained in any order
  for (const method of methods) {
    if (method === 'limit') {
      // limit is terminal — returns the promise
      chain[method].mockResolvedValue(resolvedValue);
    } else {
      chain[method].mockReturnValue(chain);
    }
  }

  return chain;
}

const emptyResult = { data: [], error: null };

vi.mock('../../supabase/server', () => ({
  createServerSupabaseClient: () => ({
    from: () => createChainMock(emptyResult),
  }),
}));

// ---- Tests ----

describe('screenName', () => {
  describe('result structure', () => {
    it('returns a valid ScreeningResult with all required fields', async () => {
      const result = await screenName('Any Name');

      expect(result).toHaveProperty('screened_name');
      expect(result).toHaveProperty('screening_date');
      expect(result).toHaveProperty('total_matches');
      expect(result).toHaveProperty('matches');
      expect(result).toHaveProperty('risk_level');
      expect(result).toHaveProperty('summary');

      expect(typeof result.screened_name).toBe('string');
      expect(typeof result.screening_date).toBe('string');
      expect(typeof result.total_matches).toBe('number');
      expect(Array.isArray(result.matches)).toBe(true);
      expect(['clear', 'potential_match', 'strong_match']).toContain(result.risk_level);
      expect(typeof result.summary).toBe('string');
    });

    it('includes ISO timestamp in screening_date', async () => {
      const result = await screenName('Test Name');
      const date = new Date(result.screening_date);
      expect(date.getTime()).not.toBeNaN();
    });

    it('sets screened_name to the input name', async () => {
      const result = await screenName('John Smith');
      expect(result.screened_name).toBe('John Smith');
    });
  });

  describe('clear results', () => {
    it('returns clear with 0 matches for unknown name', async () => {
      const result = await screenName('John Everyman Smith XII');
      expect(result.risk_level).toBe('clear');
      expect(result.matches.length).toBe(0);
      expect(result.total_matches).toBe(0);
    });

    it('summary indicates no matches found', async () => {
      const result = await screenName('Completely Unique Name');
      expect(result.summary).toContain('No matches found');
    });
  });

  describe('empty/edge cases', () => {
    it('handles empty string without throwing', async () => {
      const result = await screenName('');
      expect(result.risk_level).toBe('clear');
      expect(result.matches).toEqual([]);
    });

    it('handles single character name', async () => {
      const result = await screenName('X');
      expect(result).toBeDefined();
      expect(result.risk_level).toBe('clear');
    });

    it('handles very long name', async () => {
      const longName = 'A'.repeat(500);
      const result = await screenName(longName);
      expect(result).toBeDefined();
      expect(result.risk_level).toBe('clear');
    });
  });
});

describe('screenIdentity', () => {
  describe('result structure', () => {
    it('returns valid ScreeningResult', async () => {
      const result = await screenIdentity({
        fullName: 'Test Person',
      });

      expect(result).toHaveProperty('screened_name');
      expect(result).toHaveProperty('screening_date');
      expect(result).toHaveProperty('total_matches');
      expect(result).toHaveProperty('matches');
      expect(result).toHaveProperty('risk_level');
      expect(result).toHaveProperty('summary');
    });

    it('returns clear for unknown identity', async () => {
      const result = await screenIdentity({
        fullName: 'Unknown Person',
        dateOfBirth: '2000-01-01',
        nationality: 'Canada',
      });

      expect(result.risk_level).toBe('clear');
      expect(result.matches.length).toBe(0);
    });
  });

  describe('DOB and nationality notes', () => {
    it('handles DOB input without errors', async () => {
      const result = await screenIdentity({
        fullName: 'Unknown Person',
        dateOfBirth: '1990-01-01',
      });
      expect(result.risk_level).toBe('clear');
    });

    it('handles nationality input without errors', async () => {
      const result = await screenIdentity({
        fullName: 'Unknown Person',
        nationality: 'Canada',
      });
      expect(result.risk_level).toBe('clear');
    });
  });
});

describe('risk level classification', () => {
  it('clear when no matches above threshold', async () => {
    const result = await screenName('Absolutely Nobody');
    expect(result.risk_level).toBe('clear');
  });
});

describe('source filtering', () => {
  it('accepts source filter option without error', async () => {
    const result = await screenName('Test Name', { sources: ['PEP'] });
    expect(result).toBeDefined();
    expect(result.risk_level).toBe('clear');
  });

  it('accepts multiple source filters', async () => {
    const result = await screenName('Test Name', {
      sources: ['OFAC_SDN', 'UN_SECURITY_COUNCIL'],
    });
    expect(result).toBeDefined();
  });

  it('accepts custom threshold', async () => {
    const result = await screenName('Test Name', { threshold: 0.9 });
    expect(result).toBeDefined();
  });
});

describe('screenIdentity with all fields', () => {
  it('handles identity screening with all fields', async () => {
    const result = await screenIdentity({
      fullName: 'Test Person',
      dateOfBirth: '1980-01-01',
      nationality: 'United States',
      documentNumber: 'A12345678',
    });

    expect(result).toBeDefined();
    expect(result.screened_name).toBe('Test Person');
    expect(result.risk_level).toBe('clear');
  });
});
