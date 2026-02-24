import { NextRequest, NextResponse } from 'next/server';
import { uploadDocument } from '@/lib/supabase/storage';
import { createDocument } from '@/lib/supabase/documents';
import type { DocumentType } from '@/types/index';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_DOC_TYPES: DocumentType[] = [
  'passport',
  'drivers_license',
  'utility_bill',
  'bank_statement',
  'corporate_doc',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const caseId = formData.get('case_id') as string | null;
    const documentType = formData.get('document_type') as DocumentType | null;

    // Validate required fields
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!caseId) {
      return NextResponse.json({ error: 'case_id is required' }, { status: 400 });
    }
    if (!documentType || !VALID_DOC_TYPES.includes(documentType)) {
      return NextResponse.json(
        { error: `document_type must be one of: ${VALID_DOC_TYPES.join(', ')}` },
        { status: 400 },
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type '${file.type}' not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size ${(file.size / 1024 / 1024).toFixed(1)}MB exceeds maximum of 10MB` },
        { status: 400 },
      );
    }

    // Upload file to Supabase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { path: storagePath } = await uploadDocument(
      caseId,
      file.name,
      fileBuffer,
      file.type,
    );

    // Create document record in database
    const document = await createDocument({
      case_id: caseId,
      type: documentType,
      file_name: file.name,
      file_path: storagePath,
    });

    return NextResponse.json(
      {
        document_id: document.id,
        file_name: document.file_name,
        document_type: document.type,
        processing_status: document.processing_status,
        message: 'Document uploaded successfully. Call POST /api/documents/process to start processing.',
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
