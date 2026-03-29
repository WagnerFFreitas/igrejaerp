import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Calendar, FileText, Upload, Download,
  CreditCard, Building, Search, Filter, Plus, X, CheckCircle, AlertTriangle,
  PieChart, BarChart3, RefreshCcw, Eye, Printer, Share2, Wallet, Landmark,
  PiggyBank, AlertCircle, Target, Activity, ArrowUpRight, ArrowDownRight,
  MoreVertical, Settings, Bell, ChevronRight
} from 'lucide-react';
import TreasuryService from '../services/treasuryService';
import { 
  CashFlow, 
  CashFlowForecast, 
  TreasuryAccount, 
  Investment, 
  Loan, 
  TreasuryAlert,
  FinancialPosition 
} from '../types';

interface TesourariaProps {
  currentUnitId: string;
  user?: any;
}

/**
 * COMPONENTE DE GESTÃO DE TESOURARIA
 * ===================================
 * 
 * Funcionalidades:
 * 1. Fluxo de Caixa em Tempo Real
 * 2. Projeções Financeiras
 * 3. Gestão de Investimentos
 * 4. Controle de Empréstimos
 * 5. Alertas Inteligentes
 * 6. Posição Financeira Consolidada
 */
export const Tesouraria: React.FC<TesourariaProps> = ({ currentUnitId, user }) => {
  const [activeTab, setActiveTab] = useState<'cashflow' | 'forecast' | 'accounts' | 'investments' | 'loans' | 'alerts' | 'position'>('cashflow');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para Fluxo de Caixa
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [cashFlowFilter, setCashFlowFilter] = useState<'ALL' | 'RECEITA' | 'DESPESA' | 'TRANSFERENCIA'>('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState<'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR'>('MONTH');
  
  // Estados para Projeções
  const [forecasts, setForecasts] = useState<CashFlowForecast[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<CashFlowForecast | null>(null);
  
  // Estados para Contas
  const [treasuryAccounts, setTreasuryAccounts] = useState<TreasuryAccount[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  
  // Estados para Investimentos
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [averageReturn, setAverageReturn] = useState(0);
  
  // Estados para Empréstimos
  const [loans, setLoans] = useState<Loan[]>([]);
  const [totalLoaned, setTotalLoaned] = useState(0);
  const [nextPayments, setNextPayments] = useState(0);
  
  // Estados para Alertas
  const [alerts, setAlerts] = useState<TreasuryAlert[]>([]);
  const [activeAlerts, setActiveAlerts] = useState(0);
  
  // Estados para Posição Financeira
  const [financialPosition, setFinancialPosition] = useState<FinancialPosition | null>(null);
  
  // Estados para Modais
  const [showNewCashFlowModal, setShowNewCashFlowModal] = useState(false);
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [showNewInvestmentModal, setShowNewInvestmentModal] = useState(false);
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [showForecastModal, setShowForecastModal] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    loadAllData();
  }, [currentUnitId]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Carregar todos os dados em paralelo
      const [
        cashFlowsData,
        forecastsData,
        accountsData,
        investmentsData,
        loansData,
        alertsData,
        summaryData
      ] = await Promise.all([
        TreasuryService.getCashFlows(currentUnitId),
        TreasuryService.getCashFlowForecasts(currentUnitId),
        TreasuryService.getTreasuryAccounts(currentUnitId),
        TreasuryService.getInvestments(currentUnitId),
        TreasuryService.getLoans(currentUnitId),
        TreasuryService.getTreasuryAlerts(currentUnitId),
        TreasuryService.getTreasurySummary(currentUnitId)
      ]);

      setCashFlows(cashFlowsData);
      setForecasts(forecastsData);
      setTreasuryAccounts(accountsData);
      setInvestments(investmentsData);
      setLoans(loansData);
      setAlerts(alertsData);
      
      // Atualizar resumos
      setTotalBalance(summaryData.saldoTotal);
      setTotalInvested(summaryData.investimentosTotal);
      setTotalLoaned(summaryData.emprestimosTotal);
      setActiveAlerts(summaryData.alertasAtivos);
      setAverageReturn(summaryData.rentabilidadeMedia);
      setNextPayments(summaryData.proximosVencimentos);
      
      // Gerar posição financeira
      const position = await TreasuryService.generateFinancialPosition(currentUnitId);
      setFinancialPosition(position);
      
    } catch (error) {
      console.error('Erro ao carregar dados da tesouraria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gerar nova projeção
  const handleGenerateForecast = async () => {
    try {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setMonth(today.getMonth() + 1); // Projeção para 1 mês
      
      const forecast = await TreasuryService.generateCashFlowForecast(
        today.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        'MENSAL',
        currentUnitId
      );
      
      setForecasts([...forecasts, forecast]);
      setShowForecastModal(false);
    } catch (error) {
      console.error('Erro ao gerar projeção:', error);
      alert('Erro ao gerar projeção. Tente novamente.');
    }
  };

  // Gerar alertas automaticamente
  const handleGenerateAlerts = async () => {
    try {
      const newAlerts = await TreasuryService.generateTreasuryAlerts(currentUnitId);
      setAlerts([...alerts, ...newAlerts]);
      setActiveAlerts(activeAlerts + newAlerts.length);
    } catch (error) {
      console.error('Erro ao gerar alertas:', error);
    }
  };

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Renderizar aba de Fluxo de Caixa
  const renderCashFlowTab = () => (
    <div className="space-y-6">
      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Entradas</span>
            <ArrowUpRight size={16} />
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(cashFlows.filter(cf => cf.categoria === 'RECEITA').reduce((sum, cf) => sum + cf.valor, 0))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Saídas</span>
            <ArrowDownRight size={16} />
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(cashFlows.filter(cf => cf.categoria === 'DESPESA').reduce((sum, cf) => sum + cf.valor, 0))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Transferências</span>
            <RefreshCcw size={16} />
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(cashFlows.filter(cf => cf.categoria === 'TRANSFERENCIA').reduce((sum, cf) => sum + cf.valor, 0))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Saldo Final</span>
            <Wallet size={16} />
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(totalBalance)}
          </div>
        </div>
      </div>

      {/* Filtros e Ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={cashFlowFilter}
            onChange={(e) => setCashFlowFilter(e.target.value as any)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="ALL">Todos</option>
            <option value="RECEITA">Receitas</option>
            <option value="DESPESA">Despesas</option>
            <option value="TRANSFERENCIA">Transferências</option>
          </select>
          
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="WEEK">Esta Semana</option>
            <option value="MONTH">Este Mês</option>
            <option value="QUARTER">Este Trimestre</option>
            <option value="YEAR">Este Ano</option>
          </select>
        </div>
        
        <button
          onClick={() => setShowNewCashFlowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Novo Lançamento
        </button>
      </div>

      {/* Lista de Fluxo de Caixa */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Movimentações</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Descrição</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Conta</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Valor</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {cashFlows
                .filter(cf => cashFlowFilter === 'ALL' || cf.categoria === cashFlowFilter)
                .slice(0, 10)
                .map(cf => (
                  <tr key={cf.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm">{formatDate(cf.data)}</td>
                    <td className="px-4 py-3 text-sm font-medium">{cf.descricao}</td>
                    <td className="px-4 py-3 text-sm">{cf.categoria}</td>
                    <td className="px-4 py-3 text-sm">{cf.contaOrigem || '-'}</td>
                    <td className={`px-4 py-3 text-sm text-right font-medium ${
                      cf.categoria === 'RECEITA' ? 'text-green-600' : 
                      cf.categoria === 'DESPESA' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {cf.categoria === 'RECEITA' ? '+' : cf.categoria === 'DESPESA' ? '-' : ''}
                      {formatCurrency(cf.valor)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cf.status === 'CONFIRMADO' ? 'bg-green-100 text-green-800' :
                        cf.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cf.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Renderizar aba de Contas
  const renderAccountsTab = () => (
    <div className="space-y-6">
      {/* Resumo das Contas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Saldo Total</span>
            <Wallet size={16} />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Contas Ativas</span>
            <CheckCircle size={16} />
          </div>
          <div className="text-2xl font-bold">{treasuryAccounts.filter(acc => acc.status === 'ATIVA').length}</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Alertas</span>
            <Bell size={16} />
          </div>
          <div className="text-2xl font-bold">{activeAlerts}</div>
        </div>
      </div>

      {/* Lista de Contas */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Contas Bancárias</h3>
          <button
            onClick={() => setShowNewAccountModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={14} />
            Nova Conta
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {treasuryAccounts.map(account => (
            <div key={account.id} className="bg-slate-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900">{account.nome}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  account.status === 'ATIVA' ? 'bg-green-100 text-green-800' :
                  account.status === 'INATIVA' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {account.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Saldo:</span>
                  <span className="font-medium text-slate-900">{formatCurrency(account.saldo)}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Disponível:</span>
                  <span className="font-medium text-green-600">{formatCurrency(account.saldoDisponivel)}</span>
                </div>
                
                {account.saldoBloqueado > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Bloqueado:</span>
                    <span className="font-medium text-red-600">{formatCurrency(account.saldoBloqueado)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Banco:</span>
                  <span className="font-medium text-slate-900">{account.banco}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200">
                <button className="flex-1 px-2 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                  <Eye size={12} className="inline mr-1" />
                  Ver
                </button>
                <button className="flex-1 px-2 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                  <Settings size={12} className="inline mr-1" />
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Renderizar aba de Investimentos
  const renderInvestmentsTab = () => (
    <div className="space-y-6">
      {/* Resumo dos Investimentos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Total Investido</span>
            <TrendingUp size={16} />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Valor Atual</span>
            <DollarSign size={16} />
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(investments.reduce((sum, inv) => sum + inv.valorAtual, 0))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Rentabilidade Média</span>
            <BarChart3 size={16} />
          </div>
          <div className="text-2xl font-bold">{averageReturn.toFixed(2)}%</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Qtd. Investimentos</span>
            <Target size={16} />
          </div>
          <div className="text-2xl font-bold">{investments.length}</div>
        </div>
      </div>

      {/* Lista de Investimentos */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Investimentos</h3>
          <button
            onClick={() => setShowNewInvestmentModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={14} />
            Novo Investimento
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Instituição</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Valor Aplicado</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Valor Atual</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Rentabilidade</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {investments.map(investment => (
                <tr key={investment.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium">{investment.nome}</td>
                  <td className="px-4 py-3 text-sm">{investment.tipo}</td>
                  <td className="px-4 py-3 text-sm">{investment.instituicao}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(investment.valorAplicado)}</td>
                  <td className="px-4 py-3 text-sm text-right">{formatCurrency(investment.valorAtual)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-medium ${
                      TreasuryService.calculateInvestmentReturn(investment) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {TreasuryService.calculateInvestmentReturn(investment).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      investment.status === 'ATIVO' ? 'bg-green-100 text-green-800' :
                      investment.status === 'VENCIDO' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {investment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Renderizar aba de Alertas
  const renderAlertsTab = () => (
    <div className="space-y-6">
      {/* Resumo de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Críticos</span>
            <AlertTriangle size={16} />
          </div>
          <div className="text-2xl font-bold">
            {alerts.filter(a => a.gravidade === 'CRITICA').length}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Altos</span>
            <AlertCircle size={16} />
          </div>
          <div className="text-2xl font-bold">
            {alerts.filter(a => a.gravidade === 'ALTA').length}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Médios</span>
            <Bell size={16} />
          </div>
          <div className="text-2xl font-bold">
            {alerts.filter(a => a.gravidade === 'MEDIA').length}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Baixos</span>
            <CheckCircle size={16} />
          </div>
          <div className="text-2xl font-bold">
            {alerts.filter(a => a.gravidade === 'BAIXA').length}
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Alertas Ativos</h3>
        <button
          onClick={handleGenerateAlerts}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw size={16} />
          Gerar Alertas
        </button>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-slate-900">{alert.titulo}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.gravidade === 'CRITICA' ? 'bg-red-100 text-red-800' :
                    alert.gravidade === 'ALTA' ? 'bg-amber-100 text-amber-800' :
                    alert.gravidade === 'MEDIA' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.gravidade}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.status === 'ATIVO' ? 'bg-red-100 text-red-800' :
                    alert.status === 'RESOLVIDO' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 mb-3">{alert.descricao}</p>
                
                {alert.valor && (
                  <div className="text-sm font-medium text-slate-900 mb-2">
                    Valor: {formatCurrency(alert.valor)}
                  </div>
                )}
                
                {alert.dataLimite && (
                  <div className="text-sm text-slate-600 mb-3">
                    Data Limite: {formatDate(alert.dataLimite)}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {alert.acoesSugeridas.map((acao, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                      {acao}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Eye size={16} />
                </button>
                <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                  <CheckCircle size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestão de Tesouraria</h1>
            <p className="text-sm text-slate-600">Controle financeiro em tempo real</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <RefreshCcw size={16} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {[
          { id: 'cashflow', label: 'Fluxo de Caixa', icon: Activity },
          { id: 'accounts', label: 'Contas', icon: CreditCard },
          { id: 'investments', label: 'Investimentos', icon: TrendingUp },
          { id: 'alerts', label: 'Alertas', icon: Bell }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="ml-3 text-slate-600">Carregando...</span>
        </div>
      ) : (
        <>
          {activeTab === 'cashflow' && renderCashFlowTab()}
          {activeTab === 'accounts' && renderAccountsTab()}
          {activeTab === 'investments' && renderInvestmentsTab()}
          {activeTab === 'alerts' && renderAlertsTab()}
        </>
      )}
    </div>
  );
};
