import React from 'react';
import { motion } from 'motion/react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  ChevronDown, 
  Tag, 
  Building2, 
  MapPin, 
  Calendar,
  Check,
  X,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { FilterState, Role, ProgramItem } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  role: Role;
  allPrograms: ProgramItem[];
  filteredCount?: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  resetFilters,
  role,
  allPrograms,
  filteredCount = 0,
}) => {
  // Extract cascading unique values dynamically based on selected parent filters
  const uniqueYears = Array.from(new Set(allPrograms.map((p) => p.tahun))).sort((a: number, b: number) => b - a);

  const uniqueKomisi = Array.from(new Set(allPrograms.map((p) => p.komisi))).sort();

  // Unique Programs
  const availablePrograms = Array.from(
    new Set(
      allPrograms
        .filter((p) => !filters.komisi || p.komisi === filters.komisi)
        .map((p) => p.namaProgram)
    )
  ).sort();

  // Unique Kabupaten
  const availableKabupaten = Array.from(new Set(allPrograms.map((p) => p.kabupaten))).sort();

  // Unique Kecamatan (cascaded by Kabupaten)
  const availableKecamatan = Array.from(
    new Set(
      allPrograms
        .filter((p) => !filters.kabupaten || p.kabupaten === filters.kabupaten)
        .map((p) => p.kecamatan)
    )
  ).sort();

  // Unique Desa (cascaded by Kecamatan & Kabupaten)
  const availableDesa = Array.from(
    new Set(
      allPrograms
        .filter((p) => {
          if (filters.kabupaten && p.kabupaten !== filters.kabupaten) return false;
          if (filters.kecamatan && p.kecamatan !== filters.kecamatan) return false;
          return true;
        })
        .map((p) => p.desa)
    )
  ).sort();

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };

      // Cascade resets
      if (key === 'kabupaten') {
        next.kecamatan = '';
        next.desa = '';
      } else if (key === 'kecamatan') {
        next.desa = '';
      }

      return next;
    });
  };

  // Count active filters
  const activeCount = Object.entries(filters).filter(([key, val]) => {
    if (key === 'provinsi') return false; // Default Jatim
    if (key === 'status' && role === 'Pimpinan') return false;
    return val !== '';
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white border border-slate-200/80 p-3.5 sm:p-4 rounded-2xl shadow-xs mt-3 mb-3.5"
    >
      {/* Top Header & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 text-white p-2 rounded-xl font-bold shadow-xs">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2 tracking-tight">
              FILTER CASCADING DATA
              {activeCount > 0 && (
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200/80">
                  {activeCount} Aktif
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Filter dinamis bertingkat per Tahun, Komisi, Wilayah & Status (Dapil Jatim VII)
            </p>
          </div>
        </div>

        {/* Global Search & Reset */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <form onSubmit={(e) => e.preventDefault()} className="relative flex-1 lg:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              autoComplete="off"
              placeholder="Cari program, penerima, NIK, wilayah..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 focus:outline-none transition-all shadow-2xs"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => handleFilterChange('searchQuery', '')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetFilters}
            className="bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border border-slate-200 px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer transition-all shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </motion.button>
        </div>
      </div>

      {/* Referensi Hasil Pencarian Banner */}
      {filters.searchQuery && (
        <div className="mb-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 border border-blue-200/80 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg shrink-0 mt-0.5 shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-extrabold text-slate-900 text-xs tracking-tight">
                  REFERENSI HASIL PENCARIAN DATA
                </span>
                <span className="bg-blue-600 text-white font-bold text-[11px] px-2.5 py-0.5 rounded-md font-mono shadow-2xs">
                  Kata Kunci: &ldquo;{filters.searchQuery}&rdquo;
                </span>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {filteredCount} Record Ditemukan
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">
                Sistem menampilkan referensi data program yang memiliki kesesuaian pada Nama Program, NIK, Nama Penerima, Desa, Kecamatan, atau Kabupaten di Dapil Jatim VII.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleFilterChange('searchQuery', '')}
              className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <X className="w-3.5 h-3.5 text-rose-500" />
              <span>Hapus Referensi Cari</span>
            </button>
          </div>
        </div>
      )}

      {/* Grid Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-2.5">
        {/* 1. Tahun */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1 font-heading">
            Tahun
          </label>
          <select
            value={filters.tahun}
            onChange={(e) => handleFilterChange('tahun', e.target.value)}
            className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2 bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 focus:outline-none cursor-pointer transition-all shadow-2xs"
          >
            <option value="">Semua Tahun</option>
            {uniqueYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Komisi */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-heading truncate">
            Komisi DPR RI
          </label>
          <select
            value={filters.komisi}
            onChange={(e) => handleFilterChange('komisi', e.target.value)}
            className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2 bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 focus:outline-none cursor-pointer truncate transition-all shadow-2xs"
          >
            <option value="">Semua Komisi</option>
            {uniqueKomisi.map((km) => (
              <option key={km} value={km}>
                {km}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Program */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-heading truncate">
            Program
          </label>
          <select
            value={filters.program}
            onChange={(e) => handleFilterChange('program', e.target.value)}
            className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2 bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 focus:outline-none cursor-pointer truncate transition-all shadow-2xs"
          >
            <option value="">Semua Program</option>
            {availablePrograms.map((prg) => (
              <option key={prg} value={prg}>
                {prg}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Jenis Program */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-heading truncate">
            Jenis Program
          </label>
          <select
            value={filters.jenisProgram}
            onChange={(e) => handleFilterChange('jenisProgram', e.target.value)}
            className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2 bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 focus:outline-none cursor-pointer transition-all shadow-2xs"
          >
            <option value="">Semua Jenis</option>
            <option value="Individu">Individu</option>
            <option value="Kelompok">Kelompok</option>
          </select>
        </div>

        {/* 5. Kabupaten */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-heading">
            Kabupaten
          </label>
          <select
            value={filters.kabupaten}
            onChange={(e) => handleFilterChange('kabupaten', e.target.value)}
            className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2 bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 focus:outline-none cursor-pointer transition-all shadow-2xs"
          >
            <option value="">Semua Kab.</option>
            {availableKabupaten.map((kab) => (
              <option key={kab} value={kab}>
                {kab}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Kecamatan (Cascading) */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-heading">
            Kecamatan
          </label>
          <select
            value={filters.kecamatan}
            onChange={(e) => handleFilterChange('kecamatan', e.target.value)}
            disabled={!filters.kabupaten && availableKecamatan.length === 0}
            className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2 bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 focus:outline-none cursor-pointer disabled:bg-slate-100 disabled:opacity-50 transition-all shadow-2xs"
          >
            <option value="">Semua Kec.</option>
            {availableKecamatan.map((kec) => (
              <option key={kec} value={kec}>
                {kec}
              </option>
            ))}
          </select>
        </div>

        {/* 7. Desa / Kelurahan (Cascading) */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-heading">
            Desa / Kel.
          </label>
          <select
            value={filters.desa}
            onChange={(e) => handleFilterChange('desa', e.target.value)}
            disabled={!filters.kecamatan && availableDesa.length === 0}
            className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2 bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 focus:outline-none cursor-pointer disabled:bg-slate-100 disabled:opacity-50 transition-all shadow-2xs"
          >
            <option value="">Semua Desa</option>
            {availableDesa.map((ds) => (
              <option key={ds} value={ds}>
                {ds}
              </option>
            ))}
          </select>
        </div>

        {/* 8. Status (Admin vs Pimpinan) */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-heading">
            Status
          </label>
          {role === 'Admin' ? (
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full text-xs font-semibold border border-slate-200 rounded-xl p-2 bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 focus:outline-none cursor-pointer transition-all shadow-2xs"
            >
              <option value="">Semua Status</option>
              <option value="Selesai">Selesai (Hijau)</option>
              <option value="Berjalan">Berjalan (Kuning)</option>
              <option value="Perencanaan">Perencanaan (Biru)</option>
              <option value="Belum Ada Program">Belum Ada (Abu)</option>
            </select>
          ) : (
            <div className="w-full text-xs font-bold border border-emerald-300 rounded-lg p-1.5 bg-emerald-50 text-emerald-900 flex items-center justify-between">
              <span>Selesai</span>
              <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};


