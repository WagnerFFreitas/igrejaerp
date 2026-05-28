/**
 * TREASURY CASH FLOWS.TS
 * Fluxo de caixa.
 */

import { Router } from 'express';

const router = Router();

const naoImplementado = (_req: any, res: any) =>
  res.status(501).json({
    error: {
      message: 'Módulo de fluxos de caixa ainda não está modelado no schema atual.',
      status: 501,
    },
  });

router.get('/',    naoImplementado);
router.post('/',   naoImplementado);
router.get('/:id', naoImplementado);
router.put('/:id', naoImplementado);
router.delete('/:id', naoImplementado);

export default router;