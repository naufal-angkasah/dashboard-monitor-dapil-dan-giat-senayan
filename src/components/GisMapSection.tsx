import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Compass, Award, Users, ChevronRight, Building } from 'lucide-react';
import { ActivityItem } from '../types';

interface GisMapSectionProps {
  activities: ActivityItem[];
  selectedKabupaten: string;
  onSelectKabupaten: (kab: string) => void;
}

interface KabupatenData {
  name: string;
  code: string;
  totalGiat: number;
  totalPeserta: number;
  color: string;
  topKecamatan: { name: string; giat: number }[];
}

export const GisMapSection: React.FC<GisMapSectionProps> = ({
  activities,
  selectedKabupaten,
  onSelectKabupaten,
}) => {
  const [hoveredKab, setHoveredKab] = useState<KabupatenData | null>(null);

  // Group activity data by Kabupaten
  const kabStats = React.useMemo(() => {
    const map: Record<string, { totalGiat: number; totalPeserta: number; kecamatanMap: Record<string, number> }> = {
      Pacitan: { totalGiat: 0, totalPeserta: 0, kecamatanMap: {} },
      Ponorogo: { totalGiat: 0, totalPeserta: 0, kecamatanMap: {} },
      Trenggalek: { totalGiat: 0, totalPeserta: 0, kecamatanMap: {} },
      Magetan: { totalGiat: 0, totalPeserta: 0, kecamatanMap: {} },
      Ngawi: { totalGiat: 0, totalPeserta: 0, kecamatanMap: {} },
    };

    activities.forEach(item => {
      const kab = item.kabupaten || 'Pacitan';
      if (!map[kab]) {
        map[kab] = { totalGiat: 0, totalPeserta: 0, kecamatanMap: {} };
      }
      map[kab].totalGiat += 1;
      map[kab].totalPeserta += item.jumlahPeserta || 0;

      const kec = item.kecamatan || 'Pusat Kota';
      map[kab].kecamatanMap[kec] = (map[kab].kecamatanMap[kec] || 0) + 1;
    });

    const colors: Record<string, string> = {
      Pacitan: '#2563EB',
      Ponorogo: '#DC2626',
      Trenggalek: '#10B981',
      Magetan: '#F59E0B',
      Ngawi: '#8B5CF6',
    };

    return Object.keys(map).map(kabName => {
      const info = map[kabName];
      const topKec = Object.entries(info.kecamatanMap)
        .map(([name, giat]) => ({ name, giat }))
        .sort((a, b) => b.giat - a.giat)
        .slice(0, 3);

      return {
        name: kabName,
        code: kabName.toLowerCase(),
        totalGiat: info.totalGiat,
        totalPeserta: info.totalPeserta,
        color: colors[kabName] || '#3B82F6',
        topKecamatan: topKec.length > 0 ? topKec : [{ name: 'Kec. Utama', giat: info.totalGiat }],
      };
    });
  }, [activities]);

  const activeKabData = hoveredKab || kabStats.find(k => k.name === selectedKabupaten) || kabStats[0] || {
    name: 'Pacitan',
    totalGiat: 0,
    totalPeserta: 0,
    color: '#2563EB',
    topKecamatan: [{ name: 'Kec. Utama', giat: 0 }]
  };

  return (
    <div className="bg-white border border-slate-200/80 p-5 mb-8 rounded-2xl shadow-xs">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Compass className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
              <span>Interactive GIS Map & Penetrasi Wilayah</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Giat Senayan & Nasional
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Sebaran giat nasional, tingkat partisipasi warga, dan penetrasi per kabupaten
            </p>
          </div>
        </div>

        {selectedKabupaten !== 'ALL' && (
          <button
            onClick={() => onSelectKabupaten('ALL')}
            className="text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 px-3 py-1.5 rounded-xl cursor-pointer self-start sm:self-auto transition-colors"
          >
            Reset Filter Wilayah ({selectedKabupaten})
          </button>
        )}
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-7 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md relative flex flex-col justify-between min-h-[320px]">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] uppercase bg-blue-600 text-white px-2.5 py-0.5 rounded-full font-bold tracking-wider">
                Peta Kerapatan Giat
              </span>
              <h4 className="font-bold text-sm text-slate-100 mt-2">
                Visualisasi Wilayah Kab. Pacitan, Ponorogo, Trenggalek, Magetan, Ngawi
              </h4>
            </div>
            <span className="text-xs text-slate-400 font-medium">Pilih wilayah untuk filter</span>
          </div>

          {/* SVG Map Illustration */}
          <div className="relative my-4 flex items-center justify-center p-4 bg-slate-950/60 rounded-md border border-slate-800">
            <svg viewBox="0 0 600 240" className="w-full h-auto max-h-[220px]">
              {/* Background grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="600" height="240" fill="url(#grid)" />

              {/* Pacitan */}
              <g 
                onClick={() => onSelectKabupaten('Pacitan')}
                onMouseEnter={() => setHoveredKab(kabStats.find(k => k.name === 'Pacitan') || null)}
                onMouseLeave={() => setHoveredKab(null)}
                className="cursor-pointer transition-transform hover:scale-105 origin-center"
              >
                <path d="M 50 130 Q 110 110 150 140 T 130 200 T 60 180 Z" fill={selectedKabupaten === 'Pacitan' ? '#f59e0b' : '#2563eb'} opacity="0.85" stroke="#0f172a" strokeWidth="2" />
                <text x="95" y="155" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">PACITAN</text>
                <circle cx="95" cy="135" r="5" fill="#f59e0b" />
              </g>

              {/* Ponorogo */}
              <g 
                onClick={() => onSelectKabupaten('Ponorogo')}
                onMouseEnter={() => setHoveredKab(kabStats.find(k => k.name === 'Ponorogo') || null)}
                onMouseLeave={() => setHoveredKab(null)}
                className="cursor-pointer transition-transform hover:scale-105 origin-center"
              >
                <path d="M 155 120 Q 220 90 260 130 T 230 190 T 160 170 Z" fill={selectedKabupaten === 'Ponorogo' ? '#f59e0b' : '#dc2626'} opacity="0.85" stroke="#0f172a" strokeWidth="2" />
                <text x="200" y="145" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">PONOROGO</text>
                <circle cx="200" cy="125" r="5" fill="#f59e0b" />
              </g>

              {/* Trenggalek */}
              <g 
                onClick={() => onSelectKabupaten('Trenggalek')}
                onMouseEnter={() => setHoveredKab(kabStats.find(k => k.name === 'Trenggalek') || null)}
                onMouseLeave={() => setHoveredKab(null)}
                className="cursor-pointer transition-transform hover:scale-105 origin-center"
              >
                <path d="M 265 125 Q 330 110 370 150 T 330 210 T 270 185 Z" fill={selectedKabupaten === 'Trenggalek' ? '#f59e0b' : '#10b981'} opacity="0.85" stroke="#0f172a" strokeWidth="2" />
                <text x="315" y="155" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">TRENGGALEK</text>
                <circle cx="315" cy="135" r="5" fill="#f59e0b" />
              </g>

              {/* Magetan */}
              <g 
                onClick={() => onSelectKabupaten('Magetan')}
                onMouseEnter={() => setHoveredKab(kabStats.find(k => k.name === 'Magetan') || null)}
                onMouseLeave={() => setHoveredKab(null)}
                className="cursor-pointer transition-transform hover:scale-105 origin-center"
              >
                <path d="M 140 30 Q 210 20 230 80 T 170 110 T 130 70 Z" fill={selectedKabupaten === 'Magetan' ? '#f59e0b' : '#f59e0b'} opacity="0.85" stroke="#0f172a" strokeWidth="2" />
                <text x="175" y="65" fill="#0f172a" fontSize="12" fontWeight="bold" textAnchor="middle">MAGETAN</text>
                <circle cx="175" cy="48" r="5" fill="#2563eb" />
              </g>

              {/* Ngawi */}
              <g 
                onClick={() => onSelectKabupaten('Ngawi')}
                onMouseEnter={() => setHoveredKab(kabStats.find(k => k.name === 'Ngawi') || null)}
                onMouseLeave={() => setHoveredKab(null)}
                className="cursor-pointer transition-transform hover:scale-105 origin-center"
              >
                <path d="M 235 25 Q 340 10 380 75 T 320 115 T 240 85 Z" fill={selectedKabupaten === 'Ngawi' ? '#f59e0b' : '#8b5cf6'} opacity="0.85" stroke="#0f172a" strokeWidth="2" />
                <text x="300" y="60" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">NGAWI</text>
                <circle cx="300" cy="42" r="5" fill="#f59e0b" />
              </g>

              {/* Connecting lines */}
              <line x1="95" y1="135" x2="200" y2="125" stroke="#ffffff" strokeDasharray="3,3" opacity="0.4" />
              <line x1="200" y1="125" x2="315" y2="135" stroke="#ffffff" strokeDasharray="3,3" opacity="0.4" />
              <line x1="175" y1="48" x2="200" y2="125" stroke="#ffffff" strokeDasharray="3,3" opacity="0.4" />
              <line x1="300" y1="42" x2="200" y2="125" stroke="#ffffff" strokeDasharray="3,3" opacity="0.4" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-300 gap-2 border-t border-slate-800 pt-2">
            <span>Legenda: Warna Menunjukkan Intensitas Giat</span>
            <span className="text-amber-300 font-bold">Klik salah satu kabupaten untuk filter cepat</span>
          </div>
        </div>

        {/* Region Penetration Breakdown Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          
          {/* Top Region Card */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> Detail Wilayah Terpilih:
              </span>
              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200/60">
                {activeKabData.name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Total Kegiatan</span>
                <span className="text-2xl font-extrabold text-slate-900">{activeKabData.totalGiat} <span className="text-xs font-normal text-slate-500">Giat</span></span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block mb-0.5">Total Peserta</span>
                <span className="text-2xl font-extrabold text-blue-600">{activeKabData.totalPeserta.toLocaleString('id-ID')} <span className="text-xs font-normal text-slate-500">Jiwa</span></span>
              </div>
            </div>

            <div className="mt-3">
              <span className="text-[11px] font-semibold text-slate-700 block mb-2">
                Top Kecamatan Berpartisipasi:
              </span>
              <div className="space-y-1.5">
                {(activeKabData?.topKecamatan || []).map((kec, i) => (
                  <div key={i} className="flex justify-between items-center text-xs bg-slate-50/80 p-2 rounded-xl border border-slate-200/60">
                    <span className="text-slate-800 font-medium flex items-center gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-600" /> {kec.name}
                    </span>
                    <span className="font-bold text-slate-900">{kec.giat} Giat</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kabupaten Chips Selector */}
          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
            <span className="text-[11px] font-semibold text-slate-700 block mb-2">
              Pilih Kabupaten Untuk Filter Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onSelectKabupaten('ALL')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer border ${
                  selectedKabupaten === 'ALL'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                Semua Kabupaten
              </button>
              {kabStats.map(kab => (
                <button
                  key={kab.name}
                  onClick={() => onSelectKabupaten(kab.name)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer border ${
                    selectedKabupaten === kab.name
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  {kab.name} ({kab.totalGiat})
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

