import { NextRequest, NextResponse } from 'next/server';
import { processCase, getPipelineSummary } from '@/lib/agents/orchestrator';
import { registerAllStubs } from '@/lib/agents/stubs';
import { DocumentType } from '@/types';

// Register stubs on module load (will be replaced by real agents in later phases)
registerAllStubs();

interface ProcessCaseRequest {
  case_id: string;
  applicant_name: string;
  applicant_email: string;
  documents: Array<{
    id: string;
    file_url: string;
    file_name: string;
    type: DocumentType;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: ProcessCaseRequest = await request.json();

    // Validate required fields
    if (!body.case_id || !body.applicant_name || !body.applicant_email) {
      return NextResponse.json(
        { error: 'Missing required fields: case_id, applicant_name, applicant_email' },
        { status: 400 },
      );
    }

    if (!body.documents || body.documents.length === 0) {
      return NextResponse.json(
        { error: 'At least one document is required' },
        { status: 400 },
      );
    }

    // Process the case through the full pipeline
    const pipelineState = await processCase({
      case_id: body.case_id,
      documents: body.documents,
      applicant_name: body.applicant_name,
      applicant_email: body.applicant_email,
    });

    // Return full pipeline state
    return NextResponse.json({
      success: pipelineState.stage === 'completed',
      pipeline_state: pipelineState,
      summary: getPipelineSummary(pipelineState),
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Pipeline processing failed: ${message}` },
      { status: 500 },
    );
  }
}
