/**
 * ============================================================================
 * EMPLOYEES.TS (REATORADO)
 * ============================================================================
 *
 * Rotas de API para funcionários.
 * Este arquivo agora apenas mapeia as rotas HTTP para os métodos do controller.
 */

import { Router } from 'express';
import { FuncionariosController } from '../controllers/funcionarios-controlador';

const router = Router();
const funcionariosController = new FuncionariosController();

// Mapeia as rotas para os métodos do controller
router.get('/', funcionariosController.getAll);
router.get('/:id', funcionariosController.getById);
router.post('/', funcionariosController.create);
router.put('/:id', funcionariosController.update);
router.delete('/:id', funcionariosController.delete);

export default router;
