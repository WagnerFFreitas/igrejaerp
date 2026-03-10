// Script simples para investigar a interface
// Execute no console após fazer login

console.log('🔍 INVESTIGANDO A INTERFACE...');

const investigarInterface = () => {
  console.log('📋 Verificando elementos visíveis na tela...');
  
  // 1. Verificar todos os botões e links
  const todosBotoes = Array.from(document.querySelectorAll('button, div[role="button"], a, [role="button"]'));
  console.log(`📋 Total de botões/links encontrados: ${todosBotoes.length}`);
  
  const botoesRecursos = todosBotoes.filter(el => 
    el.textContent && (el.textContent.includes('Recursos') || el.textContent.includes('Humanos'))
  );
  console.log(`📋 Botões de Recursos Humanos: ${botoesRecursos.length}`);
  
  // 2. Verificar conteúdo principal
  const mainContent = document.querySelector('main, [role="main"], .main, #root > div > div');
  if (mainContent) {
    console.log('✅ Conteúdo principal encontrado');
    console.log('📋 Texto do conteúdo:', mainContent.textContent.substring(0, 200));
  }
  
  // 3. Verificar abas ativas
  const abas = document.querySelectorAll('[role="tab"], [data-tab], button[aria-selected]');
  console.log(`📋 Abas encontradas: ${abas.length}`);
  
  // 4. Verificar se há tabela ou lista
  const tabelas = document.querySelectorAll('table, tbody, [role="table"], [role="grid"]');
  console.log(`📋 Tabelas encontradas: ${tabelas.length}`);
  
  // 5. Verificar cards ou itens
  const cards = document.querySelectorAll('.card, [role="card"], .employee, .funcionario');
  console.log(`📋 Cards encontrados: ${cards.length}`);
  
  // 6. Verificar inputs visíveis
  const inputs = document.querySelectorAll('input, select, textarea');
  console.log(`📋 Inputs encontrados: ${inputs.length}`);
  
  // 7. Verificar se há algum texto de "funcionário"
  const textoPagina = document.body.textContent || document.body.innerText;
  if (textoPagina) {
    const mencoesFuncionario = textoPagina.toLowerCase().match(/funcionário|employee|colaborador/g);
    console.log(`📋 Menções a "funcionário": ${mencoesFuncionario ? mencoesFuncionario.length : 0}`);
  }
  
  // 8. Verificar estado atual da URL
  console.log(`📋 URL atual: ${window.location.href}`);
  
  // 9. Tentar encontrar Wagner e Jefferson especificamente
  const textoCompleto = document.body.textContent || document.body.innerText;
  if (textoCompleto) {
    const wagnerEncontrado = textoCompleto.includes('Wagner');
    const jeffersonEncontrado = textoCompleto.includes('Jefferson');
    
    console.log(`📋 Wagner encontrado no texto: ${wagnerEncontrado}`);
    console.log(`📋 Jefferson encontrado no texto: ${jeffersonEncontrado}`);
    
    if (wagnerEncontrado && jeffersonEncontrado) {
      console.log('✅ Wagner e Jefferson estão visíveis na página!');
    } else {
      console.log('❌ Wagner ou Jefferson não estão visíveis');
    }
  }
  
  // 10. Verificar estrutura da aplicação
  console.log('📋 Estrutura da aplicação:');
  console.log('   - React DevTools disponível:', typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined');
  console.log('   - Componentes React:', document.querySelectorAll('[data-reactroot]')?.length || 0);
  
  return {
    botoesRecursos: botoesRecursos.length,
    wagnerEncontrado,
    jeffersonEncontrado,
    totalBotoes: todosBotoes.length,
    totalCards: cards.length,
    totalInputs: inputs.length
  };
};

// Função para tentar acessar funcionários existentes
const acessarFuncionarios = () => {
  console.log('🔧 TENTANDO ACESSAR FUNCIONÁRIOS...');
  
  // Procurar por diferentes nomes de botões
  const nomesBotoes = ['Funcionários', 'Employees', 'Colaboradores', 'RH', 'DP', 'Pessoal'];
  
  for (const nome of nomesBotoes) {
    const botoes = Array.from(document.querySelectorAll('button, div[role="button"], a')).filter(el => 
      el.textContent && el.textContent.includes(nome)
    );
    
    if (botoes.length > 0) {
      console.log(`✅ Botão "${nome}" encontrado: ${botoes.length}`);
      botoes[0].click();
      
      setTimeout(() => {
        console.log('📋 Aguardando carregamento...');
      }, 1000);
      
      return true;
    }
  }
  
  console.log(`❌ Nenhum botão com nomes "${nomesBotoes.join(', ')}" encontrado`);
  return false;
};

// Disponibilizar funções globalmente
window.investigarInterface = investigarInterface;
window.acessarFuncionarios = acessarFuncionarios;

console.log('✅ Script de investigação carregado!');
console.log('📋 Para executar:');
console.log('   - investigarInterface() - para ver o que está visível');
console.log('   - acessarFuncionarios() - para tentar acessar a lista de funcionários');
console.log('🔍 Execute um por vez para investigar!');
