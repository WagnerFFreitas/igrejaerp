import { 
  CashFlow, 
  CashFlowForecast, 
  CashFlowForecastDetail,
  TreasuryAccount, 
  Investment, 
  InvestmentEarning,
  Loan, 
  LoanInstallment, 
  LoanPayment,
  TreasuryAlert,
  FinancialPosition,
  FinancialPositionDetail
} from '../types';
import { 
  MOCK_CASH_FLOWS,
  MOCK_TREASURY_ACCOUNTS,
  MOCK_INVESTMENTS,
  MOCK_LOANS,
  MOCK_TREASURY_ALERTS,
  MOCK_CASH_FLOW_FORECASTS,
  MOCK_FINANCIAL_POSITION
} from '../constants/treasuryMock';

class TreasuryService {
  private static readonly STORAGE_KEYS = {
    CASH_FLOWS: 'cash_flows',
    FORECASTS: 'cash_flow_forecasts',
    TREASURY_ACCOUNTS: 'treasury_accounts',
    INVESTMENTS: 'investments',
    LOANS: 'loans',
    ALERTS: 'treasury_alerts',
    FINANCIAL_POSITIONS: 'financial_positions'
  };

  /**
   * Salvar fluxo de caixa
   */
  static async saveCashFlow(cashFlow: CashFlow): Promise<void> {
    try {
      const cashFlows = await this.getCashFlows(cashFlow.unitId);
      const existingIndex = cashFlows.findIndex(cf => cf.id === cashFlow.id);
      
      if (existingIndex >= 0) {
        cashFlows[existingIndex] = {
          ...cashFlow,
          updatedAt: new Date().toISOString()
        };
      } else {
        cashFlows.push({
          ...cashFlow,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.CASH_FLOWS, cashFlows);
      console.log('✅ Fluxo de caixa salvo com sucesso:', cashFlow.id);
    } catch (error) {
      console.error('❌ Erro ao salvar fluxo de caixa:', error);
      throw error;
    }
  }

  /**
   * Obter fluxos de caixa de uma unidade
   */
  static async getCashFlows(unitId: string): Promise<CashFlow[]> {
    try {
      const cashFlows = await this.getFromStorage(this.STORAGE_KEYS.CASH_FLOWS) || [];
      
      // Se não houver dados reais, usar mock
      if (cashFlows.length === 0) {
        console.log('📊 Usando dados mock para fluxos de caixa');
        return MOCK_CASH_FLOWS.filter(cf => cf.unitId === unitId)
                              .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
      }
      
      return cashFlows.filter((cf: CashFlow) => cf.unitId === unitId)
                              .sort((a: CashFlow, b: CashFlow) => new Date(b.data).getTime() - new Date(a.data).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter fluxos de caixa:', error);
      return MOCK_CASH_FLOWS.filter(cf => cf.unitId === unitId);
    }
  }

  /**
   * Obter fluxo de caixa por ID
   */
  static async getCashFlowById(id: string, unitId: string): Promise<CashFlow | null> {
    try {
      const cashFlows = await this.getCashFlows(unitId);
      return cashFlows.find(cf => cf.id === id) || null;
    } catch (error) {
      console.error('❌ Erro ao obter fluxo de caixa por ID:', error);
      return null;
    }
  }

  /**
   * Salvar projeção de fluxo de caixa
   */
  static async saveCashFlowForecast(forecast: CashFlowForecast): Promise<void> {
    try {
      const forecasts = await this.getCashFlowForecasts(forecast.unitId);
      const existingIndex = forecasts.findIndex(f => f.id === forecast.id);
      
      if (existingIndex >= 0) {
        forecasts[existingIndex] = {
          ...forecast,
          updatedAt: new Date().toISOString()
        };
      } else {
        forecasts.push({
          ...forecast,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.FORECASTS, forecasts);
      console.log('✅ Projeção de fluxo de caixa salva com sucesso:', forecast.id);
    } catch (error) {
      console.error('❌ Erro ao salvar projeção de fluxo de caixa:', error);
      throw error;
    }
  }

  /**
   * Obter projeções de fluxo de caixa
   */
  static async getCashFlowForecasts(unitId: string): Promise<CashFlowForecast[]> {
    try {
      const forecasts = await this.getFromStorage(this.STORAGE_KEYS.FORECASTS) || [];
      
      // Se não houver dados reais, usar mock
      if (forecasts.length === 0) {
        console.log('📊 Usando dados mock para projeções de fluxo de caixa');
        return MOCK_CASH_FLOW_FORECASTS.filter(f => f.unitId === unitId)
                              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      return forecasts.filter((f: CashFlowForecast) => f.unitId === unitId)
                              .sort((a: CashFlowForecast, b: CashFlowForecast) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter projeções de fluxo de caixa:', error);
      return MOCK_CASH_FLOW_FORECASTS.filter(f => f.unitId === unitId);
    }
  }

  /**
   * Gerar projeção automática de fluxo de caixa
   */
  static async generateCashFlowForecast(
    dataInicio: string, 
    dataFim: string, 
    tipo: 'SEMANAL' | 'MENSAL' | 'TRIMESTRAL' | 'ANUAL',
    unitId: string
  ): Promise<CashFlowForecast> {
    try {
      // Obter dados históricos
      const historicalFlows = await this.getCashFlows(unitId);
      const startDate = new Date(dataInicio);
      const endDate = new Date(dataFim);
      
      // Calcular médias históricas
      const entradasHistoricas = historicalFlows.filter(cf => cf.categoria === 'RECEITA');
      const saidasHistoricas = historicalFlows.filter(cf => cf.categoria === 'DESPESA');
      
      const mediaEntradas = entradasHistoricas.length > 0 
        ? entradasHistoricas.reduce((sum, cf) => sum + cf.valor, 0) / entradasHistoricas.length 
        : 0;
      
      const mediaSaidas = saidasHistoricas.length > 0 
        ? saidasHistoricas.reduce((sum, cf) => sum + cf.valor, 0) / saidasHistoricas.length 
        : 0;

      // Gerar detalhes da projeção
      const detalhes: CashFlowForecastDetail[] = [];
      const diasDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      for (let i = 0; i < diasDiff; i++) {
        const dataAtual = new Date(startDate);
        dataAtual.setDate(startDate.getDate() + i);
        
        // Simular entradas e saídias com base em médias
        if (i % 7 === 0) { // Semanal
          detalhes.push({
            id: Math.random().toString(36).substr(2, 9),
            forecastId: '', // Será preenchido depois
            data: dataAtual.toISOString().split('T')[0],
            descricao: 'Receitas semanais projetadas',
            tipo: 'ENTRADA',
            valorPrevisto: mediaEntradas / 4, // Aproximadamente semanal
            categoria: 'Dízimos',
            centroCusto: 'Tesouraria',
            probabilidade: 'ALTA',
            status: 'PREVISTO'
          });
          
          detalhes.push({
            id: Math.random().toString(36).substr(2, 9),
            forecastId: '', // Será preenchido depois
            data: dataAtual.toISOString().split('T')[0],
            descricao: 'Despesas semanais projetadas',
            tipo: 'SAIDA',
            valorPrevisto: mediaSaidas / 4, // Aproximadamente semanal
            categoria: 'Operacionais',
            centroCusto: 'Tesouraria',
            probabilidade: 'ALTA',
            status: 'PREVISTO'
          });
        }
      }

      // Calcular totais
      const entradasPrevistas = detalhes
        .filter(d => d.tipo === 'ENTRADA')
        .reduce((sum, d) => sum + d.valorPrevisto, 0);
      
      const saidasPrevistas = detalhes
        .filter(d => d.tipo === 'SAIDA')
        .reduce((sum, d) => sum + d.valorPrevisto, 0);

      // Obter saldo inicial
      const saldoInicial = await this.getCurrentBalance(unitId);

      const forecast: CashFlowForecast = {
        id: Math.random().toString(36).substr(2, 9),
        dataInicio,
        dataFim,
        tipo,
        saldoInicial,
        entradasPrevistas,
        saidasPrevistas,
        saldoFinalPrevisto: saldoInicial + entradasPrevistas - saidasPrevistas,
        entradasRealizadas: 0,
        saidasRealizadas: 0,
        saldoFinalReal: saldoInicial,
        precisao: 0,
        status: 'EM_ANDAMENTO',
        criadoPor: 'system',
        dataCriacao: new Date().toISOString(),
        atualizadoPor: 'system',
        dataAtualizacao: new Date().toISOString(),
        unitId,
        detalhes: detalhes.map(d => ({ ...d, forecastId: Math.random().toString(36).substr(2, 9) })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.saveCashFlowForecast(forecast);
      console.log('✅ Projeção de fluxo de caixa gerada com sucesso:', forecast.id);
      
      return forecast;
    } catch (error) {
      console.error('❌ Erro ao gerar projeção de fluxo de caixa:', error);
      throw error;
    }
  }

  /**
   * Salvar conta de tesouraria
   */
  static async saveTreasuryAccount(account: TreasuryAccount): Promise<void> {
    try {
      const accounts = await this.getTreasuryAccounts(account.unitId);
      const existingIndex = accounts.findIndex(a => a.id === account.id);
      
      if (existingIndex >= 0) {
        accounts[existingIndex] = {
          ...account,
          updatedAt: new Date().toISOString()
        };
      } else {
        accounts.push({
          ...account,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.TREASURY_ACCOUNTS, accounts);
      console.log('✅ Conta de tesouraria salva com sucesso:', account.id);
    } catch (error) {
      console.error('❌ Erro ao salvar conta de tesouraria:', error);
      throw error;
    }
  }

  /**
   * Obter contas de tesouraria
   */
  static async getTreasuryAccounts(unitId: string): Promise<TreasuryAccount[]> {
    try {
      const accounts = await this.getFromStorage(this.STORAGE_KEYS.TREASURY_ACCOUNTS) || [];
      
      // Se não houver dados reais, usar mock
      if (accounts.length === 0) {
        console.log('📊 Usando dados mock para contas de tesouraria');
        return MOCK_TREASURY_ACCOUNTS.filter(a => a.unitId === unitId)
                      .sort((a, b) => a.nome.localeCompare(b.nome));
      }
      
      return accounts.filter((a: TreasuryAccount) => a.unitId === unitId)
                      .sort((a: TreasuryAccount, b: TreasuryAccount) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.error('❌ Erro ao obter contas de tesouraria:', error);
      return MOCK_TREASURY_ACCOUNTS.filter(a => a.unitId === unitId);
    }
  }

  /**
   * Salvar investimento
   */
  static async saveInvestment(investment: Investment): Promise<void> {
    try {
      const investments = await this.getInvestments(investment.unitId);
      const existingIndex = investments.findIndex(i => i.id === investment.id);
      
      if (existingIndex >= 0) {
        investments[existingIndex] = {
          ...investment,
          updatedAt: new Date().toISOString()
        };
      } else {
        investments.push({
          ...investment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.INVESTMENTS, investments);
      console.log('✅ Investimento salvo com sucesso:', investment.id);
    } catch (error) {
      console.error('❌ Erro ao salvar investimento:', error);
      throw error;
    }
  }

  /**
   * Obter investimentos
   */
  static async getInvestments(unitId: string): Promise<Investment[]> {
    try {
      const investments = await this.getFromStorage(this.STORAGE_KEYS.INVESTMENTS) || [];
      
      // Se não houver dados reais, usar mock
      if (investments.length === 0) {
        console.log('📊 Usando dados mock para investimentos');
        return MOCK_INVESTMENTS.filter(i => i.unitId === unitId)
                      .sort((a, b) => new Date(b.dataAplicacao).getTime() - new Date(a.dataAplicacao).getTime());
      }
      
      return investments.filter((i: Investment) => i.unitId === unitId)
                      .sort((a: Investment, b: Investment) => new Date(b.dataAplicacao).getTime() - new Date(a.dataAplicacao).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter investimentos:', error);
      return MOCK_INVESTMENTS.filter(i => i.unitId === unitId);
    }
  }

  /**
   * Calcular rentabilidade de investimento
   */
  static calculateInvestmentReturn(investment: Investment): number {
    if (investment.valorAplicado === 0) return 0;
    return ((investment.valorAtual - investment.valorAplicado) / investment.valorAplicado) * 100;
  }

  /**
   * Salvar empréstimo
   */
  static async saveLoan(loan: Loan): Promise<void> {
    try {
      const loans = await this.getLoans(loan.unitId);
      const existingIndex = loans.findIndex(l => l.id === loan.id);
      
      if (existingIndex >= 0) {
        loans[existingIndex] = {
          ...loan,
          updatedAt: new Date().toISOString()
        };
      } else {
        loans.push({
          ...loan,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.LOANS, loans);
      console.log('✅ Empréstimo salvo com sucesso:', loan.id);
    } catch (error) {
      console.error('❌ Erro ao salvar empréstimo:', error);
      throw error;
    }
  }

  /**
   * Obter empréstimos
   */
  static async getLoans(unitId: string): Promise<Loan[]> {
    try {
      const loans = await this.getFromStorage(this.STORAGE_KEYS.LOANS) || [];
      
      // Se não houver dados reais, usar mock
      if (loans.length === 0) {
        console.log('📊 Usando dados mock para empréstimos');
        return MOCK_LOANS.filter(l => l.unitId === unitId)
                      .sort((a, b) => new Date(b.dataContratacao).getTime() - new Date(a.dataContratacao).getTime());
      }
      
      return loans.filter((l: Loan) => l.unitId === unitId)
                    .sort((a: Loan, b: Loan) => new Date(b.dataContratacao).getTime() - new Date(a.dataContratacao).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter empréstimos:', error);
      return MOCK_LOANS.filter(l => l.unitId === unitId);
    }
  }

  /**
   * Gerar alertas de tesouraria
   */
  static async generateTreasuryAlerts(unitId: string): Promise<TreasuryAlert[]> {
    try {
      const alerts: TreasuryAlert[] = [];
      
      // Verificar saldos mínimos
      const accounts = await this.getTreasuryAccounts(unitId);
      for (const account of accounts) {
        if (account.saldo < account.alertas.saldoMinimo) {
          alerts.push({
            id: Math.random().toString(36).substr(2, 9),
            tipo: 'SALDO_MINIMO',
            titulo: 'Saldo Mínimo Atingido',
            descricao: `Conta ${account.nome} está abaixo do saldo mínimo de R$ ${account.alertas.saldoMinimo.toFixed(2)}`,
            gravidade: 'ALTA',
            contaId: account.id,
            valor: account.saldo,
            status: 'ATIVO',
            acoesSugeridas: [
              'Transferir fundos de outra conta',
              'Revisar pagamentos pendentes',
              'Considerar linha de crédito emergencial'
            ],
            dataCriacao: new Date().toISOString(),
            unitId,
            createdBy: 'system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        
        if (account.saldo > account.alertas.saldoMaximo) {
          alerts.push({
            id: Math.random().toString(36).substr(2, 9),
            tipo: 'SALDO_MAXIMO',
            titulo: 'Oportunidade de Investimento',
            descricao: `Conta ${account.nome} está acima do saldo máximo. Considere investir o excesso.`,
            gravidade: 'MEDIA',
            contaId: account.id,
            valor: account.saldo,
            status: 'ATIVO',
            acoesSugeridas: [
              'Aplicar em CDB/Tesouro Direto',
              'Investir em fundos de renda fixa',
              'Pagar dívidas de alto custo'
            ],
            dataCriacao: new Date().toISOString(),
            unitId,
            createdBy: 'system',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }

      // Verificar vencimentos de empréstimos
      const loans = await this.getLoans(unitId);
      const today = new Date();
      const next30Days = new Date();
      next30Days.setDate(today.getDate() + 30);

      for (const loan of loans) {
        if (loan.status === 'ATIVO') {
          const parcelasPendentes = loan.parcelas.filter(p => 
            p.status === 'PENDENTE' && 
            new Date(p.dataVencimento) <= next30Days
          );
          
          if (parcelasPendentes.length > 0) {
            alerts.push({
              id: Math.random().toString(36).substr(2, 9),
              tipo: 'VENCIMENTO',
              titulo: 'Vencimentos Próximos',
              descricao: `Empréstimo ${loan.nome} tem ${parcelasPendentes.length} parcelas vencendo nos próximos 30 dias`,
              gravidade: 'MEDIA',
              emprestimoId: loan.id,
              valor: parcelasPendentes.reduce((sum, p) => sum + p.valorParcela, 0),
              dataLimite: parcelasPendentes[0].dataVencimento,
              status: 'ATIVO',
              acoesSugeridas: [
                'Reservar fundos para pagamento',
                'Negociar parcelamento se necessário',
                'Verificar saldo disponível'
              ],
              dataCriacao: new Date().toISOString(),
              unitId,
              createdBy: 'system',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        }
      }

      // Salvar alertas gerados
      for (const alert of alerts) {
        await this.saveTreasuryAlert(alert);
      }

      console.log(`✅ ${alerts.length} alertas de tesouraria gerados com sucesso`);
      return alerts;
    } catch (error) {
      console.error('❌ Erro ao gerar alertas de tesouraria:', error);
      throw error;
    }
  }

  /**
   * Salvar alerta de tesouraria
   */
  static async saveTreasuryAlert(alert: TreasuryAlert): Promise<void> {
    try {
      const alerts = await this.getTreasuryAlerts(alert.unitId);
      const existingIndex = alerts.findIndex(a => a.id === alert.id);
      
      if (existingIndex >= 0) {
        alerts[existingIndex] = {
          ...alert,
          updatedAt: new Date().toISOString()
        };
      } else {
        alerts.push({
          ...alert,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.ALERTS, alerts);
      console.log('✅ Alerta de tesouraria salvo com sucesso:', alert.id);
    } catch (error) {
      console.error('❌ Erro ao salvar alerta de tesouraria:', error);
      throw error;
    }
  }

  /**
   * Obter alertas de tesouraria
   */
  static async getTreasuryAlerts(unitId: string): Promise<TreasuryAlert[]> {
    try {
      const alerts = await this.getFromStorage(this.STORAGE_KEYS.ALERTS) || [];
      
      // Se não houver dados reais, usar mock
      if (alerts.length === 0) {
        console.log('📊 Usando dados mock para alertas de tesouraria');
        return MOCK_TREASURY_ALERTS.filter(a => a.unitId === unitId)
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      return alerts.filter((a: TreasuryAlert) => a.unitId === unitId)
                      .sort((a: TreasuryAlert, b: TreasuryAlert) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter alertas de tesouraria:', error);
      return MOCK_TREASURY_ALERTS.filter(a => a.unitId === unitId);
    }
  }

  /**
   * Gerar posição financeira consolidada
   */
  static async generateFinancialPosition(unitId: string): Promise<FinancialPosition> {
    try {
      // Se não houver dados reais, retornar mock
      const accounts = await this.getFromStorage(this.STORAGE_KEYS.TREASURY_ACCOUNTS) || [];
      if (accounts.length === 0) {
        console.log('📊 Usando dados mock para posição financeira');
        return MOCK_FINANCIAL_POSITION;
      }
      
      // Obter dados das contas
      const treasuryAccounts = await this.getTreasuryAccounts(unitId);
      const investments = await this.getInvestments(unitId);
      const loans = await this.getLoans(unitId);
      const cashFlows = await this.getCashFlows(unitId);

      // Calcular totais
      const disponibilidades = treasuryAccounts.reduce((sum, acc) => sum + acc.saldoDisponivel, 0);
      const aplicacoes = investments.reduce((sum, inv) => sum + inv.valorAtual, 0);
      
      // Simular outros valores (em produção viriam de outros módulos)
      const contasReceber = 50000; // Simulação
      const estoques = 30000; // Simulação
      const ativoFixo = 200000; // Simulação
      const fornecedores = 25000; // Simulação
      const emprestimosValor = loans.reduce((sum, loan) => sum + loan.valorSaldo, 0);
      const outrasContas = 15000; // Simulação

      const ativoTotal = disponibilidades + aplicacoes + contasReceber + estoques + ativoFixo;
      const passivoTotal = fornecedores + emprestimosValor + outrasContas;
      const patrimonioLiquido = ativoTotal - passivoTotal;

      // Calcular indicadores
      const liquidezCorrente = (disponibilidades + contasReceber) / (fornecedores + outrasContas);
      const liquidezSeca = disponibilidades / (fornecedores + outrasContas);
      const endividamento = (emprestimosValor / ativoTotal) * 100;
      const rentabilidade = (patrimonioLiquido / 1000000) * 100; // Simulação

      // Criar detalhamento
      const detalhamento: FinancialPositionDetail[] = [
        {
          categoria: 'Ativo Circulante',
          subcategoria: 'Disponibilidades',
          valorAtual: disponibilidades,
          valorAnterior: disponibilidades * 0.95, // Simulação
          variacao: disponibilidades * 0.05,
          variacaoPercentual: 5,
          participacao: (disponibilidades / ativoTotal) * 100
        },
        {
          categoria: 'Ativo Circulante',
          subcategoria: 'Aplicações Financeiras',
          valorAtual: aplicacoes,
          valorAnterior: aplicacoes * 0.92, // Simulação
          variacao: aplicacoes * 0.08,
          variacaoPercentual: 8,
          participacao: (aplicacoes / ativoTotal) * 100
        }
      ];

      const position: FinancialPosition = {
        id: Math.random().toString(36).substr(2, 9),
        data: new Date().toISOString().split('T')[0],
        ativoTotal,
        passivoTotal,
        patrimonioLiquido,
        disponibilidades,
        aplicacoes,
        contasReceber,
        estoques,
        ativoFixo,
        fornecedores,
        emprestimos: emprestimosValor,
        outrasContas,
        variacaoPatrimonial: patrimonioLiquido * 0.03, // Simulação
        variacaoPercentual: 3, // Simulação
        indicadores: {
          liquidezCorrente,
          liquidezSeca,
          endividamento,
          rentabilidade
        },
        detalhamento,
        unitId,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.saveFinancialPosition(position);
      console.log('✅ Posição financeira gerada com sucesso:', position.id);
      
      return position;
    } catch (error) {
      console.error('❌ Erro ao gerar posição financeira:', error);
      throw error;
    }
  }

  /**
   * Salvar posição financeira
   */
  static async saveFinancialPosition(position: FinancialPosition): Promise<void> {
    try {
      const positions = await this.getFinancialPositions(position.unitId);
      const existingIndex = positions.findIndex(p => p.id === position.id);
      
      if (existingIndex >= 0) {
        positions[existingIndex] = {
          ...position,
          updatedAt: new Date().toISOString()
        };
      } else {
        positions.push({
          ...position,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.FINANCIAL_POSITIONS, positions);
      console.log('✅ Posição financeira salva com sucesso:', position.id);
    } catch (error) {
      console.error('❌ Erro ao salvar posição financeira:', error);
      throw error;
    }
  }

  /**
   * Obter posições financeiras
   */
  static async getFinancialPositions(unitId: string): Promise<FinancialPosition[]> {
    try {
      const positions = await this.getFromStorage(this.STORAGE_KEYS.FINANCIAL_POSITIONS) || [];
      return positions.filter((p: FinancialPosition) => p.unitId === unitId)
                        .sort((a: FinancialPosition, b: FinancialPosition) => new Date(b.data).getTime() - new Date(a.data).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter posições financeiras:', error);
      return [];
    }
  }

  /**
   * Obter saldo atual consolidado
   */
  static async getCurrentBalance(unitId: string): Promise<number> {
    try {
      const accounts = await this.getTreasuryAccounts(unitId);
      return accounts.reduce((sum, account) => sum + account.saldoDisponivel, 0);
    } catch (error) {
      console.error('❌ Erro ao obter saldo atual:', error);
      return 0;
    }
  }

  /**
   * Obter resumo para dashboard
   */
  static async getTreasurySummary(unitId: string): Promise<{
    saldoTotal: number;
    investimentosTotal: number;
    emprestimosTotal: number;
    alertasAtivos: number;
    rentabilidadeMedia: number;
    proximosVencimentos: number;
  }> {
    try {
      const accounts = await this.getTreasuryAccounts(unitId);
      const investments = await this.getInvestments(unitId);
      const loans = await this.getLoans(unitId);
      const alerts = await this.getTreasuryAlerts(unitId);

      const saldoTotal = accounts.reduce((sum, acc) => sum + acc.saldoDisponivel, 0);
      const investimentosTotal = investments.reduce((sum, inv) => sum + inv.valorAtual, 0);
      const emprestimosTotal = loans.reduce((sum, loan) => sum + loan.valorSaldo, 0);
      const alertasAtivos = alerts.filter(a => a.status === 'ATIVO').length;
      
      const rentabilidadeMedia = investments.length > 0
        ? investments.reduce((sum, inv) => sum + this.calculateInvestmentReturn(inv), 0) / investments.length
        : 0;

      const today = new Date();
      const next30Days = new Date();
      next30Days.setDate(today.getDate() + 30);
      
      const proximosVencimentos = loans.reduce((count, loan) => {
        return count + loan.parcelas.filter(p => 
          p.status === 'PENDENTE' && 
          new Date(p.dataVencimento) <= next30Days
        ).length;
      }, 0);

      return {
        saldoTotal,
        investimentosTotal,
        emprestimosTotal,
        alertasAtivos,
        rentabilidadeMedia,
        proximosVencimentos
      };
    } catch (error) {
      console.error('❌ Erro ao obter resumo de tesouraria:', error);
      return {
        saldoTotal: 0,
        investimentosTotal: 0,
        emprestimosTotal: 0,
        alertasAtivos: 0,
        rentabilidadeMedia: 0,
        proximosVencimentos: 0
      };
    }
  }

  /**
   * Salvar no IndexedDB
   */
  private static async saveToStorage(key: string, data: any): Promise<void> {
    try {
      if ('indexedDB' in window) {
        const request = indexedDB.open('treasury_db', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('treasury_data')) {
            db.createObjectStore('treasury_data');
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['treasury_data'], 'readwrite');
          const store = transaction.objectStore('treasury_data');
          store.put({ key, data, timestamp: Date.now() });
        };
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error('❌ Erro ao salvar no storage:', error);
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  /**
   * Obter do IndexedDB
   */
  private static async getFromStorage(key: string): Promise<any> {
    try {
      if ('indexedDB' in window) {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('treasury_db', 1);
          
          request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(['treasury_data'], 'readonly');
            const store = transaction.objectStore('treasury_data');
            const getRequest = store.get(key);
            
            getRequest.onsuccess = () => {
              resolve(getRequest.result?.data || null);
            };
            
            getRequest.onerror = () => {
              reject(getRequest.error);
            };
          };
          
          request.onerror = () => {
            reject(request.error);
          };
        });
      } else {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error('❌ Erro ao obter do storage:', error);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  }
}

export default TreasuryService;
