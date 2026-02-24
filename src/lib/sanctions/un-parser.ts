import { XMLParser } from 'fast-xml-parser';
import type {
  SanctionsEntryType,
  ParsedSanctionsList,
} from './types';

const UN_SOURCE = 'UN_SECURITY_COUNCIL' as const;
const UN_SOURCE_URL = 'https://scsanctions.un.org/';

// ---- UN XML shape types ----

interface UnAlias {
  QUALITY: string;
  ALIAS_NAME?: string;
}

interface UnDob {
  TYPE_OF_DATE: string;
  DATE?: string;
  YEAR?: string;
  FROM_YEAR?: string;
  TO_YEAR?: string;
}

interface UnNationality {
  VALUE: string;
}

interface UnIndividual {
  DATAID: number;
  FIRST_NAME?: string;
  SECOND_NAME?: string;
  THIRD_NAME?: string;
  UN_LIST_TYPE?: string;
  REFERENCE_NUMBER?: string;
  GENDER?: string;
  DESIGNATION?: string;
  NATIONALITY?: UnNationality | UnNationality[];
  LIST_TYPE?: string;
  INDIVIDUAL_DATE_OF_BIRTH?: UnDob | UnDob[];
  INDIVIDUAL_ALIAS?: UnAlias | UnAlias[];
  COMMENTS1?: string;
}

interface UnEntity {
  DATAID: number;
  FIRST_NAME?: string;
  UN_LIST_TYPE?: string;
  REFERENCE_NUMBER?: string;
  DESIGNATION?: string;
  NATIONALITY?: UnNationality | UnNationality[];
  LIST_TYPE?: string;
  ENTITY_ALIAS?: UnAlias | UnAlias[];
  COMMENTS1?: string;
}

interface UnConsolidatedList {
  CONSOLIDATED_LIST: {
    INDIVIDUALS?: { INDIVIDUAL: UnIndividual | UnIndividual[] };
    ENTITIES?: { ENTITY: UnEntity | UnEntity[] };
  };
}

// ---- Helpers ----

/** Normalize a value that may be a single item or array into an array. */
function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

/** Map UN alias quality to our alias_quality codes. */
function mapAliasQuality(quality: string): string {
  const normalized = quality.toLowerCase();
  if (normalized.includes('good') || normalized === 'a.k.a.') return 'good';
  return 'low';
}

/**
 * Attempt to parse a UN date string into ISO date format (YYYY-MM-DD).
 * Returns null if the date cannot be parsed.
 */
function parseUnDate(dob: UnDob): { date: string | null; remark: string | null } {
  const dateType = dob.TYPE_OF_DATE;

  if (dateType === 'EXACT' && dob.DATE) {
    const parsed = new Date(dob.DATE);
    if (!isNaN(parsed.getTime())) {
      return { date: parsed.toISOString().split('T')[0], remark: null };
    }
  }

  if (dateType === 'APPROXIMATELY') {
    if (dob.DATE) return { date: null, remark: `Approximately ${dob.DATE}` };
    if (dob.YEAR) return { date: null, remark: `Approximately ${dob.YEAR}` };
  }

  if (dateType === 'BETWEEN') {
    const from = dob.FROM_YEAR || dob.DATE || '?';
    const to = dob.TO_YEAR || '?';
    return { date: null, remark: `Between ${from} and ${to}` };
  }

  // Year-only fallback
  if (dob.YEAR) {
    return { date: `${dob.YEAR}-01-01`, remark: null };
  }

  if (dob.DATE) {
    const parsed = new Date(dob.DATE);
    if (!isNaN(parsed.getTime())) {
      return { date: parsed.toISOString().split('T')[0], remark: null };
    }
  }

  return { date: null, remark: null };
}

/**
 * Build primary_name from UN name components.
 * Combines FIRST_NAME + SECOND_NAME + THIRD_NAME.
 */
function buildUnName(first?: string, second?: string, third?: string): string {
  const parts = [second, first, third].filter(Boolean);
  if (parts.length === 0) return 'UNKNOWN';
  // Format as "LastName, FirstName ThirdName" for individuals
  if (second && first) {
    const rest = [first, third].filter(Boolean).join(' ');
    return `${second}, ${rest}`;
  }
  return parts.join(' ');
}

// ---- Main Parser ----

/**
 * Parse UN Security Council consolidated sanctions list XML into normalized entries and aliases.
 *
 * Handles UN XML quirks:
 * - INDIVIDUAL_ALIAS / ENTITY_ALIAS may be single object or array
 * - THIRD_NAME may be absent
 * - INDIVIDUAL_DATE_OF_BIRTH may have only YEAR, not full DATE
 * - NATIONALITY may be object or array
 * - ENTITY entries use FIRST_NAME as the full name
 */
export function parseUnConsolidatedXml(xmlContent: string): ParsedSanctionsList {
  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (tagName) => {
      return [
        'INDIVIDUAL',
        'ENTITY',
        'INDIVIDUAL_ALIAS',
        'ENTITY_ALIAS',
        'INDIVIDUAL_DATE_OF_BIRTH',
      ].includes(tagName);
    },
  });

  const parsed: UnConsolidatedList = parser.parse(xmlContent);

  const entries: ParsedSanctionsList['entries'] = [];
  const aliases: ParsedSanctionsList['aliases'] = [];

  // ---- Parse Individuals ----
  const individuals = toArray(parsed.CONSOLIDATED_LIST?.INDIVIDUALS?.INDIVIDUAL);

  for (const ind of individuals) {
    const sourceId = String(ind.DATAID);
    const primaryName = buildUnName(ind.FIRST_NAME, ind.SECOND_NAME, ind.THIRD_NAME);

    // Programs — use UN_LIST_TYPE
    const programs = ind.UN_LIST_TYPE ? [ind.UN_LIST_TYPE] : [];

    // Date of birth
    const dobItems = toArray(ind.INDIVIDUAL_DATE_OF_BIRTH);
    let dateOfBirth: string | null = null;
    const dobRemarks: string[] = [];
    for (const dob of dobItems) {
      const { date, remark } = parseUnDate(dob);
      if (date && !dateOfBirth) {
        dateOfBirth = date;
      }
      if (remark) {
        dobRemarks.push(remark);
      }
    }

    // Nationality
    const nationalities = toArray(ind.NATIONALITY);
    const nationality = nationalities.length > 0 ? nationalities[0].VALUE : null;

    // Remarks
    let remarks = ind.COMMENTS1 ?? null;
    if (dobRemarks.length > 0) {
      const dobNote = `DOB: ${dobRemarks.join('; ')}`;
      remarks = remarks ? `${remarks}; ${dobNote}` : dobNote;
    }
    if (ind.DESIGNATION) {
      const desigNote = `Designation: ${ind.DESIGNATION}`;
      remarks = remarks ? `${remarks}; ${desigNote}` : desigNote;
    }

    entries.push({
      source: UN_SOURCE,
      source_id: sourceId,
      entry_type: 'individual' as SanctionsEntryType,
      primary_name: primaryName,
      first_name: ind.FIRST_NAME ?? null,
      last_name: ind.SECOND_NAME ?? null,
      date_of_birth: dateOfBirth,
      nationality,
      programs,
      remarks,
      source_url: UN_SOURCE_URL,
      raw_data: ind as unknown as Record<string, unknown>,
    });

    // Aliases
    const indAliases = toArray(ind.INDIVIDUAL_ALIAS);
    for (const alias of indAliases) {
      if (!alias.ALIAS_NAME) continue;
      aliases.push({
        entry_id: sourceId,
        alias_name: alias.ALIAS_NAME,
        alias_type: 'aka',
        alias_quality: mapAliasQuality(alias.QUALITY),
      });
    }
  }

  // ---- Parse Entities ----
  const entities = toArray(parsed.CONSOLIDATED_LIST?.ENTITIES?.ENTITY);

  for (const ent of entities) {
    const sourceId = String(ent.DATAID);
    // Entities use FIRST_NAME as full name
    const primaryName = ent.FIRST_NAME || 'UNKNOWN';

    const programs = ent.UN_LIST_TYPE ? [ent.UN_LIST_TYPE] : [];

    const nationalities = toArray(ent.NATIONALITY);
    const nationality = nationalities.length > 0 ? nationalities[0].VALUE : null;

    let remarks = ent.COMMENTS1 ?? null;
    if (ent.DESIGNATION) {
      const desigNote = `Designation: ${ent.DESIGNATION}`;
      remarks = remarks ? `${remarks}; ${desigNote}` : desigNote;
    }

    entries.push({
      source: UN_SOURCE,
      source_id: sourceId,
      entry_type: 'entity' as SanctionsEntryType,
      primary_name: primaryName,
      first_name: null,
      last_name: primaryName,
      date_of_birth: null,
      nationality,
      programs,
      remarks,
      source_url: UN_SOURCE_URL,
      raw_data: ent as unknown as Record<string, unknown>,
    });

    // Entity aliases
    const entAliases = toArray(ent.ENTITY_ALIAS);
    for (const alias of entAliases) {
      if (!alias.ALIAS_NAME) continue;
      aliases.push({
        entry_id: sourceId,
        alias_name: alias.ALIAS_NAME,
        alias_type: 'aka',
        alias_quality: mapAliasQuality(alias.QUALITY),
      });
    }
  }

  return { entries, aliases };
}
