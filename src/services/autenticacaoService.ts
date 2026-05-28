/**
 * ============================================================================
 * AUTHSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para auth service.
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

export interface LoginResponse {
  user: Usuario;
  token: string;
  expiresIn: string;
}

export type PermissionAction = 'read' | 'write' | 'delete' | 'manage';

const TAB_PERMISSION_MAP: Record<string, string> = {
  dashboard: 'dashboard',
  members: 'members',
  finance: 'finance',
  patrimonios: 'patrimonios',
  rh: 'hr',
  dp: 'funcionarios',
  leaves: 'leaves',
  folha_pagamento: 'folha_pagamento',
  eventos_igreja: 'eventos_igreja',
  reports: 'reports',
  messages: 'communication',
  audit: 'audit',
  portal: 'portal',
  settings: 'settings'
};

export class AutenticacaoService {
  // Login
  static async login(identifier: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.login(identifier, password);
      
      // Salvar token e usuário no localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Erro ao fazer login');
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await apiClient.logout();
    } catch (error) {
      // Ignorar erro de logout
    } finally {
      // Limpar dados locais
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  // Verificar token
  static async verifyToken(): Promise<{ valid: boolean; user?: Usuario }> {
    try {
      const response = await apiClient.verifyToken();
      return response;
    } catch (error) {
      // Token inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { valid: false };
    }
  }

  // Observar mudanças de autenticação
  static onAuthStateChange(callback: (user: Usuario | null) => void) {
    const user = this.getCurrentUser();
    callback(user);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        callback(newUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }

  // Atualizar perfil
  static async updateProfile(data: Partial<Usuario>): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) throw new Error('Usuário não autenticado');

      await apiClient.put(`/usuarios/${currentUser.id_usuario}`, data);
      
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Erro ao atualizar perfil');
    }
  }

  // Verificar se usuário é admin
  static isAdmin(user: Usuario): boolean {
    return user.role === 'ADMIN' || user.role === 'DEVELOPER';
  }

  static hasPermission(
    user: Pick<Usuario, 'role' | 'permissions' | 'unrestrictedAccess'> | null | undefined,
    moduleCode: string,
    action: PermissionAction = 'read'
  ): boolean {
    if (!user) return false;
    if (user.role === 'DEVELOPER' || user.unrestrictedAccess) return true;

    const permission = user.permissions?.find(item => item.moduleCode === moduleCode);
    if (!permission) return false;

    if (action === 'read') return !!permission.canRead;
    if (action === 'write') return !!permission.canWrite;
    if (action === 'delete') return !!permission.canDelete;
    return !!permission.canManage;
  }

  // Verificar permissão de unidade
  static hasUnitAccess(user: Usuario, id_unidade: string): boolean {
    return user.id_unidade === id_unidade || user.role === 'ADMIN' || user.role === 'DEVELOPER';
  }

  // Obter usuário atual
  static getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Verificar se está autenticado
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken') && !!localStorage.getItem('user');
  }

  // Obter token atual
  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export default AutenticacaoService;
