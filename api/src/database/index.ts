/**
 * ============================================================================
 * INDEX.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Inicializa e exporta o Firebase Admin SDK para toda a aplicação.
 *
 * ONDE É USADO?
 * -------------
 * Importado em vários locais do backend que precisam interagir com o Firebase
 * (Firestore, Authentication, etc.).
 *
 * COMO FUNCIONA?
 * --------------
 * Graças ao `"resolveJsonModule": true` no tsconfig.json, podemos importar
 * o arquivo de credenciais diretamente. O SDK é então inicializado (uma única vez)
 * e seus serviços (db, auth) são exportados para uso em toda a aplicação.
 */

import admin from 'firebase-admin';
// A configuração "resolveJsonModule": true no tsconfig.json permite esta importação direta.
import serviceAccount from '../../../serviceAccountKey.json';

// Garante que a inicialização ocorra apenas uma vez (padrão singleton).
if (!admin.apps.length) {
  console.log('[Firebase] Inicializando Firebase Admin SDK...');
  try {
    admin.initializeApp({
      // O TypeScript infere o tipo correto do JSON importado.
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log('[Firebase] ✅ Firebase Admin SDK inicializado com sucesso.');
  } catch (error) {
    console.error('[Firebase] ❌ Erro ao inicializar o Firebase Admin SDK:', error);
    process.exit(1);
  }
} else {
  console.log('[Firebase] Usando instância existente do Firebase Admin SDK.');
}

// Exporta os serviços do Firebase que serão usados na aplicação.
const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };
