/**
 * ============================================================================
 * VITE.CONFIG.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Configuração do Vite para build e desenvolvimento.
 *
 * ONDE É USADO?
 * -------------
 * Parte do projeto usada em runtime ou build.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (vite.config).
 */

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5173,
        host: '0.0.0.0',
        hmr: {
          overlay: false
        },
        // Proxy: redireciona /api/* para o backend Express
        // Elimina problemas de CORS em desenvolvimento
        proxy: {
          '/health': {
            target: env.VITE_API_URL
              ? env.VITE_API_URL.replace('/api', '')
              : 'http://localhost:3000',
            changeOrigin: true,
            secure: false,
          },
          '/api': {
            target: env.VITE_API_URL
              ? env.VITE_API_URL.replace('/api', '')
              : 'http://localhost:3000',
            changeOrigin: true,
            secure: false,
            configure: (proxy) => {
              // Remove header CORS duplicado que causa "*, *"
              proxy.on('proxyRes', (proxyRes) => {
                const acao = proxyRes.headers['access-control-allow-origin'];
                if (Array.isArray(acao)) {
                  proxyRes.headers['access-control-allow-origin'] = acao[0];
                }
              });
            },
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
