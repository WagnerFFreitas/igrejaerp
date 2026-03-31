const { Client } = require('pg');

const client = new Client({
  user: 'desenvolvedor',
  host: 'localhost',
  database: 'postgres',
  password: 'dev@ecclesia_secure_2024',
  port: 5432,
});

async function test() {
  try {
    console.log('Tentando conectar...');
    await client.connect();
    console.log('✅ Conexão bem-sucedida!');
    const res = await client.query('SELECT datname FROM pg_database');
    console.log('Bancos de dados:', res.rows.map(r => r.datname));
    await client.end();
  } catch (err) {
    console.error('❌ Erro de conexão:', err.message);
    if (err.code === '28P01') {
      console.error('Dica: O erro 28P01 indica que a senha está incorreta ou o usuário não existe.');
    }
  }
}

test();
