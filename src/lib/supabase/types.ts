export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      cases: {
        Row: {
          id: string;
          status: string;
          applicant_name: string;
          applicant_email: string | null;
          risk_score: number | null;
          risk_level: string | null;
          decision: string | null;
          decision_justification: string | null;
          officer_id: string | null;
          narrative: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          status?: string;
          applicant_name: string;
          applicant_email?: string | null;
          risk_score?: number | null;
          risk_level?: string | null;
          decision?: string | null;
          decision_justification?: string | null;
          officer_id?: string | null;
          narrative?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          status?: string;
          applicant_name?: string;
          applicant_email?: string | null;
          risk_score?: number | null;
          risk_level?: string | null;
          decision?: string | null;
          decision_justification?: string | null;
          officer_id?: string | null;
          narrative?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          case_id: string;
          type: string;
          file_name: string;
          file_path: string | null;
          file_url: string | null;
          file_size: number | null;
          mime_type: string | null;
          ocr_output: string | null;
          ocr_raw_text: string | null;
          extracted_data: Json | null;
          confidence: number | null;
          overall_confidence: number | null;
          processing_status: string;
          processing_error: string | null;
          processing_time_ms: number | null;
          warnings: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          type: string;
          file_name: string;
          file_path?: string | null;
          file_url?: string | null;
          file_size?: number | null;
          mime_type?: string | null;
          ocr_output?: string | null;
          ocr_raw_text?: string | null;
          extracted_data?: Json | null;
          confidence?: number | null;
          overall_confidence?: number | null;
          processing_status?: string;
          processing_error?: string | null;
          processing_time_ms?: number | null;
          warnings?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          type?: string;
          file_name?: string;
          file_path?: string | null;
          file_url?: string | null;
          file_size?: number | null;
          mime_type?: string | null;
          ocr_output?: string | null;
          ocr_raw_text?: string | null;
          extracted_data?: Json | null;
          confidence?: number | null;
          overall_confidence?: number | null;
          processing_status?: string;
          processing_error?: string | null;
          processing_time_ms?: number | null;
          warnings?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      agent_runs: {
        Row: {
          id: string;
          case_id: string;
          agent_type: string;
          status: string;
          started_at: string | null;
          completed_at: string | null;
          input: Json | null;
          output: Json | null;
          confidence: number | null;
          error: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          agent_type: string;
          status?: string;
          started_at?: string | null;
          completed_at?: string | null;
          input?: Json | null;
          output?: Json | null;
          confidence?: number | null;
          error?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          agent_type?: string;
          status?: string;
          started_at?: string | null;
          completed_at?: string | null;
          input?: Json | null;
          output?: Json | null;
          confidence?: number | null;
          error?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          case_id: string;
          action: string;
          actor_type: string;
          actor_id: string;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          action: string;
          actor_type: string;
          actor_id: string;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          action?: string;
          actor_type?: string;
          actor_id?: string;
          details?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      sanctions_entries: {
        Row: {
          id: string;
          source: string;
          source_id: string | null;
          entry_type: string;
          primary_name: string;
          first_name: string | null;
          last_name: string | null;
          date_of_birth: string | null;
          nationality: string | null;
          programs: string[];
          remarks: string | null;
          source_url: string | null;
          raw_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          source: string;
          source_id?: string | null;
          entry_type: string;
          primary_name: string;
          first_name?: string | null;
          last_name?: string | null;
          date_of_birth?: string | null;
          nationality?: string | null;
          programs?: string[];
          remarks?: string | null;
          source_url?: string | null;
          raw_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          source?: string;
          source_id?: string | null;
          entry_type?: string;
          primary_name?: string;
          first_name?: string | null;
          last_name?: string | null;
          date_of_birth?: string | null;
          nationality?: string | null;
          programs?: string[];
          remarks?: string | null;
          source_url?: string | null;
          raw_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sanctions_aliases: {
        Row: {
          id: string;
          entry_id: string;
          alias_name: string;
          alias_type: string | null;
          alias_quality: string | null;
        };
        Insert: {
          id?: string;
          entry_id: string;
          alias_name: string;
          alias_type?: string | null;
          alias_quality?: string | null;
        };
        Update: {
          id?: string;
          entry_id?: string;
          alias_name?: string;
          alias_type?: string | null;
          alias_quality?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
