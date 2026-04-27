/**
 * ============================================================================
 * RELATÓRIO GERENCIAL DE FLUXO DE CAIXA
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este componente gera relatórios executivos para tomada de decisão.
 * Ele inclui:
 * 
 * 1. COMPARATIVO PROJETADO VS REALIZADO
 * 2. ANÁLISE DE VARIÂNCIAS
 * 3. INDICADORES DE PERFORMANCE
 * 4. EXPORTAÇÃO PARA PDF/EXCEL
 * 
 * ANALOGIA:
 * ---------
 * É como um "relatório de gestão financeira":
 * - Mostra o que foi planejado
 * - Compara com o que aconteceu
 * - Explica diferenças
 * - Sugere melhorias
 */

import React, { useState } from 'react';
import { 
  FileText, Download, BarChart3, TrendingUp, TrendingDown,
  Calendar, DollarSign, Percent, Target, AlertTriangle, CheckCircle
} from 'lucide-react';
import { CashFlowProjection } from '../utils/calculosFluxoCaixa';
import { Transaction } from '../types';

/**
 * PROPRIEDADES DO COMPONENTE
 * ==========================
 */
interface RelatorioFluxoCaixaProps {
  projection: CashFlowProjection;
  actualTransactions?: Transaction[];  // Transações reais (se tiver)
  onExportPDF?: () => void;
  onExportExcel?: () => void;
}

/**
 * COMPONENTE PRINCIPAL
 * ====================
 */
export const RelatorioFluxoCaixa: React.FC<RelatorioFluxoCaixaProps> = ({
  projection,
  actualTransactions,
  onExportPDF,
  onExportExcel,
}) => {
  
  /**
   * ESTADOS
   * =======
   */
  const [showDetails, setShowDetails] = useState(false);
  
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
   * FORMATAR DATA
   * =============
   */
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };
  
  /**
   * CALCULAR VARIÂNCIA
   * ==================
   */
  const calculateVariance = (projected: number, actual: number): number => {
    if (projected === 0) return 0;
    return ((actual - projected) / projected) * 100;
  };
  
  /**
   * OBTER COR DA VARIÂNCIA
   * ======================
   */
  const getVarianceColor = (variance: number, type: 'INCOME' | 'EXPENSE') => {
    const isPositive = variance >= 0;
    
    if (type === 'INCOME') {
      return isPositive ? 'text-emerald-600' : 'text-red-600';
    } else {
      return isPositive ? 'text-red-600' : 'text-emerald-600'; // Despesa menor é bom
    }
  };
  
  /**
   * RENDERIZAR ÍCONE DE VARIÂNCIA
   * =============================
   */
  const renderVarianceIcon = (variance: number, type: 'INCOME' | 'EXPENSE') => {
    const isPositive = variance >= 0;
    
    if (type === 'INCOME') {
      return isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
    } else {
      return isPositive ? <TrendingDown size={16} /> : <TrendingUp size={16} />;
    }
  };
  
  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none italic font-serif">
            Relatório de Fluxo de Caixa
          </h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-tighter mt-1">
            Análise Gerencial {projection.days} Dias v1.0
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onExportPDF}
            className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-300 transition-all flex items-center gap-1.5"
          >
            <FileText size={14} /> PDF
          </button>
          
          <button
            onClick={onExportExcel}
            className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-emerald-700 transition-all flex items-center gap-1.5"
          >
            <Download size={14} /> Excel
          </button>
        </div>
      </div>
      
      {/* PERÍODO DO RELATÓRIO */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={16} className="opacity-75" />
              <span className="text-[9px] font-bold uppercase opacity-90">
                Período
              </span>
            </div>
            <p className="font-black text-sm">
              {formatDate(projection.startDate)} a {formatDate(projection.endDate)}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target size={16} className="opacity-75" />
              <span className="text-[9px] font-bold uppercase opacity-90">
                Cenário
              </span>
            </div>
            <p className="font-black text-sm">
              {projection.scenario === 'OPTIMISTIC' && 'Otimista'}
              {projection.scenario === 'NORMAL' && 'Normal'}
              {projection.scenario === 'PESSIMISTIC' && 'Pessimista'}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={16} className="opacity-75" />
              <span className="text-[9px] font-bold uppercase opacity-90">
                Saldo Atual
              </span>
            </div>
            <p className="font-black text-sm">
              {formatCurrency(projection.currentBalance)}
            </p>
          </div>
        </div>
      </div>
      
      {/* RESUMO EXECUTIVO */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-indigo-600" />
          <h3 className="font-black text-slate-900 text-xs uppercase">
            Resumo Executivo
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* RECEITAS */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase text-emerald-700">
                Receitas Projetadas
              </span>
              <TrendingUp size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-900">
              {formatCurrency(projection.projectedIncome)}
            </p>
            
            {actualTransactions && (
              <div className="mt-3 pt-3 border-t border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-medium text-emerald-700">
                    Realizado (parcial)
                  </span>
                  <span className="text-[8px] font-black text-emerald-900">
                    {formatCurrency(
                      actualTransactions
                        .filter(t => t.type === 'INCOME')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* DESPESAS */}
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase text-red-700">
                Despesas Projetadas
              </span>
              <TrendingDown size={16} className="text-red-600" />
            </div>
            <p className="text-2xl font-black text-red-900">
              {formatCurrency(projection.projectedExpense)}
            </p>
            
            {actualTransactions && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-medium text-red-700">
                    Realizado (parcial)
                  </span>
                  <span className="text-[8px] font-black text-red-900">
                    {formatCurrency(
                      actualTransactions
                        .filter(t => t.type === 'EXPENSE')
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* SALDO FINAL */}
          <div className={`p-4 rounded-xl border ${
            projection.projectedFinalBalance >= 0
              ? 'bg-blue-50 border-blue-100'
              : 'bg-orange-50 border-orange-100'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[9px] font-black uppercase ${
                projection.projectedFinalBalance >= 0
                  ? 'text-blue-700'
                  : 'text-orange-700'
              }`}>
                Saldo Final Projetado
              </span>
              <DollarSign size={16} className={
                projection.projectedFinalBalance >= 0
                  ? 'text-blue-600'
                  : 'text-orange-600'
              } />
            </div>
            <p className={`text-2xl font-black ${
              projection.projectedFinalBalance >= 0
                ? 'text-blue-900'
                : 'text-orange-900'
            }`}>
              {formatCurrency(projection.projectedFinalBalance)}
            </p>
            
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-medium text-slate-600">
                  Variação
                </span>
                <span className={`text-[8px] font-black ${
                  (projection.projectedFinalBalance - projection.currentBalance) >= 0
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}>
                  {(projection.projectedFinalBalance - projection.currentBalance) >= 0 ? '+' : ''}
                  {formatCurrency(projection.projectedFinalBalance - projection.currentBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ALERTAS E RECOMENDAÇÕES */}
      {projection.alerts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-amber-600" />
            <h3 className="font-black text-slate-900 text-xs uppercase">
              Alertas e Recomendações
            </h3>
          </div>
          
          <div className="space-y-3">
            {projection.alerts.slice(0, 5).map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-l-4 ${
                  alert.severity === 'CRITICAL'
                    ? 'bg-red-50 border-red-600'
                    : 'bg-amber-50 border-amber-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  {alert.severity === 'CRITICAL' ? (
                    <AlertTriangle size={18} className="text-red-600 mt-0.5" />
                  ) : (
                    <CheckCircle size={18} className="text-amber-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-xs">
                      {alert.message}
                    </p>
                    <div className="flex gap-3 mt-1 text-[9px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(alert.date)}
                      </span>
                      <span className={`font-black ${
                        alert.projectedBalance < 0 ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        Saldo: {formatCurrency(alert.projectedBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {projection.alerts.length > 5 && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full mt-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-200 transition-all"
            >
              {showDetails ? 'Ver Menos' : `Ver Mais ${projection.alerts.length - 5} Alertas`}
            </button>
          )}
        </div>
      )}
      
      {/* DETALHAMENTO DIÁRIO (OPCIONAL) */}
      {showDetails && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-indigo-600" />
            <h3 className="font-black text-slate-900 text-xs uppercase">
              Detalhamento Diário
            </h3>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="text-left py-2 px-3 text-[9px] font-black uppercase text-slate-500">
                    Data
                  </th>
                  <th className="text-right py-2 px-3 text-[9px] font-black uppercase text-slate-500">
                    Receitas
                  </th>
                  <th className="text-right py-2 px-3 text-[9px] font-black uppercase text-slate-500">
                    Despesas
                  </th>
                  <th className="text-right py-2 px-3 text-[9px] font-black uppercase text-slate-500">
                    Saldo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projection.dailyProjections.map((day, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 text-xs font-medium text-slate-900">
                      {formatDate(day.date)}
                    </td>
                    <td className="py-2 px-3 text-right text-xs font-bold text-emerald-600">
                      {formatCurrency(day.income)}
                    </td>
                    <td className="py-2 px-3 text-right text-xs font-bold text-red-600">
                      {formatCurrency(day.expense)}
                    </td>
                    <td className={`py-2 px-3 text-right text-xs font-black ${
                      day.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(day.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
