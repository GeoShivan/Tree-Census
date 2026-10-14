import { TreeRecord, CampusZone } from '../types/tree';
import {
  CAMPUS_CENTER as LOADER_CENTER,
  DEFAULT_ZOOM as LOADER_ZOOM,
  SOURCE_TREES,
  CAMPUS_BOUNDARY_GEOJSON,
  TREES_GEOJSON,
  getCampusBoundaryGeoJSON,
  getTreesGeoJSON
} from './sourceData';

const TIDC_BOUNDARY_GEOJSON = CAMPUS_BOUNDARY_GEOJSON;
const RAW_TREES_GEOJSON = TREES_GEOJSON;

export const CAMPUS_CENTER = LOADER_CENTER;
export const DEFAULT_ZOOM = LOADER_ZOOM;

// Campus Boundary Coordinates extracted from SourceFile/TIDC_Boundary.geojson
export const CAMPUS_BOUNDARY_COORDINATES: [number, number][] =
  (TIDC_BOUNDARY_GEOJSON.features?.[0]?.geometry?.coordinates?.[0] as unknown as [number, number][]) || [
    [80.15587, 13.10610],
    [80.15768, 13.10608],
    [80.15885, 13.10605],
    [80.16036, 13.10583],
    [80.16028, 13.10539],
    [80.16024, 13.10506],
    [80.16029, 13.10435],
    [80.15999, 13.10297],
    [80.15991, 13.10284],
    [80.15972, 13.10288],
    [80.15947, 13.10278],
    [80.15932, 13.10280],
    [80.15925, 13.10273],
    [80.15878, 13.10268],
    [80.15795, 13.10332],
    [80.15760, 13.10346],
    [80.15693, 13.10362],
    [80.15618, 13.10384],
    [80.15625, 13.10415],
    [80.15637, 13.10420],
    [80.15637, 13.10475],
    [80.15621, 13.10537],
    [80.15587, 13.10610]
  ];

// Sector zones within the TIDC / TI Cycles compound
export const CAMPUS_ZONES: CampusZone[] = [
  {
    id: 'zone-north-gateway',
    name: 'North Gateway & CTH Road Frontage',
    category: 'Administration',
    areaHectares: 3.2,
    description: 'Northern perimeter along main road, visitor security gate, and frontage tree avenue.',
    coordinates: [
      [80.15587, 13.10610],
      [80.16036, 13.10583],
      [80.16028, 13.10520],
      [80.15600, 13.10535],
      [80.15587, 13.10610]
    ]
  },
  {
    id: 'zone-manufacturing',
    name: 'Main Manufacturing & Chain Assembly Plant',
    category: 'Manufacturing',
    areaHectares: 4.8,
    description: 'Core manufacturing hangars, press shop, and industrial assembly lines.',
    coordinates: [
      [80.15600, 13.10535],
      [80.16028, 13.10520],
      [80.16024, 13.10430],
      [80.15630, 13.10430],
      [80.15600, 13.10535]
    ]
  },
  {
    id: 'zone-east-windbreak',
    name: 'East Perimeter & Windbreak Avenue',
    category: 'Green Belt',
    areaHectares: 2.1,
    description: 'Dense shelterbelt of White Lead trees, Mast trees, and Copperpods along the eastern fence.',
    coordinates: [
      [80.15920, 13.10580],
      [80.16036, 13.10583],
      [80.15999, 13.10297],
      [80.15920, 13.10300],
      [80.15920, 13.10580]
    ]
  },
  {
    id: 'zone-canteen',
    name: 'Central Lawn & Worker Canteen Enclave',
    category: 'Amenities',
    areaHectares: 2.3,
    description: 'Dining halls, shaded courtyards with Neem, Jamun, and fruit trees for workforce recreation.',
    coordinates: [
      [80.15650, 13.10450],
      [80.15850, 13.10450],
      [80.15850, 13.10370],
      [80.15650, 13.10370],
      [80.15650, 13.10450]
    ]
  },
  {
    id: 'zone-south-buffer',
    name: 'South Boundary & Drainage Green Buffer',
    category: 'Green Belt',
    areaHectares: 2.4,
    description: 'Perimeter stormwater mitigation canal and native arboricultural biodiversity zone.',
    coordinates: [
      [80.15618, 13.10384],
      [80.15999, 13.10297],
      [80.15878, 13.10268],
      [80.15618, 13.10384]
    ]
  }
];

// Load all 911 trees directly from SourceFile
export const INITIAL_TREES: TreeRecord[] = SOURCE_TREES;

// Helper to convert tree dataset to standard GeoJSON FeatureCollection
export function treesToGeoJSON(trees: TreeRecord[]) {
  return {
    type: 'FeatureCollection',
    name: 'TI_Cycles_Ambattur_Tree_Census',
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' }
    },
    features: trees.map((t) => ({
      type: 'Feature',
      id: t.id,
      geometry: {
        type: 'Point',
        coordinates: t.coordinates
      },
      properties: {
        id: t.id,
        tagNumber: t.tagNumber,
        commonName: t.commonName,
        tamilName: t.tamilName,
        botanicalName: t.botanicalName,
        family: t.family,
        nativeStatus: t.nativeStatus,
        dbhCm: t.dbhCm,
        heightM: t.heightM,
        canopyRadiusM: t.canopyRadiusM,
        health: t.health,
        campusZone: t.campusZone,
        ageYears: t.ageYears,
        annualCO2Kg: t.annualCO2Kg,
        totalBiomassKg: t.totalBiomassKg,
        ecologicalValueINR: t.ecologicalValueINR,
        foliageDensity: t.foliageDensity,
        trunkCondition: t.trunkCondition,
        recommendedAction: t.recommendedAction,
        surveyDate: t.surveyDate,
        surveyor: t.surveyor,
        notes: t.notes
      }
    }))
  };
}

export { RAW_TREES_GEOJSON, TIDC_BOUNDARY_GEOJSON, getCampusBoundaryGeoJSON, getTreesGeoJSON };
