---
phase: 04-sanctions-identity-screening
plan: 01
status: complete
---

# Plan 04-01 Summary: OFAC SDN Schema, Parser & Loader

## What was built

### 1. Sanctions Database Schema
**File**: `supabase/migrations/004_sanctions_schema.sql`

- **sanctions_entries** table: Unified schema supporting OFAC_SDN, UN_SECURITY_COUNCIL, and PEP sources. Columns for primary_name, first/last name, DOB, nationality, programs (text array), remarks, and raw_data (JSONB).
- **sanctions_aliases** table: AKA/FKA/NKA alternative names linked to entries via foreign key with CASCADE delete.
- **pg_trgm extension** enabled for fuzzy text search.
- **Trigram GIN indexes** on `primary_name` and `alias_name` for efficient fuzzy matching.
- **Unique index** on `(source, source_id)` to support idempotent upserts.
- **RLS** enabled with permissive policies (matching existing project pattern).
- **updated_at trigger** reusing the existing `update_updated_at_column()` function.

### 2. TypeScript Types
**File**: `src/lib/sanctions/types.ts`

Exports:
- `SanctionsListSource` — union type: `'OFAC_SDN' | 'UN_SECURITY_COUNCIL' | 'PEP'`
- `SanctionsEntryType` — `'individual' | 'entity'`
- `SanctionsEntry` — full entry interface with optional aliases
- `SanctionsAlias` — alias interface
- `MatchConfidence` — `'high' | 'medium' | 'low'`
- `SanctionsSearchResult` — search result with score, match_type, confidence
- `ParsedSanctionsList` — parser output type (entries + aliases without DB-generated fields)
- `LoaderResult` — loader outcome (counts, errors, duration)

### 3. Supabase Database Types
**File**: `src/lib/supabase/types.ts` (updated)

Added `sanctions_entries` and `sanctions_aliases` table types (Row/Insert/Update) to the Database interface, enabling typed Supabase client operations.

### 4. OFAC SDN XML Parser
**File**: `src/lib/sanctions/ofac-parser.ts`

- Uses `fast-xml-parser` to parse OFAC SDN XML.
- Handles OFAC quirks: single-element lists normalized to arrays, missing firstName for entities, varied DOB formats, absent akaList/programList.
- Maps AKA types: `"a.k.a."` -> `"aka"`, `"f.k.a."` -> `"fka"`, `"n.k.a."` -> `"nka"`.
- Parses DOBs into ISO format where possible; unparseable dates (circa, approximate) stored in remarks.
- Builds `primary_name` as `"lastName, firstName"` for individuals, just `"lastName"` for entities.
- Stores full original entry in `raw_data` for reference.

### 5. OFAC Data Loader
**File**: `src/lib/sanctions/ofac-loader.ts`

- Upserts entries in batches of 500 on `(source, source_id)` for idempotent re-runs.
- After upserting entries, fetches DB-generated UUIDs to map `source_id` -> `uuid`.
- Deletes existing aliases before re-inserting to avoid duplicates on re-runs.
- Logs progress every 2000 entries.

### 6. CLI Loader Script
**File**: `scripts/load-ofac-sdn.ts`

- Downloads OFAC SDN XML from `https://www.treasury.gov/ofac/downloads/sdn.xml` (follows redirects).
- Parses and loads via the parser + loader modules.
- Prints summary: entry count, alias count, errors, elapsed time.
- Run with: `npx tsx scripts/load-ofac-sdn.ts`

## Dependencies Added
- `fast-xml-parser` — XML parsing for OFAC SDN format

## Verification
- TypeScript compiles cleanly (`npx tsc --noEmit` — zero errors)
- All required types exported from `src/lib/sanctions/types.ts`
- Loader script not run against Supabase (no credentials in CI), but compiles and is structurally verified

## Downstream Impact
- **Plan 04-02** (Fuzzy matching): Will query `sanctions_entries` and `sanctions_aliases` using the trigram indexes created here.
- **Plan 04-03** (UN/PEP): Will reuse the same unified schema and `LoaderResult` type.
- **Plan 04-04** (Screening service): Will import `SanctionsSearchResult` and query these tables.
