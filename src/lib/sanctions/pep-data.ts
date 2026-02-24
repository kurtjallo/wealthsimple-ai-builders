import type { ParsedSanctionsList } from './types';

const PEP_SOURCE = 'PEP' as const;

type PepEntry = ParsedSanctionsList['entries'][number];
type PepAlias = ParsedSanctionsList['aliases'][number];

// ---- PEP Categories ----

const PEP_HEAD_OF_STATE = 'PEP_HEAD_OF_STATE';
const PEP_SENIOR_POLITICIAN = 'PEP_SENIOR_POLITICIAN';
const PEP_SENIOR_MILITARY = 'PEP_SENIOR_MILITARY';
const PEP_JUDICIARY = 'PEP_JUDICIARY';
const PEP_SENIOR_EXECUTIVE = 'PEP_SENIOR_EXECUTIVE';
const PEP_INTL_ORG = 'PEP_INTL_ORG';
const PEP_FAMILY_MEMBER = 'PEP_FAMILY_MEMBER';
const PEP_CLOSE_ASSOCIATE = 'PEP_CLOSE_ASSOCIATE';

// ---- Helper ----

function pepEntry(
  id: number,
  firstName: string,
  lastName: string,
  category: string,
  nationality: string,
  remarks: string,
  dob: string | null = null
): PepEntry {
  return {
    source: PEP_SOURCE,
    source_id: `PEP-${String(id).padStart(3, '0')}`,
    entry_type: 'individual',
    primary_name: `${lastName}, ${firstName}`,
    first_name: firstName,
    last_name: lastName,
    date_of_birth: dob,
    nationality,
    programs: [category],
    remarks,
    source_url: null,
    raw_data: { category, fictional: true },
  };
}

// ---- Head of State / Senior Politician (10 entries) ----

const headsAndPoliticians: PepEntry[] = [
  pepEntry(1, 'Robert', 'Hargrove', PEP_HEAD_OF_STATE, 'Canada',
    'Former Prime Minister of the fictional nation of Northvale', '1958-03-14'),
  pepEntry(2, 'Eleanor', 'Whitfield', PEP_HEAD_OF_STATE, 'United Kingdom',
    'Former Head of State, Republic of Ashford', '1962-11-22'),
  pepEntry(3, 'James', 'Thornberry', PEP_SENIOR_POLITICIAN, 'United States',
    'Former Secretary of the Treasury, Thornberry administration', '1955-07-09'),
  pepEntry(4, 'Marie-Claire', 'Dubois', PEP_SENIOR_POLITICIAN, 'France',
    'Former Minister of Finance, Fifth Republic cabinet member', '1967-04-18'),
  pepEntry(5, 'Klaus', 'Brenner', PEP_SENIOR_POLITICIAN, 'Germany',
    'Former Federal Minister of the Interior', '1960-09-30'),
  pepEntry(6, 'Ahmad', 'Al-Rashid', PEP_SENIOR_POLITICIAN, 'Saudi Arabia',
    'Former Minister of Commerce and Investment, Kingdom of Westland', '1970-01-15'),
  pepEntry(7, 'Wei', 'Zhang', PEP_SENIOR_POLITICIAN, 'China',
    'Former Vice-Premier, State Council member', '1963-06-20'),
  pepEntry(8, 'Priya', 'Sharma', PEP_HEAD_OF_STATE, 'India',
    'Former Chief Minister, State of Rajvana', '1969-12-05'),
  pepEntry(9, 'Carlos', 'Mendoza', PEP_SENIOR_POLITICIAN, 'Brazil',
    'Former Senator, Chair of Finance Committee', '1971-08-25'),
  pepEntry(10, 'Adebayo', 'Okonkwo', PEP_HEAD_OF_STATE, 'Nigeria',
    'Former Governor, Lakari State', '1965-02-14'),
];

// ---- Senior Military (8 entries) ----

const military: PepEntry[] = [
  pepEntry(11, 'Victor', 'Harland', PEP_SENIOR_MILITARY, 'United States',
    'Retired General, former Joint Chief of Staff advisor', '1957-11-03'),
  pepEntry(12, 'Nikolai', 'Petrov', PEP_SENIOR_MILITARY, 'Russia',
    'Retired Admiral, Northern Fleet Command', '1959-05-17'),
  pepEntry(13, 'Jean-Pierre', 'Moreau', PEP_SENIOR_MILITARY, 'France',
    'Retired General, former Commander of Land Forces', '1961-03-22'),
  pepEntry(14, 'Tariq', 'Hassan', PEP_SENIOR_MILITARY, 'Pakistan',
    'Retired Lieutenant General, former ISB Director', '1964-07-11'),
  pepEntry(15, 'Hiroshi', 'Tanaka', PEP_SENIOR_MILITARY, 'Japan',
    'Retired Vice Admiral, Maritime Self-Defense Force', '1960-09-08'),
  pepEntry(16, 'Douglas', 'MacTavish', PEP_SENIOR_MILITARY, 'United Kingdom',
    'Retired Air Marshal, RAF Strike Command', '1958-01-29'),
  pepEntry(17, 'Rafael', 'Silva', PEP_SENIOR_MILITARY, 'Brazil',
    'Retired Brigadier General, Army Intelligence Division', '1966-04-15'),
  pepEntry(18, 'Oluwaseun', 'Adeyemi', PEP_SENIOR_MILITARY, 'Nigeria',
    'Retired Major General, former Defense Attaché', '1968-10-20'),
];

// ---- Judiciary (7 entries) ----

const judiciary: PepEntry[] = [
  pepEntry(19, 'Margaret', 'Chen', PEP_JUDICIARY, 'Canada',
    'Former Chief Justice, Supreme Court of Northvale', '1956-08-12'),
  pepEntry(20, 'William', 'Ashworth', PEP_JUDICIARY, 'United Kingdom',
    'Former Lord Chief Justice, Courts of Ashford', '1954-02-28'),
  pepEntry(21, 'Isabella', 'Romano', PEP_JUDICIARY, 'Italy',
    'Former Presiding Judge, Constitutional Court', '1962-06-14'),
  pepEntry(22, 'Hans', 'Richter', PEP_JUDICIARY, 'Germany',
    'Former President, Federal Constitutional Court', '1959-12-01'),
  pepEntry(23, 'Fatima', 'El-Amin', PEP_JUDICIARY, 'Egypt',
    'Former Chief Justice, High Constitutional Court', '1965-03-19'),
  pepEntry(24, 'Samuel', 'Osei', PEP_JUDICIARY, 'Ghana',
    'Former Justice, Supreme Court of the Republic', '1961-07-25'),
  pepEntry(25, 'Luciana', 'Ferreira', PEP_JUDICIARY, 'Brazil',
    'Former Minister, Superior Electoral Court', '1968-11-09'),
];

// ---- Senior Executive of State-Owned Enterprise (5 entries) ----

const executives: PepEntry[] = [
  pepEntry(26, 'Stefan', 'Lindqvist', PEP_SENIOR_EXECUTIVE, 'Sweden',
    'Former CEO, Nordviken State Energy Corporation', '1972-05-03'),
  pepEntry(27, 'Dmitri', 'Volkov', PEP_SENIOR_EXECUTIVE, 'Russia',
    'Former Chairman, Ural State Mining Company', '1966-09-17'),
  pepEntry(28, 'Li', 'Jianhua', PEP_SENIOR_EXECUTIVE, 'China',
    'Former Director, Xinhua State Technology Holdings', '1970-01-30'),
  pepEntry(29, 'Aisha', 'Bello', PEP_SENIOR_EXECUTIVE, 'Nigeria',
    'Former Managing Director, National Petroleum Development Company', '1974-06-22'),
  pepEntry(30, 'Rajesh', 'Kapoor', PEP_SENIOR_EXECUTIVE, 'India',
    'Former Chairman, Bharat Heavy Industries Ltd (state-owned)', '1963-04-11'),
];

// ---- International Organization Officials (5 entries) ----

const intlOrg: PepEntry[] = [
  pepEntry(31, 'Christine', 'Van der Berg', PEP_INTL_ORG, 'Netherlands',
    'Former Deputy Secretary-General, United Nations Development Programme', '1964-08-05'),
  pepEntry(32, 'Alejandro', 'Reyes', PEP_INTL_ORG, 'Mexico',
    'Former Executive Director, World Health Organization regional office', '1969-02-18'),
  pepEntry(33, 'Amara', 'Diallo', PEP_INTL_ORG, 'Senegal',
    'Former Vice President, African Development Bank', '1967-11-27'),
  pepEntry(34, 'Henrik', 'Johansson', PEP_INTL_ORG, 'Denmark',
    'Former Director, International Monetary Fund European Division', '1961-05-14'),
  pepEntry(35, 'Yuki', 'Watanabe', PEP_INTL_ORG, 'Japan',
    'Former Senior Advisor, World Bank Infrastructure Group', '1973-09-08'),
];

// ---- Family Members (8 entries) ----

const familyMembers: PepEntry[] = [
  pepEntry(36, 'Catherine', 'Hargrove', PEP_FAMILY_MEMBER, 'Canada',
    'Spouse of Robert Hargrove (PEP-001), former Prime Minister of Northvale', '1961-04-22'),
  pepEntry(37, 'Thomas', 'Whitfield', PEP_FAMILY_MEMBER, 'United Kingdom',
    'Son of Eleanor Whitfield (PEP-002), former Head of State of Ashford', '1988-07-15'),
  pepEntry(38, 'Mohammed', 'bin Khalid Al-Faisal', PEP_FAMILY_MEMBER, 'Saudi Arabia',
    'Brother of Ahmad Al-Rashid (PEP-006), former Minister of Commerce', '1973-05-30'),
  pepEntry(39, 'Mei', 'Zhang', PEP_FAMILY_MEMBER, 'China',
    'Daughter of Wei Zhang (PEP-007), former Vice-Premier', '1990-03-12'),
  pepEntry(40, 'Patricia', 'Thornberry', PEP_FAMILY_MEMBER, 'United States',
    'Spouse of James Thornberry (PEP-003), former Secretary of the Treasury', '1958-10-08'),
  pepEntry(41, 'Anita', 'Mendoza', PEP_FAMILY_MEMBER, 'Brazil',
    'Spouse of Carlos Mendoza (PEP-009), former Senator', '1975-01-19'),
  pepEntry(42, 'Kenji', 'Tanaka', PEP_FAMILY_MEMBER, 'Japan',
    'Son of Hiroshi Tanaka (PEP-015), retired Vice Admiral', '1989-06-28'),
  pepEntry(43, 'Nadia', 'Petrov', PEP_FAMILY_MEMBER, 'Russia',
    'Daughter of Nikolai Petrov (PEP-012), retired Admiral', '1987-12-04'),
];

// ---- Close Associates (7 entries) ----

const closeAssociates: PepEntry[] = [
  pepEntry(44, 'Gerald', 'Sinclair', PEP_CLOSE_ASSOCIATE, 'Canada',
    'Former Chief of Staff to Robert Hargrove (PEP-001), known business partner', '1960-06-17'),
  pepEntry(45, 'Victoria', 'Pemberton', PEP_CLOSE_ASSOCIATE, 'United Kingdom',
    'Former personal advisor to Eleanor Whitfield (PEP-002), board member of Whitfield Foundation', '1965-09-23'),
  pepEntry(46, 'Khalid', 'Al-Mansour', PEP_CLOSE_ASSOCIATE, 'Saudi Arabia',
    'Long-standing business associate of Ahmad Al-Rashid (PEP-006), co-investor in Rashid Holdings', '1968-03-11'),
  pepEntry(47, 'Roberto', 'Gomes', PEP_CLOSE_ASSOCIATE, 'Brazil',
    'Political advisor and fundraiser for Carlos Mendoza (PEP-009)', '1970-08-05'),
  pepEntry(48, 'Ingrid', 'Hoffmann', PEP_CLOSE_ASSOCIATE, 'Germany',
    'Former parliamentary aide to Klaus Brenner (PEP-005), now lobbyist', '1972-11-14'),
  pepEntry(49, 'David', 'Okonkwo', PEP_CLOSE_ASSOCIATE, 'Nigeria',
    'Known associate of Adebayo Okonkwo (PEP-010), manages family trust', '1971-04-29'),
  pepEntry(50, 'Ravi', 'Patel', PEP_CLOSE_ASSOCIATE, 'India',
    'Former business partner of Rajesh Kapoor (PEP-030), infrastructure consultant', '1969-07-16'),
];

// ---- Combined Exports ----

export const PEP_ENTRIES: PepEntry[] = [
  ...headsAndPoliticians,
  ...military,
  ...judiciary,
  ...executives,
  ...intlOrg,
  ...familyMembers,
  ...closeAssociates,
];

// ---- Aliases for select entries ----

export const PEP_ALIASES: PepAlias[] = [
  // Ahmad Al-Rashid — Arabic name variant
  { entry_id: 'PEP-006', alias_name: 'Ahmed Al-Rasheed', alias_type: 'aka', alias_quality: 'good' },
  { entry_id: 'PEP-006', alias_name: '\u0623\u062D\u0645\u062F \u0627\u0644\u0631\u0634\u064A\u062F', alias_type: 'aka', alias_quality: 'good' },
  // Mohammed bin Khalid Al-Faisal — Arabic name variant
  { entry_id: 'PEP-038', alias_name: 'Muhammad bin Khalid Al Faysal', alias_type: 'aka', alias_quality: 'good' },
  { entry_id: 'PEP-038', alias_name: '\u0645\u062D\u0645\u062F \u0628\u0646 \u062E\u0627\u0644\u062F \u0627\u0644\u0641\u064A\u0635\u0644', alias_type: 'aka', alias_quality: 'good' },
  // Khalid Al-Mansour
  { entry_id: 'PEP-046', alias_name: 'Khaled El-Mansoor', alias_type: 'aka', alias_quality: 'good' },
  // Wei Zhang — Chinese name order
  { entry_id: 'PEP-007', alias_name: 'Zhang Wei', alias_type: 'aka', alias_quality: 'good' },
  // Marie-Claire Dubois — informal
  { entry_id: 'PEP-004', alias_name: 'M.C. Dubois', alias_type: 'aka', alias_quality: 'low' },
  // Nikolai Petrov — transliteration variant
  { entry_id: 'PEP-012', alias_name: 'Nikolay Petroff', alias_type: 'aka', alias_quality: 'low' },
  // Priya Sharma — alternate spelling
  { entry_id: 'PEP-008', alias_name: 'Priyanka Sharma', alias_type: 'aka', alias_quality: 'low' },
  // Adebayo Okonkwo
  { entry_id: 'PEP-010', alias_name: 'Bayo Okonkwo', alias_type: 'aka', alias_quality: 'good' },
];
