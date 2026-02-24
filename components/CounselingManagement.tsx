
import React, { useState, useMemo, useEffect } from 'react';
import { ViewMode, Student, CounselingLog, CounselingType, CounselingAspect, CounselingStatus, TeacherData } from '../types';
import { Send, ArrowLeft, Download, Eye, X, Plus, Filter, Calendar, TrendingUp, AlertCircle, Clock } from 'lucide-react';

interface CounselingManagementProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  students: Student[];
  logs: CounselingLog[];
  onAdd: (l: CounselingLog) => void;
  globalAcademicYear: string;
  teacherData: TeacherData;
}

const CounselingManagement: React.FC<CounselingManagementProps> = ({ view, setView, students, logs, onAdd, globalAcademicYear, teacherData }) => {
  const [formData, setFormData] = useState<Partial<CounselingLog>>({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    academicYear: globalAcademicYear,
    studentId: '',
    type: 'Individual',
    aspect: 'Akademik',
    result: '',
    status: 'baik',
    followUp: '',
    notes: ''
  });

  const [filterType, setFilterType] = useState<string>('Semua Jenis');
  const [previewLog, setPreviewLog] = useState<CounselingLog | null>(null);

  useEffect(() => {
    setFormData(prev => ({ ...prev, academicYear: globalAcademicYear }));
  }, [globalAcademicYear]);

  const selectedStudent = useMemo(() => 
    students.find(s => s.id === formData.studentId),
    [formData.studentId, students]
  );

  const filteredDisplayLogs = useMemo(() => {
    if (filterType === 'Semua Jenis') return logs;
    return logs.filter(log => log.type === filterType);
  }, [logs, filterType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    onAdd({
      ...formData as CounselingLog,
      id: Date.now().toString(),
      studentName: selectedStudent.name,
      className: selectedStudent.className
    });
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: '', endTime: '', academicYear: globalAcademicYear, studentId: '', type: 'Individual',
      aspect: 'Akademik', result: '', status: 'baik', followUp: '', notes: ''
    });
    setView(ViewMode.COUNSELING_DATA);
  };

  const handleExportDOCX = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Jurnal Bimbingan</title></head>
      <body style="font-family: Arial, sans-serif;">
        <h1 style="text-align:center">JURNAL BIMBINGAN SISWA</h1>
        <p style="text-align:center; font-weight:bold;">${teacherData.school}</p>
        <hr>
        <table style="width:100%; border:none; margin-bottom:20px;">
          <tr><td>Guru Wali</td><td>: ${teacherData.name}</td></tr>
          <tr><td>Tahun Ajaran</td><td>: ${globalAcademicYear}</td></tr>
          <tr><td>Kategori</td><td>: ${filterType}</td></tr>
        </table>
        <table border="1" style="width:100%; border-collapse:collapse">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:10px">Tgl</th>
              <th style="padding:10px">Nama Siswa</th>
              <th style="padding:10px">Klas</th>
              <th style="padding:10px">Jenis</th>
              <th style="padding:10px">Aspek</th>
              <th style="padding:10px">Hasil & Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            ${filteredDisplayLogs.map((l) => `
              <tr>
                <td style="padding:8px; text-align:center">${l.date}</td>
                <td style="padding:8px">${l.studentName}</td>
                <td style="padding:8px; text-align:center">${l.className}</td>
                <td style="padding:8px; text-align:center">${l.type}</td>
                <td style="padding:8px">${l.aspect}</td>
                <td style="padding:8px"><b>Hasil:</b> ${l.result}<br><b>TL:</b> ${l.followUp}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Jurnal_Bimbingan_${globalAcademicYear.replace(/\//g, '-')}.doc`;
    link.click();
  };

  if (view === ViewMode.COUNSELING_INPUT) {
    return (
      <div className="max-w-4xl mx-auto glass-panel p-10 rounded-[3rem] animate-in fade-in zoom-in duration-500 border border-white/10 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold font-orbitron text-white">
                PELAKSANAAN <span className="text-emerald-400">BIMBINGAN</span>
              </h2>
              <p className="text-slate-400 text-sm font-light">Catat setiap momen bimbingan untuk kemajuan akademik siswa.</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-900/80 border border-white/5 text-[10px] font-bold text-cyan-400 uppercase tracking-widest backdrop-blur-md">
              A.Y. {globalAcademicYear}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Tanggal Bimbingan</label>
                <div className="relative">
                   <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Waktu Mulai</label>
                <div className="relative">
                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Waktu Selesai</label>
                <div className="relative">
                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                   <input type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-white" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Identitas Siswa</label>
                <select required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-white appearance-none cursor-pointer">
                  <option value="" className="bg-slate-900">Pilih Siswa dari Database...</option>
                  {students.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.name} ({s.className})</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Jenis Bimbingan</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as CounselingType})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-white appearance-none cursor-pointer">
                  <option value="Individual" className="bg-slate-900">Konseling Individual</option>
                  <option value="Klasikal" className="bg-slate-900">Bimbingan Klasikal</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Aspek Pendampingan</label>
                <select value={formData.aspect} onChange={e => setFormData({...formData, aspect: e.target.value as CounselingAspect})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-white appearance-none cursor-pointer">
                  {['Akademik', 'Karakter', 'Sosial-Emosional', 'Kedisiplinan', 'Bakat dan Minat'].map(a => <option key={a} value={a} className="bg-slate-900">{a}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Status Akhir Sesi</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as CounselingStatus})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-white appearance-none cursor-pointer">
                  <option value="baik" className="bg-slate-900">Baik (Kondusif)</option>
                  <option value="perlu perhatian" className="bg-slate-900">Perlu Perhatian</option>
                  <option value="butuh bantuan" className="bg-slate-900">Butuh Bantuan Segera</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Analisis Hasil / Keluhan</label>
              <textarea required value={formData.result} onChange={e => setFormData({...formData, result: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 h-28 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-white resize-none" placeholder="Uraikan hasil bimbingan atau observasi Anda..." />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Rencana Tindak Lanjut</label>
              <input required value={formData.followUp} onChange={e => setFormData({...formData, followUp: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500/30 outline-none transition-all text-white" placeholder="e.g. Pemanggilan orang tua, konsultasi guru BK..." />
            </div>

            <div className="flex gap-4 pt-6">
              <button type="submit" className="btn-premium shimmer flex-1 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 text-lg shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)]">
                <Send className="w-6 h-6" /> POST KE JURNAL
              </button>
              <button type="button" onClick={() => setView(ViewMode.HOME)} className="px-10 rounded-2xl font-bold text-slate-500 border border-white/5 hover:bg-white/5 transition-all uppercase text-[10px] tracking-widest">Batalkan</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 no-print">
        <div className="premium-card p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-8 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
          <h4 className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-4">Volume Sesi</h4>
          <div className="text-5xl font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">{logs.length}</div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-light">
             <TrendingUp className="w-4 h-4 text-cyan-400" />
             <span>Total Rekapitulasi</span>
          </div>
        </div>
        <div className="premium-card p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-8 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
          <h4 className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-4">Urgent Cases</h4>
          <div className="text-5xl font-orbitron font-bold text-white group-hover:text-red-400 transition-colors">
            {logs.filter(l => l.status === 'butuh bantuan').length}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-light">
             <AlertCircle className="w-4 h-4 text-red-400" />
             <span>Intervensi Dibutuhkan</span>
          </div>
        </div>
        <div className="premium-card p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-8 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          <h4 className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-4">Activity (Today)</h4>
          <div className="text-5xl font-orbitron font-bold text-white group-hover:text-emerald-400 transition-colors">
            {logs.filter(l => l.date === new Date().toISOString().split('T')[0]).length}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-light">
             <Clock className="w-4 h-4 text-emerald-400" />
             <span>Log Harian Aktif</span>
          </div>
        </div>
        <div className="premium-card p-8 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 p-8 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
          <h4 className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-4">Methods Distribution</h4>
          <div className="text-2xl font-orbitron font-bold text-white mt-1">
            {logs.filter(l => l.type === 'Individual').length} Ind / {logs.filter(l => l.type === 'Klasikal').length} Kla
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 font-light">
             <TrendingUp className="w-4 h-4 text-purple-400" />
             <span>Metode Pendampingan</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <h2 className="text-3xl font-bold font-orbitron text-white tracking-tight">LOG <span className="text-cyan-400">AKTIVITAS</span></h2>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative group flex items-center bg-slate-900/50 border border-white/5 rounded-2xl px-5 py-2 min-w-[220px] backdrop-blur-md">
            <Filter className="w-4 h-4 text-cyan-400 mr-3" />
            <div className="flex flex-col flex-1">
              <label className="text-[9px] uppercase font-bold text-slate-600 leading-none mb-1 tracking-widest">Filter Kategori</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent border-none p-0 text-sm font-bold focus:ring-0 outline-none w-full text-slate-200 cursor-pointer appearance-none"
              >
                <option className="bg-slate-900" value="Semua Jenis">Semua Aktivitas</option>
                <option className="bg-slate-900" value="Individual">Individual Only</option>
                <option className="bg-slate-900" value="Klasikal">Klasikal Only</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setView(ViewMode.COUNSELING_INPUT)} 
              className="btn-premium px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-xl flex-1 justify-center"
            >
              <Plus className="w-5 h-5" /> TAMBAH LOG
            </button>
            <button 
              onClick={handleExportDOCX} 
              className="px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-2 border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-slate-400"
            >
              <Download className="w-5 h-5" /> EKSPOR DOC
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl backdrop-blur-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold">
                <th className="p-8">Waktu & Sesi</th>
                <th className="p-8">Subjek Dampingan</th>
                <th className="p-8">Aspek / Metode</th>
                <th className="p-8">Progress Status</th>
                <th className="p-8 text-right no-print">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDisplayLogs.length === 0 ? (
                <tr><td colSpan={5} className="p-32 text-center text-slate-600 italic font-light">
                  Belum ada catatan aktivitas bimbingan terdaftar.
                </td></tr>
              ) : filteredDisplayLogs.map((l) => (
                <tr key={l.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-8">
                    <div className="font-bold text-white text-sm tracking-wide">{l.date}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold mt-1 tracking-tighter">{l.startTime} — {l.endTime}</div>
                  </td>
                  <td className="p-8">
                    <div className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors text-lg tracking-tight">{l.studentName}</div>
                    <div className="text-xs text-slate-500 font-light mt-0.5">Kelas {l.className}</div>
                  </td>
                  <td className="p-8">
                    <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${l.type === 'Klasikal' ? 'text-purple-400' : 'text-emerald-400'}`}>
                       {l.type}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">{l.aspect}</div>
                  </td>
                  <td className="p-8">
                    <span className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] border ${
                      l.status === 'baik' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' :
                      l.status === 'perlu perhatian' ? 'bg-orange-500/5 text-orange-400 border-orange-500/20' :
                      'bg-red-500/5 text-red-400 border-red-500/20'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="p-8 text-right no-print">
                    <button 
                      onClick={() => setPreviewLog(l)} 
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all shadow-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {previewLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 no-print">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setPreviewLog(null)} />
          <div className="relative glass-panel w-full max-w-2xl rounded-[3rem] border border-white/10 shadow-3xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold font-orbitron text-white tracking-tight">ANALISIS <span className="text-cyan-400">JURNAL</span></h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Ref No: {previewLog.id.slice(-8)}</p>
              </div>
              <button onClick={() => setPreviewLog(null)} className="p-3 hover:bg-white/5 rounded-full transition-colors text-slate-500"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Siswa Dampingan</label>
                  <p className="text-xl font-bold text-white">{previewLog.studentName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Informasi Kelas</label>
                  <p className="text-xl font-bold text-white">{previewLog.className}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Waktu Pelaksanaan</label>
                  <p className="text-slate-300 font-medium">{previewLog.date} <span className="text-slate-500 font-light ml-2">({previewLog.startTime} - {previewLog.endTime})</span></p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Tahun Ajaran</label>
                  <p className="text-slate-300 font-medium">{previewLog.academicYear}</p>
                </div>
              </div>

              <div className="space-y-3 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Uraian Hasil Konseling</label>
                <p className="text-slate-200 leading-relaxed font-light italic">"{previewLog.result}"</p>
              </div>

              <div className="space-y-3 p-6 rounded-3xl bg-cyan-500/5 border border-cyan-500/10">
                <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Rencana Tindak Lanjut</label>
                <p className="text-slate-200 leading-relaxed font-medium">{previewLog.followUp}</p>
              </div>

              {previewLog.notes && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Catatan Internal</label>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">{previewLog.notes}</p>
                </div>
              )}
            </div>
            <div className="p-10 border-t border-white/5 flex gap-4 bg-white/5">
              <button onClick={() => setPreviewLog(null)} className="flex-1 py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/5 transition-all text-slate-300 uppercase text-[10px] tracking-widest">Tutup Pratinjau</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselingManagement;
