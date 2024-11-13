export interface ContractorFormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  propertyTypes: ('residential' | 'commercial' | 'industrial')[];
  services: {
    roofing: string[];
    exteriorWalls: string[];
    doorsAndWindows: string[];
    outdoors: string[];
    systems: string[];
    other: string[];
  };
  licenseNumber?: string;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    coverage: string;
  };
}

export const serviceOptions = {
  roofing: [
    'Shingle Repair/Replacement',
    'Flat Roof Systems',
    'Metal Roofing',
    'Tile Roofing',
    'Emergency Tarping',
    'Structural Repairs',
    'Gutter Systems'
  ],
  exteriorWalls: [
    'Siding Repair/Replacement',
    'Stucco',
    'Brick/Masonry',
    'Paint/Finishing',
    'Structural Repairs',
    'Water Damage Restoration'
  ],
  doorsAndWindows: [
    'Window Replacement',
    'Door Installation',
    'Storm Shutters',
    'Impact Windows',
    'Glass Repair',
    'Frame Repair'
  ],
  outdoors: [
    'Tree Removal',
    'Fence Repair/Installation',
    'Landscape Restoration',
    'Concrete/Pavement',
    'Deck/Patio Repair',
    'Drainage Systems'
  ],
  systems: [
    'HVAC Repair/Replacement',
    'Electrical Systems',
    'Plumbing Systems',
    'Generator Installation',
    'Solar Systems',
    'Smart Home Systems'
  ],
  other: [
    'Interior Renovation',
    'Mold Remediation',
    'Fire Damage',
    'Water Damage',
    'Emergency Services',
    'Project Management'
  ]
};
