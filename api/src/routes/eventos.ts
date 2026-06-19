/**
 * ============================================================================
 * EVENTOS.TS (REATORADO)
 * ============================================================================
 *
 * Rotas de API para Eventos.
 * Apenas mapeia as rotas HTTP para os métodos do controller.
 */

import { Router } from 'express';
import { EventosController } from '../controllers/eventos-controlador';

const router = Router();
const controller = new EventosController();

// Mapeia as rotas para os métodos do controller
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
