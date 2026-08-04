import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Building2, 
  Calendar, 
  MapPin, 
  Users, 
  UserCheck, 
  Phone, 
  FileText, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  Tag,
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Save,
  Paperclip
} from 'lucide-react';
import { ActivityItem } from '../types';
import jsPDF from 'jspdf';

interface DetailModalProps {
  activity: ActivityItem | null;
  onClose: () => void;
  onUpdateActivity?: (updated: ActivityItem) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ 
  activity, 
  onClose,
  onUpdateActivity,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'notulensi'>('info');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [notulensiText, setNotulensiText] = useState(activity?.notulensi || '');
  const [notulensiFileName, setNotulensiFileName] = useState(activity?.notulensiFile?.name || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!activity) return null;

  const photos = activity.fotoDokumentasi || [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80'
  ];

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    const updatedPhotos = [...photos, newPhotoUrl.trim()];
    const updated: ActivityItem = {
      ...activity,
      fotoDokumentasi: updatedPhotos
    };
    if (onUpdateActivity) onUpdateActivity(updated);
    setNewPhotoUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNotulensiFileName(file.name);
      const updated: ActivityItem = {
        ...activity,
        notulensiFile: {
          name: file.name,
          url: URL.createObjectURL(file),
          size: `${(file.size / 1024).toFixed(1)} KB`
        }
      };
      if (onUpdateActivity) onUpdateActivity(updated);
    }
  };

  const handleSaveNotulensi = () => {
    const updated: ActivityItem = {
      ...activity,
      notulensi: notulensiText
    };
    if (onUpdateActivity) onUpdateActivity(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handlePrintSinglePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('BERITA ACARA & LEMBAR DETAIL KEGIATAN SENAYAN', 14, 20);
    
    doc.setFontSize(11);
    doc.text(`ID Kegiatan: ${activity.id}`, 14, 30);
    doc.text(`Nama Kegiatan: ${activity.namaGiat}`, 14, 38);
    doc.text(`Kategori Giat: ${activity.kategoriGiat} RI`, 14, 46);
    doc.text(`Jenis / Tema: ${activity.jenisGiat} | ${activity.temaGiat}`, 14, 54);
    doc.text(`Tahun / Tanggal: ${activity.tahun} | ${activity.tanggal}`, 14, 62);
    doc.text(`Asal Instansi: ${activity.asalInstansi}`, 14, 70);
    doc.text(`Segmentasi Peserta: ${activity.segmentasiPeserta}`, 14, 78);
    doc.text(`Jumlah Peserta: ${activity.jumlahPeserta.toLocaleString('id-ID')} Orang`, 14, 86);
    doc.text(`Penanggung Jawab: ${activity.namaPeserta} (${activity.kontak})`, 14, 94);
    doc.text(`Lokasi Pelaksanaan: ${activity.lokasi}`, 14, 102);
    doc.text(`Status Sync: Google Form Auto-Synced (${activity.source})`, 14, 110);
    if (activity.notulensi) {
      doc.text(`Notulensi: ${activity.notulensi.substring(0, 100)}...`, 14, 118);
    }

    doc.save(`Detail_Giat_${activity.id}.pdf`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white border border-slate-200/80 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col my-8 rounded-2xl"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full text-white ${
                activity.kategoriGiat === 'MPR' ? 'bg-blue-800' : activity.kategoriGiat === 'DPR' ? 'bg-rose-600' : 'bg-emerald-600'
              }`}>
                {activity.kategoriGiat} RI
              </span>
              <h3 className="font-bold text-sm text-white">
                Detail Lembar Monitoring Giat #{activity.id}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 pt-3 flex items-center gap-2 shrink-0 overflow-x-auto">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl cursor-pointer flex items-center gap-2 transition-all ${
                activeTab === 'info' ? 'bg-white text-blue-600 border-t border-x border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Info & Metadata</span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl cursor-pointer flex items-center gap-2 transition-all ${
                activeTab === 'photos' ? 'bg-white text-blue-600 border-t border-x border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Foto Dokumentasi ({photos.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notulensi')}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl cursor-pointer flex items-center gap-2 transition-all ${
                activeTab === 'notulensi' ? 'bg-white text-blue-600 border-t border-x border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Paperclip className="w-4 h-4" />
              <span>Upload Notulensi & Catatan</span>
            </button>
          </div>

          {/* Body Scrollable Content */}
          <div className="p-6 space-y-5 overflow-y-auto grow">
            
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-medium text-slate-400 block mb-1">
                    Judul Official Kegiatan:
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {activity.namaGiat}
                  </h2>
                </div>

                {/* Grid Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/80 p-5 border border-slate-200 rounded-xl text-xs">
                  <div className="space-y-2.5">
                    <p className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Tahun / Tanggal: <strong className="text-slate-900">{activity.tahun} ({activity.tanggal})</strong></span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-700">
                      <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Jenis Giat: <strong className="text-slate-900">{activity.jenisGiat}</strong></span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-700">
                      <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Tema Giat: <strong className="text-slate-900">{activity.temaGiat}</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Lokasi: <strong>{activity.lokasi} ({activity.kabupaten || 'Pacitan'})</strong></span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Instansi: <strong>{activity.asalInstansi}</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Segmentasi: <strong>{activity.segmentasiPeserta}</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Total Peserta: <strong className="text-blue-700">{activity.jumlahPeserta.toLocaleString('id-ID')} Orang</strong></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>PJ / Kontak: <strong>{activity.namaPeserta} ({activity.kontak})</strong></span>
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-emerald-950 block">Status Data Firestore & Google Sheet</span>
                      <span className="text-[11px] text-emerald-700">Tersinkronisasi Real-time Database</span>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                    {activity.source}
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="space-y-4 font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Galeri Foto Dokumentasi Kegiatan</h4>
                    <p className="text-xs text-slate-500">Upload dan lampirkan foto dokumentasi acara</p>
                  </div>
                </div>

                {/* Add Photo Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="Masukkan URL foto baru (https://...)"
                    value={newPhotoUrl}
                    onChange={e => setNewPhotoUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
                  />
                  <button
                    onClick={handleAddPhoto}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Foto</span>
                  </button>
                </div>

                {/* Photo Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative group border border-slate-200 rounded-xl overflow-hidden bg-slate-900 h-44 shadow-xs">
                      <img src={url} alt={`Dokumentasi ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                        <a href={url} target="_blank" rel="noreferrer" className="bg-white text-slate-900 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-xs">
                          Buka Gambar Full
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notulensi' && (
              <div className="space-y-4 font-sans">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Upload & Catat Notulensi Kegiatan</h4>
                  <p className="text-xs text-slate-500">Simpan risalah rapat, poin kesepakatan, atau berkas notulensi PDF</p>
                </div>

                {/* Upload Notulensi File Box */}
                <div className="bg-slate-50 border border-dashed border-slate-300 p-5 rounded-2xl text-center space-y-2">
                  <Upload className="w-8 h-8 text-blue-600 mx-auto" />
                  <div className="text-xs font-semibold text-slate-800">
                    Upload Berkas Notulensi (PDF / DOCX / JPG)
                  </div>
                  <input
                    type="file"
                    id="notulensiFileInput"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                  <label
                    htmlFor="notulensiFileInput"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer hover:bg-blue-700 shadow-xs"
                  >
                    Pilih Berkas Notulensi
                  </label>
                  {notulensiFileName && (
                    <div className="text-xs font-medium text-emerald-800 bg-emerald-100 p-2 rounded-lg inline-block border border-emerald-300 mt-2">
                      Terlampir: {notulensiFileName}
                    </div>
                  )}
                </div>

                {/* Text Notulensi Editor */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Ringkasan & Poin Hasil Kegiatan:
                  </label>
                  <textarea
                    rows={5}
                    value={notulensiText}
                    onChange={e => setNotulensiText(e.target.value)}
                    placeholder="Tuliskan poin penting hasil rapat/kegiatan di sini..."
                    className="w-full bg-slate-50 border border-slate-200 text-xs p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSaveNotulensi}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Notulensi</span>
                  </button>

                  {isSaved && (
                    <span className="text-xs font-semibold text-emerald-600">
                      ✓ Notulensi Berhasil Disimpan!
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center shrink-0">
            <button
              onClick={handlePrintSinglePDF}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Berita Acara PDF</span>
            </button>

            <button
              onClick={onClose}
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer transition-colors"
            >
              Tutup
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

