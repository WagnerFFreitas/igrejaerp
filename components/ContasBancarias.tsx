/**
 * ============================================================================
 * COMPONENTE DE CONTROLE DE CAIXA E CONTAS BANCÁRIAS
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este é o painel principal onde o usuário gerencia TODO o dinheiro da igreja.
 * Ele mostra:
 * 
 * 1. SALDO GERAL (quanto a igreja tem no total)
 * 2. SALDO POR CONTA (caixa físico, banco 1, banco 2, etc.)
 * 3. MOVIMENTAÇÕES (depósitos, saques, transferências)
 * 4. EXTRATO DE CADA CONTA
 * 5. CONCILIAÇÃO BANCÁRIA
 * 
 * COMO FUNCIONA?
 * --------------
 * Imagine um aplicativo de banco digital:
 * - Mostra seu saldo na conta corrente
 * - Mostra saldo na poupança
 * - Extrato com todas movimentações
 * - Opção de transferir entre contas
 * 
 * É exatamente isso que este componente faz, mas para a igreja!
 */

import React, { useState, useEffect } from 'react';
import { 
  Wallet, Building2, ArrowUpRight, ArrowDownRight, RefreshCcw,
  Plus, Download, Upload, Eye, CheckCircle, AlertTriangle,
  TrendingUp, DollarSign, Calendar, Search, Filter, MoreVertical,
  Landmark, PiggyBank, CreditCard, Move, FileText, X, Save
} from 'lucide-react';
import { FinancialAccountEnhanced, AccountService, accountService } from '../services/accountService';
import { Transaction } from '../types';
import { POPULAR_BANKS, ACCOUNT_TYPES } from '../constants/banks';

/**
 * PROPRIEDADES DO COMPONENTE
 * ==========================
 * O que este componente precisa receber para funcionar
 */
interface ContasBancariasProps {
  currentUnitId: string;        // ID da unidade/filial da igreja
  onTransactionAdded?: () => void;  // Função para avisar quando criar transação
}

/**
 * ESTADO PARA MODAL DE TRANSFERÊNCIA
 * ===================================
 * Dados para abrir modal de transferência entre contas
 */
interface TransferModalData {
  isOpen: boolean;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
}

/**
 * COMPONENTE PRINCIPAL
 * ====================
 */
export const ContasBancarias: React.FC<ContasBancariasProps> = ({ 
  currentUnitId, 
  onTransactionAdded 
}) => {
  
  /**
   * ESTADOS DO REACT (useState)
   * ===========================
   * 
   * O QUE SÃO?
   * Variáveis que, quando mudam, fazem a tela atualizar automaticamente.
   * 
   * ANALOGIA:
   * Pense como "variáveis mágicas" que atualizam a tela sozinhas.
   * Toda vez que você usa setSomething(newValue), o React redesenha a tela.
   */
  
  // Lista de todas as contas (caixa + bancos)
  const [accounts, setAccounts] = useState<FinancialAccountEnhanced[]>([]);
  
  // Conta selecionada para ver extrato
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  
  // Extrato da conta selecionada
  const [accountStatement, setAccountStatement] = useState<Transaction[]>([]);
  
  // Saldo consolidado (total geral)
  const [consolidatedBalance, setConsolidatedBalance] = useState<{
    total: number;
    cash: number;
    bank: number;
    byAccount: any[];
  } | null>(null);
  
  // Loading (carregando dados)
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal de nova conta
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  
  // ID da conta sendo editada
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [accountDraft, setAccountDraft] = useState<Partial<FinancialAccountEnhanced> | null>(null);
  
  // Modal de transferência
  const [transferModal, setTransferModal] = useState<TransferModalData>({
    isOpen: false,
    fromAccountId: '',
    toAccountId: '',
    amount: 0,
    description: '',
  });
  
  // Busca textual
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtro por tipo de conta
  const [filterType, setFilterType] = useState<'ALL' | 'CASH' | 'BANK'>('ALL');
  
  /**
   * EFEITO COLATERAL (useEffect)
   * =============================
   * 
   * O QUE É?
   * Código que roda automaticamente quando algo acontece:
   * - Quando componente carrega pela primeira vez
   * - Quando uma variável específica muda
   * 
   * ANALOGIA:
   * É como um "alarme" que dispara quando algo específico acontece.
   */
  
  // Carregar dados ao iniciar
  useEffect(() => {
    carregarDados();
  }, []);  // [] = roda só uma vez, quando monta
  
  /**
   * CARREGAR DADOS DO BANCO
   * =======================
   * Busca todas as contas e saldos
   */
  const carregarDados = async () => {
    try {
      setIsLoading(true);
      
      // Busca contas
      const allAccounts = await accountService.getAccounts(currentUnitId);
      setAccounts(allAccounts);
      
      // Busca saldo consolidado
      const consolidated = await accountService.getConsolidatedBalance();
      setConsolidatedBalance(consolidated);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados das contas.');
      setIsLoading(false);
    }
  };
  
  /**
   * FILTRAR CONTAS
   * ==============
   * Aplica filtros de busca e tipo
   */
  const filteredAccounts = accounts.filter(account => {
    // Filtro por tipo
    if (filterType !== 'ALL' && account.accountType !== filterType) {
      return false;
    }
    
    // Filtro por busca
    if (searchTerm && !account.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  /**
   * ABRIR MODAL DE NOVA CONTA
   * =========================
   */
  const handleOpenNewAccount = () => {
    setEditingAccountId(null);
    setAccountDraft(null);
    setIsAccountModalOpen(true);
  };
  
  /**
   * SALVAR NOVA CONTA
   * =================
   */
  const handleSaveAccount = async (formData: Partial<FinancialAccountEnhanced>) => {
    try {
      const payload = {
        ...formData,
        unitId: currentUnitId,
        isActive: true,
        isDefault: false,
      };

      await accountService.saveAccount(payload);
      
      alert(editingAccountId ? 'Conta atualizada com sucesso!' : 'Conta criada com sucesso!');
      setIsAccountModalOpen(false);
      setEditingAccountId(null);
      setAccountDraft(null);
      carregarDados();  // Recarrega lista
      
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
      alert('Erro ao salvar conta.');
    }
  };
  
  /**
   * REALIZAR TRANSFERÊNCIA
   * ======================
   */
  const handleTransfer = async () => {
    try {
      if (!transferModal.fromAccountId || !transferModal.toAccountId) {
        alert('Selecione conta de origem e destino!');
        return;
      }
      
      if (transferModal.amount <= 0) {
        alert('Valor deve ser maior que zero!');
        return;
      }
      
      // Realiza transferência
      await accountService.transferBetweenAccounts(
        transferModal.fromAccountId,
        transferModal.toAccountId,
        transferModal.amount,
        transferModal.description
      );
      
      alert('Transferência realizada com sucesso!');
      setTransferModal({ ...transferModal, isOpen: false });
      carregarDados();
      
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error: any) {
      console.error('Erro na transferência:', error);
      alert(error.message || 'Erro ao realizar transferência.');
    }
  };
  
  /**
   * VER EXTRATO DA CONTA
   * ====================
   */
  const handleViewStatement = async (accountId: string) => {
    try {
      setSelectedAccount(accountId);
      const statement = await accountService.getAccountStatement(accountId);
      setAccountStatement(statement);
    } catch (error) {
      console.error('Erro ao buscar extrato:', error);
      alert('Erro ao carregar extrato.');
    }
  };
  
  /**
   * EDITAR CONTA
   * =============
   */
  const handleEditAccount = (account: FinancialAccountEnhanced) => {
    setAccountDraft({
      name: account.name,
      accountType: account.accountType,
      type: account.type,
      bankCode: account.bankCode,
      bankName: account.bankName,
      agencyNumber: account.agencyNumber,
      accountNumber: account.accountNumber,
      currentBalance: account.currentBalance,
      minimumBalance: account.minimumBalance,
      status: account.status,
      isActive: account.isActive
    });
    setEditingAccountId(account.id);
    setIsAccountModalOpen(true);
  };
  
  /**
   * EXCLUIR CONTA
   * ==============
   */
  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      await accountService.deleteAccount(accountId);
      await carregarDados();
      alert('Conta excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta.');
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
   * RENDERIZAÇÃO (JSX)
   * ==================
   * Como a tela vai aparecer para o usuário
   */
  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none italic font-serif">
            Controle de Caixa & Contas Bancárias
          </h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-tighter mt-1">
            Gestão Financeira Integrada v2.0
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={carregarDados}
            className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-300 transition-all flex items-center gap-1.5"
          >
            <RefreshCcw size={14} /> Atualizar
          </button>
          
          <button
            onClick={handleOpenNewAccount}
            className="px-5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <Plus size={14} /> Nova Conta
          </button>
        </div>
      </div>
      
      {/* CARDS DE RESUMO GERAL */}
      {consolidatedBalance && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SALDO TOTAL */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase opacity-90">Saldo Total Geral</span>
              <Wallet size={20} className="opacity-75" />
            </div>
            <div className="text-3xl font-black">
              {formatCurrency(consolidatedBalance.total)}
            </div>
            <div className="text-[9px] font-medium opacity-75 mt-1">
              Em todas as contas
            </div>
          </div>
          
          {/* TOTAL EM CAIXA (ESPÉCIE) */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase opacity-90">Em Espécie (Caixa)</span>
              <PiggyBank size={20} className="opacity-75" />
            </div>
            <div className="text-3xl font-black">
              {formatCurrency(consolidatedBalance.cash)}
            </div>
            <div className="text-[9px] font-medium opacity-75 mt-1">
              Dinheiro vivo nas igrejas
            </div>
          </div>
          
          {/* TOTAL EM BANCOS */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase opacity-90">Em Bancos</span>
              <Building2 size={20} className="opacity-75" />
            </div>
            <div className="text-3xl font-black">
              {formatCurrency(consolidatedBalance.bank)}
            </div>
            <div className="text-[9px] font-medium opacity-75 mt-1">
              Contas correntes e aplicações
            </div>
          </div>
        </div>
      )}
      
      {/* FILTROS E BUSCA */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Buscar conta..."
              className="w-full pl-8 pr-4 py-1.5 bg-transparent outline-none text-[12px] text-slate-900 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-100 rounded-lg font-bold text-[10px] uppercase outline-none"
          >
            <option value="ALL">Todas</option>
            <option value="CASH">Caixa</option>
            <option value="BANK">Bancos</option>
          </select>
        </div>
      </div>
      
      {/* LISTA DE CONTAS */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Nome da Conta</th>
                <th className="px-6 py-3 text-right">Saldo Atual</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[11px]">
              {filteredAccounts.map(account => (
                <tr key={account.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-4 py-3">
                    {account.accountType === 'CASH' ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg font-black text-[9px] uppercase">
                        <PiggyBank size={12} /> Caixa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-black text-[9px] uppercase">
                        <Building2 size={12} /> Banco
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold text-slate-900 leading-none">{account.name}</p>
                      {account.accountNumber && (
                        <p className="text-[8px] text-slate-400 font-medium uppercase mt-1">
                          Conta: {account.accountNumber}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className={`px-6 py-3 text-right font-black ${
                    account.currentBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {formatCurrency(account.currentBalance)}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {account.isActive ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg font-black text-[9px] uppercase">
                        Ativa
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded-lg font-black text-[9px] uppercase">
                        Inativa
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewStatement(account.id)}
                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Ver Extrato"
                      >
                        <FileText size={15} />
                      </button>
                      
                      <button
                        onClick={() => setTransferModal({
                          ...transferModal,
                          isOpen: true,
                          fromAccountId: account.id,
                        })}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Transferir"
                      >
                        <Move size={15} />
                      </button>
                      
                      <button
                        onClick={() => handleEditAccount(account)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                        title="Editar Conta"
                      >
                        <RefreshCcw size={15} />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Excluir Conta"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* MODAL DE NOVA CONTA */}
      {isAccountModalOpen && (
        <NovaContaModal
          initialData={accountDraft || undefined}
          onClose={() => {
            setIsAccountModalOpen(false);
            setEditingAccountId(null);
            setAccountDraft(null);
          }}
          onSave={handleSaveAccount}
        />
      )}
      
      {/* MODAL DE TRANSFERÊNCIA - Comentado até implementação */}
      {/* {transferModal.isOpen && (
        <TransferenciaModal
          accounts={accounts}
          fromAccountId={transferModal.fromAccountId}
          toAccountId={transferModal.toAccountId}
          amount={transferModal.amount}
          description={transferModal.description}
          onClose={() => setTransferModal({ ...transferModal, isOpen: false })}
          onTransfer={handleTransfer}
        />
      )} */}
      
      {/* MODAL DE EXTRATO - Comentado até implementação */}
      {/* {selectedAccount && (
        <ExtratoModal
          accountId={selectedAccount}
          transactions={accountStatement}
          onClose={() => {
            setSelectedAccount(null);
            setAccountStatement([]);
          }}
        />
      )} */}
    </div>
  );
};

/**
 * MODAL DE NOVA CONTA
 * ===================
 * Formulário para criar nova conta bancária ou caixa
 */
interface NovaContaModalProps {
  initialData?: Partial<FinancialAccountEnhanced>;
  onClose: () => void;
  onSave: (data: Partial<FinancialAccountEnhanced>) => Promise<void>;
}

const NovaContaModal: React.FC<NovaContaModalProps> = ({ initialData, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<FinancialAccountEnhanced>>({
    name: '',
    type: 'BANK',
    accountType: 'BANK',
    currentBalance: 0,
    isActive: true,
    isDefault: false,
    ...initialData,
  });
  
  const handleSubmit = async () => {
    if (!formData.name) {
      alert('Informe o nome da conta!');
      return;
    }
    
    await onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md">
              <Landmark size={20} />
            </div>
            <div>
              <h2 className="font-black uppercase text-sm tracking-tight text-slate-900">
                Nova Conta Bancária
              </h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Cadastro de Contas
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>
        
        {/* Corpo */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
              Nome da Conta
            </label>
            <input
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Caixa Matriz, Conta Corrente Bradesco..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
                Tipo
              </label>
              <select
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none"
                value={formData.accountType}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  accountType: e.target.value as any,
                  type: e.target.value === 'CASH' ? 'CASH' : 'BANK'
                })}
              >
                {ACCOUNT_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            {/* Campo de banco - aparece apenas se não for caixa */}
            {formData.accountType !== 'CASH' && (
              <div>
                <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
                  Banco
                </label>
                <select
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none"
                  value={formData.bankCode || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    bankCode: e.target.value,
                    bankName: POPULAR_BANKS.find(b => b.code === e.target.value)?.name || ''
                  })}
                >
                  <option value="">Selecione um banco...</option>
                  {POPULAR_BANKS.map(bank => (
                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Campos bancários - aparecem apenas se não for caixa */}
          {formData.accountType !== 'CASH' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
                  Agência
                </label>
                <input
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none"
                  value={formData.agencyNumber || ''}
                  onChange={(e) => setFormData({ ...formData, agencyNumber: e.target.value })}
                  placeholder="0000"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
                  Conta
                </label>
                <input
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none"
                  value={formData.accountNumber || ''}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="00000-0"
                />
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
                Saldo Inicial
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none"
                value={formData.currentBalance}
                onChange={(e) => setFormData({ ...formData, currentBalance: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
                Saldo Mínimo
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none"
                value={formData.minimumBalance || ''}
                onChange={(e) => setFormData({ ...formData, minimumBalance: parseFloat(e.target.value) || undefined })}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
                Status
              </label>
              <select
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none"
                value={formData.status || 'ACTIVE'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="ACTIVE">Ativa</option>
                <option value="INACTIVE">Inativa</option>
                <option value="BLOCKED">Bloqueada</option>
              </select>
            </div>
          </div>
          
          {formData.accountType !== 'CASH' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
                  Agência
                </label>
                <input
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none"
                  value={formData.agencyNumber || ''}
                  onChange={(e) => setFormData({ ...formData, agencyNumber: e.target.value })}
                  placeholder="0000"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">
                  Conta
                </label>
                <input
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none"
                  value={formData.accountNumber || ''}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="00000-0"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Rodapé */}
        <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-300 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-indigo-700 transition-all flex items-center gap-1.5"
          >
            <Save size={14} /> Salvar Conta
          </button>
        </div>
      </div>
    </div>
  );
};

// Continue nos próximos arquivos para TransferenciaModal e ExtratoModal...
