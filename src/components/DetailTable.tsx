import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  CalendarClock, 
  HelpCircle,
  Sparkles,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { ProgramItem, Role } from '../types';
import { getStatusColor } from './MapVisualization';
import { CustomTooltip } from './CustomTooltip';

interface DetailTableProps {
  programs: ProgramItem[];
  role: Role;
  onSelectProgram: (program: ProgramItem) => void;
  onEditProgram?: (program: ProgramItem) => void;
  onDeleteProgram?: (id: string) => void;
}

export const DetailTable: React.FC<DetailTableProps> = ({
  programs,
  role,
  onSelectProgram,
  onEditProgram,
  onDeleteProgram,
}) => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);

  // Reset page when dataset size changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [programs.length]);

  const totalPages = Math.ceil(programs.length / itemsPerPage) || 1;

  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return programs.slice(start, start + itemsPerPage);
  }, [programs, currentPage, itemsPerPage]);

  // Excel Export Handler using 'xlsx' library
  const handleExportExcel = () => {
    const exportData = programs.map((p, idx) => ({
      No: idx + 1,
      'ID Program': p.id,
      Tahun: p.tahun,
      'Komisi DPR RI': p.komisi,
      'Nama Program': p.namaProgram,
      'Jenis Program': p.jenisProgram,
      'Nama Penerima': p.namaPenerima,
      NIK: p.nik,
      Provinsi: p.provinsi,
      Kabupaten: p.kabupaten,
      Kecamatan: p.kecamatan,
      'Desa / Kelurahan': p.desa,
      'Jumlah Penerima': p.jumlahPenerima,
      Status: p.status,
      'Anggaran (IDR)': p.anggaran,
      'Tanggal Pelaksanaan': p.tanggalPelaksanaan,
      Deskripsi: p.deskripsi,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Program Dapil');

    // Auto-fit column widths
    const max_width = exportData.reduce((w, r) => Math.max(w, r['Nama Program'].length), 10);
    worksheet['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 8 }, { wch: 25 }, { wch: max_width }, { wch: 12 }];

    XLSX.writeFile(workbook, `Laporan_Program_Dapil_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // PDF Export Handler using 'jspdf'
  const handleExportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('LAPORAN MONITORING PROGRAM ASPIRASI DAPIL JATIM VII', 14, 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')} | Total Program: ${programs.length}`, 14, 22);

    // Simple table text rendering
    let startY = 30;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('No | ID | Program | Kabupaten | Kecamatan | Desa | Penerima | Status', 14, startY);
    doc.line(14, startY + 2, 280, startY + 2);

    startY += 8;
    doc.setFont('helvetica', 'normal');

    programs.slice(0, 25).forEach((p, i) => {
      if (startY > 185) {
        doc.addPage();
        startY = 20;
      }
      const line = `${i + 1}. | ${p.id} | ${p.namaProgram.slice(0, 28)} | ${p.kabupaten} | ${p.kecamatan} | ${p.desa} | ${p.jumlahPenerima} | ${p.status}`;
      doc.text(line, 14, startY);
      startY += 6;
    });

    if (programs.length > 25) {
      doc.text(`... dan ${programs.length - 25} program lainnya terlampir di file Excel.`, 14, startY + 4);
    }

    doc.save(`Laporan_Dapil_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Print Window
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-sm mb-6"
    >
      {/* Top Header & Export Buttons */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 text-white p-2 rounded-lg shadow-sm">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-lg text-slate-900 flex items-center gap-2">
              TABEL DETAIL PROGRAM DAPIL
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                {programs.length} Data
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Detail realisasi per program hingga tingkat Desa/Kelurahan
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportPDF}
            className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrint}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            title="Cetak Laporan"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak</span>
          </motion.button>
        </div>
      </div>

      {/* Table Container styled like Recent Agent Execution Audit Log in image.png */}
      <div className="relative overflow-x-auto border border-slate-200/80 rounded-2xl shadow-2xs bg-white">
        <table className="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr className="bg-slate-50/90 text-slate-500 font-heading uppercase text-[11px] font-bold tracking-wider border-b border-slate-200/80">
              <th className="p-3 border-r border-slate-200/50 w-12 text-center">No</th>
              <th className="p-3 border-r border-slate-200/50 min-w-[200px]">Nama Program & Komisi</th>
              <th className="p-3 border-r border-slate-200/50 min-w-[95px]">Tanggal</th>
              <th className="p-3 border-r border-slate-200/50 min-w-[95px]">Jenis</th>
              <th className="p-3 border-r border-slate-200/50 min-w-[120px]">Kabupaten</th>
              <th className="p-3 border-r border-slate-200/50 min-w-[110px]">Kecamatan</th>
              <th className="p-3 border-r border-slate-200/50 min-w-[110px]">Desa / Kel.</th>
              <th className="p-3 border-r border-slate-200/50 min-w-[100px] text-right">Penerima</th>
              <th className="p-3 border-r border-slate-200/50 min-w-[100px] text-center">Status</th>
              <th className="p-3 text-center min-w-[90px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 font-medium text-slate-800">
            {paginatedPrograms.length > 0 ? (
              paginatedPrograms.map((p, index) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    <td className="p-3 border-r border-slate-100 text-center font-bold text-slate-400">
                      {globalIndex}
                    </td>
                    <td className="p-3 border-r border-slate-100 font-bold text-slate-900">
                      <CustomTooltip
                        content={p.namaProgram}
                        category={p.komisi}
                        badge={p.jenisProgram}
                      >
                        <span className="font-heading text-sm group-hover:text-blue-600 transition-colors cursor-pointer">
                          {p.namaProgram}
                        </span>
                      </CustomTooltip>
                      <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                        🏛️ {p.komisi}
                      </div>
                    </td>
                    <td className="p-3 border-r border-slate-100 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {p.tanggalPelaksanaan || '2024-05-15'}
                    </td>
                    <td className="p-3 border-r border-slate-100">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${p.jenisProgram === 'Individu' ? 'bg-blue-50 text-blue-700 border border-blue-200/80' : 'bg-cyan-50 text-cyan-700 border border-cyan-200/80'}`}>
                        {p.jenisProgram}
                      </span>
                    </td>

                    <td className="p-3 border-r border-slate-100 font-semibold text-slate-800">{p.kabupaten}</td>
                    <td className="p-3 border-r border-slate-100 text-slate-600">{p.kecamatan}</td>
                    <td className="p-3 border-r border-slate-100 text-slate-600">{p.desa}</td>
                    <td className="p-3 border-r border-slate-100 text-right font-black text-blue-700">
                      {p.jumlahPenerima.toLocaleString('id-ID')} Org
                    </td>
                    <td className="p-3 border-r border-slate-100 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        p.status === 'Selesai' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.status === 'Berjalan'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onSelectProgram(p)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-1.5 rounded border border-slate-300 transition-colors cursor-pointer"
                          title="Lihat Detail Program"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {role === 'Admin' && onEditProgram && (
                          <button
                            onClick={() => onEditProgram(p)}
                            className="bg-sky-50 hover:bg-sky-100 text-sky-700 p-1.5 rounded border border-sky-300 transition-colors cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {role === 'Admin' && onDeleteProgram && (
                          <button
                            onClick={() => onDeleteProgram(p.id)}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-1.5 rounded border border-rose-300 transition-colors cursor-pointer"
                            title="Hapus Program"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="p-8 text-center text-slate-500 font-medium bg-slate-50">
                  Tidak ada data program yang memenuhi kriteria filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs font-medium text-slate-700">
        <div className="flex items-center gap-2">
          <span>Menampilkan {paginatedPrograms.length} dari {programs.length} program</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="border border-slate-300 rounded p-1 bg-white text-xs font-semibold text-slate-800"
          >
            <option value={5}>5 per halaman</option>
            <option value={8}>8 per halaman</option>
            <option value={15}>15 per halaman</option>
            <option value={30}>30 per halaman</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="bg-white border border-slate-300 hover:bg-slate-100 p-1.5 rounded-lg disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="bg-slate-900 text-white px-3 py-1 rounded-lg font-bold">
            Halaman {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-white border border-slate-300 hover:bg-slate-100 p-1.5 rounded-lg disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
