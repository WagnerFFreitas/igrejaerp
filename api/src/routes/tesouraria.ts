/**
 * ============================================================================
 * TESOURARIA.TS (CONSOLIDADO E REATORADO)
 * ============================================================================
 *
 * Ponto de entrada único para todas as rotas do módulo de Tesouraria Avançada.
 * Todas as rotas aqui definidas apontam para um placeholder "Não Implementado".
 */

import { Router } from 'express';
import { TesourariaController } from '../controllers/tesouraria-controlador';

const router = Router();
const controller = new TesourariaController();

// Centraliza todas as rotas não implementadas de Tesouraria
const naoImplementado = controller.naoImplementado;

// Rotas para /plano-contas
router.get('/plano-contas',        naoImplementado);
router.post('/plano-contas',       naoImplementado);
router.put('/plano-contas/:id',    naoImplementado);
router.delete('/plano-contas/:id', naoImplementado);

// Rotas para /fluxos-caixa
router.get('/fluxos-caixa',        naoImplementado);
router.post('/fluxos-caixa',       naoImplementado);
router.put('/fluxos-caixa/:id',    naoImplementado);
router.delete('/fluxos-caixa/:id', naoImplementado);

// Rotas para /previsoes
router.get('/previsoes',           naoImplementado);
router.post('/previsoes',          naoImplementado);
router.put('/previsoes/:id',       naoImplementado);

// Rotas para /investimentos
router.get('/investimentos',       naoImplementado);
router.post('/investimentos',      naoImplementado);
router.put('/investimentos/:id',   naoImplementado);
router.delete('/investimentos/:id', naoImplementado);

// Rotas para /emprestimos
router.get('/emprestimos',         naoImplementado);
router.post('/emprestimos',        naoImplementado);
router.put('/emprestimos/:id',     naoImplementado);

// Rotas para /alertas
router.get('/alertas',             naoImplementado);
router.post('/alertas',            naoImplementado);
router.patch('/alertas/:id/status', naoImplementado);

// Rotas para /posicoes-financeiras
router.get('/posicoes-financeiras', naoImplementado);
router.post('/posicoes-financeiras', naoImplementado);

// Rotas para /conciliacoes-bancarias
router.get('/conciliacoes-bancarias', naoImplementado);
router.post('/conciliacoes-bancarias', naoImplementado);

// Rotas para /periodos-folha
router.get('/periodos-folha', naoImplementado);
router.post('/periodos-folha', naoImplementado);

export default router;
