export const SERVICES_DATA = [
  {
    id: 'new-license',
    title: 'New Trade License Registration',
    shortDescription: 'Obtain a fresh commercial trade license from Dhaka North or South City Corporation.',
    fullDescription: 'Our team coordinates the entire process of getting a new commercial trade license. We prepare the Application Form (Form K), verify holding tax receipts, establish landlord rent agreements, and manage inspections by City Corporation officers on your behalf.',
    image: '/assets/images/new_license.png',
    govtFee: '৳2,000 - ৳8,000 (depends on business type)',
    brokerFee: '৳1,500',
    timeline: '3 - 5 Business Days',
    documents: [
      'Copy of National ID (NID) of owner',
      'Recent Passport-sized Photo (3 copies)',
      'Rental Agreement of commercial space',
      'Holding Tax Receipt of landlord',
      'Holding Utility Bill (copy)'
    ]
  },
  {
    id: 'renewal',
    title: 'Trade License Annual Renewal',
    shortDescription: 'Stress-free annual renewal of your business trade licenses with City Corporations.',
    fullDescription: 'Avoid penalties and late fees. We pick up your old trade license, calculate the renewal taxes, pay the bank challans, submit the paperwork, and deliver the freshly stamped license back to your desk.',
    image: '/assets/images/license_renewal.png',
    govtFee: 'Depends on business classification & signboards',
    brokerFee: '৳1,000',
    timeline: '2 - 3 Business Days',
    documents: [
      'Original copy of the previous Trade License',
      'TIN Certificate (Tax Identification Number)',
      'Holding Tax paid receipt (if applicable)',
      'Challan/Bank receipt of previous payment'
    ]
  },
  {
    id: 'limited-company',
    title: 'Limited Company Registration',
    shortDescription: 'Register limited liability or One Person Companies (OPC) with RJSC Bangladesh.',
    fullDescription: 'We help you launch your business as a legal entity under the Registrar of Joint Stock Companies and Firms (RJSC). Services include Name Clearance, Drafting Memorandum of Association (MoA) and Articles of Association (AoA), getting Form XII, and obtaining the Incorporation Certificate.',
    image: '/assets/images/company_registry.png',
    govtFee: '৳5,000 - ৳25,000 (scales with Authorized Capital)',
    brokerFee: '৳5,000',
    timeline: '7 - 10 Business Days',
    documents: [
      'Proposed Company Names (for clearance)',
      'NID and Photos of all directors (minimum 2 for LTD, 1 for OPC)',
      'TIN Certificates of all directors',
      'Shareholding ratio & authorized capital details'
    ]
  },
  {
    id: 'vat-tin',
    title: 'TIN & VAT (BIN) Registration',
    shortDescription: 'Obtain 12-digit Tax TIN and Business Identification Number (BIN) certificates.',
    fullDescription: 'Secure your Tax TIN and VAT BIN certificates from the National Board of Revenue (NBR). We register your business under the correct NBR circle, submit utility papers, and deliver active certificates required for banking and imports.',
    image: '/assets/images/tax_vat.png',
    govtFee: 'Free (Government registration)',
    brokerFee: '৳1,000',
    timeline: '1 - 2 Business Days',
    documents: [
      'Copy of NID and Trade License',
      'Owner phone number (linked to NID)',
      'Company incorporation papers (if Limited)'
    ]
  },
  {
    id: 'irc-erc',
    title: 'Import (IRC) & Export (ERC) Licensing',
    shortDescription: 'Obtain IRC & ERC registrations from the CCI&E office to run international trades.',
    fullDescription: 'Get recommendations and clear licensing registration for commercial or industrial import/export. We handle the Chief Controller of Imports and Exports (CCI&E) filing, Chamber of Commerce membership, and bank solvency audits.',
    image: '/assets/images/import_export.png',
    govtFee: '৳5,000 - ৳45,000 (depends on limit categories)',
    brokerFee: '৳4,500',
    timeline: '5 - 7 Business Days',
    documents: [
      'Valid Trade License copy',
      'Valid TIN & VAT (BIN) certificates',
      'Bank Solvency Certificate & solvency profile',
      'Membership Certificate from local Chamber of Commerce'
    ]
  },
  {
    id: 'fire-env',
    title: 'Fire License & Environment Clearance',
    shortDescription: 'Secure safety certificates from Fire Service and Department of Environment (DoE).',
    fullDescription: 'Crucial for warehouse, factory, restaurant, or high-rise business spaces. We coordinate with the Fire Service & Civil Defence and Department of Environment (DoE) inspectors, prepare maps/diagrams, and get your clearance certificates.',
    image: '/assets/images/safety_clearance.png',
    govtFee: 'Depends on floor space & environment category',
    brokerFee: '৳3,500',
    timeline: '10 - 15 Business Days',
    documents: [
      'Trade License copy',
      'Emergency fire safety plan map/layout',
      'DoE Form/No-Objection Certificate (NOC)',
      'Landlord holding agreement'
    ]
  }
];
