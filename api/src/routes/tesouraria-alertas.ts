/**
 * TREASURY ALERTS.TS
 * Alertas de tesouraria.
 */

import { Router } from 'express';

const router = Router();

const naoImplementado = (_req: any, res: any) =>
  res.status(501).json({
    error: {
      message: 'Módulo de alertas de tesouraria ainda não está modelado no schema atual.',
      status: 501,
    },
  });

router.get('/',    naoImplementado);
router.post('/',   naoImplementado);
router.patch('/:id/status', naoImplementado);

export default router;