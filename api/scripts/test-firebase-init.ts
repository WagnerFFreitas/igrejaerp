
import * as admin from 'firebase-admin';

console.log('🚀 Iniciando teste de inicialização do Firebase...');

try {
    const serviceAccount = require('../serviceAccountKey.json');
    const APP_NAME = 'test-instance';

    console.log('Chave de serviço carregada. Tentando inicializar...');

    if (admin.apps.find(app => app?.name === APP_NAME)) {
         console.log(`App Firebase com nome "${APP_NAME}" já existe.`);
    } else {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        }, APP_NAME);
        console.log(`✅ Sucesso! App Firebase inicializado com o nome: "${APP_NAME}"`);
    }

    const app = admin.app(APP_NAME);
    console.log(`✅ Sucesso! App Firebase com nome "${APP_NAME}" recuperado.`);

    const auth = app.auth();
    console.log('✅ Sucesso! Serviço de autenticação obtido.');

    console.log('🎉 Teste de inicialização concluído com sucesso!');

} catch (error: any) {
    console.error('❌ Erro no teste de inicialização do Firebase:');
    console.error(error);
}
