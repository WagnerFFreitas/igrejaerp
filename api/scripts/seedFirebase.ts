
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Caminho relativo para a chave da conta de serviço
const serviceAccount = require('../serviceAccountKey.json');

// Dados extraídos do seed_dados_ficticios.sql
const data = {
  unidades: [
    { nome: 'Igreja Central', cnpj: '12.345.678/0001-90', situacao: 'ATIVO', ativo: true },
    { nome: 'Igreja Norte', cnpj: '12.345.679/0001-91', situacao: 'ATIVO', ativo: true },
    { nome: 'Igreja Sul', cnpj: '12.345.680/0001-92', situacao: 'ATIVO', ativo: true },
    { nome: 'Igreja Leste', cnpj: '12.345.681/0001-93', situacao: 'INATIVO', ativo: true },
    { nome: 'Igreja Oeste', cnpj: '12.345.682/0001-94', situacao: 'ATIVO', ativo: true },
  ],
  pessoas: [
    { nome: 'Pastor João Silva', cpf: '123.456.789-01', sexo: 'Masculino', estado_civil: 'Casado' },
    { nome: 'Pastora Ana Silva', cpf: '234.567.890-12', sexo: 'Feminino', estado_civil: 'Casada' },
    { nome: 'Carlos Santos', cpf: '345.678.901-23', sexo: 'Masculino', estado_civil: 'Solteiro' },
    { nome: 'Beatriz Oliveira', cpf: '456.789.012-34', sexo: 'Feminino', estado_civil: 'Solteira' },
    { nome: 'Pedro Mendes', cpf: '567.890.123-45', sexo: 'Masculino', estado_civil: 'Casado' },
    { nome: 'Francisca Costa', cpf: '678.901.234-56', sexo: 'Feminino', estado_civil: 'Divorciada' },
    { nome: 'Marcos Ferreira', cpf: '789.012.345-67', sexo: 'Masculino', estado_civil: 'Casado' },
    { nome: 'Gabriel Lima', cpf: '901.234.567-89', sexo: 'Masculino', estado_civil: 'Solteiro' },
  ],
  usuarios: [
      { login: 'pastor_joao', perfil: 'PASTOR', esta_ativo: true, pessoa_nome: 'Pastor João Silva' },
      { login: 'pastora_ana', perfil: 'ADMIN', esta_ativo: true, pessoa_nome: 'Pastora Ana Silva' },
      { login: 'carlos_tesoureiro', perfil: 'TESOUREIRO', esta_ativo: true, pessoa_nome: 'Carlos Santos' },
      { login: 'beatriz_secretaria', perfil: 'SECRETARIO', esta_ativo: true, pessoa_nome: 'Beatriz Oliveira' },
      { login: 'pedro_rh', perfil: 'RH', esta_ativo: true, pessoa_nome: 'Pedro Mendes' },
      { login: 'marcos_membro', perfil: 'MEMBRO', esta_ativo: true, pessoa_nome: 'Marcos Ferreira' },
      { login: 'gabriel_dev', perfil: 'DESENVOLVEDOR', esta_ativo: true, pessoa_nome: 'Gabriel Lima' },
  ]
};

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seedDatabase() {
  console.log('✨ Iniciando a população do Firestore...');

  const pessoaRefs: Record<string, string> = {};

  // Seed Pessoas e armazena referências
  console.log('🚀 Migrando Pessoas...');
  const pessoasCollection = db.collection('pessoas');
  for (const pessoaData of data.pessoas) {
    const docRef = await pessoasCollection.add(pessoaData);
    pessoaRefs[pessoaData.nome] = docRef.id;
    console.log(`  ✓ Pessoa '${pessoaData.nome}' adicionada com ID: ${docRef.id}`);
  }

  // Seed Unidades
  console.log('🚀 Migrando Unidades...');
  const unidadesCollection = db.collection('unidades');
  for (const unidadeData of data.unidades) {
    await unidadesCollection.add(unidadeData);
    console.log(`  ✓ Unidade '${unidadeData.nome}' adicionada.`);
  }

  // Seed Usuários, associando com as pessoas recém-criadas
  console.log('🚀 Migrando Usuários...');
  const usuariosCollection = db.collection('usuarios');
  for (const usuarioData of data.usuarios) {
      const pessoaId = pessoaRefs[usuarioData.pessoa_nome];
      if (pessoaId) {
          const { pessoa_nome, ...rest } = usuarioData; // remove o nome da pessoa
          await usuariosCollection.add({ ...rest, id_pessoa: pessoaId });
          console.log(`  ✓ Usuário '${usuarioData.login}' adicionado e associado à pessoa.`);
      } else {
          console.log(`  ✗ Pessoa com nome '${usuarioData.pessoa_nome}' não encontrada para o usuário '${usuarioData.login}'.`);
      }
  }


  console.log('\n🎉 População do banco de dados concluída com sucesso!');
}

seedDatabase().catch((error) => {
  console.error('💥 Erro fatal durante a migração:', error);
  process.exit(1);
});
