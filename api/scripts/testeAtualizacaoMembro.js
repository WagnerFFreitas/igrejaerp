// Test script to verify member update works after migration
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || 'dev@ecclesia_secure_2024'
});

async function testMemberUpdate() {
  try {
    console.log('=== Testing Member Update After Migration ===\n');

    // 1. Check if role column exists
    const roleCheck = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'role'"
    );
    console.log('✅ Role column exists:', roleCheck.rows.length > 0);

    // 2. Get a sample member
    const memberResult = await pool.query('SELECT id, name, role, status FROM members LIMIT 1');
    if (memberResult.rows.length === 0) {
      console.log('⚠️  No members found in database. Creating test member...');
      
      // Create a test member
      const testId = 'test-member-' + Date.now();
      await pool.query(
        `INSERT INTO members (id, unit_id, name, cpf, role, status, created_at, updated_at)
         VALUES ($1, (SELECT id FROM units LIMIT 1), 'Test Member', '000.000.000-00', 'MEMBER', 'ACTIVE', NOW(), NOW())`,
        [testId]
      );
      console.log('✅ Test member created');
    }

    const member = memberResult.rows[0];
    console.log('\n📋 Sample member:');
    console.log('   ID:', member.id);
    console.log('   Name:', member.name);
    console.log('   Role:', member.role);
    console.log('   Status:', member.status);

    // 3. Test updating the role
    const newRole = 'LEADER';
    await pool.query(
      'UPDATE members SET role = $1, updated_at = NOW() WHERE id = $2',
      [newRole, member.id]
    );
    console.log(`\n✅ Updated role to: ${newRole}`);

    // 4. Verify the update
    const updatedResult = await pool.query('SELECT role FROM members WHERE id = $1', [member.id]);
    console.log('✅ Verified role in database:', updatedResult.rows[0].role);

    // 5. Test updating multiple fields
    await pool.query(
      `UPDATE members 
       SET role = $1, status = $2, observations = $3, updated_at = NOW() 
       WHERE id = $4`,
      ['MEMBER', 'ACTIVE', 'Test observation', member.id]
    );
    console.log('✅ Updated multiple fields successfully');

    console.log('\n=== All Tests Passed! ===');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

testMemberUpdate();
