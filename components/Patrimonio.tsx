/**
 * ============================================================================
 * COMPONENTE DE GESTÃO PATRIMONIAL
 * ============================================================================
 * Interface completa para gestão de bens, depreciação, inventário e relatórios
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  Package, TrendingDown, ClipboardList, FileText, Plus, Search, Filter,
  Building, MapPin, User, Calendar, DollarSign, Percent, AlertCircle,
  CheckCircle, XCircle, Clock, ArrowRight, Download, Upload, Printer, Loader2
} from 'lucide-react';
import { patrimonioService } from '../services/patrimonioService';
import { Asset, AssetType, AssetStatus, InventoryCount } from '../types';

/**
 * Props do componente
 */
interface PatrimonioProps {
  currentUnitId: string;
  user?: any;
}

/**
 * Componente Principal de Patrimônio
 */
export const Patrimonio: React.FC<PatrimonioProps> = ({ currentUnitId, user }) => {
  // Estado principal
  const [activeTab, setActiveTab] = useState<'assets' | 'depreciation' | 'inventory' | 'reports'>('assets');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Filtros
  const [selectedCategory, setSelectedCategory] = useState<AssetType | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AssetStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal de cadastro/edição
  const [showModal, setShowModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  /**
   * Carregar bens ao montar componente
   */
  useEffect(() => {
    loadAssets();
  }, [currentUnitId]);

  /**
   * Carregar bens da unidade
   */
  const loadAssets = async () => {
    setLoading(true);
    try {
      const loadedAssets = await patrimonioService.getAssets(currentUnitId);
      setAssets(loadedAssets);
    } catch (error) {
      console.error('Erro ao carregar bens:', error);
    } finally {
      setLoading(false);
    }
  };

  const onNewAsset = () => {
    setEditingAsset(null);
    setShowModal(true);
  };

  const onEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setShowModal(true);
  };

  const handleSave = async (assetData: Partial<Asset>) => {
    setIsSaving(true);
    try {
      if (editingAsset) {
        await patrimonioService.updateAsset(editingAsset.id, assetData);
        alert('Bem atualizado com sucesso!');
      } else {
        const fullAssetData = {
          ...assetData,
          unitId: currentUnitId,
          status: 'ATIVO' as AssetStatus,
          currentValue: assetData.acquisitionValue || 0,
          currentBookValue: assetData.acquisitionValue || 0,
          accumulatedDepreciation: 0,
          depreciationMethod: 'LINEAR' as any,
          depreciationRate: 20, // 20% ao ano padrão
          condition: 'BOM' as any,
        } as Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>;
        
        await patrimonioService.registerAsset(fullAssetData);
        alert('Bem cadastrado com sucesso!');
      }
      setShowModal(false);
      loadAssets();
    } catch (error) {
      console.error('Erro ao salvar bem:', error);
      alert('Erro ao salvar bem patrimonial.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Filtrar bens conforme critérios
   */
  const filteredAssets = assets.filter(asset => {
    const matchCategory = selectedCategory === 'ALL' || asset.category === selectedCategory;
    const matchStatus = selectedStatus === 'ALL' || asset.status === selectedStatus;
    const matchSearch = searchTerm === '' || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchCategory && matchStatus && matchSearch;
  });

  /**
   * Resumo patrimonial
   */
  const summary = {
    totalAssets: assets.length,
    totalValue: assets.reduce((sum, a) => sum + a.currentValue, 0),
    activeAssets: assets.filter(a => a.status === 'ATIVO').length,
    maintenanceAssets: assets.filter(a => a.status === 'MANUTENCAO').length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600" />
          Gestão Patrimonial
        </h1>
        <p className="text-gray-600 mt-2">
          Controle de bens, depreciação e inventário
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <SummaryCard
          icon={Package}
          label="Total de Bens"
          value={summary.totalAssets.toString()}
          color="blue"
        />
        <SummaryCard
          icon={DollarSign}
          label="Valor Total"
          value={formatCurrency(summary.totalValue)}
          color="green"
        />
        <SummaryCard
          icon={CheckCircle}
          label="Bens Ativos"
          value={summary.activeAssets.toString()}
          color="emerald"
        />
        <SummaryCard
          icon={AlertCircle}
          label="Em Manutenção"
          value={summary.maintenanceAssets.toString()}
          color="amber"
        />
      </div>

      {/* Abas de Navegação */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <TabButton
          active={activeTab === 'assets'}
          onClick={() => setActiveTab('assets')}
          icon={Package}
          label="Bens"
        />
        <TabButton
          active={activeTab === 'depreciation'}
          onClick={() => setActiveTab('depreciation')}
          icon={TrendingDown}
          label="Depreciação"
        />
        <TabButton
          active={activeTab === 'inventory'}
          onClick={() => setActiveTab('inventory')}
          icon={ClipboardList}
          label="Inventário"
        />
        <TabButton
          active={activeTab === 'reports'}
          onClick={() => setActiveTab('reports')}
          icon={FileText}
          label="Relatórios"
        />
      </div>

      {/* Conteúdo das Abas */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'assets' && (
          <AssetsTab
            assets={filteredAssets}
            loading={loading}
            onNewAsset={() => setShowModal(true)}
            onEditAsset={(asset) => {
              setEditingAsset(asset);
              setShowModal(true);
            }}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        )}
        
        {activeTab === 'depreciation' && (
          <DepreciationTab />
        )}
        
        {activeTab === 'inventory' && (
          <InventoryTab />
        )}
        
        {activeTab === 'reports' && (
          <ReportsTab />
        )}
      </div>

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <AssetModal
          asset={editingAsset}
          onClose={() => {
            setShowModal(false);
            setEditingAsset(null);
          }}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

/**
 * Card de Resumo
 */
interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'emerald' | 'amber' | 'red';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

/**
 * Botão de Aba
 */
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors border-b-2 ${
      active
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-600 hover:text-gray-800'
    }`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

/**
 * Aba de Bens
 */
interface AssetsTabProps {
  assets: Asset[];
  loading: boolean;
  onNewAsset: () => void;
  onEditAsset: (asset: Asset) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: AssetType | 'ALL';
  setSelectedCategory: (category: AssetType | 'ALL') => void;
  selectedStatus: AssetStatus | 'ALL';
  setSelectedStatus: (status: AssetStatus | 'ALL') => void;
}

const AssetsTab: React.FC<AssetsTabProps> = ({
  assets,
  loading,
  onNewAsset,
  onEditAsset,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
}) => {
  if (loading) {
    return <LoadingState />;
  }

  return (
    <div>
      {/* Barra de Ferramentas */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, descrição ou número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as AssetType | 'ALL')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Todas Categorias</option>
          <option value="IMOVEIS">Imóveis</option>
          <option value="VEICULOS">Veículos</option>
          <option value="EQUIPAMENTOS">Equipamentos</option>
          <option value="MOVEIS">Móveis</option>
          <option value="COMPUTADORES">Informática</option>
          <option value="MAQUINAS">Máquinas</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as AssetStatus | 'ALL')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">Todos Status</option>
          <option value="ATIVO">Ativo</option>
          <option value="MANUTENCAO">Manutenção</option>
          <option value="OCIOSO">Ocioso</option>
          <option value="BAIXADO">Baixado</option>
          <option value="SUCATA">Sucata</option>
        </select>

        <button
          onClick={onNewAsset}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Novo Bem
        </button>
      </div>

      {/* Tabela de Bens */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nº Patrimônio</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Categoria</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Localização</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Valor Atual</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Nenhum bem cadastrado
                </td>
              </tr>
            ) : (
              assets.map(asset => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{asset.assetNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{asset.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                      {formatCategory(asset.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{asset.location}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {formatCurrency(asset.currentValue)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => onEditAsset(asset)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Componentes Placeholder para outras abas
 */
const DepreciationTab: React.FC = () => (
  <div className="text-center py-12">
    <TrendingDown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900">Depreciação de Ativos</h3>
    <p className="text-gray-500 mt-2">Cálculo automático de depreciação mensal</p>
  </div>
);

const InventoryTab: React.FC = () => (
  <div className="text-center py-12">
    <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900">Inventário Físico</h3>
    <p className="text-gray-500 mt-2">Contagem e conferência de bens</p>
  </div>
);

const ReportsTab: React.FC = () => (
  <div className="text-center py-12">
    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900">Relatórios Patrimoniais</h3>
    <p className="text-gray-500 mt-2">Balanço, depreciação e análises</p>
  </div>
);

/**
 * Modal de Cadastro/Edição de Bem
 */
interface AssetModalProps {
  asset: Asset | null;
  onClose: () => void;
  onSave: (data: Partial<Asset>) => void;
  isSaving: boolean;
}

const AssetModal: React.FC<AssetModalProps> = ({ asset, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = useState<Partial<Asset>>(asset || {
    name: '',
    category: 'EQUIPAMENTOS',
    description: '',
    acquisitionValue: 0,
    acquisitionDate: new Date().toISOString().split('T')[0],
    usefulLifeMonths: 60,
    location: '',
    responsible: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {asset ? 'Editar Bem' : 'Novo Bem Patrimonial'}
            </h2>
            <button onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dados Básicos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Bem
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isSaving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as AssetType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                >
                  <option value="IMOVEIS">Imóveis</option>
                  <option value="VEICULOS">Veículos</option>
                  <option value="EQUIPAMENTOS">Equipamentos</option>
                  <option value="MOVEIS">Móveis</option>
                  <option value="COMPUTADORES">Informática</option>
                  <option value="MAQUINAS">Máquinas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                disabled={isSaving}
              />
            </div>

            {/* Valores e Datas */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor de Aquisição (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.acquisitionValue}
                  onChange={e => setFormData({ ...formData, acquisitionValue: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isSaving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Aquisição
                </label>
                <input
                  type="date"
                  value={formData.acquisitionDate?.split('T')[0]}
                  onChange={e => setFormData({ ...formData, acquisitionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vida Útil (meses)
                </label>
                <input
                  type="number"
                  value={formData.usefulLifeMonths}
                  onChange={e => setFormData({ ...formData, usefulLifeMonths: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Localização */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localização
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Sala 1, Almoxarifado"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  value={formData.responsible}
                  onChange={e => setFormData({ ...formData, responsible: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  asset ? 'Salvar Alterações' : 'Cadastrar Bem'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * Componente de Loading
 */
const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-4 text-gray-600">Carregando bens...</span>
  </div>
);

/**
 * Badge de Status
 */
const StatusBadge: React.FC<{ status: AssetStatus }> = ({ status }) => {
  const statusConfig = {
    ATIVO: { bg: 'bg-green-100', text: 'text-green-800', label: 'Ativo' },
    MANUTENCAO: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Manutenção' },
    OCIOSO: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Ocioso' },
    BAIXADO: { bg: 'bg-red-100', text: 'text-red-800', label: 'Baixado' },
    SUCATA: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Sucata' },
  };

  const config = statusConfig[status] || statusConfig.OCIOSO;

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

/**
 * Formatadores Auxiliares
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatCategory = (category: AssetType): string => {
  const categories = {
    IMOVEIS: 'Imóveis',
    VEICULOS: 'Veículos',
    EQUIPAMENTOS: 'Equipamentos',
    MOVEIS: 'Móveis',
    COMPUTADORES: 'Informática',
    MAQUINAS: 'Máquinas',
  };
  return categories[category] || category;
};

export default Patrimonio;
