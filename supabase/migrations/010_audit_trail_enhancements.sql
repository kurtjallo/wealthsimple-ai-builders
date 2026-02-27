-- Phase 9: Enhance audit_logs for FINTRAC compliance
-- Adds event_type column for faster category filtering
-- Adds indexes for compliance reporting queries

-- Add event_type column for categorizing audit entries
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS event_type TEXT;

-- Add index for event_type filtering (common in compliance reports)
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);

-- Add index for actor_type + created_at (common query: "all officer decisions in date range")
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_type_date ON audit_logs(actor_type, created_at DESC);

-- Add index for action filtering (common: "all approvals", "all STR referrals")
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Add composite index for case audit trail (all events for a case, ordered)
CREATE INDEX IF NOT EXISTS idx_audit_logs_case_timeline ON audit_logs(case_id, created_at ASC);

-- Comment explaining FINTRAC record-keeping alignment
COMMENT ON TABLE audit_logs IS 'Immutable audit trail for FINTRAC/PCMLTFA compliance. Records must be retained for 5+ years. Captures who (actor_type/actor_id), what (action/details), when (created_at), why (details.justification or details.confidence).';
