
import admin from 'firebase-admin';
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configuração do Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const firestore = admin.firestore();

// Configuração do Pool de Conexão do PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Mapeamento de tabelas
const tabelasParaMigrar = [
  'unidades',
  'usuarios',
  'membros',
  'patrimonios',
  'transacoes',
  'eventos',
  'contas_bancarias',
  'fornecedores',
  'funcionarios'
];

function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

function convertObjectKeysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => convertObjectKeysToCamelCase(v));
  } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((result, key) => {
      const camelCaseKey = toCamelCase(key);
      result[camelCaseKey] = convertObjectKeysToCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

async function migrarTabela(tabela: string) {
  console.log(`\n🚀 Começando a migração da tabela: ${tabela}`);
  const client = await pool.connect();

  try {
    const res = await client.query(`SELECT * FROM ${tabela}`);
    const { rows } = res;

    if (rows.length === 0) {
      console.log(`🟡 Tabela '${tabela}' está vazia. Nenhum dado para migrar.`);
      return;
    }

    const collectionRef = firestore.collection(tabela);
    const batchSize = 100;
    let batch = firestore.batch();
    let writeCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const docId = row.id; 
      if (!docId) {
        console.warn(`⚠️  Registro na tabela '${tabela}' sem 'id'. Pulando:`, row);
        continue;
      }
      
      const docData = convertObjectKeysToCamelCase(row);
      delete docData.id;

      const docRef = collectionRef.doc(docId.toString());
      batch.set(docRef, docData);

      if ((i + 1) % batchSize === 0 || i === rows.length - 1) {
        const currentWrites = (i + 1) % batchSize === 0 ? batchSize : (rows.length % batchSize);
        await batch.commit();
        writeCount += currentWrites;
        console.log(`✅ ${writeCount} de ${rows.length} documentos da tabela '${tabela}' escritos no Firestore.`);
        batch = firestore.batch();
      }
    }

    console.log(`🎉 Migração da tabela '${tabela}' concluída com sucesso!`);
  } catch (error) {
    console.error(`❌ Erro ao migrar a tabela '${tabela}':`, error);
  } finally {
    client.release();
  }
}

async function main() {
  console.log('✨ Iniciando a migração de dados do PostgreSQL para o Firebase...');

  for (const tabela of tabelasParaMigrar) {
    await migrarTabela(tabela);
  }

  console.log('\n\n🎊 Todos os dados foram migrados com sucesso!\n');
  await pool.end();
}

main().catch(error => {
  console.error('💥 Erro fatal durante a migração:', error);
  process.exit(1);
});
