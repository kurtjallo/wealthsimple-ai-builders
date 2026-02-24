---
phase: 04-sanctions-identity-screening
plan: 03
status: complete
---

# Plan 04-03 Summary: UN Sanctions Parser + PEP Database

## What was built

### 1. UN Security Council Consolidated Sanctions List Parser
**File**: `src/lib/sanctions/un-parser.ts`

- Uses `fast-xml-parser` to parse UN consolidated sanctions XML.
- Handles UN XML quirks: INDIVIDUAL_ALIAS/ENTITY_ALIAS may be single object or array (normalized), THIRD_NAME may be absent, DOB may have only YEAR, NATIONALITY may be object or array.
- Parses both `<INDIVIDUALS>` and `<ENTITIES>` sections.
- Maps INDIVIDUAL entries: combines SECOND_NAME (last) + FIRST_NAME + THIRD_NAME into primary_name formatted as "LastName, FirstName ThirdName".
- Maps ENTITY entries: uses FIRST_NAME as full entity name.
- Programs derived from UN_LIST_TYPE (e.g., "DRC", "CAR", "ISIL").
- DOB handling: EXACT dates parsed to ISO format, APPROXIMATELY and BETWEEN stored in remarks.
- Aliases extracted with quality mapped from UN quality field ("Good"/"a.k.a." -> "good", others -> "low").
- Source set to `'UN_SECURITY_COUNCIL'`, source_url to `https://scsanctions.un.org/`.
- Exports: `parseUnConsolidatedXml(xmlContent: string): ParsedSanctionsList`

### 2. UN Data Loader
**File**: `src/lib/sanctions/un-loader.ts`

- Exact same pattern as `ofac-loader.ts`: batch upsert entries (500 per batch), build source_id->UUID map, delete+reinsert aliases.
- Filters by `source = 'UN_SECURITY_COUNCIL'` when building UUID map.
- Idempotent: safe to re-run without creating duplicates.
- Exports: `loadUnEntries(parsed: ParsedSanctionsList): Promise<LoaderResult>`

### 3. UN CLI Loader Script
**File**: `scripts/load-un-sanctions.ts`

- Downloads UN consolidated XML from `https://scsanctions.un.org/resources/xml/en/consolidated.xml` (follows redirects).
- Parses and loads via un-parser + un-loader modules.
- Prints summary: entry count, alias count, errors, elapsed time.
- Run with: `npx tsx scripts/load-un-sanctions.ts`

### 4. Mock PEP Database
**File**: `src/lib/sanctions/pep-data.ts`

50 fictional PEP entries across all 8 categories:
- **PEP_HEAD_OF_STATE** (4): Hargrove (Canada), Whitfield (UK), Sharma (India), Okonkwo (Nigeria)
- **PEP_SENIOR_POLITICIAN** (6): Thornberry (US), Dubois (France), Brenner (Germany), Al-Rashid (Saudi Arabia), Zhang (China), Mendoza (Brazil)
- **PEP_SENIOR_MILITARY** (8): Harland (US), Petrov (Russia), Moreau (France), Hassan (Pakistan), Tanaka (Japan), MacTavish (UK), Silva (Brazil), Adeyemi (Nigeria)
- **PEP_JUDICIARY** (7): Chen (Canada), Ashworth (UK), Romano (Italy), Richter (Germany), El-Amin (Egypt), Osei (Ghana), Ferreira (Brazil)
- **PEP_SENIOR_EXECUTIVE** (5): Lindqvist (Sweden), Volkov (Russia), Jianhua (China), Bello (Nigeria), Kapoor (India)
- **PEP_INTL_ORG** (5): Van der Berg (Netherlands), Reyes (Mexico), Diallo (Senegal), Johansson (Denmark), Watanabe (Japan)
- **PEP_FAMILY_MEMBER** (8): Linked to primary PEPs via remarks (spouses, children, siblings)
- **PEP_CLOSE_ASSOCIATE** (7): Linked to primary PEPs via remarks (chiefs of staff, advisors, business partners)

10 aliases including:
- Arabic name variants for Al-Rashid and Al-Faisal (both Latin transliterations and Arabic script)
- Chinese name order variant (Zhang Wei / Wei Zhang)
- Russian transliteration variant (Petrov / Petroff)
- Informal name variant (M.C. Dubois)
- Nigerian short form (Bayo Okonkwo)

All entries use `source: 'PEP'`, source_id format `PEP-001` through `PEP-050`, entry_type `'individual'`, with realistic DOBs and nationality.

Exports: `PEP_ENTRIES: PepEntry[]`, `PEP_ALIASES: PepAlias[]`

### 5. PEP CLI Loader Script
**File**: `scripts/load-pep-database.ts`

- Imports PEP_ENTRIES and PEP_ALIASES from pep-data.ts.
- Upserts entries on (source, source_id), deletes+reinserts aliases.
- Prints category distribution summary.
- Run with: `npx tsx scripts/load-pep-database.ts`

## Verification
- TypeScript compiles cleanly (`npx tsc --noEmit` — zero errors)
- All exports match plan requirements: `parseUnConsolidatedXml`, `PEP_ENTRIES`, `PEP_ALIASES`
- PEP_ENTRIES has exactly 50 entries across all 8 categories
- Loader scripts not run against Supabase (no credentials in CI), but compile and are structurally verified
- All three loader scripts are idempotent (upsert on source,source_id)

## Downstream Impact
- **Plan 04-04** (Screening service): Can now query all three sources (OFAC_SDN, UN_SECURITY_COUNCIL, PEP) through unified sanctions_entries table.
- **Plan 04-05** (Sanctions Screener agent): Will use the screening service to check against all three lists.
- PEP entries with Arabic name variants ready for fuzzy matching integration testing (Plan 04-02).
