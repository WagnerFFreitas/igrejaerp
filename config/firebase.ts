/**
 * ============================================================================
 * CONFIGURAÇÃO DO FIREBASE
 * ============================================================================
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAxX2dRWQK6WoV2R5NfSkyc0XFj37C9yvY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "studio-999033527-4eda9.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "studio-999033527-4eda9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "studio-999033527-4eda9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1059522952894",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1059522952894:web:39660721f095aaa80ee8ef"
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
