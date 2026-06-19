/**
 * ============================================================================
 * TESOURARIA-CONTROLADOR.TS (NOVO)
 * ============================================================================
 *
 * Controlador para o módulo de Tesouraria Avançada.
 * Como a funcionalidade ainda não foi implementada, este controlador
 * serve como um placeholder centralizado.
 */

import { Request, Response } from 'express';

export class TesourariaController {

    /**
     * Retorna uma resposta 501 - Not Implemented.
     * Usado para todas as rotas de tesouraria avançada até que sejam desenvolvidas.
     */
    naoImplementado(req: Request, res: Response) {
        res.status(501).json({
            error: {
                message: 'Módulo de tesouraria avançada ainda não foi implementado.',
                status: 501,
            },
        });
    }
}
