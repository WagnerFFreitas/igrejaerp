// Script para COMPLETAR os cadastros existentes (Wagner, Maria, Jefferson)
// Execute no console após fazer login

console.log('🔧 COMPLETANDO CADASTROS EXISTENTES...');

// Função para preencher TODOS os campos do formulário
const preencherFormularioCompleto = (dados) => {
  console.log('📋 Preenchendo formulário COMPLETO para:', dados.employeeName);
  
  setTimeout(() => {
    try {
      // Navegar para Recursos Humanos
      const menuRecursos = Array.from(document.querySelectorAll('button, div[role="button"], a')).find(el => 
        el.textContent && (el.textContent.includes('Recursos') || el.textContent.includes('Humanos'))
      );
      
      if (menuRecursos) {
        menuRecursos.click();
        
        setTimeout(() => {
          // Procurar botão "Novo Funcionário"
          const btnNovo = Array.from(document.querySelectorAll('button, div[role="button"]')).find(el => 
            el.textContent && (
              el.textContent.includes('Novo') || 
              el.textContent.includes('Adicionar') ||
              el.textContent.includes('Cadastrar')
            )
          );
          
          if (btnNovo) {
            btnNovo.click();
            
            setTimeout(() => {
              console.log('📋 Preenchendo todas as abas para', dados.employeeName);
              
              // Função para preencher campo por campo
              const preencherCampo = (seletor, valor) => {
                const campo = document.querySelector(seletor);
                if (campo) {
                  campo.value = valor;
                  campo.dispatchEvent(new Event('input', { bubbles: true }));
                  campo.dispatchEvent(new Event('change', { bubbles: true }));
                }
              };
              
              // Função para selecionar opção em select
              const selecionarOpcao = (seletor, texto) => {
                const select = document.querySelector(seletor);
                if (select) {
                  const option = Array.from(select.options).find(opt => opt.text && opt.text.includes(texto));
                  if (option) {
                    select.value = option.value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }
              };
              
              // Função para clicar em abas
              const clicarAba = (texto) => {
                const abas = document.querySelectorAll('button, div[role="tab"], [role="tab"], [data-tab]');
                const aba = Array.from(abas).find(el => el.textContent && el.textContent.includes(texto));
                if (aba) {
                  aba.click();
                  setTimeout(() => {}, 800);
                }
              };
              
              // Função para marcar checkbox
              const marcarCheckbox = (seletor, marcar) => {
                const checkbox = document.querySelector(seletor);
                if (checkbox) {
                  checkbox.checked = marcar;
                  checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
              };
              
              // 1. DADOS PESSOAIS
              console.log('📋 1. Preenchendo Dados Pessoais...');
              preencherCampo('input[placeholder*="Matrícula"], input[name*="matricula"]', dados.matricula);
              preencherCampo('input[placeholder*="Nome"], input[name*="name"], input[name*="employeeName"]', dados.employeeName);
              preencherCampo('input[placeholder*="Email"], input[type="email"], input[name*="email"]', dados.email);
              preencherCampo('input[placeholder*="CPF"], input[name*="cpf"]', dados.cpf);
              preencherCampo('input[placeholder*="RG"], input[name*="rg"]', dados.rg || '');
              preencherCampo('input[placeholder*="PIS"], input[name*="pis"]', dados.pis || '');
              preencherCampo('input[placeholder*="CTPS"], input[name*="ctps"]', dados.ctps || '');
              preencherCampo('input[placeholder*="Título"], input[name*="titulo"]', dados.titulo || '');
              preencherCampo('input[placeholder*="Reservista"], input[name*="reservista"]', dados.reservista || '');
              preencherCampo('input[placeholder*="Data"], input[name*="aso"], input[type="date"]', dados.aso_data || '');
              preencherCampo('input[placeholder*="Sangue"], input[name*="blood"]', dados.blood_type || '');
              preencherCampo('input[placeholder*="Contato"], textarea[name*="emergency"]', dados.emergency_contact || '');
              preencherCampo('input[placeholder*="Nascimento"], input[type="date"][name*="birth"]', dados.birthDate || '');
              
              // 2. DADOS CONTRATUAIS
              console.log('📋 2. Preenchendo Dados Contratuais...');
              clicarAba('Contrato');
              setTimeout(() => {
                preencherCampo('input[placeholder*="Cargo"], input[name*="cargo"]', dados.cargo);
                preencherCampo('input[placeholder*="Função"], input[name*="funcao"]', dados.funcao || '');
                preencherCampo('select[name*="departamento"]', dados.departamento || '');
                preencherCampo('select[name*="cbo"]', dados.cbo || '');
                preencherCampo('input[placeholder*="Admissão"], input[type="date"][name*="admissao"]', dados.data_admissao || '');
                preencherCampo('select[name*="tipo_contrato"]', dados.tipo_contrato || '');
                preencherCampo('input[placeholder*="Jornada"], input[name*="jornada"]', dados.jornada_trabalho || '');
                preencherCampo('select[name*="regime"]', dados.regime_trabalho || '');
                preencherCampo('input[placeholder*="Salário"], input[name*="salario"]', dados.salario_base?.toString() || '');
                preencherCampo('select[name*="tipo_salario"]', dados.tipo_salario || '');
                preencherCampo('input[placeholder*="Sindicato"], input[name*="sindicato"]', dados.sindicato || '');
                preencherCampo('input[placeholder*="Convenção"], input[name*="convencao"]', dados.convencao_coletiva || '');
              }, 1000);
              
              // 3. BANCO E HORAS
              console.log('📋 3. Preenchendo Banco e Horas...');
              clicarAba('Banco');
              setTimeout(() => {
                preencherCampo('input[placeholder*="Banco"], input[name*="banco"]', dados.banco || '');
                preencherCampo('input[placeholder*="Código"], input[name*="codigo_banco"]', dados.codigo_banco || '');
                preencherCampo('input[placeholder*="Agência"], input[name*="agencia"]', dados.agencia || '');
                preencherCampo('input[placeholder*="Conta"], input[name*="conta"]', dados.conta || '');
                preencherCampo('select[name*="tipo_conta"]', dados.tipo_conta || '');
                preencherCampo('input[placeholder*="Titular"], input[name*="titular"]', dados.titular || '');
                preencherCampo('input[placeholder*="PIX"], input[name*="pix"]', dados.chave_pix || '');
              }, 1000);
              
              // 4. BENEFÍCIOS
              console.log('📋 4. Preenchendo Benefícios...');
              clicarAba('Benefícios');
              setTimeout(() => {
                // VT
                marcarCheckbox('input[name*="vt_ativo"]', dados.vale_transporte_total > 0);
                preencherCampo('input[name*="vale_transporte"]', dados.vale_transporte_total?.toString() || '');
                
                // VA
                marcarCheckbox('input[name*="va_ativo"]', dados.vale_alimentacao > 0);
                preencherCampo('input[name*="vale_alimentacao"]', dados.vale_alimentacao?.toString() || '');
                
                // VR
                marcarCheckbox('input[name*="vr_ativo"]', dados.vale_refeicao > 0);
                preencherCampo('input[name*="vale_refeicao"]', dados.vale_refeicao?.toString() || '');
                
                // Plano Saúde
                marcarCheckbox('input[name*="ps_ativo"]', dados.plano_saude_colaborador > 0);
                preencherCampo('input[name*="plano_saude_colaborador"]', dados.plano_saude_colaborador?.toString() || '');
                
                // Vale Farmácia
                if (dados.vale_farmacia > 0) {
                  preencherCampo('input[name*="vale_farmacia"]', dados.vale_farmacia?.toString() || '');
                }
                
                // Plano Odontológico
                if (dados.plano_odontologico > 0) {
                  preencherCampo('input[name*="plano_odontologico"]', dados.plano_odontologico?.toString() || '');
                }
                
                // Seguro Vida
                if (dados.seguro_vida > 0) {
                  preencherCampo('input[name*="seguro_vida"]', dados.seguro_vida?.toString() || '');
                }
              }, 1500);
              
              // 5. DEPENDENTES
              console.log('📋 5. Preenchendo Dependentes...');
              clicarAba('Dependentes');
              setTimeout(() => {
                if (dados.dependentes_lista && dados.dependentes_lista.length > 0) {
                  preencherCampo('input[name*="dependentes_qtd"]', dados.dependentes_lista.length.toString());
                  
                  // Adicionar dependentes (se houver campo para isso)
                  const btnAddDependente = document.querySelector('button[onclick*="dependente"], button[onclick*="add"]');
                  if (btnAddDependente) {
                    dados.dependentes_lista.forEach((dep, index) => {
                      setTimeout(() => {
                        btnAddDependente.click();
                        setTimeout(() => {
                          preencherCampo('input[name*="dep_name"]', dep.name);
                          preencherCampo('input[name*="dep_cpf"]', dep.cpf);
                          preencherCampo('input[name*="dep_birth"]', dep.birthDate);
                          preencherCampo('select[name*="dep_relationship"]', dep.relationship);
                          
                          const btnSalvarDep = document.querySelector('button[onclick*="save"], button[onclick*="confirm"]');
                          if (btnSalvarDep) {
                            btnSalvarDep.click();
                          }
                        }, 500);
                      }, index * 1000);
                    });
                  }
                }
              }, 2000);
              
              console.log('✅ Formulário COMPLETAMENTE preenchido para:', dados.employeeName);
              console.log('📋 Revise TODAS as abas e clique em "Salvar"');
              
            }, 2000);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Erro ao preencher formulário:', error);
    }
  }, 1000);
};

// Dados COMPLETOS para Wagner Ferreira Freitas
const dadosWagnerCompleto = {
  matricula: 'EMP2024005',
  employeeName: 'Wagner Ferreira Freitas',
  email: 'wagner.freitas@igreja.com.br',
  cpf: '111.222.333-44',
  rg: 'MG-11.222.333',
  pis: '999.88877.99-9',
  ctps: '00987654321',
  titulo: '111222333444',
  reservista: 'AM999888',
  aso_data: '2024-01-15',
  blood_type: 'A+',
  emergency_contact: '(31) 98877-6654 - Maria Freitas (esposa)',
  birthDate: '1980-03-15',
  cargo: 'Desenvolvedor de Sistemas',
  funcao: 'Desenvolvedor Full Stack',
  departamento: 'TI',
  cbo: '2521-05',
  data_admissao: '2019-01-15',
  tipo_contrato: 'CLT',
  jornada_trabalho: '08:00 às 17:00',
  regime_trabalho: 'HÍBRIDO',
  salario_base: 5500.00,
  tipo_salario: 'MENSAL',
  sindicato: 'Sindicato dos Tecnologistas',
  convencao_coletiva: 'Convenção Coletiva 2024/2025',
  banco: 'Banco do Brasil',
  codigo_banco: '001',
  agencia: '1234-5',
  conta: '54321-0',
  tipo_conta: 'CORRENTE',
  titular: 'Wagner Ferreira Freitas',
  chave_pix: 'wagner.freitas@igreja.com.br',
  vale_transporte_total: 200.00,
  vale_alimentacao: 300.00,
  vale_refeicao: 0,
  plano_saude_colaborador: 250.00,
  vale_farmacia: 100.00,
  seguro_vida: 0
};

// Dados COMPLETOS para Jefferson Araújo
const dadosJeffersonCompleto = {
  matricula: 'EMP2024006',
  employeeName: 'Jefferson Araújo',
  email: 'jefferson.araujo@igreja.com.br',
  cpf: '222.333.444-55',
  rg: 'MG-22.333.444',
  pis: '888.99966.11-8',
  ctps: '00876543210',
  titulo: '222333444555',
  reservista: 'RM888999',
  aso_data: '2024-02-01',
  blood_type: 'B+',
  emergency_contact: '(31) 97766-5543 - Ana Araújo (esposa)',
  birthDate: '1985-07-20',
  cargo: 'Coordenador de Ministério',
  funcao: 'Coordenador de Jovens',
  departamento: 'Ministério',
  cbo: '2522-05',
  data_admissao: '2018-03-10',
  tipo_contrato: 'CLT',
  jornada_trabalho: '08:00 às 17:00',
  regime_trabalho: 'PRESENCIAL',
  salario_base: 3500.00,
  tipo_salario: 'MENSAL',
  sindicato: 'Sindicato de Pastores',
  convencao_coletiva: 'Convenção Coletiva 2024/2025',
  banco: 'Caixa Econômica Federal',
  codigo_banco: '104',
  agencia: '5678-9',
  conta: '98765-4',
  tipo_conta: 'CORRENTE',
  titular: 'Jefferson Araújo',
  chave_pix: 'jefferson.araujo@igreja.com.br',
  vale_transporte_total: 180.00,
  vale_alimentacao: 250.00,
  vale_refeicao: 150.00,
  plano_saude_colaborador: 200.00,
  vale_farmacia: 80.00,
  seguro_vida: 0
};

// Dados COMPLETOS para Maria Silva Santos
const dadosMariaCompleto = {
  matricula: 'EMP2024003',
  employeeName: 'Maria Silva Santos',
  email: 'maria.santos@igreja.com.br',
  cpf: '123.456.789-01',
  rg: 'MG-12.345.678',
  pis: '111.22233.44-1',
  ctps: '00123456789',
  titulo: '1234567890123',
  reservista: 'AM123456',
  aso_data: '2024-01-15',
  blood_type: 'O+',
  emergency_contact: '(31) 98765-4321 - João Silva (irmão)',
  birthDate: '1985-07-22',
  cargo: 'Professora',
  funcao: 'Professora de Adolescentes',
  departamento: 'Escola Dominical',
  cbo: '2521-05',
  data_admissao: '2020-03-15',
  tipo_contrato: 'CLT',
  jornada_trabalho: '08:00 às 17:00',
  regime_trabalho: 'PRESENCIAL',
  salario_base: 2200.00,
  tipo_salario: 'MENSAL',
  sindicato: 'Sindicato dos Professores',
  convencao_coletiva: 'Convenção Coletiva 2024/2025',
  banco: 'Banco do Brasil',
  codigo_banco: '001',
  agencia: '1234-5',
  conta: '12345-6',
  tipo_conta: 'CORRENTE',
  titular: 'Maria Silva Santos',
  chave_pix: 'maria.santos@igreja.com.br',
  vale_transporte_total: 150.00,
  vale_alimentacao: 200.00,
  vale_refeicao: 0,
  plano_saude_colaborador: 120.00,
  vale_farmacia: 0,
  seguro_vida: 0
};

// Criar funções para completar cadastros existentes
window.completarWagnerExistente = () => preencherFormularioCompleto(dadosWagnerCompleto);
window.completarJeffersonExistente = () => preencherFormularioCompleto(dadosJeffersonCompleto);
window.completarMariaExistente = () => preencherFormularioCompleto(dadosMariaCompleto);

console.log('✅ Script de complementação de cadastros existentes carregado!');
console.log('📋 Para completar os cadastros existentes:');
console.log('   - Wagner: completarWagnerExistente()');
console.log('   - Jefferson: completarJeffersonExistente()');
console.log('   - Maria: completarMariaExistente()');
console.log('📋 Isso preencherá TODAS as abas: Pessoais, Contrato, Banco, Benefícios, Dependentes!');
console.log('🎯 Execute um por vez e aguarde o processo completo de preenchimento!');
