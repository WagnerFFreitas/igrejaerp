
import React, { useState, useEffect } from 'react';
import { Calculator, Printer, Check, Edit3, DollarSign, ArrowDownRight, ArrowUpRight, Save, Loader2, RefreshCw } from 'lucide-react';
import { dbService } from '../services/databaseService';
import { exportService } from '../services/exportService';
import { Payroll, PayrollInput, TaxConfig } from '../types';
import { payrollService } from '../services/payrollService';
import IndexedDBService from '../src/services/indexedDBService';
import { DEFAULT_TAX_CONFIG } from '../constants';

interface ProcessamentoFolhaProps {
  employees: Payroll[];
  setEmployees: React.Dispatch<React.SetStateAction<Payroll[]>>;
  currentUnitId: string;
}

export const ProcessamentoFolha: React.FC<ProcessamentoFolhaProps> = ({ employees, setEmployees, currentUnitId }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Payroll | null>(null);
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(DEFAULT_TAX_CONFIG);
  
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [pendingAction, setPendingAction] = useState<'PDF' | 'PROCESS' | null>(null);

  // Carregar configurações fiscais
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = await IndexedDBService.get('system_config', 'tax_config');
        if (savedConfig) {
          setTaxConfig(savedConfig);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações fiscais:', error);
      }
    };
    loadConfig();
  }, []);

  const toggleSelectAll = () => {
    if (selectedIds.length === employees.length) setSelectedIds([]);
    else setSelectedIds(employees.map(e => e.id));
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      const latestEmployees = await dbService.getEmployees(currentUnitId);
      setEmployees(latestEmployees);
      alert('Lista de funcionários sincronizada com sucesso.');
    } catch (error) {
      console.error('Erro ao sincronizar funcionários:', error);
      alert('Erro ao sincronizar funcionários.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAction = async () => {
    setIsRangeModalOpen(false);
    
    // Filter employees based on range
    const filteredEmployees = employees.filter(emp => {
      if (rangeStart && emp.matricula < rangeStart) return false;
      if (rangeEnd && emp.matricula > rangeEnd) return false;
      return true;
    });

    if (filteredEmployees.length === 0) {
      alert('Nenhum funcionário encontrado na faixa selecionada.');
      return;
    }

    if (pendingAction === 'PDF') {
      await executeGeneratePDF(filteredEmployees);
    } else if (pendingAction === 'PROCESS') {
      await executeProcessPayroll(filteredEmployees);
    }
  };

  const executeGeneratePDF = async (selectedEmployees: Payroll[]) => {
    setIsLoading(true);
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      console.log(`📊 Gerando holerites para ${selectedEmployees.length} funcionários...`);
      const units = await dbService.getUnits();
      const currentUnit = units.find(u => u.id === currentUnitId);

      const payrollsToExport = selectedEmployees.map(emp => ({
        ...emp,
        month: String(currentMonth).padStart(2, '0'),
        year: String(currentYear),
        unit: currentUnit
      }));

      console.log('🚀 Chamando exportarHoleritesPDF para todos os selecionados');
      await exportService.exportarHoleritesPDF(payrollsToExport);
      
      console.log('✅ Todos os holerites foram processados em um único PDF.');
      alert(`${selectedEmployees.length} holerite(s) gerado(s) com sucesso em um único arquivo PDF.`);
    } catch (error) {
      console.error('❌ Erro ao gerar PDF único:', error);
      alert('Erro ao gerar holerites em PDF. Verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
    }
  };

  const executeProcessPayroll = async (selectedEmployees: Payroll[]) => {
    setIsLoading(true);
    try {
      const competencyMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      
      const processedResults = await Promise.all(
        selectedEmployees.map(async (emp) => {
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
            mealAllowance: emp.va_ativo ? (emp.vale_alimentacao || 0) : 0,
            mealTicket: emp.vr_ativo ? (emp.vale_refeicao || 0) : 0,
            transport: emp.vt_ativo ? (emp.vale_transporte_total || 0) : 0,
            pharmacy: emp.vale_farmacia || 0,
            lifeInsurance: emp.seguro_vida || 0,
            advance: emp.adiantamento || 0,
            consignado: emp.consignado || 0,
            coparticipation: emp.coparticipacoes || 0,
            healthInsurance: emp.ps_ativo ? (emp.plano_saude_colaborador || 0) : 0,
            dentalInsurance: emp.po_ativo ? (emp.plano_odontologico || 0) : 0,
            otherDeductions: emp.outros_descontos || 0,
          };
          
          const calculation = payrollService.generateMonthlyPayroll(input, {}, taxConfig);
          
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
      
      const updatedEmployees = employees.map(emp => {
        const processed = processedResults.find(p => p.id === emp.id);
        return processed || emp;
      });
      setEmployees(updatedEmployees);
      setSelectedIds([]);
      
    } catch (error) {
      console.error('Erro ao processar folha:', error);
      alert('Erro ao processar folha de pagamento.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessPayroll = () => {
    setPendingAction('PROCESS');
    setIsRangeModalOpen(true);
  };

  const handleGeneratePDF = () => {
    if (selectedIds.length === 0) {
      alert('Selecione pelo menos um funcionário para imprimir o holerite.');
      return;
    }
    setPendingAction('PDF');
    setIsRangeModalOpen(true);
  };

  const handleEdit = (emp: Payroll) => {
    setEditingEmployee({ 
      ...emp,
      vt_ativo: !!emp.vt_ativo,
      va_ativo: !!emp.va_ativo,
      vr_ativo: !!emp.vr_ativo,
      ps_ativo: !!emp.ps_ativo,
      po_ativo: !!emp.po_ativo,
      dsr_ativo: emp.dsr_ativo !== undefined ? !!emp.dsr_ativo : true
    });
  };

  // Recalcular impostos quando campos relevantes mudam no modal
  useEffect(() => {
    if (editingEmployee) {
      const input: PayrollInput = {
        employee: {
          id: editingEmployee.id,
          unitId: editingEmployee.unitId,
          name: editingEmployee.employeeName,
          salary: editingEmployee.salario_base || 0,
          workHours: 220,
          dependents: editingEmployee.dependentes_lista || [],
          regime: 'CLT',
          cpf: editingEmployee.cpf || '',
          pis: editingEmployee.pis || '',
          matricula: editingEmployee.matricula || '',
          admissionDate: editingEmployee.data_admissao || '',
          cargo: editingEmployee.cargo || '',
          departamento: editingEmployee.departamento || '',
          active: true
        },
        competencyMonth: new Date().toISOString().slice(0, 7),
        overtimeHours50: editingEmployee.he50_qtd || 0,
        overtimeHours100: editingEmployee.he100_qtd || 0,
        nightShiftHours: editingEmployee.adic_noturno_qtd || 0,
        hazardPayDegree: editingEmployee.insalubridade_grau || 'NONE',
        periculosidade: editingEmployee.periculosidade_ativo || false,
        dsr: !!editingEmployee.dsr_ativo,
        commission: editingEmployee.comissoes || 0,
        bonuses: editingEmployee.premios || 0,
        otherAllowances: (editingEmployee.gratificacoes || 0) + (editingEmployee.auxilio_moradia || 0),
        healthInsurance: editingEmployee.ps_ativo ? (editingEmployee.plano_saude_colaborador || 0) : 0,
        dentalInsurance: editingEmployee.po_ativo ? (editingEmployee.plano_odontologico || 0) : 0,
        mealAllowance: editingEmployee.va_ativo ? (editingEmployee.vale_alimentacao || 0) : 0,
        mealTicket: editingEmployee.vr_ativo ? (editingEmployee.vale_refeicao || 0) : 0,
        transport: editingEmployee.vt_ativo ? (editingEmployee.vale_transporte_total || 0) : 0,
        pharmacy: editingEmployee.vale_farmacia || 0,
        lifeInsurance: editingEmployee.seguro_vida || 0,
        advance: editingEmployee.adiantamento || 0,
        consignado: editingEmployee.consignado || 0,
        coparticipation: editingEmployee.coparticipacoes || 0,
        otherDeductions: editingEmployee.outros_descontos || 0,
      };

      const calculation = payrollService.generateMonthlyPayroll(input, {}, taxConfig);
      
      // Só atualiza se houver mudança para evitar loop
      if (
        calculation.deductions.inss !== editingEmployee.inss || 
        calculation.deductions.irrf !== editingEmployee.irrf ||
        calculation.totals.totalDeductions !== editingEmployee.total_descontos ||
        calculation.totals.netSalary !== editingEmployee.salario_liquido
      ) {
        setEditingEmployee(prev => prev ? {
          ...prev,
          inss: calculation.deductions.inss,
          irrf: calculation.deductions.irrf,
          total_proventos: calculation.totals.totalAllowances,
          total_descontos: calculation.totals.totalDeductions,
          salario_liquido: calculation.totals.netSalary
        } : null);
      }
    }
  }, [
    editingEmployee?.salario_base, 
    editingEmployee?.he50_qtd, 
    editingEmployee?.he100_qtd,
    editingEmployee?.adic_noturno_qtd,
    editingEmployee?.insalubridade_grau,
    editingEmployee?.periculosidade_ativo,
    editingEmployee?.dsr_ativo,
    editingEmployee?.va_ativo,
    editingEmployee?.vr_ativo,
    editingEmployee?.vt_ativo,
    editingEmployee?.ps_ativo,
    editingEmployee?.po_ativo,
    editingEmployee?.comissoes,
    editingEmployee?.premios,
    editingEmployee?.gratificacoes,
    editingEmployee?.auxilio_moradia,
    editingEmployee?.vale_alimentacao, 
    editingEmployee?.vale_refeicao,
    editingEmployee?.vale_transporte_total,
    editingEmployee?.vale_farmacia,
    editingEmployee?.seguro_vida,
    editingEmployee?.adiantamento,
    editingEmployee?.pensao_alimenticia,
    editingEmployee?.consignado,
    editingEmployee?.coparticipacoes,
    editingEmployee?.plano_saude_colaborador,
    editingEmployee?.outros_descontos,
    taxConfig
  ]);

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
            onClick={handleSync}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-[10px] uppercase transition-all hover:bg-slate-200 disabled:opacity-50"
            title="Sincronizar com banco de dados"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''}/> Sincronizar
          </button>
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
              <th className="px-4 py-4">Cadastro</th>
              <th className="px-4 py-4">Colaborador</th>
              <th className="px-8 py-4">Vencimentos</th>
              <th className="px-8 py-4">Descontos</th>
              <th className="px-8 py-4">Líquido</th>
              <th className="px-8 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {employees.map(emp => {
              const totalProventos = emp.total_proventos || (emp.salario_base || 0);
              const totalDescontos = emp.total_descontos || ((emp.inss || 0) + (emp.irrf || 0)); 
              const salarioLiquido = emp.salario_liquido || (totalProventos - totalDescontos);

              return (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => setSelectedIds(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id])} className="w-4 h-4 accent-indigo-600" />
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-600">{emp.matricula}</td>
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
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-4xl shadow-2xl my-auto relative max-h-[90vh] overflow-y-auto">
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase">INSS (Automático)</label>
                    <input 
                      type="number" 
                      value={editingEmployee.inss} 
                      readOnly 
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-black text-rose-600 bg-slate-50 cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">IRRF (Automático)</label>
                    <input 
                      type="number" 
                      value={editingEmployee.irrf} 
                      readOnly 
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-black text-rose-600 bg-slate-50 cursor-not-allowed" 
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={editingEmployee.vt_ativo} onChange={e => setEditingEmployee({...editingEmployee, vt_ativo: e.target.checked})} className="w-3 h-3 rounded" />
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Vale Transporte</label>
                    </div>
                    <input 
                      type="number" 
                      value={editingEmployee.vt_ativo ? editingEmployee.vale_transporte_total : 0} 
                      onChange={e => setEditingEmployee({...editingEmployee, vale_transporte_total: Number(e.target.value)})} 
                      className={`w-full p-2 rounded-lg border border-slate-200 text-xs font-bold ${!editingEmployee.vt_ativo ? 'bg-slate-50 text-slate-400' : ''}`}
                      disabled={!editingEmployee.vt_ativo}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={editingEmployee.va_ativo} onChange={e => setEditingEmployee({...editingEmployee, va_ativo: e.target.checked})} className="w-3 h-3 rounded" />
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Vale Alimentação</label>
                    </div>
                    <input 
                      type="number" 
                      value={editingEmployee.va_ativo ? editingEmployee.vale_alimentacao : 0} 
                      onChange={e => setEditingEmployee({...editingEmployee, vale_alimentacao: Number(e.target.value)})} 
                      className={`w-full p-2 rounded-lg border border-slate-200 text-xs font-bold ${!editingEmployee.va_ativo ? 'bg-slate-50 text-slate-400' : ''}`}
                      disabled={!editingEmployee.va_ativo}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={editingEmployee.vr_ativo} onChange={e => setEditingEmployee({...editingEmployee, vr_ativo: e.target.checked})} className="w-3 h-3 rounded" />
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Vale Refeição</label>
                    </div>
                    <input 
                      type="number" 
                      value={editingEmployee.vr_ativo ? editingEmployee.vale_refeicao : 0} 
                      onChange={e => setEditingEmployee({...editingEmployee, vale_refeicao: Number(e.target.value)})} 
                      className={`w-full p-2 rounded-lg border border-slate-200 text-xs font-bold ${!editingEmployee.vr_ativo ? 'bg-slate-50 text-slate-400' : ''}`}
                      disabled={!editingEmployee.vr_ativo}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Vale Farmácia</label>
                    <input type="number" value={editingEmployee.vale_farmacia} onChange={e => setEditingEmployee({...editingEmployee, vale_farmacia: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Seguro de Vida</label>
                    <input type="number" value={editingEmployee.seguro_vida} onChange={e => setEditingEmployee({...editingEmployee, seguro_vida: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Adiantamento</label>
                    <input type="number" value={editingEmployee.adiantamento} onChange={e => setEditingEmployee({...editingEmployee, adiantamento: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Pensão Alimentícia</label>
                    <input type="number" value={editingEmployee.pensao_alimenticia} onChange={e => setEditingEmployee({...editingEmployee, pensao_alimenticia: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Consignado</label>
                    <input type="number" value={editingEmployee.consignado} onChange={e => setEditingEmployee({...editingEmployee, consignado: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Coparticipações</label>
                    <input type="number" value={editingEmployee.coparticipacoes} onChange={e => setEditingEmployee({...editingEmployee, coparticipacoes: Number(e.target.value)})} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={editingEmployee.ps_ativo} onChange={e => setEditingEmployee({...editingEmployee, ps_ativo: e.target.checked})} className="w-3 h-3 rounded" />
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Plano de Saúde</label>
                    </div>
                    <input 
                      type="number" 
                      value={editingEmployee.ps_ativo ? editingEmployee.plano_saude_colaborador : 0} 
                      onChange={e => setEditingEmployee({...editingEmployee, plano_saude_colaborador: Number(e.target.value)})} 
                      className={`w-full p-2 rounded-lg border border-slate-200 text-xs font-bold ${!editingEmployee.ps_ativo ? 'bg-slate-50 text-slate-400' : ''}`}
                      disabled={!editingEmployee.ps_ativo}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="checkbox" checked={editingEmployee.po_ativo} onChange={e => setEditingEmployee({...editingEmployee, po_ativo: e.target.checked})} className="w-3 h-3 rounded" />
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Plano Odontológico</label>
                    </div>
                    <input 
                      type="number" 
                      value={editingEmployee.po_ativo ? editingEmployee.plano_odontologico : 0} 
                      onChange={e => setEditingEmployee({...editingEmployee, plano_odontologico: Number(e.target.value)})} 
                      className={`w-full p-2 rounded-lg border border-slate-200 text-xs font-bold ${!editingEmployee.po_ativo ? 'bg-slate-50 text-slate-400' : ''}`}
                      disabled={!editingEmployee.po_ativo}
                    />
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
                  <p className="text-[9px] font-bold uppercase opacity-40">INSS Patronal ({(taxConfig.patronalRate * 100).toFixed(1)}%)</p>
                  <p className="text-sm font-black">R$ {(editingEmployee.salario_base * (taxConfig.patronalRate || 0.2)).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-40">FGTS ({(taxConfig.fgtsRate * 100).toFixed(1)}%)</p>
                  <p className="text-sm font-black">R$ {(editingEmployee.salario_base * (taxConfig.fgtsRate || 0.08)).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-40">RAT/Terceiros ({((taxConfig.ratRate + taxConfig.terceirosRate) * 100).toFixed(1)}%)</p>
                  <p className="text-sm font-black">R$ {(editingEmployee.salario_base * ((taxConfig.ratRate || 0.02) + (taxConfig.terceirosRate || 0.058))).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
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
      {isRangeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 space-y-4">
            <h2 className="text-lg font-black uppercase">Selecionar Faixa</h2>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Matrícula Inicial</label>
              <input type="text" value={rangeStart} onChange={e => setRangeStart(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Matrícula Final</label>
              <input type="text" value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200 text-xs font-bold" />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsRangeModalOpen(false)} className="flex-1 py-2 rounded-lg font-bold text-xs uppercase bg-slate-100 hover:bg-slate-200">Cancelar</button>
              <button onClick={confirmAction} className="flex-1 py-2 rounded-lg font-bold text-xs uppercase bg-indigo-600 text-white hover:bg-indigo-700">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
