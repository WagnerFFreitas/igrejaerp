// Script para verificar e corrigir dados dos funcionários
// Execute este código no console do navegador após fazer login

const verificarFuncionarios = async () => {
  try {
    console.log('🔍 Verificando funcionários no banco de dados...');
    
    // Verificar todos os funcionários no banco
    const allEmployees = await dbService.getAllEmployees();
    console.log('📋 Todos os funcionários no banco:', allEmployees);
    console.log('📊 Total de funcionários:', allEmployees.length);
    
    // Verificar funcionários da unidade atual
    const currentUnitId = 'u-sede';
    const unitEmployees = await dbService.getEmployees(currentUnitId);
    console.log('🏢 Funcionários da unidade atual:', unitEmployees);
    console.log('📊 Total na unidade:', unitEmployees.length);
    
    // Verificar detalhes de cada funcionário
    unitEmployees.forEach((emp, index) => {
      console.log(`👤 Funcionário ${index + 1}:`, {
        id: emp.id,
        name: emp.employeeName,
        cpf: emp.cpf,
        unitId: emp.unitId,
        matricula: emp.matricula
      });
    });
    
    return { allEmployees, unitEmployees };
  } catch (error) {
    console.error('❌ Erro ao verificar funcionários:', error);
  }
};

// Função para recriar os funcionários do script
const recriarFuncionariosScript = async () => {
  try {
    console.log('🔄 Recriando funcionários do script...');
    
    // Dados dos funcionários do script
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
    
    // Salvar cada funcionário
    for (const employee of newEmployees) {
      await dbService.saveEmployee(employee);
      console.log(`✅ Funcionário criado: ${employee.employeeName}`);
    }
    
    console.log('🎉 Funcionários recriados com sucesso!');
    
    // Verificar novamente
    setTimeout(async () => {
      await verificarFuncionarios();
    }, 1000);
    
  } catch (error) {
    console.error('❌ Erro ao recriar funcionários:', error);
  }
};

// Disponibilizar funções globalmente
window.verificarFuncionarios = verificarFuncionarios;
window.recriarFuncionariosScript = recriarFuncionariosScript;

console.log('📋 Script de verificação carregado!');
console.log('🔍 Para verificar funcionários, digite: verificarFuncionarios()');
console.log('🔄 Para recriar funcionários, digite: recriarFuncionariosScript()');
