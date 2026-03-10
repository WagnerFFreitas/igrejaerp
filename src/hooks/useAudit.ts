import { AuditService } from '../services/auditService';
import { UserAuth } from '../types';

export const useAudit = (currentUser: UserAuth | null) => {
  const logAction = async (action: string, entity: string, entityId?: string, entityName?: string, details?: any) => {
    if (!currentUser) return;

    try {
      switch (action) {
        case 'CREATE':
          await AuditService.logCreate(currentUser.id, currentUser.name, currentUser.unitId, entity, entityId!, entityName!, details);
          break;
        case 'UPDATE':
          await AuditService.logUpdate(currentUser.id, currentUser.name, currentUser.unitId, entity, entityId!, entityName!, details);
          break;
        case 'DELETE':
          await AuditService.logDelete(currentUser.id, currentUser.name, currentUser.unitId, entity, entityId!, entityName!);
          break;
        case 'BACKUP':
          await AuditService.logBackup(currentUser.id, currentUser.name, currentUser.unitId, details?.success, details?.itemCount, details?.errorMessage);
          break;
        case 'RESTORE':
          await AuditService.logRestore(currentUser.id, currentUser.name, currentUser.unitId, details?.success, details?.itemCount, details?.errorMessage);
          break;
        default:
          console.log(`🔍 Ação não mapeada: ${action}`);
      }
    } catch (error) {
      console.error('❌ Erro ao registrar ação de auditoria:', error);
    }
  };

  const logError = async (error: Error, context?: string) => {
    if (!currentUser) return;

    try {
      await AuditService.logError(currentUser.id, currentUser.name, currentUser.unitId, error, context);
    } catch (auditError) {
      console.error('❌ Erro ao registrar erro de auditoria:', auditError);
    }
  };

  const logMenuAccess = async (menuName: string) => {
    if (!currentUser) return;

    try {
      await AuditService.logCreate(currentUser.id, currentUser.name, currentUser.unitId, 'Menu', `menu_${menuName}`, menuName, { 
        action: `${currentUser.name} acessou o menu ${menuName}` 
      });
    } catch (error) {
      console.error('❌ Erro ao registrar acesso ao menu:', error);
    }
  };

  return {
    logAction,
    logError,
    logMenuAccess
  };
};
