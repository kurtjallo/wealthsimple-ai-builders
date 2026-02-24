// Mistral OCR API response types
// These mirror the SDK types for our internal usage

export interface OcrPageDimensions {
  dpi: number;
  height: number;
  width: number;
}

export interface OcrImage {
  id: string;
  topLeftX: number;
  topLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
  imageBase64?: string;
}

export interface OcrPage {
  index: number;
  markdown: string;
  images: OcrImage[];
  dimensions: OcrPageDimensions | null;
}

export interface OcrUsageInfo {
  pagesProcessed: number;
  docSizeBytes?: number | null;
}

export interface OcrResponse {
  pages: OcrPage[];
  model: string;
  usageInfo: OcrUsageInfo;
}

// Input types for our OCR wrapper
export interface OcrDocumentInput {
  type: 'url' | 'base64';
  content: string; // URL string or base64-encoded document
  mime_type?: string; // e.g., 'image/jpeg', 'application/pdf'
}
