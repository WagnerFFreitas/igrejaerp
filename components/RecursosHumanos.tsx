
import React from 'react';
import { Award, BookOpen, Heart, Star, Search, UserCheck } from 'lucide-react';
import { Payroll } from '../types';

interface RecursosHumanosProps {
  employees: Payroll[];
}

export const RecursosHumanos: React.FC<RecursosHumanosProps> = ({ employees }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight italic font-serif">Recursos Humanos</h1>
          <p className="text-slate-500 font-medium text-[11px] uppercase tracking-widest mt-1">Desenvolvimento Ministerial e Gestão de Competências ADJPA</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-lg transition-transform hover:scale-105">
          <Award size={16} /> Novo Treinamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Treinamentos Ativos', val: '08', icon: <BookOpen size={18}/>, c: 'indigo' },
          { label: 'Avaliações Pendentes', val: '03', icon: <Star size={18}/>, c: 'amber' },
          { label: 'Satisfação Interna', val: '94%', icon: <Heart size={18}/>, c: 'rose' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-xl bg-${s.c}-50 text-${s.c}-600`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
           <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
             <UserCheck size={14} className="text-indigo-600"/> Mapeamento de Talentos e Liderança
           </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
           {employees.map(emp => (
             <div key={emp.id} className="p-4 bg-slate-50/50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 rounded-2xl transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                      {emp.employeeName.split(' ').map(n => n[0]).join('').slice(0,2)}
                   </div>
                   <div>
                      <p className="font-black text-slate-900 text-[12px]">{emp.employeeName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{emp.cargo}</p>
                   </div>
                </div>
                <div className="flex gap-0.5">
                   {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= 4 ? "fill-amber-400 text-amber-400" : "text-slate-200"} />)}
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};
