/**
 * ============================================================================
 * USEAUDIT.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Arquivo relacionado a use audit.
 *
 * ONDE É USADO?
 * -------------
 * Parte do projeto usada em runtime ou build.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import { AuditoriaService } from '../services/auditoria-servico';
import { UserAuth } from '../../tipos';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (use audit).
 */

export const useAudit = (currentUser: UserAuth | null) => {
  const logAction = async (action: string, entity: string, entityId?: string, entityName?: string, details?: any) => {
    if (!currentUser) return;

    try {
      switch (action) {
        case 'CREATE':
          await AuditoriaService.logCreate(currentUser.id, currentUser.name, currentUser.idUnidade, entity, entityId!, entityName!, details);
          break;
        case 'UPDATE':
          await AuditoriaService.logUpdate(currentUser.id, currentUser.name, currentUser.idUnidade, entity, entityId!, entityName!, details);
          break;
        case 'DELETE':
          await AuditoriaService.logDelete(currentUser.id, currentUser.name, currentUser.idUnidade, entity, entityId!, entityName!);
          break;
        case 'BACKUP':
          await AuditoriaService.logBackup(currentUser.id, currentUser.name, currentUser.idUnidade, details?.success, details?.itemCount, details?.errorMessage);
          break;
        case 'RESTORE':
          await AuditoriaService.logRestore(currentUser.id, currentUser.name, currentUser.idUnidade, details?.success, details?.itemCount, details?.errorMessage);
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
      await AuditoriaService.logError(currentUser.id, currentUser.name, currentUser.idUnidade, error, context);
    } catch (auditError) {
      console.error('❌ Erro ao registrar erro de auditoria:', auditError);
    }
  };

  const logMenuAccess = async (menuName: string) => {
    if (!currentUser) return;

    try {
      await AuditoriaService.logMenuAccess(
        currentUser.id,
        currentUser.name,
        currentUser.idUnidade,
        menuName
      );
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
