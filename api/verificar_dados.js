const { Client } = require('pg');
const client = new Client({ user: 'desenvolvedor', host: '127.0.0.1', database: 'igrejaerp', password: 'dev@ecclesia_secure_2024', port: 5432 });

async function checkData() {
    await client.connect();
    try {
        console.log("=== MEMBROS ===");
        const membros = await client.query('SELECT * FROM membros LIMIT 2');
        console.log(JSON.stringify(membros.rows, null, 2));

        console.log("\n=== EMPLOYEES ===");
        const funcionarios = await client.query('SELECT * FROM funcionarios LIMIT 2');
        console.log(JSON.stringify(funcionarios.rows, null, 2));
    } catch(err) {
        console.error("DB ERROR:", err.message);
    } finally {
        client.end();
    }
}
checkData();
