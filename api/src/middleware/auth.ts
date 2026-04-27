/**
 * ============================================================================
 * AUTH.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Arquivo relacionado a auth.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (auth).
 */

export interface AuthenticatedRequest extends Request {
  authUser?: {
    userId: string;
    email: string;
    role: string;
    unitId: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as {
      userId: string;
      email: string;
      role: string;
      unitId: string;
    };

    req.authUser = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: 'Token inválido',
        status: 401
      }
    });
  }
}
