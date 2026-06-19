
/************************************************************************
*                               MEMBROSERVICE.TS                               *
*************************************************************************
* Serviço de frontend para a gestão de membros.                         *
* O projeto usada em runtime ou build.                                  *
* Ajuda o sistema com uma funcionalidade específica.                    *
*************************************************************************/

import apiClient from './apiService';
import { Membro } from '../../tipos'; // Caminho atualizado e correto

// A interface ApiMembro não é mais necessária, pois a interface Membro já está padronizada.

export interface RespostaListaMembros {
  membros: Membro[];
  paginacao: {
    pagina: number;
    limite: number;
    total: number;
    paginas: number;
  };
}

export class MembroService {
  // Listar membros
  static async getMembros(params?: {
    id_unidade?: string;
    pesquisa?: string;
    situacao?: string;
    pagina?: number;
    limite?: number;
  }): Promise<RespostaListaMembros> {
    // O `apiClient` espera que o retorno da API já seja compatível com `RespostaListaMembros`
    const response = await apiClient.get<RespostaListaMembros>('/membros', params);
    return response;
  }

  // Obter membro por ID
  static async getMembroPorId(id: string): Promise<Membro> {
    return await apiClient.get(`/membros/${id}`);
  }

  // Criar membro
  static async criarMembro(dadosMembro: Partial<Membro>): Promise<Membro> {
    return await apiClient.post('/membros', dadosMembro);
  }

  // Atualizar membro
  static async atualizarMembro(id: string, dadosMembro: Partial<Membro>): Promise<Membro> {
    return await apiClient.put(`/membros/${id}`, dadosMembro);
  }

  // Remover membro (soft delete)
  static async excluirMembro(id: string): Promise<void> {
    return await apiClient.delete(`/membros/${id}`);
  }
}

export default MembroService;
