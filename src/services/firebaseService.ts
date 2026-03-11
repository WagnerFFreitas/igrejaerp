import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// Configuração Firebase (emuladores locais)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'localhost:9099',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'studio-3774299343-4984f',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'localhost:9199',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'demo',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo'
};

// Inicializar Firebase
let app;
let db, storage, auth, functions;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
  functions = getFunctions(app);
  
  console.log("🔥 Firebase inicializado com sucesso");
} catch (error) {
  console.warn("❌ Erro ao inicializar Firebase:", error);
}

export default app;

// Exportar serviços (podem ser null se não configurado)
export { auth, db, storage, functions };
