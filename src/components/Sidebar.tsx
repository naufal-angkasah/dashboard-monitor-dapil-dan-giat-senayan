import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  BarChart3,
  Layers,
  MapPin,
  ChevronRight,
  X,
  Activity,
  SlidersHorizontal,
  Building2,
  Landmark,
  Building,
  Sparkles,
  Users,
  ClipboardList,
} from 'lucide-react';
import { Role } from '../types';

// Active tab union: Dapil tabs + Senayan tabs
export type ActiveTab =
  | 'overview'
  | 'analytic'
  | 'daftar_program'
  | 'senayan_all'
  | 'senayan_mpr'
  | 'senayan_dpr'
  | 'senayan_eby'
  | 'daftar_hadir';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  role: Role;
  currentUser: string;
  totalPrograms: number;
  totalLogs: number;
  // Senayan counts
  totalGiatAll: number;
  totalGiatMPR: number;
  totalGiatDPR: number;
  totalGiatEBY: number;
  totalAttendance: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

const DAPIL_MENU = [
  {
    id: 'overview' as const,
    title: 'Overview',
    subtitle: 'Ringkasan, Filter & Peta Sebaran',
    icon: LayoutDashboard,
    activeBg: 'bg-blue-600 text-white shadow-md shadow-blue-500/20',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    countKey: 'totalPrograms' as const,
  },
  {
    id: 'analytic' as const,
    title: 'Analytic',
    subtitle: 'Analisis & Visualisasi Grafis',
    icon: BarChart3,
    activeBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20',
    badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    countKey: 'five' as const,
  },
  {
    id: 'daftar_program' as const,
    title: 'Daftar Program',
    subtitle: 'Katalog & Direktori Program',
    icon: Layers,
    activeBg: 'bg-purple-600 text-white shadow-md shadow-purple-500/20',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    countKey: 'totalPrograms' as const,
  },
];

const SENAYAN_MENU = [
  {
    id: 'senayan_all' as const,
    title: 'Overview Giat',
    subtitle: 'MPR, DPR & EBY Connect',
    icon: Building2,
    activeBg: 'bg-blue-600 text-white shadow-md shadow-blue-500/20',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    countKey: 'totalGiatAll' as const,
  },
  {
    id: 'senayan_mpr' as const,
    title: 'Giat MPR RI',
    subtitle: '4 Pilar & Aspirasi Konstituen',
    icon: Landmark,
    activeBg: 'bg-amber-500 text-white shadow-md shadow-amber-500/20',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-200',
    countKey: 'totalGiatMPR' as const,
  },
  {
    id: 'senayan_dpr' as const,
    title: 'Giat DPR RI',
    subtitle: 'Kunker, RDP & Pengawasan',
    icon: Building,
    activeBg: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20',
    badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    countKey: 'totalGiatDPR' as const,
  },
  {
    id: 'senayan_eby' as const,
    title: 'EBY Connect',
    subtitle: 'Bantuan Direct & Beasiswa',
    icon: Sparkles,
    activeBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20',
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    countKey: 'totalGiatEBY' as const,
  },
  {
    id: 'daftar_hadir' as const,
    title: 'Daftar Hadir',
    subtitle: 'Presensi & Absensi Digital',
    icon: ClipboardList,
    activeBg: 'bg-rose-500 text-white shadow-md shadow-rose-500/20',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-200',
    countKey: 'totalAttendance' as const,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  role,
  currentUser,
  totalPrograms,
  totalGiatAll,
  totalGiatMPR,
  totalGiatDPR,
  totalGiatEBY,
  totalAttendance,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const countMap: Record<string, number> = {
    totalPrograms,
    five: 5,
    totalGiatAll,
    totalGiatMPR,
    totalGiatDPR,
    totalGiatEBY,
    totalAttendance,
  };

  const renderMenuItem = (item: (typeof DAPIL_MENU)[0] | (typeof SENAYAN_MENU)[0]) => {
    const IconComp = item.icon;
    const isActive = activeTab === item.id;
    const count = countMap[item.countKey] ?? 0;

    return (
      <button
        key={item.id}
        onClick={() => {
          setActiveTab(item.id);
          setIsOpenMobile(false);
        }}
        className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between group ${
          isActive
            ? item.activeBg
            : 'bg-white hover:bg-slate-100/90 text-slate-700 border border-slate-200/80 shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`p-2 rounded-lg shrink-0 ${
              isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-white'
            }`}
          >
            <IconComp className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className={`font-bold text-xs leading-tight truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
              {item.title}
            </p>
            <p className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
              {item.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isActive ? 'bg-white/20 text-white border-white/30' : item.badgeClass
            }`}
          >
            {count.toLocaleString('id-ID')}
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${
              isActive ? 'text-white translate-x-0.5' : 'text-slate-400 group-hover:translate-x-0.5'
            }`}
          />
        </div>
      </button>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4 space-y-5 font-sans">
      <div className="space-y-5">
        {/* Branding Badge */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl border border-slate-700/80 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-tight leading-none">
                MONITORING TERPADU
              </h2>
              <p className="text-[10px] text-blue-200 font-semibold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Dapil Jatim VII & Giat Senayan
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-700/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Peran Akses:</span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-md font-bold uppercase text-[10px]">
              {role}
            </span>
          </div>
        </div>

        {/* Section A: Monitoring Dapil */}
        <div>
          <div className="px-1 mb-2.5 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              MONITORING DAPIL JATIM VII
            </span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <nav className="space-y-1.5">
            {DAPIL_MENU.map(renderMenuItem)}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200/80" />

        {/* Section B: Monitoring Senayan */}
        <div>
          <div className="px-1 mb-2.5 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              MONITORING GIAT SENAYAN
            </span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <nav className="space-y-1.5">
            {SENAYAN_MENU.map(renderMenuItem)}
          </nav>
        </div>

        {/* Regional Coverage Info */}
        <div className="bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-2xs space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
              <Activity className="w-3.5 h-3.5 text-blue-600" /> Wilayah Dapil VII
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full font-bold">
              100% Active
            </span>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Ngawi & Ponorogo</span>
              <span className="font-bold text-slate-900">2 Kab</span>
            </div>
            <div className="flex justify-between">
              <span>Pacitan, Magetan, Trenggalek</span>
              <span className="font-bold text-slate-900">3 Kab</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Footer */}
      <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200/60">
        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
          {role === 'Admin' ? 'AD' : 'EX'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-xs text-slate-900 truncate">{currentUser}</p>
          <p className="text-[10px] text-slate-500 font-medium capitalize truncate">Hak Akses: {role}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 xl:w-72 shrink-0 border-r border-slate-200/80 bg-slate-50/60 min-h-[calc(100vh-64px)]">
        <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto scrollbar-none">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpenMobile(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-80 max-w-[85vw] bg-slate-50 h-full shadow-2xl z-10 overflow-y-auto"
            >
              <button
                onClick={() => setIsOpenMobile(false)}
                className="absolute top-3 right-3 p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
