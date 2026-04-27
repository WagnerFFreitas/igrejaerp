/**
 * ============================================================================
 * TRANSACTIONS.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para transactions.
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
 * Define o bloco principal deste arquivo (transactions).
 */

const router = Router();
const db = Database.getInstance();

// Converte payload camelCase/misto para snake_case com apenas os campos da tabela
const normalizeTransactionPayload = (payload: any): Record<string, any> => ({
  unit_id:            payload.unit_id            || payload.unitId,
  descricao:          payload.descricao           || payload.description || '',
  valor:              payload.valor               ?? payload.amount ?? 0,
  tipo_transacao:     payload.tipo_transacao      || payload.tipo || payload.type || 'EXPENSE',
  situacao:           payload.situacao            || payload.status || 'PENDING',
  data_transacao:     payload.data_transacao      || payload.date || payload.transaction_date || new Date().toISOString().split('T')[0],
  data_competencia:   payload.data_competencia    || payload.competencyDate || payload.competency_date || payload.date || new Date().toISOString().split('T')[0],
  categoria:          payload.categoria           || payload.category || 'OUTROS',
  centro_custo:       payload.centro_custo        || payload.costCenter || payload.cost_center || null,
  natureza_operacao:  payload.natureza_operacao   || payload.operationNature || payload.operation_nature || null,
  conta_id:           payload.conta_id            || payload.accountId || payload.account_id || null,
  membro_id:          payload.membro_id           || payload.memberId || payload.member_id || null,
  forma_pagamento:    payload.forma_pagamento     || payload.paymentMethod || payload.payment_method || null,
  projeto_id:         payload.projeto_id          || payload.projectId || payload.project_id || null,
  nome_fornecedor:    payload.nome_fornecedor     || payload.providerName || payload.provider_name || null,
  data_vencimento:    payload.data_vencimento     || payload.dueDate || payload.due_date || null,
  data_pagamento:     payload.data_pagamento      || payload.paymentDate || payload.payment_date || null,
  valor_pago:         payload.valor_pago          ?? payload.paidAmount ?? payload.paid_amount ?? null,
  valor_restante:     payload.valor_restante      ?? payload.remainingAmount ?? payload.remaining_amount ?? null,
  parcelado:          payload.parcelado           ?? payload.isInstallment ?? payload.is_installment ?? false,
  numero_parcela:     payload.numero_parcela      ?? payload.installmentNumber ?? payload.installment_number ?? null,
  total_parcelas:     payload.total_parcelas      ?? payload.totalInstallments ?? payload.total_installments ?? null,
  pai_id:             payload.pai_id              || payload.parentId || payload.parent_id || null,
  conciliado:         payload.conciliado          ?? payload.isConciliated ?? payload.is_conciliated ?? false,
  data_conciliacao:   payload.data_conciliacao    || payload.conciliationDate || payload.conciliation_date || null,
  observacoes:        payload.observacoes         || payload.notes || null,
  id_externo:         payload.id_externo          || payload.externalId || payload.external_id || null,
});

const mapTransactionRow = (row: any) => ({
  id: row.id,
  unidadeId: row.unit_id,
  descricao: row.descricao,
  valor: parseFloat(row.valor) || 0,
  tipoTransacao: row.tipo_transacao,
  situacao: row.situacao,
  dataTransacao: row.data_transacao,
  dataCompetencia: row.data_competencia || row.data_transacao,
  categoria: row.categoria,
  centroCusto: row.centro_custo,
  naturezaOperacao: row.natureza_operacao,
  contaId: row.conta_id,
  membroId: row.membro_id,
  formaPagamento: row.forma_pagamento,
  projetoId: row.projeto_id,
  nomeFornecedor: row.nome_fornecedor,
  dataVencimento: row.data_vencimento,
  dataPagamento: row.data_pagamento,
  valorPago: row.valor_pago != null ? parseFloat(row.valor_pago) : null,
  valorRestante: row.valor_restante != null ? parseFloat(row.valor_restante) : null,
  ehParcelado: row.parcelado ?? false,
  numeroParcela: row.numero_parcela,
  totalParcelas: row.total_parcelas,
  paiId: row.pai_id,
  conciliado: row.conciliado ?? false,
  dataConciliacao: row.data_conciliacao,
  observacoes: row.observacoes,
  idExterno: row.id_externo,
  criadoEm: row.criado,
  atualizadoEm: row.atualizado,
});

// GET /transactions
router.get('/', async (req, res) => {
  try {
    const { unidadeId, tipoTransacao, situacao, pagina = '1', limite = '500' } = req.query;
    const params: any[] = [];
    let i = 1;
    let where = 'WHERE 1=1';
    if (unidadeId) { where += ` AND unit_id = $${i++}`; params.push(unidadeId); }
    if (tipoTransacao) { where += ` AND tipo_transacao = $${i++}`; params.push(tipoTransacao); }
    if (situacao) { where += ` AND situacao = $${i++}`; params.push(situacao); }

    const lim = parseInt(limite as string);
    const off = (parseInt(pagina as string) - 1) * lim;
    params.push(lim, off);

    const query = `
      SELECT *
      FROM transactions ${where}
      ORDER BY data_transacao DESC LIMIT $${i++} OFFSET $${i++}
    `;

    const result = await db.query(query, params);
    res.json(result.rows.map(mapTransactionRow));
  } catch (error: any) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /transactions
router.post('/', async (req, res) => {
  try {
    const data: Record<string, any> = { id: randomUUID(), ...normalizeTransactionPayload(req.body) };
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(', ');

    const result = await db.query(
      `INSERT INTO transactions (${fields.join(', ')}, criado, atualizado)
       VALUES (${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      values
    );
    res.status(201).json(mapTransactionRow(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PUT /transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = normalizeTransactionPayload(req.body);
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((f, idx) => `${f} = $${idx + 1}`).join(', ');

    const result = await db.query(
      `UPDATE transactions SET ${setClause}, atualizado = CURRENT_TIMESTAMP
       WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Transação não encontrada', status: 404 } });
    res.json(mapTransactionRow(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// DELETE /transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM transactions WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (error: any) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
