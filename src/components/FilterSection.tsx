import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  X, 
  Check, 
  SlidersHorizontal,
  Calendar,
  Layers,
  Tag,
  Building,
  UserCheck
} from 'lucide-react';
import { ActivityItem, SenayanFilterState as SenayanFilterState } from '../types';

interface FilterSectionProps {
  filter: SenayanFilterState;
  setFilter: React.Dispatch<React.SetStateAction<SenayanFilterState>>;
  activities?: ActivityItem[];
  availableYears?: string[];
  availableJenisGiat?: string[];
  availableTemaGiat?: string[];
  availableSegmentasi?: string[];
  availableInstansi?: string[];
  onResetFilter?: () => void;
  activeCount?: number;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filter,
  setFilter,
  activities = [],
  availableYears: propYears,
  availableJenisGiat: propJenis,
  availableTemaGiat: propTema,
  availableSegmentasi: propSegmentasi,
  availableInstansi: propInstansi,
  onResetFilter: propReset,
  activeCount: propActiveCount,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const availableYears = useMemo(() => {
    if (propYears) return propYears;
    return Array.from(new Set(activities.map(a => a.tahun).filter(Boolean))).sort().reverse();
  }, [propYears, activities]);

  const availableJenisGiat = useMemo(() => {
    if (propJenis) return propJenis;
    return Array.from(new Set(activities.map(a => a.jenisGiat).filter(Boolean))).sort();
  }, [propJenis, activities]);

  const availableTemaGiat = useMemo(() => {
    if (propTema) return propTema;
    return Array.from(new Set(activities.map(a => a.temaGiat).filter(Boolean))).sort();
  }, [propTema, activities]);

  const availableSegmentasi = useMemo(() => {
    if (propSegmentasi) return propSegmentasi;
    return Array.from(new Set(activities.map(a => a.segmentasiPeserta).filter(Boolean))).sort();
  }, [propSegmentasi, activities]);

  const availableInstansi = useMemo(() => {
    if (propInstansi) return propInstansi;
    return Array.from(new Set(activities.map(a => a.asalInstansi).filter(Boolean))).sort();
  }, [propInstansi, activities]);

  const onResetFilter = () => {
    if (propReset) {
      propReset();
    } else {
      setFilter({
        tahun: 'ALL',
        kategoriGiat: 'ALL',
        jenisGiat: 'ALL',
        temaGiat: 'ALL',
        segmentasiPeserta: 'ALL',
        instansi: 'ALL',
        searchQuery: '',
        kabupaten: 'ALL',
      });
    }
  };

  const activeCount = useMemo(() => {
    if (typeof propActiveCount === 'number') return propActiveCount;
    let count = 0;
    if (filter.tahun !== 'ALL') count++;
    if (filter.kategoriGiat !== 'ALL') count++;
    if (filter.jenisGiat !== 'ALL') count++;
    if (filter.temaGiat !== 'ALL') count++;
    if (filter.segmentasiPeserta !== 'ALL') count++;
    if (filter.instansi !== 'ALL') count++;
    if (filter.searchQuery.trim() !== '') count++;
    return count;
  }, [propActiveCount, filter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white border border-slate-200/80 p-3.5 sm:p-4 mt-3 mb-3.5 rounded-2xl shadow-xs"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">
              Filter Data Monitoring Giat
            </h3>
            <p className="text-xs text-slate-500">
              Parameter tahun, instansi, tema, dan jenis kegiatan
            </p>
          </div>
        </div>

        {/* Search Input & Reset */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filter.searchQuery}
              onChange={handleSearchChange}
              placeholder="Cari kegiatan, instansi, tema..."
              className="w-full pl-9 pr-8 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-slate-900 transition-all"
            />
            {filter.searchQuery && (
              <button
                onClick={() => setFilter(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onResetFilter}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-all whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          {/* Mobile Drawer Trigger Button */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter ({activeCount})</span>
          </button>
        </div>
      </div>

      {/* Desktop Filter Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-6 gap-3">
        
        {/* Filter 1: Tahun */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> Tahun:
          </label>
          <select
            value={filter.tahun}
            onChange={(e) => setFilter(prev => ({ ...prev, tahun: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
          >
            <option value="ALL">Semua Tahun</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Filter 2: Kategori Giat */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-600" /> Kategori:
          </label>
          <select
            value={filter.kategoriGiat}
            onChange={(e) => setFilter(prev => ({ ...prev, kategoriGiat: e.target.value as any }))}
            className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="MPR">MPR RI</option>
            <option value="DPR">DPR RI</option>
            <option value="EBY Connect">EBY Connect</option>
          </select>
        </div>

        {/* Filter 3: Jenis Giat */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-blue-600" /> Jenis Giat:
          </label>
          <select
            value={filter.jenisGiat}
            onChange={(e) => setFilter(prev => ({ ...prev, jenisGiat: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
          >
            <option value="ALL">Semua Jenis</option>
            {availableJenisGiat.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Filter 4: Tema Giat */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-blue-600" /> Tema Giat:
          </label>
          <select
            value={filter.temaGiat}
            onChange={(e) => setFilter(prev => ({ ...prev, temaGiat: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
          >
            <option value="ALL">Semua Tema</option>
            {availableTemaGiat.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Filter 5: Segmentasi Peserta */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Segmentasi:
          </label>
          <select
            value={filter.segmentasiPeserta}
            onChange={(e) => setFilter(prev => ({ ...prev, segmentasiPeserta: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
          >
            <option value="ALL">Semua Segmentasi</option>
            {availableSegmentasi.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {/* Filter 6: Instansi */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-blue-600" /> Instansi:
          </label>
          <select
            value={filter.instansi}
            onChange={(e) => setFilter(prev => ({ ...prev, instansi: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
          >
            <option value="ALL">Semua Instansi</option>
            {availableInstansi.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Active Filter Chips */}
      {activeCount > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-medium text-xs text-slate-400">Filter Aktif:</span>
          {filter.tahun !== 'ALL' && (
            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 border border-blue-200/60 rounded-lg font-medium text-xs flex items-center gap-1.5">
              Tahun: {filter.tahun}
              <X className="w-3 h-3 cursor-pointer hover:text-blue-900" onClick={() => setFilter(p => ({ ...p, tahun: 'ALL' }))} />
            </span>
          )}
          {filter.kategoriGiat !== 'ALL' && (
            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 border border-indigo-200/60 rounded-lg font-medium text-xs flex items-center gap-1.5">
              Kat: {filter.kategoriGiat}
              <X className="w-3 h-3 cursor-pointer hover:text-indigo-900" onClick={() => setFilter(p => ({ ...p, kategoriGiat: 'ALL' }))} />
            </span>
          )}
          {filter.jenisGiat !== 'ALL' && (
            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 border border-emerald-200/60 rounded-lg font-medium text-xs flex items-center gap-1.5">
              Jenis: {filter.jenisGiat}
              <X className="w-3 h-3 cursor-pointer hover:text-emerald-900" onClick={() => setFilter(p => ({ ...p, jenisGiat: 'ALL' }))} />
            </span>
          )}
          {filter.temaGiat !== 'ALL' && (
            <span className="bg-amber-50 text-amber-700 px-2.5 py-1 border border-amber-200/60 rounded-lg font-medium text-xs flex items-center gap-1.5">
              Tema: {filter.temaGiat}
              <X className="w-3 h-3 cursor-pointer hover:text-amber-900" onClick={() => setFilter(p => ({ ...p, temaGiat: 'ALL' }))} />
            </span>
          )}
          {filter.segmentasiPeserta !== 'ALL' && (
            <span className="bg-purple-50 text-purple-700 px-2.5 py-1 border border-purple-200/60 rounded-lg font-medium text-xs flex items-center gap-1.5">
              Seg: {filter.segmentasiPeserta}
              <X className="w-3 h-3 cursor-pointer hover:text-purple-900" onClick={() => setFilter(p => ({ ...p, segmentasiPeserta: 'ALL' }))} />
            </span>
          )}
          {filter.instansi !== 'ALL' && (
            <span className="bg-orange-200 text-black px-2 py-0.5 border border-black font-mono font-bold text-[11px] flex items-center gap-1">
              Instansi: {filter.instansi}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFilter(p => ({ ...p, instansi: 'ALL' }))} />
            </span>
          )}
        </div>
      )}

      {/* MOBILE BOTTOM SHEET DRAWER */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-0 md:hidden">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full bg-white border-t border-slate-200 shadow-2xl p-5 max-h-[85vh] overflow-y-auto rounded-t-3xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base text-slate-900">
                    Filter Monitoring Mobile
                  </h3>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-sans text-xs">
                {/* Tahun */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahun Kegiatan:
                  </label>
                  <select
                    value={filter.tahun}
                    onChange={(e) => setFilter(prev => ({ ...prev, tahun: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl text-slate-900"
                  >
                    <option value="ALL">Semua Tahun</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Kategori Giat */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Giat:
                  </label>
                  <select
                    value={filter.kategoriGiat}
                    onChange={(e) => setFilter(prev => ({ ...prev, kategoriGiat: e.target.value as any }))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl text-slate-900"
                  >
                    <option value="ALL">Semua Kategori</option>
                    <option value="MPR">MPR RI</option>
                    <option value="DPR">DPR RI</option>
                    <option value="EBY Connect">EBY Connect</option>
                  </select>
                </div>

                {/* Jenis Giat */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kegiatan:
                  </label>
                  <select
                    value={filter.jenisGiat}
                    onChange={(e) => setFilter(prev => ({ ...prev, jenisGiat: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl text-slate-900"
                  >
                    <option value="ALL">Semua Jenis</option>
                    {availableJenisGiat.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                {/* Tema Giat */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tema Kegiatan:
                  </label>
                  <select
                    value={filter.temaGiat}
                    onChange={(e) => setFilter(prev => ({ ...prev, temaGiat: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl text-slate-900"
                  >
                    <option value="ALL">Semua Tema</option>
                    {availableTemaGiat.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                {/* Segmentasi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Segmentasi Peserta:
                  </label>
                  <select
                    value={filter.segmentasiPeserta}
                    onChange={(e) => setFilter(prev => ({ ...prev, segmentasiPeserta: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl text-slate-900"
                  >
                    <option value="ALL">Semua Segmentasi</option>
                    {availableSegmentasi.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                {/* Instansi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asal Instansi:
                  </label>
                  <select
                    value={filter.instansi}
                    onChange={(e) => setFilter(prev => ({ ...prev, instansi: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl text-slate-900"
                  >
                    <option value="ALL">Semua Instansi</option>
                    {availableInstansi.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    onClick={onResetFilter}
                    className="flex-1 bg-slate-100 text-slate-700 py-2.5 font-semibold rounded-xl text-xs"
                  >
                    Reset Filter
                  </button>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex-1 bg-blue-600 text-white py-2.5 font-semibold rounded-xl shadow-xs text-xs"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


