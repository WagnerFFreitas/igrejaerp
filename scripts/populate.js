// Script para popular banco de dados - Execute diretamente no console do navegador
// Faça login primeiro, depois copie e cole este código no console

const populateDatabase = async () => {
  try {
    console.log('🚀 Iniciando criação de dados fictícios...');
    
    // Dados dos novos membros
    const newMembers = [
      {
        id: 'member_' + Date.now() + '_1',
        unitId: 'u-sede',
        name: 'Maria Silva Santos',
        cpf: '123.456.789-01',
        rg: 'MG-12.345.678',
        email: 'maria.santos@email.com',
        phone: '(31) 98765-4321',
        whatsapp: '(31) 98765-4321',
        profession: 'Professora',
        role: 'MEMBER',
        status: 'ACTIVE',
        fatherName: 'João Silva Santos',
        motherName: 'Maria Aparecida Silva',
        bloodType: 'O+',
        emergencyContact: '(31) 91234-5678 - João Silva (irmão)',
        conversionDate: '2018-03-15',
        conversionPlace: 'Igreja Batista Central',
        baptismDate: '2018-06-20',
        baptismChurch: 'Igreja Batista Central',
        baptizingPastor: 'Pastor Carlos Alberto',
        holySpiritBaptism: 'SIM',
        membershipDate: '2018-06-20',
        churchOfOrigin: 'Igreja Batista Central',
        discipleshipCourse: 'CONCLUIDO',
        biblicalSchool: 'ATIVO',
        mainMinistry: 'Escola Dominical',
        ministryRole: 'Professora de Adolescentes',
        otherMinistries: ['Louvor', 'Evangelismo'],
        ecclesiasticalPosition: 'Membro',
        consecrationDate: '2022-01-15',
        isTithable: true,
        isRegularGiver: true,
        participatesCampaigns: true,
        contributions: [],
        bank: 'Banco do Brasil',
        bankAgency: '1234-5',
        bankAccount: '12345-6',
        pixKey: 'maria.santos@email.com',
        birthDate: '1985-07-22',
        gender: 'F',
        maritalStatus: 'MARRIED',
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
        id: 'member_' + Date.now() + '_2',
        unitId: 'u-sede',
        name: 'José Carlos Pereira',
        cpf: '987.654.321-09',
        rg: 'MG-98.765.432',
        email: 'jose.pereira@email.com',
        phone: '(31) 91234-5678',
        whatsapp: '(31) 91234-5678',
        profession: 'Engenheiro Civil',
        role: 'LEADER',
        status: 'ACTIVE',
        fatherName: 'Antônio Pereira Neto',
        motherName: 'Francisca Carlos Pereira',
        bloodType: 'A+',
        emergencyContact: '(31) 99876-5432 - Maria Pereira (esposa)',
        conversionDate: '2015-08-10',
        conversionPlace: 'Igreja Batista Central',
        baptismDate: '2015-12-25',
        baptismChurch: 'Igreja Batista Central',
        baptizingPastor: 'Pastor Carlos Alberto',
        holySpiritBaptism: 'SIM',
        membershipDate: '2015-12-25',
        churchOfOrigin: 'Comunidade Evangélica Vida Nova',
        discipleshipCourse: 'CONCLUIDO',
        biblicalSchool: 'ATIVO',
        mainMinistry: 'Conselho',
        ministryRole: 'Líder de Construção',
        otherMinistries: ['Construção', 'Manutenção'],
        ecclesiasticalPosition: 'Diácono',
        consecrationDate: '2020-03-20',
        isTithable: true,
        isRegularGiver: true,
        participatesCampaigns: true,
        contributions: [],
        bank: 'Caixa Econômica Federal',
        bankAgency: '5678-9',
        bankAccount: '98765-4',
        pixKey: 'jose.pereira@email.com',
        birthDate: '1980-04-15',
        gender: 'M',
        maritalStatus: 'MARRIED',
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
    
    // Dados dos novos funcionários
    const newEmployees = [
      {
        id: 'employee_' + Date.now() + '_1',
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
        tipo_contrato: 'CLT',
        jornada_trabalho: '08:00 às 17:00',
        regime_trabalho: 'PRESENCIAL',
        salario_base: 2500.00,
        tipo_salario: 'MENSAL',
        sindicato: 'Sindicato dos Trabalhadores em Educação',
        convencao_coletiva: 'Convenção Coletiva 2024/2025',
        he50_qtd: 2,
        he100_qtd: 0,
        dsr_ativo: true,
        adic_noturno_qtd: 4,
        insalubridade_grau: 'NONE',
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
            relationship: 'FILHO',
            cpf: '789.012.345-67'
          }
        ],
        is_pcd: false,
        tipo_deficiencia: '',
        banco: 'Banco do Brasil',
        codigo_banco: '001',
        agencia: '1234-5',
        conta: '12345-6',
        tipo_conta: 'CORRENTE',
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
        id: 'employee_' + Date.now() + '_2',
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
        tipo_contrato: 'CLT',
        jornada_trabalho: '07:00 às 16:00',
        regime_trabalho: 'PRESENCIAL',
        salario_base: 1800.00,
        tipo_salario: 'MENSAL',
        sindicato: 'Sindicato dos Trabalhadores em Limpeza',
        convencao_coletiva: 'Convenção Coletiva 2024/2025',
        he50_qtd: 4,
        he100_qtd: 2,
        dsr_ativo: true,
        adic_noturno_qtd: 8,
        insalubridade_grau: 'LOW',
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
            relationship: 'FILHA',
            cpf: '890.123.456-78'
          },
          {
            id: 'dep_003',
            name: 'Pedro Mendes Costa',
            birthDate: '2018-09-20',
            relationship: 'FILHO',
            cpf: '901.234.567-89'
          }
        ],
        is_pcd: false,
        tipo_deficiencia: '',
        banco: 'Caixa Econômica Federal',
        codigo_banco: '104',
        agencia: '5678-9',
        conta: '98765-4',
        tipo_conta: 'CORRENTE',
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
      role: 'MEMBER',
      status: 'ACTIVE',
      fatherName: 'José Ferreira da Silva',
      motherName: 'Maria Aparecida Freitas',
      bloodType: 'B+',
      emergencyContact: '(31) 91234-5679 - Ana Freitas (irmã)',
      conversionDate: '2010-05-20',
      conversionPlace: 'Igreja Batista Central',
      baptismDate: '2010-08-15',
      baptismChurch: 'Igreja Batista Central',
      baptizingPastor: 'Pastor Carlos Alberto',
      holySpiritBaptism: 'SIM',
      membershipDate: '2010-08-15',
      churchOfOrigin: 'Comunidade Evangélica Fé Viva',
      discipleshipCourse: 'CONCLUIDO',
      biblicalSchool: 'ATIVO',
      mainMinistry: 'Mídia e Tecnologia',
      ministryRole: 'Líder de TI',
      otherMinistries: ['Louvor (Técnico)', 'Escola Dominical (Web)'],
      ecclesiasticalPosition: 'Membro',
      consecrationDate: '2018-03-10',
      isTithable: true,
      isRegularGiver: true,
      participatesCampaigns: true,
      contributions: [
        {
          id: 'contrib_wagner_001',
          value: 1000,
          date: '2024-01-15',
          type: 'Dizimo',
          description: 'Dízimo Janeiro 2024'
        },
        {
          id: 'contrib_wagner_002',
          value: 500,
          date: '2024-01-20',
          type: 'OFFERING',
          description: 'Oferta Campanha Construção'
        }
      ],
      bank: 'Banco do Brasil',
      bankAgency: '1234-5',
      bankAccount: '12345-6',
      pixKey: 'wagner.freitas@email.com',
      birthDate: '1988-03-15',
      gender: 'M',
      maritalStatus: 'MARRIED',
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
      tipo_contrato: 'CLT',
      jornada_trabalho: '08:00 às 17:00',
      regime_trabalho: 'HIBRIDO',
      salario_base: 4500.00,
      tipo_salario: 'MENSAL',
      sindicato: 'Sindicato dos Trabalhadores em Tecnologia',
      convencao_coletiva: 'Convenção Coletiva 2024/2025',
      he50_qtd: 5,
      he100_qtd: 2,
      dsr_ativo: true,
      adic_noturno_qtd: 10,
      insalubridade_grau: 'NONE',
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
          relationship: 'FILHO',
          cpf: '234.567.890-12'
        },
        {
          id: 'dep_wagner_002',
          name: 'Laura Freitas Mendes',
          birthDate: '2020-03-25',
          relationship: 'FILHA',
          cpf: '345.678.901-23'
        }
      ],
      is_pcd: false,
      tipo_deficiencia: '',
      banco: 'Banco do Brasil',
      codigo_banco: '001',
      agencia: '1234-5',
      conta: '12345-6',
      tipo_conta: 'CORRENTE',
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
    
    // Salvar membros
    console.log('📝 Criando membros...');
    for (const member of newMembers) {
      await dbService.saveMember(member);
      console.log(`✅ Membro criado: ${member.name}`);
    }
    
    // Salvar funcionários
    console.log('👥 Criando funcionários...');
    for (const employee of newEmployees) {
      await dbService.saveEmployee(employee);
      console.log(`✅ Funcionário criado: ${employee.employeeName}`);
    }
    
    // Atualizar Wagner como membro
    console.log('👤 Atualizando Wagner como membro...');
    await dbService.saveMember(wagnerMemberData);
    console.log(`✅ Membro Wagner atualizado: ${wagnerMemberData.name}`);
    
    // Atualizar Wagner como funcionário
    console.log('💼 Atualizando Wagner como funcionário...');
    await dbService.saveEmployee(wagnerEmployeeData);
    console.log(`✅ Funcionário Wagner atualizado: ${wagnerEmployeeData.employeeName}`);
    
    console.log('🎉 Banco de dados populado com sucesso!');
    console.log('📊 Resumo:');
    console.log('  - 2 novos membros criados');
    console.log('  - 2 novos funcionários criados');
    console.log('  - Dados do Wagner (membro) atualizados');
    console.log('  - Dados do Wagner (funcionário) atualizados');
    console.log('');
    console.log('✅ Recarregue a página para ver os novos dados!');
    
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
  }
};

// Disponibilizar a função globalmente
window.populateDatabase = populateDatabase;

console.log('📋 Script carregado com sucesso!');
console.log('📋 Para executar, digite: populateDatabase()');
