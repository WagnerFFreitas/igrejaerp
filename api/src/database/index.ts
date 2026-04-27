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

import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Forçar carregamento do .env da pasta api
dotenv.config({ path: path.join(__dirname, '../../.env') });

// =====================================================
// SINGLETON DATABASE
// =====================================================

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (index).
 */

export class Database {
  private static instance: Database;
  private pool: Pool;
  private isConnected: boolean = false;

  private constructor() {
    // Log de diagnóstico (sem mostrar a senha)
    console.log('[DB] Carregando configurações...');
    console.log(`[DB] Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`[DB] Database: ${process.env.DB_NAME || 'igrejaerp'}`);
    console.log(`[DB] User: ${process.env.DB_USER || 'desenvolvedor'}`);
    console.log(`[DB] Password definida: ${process.env.DB_PASSWORD ? 'SIM' : 'NÃO'}`);

    const poolConfig = {
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME     || 'igrejaerp',
      user:     process.env.DB_USER     || 'desenvolvedor',
      password: String(process.env.DB_PASSWORD || ''),

      // Pool sizing
      max:                parseInt(process.env.DB_POOL_MAX     || '20'),
      min:                parseInt(process.env.DB_POOL_MIN     || '2'),
      idleTimeoutMillis:  parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT || '10000'),

      // Keep-alive
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,

      // SSL em produção
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    };

    this.pool = new Pool(poolConfig);
    this.registerPoolEvents();
  }

  // ----- Inicialização e Migrações -----
  public async initialize(): Promise<void> {
    try {
      await this.runMigrations();
    } catch (err) {
      console.error('[DB] Falha crítica ao executar migrações na inicialização.', err);
      process.exit(1); // Encerra o processo se as migrações falharem
    }
  }

  // ----- Eventos do pool -----
  private registerPoolEvents(): void {
    this.pool.on('connect', (client: PoolClient) => {
      this.isConnected = true;
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DB] Nova conexão estabelecida (total: ${this.pool.totalCount})`);
      }
    });

    this.pool.on('acquire', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DB] Conexão adquirida (idle: ${this.pool.idleCount} | waiting: ${this.pool.waitingCount})`);
      }
    });

    this.pool.on('remove', () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[DB] Conexão removida do pool`);
      }
    });

    this.pool.on('error', (err: Error) => {
      console.error('[DB] Erro inesperado no pool:', err.message);
      this.isConnected = false;
    });
  }

  // ----- Singleton -----
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // ----- Acesso ao pool bruto -----
  public getPool(): Pool {
    return this.pool;
  }

  // ----- Status do pool -----
  public getPoolStatus() {
    return {
      total:   this.pool.totalCount,
      idle:    this.pool.idleCount,
      waiting: this.pool.waitingCount,
    };
  }

  // =====================================================
  // HEALTH CHECK
  // =====================================================
  public async healthCheck(): Promise<{ healthy: boolean; latencyMs?: number; error?: string }> {
    const start = Date.now();
    try {
      await this.pool.query('SELECT 1');
      return { healthy: true, latencyMs: Date.now() - start };
    } catch (err: any) {
      return { healthy: false, error: err.message };
    }
  }

  public async ensurePayrollSchema(): Promise<void> {
    // ESTA FUNÇÃO É OBSOLETA E SERÁ REMOVIDA.
    // A lógica foi movida para runMigrations() para um sistema mais robusto.
    console.warn("[DB] A função ensurePayrollSchema() é obsoleta e será removida em futuras versões. Use runMigrations().");
    await this.runMigrations();
  }

  // =====================================================
  // DATABASE MIGRATIONS
  // =====================================================
  public async runMigrations(): Promise<void> {
    console.log('[DB] Iniciando verificação de migrações...');
    const client = await this.pool.connect();
    try {
      // 1. Garantir que a tabela de controle de migrações exista
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version VARCHAR(255) PRIMARY KEY,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      // 2. Obter todas as migrações já aplicadas
      const result = await client.query('SELECT version FROM schema_migrations');
      const appliedMigrations = result.rows.map(row => row.version);
      console.log(`[DB] Migrações já aplicadas: ${appliedMigrations.length > 0 ? appliedMigrations.join(', ') : 'Nenhuma'}`);

      // 3. Ler todos os arquivos da pasta de migração
      const migrationsDir = path.join(__dirname, 'migration');

      // Verifica se o diretório existe antes de tentar lê-lo
      if (!fs.existsSync(migrationsDir)) {
        console.log('[DB] Diretório de migrações não encontrado. Pulando etapa de migração.');
        return;
      }

      const migrationFiles = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql')).sort();

      // 4. Executar migrações pendentes
      let pendingMigrations = 0;
      for (const file of migrationFiles) {
        if (!appliedMigrations.includes(file)) {
          pendingMigrations++;
          console.log(`[DB] Aplicando migração pendente: ${file}...`);
          const filePath = path.join(migrationsDir, file);
          const sql = fs.readFileSync(filePath, 'utf8');

          // Executar a migração dentro de uma transação
          try {
            await client.query('BEGIN');
            await client.query(sql);
            await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
            await client.query('COMMIT');
            console.log(`[DB] ✅ Migração ${file} aplicada com sucesso.`);
          } catch (err) {
            await client.query('ROLLBACK');
            console.error(`[DB] ❌ Erro ao aplicar migração ${file}. A transação foi revertida.`, err);
            throw err; // Interrompe o processo se uma migração falhar
          }
        }
      }

      if (pendingMigrations === 0) {
        console.log('[DB] Nenhuma migração pendente encontrada. O banco de dados está atualizado.');
      }

    } finally {
      client.release();
    }
  }

  // =====================================================
  // QUERY COM RETRY AUTOMÁTICO
  // =====================================================
  public async query<T extends QueryResultRow = any>(
    text: string,
    params?: any[],
    retries: number = 2
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await this.pool.query<T>(text, params);
        const duration = Date.now() - start;

        if (process.env.NODE_ENV === 'development') {
          console.log(`[DB] Query (${duration}ms): ${text.substring(0, 120).replace(/\s+/g, ' ')}`);
        }

        return result;
      } catch (err: any) {
        lastError = err;

        // Erros de conexão → retry; erros de SQL → falha imediata
        const isConnectionError =
          err.code === 'ECONNREFUSED' ||
          err.code === 'ENOTFOUND'    ||
          err.code === '57P01'        || // admin_shutdown
          err.code === '08006'        || // connection_failure
          err.code === '08001';          // unable_to_connect

        if (!isConnectionError || attempt === retries) {
          console.error(`[DB] Erro na query (tentativa ${attempt + 1}/${retries + 1}):`, err.message);
          throw err;
        }

        const delay = 200 * Math.pow(2, attempt); // back-off exponencial: 200ms, 400ms
        console.warn(`[DB] Tentando reconectar em ${delay}ms... (${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  // =====================================================
  // TRANSAÇÃO COM ROLLBACK AUTOMÁTICO
  // =====================================================
  public async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[DB] Transação revertida (ROLLBACK):', (err as Error).message);
      throw err;
    } finally {
      client.release();
    }
  }

  // =====================================================
  // GRACEFUL SHUTDOWN
  // =====================================================
  public async close(): Promise<void> {
    await this.pool.end();
    this.isConnected = false;
    console.log('[DB] Pool de conexões encerrado com sucesso.');
  }
}

export default Database;