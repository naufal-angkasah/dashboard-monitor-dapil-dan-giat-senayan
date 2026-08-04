import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { X, Upload, FileCheck, AlertCircle, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { ProgramItem } from '../types';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportData: (newPrograms: ProgramItem[]) => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  onImportData,
}) => {
  if (!isOpen) return null;

  const [fileName, setFileName] = useState<string>('');
  const [parsedCount, setParsedCount] = useState<number>(0);
  const [parsedData, setParsedData] = useState<ProgramItem[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setIsSuccess(false);

    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json<any>(ws);

        if (rawData.length === 0) {
          setErrorMsg('File Excel tidak berisi data atau format tidak valid.');
          return;
        }

        // Map excel row fields to ProgramItem structure
        const mappedItems: ProgramItem[] = rawData.map((row, idx) => {
          return {
            id: row['ID Program'] || row['id'] || `PRG-IMP-${Date.now().toString().slice(-4)}-${idx + 1}`,
            tahun: Number(row['Tahun'] || row['tahun']) || 2024,
            komisi: row['Komisi DPR RI'] || row['komisi'] || 'Komisi IV (Pertanian & Pangan)',
            namaProgram: row['Nama Program'] || row['namaProgram'] || 'Program Bantuan Aspirasi',
            jenisProgram: row['Jenis Program'] === 'Individu' ? 'Individu' : 'Kelompok',
            namaPenerima: row['Nama Penerima'] || row['namaPenerima'] || 'Kelompok Masyarakat',
            nik: String(row['NIK'] || row['nik'] || '3501000000000000'),
            provinsi: row['Provinsi'] || 'Jawa Timur',
            kabupaten: row['Kabupaten'] || row['kabupaten'] || 'Kab. Pacitan',
            kecamatan: row['Kecamatan'] || row['kecamatan'] || 'Pacitan',
            desa: row['Desa / Kelurahan'] || row['desa'] || 'Ploso',
            jumlahPenerima: Number(row['Jumlah Penerima'] || row['jumlahPenerima']) || 100,
            status: row['Status'] || row['status'] || 'Selesai',
            anggaran: Number(row['Anggaran'] || row['anggaran']) || 200000000,
            lat: Number(row['Latitude'] || row['lat']) || -8.196 + (Math.random() - 0.5) * 0.2,
            lng: Number(row['Longitude'] || row['lng']) || 111.097 + (Math.random() - 0.5) * 0.2,
            tanggalPelaksanaan: row['Tanggal Pelaksanaan'] || new Date().toISOString().slice(0, 10),
            deskripsi: row['Deskripsi'] || 'Impor data dari spreadsheet Excel.',
            penanggungJawab: row['Penanggung Jawab'] || 'Pengunggah Excel',
          };
        });

        setParsedData(mappedItems);
        setParsedCount(mappedItems.length);
      } catch (err: any) {
        setErrorMsg('Gagal membaca file Excel/CSV: ' + err.message);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleApplyImport = () => {
    if (parsedData.length === 0) return;
    onImportData(parsedData);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="bg-white border border-slate-200/80 p-6 rounded-2xl max-w-lg w-full shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-slate-100 pr-8">
            <span className="bg-blue-600 text-white p-2.5 rounded-xl shadow-xs font-bold">
              <Upload className="w-6 h-6" />
            </span>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">
                UPLOAD & IMPOR DATA EXCEL
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Mendukung format .xlsx, .xls, dan .csv
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-sans">
            {/* Drag Drop / Input Zone */}
            <div className="border-2 border-dashed border-blue-300 bg-blue-50/40 hover:bg-blue-50/80 p-6 rounded-2xl text-center flex flex-col items-center justify-center cursor-pointer transition-all relative">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="bg-blue-600 text-white p-3 rounded-2xl mb-2 shadow-xs">
                <FileSpreadsheet className="w-8 h-8 stroke-[2]" />
              </div>
              <p className="font-heading font-extrabold text-sm text-slate-900">
                Pilih File Excel / CSV
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Klik atau seret file ke area ini
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2 text-rose-800 font-medium text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Parsed Preview Info */}
            {parsedCount > 0 && !errorMsg && (
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1 text-emerald-950">
                <p className="font-heading font-extrabold text-sm text-emerald-900 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  File Berhasil Diverifikasi!
                </p>
                <p className="font-semibold">
                  📄 File: <strong className="text-emerald-900">{fileName}</strong>
                </p>
                <p className="font-semibold">
                  📊 Ditemukan <strong className="text-emerald-900">{parsedCount} baris data program</strong> siap dimasukkan ke dashboard.
                </p>
              </div>
            )}

            {/* Success Toast */}
            {isSuccess && (
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl flex items-center gap-2 text-blue-950 font-bold">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                <span>Berhasil mengimpor {parsedCount} data ke dashboard!</span>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 text-xs font-bold rounded-xl transition-colors"
            >
              Batal
            </button>
            {parsedCount > 0 && (
              <button
                onClick={handleApplyImport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold rounded-xl shadow-2xs cursor-pointer transition-colors"
              >
                Impor Data Sekarang
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
