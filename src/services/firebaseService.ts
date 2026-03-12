import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Import the Firebase configuration
import firebaseConfig from '../../firebase-applet-config.json';

// Inicializar Firebase
let app;
let db: any, auth: any, functions: any;
let storage = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  // storage = getStorage(app); // Desativado temporariamente pois requer plano pago
  auth = getAuth(app);
  functions = getFunctions(app);
  
  console.log("🔥 Firebase inicializado com sucesso");

  // Teste de conexão
  const testConnection = async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log("✅ Conexão com Firestore estabelecida com sucesso!");
    } catch (error) {
      if(error instanceof Error && error.message.includes('the client is offline')) {
        console.error("❌ O cliente está offline. Verifique sua configuração do Firebase.");
      } else {
        console.warn("⚠️ Teste de conexão retornou um erro (pode ser permissão, o que significa que conectou):", error);
      }
    }
  };
  testConnection();

} catch (error) {
  console.warn("❌ Erro ao inicializar Firebase:", error);
}

export default app;

// Exportar serviços (podem ser null se não configurado)
export { auth, db, storage, functions };
