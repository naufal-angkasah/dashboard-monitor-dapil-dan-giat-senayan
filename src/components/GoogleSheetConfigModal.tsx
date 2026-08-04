import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Database,
  Link2,
  Save
} from 'lucide-react';
import { GoogleSheetConfig } from '../types';

interface GoogleSheetConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetConfig;
  onSaveConfig: (newConfig: GoogleSheetConfig) => void;
  onTriggerSync: () => Promise<void>;
  isSyncing: boolean;
  lastSyncedAt?: string;
}

export const GoogleSheetConfigModal: React.FC<GoogleSheetConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onTriggerSync,
  isSyncing,
  lastSyncedAt,
}) => {
  const [senayanUrl, setSenayanUrl] = useState(config.senayanSheetUrl || 'https://docs.google.com/spreadsheets/d/19pm_prz5Pu5F5uxXXo4pk0i_915SGqKO/edit');
  const [ebyUrl, setEbyUrl] = useState(config.ebySheetUrl || 'https://docs.google.com/spreadsheets/d/1ymkvImybklzu36t08M60LiR3FlLx9YSR/edit');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig({
      senayanSheetUrl: senayanUrl,
      ebySheetUrl: ebyUrl,
      lastSyncedAt: new Date().toLocaleString('id-ID'),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
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
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Pengaturan Google Spreadsheet & Sync</span>
                <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                  Skala Provinsi
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                Sinkronisasi otomatis real-time data kegiatan dari Google Sheet
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
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Status Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs font-medium text-emerald-900">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Sync Active • Terakhir Sync: <strong>{lastSyncedAt || 'Baru Saja'}</strong></span>
            </div>
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Sekarang'}</span>
            </button>
          </div>

          {/* Senayan Spreadsheet URL Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-blue-600" /> URL Google Spreadsheet Senayan / Giat Nasional
              </label>
              <a
                href={senayanUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
              >
                Buka Spreadsheet <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="url"
              value={senayanUrl}
              onChange={e => setSenayanUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/19pm_prz5Pu5F5uxXXo4pk0i_915SGqKO/edit..."
              className="w-full bg-slate-50 border border-slate-200 text-xs font-mono p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
            />
            <p className="text-[11px] text-slate-400">
              Spreadsheet ini menyimpan data kegiatan Senayan (MPR RI & DPR RI).
            </p>
          </div>

          {/* EBY Connect Spreadsheet URL Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-emerald-600" /> URL Google Spreadsheet EBY Connect
              </label>
              <a
                href={ebyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1 font-medium"
              >
                Buka Spreadsheet <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="url"
              value={ebyUrl}
              onChange={e => setEbyUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/1ymkvImybklzu36t08M60LiR3FlLx9YSR/edit..."
              className="w-full bg-slate-50 border border-slate-200 text-xs font-mono p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 transition-all"
            />
            <p className="text-[11px] text-slate-400">
              Spreadsheet ini menyimpan data program penyaluran bantuan non-dapil EBY Connect.
            </p>
          </div>

          {/* How Auto-Sync Works Box */}
          <div className="bg-slate-900 text-slate-100 p-4.5 rounded-xl text-xs space-y-2">
            <div className="font-bold text-blue-400 flex items-center gap-2 text-xs">
              <Database className="w-4 h-4 text-blue-400" /> Cara Kerja Real-Time Database Sync:
            </div>
            <ul className="list-disc list-inside text-slate-300 space-y-1.5 text-xs leading-relaxed">
              <li>Aplikasi terhubung langsung dengan Google Cloud Firestore (ID: <code className="text-blue-300 bg-slate-800 px-1.5 py-0.5 rounded">the-road-v7c1c</code>).</li>
              <li>Ketika seseorang mengedit, menambah, atau menghapus baris di Google Spreadsheet atau Form Presensi, klik tombol <strong>"Sync Sekarang"</strong>.</li>
              <li>Aplikasi akan membaca delta perubahannya dan memperbarui database secara instan untuk seluruh pengguna.</li>
            </ul>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Konfigurasi Spreadsheet Berhasil Disimpan ke Database!</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Konfigurasi</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
};

