/**
 * ============================================================================
 * EMPLOYEES.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para employees.
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
 * Define o bloco principal deste arquivo (employees).
 */

const router = Router();
const db = Database.getInstance();

// Colunas reais da tabela employees (excluindo id, criado, atualizado, created_by)
const ALLOWED_EMPLOYEE_FIELDS = new Set([
  'unit_id', 'nome', 'cpf', 'rg', 'ctps', 'ctps_serie', 'pis',
  'birth_date', 'sexo', 'estado_civil', 'blood_type', 'email', 'telefone', 'celular',
  'emergency_contact', 'naturalidade', 'escolaridade', 'raca_cor',
  'nome_mae', 'nome_pai', 'deficiencia', 'deficiencia_obs', 'avatar', 'observacoes_saude',
  'cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'address_country',
  'matricula', 'cargo', 'funcao', 'departamento', 'cbo',
  'data_admissao', 'data_demissao', 'tipo_contrato', 'regime_trabalho',
  'sindicato', 'convencao_coletiva', 'salario_base', 'tipo_salario',
  'forma_pagamento', 'dia_pagamento', 'jornada_trabalho', 'escala_trabalho',
  'horario_entrada', 'horario_saida', 'inicio_intervalo', 'fim_intervalo',
  'duracao_intervalo', 'segunda_a_sexta', 'sabado',
  'trabalha_feriados', 'controla_intervalo', 'horas_extras_autorizadas',
  'tipo_registro_ponto', 'tolerancia_ponto', 'codigo_horario',
  'banco', 'codigo_banco', 'agencia', 'conta', 'tipo_conta', 'titular', 'chave_pix',
  'vt_ativo', 'vt_valor_diario', 'vt_qtd_vales_dia', 'vale_transporte_total',
  'va_ativo', 'va_operadora', 'vale_alimentacao',
  'vr_ativo', 'vr_operadora', 'vale_refeicao',
  'ps_ativo', 'ps_operadora', 'ps_tipo_plano', 'ps_carteirinha',
  'plano_saude_colaborador', 'ps_dependentes_ativo', 'plano_saude_dependentes',
  'po_ativo', 'po_operadora', 'po_carteirinha', 'plano_odontologico',
  'auxilio_moradia', 'vale_farmacia', 'seguro_vida', 'auxilio_creche',
  'auxilio_educacao', 'gympass_plano',
  'titulo_eleitor', 'titulo_eleitor_zona', 'titulo_eleitor_secao', 'reservista',
  'cnh_numero', 'cnh_categoria', 'cnh_vencimento', 'aso_data',
  'esocial_categoria', 'esocial_matricula', 'esocial_natureza_atividade',
  'esocial_tipo_regime_prev', 'esocial_tipo_regime_trab', 'esocial_indicativo_admissao',
  'esocial_tipo_jornada', 'esocial_descricao_jornada', 'esocial_contrato_parcial',
  'esocial_teletrabalho', 'esocial_clausula_asseguratoria', 'esocial_sucessao_trab',
  'esocial_tipo_admissao', 'esocial_cnpj_anterior', 'esocial_matricula_anterior',
  'esocial_data_admissao_origem',
  'ativo', 'profile_data',
]);

// Converte payload camelCase/misto para snake_case das colunas reais
const normalizeEmployeePayload = (payload: any): Record<string, any> => {
  const result: Record<string, any> = {};

  const set = (col: string, val: any) => {
    if (!ALLOWED_EMPLOYEE_FIELDS.has(col)) return;
    if (val === undefined) return;
    result[col] = val === '' ? null : val;
  };

  set('unit_id',           payload.unit_id || payload.unitId);
  set('nome',              payload.nome || payload.employee_name || payload.employeeName || payload.name);
  set('cpf',               payload.cpf);
  set('rg',                payload.rg);
  set('ctps',              payload.ctps);
  set('ctps_serie',        payload.ctps_serie);
  set('pis',               payload.pis);
  set('birth_date',        payload.birth_date || payload.birthDate || null);
  set('sexo',              payload.sexo === 'F' ? 'F' : payload.sexo === 'O' ? 'O' : payload.sexo === 'M' ? 'M' : null);
  set('estado_civil',      ['SOLTEIRO','CASADO','DIVORCIADO','VIUVO'].includes(payload.estado_civil) ? payload.estado_civil : null);
  set('blood_type',        payload.blood_type || payload.bloodType || null);
  set('email',             payload.email);
  set('telefone',          payload.telefone || payload.phone);
  set('celular',           payload.celular || payload.whatsapp || payload.phone || payload.telefone);
  set('emergency_contact', payload.emergency_contact || payload.emergencyContact || null);
  set('naturalidade',      payload.naturalidade);
  set('escolaridade',      payload.escolaridade);
  set('raca_cor',          payload.raca_cor);
  set('nome_mae',          payload.nome_mae);
  set('nome_pai',          payload.nome_pai);
  set('deficiencia',       payload.deficiencia || payload.tipo_deficiencia || null);
  set('deficiencia_obs',   payload.deficiencia_obs);
  set('avatar',            payload.avatar);
  set('observacoes_saude', payload.observacoes_saude);
  // Endereço — colunas reais da tabela
  set('cep',                payload.cep || payload.address_zip_code || payload.address?.zipCode || null);
  set('logradouro',         payload.logradouro || payload.address_street || payload.address?.street || null);
  set('numero',             payload.numero || payload.address_number || payload.address?.number || null);
  set('complemento',        payload.complemento || payload.address_complement || payload.address?.complement || null);
  set('bairro',             payload.bairro || payload.address_neighborhood || payload.address?.neighborhood || null);
  set('cidade',             payload.cidade || payload.address_city || payload.address?.city || null);
  set('estado',             payload.estado || payload.address_state || payload.address?.state || null);
  set('address_country',     payload.address_country  || payload.address?.country  || 'Brasil');
  // Contrato
  set('matricula',         payload.matricula);
  set('cargo',             payload.cargo);
  set('funcao',            payload.funcao);
  set('departamento',      payload.departamento || payload.department);
  set('cbo',               payload.cbo);
  set('data_admissao',     payload.data_admissao || payload.admissionDate || null);
  set('data_demissao',     payload.data_demissao || null);
  set('tipo_contrato',     ['CLT','PJ','VOLUNTARIO','TEMPORARIO'].includes(payload.tipo_contrato) ? payload.tipo_contrato : null);
  set('regime_trabalho',   ['PRESENCIAL','HIBRIDO','REMOTO'].includes(payload.regime_trabalho || payload.regime) ? (payload.regime_trabalho || payload.regime) : null);
  set('sindicato',         payload.sindicato);
  set('convencao_coletiva',payload.convencao_coletiva);
  set('salario_base',      payload.salario_base ?? payload.salary ?? 0);
  set('tipo_salario',      ['MENSAL','HORISTA','COMISSIONADO'].includes(payload.tipo_salario) ? payload.tipo_salario : null);
  set('forma_pagamento',   ['TRANSFERENCIA','PIX','CHEQUE','DINHEIRO'].includes(payload.forma_pagamento) ? payload.forma_pagamento : null);
  set('dia_pagamento',     payload.dia_pagamento);
  set('jornada_trabalho',  payload.jornada_trabalho);
  set('escala_trabalho',   payload.escala_trabalho);
  set('horario_entrada',   payload.horario_entrada || null);
  set('horario_saida',     payload.horario_saida   || null);
  set('inicio_intervalo',  payload.inicio_intervalo || null);
  set('fim_intervalo',     payload.fim_intervalo    || null);
  set('duracao_intervalo', payload.duracao_intervalo || null);
  set('segunda_a_sexta',   payload.segunda_a_sexta);
  set('sabado',            payload.sabado);
  set('trabalha_feriados', Boolean(payload.trabalha_feriados));
  set('controla_intervalo',Boolean(payload.controla_intervalo));
  set('horas_extras_autorizadas', Boolean(payload.horas_extras_autorizadas));
  set('tipo_registro_ponto', payload.tipo_registro_ponto);
  set('tolerancia_ponto',  payload.tolerancia_ponto);
  set('codigo_horario',    payload.codigo_horario);
  // Dados bancários
  set('banco',             payload.banco);
  set('codigo_banco',      payload.codigo_banco);
  set('agencia',           payload.agencia);
  set('conta',             payload.conta);
  set('tipo_conta',        ['CORRENTE','POUPANCA'].includes(payload.tipo_conta) ? payload.tipo_conta : null);
  set('titular',           payload.titular);
  set('chave_pix',         payload.chave_pix);
  // Benefícios
  set('vt_ativo',          Boolean(payload.vt_ativo));
  set('vt_valor_diario',   payload.vt_valor_diario ?? 0);
  set('vt_qtd_vales_dia',  payload.vt_qtd_vales_dia ?? 0);
  set('vale_transporte_total', payload.vale_transporte_total ?? 0);
  set('va_ativo',          Boolean(payload.va_ativo));
  set('va_operadora',      payload.va_operadora);
  set('vale_alimentacao',  payload.vale_alimentacao ?? 0);
  set('vr_ativo',          Boolean(payload.vr_ativo));
  set('vr_operadora',      payload.vr_operadora);
  set('vale_refeicao',     payload.vale_refeicao ?? 0);
  set('ps_ativo',          Boolean(payload.ps_ativo));
  set('ps_operadora',      payload.ps_operadora);
  set('ps_tipo_plano',     payload.ps_tipo_plano);
  set('ps_carteirinha',    payload.ps_carteirinha);
  set('plano_saude_colaborador', payload.plano_saude_colaborador ?? 0);
  set('ps_dependentes_ativo', Boolean(payload.ps_dependentes_ativo));
  set('plano_saude_dependentes', payload.plano_saude_dependentes ?? 0);
  set('po_ativo',          Boolean(payload.po_ativo));
  set('po_operadora',      payload.po_operadora);
  set('po_carteirinha',    payload.po_carteirinha);
  set('plano_odontologico',payload.plano_odontologico ?? 0);
  set('auxilio_moradia',   payload.auxilio_moradia ?? 0);
  set('vale_farmacia',     payload.vale_farmacia ?? 0);
  set('seguro_vida',       payload.seguro_vida ?? 0);
  // Documentos
  set('titulo_eleitor',    payload.titulo_eleitor);
  set('titulo_eleitor_zona', payload.titulo_eleitor_zona);
  set('titulo_eleitor_secao', payload.titulo_eleitor_secao);
  set('reservista',        payload.reservista);
  set('cnh_numero',        payload.cnh_numero);
  set('cnh_categoria',     payload.cnh_categoria);
  set('cnh_vencimento',    payload.cnh_vencimento || null);
  set('aso_data',          payload.aso_data || null);
  // eSocial
  set('esocial_categoria', payload.esocial_categoria);
  set('esocial_matricula', payload.esocial_matricula);
  set('esocial_natureza_atividade', payload.esocial_natureza_atividade);
  set('esocial_tipo_regime_prev', payload.esocial_tipo_regime_prev);
  set('esocial_tipo_regime_trab', payload.esocial_tipo_regime_trab);
  set('esocial_indicativo_admissao', payload.esocial_indicativo_admissao);
  set('esocial_tipo_jornada', payload.esocial_tipo_jornada);
  set('esocial_descricao_jornada', payload.esocial_descricao_jornada);
  set('esocial_contrato_parcial', Boolean(payload.esocial_contrato_parcial));
  set('esocial_teletrabalho', Boolean(payload.esocial_teletrabalho));
  set('esocial_clausula_asseguratoria', Boolean(payload.esocial_clausula_asseguratoria));
  set('esocial_sucessao_trab', Boolean(payload.esocial_sucessao_trab));
  set('esocial_tipo_admissao', payload.esocial_tipo_admissao);
  set('esocial_cnpj_anterior', payload.esocial_cnpj_anterior);
  set('esocial_matricula_anterior', payload.esocial_matricula_anterior);
  set('esocial_data_admissao_origem', payload.esocial_data_admissao_origem || null);
  // Status e extras
  set('ativo',         payload.ativo ?? payload.status !== 'INACTIVE');
  set('profile_data',      payload.profile_data || {});

  return result;
};

const mapEmployeeRow = (row: any) => {
  const profile = row.profile_data || {};
  return {
    ...row,
    ...profile,
    id: row.id,
    unitId: row.unit_id,
    unit_id: row.unit_id,
    employeeName: row.nome,
    nome: row.nome,
    cpf: row.cpf,
    rg: row.rg,
    pis: row.pis,
    ctps: row.ctps,
    ctps_serie: row.ctps_serie,
    email: row.email,
    phone: row.telefone,
    celular: row.celular || profile.celular || row.telefone,
    telefone: row.telefone,
    cargo: row.cargo,
    funcao: row.funcao,
    department: row.departamento,
    departamento: row.departamento,
    salary: parseFloat(row.salario_base) || 0,
    salario_base: parseFloat(row.salario_base) || 0,
    admissionDate: row.data_admissao,
    data_admissao: row.data_admissao,
    data_demissao: row.data_demissao,
    birthDate: row.birth_date || profile.birthDate || '',
    sexo: row.sexo || profile.sexo || '',
    estado_civil: row.estado_civil || profile.estado_civil || '',
    blood_type: row.blood_type || profile.blood_type || '',
    emergency_contact: row.emergency_contact || profile.emergency_contact || '',
    naturalidade: row.naturalidade || '',
    escolaridade: row.escolaridade || '',
    raca_cor: row.raca_cor || '',
    nome_mae: row.nome_mae || '',
    nome_pai: row.nome_pai || '',
    tipo_deficiencia: row.deficiencia || profile.tipo_deficiencia || '',
    deficiencia_obs: row.deficiencia_obs || '',
    is_pcd: Boolean(row.deficiencia || profile.is_pcd),
    matricula: row.matricula,
    tipo_contrato: row.tipo_contrato,
    regime_trabalho: row.regime_trabalho || '',
    sindicato: row.sindicato || '',
    convencao_coletiva: row.convencao_coletiva || '',
    tipo_salario: row.tipo_salario || '',
    forma_pagamento: row.forma_pagamento || '',
    dia_pagamento: row.dia_pagamento || '',
    jornada_trabalho: row.jornada_trabalho || '',
    escala_trabalho: row.escala_trabalho || '',
    banco: row.banco || '',
    codigo_banco: row.codigo_banco || '',
    agencia: row.agencia || '',
    conta: row.conta || '',
    tipo_conta: row.tipo_conta || '',
    titular: row.titular || '',
    chave_pix: row.chave_pix || '',
    vt_ativo: Boolean(row.vt_ativo),
    vt_valor_diario: row.vt_valor_diario ?? 0,
    vt_qtd_vales_dia: row.vt_qtd_vales_dia ?? 0,
    vale_transporte_total: parseFloat(row.vale_transporte_total ?? 0) || 0,
    va_ativo: Boolean(row.va_ativo),
    va_operadora: row.va_operadora || '',
    vale_alimentacao: parseFloat(row.vale_alimentacao ?? 0) || 0,
    vr_ativo: Boolean(row.vr_ativo),
    vr_operadora: row.vr_operadora || '',
    vale_refeicao: parseFloat(row.vale_refeicao ?? 0) || 0,
    ps_ativo: Boolean(row.ps_ativo),
    plano_saude_colaborador: parseFloat(row.plano_saude_colaborador ?? 0) || 0,
    ps_dependentes_ativo: Boolean(row.ps_dependentes_ativo),
    plano_saude_dependentes: parseFloat(row.plano_saude_dependentes ?? 0) || 0,
    po_ativo: Boolean(row.po_ativo),
    plano_odontologico: parseFloat(row.plano_odontologico ?? 0) || 0,
    auxilio_moradia: parseFloat(row.auxilio_moradia ?? 0) || 0,
    vale_farmacia: parseFloat(row.vale_farmacia ?? 0) || 0,
    seguro_vida: parseFloat(row.seguro_vida ?? 0) || 0,
    titulo_eleitor: row.titulo_eleitor || '',
    reservista: row.reservista || '',
    cnh_numero: row.cnh_numero || '',
    cnh_categoria: row.cnh_categoria || '',
    cnh_vencimento: row.cnh_vencimento || '',
    aso_data: row.aso_data || '',
    status: row.ativo ? 'ACTIVE' : 'INACTIVE',
    avatar: row.avatar,
    address: {
      zipCode:      row.cep          || profile.address?.zipCode      || '',
      street:       row.logradouro   || profile.address?.street       || '',
      number:       row.numero       || profile.address?.number       || '',
      complement:   row.complemento  || profile.address?.complement   || '',
      neighborhood: row.bairro       || profile.address?.neighborhood || '',
      city:         row.cidade       || profile.address?.city         || '',
      state:        row.estado       || profile.address?.state        || '',
      country:      row.address_country       || profile.address?.country      || 'Brasil',
    },
    createdAt: row.criado,
    updatedAt: row.atualizado,
  };
};

// GET /employees — ordenado por matrícula numérica
router.get('/', async (req, res) => {
  try {
    const { unitId } = req.query;
    let query = 'SELECT * FROM employees';
    const params: any[] = [];

    if (unitId) {
      query += ' WHERE unit_id = $1';
      params.push(unitId);
    }

    // Ordenação: extrai número da matrícula para ordenar corretamente
    // F01/2026 → 1, F02/2026 → 2, 2024003 → 2024003
    query += `
      ORDER BY
        CASE
          WHEN matricula ~ '^F[0-9]+/[0-9]{4}$'
            THEN CAST(substring(matricula FROM 2 FOR position('/' IN matricula) - 2) AS INTEGER)
          WHEN matricula ~ '^[0-9]+$'
            THEN CAST(matricula AS INTEGER)
          ELSE 9999999
        END ASC,
        nome ASC
    `;

    const result = await db.query(query, params);
    res.json(result.rows.map(mapEmployeeRow));
  } catch (error: any) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /employees
router.post('/', async (req, res) => {
  try {
    const data: Record<string, any> = { id: randomUUID(), ...normalizeEmployeePayload(req.body) };
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');

    const result = await db.query(
      `INSERT INTO employees (${fields.join(', ')}, criado, atualizado)
       VALUES (${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      values
    );
    res.status(201).json(mapEmployeeRow(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao criar funcionário:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PUT /employees/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = normalizeEmployeePayload(req.body);
    const fields = Object.keys(data).filter(f => f !== 'id' && f !== 'criado');
    const values = fields.map(f => data[f]);
    const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');

    const result = await db.query(
      `UPDATE employees SET ${setClause}, atualizado = CURRENT_TIMESTAMP
       WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: { message: 'Funcionário não encontrado', status: 404 } });
    }
    res.json(mapEmployeeRow(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// DELETE /employees/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM employees WHERE id = $1 RETURNING id', [id]);
    if (!result.rows.length) {
      return res.status(404).json({ error: { message: 'Funcionário não encontrado', status: 404 } });
    }
    res.json({ message: 'Funcionário removido com sucesso' });
  } catch (error: any) {
    console.error('Erro ao remover funcionário:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
