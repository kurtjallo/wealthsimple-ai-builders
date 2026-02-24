import { NextRequest, NextResponse } from 'next/server';
import { getDocument } from '@/lib/supabase/documents';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    const document = await getDocument(id);
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: document.id,
      case_id: document.case_id,
      type: document.type,
      file_name: document.file_name,
      processing_status: document.processing_status,
      ocr_raw_text: document.ocr_raw_text,
      extracted_data: document.extracted_data,
      overall_confidence: document.overall_confidence,
      processing_time_ms: document.processing_time_ms,
      processing_error: document.processing_error,
      warnings: document.warnings,
      created_at: document.created_at,
      updated_at: document.updated_at,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve document';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
