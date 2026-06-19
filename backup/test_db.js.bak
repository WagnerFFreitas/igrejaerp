const { Client } = require('pg');
const client = new Client({ user: 'desenvolvedor', host: '127.0.0.1', database: 'igrejaerp', password: 'dev@ecclesia_secure_2024', port: 5432 });
client.connect().then(async () => {
    try {
        const res = await client.query('SELECT column_name FROM information_schema.columns WHERE table_name = \'membros\'');
        console.log(JSON.stringify(res.rows.map(r=>r.column_name)));
    } catch(e) {
        console.error(e.message);
    }
    client.end();
});
