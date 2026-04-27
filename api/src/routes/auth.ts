/**
 * ============================================================================
 * AUTH.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para auth.
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
import { AuthController } from '../controllers/authController';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (auth).
 */

const router = Router();
const authController = new AuthController();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));
router.post('/verify', (req, res) => authController.verifyToken(req, res));
router.get('/verify', (req, res) => authController.verifyToken(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

export default router;
