/**
 * TREASURY.TS
 * Tesouraria avançada — tabelas ainda não existem no schema atual.
 * Retorna 501 até que as tabelas fluxos_caixa, previsoes_financeiras,
 * investimentos, emprestimos, alertas_tesouraria e posicoes_financeiras
 * sejam criadas.
 */

import { Router } from 'express';

const router = Router();

const naoImplementado = (_req: any, res: any) =>
  res.status(501).json({
    error: {
      message: 'Módulo de tesouraria avançada ainda não está modelado no schema atual.',
      status: 501,
    },
  });

router.get('/plano-contas',        naoImplementado);
router.post('/plano-contas',       naoImplementado);
router.put('/plano-contas/:id',    naoImplementado);
router.delete('/plano-contas/:id', naoImplementado);

router.get('/fluxos-caixa',        naoImplementado);
router.post('/fluxos-caixa',       naoImplementado);
router.put('/fluxos-caixa/:id',    naoImplementado);
router.delete('/fluxos-caixa/:id', naoImplementado);

router.get('/previsoes',           naoImplementado);
router.post('/previsoes',          naoImplementado);
router.put('/previsoes/:id',       naoImplementado);

router.get('/investimentos',       naoImplementado);
router.post('/investimentos',      naoImplementado);
router.put('/investimentos/:id',   naoImplementado);
router.delete('/investimentos/:id', naoImplementado);

router.get('/emprestimos',         naoImplementado);
router.post('/emprestimos',        naoImplementado);
router.put('/emprestimos/:id',     naoImplementado);

router.get('/alertas',             naoImplementado);
router.post('/alertas',            naoImplementado);
router.patch('/alertas/:id/status', naoImplementado);

router.get('/posicoes-financeiras', naoImplementado);
router.post('/posicoes-financeiras', naoImplementado);

export default router;
