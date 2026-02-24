
import React from 'react';
import { ViewMode } from '../types';
import { Users, FileText, BarChart3, LogOut, FileCheck, Settings as SettingsIcon } from 'lucide-react';

interface DashboardProps {
  setView: (view: ViewMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const menus = [
    {
      id: ViewMode.STUDENT_LIST,
      title: 'Database Siswa',
      description: 'Manajemen data profil bimbingan secara komprehensif.',
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      gradient: 'from-cyan-500/10 to-blue-500/10',
      border: 'hover:border-cyan-500/50'
    },
    {
      id: ViewMode.COUNSELING_INPUT,
      title: 'Jurnal Harian',
      description: 'Pencatatan aktivitas pendampingan real-time.',
      icon: <FileText className="w-6 h-6 text-emerald-400" />,
      gradient: 'from-emerald-500/10 to-teal-500/10',
      border: 'hover:border-emerald-500/50'
    },
    {
      id: ViewMode.COUNSELING_DATA,
      title: 'Analitik Data',
      description: 'Rekapitulasi dan visualisasi riwayat bimbingan.',
      icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
      gradient: 'from-purple-500/10 to-pink-500/10',
      border: 'hover:border-purple-500/50'
    },
    {
      id: ViewMode.LPJ_MANAGEMENT,
      title: 'Laporan LPJ',
      description: 'Generasi laporan pertanggungjawaban otomatis.',
      icon: <FileCheck className="w-6 h-6 text-yellow-400" />,
      gradient: 'from-yellow-500/10 to-orange-500/10',
      border: 'hover:border-yellow-500/50'
    },
    {
      id: ViewMode.SETTINGS,
      title: 'Konfigurasi',
      description: 'Pengaturan sistem, cloud, dan backup database.',
      icon: <SettingsIcon className="w-6 h-6 text-blue-400" />,
      gradient: 'from-blue-500/10 to-indigo-500/10',
      border: 'hover:border-blue-500/50'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setView(menu.id)}
            className={`premium-card group p-8 rounded-[2.5rem] text-left border border-white/5 relative overflow-hidden ${menu.border}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${menu.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 border border-white/5">
                {menu.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-orbitron text-white group-hover:text-cyan-400 transition-colors">{menu.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm font-light">
                {menu.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={() => setView(ViewMode.WELCOME)}
          className="group flex items-center gap-3 px-8 py-3 rounded-2xl font-bold text-slate-500 border border-white/5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-500"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-orbitron tracking-[0.2em] text-xs">LOGOUT SESSION</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
