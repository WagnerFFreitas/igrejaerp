// Script com logs detalhados para encontrar o erro
// Execute no console após fazer login

console.log('🔍 INICIANDO SCRIPT COM LOGS DETALHADOS...');
console.log('📍 Passo 1: Verificando se dbService existe...');

try {
  console.log('✅ dbService disponível:', typeof dbService);
  console.log('✅ Métodos disponíveis:', Object.getOwnPropertyNames(dbService));
  
  console.log('📍 Passo 2: Criando Maria Silva Santos...');
  
  const maria = {
    id: 'emp_maria_' + Date.now(),
    unitId: 'u-sede',
    matricula: 'EMP2024003',
    employeeName: 'Maria Silva Santos',
    email: 'maria.santos@igreja.com.br',
    cpf: '123.456.789-01',
    cargo: 'Professora',
    departamento: 'Escola Dominical'
  };
  
  console.log('📋 Dados da Maria:', maria);
  console.log('📍 Passo 3: Chamando dbService.saveEmployee...');
  
  return dbService.saveEmployee(maria).then(result => {
    console.log('✅ saveEmployee concluído! Resultado:', result);
    console.log('📍 Passo 4: Criando José Carlos Pereira...');
    
    const jose = {
      id: 'emp_jose_' + Date.now(),
      unitId: 'u-sede',
      matricula: 'EMP2024004',
      employeeName: 'José Carlos Pereira',
      email: 'jose.pereira@igreja.com.br',
      cpf: '987.654.321-09',
      cargo: 'Engenheiro Civil',
      departamento: 'Conselho'
    };
    
    console.log('📋 Dados do José:', jose);
    console.log('📍 Passo 5: Chamando dbService.saveEmployee para José...');
    
    return dbService.saveEmployee(jose).then(result2 => {
      console.log('✅ saveEmployee do José concluído! Resultado:', result2);
      console.log('📍 Passo 6: Verificando funcionários criados...');
      
      return dbService.getEmployees('u-sede').then(employees => {
        console.log('✅ getEmployees concluído!');
        console.log('📊 Total de funcionários:', employees.length);
        console.log('📋 Array completo:', employees);
        
        if (employees && employees.length > 0) {
          console.log('📋 Lista detalhada:');
          employees.forEach((emp, index) => {
            console.log(`${index + 1}. Nome: ${emp.employeeName || emp.name || 'SEM NOME'}`);
            console.log(`   ID: ${emp.id}`);
            console.log(`   Matrícula: ${emp.matricula || 'N/A'}`);
            console.log(`   CPF: ${emp.cpf || 'N/A'}`);
            console.log(`   UnitId: ${emp.unitId || 'N/A'}`);
            console.log('---');
          });
        } else {
          console.log('❌ Nenhum funcionário encontrado!');
        }
        
        console.log('🎉 SCRIPT CONCLUÍDO COM SUCESSO!');
      });
    }).catch(error2 => {
      console.error('❌ Erro ao salvar José:', error2);
      console.error('❌ Stack:', error2.stack);
    });
  }).catch(error1 => {
    console.error('❌ Erro ao salvar Maria:', error1);
    console.error('❌ Stack:', error1.stack);
  });
  
} catch (globalError) {
  console.error('❌ Erro global no script:', globalError);
  console.error('❌ Stack:', globalError.stack);
}
