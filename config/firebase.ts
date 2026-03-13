/**
 * ============================================================================
 * CONFIGURAÇÃO DO FIREBASE
 * ============================================================================
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase apenas se a configuração básica estiver presente
let app = null;
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
  }
} else {
  console.warn('Configuração do Firebase ausente ou incompleta. Verifique as variáveis de ambiente.');
}

// Exportar Firestore (pode ser undefined se não configurado)
export const db = app ? getFirestore(app) : null;
export { app };
