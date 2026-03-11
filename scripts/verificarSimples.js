// Script simples para verificar funcionários
// Copie manualmente no console (sem colar automaticamente)

console.log('🔍 Iniciando verificação de funcionários...');

// Verificar funcionários da unidade atual
dbService.getEmployees('u-sede').then(employees => {
  console.log('📋 Funcionários encontrados:', employees.length);
  console.log('👤 Detalhes dos funcionários:');
  
  employees.forEach((emp, index) => {
    console.log(`${index + 1}. ${emp.employeeName || emp.name || 'Sem nome'}`);
    console.log(`   ID: ${emp.id}`);
    console.log(`   Matrícula: ${emp.matricula || 'N/A'}`);
    console.log(`   CPF: ${emp.cpf || 'N/A'}`);
    console.log(`   Unidade: ${emp.unitId || 'N/A'}`);
    console.log('---');
  });
  
  if (employees.length === 0) {
    console.log('⚠️ Nenhum funcionário encontrado!');
    console.log('💡 Possíveis causas:');
    console.log('   1. Dados não foram salvos corretamente');
    console.log('   2. UnitId incorreto');
    console.log('   3. Erro no IndexedDB');
  }
}).catch(error => {
  console.error('❌ Erro ao buscar funcionários:', error);
});

console.log('✅ Verificação concluída!');
