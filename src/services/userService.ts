// Serviço de Gerenciamento de Usuários

import { UserAuth, UserRole } from '../../types';
import IndexedDBService from './indexedDBService';
import { withTimeout } from '../utils/promiseUtils';

export interface SystemUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  avatar?: string;
  unitId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class UserService {
  private static readonly USERS_STORE = 'system_users';

  // Usuários padrão do sistema
  private static readonly DEFAULT_USERS: SystemUser[] = [
    {
      id: 'u1',
      name: 'Administrador Master',
      username: 'desenvolvedor',
      password: 'dev@ecclesia_secure_2024',
      role: 'DEVELOPER',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
      unitId: 'u-sede',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'u2',
      name: 'Administrador da Igreja',
      username: 'admin@igreja.com',
      password: 'Admin@123',
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      unitId: 'u-sede',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Inicializar usuários padrão no IndexedDB
  static async initializeDefaultUsers(): Promise<void> {
    console.log('👥 Inicializando usuários padrão no IndexedDB...');
    
    try {
      // Verificar se usuários já existem
      const existingUsers = await this.getUsers();
      console.log(`📋 Usuários existentes encontrados: ${existingUsers.length}`);
      
      if (existingUsers.length === 0) {
        console.log('📝 Nenhum usuário encontrado. Criando usuários padrão...');
        
        // Criar usuários um por um e esperar cada um
        for (const user of this.DEFAULT_USERS) {
          console.log(`💾 Salvando usuário: ${user.username}`);
          try {
            await this.saveUser(user);
            console.log(`✅ Usuário criado: ${user.username} (${user.role})`);
          } catch (saveError) {
            console.error(`❌ Erro ao salvar usuário ${user.username}:`, saveError);
            throw saveError;
          }
        }
        
        console.log('🎉 Usuários padrão criados com sucesso!');
        
        // Verificar se foram salvos
        const verifyUsers = await this.getUsers();
        console.log(`🔍 Verificação: ${verifyUsers.length} usuários no banco`);
        verifyUsers.forEach(u => console.log(`  - ${u.username}: ${u.name}`));
        
        if (verifyUsers.length === 0) {
          throw new Error('Usuários não foram salvos corretamente');
        }
        
      } else {
        console.log(`📋 Usuários já existentes: ${existingUsers.length} usuários encontrados`);
        existingUsers.forEach(u => console.log(`  - ${u.username}: ${u.name}`));
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar usuários padrão:', error);
      throw error;
    }
  }

  // Autenticar usuário
  static async authenticate(username: string, password: string): Promise<SystemUser | null> {
    console.log('🔐 Autenticando usuário:', username);
    console.log('🔑 Senha fornecida:', password ? '***' : '(vazia)');
    
    try {
      const users = await this.getUsers();
      console.log(`👥 Total de usuários no banco: ${users.length}`);
      
      users.forEach(u => {
        console.log(`  - ${u.username}: ${u.name} (ativo: ${u.isActive})`);
      });
      
      const user = users.find(u => {
        const usernameMatch = u.username === username;
        const passwordMatch = u.password === password;
        const isActive = u.isActive;
        
        console.log(`🔍 Verificando ${u.username}:`, {
          usernameMatch,
          passwordMatch,
          isActive,
          result: usernameMatch && passwordMatch && isActive
        });
        
        return usernameMatch && passwordMatch && isActive;
      });
      
      if (user) {
        console.log(`✅ Usuário autenticado: ${user.name} (${user.role})`);
        
        // Atualizar último acesso
        await this.updateLastAccess(user.id);
        
        return user;
      } else {
        console.log('❌ Usuário não encontrado ou senha incorreta');
        return null;
      }
    } catch (error) {
      console.error('❌ Erro na autenticação:', error);
      return null;
    }
  }

  // Obter todos os usuários
  static async getUsers(): Promise<SystemUser[]> {
    try {
      return await withTimeout(IndexedDBService.getAll(UserService.USERS_STORE), 10000);
    } catch (error) {
      console.error('❌ UserService: Erro ao carregar usuários:', error);
      return [];
    }
  }

  // Salvar usuário
  static async saveUser(user: SystemUser): Promise<void> {
    try {
      await withTimeout(IndexedDBService.save(UserService.USERS_STORE, user), 10000);
      console.log(`💾 Usuário salvo com sucesso: ${user.username}`);
    } catch (error) {
      console.error('❌ UserService: Erro ao salvar usuário:', error);
      throw error;
    }
  }

  // Atualizar último acesso
  static async updateLastAccess(userId: string): Promise<void> {
    try {
      const users = await this.getUsers();
      const user = users.find(u => u.id === userId);
      
      if (user) {
        user.updatedAt = new Date().toISOString();
        await this.saveUser(user);
        console.log(`🕐 Último acesso atualizado: ${user.username}`);
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar último acesso:', error);
    }
  }

  // Criar novo usuário
  static async createUser(userData: Omit<SystemUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const newUser: SystemUser = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await this.saveUser(newUser);
    console.log(`➕ Novo usuário criado: ${newUser.username}`);
    
    return newUser.id;
  }

  // Atualizar usuário
  static async updateUser(userId: string, updates: Partial<SystemUser>): Promise<void> {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        await this.saveUser(users[userIndex]);
        console.log(`✏️ Usuário atualizado: ${users[userIndex].username}`);
      } else {
        throw new Error('Usuário não encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Desativar usuário
  static async deactivateUser(userId: string): Promise<void> {
    await this.updateUser(userId, { isActive: false });
    console.log(`🔒 Usuário desativado: ${userId}`);
  }

  // Verificar se usuário existe
  static async userExists(username: string): Promise<boolean> {
    try {
      const users = await this.getUsers();
      return users.some(u => u.username === username);
    } catch (error) {
      console.error('❌ Erro ao verificar existência do usuário:', error);
      return false;
    }
  }

  // Obter usuário por ID
  static async getUserById(userId: string): Promise<SystemUser | null> {
    try {
      const users = await this.getUsers();
      return users.find(u => u.id === userId) || null;
    } catch (error) {
      console.error('❌ Erro ao obter usuário por ID:', error);
      return null;
    }
  }

  // Obter usuário por username
  static async getUserByUsername(username: string): Promise<SystemUser | null> {
    try {
      const users = await this.getUsers();
      return users.find(u => u.username === username) || null;
    } catch (error) {
      console.error('❌ Erro ao obter usuário por username:', error);
      return null;
    }
  }

  // Mudar senha
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      
      if (user.password !== currentPassword) {
        throw new Error('Senha atual incorreta');
      }
      
      await this.updateUser(userId, { password: newPassword });
      console.log(`🔐 Senha alterada: ${user.username}`);
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao alterar senha:', error);
      return false;
    }
  }

  // Resetar senha (admin)
  static async resetPassword(userId: string, newPassword: string): Promise<void> {
    try {
      await this.updateUser(userId, { password: newPassword });
      console.log(`🔐 Senha resetada: ${userId}`);
    } catch (error) {
      console.error('❌ Erro ao resetar senha:', error);
      throw error;
    }
  }

  // Estatísticas dos usuários
  static async getUserStats(): Promise<any> {
    try {
      const users = await this.getUsers();
      
      const stats = {
        total: users.length,
        ativos: users.filter(u => u.isActive).length,
        inativos: users.filter(u => !u.isActive).length,
        porRole: {} as any,
        porUnidade: {} as any
      };

      // Agrupar por role
      users.forEach(user => {
        stats.porRole[user.role] = (stats.porRole[user.role] || 0) + 1;
      });

      // Agrupar por unidade
      users.forEach(user => {
        stats.porUnidade[user.unitId] = (stats.porUnidade[user.unitId] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error);
      return null;
    }
  }
}

export default UserService;
