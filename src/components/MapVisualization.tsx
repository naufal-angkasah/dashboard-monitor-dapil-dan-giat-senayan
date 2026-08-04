import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Layers, 
  Eye, 
  Users, 
  Info, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  Clock,
  CalendarClock,
  HelpCircle,
  Map as MapIcon
} from 'lucide-react';
import { ProgramItem, Role } from '../types';
import { INITIAL_KABUPATEN_STATS, DAPIL_JATIM_7_POLYGONS } from '../data/mockData';

interface MapVisualizationProps {
  programs: ProgramItem[];
  role: Role;
  onSelectProgram?: (program: ProgramItem) => void;
}


// Helper to calculate status color
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Selesai':
      return {
        bg: '#10B981', // Emerald Green
        border: '#FFFFFF',
        label: 'Selesai',
        badgeClass: 'bg-emerald-500 text-white border-emerald-600',
        icon: CheckCircle2,
      };
    case 'Berjalan':
      return {
        bg: '#F59E0B', // Amber
        border: '#FFFFFF',
        label: 'Berjalan',
        badgeClass: 'bg-amber-500 text-white border-amber-600',
        icon: Clock,
      };
    case 'Perencanaan':
      return {
        bg: '#3B82F6', // Electric Blue
        border: '#FFFFFF',
        label: 'Perencanaan',
        badgeClass: 'bg-blue-500 text-white border-blue-600',
        icon: CalendarClock,
      };
    default:
      return {
        bg: '#94A3B8', // Slate Gray
        border: '#FFFFFF',
        label: 'Belum Ada',
        badgeClass: 'bg-slate-400 text-white border-slate-500',
        icon: HelpCircle,
      };
  }
};

// Custom Leaflet DivIcon for STELLAR Map Pins
const createNeoIcon = (status: string, count: number) => {
  const colorInfo = getStatusColor(status);
  return L.divIcon({
    className: 'custom-stellar-pin',
    html: `
      <div style="
        background-color: ${colorInfo.bg};
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        border-radius: 9999px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 11px;
        color: #FFFFFF;
        cursor: pointer;
        transition: transform 0.15s ease;
      " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
        ${count > 1 ? count : '•'}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
};

// Component to re-center map if programs change
const MapRecenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Component to handle map size invalidation on resize / fullscreen toggle
const MapInvalidator: React.FC<{ isFullscreen: boolean }> = ({ isFullscreen }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map, isFullscreen]);
  return null;
};

export const MapVisualization: React.FC<MapVisualizationProps> = ({
  programs,
  role,
  onSelectProgram,
}) => {
  const [showGradationLayer, setShowGradationLayer] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Center around Dapil Jatim VII (Pacitan, Ponorogo, Trenggalek, Magetan, Ngawi)
  const defaultCenter: [number, number] = [-7.87, 111.46];
  const defaultZoom = 9.5;

  // Compute stats per Kabupaten from programs
  const kabupatenMapData = useMemo(() => {
    return INITIAL_KABUPATEN_STATS.map((kab) => {
      const kabPrograms = programs.filter((p) => p.kabupaten === kab.nama);
      const totalPenerima = kabPrograms.reduce((sum, p) => sum + p.jumlahPenerima, 0);
      const totalProgram = kabPrograms.length;
      const ratioPercent = kab.populasi > 0 ? (totalPenerima / kab.populasi) * 100 : 0;

      return {
        ...kab,
        totalPenerima,
        totalProgram,
        ratioPercent: Number(ratioPercent.toFixed(2)),
      };
    });
  }, [programs]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm mb-6 transition-all relative ${isFullscreen ? 'fixed inset-4 z-[100] overflow-auto bg-white' : 'z-0'}`}
      style={{ isolation: 'isolate' }}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-sky-600 text-white p-2 rounded-lg shadow-sm">
            <MapPin className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
              PERSEBARAN LOKASI PROGRAM DAPIL
              <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                {programs.length} Titik
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Peta interaktif titik koordinat program & graduasi populasi cakupan penerima
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
          {/* Toggle Gradation Layer */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGradationLayer(!showGradationLayer)}
            className={`border px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors ${
              showGradationLayer ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Layer Gradasi Pop/Penerima</span>
          </motion.button>

          {/* Fullscreen Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 p-1.5 text-xs font-bold rounded-lg cursor-pointer transition-colors"
            title="Toggle Layar Penuh"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
        <span className="font-heading uppercase text-[11px] font-bold text-slate-800 mr-1">Status Pin:</span>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-900 px-2.5 py-0.5 rounded border border-emerald-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Hijau = Selesai</span>
        </div>
        {role === 'Admin' && (
          <>
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded border border-amber-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Kuning = Berjalan</span>
            </div>
            <div className="flex items-center gap-1.5 bg-sky-50 text-sky-900 px-2.5 py-0.5 rounded border border-sky-200">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span>Biru = Perencanaan</span>
            </div>
          </>
        )}
        <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
          <span>Abu = Belum Ada</span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className={`relative w-full border border-slate-300 rounded-lg overflow-hidden shadow-sm ${isFullscreen ? 'h-[75vh]' : 'h-[450px]'}`}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', background: '#e5e7eb' }}
        >
          <MapRecenter center={defaultCenter} zoom={defaultZoom} />
          <MapInvalidator isFullscreen={isFullscreen} />

          {/* Clean CartoDB Voyager map tiles */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Choropleth Polygons for Region Map Shading with Dashed Borders */}
          {showGradationLayer &&
            DAPIL_JATIM_7_POLYGONS.map((poly) => {
              const stats = kabupatenMapData.find((k) => k.nama === poly.nama);
              const programCount = stats?.totalProgram || 0;
              const opacity = Math.min(0.2 + (programCount / 25) * 0.4, 0.65);

              return (
                <Polygon
                  key={`poly-${poly.nama}`}
                  positions={poly.coordinates}
                  pathOptions={{
                    color: '#EF4444', // Red dashed region outline matching image.png
                    dashArray: '5, 5',
                    weight: 2.5,
                    fillColor: poly.fillColor,
                    fillOpacity: opacity,
                  }}
                >
                  <Popup>
                    <div className="p-2 text-slate-900 max-w-xs font-sans">
                      <div className="bg-slate-900 text-white p-2 rounded-lg font-bold text-xs uppercase mb-2 flex items-center gap-1.5 shadow-xs">
                        <MapIcon className="w-4 h-4 text-cyan-400" />
                        <span>Kawasan {poly.nama}</span>
                      </div>
                      <div className="text-xs space-y-1.5 font-medium text-slate-700">
                        <p>📂 <strong>Total Program:</strong> <span className="font-bold text-blue-700">{programCount} Program</span></p>
                        <p>👥 <strong>Penerima:</strong> {(stats?.totalPenerima || 0).toLocaleString('id-ID')} Jiwa</p>
                        <p>🏙️ <strong>Populasi Wilayah:</strong> {(stats?.populasi || 0).toLocaleString('id-ID')} Jiwa</p>
                        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-1.5 rounded-md text-[11px] font-bold text-center mt-2">
                          Penetrasi Cakupan: <strong>{stats?.ratioPercent || 0}%</strong>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Polygon>
              );
            })}

          {/* Gradation Coverage Circles per Kabupaten */}
          {showGradationLayer &&
            kabupatenMapData.map((kab) => {
              const radius = Math.min(Math.max(kab.ratioPercent * 12000, 12000), 32000);
              return (
                <CircleMarker
                  key={`grad-${kab.nama}`}
                  center={[kab.lat, kab.lng]}
                  radius={radius / 800}
                  pathOptions={{
                    color: '#1E293B',
                    weight: 2,
                    fillColor: kab.ratioPercent > 2.5 ? '#10B981' : kab.ratioPercent > 1.5 ? '#F59E0B' : '#6366F1',
                    fillOpacity: 0.4,
                  }}
                />
              );
            })}


          {/* Individual Program Markers */}
          {programs.map((program) => {
            const colorInfo = getStatusColor(program.status);
            return (
              <Marker
                key={program.id}
                position={[program.lat, program.lng]}
                icon={createNeoIcon(program.status, 1)}
              >
                <Popup>
                  <div className="p-3 text-black max-w-sm font-sans">
                    {/* Header Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-200">
                      <span className="bg-blue-50 text-blue-700 font-extrabold text-[10px] px-2 py-0.5 border border-blue-200 rounded-md">
                        {program.id}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${colorInfo.badgeClass}`}>
                        {program.status}
                      </span>
                    </div>

                    {/* Program Title */}
                    <h4 className="font-heading font-extrabold text-sm text-slate-900 leading-snug mb-2">
                      {program.namaProgram}
                    </h4>

                    {/* Meta Details */}
                    <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl text-xs space-y-1.5 font-medium mb-2 text-slate-700">
                      <p>
                        📍 <strong>Wilayah:</strong> {program.desa}, Kec. {program.kecamatan}, {program.kabupaten}
                      </p>
                      <p>
                        👥 <strong>Penerima:</strong> {program.jumlahPenerima.toLocaleString('id-ID')} Orang ({program.jenisProgram})
                      </p>
                      <p>
                        🏛️ <strong>Komisi:</strong> {program.komisi}
                      </p>
                      <p>
                        💰 <strong>Anggaran:</strong> Rp {program.anggaran.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-600 italic border-l-2 border-blue-500 pl-2 mb-2.5">
                      "{program.deskripsi}"
                    </p>

                    {onSelectProgram && (
                      <button
                        onClick={() => onSelectProgram(program)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                      >
                        Lihat Detail Lengkap
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Population & Coverage Insights Summary Cards */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {kabupatenMapData.map((kab) => (
          <div
            key={kab.nama}
            className="bg-white border border-slate-200/80 p-3 rounded-2xl shadow-2xs hover:shadow-xs transition-all text-xs"
          >
            <p className="font-heading font-extrabold text-slate-900 truncate">{kab.nama}</p>
            <p className="text-[11px] text-slate-500 font-semibold">Populasi: {(kab.populasi / 1000).toFixed(0)}k</p>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="font-black text-emerald-600">{kab.totalPenerima.toLocaleString('id-ID')} Rec.</span>
              <span className="bg-blue-50 border border-blue-200/80 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                {kab.ratioPercent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
