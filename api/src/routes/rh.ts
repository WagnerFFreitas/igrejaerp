/**
 * RH.TS — Alinhado ao schema PT-BR
 * Tabela existente: afastamentos_funcionarios
 * Tabelas ainda não modeladas: avaliacoes_desempenho, planos_pdi
 * → retornam 501 até serem criadas
 */

import { Router } from 'express';
import Database from '../database';
import { randomUUID } from 'crypto';

const router = Router();
const db = Database.getInstance();

const TIPOS_AFASTAMENTO = ['FERIAS', 'MEDICO', 'MATERNIDADE', 'PATERNIDADE', 'MILITAR', 'CASAMENTO', 'LUTO', 'NAO_REMUNERADO'];
const SITUACOES_AFASTAMENTO = ['AGENDADO', 'ATIVO', 'CONCLUIDO', 'CANCELADO'];

const naoImplementado = (_req: any, res: any) =>
  res.status(501).json({
    error: {
      message: 'Funcionalidade ainda não modelada no schema atual.',
      status: 501,
    },
  });

const listaVazia = (_req: any, res: any) => res.json([]);

// ─── AFASTAMENTOS ─────────────────────────────────────────────────────────────

const listarAfastamentos = async (req: any, res: any) => {
  try {
    const { idUnidade, unitId, idFuncionario, employeeId } = req.query;
    let query = `
      SELECT af.*, p.nome AS nome_funcionario
      FROM afastamentos_funcionarios af
      JOIN funcionarios f ON f.id_funcionario = af.id_funcionario
      JOIN pessoas p ON p.id_pessoa = f.id_pessoa
      WHERE 1=1
    `;
    const params: any[] = [];
    let i = 1;

    const filtroUnidade = idUnidade || unitId;
    const filtroFuncionario = idFuncionario || employeeId;

    if (filtroUnidade)     { query += ` AND af.id_unidade = $${i++}`;     params.push(filtroUnidade); }
    if (filtroFuncionario) { query += ` AND af.id_funcionario = $${i++}`; params.push(filtroFuncionario); }
    query += ' ORDER BY af.data_inicio DESC';

    const result = await db.query(query, params);
    res.json(result.rows.map((r: any) => ({
      id:              r.id,
      idUnidade:       r.id_unidade,
      idFuncionario:   r.id_funcionario,
      nomeFuncionario: r.nome_funcionario,
      tipo:            r.tipo,
      dataInicio:      r.data_inicio,
      dataFinal:       r.data_final,
      situacao:        r.situacao,
      criadoEm:        r.criado_em,
      atualizadoEm:    r.atualizado_em,
    })));
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
};

const salvarAfastamento = async (req: any, res: any) => {
  try {
    const b = req.body;
    const tipo = TIPOS_AFASTAMENTO.includes((b.tipo || b.type || '').toUpperCase())
      ? (b.tipo || b.type).toUpperCase() : 'MEDICO';
    const situacao = SITUACOES_AFASTAMENTO.includes((b.situacao || b.status || '').toUpperCase())
      ? (b.situacao || b.status).toUpperCase() : 'AGENDADO';

    const result = await db.query(
      `INSERT INTO afastamentos_funcionarios
         (id, id_unidade, id_funcionario, tipo, data_inicio, data_final, situacao)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [
        randomUUID(),
        b.id_unidade || b.idUnidade,
        b.id_funcionario || b.idFuncionario || b.employeeId,
        tipo,
        b.data_inicio || b.dataInicio || b.startDate,
        b.data_final  || b.dataFinal  || b.endDate,
        situacao,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
};

const atualizarAfastamento = async (req: any, res: any) => {
  try {
    const b = req.body;
    const situacao = SITUACOES_AFASTAMENTO.includes((b.situacao || b.status || '').toUpperCase())
      ? (b.situacao || b.status).toUpperCase() : undefined;

    const result = await db.query(
      `UPDATE afastamentos_funcionarios
       SET data_inicio=$1, data_final=$2,
           situacao=COALESCE($3::situacao_afastamento, situacao),
           atualizado_em=CURRENT_TIMESTAMP
       WHERE id=$4 RETURNING *`,
      [
        b.data_inicio || b.dataInicio || b.startDate,
        b.data_final  || b.dataFinal  || b.endDate,
        situacao || null,
        req.params.id,
      ]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Afastamento não encontrado', status: 404 } });
    res.json(result.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
};

const excluirAfastamento = async (req: any, res: any) => {
  try {
    await db.query(
      `UPDATE afastamentos_funcionarios SET situacao='CANCELADO', atualizado_em=CURRENT_TIMESTAMP WHERE id=$1`,
      [req.params.id]
    );
    res.status(204).send();
  } catch (e: any) {
    res.status(500).json({ error: { message: e.message } });
  }
};

router.get('/', listarAfastamentos);
router.post('/', salvarAfastamento);
router.put('/:id', atualizarAfastamento);
router.delete('/:id', excluirAfastamento);

router.get('/leaves', listarAfastamentos);
router.post('/leaves', salvarAfastamento);
router.put('/leaves/:id', atualizarAfastamento);
router.delete('/leaves/:id', excluirAfastamento);

// ─── AVALIAÇÕES DE DESEMPENHO — não modeladas ainda ──────────────────────────
router.get('/evaluations',      listaVazia);
router.post('/evaluations',     naoImplementado);
router.put('/evaluations/:id',  naoImplementado);
router.delete('/evaluations/:id', naoImplementado);

// ─── PDI — não modelado ainda ────────────────────────────────────────────────
router.get('/pdi',      listaVazia);
router.post('/pdi',     naoImplementado);
router.put('/pdi/:id',  naoImplementado);
router.delete('/pdi/:id', naoImplementado);

export default router;
