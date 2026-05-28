/**
 * ============================================================================
 * LGPD.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para lgpd.
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
import { LGPDController } from '../controllers/lgpd-controlador';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (lgpd).
 */

const router = Router();

// Políticas LGPD
router.get('/politicas', LGPDController.getCurrentPolicy);
router.post('/politicas', LGPDController.savePolicy);

// Consentimentos LGPD
router.get('/consentimentos/:memberId', LGPDController.getMemberConsents);
router.post('/consentimentos', LGPDController.saveConsent);

export default router;
