'use client';

import { useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { DocumentType } from '@/types';

interface UploadedDocument {
  id: string;
  file_name: string;
  type: DocumentType;
  status: 'uploading' | 'uploaded' | 'error';
  error?: string;
  progress: number;
}

interface DocumentUploadProps {
  caseId: string;
  onUploadComplete?: (documents: UploadedDocument[]) => void;
  onAllUploaded?: () => void;
  maxFiles?: number;
}

const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: 'passport', label: 'Passport' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'utility_bill', label: 'Utility Bill' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'corporate_doc', label: 'Corporate Document' },
];

export function DocumentUpload({ caseId, onUploadComplete, onAllUploaded, maxFiles = 5 }: DocumentUploadProps) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('passport');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File, docType: DocumentType) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const newDoc: UploadedDocument = {
      id: tempId,
      file_name: file.name,
      type: docType,
      status: 'uploading',
      progress: 0,
    };

    setDocuments(prev => [...prev, newDoc]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', docType);

      const response = await fetch(`/api/cases/${caseId}/documents/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();

      setDocuments(prev =>
        prev.map(d =>
          d.id === tempId
            ? { ...d, id: data.document.id, status: 'uploaded' as const, progress: 100 }
            : d
        )
      );

      return data.document;
    } catch (error) {
      setDocuments(prev =>
        prev.map(d =>
          d.id === tempId
            ? { ...d, status: 'error' as const, error: error instanceof Error ? error.message : 'Upload failed' }
            : d
        )
      );
      return null;
    }
  }, [caseId]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, maxFiles - documents.length);

    const results = await Promise.all(
      fileArray.map(file => uploadFile(file, selectedType))
    );

    const uploaded = results.filter(Boolean);
    if (uploaded.length > 0) {
      onUploadComplete?.(documents);
    }

    // Check if all are done
    setDocuments(prev => {
      const allDone = prev.every(d => d.status !== 'uploading');
      if (allDone && prev.length > 0) {
        onAllUploaded?.();
      }
      return prev;
    });
  }, [documents.length, maxFiles, selectedType, uploadFile, onUploadComplete, onAllUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeDocument = useCallback((docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  }, []);

  return (
    <div className="space-y-4">
      {/* Document type selector */}
      <div className="flex gap-2 flex-wrap">
        {DOCUMENT_TYPE_OPTIONS.map(opt => (
          <Button
            key={opt.value}
            variant={selectedType === opt.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
          }
          ${documents.length >= maxFiles ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <span className="flex justify-center text-muted-foreground mb-3">
          <Upload size={20} strokeWidth={1.5} />
        </span>
        <p className="text-sm font-medium">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, JPG, PNG up to 10MB. Max {maxFiles} files.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          multiple
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {/* Uploaded documents list */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map(doc => (
            <Card key={doc.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {doc.status === 'uploading' && (
                    <span className="text-primary">
                      <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
                    </span>
                  )}
                  {doc.status === 'uploaded' && (
                    <span className="text-green-500">
                      <CheckCircle2 size={16} strokeWidth={1.5} />
                    </span>
                  )}
                  {doc.status === 'error' && (
                    <span className="text-red-500">
                      <AlertCircle size={16} strokeWidth={1.5} />
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    <File size={16} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{doc.file_name}</p>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className="text-xs">
                        {doc.type.replace('_', ' ')}
                      </Badge>
                      {doc.error && (
                        <span className="text-xs text-red-500">{doc.error}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDocument(doc.id);
                  }}
                >
                  <X size={16} strokeWidth={1.5} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
