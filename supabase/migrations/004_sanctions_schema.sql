-- Enable pg_trgm extension for fuzzy text search (trigram matching)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- sanctions_entries: Unified table for OFAC, UN, and PEP lists
-- ============================================================
CREATE TABLE IF NOT EXISTS sanctions_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,              -- 'OFAC_SDN', 'UN_SECURITY_COUNCIL', 'PEP'
  source_id TEXT,                    -- Original ID from source list
  entry_type TEXT NOT NULL,          -- 'individual' or 'entity'
  primary_name TEXT NOT NULL,        -- Full name as listed
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  nationality TEXT,
  programs TEXT[],                   -- Sanctioning program codes
  remarks TEXT,
  source_url TEXT,
  raw_data JSONB,                    -- Full original entry for reference
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Unique constraint for upsert: one entry per source+source_id pair
CREATE UNIQUE INDEX IF NOT EXISTS idx_sanctions_entries_source_source_id
  ON sanctions_entries (source, source_id);

-- ============================================================
-- sanctions_aliases: Alternative names (AKA, FKA, NKA)
-- ============================================================
CREATE TABLE IF NOT EXISTS sanctions_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES sanctions_entries(id) ON DELETE CASCADE,
  alias_name TEXT NOT NULL,
  alias_type TEXT,                   -- 'aka', 'fka', 'nka'
  alias_quality TEXT                 -- 'good', 'low' (UN quality ratings)
);

-- ============================================================
-- Indexes
-- ============================================================

-- Source filtering
CREATE INDEX IF NOT EXISTS idx_sanctions_entries_source
  ON sanctions_entries (source);

-- Trigram index on primary_name for fuzzy search
CREATE INDEX IF NOT EXISTS idx_sanctions_entries_primary_name
  ON sanctions_entries USING GIN (primary_name gin_trgm_ops);

-- Entry type filtering
CREATE INDEX IF NOT EXISTS idx_sanctions_entries_entry_type
  ON sanctions_entries (entry_type);

-- Trigram index on alias_name for fuzzy search
CREATE INDEX IF NOT EXISTS idx_sanctions_aliases_alias_name
  ON sanctions_aliases USING GIN (alias_name gin_trgm_ops);

-- Foreign key lookup
CREATE INDEX IF NOT EXISTS idx_sanctions_aliases_entry_id
  ON sanctions_aliases (entry_id);

-- ============================================================
-- updated_at trigger (reuse pattern from initial schema)
-- ============================================================
CREATE OR REPLACE TRIGGER set_sanctions_entries_updated_at
  BEFORE UPDATE ON sanctions_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS (permissive for now, matching existing pattern)
-- ============================================================
ALTER TABLE sanctions_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sanctions_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to sanctions_entries"
  ON sanctions_entries FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to sanctions_aliases"
  ON sanctions_aliases FOR ALL USING (true) WITH CHECK (true);
