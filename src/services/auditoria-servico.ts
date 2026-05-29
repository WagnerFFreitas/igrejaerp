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
  idUnidade: string;
  userId: string;
  userName: string;
  action: string;
  entidade: string;
  entidadeId?: string;
  entidadeName?: string;
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

export class AuditoriaService {
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

  static async logLogin(userId: string, userName: string, idUnidade: string, success: boolean, errorMessage?: string): Promise<void> {
    await this.saveLog({
      idUnidade,
      userId,
      userName,
      action: 'USER_LOGIN',
      entidade: 'User',
      entidadeId: userId,
      entidadeName: userName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      errorMessage
    });
  }

  static async logLogout(userId: string, userName: string, idUnidade: string): Promise<void> {
    await this.saveLog({
      idUnidade,
      userId,
      userName,
      action: 'USER_LOGOUT',
      entidade: 'User',
      entidadeId: userId,
      entidadeName: userName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true
    });
  }

  static async logMenuAccess(userId: string, userName: string, idUnidade: string, menuName: string, menuKey?: string): Promise<void> {
    await this.saveLog({
      idUnidade,
      userId,
      userName,
      action: 'MENU_ACCESS',
      entidade: 'Menu',
      entidadeId: menuKey ?? menuName.toLowerCase().replace(/\s+/g, '_'),
      entidadeName: menuName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true,
      details: {
        action: `${userName} acessou ${menuName}`
      }
    });
  }

  static async logCreate(userId: string, userName: string, idUnidade: string, entidade: string, entidadeId: string, entidadeName: string, details?: any): Promise<void> {
    await this.saveLog({
      idUnidade,
      userId,
      userName,
      action: 'CREATE',
      entidade,
      entidadeId,
      entidadeName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true,
      details
    });
  }

  static async logUpdate(userId: string, userName: string, idUnidade: string, entidade: string, entidadeId: string, entidadeName: string, details?: any): Promise<void> {
    await this.saveLog({
      idUnidade,
      userId,
      userName,
      action: 'UPDATE',
      entidade,
      entidadeId,
      entidadeName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true,
      details
    });
  }

  static async logDelete(userId: string, userName: string, idUnidade: string, entidade: string, entidadeId: string, entidadeName: string): Promise<void> {
    await this.saveLog({
      idUnidade,
      userId,
      userName,
      action: 'DELETE',
      entidade,
      entidadeId,
      entidadeName,
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success: true
    });
  }

  static async logBackup(userId: string, userName: string, idUnidade: string, success: boolean, itemCount: number, errorMessage?: string): Promise<void> {
    await this.saveLog({
      idUnidade,
      userId,
      userName,
      action: 'SYSTEM_BACKUP',
      entidade: 'System',
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      errorMessage,
      details: { itemCount }
    });
  }

  static async logRestore(userId: string, userName: string, idUnidade: string, success: boolean, itemCount: number, errorMessage?: string): Promise<void> {
    await this.saveLog({
      idUnidade,
      userId,
      userName,
      action: 'SYSTEM_RESTORE',
      entidade: 'System',
      date: new Date().toISOString(),
      ip: this.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      errorMessage,
      details: { itemCount }
    });
  }

  static async logError(userId: string, userName: string, idUnidade: string, error: Error, context?: string): Promise<void> {
    await this.saveLog({
      idUnidade,
      userId,
      userName,
      action: 'SYSTEM_ERROR',
      entidade: 'System',
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

  static async getLogs(idUnidade?: string, limit?: number): Promise<AuditLog[]> {
    return apiClient.getAuditLogs({ idUnidade, limit });
  }

  static async getAuditStats(idUnidade?: string): Promise<any> {
    const logs = await this.getLogs(idUnidade);

    return {
      total: logs.length,
      hoje: logs.filter(log => new Date(log.date).toDateString() === new Date().toDateString()).length,
      sucessos: logs.filter(log => log.success).length,
      falhas: logs.filter(log => !log.success).length
    };
  }
}

export default AuditoriaService;
