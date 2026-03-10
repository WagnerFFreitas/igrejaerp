/**
 * ============================================================================
 * COMPONENTE DE CONTAS A RECEBER
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este é o painel principal onde o usuário gerencia todos os recebimentos
 * da igreja. Ele mostra:
 * 
 * 1. LISTA DE RECEBIMENTOS (dízimos, ofertas, aluguéis, etc.)
 * 2. STATUS DE CADA UM (pendente, vencido, pago, negociando)
 * 3. ALERTAS DE VENCIMENTO (o que está para vencer ou já venceu)
 * 4. OPÇÕES DE COBRANÇA (enviar lembrete, renegociar)
 * 5. HISTÓRICO DE PAGAMENTOS
 * 
 * ANALOGIA:
 * ---------
 * É como um "painel de controle de cobranças" que mostra:
 * - Quem deve
 * - Quanto deve
 * - Quando vence
 * - Se já pagou
 * - Como cobrar
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, Calendar, AlertTriangle, CheckCircle,
  Search, Filter, Plus, Edit2, Trash2, Eye, Bell, FileText,
  X, Save, RefreshCcw, MoreVertical, Mail, Phone, MessageCircle
} from 'lucide-react';
import { ReceivableTransaction, ReceivablesService, receivablesService } from '../services/contasReceberService';
import { PaymentAlert } from '../utils/calculosContasReceber';

/**
 * PROPRIEDADES DO COMPONENTE
 * ==========================
 */
interface ContasReceberProps {
  currentUnitId: string;
  onTransactionAdded?: () => void;
}

/**
 * ESTADO PARA FILTROS
 * ===================
 */
type FilterStatus = 'ALL' | 'PENDING' | 'OVERDUE' | 'PAID' | 'NEGOTIATING';

/**
 * COMPONENTE PRINCIPAL
 * ====================
 */
export const ContasReceber: React.FC<ContasReceberProps> = ({ 
  currentUnitId, 
  onTransactionAdded 
}) => {
  
  /**
   * ESTADOS DO REACT
   * ================
   */
  
  // Lista de todos os recebimentos
  const [receivables, setReceivables] = useState<ReceivableTransaction[]>([]);
  
  // Alertas de vencimento
  const [alerts, setAlerts] = useState<PaymentAlert[]>([]);
  
  // Loading
  const [isLoading, setIsLoading] = useState(true);
  
  // Filtro por status
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  
  // Busca textual
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal de novo recebimento
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Recebimento sendo editado
  const [editingReceivable, setEditingReceivable] = useState<ReceivableTransaction | null>(null);
  
  // Modal de alerta
  const [showAlerts, setShowAlerts] = useState(false);
  
  /**
   * CARREGAR DADOS AO INICIAR
   * =========================
   */
  useEffect(() => {
    carregarDados();
  }, []);
  
  /**
   * CARREGAR DADOS DO BANCO
   * =======================
   */
  const carregarDados = async () => {
    try {
      setIsLoading(true);
      
      // Busca recebimentos
      const allReceivables = await receivablesService.getReceivables(currentUnitId);
      setReceivables(allReceivables);
      
      // Busca alertas
      const paymentAlerts = await receivablesService.getPaymentAlerts(currentUnitId);
      setAlerts(paymentAlerts);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados.');
      setIsLoading(false);
    }
  };
  
  /**
   * FILTRAR RECEBIMENTOS
   * ====================
   */
  const filteredReceivables = receivables.filter(r => {
    // Filtro por status
    if (filterStatus !== 'ALL' && r.receivableStatus !== filterStatus) {
      return false;
    }
    
    // Filtro por busca
    if (searchTerm && !r.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  /**
   * CALCULAR TOTAIS
   * ===============
   */
  const totals = {
    total: receivables.reduce((sum, r) => sum + r.amount, 0),
    pending: receivables.filter(r => r.status === 'PENDING').reduce((sum, r) => sum + r.amount, 0),
    overdue: receivables.filter(r => r.receivableStatus === 'OVERDUE').reduce((sum, r) => sum + r.amount, 0),
    paid: receivables.filter(r => r.status === 'PAID').reduce((sum, r) => sum + r.amount, 0),
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
   * ABRIR MODAL DE NOVO RECEBIMENTO
   * ================================
   */
  const handleOpenNewReceivable = () => {
    setEditingReceivable(null);
    setIsModalOpen(true);
  };
  
  /**
   * SALVAR RECEBIMENTO
   * ==================
   */
  const handleSaveReceivable = async (formData: Partial<ReceivableTransaction>) => {
    try {
      if (editingReceivable) {
        // Atualizar existente
        await receivablesService.updateReceivable(editingReceivable.id, formData);
        alert('Recebimento atualizado com sucesso!');
      } else {
        // Criar novo
        await receivablesService.saveReceivable(formData);
        alert('Recebimento criado com sucesso!');
      }
      
      setIsModalOpen(false);
      setEditingReceivable(null);
      carregarDados();
      
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar recebimento.');
    }
  };
  
  /**
   * REGISTRAR PAGAMENTO
   * ===================
   */
  const handleRegisterPayment = async (receivable: ReceivableTransaction) => {
    try {
      const valorStr = prompt(`Valor a receber (${formatCurrency(receivable.amount)}):`);
      if (!valorStr) return;
      
      const valor = parseFloat(valorStr.replace(',', '.'));
      
      if (isNaN(valor) || valor <= 0) {
        alert('Valor inválido!');
        return;
      }
      
      const methodStr = prompt('Forma de pagamento:\n1 - PIX\n2 - Dinheiro\n3 - Transferência\n4 - Cartão');
      
      const methods = { '1': 'PIX', '2': 'CASH', '3': 'TRANSFER', '4': 'CREDIT_CARD' } as any;
      const method = methods[methodStr || '1'];
      
      if (!method) {
        alert('Forma de pagamento inválida!');
        return;
      }
      
      // Registra pagamento
      const receipt = await receivablesService.registerPayment(
        receivable.id,
        valor,
        method
      );
      
      alert(`Pagamento registrado!\nRecibo: ${receipt.receiptNumber}\nValor: ${formatCurrency(valor)}`);
      
      carregarDados();
    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error);
      alert(error.message || 'Erro ao registrar pagamento.');
    }
  };
  
  /**
   * RENEGOCIAR DÍVIDA
   * =================
   */
  const handleRenegotiate = async (receivable: ReceivableTransaction) => {
    try {
      // Gera proposta
      const proposal = await receivablesService.proposeRenegotiation(receivable.id);
      
      // Mostra proposta
      const mensagem = `
PROPOSTA DE RENEGOCIAÇÃO
========================

Dívida Original: ${formatCurrency(proposal.originalAmount)}
Juros: ${formatCurrency(proposal.interestAmount)}
Multa: ${formatCurrency(proposal.penaltyAmount)}
Desconto à vista: ${formatCurrency(proposal.discountAmount)}

VALOR FINAL À VISTA: ${formatCurrency(proposal.totalAmount)}

Opções de Parcelamento:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
${proposal.installmentOptions.map((opt: any) => 
  `${opt.count}x de ${formatCurrency(opt.installmentValue)}`
).join('\n')}

Deseja aceitar alguma opção?
Digite o número de parcelas (1-${proposal.installmentOptions.length}) ou 0 para cancelar.
      `.trim();
      
      const resposta = prompt(mensagem);
      if (!resposta || resposta === '0') return;
      
      const parcelas = parseInt(resposta);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const opcao = proposal.installmentOptions.find((o: any) => o.count === parcelas);
      
      if (!opcao) {
        alert('Opção inválida!');
        return;
      }
      
      // Aceita proposta
      await receivablesService.acceptRenegotiation(receivable.id, opcao);
      
      alert(`Renegociação aceita!\n${parcelas}x de ${formatCurrency(opcao.installmentValue)}`);
      
      carregarDados();
    } catch (error: any) {
      console.error('Erro na renegociação:', error);
      alert(error.message || 'Erro ao renegociar.');
    }
  };
  
  /**
   * ENVIAR LEMBRETE DE COBRANÇA
   * ===========================
   */
  const handleSendReminder = (receivable: ReceivableTransaction) => {
    // Futuro: Enviar email/SMS/WhatsApp
    const mensagem = `
Lembrete de Pagamento
=====================

Vencimento: ${new Date(receivable.dueDate || '').toLocaleDateString('pt-BR')}
Valor: ${formatCurrency(receivable.amount)}
Descrição: ${receivable.description}

Por favor, regularize seu pagamento.
    `.trim();
    
    alert(`Enviar lembrete para:\n${receivable.debtorEmail || 'Email não cadastrado'}\n\n${mensagem}`);
  };
  
  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none italic font-serif">
            Contas a Receber
          </h1>
          <p className="text-slate-400 font-medium text-[10px] uppercase tracking-tighter mt-1">
            Gestão de Recebimentos e Inadimplência v1.0
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-lg font-bold text-[10px] uppercase hover:bg-amber-200 transition-all flex items-center gap-1.5 relative"
          >
            <Bell size={14} />
            Alertas
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                {alerts.length}
              </span>
            )}
          </button>
          
          <button
            onClick={carregarDados}
            className="px-4 py-1.5 bg-slate-200 text-slate-600 rounded-lg font-bold text-[10px] uppercase hover:bg-slate-300 transition-all flex items-center gap-1.5"
          >
            <RefreshCcw size={14} /> Atualizar
          </button>
          
          <button
            onClick={handleOpenNewReceivable}
            className="px-5 py-1.5 bg-emerald-600 text-white rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-emerald-700 transition-all flex items-center gap-1.5"
          >
            <Plus size={14} /> Novo Recebimento
          </button>
        </div>
      </div>
      
      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* TOTAL GERAL */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase opacity-90">Total Geral</span>
            <TrendingUp size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-black">
            {formatCurrency(totals.total)}
          </div>
          <div className="text-[9px] font-medium opacity-75 mt-1">
            Todos os recebimentos
          </div>
        </div>
        
        {/* PENDENTES */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase opacity-90">Pendentes</span>
            <Calendar size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-black">
            {formatCurrency(totals.pending)}
          </div>
          <div className="text-[9px] font-medium opacity-75 mt-1">
            Aguardando pagamento
          </div>
        </div>
        
        {/* VENCIDOS */}
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase opacity-90">Vencidos</span>
            <AlertTriangle size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-black">
            {formatCurrency(totals.overdue)}
          </div>
          <div className="text-[9px] font-medium opacity-75 mt-1">
            Requer cobrança imediata
          </div>
        </div>
        
        {/* PAGOS */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase opacity-90">Pagos</span>
            <CheckCircle size={20} className="opacity-75" />
          </div>
          <div className="text-3xl font-black">
            {formatCurrency(totals.paid)}
          </div>
          <div className="text-[9px] font-medium opacity-75 mt-1">
            Recebidos com sucesso
          </div>
        </div>
      </div>
      
      {/* FILTROS E BUSCA */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Buscar recebimento..."
              className="w-full pl-8 pr-4 py-1.5 bg-transparent outline-none text-[12px] text-slate-900 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="px-3 py-1.5 bg-slate-100 rounded-lg font-bold text-[10px] uppercase outline-none"
          >
            <option value="ALL">Todos</option>
            <option value="PENDING">Pendentes</option>
            <option value="OVERDUE">Vencidos</option>
            <option value="PAID">Pagos</option>
            <option value="NEGOTIATING">Negociação</option>
          </select>
        </div>
      </div>
      
      {/* LISTA DE RECEBIMENTOS */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50/30 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-4 py-3">Vencimento</th>
                <th className="px-4 py-3">Descrição / Devedor</th>
                <th className="px-6 py-3 text-right">Valor</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[11px]">
              {filteredReceivables.map(receivable => (
                <tr key={receivable.id} className="hover:bg-slate-50/50 transition-all">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900 leading-none">
                      {new Date(receivable.dueDate || '').toLocaleDateString('pt-BR')}
                    </p>
                    {receivable.receivableStatus === 'OVERDUE' && (
                      <p className="text-[8px] text-red-600 font-black uppercase mt-1">
                        Vencido!
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900 leading-none">{receivable.description}</p>
                    {receivable.debtorName && (
                      <p className="text-[9px] text-slate-500 font-medium mt-0.5">
                        {receivable.debtorName}
                      </p>
                    )}
                  </td>
                  <td className={`px-6 py-3 text-right font-black ${
                    receivable.status === 'PAID' ? 'text-emerald-600' : 
                    receivable.receivableStatus === 'OVERDUE' ? 'text-red-600' : 'text-slate-700'
                  }`}>
                    {formatCurrency(receivable.amount)}
                    {receivable.paidAmount && receivable.paidAmount > 0 && (
                      <p className="text-[8px] text-slate-400 font-medium mt-1">
                        Pago: {formatCurrency(receivable.paidAmount)}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-lg font-black text-[9px] uppercase ${
                      receivable.receivableStatus === 'PAID' ? 'bg-emerald-50 text-emerald-700' :
                      receivable.receivableStatus === 'OVERDUE' ? 'bg-red-50 text-red-700' :
                      receivable.receivableStatus === 'NEGOTIATING' ? 'bg-amber-50 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {receivable.receivableStatus === 'PAID' ? 'Pago' :
                       receivable.receivableStatus === 'OVERDUE' ? 'Vencido' :
                       receivable.receivableStatus === 'NEGOTIATING' ? 'Negociando' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {receivable.receivableStatus === 'OVERDUE' && (
                        <>
                          <button
                            onClick={() => handleSendReminder(receivable)}
                            className="text-slate-400 hover:text-amber-600 transition-colors"
                            title="Enviar Lembrete"
                          >
                            <Mail size={15} />
                          </button>
                          <button
                            onClick={() => handleRenegotiate(receivable)}
                            className="text-slate-400 hover:text-emerald-600 transition-colors"
                            title="Renegociar"
                          >
                            <MessageCircle size={15} />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleRegisterPayment(receivable)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                        title="Registrar Pagamento"
                      >
                        <CheckCircle size={15} />
                      </button>
                      
                      <button
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* MODAL DE ALERTAS */}
      {showAlerts && alerts.length > 0 && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 text-white rounded-xl shadow-md">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 className="font-black uppercase text-sm tracking-tight text-slate-900">
                    Alertas de Vencimento
                  </h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {alerts.length} recebimentos requerem atenção
                  </p>
                </div>
              </div>
              <button onClick={() => setShowAlerts(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {alerts.map(alert => (
                <div key={alert.transactionId} className={`p-4 rounded-xl border-l-4 ${
                  alert.alertLevel === 'OVERDUE' ? 'bg-red-50 border-red-500' :
                  alert.alertLevel === 'CRITICAL' ? 'bg-amber-50 border-amber-500' :
                  'bg-yellow-50 border-yellow-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{alert.description}</p>
                      <p className="text-[9px] text-slate-500 font-medium mt-1">
                        Vence em: {alert.daysUntilDue < 0 ? 
                          `${Math.abs(alert.daysUntilDue)} dias atrasado` : 
                          `${alert.daysUntilDue} dias`}
                      </p>
                    </div>
                    <p className={`font-black ${
                      alert.alertLevel === 'OVERDUE' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {formatCurrency(alert.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
