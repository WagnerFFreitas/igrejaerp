/**
 * ============================================================================
 * AUDIT.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para audit.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { createAuditLog, listAuditLogs } from '../services/auditService';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (audit).
 */

const router = Router();

router.use(requireAuth);

router.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { role, unitId: authUnitId } = req.authUser!;
    const requestedUnitId = typeof req.query.unitId === 'string' ? req.query.unitId : undefined;
    const action = typeof req.query.action === 'string' ? req.query.action : undefined;
    const entidade = typeof req.query.entidade === 'string' ? req.query.entidade : undefined;
    const limit = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined;

    const unitId = role === 'DEVELOPER' || role === 'ADMIN'
      ? requestedUnitId
      : authUnitId;

    const logs = await listAuditLogs({ unitId, action, entidade, limit });
    res.json(logs);
  } catch (error: any) {
    console.error('Erro ao listar logs de auditoria:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

router.post('/', async (req: AuthenticatedRequest, res) => {
  try {
    const authUser = req.authUser!;
    const {
      unitId,
      userId,
      userName,
      action,
      entidade,
      entidadeId,
      entidadeName,
      date,
      ip,
      userAgent,
      details,
      success = true,
      errorMessage
    } = req.body;

    if (!action || !entidade || !date || !ip) {
      return res.status(400).json({
        error: {
          message: 'Ação, entidade, data e IP são obrigatórios',
          status: 400
        }
      });
    }

    const resolvedUnitId = authUser.role === 'DEVELOPER'
      ? (unitId || authUser.unitId)
      : authUser.unitId;

    const log = await createAuditLog({
      unitId: resolvedUnitId,
      userId: userId || authUser.userId,
      userName: userName || authUser.email,
      action,
      entidade,
      entidadeId,
      entidadeName,
      date,
      ip,
      userAgent,
      details,
      success: Boolean(success),
      errorMessage
    });

    res.status(201).json(log);
  } catch (error: any) {
    console.error('Erro ao criar log de auditoria:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
