import React, { useState, useMemo, useEffect } from 'react';
import { Role, ProgramItem, FilterState, ActivityLogItem, ActionType } from './types';
import {
  ActivityItem,
  EbyConnectProgram,
  SenayanFilterState,
  SyncLog,
  ExecutiveSummaryStats,
  AttendanceRecord,
  GoogleSheetConfig,
} from './types';
import { INITIAL_PROGRAMS, INITIAL_ACTIVITY_LOGS } from './data/mockData';
import {
  INITIAL_ACTIVITIES,
  INITIAL_EBY_PROGRAMS,
  INITIAL_SYNC_LOGS,
  INITIAL_ATTENDANCE_RECORDS,
} from './data/senayanMockData';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';

// Dapil components
import { KpiCards } from './components/KpiCards';
import { FilterBar } from './components/FilterBar';
import { MobileFilterDrawer } from './components/MobileFilterDrawer';
import { MapVisualization } from './components/MapVisualization';
import { DistributionAnalysis } from './components/DistributionAnalysis';
import { DetailTable } from './components/DetailTable';
import { ActivityLogTable } from './components/ActivityLogTable';
import { DaftarProgramView } from './components/DaftarProgramView';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { MasterDataModal } from './components/MasterDataModal';
import { SpreadsheetSyncModal } from './components/SpreadsheetSyncModal';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';
import { LinkGeneratorModal } from './components/LinkGeneratorModal';

// Senayan components
import { ExecutiveSummaryCards } from './components/ExecutiveSummaryCards';
import { FilterSection } from './components/FilterSection';
import { ChartsSection } from './components/ChartsSection';
import { DataTable } from './components/DataTable';
import { EbyConnectView } from './components/EbyConnectView';
import { DaftarHadirView } from './components/DaftarHadirView';
import { FormInputGiatModal } from './components/FormInputGiatModal';
import { DetailModal } from './components/DetailModal';
import { SenayanExcelUploadModal } from './components/SenayanExcelUploadModal';
import { SyncLogModal } from './components/SyncLogModal';
import { AbsenGeneratorModal } from './components/AbsenGeneratorModal';
import { PublicAbsenView } from './components/PublicAbsenView';
import { GoogleSheetConfigModal } from './components/GoogleSheetConfigModal';
import { DeploymentGuideModal } from './components/DeploymentGuideModal';
import { GoogleFormModal } from './components/GoogleFormModal';

import { db, collection, onSnapshot, setDoc, doc } from './lib/firebase';

export default function App() {
  const THIRTY_MIN_MS = 30 * 60 * 1000;

  // ─── AUTH STATE ──────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const isLogged = sessionStorage.getItem('isLoggedIn_merged') === 'true';
    const lastActive = sessionStorage.getItem('merged_auth_time');
    if (!isLogged || !lastActive) { sessionStorage.clear(); return false; }
    if (Date.now() - Number(lastActive) > THIRTY_MIN_MS) { sessionStorage.clear(); return false; }
    sessionStorage.setItem('merged_auth_time', String(Date.now()));
    return true;
  });
  const [role, setRole] = useState<Role>(() => {
    const saved = sessionStorage.getItem('merged_role');
    return (saved as Role) || 'Pimpinan';
  });
  const [currentUser, setCurrentUser] = useState<string>(() => {
    return sessionStorage.getItem('merged_user') || 'Dr. H. Anggota DPR';
  });

  const handleLoginSuccess = (selectedRole: Role, username: string) => {
    setRole(selectedRole);
    setCurrentUser(username);
    setIsLoggedIn(true);
    sessionStorage.setItem('merged_role', selectedRole);
    sessionStorage.setItem('merged_user', username);
    sessionStorage.setItem('isLoggedIn_merged', 'true');
    sessionStorage.setItem('merged_auth_time', String(Date.now()));
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setRole('Pimpinan');
    setCurrentUser('Dr. H. Anggota DPR');
  };

  // 30-min inactivity logout
  useEffect(() => {
    if (!isLoggedIn) return;
    const handleActivity = () => {
      const last = sessionStorage.getItem('merged_auth_time');
      if (last && Date.now() - Number(last) > THIRTY_MIN_MS) { handleLogout(); }
      else { sessionStorage.setItem('merged_auth_time', String(Date.now())); }
    };
    const interval = setInterval(handleActivity, 60000);
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isLoggedIn]);

  // ─── SIDEBAR / TAB STATE ─────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // ─── DAPIL STATE ─────────────────────────────────────────────
  const [programs, setPrograms] = useState<ProgramItem[]>(() => {
    try { const s = localStorage.getItem('dapil_programs'); return s ? JSON.parse(s) : INITIAL_PROGRAMS; }
    catch { return INITIAL_PROGRAMS; }
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => {
    try { const s = localStorage.getItem('dapil_activity_logs'); return s ? JSON.parse(s) : INITIAL_ACTIVITY_LOGS; }
    catch { return INITIAL_ACTIVITY_LOGS; }
  });
  const [dapilFilters, setDapilFilters] = useState<FilterState>({
    tahun: '', komisi: '', program: '', jenisProgram: '',
    provinsi: 'Jawa Timur', kabupaten: '', kecamatan: '', desa: '', status: '', searchQuery: '',
  });
  const resetDapilFilters = () => setDapilFilters({
    tahun: '', komisi: '', program: '', jenisProgram: '',
    provinsi: 'Jawa Timur', kabupaten: '', kecamatan: '', desa: '', status: '', searchQuery: '',
  });

  useEffect(() => { localStorage.setItem('dapil_programs', JSON.stringify(programs)); }, [programs]);
  useEffect(() => { localStorage.setItem('dapil_activity_logs', JSON.stringify(activityLogs)); }, [activityLogs]);

  const addLog = (action: ActionType, target: string, details: string) => {
    const newLog: ActivityLogItem = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      user: currentUser, role, action, target, details,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const filteredPrograms = useMemo(() => {
    return programs.filter(p => {
      if (role === 'Pimpinan' && p.status !== 'Selesai') return false;
      if (dapilFilters.tahun && p.tahun !== Number(dapilFilters.tahun)) return false;
      if (dapilFilters.komisi && p.komisi !== dapilFilters.komisi) return false;
      if (dapilFilters.program && p.namaProgram !== dapilFilters.program) return false;
      if (dapilFilters.jenisProgram && p.jenisProgram !== dapilFilters.jenisProgram) return false;
      if (dapilFilters.kabupaten && p.kabupaten !== dapilFilters.kabupaten) return false;
      if (dapilFilters.kecamatan && p.kecamatan !== dapilFilters.kecamatan) return false;
      if (dapilFilters.desa && p.desa !== dapilFilters.desa) return false;
      if (role === 'Admin' && dapilFilters.status && p.status !== dapilFilters.status) return false;
      if (dapilFilters.searchQuery.trim()) {
        const q = dapilFilters.searchQuery.toLowerCase();
        if (![p.namaProgram, p.namaPenerima, p.nik, p.desa, p.kecamatan, p.kabupaten, p.id]
          .some(v => v.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [programs, role, dapilFilters]);

  // Dapil CRUD
  const handleAddProgram = (newP: ProgramItem) => {
    setPrograms(prev => [newP, ...prev]);
    addLog('TAMBAH', `${newP.id} - ${newP.namaProgram}`, `Menambah program ${newP.jenisProgram} di ${newP.kabupaten}`);
  };
  const handleUpdateProgram = (updated: ProgramItem) => {
    setPrograms(prev => prev.map(p => p.id === updated.id ? updated : p));
    addLog('EDIT', `${updated.id} - ${updated.namaProgram}`, `Mengubah data program (${updated.status})`);
  };
  const handleDeleteProgram = (id: string) => {
    const t = programs.find(p => p.id === id);
    if (confirm('Yakin ingin menghapus data program ini?')) {
      setPrograms(prev => prev.filter(p => p.id !== id));
      addLog('HAPUS', `Program ID: ${id}`, `Menghapus program ${t?.namaProgram || ''}`);
    }
  };
  const handleResetData = () => {
    if (confirm('Kembalikan basis data ke data sampel awal?')) {
      setPrograms(INITIAL_PROGRAMS);
      setActivityLogs(INITIAL_ACTIVITY_LOGS);
      localStorage.removeItem('dapil_programs');
      localStorage.removeItem('dapil_activity_logs');
      addLog('RESET', 'Basis Data Master', 'Mengembalikan basis data ke sampel awal');
    }
  };
  const handleImportExcel = (newItems: ProgramItem[]) => {
    setPrograms(prev => [...newItems, ...prev]);
    addLog('IMPOR_EXCEL', 'Berkas Excel', `Mengimpor ${newItems.length} record program baru`);
  };

  // Dapil sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => { setIsSyncing(false); setLastSyncTime(new Date().toLocaleTimeString()); }, 1500);
    }, 45000);
    return () => clearInterval(interval);
  }, []);
  const triggerManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString());
      addLog('SYNC_SPREADSHEET', 'Google Sheets Cloud Sync', 'Sinkronisasi cloud otomatis berhasil');
    }, 1200);
  };

  // ─── SENAYAN STATE ───────────────────────────────────────────
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [ebyPrograms, setEbyPrograms] = useState<EbyConnectProgram[]>(INITIAL_EBY_PROGRAMS);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(INITIAL_SYNC_LOGS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE_RECORDS);
  const [activeCategoryTab, setActiveCategoryTab] = useState<'ALL' | 'MPR' | 'DPR' | 'EBY Connect' | 'daftar_hadir'>('ALL');
  const [senayanFilter, setSenayanFilter] = useState<SenayanFilterState>({
    tahun: 'ALL', kategoriGiat: 'ALL', jenisGiat: 'ALL', temaGiat: 'ALL',
    segmentasiPeserta: 'ALL', instansi: 'ALL', searchQuery: '',
  });
  const [publicAbsenActivityId, setPublicAbsenActivityId] = useState<string | null>(null);
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>({
    senayanSheetUrl: '', ebySheetUrl: '',
  });

  // Sync activeTab -> activeCategoryTab for Senayan sections
  useEffect(() => {
    if (activeTab === 'senayan_all') setActiveCategoryTab('ALL');
    else if (activeTab === 'senayan_mpr') setActiveCategoryTab('MPR');
    else if (activeTab === 'senayan_dpr') setActiveCategoryTab('DPR');
    else if (activeTab === 'senayan_eby') setActiveCategoryTab('EBY Connect');
    else if (activeTab === 'daftar_hadir') setActiveCategoryTab('daftar_hadir');
  }, [activeTab]);

  // Firestore listeners for Senayan
  useEffect(() => {
    let unsubAct: (() => void) | undefined;
    let unsubAtt: (() => void) | undefined;
    try {
      unsubAct = onSnapshot(collection(db, 'activities'), snap => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ ...d.data() } as ActivityItem));
          setActivities(prev => {
            const map = new Map<string, ActivityItem>();
            prev.forEach(a => map.set(a.id, a));
            loaded.forEach(a => map.set(a.id, a));
            return Array.from(map.values());
          });
        }
      }, err => console.warn('Firestore activities error:', err));

      unsubAtt = onSnapshot(collection(db, 'attendance'), snap => {
        if (!snap.empty) {
          const loaded = snap.docs.map(d => ({ ...d.data() } as AttendanceRecord));
          setAttendanceRecords(prev => {
            const map = new Map<string, AttendanceRecord>();
            prev.forEach(r => map.set(r.id, r));
            loaded.forEach(r => map.set(r.id, r));
            return Array.from(map.values());
          });
        }
      }, err => console.warn('Firestore attendance error:', err));
    } catch (e) {
      console.warn('Firestore init error:', e);
    }
    return () => { unsubAct?.(); unsubAtt?.(); };
  }, []);

  // Check public absen URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const aid = params.get('absen');
    if (aid) setPublicAbsenActivityId(aid);
  }, []);

  // Senayan filtered activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (activeCategoryTab === 'MPR' && activity.kategoriGiat !== 'MPR') return false;
      if (activeCategoryTab === 'DPR' && activity.kategoriGiat !== 'DPR') return false;
      if (activeCategoryTab === 'EBY Connect' && activity.kategoriGiat !== 'EBY Connect') return false;
      if (senayanFilter.tahun !== 'ALL' && activity.tahun !== senayanFilter.tahun) return false;
      if (senayanFilter.kategoriGiat !== 'ALL' && activity.kategoriGiat !== senayanFilter.kategoriGiat) return false;
      if (senayanFilter.jenisGiat !== 'ALL' && activity.jenisGiat !== senayanFilter.jenisGiat) return false;
      if (senayanFilter.temaGiat !== 'ALL' && activity.temaGiat !== senayanFilter.temaGiat) return false;
      if (senayanFilter.segmentasiPeserta !== 'ALL' && activity.segmentasiPeserta !== senayanFilter.segmentasiPeserta) return false;
      if (senayanFilter.instansi !== 'ALL' && activity.asalInstansi !== senayanFilter.instansi) return false;
      if (senayanFilter.searchQuery.trim()) {
        const q = senayanFilter.searchQuery.toLowerCase();
        if (!['namaGiat','asalInstansi','temaGiat','namaPeserta','jenisGiat'].some(k =>
          (activity as any)[k]?.toLowerCase().includes(q))) return false;
      }
      return true;
    });
  }, [activities, senayanFilter, activeCategoryTab]);

  // Stats from filtered activities (for content area)
  const stats: ExecutiveSummaryStats = useMemo(() => {
    const giatMPR = filteredActivities.filter(a => a.kategoriGiat === 'MPR').length;
    const giatDPR = filteredActivities.filter(a => a.kategoriGiat === 'DPR').length;
    const giatEBY = filteredActivities.filter(a => a.kategoriGiat === 'EBY Connect').length;
    const totalGiat = filteredActivities.length;
    const totalPeserta = filteredActivities.reduce((s, a) => s + a.jumlahPeserta, 0);
    const totalInstansi = new Set(filteredActivities.map(a => a.asalInstansi)).size;
    const totalSegmentasi = new Set(filteredActivities.map(a => a.segmentasiPeserta)).size;
    const totalTema = new Set(filteredActivities.map(a => a.temaGiat)).size;
    const denominator = giatMPR + giatDPR || 1;
    return {
      totalGiat, totalPeserta, totalInstansi, totalSegmentasi, totalTema,
      giatMPR, giatDPR, giatEBY,
      percentMPR: Math.round((giatMPR / denominator) * 100),
      percentDPR: Math.round((giatDPR / denominator) * 100),
    };
  }, [filteredActivities]);

  // Global stats for sidebar badges (never filtered by tab)
  const globalStats = useMemo(() => {
    const giatMPR = activities.filter(a => a.kategoriGiat === 'MPR').length;
    const giatDPR = activities.filter(a => a.kategoriGiat === 'DPR').length;
    const giatEBY = activities.filter(a => a.kategoriGiat === 'EBY Connect').length;
    return { all: activities.length, mpr: giatMPR, dpr: giatDPR, eby: giatEBY };
  }, [activities]);

  // Senayan CRUD
  const handleAddNewActivity = async (newAct: ActivityItem) => {
    setActivities(prev => [newAct, ...prev]);
    const newAtt: AttendanceRecord = {
      id: `ATT-${Date.now()}`, activityId: newAct.id,
      tahun: newAct.tahun, kategoriGiat: newAct.kategoriGiat,
      jenisGiat: newAct.jenisGiat, temaGiat: newAct.temaGiat, namaGiat: newAct.namaGiat,
      namaPeserta: newAct.namaPeserta || 'Peserta Giat',
      instansi: newAct.asalInstansi || '—',
      segmentasiPeserta: newAct.segmentasiPeserta || 'Umum',
      kontak: newAct.kontak || '—',
      waktuHadir: new Date().toISOString().replace('T', ' ').slice(0, 16),
      statusKehadiran: 'Hadir',
    };
    setAttendanceRecords(prev => [newAtt, ...prev]);
    const log: SyncLog = {
      id: `LOG-${Date.now()}`, timestamp: new Date().toLocaleString('id-ID'),
      source: 'Google Form', status: 'Success', recordsCount: 1,
      description: `Input kegiatan baru: "${newAct.namaGiat}"`,
    };
    setSyncLogs(prev => [log, ...prev]);
    try {
      await setDoc(doc(db, 'activities', newAct.id), newAct);
      await setDoc(doc(db, 'attendance', newAtt.id), newAtt);
    } catch (e) { console.warn('Firestore write error:', e); }
  };

  const handleUpdateActivity = async (updated: ActivityItem) => {
    setActivities(prev => prev.map(a => a.id === updated.id ? updated : a));
    if (selectedSenayanActivity?.id === updated.id) setSelectedSenayanActivity(updated);
    try { await setDoc(doc(db, 'activities', updated.id), updated); }
    catch (e) { console.warn('Firestore update error:', e); }
  };

  const handleSubmitAttendance = async (record: AttendanceRecord) => {
    const fullRecord: AttendanceRecord = { ...record, id: record.id || `ATT-${Date.now()}` };
    setAttendanceRecords(prev => {
      const exists = prev.find(r => r.id === fullRecord.id);
      return exists ? prev.map(r => r.id === fullRecord.id ? fullRecord : r) : [fullRecord, ...prev];
    });
    try { await setDoc(doc(db, 'attendance', fullRecord.id), fullRecord); }
    catch (e) { console.warn('Firestore attendance save error:', e); }
  };

  // ─── MODAL STATE ────────────────────────────────────────────
  // Dapil modals
  const [selectedProgramModal, setSelectedProgramModal] = useState<ProgramItem | null>(null);
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLinkGeneratorOpen, setIsLinkGeneratorOpen] = useState(false);

  // Senayan modals
  const [selectedSenayanActivity, setSelectedSenayanActivity] = useState<ActivityItem | null>(null);
  const [isFormInputGiatOpen, setIsFormInputGiatOpen] = useState(false);
  const [isSenayanExcelOpen, setIsSenayanExcelOpen] = useState(false);
  const [isSyncLogOpen, setIsSyncLogOpen] = useState(false);
  const [isAbsenGeneratorOpen, setIsAbsenGeneratorOpen] = useState(false);
  const [isSheetConfigOpen, setIsSheetConfigOpen] = useState(false);
  const [isDeploymentGuideOpen, setIsDeploymentGuideOpen] = useState(false);
  const [isGoogleFormOpen, setIsGoogleFormOpen] = useState(false);

  // Determine if current tab is Senayan section
  const isSenayanTab = ['senayan_all','senayan_mpr','senayan_dpr','senayan_eby','daftar_hadir'].includes(activeTab);

  // Public absen view
  if (publicAbsenActivityId) {
    const matchedActivity = activities.find(a => a.id === publicAbsenActivityId) || activities[0];
    return (
      <PublicAbsenView
        activity={matchedActivity}
        onBackToDashboard={() => {
          window.history.pushState({}, document.title, window.location.pathname);
          setPublicAbsenActivityId(null);
        }}
        onSubmitAttendance={handleSubmitAttendance}
      />
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Map Role to Senayan userRole
  const senayanUserRole = role === 'Admin' ? 'admin' : 'pimpinan';

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        role={role}
        setRole={setRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenSyncModal={() => isSenayanTab ? setIsSyncLogOpen(true) : setIsSyncModalOpen(true)}
        onOpenUploadModal={() => isSenayanTab ? setIsSenayanExcelOpen(true) : setIsUploadModalOpen(true)}
        onOpenMasterDataModal={() => isSenayanTab ? setIsFormInputGiatOpen(true) : setIsMasterModalOpen(true)}
        onToggleMobileFilter={() => setIsMobileFilterOpen(true)}
        onToggleMobileSidebar={() => setIsSidebarMobileOpen(true)}
        lastSyncTime={lastSyncTime}
        isSyncing={isSyncing}
        totalProgramCount={isSenayanTab ? activities.length : programs.length}
        searchQuery={isSenayanTab ? senayanFilter.searchQuery : dapilFilters.searchQuery}
        onSearchChange={(q) => {
          if (isSenayanTab) setSenayanFilter(prev => ({ ...prev, searchQuery: q }));
          else setDapilFilters(prev => ({ ...prev, searchQuery: q }));
        }}
      />

      {/* Main layout */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row gap-0">
        {/* Merged Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'senayan_all') setSenayanFilter(prev => ({ ...prev, kategoriGiat: 'ALL' }));
            else if (tab === 'senayan_mpr') setSenayanFilter(prev => ({ ...prev, kategoriGiat: 'MPR' }));
            else if (tab === 'senayan_dpr') setSenayanFilter(prev => ({ ...prev, kategoriGiat: 'DPR' }));
            else if (tab === 'senayan_eby') setSenayanFilter(prev => ({ ...prev, kategoriGiat: 'EBY Connect' }));
          }}
          role={role}
          currentUser={currentUser}
          totalPrograms={programs.length}
          totalLogs={activityLogs.length}
          totalGiatAll={globalStats.all}
          totalGiatMPR={globalStats.mpr}
          totalGiatDPR={globalStats.dpr}
          totalGiatEBY={globalStats.eby}
          totalAttendance={attendanceRecords.length}
          isOpenMobile={isSidebarMobileOpen}
          setIsOpenMobile={setIsSidebarMobileOpen}
        />

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 py-3.5 sm:py-4 min-w-0 space-y-3.5">

          {/* ═══ DAPIL VIEWS ═══ */}
          {activeTab === 'overview' && (
            <>
              <FilterBar
                filters={dapilFilters}
                setFilters={setDapilFilters}
                resetFilters={resetDapilFilters}
                role={role}
                allPrograms={programs}
                filteredCount={filteredPrograms.length}
              />
              <KpiCards programs={filteredPrograms} role={role} />
              <MapVisualization
                programs={filteredPrograms}
                role={role}
                onSelectProgram={(p) => setSelectedProgramModal(p)}
              />
              <DetailTable
                programs={filteredPrograms}
                role={role}
                onSelectProgram={(p) => setSelectedProgramModal(p)}
                onEditProgram={(p) => setSelectedProgramModal(p)}
                onDeleteProgram={handleDeleteProgram}
              />
            </>
          )}

          {activeTab === 'analytic' && (
            <DistributionAnalysis programs={filteredPrograms} />
          )}

          {activeTab === 'daftar_program' && (
            <DaftarProgramView
              programs={filteredPrograms}
              role={role}
              onSelectProgram={(p) => setSelectedProgramModal(p)}
            />
          )}

          {/* ═══ SENAYAN VIEWS ═══ */}
          {(activeTab === 'senayan_all' || activeTab === 'senayan_mpr' || activeTab === 'senayan_dpr') && (
            <>
              <FilterSection
                filter={senayanFilter}
                setFilter={setSenayanFilter}
                activities={activities}
              />
              <ExecutiveSummaryCards stats={stats} activeCategoryTab={activeCategoryTab} />
              <ChartsSection activities={filteredActivities} activeCategoryTab={activeCategoryTab} />
              <DataTable
                activities={filteredActivities}
                onSelectActivity={(a) => setSelectedSenayanActivity(a)}
                userRole={senayanUserRole}
                onAddNewActivity={role === 'Admin' ? () => setIsFormInputGiatOpen(true) : undefined}
              />
            </>
          )}

          {activeTab === 'senayan_eby' && (
            <EbyConnectView
              ebyPrograms={ebyPrograms}
              attendanceRecords={attendanceRecords}
              activities={activities}
            />
          )}

          {activeTab === 'daftar_hadir' && (
            <DaftarHadirView
              attendanceRecords={attendanceRecords}
              activities={activities}
              userRole={senayanUserRole}
              onOpenFormInputGiat={() => setIsFormInputGiatOpen(true)}
            />
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 px-4 sm:px-6 mt-auto text-xs font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="font-heading font-extrabold text-xs text-slate-900 flex items-center gap-2">
            <span>SISTEM MONITORING TERPADU</span>
            <span className="bg-blue-50 text-blue-700 border border-blue-200/80 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
              Dapil Jatim VII & Senayan
            </span>
          </p>
          <p className="text-slate-500 font-medium text-[11px]">
            Pacitan • Ponorogo • Trenggalek • Magetan • Ngawi &copy; 2026 Sistem Pemantauan Aspirasi
          </p>
        </div>
      </footer>

      {/* ═══ DAPIL MODALS ═══ */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={dapilFilters}
        setFilters={setDapilFilters}
        resetFilters={resetDapilFilters}
        role={role}
        allPrograms={programs}
      />
      <ProgramDetailModal
        program={selectedProgramModal}
        onClose={() => setSelectedProgramModal(null)}
      />
      <MasterDataModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        programs={programs}
        onAddProgram={handleAddProgram}
        onUpdateProgram={handleUpdateProgram}
        onDeleteProgram={handleDeleteProgram}
        onResetData={handleResetData}
      />
      <SpreadsheetSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        lastSyncTime={lastSyncTime}
        isSyncing={isSyncing}
        onTriggerSync={triggerManualSync}
      />
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onImportData={handleImportExcel}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={role}
        currentUser={currentUser}
        onLogout={handleLogout}
        onLoginSuccess={(newRole, newUsername) => { setRole(newRole); setCurrentUser(newUsername); }}
      />
      <LinkGeneratorModal
        isOpen={isLinkGeneratorOpen}
        onClose={() => setIsLinkGeneratorOpen(false)}
        role={role}
        onAddActivity={(act) => handleAddNewActivity(act)}
      />

      {/* ═══ SENAYAN MODALS ═══ */}
      {selectedSenayanActivity && (
        <DetailModal
          activity={selectedSenayanActivity}
          onClose={() => setSelectedSenayanActivity(null)}
          onUpdate={handleUpdateActivity}
          userRole={senayanUserRole}
        />
      )}
      {isFormInputGiatOpen && role === 'Admin' && (
        <FormInputGiatModal
          isOpen={isFormInputGiatOpen}
          onClose={() => setIsFormInputGiatOpen(false)}
          onSubmit={handleAddNewActivity}
        />
      )}
      <SenayanExcelUploadModal
        isOpen={isSenayanExcelOpen}
        onClose={() => setIsSenayanExcelOpen(false)}
        onImportData={(imported: ActivityItem[]) => {
          setActivities(prev => [...imported, ...prev]);
          const log: SyncLog = {
            id: `LOG-${Date.now()}`, timestamp: new Date().toLocaleString('id-ID'),
            source: 'Excel Upload', status: 'Success', recordsCount: imported.length,
            description: `Import ${imported.length} kegiatan dari Excel`,
          };
          setSyncLogs(prev => [log, ...prev]);
        }}
      />
      <SyncLogModal
        isOpen={isSyncLogOpen}
        onClose={() => setIsSyncLogOpen(false)}
        logs={syncLogs}
      />
      <AbsenGeneratorModal
        isOpen={isAbsenGeneratorOpen}
        onClose={() => setIsAbsenGeneratorOpen(false)}
        activities={activities}
      />
      <GoogleSheetConfigModal
        isOpen={isSheetConfigOpen}
        onClose={() => setIsSheetConfigOpen(false)}
        config={sheetConfig}
        onSave={(cfg) => setSheetConfig(cfg)}
      />
      <DeploymentGuideModal
        isOpen={isDeploymentGuideOpen}
        onClose={() => setIsDeploymentGuideOpen(false)}
      />
      <GoogleFormModal
        isOpen={isGoogleFormOpen}
        onClose={() => setIsGoogleFormOpen(false)}
        activities={activities}
      />
    </div>
  );
}
