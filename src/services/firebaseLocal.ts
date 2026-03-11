import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Configuração Firebase Local (Emulators)
const firebaseConfig = {
  apiKey: "demo-api-key-local",
  authDomain: "localhost:9099",
  projectId: "adjpa-erp-local",
  storageBucket: "adjpa-erp-local.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:local-dev"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Serviços Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Conectar aos emuladores locais
if (location.hostname === 'localhost') {
  // Conectar ao Auth Emulator
  connectAuthEmulator(auth, 'http://localhost:9099');
  
  // Conectar ao Firestore Emulator
  connectFirestoreEmulator(db, 'localhost', 8080);
  
  // Conectar ao Storage Emulator
  connectStorageEmulator(storage, 'localhost', 9199);
  
  // Conectar ao Functions Emulator
  connectFunctionsEmulator(functions, 'localhost', 5001);
  
  console.log('🔥 Conectado aos emuladores Firebase locais');
}

export default app;

// Importações necessárias para os emulators
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';
