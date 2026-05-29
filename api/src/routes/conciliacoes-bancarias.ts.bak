/**
 * RECONCILIATION.TS
 * Conciliação bancária — tabelas ainda não existem no schema atual.
 * Retorna 501 até que as tabelas conciliacoes_bancarias e
 * transacoes_extrato_bancario sejam criadas.
 */

import { Router } from 'express';

const router = Router();

const naoImplementado = (_req: any, res: any) =>
  res.status(501).json({
    error: {
      message: 'Conciliação bancária ainda não está modelada no schema atual.',
      status: 501,
    },
  });

router.get('/',                                          naoImplementado);
router.get('/:id',                                       naoImplementado);
router.post('/',                                         naoImplementado);
router.put('/:id',                                       naoImplementado);
router.get('/:reconciliationId/transactions',            naoImplementado);
router.post('/:reconciliationId/transactions',           naoImplementado);
router.patch('/:reconciliationId/transactions/:txId/match', naoImplementado);

export default router;
