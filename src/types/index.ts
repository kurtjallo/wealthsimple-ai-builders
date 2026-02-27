// Re-export agent and pipeline types
export * from './agents';
export * from './pipeline';

// Case status lifecycle
export type CaseStatus = 'pending' | 'processing' | 'review' | 'approved' | 'denied' | 'escalated';

// Agent types in the system
export type AgentType = 'orchestrator' | 'document_processor' | 'identity_verifier' | 'sanctions_screener' | 'risk_scorer' | 'case_narrator';

// Agent run status
export type AgentRunStatus = 'pending' | 'running' | 'completed' | 'failed';

// Document types
export type DocumentType = 'passport' | 'drivers_license' | 'utility_bill' | 'bank_statement' | 'corporate_doc';

// Document processing status
export type DocumentProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Risk levels
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// Decision types
export type DecisionType = 'approved' | 'denied' | 'escalated';

// Actor types for audit
export type ActorType = 'system' | 'agent' | 'officer';

// ---- Core Domain Models ----

export interface Case {
  id: string;
  status: CaseStatus;
  applicant_name: string;
  applicant_email: string;
  risk_score: number | null;
  risk_level: RiskLevel | null;
  decision: DecisionType | null;
  decision_justification: string | null;
  officer_id: string | null;
  narrative: string | null;
  routing_decision: string | null;
  routing_reasons: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  case_id: string;
  type: DocumentType;
  file_name: string;
  file_path: string | null;
  file_url: string | null;
  ocr_output: string | null;
  ocr_raw_text: string | null;
  extracted_data: Record<string, unknown> | null;
  confidence: number | null;
  overall_confidence: number | null;
  processing_status: DocumentProcessingStatus;
  processing_error: string | null;
  processing_time_ms: number | null;
  warnings: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface AgentRun {
  id: string;
  case_id: string;
  agent_type: AgentType;
  status: AgentRunStatus;
  started_at: string | null;
  completed_at: string | null;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  confidence: number | null;
  error: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  case_id: string;
  action: string;
  actor_type: ActorType;
  actor_id: string;
  details: Record<string, unknown> | null;
  created_at: string;
}
