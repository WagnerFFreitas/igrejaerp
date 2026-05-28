/**
 * ============================================================================
 * MEMBERSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para member service.
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
import { Membro } from '../../types';

// Interface da API (reflete o banco de dados em PT/snake_case)
export interface ApiMembro extends Membro {
  unit_name?: string;
}

export interface MemberListResponse {
  members: ApiMembro[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export class MemberService {
  // Listar membros
  static async getMembers(params?: {
    id_unidade?: string;
    search?: string;
    situacao?: string;
    page?: number;
    limit?: number;
  }): Promise<{members: Membro[], pagination: any}> {
    const response = await apiClient.get<MemberListResponse>('/members', params);
    
    return {
      members: response.members,
      pagination: response.pagination
    };
  }

  // Obter membro por ID
  static async getMemberById(id: string): Promise<Membro> {
    return await apiClient.get(`/members/${id}`);
  }

  // Criar membro
  static async createMember(dadosMembro: Partial<Membro>): Promise<Membro> {
    return await apiClient.post('/members', dadosMembro);
  }

  // Atualizar membro
  static async updateMember(id: string, dadosMembro: Partial<Membro>): Promise<Membro> {
    return await apiClient.put(`/members/${id}`, dadosMembro);
  }

  // Remover membro (soft delete)
  static async deleteMember(id: string): Promise<void> {
    return await apiClient.delete(`/members/${id}`);
  }
}

export default MemberService;
