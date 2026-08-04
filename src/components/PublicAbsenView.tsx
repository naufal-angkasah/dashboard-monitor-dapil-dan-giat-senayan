import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  CheckCircle2, 
  UserCheck, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Phone, 
  FileText, 
  ArrowLeft,
  QrCode,
  ShieldCheck,
  Building
} from 'lucide-react';
import { ActivityItem, AttendanceRecord } from '../types';

interface PublicAbsenViewProps {
  activity: ActivityItem;
  onBackToDashboard: () => void;
  onSubmitAttendance: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
}

export const PublicAbsenView: React.FC<PublicAbsenViewProps> = ({
  activity,
  onBackToDashboard,
  onSubmitAttendance,
}) => {
  const [formData, setFormData] = useState({
    namaPeserta: '',
    nik: '',
    kontak: '',
    instansi: '',
    jabatan: '',
    catatan: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<AttendanceRecord | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaPeserta || !formData.instansi) {
      alert('Mohon isi Nama Lengkap dan Asal Instansi Anda.');
      return;
    }

    setIsSubmitting(true);

    try {
      const record: Omit<AttendanceRecord, 'id'> = {
        activityId: activity.id,
        namaPeserta: formData.namaPeserta,
        nik: formData.nik,
        kontak: formData.kontak,
        instansi: formData.instansi,
        jabatan: formData.jabatan,
        waktuHadir: new Date().toLocaleString('id-ID'),
        statusKehadiran: 'Hadir',
        catatan: formData.catatan,
      };

      await onSubmitAttendance(record);

      const generated: AttendanceRecord = {
        ...record,
        id: `ATT-${Date.now()}`,
      };

      setSubmittedRecord(generated);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Gagal mengirimkan presensi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Top Header Bar */}
      <div className="w-full max-w-lg mb-4 flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 bg-slate-800 text-amber-300 hover:bg-slate-700 px-3 py-1.5 rounded-md text-xs font-mono font-bold border border-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Admin</span>
        </button>

        <span className="text-[10px] font-mono bg-blue-900 text-amber-200 px-2 py-1 rounded border border-blue-700">
          Form Presensi Digital Resmi
        </span>
      </div>

      {/* Main Wedding-Invitation Style Event Pass Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg bg-white text-slate-900 rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden"
      >
        {/* Banner Top Decorative Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 text-center relative">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md text-white mx-auto rounded-full flex items-center justify-center font-bold mb-3 shadow-xs">
            <Building2 className="w-6 h-6" />
          </div>

          <div className="inline-block bg-white/20 text-white font-semibold text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full mb-1">
            PRESENSI DIGITAL • KEBANGSAAN
          </div>

          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white mt-1">
            {activity.namaGiat}
          </h2>

          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-mono text-amber-200">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-400" /> {activity.tanggal}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> {activity.lokasi}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center pb-2 border-b border-slate-200">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Selamat Datang! Silakan Isi Data Kehadiran Peserta
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Data presensi ini tersimpan resmi di database regional
                </p>
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                  Nama Lengkap & Gelar <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dr. Budi Santoso, S.T., M.M."
                  value={formData.namaPeserta}
                  onChange={e => setFormData({ ...formData, namaPeserta: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-900 text-xs font-bold p-2.5 rounded focus:outline-none focus:bg-amber-50 focus:border-blue-700"
                />
              </div>

              {/* Asal Instansi */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                  Asal Instansi / Organisasi <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Universitas Indonesia / HIPMI / Karang Taruna"
                  value={formData.instansi}
                  onChange={e => setFormData({ ...formData, instansi: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-900 text-xs font-bold p-2.5 rounded focus:outline-none focus:bg-amber-50 focus:border-blue-700"
                />
              </div>

              {/* Jabatan & NIK Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                    Jabatan / Posisi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ketua / Anggota"
                    value={formData.jabatan}
                    onChange={e => setFormData({ ...formData, jabatan: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-900 text-xs font-bold p-2.5 rounded focus:outline-none focus:bg-amber-50 focus:border-blue-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                    No. Telepon / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.kontak}
                    onChange={e => setFormData({ ...formData, kontak: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-900 text-xs font-bold p-2.5 rounded focus:outline-none focus:bg-amber-50 focus:border-blue-700"
                  />
                </div>
              </div>

              {/* Catatan / Aspirasi */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                  Pesan / Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Aspirasi atau masukan untuk kegiatan..."
                  value={formData.catatan}
                  onChange={e => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full bg-slate-50 border-2 border-slate-900 text-xs p-2.5 rounded focus:outline-none focus:bg-amber-50 focus:border-blue-700"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Mengirim Presensi...</span>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Konfirmasi Kehadiran Saya</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Terverifikasi Sistem Presensi Regional</span>
              </div>
            </form>
          ) : (
            /* Digital Event Pass Ticket Success Card */
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="bg-emerald-100 text-emerald-800 font-semibold text-[10px] uppercase px-3 py-1 rounded-full">
                  PRESENSI BERHASIL TERCATAT
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  Terima Kasih, {submittedRecord?.namaPeserta}!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kehadiran Anda di kegiatan ini telah terdaftar secara otomatis di sistem database regional.
                </p>
              </div>

              {/* E-Ticket Pass Box */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left space-y-2">
                <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                  <span className="font-extrabold text-xs text-slate-900">DIGITAL EVENT PASS</span>
                  <span className="font-mono text-[10px] bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                    {submittedRecord?.id}
                  </span>
                </div>

                <div className="text-xs space-y-1 font-mono">
                  <div><strong className="text-slate-600">Peserta:</strong> {submittedRecord?.namaPeserta}</div>
                  <div><strong className="text-slate-600">Instansi:</strong> {submittedRecord?.instansi}</div>
                  <div><strong className="text-slate-600">Waktu Presensi:</strong> {submittedRecord?.waktuHadir}</div>
                  <div><strong className="text-slate-600">Status:</strong> <span className="text-emerald-700 font-bold">Hadir Verifikasi</span></div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={onBackToDashboard}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded border border-slate-900 cursor-pointer"
                >
                  Kembali ke Dashboard Utama
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-3 text-center border-t border-slate-300 text-[10px] font-mono text-slate-500">
          Sistem Presensi Digital & Monitoring Giat Senayan © 2026
        </div>
      </motion.div>

    </div>
  );
};

