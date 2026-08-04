import React from 'react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';
import { ActivityItem } from '../types';
import { BarChart3, PieChart as PieIcon, TrendingUp, Building, Users } from 'lucide-react';

interface ChartsSectionProps {
  filteredActivities?: ActivityItem[];
  activities?: ActivityItem[];
  activeCategoryTab?: string;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ filteredActivities, activities }) => {
  const safeActivities = filteredActivities || activities || [];

  // 1. Komparasi MPR vs DPR
  const mprCount = safeActivities.filter(a => a.kategoriGiat === 'MPR').length;
  const dprCount = safeActivities.filter(a => a.kategoriGiat === 'DPR').length;
  const ebyCount = safeActivities.filter(a => a.kategoriGiat === 'EBY Connect').length;

  const pieData = [
    { name: 'MPR RI', value: mprCount, color: '#2563EB' },
    { name: 'DPR RI', value: dprCount, color: '#DC2626' },
    { name: 'EBY Connect', value: ebyCount, color: '#10B981' },
  ].filter(d => d.value > 0);

  // 2. Top 5 Instansi dengan Peserta Terbanyak
  const instansiMap: Record<string, { totalPeserta: number; totalGiat: number }> = {};
  safeActivities.forEach(a => {
    const inst = a.asalInstansi || 'Lainnya';
    if (!instansiMap[inst]) {
      instansiMap[inst] = { totalPeserta: 0, totalGiat: 0 };
    }
    instansiMap[inst].totalPeserta += a.jumlahPeserta;
    instansiMap[inst].totalGiat += 1;
  });

  const topInstansiData = Object.keys(instansiMap)
    .map(name => ({
      name: name.length > 20 ? name.substring(0, 18) + '...' : name,
      fullName: name,
      totalPeserta: instansiMap[name].totalPeserta,
      totalGiat: instansiMap[name].totalGiat,
    }))
    .sort((a, b) => b.totalPeserta - a.totalPeserta)
    .slice(0, 5);

  // 3. Top 5 Segmentasi Peserta
  const segmentMap: Record<string, number> = {};
  safeActivities.forEach(a => {
    const seg = a.segmentasiPeserta || 'Umum';
    segmentMap[seg] = (segmentMap[seg] || 0) + a.jumlahPeserta;
  });

  const topSegmentData = Object.keys(segmentMap)
    .map(name => ({
      name: name.length > 18 ? name.substring(0, 16) + '...' : name,
      fullName: name,
      totalPeserta: segmentMap[name],
    }))
    .sort((a, b) => b.totalPeserta - a.totalPeserta)
    .slice(0, 5);

  // 4. Jumlah Giat per Tahun
  const yearMap: Record<string, { MPR: number; DPR: number; EBY: number; Total: number }> = {
    '2023': { MPR: 0, DPR: 0, EBY: 0, Total: 0 },
    '2024': { MPR: 0, DPR: 0, EBY: 0, Total: 0 },
    '2025': { MPR: 0, DPR: 0, EBY: 0, Total: 0 },
    '2026': { MPR: 0, DPR: 0, EBY: 0, Total: 0 },
  };

  safeActivities.forEach(a => {
    if (!yearMap[a.tahun]) {
      yearMap[a.tahun] = { MPR: 0, DPR: 0, EBY: 0, Total: 0 };
    }
    if (a.kategoriGiat === 'MPR') yearMap[a.tahun].MPR += 1;
    else if (a.kategoriGiat === 'DPR') yearMap[a.tahun].DPR += 1;
    else if (a.kategoriGiat === 'EBY Connect') yearMap[a.tahun].EBY += 1;
    yearMap[a.tahun].Total += 1;
  });

  const giatPerTahunData = Object.keys(yearMap).map(year => ({
    tahun: year,
    MPR: yearMap[year].MPR,
    DPR: yearMap[year].DPR,
    EBY: yearMap[year].EBY,
    Total: yearMap[year].Total,
  }));

  // 5. Jumlah Giat Berdasarkan Jenis Giat
  const jenisMap: Record<string, number> = {};
  safeActivities.forEach(a => {
    const jenis = a.jenisGiat || 'Lainnya';
    jenisMap[jenis] = (jenisMap[jenis] || 0) + 1;
  });

  const giatPerJenisData = Object.keys(jenisMap)
    .map(name => ({
      name,
      jumlahGiat: jenisMap[name],
    }))
    .sort((a, b) => b.jumlahGiat - a.jumlahGiat)
    .slice(0, 6);

  // 6. Tren Giat 6 Bulan Terakhir
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  let maxDate = new Date();
  const validDates = safeActivities.map(a => new Date(a.tanggal).getTime()).filter(t => !isNaN(t));
  if (validDates.length > 0) {
    maxDate = new Date(Math.max(...validDates));
  }
  
  const trendData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(maxDate.getFullYear(), maxDate.getMonth() - i, 1);
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    trendData.push({
      yearMonth,
      name: `${monthNames[d.getMonth()]} ${String(d.getFullYear()).substring(2)}`,
      Total: 0,
      MPR: 0,
      DPR: 0,
      EBY: 0
    });
  }

  safeActivities.forEach(a => {
    const d = new Date(a.tanggal);
    if (!isNaN(d.getTime())) {
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const target = trendData.find(r => r.yearMonth === ym);
      if (target) {
        if (a.kategoriGiat === 'MPR') target.MPR += 1;
        else if (a.kategoriGiat === 'DPR') target.DPR += 1;
        else if (a.kategoriGiat === 'EBY Connect') target.EBY += 1;
        target.Total += 1;
      }
    }
  });

  // Custom Eye-Friendly Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-700/80 shadow-xl text-xs z-50 font-sans"
        >
          <p className="font-bold text-blue-300 uppercase mb-1 tracking-wider text-[11px]">{label || payload[0]?.name || ''}</p>
          {(payload || []).map((entry: any, index: number) => (
            <p key={`item-${index}`} className="flex items-center gap-2 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color || entry.fill || entry.stroke }} />
              <span className="text-slate-300">{entry.name}: <strong className="text-white font-semibold">{(entry.value || 0).toLocaleString('id-ID')}</strong></span>
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6 mb-8"
    >
      {/* SECTION TITLE */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Statistik & Visualisasi Analytics Kegiatan
          </h2>
        </div>
        <span className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 px-3 py-1 rounded-full hidden sm:inline-block">
          Grafik Recharts Real-Time
        </span>
      </div>

      {/* CHART GRID ROW 1: Donut MPR vs DPR & Top Instansi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* DONUT CHART: Komparasi MPR vs DPR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-4 bg-white p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between rounded-2xl"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider">
                Komparasi Giat MPR vs DPR
              </h3>
            </div>
            <span className="text-[10px] font-semibold bg-slate-50 border border-slate-200 px-2 py-0.5 text-slate-600 rounded-full">
              Persentase
            </span>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={1200}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-center text-slate-500">
            Total kegiatan dikomparasi: <strong className="text-slate-900">{filteredActivities.length}</strong> Giat
          </div>
        </motion.div>

        {/* BAR CHART: Top 5 Instansi Peserta Terbanyak */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-8 bg-white p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between rounded-2xl"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-rose-600" />
              <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider">
                Top 5 Instansi dengan Partisipasi Peserta Terbanyak
              </h3>
            </div>
            <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
              Total Peserta
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topInstansiData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#475569' }} 
                  interval={0}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="totalPeserta" 
                  name="Jumlah Peserta" 
                  fill="#E11D48" 
                  radius={[6, 6, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
            <span>Instansi Teratas: <strong className="text-slate-900">{topInstansiData[0]?.fullName || '-'}</strong></span>
            <span className="text-rose-600 font-semibold">{topInstansiData[0]?.totalPeserta.toLocaleString('id-ID') || 0} Peserta</span>
          </div>
        </motion.div>

      </div>

      {/* CHART GRID ROW 2: Tren per Tahun & Top Segmentasi & Jenis Giat & Tren 6 Bulan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LINE CHART: Tren 6 Bulan Terakhir */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between rounded-2xl"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider">
                Tren Giat (6 Bulan Terakhir)
              </h3>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="MPR" name="MPR" stroke="#2563EB" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6, strokeWidth: 0 }} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
                <Line type="monotone" dataKey="DPR" name="DPR" stroke="#E11D48" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6, strokeWidth: 0 }} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
                <Line type="monotone" dataKey="EBY" name="EBY" stroke="#059669" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6, strokeWidth: 0 }} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* BAR CHART: Jumlah Giat per Tahun */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between rounded-2xl"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider">
                Tren Giat per Tahun
              </h3>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={giatPerTahunData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="tahun" tick={{ fontSize: 11, fontWeight: 600, fill: '#475569' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="MPR" name="MPR" stackId="a" fill="#2563EB" radius={[0, 0, 0, 0]} />
                <Bar dataKey="DPR" name="DPR" stackId="a" fill="#E11D48" radius={[0, 0, 0, 0]} />
                <Bar dataKey="EBY" name="EBY" stackId="a" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* BAR CHART: Top 5 Segmentasi Peserta */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between rounded-2xl"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-xs uppercase text-slate-900 tracking-wider">
                Top 5 Segmentasi Peserta
              </h3>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSegmentData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fontWeight: 600, fill: '#475569' }} width={85} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalPeserta" name="Peserta" fill="#F59E0B" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* BAR CHART: Jenis Kegiatan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between rounded-2xl"
        >
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <h3 className="font-black text-xs uppercase text-slate-900">
                Distribusi Jenis Kegiatan
              </h3>
            </div>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={giatPerJenisData} margin={{ top: 10, right: 10, left: -25, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: '#0f172a' }} interval={0} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#0f172a' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="jumlahGiat" name="Total Giat" fill="#7C3AED" stroke="#0f172a" strokeWidth={1.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};


