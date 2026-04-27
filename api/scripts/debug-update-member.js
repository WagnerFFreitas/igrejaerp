const { Pool } = require('pg');
const pool = new Pool({ 
  host: 'localhost', 
  port: 5432, 
  database: 'igrejaerp', 
  user: 'desenvolvedor', 
  password: 'dev@ecclesia_secure_2024' 
});

async function debugUpdate() {
  try {
    console.log('--- Iniciando depuração de update ---');
    
    // 1. Buscar um membro existente para teste
    const memberRes = await pool.query('SELECT id, name, version FROM members LIMIT 1');
    if (memberRes.rows.length === 0) {
      console.log('Nenhum membro encontrado para teste.');
      return;
    }
    
    const member = memberRes.rows[0];
    console.log(`Testando com membro: ${member.name} (ID: ${member.id}, Versão: ${member.version})`);
    
    // 2. Tentar simular o update que o controller faz
    const id = member.id;
    const version = member.version;
    const updateData = { name: member.name + ' (Teste)' };
    
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    // O controller usa placeholders $1, $2... mas na query de update ele concatena de forma estranha
    // Vamos ver exatamente como está no controller:
    // const setClause = fields.map((f, idx) => `${f} = ${idx + 1}`).join(', ');
    // const finalSetClause = `${setClause}${setClause ? ', ' : ''}version = version + 1, updated_at = CURRENT_TIMESTAMP`;
    // `UPDATE members SET ${finalSetClause} WHERE id = ${fields.length + 1} AND version = ${fields.length + 2} RETURNING *`
    
    const setClause = fields.map((f, idx) => `${f} = $${idx + 1}`).join(', ');
    const finalSetClause = `${setClause}${setClause ? ', ' : ''}version = version + 1, updated_at = CURRENT_TIMESTAMP`;
    const query = `UPDATE members SET ${finalSetClause} WHERE id = $${fields.length + 1} AND version = $${fields.length + 2} RETURNING *`;
    
    console.log('Query gerada:', query);
    console.log('Valores:', [...values, id, version]);
    
    const result = await pool.query(query, [...values, id, version]);
    console.log('Resultado:', result.rowCount > 0 ? 'Sucesso' : 'Nenhuma linha afetada');
    
  } catch (err) {
    console.error('❌ ERRO CAPTURADO:', err.message);
    console.error('Stack:', err.stack);
  } finally {
    await pool.end();
  }
}

debugUpdate();
