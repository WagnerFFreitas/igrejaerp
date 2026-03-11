// INSTRUÇÕES PARA EXECUTAR SCRIPTS NO CONSOLE
// Siga estes passos exatamente

console.log('📋 INSTRUÇÕES PARA EXECUTAR SCRIPTS');
console.log('');
console.log('🔍 PASSO 1: Abra o console (F12)');
console.log('🔍 PASSO 2: Digite: allow pasting');
console.log('🔍 PASSO 3: Pressione Enter');
console.log('🔍 PASSO 4: Copie e cole o script abaixo');
console.log('');

// Script simples para verificar funcionários
const verificarFuncionariosSimples = () => {
  console.log('🔍 Verificando funcionários...');
  
  // Usar o dbService que já está disponível globalmente
  if (typeof dbService !== 'undefined') {
    dbService.getEmployees('u-sede').then(employees => {
      console.log('✅ Funcionários encontrados:', employees.length);
      
      if (employees.length > 0) {
        console.log('📋 Lista:');
        employees.forEach((emp, i) => {
          console.log(`${i+1}. ${emp.employeeName || emp.name || 'SEM NOME'}`);
          console.log(`   ID: ${emp.id}`);
          console.log(`   Matrícula: ${emp.matricula || 'N/A'}`);
          console.log(`   CPF: ${emp.cpf || 'N/A'}`);
          console.log('---');
        });
      } else {
        console.log('❌ Nenhum funcionário encontrado');
      }
    }).catch(error => {
      console.error('❌ Erro:', error);
    });
  } else {
    console.error('❌ dbService não encontrado');
  }
};

// Disponibilizar função globalmente
window.verificarFuncionariosSimples = verificarFuncionariosSimples;

console.log('✅ Script carregado!');
console.log('🎯 Para executar, digite: verificarFuncionariosSimples()');
console.log('');
console.log('📋 DICA: Se der erro "allow pasting", feche e abra o console novamente!');
