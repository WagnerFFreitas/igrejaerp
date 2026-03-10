/**
 * ============================================================================
 * COMPONENTE DE FLUXO DE CAIXA PROJETADO
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Esta é a interface visual onde o usuário vê projeções financeiras.
 * Ele mostra:
 * 
 * 1. CARDS DE RESUMO (30/60/90 dias)
 * 2. GRÁFICO DE EVOLUÇÃO DE SALDO
 * 3. SIMULADOR DE CENÁRIOS
 * 4. LISTA DE ALERTAS PREVENTIVOS
 * 5. TENDÊNCIAS E INDICADORES
 * 
 * ANALOGIA:
 * ---------
 * É como um "painel de controle financeiro":
 * - Mostra para onde o dinheiro está indo
 * - Alerta se vai faltar grana
 * - Permite simular decisões
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Minus, Play, RefreshCcw, Download,
  BarChart3, PieChart, Activity, Eye, Shield, Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cashFlowProjectionService, ProjectionConfig } from '../services/projecaoFluxoCaixaService';
import { CashFlowProjection, CashFlowAlert } from '../utils/calculosFluxoCaixa';
import { Transaction } from '../types';

/**
 * PROPRIEDADES DO COMPONENTE
 * ==========================
 */
interface FluxoCaixaProjetadoProps {
  currentBalance: number;              // Saldo atual
  transactions: Transaction[];          // Histórico
  receivables: Transaction[];           // Contas a receber
  payables: Transaction[];              // Contas a pagar
}

/**
 * COMPONENTE PRINCIPAL
 * ====================
 */
export const FluxoCaixaProjetado: React.FC<FluxoCaixaProjetadoProps> = ({
  currentBalance,
  transactions,
  receivables,
  payables,
}) => {
  
  /**
   * ESTADOS DO REACT
   * ================
   */
  
  // Projeção atual
  const [projection, setProjection] = useState<CashFlowProjection | null>(null);
  
  // Configuração
  const [config, setConfig] = useState<ProjectionConfig>({
    days: 30,
    scenario: 'NORMAL',
    includeSeasonality: true,
    warningThreshold: 1000,
  });
  
  // Loading
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * GERAR PROJEÇÃO AO MUDAR CONFIGURAÇÃO
   * =====================================
   */
  useEffect(() => {
    generateProjection();
  }, [config]);
  
  /**
   * GERAR PROJEÇÃO
   * ==============
   */
  const generateProjection = async () => {
    try {
      setIsLoading(true);
      
      const result = await cashFlowProjectionService.generateProjection(
        currentBalance,
        transactions,
        receivables,
        payables,
        config
      );
      
      setProjection(result);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Erro ao gerar projeção:', error);
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
   * FORMATAR DATA
   * =============
   */
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };
  
  /**
   * OBTER COR DO SALDO
   * ==================
   */
  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-emerald-600';
    if (balance < 0) return 'text-red-600';
    return 'text-slate-600';
  };
  
  /**
   * RENDERIZAR ÍCONE DE TENDÊNCIA
   * =============================
   */
  const renderTrendIcon = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    switch (trend) {
      case 'UP':
        return <ArrowUpRight size={16} className="text-emerald-600" />;
      case 'DOWN':
        return <ArrowDownRight size={16} className="text-red-600" />;
      default:
        return <Minus size={16} className="text-slate-600" />;
    }
  };
  
  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none italic font-serif">
            Fluxo de Caixa Projetado
          </h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-tighter mt-1">
            Previsão Financeira Inteligente v1.0
          </p>
        </div>
        
        <button
          onClick={generateProjection}
          disabled={isLoading}
          className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[10px] uppercase hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-1.5"
        >
          <RefreshCcw size={14} className={isLoading ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>
      
      {/* SELETOR DE PERÍODO E CENÁRIO */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* PERÍODO */}
          <div>
            <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
              Período de Projeção
            </label>
            <select
              value={config.days}
              onChange={(e) => setConfig({ ...config, days: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={30}>30 Dias</option>
              <option value={60}>60 Dias</option>
              <option value={90}>90 Dias</option>
            </select>
          </div>
          
          {/* CENÁRIO */}
          <div>
            <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
              Cenário
            </label>
            <select
              value={config.scenario}
              onChange={(e) => setConfig({ ...config, scenario: e.target.value as any })}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="OPTIMISTIC">Otimista</option>
              <option value="NORMAL">Normal</option>
              <option value="PESSIMISTIC">Pessimista</option>
            </select>
          </div>
          
          {/* INFORMAÇÕES */}
          <div className="flex items-end">
            <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-indigo-600" />
                <span className="text-[9px] font-bold text-slate-600 uppercase">
                  Saldo Atual: {formatCurrency(currentBalance)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CARDS DE RESUMO */}
      {projection && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* RECEITAS PROJETADAS */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase opacity-90">Receitas</span>
              <TrendingUp size={20} className="opacity-75" />
            </div>
            <div className="text-3xl font-black">
              {formatCurrency(projection.projectedIncome)}
            </div>
            <div className="text-[9px] font-medium opacity-75 mt-1">
              Projeção para {projection.days} dias
            </div>
          </div>
          
          {/* DESPESAS PROJETADAS */}
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase opacity-90">Despesas</span>
              <TrendingDown size={20} className="opacity-75" />
            </div>
            <div className="text-3xl font-black">
              {formatCurrency(projection.projectedExpense)}
            </div>
            <div className="text-[9px] font-medium opacity-75 mt-1">
              Projeção para {projection.days} dias
            </div>
          </div>
          
          {/* SALDO FINAL PROJETADO */}
          <div className={`rounded-2xl p-5 text-white shadow-lg ${
            projection.projectedFinalBalance >= 0 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
              : 'bg-gradient-to-br from-orange-500 to-red-600'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase opacity-90">Saldo Final</span>
              <DollarSign size={20} className="opacity-75" />
            </div>
            <div className="text-3xl font-black">
              {formatCurrency(projection.projectedFinalBalance)}
            </div>
            <div className="text-[9px] font-medium opacity-75 mt-1">
              Em {formatDate(projection.endDate)}
            </div>
          </div>
          
          {/* ALERTAS */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase opacity-90">Alertas</span>
              <AlertTriangle size={20} className="opacity-75" />
            </div>
            <div className="text-3xl font-black">
              {projection.alerts.length}
            </div>
            <div className="text-[9px] font-medium opacity-75 mt-1">
              Requerem atenção
            </div>
          </div>
        </div>
      )}
      
      {/* GRÁFICO DE EVOLUÇÃO */}
      {projection && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-slate-900 text-xs uppercase flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-600" />
              Evolução do Saldo
            </h3>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projection.dailyProjections}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(val) => formatDate(val)}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickFormatter={(val) => `R$ ${val/1000}k`}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  labelFormatter={(val) => formatDate(val)}
                  formatter={(value: any) => formatCurrency(Number(value || 0))}
                  contentStyle={{
                    fontSize: '11px',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      {/* ALERTAS PREVENTIVOS */}
      {projection && projection.alerts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-amber-600" />
            <h3 className="font-black text-slate-900 text-xs uppercase">
              Alertas Preventivos ({projection.alerts.length})
            </h3>
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {projection.alerts.map((alert, idx) => (
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
                    <AlertTriangle size={18} className="text-amber-600 mt-0.5" />
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
                        Saldo projetado: {formatCurrency(alert.projectedBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* TENDÊNCIAS */}
      {projection && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* SAÚDE GERAL */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={18} className="text-indigo-600" />
              <span className="text-[10px] font-black uppercase text-slate-400">
                Saúde Financeira
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${
                projection.projectedFinalBalance > 0 
                  ? 'bg-emerald-100' 
                  : 'bg-red-100'
              }`}>
                {projection.projectedFinalBalance > 0 ? (
                  <Shield size={24} className="text-emerald-600" />
                ) : (
                  <AlertTriangle size={24} className="text-red-600" />
                )}
              </div>
              
              <div>
                <p className="font-black text-slate-900 text-sm">
                  {projection.projectedFinalBalance > 0 ? 'POSITIVA' : 'NEGATIVA'}
                </p>
                <p className="text-[9px] text-slate-500 font-medium mt-0.5">
                  Projeção para {projection.days} dias
                </p>
              </div>
            </div>
          </div>
          
          {/* VARIAÇÃO DE SALDO */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} className="text-indigo-600" />
              <span className="text-[10px] font-black uppercase text-slate-400">
                Variação de Saldo
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${
                (projection.projectedFinalBalance - currentBalance) >= 0
                  ? 'bg-emerald-100'
                  : 'bg-red-100'
              }`}>
                {(projection.projectedFinalBalance - currentBalance) >= 0 ? (
                  <ArrowUpRight size={24} className="text-emerald-600" />
                ) : (
                  <ArrowDownRight size={24} className="text-red-600" />
                )}
              </div>
              
              <div>
                <p className={`font-black text-sm ${
                  (projection.projectedFinalBalance - currentBalance) >= 0
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}>
                  {(projection.projectedFinalBalance - currentBalance) >= 0 ? '+' : ''}
                  {formatCurrency(projection.projectedFinalBalance - currentBalance)}
                </p>
                <p className="text-[9px] text-slate-500 font-medium mt-0.5">
                  Em relação a hoje
                </p>
              </div>
            </div>
          </div>
          
          {/* DIA MAIS CRÍTICO */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-indigo-600" />
              <span className="text-[10px] font-black uppercase text-slate-400">
                Dia Mais Crítico
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100">
                <AlertTriangle size={24} className="text-amber-600" />
              </div>
              
              <div>
                <p className="font-black text-slate-900 text-sm">
                  {formatDate(
                    projection.dailyProjections.reduce((min, p) => 
                      p.balance < min.balance ? p : min
                    ).date
                  )}
                </p>
                <p className="text-[9px] text-slate-500 font-medium mt-0.5">
                  Menor saldo projetado
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
