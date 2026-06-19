/**
 * ============================================================================
 * PATRIMONIOS.TS (REATORADO)
 * ============================================================================
 *
 * Rotas de API para Patrimônios (Ativos) e Inventário.
 * Apenas mapeia as rotas HTTP para os métodos do controller.
 */

import { Router } from 'express';
import { PatrimoniosController } from '../controllers/patrimonios-controlador';

const router = Router();
const controller = new PatrimoniosController();

// ─── ROTAS DE PATRIMÔNIOS (ASSETS) ──────────────────────────────────────────

router.get('/', controller.getAllAssets);
router.get('/:id', controller.getAssetById);
router.post('/', controller.createAsset);
router.put('/:id', controller.updateAsset);
router.delete('/:id', controller.deleteAsset);

// ─── ROTAS DE INVENTÁRIO ───────────────────────────────────────────────────

// Contagens de Inventário
router.get('/inventory/counts', controller.getAllInventoryCounts);
router.post('/inventory/counts', controller.startInventoryCount);
router.patch('/inventory/counts/:countId/close', controller.closeInventoryCount);

// Itens dentro de uma Contagem de Inventário
router.get('/inventory/counts/:countId/items', controller.getInventoryItems);
router.patch('/inventory/counts/:countId/items/:itemId', controller.updateInventoryItem);

export default router;
