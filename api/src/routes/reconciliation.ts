/**
 * ============================================================================
 * RECONCILIATION.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para reconciliation.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import { Router } from 'express';
import Database from '../database';
import { randomUUID } from 'crypto';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (reconciliation).
 */

const router = Router();
const db = Database.getInstance();

const uuidOrNull = (v: any) => (v && /^[0-9a-f-]{36}$/i.test(v) ? v : null);

// ─── RECONCILIATIONS ─────────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const { unitId } = req.query;
    const result = await db.query(
      `SELECT * FROM bank_reconciliations WHERE unit_id=$1 ORDER BY criado DESC`,
      [unitId]
    );
    res.json(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM bank_reconciliations WHERE id=$1`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Não encontrado' } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.post('/', async (req, res) => {
  try {
    const b = req.body;
    const id = randomUUID();
    const result = await db.query(
      `INSERT INTO bank_reconciliations
         (id, unit_id, bank_account_id, bank_account_name, bank_name,
          data_inicio, data_fim, saldo_inicial, saldo_final, saldo_conciliado,
          diferenca, status, percentual_conciliacao, total_transacoes_banco,
          total_transacoes_sistema, transacoes_conciliadas, transacoes_nao_conciliadas,
          divergencias, conciliado_por, data_conciliacao, observacoes, criado, atualizado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,NOW(),NOW())
       RETURNING *`,
      [id, b.unitId||b.unit_id,
       uuidOrNull(b.bankAccountId||b.bank_account_id),
       b.bankAccountName||b.bank_account_name||null,
       b.bankName||b.bank_name||null,
       b.dataInicio||b.data_inicio, b.dataFim||b.data_fim,
       b.saldoInicial||0, b.saldoFinal||0, b.saldoConciliado||0,
       b.diferenca||0, b.status||'IN_PROGRESS',
       b.percentualConciliacao||0,
       b.totalTransacoesBanco||0, b.totalTransacoesSistema||0,
       b.transacoesConciliadas||0, b.transacoesNaoConciliadas||0,
       JSON.stringify(b.divergencias||[]),
       b.conciliadoPor||null,
       b.dataConciliacao||null,
       b.observacoes||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `UPDATE bank_reconciliations
       SET saldo_final=$1, saldo_conciliado=$2, diferenca=$3, status=$4,
           percentual_conciliacao=$5, total_transacoes_banco=$6,
           total_transacoes_sistema=$7, transacoes_conciliadas=$8,
           transacoes_nao_conciliadas=$9, divergencias=$10,
           conciliado_por=$11, data_conciliacao=$12, observacoes=$13, atualizado=NOW()
       WHERE id=$14 RETURNING *`,
      [b.saldoFinal||0, b.saldoConciliado||0, b.diferenca||0,
       b.status, b.percentualConciliacao||0,
       b.totalTransacoesBanco||0, b.totalTransacoesSistema||0,
       b.transacoesConciliadas||0, b.transacoesNaoConciliadas||0,
       JSON.stringify(b.divergencias||[]),
       b.conciliadoPor||null, b.dataConciliacao||null,
       b.observacoes||null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Não encontrado' } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

// ─── BANK STATEMENT TRANSACTIONS ─────────────────────────────────────────────

router.get('/:reconciliationId/transactions', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM bank_statement_transactions WHERE reconciliation_id=$1 ORDER BY data_transacao DESC`,
      [req.params.reconciliationId]
    );
    res.json(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.post('/:reconciliationId/transactions', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `INSERT INTO bank_statement_transactions
         (id, unit_id, reconciliation_id, bank_account_id, data_transacao,
          descricao, valor, tipo, metodo_pagamento, status_conciliacao,
          transaction_id, origem, external_id, criado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW()) RETURNING *`,
      [randomUUID(), b.unitId||b.unit_id,
       req.params.reconciliationId,
       uuidOrNull(b.bankAccountId||b.bank_account_id),
       b.dataTransacao||b.data_transacao,
       b.descricao, b.valor, b.tipo,
       b.metodoPagamento||null,
       b.statusConciliacao||'PENDING',
       uuidOrNull(b.transactionId||b.transaction_id),
       b.origem||'BANK_STATEMENT',
       b.externalId||b.external_id||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

// Vincular transação do extrato com transação do sistema
router.patch('/:reconciliationId/transactions/:txId/match', async (req, res) => {
  try {
    const { transactionId } = req.body;
    const result = await db.query(
      `UPDATE bank_statement_transactions
       SET transaction_id=$1, status_conciliacao='MATCHED'
       WHERE id=$2 RETURNING *`,
      [uuidOrNull(transactionId), req.params.txId]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Não encontrado' } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

export default router;
