import React, { useState, useMemo, useCallback } from 'react';
import { TreeRecord, TreeFilters } from './types/tree';
import { INITIAL_TREES } from './data/tiCyclesCampus';
import { TreeMap } from './components/Map/TreeMap';
import { FilterPanel } from './components/Sidebar/FilterPanel';
import { TreeDetailModal } from './components/Inspector/TreeDetailModal';
import { StatisticsModal } from './components/Dashboard/StatisticsModal';
import { PrintReportModal } from './components/Report/PrintReportModal';
import {
  TreePine,
  BarChart3,
  Printer,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  const [allTrees, setAllTrees] = useState<TreeRecord[]>(INITIAL_TREES);
  const [selectedTree, setSelectedTree] = useState<TreeRecord | null>(null);

  // Modals state
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<TreeFilters>({
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

  // Filter application
  const filteredTrees = useMemo(() => {
    return allTrees.filter((tree) => {
      // Search query (ID, common name, botanical name, tamil name, tag number, zone)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const match =
          tree.id.toLowerCase().includes(q) ||
          tree.commonName.toLowerCase().includes(q) ||
          tree.botanicalName.toLowerCase().includes(q) ||
          tree.tamilName.includes(q) ||
          tree.family.toLowerCase().includes(q) ||
          tree.tagNumber.toLowerCase().includes(q) ||
          tree.campusZone.toLowerCase().includes(q);

        if (!match) return false;
      }

      // Species filter
      if (filters.selectedSpecies.length > 0) {
        if (!filters.selectedSpecies.includes(tree.botanicalName)) return false;
      }

      // Family filter
      if (filters.selectedFamilies.length > 0) {
        if (!filters.selectedFamilies.includes(tree.family)) return false;
      }

      // Zone filter
      if (filters.selectedZones.length > 0) {
        if (!filters.selectedZones.includes(tree.campusZone)) return false;
      }

      // Health filter
      if (filters.selectedHealth.length > 0) {
        if (!filters.selectedHealth.includes(tree.health)) return false;
      }

      // Native status
      if (filters.nativeStatus !== 'all') {
        if (tree.nativeStatus !== filters.nativeStatus) return false;
      }

      // DBH range
      if (tree.dbhCm < filters.dbhRange[0] || tree.dbhCm > filters.dbhRange[1]) {
        return false;
      }

      // Height range
      if (tree.heightM < filters.heightRange[0] || tree.heightM > filters.heightRange[1]) {
        return false;
      }

      return true;
    });
  }, [allTrees, filters]);

  // Navigate between trees in inspector modal
  const handleNavigateTree = useCallback(
    (direction: 'prev' | 'next') => {
      if (!selectedTree || filteredTrees.length === 0) return;
      const currentIndex = filteredTrees.findIndex((t) => t.id === selectedTree.id);
      if (currentIndex === -1) return;

      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % filteredTrees.length
          : (currentIndex - 1 + filteredTrees.length) % filteredTrees.length;

      setSelectedTree(filteredTrees[newIndex]);
    },
    [selectedTree, filteredTrees]
  );

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      {/* Top Application Header */}
      <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-3 sm:px-5 shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {isSidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Tree Census GIS Dashboard
              </div>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setIsStatsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Analytics</span>
          </button>

          <button
            onClick={() => setIsReportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Report</span>
          </button>
        </div>
      </header>

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block h-full">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            trees={filteredTrees}
            allTrees={allTrees}
            selectedTree={selectedTree}
            onSelectTree={(tree) => setSelectedTree(tree)}
            onOpenStats={() => setIsStatsOpen(true)}
          />
        </div>

        {/* Mobile Slide-out Drawer */}
        {isSidebarOpenMobile && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex">
            <div className="w-80 h-full bg-slate-900">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                trees={filteredTrees}
                allTrees={allTrees}
                selectedTree={selectedTree}
                onSelectTree={(tree) => {
                  setSelectedTree(tree);
                  setIsSidebarOpenMobile(false);
                }}
                onOpenStats={() => {
                  setIsStatsOpen(true);
                  setIsSidebarOpenMobile(false);
                }}
              />
            </div>
            <div className="flex-1" onClick={() => setIsSidebarOpenMobile(false)} />
          </div>
        )}

        {/* OpenLayers Map Canvas */}
        <main className="flex-1 h-full relative">
          <TreeMap
            trees={filteredTrees}
            allTrees={allTrees}
            selectedTree={selectedTree}
            onSelectTree={(tree) => setSelectedTree(tree)}
          />
        </main>
      </div>

      {/* Detailed Tree Inspector Modal */}
      <TreeDetailModal
        tree={selectedTree}
        onClose={() => setSelectedTree(null)}
        onNavigateTree={handleNavigateTree}
      />

      {/* Statistics and Analytics Dashboard Modal */}
      <StatisticsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        trees={filteredTrees}
        allTrees={allTrees}
        onOpenReport={() => {
          setIsStatsOpen(false);
          setIsReportOpen(true);
        }}
      />

      {/* Executive Printable Census Report */}
      <PrintReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        trees={filteredTrees}
      />
    </div>
  );
}
