const { Client } = require('pg');
const client = new Client({ user: 'desenvolvedor', host: '127.0.0.1', database: 'igrejaerp', password: 'dev@ecclesia_secure_2024', port: 5432 });

async function getDbSchema() {
    await client.connect();
    try {
        const res = await client.query(`
            SELECT table_name, column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position;
        `);
        
        const schema = {};
        for (const row of res.rows) {
            if (!schema[row.table_name]) schema[row.table_name] = [];
            schema[row.table_name].push(row.column_name);
        }
        console.log(JSON.stringify(schema, null, 2));
    } catch(err) {
        console.error("DB ERROR:", err.message);
    } finally {
        client.end();
    }
}
getDbSchema();
