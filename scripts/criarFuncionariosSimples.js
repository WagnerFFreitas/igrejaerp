// Script ultra-simples para criar funcionários
// Execute passo a passo no console

console.log('🔄 Criando funcionários Maria Silva Santos...');

// Passo 1: Criar Maria Silva Santos
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

dbService.saveEmployee(maria).then(() => {
  console.log('✅ Maria Silva Santos criada com sucesso!');
  
  console.log('🔄 Criando José Carlos Pereira...');
  
  // Passo 2: Criar José Carlos Pereira
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
  
  return dbService.saveEmployee(jose);
}).then(() => {
  console.log('✅ José Carlos Pereira criado com sucesso!');
  console.log('🎉 Todos os funcionários criados!');
  
  // Verificar resultado
  return dbService.getEmployees('u-sede');
}).then(employees => {
  console.log(`📊 Total de funcionários: ${employees.length}`);
  console.log('📋 Lista:');
  employees.forEach((emp, i) => {
    console.log(`${i+1}. ${emp.employeeName || emp.name}`);
  });
}).catch(error => {
  console.error('❌ Erro:', error);
});
