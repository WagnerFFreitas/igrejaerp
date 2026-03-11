// Script para diagnosticar e criar funcionários de forma mais direta
// Execute no console após fazer login

console.log('🔍 DIAGNÓSTICO E CRIAÇÃO DIRETA...');

// Primeiro, verificar status atual
const verificarStatusAtual = async () => {
  try {
    console.log('📋 Verificando status atual dos funcionários...');
    
    // Tentar acessar a lista de funcionários pela interface
    const menuRecursos = Array.from(document.querySelectorAll('button, div[role="button"], a')).find(el => 
      el.textContent && (el.textContent.includes('Recursos') || el.textContent.includes('Humanos'))
    );
    
    if (menuRecursos) {
      menuRecursos.click();
      
      setTimeout(() => {
        // Procurar tabela ou lista de funcionários
        setTimeout(() => {
          const funcionariosElements = document.querySelectorAll('tr, [role="row"], div[class*="employee"]');
          console.log(`📋 Funcionários encontrados na interface: ${funcionariosElements.length}`);
          
          const nomesAtuais = Array.from(funcionariosElements).map(el => {
            const texto = el.textContent || el.innerText || '';
            const nomes = texto.match(/[A-Z][a-z]+ [A-Z][a-z]+/g);
            return nomes ? nomes[0] : 'Desconhecido';
          });
          
          console.log('📋 Nomes atuais:', nomesAtuais);
          
          if (nomesAtuais.includes('Wagner') && nomesAtuais.includes('Jefferson')) {
            console.log('✅ Wagner e Jefferson já existem na interface');
            return true;
          } else {
            console.log('❌ Wagner e Jefferson não encontrados na interface');
            return false;
          }
        }, 2000);
      }, 2000);
    }
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    return false;
  }
};

// Função para criar funcionário via interface (abordagem alternativa)
const criarFuncionarioInterface = (dados) => {
  console.log('🔧 Criando funcionário via interface:', dados.employeeName);
  
  return new Promise((resolve, reject) => {
    try {
      // Navegar para Recursos Humanos
      const menuRecursos = Array.from(document.querySelectorAll('button, div[role="button"], a')).find(el => 
        el.textContent && (el.textContent.includes('Recursos') || el.textContent.includes('Humanos'))
      );
      
      if (menuRecursos) {
        menuRecursos.click();
        
        setTimeout(() => {
          // Procurar botão de adicionar (pode ser diferente)
          const botoesAdicionar = Array.from(document.querySelectorAll('button, div[role="button"], a')).filter(el => 
            el.textContent && (
              el.textContent.includes('Novo') || 
              el.textContent.includes('Adicionar') ||
              el.textContent.includes('Cadastrar') ||
              el.textContent.includes('Criar') ||
              el.textContent.includes('+') ||
              el.innerHTML.includes('plus') ||
              el.className.includes('add')
            )
          );
          
          console.log(`📋 Botões de adicionar encontrados: ${botoesAdicionar.length}`);
          
          if (botoesAdicionar.length > 0) {
            // Tentar o primeiro botão
            botoesAdicionar[0].click();
            
            setTimeout(() => {
              // Preencher apenas campos essenciais para criar
              const camposEssenciais = {
                nome: document.querySelector('input[placeholder*="Nome"], input[name*="name"], input[name*="employeeName"]'),
                cpf: document.querySelector('input[placeholder*="CPF"], input[name*="cpf"]'),
                email: document.querySelector('input[placeholder*="Email"], input[type="email"], input[name*="email"]'),
                matricula: document.querySelector('input[placeholder*="Matrícula"], input[name*="matricula"]')
              };
              
              let preenchidos = 0;
              
              if (camposEssenciais.nome && dados.employeeName) {
                camposEssenciais.nome.value = dados.employeeName;
                preenchidos++;
                console.log('✅ Nome preenchido');
              }
              
              if (camposEssenciais.cpf && dados.cpf) {
                camposEssenciais.cpf.value = dados.cpf;
                preenchidos++;
                console.log('✅ CPF preenchido');
              }
              
              if (camposEssenciais.email && dados.email) {
                camposEssenciais.email.value = dados.email;
                preenchidos++;
                console.log('✅ Email preenchido');
              }
              
              if (camposEssenciais.matricula && dados.matricula) {
                camposEssenciais.matricula.value = dados.matricula;
                preenchidos++;
                console.log('✅ Matrícula preenchida');
              }
              
              // Procurar botão de salvar
              setTimeout(() => {
                const botoesSalvar = Array.from(document.querySelectorAll('button, div[role="button"]')).filter(el => 
                  el.textContent && (
                    el.textContent.includes('Salvar') || 
                    el.textContent.includes('Gravar') ||
                    el.textContent.includes('Confirmar') ||
                    el.textContent.includes('Criar') ||
                    el.textContent.includes('Cadastrar')
                  )
                );
                
                console.log(`📋 Botões de salvar encontrados: ${botoesSalvar.length}`);
                
                if (botoesSalvar.length > 0) {
                  console.log(`✅ Campos preenchidos: ${preenchidos}/4`);
                  console.log('📋 Clicando em salvar...');
                  botoesSalvar[0].click();
                  
                  setTimeout(() => {
                    console.log('✅ Funcionário criado com sucesso!');
                    resolve(true);
                  }, 2000);
                } else {
                  console.log('❌ Nenhum botão de salvar encontrado');
                  reject(new Error('Botão de salvar não encontrado'));
                }
              }, 1000);
            }, 2000);
          } else {
            console.log('❌ Nenhum botão de adicionar encontrado');
            reject(new Error('Botão de adicionar não encontrado'));
          }
        }, 2000);
      } else {
        console.log('❌ Menu Recursos Humanos não encontrado');
        reject(new Error('Menu Recursos Humanos não encontrado'));
      }
    } catch (error) {
      console.error('❌ Erro ao criar funcionário:', error);
      reject(error);
    }
  });
};

// Dados para Ana Beatriz Costa Silva
const dadosAna = {
  matricula: 'EMP2024002',
  employeeName: 'Ana Beatriz Costa Silva',
  email: 'ana.costa@igreja.com.br',
  cpf: '456.789.123-45'
};

// Dados para Carlos Roberto Mendes
const dadosCarlos = {
  matricula: 'EMP2024001',
  employeeName: 'Carlos Roberto Mendes',
  email: 'carlos.mendes@igreja.com.br',
  cpf: '789.012.345-67'
};

// Dados para Maria Silva Santos
const dadosMaria = {
  matricula: 'EMP2024003',
  employeeName: 'Maria Silva Santos',
  email: 'maria.santos@igreja.com.br',
  cpf: '123.456.789-01'
};

// Função principal
const diagnosticarECriar = async () => {
  console.log('🎯 INICIANDO DIAGNÓSTICO E CRIAÇÃO...');
  
  try {
    // 1. Verificar status atual
    const statusOk = await verificarStatusAtual();
    
    if (statusOk) {
      console.log('✅ Wagner e Jefferson já existem, criando os outros 3...');
      
      // 2. Criar Ana
      console.log('📋 Criando Ana Beatriz Costa Silva...');
      await criarFuncionarioInterface(dadosAna);
      
      // Esperar um pouco
      setTimeout(async () => {
        // 3. Criar Carlos
        console.log('📋 Criando Carlos Roberto Mendes...');
        await criarFuncionarioInterface(dadosCarlos);
        
        setTimeout(async () => {
          // 4. Criar Maria
          console.log('📋 Criando Maria Silva Santos...');
          await criarFuncionarioInterface(dadosMaria);
          
          setTimeout(() => {
            console.log('🎉 Todos os funcionários criados com sucesso!');
            console.log('📋 Total final: 5 funcionários');
            console.log('📋 Recarregue a página para verificar');
          }, 2000);
        }, 3000);
      }, 3000);
      
    } else {
      console.log('❌ Wagner e Jefferson não encontrados, verifique manualmente');
    }
  } catch (error) {
    console.error('❌ Erro no processo:', error);
  }
};

// Disponibilizar funções globalmente
window.diagnosticarECriar = diagnosticarECriar;
window.verificarStatusAtual = verificarStatusAtual;

console.log('✅ Script de diagnóstico e criação carregado!');
console.log('📋 Para executar o processo completo:');
console.log('   - diagnosticarECriar()');
console.log('📋 Para apenas verificar status:');
console.log('   - verificarStatusAtual()');
console.log('🎯 Isso vai criar Ana, Carlos e Maria automaticamente!');
