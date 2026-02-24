
import React, { useState } from 'react';
import { ViewMode, Student, TeacherData } from '../types';
import { Plus, Save, Trash2, Edit, Camera, UserPlus, Search, MoreHorizontal, FileDown, FileUp } from 'lucide-react';
import * as XLSX from 'xlsx';

interface StudentManagementProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  students: Student[];
  onAdd: (s: Student) => void;
  onUpdate: (s: Student) => void;
  onDelete: (id: string) => void;
  academicYear: string;
  teacherData: TeacherData;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ view, setView, students, onAdd, onUpdate, onDelete, academicYear, teacherData }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '', className: '', address: '', phone: '', notes: '', photo: ''
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, photo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate({ ...formData as Student, id: editingId });
      setEditingId(null);
    } else {
      onAdd({ ...formData as Student, id: Date.now().toString() });
    }
    setFormData({ name: '', className: '', address: '', phone: '', notes: '', photo: '' });
    setView(ViewMode.STUDENT_LIST);
  };

  const startEdit = (s: Student) => {
    setEditingId(s.id);
    setFormData(s);
    setView(ViewMode.STUDENT_INPUT);
  };

  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        name: 'Contoh Nama Siswa',
        className: 'Contoh Kelas (misal: IX-A)',
        address: 'Contoh Alamat',
        phone: 'Contoh Nomor Telepon',
        notes: 'Contoh Catatan',
      },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DataSiswa');
    XLSX.writeFile(workbook, 'Template_Data_Siswa.xlsx');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<Partial<Student>>(worksheet);
        json.forEach(studentData => {
          const newStudent: Student = {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
            name: studentData.name || '',
            className: studentData.className || '',
            address: studentData.address || '',
            phone: studentData.phone || '',
            notes: studentData.notes || '',
            photo: '',
          };
          onAdd(newStudent);
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  if (view === ViewMode.STUDENT_INPUT) {
    return (
      <div className="max-w-4xl mx-auto glass-panel p-10 rounded-[3rem] animate-in fade-in zoom-in duration-500 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full -mr-20 -mt-20" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-12">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold font-orbitron text-white tracking-tight">
                {editingId ? 'EDIT' : 'REGISTRASI'} <span className="text-cyan-400">SISWA</span>
              </h2>
              <p className="text-slate-400 text-sm font-light">Input data otentik untuk basis data bimbingan konseling.</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] backdrop-blur-md">
              Period: {academicYear}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-44 h-44 rounded-[2.5rem] bg-slate-900 border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden transition-all group-hover:border-cyan-500/50 shadow-2xl ring-4 ring-white/5">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center space-y-2">
                      <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Upload Portrait</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhotoChange} />
                </div>
                <div className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl text-white group-hover:scale-110 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Nama Lengkap Siswa</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all text-white font-medium placeholder:text-slate-700" placeholder="e.g. Aditama Putra" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Kelas / Rombel</label>
                <input required value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all text-white font-medium placeholder:text-slate-700" placeholder="e.g. IX-A" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Nomor WhatsApp / Telp</label>
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all text-white font-medium placeholder:text-slate-700" placeholder="08xx-xxxx-xxxx" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Alamat Domisili</label>
                <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all text-white font-medium placeholder:text-slate-700" placeholder="Jalan Raya No. 123..." />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Informasi Tambahan / Latar Belakang</label>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 h-32 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all text-white resize-none" placeholder="Catatan medis, hobi, atau kendala belajar..." />
            </div>

            <div className="flex gap-4 pt-6">
              <button type="submit" className="btn-premium shimmer flex-1 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 text-lg">
                <Save className="w-6 h-6" /> SIMPAN DATA
              </button>
              <button type="button" onClick={() => setView(ViewMode.STUDENT_LIST)} className="px-10 rounded-2xl font-bold text-slate-500 border border-white/5 hover:bg-white/5 transition-all uppercase text-[10px] tracking-widest">Batalkan</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold font-orbitron text-white tracking-tight">DATABASE <span className="text-cyan-400">SISWA</span></h2>
          <p className="text-slate-500 text-sm font-light tracking-wide uppercase">Direktori Akademik {academicYear}</p>
        </div>
        <div className="flex gap-4">
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".xlsx, .xls"
          />
          <button 
            onClick={handleDownloadTemplate}
            className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 px-6 py-3 rounded-xl font-bold border border-emerald-500/30 flex items-center gap-2 transition-all"
          >
            <FileDown className="w-5 h-5" /> TEMPLATE EXCEL
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 px-6 py-3 rounded-xl font-bold border border-sky-500/30 flex items-center gap-2 transition-all"
          >
            <FileUp className="w-5 h-5" /> UPLOAD EXCEL
          </button>
          <button 
            onClick={() => setView(ViewMode.STUDENT_INPUT)} 
            className="btn-premium shimmer px-8 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-2xl"
          >
            <UserPlus className="w-5 h-5" /> TAMBAH SISWA
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl backdrop-blur-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold">
                <th className="p-8">Profil & Identitas</th>
                <th className="p-8">Kelas Dampingan</th>
                <th className="p-8">Informasi Kontak</th>
                <th className="p-8 text-right">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.length === 0 ? (
                <tr><td colSpan={4} className="p-32 text-center">
                  <div className="flex flex-col items-center gap-4 text-slate-600">
                    <Search className="w-12 h-12 opacity-20" />
                    <span className="italic font-light text-lg">Database masih kosong, silahkan input data siswa baru.</span>
                  </div>
                </td></tr>
              ) : students.map(s => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img src={s.photo || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} className="w-16 h-16 rounded-[1.25rem] object-cover bg-slate-900 border border-white/10 shadow-xl group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors tracking-tight">{s.name}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Ref ID: {s.id.slice(-6)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-sm font-bold border border-cyan-500/20">
                      {s.className}
                    </span>
                  </td>
                  <td className="p-8">
                    <div className="text-slate-300 font-medium text-sm">{s.phone}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-[200px] font-light">{s.address}</div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => startEdit(s)}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all shadow-lg"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => { if(confirm('Hapus data siswa ini?')) onDelete(s.id); }}
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all shadow-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white/5 p-6 border-t border-white/5 text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em]">
          End of Database Directory
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
