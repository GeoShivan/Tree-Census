import React, { useState } from 'react';
import { TreeRecord } from '../../types/tree';
import { SPECIES_CATALOG } from '../../data/speciesCatalog';
import { formatToDMS, toApproxUTM44N } from '../../utils/geoUtils';
import {
  X,
  MapPin,
  Leaf,
  Calendar,
  User,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  ExternalLink,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles
} from 'lucide-react';

interface TreeDetailModalProps {
  tree: TreeRecord | null;
  onClose: () => void;
  onNavigateTree: (direction: 'prev' | 'next') => void;
}

export const TreeDetailModal: React.FC<TreeDetailModalProps> = ({
  tree,
  onClose,
  onNavigateTree
}) => {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [showQRTag, setShowQRTag] = useState(false);

  if (!tree) return null;

  const speciesInfo = SPECIES_CATALOG[tree.botanicalName];
  const utm = toApproxUTM44N(tree.coordinates[0], tree.coordinates[1]);
  const circumferenceCm = Math.round(tree.dbhCm * Math.PI * 10) / 10;
  const crownAreaSqM = Math.round(Math.PI * Math.pow(tree.canopyRadiusM, 2) * 10) / 10;

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${tree.coordinates[1]}, ${tree.coordinates[0]}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${tree.coordinates[1]},${tree.coordinates[0]}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              {tree.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{tree.commonName}</h2>
                <span className="text-xs text-emerald-400 font-medium font-serif">
                  ({tree.tamilName})
                </span>
              </div>
              <div className="text-xs text-slate-400 italic font-serif">
                {tree.botanicalName} • Family: <span className="text-slate-300 font-sans">{tree.family}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigateTree('prev')}
              title="Previous Tree"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTree('next')}
              title="Next Tree"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Tag & Campus Zone Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Official Tag:</span>
              <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {tree.tagNumber}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-300 font-medium">{tree.campusZone}</span>
            </div>
            <div>
              <span
                className={`px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                  tree.nativeStatus === 'Native'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {tree.nativeStatus} Species
              </span>
            </div>
          </div>

          {/* Dendrometric Measurements Grid */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2.5">
              Dendrometric Dimensions & Crown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-0.5">DBH (Diameter)</div>
                <div className="text-lg font-bold text-emerald-400 font-mono">{tree.dbhCm} cm</div>
                <div className="text-[10px] text-slate-500">Circum: {circumferenceCm} cm</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-0.5">Total Height</div>
                <div className="text-lg font-bold text-sky-400 font-mono">{tree.heightM} m</div>
                <div className="text-[10px] text-slate-500">{(tree.heightM * 3.28).toFixed(1)} feet</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-0.5">Crown Spread</div>
                <div className="text-lg font-bold text-teal-400 font-mono">
                  {(tree.canopyRadiusM * 2).toFixed(1)} m
                </div>
                <div className="text-[10px] text-slate-500">Area: ~{crownAreaSqM} m²</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400 mb-0.5">Estimated Age</div>
                <div className="text-lg font-bold text-amber-400 font-mono">~{tree.ageYears} yrs</div>
                <div className="text-[10px] text-slate-500">Surveyed 2024</div>
              </div>
            </div>
          </div>

          {/* Canopy Architecture & Structural Dimensions */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2.5 flex items-center justify-between">
              <span>Canopy Architecture & Structural Dimensions</span>
              <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Surveyed Dendrometric Metrics
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-gradient-to-br from-slate-950 to-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/30">
                <div className="text-xs text-emerald-300 font-medium mb-1">Canopy Coverage Area</div>
                <div className="text-xl font-extrabold text-emerald-400 font-mono">
                  {(Math.PI * Math.pow(tree.canopyRadiusM, 2)).toFixed(1)} <span className="text-xs text-slate-400 font-normal">m²</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Direct crown shade footprint</div>
              </div>

              <div className="bg-gradient-to-br from-slate-950 to-teal-950/40 p-3.5 rounded-xl border border-teal-500/30">
                <div className="text-xs text-teal-300 font-medium mb-1">Crown Diameter & Spread</div>
                <div className="text-xl font-extrabold text-teal-400 font-mono">
                  {(tree.canopyRadiusM * 2).toFixed(1)} <span className="text-xs text-slate-400 font-normal">m spread</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Radius: {tree.canopyRadiusM}m radial extension</div>
              </div>

              <div className="bg-gradient-to-br from-slate-950 to-sky-950/40 p-3.5 rounded-xl border border-sky-500/30">
                <div className="text-xs text-sky-300 font-medium mb-1">Slenderness Ratio (H:D)</div>
                <div className="text-xl font-extrabold text-sky-400 font-mono">
                  {((tree.heightM * 100) / (tree.dbhCm || 1)).toFixed(1)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Height ({tree.heightM}m) to DBH ({tree.dbhCm}cm)</div>
              </div>
            </div>
          </div>

          {/* Health & Arboricultural Diagnosis */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Health Assessment & Field Observations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Health Condition:</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold ${
                    tree.health === 'Healthy'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : tree.health === 'Good'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : tree.health === 'Fair'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {tree.health}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Foliage Canopy Density:</span>
                <span className="font-semibold text-slate-200">{tree.foliageDensity}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Trunk / Root Condition:</span>
                <span className="font-semibold text-slate-200">{tree.trunkCondition}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
              <span className="text-amber-400 font-bold block mb-0.5">Recommended Arborist Action:</span>
              <p className="text-slate-300">{tree.recommendedAction}</p>
            </div>
          </div>

          {/* Spatial & Survey GPS Data */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">GPS & Geolocation Metadata</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCoords}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                >
                  {copiedCoords ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCoords ? 'Copied' : 'Copy Lat/Lng'}</span>
                </button>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-1">
              <div>
                <span className="text-slate-500 block">Latitude</span>
                <span className="text-slate-200">{tree.coordinates[1].toFixed(6)}° N</span>
              </div>
              <div>
                <span className="text-slate-500 block">Longitude</span>
                <span className="text-slate-200">{tree.coordinates[0].toFixed(6)}° E</span>
              </div>
              <div>
                <span className="text-slate-500 block">UTM 44N (E/N)</span>
                <span className="text-slate-200">{utm.easting} / {utm.northing}</span>
              </div>
              <div>
                <span className="text-slate-500 block">GPS Precision</span>
                <span className="text-emerald-400">± {tree.gpsAccuracyM} m</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Survey Date: {tree.surveyDate}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> Surveyor: {tree.surveyor}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={() => setShowQRTag(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Generate Field Metal Tag / QR</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/40"
          >
            Done
          </button>
        </div>
      </div>

      {/* QR Code Tag Modal */}
      {showQRTag && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative text-center">
            <button
              onClick={() => setShowQRTag(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 mb-1">
              TI CYCLES OF INDIA - AMBATTUR
            </div>
            <div className="text-sm font-bold text-white mb-4">Tree Tag Specification</div>

            {/* Tag Simulation Badge */}
            <div className="bg-gradient-to-b from-slate-200 to-slate-300 text-slate-900 rounded-xl p-4 shadow-inner border-2 border-slate-400 mx-auto max-w-xs text-left font-mono">
              <div className="flex items-center justify-between border-b border-slate-400 pb-1.5 mb-2">
                <span className="text-[11px] font-bold text-slate-800">TI CYCLES CENSUS</span>
                <span className="text-xs font-black text-emerald-700">{tree.id}</span>
              </div>

              {/* QR Code Graphic using SVG */}
              <div className="bg-white p-2 rounded-lg border border-slate-300 flex items-center justify-center mb-2">
                <svg viewBox="0 0 100 100" className="w-28 h-28 text-slate-900" fill="currentColor">
                  {/* Styled QR Matrix pattern */}
                  <rect x="5" y="5" width="25" height="25" fill="#0f172a" />
                  <rect x="8" y="8" width="19" height="19" fill="#ffffff" />
                  <rect x="12" y="12" width="11" height="11" fill="#0f172a" />

                  <rect x="70" y="5" width="25" height="25" fill="#0f172a" />
                  <rect x="73" y="8" width="19" height="19" fill="#ffffff" />
                  <rect x="77" y="12" width="11" height="11" fill="#0f172a" />

                  <rect x="5" y="70" width="25" height="25" fill="#0f172a" />
                  <rect x="8" y="73" width="19" height="19" fill="#ffffff" />
                  <rect x="12" y="77" width="11" height="11" fill="#0f172a" />

                  <rect x="36" y="10" width="6" height="6" fill="#0f172a" />
                  <rect x="46" y="10" width="6" height="6" fill="#0f172a" />
                  <rect x="56" y="10" width="6" height="6" fill="#0f172a" />
                  <rect x="36" y="24" width="6" height="6" fill="#0f172a" />
                  <rect x="46" y="34" width="8" height="8" fill="#0f172a" />
                  <rect x="58" y="28" width="6" height="6" fill="#0f172a" />
                  <rect x="10" y="44" width="8" height="8" fill="#0f172a" />
                  <rect x="25" y="44" width="8" height="8" fill="#0f172a" />
                  <rect x="40" y="50" width="14" height="14" fill="#059669" />
                  <rect x="65" y="45" width="10" height="10" fill="#0f172a" />
                  <rect x="82" y="45" width="8" height="8" fill="#0f172a" />
                  <rect x="36" y="72" width="8" height="8" fill="#0f172a" />
                  <rect x="52" y="72" width="14" height="14" fill="#0f172a" />
                  <rect x="74" y="72" width="8" height="8" fill="#0f172a" />
                  <rect x="74" y="86" width="14" height="8" fill="#0f172a" />
                </svg>
              </div>

              <div className="text-[10px] space-y-0.5 leading-tight font-sans">
                <div className="font-bold text-slate-900">{tree.commonName}</div>
                <div className="text-slate-700 italic font-serif text-[9px]">{tree.botanicalName}</div>
                <div className="text-slate-600 text-[9px]">TAG: {tree.tagNumber}</div>
                <div className="text-slate-600 text-[9px]">ZONE: {tree.campusZone.split(' ')[0]}</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4">
              Printable anodized aluminum tag template for campus tree inventory asset tracking.
            </p>

            <button
              onClick={() => window.print()}
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tree Tag</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
