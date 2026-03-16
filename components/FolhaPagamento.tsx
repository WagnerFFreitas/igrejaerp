/**
 * ============================================================================
 * COMPONENTE DE FOLHA DE PAGAMENTO
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Esta é a interface onde o usuário gerencia a folha de pagamento.
 * Ele mostra:
 * 
 * 1. LISTA DE FUNCIONÁRIOS
 * 2. CÁLCULO AUTOMÁTICO DA FOLHA
 * 3. VISUALIZAÇÃO DE HOLERITE (RECIBO)
 * 4. HISTÓRICO DE PAGAMENTOS
 * 5. EXPORTAÇÃO DE RECIBOS PDF
 * 
 * ANALOGIA:
 * ---------
 * É como um "departamento pessoal visual":
 * - Lista todos os funcionários
 * - Calcula folha com um clique
 * - Mostra detalhes de cada cálculo
 * - Gera recibos para impressão
 */

import React, { useState } from 'react';
import { 
  Users, Calculator, FileText, Download, Eye, DollarSign,
  Calendar, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, MoreVertical,
  Printer, Mail, Share2
} from 'lucide-react';
import { Employee, PayrollCalculation, PaySlip } from '../types';
import { payrollService, PayrollInput } from '../services/payrollService';

/**
 * PROPRIEDADES DO COMPONENTE
 * ==========================
 */
interface FolhaPagamentoProps {
  employees: Employee[];
  currentUnitId: string;
}

/**
 * COMPONENTE PRINCIPAL
 * ====================
 */
export const FolhaPagamento: React.FC<FolhaPagamentoProps> = ({
  employees,
  currentUnitId,
}) => {
  
  /**
   * ESTADOS DO REACT
   * ================
   */
  
  // Funcionário selecionado
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Mês de competência
  const [competencyMonth, setCompetencyMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  // Folha calculada
  const [calculatedPayroll, setCalculatedPayroll] = useState<PayrollCalculation | null>(null);
  
  // Loading
  const [isLoading, setIsLoading] = useState(false);
  
  // Visualizar recibo
  const [showPaySlip, setShowPaySlip] = useState(false);

  console.log('FolhaPagamento: employees', employees);
  
  /**
   * CALCULAR FOLHA DO FUNCIONÁRIO SELECIONADO
   * ==========================================
   */
  const handleCalculatePayroll = async () => {
    if (!selectedEmployee) return;
    
    try {
      setIsLoading(true);
      
      // Prepara input
      const input: PayrollInput = {
        employee: selectedEmployee,
        competencyMonth,
        overtimeHours: 0,
        nightShiftHours: 0,
        absenceDays: 0,
        workingDays: 22,
      };
      
      // Calcula folha
      const calculation = payrollService.generateMonthlyPayroll(input);
      
      setCalculatedPayroll(calculation);
      setShowPaySlip(true);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Erro ao calcular folha:', error);
      alert('Erro ao calcular folha. Verifique os dados.');
      setIsLoading(false);
    }
  };
  
  /**
   * FORMATAR MOEDA
   * ==============
   */
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  /**
   * EXPORTAR RECIBO PDF
   * ===================
   */
  const handleExportPDF = () => {
    alert('Funcionalidade de exportação PDF será implementada com biblioteca específica (ex: jsPDF, react-pdf)');
  };
  
  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none italic font-serif">
            Folha de Pagamento
          </h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-tighter mt-1">
            Gestão de Remuneração e Encargos v1.0
          </p>
        </div>
        
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-300 transition-all flex items-center gap-1.5"
        >
          <Clock size={14} /> Recarregar
        </button>
      </div>
      
      {/* SELETOR DE COMPETÊNCIA E FUNCIONÁRIO */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* COMPETÊNCIA */}
          <div>
            <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
              Mês de Competência
            </label>
            <input
              type="month"
              value={competencyMonth}
              onChange={(e) => setCompetencyMonth(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* FUNCIONÁRIO */}
          <div className="md:col-span-2">
            <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
              Funcionário
            </label>
            <select
              value={selectedEmployee?.id || ''}
              onChange={(e) => {
                const emp = employees.find(emp => emp.id === e.target.value);
                setSelectedEmployee(emp || null);
              }}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione um funcionário...</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.cargo} ({emp.regime})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* RESUMO DOS FUNCIONÁRIOS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* TOTAL FUNCIONÁRIOS */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase opacity-90">Funcionários</span>
            <Users size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-black">
            {employees.length}
          </div>
          <div className="text-[9px] font-medium opacity-75 mt-1">
            Ativos na unidade
          </div>
        </div>
        
        {/* SALÁRIO MÉDIO */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase opacity-90">Salário Médio</span>
            <DollarSign size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-black">
            {formatCurrency(
              employees.reduce((sum, e) => sum + e.salary, 0) / (employees.length || 1)
            )}
          </div>
          <div className="text-[9px] font-medium opacity-75 mt-1">
            Por funcionário
          </div>
        </div>
        
        {/* FOLHA BRUTA ESTIMADA */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase opacity-90">Folha Bruta</span>
            <TrendingUp size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-black">
            {formatCurrency(
              employees.reduce((sum, e) => sum + e.salary, 0)
            )}
          </div>
          <div className="text-[9px] font-medium opacity-75 mt-1">
            Estimativa mensal
          </div>
        </div>
        
        {/* ENCARGOS ESTIMADOS */}
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase opacity-90">Encargos</span>
            <AlertCircle size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-black">
            {formatCurrency(
              employees.reduce((sum, e) => sum + (e.salary * 0.33), 0)
            )}
          </div>
          <div className="text-[9px] font-medium opacity-75 mt-1">
            ~33% da folha bruta
          </div>
        </div>
      </div>
      
      {/* BOTÃO DE CÁLCULO */}
      {selectedEmployee && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 text-sm">
                Calcular folha de {selectedEmployee.name}
              </p>
              <p className="text-[9px] text-slate-500 font-medium mt-0.5">
                Salário: {formatCurrency(selectedEmployee.salary)} • {selectedEmployee.cargo}
              </p>
            </div>
            
            <button
              onClick={handleCalculatePayroll}
              disabled={isLoading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Calculator size={16} className="animate-spin" /> Calculando...
                </>
              ) : (
                <>
                  <Calculator size={16} /> Calcular Folha
                </>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* VISUALIZAÇÃO DO HOLERITE */}
      {showPaySlip && calculatedPayroll && selectedEmployee && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          
          {/* CABEÇALHO DO HOLERITE */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Recibo de Pagamento
                </h2>
                <p className="text-[9px] font-medium opacity-75 mt-1 uppercase">
                  Competência: {new Date(calculatedPayroll.competencyMonth + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg font-bold text-[10px] uppercase hover:bg-white/30 transition-all flex items-center gap-1.5"
                >
                  <Download size={14} /> PDF
                </button>
                
                <button
                  onClick={() => setShowPaySlip(false)}
                  className="px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg font-bold text-[10px] uppercase hover:bg-white/30 transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
          
          {/* DADOS DO FUNCIONÁRIO */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400 mb-1">
                  Funcionário
                </p>
                <p className="font-bold text-slate-900 text-sm">
                  {selectedEmployee.name}
                </p>
                <p className="text-[9px] text-slate-500 font-medium mt-0.5">
                  CPF: {selectedEmployee.cpf} • PIS: {selectedEmployee.pis}
                </p>
              </div>
              
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400 mb-1">
                  Cargo / Departamento
                </p>
                <p className="font-bold text-slate-900 text-sm">
                  {selectedEmployee.cargo}
                </p>
                <p className="text-[9px] text-slate-500 font-medium mt-0.5">
                  {selectedEmployee.departamento} • {selectedEmployee.regime}
                </p>
              </div>
            </div>
          </div>
          
          {/* PROVENTOS */}
          <div className="p-6 border-b">
            <h3 className="font-black text-slate-900 text-xs uppercase mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-600" />
              Proventos
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-xs font-medium text-slate-700">
                  Salário Base
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(calculatedPayroll.allowances.baseSalary)}
                </span>
              </div>
              
              {calculatedPayroll.allowances?.overtime && calculatedPayroll.allowances.overtime > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-700">
                    Horas Extras ({calculatedPayroll.overtimeHours}h)
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    {formatCurrency(calculatedPayroll.allowances.overtime)}
                  </span>
                </div>
              )}
              
              {calculatedPayroll.allowances?.familySalary && calculatedPayroll.allowances.familySalary > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-700">
                    Salário Família
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    {formatCurrency(calculatedPayroll.allowances.familySalary)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-3 bg-emerald-50 px-4 rounded-lg mt-3">
                <span className="text-xs font-black uppercase text-emerald-800">
                  Total Proventos
                </span>
                <span className="text-lg font-black text-emerald-900">
                  {formatCurrency(calculatedPayroll.totals.totalAllowances)}
                </span>
              </div>
            </div>
          </div>
          
          {/* DESCONTOS */}
          <div className="p-6 border-b">
            <h3 className="font-black text-slate-900 text-xs uppercase mb-4 flex items-center gap-2">
              <TrendingDown size={16} className="text-red-600" />
              Descontos
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-xs font-medium text-slate-700">
                  INSS ({(calculatedPayroll.calculationDetails.inssRate * 100).toFixed(2)}%)
                </span>
                <span className="text-sm font-bold text-red-600">
                  -{formatCurrency(calculatedPayroll.deductions.inss)}
                </span>
              </div>
              
              {calculatedPayroll.deductions.irrf > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-700">
                    IRRF ({(calculatedPayroll.calculationDetails.irrfRate * 100).toFixed(2)}%)
                  </span>
                  <span className="text-sm font-bold text-red-600">
                    -{formatCurrency(calculatedPayroll.deductions.irrf)}
                  </span>
                </div>
              )}
              
              {calculatedPayroll.deductions.fgts > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-700">
                    FGTS ({(calculatedPayroll.calculationDetails.fgtsRate * 100).toFixed(1)}%)
                  </span>
                  <span className="text-sm font-bold text-slate-600">
                    {formatCurrency(calculatedPayroll.deductions.fgts)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center py-3 bg-red-50 px-4 rounded-lg mt-3">
                <span className="text-xs font-black uppercase text-red-800">
                  Total Descontos
                </span>
                <span className="text-lg font-black text-red-900">
                  -{formatCurrency(calculatedPayroll.totals.totalDeductions)}
                </span>
              </div>
            </div>
          </div>
          
          {/* SALÁRIO LÍQUIDO */}
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">
                  Salário Líquido
                </p>
                <p className="text-3xl font-black text-indigo-900">
                  {formatCurrency(calculatedPayroll.totals.netSalary)}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">
                  Custo Empregador
                </p>
                <p className="text-xl font-black text-slate-700">
                  {formatCurrency(calculatedPayroll.totals.employerCost)}
                </p>
              </div>
            </div>
          </div>
          
          {/* RODAPÉ COM ASSINATURA */}
          <div className="p-6 border-t bg-slate-50">
            <div className="flex justify-between items-center">
              <div className="text-[9px] text-slate-500 font-medium">
                Gerado em: {new Date().toLocaleString('pt-BR')}
              </div>
              
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="w-32 h-px bg-slate-400 mb-1"></div>
                  <p className="text-[8px] text-slate-500 font-medium uppercase">
                    Funcionário
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-px bg-slate-400 mb-1"></div>
                  <p className="text-[8px] text-slate-500 font-medium uppercase">
                    Responsável RH
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
