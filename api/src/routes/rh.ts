/**
 * ============================================================================
 * RH.TS (REATORADO)
 * ============================================================================
 *
 * Rotas de API para o Módulo de Recursos Humanos.
 */

import { Router } from 'express';
import { RhController } from '../controllers/rh-controlador';

const router = Router();
const controller = new RhController();

// ─── AFASTAMENTOS (LEAVES) ──────────────────────────────────────────────────
// As rotas base (/) e (/leaves) apontam para a mesma funcionalidade.
router.get('/', controller.listarAfastamentos);
router.post('/', controller.salvarAfastamento);
router.put('/:id', controller.atualizarAfastamento);
router.delete('/:id', controller.excluirAfastamento); // Soft delete (Cancela o afastamento)

router.get('/leaves', controller.listarAfastamentos);
router.post('/leaves', controller.salvarAfastamento);
router.put('/leaves/:id', controller.atualizarAfastamento);
router.delete('/leaves/:id', controller.excluirAfastamento); // Soft delete (Cancela o afastamento)

// ─── AVALIAÇÕES DE DESEMPENHO (não implementado) ──────────────────────────
router.get('/evaluations',      controller.listaVazia);
router.post('/evaluations',     controller.naoImplementado);
router.put('/evaluations/:id',  controller.naoImplementado);
router.delete('/evaluations/:id', controller.naoImplementado);

// ─── PLANOS DE DESENVOLVIMENTO INDIVIDUAL (PDI) (não implementado) ────────
router.get('/pdi',      controller.listaVazia);
router.post('/pdi',     controller.naoImplementado);
router.put('/pdi/:id',  controller.naoImplementado);
router.delete('/pdi/:id', controller.naoImplementado);

export default router;
