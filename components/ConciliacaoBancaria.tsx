/**
 * ============================================================================
 * CONCILIACAOBANCARIA.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para conciliacao bancaria.
 *
 * ONDE É USADO?
 * -------------
 * Usado na interface React como parte do frontend.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */

import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle, XCircle, AlertTriangle,
  Search, Filter, Eye, Link as LinkIcon, Unlink, RefreshCcw,
  TrendingUp, DollarSign, Calendar, MoreVertical, Download,
  Plus, BarChart3, AlertCircle, Clock, Settings, Play, User
} from 'lucide-react';
import BankReconciliationService from '../services/bankReconciliationService';
import { accountService } from '../services/accountService';
import { 
  BankReconciliation, 
  BankTransaction, 
  BankAccount, 
  BankDiscrepancy,
  ReconciliationReport 
} from '../types';

interface ConciliacaoBancariaProps {
  currentUnitId: string;
  accounts?: BankAccount[];
  user?: any;
}

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (conciliacao bancaria).
 */

export const ConciliacaoBancaria: React.FC<ConciliacaoBancariaProps> = ({ 
  currentUnitId,
  accounts: propAccounts = [],
  user
}) => {
  
  const [activeTab, setActiveTab] = useState<'reconciliation' | 'transactions' | 'discrepancies' | 'reports'>('reconciliation');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reconciliations, setReconciliations] = useState<BankReconciliation[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [discrepancies, setDiscrepancies] = useState<BankDiscrepancy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  // Contas reais do banco
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);

  // Formata data ISO para dd/mm/yyyy sem erro de fuso
  const fmtDate = (d?: string | null) => {
    if (!d) return '—';
    const s = typeof d === 'string' ? d.split('T')[0] : d;
    const [y, m, day] = s.split('-');
    return `${day}/${m}/${y}`;
  };
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [loadedReconciliations, loadedAccounts] = await Promise.all([
          BankReconciliationService.getReconciliations(currentUnitId),
          accountService.getAccounts(currentUnitId),
        ]);
        setReconciliations(loadedReconciliations);
        // Usa contas reais do banco; fallback para props se vier vazio
        setBankAccounts(loadedAccounts.length > 0 ? loadedAccounts : propAccounts);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentUnitId]);

  /**
   * FUNÇÕES
   * ========
   */

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      if (selectedAccount) {
        try {
          setIsLoading(true);
          const result = await BankReconciliationService.importBankStatement(
            selectedAccount,
            file,
            currentUnitId
          );
          
          // Recarregar transações
          const updatedTransactions = await BankReconciliationService.getTransactionsByAccount(
            selectedAccount,
            currentUnitId
          );
          setTransactions(updatedTransactions);
          
          alert('Arquivo importado com sucesso!');
        } catch (error) {
          console.error('Erro ao importar arquivo:', error);
          alert('Erro ao importar arquivo. Tente novamente.');
        } finally {
          setIsLoading(false);
        }
      } else {
        alert('Selecione uma conta bancária primeiro.');
      }
    }
  };

  const handleReconcile = async () => {
    if (!selectedAccount) {
      alert('Selecione uma conta bancária.');
      return;
    }

    try {
      setIsReconciling(true);
      const result = await BankReconciliationService.executeReconciliation(
        selectedAccount,
        startDate,
        endDate,
        currentUnitId
      );
      
      // Recarregar dados
      const updatedReconciliations = await BankReconciliationService.getReconciliations(currentUnitId);
      setReconciliations(updatedReconciliations);
      
      alert('Conciliação executada com sucesso!');
    } catch (error) {
      console.error('Erro ao executar conciliação:', error);
      alert('Erro ao executar conciliação. Tente novamente.');
    } finally {
      setIsReconciling(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONCILIATED': return 'text-emerald-600 bg-emerald-50';
      case 'DISCREPANCY': return 'text-amber-600 bg-amber-50';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-50';
      case 'APPROVED': return 'text-green-600 bg-green-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONCILIATED': return 'Conciliado';
      case 'DISCREPANCY': return 'Com Divergência';
      case 'IN_PROGRESS': return 'Em Andamento';
      case 'APPROVED': return 'Aprovado';
      default: return status;
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Conciliação Bancária</h1>
            <p className="text-sm text-slate-600">Importe extratos e concilie transações automaticamente</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleReconcile}
            disabled={isReconciling || !selectedAccount}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={16} />
            {isReconciling ? 'Conciliando...' : 'Executar Conciliação'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {[
          { id: 'reconciliation', label: 'Conciliação', icon: BarChart3 },
          { id: 'transactions', label: 'Transações', icon: FileText },
          { id: 'discrepancies', label: 'Divergências', icon: AlertCircle },
          { id: 'reports', label: 'Relatórios', icon: Download }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma conta bancária</option>
            {bankAccounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} {acc.bankCode ? `— ${acc.bankCode}` : ''} (R$ {parseFloat(acc.currentBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="relative">
          <input
            type="file"
            accept=".ofx,.csv,.xlsx,.pdf"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <Upload size={16} />
            Importar Extrato
          </label>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-4">
          {reconciliations.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma conciliação encontrada</h3>
              <p className="text-sm">Importe extratos e execute a conciliação para começar.</p>
            </div>
          ) : (
            reconciliations.map(reconciliation => (
              <div key={reconciliation.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {reconciliation.bankAccountName || (reconciliation as any).bank_account_name || (reconciliation as any).bank_name || 'Conciliação Bancária'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reconciliation.status)}`}>
                        {getStatusLabel(reconciliation.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{fmtDate(reconciliation.dataInicio || (reconciliation as any).data_inicio)} — {fmtDate(reconciliation.dataFim || (reconciliation as any).data_fim)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{reconciliation.conciliadoPorNome || (reconciliation as any).conciliado_por || 'Sistema'}</span>
                      </div>
                    </div>
                    
                    {/* Métricas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Saldo Inicial</p>
                        <p className="text-lg font-bold text-slate-900">{formatCurrency(parseFloat(reconciliation.saldoInicial || (reconciliation as any).saldo_inicial || 0))}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Saldo Final</p>
                        <p className="text-lg font-bold text-slate-900">{formatCurrency(parseFloat(reconciliation.saldoFinal || (reconciliation as any).saldo_final || 0))}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 mb-1">Conciliado</p>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(parseFloat(reconciliation.saldoConciliado || (reconciliation as any).saldo_conciliado || 0))}</p>
                      </div>
                      <div className={`${(reconciliation.diferenca || (reconciliation as any).diferenca || 0) === 0 ? 'bg-emerald-50' : 'bg-amber-50'} p-3 rounded-lg`}>
                        <p className={`text-xs ${(reconciliation.diferenca || (reconciliation as any).diferenca || 0) === 0 ? 'text-emerald-600' : 'text-amber-600'} mb-1`}>Diferença</p>
                        <p className={`text-lg font-bold ${(reconciliation.diferenca || (reconciliation as any).diferenca || 0) === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {formatCurrency(Math.abs(parseFloat(reconciliation.diferenca || (reconciliation as any).diferenca || 0)))}
                        </p>
                      </div>
                    </div>
                    
                    {/* Progresso */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">Taxa de Conciliação</span>
                        <span className="text-sm font-bold text-blue-600">{parseFloat(reconciliation.percentualConciliacao || (reconciliation as any).percentual_conciliacao || 0).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: `${parseFloat(reconciliation.percentualConciliacao || (reconciliation as any).percentual_conciliacao || 0)}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Estatísticas */}
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{reconciliation.transacoesConciliadas || (reconciliation as any).transacoes_conciliadas || 0} conciliadas</span>
                      <span>•</span>
                      <span>{reconciliation.transacoesNaoConciliadas || (reconciliation as any).transacoes_nao_conciliadas || 0} não conciliadas</span>
                      <span>•</span>
                      <span>{(reconciliation.divergencias || (reconciliation as any).divergencias || []).length} divergências</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma transação encontrada</h3>
              <p className="text-sm">Importe extratos bancários para visualizar as transações.</p>
            </div>
          ) : (
            transactions.map(transaction => (
              <div key={transaction.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900">{transaction.descricao}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.statusConciliacao === 'CONCILIATED' ? 'text-emerald-600 bg-emerald-50' :
                        'text-amber-600 bg-amber-50'
                      }`}>
                        {transaction.statusConciliacao === 'CONCILIATED' && 'Conciliado'}
                        {transaction.statusConciliacao === 'NOT_CONCILIATED' && 'Pendente'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.tipo === 'CREDIT' ? 'text-emerald-600 bg-emerald-50' :
                        'text-red-600 bg-red-50'
                      }`}>
                        {transaction.tipo === 'CREDIT' && 'Crédito'}
                        {transaction.tipo === 'DEBIT' && 'Débito'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(transaction.dataTransacao).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        <span>{transaction.categoria}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings size={14} />
                        <span>{transaction.metodoPagamento}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.tipo === 'CREDIT' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.tipo === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.valor)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'discrepancies' && (
        <div className="space-y-4">
          {discrepancies.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma divergência encontrada</h3>
              <p className="text-sm">Ótimo! Todas as transações estão conciliadas.</p>
            </div>
          ) : (
            discrepancies.map(discrepancy => (
              <div key={discrepancy.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900">{discrepancy.descricao}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        discrepancy.gravidade === 'CRITICAL' ? 'text-red-600 bg-red-50' :
                        discrepancy.gravidade === 'HIGH' ? 'text-orange-600 bg-orange-50' :
                        discrepancy.gravidade === 'MEDIUM' ? 'text-amber-600 bg-amber-50' :
                        'text-blue-600 bg-blue-50'
                      }`}>
                        {discrepancy.gravidade === 'CRITICAL' && 'Crítico'}
                        {discrepancy.gravidade === 'HIGH' && 'Alto'}
                        {discrepancy.gravidade === 'MEDIUM' && 'Médio'}
                        {discrepancy.gravidade === 'LOW' && 'Baixo'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        discrepancy.status === 'OPEN' ? 'text-amber-600 bg-amber-50' :
                        discrepancy.status === 'INVESTIGATING' ? 'text-blue-600 bg-blue-50' :
                        discrepancy.status === 'RESOLVED' ? 'text-emerald-600 bg-emerald-50' :
                        'text-slate-600 bg-slate-50'
                      }`}>
                        {discrepancy.status === 'OPEN' && 'Aberto'}
                        {discrepancy.status === 'INVESTIGATING' && 'Investigando'}
                        {discrepancy.status === 'RESOLVED' && 'Resolvido'}
                        {discrepancy.status === 'IGNORED' && 'Ignorado'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                      <div className="flex items-center gap-1">
                        <AlertCircle size={14} />
                        <span>{discrepancy.tipo}</span>
                      </div>
                      {discrepancy.valorDiferenca && (
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} />
                          <span>{formatCurrency(discrepancy.valorDiferenca)}</span>
                        </div>
                      )}
                      {discrepancy.dataEsperada && (
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(discrepancy.dataEsperada).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="text-center py-12 text-slate-500">
          <Download className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold mb-2">Relatórios em Desenvolvimento</h3>
          <p className="text-sm">Relatórios analíticos de conciliação serão implementados em breve.</p>
        </div>
      )}
    </div>
  );
};
