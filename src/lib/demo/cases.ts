import type { Database } from '@/lib/supabase/types';

type CaseInsert = Database['public']['Tables']['cases']['Insert'];

// Deterministic UUIDs for demo cases
export const DEMO_CASE_IDS = {
  SARAH_CHEN: '10000000-0000-0000-0000-000000000001',
  VIKTOR_PETROV: '10000000-0000-0000-0000-000000000002',
  AMARA_OKAFOR: '10000000-0000-0000-0000-000000000003',
  MARIA_GONZALEZ: '10000000-0000-0000-0000-000000000004',
  JAMES_ODUYA: '10000000-0000-0000-0000-000000000005',
} as const;

export const DEMO_OFFICER_ID = 'officer-demo-001';

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const demoCases: CaseInsert[] = [
  // Case 1: Sarah Chen - Clean, low risk, approved
  {
    id: DEMO_CASE_IDS.SARAH_CHEN,
    status: 'approved',
    applicant_name: 'Sarah Chen',
    applicant_email: 'sarah.chen@example.com',
    risk_score: 12,
    risk_level: 'low',
    decision: 'approved',
    decision_justification:
      'All identity documents verified with high confidence. No sanctions matches. Low risk score of 12. Standard onboarding approved.',
    officer_id: DEMO_OFFICER_ID,
    narrative:
      'Sarah Chen presents a straightforward, low-risk KYC profile. Her Canadian passport (C4829173) was verified with 0.97 confidence, and her utility bill confirmed her residential address at 142 Maple Drive, Toronto, ON M5V 2T6. Identity verification passed all checks with no discrepancies between submitted documents.\n\nSanctions screening against OFAC SDN, UN Consolidated, and PEP databases returned zero matches. All name variants and phonetic equivalents were checked with no hits.\n\nThe composite risk score of 12/100 places this applicant firmly in the low-risk category. Document quality was excellent (0.95 average), identity verification confidence was high (0.94), and no adverse screening signals were detected.\n\nRecommendation: Approve for standard onboarding. No enhanced due diligence required. This case meets all KYC requirements under FINTRAC/PCMLTFA guidelines.',
    routing_decision: 'auto_approve',
    routing_reasons: ['risk_score_below_threshold', 'no_sanctions_matches', 'high_document_confidence'],
    created_at: hoursAgo(48),
    updated_at: hoursAgo(47),
  },

  // Case 2: Viktor Petrov - Sanctions match, critical risk, escalated
  {
    id: DEMO_CASE_IDS.VIKTOR_PETROV,
    status: 'escalated',
    applicant_name: 'Viktor Petrov',
    applicant_email: 'v.petrov@mail.ru',
    risk_score: 87,
    risk_level: 'critical',
    decision: 'escalated',
    decision_justification:
      'OFAC SDN match at 94% confidence requires immediate escalation. Applicant name matches sanctioned individual Viktor A. Petrov (OFAC ID: 29847). Potential STR filing required under FINTRAC guidelines.',
    officer_id: DEMO_OFFICER_ID,
    narrative:
      'Viktor Petrov presents a critical-risk KYC profile requiring immediate compliance escalation. His Russian Federation passport (72 4839201) was processed with adequate confidence (0.88), though the document showed signs of wear at the edges.\n\nSanctions screening produced a high-confidence match (94%) against the OFAC SDN list. The matched entry, Viktor A. Petrov (OFAC ID: 29847), is listed under the UKRAINE-EO13661 program for involvement in sanctioned activities. The name match was confirmed via both direct string comparison and phonetic analysis. A secondary potential match was identified on the UN Consolidated list at 67% confidence, though this may represent the same underlying individual.\n\nThe composite risk score of 87/100 reflects the critical nature of the sanctions match (weighted 35% of total score), combined with elevated PEP proximity indicators. Document verification was otherwise satisfactory, with identity fields consistent across submitted materials.\n\nRecommendation: Escalate immediately. Do not proceed with onboarding. A Suspicious Transaction Report (STR) should be filed with FINTRAC. This case requires senior compliance officer review and potential referral to legal counsel.',
    routing_decision: 'escalate',
    routing_reasons: ['sanctions_match_ofac', 'risk_score_critical', 'str_referral_recommended'],
    created_at: hoursAgo(36),
    updated_at: hoursAgo(34),
  },

  // Case 3: Amara Okafor - Edge case, medium risk, in review
  {
    id: DEMO_CASE_IDS.AMARA_OKAFOR,
    status: 'review',
    applicant_name: 'Amara Okafor',
    applicant_email: 'amara.okafor@gmail.com',
    risk_score: 45,
    risk_level: 'medium',
    decision: null,
    decision_justification: null,
    officer_id: null,
    narrative:
      'Amara Okafor presents a medium-risk KYC profile that warrants manual review due to document quality concerns and a minor name discrepancy. The submitted driver\'s license (Ontario DL: O4829-17365-20901) was processed with below-average OCR confidence (0.62) due to poor image quality — the document appears to have been photographed at an angle with uneven lighting.\n\nThe extracted name from the driver\'s license reads "Amara N. Okafor," while the application was submitted under "Amara Okafor." This minor discrepancy (middle initial present on document but absent from application) requires officer review to confirm identity. Date of birth and address fields were extracted successfully despite the image quality issues.\n\nSanctions screening returned no matches across OFAC, UN, or PEP databases. The risk score of 45/100 is driven primarily by the low document confidence (contributing approximately 18 points) and the name discrepancy flag (contributing approximately 12 points).\n\nRecommendation: Manual review required. Request higher-quality document scan if possible. The applicant does not present sanctions or PEP concerns, and the name discrepancy appears to be a minor omission rather than an attempt at identity fraud.',
    routing_decision: 'manual_review',
    routing_reasons: ['low_document_confidence', 'name_discrepancy', 'ocr_quality_below_threshold'],
    created_at: hoursAgo(12),
    updated_at: hoursAgo(11),
  },

  // Case 4: Maria Gonzalez-Rivera - PEP, high risk, in review
  {
    id: DEMO_CASE_IDS.MARIA_GONZALEZ,
    status: 'review',
    applicant_name: 'Maria Gonzalez-Rivera',
    applicant_email: 'mgonzalez@diplomatico.mx',
    risk_score: 68,
    risk_level: 'high',
    decision: null,
    decision_justification: null,
    officer_id: null,
    narrative:
      'Maria Gonzalez-Rivera presents a high-risk KYC profile due to her status as a Politically Exposed Person (PEP). Her Mexican passport (G28491037) was verified with high confidence (0.93), and all extracted identity fields are consistent across submitted documents.\n\nSanctions screening against OFAC and UN databases returned no direct matches. However, PEP database screening identified a strong match (89% confidence) to Maria Elena Gonzalez-Rivera, listed as a Mexican diplomatic official serving as Deputy Ambassador to Canada. The PEP match aligns with the applicant\'s stated occupation as "diplomatic services" and her email domain (diplomatico.mx).\n\nThe composite risk score of 68/100 is driven primarily by the PEP classification (contributing approximately 20 points via the PEP weight) and the associated enhanced due diligence requirements. Document quality (0.93) and identity verification (0.91) were both satisfactory.\n\nRecommendation: Enhanced due diligence required. PEP status does not preclude onboarding but requires senior officer approval, source-of-funds verification, and ongoing monitoring. The applicant should be classified as high-risk for relationship management purposes.',
    routing_decision: 'manual_review',
    routing_reasons: ['pep_match', 'risk_score_high', 'enhanced_due_diligence_required'],
    created_at: hoursAgo(8),
    updated_at: hoursAgo(7),
  },

  // Case 5: James Oduya - Processing, no risk score yet
  {
    id: DEMO_CASE_IDS.JAMES_ODUYA,
    status: 'processing',
    applicant_name: 'James Oduya',
    applicant_email: 'james.oduya@outlook.com',
    risk_score: null,
    risk_level: null,
    decision: null,
    decision_justification: null,
    officer_id: null,
    narrative: null,
    routing_decision: null,
    routing_reasons: null,
    created_at: hoursAgo(1),
    updated_at: hoursAgo(0.5),
  },
];
