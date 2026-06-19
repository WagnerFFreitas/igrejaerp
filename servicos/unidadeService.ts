/**
 * ============================================================================
 * UNITSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para unit service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import apiClient from './apiService';
import { Unidade } from '../../tipos';

export class UnidadeService {
  static async getUnits(): Promise<Unidade[]> {
    const response = await apiClient.get<Unidade[]>('/unidades');
    return Array.isArray(response) ? response : [];
  }

  static async getUnitById(id: string): Promise<Unidade> {
    return await apiClient.get(`/unidades/${id}`);
  }

  static async updateUnit(id: string, dados: Partial<Unidade>): Promise<Unidade> {
    return await apiClient.put(`/unidades/${id}`, dados);
  }

  static async createUnit(dados: Partial<Unidade>): Promise<Unidade> {
    return await apiClient.post('/unidades', dados);
  }

  static async deleteUnit(id: string): Promise<void> {
    return await apiClient.delete(`/unidades/${id}`);
  }
}

export default UnidadeService;
