// ---- Sanctions List Sources ----

export type SanctionsListSource = 'OFAC_SDN' | 'UN_SECURITY_COUNCIL' | 'PEP';

export type SanctionsEntryType = 'individual' | 'entity';

// ---- Core Data Types ----

export interface SanctionsEntry {
  id: string;
  source: SanctionsListSource;
  source_id: string | null;
  entry_type: SanctionsEntryType;
  primary_name: string;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  nationality: string | null;
  programs: string[];
  remarks: string | null;
  source_url: string | null;
  raw_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  aliases?: SanctionsAlias[];
}

export interface SanctionsAlias {
  id: string;
  entry_id: string;
  alias_name: string;
  alias_type: string | null;
  alias_quality: string | null;
}

// ---- Search Result Types ----

export type MatchConfidence = 'high' | 'medium' | 'low';

export interface SanctionsSearchResult {
  entry: SanctionsEntry;
  match_type: 'exact' | 'fuzzy' | 'phonetic' | 'alias';
  confidence: MatchConfidence;
  score: number; // 0-1 similarity score
  matched_field: string; // which field matched (primary_name, alias, etc.)
  matched_value: string; // the value that matched
}

// ---- Parser Output Types ----

/** Output from parsing a sanctions list file (OFAC XML, UN XML, etc.) */
export interface ParsedSanctionsList {
  entries: Omit<SanctionsEntry, 'id' | 'created_at' | 'updated_at'>[];
  aliases: Omit<SanctionsAlias, 'id'>[];
}

// ---- Loader Types ----

export interface LoaderResult {
  entriesLoaded: number;
  aliasesLoaded: number;
  errors: string[];
  durationMs: number;
}
