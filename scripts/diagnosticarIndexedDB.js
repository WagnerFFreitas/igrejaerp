// Script para diagnosticar o IndexedDB diretamente
// Execute no console após fazer login

console.log('🔍 DIAGNÓSTICO DIRETO DO IndexedDB');

// Abrir o IndexedDB diretamente
const request = indexedDB.open('ADJPA_ERP_DB', 3);

request.onerror = function(event) {
  console.error('❌ Erro ao abrir IndexedDB:', event.target.error);
};

request.onsuccess = function(event) {
  const db = event.target.result;
  console.log('✅ IndexedDB aberto com sucesso!');
  console.log('📊 Versão:', db.version);
  console.log('📊 Stores disponíveis:', Array.from(db.objectStoreNames));
  
  // Verificar store de employees
  if (db.objectStoreNames.contains('employees')) {
    const transaction = db.transaction(['employees'], 'readonly');
    const store = transaction.objectStore('employees');
    const getAllRequest = store.getAll();
    
    getAllRequest.onsuccess = function() {
      const employees = getAllRequest.result;
      console.log('📋 Todos os funcionários no IndexedDB:', employees.length);
      
      if (employees.length > 0) {
        console.log('📋 Lista completa:');
        employees.forEach((emp, index) => {
          console.log(`${index + 1}. ${emp.employeeName || emp.name || 'SEM NOME'}`);
          console.log(`   ID: ${emp.id}`);
          console.log(`   Matrícula: ${emp.matricula || 'N/A'}`);
          console.log(`   CPF: ${emp.cpf || 'N/A'}`);
          console.log(`   UnitId: ${emp.unitId || 'N/A'}`);
          console.log(`   Cargo: ${emp.cargo || 'N/A'}`);
          console.log('---');
        });
      } else {
        console.log('❌ NENHUM funcionário encontrado no IndexedDB!');
      }
    };
    
    getAllRequest.onerror = function() {
      console.error('❌ Erro ao buscar funcionários:', getAllRequest.error);
    };
  } else {
    console.log('❌ Store "employees" não encontrada no IndexedDB!');
  }
};

request.onupgradeneeded = function(event) {
  console.log('🔄 IndexedDB precisa de upgrade...');
  const db = event.target.result;
  console.log('📊 Stores atuais:', Array.from(db.objectStoreNames));
};

console.log('🔍 Aguardando resposta do IndexedDB...');
