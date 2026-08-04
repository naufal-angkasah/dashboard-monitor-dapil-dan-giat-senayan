import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserCheck, Lock, Mail, Key, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Role } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (role: Role, username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [viewMode, setViewMode] = useState<'LOGIN' | 'FORGOT' | 'RESET'>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<Role>('Pimpinan');
  const [username, setUsername] = useState('Dr. H. Anggota DPR');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password reset state
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState('');

  const handleRoleChange = (role: Role) => {
    setSelectedRole(role);
    setUsername(role === 'Admin' ? 'Operator Tim Teknis' : 'Dr. H. Anggota DPR');
    setPassword('password123');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const dbKey = `dapil_user_pass_${username.trim().toLowerCase()}`;
    const storedPass = localStorage.getItem(dbKey);

    if (selectedRole === 'Admin') {
      const validPass = storedPass || 'admin123';
      if (password && password !== validPass && password !== 'admin123' && password !== 'password123') {
        setErrorMsg('Kata Sandi Admin salah! (PIN default: admin123)');
        return;
      }
    } else {
      const validPass = storedPass || 'password123';
      if (password && password !== validPass && password !== 'password123') {
        setErrorMsg('Kata Sandi Pimpinan salah! Silakan periksa atau gunakan Lupa Password.');
        return;
      }
    }

    const finalName = username.trim() || (selectedRole === 'Admin' ? 'Operator Tim Teknis' : 'Dr. H. Anggota DPR');
    onLoginSuccess(selectedRole, finalName);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!resetEmail) {
      setErrorMsg('Masukkan email aktif Anda.');
      return;
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpCode(generatedOtp);
    setDemoOtpHint(generatedOtp);
    setSuccessMsg(`Kode verifikasi OTP reset password telah dikirim ke ${resetEmail}.`);
    setViewMode('RESET');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newPassword || newPassword.length < 4) {
      setErrorMsg('Password baru minimal 4 karakter.');
      return;
    }

    const dbKey = `dapil_user_pass_${username.trim().toLowerCase()}`;
    localStorage.setItem(dbKey, newPassword);

    setSuccessMsg('Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.');
    setTimeout(() => {
      setPassword(newPassword);
      setViewMode('LOGIN');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 relative font-sans select-none">
      {/* Visual Accent Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full relative z-10 space-y-4"
      >
        {/* Portal Title Badge */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-bold shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PORTAL MONITORING DAPIL JATIM VII</span>
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Sistem Informasi Program Aspirasi
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Pacitan &bull; Ponorogo &bull; Trenggalek &bull; Magetan &bull; Ngawi
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
          {viewMode === 'LOGIN' && (
            <>
              {/* Role Switcher */}
              <div className="p-2 bg-slate-100 border-b border-slate-200 grid grid-cols-2 gap-1.5 font-bold">
                <button
                  type="button"
                  onClick={() => handleRoleChange('Pimpinan')}
                  className={`py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === 'Pimpinan'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-cyan-200" />
                  <span>Akun Pemerintah / Pimpinan</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('Admin')}
                  className={`py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    selectedRole === 'Admin'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-200" />
                  <span>Akun Admin Operator</span>
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  selectedRole === 'Pimpinan'
                    ? 'bg-cyan-50 border-cyan-200 text-cyan-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}>
                  <p className="font-bold mb-0.5">
                    {selectedRole === 'Pimpinan' ? 'Hak Akses Pimpinan / Executive:' : 'Hak Akses Admin Operator:'}
                  </p>
                  <p className="text-[11px] opacity-90">
                    {selectedRole === 'Pimpinan'
                      ? 'Fokus memantau Program Terealisasi (Status SELESAI), KPI Realisasi Anggaran, Penetrasi Wilayah, & Cetak Laporan.'
                      : 'Akses penuh kelola data: Tambah/Edit Program, Upload Berkas Excel, Atur Status Program, & Sinkronisasi Sheet.'}
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Pengguna / Identitas
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={selectedRole === 'Pimpinan' ? 'Contoh: Dr. H. Anggota DPR' : 'Contoh: Operator Tim Teknis'}
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Kata Sandi / Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(selectedRole === 'Admin' ? 'admin@dapiljatim.go.id' : 'pimpinan@dpr.go.id');
                        setErrorMsg('');
                        setSuccessMsg('');
                        setViewMode('FORGOT');
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Lupa Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
                  <span>Demo Credential:</span>
                  <span className="font-bold text-blue-700">
                    {selectedRole === 'Admin' ? 'PASS: admin123' : 'PASS: password123'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all text-xs cursor-pointer"
                >
                  Masuk sebagai {selectedRole}
                </button>
              </form>
            </>
          )}

          {viewMode === 'FORGOT' && (
            <form onSubmit={handleForgotSubmit} className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewMode('LOGIN')}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span>Reset Kata Sandi</span>
              </div>

              <div className="space-y-0.5">
                <h3 className="font-extrabold text-sm text-slate-900">Pemulihan Password</h3>
                <p className="text-xs text-slate-500">
                  Masukkan email aktif yang terdaftar untuk menerima kode OTP verifikasi.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Aktif
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Contoh: pimpinan@dpr.go.id"
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all text-xs cursor-pointer"
              >
                Kirim Kode OTP Reset
              </button>
            </form>
          )}

          {viewMode === 'RESET' && (
            <form onSubmit={handleResetSubmit} className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewMode('FORGOT')}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span>Verifikasi OTP & Kata Sandi Baru</span>
              </div>

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-0.5">
                  <p className="font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Kode OTP Terkirim
                  </p>
                  <p className="text-[11px]">{successMsg}</p>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kode OTP Verifikasi
                </label>
                <input
                  type="text"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-center py-2.5 rounded-xl font-bold text-slate-900 tracking-widest text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                {demoOtpHint && (
                  <p className="text-[10px] text-blue-600 font-semibold mt-1">
                    Kode OTP Simulasi Terisi: <strong>{demoOtpHint}</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  required
                  minLength={4}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan kata sandi baru..."
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md shadow-emerald-500/20 transition-all text-xs cursor-pointer"
              >
                Simpan Kata Sandi Baru
              </button>
            </form>
          )}
        </div>

        <p className="text-[10px] text-center text-slate-400 font-medium">
          Dapil Jatim VII &bull; Tim Teknis & Eksekutif DPR RI
        </p>
      </motion.div>
    </div>
  );
};
