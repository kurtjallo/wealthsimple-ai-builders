import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/supabase/types';
import { demoCases, DEMO_CASE_IDS } from '../src/lib/demo/cases';
import { demoDocuments } from '../src/lib/demo/documents';
import { demoAgentRuns } from '../src/lib/demo/agent-results';
import { demoAuditLogs } from '../src/lib/demo/audit-trail';

// Load .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

const DEMO_CASE_ID_LIST = Object.values(DEMO_CASE_IDS);

async function cleanDemoData() {
  console.log('Cleaning existing demo data...');

  // Delete in reverse dependency order
  const { error: auditError } = await supabase
    .from('audit_logs')
    .delete()
    .in('case_id', DEMO_CASE_ID_LIST);
  if (auditError) console.error('  Error cleaning audit_logs:', auditError.message);
  else console.log('  Cleaned audit_logs');

  const { error: agentError } = await supabase
    .from('agent_runs')
    .delete()
    .in('case_id', DEMO_CASE_ID_LIST);
  if (agentError) console.error('  Error cleaning agent_runs:', agentError.message);
  else console.log('  Cleaned agent_runs');

  const { error: docError } = await supabase
    .from('documents')
    .delete()
    .in('case_id', DEMO_CASE_ID_LIST);
  if (docError) console.error('  Error cleaning documents:', docError.message);
  else console.log('  Cleaned documents');

  const { error: caseError } = await supabase
    .from('cases')
    .delete()
    .in('id', DEMO_CASE_ID_LIST);
  if (caseError) console.error('  Error cleaning cases:', caseError.message);
  else console.log('  Cleaned cases');

  console.log('Demo data cleaned.\n');
}

async function seedDemoData() {
  // Insert cases
  console.log(`Inserting ${demoCases.length} cases...`);
  const { error: casesError } = await supabase.from('cases').insert(demoCases);
  if (casesError) {
    console.error('  Error inserting cases:', casesError.message);
    return;
  }
  console.log(`  Inserted ${demoCases.length} cases`);

  // Insert documents
  console.log(`Inserting ${demoDocuments.length} documents...`);
  const { error: docsError } = await supabase.from('documents').insert(demoDocuments);
  if (docsError) {
    console.error('  Error inserting documents:', docsError.message);
    return;
  }
  console.log(`  Inserted ${demoDocuments.length} documents`);

  // Insert agent runs
  console.log(`Inserting ${demoAgentRuns.length} agent runs...`);
  const { error: agentError } = await supabase.from('agent_runs').insert(demoAgentRuns);
  if (agentError) {
    console.error('  Error inserting agent_runs:', agentError.message);
    return;
  }
  console.log(`  Inserted ${demoAgentRuns.length} agent runs`);

  // Insert audit logs
  console.log(`Inserting ${demoAuditLogs.length} audit logs...`);
  const { error: auditError } = await supabase.from('audit_logs').insert(demoAuditLogs);
  if (auditError) {
    console.error('  Error inserting audit_logs:', auditError.message);
    return;
  }
  console.log(`  Inserted ${demoAuditLogs.length} audit logs`);
}

async function main() {
  const args = process.argv.slice(2);
  const cleanOnly = args.includes('--clean');

  console.log('=== KYC/AML Demo Data Seed ===\n');

  await cleanDemoData();

  if (cleanOnly) {
    console.log('--clean flag set. Skipping seed.');
    return;
  }

  await seedDemoData();

  console.log('\n=== Seed Summary ===');
  console.log(`  Cases:      ${demoCases.length}`);
  console.log(`  Documents:  ${demoDocuments.length}`);
  console.log(`  Agent Runs: ${demoAgentRuns.length}`);
  console.log(`  Audit Logs: ${demoAuditLogs.length}`);
  console.log('\nDemo data seeded successfully!');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
