/**
 * ============================================================================
 * TREASURY.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para treasury.
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
 * Define o bloco principal deste arquivo (treasury).
 */

const router = Router();
const db = Database.getInstance();

// ─── helpers ────────────────────────────────────────────────────────────────

const uuidOrNull = (v: any) => (v && /^[0-9a-f-]{36}$/i.test(v) ? v : null);

// ─── CASH FLOWS ─────────────────────────────────────────────────────────────

router.get('/cash-flows', async (req, res) => {
  try {
    const { unitId, startDate, endDate } = req.query;
    let query = `SELECT * FROM treasury_cash_flows WHERE 1=1`;
    const params: any[] = [];
    let i = 1;
    if (unitId)    { query += ` AND unit_id = $${i++}`;  params.push(unitId); }
    if (startDate) { query += ` AND data >= $${i++}`;    params.push(startDate); }
    if (endDate)   { query += ` AND data <= $${i++}`;    params.push(endDate); }
    query += ` ORDER BY data DESC`;
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.post('/cash-flows', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `INSERT INTO treasury_cash_flows
         (id, unit_id, data, descricao, categoria, valor, tipo, conta_id, status, observacoes, criado_por, criado, atualizado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW()) RETURNING *`,
      [randomUUID(), b.unitId||b.unit_id, b.data, b.descricao, b.categoria, b.valor,
       b.tipo, uuidOrNull(b.contaId||b.conta_id), b.status||'REALIZADO', b.observacoes||null, b.createdBy||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.put('/cash-flows/:id', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `UPDATE treasury_cash_flows
       SET data=$1, descricao=$2, categoria=$3, valor=$4, tipo=$5,
           conta_id=$6, status=$7, observacoes=$8, atualizado=NOW()
       WHERE id=$9 RETURNING *`,
      [b.data, b.descricao, b.categoria, b.valor, b.tipo,
       uuidOrNull(b.contaId||b.conta_id), b.status, b.observacoes||null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Não encontrado' } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.delete('/cash-flows/:id', async (req, res) => {
  try {
    await db.query(`DELETE FROM treasury_cash_flows WHERE id=$1`, [req.params.id]);
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

// ─── FORECASTS ───────────────────────────────────────────────────────────────

router.get('/forecasts', async (req, res) => {
  try {
    const { unitId } = req.query;
    const result = await db.query(
      `SELECT * FROM treasury_forecasts WHERE unit_id=$1 ORDER BY criado DESC`,
      [unitId]
    );
    res.json(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.post('/forecasts', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `INSERT INTO treasury_forecasts
         (id, unit_id, data_inicio, data_fim, tipo, saldo_inicial, entradas_previstas,
          saidas_previstas, saldo_final_previsto, entradas_realizadas, saidas_realizadas,
          saldo_final_real, precisao, status, detalhes, criado_por, criado, atualizado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,NOW(),NOW()) RETURNING *`,
      [randomUUID(), b.unitId||b.unit_id, b.dataInicio||b.data_inicio, b.dataFim||b.data_fim,
       b.tipo, b.saldoInicial||0, b.entradasPrevistas||0, b.saidasPrevistas||0,
       b.saldoFinalPrevisto||0, b.entradasRealizadas||0, b.saidasRealizadas||0,
       b.saldoFinalReal||0, b.precisao||0, b.status||'EM_ANDAMENTO',
       JSON.stringify(b.detalhes||[]), b.criadoPor||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.put('/forecasts/:id', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `UPDATE treasury_forecasts
       SET entradas_realizadas=$1, saidas_realizadas=$2, saldo_final_real=$3,
           precisao=$4, status=$5, detalhes=$6, atualizado=NOW()
       WHERE id=$7 RETURNING *`,
      [b.entradasRealizadas||0, b.saidasRealizadas||0, b.saldoFinalReal||0,
       b.precisao||0, b.status, JSON.stringify(b.detalhes||[]), req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Não encontrado' } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

// ─── INVESTMENTS ─────────────────────────────────────────────────────────────

router.get('/investments', async (req, res) => {
  try {
    const { unitId } = req.query;
    const result = await db.query(
      `SELECT * FROM treasury_investments WHERE unit_id=$1 ORDER BY data_aplicacao DESC`,
      [unitId]
    );
    res.json(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.post('/investments', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `INSERT INTO treasury_investments
         (id, unit_id, nome, tipo, instituicao, data_aplicacao, data_vencimento,
          valor_aplicado, valor_atual, rentabilidade_anual, indexador, status, observacoes, rendimentos, criado, atualizado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW()) RETURNING *`,
      [randomUUID(), b.unitId||b.unit_id, b.nome, b.tipo, b.instituicao,
       b.dataAplicacao||b.data_aplicacao, b.dataVencimento||b.data_vencimento||null,
       b.valorAplicado||b.valor_aplicado, b.valorAtual||b.valor_atual||b.valorAplicado||0,
       b.rentabilidadeAnual||0, b.indexador||null, b.status||'ATIVO',
       b.observacoes||null, JSON.stringify(b.rendimentos||[])]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.put('/investments/:id', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `UPDATE treasury_investments
       SET nome=$1, valor_atual=$2, rentabilidade_anual=$3, status=$4,
           observacoes=$5, rendimentos=$6, atualizado=NOW()
       WHERE id=$7 RETURNING *`,
      [b.nome, b.valorAtual||b.valor_atual, b.rentabilidadeAnual||0,
       b.status, b.observacoes||null, JSON.stringify(b.rendimentos||[]), req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Não encontrado' } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.delete('/investments/:id', async (req, res) => {
  try {
    await db.query(`UPDATE treasury_investments SET status='RESGATADO', atualizado=NOW() WHERE id=$1`, [req.params.id]);
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

// ─── LOANS ───────────────────────────────────────────────────────────────────

router.get('/loans', async (req, res) => {
  try {
    const { unitId } = req.query;
    const result = await db.query(
      `SELECT * FROM treasury_loans WHERE unit_id=$1 ORDER BY data_contratacao DESC`,
      [unitId]
    );
    res.json(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.post('/loans', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `INSERT INTO treasury_loans
         (id, unit_id, nome, credor, data_contratacao, data_vencimento,
          valor_original, valor_saldo, taxa_juros, tipo_juros,
          total_parcelas, parcelas_pagas, status, parcelas, observacoes, criado, atualizado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW(),NOW()) RETURNING *`,
      [randomUUID(), b.unitId||b.unit_id, b.nome, b.credor,
       b.dataContratacao||b.data_contratacao, b.dataVencimento||b.data_vencimento,
       b.valorOriginal||b.valor_original, b.valorSaldo||b.valor_saldo||b.valorOriginal||0,
       b.taxaJuros||b.taxa_juros||0, b.tipoJuros||'MENSAL',
       b.totalParcelas||b.total_parcelas||1, b.parcelasPagas||0,
       b.status||'ATIVO', JSON.stringify(b.parcelas||[]), b.observacoes||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.put('/loans/:id', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `UPDATE treasury_loans
       SET valor_saldo=$1, parcelas_pagas=$2, status=$3, parcelas=$4, observacoes=$5, atualizado=NOW()
       WHERE id=$6 RETURNING *`,
      [b.valorSaldo||b.valor_saldo, b.parcelasPagas||0,
       b.status, JSON.stringify(b.parcelas||[]), b.observacoes||null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Não encontrado' } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

// ─── ALERTS ──────────────────────────────────────────────────────────────────

router.get('/alerts', async (req, res) => {
  try {
    const { unitId } = req.query;
    const result = await db.query(
      `SELECT * FROM treasury_alerts WHERE unit_id=$1 ORDER BY criado DESC`,
      [unitId]
    );
    res.json(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.post('/alerts', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `INSERT INTO treasury_alerts
         (id, unit_id, tipo, titulo, descricao, gravidade, conta_id, investimento_id,
          emprestimo_id, valor, data_limite, status, acoes_sugeridas, criado_por, criado, atualizado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW(),NOW()) RETURNING *`,
      [randomUUID(), b.unitId||b.unit_id, b.tipo, b.titulo, b.descricao, b.gravidade,
       uuidOrNull(b.contaId||b.conta_id), uuidOrNull(b.investimentoId||b.investimento_id),
       uuidOrNull(b.emprestimoId||b.emprestimo_id), b.valor||null, b.dataLimite||null,
       b.status||'ATIVO', JSON.stringify(b.acoesSugeridas||[]), b.createdBy||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.patch('/alerts/:id/status', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE treasury_alerts SET status=$1, atualizado=NOW() WHERE id=$2 RETURNING *`,
      [req.body.status, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Não encontrado' } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

// ─── FINANCIAL POSITIONS ─────────────────────────────────────────────────────

router.get('/positions', async (req, res) => {
  try {
    const { unitId } = req.query;
    const result = await db.query(
      `SELECT * FROM treasury_financial_positions WHERE unit_id=$1 ORDER BY data DESC LIMIT 12`,
      [unitId]
    );
    res.json(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.post('/positions', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `INSERT INTO treasury_financial_positions
         (id, unit_id, data, ativo_total, passivo_total, patrimonio_liquido,
          disponibilidades, aplicacoes, contas_receber, estoques, ativo_fixo,
          fornecedores, emprestimos, outras_contas, variacao_patrimonial,
          variacao_percentual, indicadores, detalhamento, criado_por, criado, atualizado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,NOW(),NOW()) RETURNING *`,
      [randomUUID(), b.unitId||b.unit_id, b.data||new Date().toISOString().split('T')[0],
       b.ativoTotal||0, b.passivoTotal||0, b.patrimonioLiquido||0,
       b.disponibilidades||0, b.aplicacoes||0, b.contasReceber||0,
       b.estoques||0, b.ativoFixo||0, b.fornecedores||0,
       b.emprestimos||0, b.outrasContas||0, b.variacaoPatrimonial||0,
       b.variacaoPercentual||0, JSON.stringify(b.indicadores||{}),
       JSON.stringify(b.detalhamento||[]), b.createdBy||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

export default router;
