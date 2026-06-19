/**
 * ============================================================================
 * INDEX.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Arquivo principal do servidor da API. Configura e inicia o Express.
 *
 * ONDE É USADO?
 * -------------
 * Ponto de entrada para a aplicação backend.
 *
 * COMO FUNCIONA?
 * --------------
 * Configura middlewares globais, define rotas, trata erros e inicia o servidor.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { db } from './database'; // <-- Correção aqui! Importação nomeada.
import authRoutes from './routes/autenticacao';
import memberRoutes from './routes/membros';
import employeeRoutes from './routes/funcionarios';
import transactionRoutes from './routes/transacoes';
import supplierRoutes from './routes/fornecedores';
import unitRoutes from './routes/unidades';
import assetRoutes from './routes/patrimonios';
import eventRoutes from './routes/eventos';
import userRoutes from './routes/usuarios';
import accountRoutes from './routes/contas-bancarias';
import reconciliationRoutes from './routes/conciliacoes-bancarias';
import cepRoutes from './routes/cep';
import rhRoutes from './routes/rh';
import auditRoutes from './routes/auditoria';
import lgpdRoutes from './routes/lgpd';
import payrollRoutes from './routes/periodos-folha';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api';

// =====================================================
// MIDDLEWARE GLOBAL
// =====================================================
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CORS_ORIGIN,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'https://5173-firebase-igrejaerp-1781801110904.cluster-hkcruqmgzbd2aqcdnktmz6k7ba.cloudworkstations.dev'
    ].filter(Boolean) as string[];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origem não permitida por CORS: ${origin}`));
  },
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/health', async (_req, res) => {
  const start = Date.now();
  try {
    // Tenta listar as coleções como um health check para o Firestore
    await db.listCollections();
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Igreja ERP API',
      version: '1.0.0',
      database: {
        connected: true,
        latencyMs: Date.now() - start,
        provider: 'Firebase Firestore'
      },
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'DEGRADED',
      timestamp: new Date().toISOString(),
      service: 'Igreja ERP API',
      database: {
        connected: false,
        error: error.message,
        provider: 'Firebase Firestore'
      },
    });
  }
});


// =====================================================
// ROTAS DA API
// =====================================================
app.use(`${API_PREFIX}/autenticacao`,         authRoutes);
app.use(`${API_PREFIX}/membros`,              memberRoutes);
app.use(`${API_PREFIX}/funcionarios`,         employeeRoutes);
app.use(`${API_PREFIX}/afastamentos`,         rhRoutes);
app.use(`${API_PREFIX}/unidades`,             unitRoutes);
app.use(`${API_PREFIX}/contas-bancarias`,     accountRoutes);
app.use(`${API_PREFIX}/transacoes`,           transactionRoutes);
app.use(`${API_PREFIX}/fornecedores`,         supplierRoutes);
app.use(`${API_PREFIX}/conciliacoes-bancarias`, reconciliationRoutes);
app.use(`${API_PREFIX}/patrimonios`,          assetRoutes);
app.use(`${API_PREFIX}/periodos-folha`,       payrollRoutes);
app.use(`${API_PREFIX}/eventos`,              eventRoutes);

// LGPD
app.use(`${API_PREFIX}/lgpd`,                 lgpdRoutes);

// Auditoria e Permissões
app.use(`${API_PREFIX}/auditoria`,            auditRoutes);
app.use(`${API_PREFIX}/usuarios/modulos-permissao`, userRoutes);
app.use(`${API_PREFIX}/usuarios/:id/permissoes`, userRoutes);
app.use(`${API_PREFIX}/usuarios`,             userRoutes);

// Utilitários
app.use(`${API_PREFIX}/cep`,                  cepRoutes);
app.use(`${API_PREFIX}/rh`,                   rhRoutes);

// =====================================================
// MIDDLEWARE DE ERRO GLOBAL
// =====================================================
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[API] Erro não tratado:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erro interno do servidor',
      status:  err.status  || 500,
      timestamp: new Date().toISOString(),
    },
  });
});

// Rota não encontrada
app.use('*', (_req, res) => {
  res.status(404).json({
    error: {
      message: 'Rota não encontrada',
      status: 404,
      timestamp: new Date().toISOString(),
    },
  });
});

// =====================================================
// INICIALIZAÇÃO DO SERVIDOR
// =====================================================
async function startServer() {
  try {
    // A inicialização do Firebase agora acontece no módulo `database`,
    // então não precisamos mais de lógica complexa aqui.

    // await bootstrapAuthData(); // Desativado temporariamente para permitir o início do servidor.

    app.listen(PORT, () => {
      console.log(`[API] ✅ Firebase conectado.`);
      console.log(`[API] 🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`[API] 📚 API disponível em http://localhost:${PORT}${API_PREFIX}`);
      console.log(`[API] 🏥 Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('[API] ❌ Falha ao iniciar servidor:', error);
    process.exit(1);
  }
}

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================
async function gracefulShutdown(signal: string) {
  console.log(`\n[API] Recebido ${signal}. Encerrando servidor...`);
  // O SDK do Firebase Admin não requer um fechamento explícito para a maioria dos casos.
  console.log('[API] Servidor encerrado.');
  process.exit(0);
}

process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('[API] Promise não tratada:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[API] Exceção não capturada:', err);
  process.exit(1);
});

startServer();

export default app;
