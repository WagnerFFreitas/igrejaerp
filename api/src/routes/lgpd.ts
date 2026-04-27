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
import { LGPDController } from '../controllers/lgpdController';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (lgpd).
 */

const router = Router();

router.get('/policy', LGPDController.getCurrentPolicy);
router.get('/consents/:memberId', LGPDController.getMemberConsents);
router.post('/consent', LGPDController.saveConsent);

export default router;
