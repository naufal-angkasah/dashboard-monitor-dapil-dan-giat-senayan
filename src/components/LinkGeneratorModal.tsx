import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GeneratedLinkItem, Role } from '../types';
import { 
  QrCode, 
  X, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Globe, 
  Calendar, 
  Layers, 
  Building2,
  Share2,
  ExternalLink
} from 'lucide-react';

interface LinkGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
  onAddActivity?: (activity: any) => void;
}

export const LinkGeneratorModal: React.FC<LinkGeneratorModalProps> = ({
  isOpen,
  onClose,
  role,
  onAddActivity,
}) => {
  const [namaGiat, setNamaGiat] = useState<string>('');
  const [instansi, setInstansi] = useState<string>('');
  const [kategori, setKategori] = useState<string>('Pendidikan/Kampus');
  const [tipeLembaga, setTipeLembaga] = useState<string>('OP9 (DPR RI)');
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [modeEngine, setModeEngine] = useState<'web' | 'gform'>('web');
  
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaGiat.trim() || !instansi.trim()) return;

    const slug = namaGiat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const randomId = Math.random().toString(36).substring(2, 8);
    const newUrl = modeEngine === 'web'
      ? `${window.location.origin}/absensi/${slug}-${randomId}`
      : `https://forms.gle/${randomId}-senayan-dpr`;

    setGeneratedUrl(newUrl);

    // If callback provided, register into Senayan activities list
    if (onAddActivity) {
      onAddActivity({
        id: `SEN-2024-${Math.floor(100 + Math.random() * 900)}`,
        namaGiat,
        instansi,
        kategori,
        tipeLembaga,
        tanggal,
        jumlahPeserta: 50,
        lokasiRuang: 'Ruang Rapat Komisi - Gedung Nusantara',
        status: 'Terjadwal',
        penanggungJawab: 'Operator Senayan',
        berkasUrl: newUrl,
      });
    }
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper SVG QR Code mock payload
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(generatedUrl || 'https://dpr.go.id')}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-sm">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-slate-900">
                  MODAL BUILDER LINK & QR CODE
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Fitur Generator Link Pendaftaran & Absensi Digital (Admin Only)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Nama Giat / Acara Kunjungan *</label>
              <input
                type="text"
                required
                value={namaGiat}
                onChange={(e) => setNamaGiat(e.target.value)}
                placeholder="misal: Kunjungan Studi Wawasan Kebangsaan OSIS"
                className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:border-blue-600 text-slate-900 font-medium outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Instansi / Lembaga Asal *</label>
                <input
                  type="text"
                  required
                  value={instansi}
                  onChange={(e) => setInstansi(e.target.value)}
                  placeholder="misal: SMA Negeri 1 Pacitan"
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:border-blue-600 text-slate-900 font-medium outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Kategori Segmentasi</label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-slate-900 font-medium outline-none transition-colors cursor-pointer"
                >
                  <option value="Pendidikan/Kampus">Pendidikan / Kampus</option>
                  <option value="Pemerintahan/Pemkab">Pemerintahan / Pemkab</option>
                  <option value="Keagamaan/Ormas">Keagamaan / Ormas</option>
                  <option value="Pemuda/Pelajar">Pemuda / Pelajar</option>
                  <option value="UMKM/Komunitas">UMKM / Komunitas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Tipe Lembaga / Tujuan</label>
                <select
                  value={tipeLembaga}
                  onChange={(e) => setTipeLembaga(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-slate-900 font-medium outline-none transition-colors cursor-pointer"
                >
                  <option value="OP9 (DPR RI)">OP9 (DPR RI)</option>
                  <option value="MP9 (MPR RI)">MP9 (MPR RI)</option>
                  <option value="EB7 (Fraksi)">EB7 (Sekretariat Fraksi)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Tanggal Kunjungan</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white text-slate-900 font-medium outline-none transition-colors cursor-pointer"
                />
              </div>
            </div>

            {/* Generator Engine Options */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Opsi Engine Generator</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModeEngine('web')}
                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                    modeEngine === 'web'
                      ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Globe className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs">Mode Web RS59 Digital</p>
                    <p className="text-[10px] opacity-75 font-normal">(Style BSVP System)</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setModeEngine('gform')}
                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                    modeEngine === 'gform'
                      ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Share2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs">Google Forms API</p>
                    <p className="text-[10px] opacity-75 font-normal">(Integration Link)</p>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Link & QR Code</span>
            </button>
          </form>

          {/* Result Output Area */}
          {generatedUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Link Unique Berhasil Dibuat
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                  {tipeLembaga}
                </span>
              </div>

              {/* QR Code & URL Flex */}
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="bg-white p-2 rounded-lg shrink-0 shadow-inner">
                  <img
                    src={qrSvgUrl}
                    alt="QR Code"
                    className="w-28 h-28 object-contain"
                  />
                </div>

                <div className="space-y-2 w-full text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Unique Registration URL:</p>
                    <p className="font-mono text-sky-300 text-xs break-all bg-slate-900 p-2 rounded-lg border border-slate-800 mt-1">
                      {generatedUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
                    </button>

                    <a
                      href={qrSvgUrl}
                      download="qr-code-senayan.png"
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-lg font-bold transition-colors cursor-pointer"
                      title="Unduh QR Code Image"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
