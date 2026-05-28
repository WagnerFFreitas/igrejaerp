/**
 * ============================================================================
 * USERSSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para usuarios service.
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
import { Usuario } from '../../tipos';

export interface PermissionModule {
  code: string;
  name: string;
  category: string;
  description: string;
}

export interface AppPermission {
  moduleCode: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canManage: boolean;
}

export class UsersService {
  static async getUsers(): Promise<Usuario[]> {
    return apiClient.get<Usuario[]>('/usuarios');
  }

  static async getPermissionModules(): Promise<PermissionModule[]> {
    return apiClient.get<PermissionModule[]>('/usuarios/permission-modules');
  }

  static async createUser(dados: {
    nome: string;
    email: string;
    username: string;
    role: string;
    id_unidade: string;
  }): Promise<Usuario> {
    return apiClient.post<Usuario>('/usuarios', dados);
  }

  static async updateUser(id: string, dados: Partial<Usuario>): Promise<Usuario> {
    return apiClient.put<Usuario>(`/usuarios/${id}`, dados);
  }

  static async updatePermissions(id: string, permissions: AppPermission[]): Promise<AppPermission[]> {
    return apiClient.put<AppPermission[]>(`/usuarios/${id}/permissions`, { permissions });
  }
}

export default UsersService;
