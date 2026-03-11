// Script para criar dados fictícios de membros e funcionários
import { dbService } from '../services/databaseService';

// Dados fictícios de membros
const mockMembers = [
  {
    id: 'member_001',
    unitId: 'u-sede',
    name: 'Maria Silva Santos',
    cpf: '123.456.789-01',
    rg: 'MG-12.345.678',
    email: 'maria.santos@email.com',
    phone: '(31) 98765-4321',
    whatsapp: '(31) 98765-4321',
    profession: 'Professora',
    role: 'MEMBER' as const,
    status: 'ACTIVE' as const,
    
    // Filiação
    fatherName: 'João Silva Santos',
    motherName: 'Maria Aparecida Silva',
    
    // Emergência e Saúde
    bloodType: 'O+',
    emergencyContact: '(31) 91234-5678 - João Silva (irmão)',
    
    // Vida Cristã
    conversionDate: '2018-03-15',
    conversionPlace: 'Igreja Batista Central',
    baptismDate: '2018-06-20',
    baptismChurch: 'Igreja Batista Central',
    baptizingPastor: 'Pastor Carlos Alberto',
    holySpiritBaptism: 'SIM' as const,
    
    // Formação e Status
    membershipDate: '2018-06-20',
    churchOfOrigin: 'Igreja Batista Central',
    discipleshipCourse: 'CONCLUIDO' as const,
    biblicalSchool: 'ATIVO' as const,
    
    // Ministérios e Cargos
    mainMinistry: 'Escola Dominical',
    ministryRole: 'Professora de Adolescentes',
    otherMinistries: ['Louvor', 'Evangelismo'],
    ecclesiasticalPosition: 'Membro',
    consecrationDate: '2022-01-15',
    
    // Financeiro Individual
    isTithable: true,
    isRegularGiver: true,
    participatesCampaigns: true,
    contributions: [
      {
        id: 'contrib_001',
        value: 500,
        date: '2024-01-15',
        type: 'TITHE' as const,
        description: 'Dízimo Janeiro 2024'
      }
    ],
    
    // Dados de RH / Pagamento
    bank: 'Banco do Brasil',
    bankAgency: '1234-5',
    bankAccount: '12345-6',
    pixKey: 'maria.santos@email.com',
    
    birthDate: '1985-07-22',
    gender: 'F' as const,
    maritalStatus: 'MARRIED' as const,
    spouseName: 'Pedro Santos Oliveira',
    marriageDate: '2012-12-15',
    spiritualGifts: 'Ensino, Administração',
    cellGroup: 'Família Santos',
    
    address: {
      zipCode: '30123-456',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 201',
      neighborhood: 'Centro',
      city: 'Belo Horizonte',
      state: 'MG'
    },
    
    observations: 'Membro ativo e dedicado, participa regularmente dos cultos e atividades da igreja.',
    specialNeeds: 'Alergia a amendoim',
    talents: 'Canto, ensino, organização de eventos',
    tags: ['escola_dominical', 'louvor', 'evangelismo'],
    avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=ff6b6b&color=fff&bold=true'
  },
  {
    id: 'member_002',
    unitId: 'u-sede',
    name: 'José Carlos Pereira',
    cpf: '987.654.321-09',
    rg: 'MG-98.765.432',
    email: 'jose.pereira@email.com',
    phone: '(31) 91234-5678',
    whatsapp: '(31) 91234-5678',
    profession: 'Engenheiro Civil',
    role: 'LEADER' as const,
    status: 'ACTIVE' as const,
    
    // Filiação
    fatherName: 'Antônio Pereira Neto',
    motherName: 'Francisca Carlos Pereira',
    
    // Emergência e Saúde
    bloodType: 'A+',
    emergencyContact: '(31) 99876-5432 - Maria Pereira (esposa)',
    
    // Vida Cristã
    conversionDate: '2015-08-10',
    conversionPlace: 'Igreja Batista Central',
    baptismDate: '2015-12-25',
    baptismChurch: 'Igreja Batista Central',
    baptizingPastor: 'Pastor Carlos Alberto',
    holySpiritBaptism: 'SIM' as const,
    
    // Formação e Status
    membershipDate: '2015-12-25',
    churchOfOrigin: 'Comunidade Evangélica Vida Nova',
    discipleshipCourse: 'CONCLUIDO' as const,
    biblicalSchool: 'ATIVO' as const,
    
    // Ministérios e Cargos
    mainMinistry: 'Conselho',
    ministryRole: 'Líder de Construção',
    otherMinistries: ['Construção', 'Manutenção'],
    ecclesiasticalPosition: 'Diácono',
    consecrationDate: '2020-03-20',
    
    // Financeiro Individual
    isTithable: true,
    isRegularGiver: true,
    participatesCampaigns: true,
    contributions: [
      {
        id: 'contrib_002',
        value: 800,
        date: '2024-01-15',
        type: 'TITHE' as const,
        description: 'Dízimo Janeiro 2024'
      }
    ],
    
    // Dados de RH / Pagamento
    bank: 'Caixa Econômica Federal',
    bankAgency: '5678-9',
    bankAccount: '98765-4',
    pixKey: 'jose.pereira@email.com',
    
    birthDate: '1980-04-15',
    gender: 'M' as const,
    maritalStatus: 'MARRIED' as const,
    spouseName: 'Maria Pereira Silva',
    marriageDate: '2010-05-20',
    spiritualGifts: 'Liderança, Administração, Construção',
    cellGroup: 'Família Pereira',
    
    address: {
      zipCode: '30145-678',
      street: 'Avenida Contorno',
      number: '456',
      complement: 'Casa',
      neighborhood: 'Savassi',
      city: 'Belo Horizonte',
      state: 'MG'
    },
    
    observations: 'Líder dedicado, responsável pela equipe de construção e manutenção do templo.',
    specialNeeds: 'Nenhuma',
    talents: 'Construção civil, liderança, manutenção',
    tags: ['conselho', 'construcao', 'manutencao'],
    avatar: 'https://ui-avatars.com/api/?name=Jose+Pereira&background=4dabf7&color=fff&bold=true'
  }
];

// Dados fictícios de funcionários
const mockEmployees = [
  {
    id: 'employee_001',
    unitId: 'u-sede',
    matricula: 'EMP2024001',
    employeeName: 'Ana Beatriz Costa Silva',
    email: 'ana.costa@igreja.com.br',
    cpf: '456.789.123-45',
    rg: 'MG-45.678.912',
    pis: '123.45678.90-1',
    ctps: '00123456789',
    titulo_eleitor: '1234567890123',
    reservista: 'AM123456',
    aso_data: '2024-01-15',
    blood_type: 'A+',
    emergency_contact: '(31) 91234-5678 - Maria Costa (mãe)',
    cargo: 'Secretária Executiva',
    funcao: 'Suporte Administrativo',
    departamento: 'Secretaria',
    cbo: '2521-05',
    data_admissao: '2020-03-15',
    birthDate: '1992-08-25',
    tipo_contrato: 'CLT' as const,
    jornada_trabalho: '08:00 às 17:00',
    regime_trabalho: 'PRESENCIAL' as const,
    salario_base: 2500.00,
    tipo_salario: 'MENSAL' as const,
    sindicato: 'Sindicato dos Trabalhadores em Educação',
    convencao_coletiva: 'Convenção Coletiva 2024/2025',
    he50_qtd: 2,
    he100_qtd: 0,
    dsr_ativo: true,
    adic_noturno_qtd: 4,
    insalubridade_grau: 'NONE' as const,
    periculosidade_ativo: false,
    comissoes: 0,
    gratificacoes: 200.00,
    premios: 0,
    ats_percentual: 0,
    auxilio_moradia: 0,
    arredondamento: 0,
    dependentes_qtd: 1,
    dependentes_lista: [
      {
        id: 'dep_001',
        name: 'Lucas Costa Silva',
        birthDate: '2015-03-10',
        relationship: 'FILHO' as const,
        cpf: '789.012.345-67'
      }
    ],
    is_pcd: false,
    tipo_deficiencia: '',
    banco: 'Banco do Brasil',
    codigo_banco: '001',
    agencia: '1234-5',
    conta: '12345-6',
    tipo_conta: 'CORRENTE' as const,
    titular: 'Ana Beatriz Costa Silva',
    chave_pix: 'ana.costa@igreja.com.br',
    vt_ativo: true,
    vale_transporte_total: 150.00,
    va_ativo: true,
    vale_alimentacao: 200.00,
    vr_ativo: false,
    vale_refeicao: 0,
    ps_ativo: true,
    plano_saude_colaborador: 150.00,
    po_ativo: false,
    plano_saude_dependentes: 100.00,
    vale_farmacia: 0,
    seguro_vida: 0,
    faltas: 0,
    atrasos: 0
  },
  {
    id: 'employee_002',
    unitId: 'u-sede',
    matricula: 'EMP2024002',
    employeeName: 'Carlos Roberto Mendes',
    email: 'carlos.mendes@igreja.com.br',
    cpf: '789.012.345-67',
    rg: 'MG-78.901.234',
    pis: '987.65432.10-9',
    ctps: '00987654321',
    titulo_eleitor: '0987654321098',
    reservista: 'RM987654',
    aso_data: '2024-02-01',
    blood_type: 'O+',
    emergency_contact: '(31) 99876-5432 - Joana Mendes (esposa)',
    cargo: 'Auxiliar de Serviços Gerais',
    funcao: 'Limpeza e Manutenção',
    departamento: 'Zeladoria',
    cbo: '5112-10',
    data_admissao: '2018-06-10',
    birthDate: '1985-11-30',
    tipo_contrato: 'CLT' as const,
    jornada_trabalho: '07:00 às 16:00',
    regime_trabalho: 'PRESENCIAL' as const,
    salario_base: 1800.00,
    tipo_salario: 'MENSAL' as const,
    sindicato: 'Sindicato dos Trabalhadores em Limpeza',
    convencao_coletiva: 'Convenção Coletiva 2024/2025',
    he50_qtd: 4,
    he100_qtd: 2,
    dsr_ativo: true,
    adic_noturno_qtd: 8,
    insalubridade_grau: 'LOW' as const,
    periculosidade_ativo: false,
    comissoes: 0,
    gratificacoes: 100.00,
    premios: 0,
    ats_percentual: 0,
    auxilio_moradia: 0,
    arredondamento: 0,
    dependentes_qtd: 2,
    dependentes_lista: [
      {
        id: 'dep_002',
        name: 'Mariana Mendes Costa',
        birthDate: '2012-07-15',
        relationship: 'FILHA' as const,
        cpf: '890.123.456-78'
      },
      {
        id: 'dep_003',
        name: 'Pedro Mendes Costa',
        birthDate: '2018-09-20',
        relationship: 'FILHO' as const,
        cpf: '901.234.567-89'
      }
    ],
    is_pcd: false,
    tipo_deficiencia: '',
    banco: 'Caixa Econômica Federal',
    codigo_banco: '104',
    agencia: '5678-9',
    conta: '98765-4',
    tipo_conta: 'CORRENTE' as const,
    titular: 'Carlos Roberto Mendes',
    chave_pix: 'carlos.mendes@igreja.com.br',
    vt_ativo: true,
    vale_transporte_total: 120.00,
    va_ativo: false,
    vale_alimentacao: 0,
    vr_ativo: true,
    vale_refeicao: 150.00,
    ps_ativo: true,
    plano_saude_colaborador: 120.00,
    po_ativo: false,
    plano_saude_dependentes: 200.00,
    vale_farmacia: 50.00,
    seguro_vida: 0,
    faltas: 2,
    atrasos: 1
  }
];

// Função para criar dados no IndexedDB
export const createMockData = async () => {
  try {
    console.log('🚀 Iniciando criação de dados fictícios...');
    
    // Criar membros
    console.log('📝 Criando membros...');
    for (const member of mockMembers) {
      await dbService.saveMember(member);
      console.log(`✅ Membro criado: ${member.name}`);
    }
    
    // Criar funcionários
    console.log('👥 Criando funcionários...');
    for (const employee of mockEmployees) {
      await dbService.saveEmployee(employee);
      console.log(`✅ Funcionário criado: ${employee.employeeName}`);
    }
    
    console.log('🎉 Dados fictícios criados com sucesso!');
    console.log(`📊 Total: ${mockMembers.length} membros, ${mockEmployees.length} funcionários`);
    
  } catch (error) {
    console.error('❌ Erro ao criar dados fictícios:', error);
  }
};

// Exportar para uso no console
export { mockMembers, mockEmployees };
