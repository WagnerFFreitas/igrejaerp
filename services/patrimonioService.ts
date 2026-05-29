/**
 * ============================================================================
 * PATRIMONIOSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para patrimonio service.
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

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (patrimonio service).
 */

const UNIT_ID_ALIASES: Record<string, string> = {
  'u-sede':  '00000000-0000-0000-0000-000000000001',
  'u-matriz':'00000000-0000-0000-0000-000000000001',
};
const normalizeUnitId = (id: string) => UNIT_ID_ALIASES[id] || id;

export const patrimonioService = {
  getAssets: async (unitId: string) => {
    try {
      const data = await apiClient.get<any[]>('/patrimonios', { unitId: normalizeUnitId(unitId) });
      return data || [];
    } catch (e) {
      console.error('❌ patrimonioService.getAssets:', e);
      return [];
    }
  },

  // Alias usado pelo Patrimonio.tsx
  registerAsset: async (asset: any) => {
    const payload = { ...asset, unitId: normalizeUnitId(asset.unitId || asset.id_unidade) };
    return apiClient.post('/patrimonios', payload);
  },

  createAsset: async (asset: any) => {
    const payload = { ...asset, unitId: normalizeUnitId(asset.unitId || asset.id_unidade) };
    return apiClient.post('/patrimonios', payload);
  },

  updateAsset: async (id: string, asset: any) => {
    return apiClient.put(`/patrimonios/${id}`, asset);
  },

  deleteAsset: async (id: string) => {
    return apiClient.delete(`/patrimonios/${id}`);
  },
};
