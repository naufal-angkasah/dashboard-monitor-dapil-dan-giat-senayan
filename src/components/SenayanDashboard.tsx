import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { SenayanActivity, Role } from '../types';
import { 
  Building2, 
  Users, 
  Calendar, 
  FileText, 
  QrCode, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Download, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldCheck,
  Share2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';

interface SenayanDashboardProps {
  activities: SenayanActivity[];
  role: Role;
  onOpenLinkGenerator: () => void;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
}

export const SenayanDashboard: React.FC<SenayanDashboardProps> = ({
  activities,
  role,
  onOpenLinkGenerator,
  onExportExcel,
  onExportPdf,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [selectedTipe, setSelectedTipe] = useState<string>('Semua');

  // Filtered dataset
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      const matchSearch = 
        act.namaGiat.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.instansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase());

      const matchKat = selectedKategori === 'Semua' || act.kategori === selectedKategori;
      const matchTipe = selectedTipe === 'Semua' || act.tipeLembaga === selectedTipe;

      return matchSearch && matchKat && matchTipe;
    });
  }, [activities, searchQuery, selectedKategori, selectedTipe]);

  // Executive Metrics
  const totalGiat = activities.length;
  const totalPeserta = useMemo(() => activities.reduce((acc, a) => acc + a.jumlahPeserta, 0), [activities]);
  const uniqueInstansi = useMemo(() => new Set(activities.map((a) => a.instansi)).size, [activities]);

  // Chart 1: Monthly trend data
  const monthlyData = [
    { bulan: 'Jan', totalGiat: 6, totalPeserta: 280 },
    { bulan: 'Feb', totalGiat: 8, totalPeserta: 420 },
    { bulan: 'Mar', totalGiat: 12, totalPeserta: 680 },
    { bulan: 'Apr', totalGiat: 9, totalPeserta: 390 },
    { bulan: 'Mei', totalGiat: 11, totalPeserta: 510 },
    { bulan: 'Jun', totalGiat: 15, totalPeserta: 740 },
    { bulan: 'Jul', totalGiat: 10, totalPeserta: 400 },
  ];

  // Chart 2: OP9 vs MP9 vs EB7 distribution
  const tipeDistributionData = useMemo(() => {
    const counts = { 'OP9 (DPR RI)': 0, 'MP9 (MPR RI)': 0, 'EB7 (Fraksi)': 0 };
    activities.forEach((a) => {
      if (counts[a.tipeLembaga] !== undefined) {
        counts[a.tipeLembaga]++;
      }
    });
    return [
      { name: 'OP9 (DPR RI)', value: counts['OP9 (DPR RI)'] || 5, color: '#2563EB' },
      { name: 'MP9 (MPR RI)', value: counts['MP9 (MPR RI)'] || 3, color: '#0EA5E9' },
      { name: 'EB7 (Fraksi)', value: counts['EB7 (Fraksi)'] || 2, color: '#6366F1' },
    ];
  }, [activities]);

  // Chart 3: Segmentation Breakdown
  const segmentationData = useMemo(() => {
    const map: Record<string, number> = {};
    activities.forEach((a) => {
      map[a.kategori] = (map[a.kategori] || 0) + a.jumlahPeserta;
    });
    return Object.entries(map).map(([kategori, total]) => ({
      kategori: kategori.split('/')[0],
      total,
    }));
  }, [activities]);

  return (
    <div className="space-y-6">
      {/* Navigation & Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 sm:p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              DASHBOARD KEGIATAN SENAYAN
            </span>
            <span className="text-xs text-slate-300 font-semibold">• Senayan Jakarta</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            Monitoring Kunjungan Instansi & Giat Aspirasi
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Data rekapitulasi delegasi daerah, audiensi instansi/sekolah/pemkab, daftar hadir digital, serta berkas laporan kegiatan Senayan DPR & MPR RI.
          </p>
        </div>

        {/* Feature Generator Link (Admin Only) */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          {role === 'Admin' ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenLinkGenerator}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs"
            >
              <QrCode className="w-4 h-4 text-sky-200" />
              <span>+ Buat Link / QR Form Pendaftaran</span>
            </motion.button>
          ) : (
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-2 rounded-xl text-[11px] text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Akses Pimpinan: Mode Read-Only Executive</span>
            </div>
          )}
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Giat */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Kegiatan</span>
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalGiat} <span className="text-sm font-semibold text-slate-500">Giat</span></div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Kunjungan Kerja & Audiensi</span>
          </p>
        </motion.div>

        {/* Total Peserta */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Peserta</span>
            <div className="bg-sky-50 text-sky-600 p-2 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalPeserta.toLocaleString('id-ID')} <span className="text-sm font-semibold text-slate-500">Orang</span></div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Delegasi & Warga Dapil
          </p>
        </motion.div>

        {/* Total Instansi */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Instansi</span>
            <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{uniqueInstansi} <span className="text-sm font-semibold text-slate-500">Instansi</span></div>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">
            Sekolah, Pemkab, Ormas
          </p>
        </motion.div>

        {/* Segmentasi / Tema */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Segmentasi / Tema</span>
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 truncate">Pendidikan & Pemkab</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Segmentasi Kunjungan Terbanyak
          </p>
        </motion.div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Tren Kegiatan Bulanan */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Statistik & Tren Kegiatan Bulanan Senayan
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Grafik pertumbuhan jumlah kunjungan dan peserta per bulan
              </p>
            </div>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGiat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#FFF', border: 'none', fontSize: '12px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#38BDF8' }}
                />
                <Area type="monotone" dataKey="totalGiat" name="Total Kegiatan" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorGiat)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Distrubusi Lembaga (DPR vs MPR) */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-sky-600" />
                Distribusi Tipe Lembaga
              </h3>
            </div>

            <div className="h-[180px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tipeDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {tipeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0F172A', borderRadius: '10px', color: '#FFF', border: 'none', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 text-center text-[11px] pt-2 border-t border-slate-100">
            {tipeDistributionData.map((item) => (
              <div key={item.name} className="p-1 rounded bg-slate-50">
                <p className="font-bold text-slate-800">{item.name.split(' ')[0]}</p>
                <p className="text-slate-500 font-semibold">{item.value} Giat</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
        {/* Table Header Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Tabel Daftar Hadir & Berkas Kunjungan
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Menampilkan {filteredActivities.length} dari total {activities.length} daftar giat Senayan
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari instansi / giat..."
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium bg-slate-50 focus:bg-white focus:border-blue-600 outline-none transition-colors"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium bg-slate-50 focus:bg-white outline-none cursor-pointer"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Pendidikan/Kampus">Pendidikan / Kampus</option>
              <option value="Pemerintahan/Pemkab">Pemerintahan / Pemkab</option>
              <option value="Keagamaan/Ormas">Keagamaan / Ormas</option>
              <option value="Pemuda/Pelajar">Pemuda / Pelajar</option>
              <option value="UMKM/Komunitas">UMKM / Komunitas</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-900 text-white font-heading font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">No / ID</th>
                <th className="py-3 px-3">Nama Giat & Instansi</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3 text-center">Peserta</th>
                <th className="py-3 px-3">Kategori & Tipe</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Action / Berkas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    Tidak ada data kunjungan yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{act.id}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 text-xs">{act.namaGiat}</p>
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-blue-600" />
                        <span>{act.instansi}</span>
                      </p>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                      {act.tanggal}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">
                      {act.jumlahPeserta} Orang
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                        {act.kategori}
                      </span>
                      <p className="text-[10px] text-blue-700 font-bold mt-1">{act.tipeLembaga}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{act.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={onOpenLinkGenerator}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors cursor-pointer"
                          title="Lihat / Generate QR Code Form"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={act.berkasUrl || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Pratinjau Berkas Digital"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
