/**
 * ============================================================================
 * TRANSACOES.TS (REATORADO)
 * ============================================================================
 *
 * Rotas de API para transações.
 * Apenas mapeia as rotas HTTP para os métodos do controller.
 */

import { Router } from 'express';
import { TransacoesController } from '../controllers/transacoes-controlador';

const router = Router();
const transacoesController = new TransacoesController();

// Mapeia as rotas para os métodos do controller
router.get('/', transacoesController.getAll);
router.get('/:id', transacoesController.getById);
router.post('/', transacoesController.create);
router.put('/:id', transacoesController.update);
router.delete('/:id', transacoesController.delete);

export default router;
