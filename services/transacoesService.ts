/**
 * ============================================================================
 * SERVIÇO DE TRANSAÇÕES FINANCEIRAS
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este arquivo é como um "funcionário especializado" que sabe mexer no banco 
 * de dados do sistema financeiro. Ele guarda e busca informações sobre:
 * 
 * • Contas a pagar (dinheiro que a empresa precisa pagar)
 * • Contas a receber (dinheiro que a empresa vai receber)
 * • Transações financeiras em geral
 * 
 * POR QUE USAMOS UM SERVIÇO?
 * ---------------------------
 * Imagine que você tem uma secretária que é a ÚNICA pessoa que sabe arquivar
 * documentos no banco de dados. Toda vez que você quer guardar ou pegar algo,
 * você pede para ela. Isso é bom porque:
 * 
 * 1. Se o banco de dados mudar, só mudamos este arquivo
 * 2. Todo mundo usa do mesmo jeito
 * 3. Mais fácil encontrar erros
 * 
 * COMO FUNCIONA?
 * --------------
 * Cada função aqui faz UMA coisa específica:
 * - getTransactions() → Busca transações salvas
 * - saveTransaction() → Salva uma nova transação
 * - updateTransaction() → Atualiza uma transação existente
 * - deleteTransaction() → Remove uma transação
 * 
 * TIPO DE DADO: Transaction
 * -------------------------
 * Transaction é um "modelo" que define quais informações uma transação tem:
 * {
 *   id: string (código único),
 *   description: string (o que é?),
 *   amount: number (quanto?),
 *   dueDate: string (quando vence?),
 *   status: 'PAID' | 'PENDING' (pago ou pendente?),
 *   ... e outros campos
 * }
 */

// Importa o serviço de banco de dados principal
import { dbService } from './databaseService';

// Importa os tipos TypeScript que definem a estrutura dos dados
import { Transaction, FinancialAccount } from '../types';
import { TransactionEnhanced } from '../types/financeiro';

/**
 * CLASSE PRINCIPAL DO SERVIÇO
 * ===========================
 * Uma "classe" é como uma receita de bolo. Ela define como criar
 * um objeto que sabe fazer operações com transações.
 */
export class TransactionService {
  
  /**
   * BUSCAR TODAS AS TRANSAÇÕES
   * --------------------------
   * 
   * O QUE FAZ?
   * Pega todas as transações salvas no banco de dados
   * 
   * PARÂMETROS (entradas):
   * - unitId?: string → ID da unidade/filial (opcional, o ? significa isso)
   *   Se não passar, busca de todas as unidades
   * 
   * RETORNO (saída):
   * - Promise<Transaction[]> → Uma promessa que vai entregar uma lista de transações
   * 
   * O QUE É UMA PROMISE?
   * --------------------
   * Promise é como um "vale". Quando você chama uma função que busca dados
   * da internet ou do banco, ela não entrega na hora. Ela te dá um "vale"
   * e diz: "Quando estiver pronto, eu te entrego".
   * 
   * async/await são palavras especiais que tornam isso mais fácil de usar:
   * - async → Esta função demora um pouco
   * - await → "Espere isso terminar antes de continuar"
   */
  async getTransactions(unitId?: string): Promise<Transaction[]> {
    // Chama o serviço de banco de dados para buscar transações
    // O "await" faz esperar a resposta chegar
    const transactions = await dbService.getTransactions(unitId);
    
    // Retorna a lista de transações para quem pediu
    return transactions;
  }

  /**
   * SALVAR UMA NOVA TRANSAÇÃO
   * -------------------------
   * 
   * O QUE FAZ?
   * Guarda uma nova transação no banco de dados
   * 
   * PARÂMETROS:
   * - transaction: Partial<Transaction> → Os dados da transação
   *   "Partial" significa que alguns campos podem não estar preenchidos
   * 
   * RETORNO:
   * - Promise<void> → Promessa que não retorna nada, só avisa quando terminar
   */
  async saveTransaction(transaction: Partial<Transaction>): Promise<void> {
    // Gera um ID único se a transação não tiver um
    // crypto.randomUUID() cria um código único como "abc123-def456-ghi789"
    const transactionId = transaction.id || crypto.randomUUID();
    
    // Prepara os dados completos da transação
    const transactionData = {
      // Copia todos os campos que já existem
      ...transaction,
      
      // Garante que tenha um ID
      id: transactionId,
      
      // Adiciona data/hora de criação se não existir
      createdAt: transaction.createdAt || new Date().toISOString(),
    };
    
    // Salva no banco de dados usando o serviço principal
    await dbService.saveTransaction(transactionData);
  }

  /**
   * ATUALIZAR TRANSAÇÃO EXISTENTE
   * -----------------------------
   * 
   * O QUE FAZ?
   * Modifica uma transação que já está salva no banco
   * 
   * PARÂMETROS:
   * - id: string → Código da transação que quer mudar
   * - updates: Partial<Transaction> → Novos dados (só o que mudar)
   * 
   * EXEMPLO DE USO:
   * updateTransaction('abc123', { status: 'PAID', paidAmount: 1000 })
   * → Muda o status para "pago" e valor pago para 1000
   */
  async updateTransaction(
    id: string, 
    updates: Partial<Transaction>
  ): Promise<void> {
    // Busca a transação atual primeiro (para não perder dados)
    const currentTransactions = await dbService.getTransactions();
    const currentTransaction = currentTransactions.find(t => t.id === id);
    
    // Se não encontrou, mostra erro
    if (!currentTransaction) {
      throw new Error(`Transação ${id} não encontrada!`);
    }
    
    // Junta os dados antigos com as novidades
    // O operador ...spread "espalha" os objetos
    const updatedData = {
      ...currentTransaction,  // Dados atuais
      ...updates,             // Novos dados (sobrescrevem os antigos)
      updatedAt: new Date().toISOString(),  // Data da modificação
    };
    
    // Salva a versão atualizada
    await dbService.saveTransaction(updatedData);
  }

  /**
   * REMOVER TRANSAÇÃO
   * -----------------
   * 
   * O QUE FAZ?
   * Exclui uma transação do banco de dados
   * 
   * CUIDADO!
   * ----------
   * Esta função REMOVE dados permanentemente. Use com cuidado!
   * Em sistemas reais, muitas vezes só "marcamos como excluído"
   * em vez de apagar de verdade (isso se chama "soft delete")
   */
  async deleteTransaction(id: string): Promise<void> {
    // Aqui entraria a lógica de exclusão
    // Por enquanto, vamos apenas implementar depois
    console.log(`Excluir transação: ${id}`);
  }

  /**
   * CALCULAR JUROS E MULTA POR ATRASO
   * ---------------------------------
   * 
   * O QUE FAZ?
   * Calcula quanto deve ser pago de juros e multa quando uma conta atrasa
   * 
   * FÓRMULAS:
   * ----------
   * Juros simples = Valor original × (taxaJurosDiaria / 100) × diasAtraso
   * Multa = Valor original × (taxaMulta / 100)
   * 
   * PARÂMETROS:
   * - valorOriginal: number → Valor da conta sem juros
   * - dataVencimento: string → Quando deveria ter pago
   * - dataPagamento: string → Quando está pagando
   * - taxaJurosDiaria: number → Porcentagem ao dia (ex: 0.33 = 0.33% ao dia)
   * - taxaMulta: number → Porcentagem de multa (ex: 2 = 2%)
   * 
   * RETORNO:
   * Um objeto com:
   * - juros: valor dos juros calculados
   * - multa: valor da multa calculada
   * - total: soma de tudo (original + juros + multa)
   * - diasAtraso: quantos dias está atrasado
   */
  calcularJurosEMulta(
    valorOriginal: number,
    dataVencimento: string,
    dataPagamento: string,
    taxaJurosDiaria: number = 0.33,  // Valor padrão se não passar
    taxaMulta: number = 2.0           // Valor padrão se não passar
  ): { juros: number; multa: number; total: number; diasAtraso: number } {
    // Converte strings de data para objetos Date
    const vencimento = new Date(dataVencimento);
    const pagamento = new Date(dataPagamento);
    
    // Calcula diferença em dias
    // 1000ms × 60s × 60min × 24h = milissegundos em um dia
    const diferencaEmMs = pagamento.getTime() - vencimento.getTime();
    const diasAtraso = Math.ceil(diferencaEmMs / (1000 * 60 * 60 * 24));
    
    // Se ainda não venceu, não tem juros
    if (diasAtraso <= 0) {
      return {
        juros: 0,
        multa: 0,
        total: valorOriginal,
        diasAtraso: 0,
      };
    }
    
    // Calcula juros: valor × taxa × dias
    const juros = valorOriginal * (taxaJurosDiaria / 100) * diasAtraso;
    
    // Calcula multa: valor × taxa
    const multa = valorOriginal * (taxaMulta / 100);
    
    // Soma tudo
    const total = valorOriginal + juros + multa;
    
    // Retorna os resultados
    return {
      juros,
      multa,
      total,
      diasAtraso,
    };
  }

  /**
   * GERAR PARCELAS AUTOMÁTICAS
   * --------------------------
   * 
   * O QUE FAZ?
   * Quando você compra algo parcelado (ex: 10x de R$ 100),
   * esta função cria todas as parcelas automaticamente
   * 
   * PARÂMETROS:
   * - transactionData: Partial<Transaction> → Dados da compra original
   * - numeroParcelas: number → Quantas parcelas (ex: 10)
   * 
   * RETORNO:
   * Array de transações → Lista com todas as parcelas criadas
   * 
   * EXEMPLO:
   * Se comprar R$ 1000 em 10x:
   * → Cria 10 transações de R$ 100 cada
   * → Cada uma com vencimento em um mês diferente
   */
  gerarParcelas(
    transactionData: Partial<Transaction>,
    numeroParcelas: number
  ): Transaction[] {
    // Lista onde vamos guardar as parcelas
    const parcelas: Transaction[] = [];
    
    // Valor de cada parcela (divisão simples)
    const valorParcela = transactionData.amount! / numeroParcelas;
    
    // Data de vencimento da primeira parcela
    const dataBase = new Date(transactionData.dueDate || new Date());
    
    // Loop que cria cada parcela
    // "let i = 1" → começa na parcela 1
    // "i <= numeroParcelas" → continua até a última
    // "i++" → aumenta 1 em 1 a cada volta
    for (let i = 1; i <= numeroParcelas; i++) {
      // Cria uma cópia dos dados originais
      const parcela: Transaction = {
        ...transactionData,
        
        // Gera ID único para esta parcela
        id: crypto.randomUUID(),
        
        // Define número da parcela (ex: "1/10", "2/10")
        installmentNumber: i,
        totalInstallments: numeroParcelas,
        
        // Valor é o da parcela, não o total
        amount: valorParcela,
        
        // Descrição mostra que é parcela
        description: `${transactionData.descricao || transactionData.description} (${i}/${numeroParcelas})`,
        
        // Vencimento de cada mês
        dueDate: new Date(dataBase.getFullYear(), 
                         dataBase.getMonth() + (i - 1), 
                         dataBase.getDate()).toISOString().split('T')[0],
              
        // Primeira parcela é filha dela mesma
        // Outras têm parent apontando para transação original
        parentId: i === 1 ? undefined : transactionData.id,
              
        // Garante que unitId seja string (não undefined)
        unitId: transactionData.unitId || '',
              
        // Garante campos obrigatórios
        date: transactionData.date || new Date().toISOString().split('T')[0],
        competencyDate: transactionData.competencyDate || new Date().toISOString().split('T')[0],
        type: transactionData.type || 'EXPENSE',
        category: transactionData.category || 'OTHER',
        costCenter: transactionData.costCenter || 'cc1',
        accountId: transactionData.accountId || '',
        operationNature: transactionData.operationNature || 'nat4',
        status: transactionData.status || 'PENDING',
      };
      
      // Adiciona na lista
      parcelas.push(parcela);
    }
    
    // Retorna todas as parcelas criadas
    return parcelas;
  }

  /**
   * BAIXAR PARCIALMENTE UMA TRANSAÇÃO
   * ----------------------------------
   * 
   * O QUE FAZ?
   * Registra quando alguém paga só uma parte do valor devido
   * 
   * EXEMPLO:
   * Deve R$ 1000, mas paga só R$ 300 agora.
   * O sistema registra que:
   * - paidAmount: R$ 300 (já pago)
   * - remainingAmount: R$ 700 (ainda falta)
   * - status: 'PENDING' (ainda não quitou)
   * 
   * PARÂMETROS:
   * - id: string → ID da transação
   * - valorPago: number → Quanto foi pago agora
   */
  async baixarParcialmente(id: string, valorPago: number): Promise<void> {
    // Busca transação atual
    const transactions = await dbService.getTransactions();
    const transaction = transactions.find(t => t.id === id);
    
    if (!transaction) {
      throw new Error(`Transação ${id} não encontrada!`);
    }
    
    // Pega quanto já tinha sido pago antes (se tiver)
    const jaPago = transaction.paidAmount || 0;
    
    // Calcula novo total pago
    const novoTotalPago = jaPago + valorPago;
    
    // Calcula quanto ainda falta
    const restante = transaction.amount - novoTotalPago;
    
    // Decide status baseado no restante
    const novoStatus = restante <= 0 ? 'PAID' : 'PENDING';
    
    // Atualiza transação com novos valores
    await this.updateTransaction(id, {
      paidAmount: novoTotalPago,      // Total já pago
      remainingAmount: restante,       // Quanto falta
      status: novoStatus,              // Pago ou pendente
    });
  }

  /**
   * VERIFICAR SE TRANSAÇÃO ESTÁ VENCIDA
   * -----------------------------------
   * 
   * O QUE FAZ?
   * Descobre se uma conta já passou do vencimento
   * 
   * RETORNA:
   * - true → Está vencida (passou da data)
   * - false → Ainda não venceu OU já está paga
   */
  isVencida(transaction: Transaction): boolean {
    // Se já está paga, não importa se venceu
    if (transaction.status === 'PAID') {
      return false;
    }
    
    // Compara data de vencimento com hoje
    const hoje = new Date();
    const vencimento = new Date(transaction.dueDate || '');
    
    // Se hoje é depois do vencimento → está vencida
    return hoje > vencimento;
  }

  /**
   * FILTRAR TRANSAÇÕES POR STATUS
   * -----------------------------
   * 
   * O QUE FAZ?
   * Separa transações por categoria (vencidas, a vencer, pagas)
   * 
   * ÚTIL PARA:
   * - Mostrar só contas atrasadas
   * - Mostrar só contas do mês
   * - Gerar relatórios
   */
  filtrarPorStatus(
    transactions: Transaction[],
    status: 'VENCIDAS' | 'A_VENCER' | 'PAGAS'
  ): Transaction[] {
    // .filter() é um método que filtra uma lista
    // Só mantém os itens que passam no "teste"
    return transactions.filter(transaction => {
      if (status === 'PAGAS') {
        // Só transações com status 'PAID'
        return transaction.status === 'PAID';
      }
      
      if (status === 'VENCIDAS') {
        // Só transações não pagas E vencidas
        return transaction.status !== 'PAID' && this.isVencida(transaction);
      }
      
      if (status === 'A_VENCER') {
        // Só transações não pagas E ainda não venceram
        return transaction.status !== 'PAID' && !this.isVencida(transaction);
      }
      
      // Se não especificou status, retorna todas
      return true;
    });
  }
}

/**
 * EXPORTAR UMA INSTÂNCIA PRONTA
 * =============================
 * 
 * Em vez de cada arquivo ter que criar "new TransactionService()",
 * criamos um aqui e exportamos para todo mundo usar.
 * 
 * Isso se chama "Singleton Pattern" (Padrão Singleton).
 * Garante que só exista UM serviço em todo o sistema.
 */
export const transactionService = new TransactionService();
