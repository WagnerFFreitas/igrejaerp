/**
 * ============================================================================
 * AUDITSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para audit service.
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
 * Define o bloco principal deste arquivo (audit service).
 */

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
  hash?: string;
  previousHash?: string | null;
  immutable?: boolean;
  createdAt?: string;
}

export class AuditService {
  private static getClientIP(): string {
    return '127.0.0.1';
  }

  private static async saveLog(log: Omit<AuditLog, 'id' | 'hash' | 'previousHash' | 'immutable' | 'createdAt'>): Promise<void> {
    await apiClient.createAuditLog({
      ...log,
      ip: log.ip || this.getClientIP(),
      userAgent: log.userAgent || navigator.userAgent
    });
  }

  static async logLogin(userId: string, userName: string, unitId: string, success: boolean, errorMessage?: string): Promise<void> {
    await this.saveLog({
      unitId,
      userId,
      userName,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: userId,
      entityName: userName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      errorMessage
    });
  }

  static async logLogout(userId: string, userName: string, unitId: string): Promise<void> {
    await this.saveLog({
      unitId,
      userId,
      userName,
      action: 'USER_LOGOUT',
      entity: 'User',
      entityId: userId,
      entityName: userName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true
    });
  }

  static async logMenuAccess(userId: string, userName: string, unitId: string, menuName: string, menuKey?: string): Promise<void> {
    await this.saveLog({
      unitId,
      userId,
      userName,
      action: 'MENU_ACCESS',
      entity: 'Menu',
      entityId: menuKey ?? menuName.toLowerCase().replace(/\s+/g, '_'),
      entityName: menuName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true,
      details: {
        action: `${userName} acessou ${menuName}`
      }
    });
  }

  static async logCreate(userId: string, userName: string, unitId: string, entity: string, entityId: string, entityName: string, details?: any): Promise<void> {
    await this.saveLog({
      unitId,
      userId,
      userName,
      action: 'CREATE',
      entity,
      entityId,
      entityName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true,
      details
    });
  }

  static async logUpdate(userId: string, userName: string, unitId: string, entity: string, entityId: string, entityName: string, details?: any): Promise<void> {
    await this.saveLog({
      unitId,
      userId,
      userName,
      action: 'UPDATE',
      entity,
      entityId,
      entityName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true,
      details
    });
  }

  static async logDelete(userId: string, userName: string, unitId: string, entity: string, entityId: string, entityName: string): Promise<void> {
    await this.saveLog({
      unitId,
      userId,
      userName,
      action: 'DELETE',
      entity,
      entityId,
      entityName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true
    });
  }

  static async logBackup(userId: string, userName: string, unitId: string, success: boolean, itemCount: number, errorMessage?: string): Promise<void> {
    await this.saveLog({
      unitId,
      userId,
      userName,
      action: 'SYSTEM_BACKUP',
      entity: 'System',
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      errorMessage,
      details: { itemCount }
    });
  }

  static async logRestore(userId: string, userName: string, unitId: string, success: boolean, itemCount: number, errorMessage?: string): Promise<void> {
    await this.saveLog({
      unitId,
      userId,
      userName,
      action: 'SYSTEM_RESTORE',
      entity: 'System',
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      errorMessage,
      details: { itemCount }
    });
  }

  static async logError(userId: string, userName: string, unitId: string, error: Error, context?: string): Promise<void> {
    await this.saveLog({
      unitId,
      userId,
      userName,
      action: 'SYSTEM_ERROR',
      entity: 'System',
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success: false,
      errorMessage: error.message,
      details: {
        stack: error.stack,
        context,
        name: error.name
      }
    });
  }

  static async getLogs(unitId?: string, limit?: number): Promise<AuditLog[]> {
    return apiClient.getAuditLogs({ unitId, limit });
  }

  static async getAuditStats(unitId?: string): Promise<any> {
    const logs = await this.getLogs(unitId);

    return {
      total: logs.length,
      hoje: logs.filter(log => new Date(log.date).toDateString() === new Date().toDateString()).length,
      sucessos: logs.filter(log => log.success).length,
      falhas: logs.filter(log => !log.success).length
    };
  }
}

export default AuditService;
