/**
 * ============================================================================
 * SERVICE DE CONTAS A RECEBER
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este service gerencia TODO o ciclo de recebimentos da igreja.
 * Ele controla:
 * 
 * • Dízimos e ofertas a receber
 * • Aluguéis de imóveis
 * • Taxas e mensalidades
 * • Recebimento de parcelamentos
 * • Inadimplência e cobranças
 * • Renegociações de dívidas
 * 
 * ANALOGIA:
 * ---------
 * Pense como um "cobrador profissional" que:
 * - Sabe quem deve
 * - Calcula juros e multa
 * - Propõe acordos
 * - Registra pagamentos
 * - Emite recibos
 */

import { dbService } from './databaseService';
import { Transaction } from '../types';
import { accountService } from './accountService';
import {
  calcularEncargosPorAtraso,
  gerarPropostaDeRenegociacao,
  verificarNivelAlerta,
  gerarAlertasDeVencimento,
} from '../utils/calculosContasReceber';

/**
 * STATUS DE CONTAS A RECEBER
 * ==========================
 * Situações possíveis de um recebimento
 */
export type ReceivableStatus = 'PENDING' | 'OVERDUE' | 'PAID' | 'NEGOTIATING' | 'CANCELLED';

/**
 * EXTENSÃO DE TRANSAÇÃO PARA RECEBIMENTO
 * ======================================
 * Campos extras específicos para contas a receber
 */
export interface ReceivableTransaction extends Transaction {
  // Status específico
  receivableStatus: ReceivableStatus;
  
  // Dados do devedor
  debtorName?: string;       // Nome de quem deve
  debtorDocument?: string;   // CPF/CNPJ
  debtorEmail?: string;      // Email para cobrança
  debtorPhone?: string;      // Telefone/WhatsApp
  
  // Cobrança
  interestRate?: number;     // Juros % ao dia
  penaltyRate?: number;      // Multa %
  discountRate?: number;     // Desconto % se pagar à vista
  
  // Histórico
  paymentHistory?: PaymentRecord[];  // Histórico de pagamentos
  negotiationHistory?: NegotiationRecord[];  // Histórico de negociações
  
  // Datas importantes
  lastChargeDate?: string;   // Última cobrança enviada
  firstOverdueDate?: string; // Quando venceu pela primeira vez
  lastPaymentDate?: string;  // Data do último pagamento
  cancellationReason?: string; // Motivo do cancelamento
  cancelledAt?: string;      // Data/hora do cancelamento
  installmentValue?: number; // Valor da parcela (para parcelamentos)
}

/**
 * REGISTRO DE PAGAMENTO
 * =====================
 * Histórico de cada pagamento recebido
 */
export interface PaymentRecord {
  date: string;              // Data do pagamento
  amount: number;            // Valor pago
  method: 'CASH' | 'PIX' | 'TRANSFER' | 'CREDIT_CARD';  // Forma
  receiptNumber?: string;    // Número do recibo
  notes?: string;            // Observações
}

/**
 * REGISTRO DE NEGOCIAÇÃO
 * ======================
 * Histórico de propostas e acordos
 */
export interface NegotiationRecord {
  date: string;              // Data da negociação
  proposedAmount: number;    // Valor proposto
  installments: number;      // Parcelas oferecidas
  discountOffered: number;   // Desconto oferecido %
  status: 'PROPOSED' | 'ACCEPTED' | 'REJECTED';
  notes?: string;
}

/**
 * CLASSE DO SERVIÇO DE CONTAS A RECEBER
 * =====================================
 */
export class ReceivablesService {

  /**
   * BUSCAR TODAS AS CONTAS A RECEBER
   * ---------------------------------
   * 
   * O QUE FAZ?
   * Retorna todos os recebimentos cadastrados
   * 
   * PARÂMETRO:
   * - unitId?: string → ID da unidade/filial
   * 
   * RETORNO:
   * Promise<ReceivableTransaction[]> → Lista completa
   */
  async getReceivables(unitId?: string): Promise<ReceivableTransaction[]> {
    // Busca transações do banco
    const transactions = await dbService.getTransactions(unitId);
    
    // Filtra só as que são recebimentos (type = INCOME)
    const receivables = transactions.filter(t => t.type === 'INCOME');
    
    // Converte para formato enhanced
    return receivables.map(t => ({
      ...t,
      receivableStatus: this.determineReceivableStatus(t),
    }));
  }

  /**
   * BUSCAR UM RECEBIMENTO ESPECÍFICO
   * ---------------------------------
   * 
   * O QUE FAZ?
   * Retorna os detalhes de um único recebimento
   * 
   * PARÂMETRO:
   * - receivableId: string → ID do recebimento
   * 
   * RETORNO:
   * Promise<ReceivableTransaction | undefined>
   */
  async getReceivableById(receivableId: string): Promise<ReceivableTransaction | undefined> {
    const receivables = await this.getReceivables();
    return receivables.find(r => r.id === receivableId);
  }

  /**
   * SALVAR NOVO RECEBIMENTO
   * -----------------------
   * 
   * O QUE FAZ?
   * Cria um novo recebimento no sistema
   * 
   * PARÂMETRO:
   * - receivable: Partial<ReceivableTransaction> → Dados
   * 
   * RETORNO:
   * Promise<void>
   */
  async saveReceivable(receivable: Partial<ReceivableTransaction>): Promise<void> {
    const receivableId = receivable.id || crypto.randomUUID();
    
    const receivableData: Partial<Transaction> = {
      ...receivable,
      id: receivableId,
      type: 'INCOME',  // Sempre receita
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    
    await dbService.saveTransaction(receivableData);
  }

  /**
   * ATUALIZAR RECEBIMENTO EXISTENTE
   * --------------------------------
   * 
   * O QUE FAZ?
   * Modifica dados de um recebimento
   * 
   * PARÂMETROS:
   * - receivableId: string
   * - updates: Partial<ReceivableTransaction>
   */
  async updateReceivable(
    receivableId: string,
    updates: Partial<ReceivableTransaction>
  ): Promise<void> {
    const receivables = await this.getReceivables();
    const receivable = receivables.find(r => r.id === receivableId);
    
    if (!receivable) {
      throw new Error(`Recebimento ${receivableId} não encontrado!`);
    }
    
    const updatedData = {
      ...receivable,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await dbService.saveTransaction(updatedData);
  }

  /**
   * REGISTRAR PAGAMENTO DE RECEBIMENTO
   * -----------------------------------
   * 
   * O QUE FAZ?
   * Baixa um recebimento (total ou parcial)
   * 
   * PARÂMETROS:
   * - receivableId: string → Qual recebimento
   * - amount: number → Quanto foi pago
   * - method: 'CASH' | 'PIX' | 'TRANSFER' | 'CREDIT_CARD'
   * - accountId?: string → Conta onde depositar (opcional)
   * 
   * RETORNO:
   * Promise<PaymentRecord> → Recibo do pagamento
   * 
   * FLUXO:
   * 1. Valida recebimento existe
   * 2. Calcula quanto falta
   * 3. Atualiza status
   * 4. Se tiver conta bancária, atualiza saldo
   * 5. Gera número do recibo
   */
  async registerPayment(
    receivableId: string,
    amount: number,
    method: 'CASH' | 'PIX' | 'TRANSFER' | 'CREDIT_CARD',
    accountId?: string
  ): Promise<PaymentRecord> {
    // 1. Busca recebimento
    const receivables = await this.getReceivables();
    const receivable = receivables.find(r => r.id === receivableId);
    
    if (!receivable) {
      throw new Error('Recebimento não encontrado!');
    }
    
    // 2. Verifica valor
    const jaPago = receivable.paidAmount || 0;
    const restante = receivable.amount - jaPago;
    
    if (amount > restante) {
      throw new Error(`Valor pago (R$ ${amount}) é maior que o devido (R$ ${restante})!`);
    }
    
    // 3. Cria registro de pagamento
    const paymentRecord: PaymentRecord = {
      date: new Date().toISOString().split('T')[0],
      amount,
      method,
      receiptNumber: `REC-${receivableId.slice(0, 6).toUpperCase()}-${Date.now()}`,
      notes: `Pagamento ${method === 'PIX' ? 'via PIX' : method === 'CASH' ? 'em espécie' : 'transferência'}`,
    };
    
    // 4. Atualiza histórico
    const history = receivable.paymentHistory || [];
    history.push(paymentRecord);
    
    // 5. Atualiza valores
    const novoTotalPago = jaPago + amount;
    const novoRestante = restante - amount;
    const novoStatus = novoRestante <= 0 ? 'PAID' : 'PENDING';
    
    // 6. Salva atualizações
    await this.updateReceivable(receivableId, {
      paidAmount: novoTotalPago,
      remainingAmount: novoRestante,
      status: novoStatus,
      paymentHistory: history,
      lastPaymentDate: paymentRecord.date,
    });
    
    // 7. Se tiver conta bancária, atualiza saldo
    if (accountId && amount > 0) {
      await accountService.registerDeposit(
        accountId,
        amount,
        `Recebimento: ${receivable.description} (${paymentRecord.receiptNumber})`
      );
    }
    
    // 8. Retorna recibo
    return paymentRecord;
  }

  /**
   * CANCELAR RECEBIMENTO
   * --------------------
   * 
   * O QUE FAZ?
   * Marca recebimento como cancelado
   * 
   * PARÂMETROS:
   * - receivableId: string
   * - reason: string → Motivo do cancelamento
   */
  async cancelReceivable(receivableId: string, reason: string): Promise<void> {
    await this.updateReceivable(receivableId, {
      receivableStatus: 'CANCELLED',
      status: 'PENDING',
      cancellationReason: reason,
      cancelledAt: new Date().toISOString(),
    });
  }

  /**
   * GERAR PROPOSTA DE RENEGOCIAÇÃO
   * -------------------------------
   * 
   * O QUE FAZ?
   * Cria proposta de acordo para dívidas vencidas
   * 
   * PARÂMETRO:
   * - receivableId: string → Dívida a renegociar
   * 
   * RETORNO:
   * Promise<RenegotiationProposal>
   */
  async proposeRenegotiation(receivableId: string): Promise<any> {
    const receivables = await this.getReceivables();
    const receivable = receivables.find(r => r.id === receivableId);
    
    if (!receivable) {
      throw new Error('Recebimento não encontrado!');
    }
    
    // Gera proposta usando utilitário
    const proposal = gerarPropostaDeRenegociacao(receivable);
    
    // Registra no histórico
    const negotiationRecord: NegotiationRecord = {
      date: new Date().toISOString().split('T')[0],
      proposedAmount: proposal.totalAmount,
      installments: proposal.installmentOptions.length,
      discountOffered: (proposal.discountAmount / proposal.originalAmount) * 100,
      status: 'PROPOSED',
      notes: `Proposta gerada automaticamente. Dívida original: R$ ${proposal.originalAmount.toFixed(2)}`,
    };
    
    const history = receivable.negotiationHistory || [];
    history.push(negotiationRecord);
    
    await this.updateReceivable(receivableId, {
      negotiationHistory: history,
      receivableStatus: 'NEGOTIATING',
    });
    
    return proposal;
  }

  /**
   * ACEITAR PROPOSTA DE RENEGOCIAÇÃO
   * ---------------------------------
   * 
   * O QUE FAZ?
   * Formaliza acordo de renegociação
   * 
   * PARÂMETROS:
   * - receivableId: string
   * - acceptedOption: { count: number, installmentValue: number }
   */
  async acceptRenegotiation(
    receivableId: string,
    acceptedOption: { count: number; installmentValue: number }
  ): Promise<void> {
    // Atualiza status e registra aceite
    const negotiationRecord: NegotiationRecord = {
      date: new Date().toISOString().split('T')[0],
      proposedAmount: acceptedOption.installmentValue * acceptedOption.count,
      installments: acceptedOption.count,
      discountOffered: 0,
      status: 'ACCEPTED',
      notes: `Acordo fechado em ${acceptedOption.count}x de R$ ${acceptedOption.installmentValue.toFixed(2)}`,
    };
    
    const receivables = await this.getReceivables();
    const receivable = receivables.find(r => r.id === receivableId);
    
    if (!receivable) {
      throw new Error('Recebimento não encontrado!');
    }
    
    const history = receivable.negotiationHistory || [];
    history.push(negotiationRecord);
    
    await this.updateReceivable(receivableId, {
      negotiationHistory: history,
      receivableStatus: 'PENDING',  // Volta a ser pendente com novas condições
      installmentCount: acceptedOption.count,
      installmentValue: acceptedOption.installmentValue,
    });
  }

  /**
   * OBTER ALERTAS DE VENCIMENTO
   * ----------------------------
   * 
   * O QUE FAZ?
   * Lista recebimentos que precisam de atenção
   * 
   * PARÂMETRO:
   * - unitId?: string
   * 
   * RETORNO:
   * Alertas ordenados por urgência
   */
  async getPaymentAlerts(unitId?: string): Promise<any[]> {
    const receivables = await this.getReceivables(unitId);
    return gerarAlertasDeVencimento(receivables);
  }

  /**
   * CALCULAR ENCARGOS DE UMA DÍVIDA
   * --------------------------------
   * 
   * O QUE FAZ?
   * Mostra quanto o devedor deve pagar com juros/multa
   * 
   * PARÂMETRO:
   * - receivableId: string
   * 
   * RETORNO:
   * Detalhamento dos encargos
   */
  async calculateCharges(receivableId: string): Promise<any> {
    const receivables = await this.getReceivables();
    const receivable = receivables.find(r => r.id === receivableId);
    
    if (!receivable) {
      throw new Error('Recebimento não encontrado!');
    }
    
    return calcularEncargosPorAtraso(
      receivable,
      receivable.interestRate || 0.33,
      receivable.penaltyRate || 2
    );
  }

  /**
   * DETERMINAR STATUS DO RECEBIMENTO
   * ---------------------------------
   * 
   * O QUE FAZ?
   * Classifica recebimento baseado em datas e pagamentos
   * 
   * PARÂMETRO:
   * - transaction: Transaction
   * 
   * RETORNO:
   * ReceivableStatus
   */
  private determineReceivableStatus(transaction: Transaction): ReceivableStatus {
    // Se já está pago
    if (transaction.status === 'PAID') {
      return 'PAID';
    }
    
    // Se está cancelado
    if ((transaction as any).receivableStatus === 'CANCELLED') {
      return 'CANCELLED';
    }
    
    // Se está em negociação
    if ((transaction as any).receivableStatus === 'NEGOTIATING') {
      return 'NEGOTIATING';
    }
    
    // Verifica se venceu
    const dueDate = transaction.dueDate || transaction.date;
    const nivelAlerta = verificarNivelAlerta(dueDate);
    
    if (nivelAlerta === 'OVERDUE') {
      return 'OVERDUE';
    }
    
    return 'PENDING';
  }
}

/**
 * EXPORTAR INSTÂNCIA PRONTA
 * =========================
 */
export const receivablesService = new ReceivablesService();
export const contasReceberService = receivablesService;
