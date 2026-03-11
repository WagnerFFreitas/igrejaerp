// Script para verificar DIRETAMENTE no IndexedDB
// Execute no console após fazer login

console.log('🔍 VERIFICAÇÃO DIRETA NO IndexedDB...');

// Abrir IndexedDB diretamente
const verificarDadosDireto = () => {
  return new Promise((resolve, reject) => {
    console.log('📍 Abrindo IndexedDB diretamente...');
    
    const request = indexedDB.open('ADJPA_ERP_DB', 3);
    
    request.onerror = function(event) {
      console.error('❌ Erro ao abrir IndexedDB:', event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = function(event) {
      const db = event.target.result;
      console.log('✅ IndexedDB aberto com sucesso!');
      console.log('📊 Versão:', db.version);
      console.log('📊 Stores disponíveis:', Array.from(db.objectStoreNames));
      
      const resultados = {};
      
      // Verificar cada store
      const stores = ['users', 'members', 'employees', 'transactions', 'accounts', 'assets', 'audit_logs'];
      
      let verificados = 0;
      
      stores.forEach(storeName => {
        if (db.objectStoreNames.contains(storeName)) {
          const transaction = db.transaction([storeName], 'readonly');
          const store = transaction.objectStore(storeName);
          const getAllRequest = store.getAll();
          
          getAllRequest.onsuccess = function() {
            const dados = getAllRequest.result;
            resultados[storeName] = dados;
            verificados++;
            
            console.log(`📋 Store "${storeName}": ${dados.length} itens`);
            
            if (dados.length > 0 && storeName === 'employees') {
              console.log('👤 FUNCIONÁRIOS ENCONTRADOS:');
              dados.forEach((emp, index) => {
                console.log(`${index + 1}. ${emp.employeeName || emp.name || 'SEM NOME'}`);
                console.log(`   ID: ${emp.id}`);
                console.log(`   Matrícula: ${emp.matricula || 'N/A'}`);
                console.log(`   CPF: ${emp.cpf || 'N/A'}`);
                console.log(`   Email: ${emp.email || 'N/A'}`);
                console.log(`   Cargo: ${emp.cargo || 'N/A'}`);
                console.log('---');
              });
            }
            
            if (dados.length > 0 && storeName === 'members') {
              console.log('👥 MEMBROS ENCONTRADOS:');
              dados.forEach((mem, index) => {
                console.log(`${index + 1}. ${mem.name || 'SEM NOME'}`);
                console.log(`   ID: ${mem.id}`);
                console.log(`   CPF: ${mem.cpf || 'N/A'}`);
                console.log(`   Email: ${mem.email || 'N/A'}`);
                console.log('---');
              });
            }
            
            if (verificados === stores.length) {
              console.log('✅ Todas as stores verificadas!');
              console.log('📊 RESUMO FINAL:');
              console.log(`   - Usuários: ${resultados.users?.length || 0}`);
              console.log(`   - Membros: ${resultados.members?.length || 0}`);
              console.log(`   - Funcionários: ${resultados.employees?.length || 0}`);
              console.log(`   - Transações: ${resultados.transactions?.length || 0}`);
              console.log(`   - Contas: ${resultados.accounts?.length || 0}`);
              console.log(`   - Ativos: ${resultados.assets?.length || 0}`);
              console.log(`   - Logs de Auditoria: ${resultados.audit_logs?.length || 0}`);
              
              resolve(resultados);
            }
          };
          
          getAllRequest.onerror = function() {
            console.error(`❌ Erro ao buscar store "${storeName}":`, getAllRequest.error);
          };
          
          transaction.oncomplete = function() {
            // Store verificada
          };
        } else {
          console.log(`❌ Store "${storeName}" não encontrada`);
          verificados++;
        }
      });
      
      if (verificados < stores.length) {
        console.log('❌ Algumas stores não foram encontradas');
        resolve(resultados);
      }
    };
    
    request.onupgradeneeded = function(event) {
      console.log('🔄 IndexedDB precisa de upgrade...');
      const db = event.target.result;
      console.log('📊 Stores atuais:', Array.from(db.objectStoreNames));
    };
  });
};

// Disponibilizar globalmente
window.verificarDadosDireto = verificarDadosDireto;

console.log('✅ Script de verificação direta carregado!');
console.log('📋 Para executar: verificarDadosDireto()');
console.log('🎯 Isso mostrará EXATAMENTE o que existe no banco de dados!');
