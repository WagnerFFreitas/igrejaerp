/**
 * TRANSACTIONS.TS — Alinhado ao schema PT-BR
 * Tabela: transacoes
 */

import { Router } from 'express';
import Database from '../database';
import { randomUUID } from 'crypto';

const router = Router();
const db = Database.getInstance();

function toIsoDate(v: any): string | null {
  if (!v) return null;
  if (typeof v === 'string') return v.slice(0, 10);
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

const normalizarTransacao = (payload: any): Record<string, any> => ({
  id_unidade:        payload.id_unidade        || payload.idUnidade        || null,
  id_pessoa:         payload.id_pessoa         || payload.idPessoa         || payload.memberId || payload.id_membro || null,
  descricao:         payload.descricao         || payload.description      || '',
  valor:             payload.valor             ?? payload.amount           ?? 0,
  tipo:              payload.tipo              || payload.type             || 'DESPESA',
  id_conta:          payload.id_conta          || payload.idConta          || payload.accountId || null,
  data_transacao:    toIsoDate(payload.data_transacao || payload.dataTransacao || payload.date) || new Date().toISOString().slice(0, 10),
  data_vencimento:   toIsoDate(payload.data_vencimento || payload.dataVencimento || payload.dueDate),
  data_pagamento:    toIsoDate(payload.data_pagamento  || payload.dataPagamento  || payload.paymentDate),
  situacao:          payload.situacao          || payload.status           || 'PENDENTE',
  forma_pagamento:   payload.forma_pagamento   || payload.formaPagamento   || payload.paymentMethod || null,
  conciliado:        payload.conciliado        ?? payload.isConciliated    ?? false,
  criado_por:        payload.criado_por        || payload.criadoPor        || null,
});

const mapearTransacao = (row: any) => ({
  id:              row.id_transacao,
  idTransacao:     row.id_transacao,
  idUnidade:       row.id_unidade,
  idPessoa:        row.id_pessoa,
  descricao:       row.descricao,
  valor:           parseFloat(row.valor) || 0,
  tipo:            row.tipo,
  idConta:         row.id_conta,
  dataTransacao:   row.data_transacao,
  dataVencimento:  row.data_vencimento,
  dataPagamento:   row.data_pagamento,
  situacao:        row.situacao,
  formaPagamento:  row.forma_pagamento,
  conciliado:      row.conciliado ?? false,
  criadoPor:       row.criado_por,
  criadoEm:        row.criado_em,
  atualizadoEm:    row.atualizado_em,
});

// GET /transacoes
router.get('/', async (req, res) => {
  try {
    const { idUnidade, tipo, situacao, pagina = '1', limite = '500' } = req.query;
    const params: any[] = [];
    let i = 1;
    let where = 'WHERE 1=1';

    if (idUnidade)  { where += ` AND id_unidade = $${i++}`;  params.push(idUnidade); }
    if (tipo)       { where += ` AND tipo = $${i++}`;         params.push(tipo); }
    if (situacao)   { where += ` AND situacao = $${i++}`;     params.push(situacao); }

    const lim = parseInt(limite as string);
    const off = (parseInt(pagina as string) - 1) * lim;
    params.push(lim, off);

    const result = await db.query(
      `SELECT * FROM transacoes ${where} ORDER BY data_transacao DESC LIMIT $${i++} OFFSET $${i++}`,
      params
    );
    res.json(result.rows.map(mapearTransacao));
  } catch (error: any) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// GET /transacoes/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM transacoes WHERE id_transacao = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Transação não encontrada', status: 404 } });
    res.json(mapearTransacao(result.rows[0]));
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /transacoes
router.post('/', async (req, res) => {
  try {
    const dados = normalizarTransacao(req.body);
    const id = randomUUID();
    const campos = Object.keys(dados);
    const valores = Object.values(dados);
    const placeholders = campos.map((_, idx) => `$${idx + 2}`).join(', ');

    const result = await db.query(
      `INSERT INTO transacoes (id_transacao, ${campos.join(', ')})
       VALUES ($1, ${placeholders})
       RETURNING *`,
      [id, ...valores]
    );
    res.status(201).json(mapearTransacao(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PUT /transacoes/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dados = normalizarTransacao(req.body);
    const campos = Object.keys(dados);
    const valores = Object.values(dados);
    const setClause = campos.map((f, idx) => `${f} = $${idx + 1}`).join(', ');

    const result = await db.query(
      `UPDATE transacoes SET ${setClause}, atualizado_em = CURRENT_TIMESTAMP
       WHERE id_transacao = $${campos.length + 1} RETURNING *`,
      [...valores, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Transação não encontrada', status: 404 } });
    res.json(mapearTransacao(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// DELETE /transacoes/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE transacoes SET situacao = 'CANCELADO', atualizado_em = CURRENT_TIMESTAMP
       WHERE id_transacao = $1 RETURNING id_transacao`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Transação não encontrada', status: 404 } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
