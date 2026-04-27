/**
 * ============================================================================
 * EXPORT-FIREBASE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Arquivo relacionado a export-firebase.
 *
 * ONDE É USADO?
 * -------------
 * Parte do projeto usada em runtime ou build.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Configuração do Firebase Admin (use suas credenciais)
/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (export-firebase).
 */

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'igrejaerp',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Coleções para exportar
const collections = [
  'units',
  'users', 
  'members',
  'employees',
  'transactions',
  'assets',
  'church_events',
  'financial_accounts',
  'employee_leaves',
  'volunteer_schedules',
  'audit_logs',
  'tax_configs',
  'accounting_configs'
];

// Diretório de exportação
const exportDir = path.join(__dirname, '../exports');

async function exportCollection(collectionName: string) {
  console.log(`📥 Exportando coleção: ${collectionName}`);
  
  try {
    const snapshot = await db.collection(collectionName).get();
    const data = [];
    
    snapshot.forEach((doc) => {
      const docData = doc.data();
      
      // Converter Timestamp para string ISO
      const convertedData = convertTimestamps(docData);
      
      data.push({
        id: doc.id,
        ...convertedData
      });
    });
    
    // Criar diretório se não existir
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    
    // Salvar arquivo JSON
    const filePath = path.join(exportDir, `${collectionName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    console.log(`✅ ${collectionName}: ${data.length} documentos exportados`);
    return data;
  } catch (error) {
    console.error(`❌ Erro ao exportar ${collectionName}:`, error);
    return [];
  }
}

function convertTimestamps(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (obj instanceof admin.firestore.Timestamp) {
    return obj.toDate().toISOString();
  }
  
  if (obj instanceof admin.firestore.GeoPoint) {
    return { latitude: obj.latitude, longitude: obj.longitude };
  }
  
  if (obj instanceof admin.firestore.DocumentReference) {
    return obj.path;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertTimestamps(item));
  }
  
  if (typeof obj === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertTimestamps(value);
    }
    return converted;
  }
  
  return obj;
}

async function exportAllCollections() {
  console.log('🚀 Iniciando exportação do Firebase...');
  
  const startTime = Date.now();
  const exportSummary: { [key: string]: number } = {};
  
  try {
    // Exportar cada coleção
    for (const collection of collections) {
      const data = await exportCollection(collection);
      exportSummary[collection] = data.length;
    }
    
    // Criar resumo da exportação
    const summary = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      collections: exportSummary,
      totalDocuments: Object.values(exportSummary).reduce((a, b) => a + b, 0)
    };
    
    fs.writeFileSync(
      path.join(exportDir, 'export-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log('\n📊 Resumo da Exportação:');
    console.log('====================');
    Object.entries(exportSummary).forEach(([collection, count]) => {
      console.log(`${collection}: ${count} documentos`);
    });
    console.log(`\n⏱️  Duração: ${summary.duration}ms`);
    console.log(`📦 Total: ${summary.totalDocuments} documentos`);
    console.log(`📁 Arquivos salvos em: ${exportDir}`);
    
  } catch (error) {
    console.error('❌ Erro na exportação:', error);
    throw error;
  }
}

// Exportar subcoleções relacionadas
async function exportRelatedData() {
  console.log('\n🔗 Exportando dados relacionados...');
  
  try {
    // Exportar dependentes de membros
    const membersSnapshot = await db.collection('members').get();
    const allDependents = [];
    
    for (const memberDoc of membersSnapshot.docs) {
      const dependentsSnapshot = await memberDoc.ref.collection('dependents').get();
      dependentsSnapshot.forEach((depDoc) => {
        allDependents.push({
          id: depDoc.id,
          member_id: memberDoc.id,
          ...convertTimestamps(depDoc.data())
        });
      });
    }
    
    if (allDependents.length > 0) {
      fs.writeFileSync(
        path.join(exportDir, 'member_dependents.json'),
        JSON.stringify(allDependents, null, 2)
      );
      console.log(`✅ Dependentes: ${allDependents.length} documentos`);
    }
    
    // Exportar contribuições de membros
    const allContributions = [];
    for (const memberDoc of membersSnapshot.docs) {
      const contribSnapshot = await memberDoc.ref.collection('contributions').get();
      contribSnapshot.forEach((contribDoc) => {
        allContributions.push({
          id: contribDoc.id,
          member_id: memberDoc.id,
          ...convertTimestamps(contribDoc.data())
        });
      });
    }
    
    if (allContributions.length > 0) {
      fs.writeFileSync(
        path.join(exportDir, 'member_contributions.json'),
        JSON.stringify(allContributions, null, 2)
      );
      console.log(`✅ Contribuições: ${allContributions.length} documentos`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao exportar dados relacionados:', error);
  }
}

// Função principal
async function main() {
  try {
    await exportAllCollections();
    await exportRelatedData();
    console.log('\n🎉 Exportação concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Falha na exportação:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

export { exportAllCollections, exportRelatedData };
