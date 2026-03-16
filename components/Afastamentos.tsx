
import React, { useState } from 'react';
import { PlaneTakeoff, Plus, Search, Stethoscope, Baby, Clock, User, Edit2, X, Save, Loader2, Trash2 } from 'lucide-react';
import { EmployeeLeave, Payroll, LeaveType } from '../types';
import { dbService } from '../services/databaseService';

interface AfastamentosProps {
  leaves: EmployeeLeave[];
  setLeaves: (leaves: EmployeeLeave[]) => void;
  currentUnitId: string;
  employees: Payroll[];
}

export const Afastamentos: React.FC<AfastamentosProps> = ({ leaves, setLeaves, currentUnitId, employees }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<EmployeeLeave>>({
    type: 'VACATION',
    status: 'SCHEDULED',
  });

  const handleRegister = async () => {
    if (!formData.employeeId || !formData.startDate || !formData.endDate || !formData.type) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
      const employee = employees.find(e => e.id === formData.employeeId);
      const newLeave: EmployeeLeave = {
        id: formData.id || crypto.randomUUID(),
        unitId: currentUnitId,
        employeeId: formData.employeeId!,
        employeeName: employee?.employeeName || 'Desconhecido',
        type: formData.type as LeaveType,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        status: formData.status as any || 'SCHEDULED',
        observations: formData.observations,
      };

      await dbService.saveLeave(newLeave);
      if (formData.id) {
        setLeaves(leaves.map(l => l.id === newLeave.id ? newLeave : l));
      } else {
        setLeaves([...leaves, newLeave]);
      }
      setIsModalOpen(false);
      setFormData({ type: 'VACATION', status: 'SCHEDULED' });
    } catch (error) {
      console.error('Erro ao registrar afastamento:', error);
      alert('Erro ao registrar afastamento.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (leave: EmployeeLeave) => {
    setFormData(leave);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    console.log("Tentando excluir afastamento com ID:", id);
    // if (!confirm('Tem certeza que deseja excluir este afastamento?')) return;
    try {
      await dbService.deleteLeave(id);
      console.log("Exclusão bem-sucedida no banco de dados.");
      setLeaves(leaves.filter(l => l.id !== id));
      console.log("Estado atualizado.");
    } catch (error) {
      console.error('Erro ao excluir afastamento:', error);
      alert('Erro ao excluir afastamento.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase">Afastamentos & Licenças</h1>
          <p className="text-slate-500 font-medium text-sm">Controle de férias e saúde.</p>
        </div>
        <button 
          onClick={() => { setFormData({ type: 'VACATION', status: 'SCHEDULED' }); setIsModalOpen(true); }}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black shadow-xl uppercase text-xs flex items-center gap-2"
        >
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
              <th className="px-8 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leaves.filter(l => l.unitId === currentUnitId).map(leave => (
              <tr key={leave.id}>
                <td className="px-8 py-5 font-bold">{leave.employeeName}</td>
                <td className="px-8 py-5">{
                  leave.type === 'VACATION' ? 'Férias' :
                  leave.type === 'MEDICAL' ? 'Médico' :
                  leave.type === 'MATERNITY' ? 'Maternidade' :
                  leave.type === 'PATERNITY' ? 'Paternidade' :
                  leave.type === 'MILITARY' ? 'Militar' :
                  leave.type === 'WEDDING' ? 'Casamento' :
                  leave.type === 'BEREAVEMENT' ? 'Luto' :
                  leave.type === 'UNPAID' ? 'Não Remunerado' : leave.type
                }</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase">{
                    leave.status === 'SCHEDULED' ? 'Agendado' :
                    leave.status === 'ACTIVE' ? 'Ativo' :
                    leave.status === 'COMPLETED' ? 'Concluído' :
                    leave.status === 'CANCELLED' ? 'Cancelado' : leave.status
                  }</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 text-slate-400">
                    <button onClick={() => handleEdit(leave)} className="hover:text-indigo-600"><Edit2 size={16} /></button>
                    <button onClick={() => { console.log("Botão excluir clicado para ID:", leave.id); handleDelete(leave.id); }} className="hover:text-rose-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black uppercase">{formData.id ? 'Editar' : 'Novo'} Afastamento</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <select 
                className="w-full p-3 rounded-xl border border-slate-200"
                value={formData.employeeId || ''}
                onChange={e => setFormData({...formData, employeeId: e.target.value})}
              >
                <option value="">Selecione o colaborador</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.employeeName}</option>)}
              </select>
              <select 
                className="w-full p-3 rounded-xl border border-slate-200"
                value={formData.type || 'VACATION'}
                onChange={e => setFormData({...formData, type: e.target.value as LeaveType})}
              >
                <option value="VACATION">Férias</option>
                <option value="MEDICAL">Médico</option>
                <option value="MATERNITY">Maternidade</option>
                <option value="PATERNITY">Paternidade</option>
                <option value="MILITARY">Militar</option>
                <option value="WEDDING">Casamento</option>
                <option value="BEREAVEMENT">Luto</option>
                <option value="UNPAID">Não Remunerado</option>
              </select>
              <input type="date" className="w-full p-3 rounded-xl border border-slate-200" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              <input type="date" className="w-full p-3 rounded-xl border border-slate-200" value={formData.endDate || ''} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              <textarea placeholder="Observações" className="w-full p-3 rounded-xl border border-slate-200" value={formData.observations || ''} onChange={e => setFormData({...formData, observations: e.target.value})} />
              <button 
                onClick={handleRegister}
                disabled={isSaving}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {formData.id ? 'Atualizar' : 'Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
