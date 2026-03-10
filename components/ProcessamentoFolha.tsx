
import React, { useState } from 'react';
import { Calculator, Printer, Check, Edit3, DollarSign, ArrowDownRight, ArrowUpRight, Save } from 'lucide-react';
import { Payroll } from '../types';

interface ProcessamentoFolhaProps {
  employees: Payroll[];
  setEmployees: React.Dispatch<React.SetStateAction<Payroll[]>>;
}

export const ProcessamentoFolha: React.FC<ProcessamentoFolhaProps> = ({ employees }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedIds.length === employees.length) setSelectedIds([]);
    else setSelectedIds(employees.map(e => e.id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tight">Cálculo de Folha de Pagamento</h1>
          <p className="text-slate-500 font-medium mt-2 text-[11px] uppercase tracking-widest">Processamento de proventos, encargos e eSocial</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-200 text-slate-600 rounded-xl font-bold text-[10px] uppercase transition-all hover:bg-slate-300">
            <Printer size={16}/> Holerites
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase shadow-lg transition-all hover:bg-indigo-700">
            <Calculator size={16}/> Processar Mês Atual
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
           <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Total Proventos</p>
           <p className="text-2xl font-black text-emerald-900">R$ 15.420,00</p>
        </div>
        <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100">
           <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Total Descontos</p>
           <p className="text-2xl font-black text-rose-900">R$ 3.840,00</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl">
           <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">Custo Patronal Estimado</p>
           <p className="text-2xl font-black text-white">R$ 18.250,00</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 w-12 text-center">
                <div onClick={toggleSelectAll} className="cursor-pointer mx-auto flex items-center justify-center">
                   {selectedIds.length === employees.length && employees.length > 0 ? <Check className="text-indigo-600" size={16}/> : <div className="w-4 h-4 border-2 border-slate-200 rounded"/>}
                </div>
              </th>
              <th className="px-4 py-4">Colaborador</th>
              <th className="px-8 py-4">Vencimentos</th>
              <th className="px-8 py-4">Descontos</th>
              <th className="px-8 py-4">Líquido</th>
              <th className="px-8 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {employees.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-6 py-4 text-center">
                   <input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => setSelectedIds(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id])} className="w-4 h-4 accent-indigo-600" />
                </td>
                <td className="px-4 py-4">
                   <p className="font-bold text-slate-900 leading-none mb-1">{emp.employeeName}</p>
                   <p className="text-[9px] text-slate-400 font-bold uppercase">{emp.cargo}</p>
                </td>
                <td className="px-8 py-4 text-emerald-600 font-bold">R$ {emp.total_proventos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td className="px-8 py-4 text-rose-600 font-bold">R$ {emp.total_descontos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td className="px-8 py-4 text-slate-900 font-black">R$ {emp.salario_liquido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                <td className="px-8 py-4 text-right"><button className="text-slate-400 hover:text-indigo-600"><Edit3 size={16}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
