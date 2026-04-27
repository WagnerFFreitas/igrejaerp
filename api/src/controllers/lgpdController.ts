/**
 * ============================================================================
 * LGPDCONTROLLER.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Controller que processa requisições relacionadas a lgpd controller.
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
import Database from '../database';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (lgpd controller).
 */

export class LGPDController {
  static async getCurrentPolicy(req: Request, res: Response) {
    const { unitId } = req.query;
    const db = Database.getInstance();
    try {
      const result = await db.query(
        'SELECT * FROM lgpd_policies WHERE unit_id = $1 AND esta_ativa = true ORDER BY criado DESC LIMIT 1',
        [unitId]
      );
      if (result.rows.length === 0) {
        // Fallback para política padrão se não houver nenhuma ativa
        const fallback = await db.query(
          'SELECT * FROM lgpd_policies WHERE esta_ativa = true ORDER BY criado DESC LIMIT 1'
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
        `SELECT c.*, p.version as policy_version, p.title as policy_title 
         FROM lgpd_consent_logs c
         JOIN lgpd_policies p ON c.policy_id = p.id
         WHERE c.member_id = $1
         ORDER BY c.consent_date DESC`,
        [memberId]
      );
      res.json({ consents: result.rows });
    } catch (error: any) {
      console.error('Erro ao buscar consentimentos:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }

  static async saveConsent(req: Request, res: Response) {
    const { memberId, employeeId, policyId, consentType, granted } = req.body;
    const db = Database.getInstance();
    try {
      const result = await db.query(
        `INSERT INTO lgpd_consent_logs (member_id, employee_id, policy_id, consent_type, granted, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [memberId, employeeId, policyId, consentType, granted, req.ip, req.headers['user-agent']]
      );
      res.status(201).json(result.rows[0]);
    } catch (error: any) {
      console.error('Erro ao salvar consentimento:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }
}
