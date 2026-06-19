const { Client } = require('pg');
const client = new Client({ user: 'desenvolvedor', host: '127.0.0.1', database: 'igrejaerp', password: 'dev@ecclesia_secure_2024', port: 5432 });

async function getTriggers() {
    await client.connect();
    try {
        const res = await client.query("SELECT trigger_name, event_object_table, action_statement FROM information_schema.triggers WHERE event_object_table = 'membros'");
        console.log(res.rows);
    } catch(err) {
        console.error("DB ERROR:", err.message);
    } finally {
        client.end();
    }
}
getTriggers();
