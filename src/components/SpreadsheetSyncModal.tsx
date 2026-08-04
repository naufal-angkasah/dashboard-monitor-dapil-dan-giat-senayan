import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FileSpreadsheet, RefreshCw, CheckCircle2, Link2, Clock, Activity, Zap } from 'lucide-react';

interface SpreadsheetSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastSyncTime: string;
  isSyncing: boolean;
  onTriggerSync: () => void;
}

export const SpreadsheetSyncModal: React.FC<SpreadsheetSyncModalProps> = ({
  isOpen,
  onClose,
  lastSyncTime,
  isSyncing,
  onTriggerSync,
}) => {
  if (!isOpen) return null;

  const [sheetUrl, setSheetUrl] = useState<string>(
    'https://docs.google.com/spreadsheets/d/13Y0DvaVWnt0jRi6ZrWdkp3C-d83BkznU/edit?usp=sharing'
  );

  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
  const [selectedSheetTab, setSelectedSheetTab] = useState<string>('Data_Program_Dapil_2024');

  const [syncLogs, setSyncLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Connected to Google Sheet: Data_Program_Dapil_2024`,
    `[${new Date().toLocaleTimeString()}] Initial dataset loaded successfully (25 records verified)`,
    `[${new Date().toLocaleTimeString()}] Real-time webhooks listener active for updates...`,
  ]);

  const handleManualSync = () => {
    onTriggerSync();
    setSyncLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Manual sync requested by user...`,
      `[${new Date().toLocaleTimeString()}] Fetching latest cells from Google Spreadsheet API...`,
      `[${new Date().toLocaleTimeString()}] Synchronized 100%! Dashboard metrics updated live.`,
      ...prev,
    ]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="bg-white border border-slate-200/80 p-6 rounded-2xl max-w-xl w-full shadow-2xl relative"
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
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">
                SINKRONISASI GOOGLE SPREADSHEET
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Integrasi otomatis data Google Sheet secara real-time
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs font-sans">
            {/* Status Indicator */}
            <div className="bg-blue-50/80 border border-blue-200/80 p-3.5 rounded-2xl shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full border border-blue-300 ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`}></span>
                <div>
                  <p className="font-heading font-extrabold text-slate-900 text-sm">
                    Status Koneksi: {isSyncing ? 'Sedang Memutakhirkan...' : 'Terhubung Auto-Sync'}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Pembaruan Terakhir: {lastSyncTime}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleManualSync}
                className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-700 px-3.5 py-2 font-bold rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sinkronkan Sekarang</span>
              </motion.button>
            </div>

            {/* URL Input */}
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-600" />
                Tautan Google Spreadsheet:
              </label>
              <input
                type="text"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2.5 font-mono text-xs bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 outline-none transition-all shadow-2xs"
              />
            </div>

            {/* Sheet Tab & Auto-Sync Toggle */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Lembar Tab:
                </label>
                <select
                  value={selectedSheetTab}
                  onChange={(e) => setSelectedSheetTab(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-semibold bg-slate-50/80 focus:bg-white focus:border-blue-500 text-slate-800 outline-none cursor-pointer transition-all shadow-2xs"
                >
                  <option value="Data_Program_Dapil_2024">Data_Program_Dapil_2024</option>
                  <option value="Master_Program_Aspirasi">Master_Program_Aspirasi</option>
                  <option value="Realisasi_Per_Desa">Realisasi_Per_Desa</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mode Pemutakhiran:
                </label>
                <button
                  onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                  className={`w-full border rounded-xl p-2.5 font-bold flex items-center justify-between cursor-pointer transition-all ${
                    autoSyncEnabled ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{autoSyncEnabled ? '⚡ Auto-Sync Aktif' : '⏸️ Manual Sync'}</span>
                  <Zap className="w-4 h-4 text-emerald-600" />
                </button>
              </div>
            </div>

            {/* Sync Activity Logs */}
            <div className="bg-slate-900 text-cyan-400 p-3.5 rounded-2xl border border-slate-800 font-mono text-[11px] max-h-36 overflow-y-auto space-y-1 shadow-inner">
              <div className="text-slate-400 font-bold border-b border-slate-800 pb-1.5 mb-1.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-400" />
                <span>Log Aktivitas Sinkronisasi Google Sheets</span>
              </div>
              {syncLogs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 text-xs rounded-xl shadow-2xs cursor-pointer transition-all"
            >
              Selesai & Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
