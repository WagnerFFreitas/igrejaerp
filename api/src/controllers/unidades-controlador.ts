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
    id: row.id_unidade,
    idUnidade: row.id_unidade,
    nome: row.nome,
    cnpj: row.cnpj,
    enderecoLinha1: row.logradouro,
    enderecoLinha2: row.numero,
    logradouro: row.logradouro,
    numero: row.numero,
    bairro: row.bairro,
    cidade: row.cidade,
    estado: row.estado,
    cep: row.cep,
    pais: row.pais,
    email: row.email,
    telefone: row.telefone,
    situacao: row.situacao,
    ativo: row.ativo,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}

export class UnitController {
  static async getAll(req: Request, res: Response) {
    const db = Database.getInstance();
    try {
      const result = await db.query('SELECT * FROM unidades ORDER BY nome');
      const unidades = result.rows.map(mapUnitToFrontend);
      res.json({ unidades });
    } catch (error: any) {
      console.error('Erro ao buscar unidades:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  };

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const db = Database.getInstance();
    try {
      const result = await db.query('SELECT * FROM unidades WHERE id_unidade = $1', [id]);
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
    const {
      nome,
      cnpj,
      telefone,
      email,
      logradouro,
      enderecoLinha1,
      numero,
      enderecoLinha2,
      bairro,
      cidade,
      estado,
      cep,
      pais,
      situacao,
      ativo,
    } = req.body;
    const db = Database.getInstance();
    try {
      const result = await db.query(
        `UPDATE unidades 
         SET nome = COALESCE($1, nome),
             cnpj = COALESCE($2, cnpj),
             telefone = COALESCE($3, telefone),
             email = COALESCE($4, email),
             logradouro = COALESCE($5, logradouro),
             numero = COALESCE($6, numero),
             bairro = COALESCE($7, bairro),
             cidade = COALESCE($8, cidade),
             estado = COALESCE($9, estado),
             cep = COALESCE($10, cep),
             pais = COALESCE($11, pais),
             situacao = COALESCE($12, situacao),
             ativo = COALESCE($13, ativo),
             atualizado_em = CURRENT_TIMESTAMP
         WHERE id_unidade = $14
         RETURNING *`,
        [
          nome,
          cnpj,
          telefone,
          email,
          logradouro || enderecoLinha1,
          numero || enderecoLinha2,
          bairro,
          cidade,
          estado,
          cep,
          pais,
          situacao,
          ativo,
          id,
        ]
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
