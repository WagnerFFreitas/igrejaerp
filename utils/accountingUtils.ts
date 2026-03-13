/**
 * ============================================================================
 * UTILITÁRIOS CONTÁBEIS PARA IGREJAS
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este arquivo contém funções auxiliares para operações contábeis,
 * incluindo plano de contas padrão para igrejas e formatações.
 * 
 * PLANO DE CONTAS SUGERIDO PARA IGREJAS:
 * --------------------------------------
 * 1 - ATIVO
 *   1.1 - Ativo Circulante
 *     1.1.01 - Caixa e Equivalentes
 *     1.1.02 - Aplicações Financeiras
 *     1.1.03 - Contas a Receber
 *   1.2 - Ativo Não Circulante
 *     1.2.01 - Imóveis
 *     1.2.02 - Veículos
 *     1.2.03 - Equipamentos
 * 
 * 2 - PASSIVO
 *   2.1 - Passivo Circulante
 *     2.1.01 - Fornecedores
 *     2.1.02 - Obrigações Trabalhistas
 *     2.1.03 - Obrigações Tributárias
 *   2.2 - Passivo Não Circulante
 * 
 * 3 - PATRIMÔNIO LÍQUIDO
 *   3.1 - Capital Social
 *   3.2 - Reservas
 *   3.3 - Superávits/Déficits Acumulados
 * 
 * 4 - RECEITAS
 *   4.1 - Dízimos
 *   4.2 - Ofertas
 *   4.3 - Contribuições para Eventos
 *   4.4 - Doações
 *   4.5 - Outras Receitas
 * 
 * 5 - DESPESAS
 *   5.1 - Pessoal e Encargos
 *   5.2 - Manutenção e Conservação
 *   5.3 - Utilities (água, luz, telefone)
 *   5.4 - Missões e Evangelismo
 *   5.5 - Educação Cristã
 *   5.6 - Administrativas
 * 
 * ANALOGIA:
 * ---------
 * Pense como um "dicionário contábil":
 * - Cada conta tem código único
 * - Hierarquia bem definida
 * - Fácil localização
 */

import { ChartOfAccount, AccountNature, AccountType } from '../types';

/**
 * PLANO DE CONTAS PADRÃO PARA IGREJAS
 * ====================================
 * 
 * O QUE É?
 * Estrutura completa de contas contábeis prontas para uso
 * 
 * RETORNO:
 * ChartOfAccount[] → Lista de contas pré-configuradas
 */
export function getDefaultChartOfAccounts(unitId: string): ChartOfAccount[] {
  const accounts: ChartOfAccount[] = [
    
    // ==================== ATIVO CIRCULANTE ====================
    {
      id: 'acc-1',
      unitId,
      code: '1.1.01.001',
      name: 'Caixa',
      nature: 'ASSET',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-2',
      unitId,
      code: '1.1.01.002',
      name: 'Bancos Conta Movimento',
      nature: 'ASSET',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-3',
      unitId,
      code: '1.1.02.001',
      name: 'Aplicações Financeiras',
      nature: 'ASSET',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-4',
      unitId,
      code: '1.1.03.001',
      name: 'Dízimos a Receber',
      nature: 'ASSET',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-5',
      unitId,
      code: '1.1.03.002',
      name: 'Ofertas a Receber',
      nature: 'ASSET',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    
    // ==================== ATIVO NÃO CIRCULANTE ====================
    {
      id: 'acc-6',
      unitId,
      code: '1.2.01.001',
      name: 'Terrenos',
      nature: 'ASSET',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-7',
      unitId,
      code: '1.2.01.002',
      name: 'Edificações',
      nature: 'ASSET',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-8',
      unitId,
      code: '1.2.02.001',
      name: 'Veículos',
      nature: 'ASSET',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-9',
      unitId,
      code: '1.2.03.001',
      name: 'Equipamentos de Som',
      nature: 'ASSET',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-10',
      unitId,
      code: '1.2.03.002',
      name: 'Móveis e Utensílios',
      nature: 'ASSET',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    
    // ==================== PASSIVO CIRCULANTE ====================
    {
      id: 'acc-11',
      unitId,
      code: '2.1.01.001',
      name: 'Fornecedores',
      nature: 'LIABILITY',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    {
      id: 'acc-12',
      unitId,
      code: '2.1.02.001',
      name: 'Salários a Pagar',
      nature: 'LIABILITY',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    {
      id: 'acc-13',
      unitId,
      code: '2.1.02.002',
      name: 'INSS a Recolher',
      nature: 'LIABILITY',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    {
      id: 'acc-14',
      unitId,
      code: '2.1.02.003',
      name: 'FGTS a Recolher',
      nature: 'LIABILITY',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    {
      id: 'acc-15',
      unitId,
      code: '2.1.03.001',
      name: 'Impostos a Recolher',
      nature: 'LIABILITY',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    
    // ==================== PATRIMÔNIO LÍQUIDO ====================
    {
      id: 'acc-16',
      unitId,
      code: '3.1.01.001',
      name: 'Capital Social',
      nature: 'EQUITY',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    {
      id: 'acc-17',
      unitId,
      code: '3.2.01.001',
      name: 'Reserva de Caixa',
      nature: 'EQUITY',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    {
      id: 'acc-18',
      unitId,
      code: '3.3.01.001',
      name: 'Superávits Acumulados',
      nature: 'EQUITY',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    
    // ==================== RECEITAS ====================
    {
      id: 'acc-19',
      unitId,
      code: '4.1.01.001',
      name: 'Dízimos',
      nature: 'INCOME',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    {
      id: 'acc-20',
      unitId,
      code: '4.2.01.001',
      name: 'Ofertas',
      nature: 'INCOME',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    {
      id: 'acc-21',
      unitId,
      code: '4.3.01.001',
      name: 'Contribuições para Eventos',
      nature: 'INCOME',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    {
      id: 'acc-22',
      unitId,
      code: '4.4.01.001',
      name: 'Doações Recebidas',
      nature: 'INCOME',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    {
      id: 'acc-23',
      unitId,
      code: '4.5.01.001',
      name: 'Outras Receitas',
      nature: 'INCOME',
      type: 'ANALYTIC',
      normalBalance: 'CREDIT',
      isActive: true,
    },
    
    // ==================== DESPESAS ====================
    {
      id: 'acc-24',
      unitId,
      code: '5.1.01.001',
      name: 'Salários',
      nature: 'EXPENSE',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-25',
      unitId,
      code: '5.1.01.002',
      name: 'Pró-labore',
      nature: 'EXPENSE',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-26',
      unitId,
      code: '5.1.01.003',
      name: 'Encargos Sociais',
      nature: 'EXPENSE',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-27',
      unitId,
      code: '5.2.01.001',
      name: 'Manutenção Predial',
      nature: 'EXPENSE',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-28',
      unitId,
      code: '5.3.01.001',
      name: 'Energia Elétrica',
      nature: 'EXPENSE',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-29',
      unitId,
      code: '5.3.01.002',
      name: 'Água e Esgoto',
      nature: 'EXPENSE',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-30',
      unitId,
      code: '5.3.01.003',
      name: 'Telefone/Internet',
      nature: 'EXPENSE',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-31',
      unitId,
      code: '5.4.01.001',
      name: 'Missões',
      nature: 'EXPENSE',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-32',
      unitId,
      code: '5.5.01.001',
      name: 'Educação Cristã',
      nature: 'EXPENSE',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
    {
      id: 'acc-33',
      unitId,
      code: '5.6.01.001',
      name: 'Material de Escritório',
      nature: 'EXPENSE',
      type: 'ANALYTIC',
      normalBalance: 'DEBIT',
      isActive: true,
    },
  ];
  
  return accounts;
}

/**
 * MAPEAR CATEGORIA FINANCEIRA PARA CONTA CONTÁBIL
 * -----------------------------------------------
 * 
 * O QUE FAZ?
 * Converte categoria de transação financeira em conta contábil
 * 
 * PARÂMETROS:
 * - category: string → Categoria da transação (ex: 'Dizimo', 'OFFERING')
 * - isIncome: boolean → Se é receita (true) ou despesa (false)
 * 
 * RETORNO:
 * string → Código da conta contábil
 */
export function mapCategoryToAccount(
  category: string,
  isIncome: boolean
): string {
  if (isIncome) {
    // Receitas
    switch (category.toUpperCase()) {
      case 'DIZIMO':
        return '4.1.01.001';  // Dízimos
      case 'OFFERING':
        return '4.2.01.001';  // Ofertas
      case 'EVENT':
        return '4.3.01.001';  // Eventos
      case 'DONATION':
        return '4.4.01.001';  // Doações
      default:
        return '4.5.01.001';  // Outras Receitas
    }
  } else {
    // Despesas
    switch (category.toUpperCase()) {
      case 'SALARY':
        return '5.1.01.001';  // Salários
      case 'PRO_LABORE':
        return '5.1.01.002';  // Pró-labore
      case 'PAYROLL_TAXES':
        return '5.1.01.003';  // Encargos
      case 'MAINTENANCE':
        return '5.2.01.001';  // Manutenção
      case 'UTILITIES':
        return '5.3.01.001';  // Utilities
      case 'MISSIONS':
        return '5.4.01.001';  // Missões
      case 'EDUCATION':
        return '5.5.01.001';  // Educação
      default:
        return '5.6.01.001';  // Administrativas
    }
  }
}

/**
 * FORMATAR CÓDIGO DE CONTA
 * ------------------------
 * 
 * O QUE FAZ?
 * Valida e formata código no padrão XXX.XX.XXX.XXX
 * 
 * PARÂMETRO:
 * - code: string → Código da conta
 * 
 * RETORNO:
 * string → Código formatado
 */
export function formatAccountCode(code: string): string {
  // Remove caracteres não numéricos
  const clean = code.replace(/\D/g, '');
  
  // Formata com pontos
  const parts = [];
  let index = 0;
  const sizes = [1, 2, 3, 3]; // Estrutura: 1.2.3.3
  
  for (const size of sizes) {
    if (index < clean.length) {
      parts.push(clean.substring(index, index + size));
      index += size;
    }
  }
  
  return parts.join('.');
}

/**
 * OBTER NOME DA NATUREZA CONTÁBIL
 * --------------------------------
 */
export function getNatureName(nature: AccountNature): string {
  const names: Record<AccountNature, string> = {
    ASSET: 'Ativo',
    LIABILITY: 'Passivo',
    EQUITY: 'Patrimônio Líquido',
    INCOME: 'Receita',
    EXPENSE: 'Despesa',
  };
  
  return names[nature];
}

/**
 * CALCULAR SALDO DE CONTA
 * -----------------------
 * 
 * O QUE FAZ?
 * Determina saldo baseado na natureza e lançamentos
 * 
 * PARÂMETROS:
 * - nature: AccountNature
 * - debits: number
 * - credits: number
 * 
 * RETORNO:
 * number → Saldo da conta
 */
export function calculateAccountBalance(
  nature: AccountNature,
  debits: number,
  credits: number
): number {
  // Contas de Ativo e Despesa têm saldo devedor
  if (nature === 'ASSET' || nature === 'EXPENSE') {
    return debits - credits;
  }
  
  // Contas de Passivo, PL e Receita têm saldo credor
  return credits - debits;
}

/**
 * VALIDAR LANÇAMENTO CONTÁBIL
 * ---------------------------
 * 
 * O QUE FAZ?
 * Verifica se lançamento está equilibrado (débitos = créditos)
 * 
 * PARÂMETROS:
 * - debits: number
 * - credits: number
 * 
 * RETORNO:
 * { valid: boolean, difference: number }
 */
export function validateEntry(debits: number, credits: number): {
  valid: boolean;
  difference: number;
} {
  const difference = Math.abs(debits - credits);
  
  return {
    valid: difference < 0.01,  // Tolerância de 1 centavo
    difference,
  };
}
