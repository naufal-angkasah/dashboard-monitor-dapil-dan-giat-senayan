import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Filter, RotateCcw, Check, Search } from 'lucide-react';
import { FilterState, Role, ProgramItem } from '../types';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  role: Role;
  allPrograms: ProgramItem[];
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  resetFilters,
  role,
  allPrograms,
}) => {
  if (!isOpen) return null;

  const uniqueYears = Array.from(new Set(allPrograms.map((p) => p.tahun))).sort((a: number, b: number) => b - a);
  const uniqueKomisi = Array.from(new Set(allPrograms.map((p) => p.komisi))).sort();
  const availableKabupaten = Array.from(new Set(allPrograms.map((p) => p.kabupaten))).sort();

  const availableKecamatan = Array.from(
    new Set(
      allPrograms
        .filter((p) => !filters.kabupaten || p.kabupaten === filters.kabupaten)
        .map((p) => p.kecamatan)
    )
  ).sort();

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
      if (key === 'kabupaten') {
        next.kecamatan = '';
        next.desa = '';
      } else if (key === 'kecamatan') {
        next.desa = '';
      }
      return next;
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs md:hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Drawer content */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="relative w-full max-w-xs bg-white h-full border-l border-slate-200 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 text-slate-800"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="bg-blue-600 text-white p-2 rounded-xl shadow-xs">
                  <Filter className="w-4 h-4" />
                </span>
                <h3 className="font-heading font-extrabold text-base text-slate-900">Filter Dashboard</h3>
              </div>
              <button
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Search Query Input for Mobile */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 tracking-wider">
                  Pencarian kata kunci
                </label>
                <form onSubmit={(e) => e.preventDefault()} className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    autoComplete="off"
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                    placeholder="Cari program, penerima, NIK..."
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl pl-9 pr-8 py-2 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all text-slate-800"
                  />
                  {filters.searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleFilterChange('searchQuery', '')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>
              </div>

              {/* Tahun */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 tracking-wider">
                  Tahun Anggaran
                </label>
                <select
                  value={filters.tahun}
                  onChange={(e) => handleFilterChange('tahun', e.target.value)}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:border-blue-500 text-slate-800"
                >
                  <option value="">Semua Tahun</option>
                  {uniqueYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Komisi */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 tracking-wider">
                  Komisi DPR RI
                </label>
                <select
                  value={filters.komisi}
                  onChange={(e) => handleFilterChange('komisi', e.target.value)}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:border-blue-500 text-slate-800"
                >
                  <option value="">Semua Komisi</option>
                  {uniqueKomisi.map((km) => (
                    <option key={km} value={km}>
                      {km}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kabupaten */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 tracking-wider">
                  Kabupaten
                </label>
                <select
                  value={filters.kabupaten}
                  onChange={(e) => handleFilterChange('kabupaten', e.target.value)}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:border-blue-500 text-slate-800"
                >
                  <option value="">Semua Kabupaten</option>
                  {availableKabupaten.map((kab) => (
                    <option key={kab} value={kab}>
                      {kab}
                    </option>
                  ))}
                </select>
              </div>

              {/* Kecamatan */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 tracking-wider">
                  Kecamatan
                </label>
                <select
                  value={filters.kecamatan}
                  onChange={(e) => handleFilterChange('kecamatan', e.target.value)}
                  disabled={!filters.kabupaten && availableKecamatan.length === 0}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:border-blue-500 text-slate-800 disabled:opacity-50"
                >
                  <option value="">Semua Kecamatan</option>
                  {availableKecamatan.map((kec) => (
                    <option key={kec} value={kec}>
                      {kec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desa */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 tracking-wider">
                  Desa / Kelurahan
                </label>
                <select
                  value={filters.desa}
                  onChange={(e) => handleFilterChange('desa', e.target.value)}
                  disabled={!filters.kecamatan && availableDesa.length === 0}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:border-blue-500 text-slate-800 disabled:opacity-50"
                >
                  <option value="">Semua Desa</option>
                  {availableDesa.map((ds) => (
                    <option key={ds} value={ds}>
                      {ds}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jenis Program */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 tracking-wider">
                  Jenis Program
                </label>
                <select
                  value={filters.jenisProgram}
                  onChange={(e) => handleFilterChange('jenisProgram', e.target.value)}
                  className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:border-blue-500 text-slate-800"
                >
                  <option value="">Semua Jenis</option>
                  <option value="Individu">Individu</option>
                  <option value="Kelompok">Kelompok</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1 tracking-wider">
                  Status Program
                </label>
                {role === 'Admin' ? (
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl p-2.5 bg-slate-50 focus:bg-white focus:border-blue-500 text-slate-800"
                  >
                    <option value="">Semua Status</option>
                    <option value="Selesai">Selesai (Hijau)</option>
                    <option value="Berjalan">Berjalan (Kuning)</option>
                    <option value="Perencanaan">Perencanaan (Biru)</option>
                    <option value="Belum Ada Program">Belum Ada (Abu)</option>
                  </select>
                ) : (
                  <div className="w-full text-xs font-bold border border-emerald-300 rounded-xl p-2.5 bg-emerald-50 text-emerald-800 flex items-center justify-between">
                    <span>Selesai (Ditampilkan)</span>
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 flex gap-2">
            <button
              onClick={resetFilters}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Terapkan
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


