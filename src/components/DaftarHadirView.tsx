import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  QrCode, 
  Search, 
  Building2, 
  CheckCircle2, 
  Clock,
  Users,
  Plus,
  ClipboardList,
  Filter,
  ChevronDown,
  Info,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Phone,
  Tag,
  Building,
  Calendar
} from 'lucide-react';
import { AttendanceRecord, ActivityItem, UserRole } from '../types';
import { CustomTooltip } from './CustomTooltip';

interface DaftarHadirViewProps {
  attendanceRecords: AttendanceRecord[];
  activities: ActivityItem[];
  userRole: UserRole;
  onOpenAbsenGenerator: () => void;
  onOpenFormInputGiat: () => void;
}

const STATUS_COLOR: Record<string, string> = {
  Hadir: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Izin: 'bg-amber-50 text-amber-700 border-amber-200',
  Sakit: 'bg-red-50 text-red-700 border-red-200',
};

const KATEGORI_COLOR: Record<string, string> = {
  MPR: 'text-amber-700 bg-amber-50 border-amber-300',
  DPR: 'text-indigo-700 bg-indigo-50 border-indigo-300',
  'EBY Connect': 'text-emerald-700 bg-emerald-50 border-emerald-300',
};

const ITEMS_PER_PAGE = 50;

export const DaftarHadirView: React.FC<DaftarHadirViewProps> = ({
  attendanceRecords,
  activities,
  userRole,
  onOpenAbsenGenerator,
  onOpenFormInputGiat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('ALL');
  const [filterKategori, setFilterKategori] = useState<string>('ALL');
  const [filterTahun, setFilterTahun] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Map activity titles for lookup
  const activityMap = useMemo(() => {
    const map = new Map<string, ActivityItem>();
    activities.forEach(a => map.set(a.id, a));
    return map;
  }, [activities]);

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      const act = activityMap.get(record.activityId);
      const kat = record.kategoriGiat || act?.kategoriGiat;
      const thn = record.tahun || act?.tahun;

      if (selectedActivityId !== 'ALL' && record.activityId !== selectedActivityId) return false;
      if (filterKategori !== 'ALL' && kat !== filterKategori) return false;
      if (filterTahun !== 'ALL' && thn !== filterTahun) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = record.namaPeserta?.toLowerCase().includes(q) ?? false;
        const matchInst = record.instansi?.toLowerCase().includes(q) ?? false;
        const matchContact = record.kontak?.toLowerCase().includes(q) ?? false;
        const matchSeg = record.segmentasiPeserta?.toLowerCase().includes(q) ?? false;
        const matchTema = record.temaGiat?.toLowerCase().includes(q) ?? false;
        const matchGiat = (record.namaGiat || act?.namaGiat)?.toLowerCase().includes(q) ?? false;

        if (!matchName && !matchInst && !matchContact && !matchSeg && !matchTema && !matchGiat) return false;
      }
      return true;
    });
  }, [attendanceRecords, selectedActivityId, filterKategori, filterTahun, searchQuery, activityMap]);

  // Reset to page 1 when filter or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedActivityId, filterKategori, filterTahun]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredRecords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRecords, currentPage]);

  // Stats
  const totalCount = attendanceRecords.length;
  const mprCount = attendanceRecords.filter(r => (r.kategoriGiat || activityMap.get(r.activityId)?.kategoriGiat) === 'MPR').length;
  const dprCount = attendanceRecords.filter(r => (r.kategoriGiat || activityMap.get(r.activityId)?.kategoriGiat) === 'DPR').length;
  const ebyCount = attendanceRecords.filter(r => (r.kategoriGiat || activityMap.get(r.activityId)?.kategoriGiat) === 'EBY Connect').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 font-sans"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Decoration circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-24 pointer-events-none" />

        <div className="relative z-10">
          <div className="bg-white/15 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mb-2 flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            DAFTAR HADIR & PRESENSI SENAYAN NASIONAL ({totalCount} DATA TERIMPOR)
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            Daftar Hadir & Audit Presensi Konstituen
          </h2>
          <p className="text-blue-100 text-xs mt-1 leading-relaxed max-w-xl">
            Tabel presensi terverifikasi sesuai format Google Sheets (800+ Data Presensi MPR, DPR & EBY Connect). Tersimpan di Firebase Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10 shrink-0">
          {userRole === 'admin' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenFormInputGiat}
              className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Input Giat Baru</span>
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenAbsenGenerator}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>QR / Form Absen</span>
          </motion.button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Peserta Hadir', val: totalCount, unit: 'Orang', icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', valColor: 'text-slate-900' },
          { label: 'Giat MPR RI', val: mprCount, unit: 'Peserta', icon: CheckCircle2, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', valColor: 'text-amber-600' },
          { label: 'Giat DPR RI', val: dprCount, unit: 'Peserta', icon: ClipboardList, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', valColor: 'text-indigo-600' },
          { label: 'EBY Connect / Lainnya', val: ebyCount, unit: 'Peserta', icon: Info, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', valColor: 'text-emerald-600' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-2"
          >
            <div>
              <p className="text-[10px] font-extrabold uppercase text-slate-400 leading-tight">{kpi.label}</p>
              <p className={`text-2xl font-extrabold ${kpi.valColor} mt-0.5`}>
                {kpi.val} <span className="text-xs text-slate-400 font-normal">{kpi.unit}</span>
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${kpi.iconBg} ${kpi.iconColor} flex items-center justify-center shrink-0`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Filter Kategori */}
        <div className="relative w-full sm:w-40">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="MPR">MPR</option>
            <option value="DPR">DPR</option>
            <option value="EBY Connect">EBY Connect</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter Tahun */}
        <div className="relative w-full sm:w-36">
          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={filterTahun}
            onChange={(e) => setFilterTahun(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none"
          >
            <option value="ALL">Semua Tahun</option>
            <option value="2025">Tahun 2025</option>
            <option value="2026">Tahun 2026</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Filter Kegiatan */}
        <div className="relative w-full sm:flex-1 max-w-xs">
          <ClipboardList className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <select
            value={selectedActivityId}
            onChange={(e) => setSelectedActivityId(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none truncate"
          >
            <option value="ALL">Semua Judul Giat ({activities.length})</option>
            {activities.map(a => (
              <option key={a.id} value={a.id}>{a.namaGiat} ({a.kategoriGiat})</option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari peserta, instansi, tema, kontak..."
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Attendance Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header Info & Pagination Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Tabel Presensi & Data Peserta Senayan</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Menampilkan <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)}</strong> dari <strong>{filteredRecords.length}</strong> data hasil filter
            </p>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 px-2">
              Halaman {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-slate-300" />
            </div>
            <h4 className="font-bold text-slate-700 text-sm">Data Tidak Ditemukan</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Tidak ada data presensi yang sesuai dengan kata kunci pencarian atau filter yang dipilih.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider whitespace-nowrap">
                <tr>
                  <th className="px-3.5 py-3">NO</th>
                  <th className="px-3 py-3">TAHUN</th>
                  <th className="px-3 py-3">KATEGORI GIAT</th>
                  <th className="px-3.5 py-3">JENIS GIAT</th>
                  <th className="px-3.5 py-3">TEMA GIAT</th>
                  <th className="px-4 py-3">NAMA GIAT</th>
                  <th className="px-4 py-3">NAMA PESERTA</th>
                  <th className="px-4 py-3">ASAL INSTANSI</th>
                  <th className="px-3.5 py-3">SEGMENTASI</th>
                  <th className="px-3.5 py-3">KONTAK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {paginatedRecords.map((record, index) => {
                  const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                  const act = activityMap.get(record.activityId);
                  const kategori = record.kategoriGiat || act?.kategoriGiat || 'MPR';
                  const jenis = record.jenisGiat || act?.jenisGiat || 'FDA';
                  const tema = record.temaGiat || act?.temaGiat || 'Umum';
                  const namaGiat = record.namaGiat || act?.namaGiat || 'Kegiatan Senayan';
                  const tahun = record.tahun || act?.tahun || '2025';
                  const katBadgeClass = KATEGORI_COLOR[kategori] || 'text-blue-700 bg-blue-50 border-blue-200';

                  return (
                    <tr key={record.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* NO */}
                      <td className="px-3.5 py-3 text-slate-400 font-bold whitespace-nowrap">{globalIdx}</td>
                      
                      {/* TAHUN */}
                      <td className="px-3 py-3 font-extrabold text-slate-700 whitespace-nowrap">{tahun}</td>
                      
                      {/* KATEGORI GIAT */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${katBadgeClass}`}>
                          {kategori}
                        </span>
                      </td>

                      {/* JENIS GIAT */}
                      <td className="px-3.5 py-3 font-semibold text-slate-700 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          {jenis}
                        </span>
                      </td>

                      {/* TEMA GIAT */}
                      <td className="px-3.5 py-3 font-semibold text-indigo-700 whitespace-nowrap max-w-[140px] truncate">
                        {tema}
                      </td>

                      {/* NAMA GIAT */}
                      <td className="px-4 py-3 max-w-xs">
                        <CustomTooltip
                          content={namaGiat}
                          category={kategori}
                          badge={tema}
                        >
                          <p className="font-bold text-slate-900 leading-snug line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
                            {namaGiat}
                          </p>
                        </CustomTooltip>
                      </td>

                      {/* NAMA PESERTA */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-extrabold text-slate-900">{record.namaPeserta}</p>
                      </td>

                      {/* ASAL INSTANSI */}
                      <td className="px-4 py-3 max-w-[200px] truncate" title={record.instansi}>
                        <p className="font-semibold text-slate-700 truncate">{record.instansi}</p>
                      </td>

                      {/* SEGMENTASI PESERTA */}
                      <td className="px-3.5 py-3 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          {record.segmentasiPeserta || 'Umum'}
                        </span>
                      </td>

                      {/* KONTAK */}
                      <td className="px-3.5 py-3 whitespace-nowrap font-mono text-[11px] text-slate-600 font-semibold">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{record.kontak}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Pagination Bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 font-medium">
            Total <strong>{filteredRecords.length}</strong> data presensi terverifikasi (Format Google Sheet)
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Sebelumnya
            </button>
            <span className="text-xs font-bold text-slate-700 px-2">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Berikutnya →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

