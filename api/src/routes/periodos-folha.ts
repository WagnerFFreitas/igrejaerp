/**
 * PAYROLL.TS (TEMPORARIAMENTE DESATIVADO)
 * Funcionalidade de folha de pagamento ainda não migrada para o Firestore.
 * Retorna 501 até que a migração seja concluída.
 */

import { Router } from 'express';

const router = Router();

const naoImplementado = (_req: any, res: any) =>
  res.status(501).json({
    error: {
      message: 'Funcionalidade de folha de pagamento ainda não foi implementada no Firestore.',
      status: 501,
    },
  });

// ─── PERÍODOS DE FOLHA ────────────────────────────────────────────────────────
router.get('/periods', naoImplementado);
router.post('/periods', naoImplementado);

// ─── FOLHA DE PAGAMENTO ───────────────────────────────────────────────────────
router.get('/', naoImplementado);
router.post('/', naoImplementado);

// ─── CÁLCULOS DE FOLHA ────────────────────────────────────────────────────────
router.get('/calculations/:mesCompetencia', naoImplementado);
router.post('/calculations', naoImplementado);

export default router;
