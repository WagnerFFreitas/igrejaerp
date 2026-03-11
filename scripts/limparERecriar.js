// Script para limpar e recriar o banco de dados
// ATENÇÃO: Isso irá apagar TODOS os dados do IndexedDB

console.log('🧹 LIMPANDO E RECRIANDO BANCO DE DADOS...');
console.log('⚠️ ATENÇÃO: Todos os dados serão perdidos!');

// Limpar localStorage
localStorage.clear();
console.log('✅ localStorage limpo');

// Deletar banco de dados existente
const deleteDB = () => {
  return new Promise((resolve, reject) => {
    const deleteRequest = indexedDB.deleteDatabase('ADJPA_ERP_DB');
    deleteRequest.onsuccess = () => {
      console.log('✅ Banco de dados antigo excluído');
      resolve();
    };
    deleteRequest.onerror = () => {
      console.error('❌ Erro ao excluir banco:', deleteRequest.error);
      reject(deleteRequest.error);
    };
  });
};

// Recriar banco do zero
const recreateDB = async () => {
  try {
    console.log('🔄 Recarregando página em 3 segundos...');
    
    // Esperar um pouco e recarregar a página
    setTimeout(() => {
      window.location.reload();
    }, 3000);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};

// Executar limpeza e recriação
deleteDB().then(() => {
  console.log('🎯 Iniciando recriação do banco...');
  recreateDB();
}).catch(error => {
  console.error('❌ Erro na limpeza:', error);
});

console.log('📋 Script executado! Aguarde 3 segundos para recarregar...');
