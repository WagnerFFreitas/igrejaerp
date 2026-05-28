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
import { Unidade } from '../../types';

export class UnitService {
  static async getUnits(): Promise<Unidade[]> {
    const response = await apiClient.get<Unidade[]>('/units');
    return Array.isArray(response) ? response : [];
  }

  static async getUnitById(id: string): Promise<Unidade> {
    return await apiClient.get(`/units/${id}`);
  }

  static async updateUnit(id: string, dados: Partial<Unidade>): Promise<Unidade> {
    return await apiClient.put(`/units/${id}`, dados);
  }

  static async createUnit(dados: Partial<Unidade>): Promise<Unidade> {
    return await apiClient.post('/units', dados);
  }

  static async deleteUnit(id: string): Promise<void> {
    return await apiClient.delete(`/units/${id}`);
  }
}

export default UnitService;
