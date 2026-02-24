# Test Documents

This directory is for storing sample documents used to test the document processing pipeline.

## How to Test

Run the automated test script:

```bash
npx tsx scripts/test-document-processing.ts
```

Or using the npm script:

```bash
npm run test:documents
```

This script tests:
1. Mistral OCR text extraction from a public image URL
2. Gemini structured extraction on real OCR output
3. Gemini structured extraction on mock OCR text (passport, utility bill, corporate doc)

## Sample Documents for Manual Testing

For manual testing through the API, you can use:

### Passport
- Use any sample passport image (search "sample passport image" - use clearly marked specimens)
- The system extracts: name, DOB, nationality, passport number, expiry, gender, issuing country, MRZ lines

### Driver's License
- Use sample driver's license images
- The system extracts: name, DOB, address, license number, expiry, class, issuing province/state

### Utility Bill
- Screenshot or PDF of any utility bill
- The system extracts: account holder name, service address, account number, bill date, utility provider

### Corporate Registration
- Certificate of incorporation or business registration
- The system extracts: company name, registration number, incorporation date, address, directors, jurisdiction, company type

## File Formats

Supported: JPEG, PNG, WebP, PDF
Max size: 10MB

## Important

Do NOT commit real personal documents to this repository.
All test documents should be clearly marked as specimens/samples.
