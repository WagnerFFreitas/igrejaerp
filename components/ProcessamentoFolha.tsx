
import React, { useState } from 'react';
import { Calculator, Printer, Check, Edit3, DollarSign, ArrowDownRight, ArrowUpRight, Save, Loader2 } from 'lucide-react';
import { dbService } from '../services/databaseService';
import { exportService } from '../services/exportService';
import { Payroll, PayrollInput } from '../types';
import { payrollService } from '../services/payrollService';

interface ProcessamentoFolhaProps {
  employees: Payroll[];
  setEmployees: React.Dispatch<React.SetStateAction<Payroll[]>>;
}

export const ProcessamentoFolha: React.FC<ProcessamentoFolhaProps> = ({ employees }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Payroll | null>(null);
  const [editSalary, setEditSalary] = useState<number>(0);

  const toggleSelectAll = () => {
    if (selectedIds.length === employees.length) setSelectedIds([]);
    else setSelectedIds(employees.map(e => e.id));
  };

  const handleProcessPayroll = async () => {
    if (selectedIds.length === 0) {
      alert('Selecione pelo menos um funcionário para processar.');
      return;
    }

    setIsLoading(true);
    try {
      const competencyMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      
      const processedResults = await Promise.all(
        employees
          .filter(emp => selectedIds.includes(emp.id))
          .map(async (emp) => {
            const input: PayrollInput = {
              employee: {
                id: emp.id,
                name: emp.employeeName,
                salary: emp.salario_base || 0,
                workHours: 220,
                dependents: emp.dependentes_lista || [],
                regime: 'CLT',
                unitId: emp.unitId,
                cpf: emp.cpf || '',
                pis: emp.pis || '',
                matricula: emp.matricula || '',
                cargo: emp.cargo || '',
                departamento: emp.departamento || '',
                admissionDate: emp.data_admissao || new Date().toISOString(),
                active: true
              } as any,
              competencyMonth,
              overtimeHours50: emp.he50_qtd || 0,
              overtimeHours100: emp.he100_qtd || 0,
              nightShiftHours: emp.adic_noturno_qtd || 0,
              hazardPayDegree: emp.insalubridade_grau || 'NONE',
              periculosidade: emp.periculosidade_ativo || false,
              dsr: emp.dsr_ativo || false,
              commission: emp.comissoes || 0,
              bonuses: (emp.gratificacoes || 0) + (emp.premios || 0),
              familySalary: emp.salario_familia,
              otherAllowances: (emp.auxilio_moradia || 0) + (emp.arredondamento || 0),
              
              absenceDays: emp.faltas || 0,
              alimony: emp.pensao_alimenticia || 0,
              healthInsurance: emp.plano_saude_colaborador || 0,
              mealTicket: emp.vale_alimentacao || 0,
              transport: emp.vale_transporte_total || 0,
              otherDeductions: (emp.adiantamento || 0) + (emp.consignado || 0) + (emp.outros_descontos || 0) + (emp.coparticipacoes || 0),
            };
            
            const calculation = payrollService.generateMonthlyPayroll(input);
            
            const updatedEmp = {
              ...emp,
              total_proventos: calculation.totals.totalAllowances,
              total_descontos: calculation.totals.totalDeductions,
              salario_liquido: calculation.totals.netSalary,
              inss: calculation.deductions.inss,
              irrf: calculation.deductions.irrf,
              status: 'PAID' as const,
              updatedAt: new Date().toISOString()
            };

            await dbService.saveEmployee(updatedEmp);
            return updatedEmp;
          })
      );

      alert(`Folha processada com sucesso para ${processedResults.length} funcionários.`);
      // Recarregar a página ou atualizar o estado global se necessário
      window.location.reload();
      
    } catch (error) {
      console.error('Erro ao processar folha:', error);
      alert('Erro ao processar folha de pagamento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    const selectedEmployees = employees.filter(e => selectedIds.includes(e.id));
    if (selectedEmployees.length === 0) {
      alert('Selecione pelo menos um funcionário para imprimir o holerite.');
      return;
    }

    setIsLoading(true);
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      for (const emp of selectedEmployees) {
        await exportService.exportarHoleritePDF({
          ...emp,
          month: String(currentMonth).padStart(2, '0'),
          year: String(currentYear)
        });
      }
    } catch (error) {
      console.error('Erro ao gerar PDFs:', error);
      alert('Erro ao gerar holerites em PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (emp: Payroll) => {
    setEditingEmployee({ ...emp });
  };

  const handleSaveEdit = async () => {
    if (!editingEmployee) return;
    
    setIsLoading(true);
    try {
      await dbService.saveEmployee(editingEmployee);
      alert('Dados atualizados com sucesso.');
      setEditingEmployee(null);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert('Erro ao salvar dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tight">Cálculo de Folha de Pagamento</h1>
          <p className="text-slate-500 font-medium mt-2 text-[11px] uppercase tracking-widest">Processamento de proventos, encargos e eSocial</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleGeneratePDF}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-200 text-slate-600 rounded-xl font-bold text-[10px] uppercase transition-all hover:bg-slate-300 disabled:opacity-50"
          >
            <Printer size={16}/> Holerites
          </button>
          <button 
            onClick={handleProcessPayroll}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase shadow-lg transition-all hover:bg-indigo-700 disabled:opacity-50"
          >
            <Calculator size={16}/> {isLoading ? 'Processando...' : 'Processar Mês Atual'}
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
            {employees.map(emp => {
              const totalProventos = emp.salario_base || 0;
              const totalDescontos = (emp.inss || 0) + (emp.irrf || 0) + (emp.vale_transporte_total || 0) + (emp.vale_alimentacao || 0) + (emp.plano_saude_colaborador || 0) + (emp.outros_descontos || 0); 
              const salarioLiquido = totalProventos - totalDescontos;

              return (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => setSelectedIds(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id])} className="w-4 h-4 accent-indigo-600" />
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-bold text-slate-900 leading-none mb-1">{emp.employeeName}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{emp.cargo}</p>
                  </td>
                  <td className="px-8 py-4 text-emerald-600 font-bold">R$ {totalProventos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                  <td className="px-8 py-4 text-rose-600 font-bold">R$ {totalDescontos.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                  <td className="px-8 py-4 text-slate-900 font-black">R$ {salarioLiquido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</td>
                  <td className="px-8 py-4 text-right"><button onClick={() => handleEdit(emp)} className="text-slate-400 hover:text-indigo-600"><Edit3 size={16}/></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {editingEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-4xl shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black uppercase">Cálculo Individual: {editingEmployee.employeeName}</h2>
              <button onClick={() => setEditingEmployee(null)} className="text-slate-400 hover:text-slate-600">Fechar</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Proventos */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b pb-2">Proventos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Salário Base</label>
                    <input type="number" value={editingEmployee.salario_base} onChange={e => setEditingEmployee({...editingEmployee, salario_base: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">H.E. 50% (Qtd)</label>
                    <input type="number" value={editingEmployee.he50_qtd} onChange={e => setEditingEmployee({...editingEmployee, he50_qtd: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">H.E. 100% (Qtd)</label>
                    <input type="number" value={editingEmployee.he100_qtd} onChange={e => setEditingEmployee({...editingEmployee, he100_qtd: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Adic. Noturno (Qtd)</label>
                    <input type="number" value={editingEmployee.adic_noturno_qtd} onChange={e => setEditingEmployee({...editingEmployee, adic_noturno_qtd: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Insalubridade</label>
                    <select value={editingEmployee.insalubridade_grau} onChange={e => setEditingEmployee({...editingEmployee, insalubridade_grau: e.target.value as any})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold">
                      <option value="NONE">Nenhum</option>
                      <option value="LOW">Mínimo (10%)</option>
                      <option value="MEDIUM">Médio (20%)</option>
                      <option value="HIGH">Máximo (40%)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input type="checkbox" checked={editingEmployee.periculosidade_ativo} onChange={e => setEditingEmployee({...editingEmployee, periculosidade_ativo: e.target.checked})} className="w-4 h-4 rounded border-slate-200" />
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Periculosidade (30%)</label>
                  </div>
                  <div className="flex items-center gap-2 pt-4">
                    <input type="checkbox" checked={editingEmployee.dsr_ativo} onChange={e => setEditingEmployee({...editingEmployee, dsr_ativo: e.target.checked})} className="w-4 h-4 rounded border-slate-200" />
                    <label className="text-[10px] font-bold text-slate-400 uppercase">DSR Ativo</label>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Comissões</label>
                    <input type="number" value={editingEmployee.comissoes} onChange={e => setEditingEmployee({...editingEmployee, comissoes: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Salário Família</label>
                    <input type="number" value={editingEmployee.salario_familia} onChange={e => setEditingEmployee({...editingEmployee, salario_familia: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                </div>
              </div>

              {/* Descontos */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest border-b pb-2">Descontos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">INSS</label>
                    <input type="number" value={editingEmployee.inss} onChange={e => setEditingEmployee({...editingEmployee, inss: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">IRRF</label>
                    <input type="number" value={editingEmployee.irrf} onChange={e => setEditingEmployee({...editingEmployee, irrf: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Vale Transporte</label>
                    <input type="number" value={editingEmployee.vale_transporte_total} onChange={e => setEditingEmployee({...editingEmployee, vale_transporte_total: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Vale Alimentação</label>
                    <input type="number" value={editingEmployee.vale_alimentacao} onChange={e => setEditingEmployee({...editingEmployee, vale_alimentacao: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Plano de Saúde</label>
                    <input type="number" value={editingEmployee.plano_saude_colaborador} onChange={e => setEditingEmployee({...editingEmployee, plano_saude_colaborador: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Outros Descontos</label>
                    <input type="number" value={editingEmployee.outros_descontos} onChange={e => setEditingEmployee({...editingEmployee, outros_descontos: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                </div>
              </div>
            </div>

            {/* Encargos Patronais (Informativo) */}
            <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-white">
              <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-4">Encargos Patronais (Estimados)</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-40">INSS Patronal (20%)</p>
                  <p className="text-sm font-black">R$ {(editingEmployee.salario_base * 0.2).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-40">FGTS (8%)</p>
                  <p className="text-sm font-black">R$ {(editingEmployee.salario_base * 0.08).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-40">RAT/Terceiros</p>
                  <p className="text-sm font-black">R$ {(editingEmployee.salario_base * 0.058).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setEditingEmployee(null)} className="flex-1 py-4 rounded-xl font-black text-xs uppercase bg-slate-100 hover:bg-slate-200 transition-all">Cancelar</button>
              <button onClick={handleSaveEdit} disabled={isLoading} className="flex-1 py-4 rounded-xl font-black text-xs uppercase bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                {isLoading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
