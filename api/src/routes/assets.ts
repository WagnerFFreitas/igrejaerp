/**
 * ============================================================================
 * ASSETS.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para assets.
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
 * Define o bloco principal deste arquivo (assets).
 */

const router = Router();
const db = Database.getInstance();

const UNIT_ALIASES: Record<string, string> = {
  'u-sede':  '00000000-0000-0000-0000-000000000001',
  'u-matriz':'00000000-0000-0000-0000-000000000001',
};
const normalizeUnitId = (id: any) => (id && UNIT_ALIASES[id]) ? UNIT_ALIASES[id] : id;

const mapAssetRow = (row: any) => ({
  id: row.id,
  unidadeId: row.unit_id,
  nome: row.nome,
  descricao: row.descricao,
  categoria: row.categoria,
  dataAquisicao: row.data_aquisicao,
  valorAquisicao: parseFloat(row.valor_aquisicao) || 0,
  valorAtual: parseFloat(row.valor_atual) || 0,
  taxaDepreciacao: parseFloat(row.taxa_depreciacao) || 0,
  metodoDepreciacao: row.metodo_depreciacao || 'LINEAR',
  valorContabilAtual: parseFloat(row.valor_contabil_atual) || 0,
  depreciacaoAcumulada: parseFloat(row.depreciacao_acumulada) || 0,
  vidaUtilMeses: row.vida_util_meses || 0,
  localizacao: row.localizacao || '',
  endereco: {
    cep:           row.cep            || '',
    logradouro:    row.logradouro     || '',
    numero:        row.numero         || '',
    complemento:   row.complemento     || '',
    bairro:        row.bairro          || '',
    cidade:        row.cidade          || '',
    estado:        row.estado          || '',
  },
  situacao: row.situacao || 'ATIVO',
  condicao: row.condicao || 'BOM',
  numeroAtivo: row.numero_ativo || '',
  numeroSerie: row.numero_serie || '',
  notaFiscalAquisicao: row.nota_fiscal_aquisicao || '',
  notasManutencao: row.notas_manutencao || '',
  funcionarioResponsavelId: row.funcionario_responsavel_id || '',
  criadoEm: row.criado,
  atualizadoEm: row.atualizado,
});

const normalizeAssetPayload = (payload: any) => {
  // Mapeia categorias do frontend para os valores aceitos pelo banco
  const categoryMap: Record<string, string> = {
    'COMPUTADORES': 'TECNOLOGIA',
    'MAQUINAS':     'OUTROS',
    'MOVEIS':       'MOBILIARIO',
  };
  const rawCategory = payload.category || 'OUTROS';
  const category = categoryMap[rawCategory] || rawCategory;

  // Mapeia condition
  const conditionMap: Record<string, string> = {
    'NOVO':   'OTIMO',
    'SUCATA': 'RUIM',
  };
  const rawCondition = payload.condition || 'BOM';
  const condition = conditionMap[rawCondition] || rawCondition;

  return {
    unit_id:                 normalizeUnitId(payload.unidadeId || payload.unitId || payload.unit_id),
    nome:                    payload.nome || payload.name,
    descricao:               payload.descricao || payload.description || null,
    categoria:               category,
    data_aquisicao:          payload.dataAquisicao || payload.data_aquisicao || payload.acquisitionDate || null,
    valor_aquisicao:        payload.valorAquisicao ?? payload.valor_aquisicao ?? payload.acquisitionValue ?? 0,
    valor_atual:             payload.valorAtual ?? payload.valor_atual ?? payload.currentValue ?? payload.acquisitionValue ?? 0,
    taxa_depreciacao:        payload.taxaDepreciacao ?? payload.taxa_depreciacao ?? payload.depreciationRate ?? 0,
    metodo_depreciacao:      ['LINEAR','DECLINING'].includes(payload.metodoDepreciacao || payload.metodo_depreciacao || payload.depreciationMethod) ? (payload.metodoDepreciacao || payload.metodo_depreciacao) : 'LINEAR',
    valor_contabil_atual:    payload.valorContabilAtual ?? payload.valor_contabil_atual ?? payload.currentBookValue ?? payload.acquisitionValue ?? 0,
    depreciacao_acumulada:   payload.depreciacaoAcumulada ?? payload.depreciacao_acumulada ?? payload.accumulatedDepreciation ?? 0,
    vida_util_meses:        payload.vidaUtilMeses ?? payload.vida_util_meses ?? payload.usefulLifeMonths ?? 0,
    localizacao:            payload.localizacao || payload.location || null,
    cep:                    payload.endereco?.cep || payload.cep || payload.address?.zipCode || null,
    logradouro:             payload.endereco?.logradouro || payload.logradouro || payload.address?.street || null,
    numero:                 payload.endereco?.numero || payload.numero || payload.address?.number || null,
    complemento:            payload.endereco?.complemento || payload.complemento || payload.address?.complement || null,
    bairro:                 payload.endereco?.bairro || payload.bairro || payload.address?.neighborhood || null,
    cidade:                 payload.endereco?.cidade || payload.cidade || payload.address?.city || null,
    estado:                 payload.endereco?.estado || payload.estado || payload.address?.state || null,
    situacao:              ['ATIVO','INATIVO','MANUTENCAO','BAIXADO'].includes(payload.situacao) ? payload.situacao : 'ATIVO',
    condicao:              condition,
    numero_ativo:           payload.numeroAtivo || payload.numero_ativo || payload.assetNumber || null,
    numero_serie:           payload.numeroSerie || payload.numero_serie || payload.serialNumber || null,
    funcionario_responsavel_id: payload.funcionarioResponsavelId || payload.funcionario_responsavel_id || payload.responsible || null,
    nota_fiscal_aquisicao: payload.notaFiscalAquisicao || payload.nota_fiscal_aquisicao || payload.invoiceNumber || null,
    validade_garantia:     payload.validadeGarantia || payload.validade_garantia || payload.warrantyExpiry || null,
    notas_manutencao:      payload.notasManutencao || payload.notas_manutencao || payload.observations || null,
  };
};

// GET /assets
router.get('/', async (req, res) => {
  try {
    const { unidadeId, categoria, situacao } = req.query;
    let query = 'SELECT * FROM assets WHERE 1=1';
    const params: any[] = [];
    let i = 1;

    if (unidadeId) { query += ` AND unit_id = $${i++}`; params.push(normalizeUnitId(unidadeId)); }
    if (categoria) { query += ` AND categoria = $${i++}`; params.push(categoria); }
    if (situacao) { query += ` AND situacao = $${i++}`; params.push(situacao); }
    query += ' ORDER BY nome';

    const result = await db.query(query, params);
    res.json(result.rows.map(mapAssetRow));
  } catch (error: any) {
    console.error('Erro ao buscar bens:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// GET /assets/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM assets WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Bem não encontrado' } });
    res.json(mapAssetRow(result.rows[0]));
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /assets
router.post('/', async (req, res) => {
  try {
    const normalized = normalizeAssetPayload(req.body);

    // Gerar número de patrimônio automático se não informado
    if (!normalized.asset_number) {
      const countResult = await db.query(
        'SELECT COUNT(*) as total FROM assets WHERE unit_id = $1',
        [normalized.unit_id]
      );
      const seq = (parseInt(countResult.rows[0].total) + 1).toString().padStart(2, '0');
      const year = new Date().getFullYear();
      normalized.asset_number = `PAT${seq}/${year}`;
    }

    const data: Record<string, any> = { id: randomUUID(), ...normalized };
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(', ');

    const result = await db.query(
      `INSERT INTO assets (${fields.join(', ')}, criado, atualizado)
       VALUES (${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *`,
      values
    );
    res.status(201).json(mapAssetRow(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao criar bem:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PUT /assets/:id
router.put('/:id', async (req, res) => {
  try {
    const data = normalizeAssetPayload(req.body);
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((f, idx) => `${f} = $${idx + 1}`).join(', ');

    const result = await db.query(
      `UPDATE assets SET ${setClause}, atualizado = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Bem não encontrado' } });
    res.json(mapAssetRow(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao atualizar bem:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// DELETE /assets/:id (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    await db.query(`UPDATE assets SET status = 'BAIXADO', atualizado = CURRENT_TIMESTAMP WHERE id = $1`, [req.params.id]);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// ─── DEPRECIAÇÃO ─────────────────────────────────────────────────────────────

// POST /assets/:id/depreciate — calcula e salva depreciação do mês atual
router.post('/:id/depreciate', async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await db.query('SELECT * FROM assets WHERE id = $1', [id]);
    if (!asset.rows.length) return res.status(404).json({ error: { message: 'Bem não encontrado' } });

    const a = asset.rows[0];
    const rate = parseFloat(a.depreciation_rate) || 0;
    const value = parseFloat(a.acquisition_value) || 0;
    const monthlyRate = rate / 100 / 12;
    const monthlyDepreciation = value * monthlyRate;
    const newAccumulated = parseFloat(a.accumulated_depreciation || 0) + monthlyDepreciation;
    const newBookValue = Math.max(0, value - newAccumulated);

    await db.query(
      `UPDATE assets SET accumulated_depreciation = $1, current_book_value = $2, current_value = $3, atualizado = CURRENT_TIMESTAMP WHERE id = $4`,
      [newAccumulated, newBookValue, newBookValue, id]
    );

    res.json({
      id,
      monthlyDepreciation,
      accumulatedDepreciation: newAccumulated,
      currentBookValue: newBookValue,
    });
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// ─── INVENTÁRIO ───────────────────────────────────────────────────────────────

// GET /assets/inventory — lista contagens de inventário
router.get('/inventory/counts', async (req, res) => {
  try {
    const { unitId } = req.query;
    const result = await db.query(
      `SELECT ic.*, COUNT(ii.id) as items_count
       FROM inventory_counts ic
       LEFT JOIN inventory_items ii ON ii.inventory_count_id = ic.id
       WHERE ic.unit_id = $1
       GROUP BY ic.id ORDER BY ic.started_at DESC`,
      [normalizeUnitId(unitId)]
    );
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /assets/inventory — inicia nova contagem
router.post('/inventory/counts', async (req, res) => {
  try {
    const { unitId, countedBy } = req.body;
    const uid = normalizeUnitId(unitId);
    // Buscar todos os bens ativos da unidade
    const assets = await db.query(
      `SELECT id, nome, categoria FROM assets WHERE unit_id = $1 AND situacao = 'ATIVO'`,
      [uid]
    );
    const countId = require('crypto').randomUUID();
    await db.query(
      `INSERT INTO inventory_counts (id, unit_id, count_date, counted_by, status, total_assets, total_expected, started_at)
       VALUES ($1, $2, CURRENT_DATE, $3, 'EM_ANDAMENTO', $4, $4, CURRENT_TIMESTAMP)`,
      [countId, uid, countedBy || 'Sistema', assets.rows.length]
    );
    // Criar itens para cada bem
    for (const asset of assets.rows) {
      await db.query(
        `INSERT INTO inventory_items (id, inventory_count_id, asset_id, asset_name, category, expected_quantity, counted_quantity, difference, condition, criado)
         VALUES ($1, $2, $3, $4, $5, 1, 0, -1, 'BOM', CURRENT_TIMESTAMP)`,
        [require('crypto').randomUUID(), countId, asset.id, asset.name, asset.category]
      );
    }
    res.status(201).json({ id: countId, totalAssets: assets.rows.length });
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// GET /assets/inventory/:countId/items
router.get('/inventory/:countId/items', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT ii.*, a.asset_number FROM inventory_items ii
       LEFT JOIN assets a ON a.id = ii.asset_id
       WHERE ii.inventory_count_id = $1 ORDER BY ii.asset_name`,
      [req.params.countId]
    );
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PATCH /assets/inventory/items/:itemId — confirmar item no inventário
router.patch('/inventory/items/:itemId', async (req, res) => {
  try {
    const { countedQuantity, condition, observations } = req.body;
    const diff = (countedQuantity || 0) - 1;
    await db.query(
      `UPDATE inventory_items SET counted_quantity=$1, difference=$2, condition=$3, observations=$4 WHERE id=$5`,
      [countedQuantity || 0, diff, condition || 'BOM', observations || null, req.params.itemId]
    );
    // Atualizar totais da contagem
    const item = await db.query('SELECT inventory_count_id FROM inventory_items WHERE id=$1', [req.params.itemId]);
    if (item.rows.length) {
      const countId = item.rows[0].inventory_count_id;
      const stats = await db.query(
        `SELECT COUNT(*) as total, SUM(CASE WHEN counted_quantity > 0 THEN 1 ELSE 0 END) as found
         FROM inventory_items WHERE inventory_count_id=$1`,
        [countId]
      );
      const { total, found } = stats.rows[0];
      const pct = total > 0 ? (found / total * 100).toFixed(1) : 0;
      await db.query(
        `UPDATE inventory_counts SET total_found=$1, completion_percentage=$2, atualizado=CURRENT_TIMESTAMP WHERE id=$3`,
        [found, pct, countId]
      );
    }
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PATCH /assets/inventory/counts/:countId/close — finalizar contagem
router.patch('/inventory/counts/:countId/close', async (req, res) => {
  try {
    await db.query(
      `UPDATE inventory_counts SET status='CONCLUIDO', completed_at=CURRENT_TIMESTAMP, atualizado=CURRENT_TIMESTAMP WHERE id=$1`,
      [req.params.countId]
    );
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
