/**
 * CLI script to load the mock PEP database into Supabase.
 *
 * Usage: npx tsx scripts/load-pep-database.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 */

import 'dotenv/config';
import { createServerSupabaseClient } from '../src/lib/supabase/server';
import type { Json } from '../src/lib/supabase/types';
import { PEP_ENTRIES, PEP_ALIASES } from '../src/lib/sanctions/pep-data';

const BATCH_SIZE = 500;

async function main() {
  const start = Date.now();
  const supabase = createServerSupabaseClient();

  console.log('=== PEP Database Loader ===\n');
  console.log(`Loading ${PEP_ENTRIES.length} PEP entries and ${PEP_ALIASES.length} aliases\n`);

  // ---- Phase 1: Upsert entries ----
  const rows = PEP_ENTRIES.map((e) => ({
    source: e.source,
    source_id: e.source_id,
    entry_type: e.entry_type,
    primary_name: e.primary_name,
    first_name: e.first_name,
    last_name: e.last_name,
    date_of_birth: e.date_of_birth,
    nationality: e.nationality,
    programs: e.programs,
    remarks: e.remarks,
    source_url: e.source_url,
    raw_data: e.raw_data as Json,
  }));

  const { error: entryError } = await supabase
    .from('sanctions_entries')
    .upsert(rows, { onConflict: 'source,source_id' });

  if (entryError) {
    console.error('Failed to load entries:', entryError.message);
    process.exit(1);
  }

  console.log(`  Entries: ${PEP_ENTRIES.length} loaded`);

  // ---- Phase 2: Build source_id -> UUID map ----
  const { data: entryRows, error: fetchError } = await supabase
    .from('sanctions_entries')
    .select('id, source_id')
    .eq('source', 'PEP');

  if (fetchError) {
    console.error('Failed to fetch entry IDs:', fetchError.message);
    process.exit(1);
  }

  const sourceIdToUuid = new Map<string, string>();
  for (const row of entryRows ?? []) {
    if (row.source_id) {
      sourceIdToUuid.set(row.source_id, row.id);
    }
  }

  console.log(`  Mapped ${sourceIdToUuid.size} entry UUIDs for alias linking`);

  // ---- Phase 3: Delete existing PEP aliases, then insert new ones ----
  if (sourceIdToUuid.size > 0) {
    const entryUuids = Array.from(sourceIdToUuid.values());
    const { error: deleteError } = await supabase
      .from('sanctions_aliases')
      .delete()
      .in('entry_id', entryUuids);

    if (deleteError) {
      console.error('Failed to delete old aliases:', deleteError.message);
    }
  }

  const resolvedAliases = PEP_ALIASES
    .map((a) => {
      const entryUuid = sourceIdToUuid.get(a.entry_id);
      if (!entryUuid) return null;
      return {
        entry_id: entryUuid,
        alias_name: a.alias_name,
        alias_type: a.alias_type,
        alias_quality: a.alias_quality,
      };
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  if (resolvedAliases.length > 0) {
    for (let i = 0; i < resolvedAliases.length; i += BATCH_SIZE) {
      const batch = resolvedAliases.slice(i, i + BATCH_SIZE);
      const { error: aliasError } = await supabase
        .from('sanctions_aliases')
        .insert(batch);

      if (aliasError) {
        console.error(`Failed to load aliases batch ${i}:`, aliasError.message);
      }
    }
  }

  console.log(`  Aliases: ${resolvedAliases.length} loaded`);

  // ---- Summary ----
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  // Category distribution
  const categories = new Map<string, number>();
  for (const entry of PEP_ENTRIES) {
    for (const cat of entry.programs) {
      categories.set(cat, (categories.get(cat) ?? 0) + 1);
    }
  }

  console.log('\n=== Load Complete ===');
  console.log(`  Total entries: ${PEP_ENTRIES.length}`);
  console.log(`  Total aliases: ${resolvedAliases.length}`);
  console.log(`  Total time: ${elapsed}s`);
  console.log('\n  Category distribution:');
  for (const [cat, count] of categories.entries()) {
    console.log(`    ${cat}: ${count}`);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
