import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Building2, 
  FileSpreadsheet,
  Link2
} from 'lucide-react';
import { ActivityItem, KategoriGiat } from '../types';

interface GoogleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNewActivity: (newActivity: ActivityItem) => void;
}

export const GoogleFormModal: React.FC<GoogleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitNewActivity,
}) => {
  const [kategoriGiat, setKategoriGiat] = useState<KategoriGiat>('MPR');
  const [tahun, setTahun] = useState<string>('2026');
  const [jenisGiat, setJenisGiat] = useState<string>('Sosialisasi 4 Pilar');
  const [temaGiat, setTemaGiat] = useState<string>('Kebangsaan & Pancasila');
  const [namaGiat, setNamaGiat] = useState<string>('');
  const [namaPeserta, setNamaPeserta] = useState<string>('');
  const [asalInstansi, setAsalInstansi] = useState<string>('');
  const [segmentasiPeserta, setSegmentasiPeserta] = useState<string>('Mahasiswa & Pelajar');
  const [jumlahPeserta, setJumlahPeserta] = useState<number>(150);
  const [lokasi, setLokasi] = useState<string>('Gedung Nusantara Senayan');
  const [kontak, setKontak] = useState<string>('0812-3456-7890');
  const [catatan, setCatatan] = useState<string>('');
  const [isSuccessToast, setIsSuccessToast] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaGiat || !asalInstansi) return;

    const newEntry: ActivityItem = {
      id: `G-2026-${Math.floor(100 + Math.random() * 900)}`,
      tahun,
      kategoriGiat,
      jenisGiat,
      temaGiat,
      namaGiat,
      namaPeserta: namaPeserta || 'Perwakilan Peserta',
      asalInstansi,
      segmentasiPeserta,
      kontak,
      jumlahPeserta: Number(jumlahPeserta) || 100,
      lokasi,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'Terlaksana',
      source: 'Google Form',
      catatan
    };

    onSubmitNewActivity(newEntry);
    setIsSuccessToast(true);

    setTimeout(() => {
      setIsSuccessToast(false);
      onClose();
      // Reset form
      setNamaGiat('');
      setAsalInstansi('');
      setNamaPeserta('');
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-slate-200/80 rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  Form Input Kegiatan Baru (Firestore & Sheet)
                </h3>
                <p className="text-xs text-blue-100">
                  Input ini terhubung langsung ke Google Spreadsheet & Firestore Cloud
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Toast Overlay */}
          {isSuccessToast ? (
            <div className="p-10 text-center space-y-4 font-sans">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl shadow-lg mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Data Berhasil Diterima & Disimpan!
              </h2>
              <p className="text-xs text-slate-600">
                Ter-sync otomatis ke Google Spreadsheet Cloud & Database Firestore Dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
              
              <div className="bg-blue-50/80 border border-blue-200/80 p-3 rounded-xl text-blue-900 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Simulasi pengisian Google Form Absensi Giat Senayan real-time.</span>
              </div>

              {/* Grid 1: Kategori & Tahun */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Giat:
                  </label>
                  <select
                    value={kategoriGiat}
                    onChange={(e) => setKategoriGiat(e.target.value as KategoriGiat)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="MPR">MPR RI</option>
                    <option value="DPR">DPR RI</option>
                    <option value="EBY Connect">EBY Connect</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tahun Kegiatan:
                  </label>
                  <select
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
              </div>

              {/* Nama Kegiatan */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama / Judul Kegiatan <span className="text-red-500">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={namaGiat}
                  onChange={(e) => setNamaGiat(e.target.value)}
                  placeholder="Contoh: Sosialisasi 4 Pilar MPR RI Bagi Pemuda BEM UI"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Grid 2: Jenis & Tema */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Kegiatan:
                  </label>
                  <select
                    value={jenisGiat}
                    onChange={(e) => setJenisGiat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Sosialisasi 4 Pilar">Sosialisasi 4 Pilar</option>
                    <option value="Serapan Aspirasi">Serapan Aspirasi</option>
                    <option value="Temu Tokoh Kebangsaan">Temu Tokoh Kebangsaan</option>
                    <option value="Kunjungan Kerja">Kunjungan Kerja</option>
                    <option value="Seminar Kebangsaan">Seminar Kebangsaan</option>
                    <option value="RDP">RDP / RDPU</option>
                    <option value="Workshop">Workshop & Bimtek</option>
                    <option value="Program EBY">Program EBY Connect</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tema Utama:
                  </label>
                  <select
                    value={temaGiat}
                    onChange={(e) => setTemaGiat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Kebangsaan & Pancasila">Kebangsaan & Pancasila</option>
                    <option value="Ekonomi & UMKM">Ekonomi & UMKM</option>
                    <option value="Pendidikan & Beasiswa">Pendidikan & Beasiswa</option>
                    <option value="Infrastruktur">Infrastruktur</option>
                    <option value="Hukum & HAM">Hukum & HAM</option>
                    <option value="Kesehatan">Kesehatan</option>
                  </select>
                </div>
              </div>

              {/* Grid 3: Instansi & Segmentasi */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Asal Instansi / Ormas <span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={asalInstansi}
                    onChange={(e) => setAsalInstansi(e.target.value)}
                    placeholder="Contoh: BEM Universitas Indonesia"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Segmentasi Peserta:
                  </label>
                  <select
                    value={segmentasiPeserta}
                    onChange={(e) => setSegmentasiPeserta(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Mahasiswa & Pelajar">Mahasiswa & Pelajar</option>
                    <option value="Tokoh Masyarakat & Agama">Tokoh Masyarakat & Agama</option>
                    <option value="Pelaku UMKM">Pelaku UMKM</option>
                    <option value="Pendidik & Guru">Pendidik & Guru</option>
                    <option value="Petani & Nelayan">Petani & Nelayan</option>
                    <option value="Pemuda & Komunitas">Pemuda & Komunitas</option>
                  </select>
                </div>
              </div>

              {/* Grid 4: Jumlah Peserta & Penanggung Jawab */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jumlah Peserta (Orang):
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={jumlahPeserta}
                    onChange={(e) => setJumlahPeserta(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Penanggung Jawab / Kontak:
                  </label>
                  <input
                    type="text"
                    value={namaPeserta}
                    onChange={(e) => setNamaPeserta(e.target.value)}
                    placeholder="Nama Koordinator"
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lokasi Pelaksanaan:
                </label>
                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Gedung Nusantara Senayan"
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Catatan */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Evaluasi Tambahan:
                </label>
                <textarea
                  rows={2}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Harapan / rekomendasi tindak lanjut..."
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-medium text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Ke Google Sheet & Firestore</span>
                </button>
              </div>

            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

