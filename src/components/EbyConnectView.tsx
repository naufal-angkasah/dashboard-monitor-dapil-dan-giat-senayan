import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Award, 
  Users, 
  Calendar, 
  Search, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Building2,
  Phone,
  Eye
} from 'lucide-react';
import { EbyConnectProgram } from '../types';
import * as XLSX from 'xlsx';

interface EbyConnectViewProps {
  programs: EbyConnectProgram[];
  onOpenDetailProgram?: (program: EbyConnectProgram) => void;
  onUpdatePrograms?: (programs: EbyConnectProgram[]) => void;
  globalSearchQuery: string;
  onGlobalSearchChange: (q: string) => void;
  userRole?: string;
}

export const EbyConnectView: React.FC<EbyConnectViewProps> = ({ 
  programs,
  onOpenDetailProgram,
  onUpdatePrograms,
  globalSearchQuery,
  onGlobalSearchChange,
  userRole
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedJenisProgram, setSelectedJenisProgram] = useState<string>('ALL');

  // Extract unique filter options
  const safePrograms = programs || [];
  const availableYears = Array.from(new Set(safePrograms.map(p => p.tahun))).sort().reverse();
  const availableJenis = Array.from(new Set(safePrograms.map(p => p.jenisProgram))).sort();

  // Filter programs
  const filteredPrograms = safePrograms.filter(p => {
    const matchYear = selectedYear === 'ALL' || p.tahun === selectedYear;
    const matchJenis = selectedJenisProgram === 'ALL' || p.jenisProgram === selectedJenisProgram;
    const matchSearch = globalSearchQuery === '' || 
      p.namaProgram.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      p.penerima.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      p.instansiMitra.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      p.wilayah.toLowerCase().includes(globalSearchQuery.toLowerCase());

    return matchYear && matchJenis && matchSearch;
  });

  // Totals
  const totalPrograms = filteredPrograms.length;
  const totalPenerima = filteredPrograms.reduce((acc, p) => acc + p.jumlahPenerima, 0);

  // Export Excel
  const handleExportExcel = () => {
    const exportData = filteredPrograms.map((p, index) => ({
      'No': index + 1,
      'ID Program': p.id,
      'Tahun': p.tahun,
      'Jenis Program': p.jenisProgram,
      'Nama Program': p.namaProgram,
      'Sasaran Penerima': p.penerima,
      'Jumlah Penerima': p.jumlahPenerima,
      'Wilayah Penyaluran': p.wilayah,
      'Status Penyaluran': p.status,
      'Instansi Mitra': p.instansiMitra,
      'Tanggal Pelaksanaan': p.tanggal,
      'Kontak Penanggung Jawab': p.kontak
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan EBY Connect');
    XLSX.writeFile(workbook, `Laporan_EBY_Connect_${selectedYear}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER FOR MODE EBY CONNECT */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 border border-emerald-500/20 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md text-amber-300 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full">
                EBY CONNECT
              </span>
              <span className="bg-emerald-900/40 text-emerald-100 text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full">
                Program Bantuan Direct
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Dashboard Program EBY Connect Nasional
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              Monitoring penyaluran Beasiswa KIP-K, LPDP, Bus Mudik, Bantuan UMKM, & Beasiswa Santri
            </p>
          </div>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-emerald-900 px-4 py-2.5 text-xs font-semibold rounded-xl shadow-xs cursor-pointer shrink-0 transition-all"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
          <span>Export Excel EBY</span>
        </button>
      </div>

      {/* FILTER SIMPLE SECTION */}
      <div className="bg-white p-5 border border-slate-200/80 shadow-xs rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Filter 1: Jenis Program */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-600" /> Filter Jenis Program:
            </label>
            <select
              value={selectedJenisProgram}
              onChange={(e) => setSelectedJenisProgram(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 transition-all"
            >
              <option value="ALL">Semua Jenis Program</option>
              {availableJenis.map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>
          </div>

          {/* Filter 2: Tahun */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Filter Tahun:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 transition-all"
            >
              <option value="ALL">Semua Tahun</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-emerald-600" /> Pencarian Program:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={globalSearchQuery}
                onChange={(e) => onGlobalSearchChange(e.target.value)}
                placeholder="Cari program, mitra, wilayah..."
                className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 transition-all"
              />
            </div>
          </div>

        </div>
      </div>

      {/* KPI SUMMARY SIMPLE (Total Program & Total Penerima) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Total Program */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white p-5 border border-slate-200/80 shadow-xs flex items-center justify-between rounded-2xl"
        >
          <div>
            <span className="text-xs font-medium text-slate-400">
              Total Program Terdata
            </span>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {totalPrograms} <span className="text-sm font-normal text-slate-500">Program</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Program bantuan pendidikan & kemasyarakatan
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Total Penerima */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-white p-5 border border-slate-200/80 shadow-xs flex items-center justify-between rounded-2xl"
        >
          <div>
            <span className="text-xs font-medium text-slate-400">
              Total Penerima Manfaat
            </span>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">
              {totalPenerima.toLocaleString('id-ID')}{' '}
              <span className="text-sm font-normal text-slate-500">Orang / KK</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Terverifikasi oleh kementerian mitra
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </motion.div>

      </div>

      {/* TABEL DETAIL EBY CONNECT */}
      <div className="bg-white border border-slate-200/80 shadow-xs p-5 rounded-2xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
            <h3 className="font-bold text-sm text-slate-900">
              Tabel Detail Program EBY Connect
            </h3>
          </div>
          <span className="text-xs bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 text-slate-600 font-semibold rounded-full">
            Menampilkan {filteredPrograms.length} data
          </span>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto relative border border-slate-200/80 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3 min-w-[200px] sticky left-0 bg-slate-50 z-10">
                  Nama Program
                </th>
                <th className="p-3 min-w-[140px]">Jenis Program</th>
                <th className="p-3 min-w-[80px] text-center">Tahun</th>
                <th className="p-3 min-w-[160px]">Sasaran Penerima</th>
                <th className="p-3 min-w-[120px] text-right">Jumlah Penerima</th>
                <th className="p-3 min-w-[140px]">Status Penyaluran</th>
                <th className="p-3 min-w-[180px]">Instansi Mitra</th>
                <th className="p-3 min-w-[100px] text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500 font-mono text-xs">
                    Tidak ada program EBY Connect yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program, index) => (
                  <tr 
                    key={program.id}
                    className="hover:bg-slate-100/90 transition-colors border-b border-slate-200"
                  >
                    <td className="p-3 font-semibold text-center border-r border-slate-200/60 text-slate-500 text-xs">
                      {index + 1}
                    </td>
                    
                    {/* Sticky Column for Mobile */}
                    <td className="p-3 font-bold text-slate-900 border-r border-slate-200/60 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                      <div>
                        {program.namaProgram}
                        <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                          ID: {program.id} • {program.tanggal}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 font-semibold border-r border-slate-200/60">
                      <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 border border-emerald-200 rounded-full">
                        {program.jenisProgram}
                      </span>
                    </td>

                    <td className="p-3 font-bold text-center border-r border-slate-200/60 text-slate-800">
                      {program.tahun}
                    </td>

                    <td className="p-3 text-slate-800 border-r border-slate-200/60 font-medium">
                      {program.penerima}
                    </td>

                    <td className="p-3 font-bold text-slate-900 text-right border-r border-slate-200/60 font-sans text-sm tracking-tight">
                      {program.jumlahPenerima.toLocaleString('id-ID')} Orang
                    </td>

                    <td className="p-3 border-r border-slate-200/60">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        program.status === 'Penyaluran Selesai' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : program.status === 'Proses Penyaluran'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {program.status}
                      </span>
                    </td>

                    <td className="p-3 text-slate-700 border-r border-slate-200/60 text-[11px]">
                      {program.instansiMitra}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => onOpenDetailProgram && onOpenDetailProgram(program)}
                        className="bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white p-2 rounded-lg cursor-pointer transition-colors"
                        title="Lihat Detail Program"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
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

