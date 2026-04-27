/**
 * test-connection.js
 * Testa a conexão com o banco PostgreSQL e exibe status das tabelas.
 * Uso: node database/test-connection.js
 */

const { query, end } = require(require('path').join(__dirname, 'db-connect'));

async function testConnection() {
  console.log('\n🔌 Testando conexão com PostgreSQL...\n');

  try {
    // 1. Ping básico
    const ping = await query('SELECT NOW() as server_time, version() as pg_version');
    console.log('✅ Conexão estabelecida!');
    console.log('   Hora do servidor:', ping.rows[0].server_time);
    console.log('   Versão PostgreSQL:', ping.rows[0].pg_version.split(' ').slice(0, 2).join(' '));

    // 2. Verificar banco de dados
    const dbCheck = await query('SELECT current_database() as db, current_user as usr');
    console.log('\n📊 Banco de dados:', dbCheck.rows[0].db);
    console.log('   Usuário conectado:', dbCheck.rows[0].usr);

    // 3. Listar tabelas existentes
    const tables = await query(`
      SELECT tablename, pg_size_pretty(pg_total_relation_size(quote_ident(tablename))) AS size
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    if (tables.rows.length === 0) {
      console.log('\n⚠️  Nenhuma tabela encontrada. Execute o schema SQL primeiro:');
      console.log('   psql -h localhost -U desenvolvedor -d igrejaerp -f database/migration/postgres_schema.sql');
    } else {
      console.log(`\n📋 Tabelas encontradas (${tables.rows.length}):`);
      tables.rows.forEach(t => {
        console.log(`   - ${t.tablename.padEnd(30)} ${t.size}`);
      });
    }

    // 4. Contagem de registros nas tabelas principais
    const mainTables = ['units', 'users', 'members', 'employees', 'transactions'];
    const counts = [];

    for (const table of mainTables) {
      try {
        const count = await query(`SELECT COUNT(*) as total FROM ${table}`);
        counts.push({ table, total: count.rows[0].total });
      } catch {
        counts.push({ table, total: 'tabela não existe' });
      }
    }

    console.log('\n📈 Registros nas tabelas principais:');
    counts.forEach(c => {
      const icon = typeof c.total === 'number' && c.total > 0 ? '✅' : '⚠️ ';
      console.log(`   ${icon} ${c.table.padEnd(20)} ${c.total} registros`);
    });

    console.log('\n✅ Teste concluído com sucesso!\n');

  } catch (err) {
    console.error('\n❌ Falha na conexão:', err.message);
    console.error('\nVerifique:');
    console.error('  1. PostgreSQL está rodando?  →  pg_isready -h localhost -p 5432');
    console.error('  2. Banco existe?             →  psql -U postgres -c "\\l"');
    console.error('  3. Usuário tem permissão?    →  psql -U postgres -c "\\du"');
    console.error('  4. Credenciais no .env       →  api/.env');
    process.exit(1);
  } finally {
    await end();
  }
}

testConnection();
