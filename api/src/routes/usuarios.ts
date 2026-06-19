/**
 * ============================================================================
 * USUARIOS.TS (REATORADO)
 * ============================================================================
 *
 * Rotas de API para Usuários e Permissões.
 */

import { Router } from 'express';
import { UsuariosController } from '../controllers/usuarios-controlador';
import { requireAuth, AuthenticatedRequest } from '../middleware/autenticacao';

const router = Router();
const controller = new UsuariosController();

// Todas as rotas de usuários exigem autenticação
router.use(requireAuth);

// --- CRUD de Usuários ---
router.get('/', (req, res) => controller.getAll(req as AuthenticatedRequest, res));
router.post('/', (req, res) => controller.create(req as AuthenticatedRequest, res));
router.put('/:id', (req, res) => controller.update(req as AuthenticatedRequest, res));

// --- Gestão de Permissões ---
router.get('/permission-modules', (req, res) => controller.getPermissionModules(req as AuthenticatedRequest, res));
router.get('/:id/permissions', (req, res) => controller.getUserPermissions(req as AuthenticatedRequest, res));
router.put('/:id/permissions', (req, res) => controller.updateUserPermissions(req as AuthenticatedRequest, res));

export default router;
