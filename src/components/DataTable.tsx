import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileSpreadsheet, 
  Printer, 
  Eye, 
  Search, 
  ArrowUpDown, 
  Sparkles, 
  CheckCircle,
  Clock,
  Layers,
  ChevronLeft,
  ChevronRight,
  Download,
  QrCode
} from 'lucide-react';
import { ActivityItem } from '../types';
import { CustomTooltip } from './CustomTooltip';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DataTableProps {
  activities: ActivityItem[];
  onSelectActivity: (activity: ActivityItem) => void;
  onGenerateAbsenForActivity?: (activity: ActivityItem) => void;
  userRole: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  activities = [],
  onSelectActivity,
  onGenerateAbsenForActivity,
  userRole,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof ActivityItem>('tanggal');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sorting
  const sortedActivities = [...activities].sort((a, b) => {
    let aVal = a[sortField] || '';
    let bVal = b[sortField] || '';

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }

    return sortOrder === 'asc' 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  // Pagination
  const totalPages = Math.ceil(sortedActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = sortedActivities.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof ActivityItem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    const exportData = activities.map((item, idx) => ({
      No: idx + 1,
      ID: item.id,
      Tahun: item.tahun,
      Kategori: item.kategoriGiat,
      'Jenis Giat': item.jenisGiat,
      'Tema Giat': item.temaGiat,
      'Nama Kegiatan': item.namaGiat,
      'Asal Instansi': item.asalInstansi,
      'Segmentasi Peserta': item.segmentasiPeserta,
      'Jumlah Peserta': item.jumlahPeserta,
      Kabupaten: item.kabupaten || 'Pacitan',
      Lokasi: item.lokasi,
      Tanggal: item.tanggal,
      'Penanggung Jawab': item.namaPeserta,
      Kontak: item.kontak,
      Sumber: item.source,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Giat_Senayan');
    XLSX.writeFile(workbook, `Report_Giat_Senayan_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(14);
    doc.text('LAPORAN HASIL MONITORING GIAT NASIONAL (SENAYAN)', 14, 15);
    doc.setFontSize(9);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')} | Total: ${activities.length} Kegiatan`, 14, 22);

    const tableColumn = ['No', 'Tahun', 'Kategori', 'Nama Kegiatan', 'Instansi', 'Segmentasi', 'Peserta', 'Lokasi & Tanggal'];
    const tableRows = activities.map((item, idx) => [
      idx + 1,
      item.tahun,
      item.kategoriGiat,
      item.namaGiat.length > 35 ? item.namaGiat.substring(0, 35) + '...' : item.namaGiat,
      item.asalInstansi,
      item.segmentasiPeserta,
      item.jumlahPeserta.toLocaleString('id-ID'),
      `${item.lokasi} (${item.tanggal})`
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [251, 191, 36], fontSize: 8 },
      bodyStyles: { fontSize: 7 },
    });

    doc.save(`Laporan_Monitoring_Senayan_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white border border-slate-200/80 p-5 mb-8 rounded-2xl shadow-xs"
    >
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-2">
            <span>Daftar Giat Nasional & Presensi Digital</span>
            <span className="bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {activities.length} Data
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Daftar kegiatan ter-sinkronisasi dengan Firestore & Google Spreadsheet
          </p>
        </div>

        {/* EXPORT BUTTONS */}
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-all shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 text-xs font-semibold rounded-xl cursor-pointer transition-all shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </motion.button>
        </div>
      </div>

      {/* TABLE CONTAINER WITH STICKY COLUMN FOR MOBILE */}
      <div className="overflow-x-auto relative border border-slate-200/80 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <th className="p-3 w-10 text-center">No</th>
              
              <th 
                onClick={() => handleSort('namaGiat')}
                className="p-3 min-w-[220px] sticky left-0 bg-slate-50 z-10 cursor-pointer hover:text-blue-600"
              >
                <div className="flex items-center justify-between">
                  <span>Nama Kegiatan</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th 
                onClick={() => handleSort('tahun')}
                className="p-3 border-r border-slate-200/60 min-w-[70px] text-center cursor-pointer hover:text-blue-600"
              >
                Tahun
              </th>

              <th 
                onClick={() => handleSort('kategoriGiat')}
                className="p-3 border-r border-slate-200/60 min-w-[90px] text-center cursor-pointer hover:text-blue-600"
              >
                Kategori
              </th>

              <th className="p-3 border-r border-slate-200/60 min-w-[130px]">Jenis Giat</th>
              <th className="p-3 border-r border-slate-200/60 min-w-[130px]">Tema Giat</th>
              <th className="p-3 border-r border-slate-200/60 min-w-[150px]">Asal Instansi</th>
              <th className="p-3 border-r border-slate-200/60 min-w-[120px]">Segmentasi</th>
              
              <th 
                onClick={() => handleSort('jumlahPeserta')}
                className="p-3 border-r border-slate-200/60 min-w-[110px] text-right cursor-pointer hover:text-blue-600"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Peserta</span>
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>

              <th className="p-3 border-r border-slate-200/60 min-w-[110px] text-center">Sumber</th>
              <th className="p-3 min-w-[110px] text-center">Aksi & Absen</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 font-sans">
            {paginatedActivities.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-8 text-center text-slate-500 font-mono text-xs">
                  Tidak ada kegiatan yang ditemukan. Silakan sesuaikan filter pencarian Anda.
                </td>
              </tr>
            ) : (
              paginatedActivities.map((activity, index) => (
                <tr 
                  key={activity.id}
                  className="hover:bg-slate-100 transition-colors border-b border-slate-200"
                >
                  <td className="p-3 font-mono font-bold text-center border-r border-slate-200 text-slate-600">
                    {startIndex + index + 1}
                  </td>

                  <td className="p-3 font-bold text-slate-900 border-r border-slate-200 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] max-w-xs">
                    <CustomTooltip
                      content={activity.namaGiat}
                      category={activity.kategoriGiat}
                      badge={activity.temaGiat}
                    >
                      <span className="hover:underline cursor-pointer hover:text-blue-700 line-clamp-2" onClick={() => onSelectActivity(activity)}>
                        {activity.namaGiat}
                      </span>
                    </CustomTooltip>
                    <span className="block text-[11px] font-mono font-normal text-slate-500 mt-0.5">
                      {activity.lokasi} • {activity.tanggal}
                    </span>
                  </td>

                  <td className="p-3 font-mono font-bold text-center border-r border-slate-200 text-slate-800">
                    {activity.tahun}
                  </td>

                  <td className="p-3 text-center border-r border-slate-200/60">
                    <span className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs ${
                      activity.kategoriGiat === 'MPR'
                        ? 'bg-blue-600 text-white'
                        : activity.kategoriGiat === 'DPR'
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}>
                      {activity.kategoriGiat}
                    </span>
                  </td>

                  <td className="p-3 font-semibold text-slate-800 border-r border-slate-200/60 text-[11px]">
                    {activity.jenisGiat}
                  </td>

                  <td className="p-3 text-slate-700 border-r border-slate-200/60 text-[11px]">
                    {activity.temaGiat}
                  </td>

                  <td className="p-3 font-medium text-slate-900 border-r border-slate-200/60 text-[11px]">
                    {activity.asalInstansi}
                  </td>

                  <td className="p-3 border-r border-slate-200/60">
                    <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full border border-slate-200/80">
                      {activity.segmentasiPeserta}
                    </span>
                  </td>

                  <td className="p-3 font-bold text-slate-900 text-right border-r border-slate-200/60 font-sans text-sm tracking-tight">
                    {activity.jumlahPeserta.toLocaleString('id-ID')}
                  </td>

                  <td className="p-3 text-center border-r border-slate-200/60">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50/80 text-emerald-700 px-2.5 py-0.5 border border-emerald-300/80 rounded-full shadow-xs">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {activity.source}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onSelectActivity(activity)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white p-2 border border-blue-200 rounded-xl cursor-pointer transition-all shadow-xs"
                        title="Lihat Detail & Notulensi"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {onGenerateAbsenForActivity && (
                        <button
                          onClick={() => onGenerateAbsenForActivity(activity)}
                          className="bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white p-2 border border-amber-200 rounded-xl cursor-pointer transition-all shadow-xs"
                          title="Generate QR & Link Absen"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="text-slate-600">
          Menampilkan {paginatedActivities.length > 0 ? startIndex + 1 : 0} - {Math.min(startIndex + itemsPerPage, sortedActivities.length)} dari {sortedActivities.length} data kegiatan
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 bg-slate-100 text-slate-800 border border-slate-900 rounded disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-bold px-2 text-slate-900">
            Halaman {currentPage} dari {totalPages || 1}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 bg-slate-100 text-slate-800 border border-slate-900 rounded disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

