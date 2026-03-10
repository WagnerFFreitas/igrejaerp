// Script que importa dbService corretamente
// Execute no console após fazer login

console.log('🔍 IMPORTANDO dbService CORRETAMENTE...');

// Importar o dbService do contexto da aplicação
const importarDbService = async () => {
  try {
    // Tentar diferentes formas de acessar o dbService
    console.log('📍 Testando formas de acesso...');
    
    // Forma 1: window.dbService
    if (window.dbService) {
      console.log('✅ dbService encontrado em window.dbService');
      return window.dbService;
    }
    
    // Forma 2: React context (mais provável)
    const reactRoot = document.querySelector('#root');
    if (reactRoot) {
      console.log('✅ React root encontrado, tentando acessar...');
      // Tentar acessar através do React DevTools
      console.log('📋 Componentes React:', Object.keys(window.__REACT_DEVTOOLS_GLOBAL_HOOK__));
    }
    
    // Forma 3: Import direto do módulo
    console.log('📍 Tentando import dinâmico...');
    
    // Verificar se podemos acessar o módulo databaseService
    if (typeof window !== 'undefined') {
      // Tentar acessar através do contexto global
      const appElement = document.querySelector('[data-reactroot]');
      if (appElement) {
        console.log('✅ Elemento da app encontrado');
      }
      
      // Tentar acessar o dbService do escopo global
      const scripts = document.querySelectorAll('script');
      for (let script of scripts) {
        if (script.textContent && script.textContent.includes('dbService')) {
          console.log('✅ Script com dbService encontrado');
        }
      }
    }
    
    throw new Error('dbService não encontrado em nenhum escopo');
    
  } catch (error) {
    console.error('❌ Erro ao importar dbService:', error);
    return null;
  }
};

// Função principal
const verificarFuncionariosComImport = async () => {
  console.log('🔍 Iniciando verificação com import...');
  
  const db = await importarDbService();
  
  if (db) {
    console.log('✅ dbService importado com sucesso!');
    
    try {
      const employees = await db.getEmployees('u-sede');
      console.log('📋 Funcionários encontrados:', employees.length);
      
      if (employees.length > 0) {
        console.log('📋 Lista completa:');
        employees.forEach((emp, index) => {
          console.log(`${index + 1}. ${emp.employeeName || emp.name || 'SEM NOME'}`);
          console.log(`   ID: ${emp.id}`);
          console.log(`   Matrícula: ${emp.matricula || 'N/A'}`);
          console.log(`   CPF: ${emp.cpf || 'N/A'}`);
          console.log('---');
        });
      } else {
        console.log('❌ Nenhum funcionário encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar funcionários:', error);
    }
  } else {
    console.error('❌ Não foi possível importar dbService');
  }
};

// Disponibilizar globalmente
window.verificarFuncionariosComImport = verificarFuncionariosComImport;

console.log('✅ Script com import carregado!');
console.log('🎯 Para executar, digite: verificarFuncionariosComImport()');
