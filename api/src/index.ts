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
import treasuryChartOfAccountsRoutes from './routes/treasury-chart-of-accounts';
import treasuryCashFlowsRoutes from './routes/treasury-cash-flows';
import treasuryForecastsRoutes from './routes/treasury-forecasts';
import treasuryInvestmentsRoutes from './routes/treasury-investments';
import treasuryLoansRoutes from './routes/treasury-loans';
import treasuryAlertsRoutes from './routes/treasury-alerts';
import treasuryPositionsRoutes from './routes/treasury-positions';
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
app.use(`${API_PREFIX}/autenticacao`,         authRoutes);
app.use(`${API_PREFIX}/membros`,              memberRoutes);
app.use(`${API_PREFIX}/funcionarios`,         employeeRoutes);
app.use(`${API_PREFIX}/afastamentos`,         rhRoutes);
app.use(`${API_PREFIX}/unidades`,             unitRoutes);
app.use(`${API_PREFIX}/contas-bancarias`,     accountRoutes);
app.use(`${API_PREFIX}/transacoes`,           transactionRoutes);
app.use(`${API_PREFIX}/conciliacoes-bancarias`, reconciliationRoutes);
app.use(`${API_PREFIX}/patrimonios`,          assetRoutes);
app.use(`${API_PREFIX}/periodos-folha`,       payrollRoutes);
app.use(`${API_PREFIX}/eventos`,              eventRoutes);

// Tesouraria
app.use(`${API_PREFIX}/tesouraria/plano-contas`,         treasuryChartOfAccountsRoutes);
app.use(`${API_PREFIX}/tesouraria/fluxos-caixa`,        treasuryCashFlowsRoutes);
app.use(`${API_PREFIX}/tesouraria/previsoes`,           treasuryForecastsRoutes);
app.use(`${API_PREFIX}/tesouraria/investimentos`,       treasuryInvestmentsRoutes);
app.use(`${API_PREFIX}/tesouraria/emprestimos`,         treasuryLoansRoutes);
app.use(`${API_PREFIX}/tesouraria/alertas`,             treasuryAlertsRoutes);
app.use(`${API_PREFIX}/tesouraria/posicoes-financeiras`, treasuryPositionsRoutes);

// LGPD
app.use(`${API_PREFIX}/lgpd/politicas`,       lgpdRoutes);
app.use(`${API_PREFIX}/lgpd/consentimentos`,  lgpdRoutes);

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
    const db = Database.getInstance();
    await db.initialize(); // Garante que as migrações rodem antes de tudo
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