// ============================================================
// MERGED TYPES — Dapil + Senayan
// ============================================================

// ─── DAPIL TYPES ─────────────────────────────────────────────
export type Role = 'Admin' | 'Pimpinan' | 'Publik';

export type StatusProgram = 'Selesai' | 'Berjalan' | 'Perencanaan' | 'Belum Ada Program';

export type JenisProgram = 'Individu' | 'Kelompok';

export interface GeneratedLinkItem {
  id: string;
  namaGiat: string;
  kategori: string;
  jenis: string;
  tanggal: string;
  url: string;
  qrCodeData: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface SenayanActivity {
  id: string;
  namaGiat: string;
  instansi: string;
  kategori: 'Pendidikan/Kampus' | 'Pemerintahan/Pemkab' | 'Keagamaan/Ormas' | 'Pemuda/Pelajar' | 'UMKM/Komunitas';
  tipeLembaga: 'OP9 (DPR RI)' | 'MP9 (MPR RI)' | 'EB7 (Fraksi)';
  tanggal: string;
  jumlahPeserta: number;
  lokasiRuang: string;
  status: 'Selesai' | 'Terjadwal' | 'Batal';
  penanggungJawab: string;
  berkasUrl?: string;
  qrCodeUrl?: string;
}

export interface ProgramItem {
  id: string;
  tahun: number;
  komisi: string;
  namaProgram: string;
  jenisProgram: JenisProgram;
  namaPenerima: string;
  nik: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  jumlahPenerima: number;
  status: StatusProgram;
  anggaran: number;
  lat: number;
  lng: number;
  tanggalPelaksanaan: string;
  deskripsi: string;
  penanggungJawab?: string;
}

export interface FilterState {
  tahun: string;
  komisi: string;
  program: string;
  jenisProgram: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
  status: string;
  searchQuery: string;
}

export interface KabupatenData {
  nama: string;
  populasi: number;
  totalPenerima: number;
  totalProgram: number;
  lat: number;
  lng: number;
}

export type ActionType = 'TAMBAH' | 'EDIT' | 'HAPUS' | 'IMPOR_EXCEL' | 'SYNC_SPREADSHEET' | 'RESET';

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: Role;
  action: ActionType;
  target: string;
  details: string;
}

// ─── SENAYAN TYPES ────────────────────────────────────────────
export type KategoriGiat = 'MPR' | 'DPR' | 'EBY Connect';

export interface ActivityItem {
  id: string;
  tahun: string;
  kategoriGiat: KategoriGiat;
  jenisGiat: string;
  temaGiat: string;
  namaGiat: string;
  namaPeserta: string;
  asalInstansi: string;
  segmentasiPeserta: string;
  kontak: string;
  jumlahPeserta: number;
  lokasi: string;
  kabupaten?: string;
  kecamatan?: string;
  desa?: string;
  tanggal: string;
  status: 'Terlaksana' | 'Sedang Berjalan' | 'Terjadwal';
  source: 'Google Form' | 'Excel Upload' | 'Manual' | 'Google Sheet Auto-Sync';
  catatan?: string;
  fotoDokumentasi?: string[];
  notulensi?: string;
  notulensiFile?: { name: string; url: string; size?: string };
}

export interface EbyConnectProgram {
  id: string;
  tahun: string;
  jenisProgram: string;
  namaProgram: string;
  penerima: string;
  jumlahPenerima: number;
  wilayah: string;
  kabupaten?: string;
  kecamatan?: string;
  status: 'Penyaluran Selesai' | 'Proses Penyaluran' | 'Verifikasi Data';
  instansiMitra: string;
  tanggal: string;
  kontak: string;
}

export interface AttendanceRecord {
  id: string;
  activityId: string;
  namaPeserta: string;
  nik?: string;
  kontak?: string;
  instansi: string;
  jabatan?: string;
  waktuHadir: string;
  fotoSelfie?: string;
  statusKehadiran?: 'Hadir' | 'Izin' | 'Sakit';
  catatan?: string;
  tahun?: string;
  kategoriGiat?: KategoriGiat;
  jenisGiat?: string;
  temaGiat?: string;
  namaGiat?: string;
  segmentasiPeserta?: string;
}

export interface SenayanFilterState {
  tahun: string;
  kategoriGiat: 'ALL' | 'MPR' | 'DPR' | 'EBY Connect';
  jenisGiat: string;
  temaGiat: string;
  segmentasiPeserta: string;
  instansi: string;
  searchQuery: string;
  kabupaten?: string;
}

export interface SyncLog {
  id: string;
  timestamp: string;
  source: 'Google Form' | 'Excel Upload' | 'Google Sheet Auto-Sync' | 'Manual Add';
  status: 'Success' | 'Syncing' | 'Failed';
  recordsCount: number;
  description: string;
}

export type UserRole = 'public' | 'pimpinan' | 'admin';

export interface ExecutiveSummaryStats {
  totalGiat: number;
  totalPeserta: number;
  totalInstansi: number;
  totalSegmentasi: number;
  totalTema: number;
  giatMPR: number;
  giatDPR: number;
  giatEBY: number;
  percentMPR: number;
  percentDPR: number;
}

export interface GoogleSheetConfig {
  senayanSheetUrl: string;
  ebySheetUrl: string;
  lastSyncedAt?: string;
}
