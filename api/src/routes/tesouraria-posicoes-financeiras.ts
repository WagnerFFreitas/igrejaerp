/**
 * TREASURY POSITIONS.TS
 * Posições financeiras consolidadas.
 */

import { Router } from 'express';

const router = Router();

const naoImplementado = (_req: any, res: any) =>
  res.status(501).json({
    error: {
      message: 'Módulo de posições financeiras ainda não está modelado no schema atual.',
      status: 501,
    },
  });

router.get('/',    naoImplementado);
router.post('/',   naoImplementado);
router.get('/:id', naoImplementado);

export default router;