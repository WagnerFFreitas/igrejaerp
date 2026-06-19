require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || 'dev@ecclesia_secure_2024'
});

async function checkJoaoCarlos() {
  try {
    console.log('=== Verificando WhatsApp do João Carlos Silva ===\n');

    const result = await pool.query(
      `SELECT id, name, phone, whatsapp, matricula, updated_at 
       FROM members 
       WHERE name ILIKE '%João Carlos Silva%'`
    );

    if (result.rows.length === 0) {
      console.log('❌ João Carlos Silva não encontrado');
      await pool.end();
      return;
    }

    const member = result.rows[0];
    console.log(`📋 Nome: ${member.name}`);
    console.log(`📱 Telefone (phone): ${member.phone || '(VAZIO)'}`);
    console.log(`💬 WhatsApp (whatsapp): ${member.whatsapp || '(VAZIO)'}`);
    console.log(`🏷️  Matrícula: ${member.matricula || '(VAZIO)'}`);
    console.log(`📅 Atualizado em: ${member.updated_at}`);
    console.log(`🆔 ID: ${member.id}\n`);

    console.log('=== Verificação Concluída ===');
    console.log('\n💡 Compare com o valor do frontend:');
    console.log('   - Frontend recebeu: whatsapp: "(11) 98765-4322"');
    console.log(`   - Banco tem: whatsapp: "${member.whatsapp || '(VAZIO)'}"`);
    
    if (member.whatsapp === '(11) 98765-4322') {
      console.log('\n✅ WhatsApp SALVO corretamente no banco!');
    } else {
      console.log('\n❌ WhatsApp NÃO foi salvo no banco!');
      console.log('   O backend recebeu o valor mas não persistiu.');
    }
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    await pool.end();
  }
}

checkJoaoCarlos();
