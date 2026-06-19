
import Database from '../api/src/database';

async function test() {
  const db = Database.getInstance();
  try {
    const tables = await db.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    console.log("Tables found:", tables.rows.map(r => r.tablename).join(', '));
    
    try {
      const payroll_periods = await db.query("SELECT * FROM payroll_periods LIMIT 1");
      console.log("payroll_periods table exists.");
    } catch (e) {
      console.log("payroll_periods table does NOT exist.");
    }

    try {
      const periodos_folha = await db.query("SELECT * FROM periodos_folha LIMIT 1");
      console.log("periodos_folha table exists.");
    } catch (e) {
      console.log("periodos_folha table does NOT exist.");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit();
  }
}

test();
