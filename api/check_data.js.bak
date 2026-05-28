const { Client } = require('pg');
const client = new Client({ user: 'desenvolvedor', host: '127.0.0.1', database: 'igrejaerp', password: 'dev@ecclesia_secure_2024', port: 5432 });

async function checkData() {
    await client.connect();
    try {
        console.log("=== MEMBROS ===");
        const membros = await client.query('SELECT * FROM membros LIMIT 2');
        console.log(JSON.stringify(membros.rows, null, 2));

        console.log("\n=== EMPLOYEES ===");
        const employees = await client.query('SELECT * FROM employees LIMIT 2');
        console.log(JSON.stringify(employees.rows, null, 2));
    } catch(err) {
        console.error("DB ERROR:", err.message);
    } finally {
        client.end();
    }
}
checkData();
