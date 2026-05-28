import Database from './src/database';
async function run() {
  try {
    const db = Database.getInstance();
    const res = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('TABLES_LIST:' + JSON.stringify(res.rows.map(r => r.table_name)));
    
    for (const table of res.rows) {
        const columns = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1", [table.table_name]);
        console.log(`COLUMNS_FOR_${table.table_name}:` + JSON.stringify(columns.rows));
    }
    
    await db.close();
  } catch(e) {
    console.error(e);
  }
}
run();
