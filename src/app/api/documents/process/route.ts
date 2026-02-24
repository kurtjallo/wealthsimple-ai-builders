import { NextRequest, NextResponse } from 'next/server';
import { documentProcessorAgent } from '@/lib/agents/document-processor';
import type { DocumentProcessorInput } from '@/lib/agents/document-processor';
import { getDocument } from '@/lib/supabase/documents';
import type { DocumentType } from '@/types/index';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { document_id } = body;

    if (!document_id) {
      return NextResponse.json({ error: 'document_id is required' }, { status: 400 });
    }

    // Fetch document record
    const document = await getDocument(document_id);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (document.processing_status === 'completed') {
      return NextResponse.json({
        message: 'Document already processed',
        document_id: document.id,
        processing_status: document.processing_status,
        overall_confidence: document.overall_confidence,
      });
    }

    if (document.processing_status === 'processing') {
      return NextResponse.json({
        message: 'Document is currently being processed',
        document_id: document.id,
        processing_status: document.processing_status,
      });
    }

    // Run the Document Processor agent
    const input: DocumentProcessorInput = {
      case_id: document.case_id,
      document_id: document.id,
      document_type: document.type as DocumentType,
      file_path: document.file_path || undefined,
      file_url: document.file_url || undefined,
    };

    const result = await documentProcessorAgent.run(input);

    return NextResponse.json({
      document_id: document.id,
      success: result.success,
      confidence: result.confidence,
      duration_ms: result.duration_ms,
      error: result.error,
      extracted: result.data?.extracted ?? null,
      warnings: (result.metadata?.warnings as string[]) ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Processing failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
