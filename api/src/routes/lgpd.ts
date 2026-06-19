/**
 * ============================================================================
 * LGPD.TS (CORRIGIDO)
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para lgpd.
 *
 * ONDE É USADO?
 * ------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import { Router } from 'express';
import { LGPDController } from '../controllers/lgpd-controlador';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (lgpd).
 */

const router = Router();
const controller = new LGPDController();

// Políticas LGPD
router.get('/politicas', controller.getCurrentPolicy);
router.post('/politicas', controller.savePolicy);

// Consentimentos LGPD
router.get('/consentimentos/:memberId', controller.getMemberConsents);
router.post('/consentimentos', controller.saveConsent);

export default router;
