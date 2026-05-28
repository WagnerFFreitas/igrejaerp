/**
 * ACCOUNTS.TS — Alinhado ao schema PT-BR
 * Tabela principal: contas_bancarias
 * Tabela auxiliar:  contas_financeiras (saldo/tipo)
 */

import { Router } from 'express';
import Database from '../database';
import { randomUUID } from 'crypto';

const router = Router();
const db = Database.getInstance();

const mapearConta = (row: any) => ({
  id:           row.id,
  idUnidade:    row.id_unidade,
  nomeConta:    row.nome_conta,
  tipoConta:    row.tipo_conta,
  nomeBanco:    row.nome_banco,
  agencia:      row.agencia,
  numeroConta:  row.numero_conta,
  moeda:        row.moeda || 'BRL',
  estaAtivo:    row.esta_ativo ?? true,
  // campos extras de contas_financeiras quando disponíveis
  saldo:        row.saldo != null ? parseFloat(row.saldo) : null,
  criadoEm:     row.criado_em,
  atualizadoEm: row.atualizado_em,
});

// GET /accounts
router.get('/', async (req, res) => {
  try {
    const { idUnidade } = req.query;
    let query = `
      SELECT cb.*, cf.saldo
      FROM contas_bancarias cb
      LEFT JOIN contas_financeiras cf ON cf.id_unidade = cb.id_unidade AND cf.nome = cb.nome_conta
      WHERE cb.esta_ativo = true
    `;
    const params: any[] = [];

    if (idUnidade) {
      query += ' AND cb.id_unidade = $1';
      params.push(idUnidade);
    }

    query += ' ORDER BY cb.nome_conta ASC';
    const result = await db.query(query, params);
    res.json(result.rows.map(mapearConta));
  } catch (error: any) {
    console.error('Erro ao buscar contas:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// GET /accounts/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT cb.*, cf.saldo
       FROM contas_bancarias cb
       LEFT JOIN contas_financeiras cf ON cf.id_unidade = cb.id_unidade AND cf.nome = cb.nome_conta
       WHERE cb.id = $1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Conta não encontrada', status: 404 } });
    res.json(mapearConta(result.rows[0]));
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /accounts
router.post('/', async (req, res) => {
  try {
    const b = req.body;
    const id = randomUUID();
    const idUnidade = b.idUnidade || b.id_unidade || null;
    const nomeConta = b.nomeConta || b.nome_conta || b.nome || b.name;
    const tipoConta = b.tipoConta || b.tipo_conta || b.tipo || b.type || 'CORRENTE';
    const nomeBanco = b.nomeBanco || b.nome_banco || b.bankName || null;
    const agencia   = b.agencia   || b.agency     || null;
    const numeroConta = b.numeroConta || b.numero_conta || b.accountNumber || null;
    const moeda     = b.moeda     || b.currency   || 'BRL';

    const result = await db.query(
      `INSERT INTO contas_bancarias (id, id_unidade, nome_conta, tipo_conta, nome_banco, agencia, numero_conta, moeda, esta_ativo)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true) RETURNING *`,
      [id, idUnidade, nomeConta, tipoConta, nomeBanco, agencia, numeroConta, moeda]
    );

    // Sincronizar em contas_financeiras
    await db.query(
      `INSERT INTO contas_financeiras (id_conta, id_unidade, nome, tipo, saldo)
       VALUES ($1,$2,$3,$4,0)
       ON CONFLICT DO NOTHING`,
      [randomUUID(), idUnidade, nomeConta, tipoConta]
    );

    res.status(201).json(mapearConta(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao criar conta:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PUT /accounts/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;
    const result = await db.query(
      `UPDATE contas_bancarias
       SET nome_conta=$1, tipo_conta=$2, nome_banco=$3, agencia=$4, numero_conta=$5, moeda=$6,
           atualizado_em=CURRENT_TIMESTAMP
       WHERE id=$7 RETURNING *`,
      [
        b.nomeConta || b.nome_conta || b.nome || b.name,
        b.tipoConta || b.tipo_conta || b.tipo || b.type,
        b.nomeBanco || b.nome_banco || b.bankName || null,
        b.agencia   || b.agency    || null,
        b.numeroConta || b.numero_conta || b.accountNumber || null,
        b.moeda     || b.currency  || 'BRL',
        id,
      ]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Conta não encontrada', status: 404 } });
    res.json(mapearConta(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao atualizar conta:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// DELETE /accounts/:id — soft delete
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      `UPDATE contas_bancarias SET esta_ativo=false, atualizado_em=CURRENT_TIMESTAMP WHERE id=$1`,
      [req.params.id]
    );
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
