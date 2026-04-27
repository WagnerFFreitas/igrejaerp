/**
 * ============================================================================
 * TREASURYSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para treasury service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import apiClient from '../src/services/apiService';
import {
  CashFlow,
  CashFlowForecast,
  TreasuryAccount,
  Investment,
  Loan,
  TreasuryAlert,
  FinancialPosition,
  FinancialPositionDetail,
} from '../types';

// ─── helpers ────────────────────────────────────────────────────────────────

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (treasury service).
 */

const toSnake = (obj: any) => obj; // API aceita camelCase — normalização feita no backend

// ─── CASH FLOWS ─────────────────────────────────────────────────────────────

class TreasuryService {

  static async getCashFlows(unitId: string): Promise<CashFlow[]> {
    try {
      const data = await apiClient.get<CashFlow[]>('/treasury/cash-flows', { unitId });
      return data || [];
    } catch (e) {
      console.error('❌ getCashFlows:', e);
      return [];
    }
  }

  static async saveCashFlow(cashFlow: CashFlow): Promise<void> {
    try {
      if (cashFlow.id && !cashFlow.id.startsWith('tmp-')) {
        await apiClient.put(`/treasury/cash-flows/${cashFlow.id}`, cashFlow);
      } else {
        await apiClient.post('/treasury/cash-flows', cashFlow);
      }
    } catch (e) {
      console.error('❌ saveCashFlow:', e);
      throw e;
    }
  }

  static async getCashFlowById(id: string, unitId: string): Promise<CashFlow | null> {
    const flows = await this.getCashFlows(unitId);
    return flows.find(f => f.id === id) || null;
  }

  // ─── FORECASTS ─────────────────────────────────────────────────────────────

  static async getCashFlowForecasts(unitId: string): Promise<CashFlowForecast[]> {
    try {
      const data = await apiClient.get<CashFlowForecast[]>('/treasury/forecasts', { unitId });
      return data || [];
    } catch (e) {
      console.error('❌ getCashFlowForecasts:', e);
      return [];
    }
  }

  static async saveCashFlowForecast(forecast: CashFlowForecast): Promise<void> {
    try {
      if (forecast.id && !forecast.id.startsWith('tmp-')) {
        await apiClient.put(`/treasury/forecasts/${forecast.id}`, forecast);
      } else {
        await apiClient.post('/treasury/forecasts', forecast);
      }
    } catch (e) {
      console.error('❌ saveCashFlowForecast:', e);
      throw e;
    }
  }

  static async generateCashFlowForecast(
    dataInicio: string,
    dataFim: string,
    tipo: 'SEMANAL' | 'MENSAL' | 'TRIMESTRAL' | 'ANUAL',
    unitId: string
  ): Promise<CashFlowForecast> {
    const historicalFlows = await this.getCashFlows(unitId);
    const entradas = historicalFlows.filter(cf => cf.categoria === 'RECEITA');
    const saidas   = historicalFlows.filter(cf => cf.categoria === 'DESPESA');

    const mediaEntradas = entradas.length ? entradas.reduce((s, cf) => s + cf.valor, 0) / entradas.length : 0;
    const mediaSaidas   = saidas.length   ? saidas.reduce((s, cf) => s + cf.valor, 0)   / saidas.length   : 0;

    const startDate = new Date(dataInicio);
    const endDate   = new Date(dataFim);
    const dias = Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000);
    const detalhes: any[] = [];

    for (let i = 0; i < dias; i++) {
      if (i % 7 === 0) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const data = d.toISOString().split('T')[0];
        detalhes.push({ id: crypto.randomUUID(), data, descricao: 'Receitas semanais projetadas', tipo: 'ENTRADA', valorPrevisto: mediaEntradas / 4, categoria: 'Dízimos', probabilidade: 'ALTA', status: 'PREVISTO' });
        detalhes.push({ id: crypto.randomUUID(), data, descricao: 'Despesas semanais projetadas', tipo: 'SAIDA',   valorPrevisto: mediaSaidas   / 4, categoria: 'Operacionais', probabilidade: 'ALTA', status: 'PREVISTO' });
      }
    }

    const entradasPrevistas = detalhes.filter(d => d.tipo === 'ENTRADA').reduce((s, d) => s + d.valorPrevisto, 0);
    const saidasPrevistas   = detalhes.filter(d => d.tipo === 'SAIDA').reduce((s, d) => s + d.valorPrevisto, 0);
    const saldoInicial = await this.getCurrentBalance(unitId);

    const forecast: CashFlowForecast = {
      id: `tmp-${crypto.randomUUID()}`,
      dataInicio, dataFim, tipo, saldoInicial,
      entradasPrevistas, saidasPrevistas,
      saldoFinalPrevisto: saldoInicial + entradasPrevistas - saidasPrevistas,
      entradasRealizadas: 0, saidasRealizadas: 0, saldoFinalReal: saldoInicial,
      precisao: 0, status: 'EM_ANDAMENTO',
      criadoPor: 'system', dataCriacao: new Date().toISOString(),
      atualizadoPor: 'system', dataAtualizacao: new Date().toISOString(),
      unitId, detalhes,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };

    await this.saveCashFlowForecast(forecast);
    return forecast;
  }

  // ─── TREASURY ACCOUNTS (usa financial_accounts via /accounts) ────────────

  static async getTreasuryAccounts(unitId: string): Promise<TreasuryAccount[]> {
    try {
      const data = await apiClient.get<any[]>('/accounts', { unitId });
      return (data || []).map((a: any) => ({
        id: a.id,
        unitId: a.unitId,
        nome: a.name,
        tipo: a.type === 'SAVINGS'
          ? 'CONTA_POUPANCA'
          : a.type === 'INVESTMENT'
            ? 'CONTA_INVESTIMENTO'
            : a.type === 'CASH'
              ? 'CARTEIRA_DIGITAL'
              : 'CONTA_CORRENTE',
        banco: a.bankName || a.name || 'Conta Interna',
        agencia: a.agencyNumber || '0000',
        numero: a.accountNumber || '000000',
        digito: undefined,
        saldo: a.currentBalance || 0,
        saldoBloqueado: 0,
        saldoDisponivel: a.currentBalance || 0,
        moeda: 'BRL',
        dataAbertura: a.createdAt || new Date().toISOString(),
        dataEncerramento: undefined,
        titular: 'Igreja',
        documentos: [],
        limites: {
          saqueDiario: 0,
          transferenciaDiaria: 0,
          emprestimoMaximo: 0,
        },
        taxas: {
          manutencao: 0,
          saque: 0,
          transferencia: 0,
        },
        alertas: { saldoMinimo: a.minimumBalance || 0, saldoMaximo: 9999999, movimentacaoSuspeita: false },
        status: a.status === 'INACTIVE' ? 'INATIVA' : a.status === 'BLOCKED' ? 'BLOQUEADA' : 'ATIVA',
        createdBy: 'system',
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }));
    } catch (e) {
      console.error('❌ getTreasuryAccounts:', e);
      return [];
    }
  }

  static async saveTreasuryAccount(account: TreasuryAccount): Promise<void> {
    // TreasuryAccount mapeia para financial_accounts
    const payload = {
      unitId: account.unitId,
      name: account.nome,
      type: account.tipo || 'BANK',
      currentBalance: account.saldo || 0,
      minimumBalance: account.alertas?.saldoMinimo || null,
      status: account.status || 'ACTIVE',
    };
    try {
      if (account.id && !account.id.startsWith('tmp-')) {
        await apiClient.put(`/accounts/${account.id}`, payload);
      } else {
        await apiClient.post('/accounts', payload);
      }
    } catch (e) {
      console.error('❌ saveTreasuryAccount:', e);
      throw e;
    }
  }

  // ─── INVESTMENTS ─────────────────────────────────────────────────────────

  static async getInvestments(unitId: string): Promise<Investment[]> {
    try {
      const data = await apiClient.get<Investment[]>('/treasury/investments', { unitId });
      return (data || []).map((row: any) => ({
        ...row,
        valorAplicado: parseFloat(row.valor_aplicado || row.valorAplicado) || 0,
        valorAtual:    parseFloat(row.valor_atual    || row.valorAtual)    || 0,
        dataAplicacao: row.data_aplicacao || row.dataAplicacao,
        dataVencimento: row.data_vencimento || row.dataVencimento,
        rentabilidadeAnual: parseFloat(row.rentabilidade_anual || row.rentabilidadeAnual) || 0,
      }));
    } catch (e) {
      console.error('❌ getInvestments:', e);
      return [];
    }
  }

  static async saveInvestment(investment: Investment): Promise<void> {
    try {
      if (investment.id && !investment.id.startsWith('tmp-')) {
        await apiClient.put(`/treasury/investments/${investment.id}`, investment);
      } else {
        await apiClient.post('/treasury/investments', investment);
      }
    } catch (e) {
      console.error('❌ saveInvestment:', e);
      throw e;
    }
  }

  static calculateInvestmentReturn(investment: Investment): number {
    if (!investment.valorAplicado) return 0;
    return ((investment.valorAtual - investment.valorAplicado) / investment.valorAplicado) * 100;
  }

  // ─── LOANS ───────────────────────────────────────────────────────────────

  static async getLoans(unitId: string): Promise<Loan[]> {
    try {
      const data = await apiClient.get<Loan[]>('/treasury/loans', { unitId });
      return (data || []).map((row: any) => ({
        ...row,
        valorOriginal:    parseFloat(row.valor_original    || row.valorOriginal)    || 0,
        valorSaldo:       parseFloat(row.valor_saldo       || row.valorSaldo)       || 0,
        taxaJuros:        parseFloat(row.taxa_juros        || row.taxaJuros)        || 0,
        totalParcelas:    row.total_parcelas  || row.totalParcelas  || 1,
        parcelasPagas:    row.parcelas_pagas  || row.parcelasPagas  || 0,
        dataContratacao:  row.data_contratacao || row.dataContratacao,
        dataVencimento:   row.data_vencimento  || row.dataVencimento,
        parcelas: typeof row.parcelas === 'string' ? JSON.parse(row.parcelas) : (row.parcelas || []),
      }));
    } catch (e) {
      console.error('❌ getLoans:', e);
      return [];
    }
  }

  static async saveLoan(loan: Loan): Promise<void> {
    try {
      if (loan.id && !loan.id.startsWith('tmp-')) {
        await apiClient.put(`/treasury/loans/${loan.id}`, loan);
      } else {
        await apiClient.post('/treasury/loans', loan);
      }
    } catch (e) {
      console.error('❌ saveLoan:', e);
      throw e;
    }
  }

  // ─── ALERTS ──────────────────────────────────────────────────────────────

  static async getTreasuryAlerts(unitId: string): Promise<TreasuryAlert[]> {
    try {
      const data = await apiClient.get<TreasuryAlert[]>('/treasury/alerts', { unitId });
      return data || [];
    } catch (e) {
      console.error('❌ getTreasuryAlerts:', e);
      return [];
    }
  }

  static async saveTreasuryAlert(alert: TreasuryAlert): Promise<void> {
    try {
      await apiClient.post('/treasury/alerts', alert);
    } catch (e) {
      console.error('❌ saveTreasuryAlert:', e);
      throw e;
    }
  }

  static async generateTreasuryAlerts(unitId: string): Promise<TreasuryAlert[]> {
    const alerts: TreasuryAlert[] = [];
    const accounts = await this.getTreasuryAccounts(unitId);

    for (const account of accounts) {
      if (account.saldo < (account.alertas?.saldoMinimo || 0)) {
        alerts.push({ id: `tmp-${crypto.randomUUID()}`, tipo: 'SALDO_MINIMO', titulo: 'Saldo Mínimo Atingido', descricao: `Conta ${account.nome} abaixo do saldo mínimo`, gravidade: 'ALTA', contaId: account.id, valor: account.saldo, status: 'ATIVO', acoesSugeridas: ['Transferir fundos de outra conta'], dataCriacao: new Date().toISOString(), unitId, createdBy: 'system', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      }
    }

    const loans = await this.getLoans(unitId);
    const next30 = new Date(); next30.setDate(next30.getDate() + 30);
    for (const loan of loans) {
      if (loan.status === 'ATIVO') {
        const pendentes = (loan.parcelas || []).filter((p: any) => p.status === 'PENDENTE' && new Date(p.dataVencimento) <= next30);
        if (pendentes.length) {
          alerts.push({ id: `tmp-${crypto.randomUUID()}`, tipo: 'VENCIMENTO', titulo: 'Vencimentos Próximos', descricao: `Empréstimo ${loan.nome}: ${pendentes.length} parcelas vencendo em 30 dias`, gravidade: 'MEDIA', emprestimoId: loan.id, valor: pendentes.reduce((s: number, p: any) => s + p.valorParcela, 0), dataLimite: pendentes[0].dataVencimento, status: 'ATIVO', acoesSugeridas: ['Reservar fundos para pagamento'], dataCriacao: new Date().toISOString(), unitId, createdBy: 'system', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        }
      }
    }

    for (const alert of alerts) {
      await this.saveTreasuryAlert(alert);
    }
    return alerts;
  }

  // ─── FINANCIAL POSITIONS ─────────────────────────────────────────────────

  static async getFinancialPositions(unitId: string): Promise<FinancialPosition[]> {
    try {
      const data = await apiClient.get<FinancialPosition[]>('/treasury/positions', { unitId });
      return data || [];
    } catch (e) {
      console.error('❌ getFinancialPositions:', e);
      return [];
    }
  }

  static async saveFinancialPosition(position: FinancialPosition): Promise<void> {
    try {
      await apiClient.post('/treasury/positions', position);
    } catch (e) {
      console.error('❌ saveFinancialPosition:', e);
      throw e;
    }
  }

  static async generateFinancialPosition(unitId: string): Promise<FinancialPosition> {
    const accounts    = await this.getTreasuryAccounts(unitId);
    const investments = await this.getInvestments(unitId);
    const loans       = await this.getLoans(unitId);

    const disponibilidades = accounts.reduce((s, a) => s + a.saldoDisponivel, 0);
    const aplicacoes       = investments.reduce((s, i) => s + i.valorAtual, 0);
    const emprestimosVal   = loans.reduce((s, l) => s + l.valorSaldo, 0);

    const ativoTotal       = disponibilidades + aplicacoes;
    const passivoTotal     = emprestimosVal;
    const patrimonioLiquido = ativoTotal - passivoTotal;

    const position: FinancialPosition = {
      id: `tmp-${crypto.randomUUID()}`,
      data: new Date().toISOString().split('T')[0],
      ativoTotal, passivoTotal, patrimonioLiquido,
      disponibilidades, aplicacoes,
      contasReceber: 0, estoques: 0, ativoFixo: 0,
      fornecedores: 0, emprestimos: emprestimosVal, outrasContas: 0,
      variacaoPatrimonial: 0, variacaoPercentual: 0,
      indicadores: {
        liquidezCorrente: passivoTotal ? disponibilidades / passivoTotal : 0,
        liquidezSeca:     passivoTotal ? disponibilidades / passivoTotal : 0,
        endividamento:    ativoTotal   ? (emprestimosVal / ativoTotal) * 100 : 0,
        rentabilidade:    0,
      },
      detalhamento: [] as FinancialPositionDetail[],
      unitId, createdBy: 'system',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };

    await this.saveFinancialPosition(position);
    return position;
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────────

  static async getCurrentBalance(unitId: string): Promise<number> {
    const accounts = await this.getTreasuryAccounts(unitId);
    return accounts.reduce((s, a) => s + a.saldoDisponivel, 0);
  }

  static async getTreasurySummary(unitId: string) {
    const [accounts, investments, loans, alerts] = await Promise.all([
      this.getTreasuryAccounts(unitId),
      this.getInvestments(unitId),
      this.getLoans(unitId),
      this.getTreasuryAlerts(unitId),
    ]);

    const saldoTotal        = accounts.reduce((s, a) => s + a.saldoDisponivel, 0);
    const investimentosTotal = investments.reduce((s, i) => s + i.valorAtual, 0);
    const emprestimosTotal  = loans.reduce((s, l) => s + l.valorSaldo, 0);
    const alertasAtivos     = alerts.filter(a => a.status === 'ATIVO').length;
    const rentabilidadeMedia = investments.length
      ? investments.reduce((s, i) => s + this.calculateInvestmentReturn(i), 0) / investments.length
      : 0;

    const next30 = new Date(); next30.setDate(next30.getDate() + 30);
    const proximosVencimentos = loans.reduce((c, l) =>
      c + (l.parcelas || []).filter((p: any) => p.status === 'PENDENTE' && new Date(p.dataVencimento) <= next30).length, 0);

    return { saldoTotal, investimentosTotal, emprestimosTotal, alertasAtivos, rentabilidadeMedia, proximosVencimentos };
  }
}

export default TreasuryService;
