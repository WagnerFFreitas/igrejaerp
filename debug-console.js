// Cole este código no console do navegador para debugar

// 1. Verificar IndexedDB
async function verificarIndexedDB() {
  console.log('🔍 Verificando IndexedDB...');
  
  try {
    const request = indexedDB.open('ADJPA_ERP_DB', 1);
    
    request.onsuccess = function(event) {
      const db = event.target.result;
      console.log('✅ Banco aberto:', db.name);
      console.log('📁 Stores:', Array.from(db.objectStoreNames));
      
      // Verificar members
      if (db.objectStoreNames.contains('members')) {
        const transaction = db.transaction('members', 'readonly');
        const store = transaction.objectStore('members');
        const getRequest = store.getAll();
        
        getRequest.onsuccess = function() {
          const members = getRequest.result;
          console.log(`📊 Members encontrados: ${members.length}`);
          console.log('📋 Dados:', members);
        };
      }
    };
    
    request.onerror = function() {
      console.error('❌ Erro ao abrir banco:', request.error);
    };
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// 2. Testar salvamento manual
async function testeSalvar() {
  console.log('🧪 Testando salvamento manual...');
  
  try {
    const request = indexedDB.open('ADJPA_ERP_DB', 1);
    
    request.onsuccess = function(event) {
      const db = event.target.result;
      const transaction = db.transaction('members', 'readwrite');
      const store = transaction.objectStore('members');
      
      const testData = {
        id: `manual_${Date.now()}`,
        name: 'Teste Manual',
        email: 'manual@teste.com',
        unitId: 'u-sede',
        createdAt: new Date().toISOString()
      };
      
      const putRequest = store.put(testData);
      
      putRequest.onsuccess = function() {
        console.log('✅ Dado salvo manualmente:', testData);
      };
      
      putRequest.onerror = function() {
        console.error('❌ Erro ao salvar manualmente:', putRequest.error);
      };
    };
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// 3. Limpar IndexedDB
function limparIndexedDB() {
  console.log('🧹 Limpando IndexedDB...');
  const deleteRequest = indexedDB.deleteDatabase('ADJPA_ERP_DB');
  
  deleteRequest.onsuccess = function() {
    console.log('✅ IndexedDB limpo. Recarregue a página.');
  };
  
  deleteRequest.onerror = function() {
    console.error('❌ Erro ao limpar:', deleteRequest.error);
  };
}

console.log('🛠️ Funções disponíveis:');
console.log('verificarIndexedDB() - Verifica dados no IndexedDB');
console.log('testeSalvar() - Testa salvamento manual');
console.log('limparIndexedDB() - Limpa tudo');

// Executar verificação automática
verificarIndexedDB();
