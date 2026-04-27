/**
 * ============================================================================
 * UNITS.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para units.
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
import { UnitController } from '../controllers/unitController';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (units).
 */

const router = Router();

router.get('/', UnitController.getAll);
router.get('/:id', UnitController.getById);
router.put('/:id', UnitController.update);

export default router;
