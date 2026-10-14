export type HealthStatus = 'Healthy' | 'Good' | 'Fair' | 'Stressed' | 'Diseased' | 'Pruned' | 'Critical';

export type NativeStatus = 'Native' | 'Exotic' | 'Naturalized';

export type FoliageDensity = 'Dense' | 'Moderate' | 'Sparse';

export type TrunkCondition = 'Sound' | 'Minor Cavity' | 'Termite Activity' | 'Surface Wound' | 'Girdling Root';

export interface TreeRecord {
  id: string; // e.g. "TIC-001"
  tagNumber: string; // e.g. "TI-TREE-2026-001"
  commonName: string; // e.g. "Neem / Margosa"
  tamilName: string; // e.g. "வேப்ப மரம்"
  botanicalName: string; // e.g. "Azadirachta indica"
  family: string; // e.g. "Meliaceae"
  nativeStatus: NativeStatus;
  coordinates: [number, number]; // [Longitude, Latitude] in EPSG:4326
  dbhCm: number; // Diameter at Breast Height in cm
  heightM: number; // Tree height in meters
  canopyRadiusM: number; // Crown spread radius in meters
  health: HealthStatus;
  campusZone: string; // e.g. "Corporate Admin Lawn", "Assembly Plant Buffer"
  ageYears: number; // Estimated age
  annualCO2Kg: number; // Annual CO2 sequestration in kg
  totalBiomassKg: number; // Total estimated biomass in kg
  ecologicalValueINR: number; // Calculated ecological replacement value in INR
  foliageDensity: FoliageDensity;
  trunkCondition: TrunkCondition;
  recommendedAction: string; // e.g. "Pruning dry branches", "Termite barrier needed"
  surveyDate: string; // YYYY-MM-DD
  surveyor: string; // Surveyor name
  gpsAccuracyM: number; // GPS precision in meters (e.g. 0.6)
  notes?: string;
  photoUrl?: string;
}

export interface CampusZone {
  id: string;
  name: string;
  category: 'Administration' | 'Manufacturing' | 'Testing Track' | 'Green Belt' | 'Amenities' | 'Logistics';
  areaHectares: number;
  description: string;
  coordinates: [number, number][]; // Polygon ring in [lng, lat]
}

export interface TreeFilters {
  searchQuery: string;
  selectedSpecies: string[];
  selectedFamilies: string[];
  selectedZones: string[];
  selectedHealth: HealthStatus[];
  nativeStatus: 'all' | 'Native' | 'Exotic' | 'Naturalized';
  dbhRange: [number, number]; // [min, max]
  heightRange: [number, number]; // [min, max]
  canopyRange: [number, number]; // [min, max]
  highlightedTreeId: string | null;
}

export type BasemapId = 'satellite' | 'hybrid' | 'osm' | 'dark' | 'light';
