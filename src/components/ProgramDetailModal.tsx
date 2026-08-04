import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Users, 
  Calendar, 
  Building2, 
  DollarSign, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  FileText,
  Printer,
  Sparkles
} from 'lucide-react';
import { ProgramItem } from '../types';
import { getStatusColor } from './MapVisualization';

interface ProgramDetailModalProps {
  program: ProgramItem | null;
  onClose: () => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({ program, onClose }) => {
  if (!program) return null;

  const colorInfo = getStatusColor(program.status);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="bg-white border border-slate-200/80 p-6 rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-4 pb-3 border-b border-slate-100 pr-10">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-slate-900 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-md shadow-2xs">
                {program.id}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase border ${colorInfo.badgeClass}`}>
                Status: {program.status}
              </span>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Tahun {program.tahun}
              </span>
            </div>
            <h3 className="font-heading font-black text-xl text-slate-900 leading-tight tracking-tight mt-1">
              {program.namaProgram}
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              {program.komisi}
            </p>
          </div>

          {/* Content Body */}
          <div className="space-y-4">
            {/* Location Hierarchy Box */}
            <div className="bg-blue-50/80 border border-blue-200/80 p-4 rounded-2xl shadow-2xs">
              <p className="font-heading font-extrabold text-xs uppercase text-blue-900 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                Lokasi Realisasi Program:
              </p>
              <div className="text-xs font-bold text-slate-800 flex flex-wrap items-center gap-2">
                <span className="bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">{program.provinsi}</span>
                <span className="text-blue-400">➔</span>
                <span className="bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">{program.kabupaten}</span>
                <span className="text-blue-400">➔</span>
                <span className="bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">Kec. {program.kecamatan}</span>
                <span className="text-blue-400">➔</span>
                <span className="bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">Desa {program.desa}</span>
              </div>
            </div>

            {/* Recipient & Budget Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Penerima Manfaat</p>
                <p className="font-heading font-extrabold text-base text-slate-900 mt-0.5">
                  {program.namaPenerima}
                </p>
                <div className="mt-2 text-xs font-medium text-slate-600 space-y-1">
                  <p>👥 <strong>Jumlah:</strong> {program.jumlahPenerima.toLocaleString('id-ID')} Orang / Kelompok ({program.jenisProgram})</p>
                  <p>🆔 <strong>NIK / Identitas:</strong> {program.nik}</p>
                </div>
              </div>

              <div className="bg-slate-50/80 border border-slate-200/80 p-3.5 rounded-2xl shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nilai Anggaran Aspirasi</p>
                <p className="font-heading font-extrabold text-base text-emerald-600 mt-0.5">
                  Rp {program.anggaran.toLocaleString('id-ID')}
                </p>
                <div className="mt-2 text-xs font-medium text-slate-600 space-y-1">
                  <p>📅 <strong>Tanggal:</strong> {program.tanggalPelaksanaan}</p>
                  <p>👤 <strong>Penanggung Jawab:</strong> {program.penanggungJawab || 'Tim Rumah Aspirasi'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-2xl shadow-2xs">
              <p className="font-heading font-extrabold text-xs uppercase text-slate-700 mb-1">
                Deskripsi Realisasi Program:
              </p>
              <p className="text-xs font-medium text-slate-600 leading-relaxed">
                {program.deskripsi}
              </p>
            </div>

            {/* Coordinates */}
            <div className="bg-slate-100/80 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>📍 Titik Koordinat GPS: {program.lat}, {program.lng}</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                Terverifikasi
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              onClick={() => window.print()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-4 py-2 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Detail</span>
            </button>
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 text-xs rounded-xl shadow-2xs cursor-pointer transition-colors"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
