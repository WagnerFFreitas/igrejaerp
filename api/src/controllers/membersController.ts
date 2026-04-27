/**
 * ============================================================================
 * MEMBERSCONTROLLER.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Controller que processa requisições relacionadas a members controller.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import { Request, Response } from 'express';
import Database from '../database';
import { randomUUID } from 'crypto';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (members controller).
 */

const db = Database.getInstance();

// Campos permitidos — correspondem exatamente às colunas da tabela members (schema real)
const ALLOWED_MEMBER_FIELDS = new Set([
  'id', 'unidade_id', 'matricula', 'nome', 'cpf', 'rg', 'email', 'telefone', 'whatsapp',
  'profissao', 'funcao', 'status', 'data_nascimento', 'sexo', 'estado_civil', 'nome_conjuge', 'data_casamento',
  'nome_pai', 'nome_mae', 'tipo_sanguineo', 'contato_emergencia', 'cep', 'logradouro',
  'numero', 'complemento', 'bairro', 'cidade', 'estado', 'data_conversao', 'local_conversao',
  'data_batismo', 'igreja_batismo', 'pastor_batizador', 'batismo_espirito_santo', 'data_membro',
  'igreja_origem', 'curso_discipulado', 'escola_biblica', 'ministerio_principal', 'funcao_ministerio',
  'outros_ministerios', 'cargo_eclesiastico', 'data_consagracao', 'dizimista', 'ofertante_regular',
  'participa_campanhas', 'banco', 'agencia_bancaria', 'conta_bancaria', 'chave_pix', 'observacoes',
  'necessidades_especiais', 'talentos', 'tags', 'familia_id', 'avatar', 'profile_data', 'celula', 'cell_group',
  'dons_espirituais', 'escolaridade', 'is_pcd', 'tipo_deficiencia', 'celular', 'lgpd_consent'
]);

const sanitizeMemberPayload = (
  payload: Record<string, any>,
  options?: { includeId?: boolean }
): Record<string, any> => {
  const result: Record<string, any> = {};
  
  // Mapeamento de campos do frontend para colunas do banco
  // Inclui compatibilidade com versões legadas (ex: celular vs whatsapp)
  const fieldMapping: Record<string, string> = {
    // Novos campos em PT (camelCase -> snake_case)
    'unidadeId': 'unidade_id',
    'dataNascimento': 'data_nascimento',
    'estadoCivil': 'estado_civil',
    'nomeConjuge': 'nome_conjuge',
    'dataCasamento': 'data_casamento',
    'nomePai': 'nome_pai',
    'nomeMae': 'nome_mae',
    'tipoSanguineo': 'tipo_sanguineo',
    'contatoEmergencia': 'contato_emergencia',
    'cep': 'cep',
    'logradouro': 'logradouro',
    'numero': 'numero',
    'complemento': 'complemento',
    'bairro': 'bairro',
    'cidade': 'cidade',
    'estado': 'estado',
    'dataConversao': 'data_conversao',
    'localConversao': 'local_conversao',
    'dataBatismo': 'data_batismo',
    'igrejaBatismo': 'igreja_batismo',
    'pastorBatizador': 'pastor_batizador',
    'batismoEspiritoSanto': 'batismo_espirito_santo',
    'dataMembro': 'data_membro',
    'igrejaOrigem': 'igreja_origem',
    'cursoDiscipulado': 'curso_discipulado',
    'escolaBiblica': 'escola_biblica',
    'ministerioPrincipal': 'ministerio_principal',
    'funcaoMinisterio': 'funcao_ministerio',
    'outrosMinisterios': 'outros_ministerios',
    'cargoEclesiastico': 'cargo_eclesiastico',
    'dataConsagracao': 'data_consagracao',
    'ehDizimista': 'dizimista',
    'ehOfertanteRegular': 'ofertante_regular',
    'participaCampanhas': 'participa_campanhas',
    'agenciaBancaria': 'agencia_bancaria',
    'contaBancaria': 'conta_bancaria',
    'chavePix': 'chave_pix',
    'necessidadesEspeciais': 'necessidades_especiais',
    'familiaId': 'familia_id',
    'cellGroup': 'cell_group',
    'celula': 'cell_group',
    'profissao': 'profissao',
    'funcao': 'funcao',
    'donsEspirituais': 'dons_espirituais',
    'escolaridade': 'escolaridade',
    'isPcd': 'is_pcd',
    'ehPcd': 'is_pcd',
    'tipoDeficiencia': 'tipo_deficiencia',
    'celular': 'celular',
    'lgpdConsent': 'lgpd_consent',
    'consentimentoLgpd': 'lgpd_consent',
    
    // Legado (EN -> snake_case PT)
    'unitId': 'unidade_id',
    'name': 'nome',
    'birthDate': 'data_nascimento',
    'maritalStatus': 'estado_civil',
    'spouseName': 'nome_conjuge',
    'marriageDate': 'data_casamento',
    'fatherName': 'nome_pai',
    'motherName': 'nome_mae',
    'bloodType': 'tipo_sanguineo',
    'emergencyContact': 'contato_emergencia',
    'zipCode': 'cep',
    'street': 'logradouro',
    'number': 'numero',
    'complement': 'complemento',
    'neighborhood': 'bairro',
    'city': 'cidade',
    'state': 'estado',
    'conversionDate': 'data_conversao',
    'conversionPlace': 'local_conversao',
    'baptismDate': 'data_batismo',
    'baptismChurch': 'igreja_batismo',
    'baptizingPastor': 'pastor_batizador',
    'holySpiritBaptism': 'batismo_espirito_santo',
    'membershipDate': 'data_membro',
    'churchOfOrigin': 'igreja_origem',
    'discipleshipCourse': 'curso_discipulado',
    'biblicalSchool': 'escola_biblica',
    'mainMinistry': 'ministerio_principal',
    'ministryRole': 'funcao_ministerio',
    'otherMinistries': 'outros_ministerios',
    'ecclesiasticalPosition': 'cargo_eclesiastico',
    'consecrationDate': 'data_consagracao',
    'isTithable': 'dizimista',
    'isRegularGiver': 'ofertante_regular',
    'participatesCampaigns': 'participa_campanhas',
    'bankAgency': 'agencia_bancaria',
    'bankAccount': 'conta_bancaria',
    'pixKey': 'chave_pix',
    'specialNeeds': 'necessidades_especiais',
    'familyId': 'familia_id',
    'phone': 'telefone',
    
    // Novas pontes de compatibilidade (EN snake_case -> PT snake_case)
    'father_name': 'nome_pai',
    'mother_name': 'nome_mae',
    'blood_type': 'tipo_sanguineo',
    'emergency_contact': 'contato_emergencia',
    'is_tithable': 'dizimista',
    'is_regular_giver': 'ofertante_regular',
    'participates_campaigns': 'participa_campanhas',
    'pix_key': 'chave_pix',
    'bank_agency': 'agencia_bancaria',
    'bank_account': 'conta_bancaria',
    'zip_code': 'cep',
    'conversion_date': 'data_conversao',
    'conversion_place': 'local_conversao',
    'baptism_date': 'data_batismo',
    'baptism_church': 'igreja_batismo',
    'baptizing_pastor': 'pastor_batizador',
    'membership_date': 'data_membro',
    'church_of_origin': 'igreja_origem',
    'discipleship_course': 'curso_discipulado',
    'biblical_school': 'escola_biblica',
    'main_ministry': 'ministerio_principal',
    'ministry_role': 'funcao_ministerio',
    'other_ministries': 'outros_ministerios',
    'ecclesiastical_position': 'cargo_eclesiastico',
    'consecration_date': 'data_consagracao',
    'special_needs': 'necessidades_especiais',
    'family_id': 'familia_id',
    'marriage_date': 'data_casamento',
    'spouse_name': 'nome_conjuge',
  };

  // Processar campos do endereço se existirem
  if (payload.address && typeof payload.address === 'object') {
    const addr = payload.address;
    if (addr.zipCode || addr.cep) result.cep = addr.zipCode || addr.cep;
    if (addr.street || addr.logradouro) result.logradouro = addr.street || addr.logradouro;
    if (addr.number || addr.numero) result.numero = addr.number || addr.numero;
    if (addr.complement || addr.complemento) result.complemento = addr.complement || addr.complemento;
    if (addr.neighborhood || addr.bairro) result.bairro = addr.neighborhood || addr.bairro;
    if (addr.city || addr.cidade) result.cidade = addr.city || addr.cidade;
    if (addr.state || addr.estado) result.estado = addr.state || addr.estado;
  }

  for (const [key, value] of Object.entries(payload || {})) {
    if (key === 'id' && !options?.includeId) continue;
    if (key === 'address') continue; // Já processado acima
    if (key === 'profile_data') continue; // Já processado abaixo

    const targetKey = fieldMapping[key] || key;
    
    // Se o campo não está na lista de permitidos, adiciona ao profile_data
    if (!ALLOWED_MEMBER_FIELDS.has(targetKey)) {
      if (!result.profile_data) result.profile_data = {};
      // Se o campo for 'celular', garantimos que ele vá para o profile_data
      // mesmo que o fieldMapping o tenha mantido como 'celular'
      result.profile_data[targetKey] = value;
      continue;
    }
    
    if (value === undefined) continue;
    
    // Proteção: não permitir que campos importantes sejam definidos como null se vierem vazios
    // Isso evita que matrículas existentes sejam perdidas
    const protectedFields = ['matricula'];
    if (protectedFields.includes(targetKey) && (value === '' || value === null)) {
      console.log(`⚠️ Campo protegido "${targetKey}" ignorado (valor vazio/null)`);
      continue;
    }
    
    result[targetKey] = value === '' ? null : value;
  }
  
  return result;
};

export class MembersController {
  async debugSanitize(req: Request, res: Response) {
    try {
      const testPayload = {
        name: 'Teste',
        whatsapp: '11987654321',
        cellGroup: 'A',
        profile_data: { lgpdConsent: {} }
      };
      
      console.log('\n\n=== DEBUG SANITIZE ===');
      console.log('Payload original:', JSON.stringify(testPayload, null, 2));
      
      const sanitized = sanitizeMemberPayload(testPayload);
      
      console.log('Payload sanitizado:', JSON.stringify(sanitized, null, 2));
      console.log('=== FIM DEBUG ===\n\n');
      
      res.json({
        original: testPayload,
        sanitized: sanitized,
        hasWhatsapp: 'whatsapp' in sanitized,
        hasCelular: 'celular' in sanitized,
        hasCell_group: 'cell_group' in sanitized
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { unitId, search, status, page = '1', limit = '500' } = req.query;

      let query = `
        SELECT m.*, u.nome_unidade as unit_name
        FROM membros m
        JOIN units u ON m.unidade_id = u.id
        WHERE 1=1
      `;
      const params: any[] = [];
      let i = 1;

      if (unitId) { query += ` AND m.unidade_id = $${i++}`; params.push(unitId); }
      if (search) {
        query += ` AND (m.nome ILIKE $${i++} OR m.cpf ILIKE $${i++} OR m.email ILIKE $${i++})`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      if (status) { query += ` AND m.status = $${i++}`; params.push(status); }

      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      query += ` ORDER BY m.matricula NULLS LAST LIMIT $${i++} OFFSET $${i++}`;
      params.push(parseInt(limit as string), offset);

      const result = await db.query(query, params);
      const mappedMembers = result.rows.map(m => ({ 
        ...m, 
        unidadeId: m.unidade_id,
        whatsapp: m.whatsapp,
        dataNascimento: m.data_nascimento,
        estadoCivil: m.estado_civil,
        nomeConjuge: m.nome_conjuge,
        dataCasamento: m.data_casamento,
        nomePai: m.nome_pai,
        nomeMae: m.nome_mae,
        tipoSanguineo: m.tipo_sanguineo,
        contatoEmergencia: m.contato_emergencia,
        cep: m.cep,
        dataConversao: m.data_conversao,
        localConversao: m.local_conversao,
        dataBatismo: m.data_batismo,
        igrejaBatismo: m.igreja_batismo,
        pastorBatizador: m.pastor_batizador,
        batismoEspiritoSanto: m.batismo_espirito_santo,
        dataMembro: m.data_membro,
        igrejaOrigem: m.igreja_origem,
        cursoDiscipulado: m.curso_discipulado,
        escolaBiblica: m.escola_biblica,
        ministerioPrincipal: m.ministerio_principal,
        funcaoMinisterio: m.funcao_ministerio,
        outrosMinisterios: m.outros_ministerios,
        cargoEclesiastico: m.cargo_eclesiastico,
        dataConsagracao: m.data_consagracao,
        ehDizimista: m.dizimista,
        ehOfertanteRegular: m.ofertante_regular ?? m.eh_ofertante_regular,
        participaCampanhas: m.participa_campanhas,
        agenciaBancaria: m.agencia_bancaria,
        contaBancaria: m.conta_bancaria,
        chavePix: m.chave_pix,
        necessidadesEspeciais: m.necessidades_especiais,
        familiaId: m.familia_id,
        cellGroup: m.cell_group || m.celula,
        address: {
          zipCode: m.cep,
          street: m.logradouro,
          number: m.numero,
          complement: m.complemento,
          neighborhood: m.bairro,
          city: m.cidade,
          state: m.estado
        }
      }));

      // Contagem total
      let countQuery = `SELECT COUNT(*) as total FROM membros m WHERE 1=1`;
      const countParams: any[] = [];
      let ci = 1;
      if (unitId) { countQuery += ` AND m.unidade_id = $${ci++}`; countParams.push(unitId); }
      if (search) {
        countQuery += ` AND (m.nome ILIKE $${ci++} OR m.cpf ILIKE $${ci++} OR m.email ILIKE $${ci++})`;
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      if (status) { countQuery += ` AND m.status = $${ci++}`; countParams.push(status); }

      const countResult = await db.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].total);

      res.json({
        members: mappedMembers,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string))
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
        `SELECT m.*, u.nome_unidade as unit_name FROM membros m JOIN units u ON m.unidade_id = u.id WHERE m.id = $1`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Membro não encontrado', status: 404 } });
      }
      const dependentsResult = await db.query(
        'SELECT * FROM dependents WHERE membro_id = $1 ORDER BY nome', [id]
      );
      const contributionsResult = await db.query(
        'SELECT * FROM member_contributions WHERE membro_id = $1 ORDER BY data_contribuicao DESC', [id]
      );
      const member = result.rows[0];
      // Compatibilidade: whatsapp já é o nome correto da coluna
      member.whatsapp = member.whatsapp;
      member.dependents = dependentsResult.rows;
      member.contributions = contributionsResult.rows;
      res.json(member);
    } catch (error) {
      console.error('Erro ao buscar membro:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', status: 500 } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { lgpdConsent, ...restOfBody } = req.body;
      const memberData: Record<string, any> = {
        id: randomUUID(),
        ...sanitizeMemberPayload(restOfBody, { includeId: false })
      };

      if (lgpdConsent) {
        memberData.profile_data = { ...(memberData.profile_data || {}), lgpdConsent };
      }

      if (!memberData.nome || !memberData.cpf || !memberData.unidade_id) {
        return res.status(400).json({ error: { message: 'Nome, CPF e unidade são obrigatórios', status: 400 } });
      }

      const existingCpf = await db.query('SELECT id FROM membros WHERE cpf = $1', [memberData.cpf]);
      if (existingCpf.rows.length > 0) {
        return res.status(409).json({ error: { message: 'CPF já cadastrado', status: 409 } });
      }

      const unitExists = await db.query('SELECT id FROM units WHERE id = $1', [memberData.unidade_id]);
      if (unitExists.rows.length === 0) {
        return res.status(400).json({ error: { message: 'Unidade não encontrada', status: 400 } });
      }

      const fields = Object.keys(memberData);
      const values = Object.values(memberData);
      
      const placeholders = fields.map((_, idx) => `$${idx + 1}`).join(', ');

      const result = await db.query(
        `INSERT INTO membros (${fields.join(', ')}, criado, atualizado)
         VALUES (${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        values
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar membro:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', status: 500 } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { lgpdConsent, ...restOfBody } = req.body;

      console.log('🔍 UPDATE - Body recebido:', JSON.stringify(restOfBody, null, 2));
      console.log('🔍 UPDATE - WhatsApp no body:', restOfBody.whatsapp);
      console.log('🔍 UPDATE - Celular no body:', restOfBody.celular);
      console.log('🔍 UPDATE - Matricula no body:', restOfBody.matricula);

      const updateData = sanitizeMemberPayload(restOfBody, { includeId: false });

      console.log('🔍 UPDATE - Dados após sanitize:', JSON.stringify(updateData, null, 2));
      console.log('🔍 UPDATE - WhatsApp em updateData:', updateData.whatsapp);
      console.log('🔍 UPDATE - Matricula em updateData:', updateData.matricula);

      // Obter o registro atual para mesclar dados
      const currentResult = await db.query('SELECT profile_data FROM membros WHERE id = $1', [id]);
      if (currentResult.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Membro não encontrado', status: 404 } });
      }

      // Sempre mesclar profile_data preservando dados existentes
      const currentProfileData = currentResult.rows[0]?.profile_data || {};
      updateData.profile_data = {
        ...currentProfileData,
        ...(updateData.profile_data || {}),
        ...(lgpdConsent ? { lgpdConsent: { ...(currentProfileData.lgpdConsent || {}), ...lgpdConsent } } : {})
      };

      if (updateData.cpf) {
        const existingCpf = await db.query('SELECT id FROM membros WHERE cpf = $1 AND id != $2', [updateData.cpf, id]);
        if (existingCpf.rows.length > 0) {
          return res.status(409).json({ error: { message: 'CPF já cadastrado', status: 409 } });
        }
      }

      const fields = Object.keys(updateData);
      if (fields.length === 0 && !lgpdConsent) { // Se só lgpdConsent mudou, ainda permite
        return res.status(400).json({ error: { message: 'Nenhum campo válido para atualização', status: 400 } });
      }

      console.log('🔍 UPDATE - Campos que serão atualizados:', fields);
      console.log('🔍 UPDATE - Inclui matricula?', fields.includes('matricula'));

      const values = Object.values(updateData);
      
      const setClause = fields.map((f, idx) => `${f} = $${idx + 1}`).join(', ');
      const finalSetClause = `${setClause}${setClause ? ', ' : ''}atualizado = CURRENT_TIMESTAMP`;

      const result = await db.query(
        `UPDATE membros SET ${finalSetClause} WHERE id = $${fields.length + 1} RETURNING *`,
        [...values, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: { message: 'Membro não encontrado', status: 404 } });
      }

      console.log('✅ UPDATE concluído. Matrícula no membro retornado:', result.rows[0].matricula);

      res.json(result.rows[0]);
    } catch (error: any) {
      console.error('❌ Erro ao atualizar membro:', error?.message || error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', status: 500 } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const existsResult = await db.query('SELECT id FROM membros WHERE id = $1', [id]);
      if (existsResult.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Membro não encontrado', status: 404 } });
      }
      await db.query('UPDATE membros SET status = $1, atualizado = CURRENT_TIMESTAMP WHERE id = $2', ['INACTIVE', id]);
      res.json({ message: 'Membro removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', status: 500 } });
    }
  }

  async addDependent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const d = req.body;
      const existsResult = await db.query('SELECT id FROM membros WHERE id = $1', [id]);
      if (existsResult.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Membro não encontrado', status: 404 } });
      }
      const result = await db.query(
        `INSERT INTO dependents (membro_id, nome, data_nascimento, parentesco, cpf, criado)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *`,
        [id, d.nome || d.name, d.data_nascimento || d.birth_date, d.parentesco || d.relationship, d.cpf]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao adicionar dependente:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', status: 500 } });
    }
  }

  async addContribution(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const c = req.body;
      const existsResult = await db.query('SELECT id FROM membros WHERE id = $1', [id]);
      if (existsResult.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Membro não encontrado', status: 404 } });
      }
      const result = await db.query(
        `INSERT INTO member_contributions (membro_id, valor, data_contribuicao, tipo, descricao, criado)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *`,
        [id, c.valor || c.value, c.data_contribuicao || c.contribution_date, c.tipo || c.type, c.descricao || c.description]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao adicionar contribuição:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', status: 500 } });
    }
  }
}
