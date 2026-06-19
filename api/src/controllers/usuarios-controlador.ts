/**
 * ============================================================================
 * USUARIOS-CONTROLADOR.TS (CORRIGIDO)
 * ============================================================================
 *
 * Controller para Usuários, migrado para Firestore.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../database';
import { getEffectivePermissions, replaceUserPermissions, APP_PERMISSION_MODULES } from '../services/permissoes-servico';
import { AuthenticatedRequest } from '../middleware/autenticacao';

// Mapeia um documento de usuário do Firestore para a resposta da API
function mapUserDocToApiResponse(doc: FirebaseFirestore.DocumentSnapshot) {
    const data = doc.data() || {};
    return {
        id: doc.id,
        id_usuario: doc.id,
        ...data,
        status: data.esta_ativo ? 'ACTIVE' : 'INACTIVE',
    };
}

// Função de guarda para verificar se o usuário autenticado pode gerenciar usuários
async function ensureCanManageUsers(req: AuthenticatedRequest, res: Response): Promise<boolean> {
    const authUser = req.authUser;
    if (!authUser) {
        res.status(401).json({ error: { message: 'Usuário não autenticado' } });
        return false;
    }
    if (authUser.role === 'DEVELOPER') {
        return true;
    }
    const permissions = await getEffectivePermissions(authUser.userId, authUser.role);
    const canManage = permissions.some(p => (p.moduleCode === 'usuarios' || p.moduleCode === 'permissions') && p.canManage);
    if (!canManage) {
        res.status(403).json({ error: { message: 'Sem permissão para gerenciar usuários e permissões' } });
        return false;
    }
    return true;
}

export class UsuariosController {

    async getAll(req: AuthenticatedRequest, res: Response) {
        if (!(await ensureCanManageUsers(req, res))) return;
        try {
            const snapshot = await db.collection('users').orderBy('nome_usuario').get();
            const users = await Promise.all(snapshot.docs.map(async (doc) => {
                const user = mapUserDocToApiResponse(doc);
                // Correção: Obter 'role' diretamente dos dados do documento
                const permissions = await getEffectivePermissions(user.id, doc.data().role);
                return { ...user, permissions };
            }));
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
        }
    }

    async create(req: AuthenticatedRequest, res: Response) {
        if (!(await ensureCanManageUsers(req, res))) return;
        try {
            const { nome_usuario, email, password, role, idUnidade, esta_ativo = true } = req.body;
            const normalizedEmail = String(email || '').trim().toLowerCase();

            if (!nome_usuario || !normalizedEmail || !password || !role || !idUnidade) {
                return res.status(400).json({ error: { message: 'Nome, email, senha, perfil e unidade são obrigatórios' } });
            }
            
            const existing = await db.collection('users').where('email', '==', normalizedEmail).limit(1).get();
            if (!existing.empty) {
                return res.status(409).json({ error: { message: 'Email já cadastrado' } });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const newUserRef = db.collection('users').doc();
            const newUserData = {
                id_unidade: idUnidade,
                nome_usuario: nome_usuario,
                email: normalizedEmail,
                login: normalizedEmail,
                senha_hash: passwordHash,
                role: role,
                perfil: role, // Mantendo perfil por compatibilidade
                esta_ativo: esta_ativo,
                criado_em: new Date(),
                atualizado_em: new Date(),
            };
            await newUserRef.set(newUserData);
            
            const permissions = await getEffectivePermissions(newUserRef.id, newUserData.role);
            
            // Correção: Mapear o objeto de usuário manualmente, sem simular um DocumentSnapshot
            const mappedUser = {
                id: newUserRef.id,
                id_usuario: newUserRef.id,
                ...newUserData,
                status: newUserData.esta_ativo ? 'ACTIVE' : 'INACTIVE',
            };

            res.status(201).json({ ...mappedUser, permissions });

        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
        }
    }

    async update(req: AuthenticatedRequest, res: Response) {
        if (!(await ensureCanManageUsers(req, res))) return;
        try {
            const { id } = req.params;
            const { nome_usuario, role, idUnidade, esta_ativo } = req.body;
            
            const docRef = db.collection('users').doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Usuário não encontrado' } });
            }

            const updatedData: Record<string, any> = { atualizado_em: new Date() };
            if (nome_usuario) updatedData.nome_usuario = nome_usuario;
            if (role) { updatedData.role = role; updatedData.perfil = role; }
            if (idUnidade) updatedData.id_unidade = idUnidade;
            if (typeof esta_ativo === 'boolean') updatedData.esta_ativo = esta_ativo;

            await docRef.update(updatedData);
            const updatedDoc = await docRef.get();
            const user = mapUserDocToApiResponse(updatedDoc);

            // Correção: Obter 'role' diretamente dos dados do documento atualizado
            const permissions = await getEffectivePermissions(user.id, updatedDoc.data()!.role);
            res.json({ ...user, permissions });

        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
        }
    }

    // --- Permissões ---

    getPermissionModules(req: Request, res: Response) {
        res.json(APP_PERMISSION_MODULES);
    }

    async getUserPermissions(req: AuthenticatedRequest, res: Response) {
        if (!(await ensureCanManageUsers(req, res))) return;
        try {
            const { id } = req.params;
            const userDoc = await db.collection('users').doc(id).get();
            if (!userDoc.exists) {
                return res.status(404).json({ error: { message: 'Usuário não encontrado' } });
            }
            const permissions = await getEffectivePermissions(id, userDoc.data()!.role);
            res.json(permissions);
        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
        }
    }

    async updateUserPermissions(req: AuthenticatedRequest, res: Response) {
        if (!(await ensureCanManageUsers(req, res))) return;
        try {
            const { id } = req.params;
            const { permissions } = req.body;

            const userDoc = await db.collection('users').doc(id).get();
            if (!userDoc.exists) {
                return res.status(404).json({ error: { message: 'Usuário não encontrado' } });
            }
            
            const userRole = userDoc.data()!.role;
            if (userRole === 'DEVELOPER') {
                return res.status(400).json({ error: { message: 'Permissões de desenvolvedor não podem ser alteradas' } });
            }

            await replaceUserPermissions(id, permissions || []);
            const effectivePermissions = await getEffectivePermissions(id, userRole);
            res.json(effectivePermissions);

        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
        }
    }
}
