export type PropertyType = 'home' | 'business';

export type DamageLevel = 'none' | 'minor' | 'moderate' | 'severe';

export interface FormData {
  propertyType: PropertyType;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  smsConsent: boolean;
  address: string;
  buildingMaterials?: {
    structure: string;
    wall: string;
    roof: string;
  };
  damageDate: string;
  damageAssessment: {
    roof: DamageLevel;
    exteriorWalls: DamageLevel;
    windows: DamageLevel;
    doors: DamageLevel;
    interior: DamageLevel;
    chimney: DamageLevel;
    systems: DamageLevel;
    landscaping: DamageLevel;
    other: DamageLevel;
  };
  contactConsent: boolean;
  insuranceClaim: boolean;
  insuranceCarrier?: string;
  images: File[];
}