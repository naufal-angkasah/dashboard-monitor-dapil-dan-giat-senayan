import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Edit3, Trash2, Database, Save, RotateCcw } from 'lucide-react';
import { ProgramItem, StatusProgram, JenisProgram } from '../types';
import { ALL_KOMISI, ALL_KABUPATEN } from '../data/mockData';

interface MasterDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs: ProgramItem[];
  onAddProgram: (program: ProgramItem) => void;
  onUpdateProgram: (program: ProgramItem) => void;
  onDeleteProgram: (id: string) => void;
  onResetData: () => void;
}

export const MasterDataModal: React.FC<MasterDataModalProps> = ({
  isOpen,
  onClose,
  programs,
  onAddProgram,
  onUpdateProgram,
  onDeleteProgram,
  onResetData,
}) => {
  if (!isOpen) return null;

  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState<Partial<ProgramItem>>({
    tahun: 2024,
    komisi: ALL_KOMISI[0],
    namaProgram: '',
    jenisProgram: 'Kelompok',
    namaPenerima: '',
    nik: '3501000000000001',
    provinsi: 'Jawa Timur',
    kabupaten: 'Kab. Pacitan',
    kecamatan: '',
    desa: '',
    jumlahPenerima: 100,
    status: 'Selesai',
    anggaran: 250000000,
    lat: -8.196,
    lng: 111.097,
    tanggalPelaksanaan: new Date().toISOString().slice(0, 10),
    deskripsi: '',
    penanggungJawab: 'Tim Aspirasi Dapil',
  });

  const handleStartAdd = () => {
    setEditingProgram(null);
    setFormData({
      id: `PRG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      tahun: 2024,
      komisi: ALL_KOMISI[0],
      namaProgram: '',
      jenisProgram: 'Kelompok',
      namaPenerima: '',
      nik: '3501000000000001',
      provinsi: 'Jawa Timur',
      kabupaten: 'Kab. Pacitan',
      kecamatan: '',
      desa: '',
      jumlahPenerima: 100,
      status: 'Selesai',
      anggaran: 250000000,
      lat: -8.196,
      lng: 111.097,
      tanggalPelaksanaan: new Date().toISOString().slice(0, 10),
      deskripsi: '',
      penanggungJawab: 'Tim Aspirasi Dapil',
    });
    setIsAddingNew(true);
  };

  const handleStartEdit = (p: ProgramItem) => {
    setEditingProgram(p);
    setFormData({ ...p });
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaProgram || !formData.kecamatan || !formData.desa) {
      alert('Harap isi Nama Program, Kecamatan, dan Desa');
      return;
    }

    if (isAddingNew) {
      onAddProgram(formData as ProgramItem);
    } else if (editingProgram) {
      onUpdateProgram(formData as ProgramItem);
    }

    setIsAddingNew(false);
    setEditingProgram(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl max-w-4xl w-full shadow-xl max-h-[90vh] overflow-y-auto relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white p-2 rounded-lg shadow-sm">
                <Database className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900">
                  KELOLA MASTER DATA PROGRAM (ADMIN)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Tambah, edit, hapus, dan sinkronisasi basis data program aspirasi
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Modal for Add / Edit */}
          {(isAddingNew || editingProgram) ? (
            <form onSubmit={handleSave} className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-xs mb-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <h4 className="font-heading font-bold text-base text-slate-900">
                  {isAddingNew ? '➕ Tambah Program Baru' : `✏️ Edit Program: ${editingProgram?.id}`}
                </h4>
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingProgram(null); }}
                  className="text-xs font-semibold bg-white border border-slate-300 px-2.5 py-1 rounded text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Program</label>
                  <input
                    type="text"
                    required
                    value={formData.namaProgram || ''}
                    onChange={(e) => setFormData({ ...formData, namaProgram: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="misal: Beasiswa PIP 2024"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun</label>
                  <input
                    type="number"
                    value={formData.tahun || 2024}
                    onChange={(e) => setFormData({ ...formData, tahun: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Komisi</label>
                  <select
                    value={formData.komisi || ALL_KOMISI[0]}
                    onChange={(e) => setFormData({ ...formData, komisi: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {ALL_KOMISI.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Program</label>
                  <select
                    value={formData.jenisProgram || 'Kelompok'}
                    onChange={(e) => setFormData({ ...formData, jenisProgram: e.target.value as JenisProgram })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Kelompok">Kelompok</option>
                    <option value="Individu">Individu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Penerima</label>
                  <input
                    type="text"
                    value={formData.namaPenerima || ''}
                    onChange={(e) => setFormData({ ...formData, namaPenerima: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="misal: Gapoktan Tani Mulya"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK / Identitas</label>
                  <input
                    type="text"
                    value={formData.nik || ''}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kabupaten</label>
                  <select
                    value={formData.kabupaten || ALL_KABUPATEN[0]}
                    onChange={(e) => setFormData({ ...formData, kabupaten: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ALL_KABUPATEN.map((kab) => <option key={kab} value={kab}>{kab}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
                  <input
                    type="text"
                    required
                    value={formData.kecamatan || ''}
                    onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="misal: Pacitan"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Desa / Kelurahan</label>
                  <input
                    type="text"
                    required
                    value={formData.desa || ''}
                    onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="misal: Ploso"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jumlah Penerima</label>
                  <input
                    type="number"
                    value={formData.jumlahPenerima || 0}
                    onChange={(e) => setFormData({ ...formData, jumlahPenerima: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Program</label>
                  <select
                    value={formData.status || 'Selesai'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StatusProgram })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Selesai">Selesai (Hijau)</option>
                    <option value="Berjalan">Berjalan (Kuning)</option>
                    <option value="Perencanaan">Perencanaan (Abu-abu)</option>
                    <option value="Belum Ada Program">Belum Ada Program</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Anggaran (IDR)</label>
                  <input
                    type="number"
                    value={formData.anggaran || 0}
                    onChange={(e) => setFormData({ ...formData, anggaran: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Latitude (Gps)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lat || -8.196}
                    onChange={(e) => setFormData({ ...formData, lat: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Longitude (Gps)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.lng || 111.097}
                    onChange={(e) => setFormData({ ...formData, lng: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Pelaksanaan</label>
                  <input
                    type="date"
                    value={formData.tanggalPelaksanaan || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalPelaksanaan: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block font-semibold text-slate-700 mb-1 text-xs">Deskripsi Program</label>
                <textarea
                  rows={2}
                  value={formData.deskripsi || ''}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full border border-slate-300 rounded p-1.5 font-medium text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Penjelasan ringkas realisasi program..."
                />
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Program</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleStartAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Program Baru</span>
              </button>

              <button
                onClick={onResetData}
                className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer hover:bg-rose-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Data Default</span>
              </button>
            </div>
          )}

          {/* Master Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-heading font-extrabold uppercase text-[11px] tracking-wider">
                  <th className="p-2.5 border-r border-slate-200">ID</th>
                  <th className="p-2.5 border-r border-slate-200">Program</th>
                  <th className="p-2.5 border-r border-slate-200">Wilayah</th>
                  <th className="p-2.5 border-r border-slate-200 text-center">Status</th>
                  <th className="p-2.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {programs.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-2.5 border-r border-slate-100 font-mono font-bold text-slate-900">{p.id}</td>
                    <td className="p-2.5 border-r border-slate-100 font-bold text-slate-900">{p.namaProgram}</td>
                    <td className="p-2.5 border-r border-slate-100">{p.desa}, {p.kecamatan}, {p.kabupaten}</td>
                    <td className="p-2.5 border-r border-slate-100 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        p.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        p.status === 'Berjalan' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="bg-slate-100 hover:bg-blue-50 text-blue-700 border border-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteProgram(p.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
