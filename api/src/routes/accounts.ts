/**
 * ============================================================================
 * ACCOUNTS.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para accounts.
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
 * Define o bloco principal deste arquivo (accounts).
 */

const router = Router();
const db = Database.getInstance();

const UNIT_ALIASES: Record<string, string> = {
  'u-sede':  '00000000-0000-0000-0000-000000000001',
  'u-matriz':'00000000-0000-0000-0000-000000000001',
};
const normalizeAccountUnitId = (id: any) => (id && UNIT_ALIASES[id]) ? UNIT_ALIASES[id] : id;

const mapAccountRow = (row: any) => ({
  id: row.id,
  unidadeId: row.unit_id,
  nome: row.nome,
  tipo: row.tipo,
  saldoAtual: parseFloat(row.saldo_atual) || 0,
  saldoMinimo: row.saldo_minimo != null ? parseFloat(row.saldo_minimo) : null,
  situacao: row.situacao,
  codigoBanco: row.codigo_banco,
  numeroAgencia: row.numero_agencia,
  numeroConta: row.numero_conta,
  criadoEm: row.criado,
  atualizadoEm: row.atualizado,
});

// GET /accounts
router.get('/', async (req, res) => {
  try {
    const { unitId } = req.query;

    let query = `
      SELECT
        id, unit_id, nome, tipo,
        saldo_atual, saldo_minimo, situacao,
        codigo_banco, numero_agencia, numero_conta,
        criado, atualizado
      FROM financial_accounts
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    if (unitId) {
      query += ` AND unit_id = $${paramIndex++}`;
      params.push(unitId);
    }

    query += ` AND situacao != 'INACTIVE' ORDER BY nome ASC`;

    const result = await db.query(query, params);
    res.json(result.rows.map(mapAccountRow));
  } catch (error: any) {
    console.error('Erro ao buscar contas:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// GET /accounts/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT id, unit_id, nome, tipo, saldo_atual, saldo_minimo, situacao,
              codigo_banco, numero_agencia, numero_conta, criado, atualizado
       FROM financial_accounts WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Conta não encontrada', status: 404 } });
    }
    res.json(mapAccountRow(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao buscar conta:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /accounts
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const id = randomUUID();
    const unitId = normalizeAccountUnitId(body.unitId || body.unit_id);
    const name = body.name || body.nome;
    const type = body.type || body.tipo || 'CASH';
    const balance = body.currentBalance ?? body.saldo_atual ?? 0;
    const minBalance = body.minimumBalance ?? body.saldo_minimo ?? null;
    const status = body.status || body.situacao || 'ACTIVE';
    const bankCode = body.bankCode || body.bank_code || null;
    const agencyNumber = body.agencyNumber || body.agency_number || null;
    const accountNumber = body.accountNumber || body.account_number || null;

    // Salvar em financial_accounts (tabela principal da rota)
    const r1 = await db.query(
      `INSERT INTO financial_accounts
         (id, unit_id, nome, tipo, saldo_atual, saldo_minimo, situacao, codigo_banco, numero_agencia, numero_conta, criado, atualizado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [id, unitId, name, type, balance, minBalance, status, bankCode, agencyNumber, accountNumber]
    );

    // Sincronizar em accounts (tabela referenciada pela FK de transactions)
    await db.query(
      `INSERT INTO accounts (id, unit_id, nome_conta, tipo_conta, saldo_atual, esta_ativo, criado, atualizado)
       VALUES ($1,$2,$3,$4,$5,$6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET nome_conta=$3, saldo_atual=$5, atualizado=CURRENT_TIMESTAMP`,
      [id, unitId, name, type === 'CASH' ? 'CASH' : 'CHECKING', balance, status === 'ACTIVE']
    );

    res.status(201).json(mapAccountRow(r1.rows[0]));
  } catch (error: any) {
    console.error('Erro ao criar conta:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PUT /accounts/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const result = await db.query(
      `UPDATE financial_accounts
       SET nome = $1, tipo = $2, saldo_atual = $3, saldo_minimo = $4,
           situacao = $5, codigo_banco = $6, numero_agencia = $7, numero_conta = $8,
           atualizado = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        body.name || body.nome,
        body.type || body.tipo,
        body.currentBalance ?? body.saldo_atual,
        body.minimumBalance ?? body.saldo_minimo ?? null,
        body.status || body.situacao,
        body.bankCode || body.bank_code || null,
        body.agencyNumber || body.agency_number || null,
        body.accountNumber || body.account_number || null,
        id,
      ]
    );
    await db.query(
      `UPDATE accounts
       SET nome_conta = $1, tipo_conta = $2, saldo_atual = $3, esta_ativo = $4, atualizado = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [
        body.name || body.nome,
        (body.type || body.tipo) === 'CASH' ? 'CASH' : 'CHECKING',
        body.currentBalance ?? body.saldo_atual ?? 0,
        (body.status || body.situacao) === 'ACTIVE',
        id
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: { message: 'Conta não encontrada', status: 404 } });
    }
    res.json(mapAccountRow(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao atualizar conta:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// DELETE /accounts/:id (soft delete — marca como INACTIVE)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      `UPDATE financial_accounts SET situacao = 'INACTIVE', atualizado = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );
    await db.query(
      `UPDATE accounts SET esta_ativo = false, atualizado = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );
    res.status(204).send();
  } catch (error: any) {
    console.error('Erro ao desativar conta:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
