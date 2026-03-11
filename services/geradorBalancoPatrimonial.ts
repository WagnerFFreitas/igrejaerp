/**
 * ============================================================================
 * GERADOR DE BALANÇO E DEMONSTRAÇÕES CONTÁBEIS
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este service gera automaticamente as demonstrações contábeis:
 * - Balanço Patrimonial (Ativo, Passivo e PL)
 * - Demonstração de Resultado do Exercício (DRE)
 * - Demonstração de Fluxo de Caixa (DFC)
 * 
 * BALANÇO PATRIMONIAL:
 * --------------------
 * Foto da situação financeira em uma data específica.
 * Estrutura:
 * ATIVO                    | PASSIVO + PL
 * ────────────────────────┼────────────────────
 * Circulante              | Circulante
 * Não Circulante          | Não Circulante
 *                         | Patrimônio Líquido
 * ════════════════════════╪══════════════════════
 * TOTAL DO ATIVO          | TOTAL PASSIVO + PL
 * 
 * DRE:
 * ----
 * Mostra resultado (lucro/prejuízo) de um período.
 * Estrutura:
 * (+) Receitas
 * (-) Custos
 * (=) Lucro Bruto
 * (-) Despesas Operacionais
 * (=) Lucro Operacional
 * (+/-) Outras Receitas/Despesas
 * (=) Lucro Líquido
 * 
 * ANALOGIA:
 * ---------
 * Pense como "relatório médico financeiro":
 * - Balanço = Raio-X (foto estática)
 * - DRE = Exame de sangue (evolução no tempo)
 */

import { BalanceSheet, IncomeStatement, TrialBalance, ChartOfAccount, AccountBalance } from '../types';

/**
 * CLASSE DO GERADOR DE BALANÇO
 * ============================
 */
export class BalanceSheetGenerator {

  /**
   * GERAR BALANÇO PATRIMONIAL
   * -------------------------
   * 
   * O QUE FAZ?
   * Monta balanço completo a partir do balancete
   * 
   * PARÂMETROS:
   * - trialBalance: TrialBalance → Balancete de verificação
   * - accounts: ChartOfAccount[] → Plano de contas
   * - period: string → Período (YYYY-MM)
   * 
   * RETORNO:
   * BalanceSheet → Balanço Patrimonial completo
   */
  generateBalanceSheet(
    trialBalance: TrialBalance,
    accounts: ChartOfAccount[],
    period: string
  ): BalanceSheet {
    // 1. Separa contas por grupo
    const currentAssets = this.getAssetAccounts(trialBalance.accounts, 'CURRENT', accounts);
    const nonCurrentAssets = this.getAssetAccounts(trialBalance.accounts, 'NON_CURRENT', accounts);
    
    const currentLiabilities = this.getLiabilityAccounts(trialBalance.accounts, 'CURRENT', accounts);
    const nonCurrentLiabilities = this.getLiabilityAccounts(trialBalance.accounts, 'NON_CURRENT', accounts);
    
    const equityAccounts = trialBalance.accounts.filter(a => a.nature === 'EQUITY');
    
    // 2. Calcula totais
    const totalAssets = 
      this.sumAccounts(currentAssets) + 
      this.sumAccounts(nonCurrentAssets);
    
    const totalLiabilities = 
      this.sumAccounts(currentLiabilities) + 
      this.sumAccounts(nonCurrentLiabilities);
    
    const totalEquity = this.sumAccounts(equityAccounts);
    
    // 3. Adiciona resultado do exercício ao PL
    const netResult = trialBalance.totalIncome - trialBalance.totalExpense;
    const adjustedEquity = totalEquity + netResult;
    
    // 4. Verifica equilíbrio
    const totalLiabilitiesAndEquity = totalLiabilities + adjustedEquity;
    const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;
    
    // 5. Monta balanço
    return {
      period,
      generatedAt: new Date().toISOString(),
      assets: {
        current: currentAssets,
        nonCurrent: nonCurrentAssets,
      },
      liabilities: {
        current: currentLiabilities,
        nonCurrent: nonCurrentLiabilities,
      },
      equity: equityAccounts,
      totalAssets,
      totalLiabilitiesAndEquity,
      isBalanced,
    };
  }

  /**
   * GERAR DRE - DEMONSTRAÇÃO DE RESULTADO
   * -------------------------------------
   * 
   * O QUE FAZ?
   * Monta DRE completa a partir do balancete
   * 
   * PARÂMETROS:
   * - trialBalance: TrialBalance
   * - accounts: ChartOfAccount[]
   * - period: string
   * 
   * RETORNO:
   * IncomeStatement → DRE completa
   */
  generateIncomeStatement(
    trialBalance: TrialBalance,
    accounts: ChartOfAccount[],
    period: string
  ): IncomeStatement {
    // 1. Identifica receitas e despesas
    const incomeAccounts = trialBalance.accounts.filter(a => a.nature === 'INCOME');
    const expenseAccounts = trialBalance.accounts.filter(a => a.nature === 'EXPENSE');
    
    // 2. Classifica receitas
    const grossRevenue = this.sumAccountsByCode(incomeAccounts, ['4.1', '4.2', '4.3']);
    const otherIncome = this.sumAccountsByCode(incomeAccounts, ['4.4', '4.5']);
    
    // 3. Classifica despesas
    const costOfServices = this.sumAccountsByCode(expenseAccounts, ['5.1']);
    const administrativeExpenses = this.sumAccountsByCode(expenseAccounts, ['5.6']);
    const generalExpenses = this.sumAccountsByCode(expenseAccounts, ['5.2', '5.3']);
    const otherExpenses = this.sumAccountsByCode(expenseAccounts, [], true); // Restante
    
    // 4. Calcula resultados
    const netRevenue = grossRevenue; // Igrejas geralmente não têm deduções
    const grossProfit = netRevenue - costOfServices;
    
    const operatingExpenses = {
      administrative: administrativeExpenses,
      general: generalExpenses,
      other: 0,
    };
    
    const operatingResult = grossProfit - operatingExpenses.administrative - operatingExpenses.general;
    
    // 5. Resultado líquido (igrejas são isentas na maioria dos casos)
    const netResultBeforeTaxes = operatingResult + otherIncome - otherExpenses;
    const incomeTax = 0;  // Isenção para igrejas
    const socialContribution = 0;  // Isenção
    const netResult = netResultBeforeTaxes;
    
    // 6. Calcula margens
    const grossMargin = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;
    const operatingMargin = netRevenue > 0 ? (operatingResult / netRevenue) * 100 : 0;
    const netMargin = netRevenue > 0 ? (netResult / netRevenue) * 100 : 0;
    
    // 7. Retorna DRE
    return {
      period,
      generatedAt: new Date().toISOString(),
      grossRevenue,
      deductions: 0,
      netRevenue,
      costOfServices,
      grossProfit,
      operatingExpenses,
      operatingResult,
      otherIncome,
      otherExpenses,
      netResultBeforeTaxes,
      incomeTax,
      socialContribution,
      netResult,
      grossMargin,
      operatingMargin,
      netMargin,
    };
  }

  /**
   * OBTER CONTAS DO ATIVO
   * ---------------------
   */
  private getAssetAccounts(
    accounts: AccountBalance[],
    category: 'CURRENT' | 'NON_CURRENT',
    chartOfAccounts: ChartOfAccount[]
  ): AccountBalance[] {
    return accounts.filter(acc => {
      if (acc.nature !== 'ASSET') return false;
      
      // Determina se é circulante ou não pelo código
      const isFirstDigit = acc.accountCode.charAt(0);
      const isSecondLevel = acc.accountCode.split('.').length >= 2;
      const secondDigit = acc.accountCode.split('.')[1];
      
      if (category === 'CURRENT') {
        // Ativo Circulante: códigos começando com 1.1
        return isFirstDigit === '1' && secondDigit === '1';
      } else {
        // Ativo Não Circulante: códigos começando com 1.2
        return isFirstDigit === '1' && secondDigit === '2';
      }
    });
  }

  /**
   * OBTER CONTAS DO PASSIVO
   * -----------------------
   */
  private getLiabilityAccounts(
    accounts: AccountBalance[],
    category: 'CURRENT' | 'NON_CURRENT',
    chartOfAccounts: ChartOfAccount[]
  ): AccountBalance[] {
    return accounts.filter(acc => {
      if (acc.nature !== 'LIABILITY') return false;
      
      // Simplificação: tudo como circulante por enquanto
      return category === 'CURRENT';
    });
  }

  /**
   * SOMAR SALDOS DE CONTAS
   * ----------------------
   */
  private sumAccounts(accounts: AccountBalance[]): number {
    return accounts.reduce((sum, acc) => sum + acc.closingBalance, 0);
  }

  /**
   * SOMAR CONTAS POR CÓDIGO
   * -----------------------
   */
  private sumAccountsByCode(
    accounts: AccountBalance[],
    prefixes: string[],
    excludePrefixes?: boolean
  ): number {
    let filtered = accounts;
    
    if (prefixes.length > 0) {
      filtered = accounts.filter(acc => 
        prefixes.some(prefix => acc.accountCode.startsWith(prefix))
      );
    }
    
    return filtered.reduce((sum, acc) => sum + acc.closingBalance, 0);
  }

  /**
   * FORMATAR BALANÇO PARA TEXTO
   * ---------------------------
   */
  formatBalanceSheetToText(balanceSheet: BalanceSheet): string {
    const lines: string[] = [];
    
    lines.push('═'.repeat(80));
    lines.push('BALANÇO PATRIMONIAL');
    lines.push(`Período: ${balanceSheet.period}`);
    lines.push('═'.repeat(80));
    lines.push('');
    lines.push('ATIVO');
    lines.push('─'.repeat(80));
    
    // Ativo Circulante
    lines.push('  ATIVO CIRCULANTE');
    balanceSheet.assets.current.forEach(acc => {
      lines.push(`    ${acc.accountCode} - ${acc.accountName.padEnd(40)} R$ ${acc.closingBalance.toFixed(2)}`);
    });
    lines.push(`    Total do Ativo Circulante: R$ ${this.sumAccounts(balanceSheet.assets.current).toFixed(2)}`);
    lines.push('');
    
    // Ativo Não Circulante
    lines.push('  ATIVO NÃO CIRCULANTE');
    balanceSheet.assets.nonCurrent.forEach(acc => {
      lines.push(`    ${acc.accountCode} - ${acc.accountName.padEnd(40)} R$ ${acc.closingBalance.toFixed(2)}`);
    });
    lines.push(`    Total do Ativo Não Circulante: R$ ${this.sumAccounts(balanceSheet.assets.nonCurrent).toFixed(2)}`);
    lines.push('');
    
    lines.push(`  ═══ TOTAL DO ATIVO: R$ ${balanceSheet.totalAssets.toFixed(2)} ═══`);
    lines.push('');
    lines.push('PASSIVO E PATRIMÔNIO LÍQUIDO');
    lines.push('─'.repeat(80));
    
    // Passivo Circulante
    lines.push('  PASSIVO CIRCULANTE');
    balanceSheet.liabilities.current.forEach(acc => {
      lines.push(`    ${acc.accountCode} - ${acc.accountName.padEnd(40)} R$ ${acc.closingBalance.toFixed(2)}`);
    });
    lines.push('');
    
    // Patrimônio Líquido
    lines.push('  PATRIMÔNIO LÍQUIDO');
    balanceSheet.equity.forEach(acc => {
      lines.push(`    ${acc.accountCode} - ${acc.accountName.padEnd(40)} R$ ${acc.closingBalance.toFixed(2)}`);
    });
    lines.push('');
    
    lines.push(`  ═══ TOTAL PASSIVO + PL: R$ ${balanceSheet.totalLiabilitiesAndEquity.toFixed(2)} ═══`);
    lines.push('');
    
    if (balanceSheet.isBalanced) {
      lines.push('✓ Balanço equilibrado!');
    } else {
      lines.push('⚠ ALERTA: Balanço desequilibrado!');
    }
    
    return lines.join('\n');
  }

  /**
   * FORMATAR DRE PARA TEXTO
   * -----------------------
   */
  formatIncomeStatementToText(dre: IncomeStatement): string {
    const lines: string[] = [];
    
    lines.push('═'.repeat(80));
    lines.push('DRE - DEMONSTRAÇÃO DE RESULTADO DO EXERCÍCIO');
    lines.push(`Período: ${dre.period}`);
    lines.push('═'.repeat(80));
    lines.push('');
    
    lines.push('(+) RECEITAS BRUTAS');
    lines.push(`    Receita Bruta: R$ ${dre.grossRevenue.toFixed(2)}`);
    lines.push('');
    
    lines.push('(=) RECEITA LÍQUIDA');
    lines.push(`    ${dre.netRevenue.toFixed(2)}`);
    lines.push('');
    
    lines.push('(-) CUSTOS DOS SERVIÇOS');
    lines.push(`    ${dre.costOfServices.toFixed(2)}`);
    lines.push('');
    
    lines.push('(=) LUCRO BRUTO');
    lines.push(`    ${dre.grossProfit.toFixed(2)} (${dre.grossMargin.toFixed(2)}%)`);
    lines.push('');
    
    lines.push('(-) DESPESAS OPERACIONAIS');
    lines.push(`    Administrativas: R$ ${dre.operatingExpenses.administrative.toFixed(2)}`);
    lines.push(`    Gerais: R$ ${dre.operatingExpenses.general.toFixed(2)}`);
    lines.push('');
    
    lines.push('(=) LUCRO OPERACIONAL');
    lines.push(`    ${dre.operatingResult.toFixed(2)} (${dre.operatingMargin.toFixed(2)}%)`);
    lines.push('');
    
    lines.push('(+) OUTRAS RECEITAS');
    lines.push(`    ${dre.otherIncome.toFixed(2)}`);
    lines.push('');
    
    lines.push('(-) OUTRAS DESPESAS');
    lines.push(`    ${dre.otherExpenses.toFixed(2)}`);
    lines.push('');
    
    lines.push('(=) RESULTADO ANTES TRIBUTOS');
    lines.push(`    ${dre.netResultBeforeTaxes.toFixed(2)}`);
    lines.push('');
    
    lines.push('(-) IMPOSTOS');
    lines.push(`    IRPJ: R$ ${dre.incomeTax.toFixed(2)}`);
    lines.push(`    CSLL: R$ ${dre.socialContribution.toFixed(2)}`);
    lines.push('');
    
    lines.push('(=) LUCRO LÍQUIDO');
    lines.push(`    ${dre.netResult.toFixed(2)} (${dre.netMargin.toFixed(2)}%)`);
    lines.push('');
    lines.push('═'.repeat(80));
    
    return lines.join('\n');
  }
}

/**
 * EXPORTAR INSTÂNCIA PRONTA
 * =========================
 */
export const balanceSheetGenerator = new BalanceSheetGenerator();
