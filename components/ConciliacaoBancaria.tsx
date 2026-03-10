/**
 * ============================================================================
 * COMPONENTE DE CONCILIAÇÃO BANCÁRIA
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Esta é a interface onde o usuário faz a conciliação bancária.
 * Ele mostra:
 * 
 * 1. UPLOAD DE EXTRATO (arquivo OFX)
 * 2. TRANSAÇÕES DO BANCO (importadas)
 * 3. TRANSAÇÕES DO SISTEMA (cadastradas)
 * 4. SUGESTÕES DE MATCH (conciliação automática)
 * 5. CONFERÊNCIA MANUAL (item a item)
 * 6. RESUMO DA CONCILIAÇÃO
 * 
 * ANALOGIA:
 * ---------
 * É como uma "mesa de conferência" onde você tem:
 * - Lado esquerdo: Extrato do banco
 * - Lado direito: Seu sistema
 * - No meio: Você ligando os pares
 */

import React, { useState, useEffect } from 'react';
import { 
  Upload, FileText, CheckCircle, XCircle, AlertTriangle,
  Search, Filter, Eye, Link as LinkIcon, Unlink, RefreshCcw,
  TrendingUp, DollarSign, Calendar, MoreVertical, Download
} from 'lucide-react';
import { importacaoExtratoService, ImportResult } from '../services/importacaoExtratoService';
import { motorConciliacao, ReconciliationResult, MatchSuggestion } from '../services/motorConciliacao';
import { Transaction } from '../types';

/**
 * PROPRIEDADES DO COMPONENTE
 * ==========================
 */
interface ConciliacaoBancariaProps {
  currentUnitId: string;
  accounts?: any[];  // Lista de contas bancárias
  transactions?: Transaction[];  // Transações do sistema
}

/**
 * ESTADO PARA ARQUIVO
 * ===================
 */
interface FileState {
  name: string;
  size: number;
  uploadedAt: Date;
}

/**
 * COMPONENTE PRINCIPAL
 * ====================
 */
export const ConciliacaoBancaria: React.FC<ConciliacaoBancariaProps> = ({ 
  currentUnitId,
  accounts = [],
  transactions = []
}) => {
  
  /**
   * ESTADOS DO REACT
   * ================
   */
  
  // Arquivo selecionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileState, setFileState] = useState<FileState | null>(null);
  
  // Conta bancária selecionada
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  
  // Resultado da importação
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  
  // Resultado da conciliação
  const [reconciliation, setReconciliation] = useState<ReconciliationResult | null>(null);
  
  // Loading
  const [isLoading, setIsLoading] = useState(false);
  
  // Filtro de visualização
  const [viewFilter, setViewFilter] = useState<'ALL' | 'CONCILIATED' | 'PENDING' | 'DIVERGENT'>('ALL');
  
  // Busca
  const [searchTerm, setSearchTerm] = useState('');
  
  /**
   * CARREGAR DADOS INICIAIS
   * =======================
   */
  useEffect(() => {
    // Seleciona primeira conta se tiver
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0].id);
    }
  }, [accounts]);
  
  /**
   * MANUSEAR SELEÇÃO DE ARQUIVO
   * ===========================
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Valida extensão
    if (!file.name.toLowerCase().endsWith('.ofx')) {
      alert('Por favor, selecione um arquivo OFX.');
      return;
    }
    
    setSelectedFile(file);
    setFileState({
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
    });
  };
  
  /**
   * IMPORTAR E PROCESSAR ARQUIVO
   * ============================
   */
  const handleImportAndProcess = async () => {
    if (!selectedFile || !selectedAccount) {
      alert('Selecione um arquivo e uma conta bancária!');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 1. Importa arquivo
      const result = await importacaoExtratoService.importStatement(
        selectedFile,
        selectedAccount,
        currentUnitId,
        transactions
      );
      
      if (!result.success || !result.transactions) {
        alert(`Erro ao importar: ${result.error}`);
        setIsLoading(false);
        return;
      }
      
      setImportResult(result);
      
      // 2. Realiza conciliação
      if (result.statement) {
        const reconResult = motorConciliacao.reconcile(
          result.statement.transactions,
          transactions.filter(t => t.accountId === selectedAccount)
        );
        
        setReconciliation(reconResult);
      }
      
      setIsLoading(false);
      
    } catch (error: any) {
      console.error('Erro:', error);
      alert('Erro ao processar arquivo.');
      setIsLoading(false);
    }
  };
  
  /**
   * FILTRAR RESULTADOS
   * ==================
   */
  const getFilteredMatches = (): MatchSuggestion[] => {
    if (!reconciliation) return [];
    
    let matches: MatchSuggestion[] = [];
    
    switch (viewFilter) {
      case 'CONCILIATED':
        matches = reconciliation.conciliated;
        break;
      case 'PENDING':
        matches = [...reconciliation.pendingBank, ...reconciliation.pendingSystem];
        break;
      case 'DIVERGENT':
        matches = reconciliation.divergent;
        break;
      default:
        matches = [
          ...reconciliation.conciliated,
          ...reconciliation.pendingBank,
          ...reconciliation.pendingSystem,
          ...reconciliation.divergent,
        ];
    }
    
    // Aplica busca textual
    if (searchTerm) {
      matches = matches.filter(m => {
        const bankDesc = m.bankTransaction?.name?.toLowerCase() || '';
        const sysDesc = m.systemTransaction?.description?.toLowerCase() || '';
        
        return bankDesc.includes(searchTerm) || sysDesc.includes(searchTerm);
      });
    }
    
    return matches;
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
   * RENDERIZAR SCORE DE CONFIANÇA
   * =============================
   */
  const renderConfidenceScore = (score: number) => {
    const color = score >= 80 ? 'text-emerald-600' :
                  score >= 60 ? 'text-amber-600' : 'text-red-600';
    
    return (
      <div className={`text-xs font-black ${color}`}>
        {score}% confiança
      </div>
    );
  };
  
  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none italic font-serif">
            Conciliação Bancária
          </h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-tighter mt-1">
            Conferência Automática com Extrato OFX v1.0
          </p>
        </div>
        
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-300 transition-all flex items-center gap-1.5"
        >
          <RefreshCcw size={14} /> Reiniciar
        </button>
      </div>
      
      {/* ÁREA DE UPLOAD */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* CONTA BANCÁRIA */}
          <div>
            <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
              Conta Bancária
            </label>
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione...</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* UPLOAD DE ARQUIVO */}
          <div className="md:col-span-2">
            <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
              Extrato Bancário (OFX)
            </label>
            <div className="flex gap-2">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept=".ofx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2">
                  <Upload size={16} />
                  {selectedFile ? selectedFile.name : 'Selecionar arquivo OFX...'}
                </div>
              </label>
              
              <button
                onClick={handleImportAndProcess}
                disabled={!selectedFile || !selectedAccount || isLoading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCcw size={16} className="animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    <FileText size={16} /> Importar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* INFORMAÇÕES DO ARQUIVO */}
        {fileState && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex items-start gap-3">
              <FileText size={20} className="text-indigo-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-xs">{fileState.name}</p>
                <div className="flex gap-4 mt-1 text-[9px] text-slate-500 font-medium uppercase">
                  <span>Tamanho: {(fileState.size / 1024).toFixed(2)} KB</span>
                  <span>Enviado: {fileState.uploadedAt.toLocaleTimeString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* RESUMO DA CONCILIAÇÃO */}
      {reconciliation && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* TOTAL BANCO */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase opacity-90">Trans. Banco</span>
              <TrendingUp size={20} className="opacity-75" />
            </div>
            <div className="text-3xl font-black">
              {reconciliation.totalBankTransactions}
            </div>
            <div className="text-[9px] font-medium opacity-75 mt-1">
              Importadas do extrato
            </div>
          </div>
          
          {/* CONCILIADAS */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase opacity-90">Conciliadas</span>
              <CheckCircle size={20} className="opacity-75" />
            </div>
            <div className="text-3xl font-black">
              {reconciliation.conciliated.length}
            </div>
            <div className="text-[9px] font-medium opacity-75 mt-1">
              {reconciliation.conciliationRate.toFixed(1)}% sucesso
            </div>
          </div>
          
          {/* PENDENTES */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase opacity-90">Pendentes</span>
              <AlertTriangle size={20} className="opacity-75" />
            </div>
            <div className="text-3xl font-black">
              {reconciliation.pendingBank.length + reconciliation.pendingSystem.length}
            </div>
            <div className="text-[9px] font-medium opacity-75 mt-1">
              Requer conferência
            </div>
          </div>
          
          {/* DIVERGENTES */}
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase opacity-90">Divergentes</span>
              <XCircle size={20} className="opacity-75" />
            </div>
            <div className="text-3xl font-black">
              {reconciliation.divergent.length}
            </div>
            <div className="text-[9px] font-medium opacity-75 mt-1">
              Valores/datas diferentes
            </div>
          </div>
        </div>
      )}
      
      {/* FILTROS E BUSCA */}
      {reconciliation && (
        <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Buscar transação..."
                className="w-full pl-8 pr-4 py-1.5 bg-transparent outline-none text-[12px] text-slate-900 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              value={viewFilter}
              onChange={(e) => setViewFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-100 rounded-lg font-bold text-[10px] uppercase outline-none"
            >
              <option value="ALL">Todas</option>
              <option value="CONCILIATED">Conciliadas</option>
              <option value="PENDING">Pendentes</option>
              <option value="DIVERGENT">Divergentes</option>
            </select>
          </div>
        </div>
      )}
      
      {/* LISTA DE TRANSAÇÕES */}
      {reconciliation && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50/30">
            <h3 className="font-black text-slate-900 text-xs uppercase">
              Transações ({getFilteredMatches().length})
            </h3>
          </div>
          
          <div className="divide-y divide-slate-50 max-h-[60vh] overflow-y-auto">
            {getFilteredMatches().map((match, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50/50 transition-all">
                
                {/* TRANSACÃO DO BANCO */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-xs">
                      {match.bankTransaction?.name || 'Sem descrição'}
                    </p>
                    <div className="flex gap-3 mt-1 text-[9px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(match.bankTransaction?.date || '').toLocaleDateString('pt-BR')}
                      </span>
                      <span className={`font-black ${
                        match.bankTransaction?.type === 'CREDIT' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {match.bankTransaction?.type === 'CREDIT' ? '+' : '-'}
                        {formatCurrency(Math.abs(match.bankTransaction?.amount || 0))}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* TRANSACÃO DO SISTEMA (se tiver) */}
                {match.systemTransaction && (
                  <div className="flex items-start gap-3 ml-11">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                      <LinkIcon size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-xs">
                        {match.systemTransaction.description}
                      </p>
                      <div className="flex gap-3 mt-1 text-[9px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(match.systemTransaction.date).toLocaleDateString('pt-BR')}
                        </span>
                        <span className={`font-black ${
                          match.systemTransaction.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(match.systemTransaction.amount)}
                        </span>
                      </div>
                    </div>
                    
                    {/* SCORE DE CONFIANÇA */}
                    {renderConfidenceScore(match.confidenceScore)}
                  </div>
                )}
                
                {/* MOTIVOS DO MATCH */}
                {match.matchReasons.length > 0 && (
                  <div className="ml-11 mt-2 space-y-1">
                    {match.matchReasons.map((reason, i) => (
                      <p key={i} className="text-[8px] text-slate-500 font-medium">
                        {reason}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
