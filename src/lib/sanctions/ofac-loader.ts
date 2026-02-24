import { createServerSupabaseClient } from '../supabase/server';
import type { Json } from '../supabase/types';
import type { ParsedSanctionsList, LoaderResult } from './types';

const BATCH_SIZE = 500;

/**
 * Load parsed OFAC sanctions entries and aliases into Supabase.
 *
 * - Upserts entries on (source, source_id) to support re-runs
 * - Inserts aliases after entries are loaded, using the DB-generated entry UUIDs
 * - Batches in chunks of 500 to avoid payload limits
 */
export async function loadOfacEntries(
  parsed: ParsedSanctionsList
): Promise<LoaderResult> {
  const start = Date.now();
  const supabase = createServerSupabaseClient();
  const errors: string[] = [];

  const { entries, aliases } = parsed;

  // ---- Phase 1: Upsert entries in batches ----
  let entriesLoaded = 0;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);

    const rows = batch.map((e) => ({
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

    const { error } = await supabase
      .from('sanctions_entries')
      .upsert(rows, { onConflict: 'source,source_id' });

    if (error) {
      errors.push(`Entries batch ${i}-${i + batch.length}: ${error.message}`);
    } else {
      entriesLoaded += batch.length;
    }

    if ((i + BATCH_SIZE) % 2000 === 0 || i + BATCH_SIZE >= entries.length) {
      console.log(`  Entries: ${entriesLoaded}/${entries.length} loaded`);
    }
  }

  // ---- Phase 2: Build source_id -> UUID map ----
  // We need the DB-generated UUIDs to set alias foreign keys
  const sourceIdToUuid = new Map<string, string>();

  // Fetch in pages of 1000
  let from = 0;
  const PAGE_SIZE = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('sanctions_entries')
      .select('id, source_id')
      .eq('source', 'OFAC_SDN')
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      errors.push(`Fetching entry IDs page ${from}: ${error.message}`);
      break;
    }

    if (!data || data.length === 0) break;

    for (const row of data) {
      if (row.source_id) {
        sourceIdToUuid.set(row.source_id, row.id);
      }
    }

    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  console.log(`  Mapped ${sourceIdToUuid.size} entry UUIDs for alias linking`);

  // ---- Phase 3: Delete existing aliases for these entries, then insert new ones ----
  // This ensures re-runs don't create duplicate aliases
  if (sourceIdToUuid.size > 0) {
    const entryUuids = Array.from(sourceIdToUuid.values());

    // Delete in batches to avoid query size limits
    for (let i = 0; i < entryUuids.length; i += BATCH_SIZE) {
      const batch = entryUuids.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from('sanctions_aliases')
        .delete()
        .in('entry_id', batch);

      if (error) {
        errors.push(`Deleting old aliases batch ${i}: ${error.message}`);
      }
    }
  }

  // Insert aliases
  let aliasesLoaded = 0;
  const resolvedAliases = aliases
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

  for (let i = 0; i < resolvedAliases.length; i += BATCH_SIZE) {
    const batch = resolvedAliases.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from('sanctions_aliases')
      .insert(batch);

    if (error) {
      errors.push(`Aliases batch ${i}-${i + batch.length}: ${error.message}`);
    } else {
      aliasesLoaded += batch.length;
    }

    if ((i + BATCH_SIZE) % 2000 === 0 || i + BATCH_SIZE >= resolvedAliases.length) {
      console.log(`  Aliases: ${aliasesLoaded}/${resolvedAliases.length} loaded`);
    }
  }

  return {
    entriesLoaded,
    aliasesLoaded,
    errors,
    durationMs: Date.now() - start,
  };
}
