/**
 * ============================================================================
 * EMPLOYEES.TS
 * ============================================================================
 *
 * Rotas de API para funcionários.
 * Alinhado ao schema PT-BR: tabelas `funcionarios` + `pessoas` + `unidades`.
 *
 * Padrão idêntico ao membersController:
 *   - Dados pessoais/contato/endereço → tabela `pessoas`
 *   - Dados de RH/contrato/banco      → tabela `funcionarios`
 *   - Vínculo com unidade             → `unidades`
 */

import { Router } from 'express';
import { randomUUID } from 'crypto';
import Database from '../database';

const router = Router();
const db = Database.getInstance();

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function toIsoDate(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value.slice(0, 10);
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

function boolFrom(value: any, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const t = value.trim().toLowerCase();
    if (['true', '1', 'sim', 's', 'yes', 'y'].includes(t)) return true;
    if (['false', '0', 'nao', 'não', 'n', 'no'].includes(t)) return false;
  }
  if (typeof value === 'number') return value !== 0;
  return fallback;
}

// Campos que pertencem à tabela `pessoas`
function buildPessoaData(body: Record<string, any>): Record<string, any> {
  const p: Record<string, any> = {};
  const set = (k: string, v: any) => { if (v !== undefined) p[k] = v === '' ? null : v; };

  set('id_unidade',        body.id_unidade || body.idUnidade || null);
  set('nome',              body.nome || body.employeeName || body.employee_name || body.name);
  set('cpf',               body.cpf);
  set('rg',                body.rg);
  set('data_nascimento',   toIsoDate(body.data_nascimento || body.data_nascimento || body.birthDate));
  set('sexo',              body.sexo);
  set('estado_civil',      body.estado_civil);
  set('email',             body.email);
  set('telefone',          body.telefone || body.phone);
  set('celular',           body.celular || body.whatsapp || body.phone || body.telefone);
  p.whatsapp = boolFrom(body.whatsapp_ativo ?? body.whatsappAtivo, false);
  set('logradouro',        body.logradouro || body.address_street);
  set('numero',            body.numero || body.address_number);
  set('complemento',       body.complemento || body.address_complement);
  set('bairro',            body.bairro || body.address_neighborhood);
  set('cidade',            body.cidade || body.address_city);
  set('estado',            body.estado || body.address_state);
  set('cep',               body.cep || body.address_zip_code);
  set('pais',              body.pais || body.pais || 'Brasil');
  set('tipo_sanguineo',    body.tipo_sanguineo || body.tipo_sanguineo || body.bloodType);
  set('contato_emergencia',body.contato_emergencia || body.contato_emergencia || body.emergencyContact);
  p.pcd = boolFrom(body.pcd ?? body.is_pcd, false);
  set('tipo_deficiencia',  body.tipo_deficiencia || body.deficiencia);
  p.ativo = body.ativo === undefined ? true : boolFrom(body.ativo, true);

  return p;
}

// Campos que pertencem à tabela `funcionarios`
function buildFuncionarioData(body: Record<string, any>, idPessoa: string): Record<string, any> {
  return {
    id_funcionario: body.id_funcionario || body.id || randomUUID(),
    id_pessoa:      idPessoa,
    id_unidade:     body.id_unidade || body.idUnidade || null,
    matricula:      body.matricula || null,
    cargo:          body.cargo || null,
    departamento:   body.departamento || body.department || null,
    data_admissao:  toIsoDate(body.data_admissao || body.admissionDate),
    data_demissao:  toIsoDate(body.data_demissao),
    regime_trabalho:['CLT', 'PRO_LABORE', 'ESTAGIO', 'AUTONOMO'].includes(body.regime_trabalho)
                      ? body.regime_trabalho : 'CLT',
    salario_base:   parseFloat(body.salario_base ?? body.salary ?? 0) || 0,
    banco:          body.banco || null,
    agencia:        body.agencia || null,
    conta:          body.conta || null,
    tipo_conta:     body.tipo_conta || null,
    chave_pix:      body.chave_pix || null,
    ativo:          body.ativo === undefined ? true : boolFrom(body.ativo, true),
  };
}

// Monta o objeto de resposta unificando `funcionarios` + `pessoas` + `unidades`
function mapRow(row: any) {
  return {
    // IDs
    id:              row.id_funcionario,
    id_funcionario:  row.id_funcionario,
    id_pessoa:       row.id_pessoa,
    id_unidade:      row.id_unidade,
    unit_name:       row.unit_name || null,

    // Dados pessoais (de `pessoas`)
    nome:            row.nome || '',
    employeeName:    row.nome || '',
    cpf:             row.cpf || '',
    rg:              row.rg || '',
    data_nascimento: row.data_nascimento ? toIsoDate(row.data_nascimento) : null,
    birthDate:       row.data_nascimento ? toIsoDate(row.data_nascimento) : null,
    sexo:            row.sexo || '',
    estado_civil:    row.estado_civil || '',
    email:           row.email || '',
    telefone:        row.telefone || '',
    phone:           row.telefone || '',
    celular:         row.celular || '',
    whatsapp_ativo:  boolFrom(row.whatsapp, false),
    tipo_sanguineo:  row.tipo_sanguineo || '',
    contato_emergencia: row.contato_emergencia || '',
    is_pcd:          boolFrom(row.pcd, false),
    tipo_deficiencia: row.tipo_deficiencia || '',

    // Endereço (de `pessoas`)
    logradouro:      row.logradouro || '',
    numero:          row.numero || '',
    complemento:     row.complemento || '',
    bairro:          row.bairro || '',
    cidade:          row.cidade || '',
    estado:          row.estado || '',
    cep:             row.cep || '',
    pais:            row.pais || 'Brasil',
    address: {
      street:       row.logradouro || '',
      number:       row.numero || '',
      complemento:   row.complemento || '',
      neighborhood: row.bairro || '',
      city:         row.cidade || '',
      state:        row.estado || '',
      zipCode:      row.cep || '',
      country:      row.pais || 'Brasil',
    },

    // Dados de RH (de `funcionarios`)
    matricula:       row.matricula || '',
    cargo:           row.cargo || '',
    departamento:    row.departamento || '',
    department:      row.departamento || '',
    data_admissao:   row.data_admissao ? toIsoDate(row.data_admissao) : null,
    admissionDate:   row.data_admissao ? toIsoDate(row.data_admissao) : null,
    data_demissao:   row.data_demissao ? toIsoDate(row.data_demissao) : null,
    regime_trabalho: row.regime_trabalho || 'CLT',
    salario_base:    parseFloat(row.salario_base) || 0,
    salary:          parseFloat(row.salario_base) || 0,

    // Dados bancários (de `funcionarios`)
    banco:           row.banco || '',
    agencia:         row.agencia || '',
    conta:           row.conta || '',
    tipo_conta:      row.tipo_conta || '',
    chave_pix:       row.chave_pix || '',

    // Status
    ativo:           boolFrom(row.ativo, true),
    status:          boolFrom(row.ativo, true) ? 'ACTIVE' : 'INACTIVE',

    // Timestamps
    createdAt:       row.criado_em,
    updatedAt:       row.atualizado_em,
  };
}

// Query base com JOIN
const BASE_QUERY = `
  SELECT
    f.id_funcionario,
    f.id_pessoa,
    f.id_unidade,
    f.matricula,
    f.cargo,
    f.departamento,
    f.data_admissao,
    f.data_demissao,
    f.regime_trabalho,
    f.salario_base,
    f.banco,
    f.agencia,
    f.conta,
    f.tipo_conta,
    f.chave_pix,
    f.ativo,
    f.criado_em,
    f.atualizado_em,
    p.nome,
    p.cpf,
    p.rg,
    p.data_nascimento,
    p.sexo,
    p.estado_civil,
    p.email,
    p.telefone,
    p.celular,
    p.whatsapp,
    p.logradouro,
    p.numero,
    p.complemento,
    p.bairro,
    p.cidade,
    p.estado,
    p.cep,
    p.pais,
    p.tipo_sanguineo,
    p.contato_emergencia,
    p.pcd,
    p.tipo_deficiencia,
    u.nome AS unit_name
  FROM funcionarios f
  JOIN pessoas p ON p.id_pessoa = f.id_pessoa
  LEFT JOIN unidades u ON u.id_unidade = f.id_unidade
`;

// ─── ROTAS ────────────────────────────────────────────────────────────────────

// GET /funcionarios
router.get('/', async (req, res) => {
  try {
    const { idUnidade } = req.query;
    let query = BASE_QUERY + ' WHERE 1=1';
    const params: any[] = [];
    let i = 1;

    if (idUnidade) {
      query += ` AND f.id_unidade = $${i++}`;
      params.push(idUnidade);
    }

    // Ordenação por matrícula numérica, depois por nome
    query += `
      ORDER BY
        CASE
          WHEN f.matricula ~ '^F[0-9]+/[0-9]{4}$'
            THEN CAST(substring(f.matricula FROM 2 FOR position('/' IN f.matricula) - 2) AS INTEGER)
          WHEN f.matricula ~ '^[0-9]+$'
            THEN CAST(f.matricula AS INTEGER)
          ELSE 9999999
        END ASC,
        p.nome ASC
    `;

    const result = await db.query(query, params);
    res.json(result.rows.map(mapRow));
  } catch (error: any) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// GET /funcionarios/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      BASE_QUERY + ' WHERE f.id_funcionario = $1',
      [id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: { message: 'Funcionário não encontrado', status: 404 } });
    }
    res.json(mapRow(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao buscar funcionário:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /funcionarios
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const pessoaData = buildPessoaData(body);

    if (!pessoaData.nome) {
      return res.status(400).json({ error: { message: 'Nome é obrigatório', status: 400 } });
    }

    // Verificar se unidade existe (quando informada)
    const idUnidade = body.id_unidade || body.idUnidade || null;
    if (idUnidade) {
      const unitCheck = await db.query('SELECT 1 FROM unidades WHERE id_unidade = $1', [idUnidade]);
      if (!unitCheck.rows.length) {
        return res.status(400).json({ error: { message: 'Unidade não encontrada', status: 400 } });
      }
    }

    // Verificar CPF duplicado
    if (pessoaData.cpf) {
      const cpfCheck = await db.query('SELECT 1 FROM pessoas WHERE cpf = $1', [pessoaData.cpf]);
      if (cpfCheck.rows.length) {
        return res.status(409).json({ error: { message: 'CPF já cadastrado', status: 409 } });
      }
    }

    // Inserir em `pessoas`
    const pessoaResult = await db.query<{ id_pessoa: string }>(
      `INSERT INTO pessoas (
        id_unidade, nome, cpf, rg, data_nascimento, sexo, estado_civil,
        email, telefone, celular, whatsapp,
        logradouro, numero, complemento, bairro, cidade, estado, cep, pais,
        tipo_sanguineo, contato_emergencia, pcd, tipo_deficiencia, ativo
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,
        $8,$9,$10,$11,
        $12,$13,$14,$15,$16,$17,$18,$19,
        $20,$21,$22,$23,$24
      ) RETURNING id_pessoa`,
      [
        pessoaData.id_unidade,
        pessoaData.nome,
        pessoaData.cpf || null,
        pessoaData.rg || null,
        pessoaData.data_nascimento || null,
        pessoaData.sexo || null,
        pessoaData.estado_civil || null,
        pessoaData.email || null,
        pessoaData.telefone || null,
        pessoaData.celular || null,
        pessoaData.whatsapp,
        pessoaData.logradouro || null,
        pessoaData.numero || null,
        pessoaData.complemento || null,
        pessoaData.bairro || null,
        pessoaData.cidade || null,
        pessoaData.estado || null,
        pessoaData.cep || null,
        pessoaData.pais || 'Brasil',
        pessoaData.tipo_sanguineo || null,
        pessoaData.contato_emergencia || null,
        pessoaData.pcd,
        pessoaData.tipo_deficiencia || null,
        pessoaData.ativo,
      ]
    );

    const idPessoa = pessoaResult.rows[0].id_pessoa;
    const funcData = buildFuncionarioData(body, idPessoa);

    // Inserir em `funcionarios`
    await db.query(
      `INSERT INTO funcionarios (
        id_funcionario, id_pessoa, id_unidade, matricula, cargo, departamento,
        data_admissao, data_demissao, regime_trabalho, salario_base,
        banco, agencia, conta, tipo_conta, chave_pix, ativo
      ) VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16
      )`,
      [
        funcData.id_funcionario,
        funcData.id_pessoa,
        funcData.id_unidade,
        funcData.matricula,
        funcData.cargo,
        funcData.departamento,
        funcData.data_admissao,
        funcData.data_demissao,
        funcData.regime_trabalho,
        funcData.salario_base,
        funcData.banco,
        funcData.agencia,
        funcData.conta,
        funcData.tipo_conta,
        funcData.chave_pix,
        funcData.ativo,
      ]
    );

    // Retornar registro completo com JOIN
    const joined = await db.query(
      BASE_QUERY + ' WHERE f.id_funcionario = $1',
      [funcData.id_funcionario]
    );

    return res.status(201).json(mapRow(joined.rows[0]));
  } catch (error: any) {
    console.error('Erro ao criar funcionário:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PUT /funcionarios/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    // Buscar registro atual
    const current = await db.query(
      `SELECT f.id_funcionario, f.id_pessoa, f.id_unidade
       FROM funcionarios f WHERE f.id_funcionario = $1`,
      [id]
    );
    if (!current.rows.length) {
      return res.status(404).json({ error: { message: 'Funcionário não encontrado', status: 404 } });
    }

    const { id_pessoa: idPessoa, id_unidade: currentUnitId } = current.rows[0];
    const nextUnitId = body.id_unidade || body.idUnidade || currentUnitId || null;

    // Verificar unidade
    if (nextUnitId) {
      const unitCheck = await db.query('SELECT 1 FROM unidades WHERE id_unidade = $1', [nextUnitId]);
      if (!unitCheck.rows.length) {
        return res.status(400).json({ error: { message: 'Unidade não encontrada', status: 400 } });
      }
    }

    // Verificar CPF duplicado (excluindo a própria pessoa)
    if (body.cpf) {
      const cpfCheck = await db.query(
        'SELECT 1 FROM pessoas WHERE cpf = $1 AND id_pessoa <> $2',
        [body.cpf, idPessoa]
      );
      if (cpfCheck.rows.length) {
        return res.status(409).json({ error: { message: 'CPF já cadastrado', status: 409 } });
      }
    }

    // Buscar dados atuais de pessoas para merge
    const pessoaAtual = await db.query('SELECT * FROM pessoas WHERE id_pessoa = $1', [idPessoa]);
    const pa = pessoaAtual.rows[0] || {};

    const pessoaData = buildPessoaData({ ...pa, ...body, id_unidade: nextUnitId });

    // Atualizar `pessoas`
    await db.query(
      `UPDATE pessoas SET
        id_unidade=$1, nome=$2, cpf=$3, rg=$4, data_nascimento=$5, sexo=$6, estado_civil=$7,
        email=$8, telefone=$9, celular=$10, whatsapp=$11,
        logradouro=$12, numero=$13, complemento=$14, bairro=$15, cidade=$16, estado=$17, cep=$18, pais=$19,
        tipo_sanguineo=$20, contato_emergencia=$21, pcd=$22, tipo_deficiencia=$23, ativo=$24,
        atualizado_em=CURRENT_TIMESTAMP
       WHERE id_pessoa=$25`,
      [
        pessoaData.id_unidade,
        pessoaData.nome,
        pessoaData.cpf || null,
        pessoaData.rg || null,
        pessoaData.data_nascimento || null,
        pessoaData.sexo || null,
        pessoaData.estado_civil || null,
        pessoaData.email || null,
        pessoaData.telefone || null,
        pessoaData.celular || null,
        pessoaData.whatsapp,
        pessoaData.logradouro || null,
        pessoaData.numero || null,
        pessoaData.complemento || null,
        pessoaData.bairro || null,
        pessoaData.cidade || null,
        pessoaData.estado || null,
        pessoaData.cep || null,
        pessoaData.pais || 'Brasil',
        pessoaData.tipo_sanguineo || null,
        pessoaData.contato_emergencia || null,
        pessoaData.pcd,
        pessoaData.tipo_deficiencia || null,
        pessoaData.ativo,
        idPessoa,
      ]
    );

    // Buscar dados atuais de funcionarios para merge
    const funcAtual = await db.query('SELECT * FROM funcionarios WHERE id_funcionario = $1', [id]);
    const fa = funcAtual.rows[0] || {};

    const funcData = buildFuncionarioData({ ...fa, ...body, id_unidade: nextUnitId }, idPessoa);

    // Atualizar `funcionarios`
    await db.query(
      `UPDATE funcionarios SET
        id_unidade=$1, matricula=$2, cargo=$3, departamento=$4,
        data_admissao=$5, data_demissao=$6, regime_trabalho=$7, salario_base=$8,
        banco=$9, agencia=$10, conta=$11, tipo_conta=$12, chave_pix=$13, ativo=$14,
        atualizado_em=CURRENT_TIMESTAMP
       WHERE id_funcionario=$15`,
      [
        funcData.id_unidade,
        funcData.matricula,
        funcData.cargo,
        funcData.departamento,
        funcData.data_admissao,
        funcData.data_demissao,
        funcData.regime_trabalho,
        funcData.salario_base,
        funcData.banco,
        funcData.agencia,
        funcData.conta,
        funcData.tipo_conta,
        funcData.chave_pix,
        funcData.ativo,
        id,
      ]
    );

    // Retornar registro atualizado
    const refreshed = await db.query(BASE_QUERY + ' WHERE f.id_funcionario = $1', [id]);
    return res.json(mapRow(refreshed.rows[0]));
  } catch (error: any) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// DELETE /funcionarios/:id  — soft delete (ativo = false)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `UPDATE funcionarios SET ativo = false, atualizado_em = CURRENT_TIMESTAMP
       WHERE id_funcionario = $1 RETURNING id_funcionario`,
      [id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: { message: 'Funcionário não encontrado', status: 404 } });
    }
    res.json({ message: 'Funcionário desativado com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover funcionário:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
