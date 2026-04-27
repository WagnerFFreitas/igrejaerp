/**
 * ============================================================================
 * MEMBERSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para member service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import apiClient from './apiService';
import { Member } from '../../types';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (member service).
 */

// Interface removida duplicata, agora importada de types.ts

// Interface da API (resposta real)
// Interface da API (reflete o banco de dados em PT/snake_case)
export interface ApiMember {
  id: string;
  unidade_id: string;
  unit_id?: string;
  matricula?: string;
  nome: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  whatsapp?: string;
  profissao?: string;
  funcao: 'MEMBER' | 'VISITOR' | 'VOLUNTEER' | 'STAFF' | 'LEADER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  data_nascimento: string;
  sexo: 'M' | 'F' | 'OTHER';
  estado_civil: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  nome_conjuge?: string;
  data_casamento?: string;
  nome_pai?: string;
  nome_mae?: string;
  tipo_sanguineo?: string;
  contato_emergencia?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  data_conversao?: string;
  local_conversao?: string;
  data_batismo?: string;
  igreja_batismo?: string;
  pastor_batizador?: string;
  batismo_espirito_santo?: 'SIM' | 'NAO';
  data_membro?: string;
  igreja_origem?: string;
  curso_discipulado?: 'NAO_INICIADO' | 'EM_ANDAMENTO' | 'CONCLUIDO';
  escola_biblica?: 'ATIVO' | 'INATIVO' | 'NAO_FREQUENTA';
  ministerio_principal?: string;
  funcao_ministerio?: string;
  outros_ministerios?: string[];
  cargo_eclesiastico?: string;
  data_consagracao?: string;
  eh_dizimista?: boolean;
  dizimista?: boolean;
  eh_ofertante_regular?: boolean;
  ofertante_regular?: boolean;
  participa_campanhas: boolean;
  banco?: string;
  agencia_bancaria?: string;
  conta_bancaria?: string;
  chave_pix?: string;
  observacoes?: string;
  necessidades_especiais?: string;
  talentos?: string;
  tags?: string[];
  familia_id?: string;
  avatar?: string;
  profile_data?: Record<string, any>;
  criado: string;
  atualizado: string;
  unit_name?: string;
}

// Adaptador para transformar dados da API para a interface do frontend
function adaptApiMember(apiMember: ApiMember): Member {
  return {
    id: apiMember.id,
    unidadeId: apiMember.unidade_id,
    unitId: apiMember.unidade_id || apiMember.unit_id,
    unit_id: apiMember.unidade_id || apiMember.unit_id,
    matricula: apiMember.matricula || '',
    nome: apiMember.nome,
    cpf: apiMember.cpf,
    rg: apiMember.rg || '',
    email: apiMember.email || '',
    telefone: apiMember.telefone || '',
    whatsapp: apiMember.whatsapp || '',
    profissao: apiMember.profissao || '',
    funcao: apiMember.funcao,
    status: apiMember.status,
    nomePai: apiMember.nome_pai || '',
    nomeMae: apiMember.nome_mae || '',
    tipoSanguineo: apiMember.tipo_sanguineo || '',
    contatoEmergencia: apiMember.contato_emergencia || '',
    dataConversao: apiMember.data_conversao || '',
    localConversao: apiMember.local_conversao || '',
    dataBatismo: apiMember.data_batismo || '',
    igrejaBatismo: apiMember.igreja_batismo || '',
    pastorBatizador: apiMember.pastor_batizador || '',
    batismoEspiritoSanto: apiMember.batismo_espirito_santo || 'NAO',
    dataMembro: apiMember.data_membro || '',
    igrejaOrigem: apiMember.igreja_origem || '',
    cursoDiscipulado: apiMember.curso_discipulado || 'NAO_INICIADO',
    escolaBiblica: apiMember.escola_biblica || 'NAO_FREQUENTA',
    ministerioPrincipal: apiMember.ministerio_principal || '',
    funcaoMinisterio: apiMember.funcao_ministerio || '',
    outrosMinisterios: apiMember.outros_ministerios || [],
    cargoEclesiastico: apiMember.cargo_eclesiastico || '',
    dataConsagracao: apiMember.data_consagracao || '',
  ehDizimista: apiMember.eh_dizimista ?? apiMember.dizimista ?? false,
  ehOfertanteRegular: apiMember.eh_ofertante_regular ?? apiMember.ofertante_regular ?? false,
    participaCampanhas: apiMember.participa_campanhas,
    banco: apiMember.banco || '',
    agenciaBancaria: apiMember.agencia_bancaria || '',
    contaBancaria: apiMember.conta_bancaria || '',
    chavePix: apiMember.chave_pix || '',
    dataNascimento: apiMember.data_nascimento,
    sexo: apiMember.sexo,
    estadoCivil: apiMember.estado_civil,
    nomeConjuge: apiMember.nome_conjuge || '',
    dataCasamento: apiMember.data_casamento || '',
    talentos: apiMember.talentos || '',
    cellGroup: (apiMember as any).cell_group || apiMember.profile_data?.cellGroup || '',
    endereco: {
      cep: apiMember.cep,
      logradouro: apiMember.logradouro,
      numero: apiMember.numero || '',
      complemento: apiMember.complemento || '',
      bairro: apiMember.bairro || '',
      cidade: apiMember.cidade || '',
      estado: apiMember.estado || '',
    },
    observacoes: apiMember.observacoes || '',
    necessidadesEspeciais: apiMember.necessidades_especiais || '',
    tags: apiMember.tags || [],
    familiaId: apiMember.familia_id || '',
    donsEspirituais: apiMember.profile_data?.donsEspirituais || '',
    avatar: apiMember.avatar || `https://ui-avatars.com/api/?nome=${encodeURIComponent(apiMember.nome || 'M')}&background=003399&color=fff&bold=true`,
    profile_data: apiMember.profile_data,
    created_at: apiMember.criado,
    updated_at: apiMember.atualizado,
    unit_name: apiMember.unit_name,
    contribuicoes: apiMember.profile_data?.contribuicoes || [],
    dependentes: apiMember.profile_data?.dependentes || [],
  } as any;
}

function mapCargoToRole(cargo: string | null | undefined): 'MEMBER' | 'VISITOR' | 'VOLUNTEER' | 'STAFF' | 'LEADER' {
  if (!cargo) return 'MEMBER';
  switch (cargo.toLowerCase()) {
    case 'pastor':
    case 'pastora':
      return 'LEADER';
    case 'presbítero':
    case 'presbitera':
    case 'ancião':
    case 'diaconisa':
      return 'LEADER';
    case 'diácono':
      return 'STAFF';
    case 'líder':
      return 'LEADER';
    case 'membro':
    default:
      return 'MEMBER';
  }
}

export interface MemberListResponse {
  members: ApiMember[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Dependent {
  id: string;
  membro_id: string;
  nome: string;
  data_nascimento: string;
  parentesco: string;
  cpf?: string;
  created_at: string;
}

export interface Contribution {
  id: string;
  membro_id: string;
  valor: number;
  data: string;
  tipo: string;
  descricao?: string;
  criado: string;
}

export class MemberService {
  // Listar membros
  static async getMembers(params?: {
    unitId?: string;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{members: Member[], pagination: any}> {
    const response = await apiClient.get<MemberListResponse>('/members', params);
    
    // Adaptar os dados da API para a interface do frontend
    const adaptedMembers = response.members.map(adaptApiMember);
    
    return {
      members: adaptedMembers,
      pagination: response.pagination
    };
  }

  // Obter membro por ID
  static async getMemberById(id: string): Promise<Member> {
    return await apiClient.get(`/members/${id}`);
  }

  // Criar membro
  static async createMember(memberData: Partial<Member>): Promise<Member> {
    return await apiClient.post('/members', memberData);
  }

  // Atualizar membro
  static async updateMember(id: string, memberData: Partial<Member>): Promise<Member> {
    return await apiClient.put(`/members/${id}`, memberData);
  }

  // Remover membro (soft delete)
  static async deleteMember(id: string): Promise<void> {
    return await apiClient.delete(`/members/${id}`);
  }

  // Adicionar dependente
  static async addDependent(memberId: string, dependentData: Partial<Dependent>): Promise<Dependent> {
    return await apiClient.post(`/members/${memberId}/dependents`, dependentData);
  }

  // Adicionar contribuição
  static async addContribution(memberId: string, contributionData: Partial<Contribution>): Promise<Contribution> {
    return await apiClient.post(`/members/${memberId}/contributions`, contributionData);
  }

  // Buscar dependentes
  static async getDependents(memberId: string): Promise<Dependent[]> {
    const member = await this.getMemberById(memberId);
    return (member.dependentes as any) || [];
  }

  // Buscar contribuições
  static async getContributions(memberId: string): Promise<Contribution[]> {
    const member = await this.getMemberById(memberId);
    return (member.contribuicoes as any) || [];
  }
}

export default MemberService;
