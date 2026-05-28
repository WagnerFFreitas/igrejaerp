/**
 * ============================================================================
 * DATABASESERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para database service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import apiClient from '../src/services/apiService';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (database service).
 */

const UNIT_ID_ALIASES: Record<string, string> = {
  'u-sede': '00000000-0000-0000-0000-000000000001',
  'u-matriz': '00000000-0000-0000-0000-000000000001'
};

const normalizeUnitId = (unitId?: string) => {
  if (!unitId) return unitId;
  return UNIT_ID_ALIASES[unitId] || unitId;
};

const optionalText = (value: unknown) => {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  return normalized === '' ? null : normalized;
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isPersistedId = (id?: string) => Boolean(id && UUID_REGEX.test(id));

/**
 * Constrói dados_perfil contendo APENAS campos extras (não duplica colunas da tabela)
 * Campos que já existem em colunas separadas são lidos diretamente da tabela.
 */
const buildMemberProfileData = (member: any) => ({
  // Campos relacionados (armazenados em tabelas separadas)
  contributions: Array.isArray(member.contributions) ? member.contributions : [],
  dependents: Array.isArray(member.dependents) ? member.dependents : [],
  
  // Campos extras que não têm coluna dedicada
  email_pessoal: (member as any).email_pessoal || '',
  celular_extra: (member as any).celular_extra || '',
  escolaridade: (member as any).escolaridade || '',
  is_pcd: Boolean((member as any).is_pcd),
  tipo_deficiencia: (member as any).tipo_deficiencia || '',
  spiritualGifts: member.spiritualGifts || '',
  
  // Consentimento LGPD
  lgpdConsent: member.lgpdConsent || {},
});

/**
 * Constrói dados_perfil para funcionários (compatibilidade com sistema legado)
 * Nota: Idealmente muitos desses campos deveriam ter colunas dedicadas
 */
const buildEmployeeProfileData = (employee: any) => ({
  birthDate: employee.birthDate || employee.birth_date || '',
  gender: employee.gender || employee.sexo || 'M',
  maritalStatus: employee.maritalStatus || employee.estado_civil || 'SINGLE',
  address: {
    zipCode: employee.address?.zipCode || employee.cep || '',
    street: employee.address?.street || '',
    number: employee.address?.number || '',
    complement: employee.address?.complement || '',
    neighborhood: employee.address?.neighborhood || employee.bairro || '',
    city: employee.address?.city || employee.cidade || '',
    state: employee.address?.state || employee.estado || '',
    country: 'Brasil'
  },
  month: employee.month || '',
  year: employee.year || '',
  he50_qtd: employee.he50_qtd ?? 0,
  he100_qtd: employee.he100_qtd ?? 0,
  dsr_ativo: employee.dsr_ativo ?? true,
  adic_noturno_qtd: employee.adic_noturno_qtd ?? 0,
  insalubridade_grau: employee.insalubridade_grau || 'NONE',
  periculosidade_ativo: employee.periculosidade_ativo ?? false,
  comissoes: employee.comissoes ?? 0,
  gratificacoes: employee.gratificacoes ?? 0,
  premios: employee.premios ?? 0,
  ats_percentual: employee.ats_percentual ?? 0,
  arredondamento: employee.arredondamento ?? 0,
  dependentes_qtd: employee.dependentes_qtd ?? 0,
  dependentes_lista: Array.isArray(employee.dependentes_lista) ? employee.dependentes_lista : [],
  is_pcd: employee.is_pcd ?? false,
  tipo_deficiencia: employee.tipo_deficiencia || employee.deficiencia || '',
  faltas: employee.faltas ?? 0,
  atrasos: employee.atrasos ?? 0,
  adiantamento: employee.adiantamento ?? 0,
  pensao_alimenticia: employee.pensao_alimenticia ?? 0,
  consignado: employee.consignado ?? 0,
  outros_descontos: employee.outros_descontos ?? 0,
  coparticipacoes: employee.coparticipacoes ?? 0,
  inss: employee.inss ?? 0,
  fgts_retido: employee.fgts_retido ?? 0,
  irrf: employee.irrf ?? 0,
  fgts_patronal: employee.fgts_patronal ?? 0,
  inss_patronal: employee.inss_patronal ?? 0,
  rat: employee.rat ?? 0,
  terceiros: employee.terceiros ?? 0,
  total_proventos: employee.total_proventos ?? 0,
  total_descontos: employee.total_descontos ?? 0,
  salario_liquido: employee.salario_liquido ?? 0,
  otherMinistries: Array.isArray(employee.otherMinistries) ? employee.otherMinistries : [],
  bh_lancamentos: Array.isArray(employee.bh_lancamentos) ? employee.bh_lancamentos : [],
  // Documentos digitalizados (base64 data URLs)
  doc_rg_cnh:                  employee.doc_rg_cnh                  || employee[`doc_rg_cnh`]                  || null,
  doc_comprovante_residencia:  employee.doc_comprovante_residencia  || employee[`doc_comprovante_residencia`]  || null,
  doc_ctps:                    employee.doc_ctps                    || employee[`doc_ctps`]                    || null,
  doc_aso:                     employee.doc_aso                     || employee[`doc_aso`]                     || null,
  documentos_upload:           employee.documentos_upload           || null,
});

/**
 * Mapeia dados do banco (snake_case) para frontend (camelCase)
 * Remove lógica de compatibilidade legada - usa apenas campos atuais
 * COMPATIBILIDADE: aceita tanto 'celular' quanto 'whatsapp'
 */
const mapMemberFromApi = (member: any): Membro => {
  const profileData = member.dados_perfil || {};

  return {
    // Identificadores
    id_membro: member.id_membro || member.id || '',
    id_unidade: member.id_unidade || '',
    id_pessoa: member.id_pessoa || '',
    
    // Dados pessoais
    matricula: member.matricula || '',
    nome: member.nome || '',
    cpf: member.cpf || '',
    rg: member.rg || '',
    email: member.email || '',
    telefone: member.telefone || '',
    celular: member.celular || member.whatsapp || '', 
    whatsapp: member.whatsapp || member.celular || '', 
    profissao: member.profissao || '',
    funcao: member.funcao || 'MEMBER',
    situacao: member.situacao || member.status || 'ACTIVE',
    
    // Filiação
    nome_pai: member.nome_pai || '',
    nome_mae: member.nome_mae || '',
    
    // Saúde e emergência
    tipo_sanguineo: member.tipo_sanguineo || '',
    contato_emergencia: member.contato_emergencia || '',
    necessidades_especiais: member.necessidades_especiais || '',
    
    // Vida cristã
    data_conversao: member.data_conversao || '',
    local_conversao: member.local_conversao || '',
    data_batismo: member.data_batismo || '',
    igreja_batismo: member.igreja_batismo || '',
    pastor_batizador: member.pastor_batizador || '',
    batismo_espirito_santo: member.batismo_espirito_santo === true || member.batismo_espirito_santo === 'SIM' ? 'SIM' : 'NAO',
    
    // Formação e status
    data_ingresso: member.data_ingresso || member.data_membro || '',
    igreja_origem: member.igreja_origem || '',
    curso_discipulado: member.curso_discipulado || 'NAO_INICIADO',
    escola_biblica: member.escola_biblica || 'INATIVO',
    
    // Ministérios
    ministerio_principal: member.ministerio_principal || '',
    funcao_ministerio: member.funcao_ministerio || '',
    outros_ministerios: Array.isArray(member.outros_ministerios) ? member.outros_ministerios : [],
    cargo_eclesiastico: member.cargo_eclesiastico || '',
    data_consagracao: member.data_consagracao || '',
    talentos: member.talentos || '',
    dons_espirituais: member.dons_espirituais || '',
    cell_group: member.cell_group || '',
    
    // Financeiro
    dizimista: Boolean(member.dizimista),
    ofertante: Boolean(member.ofertante),
    eh_ofertante_regular: Boolean(member.eh_ofertante_regular),
    participa_campanhas: Boolean(member.participa_campanhas),
    
    // Dados bancários
    banco: member.banco || '',
    agencia_bancaria: member.agencia_bancaria || '',
    conta_bancaria: member.conta_bancaria || '',
    chave_pix: member.chave_pix || '',
    
    // Dados pessoais complementares
    data_nascimento: member.data_nascimento || '',
    sexo: member.sexo || 'M',
    estado_civil: member.estado_civil || 'SINGLE',
    nome_conjuge: member.nome_conjuge || '',
    data_casamento: member.data_casamento || '',
    
    // Endereço (achatado conforme Membro interface)
    cep: member.cep || '',
    endereco: member.endereco || member.logradouro || '',
    numero: member.numero || '',
    complemento: member.complemento || '',
    bairro: member.bairro || '',
    cidade: member.cidade || '',
    estado: member.estado || '',
    
    // Metadados
    observacoes: member.observacoes || '',
    tags: Array.isArray(member.tags) ? member.tags : [],
    id_familia: member.id_familia || member.familia_id || '',
    avatar: member.avatar || '',
    
    // De dados_perfil (campos extras antigos que ainda não migraram e compatibilidade)
    contribuicoes: member.contribuicoes || profileData.contribuicoes || [],
    dependentes: member.dependentes || profileData.dependentes || [],
    
    // LGPD
    lgpd_consent: member.lgpd_consent || profileData.lgpdConsent || {},
  };
};

const mapUnitFromApi = (unit: any) => ({
  id: unit.id,
  name: unit.nome_unidade || unit.name || '',
  cnpj: unit.cnpj || '',
  address: unit.endereco || unit.logradouro || unit.address || '',
  city: unit.cidade || unit.city || '',
  state: unit.estado || unit.state || '',
  email: unit.email || null,
  phone: unit.telefone || unit.phone || null,
  isHeadquarter: Boolean(unit.sede ?? unit.is_headquarter ?? unit.isHeadquarter)
});

/**
 * Mapeia dados do frontend (snake_case) para formato backend (snake_case)
 * O frontend já usa a interface Membro (snake_case).
 */
const mapMemberToApi = (member: any) => {
  // O frontend já está usando snake_case (Membro interface), 
  // então o mapeamento é quase uma identidade, mas garantimos que campos nulos sejam tratados.
  
  const payload: any = {
    id_membro: member.id_membro || member.id,
    id_unidade: normalizeUnitId(member.id_unidade || member.unidadeId),
    id_pessoa: member.id_pessoa,
    
    matricula: member.matricula,
    nome: member.nome,
    cpf: member.cpf,
    rg: member.rg || null,
    email: member.email || null,
    telefone: member.telefone || null,
    celular: member.celular || member.whatsapp || null,
    whatsapp: member.whatsapp || member.celular || null,
    
    data_nascimento: member.data_nascimento || null,
    sexo: member.sexo || 'M',
    estado_civil: member.estado_civil || 'SINGLE',
    
    situacao: member.situacao || member.status || 'ACTIVE',
    funcao: member.funcao || 'MEMBER',
    
    // Vida Cristã
    data_conversao: member.data_conversao || null,
    local_conversao: member.local_conversao || null,
    data_batismo: member.data_batismo || null,
    igreja_batismo: member.igreja_batismo || null,
    pastor_batizador: member.pastor_batizador || null,
    batismo_espirito_santo: member.batismo_espirito_santo === 'SIM',
    data_ingresso: member.data_ingresso || null,
    igreja_origem: member.igreja_origem || null,
    curso_discipulado: member.curso_discipulado || 'NAO_INICIADO',
    escola_biblica: member.escola_biblica || 'INATIVO',
    
    // Ministérios
    ministerio_principal: member.ministerio_principal || null,
    funcao_ministerio: member.funcao_ministerio || null,
    outros_ministerios: member.outros_ministerios || null,
    cargo_eclesiastico: member.cargo_eclesiastico || null,
    data_consagracao: member.data_consagracao || null,
    talentos: member.talentos || null,
    dons_espirituais: member.dons_espirituais || null,
    cell_group: member.cell_group || null,
    
    // Financeiro
    dizimista: Boolean(member.dizimista),
    ofertante: Boolean(member.ofertante),
    eh_ofertante_regular: Boolean(member.eh_ofertante_regular),
    participa_campanhas: Boolean(member.participa_campanhas),
    
    // Dados bancários
    banco: member.banco || null,
    agencia_bancaria: member.agencia_bancaria || null,
    conta_bancaria: member.conta_bancaria || null,
    chave_pix: member.chave_pix || null,
    
    // Família
    nome_pai: member.nome_pai || null,
    nome_mae: member.nome_mae || null,
    nome_conjuge: member.nome_conjuge || null,
    data_casamento: member.data_casamento || null,
    tipo_sanguineo: member.tipo_sanguineo || null,
    contato_emergencia: member.contato_emergencia || null,
    necessidades_especiais: member.necessidades_especiais || null,
    id_familia: member.id_familia || member.familia_id || null,
    
    // Endereço
    cep: member.cep || null,
    endereco: member.endereco || null,
    numero: member.numero || null,
    complemento: member.complemento || null,
    bairro: member.bairro || null,
    cidade: member.cidade || null,
    estado: member.estado || null,
    
    // Metadados
    observacoes: member.observacoes || null,
    tags: member.tags || null,
    avatar: member.avatar || null,
    
    // LGPD
    lgpd_consent: member.lgpd_consent || {},
    
    // Campos legados para compatibilidade do backend (se necessário)
    contribuicoes: member.contribuicoes || [],
    dependentes: member.dependentes || [],
  };
  
  return payload;
};

const mapEmployeeToApi = (employee: any) => ({
  ...(isPersistedId(employee.id) ? { id: employee.id } : {}),
  unit_id: normalizeUnitId(employee.unit_id || employee.unitId),
  employee_name: employee.employee_name || employee.employeeName,
  cpf: employee.cpf,
  rg: employee.rg || '',
  ctps: employee.ctps || '',
  ctps_serie: employee.ctps_serie || '',
  pis: employee.pis || '',
  birth_date: employee.birth_date || employee.birthDate || null,
  sexo: employee.sexo || employee.gender || null,
  estado_civil: employee.estado_civil || employee.maritalStatus || null,
  blood_type: employee.blood_type || employee.bloodType || '',
  email: employee.email || '',
  phone: employee.phone || '',
  celular: employee.celular || employee.phone || '',
  emergency_contact: employee.emergency_contact || employee.emergencyContact || '',
  naturalidade: employee.naturalidade || '',
  escolaridade: employee.escolaridade || '',
  raca_cor: employee.raca_cor || '',
  nome_mae: employee.nome_mae || '',
  nome_pai: employee.nome_pai || '',
  deficiencia: employee.deficiencia || employee.tipo_deficiencia || null,
  deficiencia_obs: employee.deficiencia_obs || '',
  cargo: employee.cargo || '',
  funcao: employee.funcao || '',
  departamento: employee.departamento || employee.department || '',
  cbo: employee.cbo || '',
  salario_base: employee.salario_base ?? employee.salary ?? 0,
  data_admissao: employee.data_admissao || employee.admissionDate || null,
  data_demissao: employee.data_demissao || null,
  matricula: employee.matricula || null,
  tipo_contrato: employee.tipo_contrato || null,
  regime_trabalho: employee.regime_trabalho || null,
  sindicato: employee.sindicato || '',
  convencao_coletiva: employee.convencao_coletiva || '',
  tipo_salario: employee.tipo_salario || '',
  forma_pagamento: optionalText(employee.forma_pagamento),
  dia_pagamento: optionalText(employee.dia_pagamento),
  jornada_trabalho: employee.jornada_trabalho || '',
  escala_trabalho: employee.escala_trabalho || '',
  horario_entrada: employee.horario_entrada || null,
  horario_saida: employee.horario_saida || null,
  inicio_intervalo: employee.inicio_intervalo || null,
  fim_intervalo: employee.fim_intervalo || null,
  duracao_intervalo: employee.duracao_intervalo || null,
  segunda_a_sexta: employee.segunda_a_sexta || '',
  sabado: employee.sabado || '',
  trabalha_feriados: Boolean(employee.trabalha_feriados),
  controla_intervalo: Boolean(employee.controla_intervalo),
  horas_extras_autorizadas: Boolean(employee.horas_extras_autorizadas),
  tipo_registro_ponto: employee.tipo_registro_ponto || '',
  tolerancia_ponto: employee.tolerancia_ponto || '',
  codigo_horario: employee.codigo_horario || '',
  banco: employee.banco || employee.bank || '',
  codigo_banco: employee.codigo_banco || '',
  agencia: employee.agencia || employee.bankAgency || '',
  conta: employee.conta || employee.bankAccount || '',
  tipo_conta: employee.tipo_conta || '',
  titular: employee.titular || '',
  chave_pix: employee.chave_pix || employee.pixKey || '',
  vt_ativo: Boolean(employee.vt_ativo),
  vt_valor_diario: employee.vt_valor_diario ?? 0,
  vt_qtd_vales_dia: employee.vt_qtd_vales_dia ?? 0,
  vale_transporte_total: employee.vale_transporte_total ?? 0,
  va_ativo: Boolean(employee.va_ativo),
  va_operadora: employee.va_operadora || '',
  vale_alimentacao: employee.vale_alimentacao ?? 0,
  vr_ativo: Boolean(employee.vr_ativo),
  vr_operadora: employee.vr_operadora || '',
  vale_refeicao: employee.vale_refeicao ?? 0,
  ps_ativo: Boolean(employee.ps_ativo),
  ps_operadora: employee.ps_operadora || '',
  ps_tipo_plano: employee.ps_tipo_plano || '',
  ps_carteirinha: employee.ps_carteirinha || '',
  plano_saude_colaborador: employee.plano_saude_colaborador ?? 0,
  ps_dependentes_ativo: Boolean(employee.ps_dependentes_ativo),
  plano_saude_dependentes: employee.plano_saude_dependentes ?? 0,
  po_ativo: Boolean(employee.po_ativo),
  po_operadora: employee.po_operadora || '',
  po_carteirinha: employee.po_carteirinha || '',
  plano_odontologico: employee.plano_odontologico ?? 0,
  auxilio_moradia: employee.auxilio_moradia ?? 0,
  vale_farmacia: employee.vale_farmacia ?? 0,
  seguro_vida: employee.seguro_vida ?? 0,
  titulo_eleitor: employee.titulo_eleitor || '',
  titulo_eleitor_zona: employee.titulo_eleitor_zona || '',
  titulo_eleitor_secao: employee.titulo_eleitor_secao || '',
  reservista: employee.reservista || '',
  cnh_numero: employee.cnh_numero || '',
  cnh_categoria: employee.cnh_categoria || '',
  cnh_vencimento: employee.cnh_vencimento || null,
  aso_data: employee.aso_data || null,
  esocial_categoria: employee.esocial_categoria || '',
  esocial_matricula: employee.esocial_matricula || '',
  esocial_natureza_atividade: employee.esocial_natureza_atividade || '',
  esocial_tipo_regime_prev: employee.esocial_tipo_regime_prev || '',
  esocial_tipo_regime_trab: employee.esocial_tipo_regime_trab || '',
  esocial_indicativo_admissao: employee.esocial_indicativo_admissao || '',
  esocial_tipo_jornada: employee.esocial_tipo_jornada || '',
  esocial_descricao_jornada: employee.esocial_descricao_jornada || '',
  esocial_contrato_parcial: Boolean(employee.esocial_contrato_parcial),
  esocial_teletrabalho: Boolean(employee.esocial_teletrabalho),
  esocial_clausula_asseguratoria: Boolean(employee.esocial_clausula_asseguratoria),
  esocial_sucessao_trab: Boolean(employee.esocial_sucessao_trab),
  esocial_tipo_admissao: employee.esocial_tipo_admissao || '',
  esocial_cnpj_anterior: employee.esocial_cnpj_anterior || '',
  esocial_matricula_anterior: employee.esocial_matricula_anterior || '',
  esocial_data_admissao_origem: employee.esocial_data_admissao_origem || null,
  observacoes_saude: employee.observacoes_saude || '',
  address_zip_code: employee.address?.zipCode || employee.cep || '',
  address_street: employee.address?.street || '',
  address_number: employee.address?.number || '',
  address_complement: employee.address?.complement || '',
  address_neighborhood: employee.address?.neighborhood || employee.bairro || '',
  address_city: employee.address?.city || employee.cidade || '',
  address_state: employee.address?.state || employee.estado || '',
  address_country: employee.address?.country || 'Brasil',
  avatar: employee.avatar || null,
  dados_perfil: buildEmployeeProfileData(employee),
  is_active: employee.is_active ?? employee.status !== 'INACTIVE'
});

const mapTransactionToApi = (transaction: any) => ({
  id: transaction.id_transacao || transaction.id,
  unit_id: normalizeUnitId(transaction.id_unidade || transaction.unit_id || transaction.unitId),
  descricao: transaction.descricao || transaction.description,
  valor: transaction.valor ?? transaction.amount ?? 0,
  tipo_transacao: transaction.tipo || transaction.tipo_transacao || transaction.type || 'SAIDA',
  situacao: transaction.situacao || transaction.status || 'PENDENTE',
  data_transacao: transaction.data_transacao || transaction.date || new Date().toISOString().split('T')[0],
  data_competencia: transaction.data_competencia || transaction.competencyDate || new Date().toISOString().split('T')[0],
  categoria: transaction.categoria || transaction.category || 'OUTROS',
  id_conta: transaction.id_conta || transaction.conta_id || transaction.accountId || null,
  id_membro: transaction.id_membro || transaction.membro_id || transaction.memberId || null,
  forma_pagamento: transaction.forma_pagamento || transaction.paymentMethod || null,
  natureza_operacao: transaction.natureza_operacao || transaction.operationNature || null,
  centro_custo: transaction.id_centro_custo || transaction.centro_custo || transaction.costCenter || null,
  projeto_id: transaction.id_projeto || transaction.projeto_id || transaction.projectId || null,
  nome_fornecedor: transaction.nome_fornecedor || transaction.providerName || null,
  data_vencimento: transaction.data_vencimento || transaction.dueDate || null,
  valor_pago: transaction.valor_pago ?? transaction.paidAmount ?? null,
  valor_restante: transaction.valor_restante ?? transaction.remainingAmount ?? null,
  parcelado: transaction.parcelado ?? transaction.isInstallment ?? false,
  numero_parcela: transaction.numero_parcela ?? transaction.installmentNumber ?? null,
  total_parcelas: transaction.total_parcelas ?? transaction.totalInstallments ?? null,
  id_transacao_origem: transaction.id_transacao_origem || transaction.pai_id || transaction.parentId || null,
  conciliado: transaction.conciliado ?? transaction.isConciliated ?? false,
  data_conciliacao: transaction.data_conciliacao || transaction.conciliationDate || null,
  observacoes: transaction.observacoes || transaction.notes || null,
  id_externo: transaction.id_externo || transaction.externalId || null,
});

export const dbService = {
  async getMembers(unitId?: string) {
      const response = await apiClient.get<any>('/members', {
        unitId: normalizeUnitId(unitId),
        limit: 500
      });
      return (response.members || []).map(mapMemberFromApi);
    },

  async saveMember(member: any) {
    const payload = mapMemberToApi(member);
    const saved = isPersistedId(member?.id)
      ? await apiClient.put<any>(`/members/${member.id}`, payload)
      : await apiClient.post<any>('/members', payload);
    // Mapear a resposta da API para o formato esperado pelo frontend
    return mapMemberFromApi(saved);
  },

  async updateMember(member: any) {
    if (!member?.id) throw new Error('ID do membro é obrigatório');
    const saved = await apiClient.put<any>(`/members/${member.id}`, mapMemberToApi(member));
    return mapMemberFromApi(saved);
  },

  async deleteMember(id: string) {
    return apiClient.delete(`/members/${id}`);
  },

  async getTransactions(unitId?: string) {
    return apiClient.get<any[]>('/transactions', {
      unitId: normalizeUnitId(unitId),
      limit: 500
    });
  },

  async saveTransaction(transaction: any) {
    const payload = mapTransactionToApi(transaction);
    if (isPersistedId(transaction?.id)) {
      const saved = await apiClient.put<any>(`/transactions/${transaction.id}`, payload);
      return saved.id;
    }
    const saved = await apiClient.post<any>('/transactions', payload);
    return saved.id;
  },

  async getAccounts(unitId?: string) {
    return apiClient.get<any[]>('/accounts', { unitId: normalizeUnitId(unitId) });
  },

  async saveAccount(account: any) {
    const payload = {
      unitId: account.unitId || account.unit_id,
      name: account.name,
      type: account.type || 'CASH',
      currentBalance: account.currentBalance ?? account.current_balance ?? 0,
      minimumBalance: account.minimumBalance ?? account.minimum_balance ?? null,
      status: account.status || 'ACTIVE',
      bankCode: account.bankCode || account.bank_code || null,
      agencyNumber: account.agencyNumber || account.agency_number || null,
      accountNumber: account.accountNumber || account.account_number || null,
    };
    if (isPersistedId(account?.id)) {
      const saved = await apiClient.put<any>(`/accounts/${account.id}`, payload);
      return saved.id;
    }
    const saved = await apiClient.post<any>('/accounts', payload);
    return saved.id;
  },

  async deleteAccount(id: string) {
    return apiClient.delete(`/accounts/${id}`);
  },

  async getEmployees(unitId?: string) {
    return apiClient.get<any[]>('/employees', { unitId: normalizeUnitId(unitId) });
  },

  async saveEmployee(employee: any) {
    const payload = mapEmployeeToApi(employee);
    const saved = isPersistedId(employee?.id)
      ? await apiClient.put<any>(`/employees/${employee.id}`, payload)
      : await apiClient.post<any>('/employees', payload);
    return saved.id;
  },

  async deleteEmployee(id: string) {
    return apiClient.delete(`/employees/${id}`);
  },

  async getLeaves(unitId?: string) {
    return apiClient.get<any[]>('/rh/leaves', { unitId: normalizeUnitId(unitId) });
  },

  async saveLeave(leave: any, isEditing?: boolean) {
    if (isEditing && isPersistedId(leave.id)) {
      return apiClient.put(`/rh/leaves/${leave.id}`, leave);
    }
    return apiClient.post('/rh/leaves', leave);
  },

  async deleteLeave(id: string) {
    return apiClient.delete(`/rh/leaves/${id}`);
  },

  async getUnits() {
    const response = await apiClient.get<{units: any[]}>('/units');
    return (response.units || []).map(mapUnitFromApi);
  },

  async getEvents(unitId?: string) {
    return apiClient.get<any[]>('/events', { unitId: normalizeUnitId(unitId) });
  }
};

export const accountService = {
  getAccounts: async (unitId?: string) => dbService.getAccounts(unitId),
  createAccount: async (account: any) => dbService.saveAccount(account),
  updateAccount: async (_id: string, account: any) => dbService.saveAccount(account),
  deleteAccount: async (id: string) => dbService.deleteAccount(id),
};

export const bankReconciliationService = {
  getReconciliations: async () => [],
  createReconciliation: async (_data: any) => {},
  updateReconciliation: async (_id: string, _data: any) => {}
};

export const payrollService = {
  getPayroll: async (unitId: string) => dbService.getEmployees(unitId),
  calculatePayroll: async (_data: any) => {},
  processPayroll: async (_data: any) => {}
};

export const exportService = {
  exportToPDF: async (_data: any) => {},
  exportToExcel: async (_data: any) => {},
  exportToCSV: async (_data: any) => {}
};

export const IndexedDBService = {
  init: async () => {},
  save: async (_key: string, _data: any) => {},
  get: async (_key: string) => null,
  delete: async (_key: string) => {}
};

export const UserService = {
  getUsers: async () => [],
  authenticate: async (_username: string, _password: string) => null,
  initializeDefaultUsers: async () => {}
};

export const AuditService = {
  logLogin: async (_userId: string, _userName: string, _unitId: string, _success: boolean) => {},
  logMenuAccess: async (_userId: string, _menu: string) => {}
};

export const DataInitializer = {
  initializeData: async (_unitId: string) => {}
};

export function useAudit(_user: any) {
  return {
    logMenuAccess: async (_menu: string) => {}
  };
}

export const DEFAULT_TAX_CONFIG = {
  inss: [],
  irrf: [],
  fgts: { rate: 0.08 }
};

/**
 * EXPORTAÇÕES PARA TESTES
 * Funções privadas expostas para testes automatizados
 */
export {
  mapMemberFromApi,
  mapMemberToApi,
  buildMemberProfileData,
};