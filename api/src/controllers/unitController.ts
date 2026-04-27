/**
 * ============================================================================
 * UNITCONTROLLER.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Controller que processa requisições relacionadas a unit controller.
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
 * Define o bloco principal deste arquivo (unit controller).
 */

function mapUnitToFrontend(row: any) {
  return {
    id: row.id,
    nome: row.nome_unidade,
    cnpj: row.cnpj,
    enderecoLinha1: row.endereco_linha1,
    enderecoLinha2: row.endereco_linha2,
    cidade: row.cidade,
    estado: row.estado,
    email: row.email,
    telefone: row.telefone,
    sede: row.sede,
    criadoEm: row.criado,
    atualizadoEm: row.atualizado,
  };
}

export class UnitController {
  static async getAll(req: Request, res: Response) {
    const db = Database.getInstance();
    try {
      const result = await db.query('SELECT * FROM units ORDER BY nome_unidade');
      const units = result.rows.map(mapUnitToFrontend);
      res.json({ units });
    } catch (error: any) {
      console.error('Erro ao buscar unidades:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  };

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const db = Database.getInstance();
    try {
      const result = await db.query('SELECT * FROM units WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Unidade não encontrada' } });
      }
      res.json(mapUnitToFrontend(result.rows[0]));
    } catch (error: any) {
      console.error('Erro ao buscar unidade:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  };

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nome, cnpj, enderecoLinha1, enderecoLinha2, sede } = req.body;
    const db = Database.getInstance();
    try {
      const result = await db.query(
        `UPDATE units 
         SET nome_unidade = $1, cnpj = $2, endereco_linha1 = $3, endereco_linha2 = $4, sede = $5, atualizado = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [nome, cnpj, enderecoLinha1, enderecoLinha2, sede, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Unidade não encontrada' } });
      }
      res.json(mapUnitToFrontend(result.rows[0]));
    } catch (error: any) {
      console.error('Erro ao atualizar unidade:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }
}
