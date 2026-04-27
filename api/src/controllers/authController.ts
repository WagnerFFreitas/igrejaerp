/**
 * ============================================================================
 * AUTHCONTROLLER.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Controller que processa requisições relacionadas a auth controller.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from '../database';
import { getEffectivePermissions } from '../services/permissionsService';
import { createAuditLog } from '../services/auditService';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (auth controller).
 */

const db = Database.getInstance();

export class AuthController {
  private async safeCreateAuditLog(payload: Parameters<typeof createAuditLog>[0]): Promise<void> {
    try {
      await createAuditLog(payload);
    } catch (error) {
      console.error('Falha ao gravar auditoria de autenticação:', error);
    }
  }

  private getRequestIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.length > 0) {
      return forwarded.split(',')[0].trim();
    }

    return req.ip || req.socket.remoteAddress || '127.0.0.1';
  }

  async login(req: Request, res: Response) {
    try {
      const { email, username, password } = req.body;
      const rawIdentifier = String(email || username || '').trim();
      const identifier = rawIdentifier.toLowerCase();

      const loginAliases: Record<string, string> = {
        desenvolvedor: 'desenvolvedor@igrejaerp.com.br',
        admin: 'admin@igrejaerp.com.br'
      };

      const resolvedIdentifier = loginAliases[identifier] || identifier;

      if (!resolvedIdentifier || !password) {
        return res.status(400).json({
          error: {
            message: 'Usuário/email e senha são obrigatórios',
            status: 400
          }
        });
      }

      // Buscar usuário no banco
      const result = await db.query(`
        SELECT u.*, un.nome_unidade as unit_name 
        FROM users u 
        JOIN units un ON u.unit_id = un.id 
        WHERE (
          LOWER(u.email) = LOWER($1) OR
          LOWER(SPLIT_PART(u.email, '@', 1)) = LOWER($2) OR
          u.nome_usuario ILIKE $2
        ) AND COALESCE(u.esta_ativo, true) = true
      `, [resolvedIdentifier, identifier]);

      if (result.rows.length === 0) {
        await this.safeCreateAuditLog({
          unitId: '',
          userId: '',
          userName: rawIdentifier || 'desconhecido',
          action: 'USER_LOGIN',
          entidade: 'User',
          entidadeName: rawIdentifier || 'desconhecido',
          date: new Date().toISOString(),
          ip: this.getRequestIp(req),
          userAgent: req.headers['user-agent'],
          success: false,
          errorMessage: 'Usuário não encontrado'
        });

        return res.status(401).json({
          error: {
            message: 'Email ou senha inválidos',
            status: 401
          }
        });
      }

      const user = result.rows[0];

      // Verificar senha (considerando que já pode ter hash do Firebase)
      let isPasswordValid = false;
      
      // Se a senha não está hasheada (formato antigo do Firebase)
      if (password === user.hash_senha) {
        isPasswordValid = true;
        // Atualizar para hash bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('UPDATE users SET hash_senha = $1 WHERE id = $2', [hashedPassword, user.id]);
      } else {
        // Verificar com bcrypt
        isPasswordValid = await bcrypt.compare(password, user.hash_senha);
      }

      if (!isPasswordValid) {
        await this.safeCreateAuditLog({
          unitId: user.unit_id,
          userId: user.id,
          userName: user.nome_usuario,
          action: 'USER_LOGIN',
          entidade: 'User',
          entidadeId: user.id,
          entidadeName: user.nome_usuario,
          date: new Date().toISOString(),
          ip: this.getRequestIp(req),
          userAgent: req.headers['user-agent'],
          success: false,
          errorMessage: 'Senha inválida'
        });

        return res.status(401).json({
          error: {
            message: 'Email ou senha inválidos',
            status: 401
          }
        });
      }

      // Gerar token JWT - Corrigido
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        unitId: user.unit_id
      };
      
      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'default-secret'
      );
      
      // Definir expiração separadamente se necessário
      const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

      // Atualizar último login
      await db.query('UPDATE users SET ultimo_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
      await this.safeCreateAuditLog({
        unitId: user.unit_id,
        userId: user.id,
        userName: user.nome_usuario,
        action: 'USER_LOGIN',
        entidade: 'User',
        entidadeId: user.id,
        entidadeName: user.nome_usuario,
        date: new Date().toISOString(),
        ip: this.getRequestIp(req),
        userAgent: req.headers['user-agent'],
        success: true
      });

      // Retornar dados do usuário (sem senha)
      const { hash_senha, ...userWithoutPassword } = user;
      
      // Mapear unit_id para unitId para compatibilidade com o frontend
      const mappedUser = {
        ...userWithoutPassword,
        unitId: userWithoutPassword.unit_id,
        username: userWithoutPassword.email?.split('@')[0] || identifier,
        status: userWithoutPassword.esta_ativo ? 'ACTIVE' : 'INACTIVE',
        permissions: await getEffectivePermissions(user.id, user.role),
        unrestrictedAccess: user.role === 'DEVELOPER'
      };

      res.json({
        user: mappedUser,
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({
        error: {
          message: 'Erro interno do servidor',
          status: 500
        }
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { name, username, email, password, role, unitId } = req.body;
      const normalizedEmail = String(email || '').trim().toLowerCase();

      if (!name || !normalizedEmail || !password || !role || !unitId) {
        return res.status(400).json({
          error: {
            message: 'Todos os campos são obrigatórios',
            status: 400
          }
        });
      }

      // Verificar se usuário já existe
      const existingUser = await db.query(
        'SELECT id FROM users WHERE LOWER(email) = $1',
        [normalizedEmail]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          error: {
            message: 'Email já cadastrado',
            status: 409
          }
        });
      }

      // Verificar se unidade existe
      const unitExists = await db.query('SELECT id FROM units WHERE id = $1', [unitId]);
      if (unitExists.rows.length === 0) {
        return res.status(400).json({
          error: {
            message: 'Unidade não encontrada',
            status: 400
          }
        });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const result = await db.query(`
        INSERT INTO users (user.nome_usuario, email, hash_senha, role, unit_id, esta_ativo)
        VALUES ($1, $2, $3, $4, $5, true)
        RETURNING id, user.nome_usuario, email, role, unit_id, esta_ativo, criado
      `, [name, normalizedEmail, hashedPassword, role, unitId]);

      const newUser = result.rows[0];

      // Gerar token
      const tokenPayload = { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role,
        unitId: newUser.unit_id 
      };
      
      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'default-secret'
      );

      res.status(201).json({
        user: {
          ...newUser,
          unitId: newUser.unit_id,
          username: normalizedEmail.split('@')[0],
          status: newUser.esta_ativo ? 'ACTIVE' : 'INACTIVE',
          permissions: await getEffectivePermissions(newUser.id, newUser.role),
          unrestrictedAccess: newUser.role === 'DEVELOPER'
        },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({
        error: {
          message: 'Erro interno do servidor',
          status: 500
        }
      });
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({
          error: {
            message: 'Token não fornecido',
            status: 401
          }
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;

      // Buscar usuário atualizado
      const result = await db.query(`
        SELECT u.*, un.nome_unidade as unit_name 
        FROM users u 
        JOIN units un ON u.unit_id = un.id 
        WHERE u.id = $1 AND COALESCE(u.esta_ativo, true) = true
      `, [decoded.userId]);

      if (result.rows.length === 0) {
        return res.status(401).json({
          error: {
            message: 'Usuário não encontrado ou inativo',
            status: 401
          }
        });
      }

      const { hash_senha, ...userWithoutPassword } = result.rows[0];
      
      // Mapear unit_id para unitId para compatibilidade com o frontend
      const mappedUser = {
        ...userWithoutPassword,
        unitId: userWithoutPassword.unit_id,
        username: userWithoutPassword.email?.split('@')[0] || userWithoutPassword.name,
        status: userWithoutPassword.esta_ativo ? 'ACTIVE' : 'INACTIVE',
        permissions: await getEffectivePermissions(userWithoutPassword.id, userWithoutPassword.role),
        unrestrictedAccess: userWithoutPassword.role === 'DEVELOPER'
      };

      res.json({
        valid: true,
        user: mappedUser
      });

    } catch (error) {
      console.error('Erro na verificação do token:', error);
      res.status(401).json({
        error: {
          message: 'Token inválido',
          status: 401
        }
      });
    }
  }

  async logout(req: Request, res: Response) {
    // Em uma implementação mais robusta, poderíamos adicionar o token a uma blacklist
    res.json({
      message: 'Logout realizado com sucesso'
    });
  }
}
