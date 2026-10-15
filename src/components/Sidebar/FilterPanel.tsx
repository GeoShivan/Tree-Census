import React, { useState, useMemo } from 'react';
import { TreeRecord, TreeFilters, HealthStatus } from '../../types/tree';
import { SPECIES_CATALOG } from '../../data/speciesCatalog';
import { CAMPUS_ZONES } from '../../data/tiCyclesCampus';
import {
  Search,
  Filter,
  RotateCcw,
  TreePine,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MapPin,
  HeartPulse,
  Leaf,
  Layers,
  Check
} from 'lucide-react';

interface FilterPanelProps {
  filters: TreeFilters;
  onFilterChange: (filters: TreeFilters) => void;
  trees: TreeRecord[];
  allTrees: TreeRecord[];
  selectedTree: TreeRecord | null;
  onSelectTree: (tree: TreeRecord | null) => void;
  onOpenStats: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  trees,
  allTrees,
  selectedTree,
  onSelectTree,
  onOpenStats
}) => {
  const [isSpeciesExpanded, setIsSpeciesExpanded] = useState(false);
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'filters' | 'trees'>('filters');

  // Compute unique families, species and zones dynamically from allTrees
  const allFamilies = useMemo(() => Array.from(new Set(allTrees.map(t => t.family))).sort(), [allTrees]);
  const allSpecies = useMemo(() => Array.from(new Set(allTrees.map(t => t.botanicalName))).sort(), [allTrees]);
  const allZones = useMemo(() => Array.from(new Set(allTrees.map(t => t.campusZone))).sort(), [allTrees]);

  const [isFamilyExpanded, setIsFamilyExpanded] = useState(false);
  const [speciesSearch, setSpeciesSearch] = useState('');

  // Preset triggers
  const handlePreset = (preset: 'all' | 'heritage' | 'critical' | 'native' | 'mature') => {
    switch (preset) {
      case 'all':
        onFilterChange({
          searchQuery: '',
          selectedSpecies: [],
          selectedFamilies: [],
          selectedZones: [],
          selectedHealth: [],
          nativeStatus: 'all',
          dbhRange: [0, 500],
          heightRange: [0, 100],
          canopyRange: [0, 50],
          highlightedTreeId: null
        });
        break;
      case 'heritage':
        onFilterChange({
          ...filters,
          dbhRange: [60, 500]
        });
        break;
      case 'mature':
        onFilterChange({
          ...filters,
          dbhRange: [45, 500]
        });
        break;
      case 'critical':
        onFilterChange({
          ...filters,
          selectedHealth: ['Stressed', 'Diseased', 'Critical']
        });
        break;
      case 'native':
        onFilterChange({
          ...filters,
          nativeStatus: 'Native'
        });
        break;
    }
  };

  const handleSpeciesToggle = (speciesName: string) => {
    const current = filters.selectedSpecies;
    const next = current.includes(speciesName)
      ? current.filter(s => s !== speciesName)
      : [...current, speciesName];
    onFilterChange({ ...filters, selectedSpecies: next });
  };

  const handleFamilyToggle = (family: string) => {
    const current = filters.selectedFamilies;
    const next = current.includes(family)
      ? current.filter(f => f !== family)
      : [...current, family];
    onFilterChange({ ...filters, selectedFamilies: next });
  };

  const handleZoneToggle = (zone: string) => {
    const current = filters.selectedZones;
    const next = current.includes(zone)
      ? current.filter(z => z !== zone)
      : [...current, zone];
    onFilterChange({ ...filters, selectedZones: next });
  };

  const handleHealthToggle = (health: HealthStatus) => {
    const current = filters.selectedHealth;
    const next = current.includes(health)
      ? current.filter(h => h !== health)
      : [...current, health];
    onFilterChange({ ...filters, selectedHealth: next });
  };

  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    filters.selectedSpecies.length +
    filters.selectedFamilies.length +
    filters.selectedZones.length +
    filters.selectedHealth.length +
    (filters.nativeStatus !== 'all' ? 1 : 0) +
    (filters.dbhRange[0] > 0 || filters.dbhRange[1] < 500 ? 1 : 0) +
    (filters.heightRange[0] > 0 || filters.heightRange[1] < 100 ? 1 : 0);

  return (
    <aside className="w-80 sm:w-96 h-full flex flex-col bg-slate-900 border-r border-slate-800 shrink-0 z-30 select-none shadow-2xl">
      {/* Census Active Status */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/90 rounded-lg p-2 border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Survey Active</span>
          </div>
          <div className="font-mono text-emerald-300 font-bold">
            {trees.length} <span className="text-slate-400 font-normal">/ {allTrees.length} trees</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-800 bg-slate-950/40 px-3 pt-2 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('filters')}
          className={`flex-1 py-2 rounded-t-lg transition flex items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'filters'
              ? 'text-emerald-400 border-emerald-500 bg-slate-800/60'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
        </button>
        <button
          onClick={() => setActiveTab('trees')}
          className={`flex-1 py-2 rounded-t-lg transition flex items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'trees'
              ? 'text-emerald-400 border-emerald-500 bg-slate-800/60'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <TreePine className="w-3.5 h-3.5" />
          <span>Tree Directory ({trees.length})</span>
        </button>
      </div>

      {/* Universal Search Input */}
      <div className="p-3 border-b border-slate-800/70 bg-slate-900/90">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search ID, Species, Tag, Tamil name..."
            className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs rounded-xl pl-9 pr-8 py-2.5 border border-slate-700/70 focus:outline-none focus:border-emerald-500 transition shadow-inner"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs px-1"
            >
              ×
            </button>
          )}
        </div>

        {/* Quick Filter Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar text-[11px]">
          <button
            onClick={() => handlePreset('all')}
            className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white whitespace-nowrap border border-slate-700"
          >
            All Trees
          </button>
          <button
            onClick={() => handlePreset('heritage')}
            className="px-2 py-1 rounded-md bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 whitespace-nowrap border border-amber-500/30 font-medium"
          >
            👑 Heritage (&gt;60cm)
          </button>
          <button
            onClick={() => handlePreset('native')}
            className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 whitespace-nowrap border border-emerald-500/30 font-medium"
          >
            🌿 Native
          </button>
          <button
            onClick={() => handlePreset('critical')}
            className="px-2 py-1 rounded-md bg-red-500/10 text-red-300 hover:bg-red-500/20 whitespace-nowrap border border-red-500/30 font-medium"
          >
            ⚠️ Stressed/Care
          </button>
          <button
            onClick={() => handlePreset('mature')}
            className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 whitespace-nowrap border border-blue-500/30 font-medium"
          >
            🌳 Mature (&gt;45cm)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'filters' ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Active Filters Clear Button */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl text-xs">
              <span className="text-emerald-300 font-medium">
                {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}
              </span>
              <button
                onClick={() => handlePreset('all')}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
          )}

          {/* Health Status Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                <span>Tree Health Condition</span>
              </div>
              <span className="text-[11px] text-slate-500">
                {filters.selectedHealth.length === 0 ? 'All' : `${filters.selectedHealth.length} selected`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {(['Healthy', 'Good', 'Fair', 'Stressed', 'Diseased'] as HealthStatus[]).map((health) => {
                const isSelected = filters.selectedHealth.includes(health);
                const count = allTrees.filter(t => t.health === health).length;
                return (
                  <button
                    key={health}
                    onClick={() => handleHealthToggle(health)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left transition ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-medium'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          health === 'Healthy'
                            ? 'bg-emerald-400'
                            : health === 'Good'
                            ? 'bg-blue-400'
                            : health === 'Fair'
                            ? 'bg-amber-400'
                            : health === 'Stressed'
                            ? 'bg-orange-400'
                            : 'bg-red-400'
                        }`}
                      ></span>
                      <span>{health}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botanical Species Filter */}
          <div className="space-y-2 border-t border-slate-800/70 pt-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Botanical Species ({allSpecies.length})</span>
              </div>
              <button
                onClick={() => setIsSpeciesExpanded(!isSpeciesExpanded)}
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5"
              >
                <span>{isSpeciesExpanded ? 'Collapse' : 'Show all'}</span>
                {isSpeciesExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {isSpeciesExpanded && (
              <input
                type="text"
                value={speciesSearch}
                onChange={(e) => setSpeciesSearch(e.target.value)}
                placeholder="Filter species list..."
                className="w-full bg-slate-950 text-slate-200 text-[11px] px-2.5 py-1 rounded-lg border border-slate-700/80 mb-1 focus:outline-none focus:border-emerald-500"
              />
            )}

            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {allSpecies
                .filter((b: string) => !speciesSearch || b.toLowerCase().includes(speciesSearch.toLowerCase()) || (allTrees.find(t => t.botanicalName === b)?.commonName.toLowerCase().includes(speciesSearch.toLowerCase())))
                .slice(0, isSpeciesExpanded ? undefined : 6)
                .map((botanical: string) => {
                  const isSelected = filters.selectedSpecies.includes(botanical);
                  const sample = allTrees.find(t => t.botanicalName === botanical);
                  const count = allTrees.filter(t => t.botanicalName === botanical).length;
                  return (
                    <button
                      key={botanical}
                      onClick={() => handleSpeciesToggle(botanical)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg border text-xs text-left transition ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-medium'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate mr-2">
                        <div className="truncate font-medium">{sample ? sample.commonName : botanical}</div>
                        <div className="text-[10px] text-slate-400 italic font-serif truncate">
                          {botanical} {sample?.tamilName && `(${sample.tamilName})`}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] font-mono text-slate-400">{count}</span>
                        {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Taxonomic Family Filter */}
          <div className="space-y-2 border-t border-slate-800/70 pt-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Taxonomic Family ({allFamilies.length})</span>
              </div>
              <button
                onClick={() => setIsFamilyExpanded(!isFamilyExpanded)}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-0.5"
              >
                <span>{isFamilyExpanded ? 'Collapse' : 'Show all'}</span>
                {isFamilyExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {allFamilies.slice(0, isFamilyExpanded ? undefined : 5).map((fam: string) => {
                const isSelected = filters.selectedFamilies.includes(fam);
                const count = allTrees.filter(t => t.family === fam).length;
                return (
                  <button
                    key={fam}
                    onClick={() => handleFamilyToggle(fam)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg border text-xs text-left transition ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/50 text-white font-medium'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate pr-2">{fam}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">{count}</span>
                      {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campus Zones */}
          <div className="space-y-2 border-t border-slate-800/70 pt-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Campus Zone</span>
              </div>
              <span className="text-[11px] text-slate-500">
                {filters.selectedZones.length === 0 ? 'All Zones' : `${filters.selectedZones.length} selected`}
              </span>
            </div>

            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {CAMPUS_ZONES.map((zone) => {
                const isSelected = filters.selectedZones.includes(zone.name);
                const count = allTrees.filter(t => t.campusZone === zone.name).length;
                return (
                  <button
                    key={zone.id}
                    onClick={() => handleZoneToggle(zone.name)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs text-left transition ${
                      isSelected
                        ? 'bg-sky-500/20 border-sky-500/50 text-white font-medium'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate pr-2">{zone.name.split(' & ')[0]}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{count} trees</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Metric Range Sliders (DBH & Height) */}
          <div className="space-y-3 border-t border-slate-800/70 pt-3">
            <div
              className="flex items-center justify-between text-xs font-semibold text-slate-300 cursor-pointer"
              onClick={() => setIsMetricsExpanded(!isMetricsExpanded)}
            >
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Dendrometric Dimensions</span>
              </div>
              {isMetricsExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
            </div>

            {isMetricsExpanded && (
              <div className="space-y-3 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
                {/* DBH Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span>Min DBH (Girth):</span>
                    <span className="font-mono text-emerald-400 font-bold">{filters.dbhRange[0]} cm</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={120}
                    step={5}
                    value={filters.dbhRange[0]}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        dbhRange: [Number(e.target.value), 500]
                      })
                    }
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0 cm</span>
                    <span>60 cm</span>
                    <span>120+ cm</span>
                  </div>
                </div>

                {/* Tree Height Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span>Min Height:</span>
                    <span className="font-mono text-emerald-400 font-bold">{filters.heightRange[0]} m</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={filters.heightRange[0]}
                    onChange={(e) =>
                      onFilterChange({
                        ...filters,
                        heightRange: [Number(e.target.value), 100]
                      })
                    }
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>0 m</span>
                    <span>12 m</span>
                    <span>25 m</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Native vs Exotic */}
          <div className="space-y-2 border-t border-slate-800/70 pt-3">
            <div className="text-xs font-semibold text-slate-300">Origin Classification</div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(['all', 'Native', 'Exotic'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onFilterChange({ ...filters, nativeStatus: status })}
                  className={`py-1.5 rounded-lg border text-center transition ${
                    filters.nativeStatus === status
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Tree Directory Tab */
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {trees.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No trees match your current filter criteria.
            </div>
          ) : (
            trees.map((tree) => {
              const isSelected = selectedTree?.id === tree.id;
              return (
                <div
                  key={tree.id}
                  onClick={() => onSelectTree(tree)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : 'bg-slate-950/50 border-slate-800/70 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-emerald-400">{tree.id}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        tree.health === 'Healthy'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : tree.health === 'Good'
                          ? 'bg-blue-500/20 text-blue-300'
                          : tree.health === 'Fair'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {tree.health}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-200">{tree.commonName}</div>
                  <div className="text-[11px] text-slate-400 italic truncate font-serif">
                    {tree.botanicalName} ({tree.tamilName})
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                    <span>DBH: <strong className="text-slate-200">{tree.dbhCm}cm</strong></span>
                    <span>Ht: <strong className="text-slate-200">{tree.heightM}m</strong></span>
                    <span>Crown: <strong className="text-emerald-400">{(tree.canopyRadiusM * 2).toFixed(1)}m</strong></span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/90 flex flex-col gap-2">
        <button
          onClick={onOpenStats}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/50"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Census Analytics & Dashboard</span>
        </button>
      </div>
    </aside>
  );
};
