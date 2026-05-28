import Database from './src/database';
import * as fs from 'fs';
async function run() {
  try {
    const db = Database.getInstance();
    const res = await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    const tables = res.rows.map(r => r.table_name);
    
    const fullSchema: any = {};
    for (const table of tables) {
        const columns = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1", [table]);
        fullSchema[table] = columns.rows;
    }
    
    fs.writeFileSync('db_full_inspect.json', JSON.stringify(fullSchema, null, 2));
    console.log('Database inspection complete. File saved to db_full_inspect.json');
    
    await db.close();
  } catch(e) {
    console.error(e);
  }
}
run();
