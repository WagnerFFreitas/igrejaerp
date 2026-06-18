/**
 * ============================================================================
 * MEMBERSCONTROLLER.TS
 * ============================================================================
 *
 * Controller para membros alinhado ao schema PostgreSQL em portugues.
 */

import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import Database from '../database';

const db = Database.getInstance();

type SituacaoBanco = 'ATIVO' | 'INATIVO' | 'PENDENTE' | 'SUSPENSO';
type SituacaoApi = 'ACTIVE' | 'INACTIVE' | 'PENDING';

const PESSOAS_FIELDS = new Set([
  'id_unidade',
  'nome',
  'cpf',
  'rg',
  'data_nascimento',
  'sexo',
  'estado_civil',
  'tipo_sanguineo',
  'contato_emergencia',
  'pcd',
  'tipo_deficiencia',
  'ativo'
]);

const ENDERECO_FIELDS = new Set([
  'logradouro',
  'numero',
  'complemento',
  'bairro',
  'cidade',
  'estado',
  'cep',
  'pais'
]);

const CONTATO_FIELDS = new Set([
  'email',
  'telefone',
  'celular',
  'whatsapp'
]);

const MEMBROS_FIELDS = new Set([
  'id_pessoa',
  'id_unidade',
  'data_conversao',
  'data_batismo',
  'data_membro',
  'situacao',
  'ministerio',
  'grupo_pequeno',
  'dizimista',
  'ofertante',
  'cargo_eclesiastico',
  'data_consagracao',
  'observacoes',
  'dados_perfil'
]);

function normalizeSituacao(value: any): SituacaoBanco {
  const text = String(value ?? '').trim().toUpperCase();
  if (['ACTIVE', 'ATIVO'].includes(text)) return 'ATIVO';
  if (['INACTIVE', 'INATIVO'].includes(text)) return 'INATIVO';
  if (['PENDING', 'PENDENTE'].includes(text)) return 'PENDENTE';
  if (['SUSPENDED', 'SUSPENSO'].includes(text)) return 'SUSPENSO';
  return 'ATIVO';
}

function situacaoParaApi(value: any): SituacaoApi {
  const text = String(value ?? '').trim().toUpperCase();
  if (['ATIVO', 'ACTIVE'].includes(text)) return 'ACTIVE';
  if (['PENDENTE', 'PENDING'].includes(text)) return 'PENDING';
  return 'INACTIVE';
}

function boolFrom(value: any, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const text = value.trim().toLowerCase();
    if (['true', '1', 'sim', 's', 'yes', 'y'].includes(text)) return true;
    if (['false', '0', 'nao', 'não', 'n', 'no'].includes(text)) return false;
  }
  if (typeof value === 'number') return value !== 0;
  return fallback;
}

function toIsoDate(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function parseJsonObject(value: any): Record<string, any> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return { ...value };
}

function buildDadosPerfil(payload: Record<string, any>, existing: Record<string, any> = {}): Record<string, any> {
  const dadosPerfil = { ...existing };
  const reserved = new Set([
    'id',
    'id_membro',
    'id_pessoa',
    'idUnidade',
    'id_unidade',
    'nome',
    'cpf',
    'rg',
    'data_nascimento',
    'dataNascimento',
    'sexo',
    'estado_civil',
    'estadoCivil',
    'email',
    'telefone',
    'celular',
    'whatsapp',
    'whatsapp_ativo',
    'logradouro',
    'numero',
    'complemento',
    'bairro',
    'cidade',
    'estado',
    'cep',
    'pais',
    'tipo_sanguineo',
    'tipoSanguineo',
    'contato_emergencia',
    'contatoEmergencia',
    'pcd',
    'is_pcd',
    'tipo_deficiencia',
    'tipoDeficiencia',
    'ativo',
    'status',
    'situacao',
    'data_conversao',
    'dataConversao',
    'local_conversao',
    'localConversao',
    'data_batismo',
    'dataBatismo',
    'data_membro',
    'dataMembro',
    'data_ingresso',
    'dataIngresso',
    'ministerio',
    'grupo_pequeno',
    'ministerio_principal',
    'funcao_ministerio',
    'cargo_eclesiastico',
    'data_consagracao',
    'dizimista',
    'ofertante',
    'eh_ofertante_regular',
    'observacoes',
    'dados_perfil',
    'lgpdConsent'
  ]);

  for (const [key, value] of Object.entries(payload)) {
    if (reserved.has(key)) continue;
    dadosPerfil[key] = value;
  }

  return dadosPerfil;
}

function mapMemberRow(row: any) {
  const dadosPerfil = parseJsonObject(row.dados_perfil);
  const celular = row.celular ?? '';
  const whatsappAtivo = boolFrom(row.whatsapp, false);
  const whatsapp = whatsappAtivo ? celular : (dadosPerfil.whatsapp || '');
  const situacaoApi = situacaoParaApi(row.situacao);
  const dataMembro = row.data_membro ?? dadosPerfil.data_membro ?? dadosPerfil.dataIngresso ?? dadosPerfil.data_ingresso ?? null;

  return {
    id: row.id,
    id_membro: row.id,
    id_pessoa: row.id_pessoa,
    id_unidade: row.id_unidade,
    unit_name: row.unit_name,
    matricula: dadosPerfil.matricula || row.matricula || '',
    nome: row.nome || '',
    cpf: row.cpf || '',
    rg: row.rg || '',
    email: row.email || '',
    telefone: row.telefone || '',
    celular,
    whatsapp,
    whatsapp_ativo: whatsappAtivo,
    data_nascimento: row.data_nascimento ? toIsoDate(row.data_nascimento) : dadosPerfil.data_nascimento || null,
    sexo: row.sexo || dadosPerfil.sexo || 'OTHER',
    estado_civil: row.estado_civil || dadosPerfil.estado_civil || 'SINGLE',
    data_conversao: row.data_conversao ? toIsoDate(row.data_conversao) : dadosPerfil.data_conversao || null,
    local_conversao: dadosPerfil.local_conversao || null,
    data_batismo: row.data_batismo ? toIsoDate(row.data_batismo) : dadosPerfil.data_batismo || null,
    igreja_batismo: dadosPerfil.igreja_batismo || null,
    pastor_batizador: dadosPerfil.pastor_batizador || null,
    batismo_espirito_santo: dadosPerfil.batismo_espirito_santo ?? null,
    data_ingresso: dataMembro,
    data_membro: dataMembro,
    igreja_origem: dadosPerfil.igreja_origem || null,
    curso_discipulado: dadosPerfil.curso_discipulado || null,
    escola_biblica: dadosPerfil.escola_biblica || null,
    ministerio_principal: row.ministerio || dadosPerfil.ministerio_principal || null,
    funcao_ministerio: dadosPerfil.funcao_ministerio || null,
    outros_ministerios: dadosPerfil.outros_ministerios || [],
    cargo_eclesiastico: row.cargo_eclesiastico || dadosPerfil.cargo_eclesiastico || null,
    data_consagracao: row.data_consagracao ? toIsoDate(row.data_consagracao) : dadosPerfil.data_consagracao || null,
    situacao: situacaoApi,
    status: situacaoApi,
    funcao: dadosPerfil.funcao || 'MEMBER',
    dizimista: boolFrom(row.dizimista, false),
    ofertante: boolFrom(row.ofertante, false),
    eh_ofertante_regular: boolFrom(row.ofertante, false),
    participa_campanhas: boolFrom(dadosPerfil.participa_campanhas, false),
    banco: dadosPerfil.banco || null,
    agencia_bancaria: dadosPerfil.agencia_bancaria || null,
    conta_bancaria: dadosPerfil.conta_bancaria || null,
    chave_pix: dadosPerfil.chave_pix || null,
    nome_pai: dadosPerfil.nome_pai || null,
    nome_mae: dadosPerfil.nome_mae || null,
    nome_conjuge: dadosPerfil.nome_conjuge || null,
    data_casamento: dadosPerfil.data_casamento || null,
    tipo_sanguineo: row.tipo_sanguineo || dadosPerfil.tipo_sanguineo || null,
    contato_emergencia: row.contato_emergencia || dadosPerfil.contato_emergencia || null,
    necessidades_especiais: dadosPerfil.necessidades_especiais || null,
    id_familia: dadosPerfil.familia_id || dadosPerfil.id_familia || null,
    dependentes: dadosPerfil.dependentes || [],
    profissao: dadosPerfil.profissao || null,
    escolaridade: dadosPerfil.escolaridade || null,
    is_pcd: boolFrom(row.pcd, false),
    tipo_deficiencia: row.tipo_deficiencia || dadosPerfil.tipo_deficiencia || null,
    tags: dadosPerfil.tags || [],
    observacoes: row.observacoes || dadosPerfil.observacoes || null,
    dados_perfil: dadosPerfil,
    avatar: dadosPerfil.avatar || null,
    ativo: boolFrom(row.ativo, true),
    criado: row.criado_em,
    atualizado: row.atualizado_em
  };
}

function buildPessoaInsert(body: Record<string, any>) {
  const pessoa: Record<string, any> = {};
  const set = (key: string, value: any) => {
    if (value === undefined) return;
    pessoa[key] = value === '' ? null : value;
  };

  set('id_unidade', body.id_unidade || body.idUnidade || null);
  set('nome', body.nome);
  set('cpf', body.cpf);
  set('rg', body.rg);
  set('data_nascimento', toIsoDate(body.data_nascimento || body.dataNascimento));
  set('sexo', body.sexo);
  set('estado_civil', body.estado_civil || body.estadoCivil);
  set('tipo_sanguineo', body.tipo_sanguineo || body.tipoSanguineo);
  set('contato_emergencia', body.contato_emergencia || body.contatoEmergencia);
  pessoa.pcd = boolFrom(body.pcd ?? body.is_pcd, false);
  set('tipo_deficiencia', body.tipo_deficiencia || body.tipoDeficiencia);
  pessoa.ativo = body.ativo === undefined ? true : boolFrom(body.ativo, true);

  return pessoa;
}

function buildEnderecoInsert(body: Record<string, any>) {
  const endereco: Record<string, any> = {};
  const set = (key: string, value: any) => {
    if (value === undefined) return;
    endereco[key] = value === '' ? null : value;
  };

  set('logradouro', body.logradouro);
  set('numero', body.numero);
  set('complemento', body.complemento);
  set('bairro', body.bairro);
  set('cidade', body.cidade);
  set('estado', body.estado);
  set('cep', body.cep);
  set('pais', body.pais || 'Brasil');

  const hasData = Object.values(endereco).some(v => v !== null && v !== undefined);
  return hasData ? endereco : null;
}

async function upsertContatos(
  client: any,
  tipoEntidade: string,
  idEntidade: string,
  body: Record<string, any>
): Promise<void> {
  const contatos: Array<{ tipo: string; valor: string | null }> = [];

  if (body.email) contatos.push({ tipo: 'EMAIL', valor: body.email });
  if (body.telefone) contatos.push({ tipo: 'TELEFONE', valor: body.telefone });
  if (body.celular) contatos.push({ tipo: 'CELULAR', valor: body.celular });

  const whatsappAtivo = boolFrom(body.whatsapp_ativo ?? body.whatsappAtivo, false);
  const whatsappText = typeof body.whatsapp === 'string' ? body.whatsapp.trim() : '';
  if (whatsappAtivo || whatsappText) {
    contatos.push({ tipo: 'WHATSAPP', valor: whatsappText || body.celular || null });
  }

  // Remover contatos antigos
  await client.query(
    'DELETE FROM contatos WHERE tipo_entidade = $1 AND id_entidade = $2',
    [tipoEntidade, idEntidade]
  );

  // Inserir novos contatos
  for (let i = 0; i < contatos.length; i++) {
    const c = contatos[i];
    if (!c.valor) continue;
    await client.query(
      `INSERT INTO contatos (tipo_entidade, id_entidade, tipo_contato, valor, principal)
       VALUES ($1, $2, $3, $4, $5)`,
      [tipoEntidade, idEntidade, c.tipo, c.valor, i === 0]
    );
  }
}

async function getContatos(client: any, tipoEntidade: string, idEntidade: string): Promise<Record<string, string>> {
  const result = await client.query(
    `SELECT tipo_contato, valor FROM contatos
     WHERE tipo_entidade = $1 AND id_entidade = $2 AND ativo = true
     ORDER BY principal DESC, criado_em ASC`,
    [tipoEntidade, idEntidade]
  );

  const contatos: Record<string, string> = {};
  for (const row of result.rows) {
    if (!contatos[row.tipo_contato]) {
      contatos[row.tipo_contato] = row.valor;
    }
  }
  return contatos;
}

function buildMemberInsert(body: Record<string, any>, idPessoa: string, dadosPerfil: Record<string, any>) {
  return {
    id: body.id_membro || body.id || randomUUID(),
    id_pessoa: idPessoa,
    id_unidade: body.id_unidade || body.idUnidade || null,
    data_conversao: toIsoDate(body.data_conversao || body.dataConversao),
    data_batismo: toIsoDate(body.data_batismo || body.dataBatismo),
    data_membro: toIsoDate(body.data_membro || body.dataMembro || body.data_ingresso || body.dataIngresso),
    situacao: normalizeSituacao(body.situacao || body.status),
    ministerio: body.ministerio_principal || body.ministerio || null,
    grupo_pequeno: body.grupo_pequeno || body.cell_group || body.celula || null,
    dizimista: boolFrom(body.dizimista, false),
    ofertante: boolFrom(body.ofertante ?? body.eh_ofertante_regular, false),
    cargo_eclesiastico: body.cargo_eclesiastico || null,
    data_consagracao: toIsoDate(body.data_consagracao || body.dataConsagracao),
    observacoes: body.observacoes || null,
    dados_perfil: dadosPerfil
  };
}

async function ensureUnitExists(idUnidade: string | null | undefined): Promise<boolean> {
  if (!idUnidade) return true;
  const result = await db.query('SELECT 1 FROM unidades WHERE id_unidade = $1', [idUnidade]);
  return result.rows.length > 0;
}

async function ensureCpfAvailable(cpf: string, excludePessoaId?: string): Promise<boolean> {
  if (!cpf) return true;
  const params: any[] = [cpf];
  let query = 'SELECT 1 FROM pessoas WHERE cpf = $1';
  if (excludePessoaId) {
    params.push(excludePessoaId);
    query += ' AND id_pessoa <> $2';
  }
  const result = await db.query(query, params);
  return result.rows.length === 0;
}

export async function migrateMemberColumns(): Promise<void> {
  await db.query(`
    ALTER TABLE membros
    ADD COLUMN IF NOT EXISTS dados_perfil JSONB DEFAULT '{}'::jsonb
  `);
}

export class MembersController {
  async debugSanitize(req: Request, res: Response) {
    try {
      const testPayload = {
        nome: 'Teste',
        celular: '11987654321',
        whatsapp: '11987654321',
        idUnidade: '00000000-0000-0000-0000-000000000001',
        dados_perfil: { lgpdConsent: {} }
      };

      const pessoa = buildPessoaInsert(testPayload);
      const membro = buildMemberInsert(testPayload, 'pessoa-id', buildDadosPerfil(testPayload));

      res.json({
        original: testPayload,
        pessoa,
        membro,
        hasWhatsapp: 'whatsapp' in pessoa,
        hasCelular: 'celular' in pessoa
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      await migrateMemberColumns();

      const { idUnidade, search, situacao, status, page = '1', limit = '500' } = req.query;
      const filtros = [situacao, status].filter(Boolean);
      const situacaoFiltro = filtros.length > 0 ? normalizeSituacao(filtros[0]) : null;

      let query = `
        SELECT
          m.*,
          p.nome,
          p.cpf,
          p.rg,
          p.data_nascimento,
          p.sexo,
          p.estado_civil,
          ce.valor AS email,
          ct.valor AS telefone,
          cc.valor AS celular,
          cw.valor AS whatsapp,
          p.id_endereco,
          e.logradouro,
          e.numero,
          e.complemento,
          e.bairro,
          e.cidade,
          e.estado,
          e.cep,
          e.pais,
          p.tipo_sanguineo,
          p.contato_emergencia,
          p.pcd,
          p.tipo_deficiencia,
          p.ativo,
          p.criado_em AS pessoa_criado_em,
          p.atualizado_em AS pessoa_atualizado_em,
          u.nome AS unit_name
        FROM membros m
        JOIN pessoas p ON p.id_pessoa = m.id_pessoa
        LEFT JOIN enderecos e ON e.id_endereco = p.id_endereco
        LEFT JOIN contatos ce ON ce.id_entidade = p.id_pessoa AND ce.tipo_entidade = 'PESSOA' AND ce.tipo_contato = 'EMAIL' AND ce.principal = true
        LEFT JOIN contatos ct ON ct.id_entidade = p.id_pessoa AND ct.tipo_entidade = 'PESSOA' AND ct.tipo_contato = 'TELEFONE' AND ct.principal = true
        LEFT JOIN contatos cc ON cc.id_entidade = p.id_pessoa AND cc.tipo_entidade = 'PESSOA' AND cc.tipo_contato = 'CELULAR' AND cc.principal = true
        LEFT JOIN contatos cw ON cw.id_entidade = p.id_pessoa AND cw.tipo_entidade = 'PESSOA' AND cw.tipo_contato = 'WHATSAPP' AND cw.principal = true
        LEFT JOIN unidades u ON u.id_unidade = m.id_unidade
        WHERE 1=1
      `;
      const params: any[] = [];
      let i = 1;

      if (idUnidade) {
        query += ` AND m.id_unidade = $${i++}`;
        params.push(idUnidade);
      }

      if (search) {
        query += ` AND (p.nome ILIKE $${i++} OR p.cpf ILIKE $${i++} OR ce.valor ILIKE $${i++})`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (situacaoFiltro) {
        query += ` AND m.situacao = $${i++}`;
        params.push(situacaoFiltro);
      }

      const offset = (Number(page) - 1) * Number(limit);
      query += ` ORDER BY p.nome ASC LIMIT $${i++} OFFSET $${i++}`;
      params.push(Number(limit), offset);

      const result = await db.query(query, params);
      const mappedMembers = result.rows.map(mapMemberRow);

      let countQuery = `
        SELECT COUNT(*) AS total
        FROM membros m
        JOIN pessoas p ON p.id_pessoa = m.id_pessoa
        LEFT JOIN contatos ce ON ce.id_entidade = p.id_pessoa AND ce.tipo_entidade = 'PESSOA' AND ce.tipo_contato = 'EMAIL' AND ce.principal = true
        WHERE 1=1
      `;
      const countParams: any[] = [];
      let ci = 1;

      if (idUnidade) {
        countQuery += ` AND m.id_unidade = $${ci++}`;
        countParams.push(idUnidade);
      }

      if (search) {
        countQuery += ` AND (p.nome ILIKE $${ci++} OR p.cpf ILIKE $${ci++} OR ce.valor ILIKE $${ci++})`;
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (situacaoFiltro) {
        countQuery += ` AND m.situacao = $${ci++}`;
        countParams.push(situacaoFiltro);
      }

      const countResult = await db.query(countQuery, countParams);
      const total = Number(countResult.rows[0]?.total || 0);

      res.json({
        members: mappedMembers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao buscar membros:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', status: 500 } });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await db.query(
        `
          SELECT
            m.*,
            p.nome,
            p.cpf,
            p.rg,
            p.data_nascimento,
            p.sexo,
            p.estado_civil,
            ce.valor AS email,
            ct.valor AS telefone,
            cc.valor AS celular,
            cw.valor AS whatsapp,
            p.id_endereco,
            e.logradouro,
            e.numero,
            e.complemento,
            e.bairro,
            e.cidade,
            e.estado,
            e.cep,
            e.pais,
            p.tipo_sanguineo,
            p.contato_emergencia,
            p.pcd,
            p.tipo_deficiencia,
            p.ativo,
            u.nome AS unit_name
          FROM membros m
          JOIN pessoas p ON p.id_pessoa = m.id_pessoa
          LEFT JOIN enderecos e ON e.id_endereco = p.id_endereco
          LEFT JOIN contatos ce ON ce.id_entidade = p.id_pessoa AND ce.tipo_entidade = 'PESSOA' AND ce.tipo_contato = 'EMAIL' AND ce.principal = true
          LEFT JOIN contatos ct ON ct.id_entidade = p.id_pessoa AND ct.tipo_entidade = 'PESSOA' AND ct.tipo_contato = 'TELEFONE' AND ct.principal = true
          LEFT JOIN contatos cc ON cc.id_entidade = p.id_pessoa AND cc.tipo_entidade = 'PESSOA' AND cc.tipo_contato = 'CELULAR' AND cc.principal = true
          LEFT JOIN contatos cw ON cw.id_entidade = p.id_pessoa AND cw.tipo_entidade = 'PESSOA' AND cw.tipo_contato = 'WHATSAPP' AND cw.principal = true
          LEFT JOIN unidades u ON u.id_unidade = m.id_unidade
          WHERE m.id = $1
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Membro não encontrado', status: 404 } });
      }

      res.json(mapMemberRow(result.rows[0]));
    } catch (error) {
      console.error('Erro ao buscar membro:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', status: 500 } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { lgpdConsent, dados_perfil, ...body } = req.body || {};
      const idUnidade = body.id_unidade || body.idUnidade || null;
      const pessoaData = buildPessoaInsert(body);

      if (!pessoaData.nome || !pessoaData.cpf) {
        return res.status(400).json({ error: { message: 'Nome e CPF são obrigatórios', status: 400 } });
      }

      if (!(await ensureUnitExists(idUnidade))) {
        return res.status(400).json({ error: { message: 'Unidade não encontrada', status: 400 } });
      }

      if (!(await ensureCpfAvailable(String(pessoaData.cpf), undefined))) {
        return res.status(409).json({ error: { message: 'CPF já cadastrado', status: 409 } });
      }

      // Criar endereço se houver dados
      let idEndereco = null;
      const enderecoData = buildEnderecoInsert(body);
      if (enderecoData) {
        const enderecoResult = await db.query<{ id_endereco: string }>(
          `INSERT INTO enderecos (logradouro, numero, complemento, bairro, cidade, estado, cep, pais)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id_endereco`,
          [
            enderecoData.logradouro || null,
            enderecoData.numero || null,
            enderecoData.complemento || null,
            enderecoData.bairro || null,
            enderecoData.cidade || null,
            enderecoData.estado || null,
            enderecoData.cep || null,
            enderecoData.pais || 'Brasil'
          ]
        );
        idEndereco = enderecoResult.rows[0].id_endereco;
      }

      const personResult = await db.query<{
        id_pessoa: string;
        nome: string;
      }>(
        `
          INSERT INTO pessoas (
            id_unidade, nome, cpf, rg, data_nascimento, sexo, estado_civil,
            id_endereco, tipo_sanguineo, contato_emergencia, pcd, tipo_deficiencia, ativo
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12, $13
          )
          RETURNING id_pessoa, nome
        `,
        [
          pessoaData.id_unidade || null,
          pessoaData.nome,
          pessoaData.cpf || null,
          pessoaData.rg || null,
          pessoaData.data_nascimento || null,
          pessoaData.sexo || null,
          pessoaData.estado_civil || null,
          idEndereco,
          pessoaData.tipo_sanguineo || null,
          pessoaData.contato_emergencia || null,
          pessoaData.pcd,
          pessoaData.tipo_deficiencia || null,
          pessoaData.ativo
        ]
      );

      const idPessoa = personResult.rows[0].id_pessoa;

      // Criar contatos
      await upsertContatos(db, 'PESSOA', idPessoa, body);

      const perfilAtualizado = buildDadosPerfil(body, parseJsonObject(dados_perfil));
      if (lgpdConsent) {
        perfilAtualizado.lgpdConsent = {
          ...(perfilAtualizado.lgpdConsent || {}),
          ...lgpdConsent
        };
      }

      const memberData = buildMemberInsert({ ...body, id_unidade: idUnidade }, idPessoa, perfilAtualizado);

      const memberResult = await db.query(
        `
          INSERT INTO membros (
            id, id_pessoa, id_unidade, data_conversao, data_batismo, data_membro, situacao,
            ministerio, grupo_pequeno, dizimista, ofertante, cargo_eclesiastico,
            data_consagracao, observacoes, dados_perfil
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12,
            $13, $14, $15::jsonb
          )
          RETURNING *
        `,
        [
          memberData.id,
          memberData.id_pessoa,
          memberData.id_unidade,
          memberData.data_conversao,
          memberData.data_batismo,
          memberData.data_membro,
          memberData.situacao,
          memberData.ministerio,
          memberData.grupo_pequeno,
          memberData.dizimista,
          memberData.ofertante,
          memberData.cargo_eclesiastico,
          memberData.data_consagracao,
          memberData.observacoes,
          JSON.stringify(memberData.dados_perfil)
        ]
      );

      const joined = await db.query(
        `
          SELECT
            m.*,
            p.nome,
            p.cpf,
            p.rg,
            p.data_nascimento,
            p.sexo,
            p.estado_civil,
            ce.valor AS email,
            ct.valor AS telefone,
            cc.valor AS celular,
            cw.valor AS whatsapp,
            p.id_endereco,
            e.logradouro,
            e.numero,
            e.complemento,
            e.bairro,
            e.cidade,
            e.estado,
            e.cep,
            e.pais,
            p.tipo_sanguineo,
            p.contato_emergencia,
            p.pcd,
            p.tipo_deficiencia,
            p.ativo,
            u.nome AS unit_name
          FROM membros m
          JOIN pessoas p ON p.id_pessoa = m.id_pessoa
          LEFT JOIN enderecos e ON e.id_endereco = p.id_endereco
          LEFT JOIN contatos ce ON ce.id_entidade = p.id_pessoa AND ce.tipo_entidade = 'PESSOA' AND ce.tipo_contato = 'EMAIL' AND ce.principal = true
          LEFT JOIN contatos ct ON ct.id_entidade = p.id_pessoa AND ct.tipo_entidade = 'PESSOA' AND ct.tipo_contato = 'TELEFONE' AND ct.principal = true
          LEFT JOIN contatos cc ON cc.id_entidade = p.id_pessoa AND cc.tipo_entidade = 'PESSOA' AND cc.tipo_contato = 'CELULAR' AND cc.principal = true
          LEFT JOIN contatos cw ON cw.id_entidade = p.id_pessoa AND cw.tipo_entidade = 'PESSOA' AND cw.tipo_contato = 'WHATSAPP' AND cw.principal = true
          LEFT JOIN unidades u ON u.id_unidade = m.id_unidade
          WHERE m.id = $1
        `,
        [memberResult.rows[0].id]
      );

      return res.status(201).json(mapMemberRow(joined.rows[0]));
    } catch (error: any) {
      console.error('Erro ao criar membro:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', status: 500, details: error.message } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { lgpdConsent, dados_perfil, ...body } = req.body || {};

      const current = await db.query(
        `
          SELECT m.*, p.*, e.logradouro AS e_logradouro, e.numero AS e_numero,
                 e.complemento AS e_complemento, e.bairro AS e_bairro, e.cidade AS e_cidade,
                 e.estado AS e_estado, e.cep AS e_cep, e.pais AS e_pais
          FROM membros m
          JOIN pessoas p ON p.id_pessoa = m.id_pessoa
          LEFT JOIN enderecos e ON e.id_endereco = p.id_endereco
          WHERE m.id = $1
        `,
        [id]
      );

      if (current.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Membro não encontrado', status: 404 } });
      }

      const currentRow = current.rows[0];
      const idPessoa = currentRow.id_pessoa;
      const idEnderecoAtual = currentRow.id_endereco;
      const nextUnitId = body.id_unidade || body.idUnidade || currentRow.id_unidade || null;

      if (!(await ensureUnitExists(nextUnitId))) {
        return res.status(400).json({ error: { message: 'Unidade não encontrada', status: 400 } });
      }

      const nextCpf = body.cpf ?? currentRow.cpf;
      if (!(await ensureCpfAvailable(String(nextCpf || ''), idPessoa))) {
        return res.status(409).json({ error: { message: 'CPF já cadastrado', status: 409 } });
      }

      const pessoaData = buildPessoaInsert({
        ...currentRow,
        ...body,
        id_unidade: nextUnitId
      });

      const perfilAtual = parseJsonObject(currentRow.dados_perfil);
      const perfilAtualizado = buildDadosPerfil(body, {
        ...perfilAtual,
        ...(parseJsonObject(dados_perfil))
      });
      if (lgpdConsent) {
        perfilAtualizado.lgpdConsent = {
          ...(perfilAtual.lgpdConsent || {}),
          ...lgpdConsent
        };
      }

      // Atualizar ou criar endereço
      const enderecoData = buildEnderecoInsert(body);
      if (enderecoData) {
        if (idEnderecoAtual) {
          await db.query(
            `UPDATE enderecos
             SET logradouro = COALESCE($1, logradouro),
                 numero = COALESCE($2, numero),
                 complemento = COALESCE($3, complemento),
                 bairro = COALESCE($4, bairro),
                 cidade = COALESCE($5, cidade),
                 estado = COALESCE($6, estado),
                 cep = COALESCE($7, cep),
                 pais = COALESCE($8, pais),
                 atualizado_em = CURRENT_TIMESTAMP
             WHERE id_endereco = $9`,
            [
              enderecoData.logradouro,
              enderecoData.numero,
              enderecoData.complemento,
              enderecoData.bairro,
              enderecoData.cidade,
              enderecoData.estado,
              enderecoData.cep,
              enderecoData.pais,
              idEnderecoAtual
            ]
          );
        } else {
          const inserted = await db.query<{ id_endereco: string }>(
            `INSERT INTO enderecos (logradouro, numero, complemento, bairro, cidade, estado, cep, pais)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id_endereco`,
            [
              enderecoData.logradouro || null,
              enderecoData.numero || null,
              enderecoData.complemento || null,
              enderecoData.bairro || null,
              enderecoData.cidade || null,
              enderecoData.estado || null,
              enderecoData.cep || null,
              enderecoData.pais || 'Brasil'
            ]
          );
          // Atualizar id_endereco na pessoa
          await db.query(
            'UPDATE pessoas SET id_endereco = $1 WHERE id_pessoa = $2',
            [inserted.rows[0].id_endereco, idPessoa]
          );
        }
      }

      await db.query(
        `
          UPDATE pessoas
          SET
            id_unidade = $2,
            nome = $3,
            cpf = $4,
            rg = $5,
            data_nascimento = $6,
            sexo = $7,
            estado_civil = $8,
            tipo_sanguineo = $9,
            contato_emergencia = $10,
            pcd = $11,
            tipo_deficiencia = $12,
            ativo = $13,
            atualizado_em = CURRENT_TIMESTAMP
          WHERE id_pessoa = $1
        `,
        [
          idPessoa,
          pessoaData.id_unidade || null,
          pessoaData.nome,
          pessoaData.cpf || null,
          pessoaData.rg || null,
          pessoaData.data_nascimento || null,
          pessoaData.sexo || null,
          pessoaData.estado_civil || null,
          pessoaData.tipo_sanguineo || null,
          pessoaData.contato_emergencia || null,
          pessoaData.pcd,
          pessoaData.tipo_deficiencia || null,
          pessoaData.ativo
        ]
      );

      // Atualizar contatos
      await upsertContatos(db, 'PESSOA', idPessoa, body);

      await db.query(
        `
          UPDATE membros
          SET
            id_unidade = $2,
            data_conversao = $3,
            data_batismo = $4,
            data_membro = $5,
            situacao = $6,
            ministerio = $7,
            grupo_pequeno = $8,
            dizimista = $9,
            ofertante = $10,
            cargo_eclesiastico = $11,
            data_consagracao = $12,
            observacoes = $13,
            dados_perfil = $14::jsonb,
            atualizado_em = CURRENT_TIMESTAMP
          WHERE id = $1
        `,
        [
          id,
          nextUnitId,
          toIsoDate(body.data_conversao || body.dataConversao || currentRow.data_conversao),
          toIsoDate(body.data_batismo || body.dataBatismo || currentRow.data_batismo),
          toIsoDate(body.data_membro || body.dataMembro || body.data_ingresso || body.dataIngresso || currentRow.data_membro),
          normalizeSituacao(body.situacao || body.status || currentRow.situacao),
          body.ministerio_principal || body.ministerio || currentRow.ministerio,
          body.grupo_pequeno || body.cell_group || body.celula || currentRow.grupo_pequeno,
          body.dizimista === undefined ? currentRow.dizimista : boolFrom(body.dizimista, false),
          body.ofertante === undefined && body.eh_ofertante_regular === undefined
            ? currentRow.ofertante
            : boolFrom(body.ofertante ?? body.eh_ofertante_regular, false),
          body.cargo_eclesiastico || currentRow.cargo_eclesiastico,
          toIsoDate(body.data_consagracao || body.dataConsagracao || currentRow.data_consagracao),
          body.observacoes ?? currentRow.observacoes,
          JSON.stringify(perfilAtualizado)
        ]
      );

      const refreshed = await db.query(
        `
          SELECT
            m.*,
            p.nome,
            p.cpf,
            p.rg,
            p.data_nascimento,
            p.sexo,
            p.estado_civil,
            ce.valor AS email,
            ct.valor AS telefone,
            cc.valor AS celular,
            cw.valor AS whatsapp,
            p.id_endereco,
            e.logradouro,
            e.numero,
            e.complemento,
            e.bairro,
            e.cidade,
            e.estado,
            e.cep,
            e.pais,
            p.tipo_sanguineo,
            p.contato_emergencia,
            p.pcd,
            p.tipo_deficiencia,
            p.ativo,
            u.nome AS unit_name
          FROM membros m
          JOIN pessoas p ON p.id_pessoa = m.id_pessoa
          LEFT JOIN enderecos e ON e.id_endereco = p.id_endereco
          LEFT JOIN contatos ce ON ce.id_entidade = p.id_pessoa AND ce.tipo_entidade = 'PESSOA' AND ce.tipo_contato = 'EMAIL' AND ce.principal = true
          LEFT JOIN contatos ct ON ct.id_entidade = p.id_pessoa AND ct.tipo_entidade = 'PESSOA' AND ct.tipo_contato = 'TELEFONE' AND ct.principal = true
          LEFT JOIN contatos cc ON cc.id_entidade = p.id_pessoa AND cc.tipo_entidade = 'PESSOA' AND cc.tipo_contato = 'CELULAR' AND cc.principal = true
          LEFT JOIN contatos cw ON cw.id_entidade = p.id_pessoa AND cw.tipo_entidade = 'PESSOA' AND cw.tipo_contato = 'WHATSAPP' AND cw.principal = true
          LEFT JOIN unidades u ON u.id_unidade = m.id_unidade
          WHERE m.id = $1
        `,
        [id]
      );

      return res.json(mapMemberRow(refreshed.rows[0]));
    } catch (error: any) {
      console.error('Erro ao atualizar membro:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', status: 500, details: error.message } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const existsResult = await db.query('SELECT id FROM membros WHERE id = $1', [id]);
      if (existsResult.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Membro não encontrado', status: 404 } });
      }

      await db.query(
        `UPDATE membros SET situacao = $1, atualizado_em = CURRENT_TIMESTAMP WHERE id = $2`,
        ['INATIVO', id]
      );

      res.json({ message: 'Membro removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', status: 500 } });
    }
  }

  async addDependent(req: Request, res: Response) {
    return res.status(501).json({
      error: {
        message: 'Dependentes ainda nao estao modelados no schema atual.',
        status: 501
      }
    });
  }

  async addContribution(req: Request, res: Response) {
    return res.status(501).json({
      error: {
        message: 'Contribuicoes ainda nao estao modeladas no schema atual.',
        status: 501
      }
    });
  }
}
