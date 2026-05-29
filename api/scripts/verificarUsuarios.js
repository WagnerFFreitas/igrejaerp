require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'igrejaerp',
  user: 'desenvolvedor',
  password: 'dev@ecclesia_secure_2024'
});

async function checkUsers() {
  try {
    console.log('=== Verificando usuários no banco ===\n');
    
    const result = await pool.query(`
      SELECT id, nome_usuario, email, esta_ativo, role
      FROM users 
      ORDER BY id
    `);
    
    console.log(`Encontrados ${result.rows.length} usuários:\n`);
    
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`);
      console.log(`   Nome: ${user.nome_usuario}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Ativo: ${user.esta_ativo}`);
      console.log(`   Role: ${user.role}`);
      console.log('');
    });
    
    // Testar login com o primeiro usuário ativo
    if (result.rows.length > 0) {
      const activeUser = result.rows.find(u => u.esta_ativo);
      if (activeUser) {
        console.log(`\n=== Testando login com usuário ativo ===`);
        console.log(`Email: ${activeUser.email}`);
        console.log(`Nome: ${activeUser.nome_usuario}`);
        
        // Verificar se existe senha para este usuário
        const passwordResult = await pool.query(`
          SELECT senha_hash FROM users WHERE id = $1
        `, [activeUser.id]);
        
        if (passwordResult.rows.length > 0) {
          console.log(`Senha hash: ${passwordResult.rows[0].senha_hash.substring(0, 20)}...`);
        }
      }
    }
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await pool.end();
  }
}

checkUsers();