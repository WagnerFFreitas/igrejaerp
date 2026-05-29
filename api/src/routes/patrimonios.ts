/**
 * ASSETS.TS — Alinhado ao schema PT-BR
 * Tabelas: patrimonios, contagens_inventario, itens_inventario, ajustes_inventario
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

const CATEGORIAS_VALIDAS = ['IMOVEIS', 'VEICULOS', 'EQUIPAMENTOS', 'MOVEIS', 'COMPUTADORES', 'MAQUINAS'];
const SITUACOES_VALIDAS  = ['ATIVO', 'MANUTENCAO', 'OCIOSO', 'BAIXADO', 'SUCATA'];

const normalizarPatrimonio = (payload: any) => {
  const catMap: Record<string, string> = {
    COMPUTADORES: 'COMPUTADORES',
    MAQUINAS:     'MAQUINAS',
    MOVEIS:       'MOVEIS',
    FURNITURE:    'MOVEIS',
    TECHNOLOGY:   'COMPUTADORES',
    EQUIPMENT:    'EQUIPAMENTOS',
    VEHICLES:     'VEICULOS',
    REAL_ESTATE:  'IMOVEIS',
  };
  const rawCat = (payload.categoria || payload.category || 'EQUIPAMENTOS').toUpperCase();
  const categoria = CATEGORIAS_VALIDAS.includes(rawCat) ? rawCat : (catMap[rawCat] || 'EQUIPAMENTOS');

  const rawSit = (payload.situacao || payload.status || 'ATIVO').toUpperCase();
  const situacao = SITUACOES_VALIDAS.includes(rawSit) ? rawSit : 'ATIVO';

  return {
    id_unidade:            payload.id_unidade || payload.idUnidade || null,
    nome:                  payload.nome || payload.name,
    descricao:             payload.descricao || payload.description || null,
    categoria,
    data_aquisicao:        toIsoDate(payload.data_aquisicao || payload.dataAquisicao || payload.acquisitionDate),
    valor_aquisicao:       parseFloat(payload.valor_aquisicao ?? payload.valorAquisicao ?? payload.acquisitionValue ?? 0) || 0,
    situacao,
    depreciacao_acumulada: parseFloat(payload.depreciacao_acumulada ?? payload.depreciacaoAcumulada ?? 0) || 0,
  };
};

const mapearPatrimonio = (row: any) => ({
  id:                   row.id,
  idUnidade:            row.id_unidade,
  nome:                 row.nome,
  descricao:            row.descricao,
  categoria:            row.categoria,
  dataAquisicao:        row.data_aquisicao,
  valorAquisicao:       parseFloat(row.valor_aquisicao) || 0,
  situacao:             row.situacao,
  depreciacaoAcumulada: parseFloat(row.depreciacao_acumulada) || 0,
  criadoEm:             row.criado_em,
  atualizadoEm:         row.atualizado_em,
});

// ─── PATRIMÔNIOS ─────────────────────────────────────────────────────────────

// GET /patrimonios
router.get('/', async (req, res) => {
  try {
    const { idUnidade, categoria, situacao } = req.query;
    let query = 'SELECT * FROM patrimonios WHERE 1=1';
    const params: any[] = [];
    let i = 1;

    if (idUnidade) { query += ` AND id_unidade = $${i++}`;  params.push(idUnidade); }
    if (categoria) { query += ` AND categoria = $${i++}`;   params.push(categoria); }
    if (situacao)  { query += ` AND situacao = $${i++}`;    params.push(situacao); }
    query += ' ORDER BY nome';

    const result = await db.query(query, params);
    res.json(result.rows.map(mapearPatrimonio));
  } catch (error: any) {
    console.error('Erro ao buscar patrimônios:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// GET /patrimonios/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM patrimonios WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Patrimônio não encontrado', status: 404 } });
    res.json(mapearPatrimonio(result.rows[0]));
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /patrimonios
router.post('/', async (req, res) => {
  try {
    const dados = normalizarPatrimonio(req.body);
    const id = randomUUID();
    const campos = Object.keys(dados);
    const valores = Object.values(dados);
    const placeholders = campos.map((_, idx) => `$${idx + 2}`).join(', ');

    const result = await db.query(
      `INSERT INTO patrimonios (id, ${campos.join(', ')}) VALUES ($1, ${placeholders}) RETURNING *`,
      [id, ...valores]
    );
    res.status(201).json(mapearPatrimonio(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao criar patrimônio:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PUT /patrimonios/:id
router.put('/:id', async (req, res) => {
  try {
    const dados = normalizarPatrimonio(req.body);
    const campos = Object.keys(dados);
    const valores = Object.values(dados);
    const setClause = campos.map((f, idx) => `${f} = $${idx + 1}`).join(', ');

    const result = await db.query(
      `UPDATE patrimonios SET ${setClause}, atualizado_em=CURRENT_TIMESTAMP WHERE id=$${campos.length + 1} RETURNING *`,
      [...valores, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Patrimônio não encontrado', status: 404 } });
    res.json(mapearPatrimonio(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao atualizar patrimônio:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// DELETE /patrimonios/:id — soft delete
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      `UPDATE patrimonios SET situacao='BAIXADO', atualizado_em=CURRENT_TIMESTAMP WHERE id=$1`,
      [req.params.id]
    );
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// ─── INVENTÁRIO ───────────────────────────────────────────────────────────────

// GET /patrimonios/inventory/counts
router.get('/inventory/counts', async (req, res) => {
  try {
    const { idUnidade } = req.query;
    const result = await db.query(
      `SELECT ci.*, COUNT(ii.id) AS total_itens
       FROM contagens_inventario ci
       LEFT JOIN itens_inventario ii ON ii.id_contagem_estoque = ci.id
       WHERE ci.id_unidade = $1
       GROUP BY ci.id ORDER BY ci.iniciado DESC`,
      [idUnidade]
    );
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /patrimonios/inventory/counts — inicia nova contagem
router.post('/inventory/counts', async (req, res) => {
  try {
    const { idUnidade } = req.body;
    const patrimonios = await db.query(
      `SELECT id, nome, categoria FROM patrimonios WHERE id_unidade=$1 AND situacao='ATIVO'`,
      [idUnidade]
    );
    const contId = randomUUID();
    await db.query(
      `INSERT INTO contagens_inventario (id, id_unidade, data_contagem, situacao)
       VALUES ($1,$2,CURRENT_DATE,'EM_ANDAMENTO')`,
      [contId, idUnidade]
    );
    for (const p of patrimonios.rows) {
      await db.query(
        `INSERT INTO itens_inventario (id, id_contagem_estoque, id_patrimonio, quantidade_esperada, quantidade_contada, diferenca, condicao)
         VALUES ($1,$2,$3,1,0,-1,'BOM')`,
        [randomUUID(), contId, p.id]
      );
    }
    res.status(201).json({ id: contId, totalPatrimonios: patrimonios.rows.length });
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// GET /patrimonios/inventory/:contId/items
router.get('/inventory/:contId/items', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT ii.*, p.nome AS nome_patrimonio
       FROM itens_inventario ii
       LEFT JOIN patrimonios p ON p.id = ii.id_patrimonio
       WHERE ii.id_contagem_estoque=$1 ORDER BY p.nome`,
      [req.params.contId]
    );
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PATCH /patrimonios/inventory/items/:itemId
router.patch('/inventory/items/:itemId', async (req, res) => {
  try {
    const { quantidadeContada, condicao } = req.body;
    const qtd = quantidadeContada ?? req.body.counted_quantity ?? 0;
    const diff = qtd - 1;
    await db.query(
      `UPDATE itens_inventario SET quantidade_contada=$1, diferenca=$2, condicao=$3 WHERE id=$4`,
      [qtd, diff, condicao || 'BOM', req.params.itemId]
    );
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PATCH /patrimonios/inventory/counts/:contId/close
router.patch('/inventory/counts/:contId/close', async (req, res) => {
  try {
    await db.query(
      `UPDATE contagens_inventario SET situacao='CONCLUIDO', concluido=CURRENT_TIMESTAMP WHERE id=$1`,
      [req.params.contId]
    );
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
