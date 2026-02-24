/**
 * CLI script to download and load the OFAC SDN list into Supabase.
 *
 * Usage: npx tsx scripts/load-ofac-sdn.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 */

import 'dotenv/config';
import { parseOfacSdnXml } from '../src/lib/sanctions/ofac-parser';
import { loadOfacEntries } from '../src/lib/sanctions/ofac-loader';

const OFAC_SDN_URL = 'https://www.treasury.gov/ofac/downloads/sdn.xml';

async function main() {
  const start = Date.now();

  console.log('=== OFAC SDN List Loader ===\n');

  // ---- Download ----
  console.log(`Downloading SDN list from ${OFAC_SDN_URL}...`);
  const response = await fetch(OFAC_SDN_URL, { redirect: 'follow' });

  if (!response.ok) {
    throw new Error(`Failed to download SDN list: ${response.status} ${response.statusText}`);
  }

  const xmlContent = await response.text();
  console.log(`Downloaded ${(xmlContent.length / 1024 / 1024).toFixed(2)} MB of XML\n`);

  // ---- Parse ----
  console.log('Parsing OFAC SDN XML...');
  const parsed = parseOfacSdnXml(xmlContent);
  console.log(`Parsed ${parsed.entries.length} entries and ${parsed.aliases.length} aliases\n`);

  // ---- Load ----
  console.log('Loading into Supabase...');
  const result = await loadOfacEntries(parsed);

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
