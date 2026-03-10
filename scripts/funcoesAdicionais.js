// Script apenas com as funções que faltam
// Execute no console após fazer login

console.log('📋 CARREGANDO FUNÇÕES ADICIONAIS...');

// Função para preencher formulário automaticamente
const preencherFormulario = (dados) => {
  console.log('📋 Preenchendo formulário para:', dados.employeeName);
  
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
            el.textContent && (el.textContent.includes('Novo') || el.textContent.includes('Adicionar'))
          );
          
          if (btnNovo) {
            btnNovo.click();
            
            setTimeout(() => {
              const campos = {
                matricula: document.querySelector('input[placeholder*="Matrícula"], input[name*="matricula"]'),
                nome: document.querySelector('input[placeholder*="Nome"], input[name*="name"], input[name*="employeeName"]'),
                cpf: document.querySelector('input[placeholder*="CPF"], input[name*="cpf"]'),
                email: document.querySelector('input[placeholder*="Email"], input[type="email"], input[name*="email"]'),
                cargo: document.querySelector('input[placeholder*="Cargo"], select[name*="cargo"], input[name*="cargo"]')
              };
              
              if (campos.matricula) campos.matricula.value = dados.matricula;
              if (campos.nome) campos.nome.value = dados.employeeName;
              if (campos.cpf) campos.cpf.value = dados.cpf;
              if (campos.email) campos.email.value = dados.email;
              if (campos.cargo) {
                if (campos.cargo.tagName === 'SELECT') {
                  const option = Array.from(campos.cargo.options).find(opt => opt.text && opt.text.includes(dados.cargo));
                  if (option) campos.cargo.value = option.value;
                } else {
                  campos.cargo.value = dados.cargo;
                }
              }
              
              console.log('✅ Formulário preenchido para:', dados.employeeName);
            }, 2000);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Erro:', error);
    }
  }, 1000);
};

// Dados para Ana Beatriz Costa Silva
const dadosAna = {
  matricula: 'EMP2024002',
  employeeName: 'Ana Beatriz Costa Silva',
  email: 'ana.costa@igreja.com.br',
  cpf: '456.789.123-45',
  cargo: 'Secretária Executiva'
};

// Dados para Carlos Roberto Mendes
const dadosCarlos = {
  matricula: 'EMP2024001',
  employeeName: 'Carlos Roberto Mendes',
  email: 'carlos.mendes@igreja.com.br',
  cpf: '789.012.345-67',
  cargo: 'Auxiliar de Serviços Gerais'
};

// Criar funções que faltam
window.preencherAna = () => preencherFormulario(dadosAna);
window.preencherCarlos = () => preencherFormulario(dadosCarlos);

console.log('✅ Funções adicionais carregadas!');
console.log('📋 Para executar:');
console.log('   - Ana: preencherAna()');
console.log('   - Carlos: preencherCarlos()');
console.log('📋 Execute uma por vez e aguarde o formulário carregar!');
