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
      };
      documents: {
        Row: {
          id: string;
          case_id: string;
          type: string;
          file_name: string;
          file_url: string;
          ocr_output: string | null;
          extracted_data: Json | null;
          confidence: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          case_id: string;
          type: string;
          file_name: string;
          file_url: string;
          ocr_output?: string | null;
          extracted_data?: Json | null;
          confidence?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          case_id?: string;
          type?: string;
          file_name?: string;
          file_url?: string;
          ocr_output?: string | null;
          extracted_data?: Json | null;
          confidence?: number | null;
          created_at?: string;
        };
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
      };
    };
  };
}
