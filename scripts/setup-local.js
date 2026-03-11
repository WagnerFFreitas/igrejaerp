// Script para setup automático do ambiente local
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Configurando ADJPA ERP para desenvolvimento local...\n');

// Criar diretório de dados do emulador
const emulatorDir = path.join(__dirname, '../emulator-data');
if (!fs.existsSync(emulatorDir)) {
  fs.mkdirSync(emulatorDir, { recursive: true });
  console.log('✅ Diretório de dados criado');
}

// Criar arquivo de configuração local
const firebaseConfig = `
// Configuração Firebase Local - Auto-gerado
export const firebaseConfig = {
  apiKey: "demo-api-key-local",
  authDomain: "localhost:9099",
  projectId: "adjpa-erp-local",
  storageBucket: "adjpa-erp-local.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:local-dev"
};
`;

fs.writeFileSync(
  path.join(__dirname, '../src/config/firebase-config.js'),
  firebaseConfig
);
console.log('✅ Configuração Firebase criada');

// Instalar dependências
try {
  console.log('\n📦 Instalando dependências principais...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n📦 Instalando dependências Firebase Functions...');
  execSync('cd functions && npm install', { stdio: 'inherit' });
  
  console.log('\n📦 Instalando concurrently...');
  execSync('npm install concurrently --save-dev', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}

// Criar usuário admin inicial
console.log('\n👤 Criando usuário admin de teste...');
const createAdminScript = `
// Script para criar usuário admin
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();

async function createAdminUser() {
  try {
    const userRecord = await auth.createUser({
      email: 'admin@adjpa.local',
      password: 'admin123',
      displayName: 'Admin ADJPA',
    });

    await auth.setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: 'admin',
      unitId: 'unit-sede'
    });

    console.log('✅ Usuário admin criado:', userRecord.uid);
  } catch (error) {
    console.log('ℹ️ Usuário admin já existe ou erro:', error.message);
  }
}

createAdminUser().then(() => process.exit(0));
`;

fs.writeFileSync(
  path.join(__dirname, '../scripts/create-admin.js'),
  createAdminScript
);

console.log('\n🎉 Setup local concluído com sucesso!');
console.log('\n📋 Próximos passos:');
console.log('1. npm run firebase:emulators');
console.log('2. npm run dev');
console.log('3. Acesse http://localhost:5173');
console.log('4. Login com admin@adjpa.local / admin123');
console.log('\n📖 Mais informações em README_LOCAL.md');
