require('dotenv').config();
const { Pool } = require('pg');
const http = require('http');
const UNIT = '00000000-0000-0000-0000-000000000001';
const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });

function get(path) {
  return new Promise((resolve) => {
    const url = new URL('http://localhost:3000/api' + path);
    const req = http.request({ hostname: url.hostname, port: url.port, path: url.pathname + url.search, method: 'GET' }, res => {
      let raw = ''; res.on('data', c => raw += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); } catch { resolve({ status: res.statusCode, body: raw }); } });
    });
    req.on('error', e => resolve({ status: 0, body: e.message }));
    req.end();
  });
}

async function run() {
  // 1. Verificar tabelas existentes
  const tables = await pool.query(`
    SELECT tablename FROM pg_tables WHERE schemaname='public' 
    AND tablename IN ('assets','performance_evaluations','evaluation_cycles','development_plans','pdi_plans')
    ORDER BY tablename
  `);
  console.log('Tabelas RH/Patrimônio existentes:', tables.rows.map(r => r.tablename).join(', ') || 'nenhuma');

  // 2. Verificar dados em assets
  const assets = await pool.query('SELECT COUNT(*) as total FROM assets');
  console.log('Assets no banco:', assets.rows[0].total);

  // 3. Testar API assets
  const r = await get(`/assets?unitId=${UNIT}`);
  console.log(`GET /assets: HTTP ${r.status} — ${Array.isArray(r.body) ? r.body.length : 'erro'} registros`);
  if (r.status !== 200) console.log('  Erro:', JSON.stringify(r.body));

  // 4. Verificar colunas da tabela assets
  const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='assets' ORDER BY ordinal_position LIMIT 10");
  console.log('Primeiras colunas de assets:', cols.rows.map(c => c.column_name).join(', '));

  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
