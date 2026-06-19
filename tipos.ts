/**
 * ============================================================================
 * TIPOS.TS (PADRONIZADO EM PORTUGUÊS)
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Definições de tipos e interfaces globais, agora 100% em português.
 */

// ============================================================================
// TIPOS E ENUMS GLOBAIS
// ============================================================================

export type PerfilUsuario = 'ADMIN' | 'SECRETARIO' | 'TESOUREIRO' | 'PASTOR' | 'RH' | 'DP' | 'FINANCEIRO' | 'DESENVOLVEDOR';

export type TipoAfastamento = 'FERIAS' | 'MEDICO' | 'MATERNIDADE' | 'PATERNIDADE' | 'MILITAR' | 'CASAMENTO' | 'LUTO' | 'NAO_REMUNERADO';

export type RegimeContratacao = 'CLT' | 'PRO_LABORE' | 'ESTAGIO' | 'AUTONOMO';

export type TipoPatrimonio = 'IMOVEIS' | 'VEICULOS' | 'EQUIPAMENTOS' | 'MOVEIS' | 'COMPUTADORES' | 'MAQUINAS';

export type SituacaoPatrimonio = 'ATIVO' | 'MANUTENCAO' | 'OCIOSO' | 'BAIXADO' | 'SUCATA';

export type MetodoDepreciacao = 'LINEAR' | 'ACELERADA';


// ============================================================================
// INTERFACES CORE
// ============================================================================

export interface Usuario {
  id_usuario: string;
  id_pessoa: string;
  nome: string;
  username: string;
  email?: string;
  role: PerfilUsuario;
  avatar?: string;
  id_unidade: string;
  permissoes?: Array<{
    codigoModulo: string;
    podeLer: boolean;
    podeEscrever: boolean;
    podeExcluir: boolean;
    podeGerenciar: boolean;
  }>;
  acessoIrrestrito?: boolean;
}

export interface Unidade {
  id_unidade: string;
  nome: string;
  cnpj: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  email?: string;
  telefone?: string;
  cep?: string;
  numero?: string;
  bairro?: string;
  situacao?: string;
  data_criacao?: string;
}

export interface Membro {
  id_membro: string;
  id_pessoa?: string;
  id_unidade?: string;
  matricula: string;
  nome: string;
  cpf: string;
  rg: string;
  email: string;
  telefone: string;
  celular?: string;
  whatsapp?: string;
  data_nascimento: string;
  sexo: 'M' | 'F' | 'OUTRO';
  estado_civil: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO';
  data_conversao?: string;
  local_conversao?: string;
  data_batismo?: string;
  igreja_batismo?: string;
  pastor_batizador?: string;
  batismo_espirito_santo?: string;
  data_ingresso?: string;
  igreja_origem?: string;
  curso_discipulado?: string;
  escola_biblica?: string;
  ministerio_principal?: string;
  funcao_ministerio?: string;
  outros_ministerios?: string[];
  cargo_eclesiastico?: string;
  data_consagracao?: string;
  situacao: 'ATIVO' | 'INATIVO' | 'PENDENTE';
  funcao: 'MEMBRO' | 'LIDER' | 'PASTOR' | 'VISITANTE';
  dizimista: boolean;
  ofertante: boolean;
  eh_ofertante_regular?: boolean;
  participa_campanhas?: boolean;
  contribuicoes?: ContribuicaoMembro[];
  banco?: string;
  agencia_bancaria?: string;
  conta_bancaria?: string;
  chave_pix?: string;
  nome_pai?: string;
  nome_mae?: string;
  nome_conjuge?: string;
  data_casamento?: string;
  tipo_sanguineo?: string;
  contato_emergencia?: string;
  necessidades_especiais?: string;
  id_familia?: string;
  dependentes?: Dependente[];
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  talentos?: string;
  dons_espirituais?: string;
  grupo_pequeno?: string;
  profissao?: string;
  escolaridade?: string;
  pcd?: boolean;
  tipo_deficiencia?: string;
  tags?: string[];
  email_pessoal?: string;
  observacoes?: string;
  data_criacao?: string;
  data_atualizacao?: string;
  ativo?: boolean;
  avatar?: string;
  consentimento_lgpd?: any;
}

export interface Funcionario {
  id_funcionario: string;
  id_pessoa?: string;
  id_unidade?: string;
  nome: string;
  email?: string;
  cargo?: string;
  departamento?: string;
  salario_base?: number;
  carga_horaria_semanal?: number;
  dependentes?: Dependente[];
  conta_bancaria?: {
    banco?: string;
    agencia?: string;
    conta?: string;
  };
  ativo?: boolean;
  status?: 'ATIVO' | 'INATIVO' | 'AFASTADO';
  data_rescisao?: string;
  observacoes?: string;
  telefone?: string;
  celular?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    pais?: string;
  };
  data_admissao?: string;
}

export interface Dependente {
  id: string;
  nome: string;
  data_nascimento: string;
  parentesco: 'FILHO' | 'FILHA' | 'CONJUGE' | 'PAI' | 'MAE' | 'OUTRO';
  cpf?: string;
}

// ============================================================================
// INTERFACES FINANCEIRAS
// ============================================================================

export interface ContaBancaria {
  id_conta: string;
  id_unidade: string;
  nome: string;
  tipo: 'DINHEIRO' | 'BANCO' | 'POUPANCA' | 'INVESTIMENTO';
  saldo_atual: number;
  saldo_minimo?: number;
  situacao: 'ATIVO' | 'INATIVO' | 'BLOQUEADO';
  codigo_banco?: string;
  nome_banco?: string;
  numero_agencia?: string;
  numero_conta?: string;
  data_criacao?: string;
  data_atualizacao?: string;
}

export interface Transacao {
  id_transacao: string;
  id_unidade: string;
  tipo: 'ENTRADA' | 'SAIDA';
  categoria: string;
  descricao: string;
  valor: number;
  data_transacao: string;
  data_competencia?: string;
  data_vencimento?: string;
  situacao: 'PENDENTE' | 'REALIZADO' | 'CANCELADO';
  forma_pagamento?: string;
  id_pessoa?: string;
  id_membro?: string;
  id_conta?: string;
  id_centro_custo?: string;
  id_projeto?: string;
  natureza_operacao?: string;
  nome_fornecedor?: string;
  valor_pago?: number;
  valor_restante?: number;
  parcelado?: boolean;
  total_parcelas?: number;
  numero_parcela?: number;
  id_transacao_origem?: string;
  conciliado?: boolean;
  data_conciliacao?: string;
  observacoes?: string;
  id_externo?: string;
  data_criacao?: string;
  data_atualizacao?: string;
}

export interface ContribuicaoMembro {
  id: string;
  valor: number;
  data: string;
  tipo: 'DIZIMO' | 'OFERTA' | 'CAMPANHA';
  descricao?: string;
}

// ============================================================================
// INTERFACES DE PATRIMÔNIO
// ============================================================================

export interface Patrimonio {
  id: string;
  id_unidade: string;
  categoria: TipoPatrimonio;
  nome: string;
  descricao: string;
  data_aquisicao: string;
  valor_aquisicao: number;
  valor_atual: number;
  fornecedor?: string;
  numero_nota_fiscal?: string;
  numero_serie?: string;
  marca?: string;
  modelo?: string;
  localizacao: string;
  responsavel?: string;
  situacao: SituacaoPatrimonio;
  fotos?: string[];
  documentos?: string[];
  vida_util_meses: number;
  taxa_depreciacao: number;
  metodo_depreciacao: MetodoDepreciacao;
  valor_contabil_atual: number;
  depreciacao_acumulada: number;
  valor_residual?: number;
  data_ultimo_inventario?: string;
  contagem_inventario?: number;
  numero_patrimonio: string;
  condicao: 'NOVO' | 'BOM' | 'REGULAR' | 'RUIM' | 'SUCATA';
  observacoes?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    pais?: string;
  };
  criado_em: string;
  atualizado_em: string;
}

// ============================================================================
// INTERFACES DE RH E FOLHA DE PAGAMENTO
// ============================================================================

export interface PeriodoFolha {
  id: string;
  mes: number;
  ano: number;
  situacao: 'ABERTO' | 'FECHADO' | 'PROCESSANDO';
  data_inicio: string;
  data_final: string;
  processado_em?: string;
  fechado_em?: string;
  total_funcionarios?: number;
  total_folha?: number;
  total_inss?: number;
  total_fgts?: number;
  total_irrf?: number;
  id_unidade: string;
  criado_por?: string;
  observacoes?: string;
}

export interface AfastamentoFuncionario {
  id: string;
  id_unidade?: string;
  id_funcionario: string;
  nome_funcionario?: string;
  tipo: TipoAfastamento;
  data_inicio: string;
  data_final: string;
  cid10?: string;
  nome_medico?: string;
  crm?: string;
  status: 'AGENDADO' | 'ATIVO' | 'CONCLUIDO' | 'CANCELADO';
  observacoes?: string;
  anexo_url?: string;
}

// Adicionado para compatibilidade, mas idealmente usar AfastamentoFuncionario
export type LicencaFuncionario = AfastamentoFuncionario;

export interface CalculoFolhaPagamento {
  id_funcionario: string;
  mes_competencia: string; // (YYYY-MM)
  salario_bruto: number;

  proventos: {
    salario_base: number;
    horas_extras?: number;
    adicional_noturno?: number;
    insalubridade?: number;
    comissao?: number;
    bonificacoes?: number;
    salario_familia?: number;
    outros?: number;
  };

  descontos: {
    inss: number;
    irrf: number;
    fgts: number; // Informativo
    contribuicao_sindical?: number;
    plano_saude?: number;
    plano_odontologico?: number;
    vale_alimentacao?: number;
    vale_refeicao?: number;
    vale_transporte?: number;
    vale_farmacia?: number;
    seguro_vida?: number;
    adiantamento?: number;
    consignado?: number;
    coparticipacao?: number;
    faltas?: number;
    atrasos?: number;
    pensao_alimenticia?: number;
    outros?: number;
  };

  totais: {
    total_proventos: number;
    total_descontos: number;
    salario_liquido: number;
    custo_empregador: number;
  };

  detalhes_calculo: {
    base_inss: number;
    aliquota_inss: number;
    valor_inss: number;
    base_irrf: number;
    aliquota_irrf: number;
    deducao_irrf: number;
    valor_irrf: number;
    base_fgts: number;
    aliquota_fgts: number;
    valor_fgts: number;
  };
}

export interface Holerite {
  id_folha: string;
  funcionario: Funcionario;
  calculo: CalculoFolhaPagamento;
  gerado_em: string;
  pdf_url?: string;
}

// ============================================================================
// INTERFACES DE EVENTOS
// ============================================================================

export interface EventoIgreja {
  id: string;
  id_unidade?: string;
  titulo: string;
  descricao?: string;
  data: string;
  hora: string;
  local: string;
  qtd_participantes?: number;
  tipo: 'CULTO' | 'REUNIAO' | 'EVENTO';
  escala_voluntarios?: EscalaVoluntario[];
  recorrente?: boolean;
  padrao_recorrencia?: 'NENHUM' | 'SEMANAL' | 'MENSAL';
  data_fim_recorrencia?: string;
  id_evento_pai?: string;
  eh_evento_gerado?: boolean;
}

export interface EscalaVoluntario {
  id: string;
  ministerio: string;
  funcao: string;
  id_voluntario?: string;
  nome_voluntario?: string;
  telefone_voluntario?: string;
  email_voluntario?: string;
  confirmado: boolean;
  observacoes?: string;
  qtd_necessaria: number;
  qtd_designada: number;
}

// ============================================================================
// INTERFACES DE SISTEMA, AUDITORIA E LGPD
// ============================================================================

export interface LogAuditoria {
  id: string;
  id_unidade: string;
  id_usuario: string;
  nome_usuario: string;
  acao: string;
  entidade: string;
  id_entidade?: string;
  nome_entidade?: string;
  data: string;
  ip: string;
  navegador?: string;
  detalhes?: any;
  sucesso?: boolean;
  mensagem_erro?: string;
  hash_anterior?: string | null;
  hash?: string;
  imutavel?: boolean;
  criado_em?: string;
}

export interface ConsentimentoLGPD {
  id: string;
  id_usuario: string;
  tipo_usuario: 'MEMBRO' | 'FUNCIONARIO';
  tipo_consentimento: 'PROCESSAMENTO_DADOS' | 'COMUNICACAO' | 'MARKETING' | 'FINANCEIRO';
  concedido: boolean;
  data_consentimento: string;
  endereco_ip?: string;
  navegador?: string;
  versao_politica: string;
  data_revogacao?: string;
  motivo_revogacao?: string;
  id_unidade: string;
  criado_em: string;
  atualizado_em: string;
}

export interface PoliticaLGPD {
  id: string;
  versao: string;
  titulo: string;
  conteudo: string;
  data_efetiva: string;
  ativa: boolean;
  id_unidade: string;
  criado_em: string;
  atualizado_em: string;
}

