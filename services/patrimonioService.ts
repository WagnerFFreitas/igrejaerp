/**
 * ============================================================================
 * SERVICE DE PATRIMÔNIO
 * ============================================================================
 * Gerencia bens patrimoniais, depreciação, inventário e transferências
 * ============================================================================
 */

import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  updateDoc,
  query, 
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { 
  Asset, 
  AssetDepreciation, 
  AssetTransfer, 
  AssetMaintenance,
  InventoryCount,
  InventoryAdjustment,
  AssetType,
  AssetStatus
} from '../types';
import {
  calcularDepreciacaoLinear,
  calcularDepreciacaoAcelerada,
  calcularValorResidual,
  calcularVidaUtilRestante,
  projetarDepreciacaoFutura,
  gerarLancamentoContabil,
  calcularDepreciacaoTotal,
  DepreciationData
} from '../utils/depreciacaoCalculations';

export const patrimonioService = {
  get db() {
    return getFirestore();
  },

  /**
   * ==========================================================================
   * GESTÃO DE BENS PATRIMONIAIS
   * ==========================================================================
   */

  /**
   * Cadastrar novo bem patrimonial
   */
  async registerAsset(assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Promise<Asset> {
    // Gerar número de patrimônio automático
    const assetNumber = await gerarNumeroPatrimonio(this.db, assetData.unitId);
    
    const asset: Asset = {
      ...assetData,
      id: crypto.randomUUID(),
      assetNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Salvar no Firebase
    const docRef = doc(this.db, 'patrimonio/assets', asset.id);
    await setDoc(docRef, asset);

    return asset;
  },

  /**
   * Atualizar dados do bem
   */
  async updateAsset(assetId: string, updates: Partial<Asset>): Promise<void> {
    const docRef = doc(this.db, 'patrimonio/assets', assetId);
    
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Buscar todos os bens de uma unidade
   */
  async getAssets(unitId: string, category?: AssetType, status?: AssetStatus): Promise<Asset[]> {
    let constraints: any[] = [where('unitId', '==', unitId)];
    
    if (category) {
      constraints.push(where('category', '==', category));
    }
    
    if (status) {
      constraints.push(where('status', '==', status));
    }

    const q = query(collection(this.db, 'patrimonio/assets'), ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Asset));
  },

  /**
   * Buscar bem por ID
   */
  async getAssetById(assetId: string): Promise<Asset | null> {
    const docRef = doc(this.db, 'patrimonio/assets', assetId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Asset;
    }
    
    return null;
  },

  /**
   * Baixar bem patrimonial
   */
  async disposeAsset(
    assetId: string,
    reason: string,
    disposalValue?: number
  ): Promise<void> {
    const asset = await this.getAssetById(assetId);
    
    if (!asset) {
      throw new Error('Bem patrimonial não encontrado');
    }

    // Atualizar status para BAIXADO
    await this.updateAsset(assetId, {
      status: 'BAIXADO',
      observations: `Baixa em ${new Date().toLocaleDateString('pt-BR')}: ${reason}`,
      ...(disposalValue !== undefined && { currentValue: disposalValue }),
    });
  },

  /**
   * ==========================================================================
   * CÁLCULO DE DEPRECIAÇÃO
   * ==========================================================================
   */

  /**
   * Calcular depreciação de um bem específico
   */
  async calculateDepreciation(
    assetId: string,
    referenceDate: string = new Date().toISOString()
  ): Promise<AssetDepreciation> {
    const asset = await this.getAssetById(assetId);
    
    if (!asset) {
      throw new Error('Bem patrimonial não encontrado');
    }

    // Calcular meses decorridos
    const dataAquisicao = new Date(asset.acquisitionDate);
    const dataRef = new Date(referenceDate);
    const mesesDecorridos = 
      (dataRef.getFullYear() - dataAquisicao.getFullYear()) * 12 +
      (dataRef.getMonth() - dataAquisicao.getMonth());

    // Calcular valor residual
    const valorResidual = calcularValorResidual(asset);

    // Calcular depreciação conforme método
    let dadosDepreciacao: DepreciationData;
    
    if (asset.depreciationMethod === 'ACELERADA') {
      dadosDepreciacao = calcularDepreciacaoAcelerada(
        asset.acquisitionValue,
        asset.depreciationRate,
        mesesDecorridos,
        valorResidual
      );
    } else {
      dadosDepreciacao = calcularDepreciacaoLinear(
        asset.acquisitionValue,
        asset.usefulLifeMonths,
        mesesDecorridos,
        valorResidual
      );
    }

    // Criar registro de depreciação
    const depreciation: AssetDepreciation = {
      id: crypto.randomUUID(),
      assetId,
      unitId: asset.unitId,
      referenceMonth: dataRef.getMonth() + 1,
      referenceYear: dataRef.getFullYear(),
      beginningBookValue: asset.currentBookValue,
      depreciationExpense: dadosDepreciacao.depreciationExpense,
      accumulatedDepreciation: dadosDepreciacao.accumulatedDepreciation,
      endingBookValue: dadosDepreciacao.bookValue,
      processedAt: new Date().toISOString(),
    };

    // Salvar registro
    const docRef = doc(this.db, 'patrimonio/depreciations', depreciation.id);
    await setDoc(docRef, depreciation);

    // Atualizar bem com novos valores
    await this.updateAsset(assetId, {
      currentBookValue: dadosDepreciacao.bookValue,
      accumulatedDepreciation: dadosDepreciacao.accumulatedDepreciation,
    });

    return depreciation;
  },

  /**
   * Processar depreciação mensal de todos os bens
   */
  async processMonthlyDepreciation(
    unitId: string,
    referenceDate: string = new Date().toISOString()
  ): Promise<{
    processedCount: number;
    totalDepreciation: number;
    records: AssetDepreciation[];
  }> {
    // Buscar todos os bens ativos da unidade
    const assets = await this.getAssets(unitId, undefined, 'ATIVO');
    
    const records: AssetDepreciation[] = [];
    let totalDepreciation = 0;

    // Processar cada bem
    for (const asset of assets) {
      try {
        const depreciation = await this.calculateDepreciation(asset.id, referenceDate);
        records.push(depreciation);
        totalDepreciation += depreciation.depreciationExpense;
      } catch (error) {
        console.error(`Erro ao calcular depreciação do bem ${asset.id}:`, error);
      }
    }

    return {
      processedCount: records.length,
      totalDepreciation: parseFloat(totalDepreciation.toFixed(2)),
      records,
    };
  },

  /**
   * ==========================================================================
   * TRANSFERÊNCIA DE BENS
   * ==========================================================================
   */

  /**
   * Transferir bem entre unidades
   */
  async transferAsset(
    assetId: string,
    fromUnitId: string,
    toUnitId: string,
    responsible: string,
    reason: string,
    authorizedBy: string
  ): Promise<AssetTransfer> {
    const asset = await this.getAssetById(assetId);
    
    if (!asset) {
      throw new Error('Bem patrimonial não encontrado');
    }

    // Criar registro de transferência
    const transfer: AssetTransfer = {
      id: crypto.randomUUID(),
      assetId,
      fromUnitId,
      toUnitId,
      transferDate: new Date().toISOString(),
      reason,
      responsible,
      authorizedBy,
      status: 'REALIZADA',
      createdAt: new Date().toISOString(),
    };

    // Salvar transferência
    const docRef = doc(this.db, 'patrimonio/transfers', transfer.id);
    await setDoc(docRef, transfer);

    // Atualizar bem com nova unidade
    await this.updateAsset(assetId, {
      unitId: toUnitId,
      location: asset.location, // Manter localização ou atualizar
      updatedAt: new Date().toISOString(),
    });

    return transfer;
  },

  /**
   * ==========================================================================
   * INVENTÁRIO FÍSICO
   * ==========================================================================
   */

  /**
   * Realizar contagem de inventário
   */
  async performInventoryCount(
    unitId: string,
    countedBy: string,
    items: Array<{
      assetId: string;
      countedQuantity: number;
      condition: 'BOM' | 'REGULAR' | 'RUIM' | 'SUCATA';
      location?: string;
      observations?: string;
    }>
  ): Promise<InventoryCount> {
    // Buscar bens esperados na unidade
    const assets = await this.getAssets(unitId);
    
    // Mapear bens esperados
    const expectedAssets = new Map(assets.map(a => [a.id, a]));
    
    // Processar itens contados
    const inventoryItems = items.map(item => {
      const expected = expectedAssets.get(item.assetId) as Asset | undefined;
      const expectedQuantity = expected ? 1 : 0; // Cada bem é único
      
      return {
        assetId: item.assetId,
        assetName: expected?.name || 'Bem não cadastrado',
        category: expected?.category || 'OUTROS' as AssetType,
        expectedQuantity,
        countedQuantity: item.countedQuantity,
        difference: item.countedQuantity - expectedQuantity,
        condition: item.condition,
        location: item.location,
        observations: item.observations,
      };
    });

    // Calcular totais
    const totalFound = items.reduce((sum, item) => sum + item.countedQuantity, 0);
    const totalExpected = assets.length;
    const totalDifference = totalFound - totalExpected;

    // Criar registro de inventário
    const inventory: InventoryCount = {
      id: crypto.randomUUID(),
      unitId,
      countDate: new Date().toISOString(),
      countedBy,
      status: 'CONCLUIDO',
      items: inventoryItems,
      totalAssets: items.length,
      totalExpected,
      totalFound,
      totalDifference,
      completionPercentage: 100,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    // Salvar inventário
    const docRef = doc(this.db, 'patrimonio/inventory', inventory.id);
    await setDoc(docRef, inventory);

    // Atualizar bens com data do último inventário
    for (const item of items) {
      await this.updateAsset(item.assetId, {
        lastInventoryDate: inventory.countDate,
        inventoryCount: item.countedQuantity,
        condition: item.condition,
      });
    }

    return inventory;
  },

  /**
   * Realizar ajuste de inventário
   */
  async adjustInventory(
    inventoryCountId: string,
    assetId: string,
    unitId: string,
    adjustmentType: 'ENTRADA' | 'SAIDA' | 'BAIXA',
    quantity: number,
    reason: string,
    justification: string
  ): Promise<InventoryAdjustment> {
    const adjustment: InventoryAdjustment = {
      id: crypto.randomUUID(),
      inventoryCountId,
      assetId,
      unitId,
      adjustmentType,
      quantity,
      reason,
      justification,
      createdAt: new Date().toISOString(),
    };

    // Salvar ajuste
    const docRef = doc(this.db, 'patrimonio/inventory-adjustments', adjustment.id);
    await setDoc(docRef, adjustment);

    // Se for baixa, atualizar o bem
    if (adjustmentType === 'BAIXA') {
      await this.disposeAsset(assetId, `Ajuste de inventário: ${reason}`);
    }

    return adjustment;
  },

  /**
   * ==========================================================================
   * MANUTENÇÃO DE BENS
   * ==========================================================================
   */

  /**
   * Registrar manutenção de bem
   */
  async registerMaintenance(
    maintenanceData: Omit<AssetMaintenance, 'id' | 'createdAt'>
  ): Promise<AssetMaintenance> {
    const maintenance: AssetMaintenance = {
      ...maintenanceData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    // Salvar manutenção
    const docRef = doc(this.db, 'patrimonio/maintenances', maintenance.id);
    await setDoc(docRef, maintenance);

    // Se for realizada, atualizar bem
    if (maintenance.status === 'REALIZADA') {
      await this.updateAsset(maintenanceData.assetId, {
        updatedAt: new Date().toISOString(),
        ...(maintenance.cost > 0 && {
          currentValue: (await this.getAssetById(maintenanceData.assetId))?.currentValue || 0
        }),
      });
    }

    return maintenance;
  },

  /**
   * ==========================================================================
   * RELATÓRIOS E CONSULTAS
   * ==========================================================================
   */

  /**
   * Gerar relatório patrimonial consolidado
   */
  async generatePatrimonioReport(
    unitId: string,
    referenceDate: string = new Date().toISOString()
  ): Promise<{
    totalAssets: number;
    totalAcquisitionValue: number;
    totalCurrentValue: number;
    totalAccumulatedDepreciation: number;
    assetsByCategory: Record<string, number>;
    assetsByStatus: Record<string, number>;
    depreciationSummary: {
      monthlyDepreciation: number;
      annualDepreciation: number;
      assetsFullyDepreciated: number;
    };
  }> {
    // Buscar todos os bens da unidade
    const assets = await this.getAssets(unitId);

    // Calcular totais
    const totalAssets = assets.length;
    const totalAcquisitionValue = assets.reduce((sum, a) => sum + a.acquisitionValue, 0);
    const totalCurrentValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
    const totalAccumulatedDepreciation = assets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0);

    // Agrupar por categoria
    const assetsByCategory: Record<string, number> = {};
    assets.forEach(asset => {
      assetsByCategory[asset.category] = (assetsByCategory[asset.category] || 0) + 1;
    });

    // Agrupar por status
    const assetsByStatus: Record<string, number> = {};
    assets.forEach(asset => {
      assetsByStatus[asset.status] = (assetsByStatus[asset.status] || 0) + 1;
    });

    // Calcular resumo de depreciação
    const depreciationSummary = calcularDepreciacaoTotal(assets, referenceDate);

    return {
      totalAssets,
      totalAcquisitionValue: parseFloat(totalAcquisitionValue.toFixed(2)),
      totalCurrentValue: parseFloat(totalCurrentValue.toFixed(2)),
      totalAccumulatedDepreciation: parseFloat(totalAccumulatedDepreciation.toFixed(2)),
      assetsByCategory,
      assetsByStatus,
      depreciationSummary: {
        monthlyDepreciation: depreciationSummary.totalDepreciationMonth,
        annualDepreciation: parseFloat((depreciationSummary.totalDepreciationMonth * 12).toFixed(2)),
        assetsFullyDepreciated: depreciationSummary.assetsFullyDepreciated,
      },
    };
  },

  /**
   * ==========================================================================
   * FUNÇÕES AUXILIARES
   * ==========================================================================
   */
};

/**
 * Gerar número de patrimônio sequencial (função auxiliar)
 */
async function gerarNumeroPatrimonio(db: any, unitId: string): Promise<string> {
  // Buscar último número cadastrado
  const q = query(
    collection(db, 'patrimonio/assets'),
    where('unitId', '==', unitId),
    orderBy('assetNumber', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return `${unitId}-000001`;
  }

  // Extrair último número e incrementar
  const lastDoc = snapshot.docs[snapshot.docs.length - 1];
  const lastNumber = lastDoc.data().assetNumber;
  const parts = lastNumber.split('-');
  const currentNumber = parseInt(parts[parts.length - 1]);
  const nextNumber = currentNumber + 1;

  return `${unitId}-${nextNumber.toString().padStart(6, '0')}`;
}
