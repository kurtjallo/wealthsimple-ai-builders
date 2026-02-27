-- Add confidence routing columns to cases table
ALTER TABLE cases ADD COLUMN IF NOT EXISTS routing_decision TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS routing_reasons JSONB;

-- Add index for filtering by routing decision
CREATE INDEX IF NOT EXISTS idx_cases_routing_decision ON cases(routing_decision);
