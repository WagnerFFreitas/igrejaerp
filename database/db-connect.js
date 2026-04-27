/**
 * db-connect.js
 * Utilitário de conexão PostgreSQL para scripts Node.js (fora da API).
 * Uso: const { query, pool, end } = require('./database/db-connect');
 */

const path = require('path');

// Carrega dotenv e pg da pasta api (onde estão instalados)
require(path.join(__dirname, '../api/node_modules/dotenv')).config({
  path: path.join(__dirname, '../api/.env')
});
const { Pool } = require(path.join(__dirname, '../api/node_modules/pg'));

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'igrejaerp',
  user:     process.env.DB_USER     || 'desenvolvedor',
  password: process.env.DB_PASSWORD,
  max:      parseInt(process.env.DB_POOL_MAX || '5'),
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[db-connect] Erro no pool:', err.message);
});

/**
 * Executa uma query parametrizada.
 * @param {string} text  - SQL com placeholders $1, $2, ...
 * @param {any[]}  params - Valores para os placeholders
 */
async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  console.log(`[db-connect] Query (${Date.now() - start}ms): ${text.substring(0, 80)}`);
  return result;
}

/** Encerra o pool de conexões. Chame ao final do script. */
async function end() {
  await pool.end();
  console.log('[db-connect] Pool encerrado.');
}

module.exports = { pool, query, end };
