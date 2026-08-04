import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { motion } from 'motion/react';
import { BarChart3, PieChart as PieChartIcon, Award, Trophy, MapPin, Building, TrendingUp, CheckCircle2, Calendar } from 'lucide-react';
import { ProgramItem } from '../types';

interface DistributionAnalysisProps {
  programs: ProgramItem[];
}

export const DistributionAnalysis: React.FC<DistributionAnalysisProps> = ({ programs }) => {
  // 1. Programs per Kabupaten
  const dataPerKabupaten = useMemo(() => {
    const map: Record<string, { total: number; penerima: number }> = {};
    programs.forEach((p) => {
      if (!map[p.kabupaten]) {
        map[p.kabupaten] = { total: 0, penerima: 0 };
      }
      map[p.kabupaten].total += 1;
      map[p.kabupaten].penerima += p.jumlahPenerima;
    });

    return Object.entries(map).map(([nama, val]) => ({
      name: nama.replace('Kab. ', ''),
      fullName: nama,
      totalProgram: val.total,
      totalPenerima: val.penerima,
    }));
  }, [programs]);

  // 2. Top 10 Kecamatan
  const top10Kecamatan = useMemo(() => {
    const map: Record<string, { total: number; kabupaten: string }> = {};
    programs.forEach((p) => {
      const key = `${p.kecamatan} (${p.kabupaten.replace('Kab. ', '')})`;
      if (!map[key]) {
        map[key] = { total: 0, kabupaten: p.kabupaten };
      }
      map[key].total += 1;
    });

    return Object.entries(map)
      .map(([name, val]) => ({
        name,
        total: val.total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [programs]);

  // 3. Top 10 Desa
  const top10Desa = useMemo(() => {
    const map: Record<string, { total: number; kecamatan: string }> = {};
    programs.forEach((p) => {
      const key = `${p.desa} (${p.kecamatan})`;
      if (!map[key]) {
        map[key] = { total: 0, kecamatan: p.kecamatan };
      }
      map[key].total += 1;
    });

    return Object.entries(map)
      .map(([name, val]) => ({
        name,
        total: val.total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [programs]);

  // 4. Jenis Program (Individu vs Kelompok)
  const dataJenisProgram = useMemo(() => {
    const individu = programs.filter((p) => p.jenisProgram === 'Individu').length;
    const kelompok = programs.filter((p) => p.jenisProgram === 'Kelompok').length;
    return [
      { name: 'Individu', value: individu, color: '#2563EB' },
      { name: 'Kelompok', value: kelompok, color: '#06B6D4' },
    ];
  }, [programs]);

  // 5. Tren Penyelesaian Program 6 Bulan Terakhir
  const dataTrend6Bulan = useMemo(() => {
    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const validPrograms = programs.filter((p) => p.tanggalPelaksanaan && p.tanggalPelaksanaan.length >= 7);

    let maxYear = 2024;
    let maxMonth = 8; // Default August 2024

    if (validPrograms.length > 0) {
      validPrograms.forEach((p) => {
        const parts = p.tanggalPelaksanaan.split('-');
        if (parts.length >= 2) {
          const y = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10);
          if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
            if (y > maxYear || (y === maxYear && m > maxMonth)) {
              maxYear = y;
              maxMonth = m;
            }
          }
        }
      });
    }

    const targetMonths: { year: number; month: number; key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      let m = maxMonth - i;
      let y = maxYear;
      while (m <= 0) {
        m += 12;
        y -= 1;
      }
      const key = `${y}-${String(m).padStart(2, '0')}`;
      const label = `${MONTH_NAMES[m - 1]} ${y}`;
      targetMonths.push({ year: y, month: m, key, label });
    }

    return targetMonths.map((tm) => {
      const matchingPrograms = programs.filter((p) => {
        if (!p.tanggalPelaksanaan || p.tanggalPelaksanaan.length < 7) return false;
        return p.tanggalPelaksanaan.startsWith(tm.key);
      });

      const totalSelesai = matchingPrograms.filter((p) => p.status === 'Selesai').length;
      const totalBerjalan = matchingPrograms.filter((p) => p.status === 'Berjalan').length;
      const totalPenerima = matchingPrograms.reduce((acc, curr) => acc + (curr.jumlahPenerima || 0), 0);

      return {
        bulan: tm.label,
        totalSelesai,
        totalBerjalan,
        totalPenerima,
      };
    });
  }, [programs]);

  // Executive Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-700 text-xs font-sans">
          <p className="font-heading font-extrabold text-white pb-1 mb-1.5 border-b border-slate-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-semibold text-slate-200 my-1 flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.stroke || entry.fill || entry.color || '#38BDF8' }} />
                <span>{entry.name}:</span>
              </span>
              <strong style={{ color: entry.stroke || entry.fill || entry.color || '#38BDF8' }} className="font-bold">
                {entry.value.toLocaleString('id-ID')}
              </strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-xs mb-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
        <div className="bg-blue-600 text-white p-2 rounded-xl shadow-xs">
          <BarChart3 className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="font-heading font-extrabold text-lg text-slate-900">
            ANALISIS PERSEBARAN & STATISTIK PROGRAM DAPIL
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Visualisasi tren penyelesaian program 6 bulan terakhir, distribusi per Kabupaten, Kecamatan, Desa, dan Jenis Penerima
          </p>
        </div>
      </div>

      {/* Chart Line: Tren Penyelesaian Program 6 Bulan Terakhir */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-slate-50/90 border border-slate-200/80 p-4 sm:p-5 rounded-2xl mb-6 shadow-2xs hover:border-slate-300 transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Tren Penyelesaian Program (6 Bulan Terakhir)
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Pertumbuhan bulanan jumlah program yang selesai dan penerima manfaat di Dapil Jatim VII
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <span className="bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-1 text-[11px] font-bold rounded-lg flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              {dataTrend6Bulan.reduce((acc, d) => acc + d.totalSelesai, 0)} Program Selesai
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 text-[11px] font-bold rounded-lg flex items-center gap-1.5 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              6 Bulan
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataTrend6Bulan} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="bulan"
                tick={{ fontSize: 11, fontWeight: 'bold', fill: '#475569' }}
                padding={{ left: 15, right: 15 }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fontWeight: 'bold', fill: '#475569' }}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fontWeight: 'bold', fill: '#059669' }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span className="text-xs font-bold text-slate-700">{value}</span>} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalSelesai"
                name="Program Selesai"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ r: 5, fill: '#2563EB', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ r: 7, fill: '#1D4ED8' }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="totalBerjalan"
                name="Program Berjalan"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 4, fill: '#F59E0B', strokeWidth: 1.5, stroke: '#ffffff' }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalPenerima"
                name="Total Penerima"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10B981', strokeWidth: 1.5, stroke: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Jumlah Program per Kabupaten */}
        <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-600" />
              Jumlah Program per Kabupaten
            </h3>
            <span className="bg-blue-50 text-blue-700 border border-blue-200/80 px-2 py-0.5 text-[10px] font-bold rounded-full">
              Dapil Jatim VII
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataPerKabupaten} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#475569' }} interval={0} />
                <YAxis tick={{ fontSize: 11, fontWeight: 'bold', fill: '#475569' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalProgram" name="Total Program" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Jenis Program (Individu vs Kelompok) */}
        <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <PieChartIcon className="w-4 h-4 text-cyan-600" />
              Proporsi Jenis Program (Individu vs Kelompok)
            </h3>
            <span className="bg-cyan-50 text-cyan-700 border border-cyan-200/80 px-2 py-0.5 text-[10px] font-bold rounded-full">
              Penerima
            </span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataJenisProgram}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {dataJenisProgram.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span className="text-xs font-bold text-slate-700">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table/List: Top 10 Kecamatan */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Top 10 Kecamatan Terbanyak Bantuan
            </h3>
            <span className="bg-sky-100 text-sky-800 border border-sky-200 px-2 py-0.5 text-[10px] font-bold rounded">
              Kecamatan
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {top10Kecamatan.map((kec, idx) => (
              <div
                key={kec.name}
                className="flex items-center justify-between p-2 border border-slate-200 rounded-lg bg-white text-xs font-medium shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-bold">{kec.name}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[11px]">
                  {kec.total} Program
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Table/List: Top 10 Desa */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Top 10 Desa / Kelurahan Terbanyak
            </h3>
            <span className="bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.5 text-[10px] font-bold rounded">
              Desa/Kel.
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {top10Desa.map((desa, idx) => (
              <div
                key={desa.name}
                className="flex items-center justify-between p-2 border border-slate-200 rounded-lg bg-white text-xs font-medium shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-bold">{desa.name}</span>
                </div>
                <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded font-bold text-[11px]">
                  {desa.total} Program
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
