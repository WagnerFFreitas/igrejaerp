/**
 * ============================================================================
 * RH.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para rh.
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
 * Define o bloco principal deste arquivo (rh).
 */

const router = Router();
const db = Database.getInstance();

// ─── AVALIAÇÕES DE DESEMPENHO ────────────────────────────────────────────────

router.get('/evaluations', async (req, res) => {
  try {
    const { unitId, employeeId } = req.query;
    let query = 'SELECT * FROM performance_evaluations WHERE 1=1';
    const params: any[] = [];
    let i = 1;
    if (unitId)     { query += ` AND unit_id = $${i++}`;     params.push(unitId); }
    if (employeeId) { query += ` AND funcionario_id = $${i++}`; params.push(employeeId); }
    query += ' ORDER BY data_avaliacao DESC';
    const result = await db.query(query, params);
    res.json(result.rows.map(r => ({
      ...r,
      unitId: r.unit_id,
      employeeId: r.funcionario_id,
      employeeName: r.nome_funcionario,
      evaluationDate: r.data_avaliacao,
      evaluationType: r.tipo_avaliacao,
      overallScore: parseFloat(r.overall_score) || 0,
      overallRating: r.overall_rating,
      competencies: r.competencies || [],
      goals: r.goals || [],
      evaluatedBy: r.evaluated_by,
      approvedBy: r.approved_by,
    })));
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.post('/evaluations', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `INSERT INTO performance_evaluations
         (id, unit_id, funcionario_id, nome_funcionario, data_avaliacao, tipo_avaliacao,
          overall_score, overall_rating, competencies, goals, strengths, improvements,
          action_plan, status, evaluated_by, criado, atualizado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW(),NOW()) RETURNING *`,
      [randomUUID(), b.unitId||b.unit_id, b.employeeId||b.funcionario_id,
       b.employeeName||b.nome_funcionario, b.evaluationDate||b.data_avaliacao||new Date().toISOString().split('T')[0],
       b.evaluationType||'ANNUAL', b.overallScore||0, b.overallRating||'SATISFACTORY',
       JSON.stringify(b.competencies||[]), JSON.stringify(b.goals||[]),
       b.strengths||null, b.improvements||null, b.actionPlan||null,
       b.status||'DRAFT', b.evaluatedBy||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.put('/evaluations/:id', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `UPDATE performance_evaluations
       SET overall_score=$1, overall_rating=$2, competencies=$3, goals=$4,
           strengths=$5, improvements=$6, action_plan=$7, status=$8, atualizado=NOW()
       WHERE id=$9 RETURNING *`,
      [b.overallScore||0, b.overallRating||'SATISFACTORY',
       JSON.stringify(b.competencies||[]), JSON.stringify(b.goals||[]),
       b.strengths||null, b.improvements||null, b.actionPlan||null,
       b.status||'DRAFT', req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Não encontrado' } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.delete('/evaluations/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM performance_evaluations WHERE id=$1', [req.params.id]);
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

// ─── PDI ─────────────────────────────────────────────────────────────────────

router.get('/pdi', async (req, res) => {
  try {
    const { unitId, employeeId } = req.query;
    let query = 'SELECT * FROM pdi_plans WHERE 1=1';
    const params: any[] = [];
    let i = 1;
    if (unitId)     { query += ` AND unit_id = $${i++}`;     params.push(unitId); }
    if (employeeId) { query += ` AND funcionario_id = $${i++}`; params.push(employeeId); }
    query += ' ORDER BY criado DESC';
    const result = await db.query(query, params);
    res.json(result.rows.map(r => ({
      ...r,
      unitId: r.unit_id,
      employeeId: r.funcionario_id,
      employeeName: r.nome_funcionario,
    })));
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.post('/pdi', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `INSERT INTO pdi_plans
         (id, unit_id, funcionario_id, nome_funcionario, meta, prazo, status, observacoes, criado_por, criado, atualizado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),NOW()) RETURNING *`,
      [randomUUID(), b.unitId||b.unit_id, b.employeeId||b.funcionario_id,
       b.employeeName||b.nome_funcionario, b.meta,
       b.prazo||null, b.status||'PENDENTE', b.observacoes||null, b.createdBy||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.put('/pdi/:id', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `UPDATE pdi_plans SET meta=$1, prazo=$2, status=$3, observacoes=$4, atualizado=NOW()
       WHERE id=$5 RETURNING *`,
      [b.meta, b.prazo||null, b.status, b.observacoes||null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Não encontrado' } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.delete('/pdi/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM pdi_plans WHERE id=$1', [req.params.id]);
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

// ─── AFASTAMENTOS ──────────────────────────────────────────────────────────

router.get('/leaves', async (req, res) => {
  try {
    const { unitId, employeeId } = req.query;
    let query = 'SELECT * FROM employee_leaves WHERE 1=1';
    const params: any[] = [];
    let i = 1;
    if (unitId)     { query += ` AND unit_id = $${i++}`;     params.push(unitId); }
    if (employeeId) { query += ` AND funcionario_id = $${i++}`; params.push(employeeId); }
    query += ' ORDER BY data_inicio DESC';
    const result = await db.query(query, params);
    res.json(result.rows.map(r => ({
      ...r,
      unitId: r.unit_id,
      employeeId: r.funcionario_id,
      employeeName: r.nome_funcionario,
      startDate: r.data_inicio,
      endDate: r.data_fim,
      doctorName: r.doctor_name,
      attachmentUrl: r.attachment_url,
    })));
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.post('/leaves', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `INSERT INTO employee_leaves
         (id, unit_id, funcionario_id, nome_funcionario, type, data_inicio, data_fim,
          cid10, doctor_name, crm, status, observations, attachment_url, criado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW()) RETURNING *`,
      [b.id || randomUUID(), b.unitId||b.unit_id, b.employeeId||b.funcionario_id,
       b.employeeName||b.nome_funcionario, b.type, b.startDate||b.data_inicio, b.endDate||b.data_fim,
       b.cid10||null, b.doctorName||b.doctor_name||null, b.crm||null,
       b.status||'SCHEDULED', b.observations||null, b.attachmentUrl||b.attachment_url||null]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.put('/leaves/:id', async (req, res) => {
  try {
    const b = req.body;
    const result = await db.query(
      `UPDATE employee_leaves
       SET type=$1, data_inicio=$2, data_fim=$3, cid10=$4, doctor_name=$5,
           crm=$6, status=$7, observations=$8, attachment_url=$9
       WHERE id=$10 RETURNING *`,
      [b.type, b.startDate||b.data_inicio, b.endDate||b.data_fim,
       b.cid10||null, b.doctorName||b.doctor_name||null, b.crm||null,
       b.status, b.observations||null, b.attachmentUrl||b.attachment_url||null, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Não encontrado' } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

router.delete('/leaves/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM employee_leaves WHERE id=$1', [req.params.id]);
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
});

export default router;
