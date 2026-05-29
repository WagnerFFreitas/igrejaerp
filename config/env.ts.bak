/**
 * config/env.ts
 * Centraliza o acesso às variáveis de ambiente do frontend (Vite).
 * Todas as variáveis expostas ao browser DEVEM ter o prefixo VITE_.
 */

// URL base da API REST (backend Express)
// Definida em .env como VITE_API_URL=http://localhost:3000/api
// Em desenvolvimento, o proxy do Vite redireciona /api → backend automaticamente.
export const API_URL: string =
  (import.meta as any).env?.VITE_API_URL ?? '/api';

// Nome e versão da aplicação
export const APP_NAME: string =
  (import.meta as any).env?.VITE_APP_NAME ?? 'ADJPA ERP';

export const APP_VERSION: string =
  (import.meta as any).env?.VITE_APP_VERSION ?? '1.0.0';

// Ambiente atual
export const IS_PRODUCTION: boolean =
  (import.meta as any).env?.PROD === true;

export const IS_DEVELOPMENT: boolean =
  (import.meta as any).env?.DEV === true;
