export interface SpeciesInfo {
  botanicalName: string;
  commonName: string;
  tamilName: string;
  family: string;
  nativeStatus: 'Native' | 'Exotic' | 'Naturalized';
  avgLifespanYears: number;
  maxHeightM: number;
  carbonAbsorptionPotential: 'Very High' | 'High' | 'Moderate' | 'Low';
  ecologicalRole: string;
  photoUrl: string;
  color: string;
}

export const SPECIES_CATALOG: Record<string, SpeciesInfo> = {
  'Azadirachta indica': {
    botanicalName: 'Azadirachta indica',
    commonName: 'Neem / Margosa',
    tamilName: 'வேப்ப மரம்',
    family: 'Meliaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 150,
    maxHeightM: 20,
    carbonAbsorptionPotential: 'High',
    ecologicalRole: 'Natural air purifier, antimicrobial shade tree, high pollution tolerance.',
    photoUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80',
    color: '#10b981', // emerald-500
  },
  'Tamarindus indica': {
    botanicalName: 'Tamarindus indica',
    commonName: 'Tamarind',
    tamilName: 'புளிய மரம்',
    family: 'Fabaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 200,
    maxHeightM: 24,
    carbonAbsorptionPotential: 'Very High',
    ecologicalRole: 'Dense canopy, soil stabilization, edible fruit, excellent windbreak.',
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    color: '#b45309', // amber-700
  },
  'Pongamia pinnata': {
    botanicalName: 'Pongamia pinnata',
    commonName: 'Indian Beech / Karanja',
    tamilName: 'புங்க மரம்',
    family: 'Fabaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 100,
    maxHeightM: 18,
    carbonAbsorptionPotential: 'High',
    ecologicalRole: 'Nitrogen-fixing, high drought resilience, dense cooling foliage along roadways.',
    photoUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    color: '#059669', // emerald-600
  },
  'Ficus religiosa': {
    botanicalName: 'Ficus religiosa',
    commonName: 'Sacred Peepal / Bodhi Tree',
    tamilName: 'அரச மரம்',
    family: 'Moraceae',
    nativeStatus: 'Native',
    avgLifespanYears: 300,
    maxHeightM: 30,
    carbonAbsorptionPotential: 'Very High',
    ecologicalRole: 'Keystone urban biodiversity species, 24-hour oxygen release, bird sanctuary.',
    photoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    color: '#047857', // emerald-700
  },
  'Ficus benghalensis': {
    botanicalName: 'Ficus benghalensis',
    commonName: 'Indian Banyan',
    tamilName: 'ஆல மரம்',
    family: 'Moraceae',
    nativeStatus: 'Native',
    avgLifespanYears: 400,
    maxHeightM: 28,
    carbonAbsorptionPotential: 'Very High',
    ecologicalRole: 'Immense canopy footprint, aerial roots, critical roosting habitat for avifauna.',
    photoUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    color: '#15803d', // green-700
  },
  'Delonix regia': {
    botanicalName: 'Delonix regia',
    commonName: 'Gulmohar / Flamboyant',
    tamilName: 'மயிற்கொன்றை',
    family: 'Fabaceae',
    nativeStatus: 'Naturalized',
    avgLifespanYears: 60,
    maxHeightM: 15,
    carbonAbsorptionPotential: 'Moderate',
    ecologicalRole: 'Vibrant umbrella canopy, pollinator attractor during summer flowering.',
    photoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    color: '#ef4444', // red-500
  },
  'Samanea saman': {
    botanicalName: 'Samanea saman',
    commonName: 'Rain Tree',
    tamilName: 'தூங்குமூஞ்சி மரம்',
    family: 'Fabaceae',
    nativeStatus: 'Naturalized',
    avgLifespanYears: 100,
    maxHeightM: 25,
    carbonAbsorptionPotential: 'Very High',
    ecologicalRole: 'Broad umbrella crown exceeding 30m spread; substantial carbon reservoir.',
    photoUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80',
    color: '#0d9488', // teal-600
  },
  'Polyalthia longifolia': {
    botanicalName: 'Polyalthia longifolia',
    commonName: 'False Ashoka / Mast Tree',
    tamilName: 'நெட்டிலிங்கம்',
    family: 'Annonaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 80,
    maxHeightM: 18,
    carbonAbsorptionPotential: 'Moderate',
    ecologicalRole: 'Vertical noise buffer, windbreak along boundary walls, dust attenuation.',
    photoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    color: '#84cc16', // lime-500
  },
  'Thespesia populnea': {
    botanicalName: 'Thespesia populnea',
    commonName: 'Portia Tree / Indian Tulip',
    tamilName: 'பூவரசு',
    family: 'Malvaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 90,
    maxHeightM: 14,
    carbonAbsorptionPotential: 'Moderate',
    ecologicalRole: 'Salt and pollution tolerant coastal/urban tree, yellow-to-purple flowers.',
    photoUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    color: '#eab308', // yellow-500
  },
  'Syzygium cumini': {
    botanicalName: 'Syzygium cumini',
    commonName: 'Jamun / Black Plum',
    tamilName: 'நாவல் மரம்',
    family: 'Myrtaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 120,
    maxHeightM: 22,
    carbonAbsorptionPotential: 'High',
    ecologicalRole: 'Dense evergreen foliage, attracts frugivorous birds and bats, medicinal bark.',
    photoUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    color: '#6366f1', // indigo-500
  },
  'Peltophorum pterocarpum': {
    botanicalName: 'Peltophorum pterocarpum',
    commonName: 'Copperpod / Yellow Flame',
    tamilName: 'மஞ்சள் கொன்றை',
    family: 'Fabaceae',
    nativeStatus: 'Naturalized',
    avgLifespanYears: 70,
    maxHeightM: 20,
    carbonAbsorptionPotential: 'High',
    ecologicalRole: 'Massive yellow inflorescence, provides extensive cooling shade in industrial campus.',
    photoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    color: '#f59e0b', // amber-500
  },
  'Millingtonia hortensis': {
    botanicalName: 'Millingtonia hortensis',
    commonName: 'Indian Cork Tree',
    tamilName: 'மரமல்லி',
    family: 'Bignoniaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 75,
    maxHeightM: 25,
    carbonAbsorptionPotential: 'Moderate',
    ecologicalRole: 'Fast-growing slender tree with intensely fragrant nocturnal white blossoms.',
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    color: '#a855f7', // purple-500
  },
  'Swietenia mahagoni': {
    botanicalName: 'Swietenia mahagoni',
    commonName: 'West Indian Mahogany',
    tamilName: 'மகாகனி',
    family: 'Meliaceae',
    nativeStatus: 'Exotic',
    avgLifespanYears: 130,
    maxHeightM: 22,
    carbonAbsorptionPotential: 'High',
    ecologicalRole: 'High wood density, high carbon storage density, sturdy canopy.',
    photoUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80',
    color: '#854d0e', // amber-800
  },
  'Albizia lebbeck': {
    botanicalName: 'Albizia lebbeck',
    commonName: 'Woman\'s Tongue / Siris',
    tamilName: 'வாகை மரம்',
    family: 'Fabaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 90,
    maxHeightM: 20,
    carbonAbsorptionPotential: 'High',
    ecologicalRole: 'Historical victory tree of Sangam era Tamil Nadu; nitrogen fixing.',
    photoUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80',
    color: '#14b8a6', // teal-500
  },
  'Cassia fistula': {
    botanicalName: 'Cassia fistula',
    commonName: 'Golden Shower',
    tamilName: 'சரக்கொன்றை',
    family: 'Fabaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 65,
    maxHeightM: 13,
    carbonAbsorptionPotential: 'Moderate',
    ecologicalRole: 'Cascading yellow floral racemes, host plant for Silverline and Pierid butterflies.',
    photoUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    color: '#eab308', // yellow-500
  },
  'Alstonia scholaris': {
    botanicalName: 'Alstonia scholaris',
    commonName: 'Devil\'s Tree / Dita Bark',
    tamilName: 'ஏழிலைப்பாலை',
    family: 'Apocynaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 85,
    maxHeightM: 22,
    carbonAbsorptionPotential: 'High',
    ecologicalRole: 'Whorled 7-leaflet pattern, pagoda branch architecture, industrial acoustic dampener.',
    photoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    color: '#06b6d4', // cyan-500
  },
  'Mangifera indica': {
    botanicalName: 'Mangifera indica',
    commonName: 'Mango Tree',
    tamilName: 'மாமரம்',
    family: 'Anacardiaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 100,
    maxHeightM: 18,
    carbonAbsorptionPotential: 'High',
    ecologicalRole: 'Dense evergreen crown, traditional Tamil fruit tree, broad urban shade.',
    photoUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    color: '#ca8a04', // yellow-600
  },
  'Cocos nucifera': {
    botanicalName: 'Cocos nucifera',
    commonName: 'Coconut Palm',
    tamilName: 'தென்னை மரம்',
    family: 'Arecaceae',
    nativeStatus: 'Native',
    avgLifespanYears: 80,
    maxHeightM: 22,
    carbonAbsorptionPotential: 'Moderate',
    ecologicalRole: 'Classic coastal palm, deep root anchoring, multiple ecological yields.',
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
    color: '#22c55e', // green-500
  }
};
