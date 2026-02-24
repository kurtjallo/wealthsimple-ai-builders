/**
 * CLI script to download and load the UN Security Council consolidated sanctions list into Supabase.
 *
 * Usage: npx tsx scripts/load-un-sanctions.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 */

import 'dotenv/config';
import { parseUnConsolidatedXml } from '../src/lib/sanctions/un-parser';
import { loadUnEntries } from '../src/lib/sanctions/un-loader';

const UN_CONSOLIDATED_URL =
  'https://scsanctions.un.org/resources/xml/en/consolidated.xml';

async function main() {
  const start = Date.now();

  console.log('=== UN Security Council Sanctions List Loader ===\n');

  // ---- Download ----
  console.log(`Downloading consolidated list from ${UN_CONSOLIDATED_URL}...`);
  const response = await fetch(UN_CONSOLIDATED_URL, { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(
      `Failed to download UN sanctions list: ${response.status} ${response.statusText}`
    );
  }

  const xmlContent = await response.text();
  console.log(
    `Downloaded ${(xmlContent.length / 1024 / 1024).toFixed(2)} MB of XML\n`
  );

  // ---- Parse ----
  console.log('Parsing UN consolidated XML...');
  const parsed = parseUnConsolidatedXml(xmlContent);
  console.log(
    `Parsed ${parsed.entries.length} entries and ${parsed.aliases.length} aliases\n`
  );

  // ---- Load ----
  console.log('Loading into Supabase...');
  const result = await loadUnEntries(parsed);

  // ---- Summary ----
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log('\n=== Load Complete ===');
  console.log(`  Entries loaded: ${result.entriesLoaded}`);
  console.log(`  Aliases loaded: ${result.aliasesLoaded}`);
  console.log(`  Errors: ${result.errors.length}`);
  console.log(`  Total time: ${elapsed}s`);

  if (result.errors.length > 0) {
    console.log('\nErrors:');
    for (const err of result.errors) {
      console.log(`  - ${err}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
