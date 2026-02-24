import { XMLParser } from 'fast-xml-parser';
import type {
  SanctionsEntry,
  SanctionsAlias,
  SanctionsEntryType,
  ParsedSanctionsList,
} from './types';

const OFAC_SOURCE = 'OFAC_SDN' as const;
const OFAC_SOURCE_URL = 'https://sanctionslist.ofac.treas.gov/';

// ---- OFAC XML shape types ----

interface OfacAka {
  uid: number;
  type: string;
  category: string;
  lastName: string;
  firstName?: string;
}

interface OfacDobItem {
  dateOfBirth: string;
}

interface OfacNationalityItem {
  country: string;
}

interface OfacSdnEntry {
  uid: number;
  lastName: string;
  firstName?: string;
  sdnType: string;
  programList?: { program: string | string[] };
  akaList?: { aka: OfacAka | OfacAka[] };
  dateOfBirthList?: { dateOfBirthItem: OfacDobItem | OfacDobItem[] };
  nationalityList?: { nationality: OfacNationalityItem | OfacNationalityItem[] };
  remarks?: string;
}

interface OfacSdnList {
  sdnList: {
    sdnEntry: OfacSdnEntry[];
    publshInformation?: unknown;
  };
}

// ---- Helpers ----

/** Normalize a value that may be a single item or array into an array. */
function toArray<T>(value: T | T[] | undefined | null): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

/** Map OFAC aka type strings to our alias_type codes. */
function mapAliasType(ofacType: string): string {
  const normalized = ofacType.toLowerCase().replace(/[.\s]/g, '');
  if (normalized === 'aka') return 'aka';
  if (normalized === 'fka') return 'fka';
  if (normalized === 'nka') return 'nka';
  return 'aka'; // default
}

/** Map OFAC sdnType to our entry_type. */
function mapEntryType(sdnType: string): SanctionsEntryType {
  return sdnType.toLowerCase() === 'individual' ? 'individual' : 'entity';
}

/**
 * Attempt to parse an OFAC date string into ISO date format (YYYY-MM-DD).
 * OFAC uses various formats: "01 Jan 1970", "1970", "circa 1965", etc.
 * Returns null if the date cannot be parsed.
 */
function parseOfacDate(dateStr: string): string | null {
  if (!dateStr) return null;

  // Skip approximate/unparseable dates
  if (/circa|approx|between/i.test(dateStr)) return null;

  // Try standard Date parsing
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  // Try year-only
  const yearMatch = dateStr.match(/^(\d{4})$/);
  if (yearMatch) {
    return `${yearMatch[1]}-01-01`;
  }

  return null;
}

/**
 * Build primary_name from OFAC lastName + firstName.
 * For individuals: "lastName, firstName"
 * For entities: just lastName (firstName is typically absent)
 */
function buildPrimaryName(lastName: string, firstName?: string): string {
  if (firstName) {
    return `${lastName}, ${firstName}`;
  }
  return lastName;
}

// ---- Main Parser ----

/**
 * Parse OFAC SDN XML content into normalized sanctions entries and aliases.
 *
 * Handles OFAC XML quirks:
 * - Single-element lists (not wrapped in array)
 * - Missing firstName for entities
 * - Various DOB formats
 * - Absent akaList/programList
 */
export function parseOfacSdnXml(xmlContent: string): ParsedSanctionsList {
  const parser = new XMLParser({
    ignoreAttributes: false,
    isArray: (tagName) => {
      // Force these to always be arrays for consistent handling
      return ['sdnEntry', 'aka', 'program', 'dateOfBirthItem', 'nationality'].includes(tagName);
    },
  });

  const parsed: OfacSdnList = parser.parse(xmlContent);
  const sdnEntries = parsed.sdnList?.sdnEntry ?? [];

  const entries: ParsedSanctionsList['entries'] = [];
  const aliases: ParsedSanctionsList['aliases'] = [];

  for (const sdn of sdnEntries) {
    const sourceId = String(sdn.uid);
    const entryType = mapEntryType(sdn.sdnType);
    const primaryName = buildPrimaryName(sdn.lastName, sdn.firstName);

    // Programs
    const programs = toArray(sdn.programList?.program);

    // Date of birth — take the first parseable one
    const dobItems = toArray(sdn.dateOfBirthList?.dateOfBirthItem);
    let dateOfBirth: string | null = null;
    const unparsedDobs: string[] = [];
    for (const item of dobItems) {
      const parsed = parseOfacDate(item.dateOfBirth);
      if (parsed && !dateOfBirth) {
        dateOfBirth = parsed;
      } else if (!parsed && item.dateOfBirth) {
        unparsedDobs.push(item.dateOfBirth);
      }
    }

    // Nationality — take the first one
    const nationalities = toArray(sdn.nationalityList?.nationality);
    const nationality = nationalities.length > 0 ? nationalities[0].country : null;

    // Remarks — append unparsed DOBs if any
    let remarks = sdn.remarks ?? null;
    if (unparsedDobs.length > 0) {
      const dobNote = `Approximate DOB: ${unparsedDobs.join('; ')}`;
      remarks = remarks ? `${remarks}; ${dobNote}` : dobNote;
    }

    const entry: ParsedSanctionsList['entries'][number] = {
      source: OFAC_SOURCE,
      source_id: sourceId,
      entry_type: entryType,
      primary_name: primaryName,
      first_name: sdn.firstName ?? null,
      last_name: sdn.lastName,
      date_of_birth: dateOfBirth,
      nationality,
      programs,
      remarks,
      source_url: OFAC_SOURCE_URL,
      raw_data: sdn as unknown as Record<string, unknown>,
    };

    entries.push(entry);

    // Aliases
    const akas = toArray(sdn.akaList?.aka);
    for (const aka of akas) {
      const aliasName = buildPrimaryName(aka.lastName, aka.firstName);
      aliases.push({
        entry_id: sourceId, // Temporary — mapped to real UUID during loading
        alias_name: aliasName,
        alias_type: mapAliasType(aka.type),
        alias_quality: aka.category === 'strong' ? 'good' : 'low',
      });
    }
  }

  return { entries, aliases };
}
