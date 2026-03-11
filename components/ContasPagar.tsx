/**
 * ============================================================================
 * COMPONENTE DE CONTAS A PAGAR
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este é um componente React que mostra a tela de "Contas a Pagar" do sistema.
 * Ele permite que o usuário:
 * 
 * • Veja todas as contas que precisa pagar
 * • Filtre por status (vencidas, a vencer, pagas)
 * • Cadastre novas contas
 * • Baixe pagamentos (marque como pago)
 * • Calcule juros e multa automaticamente
 * 
 * O QUE É REACT?
 * --------------
 * React é uma biblioteca para criar interfaces de usuário.
 * Pense nele como "peças de LEGO" que você encaixa para formar a tela.
 * Cada componente é uma peça que pode ter:
 * - Estado (dados que mudam)
 * - Props (dados que recebe de fora)
 * - Renderização (como aparece na tela)
 * 
 * COMO FUNCIONA?
 * --------------
 * 1. O componente carrega dados do banco (via transactionService)
 * 2. Guarda no estado (useState)
 * 3. Mostra na tela (return com JSX)
 * 4. Atualiza quando algo muda
 */

import React, { useState, useEffect } from 'react';
import { 
  // Ícones da biblioteca Lucide React
  // Cada ícone é um componente SVG pronto
  DollarSign,        // Símbolo de dólar (usa para dinheiro)
  Calendar,          // Calendário (datas)
  CheckCircle,       // Check (confirmado/pago)
  AlertCircle,       // Alerta (atraso)
  Plus,              // Mais (adicionar)
  Search,            // Lupa (buscar)
  Filter,            // Funil (filtrar)
  Edit2,             // Lápis (editar)
  Trash2,            // Lixeira (excluir)
  CreditCard,        // Cartão (pagamento)
  Download,          // Download (baixar pagamento)
} from 'lucide-react';

// Importa tipos TypeScript
import { Transaction } from '../types';

// Importa serviço que mexe com banco de dados
import { transactionService } from '../services/transacoesService';

// Importa funções de cálculo financeiro
import { 
  formatCurrency,      // Formata número como R$
  formatDate,          // Formata data como DD/MM/YYYY
  calcularMulta,       // Calcula multa por atraso
  getStatusTransacao,  // Descobre se está paga/vencida
} from '../utils/calculosFinanceiros';

/**
 * PROPS DO COMPONENTE
 * ===================
 * Props são dados que este componente recebe de quem o usa.
 * É como se fosse os "parâmetros" de uma função.
 */
interface ContasPagarProps {
  currentUnitId: string;           // ID da unidade/filial atual
  onTransactionAdded?: () => void; // Função opcional para avisar quando adicionar transação
}

/**
 * COMPONENTE PRINCIPAL
 * ====================
 * React.FC = Function Component (componente que é uma função)
 * <ContasPagarProps> = Tipo das props que aceita
 */
export const ContasPagar: React.FC<ContasPagarProps> = ({ 
  currentUnitId, 
  onTransactionAdded 
}) => {
  
  /**
   * ESTADOS DO COMPONENTE
   * =====================
   * useState é um "hook" (gancho) que guarda dados que podem mudar.
   * Quando o estado muda, React atualiza a tela automaticamente.
   * 
   * SINTAXE:
   * const [nomeEstado, setNomeEstado] = useState(valorInicial);
   * 
   * nomeEstado → Como ler o valor
   * setNomeEstado → Como mudar o valor
   * useState() → Cria o estado com valor inicial
   */
  
  // Lista de todas as transações carregadas do banco
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Termo de busca (o que usuário digitou no filtro)
  const [searchTerm, setSearchTerm] = useState('');
  
  // Status selecionado no filtro (TODAS, VENCIDAS, A_VENCER, PAGAS)
  const [selectedStatus, setSelectedStatus] = useState<'TODAS' | 'VENCIDAS' | 'A_VENCER' | 'PAGAS'>('TODAS');
  
  // Se modal de nova transação está aberto ou fechado
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Se está carregando dados do banco (mostra loading enquanto isso)
  const [isLoading, setIsLoading] = useState(true);
  
  // Transação sendo editada (null se não estiver editando)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  
  // Dados do formulário dentro do modal
  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: '',      // Descrição (ex: "Conta de luz")
    amount: 0,            // Valor (ex: 150.00)
    dueDate: '',          // Data de vencimento
    category: 'UTILITIES', // Categoria (ex: utilidades)
    status: 'PENDING',    // Status (pago ou pendente)
    paymentMethod: 'PIX', // Forma de pagamento
    notes: '',            // Observações
  });

  /**
   * EFEITOS COLATERAIS (useEffect)
   * ==============================
   * useEffect executa código em momentos especiais:
   * - Quando componente monta (aparece na tela pela primeira vez)
   * - Quando certas variáveis mudam
   * 
   * SINTAXE:
   * useEffect(() => { codigo }, [dependencias])
   * 
   * dependencies → Array com variáveis que, quando mudam, executam o código
   * Array vazio [] → Executa só uma vez (quando monta)
   */
  
  // Carrega transações do banco quando componente monta
  useEffect(() => {
    carregarTransacoes();
  }, []); // Array vazio = executa uma vez só

  /**
   * CARREGAR TRANSAÇÕES DO BANCO
   * ----------------------------
   * Busca dados do Firebase/Supabase e guarda no estado
   */
  const carregarTransacoes = async () => {
    try {
      // Começa carregando...
      setIsLoading(true);
      
      // Chama serviço para buscar transações da unidade
      const loadedTransactions = await transactionService.getTransactions(currentUnitId);
      
      // Guarda transações no estado
      setTransactions(loadedTransactions);
      
    } catch (error) {
      // Se der erro, mostra no console
      console.error('Erro ao carregar transações:', error);
      alert('Erro ao carregar contas. Tente novamente.');
    } finally {
      // Terminou (com sucesso ou erro) → Para loading
      setIsLoading(false);
    }
  };

  /**
   * FILTRAR TRANSAÇÕES
   * ------------------
   * Aplica dois filtros:
   * 1. Por texto (busca)
   * 2. Por status (vencidas/a vencer/pagas)
   */
  const filteredTransactions = transactions.filter(transaction => {
    // Filtro por texto
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.providerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtro por status
    const currentStatus = getStatusTransacao(transaction);
    const matchesStatus = selectedStatus === 'TODAS' || currentStatus === selectedStatus;
    
    // Só retorna se passar em AMBOS filtros
    return matchesSearch && matchesStatus;
  });

  /**
   * ABRIR MODAL PARA NOVA TRANSAÇÃO
   * -------------------------------
   * Prepara formulário vazio para criar nova conta
   */
  const handleOpenNewTransaction = () => {
    setEditingTransaction(null);  // Não está editando
    setFormData({                 // Limpa formulário
      description: '',
      amount: 0,
      dueDate: new Date().toISOString().split('T')[0], // Hoje
      category: 'UTILITIES',
      status: 'PENDING',
      paymentMethod: 'PIX',
      notes: '',
    });
    setIsModalOpen(true);  // Abre modal
  };

  /**
   * ABRIR MODAL PARA EDITAR
   * -----------------------
   * Carrega dados da transação selecionada no formulário
   */
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);  // Marca qual está editando
    setFormData({                        // Preenche com dados atuais
      ...transaction,                    // Copia tudo
    });
    setIsModalOpen(true);                // Abre modal
  };

  /**
   * SALVAR TRANSAÇÃO (CRIAR OU EDITAR)
   * ----------------------------------
   * Se for edição → atualiza existente
   * Se for nova → cria nova
   */
  const handleSaveTransaction = async () => {
    // Validação básica
    if (!formData.description || !formData.amount || formData.amount <= 0) {
      alert('Preencha descrição e valor corretamente!');
      return;
    }

    try {
      if (editingTransaction) {
        // MODO EDIÇÃO: Atualiza transação existente
        await transactionService.updateTransaction(editingTransaction.id, formData);
        alert('Transação atualizada com sucesso!');
      } else {
        // MODO CRIAÇÃO: Salva nova transação
        await transactionService.saveTransaction({
          ...formData,
          unitId: currentUnitId,  // Garante que tem ID da unidade
          createdAt: new Date().toISOString(),
        });
        alert('Transação criada com sucesso!');
      }

      // Fecha modal
      setIsModalOpen(false);
      
      // Recarrega lista para mostrar mudanças
      await carregarTransacoes();
      
      // Avisa componente pai que adicionou (se tiver essa função)
      onTransactionAdded?.();
      
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar transação.');
    }
  };

  /**
   * BAIXAR PAGAMENTO PARCIAL
   * ------------------------
   * Registra quando usuário paga só uma parte do valor
   */
  const handlePartialPayment = async (transaction: Transaction) => {
    // Pede valor que está pagando agora
    const valorPago = prompt(
      `Valor total: ${formatCurrency(transaction.amount)}\nDigite o valor que está pagando:`
    );
    
    if (!valorPago) return;  // Usuário cancelou
    
    const valorNumerico = parseFloat(valorPago.replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Valor inválido!');
      return;
    }

    try {
      // Chama serviço para registrar pagamento parcial
      await transactionService.baixarParcialmente(transaction.id, valorNumerico);
      alert(`Pagamento de ${formatCurrency(valorNumerico)} registrado!`);
      
      // Atualiza lista
      await carregarTransacoes();
      
    } catch (error) {
      console.error('Erro ao baixar pagamento:', error);
      alert('Erro ao registrar pagamento.');
    }
  };

  /**
   * EXCLUIR TRANSAÇÃO
   * -----------------
   * Remove transação do banco (cuidado!)
   */
  const handleDeleteTransaction = async (id: string) => {
    // Confirma antes de excluir (segurança)
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
      return;  // Usuário cancelou
    }

    try {
      // Chama serviço para excluir
      await transactionService.deleteTransaction(id);
      alert('Transação excluída!');
      
      // Atualiza lista
      await carregarTransacoes();
      
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir transação.');
    }
  };

  /**
   * CALCULAR JUROS E MULTA
   * ----------------------
   * Mostra quanto deve pagar com atraso
   */
  const calcularEncargos = (transaction: Transaction) => {
    // Se já está paga, não calcula
    if (transaction.status === 'PAID') {
      return { juros: 0, multa: 0, total: transaction.amount, diasAtraso: 0 };
    }
    
    // Calcula dias de atraso
    const hoje = new Date();
    const vencimento = new Date(transaction.dueDate || '');
    const diffTime = hoje.getTime() - vencimento.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diasAtraso = Math.max(0, diffDays);
    
    // Usa função utilitária para calcular multa
    const multa = calcularMulta(transaction.amount, 2.0); // 2% de multa
    
    // Calcula juros simples (0.33% ao dia)
    const juros = diasAtraso > 0 ? transaction.amount * (0.33/100) * diasAtraso : 0;
    
    // Retorna objeto completo
    return {
      juros: Math.round(juros * 100) / 100,
      multa,
      total: transaction.amount + multa + juros,
      diasAtraso,
    };
  };

  /**
   * RENDERIZAÇÃO (O QUE APARECE NA TELA)
   * ====================================
   * JSX = JavaScript XML (HTML dentro do JavaScript)
   * 
   * Tudo que está no return é o HTML que aparece na tela
   */
  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO DA TELA */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contas a Pagar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie suas contas pendentes e vencidas
          </p>
        </div>
        
        {/* Botão de adicionar nova conta */}
        <button
          onClick={handleOpenNewTransaction}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nova Conta
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
        
        {/* Campo de busca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por descrição ou fornecedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Filtro de status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="TODAS">Todas</option>
          <option value="VENCIDAS">Vencidas</option>
          <option value="A_VENCER">A Vencer</option>
          <option value="PAGAS">Pagas</option>
        </select>
      </div>

      {/* RESUMO DOS VALORES */}
      <div className="grid grid-cols-3 gap-4">
        
        {/* Card: Total Vencido */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertCircle size={20} />
            <span className="font-semibold">Total Vencido</span>
          </div>
          <p className="text-2xl font-bold text-red-900">
            {formatCurrency(
              filteredTransactions
                .filter(t => getStatusTransacao(t) === 'VENCIDA')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>

        {/* Card: A Vencer */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-700 mb-2">
            <Calendar size={20} />
            <span className="font-semibold">A Vencer</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900">
            {formatCurrency(
              filteredTransactions
                .filter(t => getStatusTransacao(t) === 'A_VENCER')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>

        {/* Card: Já Pagas */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <CheckCircle size={20} />
            <span className="font-semibold">Já Pagas</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(
              filteredTransactions
                .filter(t => getStatusTransacao(t) === 'PAGA')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>
      </div>

      {/* LISTA DE TRANSAÇÕES (TABELA) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          
          {/* CABEÇALHO DA TABELA */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Original
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Juros/Multa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          {/* CORPO DA TABELA COM DADOS */}
          <tbody className="divide-y divide-gray-200">
            
            {/* Mostra loading enquanto carrega */}
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Carregando...
                </td>
              </tr>
            ) : filteredTransactions.length === 0 ? (
              // Mensagem se não tiver transações
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Nenhuma conta encontrada.
                </td>
              </tr>
            ) : (
              // Lista todas as transações filtradas
              filteredTransactions.map((transaction) => {
                const encargos = calcularEncargos(transaction);
                const status = getStatusTransacao(transaction);
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    
                    {/* Descrição */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        {transaction.providerName && (
                          <p className="text-sm text-gray-500">{transaction.providerName}</p>
                        )}
                      </div>
                    </td>

                    {/* Data de Vencimento */}
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 ${status === 'VENCIDA' ? 'text-red-600' : 'text-gray-600'}`}>
                        <Calendar size={16} />
                        <span>{formatDate(transaction.dueDate || '')}</span>
                        {status === 'VENCIDA' && (
                          <span className="text-xs">({encargos.diasAtraso} dias)</span>
                        )}
                      </div>
                    </td>

                    {/* Valor Original */}
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>

                    {/* Juros e Multa */}
                    <td className="px-6 py-4">
                      {status !== 'PAGA' && encargos.diasAtraso > 0 ? (
                        <div className="text-red-600">
                          <p className="text-sm">Juros: {formatCurrency(encargos.juros)}</p>
                          <p className="text-sm">Multa: {formatCurrency(encargos.multa)}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Total com Encargos */}
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(encargos.total)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        status === 'PAGA' ? 'bg-green-100 text-green-800' :
                        status === 'VENCIDA' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {status === 'PAGA' ? 'Pago' : status === 'VENCIDA' ? 'Vencida' : 'A Vencer'}
                      </span>
                    </td>

                    {/* Botões de Ação */}
                    <td className="px-6 py-4 text-right space-x-2">
                      
                      {/* Botão Editar */}
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>

                      {/* Botão Baixar Pagamento */}
                      {status !== 'PAGA' && (
                        <button
                          onClick={() => handlePartialPayment(transaction)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Baixar pagamento"
                        >
                          <Download size={18} />
                        </button>
                      )}

                      {/* Botão Excluir */}
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE NOVA/EDIÇÃO DE TRANSAÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            
            {/* Cabeçalho do Modal */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTransaction ? 'Editar Conta' : 'Nova Conta a Pagar'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Formulário */}
            <div className="space-y-4">
              
              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Conta de energia elétrica"
                />
              </div>

              {/* Valor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Data de Vencimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="UTILITIES">Utilidades (Luz/Água)</option>
                  <option value="SALARY">Salários</option>
                  <option value="SUPPLIES">Materiais</option>
                  <option value="MAINTENANCE">Manutenção</option>
                  <option value="OTHER">Outros</option>
                </select>
              </div>

              {/* Forma de Pagamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forma de Pagamento
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value as 'PIX' | 'CASH' | 'CREDIT_CARD' | 'TRANSFER'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="PIX">PIX</option>
                  <option value="CASH">Dinheiro</option>
                  <option value="CREDIT_CARD">Cartão de Crédito</option>
                  <option value="TRANSFER">Transferência Bancária</option>
                </select>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Informações adicionais..."
                />
              </div>
            </div>

            {/* Botões de Ação do Modal */}
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTransaction}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
