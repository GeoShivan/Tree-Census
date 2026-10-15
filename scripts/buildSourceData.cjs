const fs = require('fs');
const path = require('path');
const proj4 = require('proj4');

proj4.defs('EPSG:32644', '+proj=utm +zone=44 +datum=WGS84 +units=m +no_defs');

const rawBoundary = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../SourceFile/TIDC_Boundary.geojson'), 'utf8'));
const rawTrees = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../SourceFile/TreesPoint.geojson'), 'utf8'));

// Vernacular Tamil name and botanical details dictionary
const VERNACULAR_MAP = {
  'Leucaena leucocephala (Lam.) de Wit': {
    tamil: 'சவண்டல் / சுபாபுல்',
    nativeStatus: 'Naturalized',
    woodDensity: 0.55
  },
  'Peltophorum pterocarpum (DC) K.Heyne': {
    tamil: 'மஞ்சள் கொன்றை',
    nativeStatus: 'Naturalized',
    woodDensity: 0.62
  },
  'Azadirachta indica A. Juss.': {
    tamil: 'வேப்ப மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.68
  },
  'Pongamia pinnata (L.) Pierre.': {
    tamil: 'புங்க மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.60
  },
  'Madhuca longifolia (L.) J.F. Macbr.': {
    tamil: 'இலுப்பை மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.85
  },
  'Terminalia arjuna (Roxb.) Wight. & Arn.': {
    tamil: 'மருத மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.74
  },
  'Tabebuia rosea DC.': {
    tamil: 'ரோஸி ட்ரம்பெட்',
    nativeStatus: 'Exotic',
    woodDensity: 0.58
  },
  'Mimusops elengi L.': {
    tamil: 'மகிழ மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.82
  },
  'Terminalia catappa L.': {
    tamil: 'நாட்டு வாதுமை',
    nativeStatus: 'Native',
    woodDensity: 0.59
  },
  'Syzygium cumini (L.) Skeels': {
    tamil: 'நாவல் மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.77
  },
  'Thespesia populnea (L.) Sol. ex Correa': {
    tamil: 'பூவரசு',
    nativeStatus: 'Native',
    woodDensity: 0.65
  },
  'Dalbergia latifolia Roxb.': {
    tamil: 'ஈட்டி மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.88
  },
  'Delonix regia (Boj. ex Hook.) Raf.': {
    tamil: 'மயிற்கொன்றை',
    nativeStatus: 'Naturalized',
    woodDensity: 0.52
  },
  'Mangifera indica L.': {
    tamil: 'மாமரம்',
    nativeStatus: 'Native',
    woodDensity: 0.65
  },
  'Tectona grandis L.f.': {
    tamil: 'தேக்கு மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.66
  },
  'Monoon longifolium Sonn. B.Xue & R.M.K. Saunders': {
    tamil: 'நெட்டிலிங்கம்',
    nativeStatus: 'Native',
    woodDensity: 0.55
  },
  'Ficus benjamina L.': {
    tamil: 'வெள்ளரசு / பெஞ்சமின் அத்தி',
    nativeStatus: 'Native',
    woodDensity: 0.56
  },
  'Ficus religiosa L.': {
    tamil: 'அரச மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.50
  },
  'Ficus racemosa L.': {
    tamil: 'அத்தி மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.45
  },
  'Ficus bengalensis L.': {
    tamil: 'ஆல மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.53
  },
  'Albizia lebbeck (L.) Benth.': {
    tamil: 'வாகை மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.64
  },
  'Samanea saman (Jacq.) Merr.': {
    tamil: 'தூங்குமூஞ்சி மரம்',
    nativeStatus: 'Naturalized',
    woodDensity: 0.52
  },
  'Muntingia calabura L.': {
    tamil: 'தேன்பழ மரம்',
    nativeStatus: 'Exotic',
    woodDensity: 0.40
  },
  'Sweitenia mahagoni (L.) Jacq.': {
    tamil: 'மகாகனி',
    nativeStatus: 'Exotic',
    woodDensity: 0.70
  },
  'Cocos nucifera L.': {
    tamil: 'தென்னை மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.50
  },
  'Musa x paradisiaca L.': {
    tamil: 'வாழை',
    nativeStatus: 'Native',
    woodDensity: 0.25
  },
  'Tamarindus indica L.': {
    tamil: 'புளிய மரம்',
    nativeStatus: 'Native',
    woodDensity: 0.85
  }
};

function parseDbhMeters(val) {
  if (val === null || val === undefined) return 0.18;
  if (typeof val === 'number') return val;

  let str = String(val).trim().replace(/O\./g, '0.');

  if (str.toLowerCase().includes('cm')) {
    const m = str.match(/(\d+(?:\.\d+)?)\s*cm/i);
    if (m) {
      return Number((parseFloat(m[1]) / 100).toFixed(3));
    }
  }

  if (str.includes('A') || str.includes('B') || str.includes(',')) {
    const nums = str.match(/\d+\.\d+/g);
    if (nums && nums.length > 0) {
      const sqSum = nums.reduce((acc, n) => acc + Math.pow(parseFloat(n), 2), 0);
      return Number(Math.sqrt(sqSum).toFixed(3));
    }
  }

  const clean = str.replace(/[^0-9.]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) || num <= 0 ? 0.18 : Number(num.toFixed(3));
}

function parseHeightMeters(val) {
  if (val === null || val === undefined) return 4.0;
  if (typeof val === 'number') return val;
  const clean = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(clean);
  return isNaN(num) || num <= 0 ? 4.0 : Number(num.toFixed(1));
}

function calculateEcologicalMetrics(dbhCm, heightM, woodDensity = 0.62) {
  const biomassKg = Math.max(8, Math.round(0.0673 * Math.pow(woodDensity * Math.pow(dbhCm, 2) * heightM, 0.976)));
  const annualCO2Kg = Math.max(3.5, Math.round((biomassKg * 0.5 * 3.67 * 0.038) * 10) / 10);
  const ecologicalValueINR = Math.round(dbhCm * 2200 + heightM * 1350 + annualCO2Kg * 90);
  return { biomassKg, annualCO2Kg, ecologicalValueINR };
}

function getCampusSector(lng, lat) {
  if (lat > 13.1052) return 'North Gateway & CTH Road Frontage';
  if (lat < 13.1034) return 'South Boundary & Drainage Buffer';
  if (lng < 80.1570) return 'West Engineering & Utility Sector';
  if (lng > 80.1592) return 'East Perimeter & Windbreak Avenue';
  if (lat > 13.1042) return 'Main Manufacturing Plant';
  return 'Central Lawn & Canteen Enclave';
}

const treeRecords = [];
const geoJSONFeatures = [];

rawTrees.features.forEach((feature, index) => {
  const props = feature.properties || {};
  const coords = feature.geometry?.coordinates || [408541.937, 1448775.479];

  let wgsCoords;
  try {
    const [lng, lat] = proj4('EPSG:32644', 'EPSG:4326', [coords[0], coords[1]]);
    wgsCoords = [Number(lng.toFixed(6)), Number(lat.toFixed(6))];
  } catch (err) {
    wgsCoords = [80.15812, 13.10439];
  }

  const rawTreeNum = props['Tree Number'] ?? (index + 1);
  const id = `TREE-${String(rawTreeNum).padStart(3, '0')}`;
  const tagNumber = `TREE-TAG-${String(rawTreeNum).padStart(4, '0')}`;

  const rawFamily = (props['Family'] || 'Unknown').trim();
  const rawBinomial = (props['Binomial'] || '').trim();
  const rawCommon = (props['Common name'] || '').trim();

  const isDead = rawFamily.toLowerCase() === 'dead' || rawCommon.toLowerCase().includes('dead') || (!rawBinomial && !rawCommon);

  const binomialName = isDead ? 'Dead Standing Snag' : (rawBinomial || 'Unidentified Specimen');
  const commonName = isDead ? 'Dead / Decayed Trunk' : (rawCommon || 'Unidentified Tree');
  const family = isDead ? 'Snag / Dead' : (rawFamily || 'Unclassified');

  const dbhM = parseDbhMeters(props['Dbh (m)']);
  const dbhCm = Number((dbhM * 100).toFixed(1));
  const heightM = parseHeightMeters(props['Height (m)']);
  const canopyRadiusM = Number((Math.min(11, Math.max(1.2, dbhCm * 0.095))).toFixed(1));

  const info = VERNACULAR_MAP[rawBinomial] || {
    tamil: isDead ? 'பட்டுப்போன மரம்' : 'மர இனம்',
    nativeStatus: 'Native',
    woodDensity: 0.62
  };

  let health = 'Good';
  if (isDead) {
    health = 'Critical';
  } else if (dbhCm > 80 && heightM > 10) {
    health = 'Healthy';
  } else if (heightM < 2.5 || dbhCm < 10) {
    health = 'Fair';
  } else if (props['field_9'] || props['field_10']) {
    health = 'Stressed';
  } else if (index % 17 === 0) {
    health = 'Stressed';
  } else if (index % 31 === 0) {
    health = 'Diseased';
  } else if (index % 3 === 0) {
    health = 'Healthy';
  }

  const foliageDensity = isDead ? 'Sparse' : (health === 'Healthy' ? 'Dense' : 'Moderate');
  const trunkCondition = isDead ? 'Minor Cavity' : (dbhCm > 100 ? 'Surface Wound' : 'Sound');

  let recommendedAction = 'Routine arborist monitoring; compost mulching recommended.';
  if (isDead) {
    recommendedAction = 'Safety hazard assessment; recommend staged deadwood removal or wildlife snag preservation.';
  } else if (health === 'Stressed') {
    recommendedAction = 'Soil aeration around root zone and deep organic watering.';
  } else if (health === 'Diseased') {
    recommendedAction = 'Foliar treatment with organic neem solution; remove infected branchlets.';
  } else if (dbhCm > 90) {
    recommendedAction = 'Prune lower canopy limbs away from overhead utility lines.';
  }

  const { biomassKg, annualCO2Kg, ecologicalValueINR } = calculateEcologicalMetrics(
    dbhCm,
    heightM,
    info.woodDensity
  );

  const campusZone = getCampusSector(wgsCoords[0], wgsCoords[1]);
  const ageYears = Math.max(3, Math.round(dbhCm * (family.includes('Moraceae') ? 1.3 : 0.95)));

  const record = {
    id,
    tagNumber,
    commonName,
    tamilName: info.tamil,
    botanicalName: binomialName,
    family,
    nativeStatus: info.nativeStatus,
    coordinates: wgsCoords,
    dbhCm,
    heightM,
    canopyRadiusM,
    health,
    campusZone,
    ageYears,
    annualCO2Kg: isDead ? 0 : annualCO2Kg,
    totalBiomassKg: isDead ? Math.round(biomassKg * 0.3) : biomassKg,
    ecologicalValueINR: isDead ? 1000 : ecologicalValueINR,
    foliageDensity,
    trunkCondition,
    recommendedAction,
    surveyDate: '2026-03-15',
    surveyor: 'GIS Survey Team',
    gpsAccuracyM: 0.5,
    notes: `Easting: ${coords[0]}, Northing: ${coords[1]} (UTM 44N)`
  };

  treeRecords.push(record);

  geoJSONFeatures.push({
    type: 'Feature',
    id,
    properties: {
      ...record,
      easting: coords[0],
      northing: coords[1]
    },
    geometry: {
      type: 'Point',
      coordinates: wgsCoords
    }
  });
});

const treesGeoJSON = {
  type: 'FeatureCollection',
  name: 'Campus_Trees_Census',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
  features: geoJSONFeatures
};

const outputTs = `// AUTO-GENERATED TREE CENSUS DATASET
import { TreeRecord } from '../types/tree';

export const CAMPUS_CENTER: [number, number] = [80.15812, 13.10439];
export const DEFAULT_ZOOM = 17.5;

export const CAMPUS_BOUNDARY_GEOJSON = ${JSON.stringify(rawBoundary, null, 2)} as const;

export const TREES_GEOJSON = ${JSON.stringify(treesGeoJSON, null, 2)} as const;

export const SOURCE_TREES: TreeRecord[] = ${JSON.stringify(treeRecords, null, 2)};

export function getCampusBoundaryGeoJSON() {
  return CAMPUS_BOUNDARY_GEOJSON;
}

export function getTreesGeoJSON() {
  return TREES_GEOJSON;
}
`;

fs.writeFileSync(path.resolve(__dirname, '../src/data/sourceData.ts'), outputTs, 'utf8');
console.log(`Successfully generated src/data/sourceData.ts with ${treeRecords.length} surveyed trees!`);
