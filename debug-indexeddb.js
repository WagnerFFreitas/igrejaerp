// Ferramenta de debug para IndexedDB
// Cole este código no console do navegador para debugar

async function debugIndexedDB() {
  console.log('🔍 DEBUG IndexedDB - ADJPA ERP');
  console.log('================================');
  
  try {
    // Abrir banco
    const request = indexedDB.open('ADJPA_ERP_DB', 1);
    
    request.onsuccess = function(event) {
      const db = event.target.result;
      console.log('✅ Banco aberto:', db.name);
      console.log('📁 Stores disponíveis:', Array.from(db.objectStoreNames));
      
      // Verificar cada store
      const stores = ['members', 'transactions', 'accounts', 'employees', 'assets', 'leaves'];
      
      stores.forEach(storeName => {
        if (db.objectStoreNames.contains(storeName)) {
          const transaction = db.transaction(storeName, 'readonly');
          const store = transaction.objectStore(storeName);
          const getRequest = store.getAll();
          
          getRequest.onsuccess = function() {
            const data = getRequest.result;
            console.log(`📊 ${storeName}:`, data.length, 'itens');
            if (data.length > 0) {
              console.log('📋 Primeiro item:', data[0]);
            }
          };
          
          getRequest.onerror = function() {
            console.error(`❌ Erro ao ler ${storeName}:`, getRequest.error);
          };
        } else {
          console.warn(`⚠️ Store ${storeName} não existe`);
        }
      });
    };
    
    request.onerror = function(event) {
      console.error('❌ Erro ao abrir banco:', request.error);
    };
    
    request.onupgradeneeded = function(event) {
      console.log('🔄 Banco precisa de upgrade...');
    };
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Função para limpar IndexedDB
async function clearIndexedDB() {
  console.log('🧹 Limpando IndexedDB...');
  
  try {
    const deleteRequest = indexedDB.deleteDatabase('ADJPA_ERP_DB');
    
    deleteRequest.onsuccess = function() {
      console.log('✅ IndexedDB limpo com sucesso');
      console.log('🔄 Recarregue a página para recriar o banco');
    };
    
    deleteRequest.onerror = function() {
      console.error('❌ Erro ao limpar IndexedDB:', deleteRequest.error);
    };
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Disponibilizar funções globalmente
window.debugIndexedDB = debugIndexedDB;
window.clearIndexedDB = clearIndexedDB;

console.log('🛠️ Ferramentas de debug carregadas!');
console.log('Use: debugIndexedDB() para verificar dados');
console.log('Use: clearIndexedDB() para limpar tudo');
