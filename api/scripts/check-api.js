require('dotenv').config();
const http = require('http');

const BASE = 'http://localhost:3000/api';
const UNIT = '00000000-0000-0000-0000-000000000001';

function get(path) {
  return new Promise((resolve) => {
    const url = new URL(BASE + path);
    const req = http.request({ hostname: url.hostname, port: url.port, path: url.pathname + url.search, method: 'GET' }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw.substring(0, 200) }); }
      });
    });
    req.on('error', e => resolve({ status: 0, body: e.message }));
    req.end();
  });
}

async function run() {
  const endpoints = [
    `/members?unitId=${UNIT}&limit=5`,
    `/employees?unitId=${UNIT}&limit=5`,
    `/transactions?unitId=${UNIT}&limit=5`,
    `/accounts?unitId=${UNIT}`,
    `/units`,
  ];

  for (const ep of endpoints) {
    const r = await get(ep);
    if (r.status === 200) {
      const count = Array.isArray(r.body) ? r.body.length :
                    r.body?.members?.length ?? r.body?.employees?.length ?? '?';
      console.log(`✅ GET ${ep.split('?')[0]}: HTTP ${r.status} — ${count} registros`);
    } else {
      console.error(`❌ GET ${ep.split('?')[0]}: HTTP ${r.status}`);
      console.error('   Erro:', JSON.stringify(r.body).substring(0, 300));
    }
  }
}

run().catch(e => { console.error(e); process.exit(1); });
