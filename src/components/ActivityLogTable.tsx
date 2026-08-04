import React, { useState, useMemo } from 'react';
import { ActivityLogItem, ActionType, Role } from '../types';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  UserCheck, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  FileSpreadsheet, 
  RefreshCw, 
  RotateCcw,
  Download,
  Calendar,
  User,
  CheckCircle2
} from 'lucide-react';

interface ActivityLogTableProps {
  logs: ActivityLogItem[];
  onClearLogs?: () => void;
}

export const ActivityLogTable: React.FC<ActivityLogTableProps> = ({ logs, onClearLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('ALL');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Role filter
      if (selectedRoleFilter !== 'ALL' && log.role !== selectedRoleFilter) {
        return false;
      }
      // Action filter
      if (selectedActionFilter !== 'ALL' && log.action !== selectedActionFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchUser = log.user.toLowerCase().includes(q);
        const matchTarget = log.target.toLowerCase().includes(q);
        const matchDetails = log.details.toLowerCase().includes(q);
        const matchId = log.id.toLowerCase().includes(q);
        if (!matchUser && !matchTarget && !matchDetails && !matchId) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedRoleFilter, selectedActionFilter, searchQuery]);

  const getActionBadge = (action: ActionType) => {
    switch (action) {
      case 'TAMBAH':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs">
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            Tambah Data
          </span>
        );
      case 'EDIT':
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs">
            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
            Ubah Data
          </span>
        );
      case 'HAPUS':
        return (
          <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs">
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            Hapus Data
          </span>
        );
      case 'IMPOR_EXCEL':
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
            Impor Excel
          </span>
        );
      case 'SYNC_SPREADSHEET':
        return (
          <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs">
            <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
            Sync Sheet
          </span>
        );
      case 'RESET':
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs">
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            Reset Data
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-[11px] font-bold">
            {action}
          </span>
        );
    }
  };

  const exportLogCSV = () => {
    const headers = ['ID,Waktu,Pengguna,Peran,Aksi,Target,Rincian Modifikasi'];
    const rows = filteredLogs.map((l) => 
      `"${l.id}","${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.target.replace(/"/g, '""')}","${l.details.replace(/"/g, '""')}"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Log_Aktivitas_Dapil_Jatim_VII_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-xs">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-lg text-slate-900 tracking-tight">
                LOG AKTIVITAS & REKAM JEJAK PERUBAHAN
              </h2>
              <span className="bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                {logs.length} Catatan
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Sistem pencatatan audit perubahan data (siapa, kapan, dan detail modifikasi) untuk akuntabilitas publik
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={exportLogCSV}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Ekspor CSV</span>
          </button>
          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Bersihkan Log Aktivitas"
            >
              Kosongkan Log
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pengguna, kode ID, atau detail perubahan..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        <div className="sm:col-span-3 flex items-center gap-1.5 bg-slate-50/80 border border-slate-200/80 rounded-xl px-2.5 py-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-500 shrink-0">Peran:</span>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none w-full cursor-pointer"
          >
            <option value="ALL">Semua Peran</option>
            <option value="Admin">Admin / Operator</option>
            <option value="Pimpinan">Pimpinan / Executive</option>
            <option value="Publik">Publik</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center gap-1.5 bg-slate-50/80 border border-slate-200/80 rounded-xl px-2.5 py-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-500 shrink-0">Aksi:</span>
          <select
            value={selectedActionFilter}
            onChange={(e) => setSelectedActionFilter(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none w-full cursor-pointer"
          >
            <option value="ALL">Semua Tipe Aksi</option>
            <option value="TAMBAH">Tambah Data</option>
            <option value="EDIT">Ubah Data</option>
            <option value="HAPUS">Hapus Data</option>
            <option value="IMPOR_EXCEL">Impor Excel</option>
            <option value="SYNC_SPREADSHEET">Sync Sheet</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-heading font-extrabold uppercase text-[11px] tracking-wider">
              <th className="p-3 border-r border-slate-200 w-36">Waktu & Tanggal</th>
              <th className="p-3 border-r border-slate-200 w-44">Pengguna (Role)</th>
              <th className="p-3 border-r border-slate-200 w-32 text-center">Tipe Aksi</th>
              <th className="p-3 border-r border-slate-200 w-48">Target Objek / Program</th>
              <th className="p-3">Detail Modifikasi & Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="font-bold text-slate-600">Tidak ada riwayat aktivitas ditemukan</p>
                  <p className="text-xs text-slate-400 mt-0.5">Coba ubah kata kunci atau filter yang Anda pilih</p>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                  {/* Timestamp */}
                  <td className="p-3 border-r border-slate-100 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{log.timestamp}</span>
                    </div>
                  </td>

                  {/* User & Role Badge */}
                  <td className="p-3 border-r border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shrink-0 ${
                        log.role === 'Admin' ? 'bg-blue-600' : log.role === 'Pimpinan' ? 'bg-cyan-600' : 'bg-slate-500'
                      }`}>
                        {log.role === 'Admin' ? 'ADM' : log.role === 'Pimpinan' ? 'PMP' : 'PB'}
                      </div>
                      <div className="leading-tight">
                        <p className="font-bold text-slate-900 text-xs">{log.user}</p>
                        <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                          {log.role === 'Admin' ? (
                            <ShieldCheck className="w-3 h-3 text-blue-600" />
                          ) : (
                            <UserCheck className="w-3 h-3 text-cyan-600" />
                          )}
                          <span>{log.role}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Action Badge */}
                  <td className="p-3 border-r border-slate-100 text-center whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>

                  {/* Target Object */}
                  <td className="p-3 border-r border-slate-100 font-bold text-slate-900">
                    <span className="line-clamp-2">{log.target}</span>
                  </td>

                  {/* Details */}
                  <td className="p-3 text-slate-700 leading-relaxed text-xs">
                    <p className="bg-slate-50 border border-slate-200/80 p-2 rounded-lg font-medium text-slate-700">
                      {log.details}
                    </p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info Banner */}
      <div className="bg-blue-50/60 border border-blue-200/80 p-3 rounded-xl flex items-center justify-between text-xs text-blue-900 font-medium">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Sistem secara otomatis mencatat setiap penambahan, pengubahan, penghapusan, dan sinkronisasi data secara real-time.</span>
        </div>
        <span className="font-bold text-[11px] bg-white border border-blue-200 px-2.5 py-0.5 rounded-md shadow-2xs">
          Audit Trail Active
        </span>
      </div>
    </div>
  );
};
