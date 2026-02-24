
import React, { useState, useRef } from 'react';
import { ViewMode, TeacherData } from '../types';
import { Database, Copy, Check, Save, ArrowLeft, ExternalLink, HelpCircle, UserCircle, HardDrive, Download, Upload, Share2, Globe, Eye, EyeOff } from 'lucide-react';

interface SettingsProps {
  spreadsheetUrl: string;
  onSaveUrl: (url: string) => void;
  setView: (v: ViewMode) => void;
  teacherData: TeacherData;
  onUpdateTeacherData: (data: TeacherData) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  showNotification: (msg: string, type: 'success' | 'loading' | 'error') => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  spreadsheetUrl, 
  onSaveUrl, 
  setView, 
  teacherData, 
  onUpdateTeacherData,
  onExportBackup,
  onImportBackup,
  showNotification
}) => {
  const [url, setUrl] = useState(spreadsheetUrl);
  const [copied, setCopied] = useState(false);
  const [teacherForm, setTeacherForm] = useState<TeacherData>(teacherData);
  const [password, setPassword] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showShareGuide, setShowShareGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const appsScriptCode = `/**
 * SCRIPT UNTUK GOOGLE SHEETS - JURNAL GURU WALI
 * Copy & Paste kode ini ke Extensions > Apps Script
 */

function doPost(e) {
  var response = { "status": "success", "message": "Data diterima" };
  
  try {
    // Validasi apakah ada data yang masuk
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Tidak ada payload data yang diterima.");
    }

    var contents = JSON.parse(e.postData.contents);
    var target = contents.target; // "students" atau "logs"
    var data = contents.payload;
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = (target === "students" ? "DataSiswa" : "JurnalBimbingan");
    var sheet = ss.getSheetByName(sheetName);
    
    // Jika sheet belum ada, buat baru dengan Header
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (target === "students") {
        sheet.appendRow(["ID", "Nama", "Kelas", "Alamat", "Telepon", "Catatan", "Timestamp"]);
      } else {
        sheet.appendRow(["Tanggal", "Nama Siswa", "Kelas", "Jenis", "Aspek", "Hasil", "Status", "Tindak Lanjut", "Timestamp"]);
      }
      // Mempercantik Header (Opsional)
      sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight("bold").setBackground("#f3f3f3");
    }

    // Masukkan data sesuai target
    if (target === "students") {
      sheet.appendRow([
        data.id || "", 
        data.name || "", 
        data.className || "", 
        data.address || "", 
        data.phone || "", 
        data.notes || "", 
        new Date()
      ]);
    } else {
      sheet.appendRow([
        data.date || "", 
        data.studentName || "", 
        data.className || "", 
        data.type || "", 
        data.aspect || "", 
        data.result || "", 
        data.status || "", 
        data.followUp || "", 
        new Date()
      ]);
    }
    
  } catch (err) {
    response.status = "error";
    response.message = err.toString();
  }

  // Mengembalikan output JSON
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTeacherSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTeacherData(teacherForm);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (confirm("Apakah Anda yakin ingin memulihkan data? Data saat ini akan ditimpa oleh file cadangan.")) {
        onImportBackup(file);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          Pengaturan Aplikasi
        </h2>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowShareGuide(!showShareGuide)} 
            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-6 py-3 rounded-xl font-bold border border-blue-500/30 flex items-center gap-2 transition-all"
          >
            <Share2 className="w-5 h-5" /> CARA BAGIKAN
          </button>
          <button onClick={() => setView(ViewMode.HOME)} className="metallic-black px-6 py-3 rounded-xl font-bold border border-slate-700 flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" /> KEMBALI
          </button>
        </div>
      </div>

      {showShareGuide && (
        <div className="glass-card p-8 rounded-[2.5rem] border border-blue-500/30 bg-blue-500/5 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold font-orbitron">Panduan Publikasi Online</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed">
            <div className="space-y-4">
              <p className="text-slate-300">Untuk membuat aplikasi ini bisa diakses orang lain secara online (seperti website pada umumnya), Anda perlu melakukan proses <strong>Deployment</strong>.</p>
              <ol className="list-decimal list-inside space-y-2 text-slate-400">
                <li>Simpan semua file aplikasi ini dalam satu folder.</li>
                <li>Gunakan layanan gratis seperti <span className="text-white font-bold">Vercel</span> atau <span className="text-white font-bold">Netlify</span>.</li>
                <li>Jika Anda menggunakan GitHub, hubungkan repository Anda ke Vercel untuk update otomatis.</li>
              </ol>
            </div>
            <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-700">
              <h4 className="font-bold text-blue-400 mb-2">Penting untuk Pengguna Baru:</h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li>• Mintalah rekan Anda untuk mengisi <strong>Identitas Guru</strong> sendiri.</li>
                <li>• Sarankan mereka membuat <strong>Spreadsheet sendiri</strong> untuk keamanan data.</li>
                <li>• Mereka dapat mengimpor data awal Anda menggunakan file backup JSON.</li>
              </ul>
              <button 
                onClick={() => window.open('https://vercel.com', '_blank')}
                className="mt-6 w-full py-3 bg-white text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
              >
                BUKA VERCEL.COM <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Identitas Guru */}
        <div className="lg:col-span-1 glass-card p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400">
              <UserCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Identitas Guru</h3>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            Data ini akan muncul di Dashboard, Kop Laporan, dan file ekspor dokumen.
          </p>

          <form onSubmit={handleTeacherSave} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 tracking-widest">Nama Guru</label>
              <input 
                type="text" 
                value={teacherForm.name}
                onChange={(e) => setTeacherForm({...teacherForm, name: e.target.value})}
                disabled={isLocked}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 tracking-widest">NIP</label>
              <input 
                type="text" 
                value={teacherForm.nip}
                onChange={(e) => setTeacherForm({...teacherForm, nip: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 tracking-widest">Nama Sekolah</label>
              <input 
                type="text" 
                value={teacherForm.school}
                onChange={(e) => setTeacherForm({...teacherForm, school: e.target.value})}
                disabled={isLocked}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 tracking-widest">Alamat Sekolah</label>
              <textarea 
                value={teacherForm.schoolAddress}
                onChange={(e) => setTeacherForm({...teacherForm, schoolAddress: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-cyan-500 outline-none text-sm h-16"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 tracking-widest">Tahun Ajaran</label>
              <input 
                type="text" 
                value={teacherForm.academicYear}
                onChange={(e) => setTeacherForm({...teacherForm, academicYear: e.target.value})}
                placeholder="Contoh: 2025/2026"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-cyan-500 outline-none text-sm font-bold text-cyan-400"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 tracking-widest">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 pr-10 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isLocked && (
                <button 
                  type="button"
                  onClick={() => {
                    if (password === '@Spero123') {
                      setIsLocked(false);
                      showNotification('Akses diberikan', 'success');
                    } else {
                      showNotification('Password salah', 'error');
                    }
                  }}
                  disabled={!password}
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  OK
                </button>
              )}
            </div>
            <button 
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/10"
            >
              <Save className="w-4 h-4" /> SIMPAN IDENTITAS
            </button>
          </form>
        </div>

        {/* Kolom Tengah: Pencadangan Hard Disk */}
        <div className="lg:col-span-1 glass-card p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Cadangan Hard Disk</h3>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed">
            Simpan database aplikasi ke dalam file komputer Anda sebagai cadangan fisik yang aman dari pembersihan browser.
          </p>

          <div className="space-y-4 pt-4">
            <button 
              onClick={onExportBackup}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all group"
            >
              <Download className="w-5 h-5 text-emerald-400 group-hover:translate-y-1 transition-transform" /> 
              EKSPOR DATA KE PC
            </button>

            <div className="relative">
              <input 
                type="file" 
                accept=".json" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all group"
              >
                <Upload className="w-5 h-5 text-cyan-400 group-hover:-translate-y-1 transition-transform" /> 
                IMPOR DATA DARI PC
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <div className="flex items-start gap-3 p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
              <HelpCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed">
                <span className="text-slate-300 font-bold">Penting:</span> File hasil ekspor adalah file JSON. Simpan file ini di tempat yang aman. Anda bisa menggunakan file ini untuk memulihkan seluruh data jika Anda mengganti komputer atau membersihkan data browser.
              </p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Cloud & Apps Script */}
        <div className="lg:col-span-1 space-y-8">
           <div className="glass-card p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-blue-400">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Cloud Sync</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2 tracking-widest">Web App URL</label>
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-[10px] font-mono"
                />
              </div>
              <button 
                onClick={() => onSaveUrl(url)}
                className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
              >
                <Save className="w-4 h-4" /> SIMPAN CLOUD
              </button>
            </div>
            
            <button 
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold transition-all border border-slate-700"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-400" />}
              {copied ? 'KODE DISALIN!' : 'SALIN KODE APPS SCRIPT'}
            </button>
            
            <a 
              href="https://sheets.new" 
              target="_blank" 
              className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 hover:text-blue-400 transition-colors py-2 border border-dashed border-slate-700 rounded-xl"
            >
              BUAT SPREADSHEET BARU <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
