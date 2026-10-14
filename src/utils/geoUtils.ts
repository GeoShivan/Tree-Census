import { TreeRecord } from '../types/tree';

// Download text/blob as file in browser
export function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Convert trees to CSV
export function exportTreesToCSV(trees: TreeRecord[]): string {
  const headers = [
    'Tree_ID',
    'Tag_Number',
    'Common_Name',
    'Tamil_Name',
    'Botanical_Name',
    'Family',
    'Native_Status',
    'Longitude',
    'Latitude',
    'DBH_cm',
    'Height_m',
    'Canopy_Radius_m',
    'Health_Status',
    'Campus_Zone',
    'Estimated_Age_Years',
    'Foliage_Density',
    'Trunk_Condition',
    'Recommended_Action',
    'Survey_Date',
    'Surveyor',
    'GPS_Accuracy_m'
  ];

  const escapeCSV = (val: unknown) => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = trees.map(t => [
    escapeCSV(t.id),
    escapeCSV(t.tagNumber),
    escapeCSV(t.commonName),
    escapeCSV(t.tamilName),
    escapeCSV(t.botanicalName),
    escapeCSV(t.family),
    escapeCSV(t.nativeStatus),
    t.coordinates[0],
    t.coordinates[1],
    t.dbhCm,
    t.heightM,
    t.canopyRadiusM,
    escapeCSV(t.health),
    escapeCSV(t.campusZone),
    t.ageYears,
    escapeCSV(t.foliageDensity),
    escapeCSV(t.trunkCondition),
    escapeCSV(t.recommendedAction),
    escapeCSV(t.surveyDate),
    escapeCSV(t.surveyor),
    t.gpsAccuracyM
  ].join(','));

  return [headers.join(','), ...rows].join('\r\n');
}

// Format coordinates to DMS string (Degrees Minutes Seconds)
export function formatToDMS(decimal: number, isLatitude: boolean): string {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  const direction = isLatitude
    ? decimal >= 0 ? 'N' : 'S'
    : decimal >= 0 ? 'E' : 'W';

  return `${degrees}°${minutes}'${seconds}" ${direction}`;
}

// Approximate UTM Zone 44N projection coordinates for Ambattur, Chennai
export function toApproxUTM44N(lng: number, lat: number) {
  // Chennai center approx UTM 44N: Easting ~408,000m, Northing ~1,450,000m
  const baseLng = 80.1555;
  const baseLat = 13.1158;
  const baseEasting = 408450;
  const baseNorthing = 1450280;

  // 1 deg lat ≈ 110,574m, 1 deg lng ≈ 108,300m at lat 13°
  const easting = Math.round(baseEasting + (lng - baseLng) * 108300);
  const northing = Math.round(baseNorthing + (lat - baseLat) * 110574);

  return { easting, northing, zone: '44N' };
}

// Shannon-Wiener Diversity Index calculation
export function calculateDiversityIndices(trees: TreeRecord[]) {
  if (trees.length === 0) return { shannon: 0, simpson: 0, speciesCount: 0 };

  const counts: Record<string, number> = {};
  trees.forEach(t => {
    counts[t.botanicalName] = (counts[t.botanicalName] || 0) + 1;
  });

  const total = trees.length;
  let shannon = 0;
  let simpsonSum = 0;

  Object.values(counts).forEach(count => {
    const p = count / total;
    if (p > 0) {
      shannon -= p * Math.log(p);
      simpsonSum += p * p;
    }
  });

  const simpson = 1 - simpsonSum; // Gini-Simpson Index (probability that two randomly selected individuals belong to different species)

  return {
    shannon: Number(shannon.toFixed(2)),
    simpson: Number(simpson.toFixed(2)),
    speciesCount: Object.keys(counts).length
  };
}
