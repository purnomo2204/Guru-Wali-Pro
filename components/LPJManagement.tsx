
import React, { useState, useMemo, useEffect } from 'react';
import { ViewMode, Student, CounselingLog, TeacherData } from '../types';
import { FileDown, ArrowLeft, Save, FileText } from 'lucide-react';

interface LPJManagementProps {
  students: Student[];
  logs: CounselingLog[];
  academicYear: string;
  setView: (v: ViewMode) => void;
  teacherData: TeacherData;
}

interface ManualNote {
  catatan: string;
  solusi: string;
  ket: string;
}

const LPJManagement: React.FC<LPJManagementProps> = ({ students, logs, academicYear, setView, teacherData }) => {
  const [semester, setSemester] = useState<'Ganjil' | 'Genap' | 'Ganjil & Genap'>('Ganjil');
  const [selectedClass, setSelectedClass] = useState<string>('');
  
  // State untuk input manual
  const [manualNotes, setManualNotes] = useState<Record<string, ManualNote>>({});
  const [formMonth, setFormMonth] = useState<string>('');
  const [formCatatan, setFormCatatan] = useState<string>('');
  const [formSolusi, setFormSolusi] = useState<string>('');
  const [formKet, setFormKet] = useState<string>('');

  // Load manual notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lpj_manual_notes');
    if (saved) {
      setManualNotes(JSON.parse(saved));
    }
  }, []);

  // Save manual notes to localStorage
  const saveToLocal = (newNotes: Record<string, ManualNote>) => {
    localStorage.setItem('lpj_manual_notes', JSON.stringify(newNotes));
    setManualNotes(newNotes);
  };

  const classes = useMemo(() => Array.from(new Set(students.map(s => s.className))), [students]);

  const ALL_MONTHS = [
    { name: 'Januari', index: 0 },
    { name: 'Pebruari', index: 1 },
    { name: 'Maret', index: 2 },
    { name: 'April', index: 3 },
    { name: 'Mei', index: 4 },
    { name: 'Juni', index: 5 },
    { name: 'Juli', index: 6 },
    { name: 'Agustus', index: 7 },
    { name: 'September', index: 8 },
    { name: 'Oktober', index: 9 },
    { name: 'November', index: 10 },
    { name: 'Desember', index: 11 },
  ];

  const targetMonths = useMemo(() => {
    if (semester === 'Ganjil') return ALL_MONTHS.slice(6, 12);
    if (semester === 'Genap') return ALL_MONTHS.slice(0, 6);
    return ALL_MONTHS;
  }, [semester]);

  // Set default month for form when semester changes
  useEffect(() => {
    if (targetMonths.length > 0) {
      const firstMonth = targetMonths[0].name;
      setFormMonth(firstMonth);
      setFormCatatan(manualNotes[firstMonth]?.catatan || '');
      setFormSolusi(manualNotes[firstMonth]?.solusi || '');
      setFormKet(manualNotes[firstMonth]?.ket || '');
    }
  }, [targetMonths]);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMonth) return;
    
    const updatedNotes = {
      ...manualNotes,
      [formMonth]: {
        catatan: formCatatan,
        solusi: formSolusi,
        ket: formKet
      }
    };
    saveToLocal(updatedNotes);
    alert(`Data untuk bulan ${formMonth} berhasil disimpan.`);
  };

  const rekapData = useMemo(() => {
    return targetMonths.map((m) => {
      const monthlyLogs = logs.filter(l => {
        const d = new Date(l.date);
        const matchesMonth = d.getMonth() === m.index;
        const matchesYear = l.academicYear === academicYear;
        const matchesClass = selectedClass ? l.className === selectedClass : true;
        return matchesMonth && matchesYear && matchesClass;
      });

      const note = manualNotes[m.name] || { catatan: '', solusi: '', ket: '' };

      return {
        bulan: m.name,
        klasikal: monthlyLogs.filter(l => l.type === 'Klasikal').length,
        individu: monthlyLogs.filter(l => l.type === 'Individual').length,
        catatan: note.catatan, 
        solusi: note.solusi,
        ket: note.ket
      };
    });
  }, [logs, academicYear, selectedClass, targetMonths, manualNotes]);

  const totals = useMemo(() => {
    return rekapData.reduce((acc, curr) => ({
      klasikal: acc.klasikal + curr.klasikal,
      individu: acc.individu + curr.individu
    }), { klasikal: 0, individu: 0 });
  }, [rekapData]);

  const handleDownloadDOCX = () => {
    const tableRows = rekapData.map((d) => `
      <tr>
        <td style="padding:8px; border:1px solid black; text-align:center">${d.bulan}</td>
        <td style="padding:8px; border:1px solid black; text-align:center">${d.klasikal || '-'}</td>
        <td style="padding:8px; border:1px solid black; text-align:center">${d.individu || '-'}</td>
        <td style="padding:8px; border:1px solid black;">${d.catatan || ''}</td>
        <td style="padding:8px; border:1px solid black;">${d.solusi || ''}</td>
        <td style="padding:8px; border:1px solid black; text-align:center">${d.ket || ''}</td>
      </tr>
    `).join('');

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'></head>
      <body>
        <div style="background-color: yellow; text-align: center; padding: 10px; font-weight: bold; border: 1px solid black; margin-bottom: 20px;">
          LAPORAN PERTANGGUNG JAWABAN PENDAMPINGAN GURU WALI
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="width: 180px;">Nama Guru Wali</td>
            <td>: ${teacherData.name}</td>
          </tr>
          <tr>
            <td style="width: 180px;">NIP</td>
            <td>: ${teacherData.nip}</td>
          </tr>
          <tr>
            <td>Nama Sekolah</td>
            <td>: ${teacherData.school}</td>
          </tr>
          <tr>
            <td>Kelas Dampingan</td>
            <td>: ${selectedClass || '(Pilih Kelas)'}</td>
          </tr>
          <tr>
            <td>Semester</td>
            <td>: ${semester}</td>
          </tr>
          <tr>
            <td>Tahun Ajaran</td>
            <td>: ${academicYear}</td>
          </tr>
        </table>
        
        <p><strong>1. Rekapitulasi Pendampingan</strong></p>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th rowspan="2" style="padding:8px; border:1px solid black;">Bulan</th>
              <th colspan="2" style="padding:8px; border:1px solid black;">Jumlah Pendampingan</th>
              <th rowspan="2" style="padding:8px; border:1px solid black;">Catatan Penting</th>
              <th rowspan="2" style="padding:8px; border:1px solid black;">Solusi/Tindak Lanjut</th>
              <th rowspan="2" style="padding:8px; border:1px solid black;">Ket.</th>
            </tr>
            <tr style="background-color: #f2f2f2;">
              <th style="padding:8px; border:1px solid black;">Klasikal</th>
              <th style="padding:8px; border:1px solid black;">Individu</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr style="background-color: #e6e6e6; font-weight: bold;">
              <td style="padding:8px; border:1px solid black; text-align:center">Total Pendampingan</td>
              <td style="padding:8px; border:1px solid black; text-align:center">${totals.klasikal}</td>
              <td style="padding:8px; border:1px solid black; text-align:center">${totals.individu}</td>
              <td colspan="3" style="border:1px solid black;"></td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LPJ_Guru_Wali_${selectedClass || 'Global'}_Semester_${semester.replace(/\s/g, '_')}.doc`;
    link.click();
  };

  const handleSelectMonth = (month: string) => {
    setFormMonth(month);
    setFormCatatan(manualNotes[month]?.catatan || '');
    setFormSolusi(manualNotes[month]?.solusi || '');
    setFormKet(manualNotes[month]?.ket || '');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
        <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Laporan Pertanggungjawaban
        </h2>
        <div className="flex gap-3">
          <button onClick={() => setView(ViewMode.HOME)} className="metallic-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-slate-700 transition-all hover:brightness-110">
            <ArrowLeft className="w-5 h-5" /> KEMBALI
          </button>
          <button onClick={handleDownloadDOCX} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
            <FileDown className="w-5 h-5" /> DOWNLOAD LPJ (DOCX)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 rounded-[2rem] border border-slate-800">
            <h3 className="text-lg font-bold font-orbitron mb-6 text-slate-300">Konfigurasi Laporan</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Semester</label>
                <select 
                  value={semester} 
                  onChange={(e) => setSemester(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500/50 outline-none"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                  <option value="Ganjil & Genap">Ganjil & Genap</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Kelas Dampingan</label>
                <select 
                  value={selectedClass} 
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500/50 outline-none"
                >
                  <option value="">Semua Kelas (Rekap Global)</option>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900/50 to-yellow-500/5">
            <h3 className="text-lg font-bold font-orbitron mb-6 text-slate-300">Identitas Laporan</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p><span className="text-slate-500 uppercase text-[10px] font-bold">Guru:</span> {teacherData.name}</p>
              <p><span className="text-slate-500 uppercase text-[10px] font-bold">Sekolah:</span> {teacherData.school}</p>
              <p><span className="text-slate-500 uppercase text-[10px] font-bold">Tahun:</span> {academicYear}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-8 rounded-[2.5rem] border border-slate-800 h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-orbitron text-slate-100">Laporan Tambahan Manual</h3>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-6">
              <div className="max-w-xs">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-widest">Pilih Bulan</label>
                <select 
                  value={formMonth} 
                  onChange={(e) => handleSelectMonth(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-yellow-500 outline-none text-slate-200 font-medium"
                >
                  {targetMonths.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-widest">Catatan Penting</label>
                <textarea 
                  value={formCatatan}
                  onChange={(e) => setFormCatatan(e.target.value)}
                  placeholder="Masukkan catatan kejadian penting di bulan ini..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-yellow-500 outline-none text-slate-200 h-20 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-widest">Solusi / Tindak Lanjut</label>
                <textarea 
                  value={formSolusi}
                  onChange={(e) => setFormSolusi(e.target.value)}
                  placeholder="Masukkan solusi atau langkah tindak lanjut yang dilakukan..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-yellow-500 outline-none text-slate-200 h-20 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2 tracking-widest">Keterangan (Ket)</label>
                <input 
                  type="text"
                  value={formKet}
                  onChange={(e) => setFormKet(e.target.value)}
                  placeholder="Contoh: Terlaksana"
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-yellow-500 outline-none text-slate-200 font-medium transition-all"
                />
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-8 py-4 rounded-2xl flex items-center gap-2 shadow-lg shadow-yellow-500/10 transition-all active:scale-95"
                >
                  <Save className="w-5 h-5" /> SIMPAN DATA BULAN {formMonth.toUpperCase()}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="bg-yellow-400 text-slate-900 p-4 text-center font-bold font-orbitron tracking-widest uppercase text-sm">
          Pratinjau Tabel Rekapitulasi - Semester {semester}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800">
                <th rowSpan={2} className="p-4 border-r border-slate-800 text-center">Bulan</th>
                <th colSpan={2} className="p-4 text-center border-b border-slate-800">Jumlah Pendampingan</th>
                <th rowSpan={2} className="p-4 border-l border-slate-800">Catatan Penting</th>
                <th rowSpan={2} className="p-4">Solusi / Tindak Lanjut</th>
                <th rowSpan={2} className="p-4 text-center">Ket.</th>
              </tr>
              <tr className="bg-slate-900/40 text-slate-500 text-[9px] uppercase font-bold tracking-widest border-b border-slate-800">
                <th className="p-3 text-center border-r border-slate-800">Klasikal</th>
                <th className="p-3 text-center">Individu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rekapData.map((row) => (
                <tr key={row.bulan} className="hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-bold text-slate-200 border-r border-slate-800 bg-slate-900/20">{row.bulan}</td>
                  <td className="p-4 text-center border-r border-slate-800 text-cyan-400 font-bold">{row.klasikal || '-'}</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">{row.individu || '-'}</td>
                  <td className="p-4 border-l border-slate-800 text-xs text-slate-300 min-w-[200px]">
                    {row.catatan ? row.catatan : <span className="text-slate-600 italic text-[10px] uppercase tracking-tighter">Belum diisi</span>}
                  </td>
                  <td className="p-4 text-xs text-slate-300 min-w-[200px]">
                    {row.solusi ? row.solusi : <span className="text-slate-600 italic text-[10px] uppercase tracking-tighter">Belum diisi</span>}
                  </td>
                  <td className="p-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {row.ket || '-'}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-900 font-bold text-slate-100">
                <td className="p-4 border-r border-slate-800">TOTAL {semester}</td>
                <td className="p-4 text-center border-r border-slate-800 text-cyan-400 text-xl">{totals.klasikal}</td>
                <td className="p-4 text-center text-emerald-400 text-xl">{totals.individu}</td>
                <td colSpan={3} className="p-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LPJManagement;
