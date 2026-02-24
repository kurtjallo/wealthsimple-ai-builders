/**
 * Integration test for the agent orchestration pipeline.
 * Run with: npx tsx --tsconfig tsconfig.json src/lib/agents/__tests__/pipeline.test.ts
 *
 * Validates:
 * 1. Pipeline processes through all stages
 * 2. All agent results are populated
 * 3. State machine transitions are valid
 * 4. Error handling works for failed agents
 */

import { processCase, createPipelineState, registerAgent, getPipelineSummary } from '../orchestrator';
import { registerAllStubs } from '../stubs';
import { PipelineState } from '@/types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

async function testPipelineStateCreation(): Promise<void> {
  console.log('\n--- Test: Pipeline State Creation ---');

  const state = createPipelineState('test-create-001');

  assert(state.case_id === 'test-create-001', 'Case ID set correctly');
  assert(state.stage === 'initialized', 'Initial stage is initialized');
  assert(state.document_result === null, 'Document result starts null');
  assert(state.identity_result === null, 'Identity result starts null');
  assert(state.sanctions_result === null, 'Sanctions result starts null');
  assert(state.risk_result === null, 'Risk result starts null');
  assert(state.narrative_result === null, 'Narrative result starts null');
  assert(state.errors.length === 0, 'No initial errors');
  assert(state.retry_count === 0, 'Retry count starts at 0');
}

async function testHappyPath(): Promise<void> {
  console.log('\n--- Test: Happy Path (all stubs succeed) ---');

  registerAllStubs();

  const result = await processCase({
    case_id: 'test-happy-001',
    documents: [{ id: 'doc-001', file_url: '/test/passport.jpg', file_name: 'passport.jpg', type: 'passport' }],
    applicant_name: 'John Smith',
    applicant_email: 'john@test.com',
  });

  assert(result.stage === 'completed', `Pipeline completed (got: ${result.stage})`);
  assert(result.errors.length === 0, `No errors (got: ${result.errors.length})`);

  // All results populated
  assert(result.document_result !== null, 'Document result populated');
  assert(result.identity_result !== null, 'Identity result populated');
  assert(result.sanctions_result !== null, 'Sanctions result populated');
  assert(result.risk_result !== null, 'Risk result populated');
  assert(result.narrative_result !== null, 'Narrative result populated');

  // Results are successful
  assert(result.document_result!.success === true, 'Document processing succeeded');
  assert(result.identity_result!.success === true, 'Identity verification succeeded');
  assert(result.sanctions_result!.success === true, 'Sanctions screening succeeded');
  assert(result.risk_result!.success === true, 'Risk scoring succeeded');
  assert(result.narrative_result!.success === true, 'Narrative generation succeeded');

  // Confidence scores present
  assert(result.document_result!.confidence > 0, 'Document confidence > 0');
  assert(result.risk_result!.data!.risk_score >= 0, 'Risk score >= 0');

  // Timing data
  assert(result.document_result!.duration_ms > 0, 'Document has timing data');

  // Narrative content
  assert(result.narrative_result!.data!.narrative.length > 100, 'Narrative has content');
  assert(result.narrative_result!.data!.key_findings.length > 0, 'Narrative has key findings');

  console.log('\nPipeline Summary:');
  console.log(getPipelineSummary(result));
}

async function testStateCallbacks(): Promise<void> {
  console.log('\n--- Test: State Change Callbacks ---');

  registerAllStubs();

  const stages: string[] = [];

  await processCase(
    {
      case_id: 'test-callback-001',
      documents: [{ id: 'doc-001', file_url: '/test/passport.jpg', file_name: 'passport.jpg', type: 'passport' }],
      applicant_name: 'Jane Doe',
      applicant_email: 'jane@test.com',
    },
    (state: PipelineState) => {
      stages.push(state.stage);
    },
  );

  assert(stages.includes('initialized'), 'Callback received initialized');
  assert(stages.includes('document_processing'), 'Callback received document_processing');
  assert(stages.includes('parallel_verification'), 'Callback received parallel_verification');
  assert(stages.includes('risk_scoring'), 'Callback received risk_scoring');
  assert(stages.includes('narrative_generation'), 'Callback received narrative_generation');
  assert(stages.includes('completed'), 'Callback received completed');
  assert(stages.length >= 6, `At least 6 state changes (got: ${stages.length})`);
}

async function testFailedAgent(): Promise<void> {
  console.log('\n--- Test: Failed Agent (document processor) ---');

  // Register all stubs first, then override document_processor with a failing one
  registerAllStubs();
  registerAgent('document_processor', async () => {
    throw new Error('OCR service timed out');
  });

  const result = await processCase({
    case_id: 'test-fail-001',
    documents: [{ id: 'doc-001', file_url: '/test/passport.jpg', file_name: 'passport.jpg', type: 'passport' }],
    applicant_name: 'Test Failure',
    applicant_email: 'fail@test.com',
  });

  assert(result.stage === 'failed', `Pipeline failed (got: ${result.stage})`);
  assert(result.errors.length > 0, 'Errors recorded');
  assert(result.document_result !== null, 'Document result exists (with failure)');
  assert(result.document_result!.success === false, 'Document result marked as failed');

  // Re-register stubs for subsequent tests
  registerAllStubs();
}

// Run all tests
async function main(): Promise<void> {
  console.log('=== Agent Orchestration Pipeline Integration Tests ===');

  await testPipelineStateCreation();
  await testHappyPath();
  await testStateCallbacks();
  await testFailedAgent();

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
