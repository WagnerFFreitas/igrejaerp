// Script para atualizar dados do Wagner (membro e funcionário)
import { dbService } from '../services/databaseService';

// Dados completos do Wagner como membro
const wagnerMemberData = {
  id: 'wagner-member-001',
  unitId: 'u-sede',
  name: 'Wagner Ferreira Freitas',
  cpf: '123.456.789-10',
  rg: 'MG-12.345.679',
  email: 'wagner.freitas@email.com',
  phone: '(31) 98765-4320',
  whatsapp: '(31) 98765-4320',
  profession: 'Desenvolvedor de Sistemas',
  role: 'MEMBER' as const,
  status: 'ACTIVE' as const,
  
  // Filiação
  fatherName: 'José Ferreira da Silva',
  motherName: 'Maria Aparecida Freitas',
  
  // Emergência e Saúde
  bloodType: 'B+',
  emergencyContact: '(31) 91234-5679 - Ana Freitas (irmã)',
  
  // Vida Cristã
  conversionDate: '2010-05-20',
  conversionPlace: 'Igreja Batista Central',
  baptismDate: '2010-08-15',
  baptismChurch: 'Igreja Batista Central',
  baptizingPastor: 'Pastor Carlos Alberto',
  holySpiritBaptism: 'SIM' as const,
  
  // Formação e Status
  membershipDate: '2010-08-15',
  churchOfOrigin: 'Comunidade Evangélica Fé Viva',
  discipleshipCourse: 'CONCLUIDO' as const,
  biblicalSchool: 'ATIVO' as const,
  
  // Ministérios e Cargos
  mainMinistry: 'Mídia e Tecnologia',
  ministryRole: 'Líder de TI',
  otherMinistries: ['Louvor (Técnico)', 'Escola Dominical (Web)'],
  ecclesiasticalPosition: 'Membro',
  consecrationDate: '2018-03-10',
  
  // Financeiro Individual
  isTithable: true,
  isRegularGiver: true,
  participatesCampaigns: true,
  contributions: [
    {
      id: 'contrib_wagner_001',
      value: 1000,
      date: '2024-01-15',
      type: 'Dizimo' as const,
      description: 'Dízimo Janeiro 2024'
    },
    {
      id: 'contrib_wagner_002',
      value: 500,
      date: '2024-01-20',
      type: 'OFFERING' as const,
      description: 'Oferta Campanha Construção'
    }
  ],
  
  // Dados de RH / Pagamento
  bank: 'Banco do Brasil',
  bankAgency: '1234-5',
  bankAccount: '12345-6',
  pixKey: 'wagner.freitas@email.com',
  
  birthDate: '1988-03-15',
  gender: 'M' as const,
  maritalStatus: 'MARRIED' as const,
  spouseName: 'Carolina Freitas Mendes',
  marriageDate: '2015-12-20',
  spiritualGifts: 'Tecnologia, Ensino, Administração',
  cellGroup: 'Família Freitas',
  
  address: {
    zipCode: '30123-456',
    street: 'Rua das Tecnologias',
    number: '100',
    complement: 'Sala 201',
    neighborhood: 'Savassi',
    city: 'Belo Horizonte',
    state: 'MG'
  },
  
  observations: 'Membro ativo, líder do ministério de mídia e tecnologia, responsável pela infraestrutura de TI da igreja.',
  specialNeeds: 'Nenhuma',
  talents: 'Programação, design gráfico, áudio/vídeo, ensino',
  tags: ['tecnologia', 'midia', 'ti', 'escola_dominical'],
  avatar: 'https://ui-avatars.com/api/?name=Wagner+Ferreira&background=003399&color=fff&bold=true'
};

// Dados completos do Wagner como funcionário
const wagnerEmployeeData = {
  id: 'wagner-emp-001',
  unitId: 'u-sede',
  matricula: 'EMP2024003',
  employeeName: 'Wagner Ferreira Freitas',
  email: 'wagner.freitas@igreja.com.br',
  cpf: '123.456.789-10',
  rg: 'MG-12.345.679',
  pis: '123.45678.90-2',
  ctps: '00123456788',
  titulo_eleitor: '1234567890134',
  reservista: 'AM123457',
  aso_data: '2024-01-10',
  blood_type: 'B+',
  emergency_contact: '(31) 91234-5679 - Ana Freitas (irmã)',
  cargo: 'Coordenador de TI',
  funcao: 'Desenvolvimento e Suporte de Sistemas',
  departamento: 'Tecnologia da Informação',
  cbo: '2522-05',
  data_admissao: '2018-03-01',
  birthDate: '1988-03-15',
  tipo_contrato: 'CLT' as const,
  jornada_trabalho: '08:00 às 17:00',
  regime_trabalho: 'HIBRIDO' as const,
  salario_base: 4500.00,
  tipo_salario: 'MENSAL' as const,
  sindicato: 'Sindicato dos Trabalhadores em Tecnologia',
  convencao_coletiva: 'Convenção Coletiva 2024/2025',
  he50_qtd: 5,
  he100_qtd: 2,
  dsr_ativo: true,
  adic_noturno_qtd: 10,
  insalubridade_grau: 'NONE' as const,
  periculosidade_ativo: false,
  comissoes: 500.00,
  gratificacoes: 300.00,
  premios: 200.00,
  ats_percentual: 0,
  auxilio_moradia: 0,
  arredondamento: 0,
  dependentes_qtd: 2,
  dependentes_lista: [
    {
      id: 'dep_wagner_001',
      name: 'Pedro Freitas Mendes',
      birthDate: '2018-06-10',
      relationship: 'FILHO' as const,
      cpf: '234.567.890-12'
    },
    {
      id: 'dep_wagner_002',
      name: 'Laura Freitas Mendes',
      birthDate: '2020-03-25',
      relationship: 'FILHA' as const,
      cpf: '345.678.901-23'
    }
  ],
  is_pcd: false,
  tipo_deficiencia: '',
  banco: 'Banco do Brasil',
  codigo_banco: '001',
  agencia: '1234-5',
  conta: '12345-6',
  tipo_conta: 'CORRENTE' as const,
  titular: 'Wagner Ferreira Freitas',
  chave_pix: 'wagner.freitas@igreja.com.br',
  vt_ativo: true,
  vale_transporte_total: 200.00,
  va_ativo: true,
  vale_alimentacao: 300.00,
  vr_ativo: true,
  vale_refeicao: 100.00,
  ps_ativo: true,
  plano_saude_colaborador: 200.00,
  po_ativo: false,
  plano_saude_dependentes: 300.00,
  vale_farmacia: 100.00,
  seguro_vida: 50.00,
  faltas: 0,
  atrasos: 1
};

// Função para atualizar os dados do Wagner
export const updateWagnerData = async () => {
  try {
    console.log('🔄 Iniciando atualização dos dados do Wagner...');
    
    // Atualizar dados como membro
    console.log('👤 Atualizando Wagner como membro...');
    await dbService.saveMember(wagnerMemberData);
    console.log(`✅ Membro Wagner atualizado: ${wagnerMemberData.name}`);
    
    // Atualizar dados como funcionário
    console.log('💼 Atualizando Wagner como funcionário...');
    await dbService.saveEmployee(wagnerEmployeeData);
    console.log(`✅ Funcionário Wagner atualizado: ${wagnerEmployeeData.employeeName}`);
    
    console.log('🎉 Dados do Wagner atualizados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar dados do Wagner:', error);
  }
};

// Exportar para uso no console
export { wagnerMemberData, wagnerEmployeeData };
