/**
 * PAYROLL.TS — Alinhado ao schema PT-BR
 * Tabelas: periodos_folha, folha_pagamento, calculos_folha
 * Referência: funcionarios (não funcionarios)
 */

import { Router, Request, Response } from 'express';
import Database from '../database';
import { randomUUID } from 'crypto';

const router = Router();
const db = Database.getInstance();

// ─── PERÍODOS DE FOLHA ────────────────────────────────────────────────────────

// GET /folha_pagamento/periods
router.get('/periods', async (req: Request, res: Response) => {
  try {
    const { idUnidade } = req.query;
    let query = 'SELECT * FROM periodos_folha WHERE 1=1';
    const params: any[] = [];

    if (idUnidade) {
      query += ' AND id_unidade = $1';
      params.push(idUnidade);
    }
    query += ' ORDER BY ano DESC, mes DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Erro ao buscar períodos de folha:', error);
    res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
  }
});

// POST /folha_pagamento/periods
router.post('/periods', async (req: Request, res: Response) => {
  try {
    const b = req.body;
    const mes       = b.mes       || b.month;
    const ano       = b.ano       || b.year;
    const situacao  = b.situacao  || b.status || 'ABERTO';
    const dataInicio = b.data_inicio || b.dataInicio || b.startDate;
    const dataFinal  = b.data_final  || b.dataFinal  || b.endDate;
    const idUnidade  = b.id_unidade  || b.idUnidade;
    const criadoPor  = b.criado_por  || b.criadoPor  || b.createdBy;

    if (!criadoPor) {
      return res.status(400).json({ error: { message: 'criado_por é obrigatório', status: 400 } });
    }

    const result = await db.query(
      `INSERT INTO periodos_folha (id, id_unidade, mes, ano, situacao, data_inicio, data_final, criado_por)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [randomUUID(), idUnidade, mes, ano, situacao, dataInicio, dataFinal, criadoPor]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Erro ao criar período de folha:', error);
    res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
  }
});

// ─── FOLHA DE PAGAMENTO ───────────────────────────────────────────────────────

// GET /folha_pagamento — lista folhas de pagamento
router.get('/', async (req: Request, res: Response) => {
  try {
    const { idUnidade, mes, ano } = req.query;
    let query = `
      SELECT fp.*, p.nome AS nome_funcionario
      FROM folha_pagamento fp
      JOIN funcionarios f ON f.id_funcionario = fp.id_funcionario
      JOIN pessoas p ON p.id_pessoa = f.id_pessoa
      WHERE 1=1
    `;
    const params: any[] = [];
    let i = 1;

    if (idUnidade) { query += ` AND fp.id_unidade = $${i++}`; params.push(idUnidade); }
    if (mes)       { query += ` AND fp.mes = $${i++}`;        params.push(mes); }
    if (ano)       { query += ` AND fp.ano = $${i++}`;        params.push(ano); }
    query += ' ORDER BY fp.ano DESC, fp.mes DESC, p.nome ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Erro ao buscar folhas:', error);
    res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
  }
});

// POST /folha_pagamento — cria folha de pagamento
router.post('/', async (req: Request, res: Response) => {
  try {
    const b = req.body;
    const result = await db.query(
      `INSERT INTO folha_pagamento
         (id, id_unidade, id_funcionario, mes, ano, data_referencia,
          salario_base, inss, irrf, fgts, salario_liquido, situacao)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [
        randomUUID(),
        b.id_unidade || b.idUnidade,
        b.id_funcionario || b.idFuncionario || b.employeeId,
        b.mes || b.month,
        b.ano || b.year,
        b.data_referencia || b.dataReferencia || b.referenceDate,
        b.salario_base || b.salarioBase || 0,
        b.inss || 0,
        b.irrf || 0,
        b.fgts || 0,
        b.salario_liquido || b.salarioLiquido || 0,
        b.situacao || b.status || 'PROCESSADO',
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Erro ao criar folha:', error);
    res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
  }
});

// ─── CÁLCULOS DE FOLHA ────────────────────────────────────────────────────────

// GET /folha_pagamento/calculations/:mesCompetencia
router.get('/calculations/:mesCompetencia', async (req: Request, res: Response) => {
  try {
    const { mesCompetencia } = req.params;
    const { idUnidade } = req.query;

    let query = `
      SELECT cf.*, p.nome AS nome_funcionario
      FROM calculos_folha cf
      JOIN funcionarios f ON f.id_funcionario = cf.id_funcionario
      JOIN pessoas p ON p.id_pessoa = f.id_pessoa
      WHERE cf.mes_competencia = $1
    `;
    const params: any[] = [mesCompetencia];

    if (idUnidade) {
      query += ' AND f.id_unidade = $2';
      params.push(idUnidade);
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Erro ao buscar cálculos de folha:', error);
    res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
  }
});

// POST /folha_pagamento/calculations — salva cálculo de folha
router.post('/calculations', async (req: Request, res: Response) => {
  try {
    const b = req.body;
    const idFuncionario = b.id_funcionario || b.idFuncionario || b.employeeId;
    const mesCompetencia = b.mes_competencia || b.mesCompetencia || b.competencyMonth;

    const result = await db.query(
      `INSERT INTO calculos_folha
         (id, id_funcionario, mes_competencia, salario_bruto,
          sindicato_taxa, farmacia, seguro_vida, inss, irrf, fgts, salario_liquido)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id_funcionario, mes_competencia)
       DO UPDATE SET
         salario_bruto=EXCLUDED.salario_bruto,
         inss=EXCLUDED.inss, irrf=EXCLUDED.irrf, fgts=EXCLUDED.fgts,
         salario_liquido=EXCLUDED.salario_liquido,
         atualizado_em=CURRENT_TIMESTAMP
       RETURNING *`,
      [
        randomUUID(),
        idFuncionario,
        mesCompetencia,
        b.salario_bruto || b.salarioBruto || b.grossSalary || 0,
        b.sindicato_taxa || b.sindicatoTaxa || 0,
        b.farmacia || 0,
        b.seguro_vida || b.seguroVida || 0,
        b.inss || 0,
        b.irrf || 0,
        b.fgts || 0,
        b.salario_liquido || b.salarioLiquido || b.netSalary || 0,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Erro ao salvar cálculo de folha:', error);
    res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
  }
});

export default router;
