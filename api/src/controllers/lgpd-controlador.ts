/**
 * ============================================================================
 * LGPDCONTROLLER.TS
 * ============================================================================
 *
 * Controller para LGPD alinhado ao schema PostgreSQL em português.
 * Tabelas: politicas_lgpd, logs_consentimento_lgpd
 */

import { Request, Response } from 'express';
import Database from '../database';

export class LGPDController {
  static async getCurrentPolicy(req: Request, res: Response) {
    const { idUnidade } = req.query;
    const db = Database.getInstance();
    try {
      const result = await db.query(
        'SELECT * FROM politicas_lgpd WHERE id_unidade = $1 AND esta_ativa = true ORDER BY criado DESC LIMIT 1',
        [idUnidade]
      );
      if (result.rows.length === 0) {
        // Fallback para política padrão se não houver nenhuma ativa
        const fallback = await db.query(
          'SELECT * FROM politicas_lgpd WHERE esta_ativa = true ORDER BY criado DESC LIMIT 1'
        );
        const row = fallback.rows[0];
        if (!row) return res.json(null);
        return res.json({
          ...row,
          isActive: row.esta_ativa,
          effectiveDate: row.criado,
        });
      }
      const row = result.rows[0];
      res.json({
        ...row,
        isActive: row.esta_ativa,
        effectiveDate: row.criado,
      });
    } catch (error: any) {
      console.error('Erro ao buscar política LGPD:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }

  static async getMemberConsents(req: Request, res: Response) {
    const { memberId } = req.params;
    const db = Database.getInstance();
    try {
      const result = await db.query(
        `SELECT c.*, p.versao AS policy_version, p.titulo AS policy_title
         FROM logs_consentimento_lgpd c
         JOIN politicas_lgpd p ON c.id_politica = p.id
         WHERE c.id_membro = $1
         ORDER BY c.data_consentimento DESC`,
        [memberId]
      );
      res.json({ consents: result.rows });
    } catch (error: any) {
      console.error('Erro ao buscar consentimentos:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }

  static async saveConsent(req: Request, res: Response) {
    const { memberId, employeeId, policyId, consentType, concedido } = req.body;
    const db = Database.getInstance();
    try {
      const result = await db.query(
        `INSERT INTO logs_consentimento_lgpd (id_membro, id_funcionario, id_politica, tipo_consentimento, concedido, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [memberId, employeeId, policyId, consentType, concedido, req.ip, req.headers['user-agent']]
      );
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Erro ao salvar consentimento:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }

  static async savePolicy(req: Request, res: Response) {
    const { idUnidade, titulo, conteudo, versao, dataVigencia } = req.body;
    const db = Database.getInstance();
    try {
      const result = await db.query(
        `INSERT INTO politicas_lgpd (id_unidade, titulo, conteudo, versao, data_vigencia, esta_ativa)
         VALUES ($1, $2, $3, $4, $5, true)
         RETURNING *`,
        [idUnidade, titulo, conteudo, versao, dataVigencia]
      );
      res.status(201).json({
        ...result.rows[0],
        isActive: result.rows[0].esta_ativa,
        effectiveDate: result.rows[0].criado,
      });
    } catch (error: any) {
      console.error('Erro ao salvar política LGPD:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }
}
