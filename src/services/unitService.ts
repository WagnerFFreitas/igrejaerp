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

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (unit service).
 */

export interface Unit {
  id: string;
  nome: string;
  name?: string;
  cnpj: string;
  enderecoLinha1?: string;
  enderecoLinha2?: string;
  cidade?: string;
  estado?: string;
  email?: string;
  telefone?: string;
  phone?: string;
  sede: boolean;
  isHeadquarter?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  criadoEm?: string;
  atualizadoEm?: string;
}
export class UnitService {
  static async getUnits(): Promise<Unit[]> {
    const response = await apiClient.get('/units');
    return (response as any) || [];
  }

  static async getUnitById(id: string): Promise<Unit> {
    return apiClient.get(`/units/${id}`);
  }

  static async updateUnit(id: string, data: Partial<Unit>): Promise<Unit> {
    return apiClient.put(`/units/${id}`, data);
  }
}
