
import React, { useState } from 'react';
import { BarChart3, Download, FileSpreadsheet, DollarSign, Users, Briefcase, Share2, CheckCircle2, Loader2, FileJson } from 'lucide-react';
import { MOCK_PAYROLL, MOCK_TRANSACTIONS, MOCK_MEMBERS } from '../constants';

export const Relatorios: React.FC = () => {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = async (type: string, format: string) => {
    setIsExporting(`${type}_${format}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ exportDate: new Date().toISOString() }, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `EXPORT_${type}_${new Date().getTime()}.${format.toLowerCase()}`);
    dl.click();
    setIsExporting(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic font-serif">Relatórios & Exportação</h1>
        <p className="text-slate-500 font-medium">Extração de dados para contabilidade e gestão estratégica ADJPA.</p>
      </div>

      <div className="bg-indigo-600 rounded-[2.5rem] p-1 shadow-2xl overflow-hidden">
        <div className="bg-slate-900 rounded-[2.3rem] p-8 md:p-10 flex flex-col lg:flex-row gap-10 items-center">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500 rounded-2xl text-white shadow-lg"><Share2 size={24} /></div>
              <h2 className="text-2xl font-black text-white">Integração Contábil (Fiscal)</h2>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed max-w-md">Exporte balancetes e dados da folha em formatos compatíveis com os principais softwares contábeis.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => handleExport('FINANCEIRO', 'CSV')} className="flex items-center gap-2 py-4 px-8 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs shadow-xl transition-all hover:scale-105 active:scale-95">{isExporting?.includes('FINANCEIRO') ? <Loader2 size={16} className="animate-spin"/> : <FileSpreadsheet size={16}/>} Financeiro CSV</button>
             <button onClick={() => handleExport('FOLHA', 'JSON')} className="flex items-center gap-2 py-4 px-8 bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs shadow-xl transition-all hover:scale-105 active:scale-95">{isExporting?.includes('FOLHA') ? <Loader2 size={16} className="animate-spin"/> : <FileJson size={16}/>} Folha/DP JSON</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Financeiro', 'Recursos Humanos', 'Membros'].map((cat, i) => (
          <div key={i} className="bg-white rounded-[2.2rem] border border-slate-100 p-8 shadow-sm group hover:shadow-md transition-shadow">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-50 pb-4 mb-6 flex justify-between items-center">{cat} <BarChart3 size={14} className="text-slate-300"/></h3>
            <div className="space-y-2">
               {['Balancete Mensal', 'Dízimos por Período', 'Quadro de Talentos'].slice(0, cat === 'Membros' ? 2 : 3).map((item, j) => (
                 <button key={j} className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all">
                    {item} <Download size={14} className="text-slate-300 group-hover:text-indigo-600"/>
                 </button>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
