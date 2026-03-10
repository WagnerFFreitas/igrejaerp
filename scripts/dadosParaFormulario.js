// Dados prontos para copiar e colar no formulário
// Use estes dados para criar os funcionários manualmente

console.log('📋 DADOS PARA CADASTRO MANUAL');
console.log('🎯 Acesse "Recursos Humanos" > "Funcionários" > "Novo Funcionário"');
console.log('📋 Copie e cole os dados abaixo:');

// DADOS 1: MARIA SILVA SANTOS
const dadosMaria = {
  matricula: 'EMP2024003',
  employeeName: 'Maria Silva Santos',
  email: 'maria.santos@igreja.com.br',
  cpf: '123.456.789-01',
  rg: 'MG-12.345.678',
  pis: '111.22233.44-1',
  ctps: '00123456789',
  titulo_eleitor: '1234567890123',
  reservista: 'AM123456',
  aso_data: '2024-01-15',
  blood_type: 'O+',
  emergency_contact: '(31) 98765-4321 - João Silva (irmão)',
  cargo: 'Professora',
  funcao: 'Professora de Adolescentes',
  departamento: 'Escola Dominical',
  cbo: '2521-05',
  data_admissao: '2020-03-15',
  birthDate: '1985-07-22',
  tipo_contrato: 'CLT',
  jornada_trabalho: '08:00 às 17:00',
  regime_trabalho: 'PRESENCIAL',
  salario_base: 2200.00,
  tipo_salario: 'MENSAL',
  sindicato: 'Sindicato dos Professores',
  convencao_coletiva: 'Convenção Coletiva 2024/2025',
  he50_qtd: 2,
  he100_qtd: 0,
  dsr_ativo: true,
  adic_noturno_qtd: 0,
  insalubridade_grau: 'NONE',
  periculosidade_ativo: false,
  comissoes: 0,
  gratificacoes: 150.00,
  premios: 0,
  ats_percentual: 0,
  auxilio_moradia: 0,
  arredondamento: 0,
  dependentes_qtd: 0,
  dependentes_lista: [],
  is_pcd: false,
  tipo_deficiencia: '',
  banco: 'Banco do Brasil',
  codigo_banco: '001',
  agencia: '1234-5',
  conta: '12345-6',
  tipo_conta: 'CORRENTE',
  titular: 'Maria Silva Santos',
  chave_pix: 'maria.santos@igreja.com.br',
  vt_ativo: true,
  vale_transporte_total: 150.00,
  va_ativo: true,
  vale_alimentacao: 200.00,
  vr_ativo: false,
  vale_refeicao: 0,
  ps_ativo: true,
  plano_saude_colaborador: 120.00,
  po_ativo: false,
  plano_saude_dependentes: 0,
  vale_farmacia: 0,
  seguro_vida: 0,
  faltas: 0,
  atrasos: 0
};

// DADOS 2: JOSÉ CARLOS PEREIRA
const dadosJose = {
  matricula: 'EMP2024004',
  employeeName: 'José Carlos Pereira',
  email: 'jose.pereira@igreja.com.br',
  cpf: '987.654.321-09',
  rg: 'MG-98.765.432',
  pis: '222.33344.55-2',
  ctps: '00234567890',
  titulo_eleitor: '9876543210987',
  reservista: 'RM987654',
  aso_data: '2024-02-01',
  blood_type: 'A+',
  emergency_contact: '(31) 91234-5678 - Maria Pereira (esposa)',
  cargo: 'Engenheiro Civil',
  funcao: 'Líder de Construção',
  departamento: 'Conselho',
  cbo: '2522-05',
  data_admissao: '2018-06-10',
  birthDate: '1980-04-15',
  tipo_contrato: 'CLT',
  jornada_trabalho: '08:00 às 17:00',
  regime_trabalho: 'PRESENCIAL',
  salario_base: 3500.00,
  tipo_salario: 'MENSAL',
  sindicato: 'Sindicato dos Engenheiros',
  convencao_coletiva: 'Convenção Coletiva 2024/2025',
  he50_qtd: 3,
  he100_qtd: 1,
  dsr_ativo: true,
  adic_noturno_qtd: 0,
  insalubridade_grau: 'NONE',
  periculosidade_ativo: false,
  comissoes: 0,
  gratificacoes: 200.00,
  premios: 0,
  ats_percentual: 0,
  auxilio_moradia: 0,
  arredondamento: 0,
  dependentes_qtd: 2,
  dependentes_lista: [
    {
      id: 'dep_jose_001',
      name: 'Pedro Pereira Silva',
      birthDate: '2012-08-10',
      relationship: 'FILHO',
      cpf: '111.222.333-44'
    },
    {
      id: 'dep_jose_002',
      name: 'Ana Pereira Silva',
      birthDate: '2015-03-25',
      relationship: 'FILHA',
      cpf: '222.333.444-55'
    }
  ],
  is_pcd: false,
  tipo_deficiencia: '',
  banco: 'Caixa Econômica Federal',
  codigo_banco: '104',
  agencia: '5678-9',
  conta: '98765-4',
  tipo_conta: 'CORRENTE',
  titular: 'José Carlos Pereira',
  chave_pix: 'jose.pereira@igreja.com.br',
  vt_ativo: true,
  vale_transporte_total: 180.00,
  va_ativo: true,
  vale_alimentacao: 250.00,
  vr_ativo: false,
  vale_refeicao: 0,
  ps_ativo: true,
  plano_saude_colaborador: 180.00,
  po_ativo: false,
  plano_saude_dependentes: 250.00,
  vale_farmacia: 80.00,
  seguro_vida: 0,
  faltas: 0,
  atrasos: 0
};

// Disponibilizar globalmente para fácil acesso
window.dadosMaria = dadosMaria;
window.dadosJose = dadosJose;

console.log('✅ Dados carregados!');
console.log('📋 Para acessar os dados:');
console.log('   - Maria: dadosMaria');
console.log('   - José: dadosJose');
console.log('🎯 Copie os dados para o clipboard e cole no formulário!');

// Função para copiar dados para clipboard
window.copiarDados = (nome, dados) => {
  navigator.clipboard.writeText(JSON.stringify(dados, null, 2)).then(() => {
    console.log(`✅ Dados de ${nome} copiados para o clipboard!`);
  }).catch(err => {
    console.error('❌ Erro ao copiar:', err);
  });
};

console.log('📋 Para copiar automaticamente:');
console.log('   - Maria: copiarDados("Maria", dadosMaria)');
console.log('   - José: copiarDados("José", dadosJose)');
