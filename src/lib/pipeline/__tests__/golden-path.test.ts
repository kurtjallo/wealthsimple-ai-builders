/**
 * Golden Path Integration Test
 *
 * Validates the complete case lifecycle:
 * 1. Pipeline processing with all agents
 * 2. Delay simulation (agents take visible time)
 * 3. Confidence routing evaluation
 * 4. Progress event emission
 *
 * Run with: npx tsx --tsconfig tsconfig.json src/lib/pipeline/__tests__/golden-path.test.ts
 *
 * NOTE: This test exercises the pipeline logic without Supabase.
 * Database persistence is tested via API endpoints in manual testing.
 */

import { processCase } from '@/lib/agents/orchestrator';
import { registerAllStubs } from '@/lib/agents/stubs';
import { simulateAgentDelay, getExpectedDuration, AGENT_DELAY_CONFIG } from '@/lib/pipeline/delay-simulator';
import { evaluateConfidenceRouting, CONFIDENCE_THRESHOLDS } from '@/lib/pipeline/confidence-router';
import { createProgressEmitter } from '@/lib/pipeline/progress-emitter';
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

async function testGoldenPathPipeline(): Promise<void> {
  console.log('\n--- Test: Golden Path Pipeline (all agents succeed) ---');

  registerAllStubs();

  const stages: string[] = [];
  const startTime = Date.now();

  const result = await processCase(
    {
      case_id: 'golden-path-001',
      documents: [{
        id: 'doc-001',
        file_url: '/test/passport.jpg',
        file_name: 'passport.jpg',
        type: 'passport',
      }],
      applicant_name: 'John Smith',
      applicant_email: 'john@test.com',
    },
    (state: PipelineState) => {
      stages.push(state.stage);
    },
  );

  const duration = Date.now() - startTime;

  assert(result.stage === 'completed', `Pipeline completed (got: ${result.stage})`);
  assert(result.errors.length === 0, `No errors (got: ${result.errors.length})`);

  // All 5 agent results populated
  assert(result.document_result !== null, 'Document result populated');
  assert(result.identity_result !== null, 'Identity result populated');
  assert(result.sanctions_result !== null, 'Sanctions result populated');
  assert(result.risk_result !== null, 'Risk result populated');
  assert(result.narrative_result !== null, 'Narrative result populated');

  // All agents succeeded
  assert(result.document_result!.success === true, 'Document processor succeeded');
  assert(result.identity_result!.success === true, 'Identity verifier succeeded');
  assert(result.sanctions_result!.success === true, 'Sanctions screener succeeded');
  assert(result.risk_result!.success === true, 'Risk scorer succeeded');
  assert(result.narrative_result!.success === true, 'Case narrator succeeded');

  // Risk score present
  assert(result.risk_result!.data!.risk_score >= 0, 'Risk score >= 0');
  assert(result.risk_result!.data!.risk_score <= 100, 'Risk score <= 100');

  // Narrative present
  assert(result.narrative_result!.data!.narrative.length > 50, 'Narrative has content');
  assert(result.narrative_result!.data!.key_findings.length > 0, 'Has key findings');
  assert(
    ['approve', 'deny', 'escalate'].includes(result.narrative_result!.data!.recommended_action),
    'Recommended action is valid'
  );

  // Stage transitions correct
  assert(stages.includes('initialized'), 'Has initialized stage');
  assert(stages.includes('document_processing'), 'Has document_processing stage');
  assert(stages.includes('parallel_verification'), 'Has parallel_verification stage');
  assert(stages.includes('risk_scoring'), 'Has risk_scoring stage');
  assert(stages.includes('narrative_generation'), 'Has narrative_generation stage');
  assert(stages.includes('completed'), 'Has completed stage');

  console.log(`  Pipeline took ${duration}ms`);
}

async function testDelaySimulator(): Promise<void> {
  console.log('\n--- Test: Delay Simulator ---');

  // Test that delays are within expected range
  const start = Date.now();
  const delay = await simulateAgentDelay('document_processing');
  const elapsed = Date.now() - start;

  assert(delay >= AGENT_DELAY_CONFIG.document_processing.min * 0.9, `Delay >= min (got: ${delay}ms)`);
  assert(delay <= AGENT_DELAY_CONFIG.document_processing.max * 1.1, `Delay <= max (got: ${delay}ms)`);
  assert(elapsed >= AGENT_DELAY_CONFIG.document_processing.min * 0.8, `Actual elapsed >= min`);

  // Test skip delay
  const skippedDelay = await simulateAgentDelay('document_processing', { skipDelay: true });
  assert(skippedDelay === 0, 'Skip delay returns 0');

  // Test unknown agent (should return 0)
  const unknownDelay = await simulateAgentDelay('unknown_agent');
  assert(unknownDelay === 0, 'Unknown agent delay is 0');

  // Test expected duration calculation
  const expected = getExpectedDuration();
  assert(expected.min > 8000, `Expected min > 8s (got: ${expected.min}ms)`);
  assert(expected.max < 25000, `Expected max < 25s (got: ${expected.max}ms)`);
}

async function testConfidenceRoutingCleanCase(): Promise<void> {
  console.log('\n--- Test: Confidence Routing (clean case) ---');

  registerAllStubs();

  const result = await processCase(
    {
      case_id: 'routing-clean-001',
      documents: [{ id: 'doc-001', file_url: '/test/passport.jpg', file_name: 'passport.jpg', type: 'passport' }],
      applicant_name: 'Clean Applicant',
      applicant_email: 'clean@test.com',
    },
  );

  const routing = evaluateConfidenceRouting(result);

  assert(routing.overall_confidence > 0, `Overall confidence > 0 (got: ${routing.overall_confidence})`);
  console.log(`  Routing result: ${routing.recommended_action}, ${routing.routing_reasons.length} reasons`);
  if (routing.routing_reasons.length > 0) {
    routing.routing_reasons.forEach(r => console.log(`    - ${r}`));
  }
}

async function testConfidenceRoutingFailedAgent(): Promise<void> {
  console.log('\n--- Test: Confidence Routing (failed agent) ---');

  // Create a pipeline state with a failed sanctions screener
  const state: PipelineState = {
    case_id: 'routing-fail-001',
    stage: 'completed',
    started_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    document_result: {
      success: true, data: null, error: null, confidence: 0.95,
      duration_ms: 1000, agent_type: 'document_processor' as any, metadata: {},
    },
    identity_result: {
      success: true, data: { verified: true, matches: [], discrepancies: [], verification_summary: '' } as any,
      error: null, confidence: 0.9, duration_ms: 500, agent_type: 'identity_verifier' as any, metadata: {},
    },
    sanctions_result: {
      success: false, data: null, error: 'API timeout',
      confidence: 0, duration_ms: 0, agent_type: 'sanctions_screener' as any, metadata: {},
    },
    risk_result: {
      success: true, data: { risk_score: 45, risk_level: 'medium', risk_factors: [], requires_manual_review: true, scoring_summary: '' } as any,
      error: null, confidence: 0.6, duration_ms: 800, agent_type: 'risk_scorer' as any, metadata: {},
    },
    narrative_result: {
      success: true, data: { narrative: 'Test narrative content for validation purposes, needs to be longer than 50 chars.', key_findings: ['finding1'], recommended_action: 'escalate', evidence_links: [] } as any,
      error: null, confidence: 0.7, duration_ms: 1200, agent_type: 'case_narrator' as any, metadata: {},
    },
    errors: [],
    retry_count: 0,
  };

  const routing = evaluateConfidenceRouting(state);

  assert(routing.requires_manual_review === true, 'Failed agent triggers manual review');
  assert(routing.low_confidence_agents.includes('sanctions_screener'), 'Sanctions screener flagged as low confidence');
  assert(routing.routing_reasons.length > 0, 'Has routing reasons');

  console.log(`  Routing: ${routing.recommended_action}`);
  routing.routing_reasons.forEach(r => console.log(`    - ${r}`));
}

async function testProgressEmitter(): Promise<void> {
  console.log('\n--- Test: Progress Emitter ---');

  const emitter = createProgressEmitter('test-emitter-001');
  const received: any[] = [];

  emitter.on((event) => {
    received.push(event);
  });

  emitter.emit({ stage: 'initialized', status: 'started', message: 'Starting...' });
  emitter.emit({ stage: 'document_processing', status: 'started', message: 'Processing docs...' });
  emitter.emit({ stage: 'completed', status: 'completed', message: 'Done!' });

  assert(received.length === 3, `Received 3 events (got: ${received.length})`);
  assert(received[0].case_id === 'test-emitter-001', 'Events have case_id');
  assert(received[0].timestamp !== undefined, 'Events have timestamp');
  assert(emitter.getEvents().length === 3, 'Events stored for catch-up');
}

// Run all tests
async function main(): Promise<void> {
  console.log('=== Phase 8: Golden Path Integration Tests ===');

  await testProgressEmitter();
  await testDelaySimulator();
  await testGoldenPathPipeline();
  await testConfidenceRoutingCleanCase();
  await testConfidenceRoutingFailedAgent();

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
