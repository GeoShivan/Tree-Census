import React, { useMemo } from 'react';
import { TreeRecord } from '../../types/tree';
import { calculateDiversityIndices } from '../../utils/geoUtils';
import { SPECIES_CATALOG } from '../../data/speciesCatalog';
import { CAMPUS_ZONES } from '../../data/tiCyclesCampus';
import {
  X,
  TreePine,
  Sparkles,
  HeartPulse,
  Leaf,
  BarChart3,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Download,
  Printer
} from 'lucide-react';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trees: TreeRecord[];
  allTrees: TreeRecord[];
  onOpenReport: () => void;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  trees,
  allTrees,
  onOpenReport
}) => {
  if (!isOpen) return null;

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalTrees = trees.length;
    const totalCanopyAreaSqM = trees.reduce((acc, t) => acc + Math.PI * Math.pow(t.canopyRadiusM, 2), 0);
    const avgDBH = totalTrees > 0 ? trees.reduce((acc, t) => acc + t.dbhCm, 0) / totalTrees : 0;
    const avgHeight = totalTrees > 0 ? trees.reduce((acc, t) => acc + t.heightM, 0) / totalTrees : 0;

    const diversity = calculateDiversityIndices(trees);

    // Health distribution
    const healthCounts: Record<string, number> = {
      Healthy: 0,
      Good: 0,
      Fair: 0,
      Stressed: 0,
      Diseased: 0
    };
    trees.forEach(t => {
      healthCounts[t.health] = (healthCounts[t.health] || 0) + 1;
    });

    const healthyCount = (healthCounts.Healthy || 0) + (healthCounts.Good || 0);
    const healthyPercent = totalTrees > 0 ? Math.round((healthyCount / totalTrees) * 100) : 0;

    // Species distribution
    const speciesCounts: Record<string, number> = {};
    trees.forEach(t => {
      speciesCounts[t.botanicalName] = (speciesCounts[t.botanicalName] || 0) + 1;
    });
    const sortedSpecies = Object.entries(speciesCounts)
      .map(([botanical, count]) => {
        const sample = trees.find(t => t.botanicalName === botanical);
        return {
          botanical,
          count,
          percent: Number(((count / totalTrees) * 100).toFixed(1)),
          commonName: sample ? sample.commonName : botanical,
          tamilName: sample ? sample.tamilName : '',
          color: SPECIES_CATALOG[botanical]?.color || '#10b981'
        };
      })
      .sort((a, b) => b.count - a.count);

    // DBH Class distribution
    const dbhClasses = [
      { label: 'Juvenile (<25 cm)', count: trees.filter(t => t.dbhCm < 25).length, color: '#a7f3d0' },
      { label: 'Semi-Mature (25-45 cm)', count: trees.filter(t => t.dbhCm >= 25 && t.dbhCm < 45).length, color: '#34d399' },
      { label: 'Mature (45-75 cm)', count: trees.filter(t => t.dbhCm >= 45 && t.dbhCm < 75).length, color: '#059669' },
      { label: 'Heritage / Landmark (>75 cm)', count: trees.filter(t => t.dbhCm >= 75).length, color: '#064e3b' }
    ];

    // Zone Breakdown derived dynamically from all surveyed trees
    const zoneMap: Record<string, { count: number }> = {};
    trees.forEach(t => {
      const z = t.campusZone || 'Campus General';
      if (!zoneMap[z]) zoneMap[z] = { count: 0 };
      zoneMap[z].count++;
    });

    const zoneBreakdown = Object.entries(zoneMap).map(([zoneName, data]) => {
      const matchingZone = CAMPUS_ZONES.find(z => z.name === zoneName);
      const areaHectares = matchingZone?.areaHectares || 2.5;
      return {
        zone: zoneName,
        category: matchingZone?.category || 'Campus Sector',
        count: data.count,
        areaHectares,
        density: Math.round(data.count / areaHectares),
        percent: Number(((data.count / (totalTrees || 1)) * 100).toFixed(1))
      };
    }).sort((a, b) => b.count - a.count);

    // Native vs Exotic
    const nativeCount = trees.filter(t => t.nativeStatus === 'Native').length;
    const exoticCount = trees.filter(t => t.nativeStatus !== 'Native').length;

    return {
      totalTrees,
      totalCanopyAreaSqM: Math.round(totalCanopyAreaSqM),
      canopyCoverHectares: (totalCanopyAreaSqM / 10000).toFixed(2),
      avgDBH: avgDBH.toFixed(1),
      avgHeight: avgHeight.toFixed(1),
      healthyCount,
      healthyPercent,
      diversity,
      healthCounts,
      sortedSpecies,
      dbhClasses,
      zoneBreakdown,
      nativeCount,
      exoticCount,
      nativePercent: Math.round((nativeCount / totalTrees) * 100) || 0
    };
  }, [trees]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                TI Cycles of India • Ambattur Campus
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Tree Census GIS Analytics & Ecological Dashboard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Executive Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Analytics Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Top KPI Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                <span>Total Trees</span>
                <TreePine className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">{metrics.totalTrees}</div>
              <div className="text-[11px] text-emerald-400 mt-1">
                911 trees cataloged ({metrics.diversity.speciesCount} species)
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                <span>Species Richness</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {metrics.diversity.speciesCount} <span className="text-xs text-slate-400 font-normal">Species</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Across 18 botanical families</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                <span>Canopy Cover</span>
                <Leaf className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-2xl font-black text-teal-400 font-mono">
                {metrics.canopyCoverHectares} <span className="text-xs text-slate-400 font-normal">Ha</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {metrics.totalCanopyAreaSqM.toLocaleString()} m² shade
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
                <span>Vigorous Stand</span>
                <Sparkles className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-sky-400 font-mono">
                {metrics.healthyPercent}% <span className="text-xs text-slate-400 font-normal">Healthy</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{metrics.healthyCount} vigorous condition trees</div>
            </div>
          </div>

          {/* Biodiversity & Native Origin Ratio */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Shannon Diversity Index (H')
                </div>
                <div className="text-2xl font-mono font-bold text-emerald-400">
                  {metrics.diversity.shannon}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  High ecological resilience; values &gt;2.0 indicate healthy species richness and balanced distribution.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-800">
                Simpson Index (1-D): {metrics.diversity.simpson}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Native vs Exotic Flora
                </div>
                <div className="flex items-center gap-3 my-2">
                  <div className="text-xl font-bold text-emerald-400 font-mono">
                    {metrics.nativePercent}% <span className="text-xs text-slate-400 font-normal">Native</span>
                  </div>
                  <div className="text-slate-500">/</div>
                  <div className="text-base font-semibold text-amber-400 font-mono">
                    {100 - metrics.nativePercent}% <span className="text-xs text-slate-400 font-normal">Exotic</span>
                  </div>
                </div>
                {/* Visual Ratio Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex">
                  <div className="bg-emerald-500 h-full" style={{ width: `${metrics.nativePercent}%` }}></div>
                  <div className="bg-amber-500 h-full" style={{ width: `${100 - metrics.nativePercent}%` }}></div>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                {metrics.nativeCount} Native trees (Neem, Tamarind, Banyan, Jamun)
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Average Stand Metrics
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Mean DBH</span>
                    <span className="text-lg font-bold font-mono text-slate-100">{metrics.avgDBH} cm</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Mean Height</span>
                    <span className="text-lg font-bold font-mono text-slate-100">{metrics.avgHeight} m</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800 font-mono">
                Stand Area: 27.6 Hectares • 911 Surveyed Trees
              </div>
            </div>
          </div>

          {/* Dominant Species Breakdown */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Top Dominant Botanical Species Distribution
              </h3>
              <span className="text-xs text-slate-500">Sorted by population</span>
            </div>

            <div className="space-y-2.5">
              {metrics.sortedSpecies.slice(0, 10).map((item) => (
                <div key={item.botanical} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      <span className="font-semibold text-slate-200 truncate">
                        {item.commonName}
                      </span>
                      <span className="text-slate-400 italic font-serif text-[11px] truncate hidden sm:inline">
                        ({item.botanical} {item.tamilName && `- ${item.tamilName}`})
                      </span>
                    </div>
                    <div className="font-mono text-xs text-slate-300 shrink-0">
                      <strong>{item.count}</strong> trees ({item.percent}%)
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percent}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Condition & DBH Classes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Health Condition */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Health & Vigor Condition</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h3>

              <div className="space-y-2">
                {Object.entries(metrics.healthCounts).map(([health, count]) => {
                  const pct = Math.round((count / metrics.totalTrees) * 100) || 0;
                  const color =
                    health === 'Healthy'
                      ? '#10b981'
                      : health === 'Good'
                      ? '#3b82f6'
                      : health === 'Fair'
                      ? '#eab308'
                      : health === 'Stressed'
                      ? '#f97316'
                      : '#ef4444';
                  return (
                    <div key={health} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{health}</span>
                        <span className="font-mono text-slate-400">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DBH Girth Pyramid */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                DBH Girth Structure (Age Pyramid)
              </h3>

              <div className="space-y-2">
                {metrics.dbhClasses.map((cls) => {
                  const pct = Math.round((cls.count / metrics.totalTrees) * 100) || 0;
                  return (
                    <div key={cls.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{cls.label}</span>
                        <span className="font-mono text-slate-400">
                          {cls.count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, backgroundColor: cls.color }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Campus Zones Density Table */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Campus Sector Breakdown & Tree Density
            </h3>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="border-b border-slate-800 text-slate-500 font-mono text-[11px]">
                  <tr>
                    <th className="pb-2">Zone Name</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2 text-right">Area (Ha)</th>
                    <th className="pb-2 text-right">Trees</th>
                    <th className="pb-2 text-right">Density (Trees/Ha)</th>
                    <th className="pb-2 text-right">% of Stand</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {metrics.zoneBreakdown.map((z) => (
                    <tr key={z.zone} className="hover:bg-slate-900/50">
                      <td className="py-2 font-medium text-slate-200">{z.zone}</td>
                      <td className="py-2 text-slate-400">{z.category}</td>
                      <td className="py-2 text-right font-mono text-slate-300">{z.areaHectares}</td>
                      <td className="py-2 text-right font-mono text-emerald-400 font-bold">{z.count}</td>
                      <td className="py-2 text-right font-mono text-sky-400">{z.density}</td>
                      <td className="py-2 text-right font-mono text-emerald-400 font-semibold">{z.percent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Census Dataset: TI Cycles Ambattur GIS Initiative (2026)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
