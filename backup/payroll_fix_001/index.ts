/**
 * ============================================================================
 * INDEX.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Arquivo relacionado a index.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import Database from './database';
import authRoutes from './routes/auth';
import memberRoutes from './routes/members';
import employeeRoutes from './routes/employees';
import transactionRoutes from './routes/transactions';
import unitRoutes from './routes/units';
import assetRoutes from './routes/assets';
import eventRoutes from './routes/events';
import userRoutes from './routes/users';
import { bootstrapAuthData } from './services/bootstrapAuthData';
import accountRoutes from './routes/accounts';
import treasuryRoutes from './routes/treasury';
import reconciliationRoutes from './routes/reconciliation';
import cepRoutes from './routes/cep';
import rhRoutes from './routes/rh';
import auditRoutes from './routes/audit';
import lgpdRoutes from './routes/lgpd';
import payrollRoutes from './routes/payroll';

// Carregar variáveis de ambiente antes de qualquer coisa
dotenv.config();

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (index).
 */

const app = express();
const PORT       = process.env.PORT       || 3000;
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
      'http://127.0.0.1:5174'
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
  const db = Database.getInstance();
  const dbHealth = await db.healthCheck();
  const poolStatus = db.getPoolStatus();

  const status = dbHealth.healthy ? 'OK' : 'DEGRADED';
  const httpStatus = dbHealth.healthy ? 200 : 503;

  res.status(httpStatus).json({
    status,
    timestamp: new Date().toISOString(),
    service: 'Igreja ERP API',
    version: '1.0.0',
    database: {
      connected: dbHealth.healthy,
      latencyMs: dbHealth.latencyMs,
      error: dbHealth.error,
      pool: poolStatus,
    },
  });
});

// =====================================================
// ROTAS DA API
// =====================================================
app.use(`${API_PREFIX}/auth`,         authRoutes);
app.use(`${API_PREFIX}/members`,      memberRoutes);
app.use(`${API_PREFIX}/employees`,    employeeRoutes);
app.use(`${API_PREFIX}/transactions`, transactionRoutes);
app.use(`${API_PREFIX}/units`,        unitRoutes);
app.use(`${API_PREFIX}/assets`,       assetRoutes);
app.use(`${API_PREFIX}/events`,       eventRoutes);
app.use(`${API_PREFIX}/users`,        userRoutes);
app.use(`${API_PREFIX}/accounts`,       accountRoutes);
app.use(`${API_PREFIX}/treasury`,       treasuryRoutes);
app.use(`${API_PREFIX}/reconciliations`, reconciliationRoutes);
app.use(`${API_PREFIX}/cep`,            cepRoutes);
app.use(`${API_PREFIX}/rh`,             rhRoutes);
app.use(`${API_PREFIX}/audit`,          auditRoutes);
app.use(`${API_PREFIX}/lgpd`,         lgpdRoutes);
app.use(`${API_PREFIX}/payroll`,      payrollRoutes);

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
    const db = Database.getInstance();
    await bootstrapAuthData();

    // Testar conexão com banco antes de abrir o servidor
    const health = await db.healthCheck();
    if (!health.healthy) {
      throw new Error(`Falha ao conectar ao PostgreSQL: ${health.error}`);
    }

    console.log(`✅ PostgreSQL conectado (latência: ${health.latencyMs}ms)`);
    console.log(`📊 Pool: ${JSON.stringify(db.getPoolStatus())}`);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📚 API disponível em http://localhost:${PORT}${API_PREFIX}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Falha ao iniciar servidor:', error);
    process.exit(1);
  }
}

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================
async function gracefulShutdown(signal: string) {
  console.log(`\n[API] Recebido ${signal}. Encerrando servidor...`);
  const db = Database.getInstance();
  await db.close();
  process.exit(0);
}

process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Capturar erros não tratados para evitar crash silencioso
process.on('unhandledRejection', (reason) => {
  console.error('[API] Promise não tratada:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[API] Exceção não capturada:', err);
  process.exit(1);
});

startServer();

export default app;
