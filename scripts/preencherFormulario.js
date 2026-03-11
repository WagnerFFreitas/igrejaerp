// Script para criar funcionários via interface (sem usar dbService diretamente)
// Execute no console após fazer login

console.log('🎯 CRIANDO FUNCIONÁRIOS VIA INTERFACE...');

// Função para preencher formulário automaticamente
const preencherFormulario = (dados) => {
  console.log('📋 Preenchendo formulário para:', dados.employeeName);
  
  // Esperar um pouco para a interface carregar
  setTimeout(() => {
    try {
      // Navegar para a página de funcionários
      const menuRecursos = Array.from(document.querySelectorAll('button, div[role="button"], a')).find(el => 
        el.textContent && el.textContent.includes('Recursos') || 
        el.textContent && el.textContent.includes('Humanos')
      );
      
      if (menuRecursos) {
        console.log('✅ Menu de Recursos Humanos encontrado');
        menuRecursos.click();
        
        // Esperar a página carregar
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
            console.log('✅ Botão Novo Funcionário encontrado');
            btnNovo.click();
            
            // Esperar formulário carregar
            setTimeout(() => {
              // Preencher campos básicos
              const campos = {
                matricula: document.querySelector('input[placeholder*="Matrícula"], input[name*="matricula"]'),
                nome: document.querySelector('input[placeholder*="Nome"], input[name*="name"], input[name*="employeeName"]'),
                cpf: document.querySelector('input[placeholder*="CPF"], input[name*="cpf"]'),
                email: document.querySelector('input[placeholder*="Email"], input[type="email"], input[name*="email"]'),
                cargo: document.querySelector('input[placeholder*="Cargo"], select[name*="cargo"], input[name*="cargo"]')
              };
              
              console.log('📋 Campos encontrados:', Object.keys(campos).filter(k => campos[k]));
              
              // Preencher campos encontrados
              if (campos.matricula) {
                campos.matricula.value = dados.matricula;
                console.log('✅ Matrícula preenchida');
              }
              
              if (campos.nome) {
                campos.nome.value = dados.employeeName;
                console.log('✅ Nome preenchido');
              }
              
              if (campos.cpf) {
                campos.cpf.value = dados.cpf;
                console.log('✅ CPF preenchido');
              }
              
              if (campos.email) {
                campos.email.value = dados.email;
                console.log('✅ Email preenchido');
              }
              
              if (campos.cargo) {
                // Para select, precisar definir o valor
                if (campos.cargo.tagName === 'SELECT') {
                  const option = Array.from(campos.cargo.options).find(opt => 
                    opt.text && opt.text.includes(dados.cargo)
                  );
                  if (option) {
                    campos.cargo.value = option.value;
                    console.log('✅ Cargo selecionado');
                  }
                } else {
                  campos.cargo.value = dados.cargo;
                  console.log('✅ Cargo preenchido');
                }
              }
              
              console.log('🎉 Formulário preenchido automaticamente!');
              console.log('📋 Revise os dados e clique em "Salvar"');
              
            }, 2000);
          } else {
            console.log('❌ Botão Novo Funcionário não encontrado');
            console.log('📋 Tente clicar manualmente em "Novo Funcionário"');
          }
        }, 2000);
      } else {
        console.log('❌ Menu de Recursos Humanos não encontrado');
        console.log('📋 Navegue manualmente para Recursos Humanos > Funcionários');
      }
      
    } catch (error) {
      console.error('❌ Erro ao preencher formulário:', error);
    }
  }, 1000);
};

// Dados para Maria Silva Santos
const dadosMaria = {
  matricula: 'EMP2024003',
  employeeName: 'Maria Silva Santos',
  email: 'maria.santos@igreja.com.br',
  cpf: '123.456.789-01',
  cargo: 'Professora'
};

// Dados para José Carlos Pereira
const dadosJose = {
  matricula: 'EMP2024004',
  employeeName: 'José Carlos Pereira',
  email: 'jose.pereira@igreja.com.br',
  cpf: '987.654.321-09',
  cargo: 'Engenheiro Civil'
};

// Disponibilizar funções globalmente
window.preencherMaria = () => preencherFormulario(dadosMaria);
window.preencherJose = () => preencherFormulario(dadosJose);

console.log('✅ Script de preenchimento automático carregado!');
console.log('📋 Para preencher Maria: preencherMaria()');
console.log('📋 Para preencher José: preencherJose()');
console.log('📋 Execute um por vez e aguarde o formulário carregar!');
