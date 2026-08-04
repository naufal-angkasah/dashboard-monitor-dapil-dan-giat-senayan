import React from 'react';
import { motion } from 'motion/react';
import { 
  FolderKanban, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle2, 
  CalendarClock,
  Sparkles,
  Eye,
  Info
} from 'lucide-react';
import { Role, ProgramItem } from '../types';

interface KpiCardsProps {
  programs: ProgramItem[];
  role: Role;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ programs, role }) => {
  // Calculated stats based on passed programs (which are already filtered by role if needed)
  const totalPrograms = programs.length;

  // Unique Desas
  const uniqueDesas = new Set(programs.map((p) => `${p.kabupaten}-${p.kecamatan}-${p.desa}`)).size;

  // Total Beneficiaries
  const totalBeneficiaries = programs.reduce((sum, p) => sum + (p.jumlahPenerima || 0), 0);

  // Status breakdown
  const programSelesai = programs.filter((p) => p.status === 'Selesai').length;
  const programBerjalan = programs.filter((p) => p.status === 'Berjalan').length;
  const programPerencanaan = programs.filter((p) => p.status === 'Perencanaan').length;

  // Card definitions with STELLAR light theme palette matching image.png
  const kpiList = [
    {
      id: 'total-program',
      title: 'Total Program Dapil',
      value: totalPrograms.toLocaleString('id-ID'),
      subtitle: role === 'Pimpinan' ? 'Terealisasi Tuntas' : 'Semua Status Realisasi',
      badge: '+100% Realisasi',
      iconBg: 'bg-blue-600 text-white',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: FolderKanban,
      visible: true,
    },
    {
      id: 'total-penerima',
      title: 'Total Penerima Manfaat',
      value: totalBeneficiaries.toLocaleString('id-ID'),
      subtitle: 'Jiwa / Penerima Bantuan',
      badge: 'Cakupan Tinggi',
      iconBg: 'bg-cyan-600 text-white',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: Users,
      visible: true,
    },
    {
      id: 'total-desa',
      title: 'Cakupan Desa / Kelurahan',
      value: `${uniqueDesas} Desa`,
      subtitle: 'Terjangkau Aspirasi',
      badge: 'Pacitan-Ngawi',
      iconBg: 'bg-indigo-600 text-white',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: MapPin,
      visible: true,
    },
    {
      id: 'program-selesai',
      title: 'Program Selesai',
      value: programSelesai.toLocaleString('id-ID'),
      subtitle: 'Tuntas & Terdistribusi',
      badge: '100% Selesai',
      iconBg: 'bg-emerald-600 text-white',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      visible: true,
    },
    {
      id: 'program-berjalan',
      title: 'Program Berjalan',
      value: programBerjalan.toLocaleString('id-ID'),
      subtitle: 'Proses Pengerjaan',
      badge: 'On Progress',
      iconBg: 'bg-amber-500 text-white',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
      visible: role === 'Admin',
    },
    {
      id: 'program-perencanaan',
      title: 'Program Perencanaan',
      value: programPerencanaan.toLocaleString('id-ID'),
      subtitle: 'Tahap Penganggaran',
      badge: 'Usulan',
      iconBg: 'bg-slate-700 text-white',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: CalendarClock,
      visible: role === 'Admin',
    },
  ].filter((item) => item.visible);

  return (
    <div className="mb-3.5">
      {/* Pimpinan Notice Banner if role is Pimpinan */}
      {role === 'Pimpinan' && (
        <div className="mb-4 bg-blue-50/90 border border-blue-200/80 p-3.5 rounded-2xl shadow-xs flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-blue-950">
          <div className="flex items-center gap-2.5">
            <span className="bg-blue-600 text-white p-1.5 rounded-lg shrink-0">
              <Eye className="w-4 h-4" />
            </span>
            <span>
              <strong>Mode Tampilan Pimpinan / User:</strong> Menampilkan data program dengan status <strong className="text-emerald-700">Selesai (Terealisasi)</strong>.
            </span>
          </div>
          <span className="bg-blue-200/70 text-blue-900 px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase shrink-0">
            Dapil Jatim VII
          </span>
        </div>
      )}

      {/* Grid of STELLAR KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpiList.map((kpi, index) => {
          const IconComp = kpi.icon;
          return (
            <motion.div
              key={kpi.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -2 }}
              className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-2xs hover:shadow-xs hover:border-blue-300 flex flex-col justify-between transition-all relative overflow-hidden"
            >
              {/* Top Row: Title & Badge & Icon */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                    {kpi.title}
                  </span>
                  <div className={`${kpi.iconBg} p-2 rounded-xl shadow-2xs shrink-0`}>
                    <IconComp className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
                    {kpi.value}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${kpi.badgeBg}`}>
                    {kpi.badge}
                  </span>
                </div>
              </div>

              {/* Bottom Row: Subtitle */}
              <div className="border-t border-slate-100 pt-2.5 mt-3 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>{kpi.subtitle}</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
