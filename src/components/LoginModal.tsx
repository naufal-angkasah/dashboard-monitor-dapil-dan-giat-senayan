import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Role } from '../types';
import { ShieldCheck, UserCheck, Lock, LogIn, LogOut, Key, AlertCircle, Sparkles, X, CheckCircle2, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: Role;
  currentUser: string;
  onLoginSuccess: (role: Role, username: string) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole === 'Publik' ? 'Admin' : currentRole);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedRole === 'Admin') {
      if (!password) {
        setErrorMsg('Silakan masukkan kata sandi Admin.');
        return;
      }
      // Demo authentication check
      if (password !== 'admin123' && password !== 'admin') {
        setErrorMsg('Kata sandi Admin salah. (Gunakan PIN demo: admin123)');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const finalUsername = username.trim() || (selectedRole === 'Admin' ? 'Operator Tim Teknis' : 'Dr. H. Anggota DPR');
      onLoginSuccess(selectedRole, finalUsername);
      setPassword('');
      onClose();
    }, 500);
  };

  const handleQuickLogin = (role: Role) => {
    setSelectedRole(role);
    setErrorMsg('');
    const defaultUser = role === 'Admin' ? 'Operator Tim Teknis' : 'Dr. H. Anggota DPR';
    onLoginSuccess(role, defaultUser);
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="bg-white border border-slate-200 p-6 rounded-2xl max-w-md w-full shadow-2xl relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 pr-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="bg-blue-600 text-white p-2 rounded-xl shadow-xs shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-extrabold text-base text-slate-900 tracking-tight leading-snug truncate">
                  Autentikasi & Kelola Akun
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate">
                  Sistem Autentikasi Dapil Jatim VII
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-xl transition-colors cursor-pointer shrink-0 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Session Card with LOGOUT button if logged in */}
          {currentRole !== 'Publik' && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl mb-4 shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl font-extrabold flex items-center justify-center text-xs text-white ${
                  currentRole === 'Admin' ? 'bg-blue-600' : 'bg-cyan-600'
                }`}>
                  {currentRole === 'Admin' ? 'ADM' : 'PMP'}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Sedang Login Sebagai:</p>
                  <p className="font-bold text-sm text-white">{currentUser}</p>
                  <p className="text-[11px] text-cyan-300 font-semibold">Peran: {currentRole}</p>
                </div>
              </div>

              <button
                onClick={handleLogoutClick}
                className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          )}

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-xl mb-4 border border-slate-200/80">
            <button
              type="button"
              onClick={() => { setSelectedRole('Admin'); setErrorMsg(''); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'Admin'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-200" />
              <span>Admin / Operator</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('Pimpinan'); setErrorMsg(''); }}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'Pimpinan'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-cyan-200" />
              <span>Pimpinan / User</span>
            </button>
          </div>

          {/* Role Description Card */}
          <div className={`p-3.5 rounded-2xl border mb-4 text-xs ${
            selectedRole === 'Admin' 
              ? 'bg-blue-50/80 border-blue-200/80 text-blue-950'
              : 'bg-cyan-50/80 border-cyan-200/80 text-cyan-950'
          }`}>
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-blue-600" />
              {selectedRole === 'Admin' ? 'Hak Akses Admin Operator:' : 'Hak Akses Pimpinan / Executive:'}
            </p>
            <p className="text-[11px] leading-relaxed opacity-90">
              {selectedRole === 'Admin'
                ? 'Kelola Master Data (Tambah, Edit, Hapus), Upload Excel, Atur Status Program (Perencanaan/Berjalan/Selesai), & Sync Spreadsheets.'
                : 'Tampilan khusus Pimpinan: Fokus pada program Terealisasi (Selesai 100%), Ringkasan KPI Eksekutif, Peta Persebaran & Laporan Realisasi.'}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Pengguna / Identitas
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={selectedRole === 'Admin' ? 'Contoh: Operator Tim Teknis' : 'Contoh: Dr. H. Anggota DPR'}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl font-medium bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 focus:outline-none transition-all shadow-2xs"
                />
              </div>
            </div>

            {selectedRole === 'Admin' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Kata Sandi Admin</span>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">PIN: admin123</span>
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan PIN Admin (admin123)..."
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl font-medium bg-slate-50/80 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-900 focus:outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Memproses Login...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk sebagai {selectedRole}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Access Demo Divider */}
          <div className="my-4 flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
            <div className="flex-1 border-t border-slate-200"></div>
            <span>Masuk Instan (Tanpa Ketik)</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('Admin')}
              className="p-2.5 border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Login Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('Pimpinan')}
              className="p-2.5 border border-cyan-200 bg-cyan-50/70 hover:bg-cyan-100 text-cyan-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>Login Pimpinan</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
