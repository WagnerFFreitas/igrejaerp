/**
 * ============================================================================
 * USERSSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para users service.
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
 * Define o bloco principal deste arquivo (users service).
 */

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

export interface AppUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  unitId: string;
  status: 'ACTIVE' | 'INACTIVE';
  is_active?: boolean;
  permissions: AppPermission[];
  unit_name?: string;
  last_login?: string;
}

export class UsersService {
  static async getUsers(): Promise<AppUser[]> {
    return apiClient.get<AppUser[]>('/users');
  }

  static async getPermissionModules(): Promise<PermissionModule[]> {
    return apiClient.get<PermissionModule[]>('/users/permission-modules');
  }

  static async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    unitId: string;
    isActive?: boolean;
  }): Promise<AppUser> {
    return apiClient.post<AppUser>('/users', data);
  }

  static async updateUser(id: string, data: {
    name?: string;
    role?: string;
    unitId?: string;
    isActive?: boolean;
  }): Promise<AppUser> {
    return apiClient.put<AppUser>(`/users/${id}`, data);
  }

  static async updatePermissions(id: string, permissions: AppPermission[]): Promise<AppPermission[]> {
    return apiClient.put<AppPermission[]>(`/users/${id}/permissions`, { permissions });
  }
}

export default UsersService;
