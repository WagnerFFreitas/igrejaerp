// Script JavaScript para atualizar IndexedDB diretamente
// Execute no console do navegador após fazer login

console.log('🔧 ATUALIZANDO INDEXEDDB DIRETAMENTE...');

const atualizarIndexedDB = async () => {
  try {
    console.log('📍 Abrindo IndexedDB...');
    
    const request = indexedDB.open('ADJPA_ERP_DB', 3);
    
    return new Promise((resolve, reject) => {
      request.onerror = function(event) {
        console.error('❌ Erro ao abrir IndexedDB:', event.target.error);
        reject(event.target.error);
      };
      
      request.onsuccess = function(event) {
        const db = event.target.result;
        console.log('✅ IndexedDB aberto com sucesso!');
        
        const transaction = db.transaction(['employees'], 'readwrite');
        const store = transaction.objectStore('employees');
        
        // Ler dados existentes
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = function() {
          const existingEmployees = getAllRequest.result;
          console.log(`📋 Funcionários existentes: ${existingEmployees.length}`);
          
          // Dados completos para atualizar
          const updatedEmployees = [
            {
              id: 'E1773008810676',
              unitId: 'u-sede',
              matricula: 'EMP2024005',
              employeeName: 'Wagner Ferreira Freitas',
              email: 'wagner.freitas@igreja.com.br',
              cpf: '111.222.333-44',
              rg: 'MG-11.222.333',
              pis: '999.88877.99-9',
              ctps: '00987654321',
              titulo: '111222333444',
              reservista: 'AM999888',
              aso_data: '2024-01-15',
              blood_type: 'A+',
              emergency_contact: '(31) 98877-6654 - Maria Freitas (esposa)',
              birthDate: '1980-03-15',
              cargo: 'Desenvolvedor de Sistemas',
              funcao: 'Desenvolvedor Full Stack',
              departamento: 'TI',
              cbo: '2521-05',
              data_admissao: '2019-01-15',
              tipo_contrato: 'CLT',
              jornada_trabalho: '08:00 às 17:00',
              regime_trabalho: 'HÍBRIDO',
              salario_base: 5500.00,
              tipo_salario: 'MENSAL',
              sindicato: 'Sindicato dos Tecnologistas',
              convencao_coletiva: 'Convenção Coletiva 2024/2025',
              banco: 'Banco do Brasil',
              codigo_banco: '001',
              agencia: '1234-5',
              conta: '54321-0',
              tipo_conta: 'CORRENTE',
              titular: 'Wagner Ferreira Freitas',
              chave_pix: 'wagner.freitas@igreja.com.br',
              vale_transporte_total: 200.00,
              vale_alimentacao: 300.00,
              vale_refeicao: 0,
              plano_saude_colaborador: 250.00,
              vale_farmacia: 100.00,
              seguro_vida: 0
            },
            {
              id: 'E1773008810677',
              unitId: 'u-sede',
              matricula: 'EMP2024006',
              employeeName: 'Jefferson Araújo',
              email: 'jefferson.araujo@igreja.com.br',
              cpf: '222.333.444-55',
              rg: 'MG-22.333.444',
              pis: '888.99966.11-8',
              ctps: '00876543210',
              titulo: '222333444555',
              reservista: 'RM888999',
              aso_data: '2024-02-01',
              blood_type: 'B+',
              emergency_contact: '(31) 97766-5543 - Ana Araújo (esposa)',
              birthDate: '1985-07-20',
              cargo: 'Coordenador de Ministério',
              funcao: 'Coordenador de Jovens',
              departamento: 'Ministério',
              cbo: '2522-05',
              data_admissao: '2018-03-10',
              tipo_contrato: 'CLT',
              jornada_trabalho: '08:00 às 17:00',
              regime_trabalho: 'PRESENCIAL',
              salario_base: 3500.00,
              tipo_salario: 'MENSAL',
              sindicato: 'Sindicato de Pastores',
              convencao_coletiva: 'Convenção Coletiva 2024/2025',
              banco: 'Caixa Econômica Federal',
              codigo_banco: '104',
              agencia: '5678-9',
              conta: '98765-4',
              tipo_conta: 'CORRENTE',
              titular: 'Jefferson Araújo',
              chave_pix: 'jefferson.araujo@igreja.com.br',
              vale_transporte_total: 180.00,
              vale_alimentacao: 250.00,
              vale_refeicao: 150.00,
              plano_saude_colaborador: 200.00,
              vale_farmacia: 80.00,
              seguro_vida: 0
            },
            {
              id: 'E177317706292',
              unitId: 'u-sede',
              matricula: 'EMP2024003',
              employeeName: 'Maria Silva Santos',
              email: 'maria.santos@igreja.com.br',
              cpf: '123.456.789-01',
              rg: 'MG-12.345.678',
              pis: '111.22233.44-1',
              ctps: '00123456789',
              titulo: '1234567890123',
              reservista: 'AM123456',
              aso_data: '2024-01-15',
              blood_type: 'O+',
              emergency_contact: '(31) 98765-4321 - João Silva (irmão)',
              birthDate: '1985-07-22',
              cargo: 'Professora',
              funcao: 'Professora de Adolescentes',
              departamento: 'Escola Dominical',
              cbo: '2521-05',
              data_admissao: '2020-03-15',
              tipo_contrato: 'CLT',
              jornada_trabalho: '08:00 às 17:00',
              regime_trabalho: 'PRESENCIAL',
              salario_base: 2200.00,
              tipo_salario: 'MENSAL',
              sindicato: 'Sindicato dos Professores',
              convencao_coletiva: 'Convenção Coletiva 2024/2025',
              banco: 'Banco do Brasil',
              codigo_banco: '001',
              agencia: '1234-5',
              conta: '12345-6',
              tipo_conta: 'CORRENTE',
              titular: 'Maria Silva Santos',
              chave_pix: 'maria.santos@igreja.com.br',
              vale_transporte_total: 150.00,
              vale_alimentacao: 200.00,
              vale_refeicao: 0,
              plano_saude_colaborador: 120.00,
              vale_farmacia: 0,
              seguro_vida: 0
            },
            {
              id: 'E177317706292',
              unitId: 'u-sede',
              matricula: 'EMP2024002',
              employeeName: 'Ana Beatriz Costa Silva',
              email: 'ana.costa@igreja.com.br',
              cpf: '456.789.123-45',
              rg: 'MG-45.678.912',
              pis: '123.45678.90-1',
              ctps: '00123456789',
              titulo: '1234567890123',
              reservista: 'AM123456',
              aso_data: '2024-01-15',
              blood_type: 'O+',
              emergency_contact: '(31) 91234-5678 - Maria Costa (mãe)',
              birthDate: '1992-08-25',
              cargo: 'Secretária Executiva',
              funcao: 'Secretária Administrativa',
              departamento: 'Secretaria',
              cbo: '2521-05',
              data_admissao: '2020-03-15',
              tipo_contrato: 'CLT',
              jornada_trabalho: '08:00 às 17:00',
              regime_trabalho: 'PRESENCIAL',
              salario_base: 2500.00,
              tipo_salario: 'MENSAL',
              sindicato: 'Sindicato dos Secretários',
              convencao_coletiva: 'Convenção Coletiva 2024/2025',
              banco: 'Banco do Brasil',
              codigo_banco: '001',
              agencia: '1234-5',
              conta: '12345-6',
              tipo_conta: 'CORRENTE',
              titular: 'Ana Beatriz Costa Silva',
              chave_pix: 'ana.costa@igreja.com.br',
              vale_transporte_total: 150.00,
              vale_alimentacao: 200.00,
              vale_refeicao: 0,
              plano_saude_colaborador: 120.00,
              vale_farmacia: 0,
              seguro_vida: 0
            },
            {
              id: 'E1773008810676',
              unitId: 'u-sede',
              matricula: 'EMP2024001',
              employeeName: 'Carlos Roberto Mendes',
              email: 'carlos.mendes@igreja.com.br',
              cpf: '789.012.345-67',
              rg: 'MG-78.901.234',
              pis: '987.65432.10-9',
              ctps: '00234567890',
              titulo: '9876543210987',
              reservista: 'RM987654',
              aso_data: '2024-02-01',
              blood_type: 'A+',
              emergency_contact: '(31) 99876-5432 - Joana Mendes (esposa)',
              birthDate: '1980-11-30',
              cargo: 'Auxiliar de Serviços Gerais',
              funcao: 'Suporte Administrativo',
              departamento: 'Zeladoria',
              cbo: '5112-10',
              data_admissao: '2018-06-10',
              tipo_contrato: 'CLT',
              jornada_trabalho: '08:00 às 17:00',
              regime_trabalho: 'PRESENCIAL',
              salario_base: 1800.00,
              tipo_salario: 'MENSAL',
              sindicato: 'Sindicato dos Trabalhadores em Limpeza',
              convencao_coletiva: 'Convenção Coletiva 2024/2025',
              banco: 'Banco do Brasil',
              codigo_banco: '001',
              agencia: '5678-9',
              conta: '98765-4',
              tipo_conta: 'CORRENTE',
              titular: 'Carlos Roberto Mendes',
              chave_pix: 'carlos.mendes@igreja.com.br',
              vale_transporte_total: 120.00,
              vale_alimentacao: 150.00,
              vale_refeicao: 0,
              plano_saude_colaborador: 120.00,
              vale_farmacia: 0,
              seguro_vida: 0
            }
          ];
          
          // Atualizar cada funcionário existente
          updatedEmployees.forEach((updatedEmp, index) => {
            const existingEmp = existingEmployees.find(emp => emp.id === updatedEmp.id);
            if (existingEmp) {
              const updateRequest = store.put(updatedEmp);
              updateRequest.onsuccess = function() {
                console.log(`✅ Funcionário ${updatedEmp.employeeName} atualizado!`);
              };
              updateRequest.onerror = function() {
                console.error(`❌ Erro ao atualizar ${updatedEmp.employeeName}:`, updateRequest.error);
              };
            } else {
              // Adicionar novo funcionário
              const addRequest = store.add(updatedEmp);
              addRequest.onsuccess = function() {
                console.log(`✅ Funcionário ${updatedEmp.employeeName} adicionado!`);
              };
              addRequest.onerror = function() {
                console.error(`❌ Erro ao adicionar ${updatedEmp.employeeName}:`, addRequest.error);
              };
            }
          });
          
          transaction.oncomplete = function() {
            console.log('✅ Todos os funcionários foram atualizados!');
            console.log('📋 Total de funcionários atualizados:', updatedEmployees.length);
            resolve();
          };
        };
        
        transaction.onerror = function() {
          console.error('❌ Erro na transação:', transaction.error);
          reject(transaction.error);
        };
      };
      
      request.onupgradeneeded = function(event) {
        console.log('🔄 IndexedDB precisa de upgrade...');
      };
    });
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
};

// Disponibilizar globalmente
window.atualizarIndexedDB = atualizarIndexedDB;

console.log('✅ Script de atualização carregado!');
console.log('📋 Para executar: atualizarIndexedDB()');
console.log('🎯 Isso vai atualizar 5 funcionários com dados completos no IndexedDB!');
console.log('📋 Recarregue a página para ver os resultados!');
