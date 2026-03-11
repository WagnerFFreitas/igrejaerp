// Script principal para popular o banco de dados com dados fictícios
// Execute este código no console do navegador após fazer login

// Importar as funções dos scripts
import { createMockData } from './createMockData.js';
import { updateWagnerData } from './updateWagnerData.js';

// Função principal para popular o banco
const populateDatabase = async () => {
  console.log('🚀 Iniciando população do banco de dados...');
  
  try {
    // 1. Criar dados fictícios
    await createMockData();
    
    // 2. Atualizar dados do Wagner
    await updateWagnerData();
    
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

// Exportar a função principal
window.populateDatabase = populateDatabase;

// Instruções
console.log('📋 Para executar a população do banco, digite:');
console.log('   populateDatabase()');
console.log('');
console.log('📋 Dados que serão criados:');
console.log('   👥 Membros: Maria Silva Santos, José Carlos Pereira');
console.log('   💼 Funcionários: Ana Beatriz Costa Silva, Carlos Roberto Mendes');
console.log('   🔄 Wagner: Dados completos como membro e funcionário');
