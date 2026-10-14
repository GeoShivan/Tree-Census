import React from 'react';
import { TreeRecord } from '../../types/tree';
import { SPECIES_CATALOG } from '../../data/speciesCatalog';
import { calculateDiversityIndices } from '../../utils/geoUtils';
import { X, Printer, TreePine, ShieldCheck, Download } from 'lucide-react';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  trees: TreeRecord[];
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  trees
}) => {
  if (!isOpen) return null;

  const totalTrees = trees.length;
  const avgDBH = totalTrees > 0 ? (trees.reduce((acc, t) => acc + t.dbhCm, 0) / totalTrees).toFixed(1) : '0';
  const totalCanopySqM = Math.round(
    trees.reduce((acc, t) => acc + Math.PI * Math.pow(t.canopyRadiusM, 2), 0)
  );
  const diversity = calculateDiversityIndices(trees);

  const healthyCount = trees.filter(t => t.health === 'Healthy' || t.health === 'Good').length;
  const healthPercent = totalTrees > 0 ? Math.round((healthyCount / totalTrees) * 100) : 0;

  // Species count summary
  const speciesCounts: Record<string, number> = {};
  trees.forEach(t => {
    speciesCounts[t.botanicalName] = (speciesCounts[t.botanicalName] || 0) + 1;
  });
  const topSpecies = Object.entries(speciesCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:m-0 print:p-0 print:border-none print:shadow-none print:max-h-none print:w-full">
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="p-3 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Executive Census Report (Print Preview)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-6 bg-white text-slate-900 font-sans print:p-0">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest font-black text-emerald-700">
                TUBE INVESTMENTS OF INDIA LIMITED • MURUGAPPA GROUP
              </div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight mt-1">
                TI Cycles Ambattur Campus Tree Census
              </h1>
              <div className="text-xs text-slate-600 mt-0.5">
                Comprehensive GIS Inventory, Dendrometric Survey & Species Directory
              </div>
            </div>

            <div className="text-right text-xs text-slate-600 font-mono">
              <div className="font-bold text-slate-900">REF: TIC-AMB-ENV-2026</div>
              <div>Date: March 2026</div>
              <div>Campus Area: 27.6 Hectares</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              1. Executive Summary & Stand Characteristics
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              A comprehensive tree census and geospatial mapping initiative was executed across the entire TI Cycles manufacturing, testing track, and corporate premises located on MTH Road, Ambattur Industrial Estate, Chennai. Each tree has been geolocated with sub-meter GNSS accuracy, tagged with physical anodized barcode plates, and evaluated for arboricultural vigor, dendrometric metrics, and crown coverage.
            </p>
          </div>

          {/* Key Metrics Table */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Trees</div>
              <div className="text-xl font-black text-slate-900 font-mono">{totalTrees}</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Mean DBH</div>
              <div className="text-xl font-black text-emerald-700 font-mono">{avgDBH} cm</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Species Richness</div>
              <div className="text-xl font-black text-slate-900 font-mono">{diversity.speciesCount}</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Canopy Cover</div>
              <div className="text-xl font-black text-slate-900 font-mono">{totalCanopySqM.toLocaleString()} m²</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Health Index</div>
              <div className="text-xl font-black text-emerald-700 font-mono">{healthPercent}%</div>
            </div>
          </div>

          {/* Dominant Species Table */}
          <div>
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              2. Dominant Botanical Taxa Breakdown
            </h3>
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600 font-semibold text-[11px]">
                  <th className="py-1.5">Common Name</th>
                  <th className="py-1.5">Tamil Vernacular</th>
                  <th className="py-1.5">Botanical Name</th>
                  <th className="py-1.5">Family</th>
                  <th className="py-1.5 text-right">Count</th>
                  <th className="py-1.5 text-right">% of Stand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {topSpecies.map(([botanical, count]) => {
                  const sample = trees.find(t => t.botanicalName === botanical);
                  const pct = ((count / totalTrees) * 100).toFixed(1);
                  return (
                    <tr key={botanical}>
                      <td className="py-1 font-semibold text-slate-900">{sample?.commonName || botanical}</td>
                      <td className="py-1 text-slate-700 font-serif">{sample?.tamilName || '—'}</td>
                      <td className="py-1 italic text-slate-700 font-serif">{botanical}</td>
                      <td className="py-1 text-slate-600">{sample?.family || '—'}</td>
                      <td className="py-1 text-right font-mono font-bold text-slate-900">{count}</td>
                      <td className="py-1 text-right font-mono text-slate-700">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Compliance & Certification Statement */}
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl text-xs space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>ESG & Environmental Compliance Endorsement</span>
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This census report satisfies the statutory environmental disclosure norms under ISO 14001:2015 Environmental Management Systems and Corporation of Chennai urban forestry guidelines. Continuous maintenance and periodic arborist evaluations are recommended to preserve campus biodiversity and canopy shade.
            </p>
            <div className="flex justify-between items-end pt-4 text-[11px] text-slate-600 border-t border-slate-200">
              <div>
                <div className="font-bold text-slate-900">Dr. K. Ramanathan, Arborist</div>
                <div>Consulting Urban Ecologist</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">TI Cycles Sustainability Team</div>
                <div>Tube Investments of India Limited</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
