/**
 * ============================================================================
 * CONFIGURAÇÃO DO FIREBASE
 * ============================================================================
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'demo',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo'
};

// Inicializar Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.warn('Firebase não configurado - usando modo demonstração');
}

// Exportar Firestore (pode ser undefined se não configurado)
export const db = app ? getFirestore(app) : null;
export { app };
