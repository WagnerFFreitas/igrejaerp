// Script para diagnosticar funcionários no banco
// Execute no console após fazer login

console.log('🔍 DIAGNÓSTICO COMPLETO DE FUNCIONÁRIOS');

// 1. Verificar TODOS os funcionários no banco (sem filtro)
dbService.getEmployees().then(allEmployees => {
  console.log('📋 TODOS os funcionários no banco (sem filtro):');
  console.log('Quantidade total:', allEmployees.length);
  
  allEmployees.forEach((emp, index) => {
    console.log(`\n${index + 1}. ${emp.employeeName || emp.name || 'SEM NOME'}`);
    console.log(`   ID: ${emp.id}`);
    console.log(`   Matrícula: ${emp.matricula || 'N/A'}`);
    console.log(`   CPF: ${emp.cpf || 'N/A'}`);
    console.log(`   Email: ${emp.email || 'N/A'}`);
    console.log(`   UnitId: ${emp.unitId || 'N/A'}`);
    console.log(`   Cargo: ${emp.cargo || 'N/A'}`);
  });
  
  // 2. Verificar funcionários da unidade u-sede
  return dbService.getEmployees('u-sede').then(unitEmployees => {
    console.log('\n🏢 FUNCIONÁRIOS DA UNIDADE u-sede:');
    console.log('Quantidade:', unitEmployees.length);
    
    unitEmployees.forEach((emp, index) => {
      console.log(`\n${index + 1}. ${emp.employeeName || emp.name || 'SEM NOME'}`);
      console.log(`   ID: ${emp.id}`);
      console.log(`   Matrícula: ${emp.matricula || 'N/A'}`);
      console.log(`   CPF: ${emp.cpf || 'N/A'}`);
    });
    
    // 3. Análise
    console.log('\n🔍 ANÁLISE:');
    console.log('Total no banco:', allEmployees.length);
    console.log('Na unidade u-sede:', unitEmployees.length);
    
    if (allEmployees.length > unitEmployees.length) {
      console.log('⚠️ Há funcionários com unitId diferente de "u-sede"');
      
      const otherUnits = allEmployees.filter(emp => emp.unitId !== 'u-sede');
      console.log('Funcionários em outras unidades:', otherUnits.length);
      
      otherUnits.forEach(emp => {
        console.log(`   - ${emp.employeeName} (unitId: ${emp.unitId})`);
      });
    }
    
    if (allEmployees.length === 0) {
      console.log('❌ NENHUM funcionário encontrado no banco!');
      console.log('💡 O script de criação pode ter falhado');
    }
    
    console.log('\n✅ Diagnóstico concluído!');
  });
}).catch(error => {
  console.error('❌ Erro no diagnóstico:', error);
});
