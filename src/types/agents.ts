import type { AgentType, DocumentType, RiskLevel } from './index';

// ---- Base Agent Types ----

/** Generic result wrapper every agent returns */
export interface AgentResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  confidence: number; // 0-1
  duration_ms: number;
  agent_type: AgentType;
  metadata: Record<string, unknown>;
}

/** Base config for all agents */
export interface AgentConfig {
  model: string; // e.g. "gemini-2.5-pro"
  max_tokens: number;
  timeout_ms: number; // Max time before timeout
  retry_count: number; // Number of retries on failure
  temperature?: number;
}

// ---- Document Processor ----

export interface DocumentProcessorInput {
  case_id: string;
  documents: Array<{
    id: string;
    file_url: string;
    file_name: string;
    type: DocumentType;
  }>;
}

export interface ExtractedField {
  field_name: string; // e.g. "full_name", "date_of_birth"
  value: string;
  confidence: number; // 0-1
  source_document_id: string;
}

export interface DocumentProcessorOutput {
  extracted_fields: ExtractedField[];
  raw_ocr_text: Record<string, string>; // doc_id -> ocr text
  document_quality: Record<string, number>; // doc_id -> quality 0-1
}

// ---- Identity Verifier ----

export interface IdentityVerifierInput {
  case_id: string;
  extracted_fields: ExtractedField[];
  applicant_name: string;
}

export interface IdentityMatch {
  field_name: string;
  expected: string;
  actual: string;
  match: boolean;
  confidence: number;
}

export interface IdentityVerifierOutput {
  verified: boolean;
  matches: IdentityMatch[];
  discrepancies: string[];
  verification_summary: string;
}

// ---- Sanctions Screener ----

export interface SanctionsScreenerInput {
  case_id: string;
  applicant_name: string;
  extracted_fields: ExtractedField[];
}

export interface SanctionsMatch {
  list_name: string; // "UN", "OFAC", "PEP"
  matched_name: string;
  match_score: number; // 0-1 similarity
  entry_id: string;
  details: string;
}

export interface SanctionsScreenerOutput {
  flagged: boolean;
  matches: SanctionsMatch[];
  lists_checked: string[];
  screening_summary: string;
}

// ---- Risk Scorer ----

export interface RiskScorerInput {
  case_id: string;
  document_result: AgentResult<DocumentProcessorOutput>;
  identity_result: AgentResult<IdentityVerifierOutput>;
  sanctions_result: AgentResult<SanctionsScreenerOutput>;
}

export interface RiskFactor {
  factor_name: string; // e.g. "sanctions_match", "document_quality"
  weight: number; // 0-1
  score: number; // 0-100
  explanation: string;
}

export interface RiskScorerOutput {
  risk_score: number; // 0-100
  risk_level: RiskLevel; // low/medium/high/critical
  risk_factors: RiskFactor[];
  requires_manual_review: boolean;
  scoring_summary: string;
}

// ---- Case Narrator ----

export interface CaseNarratorInput {
  case_id: string;
  applicant_name: string;
  document_result: AgentResult<DocumentProcessorOutput>;
  identity_result: AgentResult<IdentityVerifierOutput>;
  sanctions_result: AgentResult<SanctionsScreenerOutput>;
  risk_result: AgentResult<RiskScorerOutput>;
}

export interface CaseNarratorOutput {
  narrative: string; // Human-readable case assessment
  key_findings: string[]; // Bullet points
  recommended_action: string; // "approve" | "deny" | "escalate"
  evidence_links: Array<{
    claim: string;
    source: string;
    confidence: number;
  }>;
}
