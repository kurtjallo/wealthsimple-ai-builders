/**
 * End-to-end test for the document processing pipeline.
 *
 * Usage:
 *   npx tsx scripts/test-document-processing.ts
 *
 * Requires:
 *   - MISTRAL_API_KEY in .env.local
 *   - GEMINI_API_KEY in .env.local
 *
 * This script tests:
 *   1. Mistral OCR text extraction (from a public document URL)
 *   2. Gemini structured data extraction with confidence scoring
 *   3. Full agent pipeline (OCR -> extraction -> result)
 *
 * Note: Database operations are skipped (no Supabase required for this test).
 */

import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { ocrExtractText } from '../src/lib/ocr/mistral-client';
import { extractStructuredData } from '../src/lib/ocr/structured-extractor';
import { DocumentType } from '../src/types/index';

let passed = 0;
let warned = 0;
let failed = 0;

function logPass(msg: string): void {
  console.log(`  [PASS] ${msg}`);
  passed++;
}
function logWarn(msg: string): void {
  console.log(`  [WARN] ${msg}`);
  warned++;
}
function logFail(msg: string): void {
  console.error(`  [FAIL] ${msg}`);
  failed++;
}

// Sample public document URLs for testing
const TEST_DOCUMENTS: { url: string; type: DocumentType; description: string }[] = [
  {
    // A sample passport-like document (use a public test image)
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Microformat-hcard-full-example.png/440px-Microformat-hcard-full-example.png',
    type: 'passport',
    description: 'Sample ID card image (testing OCR + passport extraction on ID-like document)',
  },
];

async function testOcrExtraction(): Promise<string | null> {
  console.log('\n=== TEST 1: Mistral OCR Text Extraction ===\n');

  for (const doc of TEST_DOCUMENTS) {
    console.log(`Processing: ${doc.description}`);
    console.log(`URL: ${doc.url}`);
    console.log(`Type: ${doc.type}`);

    try {
      const startTime = Date.now();
      const result = await ocrExtractText({ type: 'url', content: doc.url });
      const duration = Date.now() - startTime;

      console.log(`\nOCR Result:`);
      console.log(`  Pages: ${result.page_count}`);
      console.log(`  Text length: ${result.raw_text.length} chars`);
      console.log(`  Model: ${result.model}`);
      console.log(`  Duration: ${duration}ms`);
      console.log(`  First 500 chars:\n${result.raw_text.substring(0, 500)}`);
      logPass('OCR extraction completed successfully');

      return result.raw_text; // Return for next test
    } catch (error) {
      logFail(`OCR extraction failed: ${error}`);
      return null;
    }
  }
  return null;
}

async function testStructuredExtraction(ocrText: string): Promise<void> {
  console.log('\n=== TEST 2: Gemini Structured Data Extraction ===\n');

  const docType: DocumentType = 'passport';
  console.log(`Extracting structured data as: ${docType}`);

  try {
    const startTime = Date.now();
    const result = await extractStructuredData(ocrText, docType);
    const duration = Date.now() - startTime;

    console.log(`\nExtraction Result:`);
    console.log(`  Document type: ${result.extracted.type}`);
    console.log(`  Overall confidence: ${result.overall_confidence}`);
    console.log(`  Warnings: ${result.warnings.length > 0 ? result.warnings.join(', ') : 'none'}`);
    console.log(`  Duration: ${duration}ms`);

    console.log(`\n  Extracted Fields:`);
    const data = result.extracted.data as unknown as Record<string, { value: unknown; confidence: number; source: string }>;
    for (const [key, field] of Object.entries(data)) {
      if (field && typeof field === 'object' && 'confidence' in field) {
        const confBar = '\u2588'.repeat(Math.round(field.confidence * 10)) + '\u2591'.repeat(10 - Math.round(field.confidence * 10));
        console.log(`    ${key}: "${field.value}" [${confBar}] ${(field.confidence * 100).toFixed(0)}%`);
      }
    }

    logPass('Structured extraction completed successfully');
  } catch (error) {
    logFail(`Structured extraction failed: ${error}`);
  }
}

async function testWithMockOcrText(): Promise<void> {
  console.log('\n=== TEST 3: Structured Extraction with Mock OCR Text ===\n');

  const mockTexts: { type: DocumentType; text: string }[] = [
    {
      type: 'passport',
      text: `CANADA
PASSPORT / PASSEPORT
Type/Type P
Country Code/Code du pays CAN
Surname/Nom SMITH
Given Names/Prenoms JOHN ROBERT
Nationality/Nationalite CANADIAN / CANADIENNE
Date of birth/Date de naissance 15 MAR 1985
Sex/Sexe M
Place of birth/Lieu de naissance TORONTO, ON
Date of issue/Date de delivrance 20 JUN 2020
Date of expiry/Date d'expiration 20 JUN 2030
Authority/Autorite PASSPORT CANADA
Passport No./No de passeport GA123456

P<CANSMITH<<JOHN<ROBERT<<<<<<<<<<<<<<<<<<<
GA12345678CAN8503151M3006207<<<<<<<<<<<<<<02`,
    },
    {
      type: 'utility_bill',
      text: `Toronto Hydro
Statement Date: January 15, 2025
Account Number: 7890-1234-5678

John R. Smith
123 Main Street, Unit 4B
Toronto, ON M5V 2K1

Service Address:
123 Main Street, Unit 4B
Toronto, ON M5V 2K1

Billing Period: Dec 15, 2024 - Jan 14, 2025
Amount Due: $127.45
Due Date: February 5, 2025`,
    },
    {
      type: 'corporate_doc',
      text: `CERTIFICATE OF INCORPORATION
Business Corporations Act

Corporation Name: ACME Technologies Inc.
Corporation Number: BC1234567
Date of Incorporation: March 15, 2020
Jurisdiction: British Columbia, Canada

Registered Office:
456 Business Park Drive, Suite 200
Vancouver, BC V6B 4N2

Directors:
1. John Robert Smith - Director
2. Sarah Jane Williams - Director
3. Michael David Chen - Director

Type of Corporation: Private Corporation (BC)`,
    },
  ];

  for (const mock of mockTexts) {
    console.log(`\nTesting ${mock.type} extraction with mock text...`);

    try {
      const startTime = Date.now();
      const result = await extractStructuredData(mock.text, mock.type);
      const duration = Date.now() - startTime;

      console.log(`  Type: ${result.extracted.type}`);
      console.log(`  Confidence: ${(result.overall_confidence * 100).toFixed(0)}%`);
      console.log(`  Warnings: ${result.warnings.length > 0 ? result.warnings.join(', ') : 'none'}`);
      console.log(`  Duration: ${duration}ms`);

      // Validate confidence is reasonable for clean mock text
      if (result.overall_confidence >= 0.7) {
        logPass(`High confidence extraction (${(result.overall_confidence * 100).toFixed(0)}%)`);
      } else if (result.overall_confidence >= 0.3) {
        logWarn(`Medium confidence extraction (${(result.overall_confidence * 100).toFixed(0)}%)`);
      } else {
        logFail(`Low confidence extraction (${(result.overall_confidence * 100).toFixed(0)}%)`);
      }

      // Print extracted fields
      const data = result.extracted.data as unknown as Record<string, { value: unknown; confidence: number }>;
      for (const [key, field] of Object.entries(data)) {
        if (field && typeof field === 'object' && 'confidence' in field) {
          console.log(`    ${key}: "${field.value}" (${(field.confidence * 100).toFixed(0)}%)`);
        }
      }
    } catch (error) {
      logFail(`${mock.type} extraction failed: ${error}`);
    }
  }
}

async function main(): Promise<void> {
  console.log('========================================');
  console.log('  Document Processing Pipeline Test');
  console.log('========================================');

  // Check environment variables
  if (!process.env.MISTRAL_API_KEY) {
    console.error('\n[ERROR] MISTRAL_API_KEY not set. Set it in .env.local');
    process.exit(1);
  }
  if (!process.env.GEMINI_API_KEY) {
    console.error('\n[ERROR] GEMINI_API_KEY not set. Set it in .env.local');
    process.exit(1);
  }

  console.log('\nEnvironment: OK (API keys found)');

  // Test 1: OCR extraction from real URL
  const ocrText = await testOcrExtraction();

  // Test 2: Structured extraction from real OCR output
  if (ocrText) {
    await testStructuredExtraction(ocrText);
  }

  // Test 3: Structured extraction from mock OCR text (always runs)
  await testWithMockOcrText();

  console.log('\n========================================');
  console.log(`  Results: ${passed} passed, ${warned} warned, ${failed} failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
