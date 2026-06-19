/**
 * ============================================================================
 * AUTHCONTROLLER.TS (REESCRITO PARA FIREBASE)
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Processa requisições de autenticação usando o Firebase Admin SDK.
 *
 * COMO FUNCIONA?
 * --------------
 * A autenticação agora segue o padrão do Firebase:
 * 1.  **Login**: O cliente envia um ID Token gerado pelo Firebase Auth.
 *     O backend verifica o token e busca os dados do usuário no Firestore.
 * 2.  **Registro**: O backend cria um usuário no Firebase Auth e armazena
 *     informações adicionais (perfil, etc.) em um documento no Firestore.
 * 3.  **Verificação**: O token do cliente é verificado para validar a sessão.
 */

import { Request, Response } from 'express';
import { auth, db } from '../database';
// ATENÇÃO: Estes serviços também precisam ser migrados para o Firestore.
// import { getEffectivePermissions } from '../services/permissoes-servico';
// import { createAuditLog } from '../services/auditoria-servico';

// Mapeamentos de perfil/role mantidos da lógica original
const PERFIL_TO_ROLE: Record<string, string> = {
  DESENVOLVEDOR: 'DEVELOPER',
  ADMIN: 'ADMIN',
  SECRETARIO: 'SECRETARY',
  TESOUREIRO: 'TESOUREIRO',
  PASTOR: 'PASTOR',
  RH: 'RH',
  FINANCEIRO: 'FINANCEIRO',
  MEMBER: 'MEMBER',
};

const ROLE_TO_PERFIL: Record<string, string> = {
  DEVELOPER: 'DESENVOLVEDOR',
  ADMIN: 'ADMIN',
  SECRETARY: 'SECRETARIO',
  TREASURER: 'TESOUREIRO',
  PASTOR: 'PASTOR',
  RH: 'RH',
  FINANCEIRO: 'FINANCEIRO',
  MEMBER: 'MEMBRO',
};

/**
 * Constrói um objeto de usuário a partir dos dados do Firebase Auth e Firestore.
 */
async function buildUserPayload(userRecord: any, idUnidade?: string) {
  const firestoreUserDoc = await db.collection('users').doc(userRecord.uid).get();
  const firestoreUserData = firestoreUserDoc.exists ? firestoreUserDoc.data() : {};

  const perfil = firestoreUserData?.perfil || 'MEMBRO';
  const role = PERFIL_TO_ROLE[perfil] || perfil;

  // TODO: `getEffectivePermissions` precisa ser reescrito para Firestore.
  // const permissions = await getEffectivePermissions(userRecord.uid, role);

  return {
    id: userRecord.uid,
    idUsuario: userRecord.uid,
    idUnidade: firestoreUserData?.idUnidade || idUnidade,
    email: userRecord.email,
    name: userRecord.displayName || firestoreUserData?.name,
    username: userRecord.email?.split('@')[0],
    role,
    perfil,
    status: userRecord.disabled ? 'INACTIVE' : 'ACTIVE',
    // permissions,
    unrestrictedAccess: role === 'DEVELOPER',
    ...firestoreUserData,
  };
}

export class AuthController {

  /**
   * Recebe um ID Token do Firebase do cliente, verifica-o e retorna os dados do usuário.
   */
  async login(req: Request, res: Response) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          error: { message: 'ID Token é obrigatório', status: 400 },
        });
      }

      const decodedToken = await auth.verifyIdToken(idToken, true);
      const userRecord = await auth.getUser(decodedToken.uid);

      // Atualiza o último login no Firestore
      await db.collection('users').doc(userRecord.uid).update({ ultimo_login: new Date().toISOString() });
      
      const userPayload = await buildUserPayload(userRecord);

      res.json({
        user: userPayload,
        // O token agora é gerenciado pelo cliente (Firebase SDK)
        // mas podemos retorná-lo para consistência, se necessário.
        token: idToken, 
      });

    } catch (error: any) {
      console.error('Erro no login:', error);
      res.status(401).json({
        error: {
          message: 'Token inválido ou expirado',
          status: 401,
          details: error.message,
        },
      });
    }
  }

  /**
   * Registra um novo usuário no Firebase Auth e cria um documento no Firestore.
   */
  async register(req: Request, res: Response) {
    try {
      const { name, email, password, role, perfil, idUnidade } = req.body;
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const dbPerfil = ROLE_TO_PERFIL[String(role || perfil || '').toUpperCase()] || 'MEMBRO';

      if (!name || !normalizedEmail || !password || !idUnidade) {
        return res.status(400).json({ error: { message: 'Nome, email, senha e idUnidade são obrigatórios', status: 400 } });
      }

      // TODO: Verificar se a unidade existe no Firestore na coleção 'units'

      const userRecord = await auth.createUser({
        email: normalizedEmail,
        password: password,
        displayName: name,
      });

      const userData = {
        name,
        email: normalizedEmail,
        idUnidade,
        perfil: dbPerfil,
        esta_ativo: true,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString(),
      };

      await db.collection('users').doc(userRecord.uid).set(userData);

      const userPayload = await buildUserPayload(userRecord, idUnidade);

      res.status(201).json({ user: userPayload });

    } catch (error: any) {
      console.error('Erro no registro:', error);
      let message = 'Erro interno do servidor';
      let status = 500;
      if (error.code === 'auth/email-already-exists') {
        message = 'Email já cadastrado';
        status = 409;
      }
      res.status(status).json({ error: { message, status } });
    }
  }

  /**
   * Verifica um ID Token do Firebase para validar a sessão do usuário.
   */
  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: { message: 'Token não fornecido', status: 401 } });
      }

      const decodedToken = await auth.verifyIdToken(token);
      const userRecord = await auth.getUser(decodedToken.uid);

      if (userRecord.disabled) {
        return res.status(401).json({ error: { message: 'Usuário desativado', status: 401 } });
      }

      const userPayload = await buildUserPayload(userRecord);

      res.json({ valid: true, user: userPayload });

    } catch (error) {
      console.error('Erro na verificação do token:', error);
      res.status(401).json({ error: { message: 'Token inválido', status: 401 } });
    }
  }

  async logout(_req: Request, res: Response) {
    // O logout real é tratado pelo SDK do cliente Firebase.
    // Este endpoint pode ser usado para limpar cookies de sessão, se houver.
    res.json({ message: 'Sessão do lado do servidor encerrada. Faça logout no cliente.' });
  }
}
