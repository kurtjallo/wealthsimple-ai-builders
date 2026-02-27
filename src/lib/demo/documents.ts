import type { Database } from '@/lib/supabase/types';
import { DEMO_CASE_IDS } from './cases';

type DocumentInsert = Database['public']['Tables']['documents']['Insert'];

export const DEMO_DOC_IDS = {
  SARAH_PASSPORT: '20000000-0000-0000-0000-000000000001',
  SARAH_UTILITY: '20000000-0000-0000-0000-000000000002',
  VIKTOR_PASSPORT: '20000000-0000-0000-0000-000000000003',
  AMARA_LICENSE: '20000000-0000-0000-0000-000000000004',
  MARIA_PASSPORT: '20000000-0000-0000-0000-000000000005',
  MARIA_UTILITY: '20000000-0000-0000-0000-000000000006',
  JAMES_PASSPORT: '20000000-0000-0000-0000-000000000007',
  JAMES_UTILITY: '20000000-0000-0000-0000-000000000008',
  JAMES_BANK: '20000000-0000-0000-0000-000000000009',
} as const;

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const demoDocuments: DocumentInsert[] = [
  // Sarah Chen - Passport
  {
    id: DEMO_DOC_IDS.SARAH_PASSPORT,
    case_id: DEMO_CASE_IDS.SARAH_CHEN,
    type: 'passport',
    file_name: 'sarah_chen_passport.pdf',
    file_path: null,
    file_url: '/demo/docs/sarah_chen_passport.pdf',
    file_size: 2458624,
    mime_type: 'application/pdf',
    ocr_output: `CANADA / CANADA
PASSPORT / PASSEPORT

Type / Type: P
Country Code / Code du pays: CAN
Surname / Nom: CHEN
Given Names / Prenoms: SARAH
Nationality / Nationalite: CANADIAN / CANADIENNE
Date of Birth / Date de naissance: 15 MAR 1991
Sex / Sexe: F
Place of Birth / Lieu de naissance: TORONTO, ONTARIO
Date of Issue / Date de delivrance: 22 JUN 2022
Date of Expiry / Date d'expiration: 22 JUN 2032
Authority / Autorite: PASSPORT CANADA

Passport No. / No de passeport: C4829173

P<CANCHEN<<SARAH<<<<<<<<<<<<<<<<<<<<<<<<<<<
C48291734CAN9103155F3206229<<<<<<<<<<<<<<02`,
    ocr_raw_text: 'CANADA PASSPORT Type P Country CAN Surname CHEN Given Names SARAH Nationality CANADIAN Date of Birth 15 MAR 1991 Sex F Place of Birth TORONTO ONTARIO Date of Issue 22 JUN 2022 Date of Expiry 22 JUN 2032 Passport No C4829173',
    extracted_data: {
      full_name: { value: 'Sarah Chen', confidence: 0.98 },
      date_of_birth: { value: '1991-03-15', confidence: 0.97 },
      passport_number: { value: 'C4829173', confidence: 0.99 },
      nationality: { value: 'Canadian', confidence: 0.98 },
      sex: { value: 'F', confidence: 0.99 },
      place_of_birth: { value: 'Toronto, Ontario', confidence: 0.96 },
      date_of_issue: { value: '2022-06-22', confidence: 0.97 },
      date_of_expiry: { value: '2032-06-22', confidence: 0.97 },
      document_type: { value: 'passport', confidence: 0.99 },
      issuing_country: { value: 'CAN', confidence: 0.99 },
    },
    confidence: 0.97,
    overall_confidence: 0.97,
    processing_status: 'completed',
    processing_error: null,
    processing_time_ms: 3240,
    warnings: null,
    created_at: hoursAgo(48),
    updated_at: hoursAgo(47.9),
  },

  // Sarah Chen - Utility Bill
  {
    id: DEMO_DOC_IDS.SARAH_UTILITY,
    case_id: DEMO_CASE_IDS.SARAH_CHEN,
    type: 'utility_bill',
    file_name: 'sarah_chen_hydro_bill.pdf',
    file_path: null,
    file_url: '/demo/docs/sarah_chen_hydro_bill.pdf',
    file_size: 1245184,
    mime_type: 'application/pdf',
    ocr_output: `Toronto Hydro-Electric System Limited
Customer Account Statement

Account Number: 7829-4561-0023
Statement Date: January 15, 2026
Due Date: February 5, 2026

Customer Name: SARAH CHEN
Service Address: 142 Maple Drive
                 Toronto, ON M5V 2T6

Billing Period: December 15, 2025 - January 14, 2026

Previous Balance                    $87.42
Payment Received - Thank You       -$87.42
Current Charges:
  Electricity                       $62.18
  Delivery                          $31.45
  Regulatory Charges                 $4.89
  Debt Retirement Charge             $1.23
  HST (13%)                         $12.97

Total Amount Due                   $112.72

Please pay by the due date to avoid late charges.`,
    ocr_raw_text: 'Toronto Hydro Customer Account Statement Account Number 7829-4561-0023 Statement Date January 15 2026 Customer Name SARAH CHEN Service Address 142 Maple Drive Toronto ON M5V 2T6 Total Amount Due $112.72',
    extracted_data: {
      full_name: { value: 'Sarah Chen', confidence: 0.96 },
      address: { value: '142 Maple Drive, Toronto, ON M5V 2T6', confidence: 0.94 },
      account_number: { value: '7829-4561-0023', confidence: 0.97 },
      statement_date: { value: '2026-01-15', confidence: 0.95 },
      provider: { value: 'Toronto Hydro-Electric System Limited', confidence: 0.98 },
      document_type: { value: 'utility_bill', confidence: 0.99 },
    },
    confidence: 0.93,
    overall_confidence: 0.93,
    processing_status: 'completed',
    processing_error: null,
    processing_time_ms: 2810,
    warnings: null,
    created_at: hoursAgo(48),
    updated_at: hoursAgo(47.9),
  },

  // Viktor Petrov - Passport
  {
    id: DEMO_DOC_IDS.VIKTOR_PASSPORT,
    case_id: DEMO_CASE_IDS.VIKTOR_PETROV,
    type: 'passport',
    file_name: 'viktor_petrov_passport.pdf',
    file_path: null,
    file_url: '/demo/docs/viktor_petrov_passport.pdf',
    file_size: 2891776,
    mime_type: 'application/pdf',
    ocr_output: `RUSSIAN FEDERATION / РОССИЙСКАЯ ФЕДЕРАЦИЯ
PASSPORT / ПАСПОРТ

Type / Тип: P
Country Code / Код страны: RUS
Surname / Фамилия: PETROV / ПЕТРОВ
Given Names / Имя: VIKTOR / ВИКТОР
Nationality / Гражданство: RUSSIAN / РОССИЙСКОЕ
Date of Birth / Дата рождения: 08 NOV 1978
Sex / Пол: M / М
Place of Birth / Место рождения: MOSCOW / МОСКВА
Date of Issue / Дата выдачи: 14 APR 2020
Date of Expiry / Дата окончания: 14 APR 2030
Authority / Орган: FMS 770-085

Passport No. / Номер паспорта: 72 4839201

P<RUSPETROV<<VIKTOR<<<<<<<<<<<<<<<<<<<<<<
7248392014RUS7811088M3004149<<<<<<<<<<<<<<06`,
    ocr_raw_text: 'RUSSIAN FEDERATION PASSPORT Type P Country RUS Surname PETROV Given Names VIKTOR Nationality RUSSIAN Date of Birth 08 NOV 1978 Sex M Place of Birth MOSCOW Date of Issue 14 APR 2020 Passport No 72 4839201',
    extracted_data: {
      full_name: { value: 'Viktor Petrov', confidence: 0.91 },
      date_of_birth: { value: '1978-11-08', confidence: 0.89 },
      passport_number: { value: '72 4839201', confidence: 0.93 },
      nationality: { value: 'Russian', confidence: 0.95 },
      sex: { value: 'M', confidence: 0.99 },
      place_of_birth: { value: 'Moscow', confidence: 0.90 },
      date_of_issue: { value: '2020-04-14', confidence: 0.88 },
      date_of_expiry: { value: '2030-04-14', confidence: 0.88 },
      document_type: { value: 'passport', confidence: 0.99 },
      issuing_country: { value: 'RUS', confidence: 0.99 },
    },
    confidence: 0.88,
    overall_confidence: 0.88,
    processing_status: 'completed',
    processing_error: null,
    processing_time_ms: 4120,
    warnings: ['Document shows wear at edges — may affect long-term readability'],
    created_at: hoursAgo(36),
    updated_at: hoursAgo(35.8),
  },

  // Amara Okafor - Driver's License (poor quality)
  {
    id: DEMO_DOC_IDS.AMARA_LICENSE,
    case_id: DEMO_CASE_IDS.AMARA_OKAFOR,
    type: 'drivers_license',
    file_name: 'amara_okafor_license.jpg',
    file_path: null,
    file_url: '/demo/docs/amara_okafor_license.jpg',
    file_size: 1843200,
    mime_type: 'image/jpeg',
    ocr_output: `ONTARIO
DRIVER'S LICENCE / PERMIS DE CONDUIRE

DL No: O4829-17365-20901
Class: G

Surname: OKAFOR
Given Names: AMARA N
Date of Birth: 1994/07/22
Sex: F
Height: 165 cm
Address: 88 King Street West
         Apt 1204
         Hamilton, ON L8P 1A2

Issue Date: 2023/09/15
Expiry: 2028/07/22

[Note: Image captured at angle, partial glare on photo area,
 lower-right corner partially obscured]`,
    ocr_raw_text: 'ONTARIO DRIVERS LICENCE DL No O4829-17365-20901 Class G Surname OKAFOR Given Names AMARA N Date of Birth 1994/07/22 Sex F Height 165 cm Address 88 King Street West Apt 1204 Hamilton ON L8P 1A2',
    extracted_data: {
      full_name: { value: 'Amara N. Okafor', confidence: 0.72 },
      date_of_birth: { value: '1994-07-22', confidence: 0.68 },
      license_number: { value: 'O4829-17365-20901', confidence: 0.74 },
      license_class: { value: 'G', confidence: 0.81 },
      sex: { value: 'F', confidence: 0.85 },
      address: { value: '88 King Street West, Apt 1204, Hamilton, ON L8P 1A2', confidence: 0.59 },
      date_of_issue: { value: '2023-09-15', confidence: 0.64 },
      date_of_expiry: { value: '2028-07-22', confidence: 0.66 },
      document_type: { value: 'drivers_license', confidence: 0.92 },
      issuing_province: { value: 'Ontario', confidence: 0.88 },
    },
    confidence: 0.62,
    overall_confidence: 0.62,
    processing_status: 'completed',
    processing_error: null,
    processing_time_ms: 5870,
    warnings: [
      'Low image quality detected — document photographed at angle',
      'Partial glare obscuring photo area',
      'Lower-right corner partially obscured — some fields may have reduced accuracy',
    ],
    created_at: hoursAgo(12),
    updated_at: hoursAgo(11.8),
  },

  // Maria Gonzalez-Rivera - Passport
  {
    id: DEMO_DOC_IDS.MARIA_PASSPORT,
    case_id: DEMO_CASE_IDS.MARIA_GONZALEZ,
    type: 'passport',
    file_name: 'maria_gonzalez_passport.pdf',
    file_path: null,
    file_url: '/demo/docs/maria_gonzalez_passport.pdf',
    file_size: 2654208,
    mime_type: 'application/pdf',
    ocr_output: `ESTADOS UNIDOS MEXICANOS
PASAPORTE / PASSPORT

Tipo / Type: P
Codigo de Pais / Country Code: MEX
Apellidos / Surname: GONZALEZ-RIVERA
Nombre(s) / Given Name(s): MARIA ELENA
Nacionalidad / Nationality: MEXICANA / MEXICAN
Fecha de Nacimiento / Date of Birth: 03 SEP 1982
Sexo / Sex: F / F
Lugar de Nacimiento / Place of Birth: CIUDAD DE MEXICO, D.F.
Fecha de Expedicion / Date of Issue: 18 FEB 2024
Fecha de Vencimiento / Date of Expiry: 18 FEB 2034
Autoridad / Authority: SRE

No. de Pasaporte / Passport No.: G28491037

P<MEXGONZALEZ<RIVERA<<MARIA<ELENA<<<<<<<<
G284910379MEX8209033F3402181<<<<<<<<<<<<<<04`,
    ocr_raw_text: 'ESTADOS UNIDOS MEXICANOS PASAPORTE Type P Country MEX Apellidos GONZALEZ-RIVERA Nombres MARIA ELENA Nacionalidad MEXICANA Fecha de Nacimiento 03 SEP 1982 Sexo F Lugar de Nacimiento CIUDAD DE MEXICO Passport No G28491037',
    extracted_data: {
      full_name: { value: 'Maria Elena Gonzalez-Rivera', confidence: 0.95 },
      date_of_birth: { value: '1982-09-03', confidence: 0.94 },
      passport_number: { value: 'G28491037', confidence: 0.97 },
      nationality: { value: 'Mexican', confidence: 0.96 },
      sex: { value: 'F', confidence: 0.99 },
      place_of_birth: { value: 'Ciudad de Mexico, D.F.', confidence: 0.93 },
      date_of_issue: { value: '2024-02-18', confidence: 0.95 },
      date_of_expiry: { value: '2034-02-18', confidence: 0.95 },
      document_type: { value: 'passport', confidence: 0.99 },
      issuing_country: { value: 'MEX', confidence: 0.99 },
    },
    confidence: 0.93,
    overall_confidence: 0.93,
    processing_status: 'completed',
    processing_error: null,
    processing_time_ms: 3580,
    warnings: null,
    created_at: hoursAgo(8),
    updated_at: hoursAgo(7.8),
  },

  // Maria Gonzalez-Rivera - Utility Bill
  {
    id: DEMO_DOC_IDS.MARIA_UTILITY,
    case_id: DEMO_CASE_IDS.MARIA_GONZALEZ,
    type: 'utility_bill',
    file_name: 'maria_gonzalez_enbridge_bill.pdf',
    file_path: null,
    file_url: '/demo/docs/maria_gonzalez_enbridge_bill.pdf',
    file_size: 987136,
    mime_type: 'application/pdf',
    ocr_output: `Enbridge Gas Inc.
Account Statement

Account Number: 2034-8891-5567
Statement Date: February 1, 2026
Due Date: February 25, 2026

Customer: MARIA GONZALEZ-RIVERA
Service Address: 501 - 200 University Avenue
                 Ottawa, ON K1N 5H9

Billing Period: January 1 - January 31, 2026

Previous Balance                    $143.67
Payment Received                   -$143.67
Current Charges:
  Gas Supply                        $78.34
  Transportation                    $42.11
  Customer Charge                    $23.00
  HST (13%)                         $18.65

Total Amount Due                   $162.10`,
    ocr_raw_text: 'Enbridge Gas Inc Account Statement Account Number 2034-8891-5567 Statement Date February 1 2026 Customer MARIA GONZALEZ-RIVERA Service Address 501 200 University Avenue Ottawa ON K1N 5H9 Total Amount Due $162.10',
    extracted_data: {
      full_name: { value: 'Maria Gonzalez-Rivera', confidence: 0.94 },
      address: { value: '501 - 200 University Avenue, Ottawa, ON K1N 5H9', confidence: 0.91 },
      account_number: { value: '2034-8891-5567', confidence: 0.96 },
      statement_date: { value: '2026-02-01', confidence: 0.95 },
      provider: { value: 'Enbridge Gas Inc.', confidence: 0.98 },
      document_type: { value: 'utility_bill', confidence: 0.99 },
    },
    confidence: 0.91,
    overall_confidence: 0.91,
    processing_status: 'completed',
    processing_error: null,
    processing_time_ms: 2650,
    warnings: null,
    created_at: hoursAgo(8),
    updated_at: hoursAgo(7.8),
  },

  // James Oduya - Passport (processing)
  {
    id: DEMO_DOC_IDS.JAMES_PASSPORT,
    case_id: DEMO_CASE_IDS.JAMES_ODUYA,
    type: 'passport',
    file_name: 'james_oduya_passport.pdf',
    file_path: null,
    file_url: '/demo/docs/james_oduya_passport.pdf',
    file_size: 2345984,
    mime_type: 'application/pdf',
    ocr_output: `CANADA / CANADA
PASSPORT / PASSEPORT

Type / Type: P
Country Code / Code du pays: CAN
Surname / Nom: ODUYA
Given Names / Prenoms: JAMES KWAME
Nationality / Nationalite: CANADIAN / CANADIENNE
Date of Birth / Date de naissance: 29 JUN 1988
Sex / Sexe: M
Place of Birth / Lieu de naissance: CALGARY, ALBERTA
Date of Issue / Date de delivrance: 05 MAR 2023
Date of Expiry / Date d'expiration: 05 MAR 2033
Authority / Autorite: PASSPORT CANADA

Passport No. / No de passeport: C7391042

P<CANODUYA<<JAMES<KWAME<<<<<<<<<<<<<<<<<
C73910429CAN8806291M3303056<<<<<<<<<<<<<<08`,
    ocr_raw_text: 'CANADA PASSPORT Type P Country CAN Surname ODUYA Given Names JAMES KWAME Nationality CANADIAN Date of Birth 29 JUN 1988 Sex M Place of Birth CALGARY ALBERTA Passport No C7391042',
    extracted_data: {
      full_name: { value: 'James Kwame Oduya', confidence: 0.96 },
      date_of_birth: { value: '1988-06-29', confidence: 0.95 },
      passport_number: { value: 'C7391042', confidence: 0.98 },
      nationality: { value: 'Canadian', confidence: 0.97 },
      sex: { value: 'M', confidence: 0.99 },
      place_of_birth: { value: 'Calgary, Alberta', confidence: 0.95 },
      date_of_issue: { value: '2023-03-05', confidence: 0.96 },
      date_of_expiry: { value: '2033-03-05', confidence: 0.96 },
      document_type: { value: 'passport', confidence: 0.99 },
      issuing_country: { value: 'CAN', confidence: 0.99 },
    },
    confidence: 0.95,
    overall_confidence: 0.95,
    processing_status: 'completed',
    processing_error: null,
    processing_time_ms: 3120,
    warnings: null,
    created_at: hoursAgo(1),
    updated_at: hoursAgo(0.9),
  },

  // James Oduya - Utility Bill (processing)
  {
    id: DEMO_DOC_IDS.JAMES_UTILITY,
    case_id: DEMO_CASE_IDS.JAMES_ODUYA,
    type: 'utility_bill',
    file_name: 'james_oduya_epcor_bill.pdf',
    file_path: null,
    file_url: '/demo/docs/james_oduya_epcor_bill.pdf',
    file_size: 1123328,
    mime_type: 'application/pdf',
    ocr_output: `EPCOR Utilities Inc.
Monthly Statement

Account Number: 4401-9928-3347
Statement Period: January 2026
Statement Date: February 3, 2026

Customer Name: JAMES K. ODUYA
Service Address: 2204 - 17 Street SW
                 Calgary, AB T2T 4M1

Current Charges:
  Electricity                       $54.23
  Water & Wastewater                $41.67
  Drainage                          $18.92
  GST (5%)                           $5.74

Total Due: $120.56
Due Date: February 28, 2026`,
    ocr_raw_text: 'EPCOR Utilities Inc Monthly Statement Account Number 4401-9928-3347 January 2026 Customer Name JAMES K ODUYA Service Address 2204 17 Street SW Calgary AB T2T 4M1 Total Due $120.56',
    extracted_data: {
      full_name: { value: 'James K. Oduya', confidence: 0.94 },
      address: { value: '2204 - 17 Street SW, Calgary, AB T2T 4M1', confidence: 0.92 },
      account_number: { value: '4401-9928-3347', confidence: 0.96 },
      statement_date: { value: '2026-02-03', confidence: 0.93 },
      provider: { value: 'EPCOR Utilities Inc.', confidence: 0.97 },
      document_type: { value: 'utility_bill', confidence: 0.99 },
    },
    confidence: 0.93,
    overall_confidence: 0.93,
    processing_status: 'completed',
    processing_error: null,
    processing_time_ms: 2540,
    warnings: null,
    created_at: hoursAgo(1),
    updated_at: hoursAgo(0.8),
  },

  // James Oduya - Bank Statement (still processing)
  {
    id: DEMO_DOC_IDS.JAMES_BANK,
    case_id: DEMO_CASE_IDS.JAMES_ODUYA,
    type: 'bank_statement',
    file_name: 'james_oduya_td_statement.pdf',
    file_path: null,
    file_url: '/demo/docs/james_oduya_td_statement.pdf',
    file_size: 3145728,
    mime_type: 'application/pdf',
    ocr_output: null,
    ocr_raw_text: null,
    extracted_data: null,
    confidence: null,
    overall_confidence: null,
    processing_status: 'processing',
    processing_error: null,
    processing_time_ms: null,
    warnings: null,
    created_at: hoursAgo(1),
    updated_at: hoursAgo(0.5),
  },
];
