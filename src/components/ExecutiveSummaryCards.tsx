import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Users, 
  Building, 
  Tag, 
  BookOpen, 
  PieChart as PieIcon,
  Award,
  HeartHandshake,
  TrendingUp
} from 'lucide-react';
import { ExecutiveSummaryStats } from '../types';

interface ExecutiveSummaryCardsProps {
  stats?: ExecutiveSummaryStats;
  activeCategoryTab?: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect';
  totalEbyPrograms?: number;
  totalEbyPenerima?: number;
}

export const ExecutiveSummaryCards: React.FC<ExecutiveSummaryCardsProps> = ({
  stats: propStats,
  activeCategoryTab = 'ALL',
  totalEbyPrograms = 7,
  totalEbyPenerima = 8920,
}) => {
  const stats = propStats || {
    totalGiat: 0,
    totalPeserta: 0,
    totalInstansi: 0,
    totalSegmentasi: 0,
    totalTema: 0,
    giatMPR: 0,
    giatDPR: 0,
    giatEBY: 0,
    percentMPR: 0,
    percentDPR: 0,
  };

  // Mode EBY Connect Simple Layout
  if (activeCategoryTab === 'EBY Connect') {
    return (
      <div className="mb-8 space-y-4">
        {/* Banner Section */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-2xl">
            <div className="bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider w-fit mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              PROGRAM EBY CONNECT NASIONAL
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Ringkasan Eksekutif Program EBY Connect
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-2 leading-relaxed">
              Pemantauan penyaluran beasiswa, bantuan pendidikan, LPDP, KIPK, dan program bantuan sosial langsung bagi masyarakat.
            </p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white min-w-[220px] shrink-0">
            <p className="text-xs font-medium text-emerald-200">TOTAL DANA / MITRA</p>
            <h4 className="text-2xl font-extrabold mt-1 text-white">12 Kementerian</h4>
            <div className="w-full bg-emerald-950/60 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '85%' }} />
            </div>
            <p className="text-[10px] text-emerald-200/80 mt-2">Penyaluran Aktif & Terverifikasi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Program */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total Program EBY
                </p>
                <h3 className="text-3xl font-bold mt-1.5 text-slate-900">
                  {totalEbyPrograms} <span className="text-sm font-normal text-slate-500">Program</span>
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-4 pt-3 border-t border-slate-100">
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px]">KIPK, LPDP, Bus Mudik</span>
            </div>
          </motion.div>

          {/* Card 2: Total Penerima */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total Penerima Manfaat
                </p>
                <h3 className="text-3xl font-bold mt-1.5 text-slate-900">
                  {totalEbyPenerima.toLocaleString('id-ID')}{' '}
                  <span className="text-sm font-normal text-slate-500">Orang</span>
                </h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium mt-4 pt-3 border-t border-slate-100">
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">Terdaftar & Terverifikasi</span>
            </div>
          </motion.div>

          {/* Card 3: Rata-rata Penerima */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Rata-Rata Penerima
                </p>
                <h3 className="text-3xl font-bold mt-1.5 text-slate-900">
                  {Math.round(totalEbyPenerima / (totalEbyPrograms || 1)).toLocaleString('id-ID')}{' '}
                  <span className="text-sm font-normal text-slate-500">/ Prog</span>
                </h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium mt-4 pt-3 border-t border-slate-100">
              <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[11px]">Cakupan Per Program</span>
            </div>
          </motion.div>

          {/* Card 4: Mitra & Penyaluran */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Mitra Strategis
                </p>
                <h3 className="text-3xl font-bold mt-1.5 text-slate-900">
                  12 <span className="text-sm font-normal text-slate-500">Kementerian/PT</span>
                </h3>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-purple-600 font-medium mt-4 pt-3 border-t border-slate-100">
              <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold text-[11px]">Kemendikbud, Kemenhub, LPDP</span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Standard Mode (ALL, MPR, DPR)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mb-4 space-y-3"
    >
      {/* Hero STELLAR Executive Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Monitoring Kinerja Giat Senayan (MPR & DPR RI)
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Orkestrasi dan rekapitulasi real-time kegiatan konstituen, sosialisasi 4 Pilar MPR, kunjungan kerja DPR, serta serapan aspirasi masyarakat.
          </p>
        </div>

        {/* Small Swarm/Status Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white min-w-[240px] shrink-0">
          <div className="flex items-center justify-between text-xs font-medium text-blue-200">
            <span>STATUS REKAPITULASI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <h4 className="text-2xl font-extrabold mt-1 text-white">{stats.totalGiat} <span className="text-sm font-normal text-blue-200">Giat Aktif</span></h4>
          <div className="w-full bg-blue-950/60 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-blue-400 h-full rounded-full" style={{ width: `${Math.min(100, (stats.totalGiat / 50) * 100)}%` }} />
          </div>
          <div className="flex justify-between items-center text-[10px] text-blue-200/80 mt-2">
            <span>MPR: {stats.giatMPR} ({stats.percentMPR}%)</span>
            <span>DPR: {stats.giatDPR} ({stats.percentDPR}%)</span>
          </div>
        </div>
      </div>

      {/* Grid KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Giat */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Giat
              </p>
              <h3 className="text-3xl font-bold mt-1.5 text-slate-900">
                {stats.totalGiat}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              ↑ 100% Sync
            </span>
            <span className="text-[11px] text-slate-400">MPR & DPR RI</span>
          </div>
        </motion.div>

        {/* Card 2: Total Peserta */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Peserta
              </p>
              <h3 className="text-3xl font-bold mt-1.5 text-slate-900">
                {stats.totalPeserta > 1000 ? `${(stats.totalPeserta/1000).toFixed(1)}K` : stats.totalPeserta}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              Terverifikasi Live
            </span>
          </div>
        </motion.div>

        {/* Card 3: Total Instansi */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Instansi
              </p>
              <h3 className="text-3xl font-bold mt-1.5 text-slate-900">
                {stats.totalInstansi}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              Nasional & Daerah
            </span>
          </div>
        </motion.div>

        {/* Card 4: Segmentasi */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Segmentasi
              </p>
              <h3 className="text-3xl font-bold mt-1.5 text-slate-900">
                {stats.totalSegmentasi}
              </h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
              Kelompok Sasaran
            </span>
          </div>
        </motion.div>

      </div>

      {/* Komparasi MPR vs DPR Visual Composition Bar */}
      <div className="bg-white p-4 border border-slate-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <PieIcon className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-xs text-slate-800">
            Komposisi Komparasi Giat (MPR vs DPR):
          </span>
        </div>

        <div className="flex-1 max-w-xl flex flex-col gap-1">
          <div className="h-4 w-full bg-slate-100 rounded-full flex overflow-hidden p-0.5">
            <div 
              style={{ width: `${stats.percentMPR}%` }}
              className="bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] rounded-full transition-all duration-500 overflow-hidden"
              title={`MPR RI: ${stats.giatMPR} Giat (${stats.percentMPR}%)`}
            />
            <div 
              style={{ width: `${stats.percentDPR}%` }}
              className="bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] rounded-full transition-all duration-500 overflow-hidden"
              title={`DPR RI: ${stats.giatDPR} Giat (${stats.percentDPR}%)`}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium shrink-0 text-slate-700">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block" />
            MPR: <strong>{stats.giatMPR} ({stats.percentMPR}%)</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full inline-block" />
            DPR: <strong>{stats.giatDPR} ({stats.percentDPR}%)</strong>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

