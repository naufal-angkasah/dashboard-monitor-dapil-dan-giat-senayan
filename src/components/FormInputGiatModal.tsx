import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronDown,
  ClipboardList,
  User,
  Building,
  Phone,
  Users,
  Tag,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Hash,
  Star
} from 'lucide-react';
import { ActivityItem, KategoriGiat, UserRole } from '../types';

interface FormInputGiatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: ActivityItem) => Promise<void>;
  userRole: UserRole;
  userName?: string;
}

const KATEGORI_OPTIONS: KategoriGiat[] = ['MPR', 'DPR', 'EBY Connect'];

const JENIS_GIAT_BY_KATEGORI: Record<KategoriGiat, string[]> = {
  MPR: [
    'Sosialisasi 4 Pilar',
    'Penyerapan Aspirasi',
    'Kunjungan Kerja MPR',
    'Rapat Koordinasi MPR',
    'Seminar Kebangsaan',
    'Dialog Interaktif MPR',
    'Kegiatan Kepemudaan',
    'Kegiatan Sosial MPR',
  ],
  DPR: [
    'Kunjungan Kerja (Kunker)',
    'Rapat Dengar Pendapat (RDP)',
    'Rapat Dengar Pendapat Umum (RDPU)',
    'Pengawasan Lapangan',
    'Reses DPR RI',
    'Pertemuan Konstituen',
    'Seminar / FGD DPR',
    'Temu Aspirasi DPR',
  ],
  'EBY Connect': [
    'Bantuan Langsung Tunai',
    'Beasiswa Pendidikan',
    'Bantuan Sembako',
    'Pelatihan Keahlian',
    'Program Kesehatan',
    'Bantuan UMKM',
    'Pemberdayaan Perempuan',
    'Program Pangan Daerah',
  ],
};

const SEGMENTASI_OPTIONS = [
  'Masyarakat Umum',
  'Pelajar / Mahasiswa',
  'Petani / Nelayan',
  'Pelaku UMKM',
  'Perempuan / PKK',
  'Tokoh Masyarakat',
  'Aparatur Desa / Kecamatan',
  'OKP / Ormas',
  'Veteran / Purnawirawan',
  'Pemuda / Karang Taruna',
];

const TEMA_OPTIONS = [
  '4 Pilar Kebangsaan',
  'Aspirasi Konstituen',
  'Ketahanan Pangan',
  'Pemberdayaan Ekonomi',
  'Pendidikan & Literasi',
  'Kesehatan Masyarakat',
  'Infrastruktur & Pembangunan',
  'Lingkungan & Keberlanjutan',
  'Hukum & Demokrasi',
  'Kebudayaan & Pariwisata',
  'Keamanan & Ketertiban',
  'Sosial & Kemasyarakatan',
];

const STATUS_OPTIONS: ActivityItem['status'][] = ['Terlaksana', 'Sedang Berjalan', 'Terjadwal'];

const KABUPATEN_OPTIONS = [
  'Jakarta Pusat', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Selatan', 'Jakarta Utara',
  'Kab. Ngawi', 'Kab. Magetan', 'Kab. Ponorogo', 'Kab. Pacitan', 'Kab. Trenggalek',
  'Surabaya', 'Malang', 'Madiun', 'Kediri', 'Blitar', 'Jombang', 'Mojokerto', 'Pasuruan',
];

const TODAY_STR = new Date().toISOString().split('T')[0];

type FormStep = 1 | 2 | 3;

export const FormInputGiatModal: React.FC<FormInputGiatModalProps> = ({
  isOpen,
  onClose,
  onSave,
  userRole,
  userName,
}) => {
  const [step, setStep] = useState<FormStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    kategoriGiat: '' as KategoriGiat | '',
    jenisGiat: '',
    temaGiat: '',
    namaGiat: '',
    tahun: String(new Date().getFullYear()),
    tanggal: TODAY_STR,
    lokasi: '',
    kabupaten: '',
    status: 'Terlaksana' as ActivityItem['status'],
    // Peserta fields
    namaPeserta: '',
    asalInstansi: '',
    segmentasiPeserta: '',
    kontak: '',
    jumlahPeserta: '',
    catatan: '',
  });

  const jenisGiatOptions = form.kategoriGiat
    ? JENIS_GIAT_BY_KATEGORI[form.kategoriGiat as KategoriGiat]
    : [];

  const setField = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error for field
    if (errors[field]) {
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    }
    // Reset jenisGiat when kategori changes
    if (field === 'kategoriGiat') {
      setForm(prev => ({ ...prev, [field]: value as KategoriGiat, jenisGiat: '' }));
    }
  };

  const validateStep = (s: FormStep): boolean => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!form.kategoriGiat) newErrors.kategoriGiat = 'Kategori giat wajib dipilih';
      if (!form.jenisGiat) newErrors.jenisGiat = 'Jenis giat wajib dipilih';
      if (!form.temaGiat) newErrors.temaGiat = 'Tema giat wajib dipilih';
      if (!form.namaGiat.trim()) newErrors.namaGiat = 'Nama giat wajib diisi';
    }
    if (s === 2) {
      if (!form.namaPeserta.trim()) newErrors.namaPeserta = 'Nama peserta/penyelenggara wajib diisi';
      if (!form.asalInstansi.trim()) newErrors.asalInstansi = 'Asal instansi wajib diisi';
      if (!form.segmentasiPeserta) newErrors.segmentasiPeserta = 'Segmentasi peserta wajib dipilih';
      if (!form.kontak.trim()) newErrors.kontak = 'Kontak wajib diisi';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => (prev < 3 ? (prev + 1) as FormStep : prev));
    }
  };

  const handleBack = () => {
    setStep(prev => (prev > 1 ? (prev - 1) as FormStep : prev));
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      setStep(2);
      return;
    }
    setIsSubmitting(true);
    try {
      const newActivity: ActivityItem = {
        id: `GS-${Date.now()}`,
        tahun: form.tahun,
        kategoriGiat: form.kategoriGiat as KategoriGiat,
        jenisGiat: form.jenisGiat,
        temaGiat: form.temaGiat,
        namaGiat: form.namaGiat.trim(),
        namaPeserta: form.namaPeserta.trim(),
        asalInstansi: form.asalInstansi.trim(),
        segmentasiPeserta: form.segmentasiPeserta,
        kontak: form.kontak.trim(),
        jumlahPeserta: parseInt(form.jumlahPeserta) || 0,
        lokasi: form.lokasi.trim(),
        kabupaten: form.kabupaten,
        tanggal: form.tanggal,
        status: form.status,
        source: 'Manual',
        catatan: form.catatan.trim(),
      };
      await onSave(newActivity);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        resetForm();
      }, 2000);
    } catch (e) {
      console.error('Error saving activity:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      kategoriGiat: '' as KategoriGiat | '',
      jenisGiat: '',
      temaGiat: '',
      namaGiat: '',
      tahun: String(new Date().getFullYear()),
      tanggal: TODAY_STR,
      lokasi: '',
      kabupaten: '',
      status: 'Terlaksana',
      namaPeserta: '',
      asalInstansi: '',
      segmentasiPeserta: '',
      kontak: '',
      jumlahPeserta: '',
      catatan: '',
    });
    setStep(1);
    setErrors({});
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const KATEGORI_COLORS: Record<string, string> = {
    MPR: 'from-amber-500 to-orange-500',
    DPR: 'from-indigo-500 to-blue-600',
    'EBY Connect': 'from-emerald-500 to-teal-600',
    '': 'from-slate-400 to-slate-500',
  };

  const stepTitles = ['Info Kegiatan', 'Data Peserta', 'Konfirmasi'];
  const stepIcons = [ClipboardList, Users, CheckCircle2];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${KATEGORI_COLORS[form.kategoriGiat]} p-6 text-white flex items-start justify-between gap-4 shrink-0`}>
              <div>
                <div className="bg-white/15 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-2">
                  Form Input Giat Senayan
                </div>
                <h2 className="text-xl font-extrabold tracking-tight leading-tight">
                  Tambah Data Kegiatan Baru
                </h2>
                <p className="text-white/80 text-xs mt-1">
                  Data tersimpan otomatis ke Firebase Firestore & terintegrasi dengan Daftar Hadir
                </p>
              </div>
              <button
                onClick={handleClose}
                className="bg-white/20 hover:bg-white/30 text-white rounded-xl p-2 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 shrink-0">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((s, i) => {
                  const Icon = stepIcons[i];
                  const isActive = step === s;
                  const isDone = step > s;
                  return (
                    <React.Fragment key={s}>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isDone ? 'bg-emerald-500 text-white' :
                          isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' :
                          'bg-slate-200 text-slate-400'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <span className={`text-xs font-bold hidden sm:block ${isActive ? 'text-blue-600' : isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {stepTitles[i]}
                        </span>
                      </div>
                      {i < 2 && (
                        <div className={`flex-1 h-0.5 mx-3 rounded-full transition-all duration-500 ${step > s + 1 ? 'bg-emerald-400' : step === s + 1 ? 'bg-blue-300' : 'bg-slate-200'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Success State */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center py-16 px-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
                    className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">Data Berhasil Disimpan!</h3>
                  <p className="text-slate-500 text-sm">
                    Kegiatan <strong>"{form.namaGiat}"</strong> telah tersimpan ke Firebase Firestore dan dapat dilihat di Daftar Hadir.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Body */}
            {!isSuccess && (
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {/* STEP 1: Info Kegiatan */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.22 }}
                      className="p-6 space-y-4"
                    >
                      <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4 text-blue-500" /> Informasi Kegiatan
                      </h3>

                      {/* Kategori Giat */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Kategori Giat <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-3 gap-2">
                          {KATEGORI_OPTIONS.map(kat => {
                            const colors: Record<string, string> = {
                              MPR: 'border-amber-400 bg-amber-50 text-amber-700',
                              DPR: 'border-indigo-400 bg-indigo-50 text-indigo-700',
                              'EBY Connect': 'border-emerald-400 bg-emerald-50 text-emerald-700',
                            };
                            const isSelected = form.kategoriGiat === kat;
                            return (
                              <button
                                key={kat}
                                type="button"
                                onClick={() => setField('kategoriGiat', kat)}
                                className={`py-2.5 px-3 rounded-xl border-2 text-xs font-extrabold transition-all duration-200 ${
                                  isSelected
                                    ? colors[kat] + ' ring-2 ring-offset-1 ring-current scale-[1.02]'
                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                }`}
                              >
                                {kat}
                              </button>
                            );
                          })}
                        </div>
                        {errors.kategoriGiat && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.kategoriGiat}</p>}
                      </div>

                      {/* Jenis Giat */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Jenis Giat <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select
                            value={form.jenisGiat}
                            onChange={(e) => setField('jenisGiat', e.target.value)}
                            disabled={!form.kategoriGiat}
                            className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed ${errors.jenisGiat ? 'border-red-400' : 'border-slate-200'}`}
                          >
                            <option value="">Pilih jenis kegiatan{!form.kategoriGiat ? ' (pilih kategori dulu)' : ''}</option>
                            {jenisGiatOptions.map(j => <option key={j} value={j}>{j}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {errors.jenisGiat && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.jenisGiat}</p>}
                      </div>

                      {/* Tema Giat */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Tema Giat <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select
                            value={form.temaGiat}
                            onChange={(e) => setField('temaGiat', e.target.value)}
                            className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none pr-10 ${errors.temaGiat ? 'border-red-400' : 'border-slate-200'}`}
                          >
                            <option value="">Pilih tema kegiatan</option>
                            {TEMA_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {errors.temaGiat && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.temaGiat}</p>}
                      </div>

                      {/* Nama Giat */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Kegiatan <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={form.namaGiat}
                            onChange={(e) => setField('namaGiat', e.target.value)}
                            placeholder="Contoh: Sosialisasi 4 Pilar Kebangsaan di Kecamatan Bayan"
                            className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${errors.namaGiat ? 'border-red-400' : 'border-slate-200'}`}
                          />
                        </div>
                        {errors.namaGiat && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.namaGiat}</p>}
                      </div>

                      {/* Tanggal, Tahun, Status */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5">Tanggal Pelaksanaan</label>
                          <div className="relative">
                            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="date"
                              value={form.tanggal}
                              onChange={(e) => setField('tanggal', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5">Status</label>
                          <div className="relative">
                            <select
                              value={form.status}
                              onChange={(e) => setField('status', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none pr-10"
                            >
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      {/* Lokasi & Kabupaten */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5">Lokasi / Tempat</label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              value={form.lokasi}
                              onChange={(e) => setField('lokasi', e.target.value)}
                              placeholder="Nama gedung / venue"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5">Kabupaten / Kota</label>
                          <div className="relative">
                            <select
                              value={form.kabupaten}
                              onChange={(e) => setField('kabupaten', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none pr-10"
                            >
                              <option value="">Pilih Kab/Kota</option>
                              {KABUPATEN_OPTIONS.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Data Peserta */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.22 }}
                      className="p-6 space-y-4"
                    >
                      <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" /> Data Peserta / Penyelenggara
                      </h3>

                      {/* Nama Peserta */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Nama Peserta / Penyelenggara <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={form.namaPeserta}
                            onChange={(e) => setField('namaPeserta', e.target.value)}
                            placeholder="Nama lengkap peserta atau penanggung jawab"
                            className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${errors.namaPeserta ? 'border-red-400' : 'border-slate-200'}`}
                          />
                        </div>
                        {errors.namaPeserta && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.namaPeserta}</p>}
                      </div>

                      {/* Asal Instansi */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Asal Instansi / Lembaga <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={form.asalInstansi}
                            onChange={(e) => setField('asalInstansi', e.target.value)}
                            placeholder="Nama instansi, lembaga, atau dinas"
                            className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${errors.asalInstansi ? 'border-red-400' : 'border-slate-200'}`}
                          />
                        </div>
                        {errors.asalInstansi && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.asalInstansi}</p>}
                      </div>

                      {/* Segmentasi Peserta */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Segmentasi Peserta <span className="text-red-500">*</span></label>
                        <div className="flex flex-wrap gap-2">
                          {SEGMENTASI_OPTIONS.map(seg => (
                            <button
                              key={seg}
                              type="button"
                              onClick={() => setField('segmentasiPeserta', seg)}
                              className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all duration-200 ${
                                form.segmentasiPeserta === seg
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                              }`}
                            >
                              {seg}
                            </button>
                          ))}
                        </div>
                        {errors.segmentasiPeserta && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.segmentasiPeserta}</p>}
                      </div>

                      {/* Kontak & Jumlah Peserta */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5">Kontak / No. HP <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="tel"
                              value={form.kontak}
                              onChange={(e) => setField('kontak', e.target.value)}
                              placeholder="08XXXXXXXXXX"
                              className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${errors.kontak ? 'border-red-400' : 'border-slate-200'}`}
                            />
                          </div>
                          {errors.kontak && <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.kontak}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5">Jumlah Peserta</label>
                          <div className="relative">
                            <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="number"
                              min={0}
                              value={form.jumlahPeserta}
                              onChange={(e) => setField('jumlahPeserta', e.target.value)}
                              placeholder="0"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Catatan */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">Catatan / Keterangan Tambahan</label>
                        <textarea
                          value={form.catatan}
                          onChange={(e) => setField('catatan', e.target.value)}
                          placeholder="Catatan singkat mengenai kegiatan (opsional)"
                          rows={3}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Konfirmasi */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.22 }}
                      className="p-6 space-y-4"
                    >
                      <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" /> Konfirmasi Data Sebelum Disimpan
                      </h3>

                      <div className={`bg-gradient-to-r ${KATEGORI_COLORS[form.kategoriGiat]} p-4 rounded-2xl text-white`}>
                        <p className="text-[10px] font-bold uppercase opacity-80 mb-1">{form.kategoriGiat} • {form.jenisGiat}</p>
                        <p className="font-extrabold text-base leading-tight">{form.namaGiat || '—'}</p>
                        <p className="text-xs opacity-80 mt-1">{form.tanggal} • {form.lokasi || 'Lokasi belum diisi'}</p>
                      </div>

                      <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                        {[
                          { label: 'Tema Giat', val: form.temaGiat || '—' },
                          { label: 'Status', val: form.status },
                          { label: 'Nama Peserta', val: form.namaPeserta || '—' },
                          { label: 'Asal Instansi', val: form.asalInstansi || '—' },
                          { label: 'Segmentasi', val: form.segmentasiPeserta || '—' },
                          { label: 'Kontak', val: form.kontak || '—' },
                          { label: 'Jumlah Peserta', val: form.jumlahPeserta ? `${form.jumlahPeserta} orang` : '—' },
                          { label: 'Kabupaten', val: form.kabupaten || '—' },
                        ].map((row, i) => (
                          <div key={row.label} className={`flex items-center justify-between px-4 py-2.5 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-100 last:border-0`}>
                            <span className="text-[11px] font-bold text-slate-500">{row.label}</span>
                            <span className="text-[11px] font-extrabold text-slate-900 text-right max-w-[60%] truncate">{row.val}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-700 font-semibold flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                        <span>Data akan disimpan ke <strong>Firebase Firestore</strong> dan otomatis muncul di tabel Daftar Hadir & DataTable pada dashboard ini.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Footer Buttons */}
            {!isSuccess && (
              <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-3 shrink-0">
                <button
                  onClick={step === 1 ? handleClose : handleBack}
                  className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  {step === 1 ? 'Batal' : '← Kembali'}
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">Langkah {step} dari 3</span>
                  {step < 3 ? (
                    <button
                      onClick={handleNext}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
                    >
                      Lanjut →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
                      ) : (
                        <><Save className="w-4 h-4" /> Simpan ke Database</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

