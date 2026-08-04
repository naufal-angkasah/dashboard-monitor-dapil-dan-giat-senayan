import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Calendar, 
  Building, 
  Users,
  Layers,
  Share2
} from 'lucide-react';
import QRCode from 'qrcode';
import { ActivityItem } from '../types';

interface AbsenGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityItem[];
  selectedActivityForAbsen?: ActivityItem | null;
  onSelectActivityForAbsen: (activity: ActivityItem) => void;
  onOpenPublicAbsen: (activityId: string) => void;
}

export const AbsenGeneratorModal: React.FC<AbsenGeneratorModalProps> = ({
  isOpen,
  onClose,
  activities = [],
  selectedActivityForAbsen,
  onSelectActivityForAbsen,
  onOpenPublicAbsen,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');

  const currentActivity = selectedActivityForAbsen || activities.find(a => a.id === selectedActivityId) || activities[0];

  useEffect(() => {
    if (currentActivity) {
      setSelectedActivityId(currentActivity.id);
      setCustomTitle(currentActivity.namaGiat);
    }
  }, [currentActivity]);

  const baseUrl = window.location.origin + window.location.pathname;
  const absenUrl = `${baseUrl}?absen=${currentActivity?.id || 'G-2026-001'}`;

  // Generate QR Code Data URL
  useEffect(() => {
    if (absenUrl) {
      QRCode.toDataURL(absenUrl, { width: 300, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [absenUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(absenUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR_Absen_${currentActivity?.id || 'Giat'}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-slate-200/80 shadow-2xl w-full max-w-2xl rounded-2xl overflow-hidden my-8"
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Generator Link & QR Presensi Otomatis</span>
                <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                  Presensi Digital
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                Buat kode QR dan tautan presensi peserta langsung ke Google Sheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Activity Select */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-800 mb-1 flex items-center gap-1">
              <Layers className="w-4 h-4 text-blue-600" /> Pilih Kegiatan yang Ingin Di-generate Absen:
            </label>
            <select
              value={selectedActivityId}
              onChange={(e) => {
                const act = activities.find(a => a.id === e.target.value);
                if (act) onSelectActivityForAbsen(act);
              }}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
            >
              {activities.map(act => (
                <option key={act.id} value={act.id}>
                  [{act.id}] {act.namaGiat} ({act.tanggal})
                </option>
              ))}
            </select>
          </div>

          {/* Activity Summary Info Box */}
          {currentActivity && (
            <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-xl text-xs space-y-1">
              <div className="font-bold text-blue-950 text-sm">
                {currentActivity.namaGiat}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 text-[11px] pt-1">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-600" /> {currentActivity.tanggal}</span>
                <span className="flex items-center gap-1"><Building className="w-3.5 h-3.5 text-blue-600" /> {currentActivity.lokasi}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-blue-600" /> Target: {currentActivity.jumlahPeserta} Orang</span>
              </div>
            </div>
          )}

          {/* QR Code & URL Link Output */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
            
            {/* QR Image Box */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-3.5 bg-white text-slate-900 rounded-xl text-center">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code Presensi" className="w-44 h-44 object-contain" />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-slate-400 font-mono text-xs">
                  Generating QR...
                </div>
              )}
              <span className="text-[10px] font-mono font-bold text-slate-600 mt-1">
                Scan QR untuk Presensi Langsung
              </span>
            </div>

            {/* Link & Action Buttons */}
            <div className="md:col-span-7 space-y-3">
              <div>
                <span className="text-[11px] font-mono text-amber-300 uppercase block mb-1 font-bold">
                  Link Unik Form Presensi Digital:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={absenUrl}
                    className="w-full bg-slate-950 text-slate-100 font-mono text-xs p-2.5 rounded border border-slate-700 focus:outline-none select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="bg-amber-400 text-slate-900 hover:bg-amber-300 p-2.5 rounded border border-slate-900 font-bold shrink-0 cursor-pointer flex items-center gap-1 text-xs"
                    title="Salin Link"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadQr}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Download Gambar QR</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenPublicAbsen(currentActivity?.id || 'G-2026-001');
                  }}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded text-xs font-bold border border-slate-700 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pratinjau Form Presensi</span>
                </button>
              </div>

              <div className="text-[10px] font-mono text-slate-400 pt-1">
                *Link ini dapat dibagikan di WhatsApp, email, atau dicetak pada standing banner di venue kegiatan. Peserta yang mengisi form akan langsung masuk ke database real-time Firestore.
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            Tutup
          </button>
        </div>

      </motion.div>
    </div>
  );
};

