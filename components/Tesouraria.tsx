/**
 * ============================================================================
 * COMPONENTE DE TESOURARIA
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Esta é a interface visual onde o tesoureiro gerencia:
 * 
 * 1. FECHAMENTO DE CAIXA DIÁRIO
 * 2. SANGRIAS E SUPRIMENTOS
 * 3. CONCILIAÇÃO DE CARTÕES
 * 4. UPLOAD/DOWNLOAD CNAB
 * 5. EXTRATO CONSOLIDADO
 * 
 * ANALOGIA:
 * ---------
 * É como um "painel de controle do banco":
 * - Mostra todo o dinheiro
 * - Controla entradas e saídas
 * - Concilia cartões
 * - Processa arquivos bancários
 */

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Calendar, FileText, Upload, Download,
  CreditCard, Building, Search, Filter, Plus, X, CheckCircle, AlertTriangle,
  PieChart, BarChart3, RefreshCcw, Eye, Printer, Share2
} from 'lucide-react';
import { tesourariaService } from '../services/tesourariaService';
import { CashClosing, CashMovement, CardReconciliation, CNABFile, TreasuryConsolidated } from '../types';

/**
 * COMPONENTE PRINCIPAL DE TESOURARIA
 */
export const Tesouraria: React.FC = () => {
  // Estado principal
  const [activeTab, setActiveTab] = useState<'closing' | 'movements' | 'cards' | 'cnab' | 'consolidated'>('closing');
  
  // Estados para fechamento
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [closings, setClosings] = useState<CashClosing[]>([]);
  const [actualBalance, setActualBalance] = useState<number>(0);
  
  // Estados para movimentos
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [movementType, setMovementType] = useState<'WITHDRAWAL' | 'SUPPLY'>('WITHDRAWAL');
  const [movementAmount, setMovementAmount] = useState<number>(0);
  const [movementReason, setMovementReason] = useState<string>('');
  
  // Estados para cartões
  const [reconciliations, setReconciliations] = useState<CardReconciliation[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<CardReconciliation['cardOperator']>('VISA');
  
  // Estados para CNAB
  const [cnabFiles, setCnabFiles] = useState<CNABFile[]>([]);
  const [uploadingCNAB, setUploadingCNAB] = useState(false);
  
  // Estados para consolidado
  const [consolidated, setConsolidated] = useState<TreasuryConsolidated | null>(null);
  
  // Carrega dados iniciais
  useEffect(() => {
    loadClosings();
    loadMovements();
    loadReconciliations();
    loadCNABFiles();
  }, []);
  
  // Funções de carregamento
  const loadClosings = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    
    const loaded = await tesourariaService.getClosingByPeriod(
      'unit-1', // TODO: Pegar unidade atual
      startOfMonth.toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    );
    setClosings(loaded);
  };
  
  const loadMovements = async () => {
    // TODO: Implementar no service
    setMovements([]);
  };
  
  const loadReconciliations = async () => {
    // TODO: Implementar no service
    setReconciliations([]);
  };
  
  const loadCNABFiles = async () => {
    // TODO: Implementar no service
    setCnabFiles([]);
  };
  
  // Handlers
  const handleCreateClosing = async () => {
    try {
      await tesourariaService.createCashClosing(
        'unit-1',
        'account-1', // TODO: Selecionar conta
        selectedDate,
        actualBalance,
        'Fechamento automático'
      );
      
      alert('Fechamento criado com sucesso!');
      loadClosings();
    } catch (error) {
      alert(`Erro: ${(error as Error).message}`);
    }
  };
  
  const handleRegisterMovement = async () => {
    if (!movementAmount || !movementReason) {
      alert('Preencha todos os campos!');
      return;
    }
    
    try {
      if (movementType === 'WITHDRAWAL') {
        await tesourariaService.registerWithdrawal({
          unitId: 'unit-1',
          accountId: 'account-1',
          amount: movementAmount,
          reason: movementReason,
          responsible: 'user-1',
        });
      } else {
        await tesourariaService.registerSupply({
          unitId: 'unit-1',
          accountId: 'account-1',
          amount: movementAmount,
          reason: movementReason,
          responsible: 'user-1',
        });
      }
      
      alert('Movimento registrado com sucesso!');
      setMovementAmount(0);
      setMovementReason('');
      loadMovements();
    } catch (error) {
      alert(`Erro: ${(error as Error).message}`);
    }
  };
  
  const handleUploadCNAB = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadingCNAB(true);
    
    try {
      const content = await readFileContent(file);
      await tesourariaService.processCNABReturn('unit-1', 'account-1', content, '341'); // Itaú
      
      alert('Arquivo CNAB processado com sucesso!');
      loadCNABFiles();
    } catch (error) {
      alert(`Erro ao processar CNAB: ${(error as Error).message}`);
    } finally {
      setUploadingCNAB(false);
    }
  };
  
  const handleGenerateConsolidated = async () => {
    try {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      
      const result = await tesourariaService.generateConsolidatedStatement(
        'unit-1',
        startOfMonth.toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );
      
      setConsolidated(result);
    } catch (error) {
      alert(`Erro: ${(error as Error).message}`);
    }
  };
  
  // Renderização
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Tesouraria</h1>
        <p className="text-gray-600">Gestão completa de caixa e operações bancárias</p>
      </div>
      
      {/* Tabs de Navegação */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <TabButton 
          active={activeTab === 'closing'} 
          onClick={() => setActiveTab('closing')}
          icon={<Calendar size={18} />}
          label="Fechamento"
        />
        <TabButton 
          active={activeTab === 'movements'} 
          onClick={() => setActiveTab('movements')}
          icon={<RefreshCcw size={18} />}
          label="Sangrias/Suprimentos"
        />
        <TabButton 
          active={activeTab === 'cards'} 
          onClick={() => setActiveTab('cards')}
          icon={<CreditCard size={18} />}
          label="Cartões"
        />
        <TabButton 
          active={activeTab === 'cnab'} 
          onClick={() => setActiveTab('cnab')}
          icon={<Building size={18} />}
          label="CNAB"
        />
        <TabButton 
          active={activeTab === 'consolidated'} 
          onClick={() => setActiveTab('consolidated')}
          icon={<PieChart size={18} />}
          label="Extrato Consolidado"
        />
      </div>
      
      {/* Conteúdo das Abas */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'closing' && (
          <CashClosingTab
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            closings={closings}
            actualBalance={actualBalance}
            onBalanceChange={setActualBalance}
            onCreateClosing={handleCreateClosing}
          />
        )}
        
        {activeTab === 'movements' && (
          <MovementsTab
            movementType={movementType}
            onTypeChange={setMovementType}
            amount={movementAmount}
            onAmountChange={setMovementAmount}
            reason={movementReason}
            onReasonChange={setMovementReason}
            movements={movements}
            onRegister={handleRegisterMovement}
          />
        )}
        
        {activeTab === 'cards' && (
          <CardsTab
            selectedOperator={selectedOperator}
            onOperatorChange={setSelectedOperator}
            reconciliations={reconciliations}
          />
        )}
        
        {activeTab === 'cnab' && (
          <CNABTab
            cnabFiles={cnabFiles}
            uploading={uploadingCNAB}
            onUpload={handleUploadCNAB}
          />
        )}
        
        {activeTab === 'consolidated' && (
          <ConsolidatedTab
            consolidated={consolidated}
            onGenerate={handleGenerateConsolidated}
          />
        )}
      </div>
    </div>
  );
};

/**
 * COMPONENTES DAS ABAS
 */

interface CashClosingTabProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  closings: CashClosing[];
  actualBalance: number;
  onBalanceChange: (balance: number) => void;
  onCreateClosing: () => void;
}

const CashClosingTab: React.FC<CashClosingTabProps> = ({
  selectedDate,
  onDateChange,
  closings,
  actualBalance,
  onBalanceChange,
  onCreateClosing,
}) => {
  const latestClosing = closings[0];
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Fechamento de Caixa Diário</h2>
      
      {/* Seletor de Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data do Fechamento
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Saldo Real (Contado)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              R$
            </span>
            <input
              type="number"
              value={actualBalance}
              onChange={(e) => onBalanceChange(Number(e.target.value))}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={onCreateClosing}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Criar Fechamento
          </button>
        </div>
      </div>
      
      {/* Último Fechamento */}
      {latestClosing && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Último Fechamento</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Saldo Inicial"
              value={formatCurrency(latestClosing.openingBalance)}
              icon={<DollarSign size={20} />}
            />
            <StatCard
              label="Entradas"
              value={formatCurrency(latestClosing.totalInflows)}
              icon={<TrendingUp size={20} className="text-green-600" />}
              valueClassName="text-green-600"
            />
            <StatCard
              label="Saídas"
              value={formatCurrency(latestClosing.totalOutflows)}
              icon={<TrendingDown size={20} className="text-red-600" />}
              valueClassName="text-red-600"
            />
            <StatCard
              label="Diferença"
              value={formatCurrency(latestClosing.difference)}
              icon={
                Math.abs(latestClosing.difference) < 1 ? (
                  <CheckCircle size={20} className="text-green-600" />
                ) : (
                  <AlertTriangle size={20} className="text-yellow-600" />
                )
              }
              valueClassName={
                Math.abs(latestClosing.difference) < 1
                  ? 'text-green-600'
                  : 'text-yellow-600'
              }
            />
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                latestClosing.status === 'CLOSED'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {latestClosing.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Fechado em: {new Date(latestClosing.closedAt || '').toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      )}
      
      {/* Lista de Fechamentos */}
      {closings.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Histórico de Fechamentos</h3>
          <div className="space-y-2">
            {closings.map((closing) => (
              <div
                key={closing.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {new Date(closing.date).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Diferença: {formatCurrency(closing.difference)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    closing.status === 'CLOSED'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {closing.status}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ... (continua com os outros componentes de aba - MovementsTab, CardsTab, CNABTab, ConsolidatedTab)

/**
 * ABA DE SANGRIAS/SUPRIMENTOS
 */
interface MovementsTabProps {
  movementType: 'WITHDRAWAL' | 'SUPPLY';
  onTypeChange: (type: 'WITHDRAWAL' | 'SUPPLY') => void;
  amount: number;
  onAmountChange: (amount: number) => void;
  reason: string;
  onReasonChange: (reason: string) => void;
  movements: CashMovement[];
  onRegister: () => void;
}

const MovementsTab: React.FC<MovementsTabProps> = ({
  movementType,
  onTypeChange,
  amount,
  onAmountChange,
  reason,
  onReasonChange,
  movements,
  onRegister,
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Sangrias e Suprimentos</h2>
    
    {/* Formulário */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
        <select
          value={movementType}
          onChange={(e) => onTypeChange(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="WITHDRAWAL">Sangria (Retirada)</option>
          <option value="SUPPLY">Suprimento (Entrada)</option>
        </select>
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">Motivo</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ex: Pagamento de fornecedor, Reforço de caixa..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Valor</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(Number(e.target.value))}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="md:col-span-4 flex justify-end">
        <button
          onClick={onRegister}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
        >
          <Plus size={18} />
          Registrar {movementType === 'WITHDRAWAL' ? 'Sangria' : 'Suprimento'}
        </button>
      </div>
    </div>
    
    {/* Lista de Movimentos */}
    {movements.length > 0 && (
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Histórico</h3>
        <div className="space-y-2">
          {movements.map((mov) => (
            <div key={mov.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded ${
                  mov.type === 'WITHDRAWAL' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {mov.type === 'WITHDRAWAL' ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{mov.reason}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(mov.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className={`font-bold ${
                mov.type === 'WITHDRAWAL' ? 'text-red-600' : 'text-green-600'
              }`}>
                {mov.type === 'WITHDRAWAL' ? '-' : '+'} {formatCurrency(mov.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

/**
 * ABA DE CARTÕES
 */
interface CardsTabProps {
  selectedOperator: CardReconciliation['cardOperator'];
  onOperatorChange: (operator: CardReconciliation['cardOperator']) => void;
  reconciliations: CardReconciliation[];
}

const CardsTab: React.FC<CardsTabProps> = ({
  selectedOperator,
  onOperatorChange,
  reconciliations,
}) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Conciliação de Cartões</h2>
    
    {/* Seletor de Operadora */}
    <div className="flex gap-2 mb-4">
      {(['VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD'] as const).map((op) => (
        <button
          key={op}
          onClick={() => onOperatorChange(op)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedOperator === op
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {op}
        </button>
      ))}
    </div>
    
    {/* Resumo */}
    {reconciliations.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total Vendas"
          value={formatCurrency(reconciliations.reduce((sum, r) => sum + r.totalSales, 0))}
          icon={<DollarSign size={20} />}
        />
        <StatCard
          label="Total Taxas"
          value={formatCurrency(reconciliations.reduce((sum, r) => sum + r.totalFees, 0))}
          icon={<TrendingDown size={20} className="text-red-600" />}
          valueClassName="text-red-600"
        />
        <StatCard
          label="Total Líquido"
          value={formatCurrency(reconciliations.reduce((sum, r) => sum + r.netValue, 0))}
          icon={<CreditCard size={20} className="text-green-600" />}
          valueClassName="text-green-600"
        />
      </div>
    )}
    
    {/* Lista de Conciliações */}
    {reconciliations.length === 0 && (
      <div className="text-center py-12 text-gray-400">
        <CreditCard size={48} className="mx-auto mb-2 opacity-50" />
        <p>Nenhuma conciliação encontrada</p>
      </div>
    )}
  </div>
);

/**
 * ABA DE CNAB
 */
interface CNABTabProps {
  cnabFiles: CNABFile[];
  uploading: boolean;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CNABTab: React.FC<CNABTabProps> = ({ cnabFiles, uploading, onUpload }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Arquivos CNAB</h2>
    
    {/* Upload */}
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <Upload size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload de Arquivo CNAB</h3>
      <p className="text-gray-600 mb-4">Arraste seu arquivo ou clique para selecionar</p>
      
      <label className="inline-block">
        <input
          type="file"
          accept=".txt,.ret"
          onChange={onUpload}
          className="hidden"
          disabled={uploading}
        />
        <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer inline-flex items-center gap-2">
          {uploading ? (
            <>
              <RefreshCcw size={18} className="animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Upload size={18} />
              Selecionar Arquivo
            </>
          )}
        </span>
      </label>
    </div>
    
    {/* Lista de Arquivos */}
    {cnabFiles.length > 0 && (
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Arquivos Processados</h3>
        <div className="space-y-2">
          {cnabFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded ${
                  file.fileType === 'RETORNO' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <FileText size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{file.filename}</p>
                  <p className="text-sm text-gray-600">
                    Banco: {file.bank} • {file.recordsCount} registros
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  file.status === 'PROCESSED'
                    ? 'bg-green-100 text-green-700'
                    : file.status === 'ERROR'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {file.status}
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

/**
 * ABA DE EXTRATO CONSOLIDADO
 */
interface ConsolidatedTabProps {
  consolidated: TreasuryConsolidated | null;
  onGenerate: () => void;
}

const ConsolidatedTab: React.FC<ConsolidatedTabProps> = ({ consolidated, onGenerate }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold text-gray-800">Extrato Consolidado</h2>
      <button
        onClick={onGenerate}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
      >
        <RefreshCcw size={18} />
        Gerar Consolidado
      </button>
    </div>
    
    {consolidated ? (
      <div className="space-y-6">
        {/* Totais Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Saldo Inicial"
            value={formatCurrency(consolidated.grandTotal.openingBalance)}
            icon={<DollarSign size={20} />}
          />
          <StatCard
            label="Entradas"
            value={formatCurrency(consolidated.grandTotal.inflows)}
            icon={<TrendingUp size={20} className="text-green-600" />}
            valueClassName="text-green-600"
          />
          <StatCard
            label="Saídas"
            value={formatCurrency(consolidated.grandTotal.outflows)}
            icon={<TrendingDown size={20} className="text-red-600" />}
            valueClassName="text-red-600"
          />
          <StatCard
            label="Saldo Final"
            value={formatCurrency(consolidated.grandTotal.closingBalance)}
            icon={<PieChart size={20} className="text-blue-600" />}
            valueClassName="text-blue-600"
          />
        </div>
        
        {/* Por Conta */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Por Conta</h3>
          <div className="space-y-2">
            {consolidated.accounts.map((acc) => (
              <div key={acc.accountId} className="p-3 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{acc.accountName}</p>
                    <p className="text-sm text-gray-600">
                      Entradas: {formatCurrency(acc.totalInflows)} • 
                      Saídas: {formatCurrency(acc.totalOutflows)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Saldo Final</p>
                    <p className="font-bold text-gray-800">{formatCurrency(acc.closingBalance)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-12 text-gray-400">
        <BarChart3 size={48} className="mx-auto mb-2 opacity-50" />
        <p>Clique em "Gerar Consolidado" para ver o resumo</p>
      </div>
    )}
  </div>
);

/**
 * UTILITÁRIOS
 */

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
      active
        ? 'text-blue-600 border-b-2 border-blue-600'
        : 'text-gray-600 hover:text-gray-800'
    }`}
  >
    {icon}
    {label}
  </button>
);

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  valueClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, valueClassName = '' }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-600">{label}</span>
      {icon}
    </div>
    <p className={`text-xl font-bold ${valueClassName}`}>{value}</p>
  </div>
);
