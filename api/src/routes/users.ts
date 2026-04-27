/**
 * ============================================================================
 * USERS.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para users.
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
import bcrypt from 'bcryptjs';
import Database from '../database';
import { APP_PERMISSION_MODULES, getEffectivePermissions, replaceUserPermissions } from '../services/permissionsService';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (users).
 */

const router = Router();
const db = Database.getInstance();

router.use(requireAuth);

async function ensureCanManageUsers(req: AuthenticatedRequest, res: any): Promise<boolean> {
  const authUser = req.authUser;

  if (!authUser) {
    res.status(401).json({ error: { message: 'Usuário não autenticado', status: 401 } });
    return false;
  }

  if (authUser.role === 'DEVELOPER') {
    return true;
  }

  const permissions = await getEffectivePermissions(authUser.userId, authUser.role);
  const canManage =
    permissions.some(permission => permission.moduleCode === 'users' && permission.canManage) ||
    permissions.some(permission => permission.moduleCode === 'permissions' && permission.canManage);

  if (!canManage) {
    res.status(403).json({ error: { message: 'Sem permissão para gerenciar usuários e permissões', status: 403 } });
    return false;
  }

  return true;
}

router.get('/', async (req, res) => {
  try {
    if (!(await ensureCanManageUsers(req, res))) return;

    const result = await db.query(`
      SELECT
        u.id,
        u.nome_usuario,
        u.email,
        u.role,
        u.unit_id,
        u.esta_ativo,
        u.ultimo_login,
u.criado, 
        u.atualizado,
        un.nome_usuario AS unit_nome_usuario
      FROM users u
      LEFT JOIN units un ON un.id = u.unit_id
      ORDER BY u.nome_usuario
    `);

    const users = await Promise.all(
      result.rows.map(async (user: any) => ({
        ...user,
        unitId: user.unit_id,
        usernome_usuario: user.email?.split('@')[0] || user.nome_usuario,
        status: user.esta_ativo ? 'ACTIVE' : 'INACTIVE',
        permissions: await getEffectivePermissions(user.id, user.role)
      }))
    );

    res.json(users);
  } catch (error: any) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

router.get('/permission-modules', async (req, res) => {
  if (!(await ensureCanManageUsers(req, res))) return;
  res.json(APP_PERMISSION_MODULES);
});

router.get('/:id/permissions', async (req, res) => {
  try {
    if (!(await ensureCanManageUsers(req as AuthenticatedRequest, res))) return;

    const { id } = req.params;
    const userResult = await db.query('SELECT id, role FROM users WHERE id = $1 LIMIT 1', [id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Usuário não encontrado', status: 404 } });
    }

    const permissions = await getEffectivePermissions(id, userResult.rows[0].role);
    res.json(permissions);
  } catch (error: any) {
    console.error('Erro ao buscar permissões do usuário:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

router.put('/:id/permissions', async (req, res) => {
  try {
    if (!(await ensureCanManageUsers(req as AuthenticatedRequest, res))) return;

    const { id } = req.params;
    const { permissions } = req.body as {
      permissions: Array<{
        moduleCode: string;
        canRead?: boolean;
        canWrite?: boolean;
        canDelete?: boolean;
        canManage?: boolean;
      }>;
    };

    const userResult = await db.query('SELECT id, role FROM users WHERE id = $1 LIMIT 1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Usuário não encontrado', status: 404 } });
    }

    if (userResult.rows[0].role === 'DEVELOPER') {
      return res.status(400).json({ error: { message: 'Usuário desenvolvedor é irrestrito e não pode ser limitado', status: 400 } });
    }

    await replaceUserPermissions(id, permissions || []);

    res.json(await getEffectivePermissions(id, userResult.rows[0].role));
  } catch (error: any) {
    console.error('Erro ao atualizar permissões do usuário:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

router.post('/', async (req, res) => {
  try {
    if (!(await ensureCanManageUsers(req as AuthenticatedRequest, res))) return;

    const { nome_usuario, email, password, role, unitId, isActive = true } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!nome_usuario || !normalizedEmail || !password || !role || !unitId) {
      return res.status(400).json({ error: { message: 'Nome, email, senha, perfil e unidade são obrigatórios', status: 400 } });
    }

    const existing = await db.query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: { message: 'Email já cadastrado', status: 409 } });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `
        INSERT INTO users (nome_usuario, email, hash_senha, role, unit_id, esta_ativo, criado, atualizado)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id, nome_usuario, email, role, unit_id, esta_ativo, criado, atualizado
      `,
      [nome_usuario, normalizedEmail, passwordHash, role, unitId, isActive]
    );

    const user = result.rows[0];
    res.status(201).json({
      ...user,
      unitId: user.unit_id,
      usernome_usuario: user.email.split('@')[0],
      status: user.esta_ativo ? 'ACTIVE' : 'INACTIVE',
      permissions: await getEffectivePermissions(user.id, user.role)
    });
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!(await ensureCanManageUsers(req as AuthenticatedRequest, res))) return;

    const { id } = req.params;
    const { nome_usuario, role, unitId, isActive } = req.body;

    const result = await db.query(
      `
        UPDATE users
        SET nome_usuario = COALESCE($2, nome_usuario),
            role = COALESCE($3, role),
            unit_id = COALESCE($4, unit_id),
            esta_ativo = COALESCE($5, esta_ativo),
            atualizado = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, nome_usuario, email, role, unit_id, esta_ativo, criado, atualizado
      `,
      [id, nome_usuario || null, role || null, unitId || null, typeof isActive === 'boolean' ? isActive : null]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Usuário não encontrado', status: 404 } });
    }

    const user = result.rows[0];
    res.json({
      ...user,
      unitId: user.unit_id,
      usernome_usuario: user.email.split('@')[0],
      status: user.esta_ativo ? 'ACTIVE' : 'INACTIVE',
      permissions: await getEffectivePermissions(user.id, user.role)
    });
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
