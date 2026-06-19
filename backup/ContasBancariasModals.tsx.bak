/**
 * ============================================================================
 * MODAIS DO CONTROLE DE CAIXA E CONTAS BANCÁRIAS
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Contém os componentes visuais (modais) para:
 * 1. Transferir dinheiro entre contas
 * 2. Ver extrato completo de uma conta
 * 
 * ANALOGIA:
 * ---------
 * São como as janelas que abrem no aplicativo do banco quando você:
 * - Vai fazer uma transferência (TED/DOC/Pix)
 * - Quer ver o extrato da conta
 */

import React, { useState } from 'react';
import { Move, X, Save, DollarSign, Calendar, FileText, ArrowUpRight, ArrowDownRight, CheckCircle } from 'lucide-react';
import { FinancialAccountEnhanced } from '../services/accountService';
import { Transaction } from '../types';

// ============================================================================
// MODAL DE TRANSFERÊNCIA ENTRE CONTAS
// ============================================================================

interface TransferenciaModalProps {
  accounts: FinancialAccountEnhanced[];     // Lista de todas as contas disponíveis
  fromAccountId: string;                    // Conta de origem selecionada
  toAccountId: string;                      // Conta de destino (ainda não selecionada)
  amount: number;                           // Valor da transferência
  description: string;                      // Motivo da transferência
  onClose: () => void;                      // Fechar modal
  onTransfer: () => Promise<void>;          // Realizar transferência
}

/**
 * COMPONENTE DE TRANSFERÊNCIA
 * ===========================
 */
export const TransferenciaModal: React.FC<TransferenciaModalProps> = ({
  accounts,
  fromAccountId,
  toAccountId,
  amount,
  description,
  onClose,
  onTransfer,
}) => {
  // Estados locais do formulário
  const [localFromAccount, setLocalFromAccount] = useState(fromAccountId);
  const [localToAccount, setLocalToAccount] = useState(toAccountId);
  const [localAmount, setLocalAmount] = useState(amount || 0);
  const [localDescription, setLocalDescription] = useState(description || '');
  
  /**
   * REALIZAR TRANSFERÊNCIA
   * ----------------------
   */
  const handleSubmit = async () => {
    // Validações básicas
    
    // 1. Precisa ter conta de origem e destino
    if (!localFromAccount || !localToAccount) {
      alert('Selecione conta de origem e destino!');
      return;
    }
    
    // 2. Contas devem ser diferentes (não pode transferir para si mesma)
    if (localFromAccount === localToAccount) {
      alert('Contas de origem e destino devem ser diferentes!');
      return;
    }
    
    // 3. Valor deve ser positivo
    if (localAmount <= 0) {
      alert('O valor da transferência deve ser maior que zero!');
      return;
    }
    
    // 4. Precisa ter descrição
    if (!localDescription.trim()) {
      alert('Informe o motivo da transferência!');
      return;
    }
    
    // Se passou por todas validações, realiza transferência
    await onTransfer();
  };
  
  /**
   * BUSCAR CONTA PELO ID
   * --------------------
   * Função auxiliar para mostrar nome da conta
   */
  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? account.name : 'Selecione...';
  };
  
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
        
        {/* CABEÇALHO DO MODAL */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md">
              <Move size={20} />
            </div>
            <div>
              <h2 className="font-black uppercase text-sm tracking-tight text-slate-900">
                Transferência Entre Contas
              </h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Movimentação Financeira
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>
        
        {/* CORPO DO MODAL (FORMULÁRIO) */}
        <div className="p-6 space-y-4">
          
          {/* CONTA DE ORIGEM */}
          <div>
            <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
              Conta de Origem (vai sair o dinheiro)
            </label>
            <select
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500"
              value={localFromAccount}
              onChange={(e) => setLocalFromAccount(e.target.value)}
            >
              <option value="">Selecione...</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - Saldo: R$ {account.currentBalance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          
          {/* SETA INDICANDO DIREÇÃO */}
          <div className="flex justify-center">
            <ArrowDownRight size={24} className="text-slate-300" />
          </div>
          
          {/* CONTA DE DESTINO */}
          <div>
            <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
              Conta de Destino (vai receber o dinheiro)
            </label>
            <select
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              value={localToAccount}
              onChange={(e) => setLocalToAccount(e.target.value)}
            >
              <option value="">Selecione...</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - Saldo: R$ {account.currentBalance.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          
          {/* VALOR DA TRANSFERÊNCIA */}
          <div>
            <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
              Valor da Transferência (R$)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-black text-lg text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500"
              value={localAmount}
              onChange={(e) => setLocalAmount(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
          
          {/* DESCRIÇÃO / MOTIVO */}
          <div>
            <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
              Descrição / Motivo
            </label>
            <textarea
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none resize-none"
              rows={3}
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
              placeholder="Ex: Transferência para cobrir despesas do mês..."
            />
          </div>
          
          {/* ALERTA INFORMATIVO */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-[9px] font-medium text-blue-700 leading-relaxed">
              ℹ️ <strong>Atenção:</strong> Esta operação cria DUAS transações automáticas:<br/>
              • Saída na conta de origem<br/>
              • Entrada na conta de destino<br/>
              Os saldos serão atualizados automaticamente.
            </p>
          </div>
        </div>
        
        {/* RODAPÉ COM BOTÕES */}
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-300 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-emerald-700 transition-all flex items-center gap-1.5"
          >
            <Move size={14} /> Transferir
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MODAL DE EXTRATO BANCÁRIO
// ============================================================================

interface ExtratoModalProps {
  accountId: string;              // ID da conta selecionada
  transactions: Transaction[];    // Lista de transações da conta
  onClose: () => void;            // Fechar modal
}

/**
 * COMPONENTE DE EXTRATO
 * =====================
 */
export const ExtratoModal: React.FC<ExtratoModalProps> = ({
  accountId,
  transactions,
  onClose,
}) => {
  // Estado para filtro de período
  const [filterPeriod, setFilterPeriod] = useState<'ALL' | 'MONTH'>('ALL');
  
  /**
   * FILTRAR TRANSAÇÕES POR PERÍODO
   * ------------------------------
   */
  const filteredTransactions = transactions.filter(t => {
    if (filterPeriod === 'MONTH') {
      const now = new Date();
      const transactionDate = new Date(t.date);
      
      // Filtra só deste mês
      return (
        transactionDate.getMonth() === now.getMonth() &&
        transactionDate.getFullYear() === now.getFullYear()
      );
    }
    
    return true;  // Todos
  });
  
  /**
   * CALCULAR TOTAIS
   * ---------------
   */
  const totals = {
    income: filteredTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0),
    expense: filteredTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0),
  };
  
  /**
   * FORMATAR DATA
   * -------------
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  /**
   * FORMATAR MOEDA
   * --------------
   */
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* CABEÇALHO */}
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="font-black uppercase text-sm tracking-tight text-slate-900">
                Extrato Bancário
              </h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Histórico de Movimentações
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>
        
        {/* FILTROS */}
        <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterPeriod('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all ${
                filterPeriod === 'ALL'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              Tudo
            </button>
            <button
              onClick={() => setFilterPeriod('MONTH')}
              className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all ${
                filterPeriod === 'MONTH'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              Este Mês
            </button>
          </div>
          
          <div className="text-right">
            <p className="text-[8px] font-black uppercase text-slate-400">Total de Lançamentos</p>
            <p className="text-[10px] font-bold text-slate-700">{filteredTransactions.length}</p>
          </div>
        </div>
        
        {/* CORPO (LISTA DE TRANSAÇÕES) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400 font-medium text-sm">Nenhuma movimentação encontrada</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map(transaction => (
                <div
                  key={transaction.id}
                  className={`p-4 rounded-xl border-l-4 ${
                    transaction.type === 'INCOME'
                      ? 'bg-emerald-50 border-emerald-500'
                      : 'bg-rose-50 border-rose-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {transaction.type === 'INCOME' ? (
                          <ArrowUpRight size={16} className="text-emerald-600" />
                        ) : (
                          <ArrowDownRight size={16} className="text-rose-600" />
                        )}
                        <span className="font-bold text-slate-900 text-xs">
                          {transaction.description}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[9px] text-slate-500 font-medium uppercase">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {formatDate(transaction.date)}
                        </span>
                        <span>•</span>
                        <span>{transaction.category}</span>
                        {transaction.isConciliated && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-indigo-600">
                              <CheckCircle size={10} />
                              Conciliado
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className={`text-right font-black ${
                      transaction.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* RODAPÉ COM TOTAIS */}
        <div className="p-4 border-t bg-slate-50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-[8px] font-black uppercase text-slate-400">Entradas</p>
              <p className="text-lg font-black text-emerald-600">
                {formatCurrency(totals.income)}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-[8px] font-black uppercase text-slate-400">Saídas</p>
              <p className="text-lg font-black text-rose-600">
                {formatCurrency(totals.expense)}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-[8px] font-black uppercase text-slate-400">Saldo do Período</p>
              <p className={`text-lg font-black ${
                totals.income - totals.expense >= 0
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}>
                {formatCurrency(totals.income - totals.expense)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
