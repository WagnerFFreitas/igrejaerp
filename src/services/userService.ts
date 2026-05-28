/**
 * ============================================================================
 * USERSERVICE.TS
 * ============================================================================
 *
 * Serviço do frontend para gerenciamento de usuários locais (IndexedDB).
 */

import { Usuario } from '../../types';
import IndexedDBService from './indexedDBService';
import { withTimeout } from '../utils/promiseUtils';

export class UserService {
  private static readonly USERS_STORE = 'system_users';

  // Usuários padrão do sistema (alinhados com o banco de dados)
  private static readonly DEFAULT_USERS: Usuario[] = [
    {
      id_usuario: 'u1',
      id_pessoa: 'p1',
      nome: 'Administrador Master',
      username: 'desenvolvedor',
      role: 'DEVELOPER',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
      id_unidade: 'u-sede',
      unrestrictedAccess: true
    },
    {
      id_usuario: 'u2',
      id_pessoa: 'p2',
      nome: 'Administrador da Igreja',
      username: 'admin@igreja.com',
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      id_unidade: 'u-sede'
    }
  ];

  // Inicializar usuários padrão no IndexedDB
  static async initializeDefaultUsers(): Promise<void> {
    console.log('👥 Inicializando usuários padrão no IndexedDB...');
    try {
      const existingUsers = await this.getUsers();
      if (existingUsers.length === 0) {
        for (const user of this.DEFAULT_USERS) {
          await this.saveUser(user);
        }
        console.log('🎉 Usuários padrão criados com sucesso!');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar usuários padrão:', error);
      throw error;
    }
  }

  // Obter todos os usuários
  static async getUsers(): Promise<Usuario[]> {
    try {
      return await withTimeout(IndexedDBService.getAll(UserService.USERS_STORE), 10000);
    } catch (error) {
      console.error('❌ UserService: Erro ao carregar usuários:', error);
      return [];
    }
  }

  // Salvar usuário
  static async saveUser(user: Usuario): Promise<void> {
    try {
      await withTimeout(IndexedDBService.save(UserService.USERS_STORE, user), 10000);
    } catch (error) {
      console.error('❌ UserService: Erro ao salvar usuário:', error);
      throw error;
    }
  }

  // Obter usuário por ID
  static async getUserById(id: string): Promise<Usuario | null> {
    try {
      const users = await this.getUsers();
      return users.find(u => u.id_usuario === id) || null;
    } catch (error) {
      console.error('❌ Erro ao obter usuário por ID:', error);
      return null;
    }
  }

  // Criar novo usuário
  static async createUser(userData: Usuario): Promise<string> {
    await this.saveUser(userData);
    return userData.id_usuario;
  }

  // Atualizar usuário
  static async updateUser(id: string, updates: Partial<Usuario>): Promise<void> {
    try {
      const user = await this.getUserById(id);
      if (user) {
        const updatedUser = { ...user, ...updates };
        await this.saveUser(updatedUser);
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    }
  }
}

export default UserService;
