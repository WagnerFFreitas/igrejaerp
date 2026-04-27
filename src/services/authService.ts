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

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (auth service).
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  role: 'ADMIN' | 'SECRETARY' | 'TREASURER' | 'PASTOR' | 'RH' | 'DP' | 'FINANCEIRO' | 'DEVELOPER';
  unitId: string;
  unit_name?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  permissions?: Array<{
    moduleCode: string;
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canManage: boolean;
  }>;
  unrestrictedAccess?: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  user: UserProfile;
  token: string;
  expiresIn: string;
}

export type PermissionAction = 'read' | 'write' | 'delete' | 'manage';

const TAB_PERMISSION_MAP: Record<string, string> = {
  dashboard: 'dashboard',
  members: 'members',
  finance: 'finance',
  assets: 'assets',
  rh: 'hr',
  dp: 'employees',
  leaves: 'leaves',
  payroll: 'payroll',
  events: 'events',
  reports: 'reports',
  messages: 'communication',
  audit: 'audit',
  portal: 'portal',
  settings: 'settings'
};

export class AuthService {
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
  static async verifyToken(): Promise<{ valid: boolean; user?: UserProfile }> {
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

  // Observar mudanças de autenticação (simulado com localStorage)
  static onAuthStateChange(callback: (user: UserProfile | null) => void) {
    // Verificar estado inicial
    const user = this.getCurrentUser();
    callback(user);

    // Escutar mudanças no storage (alternativa para Firebase onAuthStateChanged)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        callback(newUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Retornar função para limpar listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }

  // Atualizar perfil
  static async updateProfile(data: Partial<UserProfile>): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) throw new Error('Usuário não autenticado');

      // Fazer chamada PUT para /users/:id
      await apiClient.put(`/users/${currentUser.id}`, data);
      
      // Atualizar dados locais
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Erro ao atualizar perfil');
    }
  }

  // Resetar senha
  static async resetPassword(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Erro ao resetar senha');
    }
  }

  // Verificar se usuário é admin
  static isAdmin(user: UserProfile): boolean {
    return user.role === 'ADMIN' || user.role === 'DEVELOPER';
  }

  static hasPermission(
    user: Pick<UserProfile, 'role' | 'permissions' | 'unrestrictedAccess'> | null | undefined,
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

  static getModuleCodeForTab(tabId: string): string {
    return TAB_PERMISSION_MAP[tabId] || tabId;
  }

  static canAccessTab(
    user: Pick<UserProfile, 'role' | 'permissions' | 'unrestrictedAccess'> | null | undefined,
    tabId: string,
    action: PermissionAction = 'read'
  ): boolean {
    return this.hasPermission(user, this.getModuleCodeForTab(tabId), action);
  }

  static getAccessibleTabs(
    user: Pick<UserProfile, 'role' | 'permissions' | 'unrestrictedAccess'> | null | undefined
  ): string[] {
    return Object.keys(TAB_PERMISSION_MAP).filter(tabId => this.canAccessTab(user, tabId));
  }

  static canManageUsers(
    user: Pick<UserProfile, 'role' | 'permissions' | 'unrestrictedAccess'> | null | undefined
  ): boolean {
    return (
      this.hasPermission(user, 'users', 'manage') ||
      this.hasPermission(user, 'permissions', 'manage')
    );
  }

  // Verificar permissão de unidade
  static hasUnitAccess(user: UserProfile, unitId: string): boolean {
    return user.unitId === unitId || user.role === 'ADMIN' || user.role === 'DEVELOPER';
  }

  // Obter usuário atual
  static getCurrentUser(): UserProfile | null {
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

export default AuthService;
