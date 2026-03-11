
import React, { useState } from 'react';
import { PlaneTakeoff, Plus, Search, Stethoscope, Baby, Clock, User, Edit2 } from 'lucide-react';
import { EmployeeLeave } from '../types';

interface AfastamentosProps {
  leaves: EmployeeLeave[];
  setLeaves: (leaves: EmployeeLeave[]) => void;
  currentUnitId: string;
}

export const Afastamentos: React.FC<AfastamentosProps> = ({ leaves, currentUnitId }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase">Afastamentos & Licenças</h1>
          <p className="text-slate-500 font-medium text-sm">Controle de férias e saúde.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black shadow-xl uppercase text-xs flex items-center gap-2">
          <Plus size={18} /> Registrar
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase">
            <tr>
              <th className="px-8 py-5">Colaborador</th>
              <th className="px-8 py-5">Tipo</th>
              <th className="px-8 py-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leaves.filter(l => l.unitId === currentUnitId).map(leave => (
              <tr key={leave.id}>
                <td className="px-8 py-5 font-bold">{leave.employeeName}</td>
                <td className="px-8 py-5">{leave.type}</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase">{leave.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
