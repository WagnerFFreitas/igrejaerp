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
import AuthService from '../src/services/authService';

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
  const canWriteAssets = AuthService.hasPermission(user, 'assets', 'write');
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
    if (!canWriteAssets) {
      alert('Você não tem permissão para cadastrar bens patrimoniais.');
      return;
    }
    setEditingAsset(null);
    setShowModal(true);
  };

  const onEditAsset = (asset: Asset) => {
    if (!canWriteAssets) {
      alert('Você não tem permissão para editar bens patrimoniais.');
      return;
    }
    setEditingAsset(asset);
    setShowModal(true);
  };

  const handleSave = async (assetData: Partial<Asset>) => {
    if (!canWriteAssets) {
      alert('Você não tem permissão para salvar bens patrimoniais.');
      return;
    }
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
            onNewAsset={onNewAsset}
            onEditAsset={onEditAsset}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            canWriteAssets={canWriteAssets}
          />
        )}
        
        {activeTab === 'depreciation' && (
          <DepreciationTab assets={assets} currentUnitId={currentUnitId} onRefresh={loadAssets} />
        )}
        
        {activeTab === 'inventory' && (
          <InventoryTab currentUnitId={currentUnitId} assets={assets} />
        )}
        
        {activeTab === 'reports' && (
          <ReportsTab assets={assets} />
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
          canWriteAssets={canWriteAssets}
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
  canWriteAssets: boolean;
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
  canWriteAssets,
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
          disabled={!canWriteAssets}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {(asset as any).address?.street
                      ? `${(asset as any).address.street}${(asset as any).address.number ? ', ' + (asset as any).address.number : ''} — ${(asset as any).address.city || ''}${(asset as any).address.state ? '/' + (asset as any).address.state : ''}`
                      : asset.location || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {formatCurrency(asset.currentValue)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => onEditAsset(asset)}
                      disabled={!canWriteAssets}
                      className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
 * ABA DEPRECIAÇÃO — calcula e salva depreciação mensal de cada bem
 */
const DepreciationTab: React.FC<{ assets: Asset[]; currentUnitId: string; onRefresh: () => void }> = ({ assets, currentUnitId, onRefresh }) => {
  const [processing, setProcessing] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<Record<string, any>>({});

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const depreciate = async (assetId: string) => {
    setProcessing(assetId);
    try {
      const res = await fetch(`/api/assets/${assetId}/depreciate`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      if (res.ok) {
        setResults(prev => ({ ...prev, [assetId]: data }));
        onRefresh();
        alert('Depreciação calculada e salva com sucesso!');
      } else {
        alert('Erro: ' + (data.error?.message || 'Falha ao calcular'));
      }
    } catch { alert('Erro de conexão.'); }
    finally { setProcessing(null); }
  };

  const depreciateAll = async () => {
    for (const a of assets.filter(a => a.status === 'ATIVO' && a.depreciationRate > 0)) {
      await depreciate(a.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Depreciação de Ativos</h3>
          <p className="text-sm text-gray-500">Cálculo mensal pelo método linear. Clique em "Calcular" para registrar a depreciação do mês.</p>
        </div>
        <button onClick={depreciateAll} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2">
          <TrendingDown size={16}/> Calcular Todos
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Bem</th>
              <th className="px-4 py-3 text-right">Valor Original</th>
              <th className="px-4 py-3 text-right">Taxa Anual</th>
              <th className="px-4 py-3 text-right">Depr. Mensal</th>
              <th className="px-4 py-3 text-right">Depr. Acumulada</th>
              <th className="px-4 py-3 text-right">Valor Contábil</th>
              <th className="px-4 py-3 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assets.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Nenhum bem cadastrado.</td></tr>
            ) : assets.map(a => {
              const monthly = (a.acquisitionValue * (a.depreciationRate / 100)) / 12;
              const bookValue = a.currentBookValue ?? (a.acquisitionValue - (a.accumulatedDepreciation || 0));
              const r = results[a.id];
              return (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{a.name}<br/><span className="text-xs text-gray-400">{a.assetNumber}</span></td>
                  <td className="px-4 py-3 text-right">{formatCurrency(a.acquisitionValue)}</td>
                  <td className="px-4 py-3 text-right">{a.depreciationRate}%</td>
                  <td className="px-4 py-3 text-right text-amber-600 font-medium">{formatCurrency(monthly)}</td>
                  <td className="px-4 py-3 text-right text-rose-600">{formatCurrency(r?.accumulatedDepreciation ?? a.accumulatedDepreciation ?? 0)}</td>
                  <td className="px-4 py-3 text-right text-emerald-600 font-bold">{formatCurrency(r?.currentBookValue ?? bookValue)}</td>
                  <td className="px-4 py-3 text-center">
                    {a.status === 'ATIVO' && a.depreciationRate > 0 ? (
                      <button
                        onClick={() => depreciate(a.id)}
                        disabled={processing === a.id}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 disabled:opacity-50"
                      >
                        {processing === a.id ? 'Calculando...' : 'Calcular'}
                      </button>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * ABA INVENTÁRIO — contagem física dos bens
 */
const InventoryTab: React.FC<{ currentUnitId: string; assets: Asset[] }> = ({ currentUnitId, assets }) => {
  const [counts, setCounts] = React.useState<any[]>([]);
  const [activeCount, setActiveCount] = React.useState<any | null>(null);
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const loadCounts = async () => {
    try {
      const res = await fetch(`/api/assets/inventory/counts?unitId=${currentUnitId}`);
      if (res.ok) setCounts(await res.json());
    } catch {}
  };

  React.useEffect(() => { loadCounts(); }, [currentUnitId]);

  const startCount = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/assets/inventory/counts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitId: currentUnitId, countedBy: 'Usuário' })
      });
      const data = await res.json();
      if (res.ok) { await loadCounts(); alert(`Inventário iniciado com ${data.totalAssets} bens.`); }
      else alert('Erro: ' + (data.error?.message || 'Falha'));
    } catch { alert('Erro de conexão.'); }
    finally { setLoading(false); }
  };

  const openCount = async (count: any) => {
    setActiveCount(count);
    const res = await fetch(`/api/assets/inventory/${count.id}/items`);
    if (res.ok) setItems(await res.json());
  };

  const confirmItem = async (itemId: string, found: boolean) => {
    await fetch(`/api/assets/inventory/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countedQuantity: found ? 1 : 0, condition: 'BOM' })
    });
    const res = await fetch(`/api/assets/inventory/${activeCount.id}/items`);
    if (res.ok) setItems(await res.json());
  };

  const closeCount = async () => {
    await fetch(`/api/assets/inventory/counts/${activeCount.id}/close`, { method: 'PATCH' });
    setActiveCount(null);
    loadCounts();
    alert('Inventário finalizado!');
  };

  if (activeCount) return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Inventário em Andamento</h3>
          <p className="text-sm text-gray-500">Confirme cada bem encontrado fisicamente.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveCount(null)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">Voltar</button>
          <button onClick={closeCount} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold">Finalizar Inventário</button>
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-2">
        {items.filter(i => i.counted_quantity > 0).length}/{items.length} bens confirmados
        ({items.length > 0 ? Math.round(items.filter(i => i.counted_quantity > 0).length / items.length * 100) : 0}%)
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border ${item.counted_quantity > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}>
            <div>
              <p className="font-medium text-gray-900">{item.asset_name}</p>
              <p className="text-xs text-gray-400">{item.asset_number} · {item.category}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => confirmItem(item.id, true)} className={`px-3 py-1 rounded-lg text-xs font-bold ${item.counted_quantity > 0 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-emerald-100'}`}>
                ✓ Encontrado
              </button>
              <button onClick={() => confirmItem(item.id, false)} className={`px-3 py-1 rounded-lg text-xs font-bold ${item.counted_quantity === 0 && item.difference !== -1 ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-rose-100'}`}>
                ✗ Não encontrado
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Inventário Físico</h3>
          <p className="text-sm text-gray-500">Inicie uma contagem para conferir os bens fisicamente.</p>
        </div>
        <button onClick={startCount} disabled={loading || assets.length === 0} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
          <ClipboardList size={16}/> {loading ? 'Iniciando...' : 'Novo Inventário'}
        </button>
      </div>
      {counts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
          <p>Nenhum inventário realizado ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {counts.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">Inventário de {new Date(c.count_date).toLocaleDateString('pt-BR')}</p>
                <p className="text-sm text-gray-500">{c.counted_by} · {c.total_assets} bens · {parseFloat(c.completion_percentage || 0).toFixed(0)}% concluído</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'CONCLUIDO' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {c.status === 'CONCLUIDO' ? 'Concluído' : 'Em Andamento'}
                </span>
                {c.status !== 'CONCLUIDO' && (
                  <button onClick={() => openCount(c)} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100">
                    Continuar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * ABA RELATÓRIOS — resumo patrimonial com dados reais
 */
const ReportsTab: React.FC<{ assets: Asset[] }> = ({ assets }) => {
  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const totalAquisicao = assets.reduce((s, a) => s + (a.acquisitionValue || 0), 0);
  const totalContabil  = assets.reduce((s, a) => s + (a.currentBookValue ?? a.currentValue ?? 0), 0);
  const totalDeprAcum  = assets.reduce((s, a) => s + (a.accumulatedDepreciation || 0), 0);
  const ativos    = assets.filter(a => a.status === 'ATIVO').length;
  const manutencao= assets.filter(a => a.status === 'MANUTENCAO').length;
  const baixados  = assets.filter(a => a.status === 'BAIXADO').length;

  const byCategory = assets.reduce((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + (a.acquisitionValue || 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Relatório Patrimonial</h3>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Valor de Aquisição', value: formatCurrency(totalAquisicao), color: 'blue' },
          { label: 'Valor Contábil Atual', value: formatCurrency(totalContabil), color: 'emerald' },
          { label: 'Depreciação Acumulada', value: formatCurrency(totalDeprAcum), color: 'rose' },
          { label: 'Total de Bens', value: `${assets.length} bens`, color: 'indigo' },
        ].map((k, i) => (
          <div key={i} className={`p-4 rounded-xl bg-${k.color}-50 border border-${k.color}-100`}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{k.label}</p>
            <p className={`text-xl font-black text-${k.color}-700 mt-1`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">Status dos Bens</h4>
        <div className="flex gap-6">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"/><span className="text-sm text-gray-700">Ativos: <strong>{ativos}</strong></span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"/><span className="text-sm text-gray-700">Manutenção: <strong>{manutencao}</strong></span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-400"/><span className="text-sm text-gray-700">Baixados: <strong>{baixados}</strong></span></div>
        </div>
      </div>

      {/* Por categoria */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h4 className="text-sm font-bold text-gray-700 uppercase mb-3">Valor por Categoria</h4>
        {Object.keys(byCategory).length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum bem cadastrado.</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([cat, val]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{cat}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${totalAquisicao > 0 ? (val / totalAquisicao * 100) : 0}%` }}/>
                  </div>
                  <span className="text-sm font-bold text-gray-900 w-28 text-right">{formatCurrency(val)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabela detalhada */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h4 className="text-sm font-bold text-gray-700 uppercase">Detalhamento por Bem</h4>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Nº Pat.</th>
              <th className="px-4 py-2 text-left">Bem</th>
              <th className="px-4 py-2 text-right">Aquisição</th>
              <th className="px-4 py-2 text-right">Depr. Acum.</th>
              <th className="px-4 py-2 text-right">Valor Contábil</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assets.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-mono text-xs text-gray-500">{a.assetNumber || '—'}</td>
                <td className="px-4 py-2 font-medium text-gray-900">{a.name}</td>
                <td className="px-4 py-2 text-right">{formatCurrency(a.acquisitionValue)}</td>
                <td className="px-4 py-2 text-right text-rose-600">{formatCurrency(a.accumulatedDepreciation || 0)}</td>
                <td className="px-4 py-2 text-right font-bold text-emerald-700">{formatCurrency(a.currentBookValue ?? a.currentValue ?? 0)}</td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${a.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-700' : a.status === 'MANUTENCAO' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Modal de Cadastro/Edição de Bem
 */
interface AssetModalProps {
  asset: Asset | null;
  onClose: () => void;
  onSave: (data: Partial<Asset>) => void;
  isSaving: boolean;
  canWriteAssets: boolean;
}

const AssetModal: React.FC<AssetModalProps> = ({ asset, onClose, onSave, isSaving, canWriteAssets }) => {
  const [formData, setFormData] = useState<Partial<Asset>>(asset || {
    name: '',
    category: 'EQUIPAMENTOS',
    description: '',
    acquisitionValue: 0,
    acquisitionDate: new Date().toISOString().split('T')[0],
    usefulLifeMonths: 60,
    location: '',
    responsible: '',
    assetNumber: '',
    address: { zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' } as any,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWriteAssets) return;
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
                  <option value="MOBILIARIO">Móveis e Mobiliário</option>
                  <option value="TECNOLOGIA">Informática / Tecnologia</option>
                  <option value="OUTROS">Outros</option>
                </select>
              </div>
            </div>

            {/* Nº Patrimônio */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nº Patrimônio <span className="text-gray-400 font-normal">(gerado automaticamente se vazio)</span>
                </label>
                <input
                  type="text"
                  value={formData.assetNumber || ''}
                  onChange={e => setFormData({ ...formData, assetNumber: e.target.value })}
                  placeholder="Ex: PAT01/2026"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Série
                </label>
                <input
                  type="text"
                  value={formData.serialNumber || ''}
                  onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                  placeholder="Ex: SN-123456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  disabled={isSaving}
                />
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

            {/* Endereço / Localização */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Localização / Endereço</h3>
              <div className="grid grid-cols-12 gap-3">
                {/* CEP */}
                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">CEP</label>
                  <input
                    type="text"
                    value={formData.address?.zipCode || ''}
                    onChange={e => {
                      const masked = e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').substring(0, 9);
                      setFormData({ ...formData, address: { ...(formData.address || {}), zipCode: masked } as any });
                      if (masked.length === 9) {
                        const clean = masked.replace(/\D/g, '');
                        fetch(`/api/cep/${clean}`).then(r => r.ok ? r.json() : null).then(data => {
                          if (data && !data.error) {
                            setFormData(prev => ({
                              ...prev,
                              address: {
                                ...(prev.address || {}),
                                zipCode: data.cep || masked,
                                street: data.logradouro || '',
                                neighborhood: data.bairro || '',
                                city: data.localidade || '',
                                state: data.uf || '',
                              } as any
                            }));
                          }
                        }).catch(() => {});
                      }
                    }}
                    placeholder="00000-000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                    disabled={isSaving}
                  />
                </div>
                {/* Cidade */}
                <div className="col-span-8">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">Cidade</label>
                  <input
                    type="text"
                    value={formData.address?.city || ''}
                    onChange={e => setFormData({ ...formData, address: { ...(formData.address || {}), city: e.target.value } as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={isSaving}
                  />
                </div>
                {/* Rua */}
                <div className="col-span-9">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">Rua</label>
                  <input
                    type="text"
                    value={formData.address?.street || ''}
                    onChange={e => setFormData({ ...formData, address: { ...(formData.address || {}), street: e.target.value } as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={isSaving}
                  />
                </div>
                {/* Número */}
                <div className="col-span-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">Nº</label>
                  <input
                    type="text"
                    value={formData.address?.number || ''}
                    onChange={e => setFormData({ ...formData, address: { ...(formData.address || {}), number: e.target.value } as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={isSaving}
                  />
                </div>
                {/* Complemento */}
                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">Complemento</label>
                  <input
                    type="text"
                    value={formData.address?.complement || ''}
                    onChange={e => setFormData({ ...formData, address: { ...(formData.address || {}), complement: e.target.value } as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={isSaving}
                  />
                </div>
                {/* Bairro */}
                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">Bairro</label>
                  <input
                    type="text"
                    value={formData.address?.neighborhood || ''}
                    onChange={e => setFormData({ ...formData, address: { ...(formData.address || {}), neighborhood: e.target.value } as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    disabled={isSaving}
                  />
                </div>
                {/* Estado */}
                <div className="col-span-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-wider">Estado</label>
                  <input
                    type="text"
                    value={formData.address?.state || ''}
                    onChange={e => setFormData({ ...formData, address: { ...(formData.address || {}), state: e.target.value } as any })}
                    maxLength={2}
                    placeholder="RJ"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm uppercase"
                    disabled={isSaving}
                  />
                </div>
              </div>
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

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={isSaving || !canWriteAssets}
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
