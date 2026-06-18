/**
 * FORNECEDORES.TS — Alinhado ao schema PT-BR
 * Tabela: fornecedores
 */

import { Router } from 'express';
import Database from '../database';
import { randomUUID } from 'crypto';

const router = Router();
const db = Database.getInstance();

const normalizarFornecedor = (payload: any): Record<string, any> => ({
  id_unidade:    payload.id_unidade    || payload.idUnidade    || null,
  nome:          payload.nome          || payload.name         || '',
  cnpj_cpf:      payload.cnpj_cpf      || payload.cnpjCpf      || payload.cnpj || payload.cpf || null,
  tipo_pessoa:   payload.tipo_pessoa   || payload.tipoPessoa   || 'JURIDICA',
  email:         payload.email         || null,
  telefone:      payload.telefone      || payload.phone        || null,
  observacoes:   payload.observacoes   || payload.observations || null,
  ativo:         payload.ativo === undefined ? true : payload.ativo,
});

const mapearFornecedor = (row: any) => ({
  id:            row.id_fornecedor,
  idFornecedor:  row.id_fornecedor,
  idUnidade:     row.id_unidade,
  nome:          row.nome,
  cnpjCpf:       row.cnpj_cpf,
  tipoPessoa:    row.tipo_pessoa,
  email:         row.email || '',
  telefone:      row.telefone || '',
  observacoes:   row.observacoes || '',
  ativo:         row.ativo ?? true,
  criadoEm:      row.criado_em,
  atualizadoEm:  row.atualizado_em,
});

// GET /fornecedores
router.get('/', async (req, res) => {
  try {
    const { idUnidade, busca, pagina = '1', limite = '500' } = req.query;
    const params: any[] = [];
    let i = 1;
    let where = 'WHERE 1=1';

    if (idUnidade) { where += ` AND id_unidade = $${i++}`; params.push(idUnidade); }
    if (busca)     { where += ` AND nome ILIKE $${i++}`;   params.push(`%${busca}%`); }

    const lim = parseInt(limite as string);
    const off = (parseInt(pagina as string) - 1) * lim;
    params.push(lim, off);

    const result = await db.query(
      `SELECT * FROM fornecedores ${where} ORDER BY nome ASC LIMIT $${i++} OFFSET $${i++}`,
      params
    );
    res.json(result.rows.map(mapearFornecedor));
  } catch (error: any) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// GET /fornecedores/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM fornecedores WHERE id_fornecedor = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Fornecedor não encontrado', status: 404 } });
    res.json(mapearFornecedor(result.rows[0]));
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /fornecedores
router.post('/', async (req, res) => {
  try {
    const dados = normalizarFornecedor(req.body);

    if (!dados.nome) {
      return res.status(400).json({ error: { message: 'Nome é obrigatório', status: 400 } });
    }

    const id = randomUUID();
    const campos = Object.keys(dados);
    const valores = Object.values(dados);
    const placeholders = campos.map((_, idx) => `$${idx + 2}`).join(', ');

    const result = await db.query(
      `INSERT INTO fornecedores (id_fornecedor, ${campos.join(', ')})
       VALUES ($1, ${placeholders})
       RETURNING *`,
      [id, ...valores]
    );
    res.status(201).json(mapearFornecedor(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao criar fornecedor:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PUT /fornecedores/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dados = normalizarFornecedor(req.body);
    const campos = Object.keys(dados);
    const valores = Object.values(dados);
    const setClause = campos.map((f, idx) => `${f} = $${idx + 1}`).join(', ');

    const result = await db.query(
      `UPDATE fornecedores SET ${setClause}, atualizado_em = CURRENT_TIMESTAMP
       WHERE id_fornecedor = $${campos.length + 1} RETURNING *`,
      [...valores, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Fornecedor não encontrado', status: 404 } });
    res.json(mapearFornecedor(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// DELETE /fornecedores/:id (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE fornecedores SET ativo = false, atualizado_em = CURRENT_TIMESTAMP
       WHERE id_fornecedor = $1 RETURNING id_fornecedor`,
      [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Fornecedor não encontrado', status: 404 } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
