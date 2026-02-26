import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { uploadDocument } from '@/lib/supabase/storage';
import { DocumentType } from '@/types';
import { randomUUID } from 'crypto';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: caseId } = await params;

  try {
    const supabase = createServerSupabaseClient();

    // Verify case exists
    const { data: caseData, error: caseError } = await supabase
      .from('cases')
      .select('id, status')
      .eq('id', caseId)
      .single();

    if (caseError || !caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const documentType = formData.get('document_type') as DocumentType | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!documentType) {
      return NextResponse.json({ error: 'document_type is required' }, { status: 400 });
    }

    // Validate file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 10MB` },
        { status: 400 }
      );
    }

    // Generate document ID
    const documentId = randomUUID();

    // Upload to Supabase Storage
    const { path } = await uploadDocument(caseId, documentId, file);

    // Create document record in database
    const { data: document, error: insertError } = await supabase
      .from('documents')
      .insert({
        id: documentId,
        case_id: caseId,
        type: documentType,
        file_name: file.name,
        file_url: path,
        file_path: path,
        file_size: file.size,
        mime_type: file.type,
        processing_status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create document record: ${insertError.message}`);
    }

    return NextResponse.json({
      document,
      message: `Document uploaded successfully: ${file.name}`,
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
