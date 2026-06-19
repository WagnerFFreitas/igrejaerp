#!/usr/bin/env node

/**
 * IGREJAERP - Script de Seed
 * Popula o banco de dados PostgreSQL com dados fictícios realistas
 *
 * Uso: node seed.js
 * Ou: npm run seed
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Cores para terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}✗${colors.reset} ${msg}`),
};

async function checkDatabase() {
  try {
    log.info('Verificando conexão com banco de dados...');
    const result = await pool.query('SELECT VERSION()');
    log.success(`Conectado: ${result.rows[0].version.split(',')[0]}`);
    return true;
  } catch (error) {
    log.error(`Falha ao conectar ao banco de dados: ${error.message}`);
    return false;
  }
}

async function checkTablesExist() {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('pessoas', 'unidades', 'membros', 'funcionarios')
    `);
    return result.rows[0].count >= 4;
  } catch (error) {
    log.error(`Erro ao verificar tabelas: ${error.message}`);
    return false;
  }
}

async function executeSeed() {
  const seedFile = path.join(__dirname, 'seed_dados_ficticios.sql');

  if (!fs.existsSync(seedFile)) {
    log.error(`Arquivo de seed não encontrado: ${seedFile}`);
    return false;
  }

  try {
    log.info('Lendo arquivo de seed...');
    const sqlContent = fs.readFileSync(seedFile, 'utf8');

    log.info('Executando seed no banco de dados...');
    const client = await pool.connect();

    try {
      // Executar o arquivo SQL
      await client.query(sqlContent);
      log.success('Seed executado com sucesso!');
      return true;
    } finally {
      client.release();
    }
  } catch (error) {
    log.error(`Erro ao executar seed: ${error.message}`);
    if (error.detail) log.error(`Detalhes: ${error.detail}`);
    if (error.context) log.error(`Contexto: ${error.context}`);
    return false;
  }
}

async function verifyData() {
  try {
    log.info('Verificando dados inseridos...');

    const queries = {
      'Endereços': 'SELECT COUNT(*) FROM public.enderecos',
      'Unidades': 'SELECT COUNT(*) FROM public.unidades',
      'Pessoas': 'SELECT COUNT(*) FROM public.pessoas',
      'Usuários': 'SELECT COUNT(*) FROM public.usuarios',
      'Membros': 'SELECT COUNT(*) FROM public.membros',
      'Funcionários': 'SELECT COUNT(*) FROM public.funcionarios',
      'Transações': 'SELECT COUNT(*) FROM public.transacoes',
      'Eventos': 'SELECT COUNT(*) FROM public.eventos_igreja',
    };

    console.log('\n📊 Resumo de Dados Inseridos:');
    console.log('─'.repeat(40));

    let totalRecords = 0;
    for (const [name, query] of Object.entries(queries)) {
      const result = await pool.query(query);
      const count = result.rows[0].count;
      totalRecords += parseInt(count);
      console.log(`  ${name}: ${colors.green}${count}${colors.reset} registros`);
    }

    console.log('─'.repeat(40));
    console.log(`  ${colors.bright}Total: ${colors.green}${totalRecords}${colors.reset} registros`);
    console.log('');

    return true;
  } catch (error) {
    log.error(`Erro ao verificar dados: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log(`\n${colors.bright}🌱 IGREJAERP - Script de Seed${colors.reset}\n`);

  // Verificar conexão
  const connected = await checkDatabase();
  if (!connected) {
    process.exit(1);
  }

  // Verificar se tabelas existem
  const tablesExist = await checkTablesExist();
  if (!tablesExist) {
    log.error('Schema não encontrado. Execute as migrations primeiro com: npm run migrate');
    process.exit(1);
  }

  // Perguntar confirmação
  console.log(`${colors.yellow}⚠ AVISO: Isto irá inserir dados fictícios no banco de dados.${colors.reset}`);
  console.log('Dados existentes serão preservados (apenas inserts).\n');

  // Para desenvolvimento, assumir sim automaticamente
  if (process.env.NODE_ENV !== 'production') {
    log.info('Modo desenvolvimento - prosseguindo automaticamente...\n');

    // Executar seed
    const success = await executeSeed();

    if (success) {
      // Verificar dados
      await verifyData();

      log.success('Seed concluído com sucesso!');
      console.log(`${colors.green}✓ Banco de dados populado com dados fictícios.${colors.reset}\n`);
    } else {
      log.error('Falha ao executar seed');
      process.exit(1);
    }
  } else {
    log.warn('Seed em ambiente de produção requer confirmação manual.');
    process.exit(1);
  }

  process.exit(0);
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  log.error(`Erro não tratado: ${reason}`);
  process.exit(1);
});

// Executar
main().catch((error) => {
  log.error(`Erro fatal: ${error.message}`);
  process.exit(1);
});
