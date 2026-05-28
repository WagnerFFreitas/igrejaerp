const { Client } = require('pg');
const client = new Client({ user: 'desenvolvedor', host: '127.0.0.1', database: 'igrejaerp', password: 'dev@ecclesia_secure_2024', port: 5432 });

async function testUpdate() {
    await client.connect();
    try {
        const id = '4a52de60-a2c2-4293-b369-b133ef40fb64';
        const updateData = { nome: 'Teste', cpf: '12345678901', email: 'teste@teste.com' };
        
        const currentResult = await client.query('SELECT dados_perfil FROM membros WHERE id = $1', [id]);
        if (currentResult.rows.length === 0) {
            console.log('Member not found');
            return;
        }

        const currentProfileData = currentResult.rows[0]?.dados_perfil || {};
        updateData.dados_perfil = currentProfileData;

        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        const setClause = fields.map((f, idx) => `${f} = $${idx + 1}`).join(', ');
        const finalSetClause = `${setClause}${setClause ? ', ' : ''}atualizado = CURRENT_TIMESTAMP`;

        console.log("Query:", `UPDATE membros SET ${finalSetClause} WHERE id = $${fields.length + 1} RETURNING *`);
        console.log("Values:", [...values, id]);

        const result = await client.query(
            `UPDATE membros SET ${finalSetClause} WHERE id = $${fields.length + 1} RETURNING *`,
            [...values, id]
        );
        console.log("Success");
    } catch(err) {
        console.error("DB ERROR:", err.message);
    } finally {
        client.end();
    }
}
testUpdate();
