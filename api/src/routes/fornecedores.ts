/**
 * ============================================================================
 * FORNECEDORES.TS (REATORADO)
 * ============================================================================
 *
 * Rotas de API para fornecedores.
 * Apenas mapeia as rotas HTTP para os métodos do controller.
 */

import { Router } from 'express';
import { FornecedoresController } from '../controllers/fornecedores-controlador';

const router = Router();
const fornecedoresController = new FornecedoresController();

// Mapeia as rotas para os métodos do controller
router.get('/', fornecedoresController.getAll);
router.get('/:id', fornecedoresController.getById);
router.post('/', fornecedoresController.create);
router.put('/:id', fornecedoresController.update);
router.delete('/:id', fornecedoresController.delete);

export default router;
