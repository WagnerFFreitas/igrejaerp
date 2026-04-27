/**
 * ============================================================================
 * MEMBERS.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para members.
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
import { MembersController } from '../controllers/membersController';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (members).
 */

const router = Router();
const membersController = new MembersController();

// Endpoint de debug (teste de mapeamento)
router.get('/debug/sanitize', membersController.debugSanitize);

router.get('/', membersController.getAll);
router.get('/:id', membersController.getById);
router.post('/', membersController.create);
router.put('/:id', membersController.update);
router.delete('/:id', membersController.delete);

// Sub-rotas para dependentes e contribuições
router.post('/:id/dependents', membersController.addDependent);
router.post('/:id/contributions', membersController.addContribution);

export default router;
