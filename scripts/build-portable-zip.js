import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function buildPortableZip() {
  console.log('--- Building Portable Windows Package for TI Cycles Ambattur ---');
  const zip = new JSZip();
  const folder = zip.folder('TI_Cycles_Ambattur_Tree_Census_GIS');

  const distDir = path.resolve('dist');
  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory not found! Run npm run build first.');
  }

  // 1. Copy all built files from dist into zip root
  function addDirToZip(currentDir, currentFolder) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = currentFolder.folder(file);
        addDirToZip(fullPath, subFolder);
      } else {
        const content = fs.readFileSync(fullPath);
        currentFolder.file(file, content);
      }
    }
  }

  console.log('Adding compiled application bundle from dist/...');
  addDirToZip(distDir, folder);

  // 2. Add Windows Double-Click Launcher (Launch_TI_Cycles_GIS.bat)
  const batchScript = `@echo off
setlocal enabledelayedexpansion
title TI Cycles Ambattur - Tree Census GIS
color 0A

echo ===============================================================================
echo     TI CYCLES OF INDIA - AMBATTUR CAMPUS TREE CENSUS GIS
echo     Tube Investments of India Ltd. / Murugappa Group
echo     Census Survey 2026 (911 Surveyed Trees)
echo ===============================================================================
echo.
echo Launching Full Interactive Tree Census Webmap GIS with All Panels...
echo.

set PORT=8899
set DIR=%~dp0

:: Check if PowerShell is available to launch a zero-dependency instant local web server
where powershell >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting lightweight local server on http://localhost:!PORT!...
    start "" powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -Command "$p='!DIR!'; $s=[System.Net.HttpListener]::new(); $s.Prefixes.Add('http://localhost:!PORT!/'); try { $s.Start(); Start-Process 'http://localhost:!PORT!/index.html'; while ($s.IsListening) { $c=$s.GetContext(); $f=Join-Path $p ($c.Request.Url.LocalPath.TrimStart('/')); if (-not (Test-Path $f) -or (Get-Item $f).PSIsContainer) { $f=Join-Path $p 'index.html' }; if (Test-Path $f) { $b=[System.IO.File]::ReadAllBytes($f); $c.Response.ContentLength64=$b.Length; $e=[System.IO.Path]::GetExtension($f).ToLower(); switch($e){ '.html'{$t='text/html'} '.js'{$t='application/javascript'} '.css'{$t='text/css'} '.json'{$t='application/json'} '.geojson'{$t='application/geo+json'} default{$t='application/octet-stream'} }; $c.Response.ContentType=$t; $c.Response.OutputStream.Write($b,0,$b.Length) } else { $c.Response.StatusCode=404 }; $c.Response.Close() } } catch {}"
    timeout /t 2 >nul
    echo Application launched in browser.
    exit /b 0
)

:: Fallback if PowerShell is not present: open directly in Edge or Chrome with local file access
where msedge >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Opening in Microsoft Edge App Mode...
    start "" msedge --allow-file-access-from-files --app="file:///%DIR:\=/%index.html"
    exit /b 0
)

where chrome >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Opening in Google Chrome App Mode...
    start "" chrome --allow-file-access-from-files --app="file:///%DIR:\=/%index.html"
    exit /b 0
)

start "" "%DIR%index.html"
exit /b 0
`;

  const powershellScript = `# TI Cycles Ambattur Tree Census GIS Launcher
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  TI CYCLES AMBATTUR - TREE CENSUS GIS LAUNCHER" -ForegroundColor Green
Write-Host "  Murugappa Group / Environmental & GIS Division" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green

$port = 8899
$root = $PSScriptRoot

Write-Host "Starting lightweight local web server on port $port..." -ForegroundColor Yellow

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Start-Process "http://localhost:$port/index.html"
Write-Host "GIS Application opened in browser: http://localhost:$port/index.html" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop server..." -ForegroundColor Gray

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $urlPath = $context.Request.Url.LocalPath.TrimStart('/')
    $filePath = Join-Path $root $urlPath
    if (-not (Test-Path $filePath) -or (Get-Item $filePath).PSIsContainer) {
        $filePath = Join-Path $root "index.html"
    }

    if (Test-Path $filePath) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $context.Response.ContentLength64 = $bytes.Length
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        switch ($ext) {
            ".html" { $context.Response.ContentType = "text/html" }
            ".js"   { $context.Response.ContentType = "application/javascript" }
            ".css"  { $context.Response.ContentType = "text/css" }
            ".json" { $context.Response.ContentType = "application/json" }
            ".geojson" { $context.Response.ContentType = "application/geo+json" }
            default { $context.Response.ContentType = "application/octet-stream" }
        }
        $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $context.Response.StatusCode = 404
    }
    $context.Response.Close()
}
`;

  const readmeContent = `===============================================================================
TI CYCLES OF INDIA - AMBATTUR CAMPUS TREE CENSUS GIS
Portable Windows Package with Full Interactive GIS & All Panels
Client Delivery Version 2.0 (Census Survey 2026)
===============================================================================

Tube Investments of India Limited (Murugappa Group)
Location: CTH Road / MTH Road, Ambattur Industrial Estate, Chennai, Tamil Nadu
Survey Dataset: 911 Surveyed Trees across ~14.8 Hectares Compound

HOW TO RUN:
-----------
1. Extract all contents of this ZIP archive to any folder on your Windows computer
   (e.g., C:\\TI_Cycles_GIS or on a USB Drive).
2. Double-click "Launch_TI_Cycles_GIS.bat" to start the full application.
   (An instant lightweight local web server starts automatically and opens your browser).
3. No installation, administrator rights, Python, or Node.js required!

ALL APPLICATION PANELS INCLUDED:
--------------------------------
1. Interactive OpenLayers Webmap:
   - High-Resolution Satellite Basemap (Esri World Imagery)
   - Hybrid Satellite + Streets Overlay
   - OpenStreetMap & Dark Matter Basemaps
   - TIDC Campus Boundary & Sub-Zones
   - Dynamic Tree Points & Physical Crown Canopy Shade Buffers
   - Map Color-Coding by Health, Species, Family, DBH class, or Carbon Sequestration
   - Interactive Measurement Tools (Distance in meters / Area in sq. meters)
   - Real-time GPS Coordinate Display (WGS84 Lat/Lng + UTM Zone 44N projection)

2. Complete Sidebar Filter Panel:
   - Universal search box (Tree ID, Common name, Botanical name, Tamil name, Tag)
   - Quick filter chips (All Trees, Heritage >60cm DBH, Native, Stressed, High CO2)
   - Health condition filter chips (Healthy, Good, Fair, Stressed, Diseased, Critical)
   - Botanical species filter (all 56 species with specimen counts)
   - Taxonomic family filter (all 26 families with specimen counts)
   - Campus sector filter
   - Dendrometric sliders (DBH girth range, Tree height range, Min CO2 sequestration)
   - Native vs Exotic classification
   - Full Tree Directory list with live filtering

3. Attribute Table Drawer:
   - Full interactive table of all 911 surveyed trees
   - Sorting by Tree ID, Common Name, Botanical Name, Family, DBH, Height, Canopy, Health, CO2, Zone
   - Table-specific search and pagination (15, 25, 50, 100 rows)
   - One-click row zoom and tree selection
   - Direct CSV and GeoJSON export buttons

4. Analytics & Statistics Dashboard:
   - Overview KPIs: Total Trees (911), Annual Carbon Sink (tonnes CO2/yr), Total Biomass, Canopy Coverage, Asset Valuation (INR Lakhs)
   - Biodiversity Indices: Shannon-Wiener Diversity Index (H') and Simpson Index
   - Top 10 Dominant Botanical Species distribution horizontal bar charts
   - Health condition distribution breakdown
   - DBH girth size class structure
   - Campus sector tree density breakdown

5. Tree Detail Dossier & Metal Tag Generator:
   - Detailed inspection card with measurements, health rating, and arborist actions
   - GPS coordinates with Google Maps link
   - Field QR tree tag generator ready for on-site printing

6. Executive Printable Report:
   - Print-ready ISO 14001:2015 environmental audit compliance summary report

DATA FILES INCLUDED:
--------------------
- SourceFile/TreesPoint.geojson        : Original raw survey data in UTM 44N (EPSG:32644)
- SourceFile/TIDC_Boundary.geojson     : Original TIDC campus perimeter boundary
- TI_Cycles_Ambattur_Trees.geojson     : Web-ready GeoJSON in WGS84 (EPSG:4326)
- TI_Cycles_Campus_Boundary.geojson    : Campus Boundary GeoJSON
- TI_Cycles_Ambattur_Tree_Census.csv   : Complete tabular spreadsheet (Excel compatible)

COMPATIBILITY:
--------------
- Operating Systems: Windows 10, Windows 11, Windows Server (64-bit / 32-bit)
- Browsers: Microsoft Edge, Google Chrome, Mozilla Firefox, Brave
- GIS Software: QGIS, ArcGIS Pro, Google Earth Pro, AutoCAD Civil 3D

Contact: Environmental Sustainability & Campus Green Infrastructure Team
TI Cycles of India, Ambattur.
`;

  folder.file('Launch_TI_Cycles_GIS.bat', batchScript);
  folder.file('Run_TI_Cycles_GIS.ps1', powershellScript);
  folder.file('README_PORTABLE_WINDOWS_GUIDE.txt', readmeContent);

  // Copy raw SourceFile into the package
  const sourceFolder = folder.folder('SourceFile');
  if (fs.existsSync('SourceFile/TreesPoint.geojson')) {
    sourceFolder.file('TreesPoint.geojson', fs.readFileSync('SourceFile/TreesPoint.geojson'));
  }
  if (fs.existsSync('SourceFile/TIDC_Boundary.geojson')) {
    sourceFolder.file('TIDC_Boundary.geojson', fs.readFileSync('SourceFile/TIDC_Boundary.geojson'));
  }

  // Also include CSV and GeoJSON exports in the package
  if (fs.existsSync('public/SourceFile/TreesPoint.geojson')) {
    folder.file('TI_Cycles_Ambattur_Trees_Source.geojson', fs.readFileSync('public/SourceFile/TreesPoint.geojson'));
  }

  console.log('Generating ZIP archive with DEFLATE level 9...');
  const zipBlob = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const outPath = path.resolve('public/TI_Cycles_Ambattur_Tree_Census_GIS_Windows_Portable.zip');
  fs.writeFileSync(outPath, zipBlob);
  const sizeMB = (zipBlob.length / (1024 * 1024)).toFixed(2);
  console.log(`Portable package successfully created: ${outPath} (${sizeMB} MB)`);
}

buildPortableZip().catch(err => {
  console.error('Error generating portable package:', err);
  process.exit(1);
});
