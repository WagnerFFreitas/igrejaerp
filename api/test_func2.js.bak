const { Client } = require('pg');
const client = new Client({ user: 'desenvolvedor', host: '127.0.0.1', database: 'igrejaerp', password: 'dev@ecclesia_secure_2024', port: 5432 });

async function getFunc() {
    await client.connect();
    try {
        const res = await client.query("SELECT prosrc FROM pg_proc WHERE proname = 'atualizar_timestamp_alteracao'");
        console.log(res.rows[0]?.prosrc);
    } catch(err) {
        console.error("DB ERROR:", err.message);
    } finally {
        client.end();
    }
}
getFunc();
