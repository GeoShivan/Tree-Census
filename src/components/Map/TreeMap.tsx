import React, { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { fromLonLat, toLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';
import { ScaleLine } from 'ol/control';

import { TreeRecord } from '../../types/tree';
import { CAMPUS_CENTER, DEFAULT_ZOOM, getCampusBoundaryGeoJSON } from '../../data/tiCyclesCampus';
import { toApproxUTM44N } from '../../utils/geoUtils';
import {
  Compass,
  MapPin
} from 'lucide-react';

interface TreeMapProps {
  trees: TreeRecord[];
  allTrees: TreeRecord[];
  selectedTree: TreeRecord | null;
  onSelectTree: (tree: TreeRecord | null) => void;
}

export const TreeMap: React.FC<TreeMapProps> = ({
  trees,
  allTrees,
  selectedTree,
  onSelectTree
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const treeSourceRef = useRef<VectorSource | null>(null);
  const boundarySourceRef = useRef<VectorSource | null>(null);

  const hoverTooltipRef = useRef<HTMLDivElement>(null);
  const hoverOverlayRef = useRef<Overlay | null>(null);

  // Mouse coordinate tracker
  const [mouseCoords, setMouseCoords] = useState<{
    lng: number;
    lat: number;
    utm: { easting: number; northing: number; zone: string };
  }>({
    lng: CAMPUS_CENTER[0],
    lat: CAMPUS_CENTER[1],
    utm: toApproxUTM44N(CAMPUS_CENTER[0], CAMPUS_CENTER[1])
  });

  const [hoveredTree, setHoveredTree] = useState<TreeRecord | null>(null);

  // High-resolution Satellite Tile Layer (Satellite Only)
  const satelliteLayerRef = useRef<TileLayer<XYZ> | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // High-resolution Esri World Imagery Satellite Basemap
    satelliteLayerRef.current = new TileLayer({
      source: new XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        maxZoom: 21,
        crossOrigin: 'anonymous'
      }),
      visible: true
    });

    // Campus Boundary & Zones layer
    const boundaryGeoJSON = getCampusBoundaryGeoJSON();
    boundarySourceRef.current = new VectorSource({
      features: new GeoJSON().readFeatures(boundaryGeoJSON, {
        featureProjection: 'EPSG:3857'
      })
    });

    const boundaryLayer = new VectorLayer({
      source: boundarySourceRef.current,
      style: new Style({
        stroke: new Stroke({
          color: '#10b981',
          width: 3.5,
          lineDash: [8, 6]
        }),
        fill: new Fill({
          color: 'rgba(16, 185, 129, 0.07)'
        })
      })
    });

    // Trees Vector Source & Layer (Uniform marker size: 6.5px, no buffer circles)
    treeSourceRef.current = new VectorSource();
    const treeLayer = new VectorLayer({
      source: treeSourceRef.current,
      style: (feature) => {
        const tree = feature.get('treeData') as TreeRecord;
        if (!tree) return new Style({});

        const isSelected = selectedTree?.id === tree.id;
        const isHovered = hoveredTree?.id === tree.id;

        // Uniform marker symbology size for all trees
        const radius = 6.5;

        // Color coding by tree health condition
        let fillColor = '#10b981';
        switch (tree.health) {
          case 'Healthy': fillColor = '#10b981'; break;
          case 'Good': fillColor = '#3b82f6'; break;
          case 'Fair': fillColor = '#eab308'; break;
          case 'Stressed': fillColor = '#f97316'; break;
          case 'Diseased': fillColor = '#ef4444'; break;
          case 'Pruned': fillColor = '#a855f7'; break;
          case 'Critical': fillColor = '#dc2626'; break;
          default: fillColor = '#10b981';
        }

        const styles: Style[] = [];

        // Pulse ring if selected
        if (isSelected) {
          styles.push(
            new Style({
              image: new CircleStyle({
                radius: radius + 6,
                stroke: new Stroke({
                  color: '#34d399',
                  width: 2.5
                }),
                fill: new Fill({
                  color: 'rgba(52, 211, 153, 0.25)'
                })
              })
            })
          );
        }

        styles.push(
          new Style({
            image: new CircleStyle({
              radius: isHovered ? radius + 2 : radius,
              fill: new Fill({ color: fillColor }),
              stroke: new Stroke({
                color: isSelected ? '#ffffff' : '#0f172a',
                width: isSelected ? 2.5 : 1.5
              })
            })
          })
        );

        return styles;
      }
    });

    // Create Map Instance (Satellite Basemap Only)
    const map = new Map({
      target: mapContainerRef.current,
      layers: [
        satelliteLayerRef.current!,
        boundaryLayer,
        treeLayer
      ],
      view: new View({
        center: fromLonLat(CAMPUS_CENTER),
        zoom: DEFAULT_ZOOM,
        minZoom: 14,
        maxZoom: 21
      }),
      controls: [
        new ScaleLine({
          units: 'metric',
          bar: false,
          steps: 4,
          text: true,
          minWidth: 100
        })
      ]
    });

    mapInstanceRef.current = map;

    // Hover Tooltip Overlay
    if (hoverTooltipRef.current) {
      hoverOverlayRef.current = new Overlay({
        element: hoverTooltipRef.current,
        offset: [15, 0],
        positioning: 'center-left'
      });
      map.addOverlay(hoverOverlayRef.current);
    }

    // Pointer move listener
    map.on('pointermove', (evt) => {
      if (evt.dragging) return;

      const lonLat = toLonLat(evt.coordinate);
      setMouseCoords({
        lng: Number(lonLat[0].toFixed(5)),
        lat: Number(lonLat[1].toFixed(5)),
        utm: toApproxUTM44N(lonLat[0], lonLat[1])
      });

      // Feature detection
      const pixel = map.getEventPixel(evt.originalEvent);
      let foundTree: TreeRecord | null = null;

      map.forEachFeatureAtPixel(pixel, (feature) => {
        const data = feature.get('treeData') as TreeRecord;
        if (data && !foundTree) {
          foundTree = data;
        }
      });

      const targetEl = map.getTargetElement();
      if (foundTree) {
        setHoveredTree(foundTree);
        hoverOverlayRef.current?.setPosition(evt.coordinate);
        if (targetEl) targetEl.style.cursor = 'pointer';
      } else {
        setHoveredTree(null);
        hoverOverlayRef.current?.setPosition(undefined);
        if (targetEl) targetEl.style.cursor = '';
      }
    });

    // Click handler for tree selection
    map.on('click', (evt) => {
      const pixel = map.getEventPixel(evt.originalEvent);
      let clickedTree: TreeRecord | null = null;

      map.forEachFeatureAtPixel(pixel, (feature) => {
        const data = feature.get('treeData') as TreeRecord;
        if (data && !clickedTree) {
          clickedTree = data;
        }
      });

      onSelectTree(clickedTree);
    });

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  // Update Tree Features (Uniform Point Markers only, no buffer circles)
  useEffect(() => {
    if (!treeSourceRef.current) return;

    treeSourceRef.current.clear();
    const treeFeatures: Feature<Point>[] = [];

    trees.forEach((tree) => {
      const centerCoord = fromLonLat(tree.coordinates);
      const pointFeature = new Feature({
        geometry: new Point(centerCoord),
        treeData: tree
      });
      pointFeature.setId(tree.id);
      treeFeatures.push(pointFeature);
    });

    treeSourceRef.current.addFeatures(treeFeatures);
  }, [trees]);

  // Redraw when selected tree changes
  useEffect(() => {
    treeSourceRef.current?.changed();
  }, [selectedTree]);

  // Fly to selected tree
  useEffect(() => {
    if (!selectedTree || !mapInstanceRef.current) return;

    const coords = fromLonLat(selectedTree.coordinates);
    mapInstanceRef.current.getView().animate({
      center: coords,
      zoom: Math.max(18.5, mapInstanceRef.current.getView().getZoom() || 17),
      duration: 700
    });
  }, [selectedTree]);

  // Reset to full campus extent
  const handleResetCampusView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.getView().animate({
      center: fromLonLat(CAMPUS_CENTER),
      zoom: DEFAULT_ZOOM,
      duration: 600
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-950">
      {/* Map Target Canvas */}
      <div ref={mapContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Map Toolbar */}
      <div className="absolute top-4 left-16 z-20 flex items-center bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/70 shadow-2xl">
        <button
          onClick={handleResetCampusView}
          title="Reset to TI Cycles Ambattur Campus Extent"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Campus Extent</span>
        </button>
      </div>

      {/* Coordinate & GIS Status Bar (Bottom-Left) */}
      <div className="absolute bottom-4 left-44 z-10 hidden sm:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-[11px] text-slate-300 font-mono shadow-lg">
        <div className="flex items-center gap-1 text-emerald-400">
          <MapPin className="w-3 h-3" />
          <span>WGS84: {mouseCoords.lat.toFixed(5)}°N, {mouseCoords.lng.toFixed(5)}°E</span>
        </div>
        <div className="text-slate-500">|</div>
        <div className="text-slate-400">
          UTM 44N: E {mouseCoords.utm.easting}m, N {mouseCoords.utm.northing}m
        </div>
      </div>

      {/* Hover Tooltip Overlay Markup */}
      <div
        ref={hoverTooltipRef}
        className={`pointer-events-none transition-opacity duration-150 ${
          hoveredTree ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {hoveredTree && (
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-2xl min-w-[210px] max-w-xs text-xs text-white">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
              <div className="font-bold text-emerald-400 text-sm">{hoveredTree.id}</div>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  hoveredTree.health === 'Healthy'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : hoveredTree.health === 'Good'
                    ? 'bg-blue-500/20 text-blue-300'
                    : hoveredTree.health === 'Fair'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-red-500/20 text-red-300'
                }`}
              >
                {hoveredTree.health}
              </span>
            </div>
            <div className="font-semibold text-slate-100">{hoveredTree.commonName}</div>
            <div className="text-[11px] text-slate-400 italic font-serif">
              {hoveredTree.botanicalName} ({hoveredTree.tamilName})
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[11px] text-slate-300">
              <div>DBH: <strong className="text-white font-mono">{hoveredTree.dbhCm} cm</strong></div>
              <div>Height: <strong className="text-white font-mono">{hoveredTree.heightM} m</strong></div>
              <div>Canopy: <strong className="text-white font-mono">{(hoveredTree.canopyRadiusM * 2).toFixed(1)} m</strong></div>
              <div>Origin: <strong className="text-emerald-400 font-medium">{hoveredTree.nativeStatus}</strong></div>
            </div>
            <div className="text-[10px] text-slate-400 mt-2 pt-1 border-t border-slate-800 truncate">
              📍 {hoveredTree.campusZone}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
