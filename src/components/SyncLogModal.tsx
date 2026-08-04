import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, History, CheckCircle2, Clock, Sparkles, FileSpreadsheet } from 'lucide-react';
import { SyncLog } from '../types';

interface SyncLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncLogs?: SyncLog[];
  logs?: SyncLog[];
}

export const SyncLogModal: React.FC<SyncLogModalProps> = ({ isOpen, onClose, syncLogs, logs }) => {
  if (!isOpen) return null;

  const logsList = syncLogs || logs || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white border border-slate-200/80 shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto rounded-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  Log Sinkronisasi Database Google Sheet
                </h3>
                <p className="text-xs text-blue-100">Riwayat aktivitas sinkronisasi real-time</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4 font-sans text-xs">
            <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl font-medium text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Status Auto-Sync: <strong>ACTIVE (Real-time)</strong></span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                CLOUD ONLINE
              </span>
            </div>

            <div className="space-y-3">
              {logsList.map((log) => (
                <div 
                  key={log.id}
                  className="bg-slate-50/80 p-4 border border-slate-200 rounded-xl text-xs flex items-start gap-3"
                >
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-semibold text-slate-900">{log.description}</span>
                      <span className="text-[11px] text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {log.timestamp}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-500">
                      <span>Sumber: <strong className="text-slate-800">{log.source}</strong></span>
                      <span>Jumlah: <strong className="text-blue-600">+{log.recordsCount} Record</strong></span>
                      <span className="text-emerald-600 font-semibold">● {log.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Tutup Log
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

