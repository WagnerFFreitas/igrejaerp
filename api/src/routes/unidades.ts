/**
 * ============================================================================
 * UNITS.TS (CORRIGIDO)
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para unidades.
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
import { UnitController } from '../controllers/unidades-controlador';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (unidades).
 */

const router = Router();
const controller = new UnitController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', controller.update);

export default router;
