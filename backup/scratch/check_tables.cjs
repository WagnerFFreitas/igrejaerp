
const { Client } = require('pg');
require('dotenv').config({ path: './api/.env' });

async function test() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  
  try {
    const tables = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    console.log("Tables found:", tables.rows.map(r => r.tablename).join(', '));
    
    const checkTable = async (name) => {
      try {
        await client.query(`SELECT 1 FROM ${name} LIMIT 1`);
        console.log(`Table '${name}' exists.`);
        const cols = await client.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${name}'`);
        console.log(`Columns for '${name}':`, cols.rows.map(r => r.column_name).join(', '));
      } catch (e) {
        console.log(`Table '${name}' does NOT exist.`);
      }
    };

    await checkTable('payroll_periods');
    await checkTable('periodos_folha');
    await checkTable('employees');
    await checkTable('funcionarios');
    await checkTable('payroll_calculations');

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

test();
