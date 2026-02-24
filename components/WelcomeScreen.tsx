
import React from 'react';
import { LogIn, Sparkles, ShieldCheck, Zap, Globe } from 'lucide-react';
import { TeacherData } from '../types';

interface WelcomeScreenProps {
  onEnter: () => void;
  teacherData: TeacherData;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, teacherData }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#020617] px-6">
      {/* Background Aurora Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative z-10 w-full max-w-4xl text-center space-y-12 animate-in fade-in zoom-in duration-1000">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-4 shadow-xl backdrop-blur-md">
            <Sparkles className="w-3 h-3" /> Digital Intelligence for Educators
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white font-orbitron">
            JURNAL <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">GURU WALI</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Platform manajemen bimbingan siswa dengan standar premium, dirancang untuk efisiensi dan profesionalitas tingkat tinggi.
          </p>
        </div>

        <div className="glass-panel p-1 rounded-[3rem] max-w-md mx-auto shadow-2xl">
            <div className="bg-slate-900/40 rounded-[2.8rem] p-8 space-y-6">
                <div className="space-y-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold">Authorized User</p>
                    <h3 className="text-2xl font-bold text-white">{teacherData.name}</h3>
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                        <Globe className="w-4 h-4 text-cyan-500" />
                        <span>{teacherData.school}</span>
                    </div>
                </div>

                <button 
                    onClick={onEnter}
                    className="btn-premium shimmer w-full py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-3 text-lg transition-all group"
                >
                    <LogIn className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    MASUK DASHBOARD
                </button>
                <p className="text-xs text-slate-500 mt-4">Aplikasi ini didesain oleh : W. Purnomo - SMPN 2 Magelang</p>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/5">
            <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-cyan-400">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Secured Data</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-indigo-400">
                    <Zap className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Real-time Sync</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium UI</span>
            </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-slate-600 text-[10px] font-bold tracking-[0.5em] uppercase pointer-events-none">
        Elite Edition v2.5 • Obsidian Series
      </div>
    </div>
  );
};

export default WelcomeScreen;
