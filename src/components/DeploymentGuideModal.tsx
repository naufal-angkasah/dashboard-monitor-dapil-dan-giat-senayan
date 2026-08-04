import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Rocket, 
  Cloud, 
  Terminal, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Server,
  Database
} from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-slate-200/80 shadow-2xl w-full max-w-3xl rounded-2xl overflow-hidden my-8"
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Panduan Lengkap Deployment Aplikasi</span>
                <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-semibold">
                  Production Ready
                </span>
              </h3>
              <p className="text-xs text-blue-100">
                Langkah-langkah menayangkan aplikasi ke Cloud Run / Vercel / Netlify / Firebase Hosting
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
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto font-sans">
          
          {/* Quick Summary Badge */}
          <div className="bg-blue-50/70 border border-blue-200/80 p-5 rounded-2xl text-xs space-y-2">
            <div className="font-bold text-blue-950 uppercase text-sm flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-700" /> Arsitektur Siap Production
            </div>
            <p className="text-slate-700 leading-relaxed">
              Aplikasi ini sudah dibangun menggunakan <strong>React 19 + Vite + Tailwind CSS + Firebase Firestore Database</strong>. Semua data kegiatan, presensi peserta, foto dokumentasi, dan notulensi tersimpan secara terpusat di Firestore.
            </p>
          </div>

          {/* Option 1: AI Studio / Cloud Run (Rekomendasi Utama) */}
          <div className="border border-slate-200/80 rounded-2xl p-5 bg-slate-50/50 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Cloud className="w-4 h-4 text-blue-600" /> Opsi 1: Google Cloud Run / AI Studio Share (Paling Mudah)
              </h4>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full">
                Rekomendasi
              </span>
            </div>

            <ol className="list-decimal list-inside text-xs font-mono text-slate-700 space-y-2 leading-relaxed">
              <li>
                <strong>Klik Tombol Share / Deploy</strong> pada menu kanan atas AI Studio.
              </li>
              <li>
                Aplikasi akan secara otomatis di-bundle menggunakan Docker Container dan di-deploy ke <strong>Google Cloud Run</strong> dengan domain HTTPS HTTPS aktif secara gratis.
              </li>
              <li>
                Link domain publik langsung dapat dibagikan ke pimpinan atau pendaftar kegiatan seluruh provinsi!
              </li>
            </ol>
          </div>

          {/* Option 2: Vercel / Netlify */}
          <div className="border-2 border-slate-900 rounded-lg p-4 bg-slate-50 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-300 pb-2">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-emerald-600" /> Opsi 2: Deployment via Vercel / Netlify (Custom Domain)
              </h4>
              <span className="bg-blue-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono">
                Gratis Custom Domain
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-700">
              <p>1. Export / Download source code project dari AI Studio menu <strong>Settings &gt; Export Zip / Export to GitHub</strong>.</p>
              <p>2. Push repository ke akun GitHub Anda.</p>
              <p>3. Buka dashboard <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-blue-700 underline font-bold">Vercel.com</a> atau <a href="https://netlify.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-bold">Netlify.com</a>.</p>
              <p>4. Import repository dari GitHub, lalu atur setting Build:</p>

              <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-[11px] space-y-1 my-2">
                <div>Build Command: <code className="text-amber-300">npm run build</code></div>
                <div>Output Directory: <code className="text-amber-300">dist</code></div>
                <div>Install Command: <code className="text-amber-300">npm install</code></div>
              </div>

              <p>5. Klik <strong>Deploy</strong>. Vercel / Netlify akan memberikan URL publik dalam hitungan detik.</p>
            </div>
          </div>

          {/* Option 3: Firebase Hosting */}
          <div className="border-2 border-slate-900 rounded-lg p-4 bg-slate-50 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-300 pb-2">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-600" /> Opsi 3: Deployment via Firebase Hosting
              </h4>
              <span className="bg-amber-500 text-slate-900 text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono">
                Satu Ekosistem Firestore
              </span>
            </div>

            <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-[11px] space-y-1">
              <div className="text-amber-300 font-bold mb-1">Jalankan di Terminal / Command Prompt local:</div>
              <div>npm install -g firebase-tools</div>
              <div>firebase login</div>
              <div>firebase init hosting (pilih directory dist)</div>
              <div>npm run build</div>
              <div>firebase deploy</div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-3.5 border-t-2 border-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-900 text-white px-5 py-2 rounded text-xs font-bold hover:bg-slate-800 cursor-pointer"
          >
            Mengerti & Tutup Modal
          </button>
        </div>

      </motion.div>
    </div>
  );
};

