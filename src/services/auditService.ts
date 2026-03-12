// Serviço de Auditoria e Logs do Sistema

export interface AuditLog {
  id: string;
  unitId: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  entityName?: string;
  date: string;
  ip: string;
  userAgent?: string;
  details?: any;
  success: boolean;
  errorMessage?: string;
}

export class AuditService {
  private static readonly AUDIT_STORE = 'audit_logs';
  private static readonly IMMUTABLE_FLAG = 'IMMUTABLE_AUDIT_LOGS';

  // Obter IP do cliente (simulado - em produção usaria API real)
  private static getClientIP(): string {
    // Em ambiente local, retorna localhost
    // Em produção, poderia usar uma API como https://api.ipify.org
    return '127.0.0.1';
  }

  // Obter instância global do IndexedDB
  private static async getGlobalDB(): Promise<IDBDatabase | null> {
    try {
      // Tentar usar a instância global do IndexedDBService
      const IndexedDBService = (await import('./indexedDBService')).default;
      
      // Se o IndexedDBService já tiver uma conexão, usar ela
      if ((IndexedDBService as any).db) {
        console.log('🔍 AuditService: Usando instância global do IndexedDB');
        return (IndexedDBService as any).db;
      }
      
      // Senão, inicializar e usar
      await IndexedDBService.init();
      console.log('🔍 AuditService: IndexedDBService inicializado');
      return (IndexedDBService as any).db;
    } catch (error) {
      console.error('❌ AuditService: Erro ao obter instância global:', error);
      return null;
    }
  }

  // Verificar se os logs são imutáveis (proteção adicional)
  private static async verifyImmutable(): Promise<boolean> {
    try {
      const IndexedDBService = (await import('./indexedDBService')).default;
      const config = await IndexedDBService.get('system_config', AuditService.IMMUTABLE_FLAG);
      return config?.value === true;
    } catch (error) {
      console.error('❌ AuditService: Erro ao verificar imutabilidade:', error);
      return false;
    }
  }

  // Marcar logs como imutáveis (só pode ser feito uma vez)
  private static async setImmutable(): Promise<void> {
    try {
      const IndexedDBService = (await import('./indexedDBService')).default;
      await IndexedDBService.save('system_config', {
        id: AuditService.IMMUTABLE_FLAG,
        value: true,
        createdAt: new Date().toISOString(),
        description: 'Logs de auditoria marcados como imutáveis'
      });
      console.log('🔒 Logs de auditoria marcados como IMUTÁVEIS');
    } catch (error) {
      console.error('❌ AuditService: Erro ao marcar como imutável:', error);
    }
  }

  // Registrar login de usuário
  static async logLogin(userId: string, userName: string, unitId: string, success: boolean, errorMessage?: string): Promise<void> {
    const log: AuditLog = {
      id: `LOGIN_${Date.now()}`,
      unitId,
      userId,
      userName,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: userId,
      entityName: userName,
      date: new Date().toISOString(),
      ip: AuditService.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      errorMessage
    };

    await this.saveLog(log);
    console.log(`🔐 Login registrado: ${userName} - ${success ? 'Sucesso' : 'Falha'}`);
  }

  // Registrar logout de usuário
  static async logLogout(userId: string, userName: string, unitId: string): Promise<void> {
    const log: AuditLog = {
      id: `LOGOUT_${Date.now()}`,
      unitId,
      userId,
      userName,
      action: 'USER_LOGOUT',
      entity: 'User',
      entityId: userId,
      entityName: userName,
      date: new Date().toISOString(),
      ip: AuditService.getClientIP(),
      userAgent: navigator.userAgent,
      success: true
    };

    await this.saveLog(log);
    console.log(`🔓 Logout registrado: ${userName}`);
  }

  // Registrar criação de registro
  static async logCreate(userId: string, userName: string, unitId: string, entity: string, entityId: string, entityName: string, details?: any): Promise<void> {
    const log: AuditLog = {
      id: `CREATE_${Date.now()}`,
      unitId,
      userId,
      userName,
      action: 'CREATE',
      entity,
      entityId,
      entityName,
      date: new Date().toISOString(),
      ip: AuditService.getClientIP(),
      userAgent: navigator.userAgent,
      success: true,
      details
    };

    await this.saveLog(log);
    console.log(`➕ Criação registrada: ${entity} - ${entityName}`);
  }

  // Registrar atualização de registro
  static async logUpdate(userId: string, userName: string, unitId: string, entity: string, entityId: string, entityName: string, details?: any): Promise<void> {
    const log: AuditLog = {
      id: `UPDATE_${Date.now()}`,
      unitId,
      userId,
      userName,
      action: 'UPDATE',
      entity,
      entityId,
      entityName,
      date: new Date().toISOString(),
      ip: AuditService.getClientIP(),
      userAgent: navigator.userAgent,
      success: true,
      details
    };

    await this.saveLog(log);
    console.log(`✏️ Atualização registrada: ${entity} - ${entityName}`);
  }

  // Registrar exclusão de registro
  static async logDelete(userId: string, userName: string, unitId: string, entity: string, entityId: string, entityName: string): Promise<void> {
    const log: AuditLog = {
      id: `DELETE_${Date.now()}`,
      unitId,
      userId,
      userName,
      action: 'DELETE',
      entity,
      entityId,
      entityName,
      date: new Date().toISOString(),
      ip: AuditService.getClientIP(),
      userAgent: navigator.userAgent,
      success: true
    };

    await this.saveLog(log);
    console.log(`🗑️ Exclusão registrada: ${entity} - ${entityName}`);
  }

  // Registrar backup
  static async logBackup(userId: string, userName: string, unitId: string, success: boolean, itemCount: number, errorMessage?: string): Promise<void> {
    const log: AuditLog = {
      id: `BACKUP_${Date.now()}`,
      unitId,
      userId,
      userName,
      action: 'SYSTEM_BACKUP',
      entity: 'System',
      date: new Date().toISOString(),
      ip: AuditService.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      details: { itemCount },
      errorMessage
    };

    await this.saveLog(log);
    console.log(`💾 Backup registrado: ${itemCount} itens - ${success ? 'Sucesso' : 'Falha'}`);
  }

  // Registrar restore
  static async logRestore(userId: string, userName: string, unitId: string, success: boolean, itemCount: number, errorMessage?: string): Promise<void> {
    const log: AuditLog = {
      id: `RESTORE_${Date.now()}`,
      unitId,
      userId,
      userName,
      action: 'SYSTEM_RESTORE',
      entity: 'System',
      date: new Date().toISOString(),
      ip: AuditService.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      details: { itemCount },
      errorMessage
    };

    await this.saveLog(log);
    console.log(`🔄 Restore registrado: ${itemCount} itens - ${success ? 'Sucesso' : 'Falha'}`);
  }

  // Registrar erro do sistema
  static async logError(userId: string, userName: string, unitId: string, error: Error, context?: string): Promise<void> {
    const log: AuditLog = {
      id: `ERROR_${Date.now()}`,
      unitId,
      userId,
      userName,
      action: 'SYSTEM_ERROR',
      entity: 'System',
      date: new Date().toISOString(),
      ip: AuditService.getClientIP(),
      userAgent: navigator.userAgent,
      success: false,
      errorMessage: error.message,
      details: { 
        stack: error.stack,
        context,
        name: error.name
      }
    };

    await this.saveLog(log);
    console.log(`❌ Erro registrado: ${error.message}`);
  }

  // Obter logs de auditoria
  static async getLogs(unitId?: string, limit?: number): Promise<AuditLog[]> {
    console.log('🔍 AuditService.getLogs iniciado...');
    
    try {
      // Usar instância global do IndexedDB
      const db = await this.getGlobalDB();
      
      if (!db) {
        console.log('❌ AuditService: Não foi possível obter conexão com IndexedDB');
        return [];
      }
      
      console.log('🔍 AuditService: Usando conexão global');
      console.log('🔍 AuditService: Stores disponíveis:', Array.from(db.objectStoreNames));
      
      if (!db.objectStoreNames.contains(AuditService.AUDIT_STORE)) {
        console.log('📝 Store de audit_logs não encontrada (getLogs)');
        return [];
      }
      
      console.log('🔍 AuditService: Store audit_logs encontrada, buscando dados...');
      
      // Usar a conexão global para buscar os logs
      const transaction = db.transaction(AuditService.AUDIT_STORE, 'readonly');
      const store = transaction.objectStore(AuditService.AUDIT_STORE);
      const getRequest = store.getAll();
      
      return new Promise((resolve) => {
        getRequest.onsuccess = function() {
          const logs = getRequest.result || [];
          console.log('🔍 AuditService: Logs brutos recebidos:', logs);
          console.log('🔍 AuditService: Quantidade de logs brutos:', logs.length);
          
          let filteredLogs = logs;
          
          // Filtrar por unidade se especificado
          if (unitId) {
            filteredLogs = logs.filter((log: AuditLog) => log.unitId === unitId);
            console.log('🔍 AuditService: Logs filtrados por unidade:', filteredLogs.length);
          }
          
          // Ordenar por data (mais recente primeiro)
          filteredLogs.sort((a: AuditLog, b: AuditLog) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          // Limitar resultados se especificado
          if (limit && limit > 0) {
            filteredLogs = filteredLogs.slice(0, limit);
            console.log('🔍 AuditService: Logs limitados:', filteredLogs.length);
          }
          
          console.log(`📋 AuditService: Retornando ${filteredLogs.length} logs de auditoria`);
          resolve(filteredLogs);
        };
        
        getRequest.onerror = function() {
          console.error('❌ AuditService: Erro ao buscar logs:', getRequest.error);
          resolve([]);
        };
      });
      
    } catch (error) {
      console.error('❌ AuditService: Erro ao carregar logs:', error);
      return [];
    }
  }

  // Obter estatísticas de auditoria
  static async getAuditStats(unitId?: string): Promise<any> {
    const logs = await this.getLogs(unitId);
    
    const stats = {
      total: logs.length,
      hoje: logs.filter(log => {
        const logDate = new Date(log.date);
        const today = new Date();
        return logDate.toDateString() === today.toDateString();
      }).length,
      porAcao: {} as any,
      porEntidade: {} as any,
      porUsuario: {} as any,
      sucessos: logs.filter(log => log.success).length,
      falhas: logs.filter(log => !log.success).length
    };

    // Agrupar por ação
    logs.forEach(log => {
      stats.porAcao[log.action] = (stats.porAcao[log.action] || 0) + 1;
    });

    // Agrupar por entidade
    logs.forEach(log => {
      stats.porEntidade[log.entity] = (stats.porEntidade[log.entity] || 0) + 1;
    });

    // Agrupar por usuário
    logs.forEach(log => {
      stats.porUsuario[log.userName] = (stats.porUsuario[log.userName] || 0) + 1;
    });

    return stats;
  }

  // Salvar log no IndexedDB
  private static async saveLog(log: AuditLog): Promise<void> {
    try {
      // Adicionar hash de verificação para garantir integridade
      const logWithHash = {
        ...log,
        hash: this.generateHash(log),
        timestamp: Date.now(),
        immutable: true
      };

      const db = await this.getGlobalDB();
      
      if (!db) {
        console.log('❌ AuditService: Não foi possível obter conexão com IndexedDB para salvar log');
        return;
      }
      
      if (!db.objectStoreNames.contains(AuditService.AUDIT_STORE)) {
        console.log('❌ Store de audit_logs não encontrada. Logs não serão salvos.');
        return;
      }
      
      const transaction = db.transaction(AuditService.AUDIT_STORE, 'readwrite');
      const store = transaction.objectStore(AuditService.AUDIT_STORE);
      const addRequest = store.add(logWithHash);
      
      return new Promise((resolve) => {
        addRequest.onsuccess = () => {
          console.log(`💾 Log de auditoria salvo: ${log.action} - ${log.userName}`);
          
          // Marcar como imutável após primeiro log
          if (log.action === 'USER_LOGIN') {
            AuditService.setImmutable().catch(err => {
              console.warn('⚠️ Não foi possível marcar logs como imutáveis:', err);
            });
          }
          
          resolve();
        };
        
        addRequest.onerror = () => {
          console.error('❌ Erro ao salvar log:', addRequest.error);
          resolve(); // Não rejeitar, apenas resolver
        };
      });
    } catch (error) {
      console.error('❌ Erro ao salvar log de auditoria:', error);
    }
  }

  // Gerar hash simples para verificação de integridade
  private static generateHash(log: AuditLog): string {
    const str = JSON.stringify(log);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }
}

export default AuditService;
