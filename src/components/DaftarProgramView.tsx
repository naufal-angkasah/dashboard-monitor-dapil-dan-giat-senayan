import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  FolderKanban, 
  MapPin, 
  Users, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  FileEdit, 
  Search, 
  Building2, 
  Eye, 
  Calendar,
  ChevronRight,
  Filter
} from 'lucide-react';
import { ProgramItem, Role } from '../types';

interface DaftarProgramViewProps {
  programs: ProgramItem[];
  role: Role;
  onSelectProgram: (program: ProgramItem) => void;
}

export const DaftarProgramView: React.FC<DaftarProgramViewProps> = ({
  programs,
  role,
  onSelectProgram,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Selesai' | 'Berjalan' | 'Perencanaan'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKabupaten, setSelectedKabupaten] = useState<string>('ALL');

  const filteredPrograms = useMemo(() => {
    return programs.filter(p => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (selectedKabupaten !== 'ALL' && p.kabupaten !== selectedKabupaten) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.namaProgram.toLowerCase().includes(q);
        const matchPenerima = p.namaPenerima.toLowerCase().includes(q);
        const matchDesa = p.desa.toLowerCase().includes(q);
        const matchKab = p.kabupaten.toLowerCase().includes(q);
        if (!matchTitle && !matchPenerima && !matchDesa && !matchKab) return false;
      }
      return true;
    });
  }, [programs, statusFilter, selectedKabupaten, searchQuery]);

  const kabupatenList = useMemo(() => {
    const set = new Set<string>();
    programs.forEach(p => set.add(p.kabupaten));
    return Array.from(set).sort();
  }, [programs]);

  const countByStatus = useMemo(() => {
    const map = { Selesai: 0, Berjalan: 0, Perencanaan: 0 };
    programs.forEach(p => {
      if (p.status in map) map[p.status as keyof typeof map]++;
    });
    return map;
  }, [programs]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 font-sans"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider w-fit mb-2 flex items-center gap-2">
            <FolderKanban className="w-3.5 h-3.5 text-blue-300" />
            KATALOG & DIREKTORI DAPIL VII
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Daftar Program Pemantauan Aspirasi
          </h2>
          <p className="text-blue-100 text-xs mt-1 leading-relaxed">
            Direktori lengkap seluruh program pembangunan, bantuan sosial, dan aspirasi masyarakat di wilayah Dapil Jatim VII.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shrink-0">
          <div className="text-center px-3 border-r border-white/20">
            <p className="text-[10px] text-blue-200 uppercase font-bold">Total Program</p>
            <p className="text-lg font-extrabold text-white">{programs.length}</p>
          </div>
          <div className="text-center px-3">
            <p className="text-[10px] text-blue-200 uppercase font-bold">Tersebar Di</p>
            <p className="text-lg font-extrabold text-emerald-300">{kabupatenList.length} Kab</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              statusFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Semua Program</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${statusFilter === 'ALL' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {programs.length}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('Selesai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              statusFilter === 'Selesai'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Selesai</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-200/60 text-emerald-900 font-extrabold">
              {countByStatus.Selesai}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('Berjalan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              statusFilter === 'Berjalan'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Berjalan</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-200/60 text-amber-900 font-extrabold">
              {countByStatus.Berjalan}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('Perencanaan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              statusFilter === 'Perencanaan'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Perencanaan</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-200/60 text-blue-900 font-extrabold">
              {countByStatus.Perencanaan}
            </span>
          </button>
        </div>

        {/* Kabupaten Dropdown & Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedKabupaten}
            onChange={(e) => setSelectedKabupaten(e.target.value)}
            className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">Semua Kabupaten</option>
            {kabupatenList.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari program..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Program Directory Grid */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-sm">Tidak Ada Program Ditemukan</h3>
          <p className="text-xs text-slate-500 mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPrograms.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -2 }}
              onClick={() => onSelectProgram(p)}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/60 rounded-md">
                    {p.komisi} • {p.tahun}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    p.status === 'Selesai' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : p.status === 'Berjalan'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                  {p.namaProgram}
                </h3>
                
                <p className="text-xs text-slate-500 mt-1 font-medium line-clamp-1">
                  Penerima: <strong className="text-slate-800">{p.namaPenerima}</strong>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {p.desa}, {p.kabupaten.replace('Kab. ', '')}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {p.jumlahPenerima} Orang
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Anggaran Program</p>
                    <p className="font-extrabold text-blue-700 text-xs">
                      Rp {p.anggaran.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
