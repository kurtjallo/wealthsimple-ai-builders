import type { Database } from '@/lib/supabase/types';
import { DEMO_CASE_IDS } from './cases';

type AgentRunInsert = Database['public']['Tables']['agent_runs']['Insert'];

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const minsAfter = (base: number, m: number) =>
  new Date(now.getTime() - base * 3600000 + m * 60000).toISOString();

// --- Case narratives export ---
export const demoCaseNarratives: Record<string, string> = {
  [DEMO_CASE_IDS.SARAH_CHEN]: `Sarah Chen presents a straightforward, low-risk KYC profile. Her Canadian passport (C4829173) was verified with 0.97 confidence, and her utility bill confirmed her residential address at 142 Maple Drive, Toronto, ON M5V 2T6. Identity verification passed all checks with no discrepancies between submitted documents.

Sanctions screening against OFAC SDN, UN Consolidated, and PEP databases returned zero matches. All name variants and phonetic equivalents were checked with no hits.

The composite risk score of 12/100 places this applicant firmly in the low-risk category. Document quality was excellent (0.95 average), identity verification confidence was high (0.94), and no adverse screening signals were detected.

Recommendation: Approve for standard onboarding. No enhanced due diligence required. This case meets all KYC requirements under FINTRAC/PCMLTFA guidelines.`,

  [DEMO_CASE_IDS.VIKTOR_PETROV]: `Viktor Petrov presents a critical-risk KYC profile requiring immediate compliance escalation. His Russian Federation passport (72 4839201) was processed with adequate confidence (0.88), though the document showed signs of wear at the edges.

Sanctions screening produced a high-confidence match (94%) against the OFAC SDN list. The matched entry, Viktor A. Petrov (OFAC ID: 29847), is listed under the UKRAINE-EO13661 program for involvement in sanctioned activities. The name match was confirmed via both direct string comparison and phonetic analysis. A secondary potential match was identified on the UN Consolidated list at 67% confidence.

The composite risk score of 87/100 reflects the critical nature of the sanctions match (weighted 35% of total score), combined with elevated PEP proximity indicators. Document verification was otherwise satisfactory, with identity fields consistent across submitted materials.

Recommendation: Escalate immediately. Do not proceed with onboarding. A Suspicious Transaction Report (STR) should be filed with FINTRAC. This case requires senior compliance officer review and potential referral to legal counsel.`,

  [DEMO_CASE_IDS.AMARA_OKAFOR]: `Amara Okafor presents a medium-risk KYC profile that warrants manual review due to document quality concerns and a minor name discrepancy. The submitted driver's license (Ontario DL: O4829-17365-20901) was processed with below-average OCR confidence (0.62) due to poor image quality.

The extracted name reads "Amara N. Okafor," while the application was submitted under "Amara Okafor." This minor discrepancy requires officer review. Date of birth and address fields were extracted successfully despite the image quality issues.

Sanctions screening returned no matches across OFAC, UN, or PEP databases. The risk score of 45/100 is driven primarily by the low document confidence and the name discrepancy flag.

Recommendation: Manual review required. Request higher-quality document scan if possible. The applicant does not present sanctions or PEP concerns.`,

  [DEMO_CASE_IDS.MARIA_GONZALEZ]: `Maria Gonzalez-Rivera presents a high-risk KYC profile due to her status as a Politically Exposed Person (PEP). Her Mexican passport (G28491037) was verified with high confidence (0.93), and all extracted identity fields are consistent across submitted documents.

PEP database screening identified a strong match (89% confidence) to Maria Elena Gonzalez-Rivera, listed as a Mexican diplomatic official serving as Deputy Ambassador to Canada. Sanctions screening against OFAC and UN databases returned no direct matches.

The composite risk score of 68/100 is driven primarily by the PEP classification and the associated enhanced due diligence requirements. Document quality (0.93) and identity verification (0.91) were both satisfactory.

Recommendation: Enhanced due diligence required. PEP status does not preclude onboarding but requires senior officer approval, source-of-funds verification, and ongoing monitoring.`,
};

// --- Agent run records ---
export const demoAgentRuns: AgentRunInsert[] = [
  // ========================================
  // Case 1: Sarah Chen - All completed
  // ========================================
  {
    id: '30000000-0000-0000-0000-000000000001',
    case_id: DEMO_CASE_IDS.SARAH_CHEN,
    agent_type: 'orchestrator',
    status: 'completed',
    started_at: hoursAgo(48),
    completed_at: minsAfter(48, 2.5),
    input: { case_id: DEMO_CASE_IDS.SARAH_CHEN, applicant_name: 'Sarah Chen' },
    output: { stage: 'completed', total_duration_ms: 148200 },
    confidence: 0.96,
    error: null,
    created_at: hoursAgo(48),
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    case_id: DEMO_CASE_IDS.SARAH_CHEN,
    agent_type: 'document_processor',
    status: 'completed',
    started_at: hoursAgo(48),
    completed_at: minsAfter(48, 0.4),
    input: { documents: ['sarah_chen_passport.pdf', 'sarah_chen_hydro_bill.pdf'] },
    output: {
      extracted_fields: [
        { field_name: 'full_name', value: 'Sarah Chen', confidence: 0.98, source_document_id: '20000000-0000-0000-0000-000000000001' },
        { field_name: 'date_of_birth', value: '1991-03-15', confidence: 0.97, source_document_id: '20000000-0000-0000-0000-000000000001' },
        { field_name: 'address', value: '142 Maple Drive, Toronto, ON M5V 2T6', confidence: 0.94, source_document_id: '20000000-0000-0000-0000-000000000002' },
      ],
      document_quality: { '20000000-0000-0000-0000-000000000001': 0.97, '20000000-0000-0000-0000-000000000002': 0.93 },
    },
    confidence: 0.95,
    error: null,
    created_at: hoursAgo(48),
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    case_id: DEMO_CASE_IDS.SARAH_CHEN,
    agent_type: 'identity_verifier',
    status: 'completed',
    started_at: minsAfter(48, 0.4),
    completed_at: minsAfter(48, 1.2),
    input: { applicant_name: 'Sarah Chen', extracted_fields_count: 3 },
    output: {
      verified: true,
      matches: [
        { field_name: 'full_name', expected: 'Sarah Chen', actual: 'Sarah Chen', match: true, confidence: 0.98 },
        { field_name: 'date_of_birth', expected: '1991-03-15', actual: '1991-03-15', match: true, confidence: 0.97 },
      ],
      discrepancies: [],
      verification_summary: 'All identity fields verified with high confidence. No discrepancies found.',
    },
    confidence: 0.94,
    error: null,
    created_at: hoursAgo(48),
  },
  {
    id: '30000000-0000-0000-0000-000000000004',
    case_id: DEMO_CASE_IDS.SARAH_CHEN,
    agent_type: 'sanctions_screener',
    status: 'completed',
    started_at: minsAfter(48, 0.4),
    completed_at: minsAfter(48, 1.1),
    input: { applicant_name: 'Sarah Chen', lists: ['OFAC', 'UN', 'PEP'] },
    output: {
      flagged: false,
      matches: [],
      lists_checked: ['OFAC SDN', 'UN Consolidated', 'PEP Database'],
      screening_summary: 'No matches found across all sanctions and PEP databases.',
    },
    confidence: 0.99,
    error: null,
    created_at: hoursAgo(48),
  },
  {
    id: '30000000-0000-0000-0000-000000000005',
    case_id: DEMO_CASE_IDS.SARAH_CHEN,
    agent_type: 'risk_scorer',
    status: 'completed',
    started_at: minsAfter(48, 1.2),
    completed_at: minsAfter(48, 1.8),
    input: { case_id: DEMO_CASE_IDS.SARAH_CHEN },
    output: {
      risk_score: 12,
      risk_level: 'low',
      risk_factors: [
        { factor_name: 'document_quality', weight: 0.2, score: 5, explanation: 'Excellent document quality across all submissions' },
        { factor_name: 'identity_verification', weight: 0.25, score: 8, explanation: 'Strong identity match with no discrepancies' },
        { factor_name: 'sanctions_screening', weight: 0.35, score: 0, explanation: 'No sanctions or watchlist matches' },
        { factor_name: 'pep_status', weight: 0.2, score: 0, explanation: 'No PEP associations detected' },
      ],
      requires_manual_review: false,
      scoring_summary: 'Low risk profile. All verification checks passed with high confidence.',
    },
    confidence: 0.96,
    error: null,
    created_at: hoursAgo(48),
  },
  {
    id: '30000000-0000-0000-0000-000000000006',
    case_id: DEMO_CASE_IDS.SARAH_CHEN,
    agent_type: 'case_narrator',
    status: 'completed',
    started_at: minsAfter(48, 1.8),
    completed_at: minsAfter(48, 2.5),
    input: { case_id: DEMO_CASE_IDS.SARAH_CHEN, risk_score: 12 },
    output: {
      narrative: demoCaseNarratives[DEMO_CASE_IDS.SARAH_CHEN],
      key_findings: [
        'All identity documents verified with high confidence (0.95+ average)',
        'No sanctions or PEP matches across all databases',
        'Composite risk score: 12/100 (Low)',
      ],
      recommended_action: 'approve',
      evidence_links: [
        { claim: 'Identity verified via Canadian passport', source: 'document_processor', confidence: 0.97 },
        { claim: 'Address confirmed via utility bill', source: 'document_processor', confidence: 0.94 },
        { claim: 'Clean sanctions screening', source: 'sanctions_screener', confidence: 0.99 },
      ],
    },
    confidence: 0.95,
    error: null,
    created_at: hoursAgo(48),
  },

  // ========================================
  // Case 2: Viktor Petrov - All completed
  // ========================================
  {
    id: '30000000-0000-0000-0000-000000000007',
    case_id: DEMO_CASE_IDS.VIKTOR_PETROV,
    agent_type: 'orchestrator',
    status: 'completed',
    started_at: hoursAgo(36),
    completed_at: minsAfter(36, 3.1),
    input: { case_id: DEMO_CASE_IDS.VIKTOR_PETROV, applicant_name: 'Viktor Petrov' },
    output: { stage: 'completed', total_duration_ms: 186000 },
    confidence: 0.88,
    error: null,
    created_at: hoursAgo(36),
  },
  {
    id: '30000000-0000-0000-0000-000000000008',
    case_id: DEMO_CASE_IDS.VIKTOR_PETROV,
    agent_type: 'document_processor',
    status: 'completed',
    started_at: hoursAgo(36),
    completed_at: minsAfter(36, 0.5),
    input: { documents: ['viktor_petrov_passport.pdf'] },
    output: {
      extracted_fields: [
        { field_name: 'full_name', value: 'Viktor Petrov', confidence: 0.91, source_document_id: '20000000-0000-0000-0000-000000000003' },
        { field_name: 'date_of_birth', value: '1978-11-08', confidence: 0.89, source_document_id: '20000000-0000-0000-0000-000000000003' },
      ],
      document_quality: { '20000000-0000-0000-0000-000000000003': 0.88 },
    },
    confidence: 0.88,
    error: null,
    created_at: hoursAgo(36),
  },
  {
    id: '30000000-0000-0000-0000-000000000009',
    case_id: DEMO_CASE_IDS.VIKTOR_PETROV,
    agent_type: 'identity_verifier',
    status: 'completed',
    started_at: minsAfter(36, 0.5),
    completed_at: minsAfter(36, 1.4),
    input: { applicant_name: 'Viktor Petrov', extracted_fields_count: 2 },
    output: {
      verified: true,
      matches: [
        { field_name: 'full_name', expected: 'Viktor Petrov', actual: 'Viktor Petrov', match: true, confidence: 0.91 },
        { field_name: 'date_of_birth', expected: '1978-11-08', actual: '1978-11-08', match: true, confidence: 0.89 },
      ],
      discrepancies: [],
      verification_summary: 'Identity fields match. Document shows wear but data is readable.',
    },
    confidence: 0.87,
    error: null,
    created_at: hoursAgo(36),
  },
  {
    id: '30000000-0000-0000-0000-000000000010',
    case_id: DEMO_CASE_IDS.VIKTOR_PETROV,
    agent_type: 'sanctions_screener',
    status: 'completed',
    started_at: minsAfter(36, 0.5),
    completed_at: minsAfter(36, 1.6),
    input: { applicant_name: 'Viktor Petrov', lists: ['OFAC', 'UN', 'PEP'] },
    output: {
      flagged: true,
      matches: [
        {
          list_name: 'OFAC SDN',
          matched_name: 'Viktor A. Petrov',
          match_score: 0.94,
          entry_id: 'OFAC-29847',
          details: 'Listed under UKRAINE-EO13661 program. Sanctioned for involvement in activities undermining democratic processes.',
        },
        {
          list_name: 'UN Consolidated',
          matched_name: 'Viktor Petrov',
          match_score: 0.67,
          entry_id: 'UN-TAi.230',
          details: 'Potential match on UN Consolidated list. Lower confidence — may represent same individual as OFAC entry.',
        },
      ],
      lists_checked: ['OFAC SDN', 'UN Consolidated', 'PEP Database'],
      screening_summary: 'HIGH ALERT: Strong match (94%) on OFAC SDN list. Secondary potential match on UN Consolidated list.',
    },
    confidence: 0.94,
    error: null,
    created_at: hoursAgo(36),
  },
  {
    id: '30000000-0000-0000-0000-000000000011',
    case_id: DEMO_CASE_IDS.VIKTOR_PETROV,
    agent_type: 'risk_scorer',
    status: 'completed',
    started_at: minsAfter(36, 1.6),
    completed_at: minsAfter(36, 2.3),
    input: { case_id: DEMO_CASE_IDS.VIKTOR_PETROV },
    output: {
      risk_score: 87,
      risk_level: 'critical',
      risk_factors: [
        { factor_name: 'document_quality', weight: 0.2, score: 24, explanation: 'Adequate quality but document shows physical wear' },
        { factor_name: 'identity_verification', weight: 0.25, score: 15, explanation: 'Identity confirmed but limited to single document' },
        { factor_name: 'sanctions_screening', weight: 0.35, score: 94, explanation: 'CRITICAL: OFAC SDN match at 94% confidence' },
        { factor_name: 'pep_status', weight: 0.2, score: 30, explanation: 'Elevated PEP proximity due to geopolitical context' },
      ],
      requires_manual_review: true,
      scoring_summary: 'Critical risk due to OFAC SDN sanctions match. Immediate escalation required.',
    },
    confidence: 0.91,
    error: null,
    created_at: hoursAgo(36),
  },
  {
    id: '30000000-0000-0000-0000-000000000012',
    case_id: DEMO_CASE_IDS.VIKTOR_PETROV,
    agent_type: 'case_narrator',
    status: 'completed',
    started_at: minsAfter(36, 2.3),
    completed_at: minsAfter(36, 3.1),
    input: { case_id: DEMO_CASE_IDS.VIKTOR_PETROV, risk_score: 87 },
    output: {
      narrative: demoCaseNarratives[DEMO_CASE_IDS.VIKTOR_PETROV],
      key_findings: [
        'OFAC SDN match at 94% confidence (Viktor A. Petrov, OFAC ID: 29847)',
        'Listed under UKRAINE-EO13661 sanctions program',
        'Composite risk score: 87/100 (Critical)',
        'STR filing recommended under FINTRAC guidelines',
      ],
      recommended_action: 'escalate',
      evidence_links: [
        { claim: 'OFAC SDN match confirmed', source: 'sanctions_screener', confidence: 0.94 },
        { claim: 'UN Consolidated potential match', source: 'sanctions_screener', confidence: 0.67 },
        { claim: 'Identity verified via Russian passport', source: 'identity_verifier', confidence: 0.87 },
      ],
    },
    confidence: 0.92,
    error: null,
    created_at: hoursAgo(36),
  },

  // ========================================
  // Case 3: Amara Okafor - All completed
  // ========================================
  {
    id: '30000000-0000-0000-0000-000000000013',
    case_id: DEMO_CASE_IDS.AMARA_OKAFOR,
    agent_type: 'orchestrator',
    status: 'completed',
    started_at: hoursAgo(12),
    completed_at: minsAfter(12, 3.4),
    input: { case_id: DEMO_CASE_IDS.AMARA_OKAFOR, applicant_name: 'Amara Okafor' },
    output: { stage: 'completed', total_duration_ms: 204000 },
    confidence: 0.72,
    error: null,
    created_at: hoursAgo(12),
  },
  {
    id: '30000000-0000-0000-0000-000000000014',
    case_id: DEMO_CASE_IDS.AMARA_OKAFOR,
    agent_type: 'document_processor',
    status: 'completed',
    started_at: hoursAgo(12),
    completed_at: minsAfter(12, 0.7),
    input: { documents: ['amara_okafor_license.jpg'] },
    output: {
      extracted_fields: [
        { field_name: 'full_name', value: 'Amara N. Okafor', confidence: 0.72, source_document_id: '20000000-0000-0000-0000-000000000004' },
        { field_name: 'date_of_birth', value: '1994-07-22', confidence: 0.68, source_document_id: '20000000-0000-0000-0000-000000000004' },
      ],
      document_quality: { '20000000-0000-0000-0000-000000000004': 0.62 },
    },
    confidence: 0.62,
    error: null,
    created_at: hoursAgo(12),
  },
  {
    id: '30000000-0000-0000-0000-000000000015',
    case_id: DEMO_CASE_IDS.AMARA_OKAFOR,
    agent_type: 'identity_verifier',
    status: 'completed',
    started_at: minsAfter(12, 0.7),
    completed_at: minsAfter(12, 1.5),
    input: { applicant_name: 'Amara Okafor', extracted_fields_count: 2 },
    output: {
      verified: false,
      matches: [
        { field_name: 'full_name', expected: 'Amara Okafor', actual: 'Amara N. Okafor', match: false, confidence: 0.78 },
        { field_name: 'date_of_birth', expected: '1994-07-22', actual: '1994-07-22', match: true, confidence: 0.68 },
      ],
      discrepancies: ['Name discrepancy: application says "Amara Okafor" but document reads "Amara N. Okafor" (middle initial present on document)'],
      verification_summary: 'Partial verification. Name discrepancy detected — middle initial on document not on application. Low document quality reduces confidence.',
    },
    confidence: 0.71,
    error: null,
    created_at: hoursAgo(12),
  },
  {
    id: '30000000-0000-0000-0000-000000000016',
    case_id: DEMO_CASE_IDS.AMARA_OKAFOR,
    agent_type: 'sanctions_screener',
    status: 'completed',
    started_at: minsAfter(12, 0.7),
    completed_at: minsAfter(12, 1.4),
    input: { applicant_name: 'Amara Okafor', lists: ['OFAC', 'UN', 'PEP'] },
    output: {
      flagged: false,
      matches: [],
      lists_checked: ['OFAC SDN', 'UN Consolidated', 'PEP Database'],
      screening_summary: 'No matches found across all sanctions and PEP databases.',
    },
    confidence: 0.98,
    error: null,
    created_at: hoursAgo(12),
  },
  {
    id: '30000000-0000-0000-0000-000000000017',
    case_id: DEMO_CASE_IDS.AMARA_OKAFOR,
    agent_type: 'risk_scorer',
    status: 'completed',
    started_at: minsAfter(12, 1.5),
    completed_at: minsAfter(12, 2.2),
    input: { case_id: DEMO_CASE_IDS.AMARA_OKAFOR },
    output: {
      risk_score: 45,
      risk_level: 'medium',
      risk_factors: [
        { factor_name: 'document_quality', weight: 0.2, score: 62, explanation: 'Below-average document quality (0.62) due to poor image capture' },
        { factor_name: 'identity_verification', weight: 0.25, score: 48, explanation: 'Name discrepancy between application and document (middle initial)' },
        { factor_name: 'sanctions_screening', weight: 0.35, score: 0, explanation: 'No sanctions or watchlist matches' },
        { factor_name: 'pep_status', weight: 0.2, score: 0, explanation: 'No PEP associations detected' },
      ],
      requires_manual_review: true,
      scoring_summary: 'Medium risk due to document quality issues and name discrepancy. Manual review recommended.',
    },
    confidence: 0.78,
    error: null,
    created_at: hoursAgo(12),
  },
  {
    id: '30000000-0000-0000-0000-000000000018',
    case_id: DEMO_CASE_IDS.AMARA_OKAFOR,
    agent_type: 'case_narrator',
    status: 'completed',
    started_at: minsAfter(12, 2.2),
    completed_at: minsAfter(12, 3.4),
    input: { case_id: DEMO_CASE_IDS.AMARA_OKAFOR, risk_score: 45 },
    output: {
      narrative: demoCaseNarratives[DEMO_CASE_IDS.AMARA_OKAFOR],
      key_findings: [
        'Low document quality (0.62) — driver\'s license photographed at angle',
        'Name discrepancy: "Amara Okafor" vs. "Amara N. Okafor"',
        'No sanctions or PEP matches',
        'Composite risk score: 45/100 (Medium)',
      ],
      recommended_action: 'escalate',
      evidence_links: [
        { claim: 'Document quality below threshold', source: 'document_processor', confidence: 0.62 },
        { claim: 'Name mismatch detected', source: 'identity_verifier', confidence: 0.78 },
        { claim: 'Clean sanctions screening', source: 'sanctions_screener', confidence: 0.98 },
      ],
    },
    confidence: 0.76,
    error: null,
    created_at: hoursAgo(12),
  },

  // ========================================
  // Case 4: Maria Gonzalez-Rivera - All completed
  // ========================================
  {
    id: '30000000-0000-0000-0000-000000000019',
    case_id: DEMO_CASE_IDS.MARIA_GONZALEZ,
    agent_type: 'orchestrator',
    status: 'completed',
    started_at: hoursAgo(8),
    completed_at: minsAfter(8, 3.0),
    input: { case_id: DEMO_CASE_IDS.MARIA_GONZALEZ, applicant_name: 'Maria Gonzalez-Rivera' },
    output: { stage: 'completed', total_duration_ms: 180000 },
    confidence: 0.85,
    error: null,
    created_at: hoursAgo(8),
  },
  {
    id: '30000000-0000-0000-0000-000000000020',
    case_id: DEMO_CASE_IDS.MARIA_GONZALEZ,
    agent_type: 'document_processor',
    status: 'completed',
    started_at: hoursAgo(8),
    completed_at: minsAfter(8, 0.5),
    input: { documents: ['maria_gonzalez_passport.pdf', 'maria_gonzalez_enbridge_bill.pdf'] },
    output: {
      extracted_fields: [
        { field_name: 'full_name', value: 'Maria Elena Gonzalez-Rivera', confidence: 0.95, source_document_id: '20000000-0000-0000-0000-000000000005' },
        { field_name: 'date_of_birth', value: '1982-09-03', confidence: 0.94, source_document_id: '20000000-0000-0000-0000-000000000005' },
        { field_name: 'address', value: '501 - 200 University Avenue, Ottawa, ON K1N 5H9', confidence: 0.91, source_document_id: '20000000-0000-0000-0000-000000000006' },
      ],
      document_quality: { '20000000-0000-0000-0000-000000000005': 0.93, '20000000-0000-0000-0000-000000000006': 0.91 },
    },
    confidence: 0.92,
    error: null,
    created_at: hoursAgo(8),
  },
  {
    id: '30000000-0000-0000-0000-000000000021',
    case_id: DEMO_CASE_IDS.MARIA_GONZALEZ,
    agent_type: 'identity_verifier',
    status: 'completed',
    started_at: minsAfter(8, 0.5),
    completed_at: minsAfter(8, 1.3),
    input: { applicant_name: 'Maria Gonzalez-Rivera', extracted_fields_count: 3 },
    output: {
      verified: true,
      matches: [
        { field_name: 'full_name', expected: 'Maria Gonzalez-Rivera', actual: 'Maria Elena Gonzalez-Rivera', match: true, confidence: 0.91 },
        { field_name: 'date_of_birth', expected: '1982-09-03', actual: '1982-09-03', match: true, confidence: 0.94 },
      ],
      discrepancies: [],
      verification_summary: 'Identity verified. Full name on passport includes middle name "Elena" not provided in application — acceptable variation.',
    },
    confidence: 0.91,
    error: null,
    created_at: hoursAgo(8),
  },
  {
    id: '30000000-0000-0000-0000-000000000022',
    case_id: DEMO_CASE_IDS.MARIA_GONZALEZ,
    agent_type: 'sanctions_screener',
    status: 'completed',
    started_at: minsAfter(8, 0.5),
    completed_at: minsAfter(8, 1.5),
    input: { applicant_name: 'Maria Gonzalez-Rivera', lists: ['OFAC', 'UN', 'PEP'] },
    output: {
      flagged: true,
      matches: [
        {
          list_name: 'PEP',
          matched_name: 'Maria Elena Gonzalez-Rivera',
          match_score: 0.89,
          entry_id: 'PEP-MX-0247',
          details: 'Mexican diplomatic official — Deputy Ambassador to Canada. Classified as PEP under foreign diplomatic category.',
        },
      ],
      lists_checked: ['OFAC SDN', 'UN Consolidated', 'PEP Database'],
      screening_summary: 'PEP match identified (89% confidence). No OFAC or UN sanctions matches.',
    },
    confidence: 0.89,
    error: null,
    created_at: hoursAgo(8),
  },
  {
    id: '30000000-0000-0000-0000-000000000023',
    case_id: DEMO_CASE_IDS.MARIA_GONZALEZ,
    agent_type: 'risk_scorer',
    status: 'completed',
    started_at: minsAfter(8, 1.5),
    completed_at: minsAfter(8, 2.2),
    input: { case_id: DEMO_CASE_IDS.MARIA_GONZALEZ },
    output: {
      risk_score: 68,
      risk_level: 'high',
      risk_factors: [
        { factor_name: 'document_quality', weight: 0.2, score: 10, explanation: 'Good document quality across both submissions' },
        { factor_name: 'identity_verification', weight: 0.25, score: 12, explanation: 'Identity verified with acceptable confidence' },
        { factor_name: 'sanctions_screening', weight: 0.35, score: 5, explanation: 'No OFAC or UN sanctions matches' },
        { factor_name: 'pep_status', weight: 0.2, score: 89, explanation: 'Strong PEP match — Mexican diplomatic official (Deputy Ambassador)' },
      ],
      requires_manual_review: true,
      scoring_summary: 'High risk due to PEP status. Enhanced due diligence required per FINTRAC guidelines.',
    },
    confidence: 0.86,
    error: null,
    created_at: hoursAgo(8),
  },
  {
    id: '30000000-0000-0000-0000-000000000024',
    case_id: DEMO_CASE_IDS.MARIA_GONZALEZ,
    agent_type: 'case_narrator',
    status: 'completed',
    started_at: minsAfter(8, 2.2),
    completed_at: minsAfter(8, 3.0),
    input: { case_id: DEMO_CASE_IDS.MARIA_GONZALEZ, risk_score: 68 },
    output: {
      narrative: demoCaseNarratives[DEMO_CASE_IDS.MARIA_GONZALEZ],
      key_findings: [
        'PEP match at 89% confidence — Mexican Deputy Ambassador to Canada',
        'No OFAC or UN sanctions matches',
        'Document quality and identity verification satisfactory',
        'Composite risk score: 68/100 (High)',
      ],
      recommended_action: 'escalate',
      evidence_links: [
        { claim: 'PEP status confirmed via PEP database', source: 'sanctions_screener', confidence: 0.89 },
        { claim: 'Identity verified via Mexican passport', source: 'identity_verifier', confidence: 0.91 },
        { claim: 'Address confirmed via utility bill', source: 'document_processor', confidence: 0.91 },
      ],
    },
    confidence: 0.85,
    error: null,
    created_at: hoursAgo(8),
  },

  // ========================================
  // Case 5: James Oduya - Mixed statuses (processing)
  // ========================================
  {
    id: '30000000-0000-0000-0000-000000000025',
    case_id: DEMO_CASE_IDS.JAMES_ODUYA,
    agent_type: 'orchestrator',
    status: 'running',
    started_at: hoursAgo(1),
    completed_at: null,
    input: { case_id: DEMO_CASE_IDS.JAMES_ODUYA, applicant_name: 'James Oduya' },
    output: null,
    confidence: null,
    error: null,
    created_at: hoursAgo(1),
  },
  {
    id: '30000000-0000-0000-0000-000000000026',
    case_id: DEMO_CASE_IDS.JAMES_ODUYA,
    agent_type: 'document_processor',
    status: 'running',
    started_at: hoursAgo(1),
    completed_at: null,
    input: { documents: ['james_oduya_passport.pdf', 'james_oduya_epcor_bill.pdf', 'james_oduya_td_statement.pdf'] },
    output: null,
    confidence: null,
    error: null,
    created_at: hoursAgo(1),
  },
  {
    id: '30000000-0000-0000-0000-000000000027',
    case_id: DEMO_CASE_IDS.JAMES_ODUYA,
    agent_type: 'identity_verifier',
    status: 'pending',
    started_at: null,
    completed_at: null,
    input: null,
    output: null,
    confidence: null,
    error: null,
    created_at: hoursAgo(1),
  },
  {
    id: '30000000-0000-0000-0000-000000000028',
    case_id: DEMO_CASE_IDS.JAMES_ODUYA,
    agent_type: 'sanctions_screener',
    status: 'pending',
    started_at: null,
    completed_at: null,
    input: null,
    output: null,
    confidence: null,
    error: null,
    created_at: hoursAgo(1),
  },
  {
    id: '30000000-0000-0000-0000-000000000029',
    case_id: DEMO_CASE_IDS.JAMES_ODUYA,
    agent_type: 'risk_scorer',
    status: 'pending',
    started_at: null,
    completed_at: null,
    input: null,
    output: null,
    confidence: null,
    error: null,
    created_at: hoursAgo(1),
  },
  {
    id: '30000000-0000-0000-0000-000000000030',
    case_id: DEMO_CASE_IDS.JAMES_ODUYA,
    agent_type: 'case_narrator',
    status: 'pending',
    started_at: null,
    completed_at: null,
    input: null,
    output: null,
    confidence: null,
    error: null,
    created_at: hoursAgo(1),
  },
];
