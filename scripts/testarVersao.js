// Script simples para testar se o erro de versão foi corrigido
// Execute no console após fazer login

console.log('🔍 Testando correção do erro de versão...');

// Testar busca de funcionários (deve funcionar agora)
dbService.getEmployees('u-sede').then(employees => {
  console.log('✅ Sucesso! Funcionários encontrados:', employees.length);
  
  if (employees.length > 0) {
    console.log('\n📋 Lista de funcionários:');
    employees.forEach((emp, index) => {
      console.log(`${index + 1}. ${emp.employeeName || emp.name || 'SEM NOME'}`);
      console.log(`   ID: ${emp.id}`);
      console.log(`   Matrícula: ${emp.matricula || 'N/A'}`);
      console.log(`   CPF: ${emp.cpf || 'N/A'}`);
      console.log(`   UnitId: ${emp.unitId || 'N/A'}`);
      console.log('---');
    });
  } else {
    console.log('⚠️ Nenhum funcionário encontrado');
  }
  
}).catch(error => {
  console.error('❌ Ainda há erro:', error);
});

console.log('🎯 Se funcionou, o erro de versão foi corrigido!');
