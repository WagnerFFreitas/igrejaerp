
import React, { useState, useMemo } from 'react';
import { 
  Plus, ArrowUp, ArrowDown, Download, FileText, CreditCard,
  Landmark, Wallet, TrendingUp, X, Save, DollarSign, Calendar, 
  Search, Filter, RefreshCw, Edit2, Trash2, ShieldCheck, 
  Receipt, User, Printer, Loader2, FileSearch, PieChart,
  Link as LinkIcon, Paperclip, CheckCircle2, AlertCircle, Layers,
  Briefcase, History, CheckCircle, Tag, MoreHorizontal
} from 'lucide-react';
import { Transaction, FinancialAccount, UserAuth, Member } from '../types';
import { COST_CENTERS, OPERATION_NATURES, CHURCH_PROJECTS } from '../constants';
import { dbService } from '../services/databaseService';
import { useAudit } from '../src/hooks/useAudit';

interface FinanceiroProps {
  transactions: Transaction[];
  currentUnitId: string;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  accounts: FinancialAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<FinancialAccount[]>>;
  user?: UserAuth;
  members: Member[];
}

export const Financeiro: React.FC<FinanceiroProps> = ({ transactions, currentUnitId, setTransactions, accounts, setAccounts, user, members }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Hook de auditoria
  const { logAction } = useAudit(user);

  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '', amount: 0, date: new Date().toISOString().split('T')[0], type: 'INCOME', category: 'TITHE', operationNature: 'nat6', costCenter: 'cc1', projectId: '', accountId: accounts[0]?.id || '', status: 'PAID', unitId: currentUnitId, paymentMethod: 'PIX', memberId: '',
    // Campos para parcelamento
    isInstallment: false,  // Se é compra parcelada
    installmentCount: 1,   // Quantidade de parcelas
    installmentNumber: undefined,
    totalInstallments: undefined,
    parentId: undefined,
  });

  const totals = useMemo(() => transactions.reduce((acc, curr) => {
    if (curr.status === 'PAID') {
      if (curr.type === 'INCOME') acc.income += curr.amount;
      else acc.expense += curr.amount;
    } else if (curr.status === 'PENDING') acc.payable += curr.amount;
    return acc;
  }, { income: 0, expense: 0, payable: 0 }), [transactions]);

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    console.log("🚀 Iniciando salvamento da transação financeira...");
    
    if (!formData.description) {
      console.log("❌ Descrição obrigatória não preenchida");
      return alert("A descrição é obrigatória.");
    }
    
    setIsSaving(true);
    
    // Se for dízimo e tiver membro selecionado, atualizar a descrição se estiver vazia ou genérica
    let finalDescription = formData.description;
    if (formData.category === 'TITHE' && formData.memberId) {
      const member = members.find(m => m.id === formData.memberId);
      if (member && (!finalDescription || finalDescription === 'Dízimo')) {
        finalDescription = `Dízimo: ${member.name}`;
      }
    }

    try {
      // VERIFICA SE É PARCELADO
      if (formData.isInstallment && formData.installmentCount && formData.installmentCount > 1) {
        console.log("✅ É parcelado - gerando parcelas...");
        await gerarParcelas(formData);
        
        // Registrar auditoria - verifica se é edição ou criação
        if (editingId) {
          await logAction('UPDATE', 'Transaction', editingId, finalDescription, {
            action: `${user?.name || 'Usuário'} alterou a transação parcelada: ${finalDescription}`,
            type: 'INSTALLMENT_TRANSACTION',
            installmentCount: formData.installmentCount,
            amount: formData.amount
          });
        } else {
          await logAction('CREATE', 'Transaction', formData.id, finalDescription, {
            action: `${user?.name || 'Usuário'} registrou nova transação parcelada: ${finalDescription}`,
            type: 'INSTALLMENT_TRANSACTION',
            installmentCount: formData.installmentCount,
            amount: formData.amount
          });
        }
        
        setIsModalOpen(false); 
        setEditingId(null);
        setIsSaving(false);
        return;
      }

      console.log("📝 Não é parcelado - salvando transação única...");
      const transactionData = { 
        ...formData, 
        description: finalDescription,
        id: editingId || `T${Date.now()}`,
        createdAt: editingId ? formData.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unitId: currentUnitId 
      } as Transaction;

      console.log("📋 Dados da transação preparados:", { 
        id: transactionData.id, 
        description: transactionData.description,
        amount: transactionData.amount,
        type: transactionData.type
      });

      // Salvar no IndexedDB através do databaseService
      console.log("💾 Salvando transação no IndexedDB...");
      const savedId = await dbService.saveTransaction(transactionData);
      console.log("✅ Transação salva com ID:", savedId);

      // Registrar auditoria
      if (editingId) {
        // Se está editando, usa o editingId como ID
        await logAction('UPDATE', 'Transaction', editingId, finalDescription, {
          action: `${user?.name || 'Usuário'} alterou a transação: ${finalDescription}`,
          type: 'SINGLE_TRANSACTION',
          amount: transactionData.amount,
          category: transactionData.category
        });
      } else {
        // Se é novo, usa o savedId
        await logAction('CREATE', 'Transaction', savedId, finalDescription, {
          action: `${user?.name || 'Usuário'} registrou nova transação: ${finalDescription}`,
          type: 'SINGLE_TRANSACTION',
          amount: transactionData.amount,
          category: transactionData.category
        });
      }

      // Atualizar o estado local
      if (editingId) {
        setTransactions(prev => prev.map(t => t.id === editingId ? { ...transactionData, id: savedId } : t));
        console.log("✅ Transação atualizada na lista global");
      } else {
        setTransactions(prev => [{ ...transactionData, id: savedId }, ...prev]);
        console.log("✅ Nova transação adicionada à lista global");
      }

      setIsModalOpen(false); 
      setEditingId(null);
      console.log("🎉 Processo de salvamento finalizado com sucesso!");
      alert("Transação salva com sucesso!");
      
    } catch (error) {
      console.error("❌ Erro ao salvar transação:", error);
      alert("Erro ao salvar transação. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const openModal = (t?: Transaction) => {
    if (t) { 
      setEditingId(t.id); 
      setFormData({ ...t }); 
    } else { 
      setEditingId(null); 
      setFormData({ 
        description: '', amount: 0, date: new Date().toISOString().split('T')[0], 
        type: 'INCOME', category: 'TITHE', operationNature: 'nat6', costCenter: 'cc1', 
        projectId: '', accountId: accounts[0]?.id || '', status: 'PAID', 
        unitId: currentUnitId, paymentMethod: 'PIX', memberId: '',
        isInstallment: false,
        installmentCount: 1,
      }); 
    }
    setIsModalOpen(true);
  };

  /**
   * GERAR PARCELAS DE UMA COMPRA
   * ----------------------------
   * Cria automaticamente N transações (uma para cada parcela)
   * e registra em Contas a Pagar
   */
  const gerarParcelas = async (transactionData: Partial<Transaction>) => {
    console.log("🚀 Iniciando geração de parcelas...");
    
    const numeroParcelas = transactionData.installmentCount || 1;
    const valorTotal = transactionData.amount || 0;
    const valorParcela = valorTotal / numeroParcelas;
    
    // Data base para vencimento da primeira parcela
    const dataBase = new Date(transactionData.dueDate || new Date());
    
    // Array para guardar todas as parcelas
    const parcelas: Transaction[] = [];
    
    try {
      // Gera cada parcela
      for (let i = 1; i <= numeroParcelas; i++) {
        // Calcula vencimento da parcela (mês a mês)
        const vencimentoParcela = new Date(dataBase);
        vencimentoParcela.setMonth(vencimentoParcela.getMonth() + (i - 1));
        
        // Cria transação da parcela
        const parcela: Transaction = {
          ...transactionData,
          id: crypto.randomUUID(),
          description: `${transactionData.description} (${i}/${numeroParcelas})`,
          amount: i === numeroParcelas ? valorTotal - (valorParcela * (numeroParcelas - 1)) : valorParcela, // Última parcela ajusta centavos
          dueDate: vencimentoParcela.toISOString().split('T')[0],
          date: vencimentoParcela.toISOString().split('T')[0],
          status: 'PENDING',
          type: transactionData.type || 'EXPENSE', // Garante valor válido
          category: transactionData.category || 'OUTROS', // Garante valor válido
          costCenter: transactionData.costCenter || 'GERAL', // Garante valor válido
          accountId: transactionData.accountId || '', // Garante valor válido
          operationNature: transactionData.operationNature || 'OUTROS', // Garante valor válido
          // Marca como parcela
          isInstallment: true,
          installmentNumber: i,
          totalInstallments: numeroParcelas,
          parentId: undefined, // Primeira parcela é a principal
          // Campos para controle
          notes: `Parcela ${i} de ${numeroParcelas} - Valor original: R$ ${valorTotal.toFixed(2)}`,
          createdAt: new Date().toISOString(),
          competencyDate: transactionData.competencyDate || new Date().toISOString().split('T')[0], // Garante valor válido
          unitId: currentUnitId,
        };
        
        // Define parent ID para parcelas seguintes
        if (i === 1) {
          // Primeira parcela usa o próprio ID como parent
          parcela.parentId = parcela.id;
        } else {
          // Outras parcelas apontam para primeira
          parcela.parentId = parcelas[0].id;
        }
        
        // Salva cada parcela no IndexedDB
        console.log(`💾 Salvando parcela ${i}/${numeroParcelas}...`);
        const savedId = await dbService.saveTransaction(parcela);
        parcela.id = savedId; // Atualiza com o ID retornado
        
        parcelas.push(parcela);
      }
      
      // Atualiza o estado local com todas as parcelas
      setTransactions([...parcelas, ...transactions]);
      
      console.log(`✅ ${numeroParcelas} parcelas salvas com sucesso!`);
      alert(`${numeroParcelas} parcelas geradas com sucesso!\nValor de cada: R$ ${valorParcela.toFixed(2)}\nTotal: R$ ${valorTotal.toFixed(2)}`);
      
    } catch (error) {
      console.error("❌ Erro ao gerar parcelas:", error);
      alert("Falha ao gerar parcelas. " + (error.message || "Verifique o console para mais detalhes."));
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-16">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none italic font-serif">Tesouraria & ERP Cloud</h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-tighter mt-1">Gestão de Naturezas e Centros de Custo ADJPA v5.0</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsReportModalOpen(true)} className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-300 transition-all flex items-center gap-1.5"><FileSearch size={14}/> Relatórios</button>
          <button onClick={() => openModal()} className="px-5 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-slate-800 transition-all flex items-center gap-1.5"><Plus size={14}/> Novo Lançamento</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {l: 'Receita Realizada', v: totals.income, i: <TrendingUp/>, c: 'emerald'}, 
          {l: 'Despesa Liquidada', v: totals.expense, i: <ArrowDown/>, c: 'rose'}, 
          {l: 'Contas a Pagar', v: totals.payable, i: <History/>, c: 'amber'}
        ].map((s, i) => (
          <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
            <div className={`p-2 rounded-lg bg-${s.c}-50 text-${s.c}-600`}>
              {React.cloneElement(s.i as React.ReactElement<{ size?: number }>, {size: 16})}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.l}</p>
              <p className="text-lg font-black text-slate-900 mt-0.5">R$ {s.v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
          <input type="text" placeholder="Buscar por descrição, fornecedor ou documento..." className="w-full pl-8 pr-4 py-1.5 bg-transparent outline-none text-[12px] text-slate-900 font-medium" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Data / Competência</th>
                <th className="px-4 py-3">Lançamento / Origem</th>
                <th className="px-6 py-3">Natureza / Centro</th>
                <th className="px-6 py-3 text-right">Valor Líquido</th>
                <th className="px-6 py-3 text-center">Situação</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[11px]">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-4 py-2.5">
                    <p className="font-bold text-slate-900 leading-none">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">ID: {t.id.slice(0,5).toUpperCase()}</p>
                  </td>
                  <td className="px-4 py-2.5">
                    <p className="font-bold text-slate-700 leading-none mb-0.5">{t.description}</p>
                    <p className="text-[9px] text-slate-400 font-medium uppercase">
                      {t.category === 'TITHE' && t.memberId ? (
                        <span className="flex items-center gap-1 text-indigo-600 font-black">
                          <User size={10}/> {members.find(m => m.id === t.memberId)?.name || 'Membro'}
                        </span>
                      ) : (
                        t.providerName || 'ADJPA Matriz'
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-2.5">
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-tight leading-none">
                      {OPERATION_NATURES.find(n => n.id === t.operationNature)?.name || 'OUTROS'}
                    </p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">
                      {COST_CENTERS.find(c => c.id === t.costCenter)?.name || 'Geral'}
                    </p>
                  </td>
                  <td className={`px-6 py-2.5 text-right font-black ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-2.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${t.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {t.status === 'PAID' ? 'Liquidado' : 'Em Aberto'}
                    </span>
                  </td>
                  <td className="px-6 py-2.5 text-right text-slate-400">
                    <button onClick={() => openModal(t)} className="hover:text-indigo-600 transition-colors"><Edit2 size={15}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md"><DollarSign size={20}/></div>
                <div>
                   <h2 className="font-black uppercase text-sm tracking-tight text-slate-900">{editingId ? 'Editar Lançamento' : 'Novo Lançamento Contábil'}</h2>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PostgreSQL Cloud Sinc • ERP v5.0</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                   <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Descrição do Lançamento / Histórico</label>
                   <input className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Dízimo do mês, Pagamento de Luz..." />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Valor Bruto (R$)</label>
                  <input type="number" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-black text-xs text-indigo-700" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Data de Lançamento</label>
                  <input type="date" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Tipo de Fluxo</label>
                  <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                    <option value="INCOME">Receita / Arrecadação (+)</option>
                    <option value="EXPENSE">Despesa / Pagamento (-)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Categoria</label>
                  <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} >
                    <option value="TITHE">Dízimo</option>
                    <option value="OFFERING">Oferta</option>
                    <option value="CAMPAIGN">Campanha</option>
                    <option value="UTILITIES">Utilidades (Luz/Água)</option>
                    <option value="SALARY">Salários / RH</option>
                    <option value="MAINTENANCE">Manutenção</option>
                    <option value="OTHER">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Centro de Custo</label>
                  <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none" value={formData.costCenter} onChange={e => setFormData({...formData, costCenter: e.target.value})} >
                    {COST_CENTERS.map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                  </select>
                </div>
              </div>

              {/* OPÇÃO DE PARCELAMENTO (só para DESPESAS) */}
              {formData.type === 'EXPENSE' && (
                <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 animate-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={18} className="text-indigo-600" />
                    <label className="text-[10px] font-black uppercase text-indigo-700 flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={formData.isInstallment} 
                        onChange={e => setFormData({...formData, isInstallment: e.target.checked, installmentCount: e.target.checked ? 2 : 1 })}
                        className="w-4 h-4 accent-indigo-600"
                      />
                      Pagamento Parcelado
                    </label>
                  </div>
                  
                  {formData.isInstallment && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div>
                        <label className="text-[9px] font-black uppercase text-indigo-600 block mb-1">Quantidade de Parcelas</label>
                        <select 
                          className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl font-bold text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                          value={formData.installmentCount}
                          onChange={e => setFormData({...formData, installmentCount: Number(e.target.value)})}
                        >
                          {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                            <option key={n} value={n}>{n}x de R$ {((formData.amount || 0) / n).toFixed(2)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <div className="text-[9px] font-black text-indigo-600 bg-white px-3 py-2 rounded-xl border border-indigo-100 w-full text-center">
                          Valor da Parcela: <br/>
                          <span className="text-lg">R$ {((formData.amount || 0) / (formData.installmentCount || 1)).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-[8px] font-medium text-indigo-600 mt-3 ml-6">
                    ℹ️ Ao marcar esta opção, serão geradas automaticamente {formData.installmentCount} contas a pagar com vencimento mensal.
                  </p>
                </div>
              )}

              {formData.type === 'INCOME' && formData.category === 'TITHE' && (
                <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 animate-in slide-in-from-top-2">
                   <label className="text-[10px] font-black uppercase block mb-2 text-emerald-700 flex items-center gap-2"><User size={14}/> Selecionar Membro (Dizimista)</label>
                   <select 
                    className="w-full px-4 py-2 bg-white border border-emerald-200 rounded-2xl font-bold text-xs outline-none focus:ring-2 focus:ring-emerald-500" 
                    value={formData.memberId} 
                    onChange={e => setFormData({...formData, memberId: e.target.value})}
                   >
                     <option value="">-- Selecione o Membro --</option>
                     {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.ecclesiasticalPosition || 'Membro'})</option>)}
                   </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Conta / Caixa Ativo</label>
                  <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none" value={formData.accountId} onChange={e => setFormData({...formData, accountId: e.target.value})} >
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Natureza da Operação (FISCAL)</label>
                   <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs outline-none" value={formData.operationNature} onChange={e => setFormData({...formData, operationNature: e.target.value})} >
                    {OPERATION_NATURES.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                   </select>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 <div>
                   <label className="text-[10px] font-black uppercase block mb-1 text-slate-400">Fornecedor / Favorecido</label>
                   <input className="w-full px-4 py-2 bg-white border border-slate-200 rounded-2xl font-bold text-xs" value={formData.providerName} onChange={e => setFormData({...formData, providerName: e.target.value})} placeholder="Ex: CPFL, Sabesp, Nome Fornecedor..." />
                 </div>
              </div>
              <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm"><CreditCard size={18}/></div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Meio de Movimentação</p>
                    <p className="text-xs font-bold text-slate-700 mt-1">Sincronização imediata via reconciliação bancária.</p>
                  </div>
                </div>
                <select className="px-4 py-1.5 bg-white border border-indigo-200 rounded-xl font-black text-[10px] uppercase outline-none shadow-sm" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value as any})}>
                  <option value="PIX">PIX</option>
                  <option value="CASH">Dinheiro</option>
                  <option value="CREDIT_CARD">Cartão Corporativo</option>
                </select>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t flex gap-3 shadow-inner">
               <button onClick={() => setIsModalOpen(false)} disabled={isSaving} className="flex-1 py-2.5 font-bold uppercase text-[11px] bg-white border border-slate-200 rounded-2xl hover:bg-slate-100 transition-all disabled:opacity-50">Cancelar</button>
               <button onClick={handleSave} disabled={isSaving} className="flex-2 py-2.5 font-black uppercase text-[11px] bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                 {isSaving ? (
                   <>
                     <Loader2 size={16} className="animate-spin" />
                     Sincronizando...
                   </>
                 ) : (
                   <>
                     <Save size={16}/> Confirmar e Sincronizar ERP
                   </>
                 )}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
