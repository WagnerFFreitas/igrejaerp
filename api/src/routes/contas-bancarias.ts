/**
 * ============================================================================
 * CONTAS-BANCARIAS.TS (REATORADO)
 * ============================================================================
 *
 * Rotas de API para Contas Bancárias.
 */

import { Router } from 'express';
import { ContasBancariasController } from '../controllers/contas-bancarias-controlador';

const router = Router();
const controller = new ContasBancariasController();

// Mapeia as rotas para os métodos do controller
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.softDelete); // Soft delete

export default router;
