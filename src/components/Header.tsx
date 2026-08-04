import React from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Database, 
  SlidersHorizontal,
  Search,
  X,
  LogIn,
  LogOut,
  Users,
  Menu
} from 'lucide-react';
import { Role } from '../types';

interface HeaderProps {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: string;
  onLogout: () => void;
  onOpenLoginModal: () => void;
  onOpenSyncModal: () => void;
  onOpenUploadModal: () => void;
  onOpenMasterDataModal: () => void;
  onToggleMobileFilter: () => void;
  onToggleMobileSidebar?: () => void;
  lastSyncTime: string;
  isSyncing: boolean;
  totalProgramCount: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  currentUser,
  onLogout,
  onOpenLoginModal,
  onOpenSyncModal,
  onOpenUploadModal,
  onOpenMasterDataModal,
  onToggleMobileFilter,
  onToggleMobileSidebar,
  isSyncing,
  searchQuery = '',
  onSearchChange,
}) => {
  return (
    <header className="bg-white border-b border-slate-200/80 px-4 py-2.5 sm:px-6 sticky top-0 z-50 shadow-xs text-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: MONITORING Brand & Title */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Mobile Sidebar Toggle Button */}
            {onToggleMobileSidebar && (
              <button
                onClick={onToggleMobileSidebar}
                className="md:hidden p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                title="Buka Menu Sidebar"
              >
                <Menu className="w-4 h-4 text-blue-600" />
                <span className="text-[11px]">Menu</span>
              </button>
            )}

            <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-xs shadow-cyan-300 animate-pulse"></span>
            <span className="font-heading font-black text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
              MONITORING <span className="text-blue-600 font-extrabold text-xs bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">DAPIL JATIM VII</span>
            </span>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onToggleMobileFilter}
              className="bg-blue-600 text-white p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Center: Search input bar (Desktop & Mobile) */}
        <form onSubmit={(e) => e.preventDefault()} className="flex items-center w-full md:w-auto md:flex-1 md:max-w-md md:mx-4 my-1 md:my-0">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Cari program, kabupaten, kecamatan, desa, NIK..."
              className="w-full bg-slate-100/90 border border-slate-200/80 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-800 font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/80 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange && onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Right: Action Pills & Clear Account / Login / Logout Controls */}
        <div className="flex items-center flex-wrap justify-end gap-2 w-full md:w-auto">
          {/* Admin / Pimpinan Action Pills */}
          {role !== 'Publik' && (
            <>
              {/* Sync Sheet Status Pill */}
              <button
                onClick={onOpenSyncModal}
                className="bg-slate-100/90 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                title="Auto-Sync Google Spreadsheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Google Sheet</span>
                <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`}></span>
              </button>

              {/* Upload Excel Pill (Admin Only) */}
              {role === 'Admin' && (
                <button
                  onClick={onOpenUploadModal}
                  className="bg-slate-100/90 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  title="Impor Berkas Excel Data Program"
                >
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>Upload Excel</span>
                </button>
              )}

              {/* Master Data Pill (Admin Only) */}
              {role === 'Admin' && (
                <button
                  onClick={onOpenMasterDataModal}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Master Data</span>
                </button>
              )}
            </>
          )}

          {/* User Authentication & Account Control Section */}
          {role === 'Publik' ? (
            <div className="flex items-center gap-1.5">
              <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Mode</span> Publik
              </span>
              <button
                onClick={onOpenLoginModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Sistem</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
              {/* Profile Card Button */}
              <button
                onClick={onOpenLoginModal}
                className="bg-white text-slate-800 hover:bg-slate-50 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                title="Klik untuk lihat detail akun / ganti peran"
              >
                <span className={`font-black text-[10px] w-5 h-5 rounded-md flex items-center justify-center text-white ${
                  role === 'Admin' ? 'bg-blue-600' : 'bg-cyan-600'
                }`}>
                  {role === 'Admin' ? 'ADM' : 'PMP'}
                </span>
                <div className="text-left leading-tight hidden sm:block">
                  <p className="font-bold text-[11px] text-slate-900">{currentUser}</p>
                  <p className="text-[9px] text-slate-500 font-semibold">{role}</p>
                </div>
              </button>

              {/* Explicit LOG OUT Button */}
              <button
                onClick={onLogout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Keluar dari akun (Log Out)"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-[11px]">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
