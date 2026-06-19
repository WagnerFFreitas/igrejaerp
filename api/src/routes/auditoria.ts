/**
 * ============================================================================
 * AUDITORIA.TS (REATORADO)
 * ============================================================================
 *
 * Rotas de API para o serviço de Auditoria.
 */

import { Router, Request, Response } from 'express';
import { listAuditLogs } from '../services/auditoria-servico';
import { requireAuth, AuthenticatedRequest } from '../middleware/autenticacao';

const router = Router();

// Todas as rotas de auditoria exigem autenticação
router.use(requireAuth);

// GET /auditoria - Lista os logs de auditoria
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
    // Apenas desenvolvedores ou usuários com permissão podem ver os logs
    if (req.authUser?.role !== 'DEVELOPER') {
        // Adicionar uma verificação de permissão mais granular aqui se necessário
        return res.status(403).json({ error: { message: 'Acesso negado.' } });
    }

    try {
        const { idUnidade, action, entity, limit } = req.query;
        const logs = await listAuditLogs({
            idUnidade: idUnidade as string,
            action: action as string,
            entity: entity as string,
            limit: limit ? parseInt(limit as string, 10) : undefined,
        });
        res.json(logs);
    } catch (error: any) {
        console.error('Erro ao listar logs de auditoria:', error);
        res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
    }
});

export default router;
