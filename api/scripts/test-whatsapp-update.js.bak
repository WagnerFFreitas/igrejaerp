// Test script to verify member update with whatsapp field works correctly
require('dotenv').config();
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testMemberUpdateWithWhatsapp() {
  try {
    console.log('=== Testing Member Update with WhatsApp Field ===\n');

    // 1. Get a member first
    console.log('📋 Fetching a member...');
    const getResponse = await axios.get(`${API_BASE}/members?limit=1`);
    const member = getResponse.data.members[0];
    
    if (!member) {
      console.log('❌ No members found');
      return;
    }

    console.log('✅ Member found:', member.name);
    console.log('   ID:', member.id);
    console.log('   Current whatsapp:', member.whatsapp || '(not set)');

    // 2. Update member with new whatsapp number
    const newWhatsapp = '(11) 99999-8888';
    console.log(`\n📝 Updating whatsapp to: ${newWhatsapp}`);
    
    const updateResponse = await axios.put(`${API_BASE}/members/${member.id}`, {
      whatsapp: newWhatsapp,
      name: member.name, // Keep existing name
      cpf: member.cpf    // Keep existing CPF
    });

    console.log('✅ Update successful!');
    console.log('   Updated whatsapp:', updateResponse.data.whatsapp);

    // 3. Verify the update by fetching the member again
    console.log('\n🔍 Verifying update...');
    const verifyResponse = await axios.get(`${API_BASE}/members/${member.id}`);
    console.log('✅ Verified! WhatsApp in database:', verifyResponse.data.whatsapp);

    // 4. Test updating multiple fields including whatsapp
    console.log('\n📝 Testing multiple field update...');
    const multiUpdateResponse = await axios.put(`${API_BASE}/members/${member.id}`, {
      whatsapp: '(11) 88888-7777',
      observations: 'Test observation with whatsapp update',
      role: member.role || 'MEMBER'
    });

    console.log('✅ Multiple field update successful!');
    console.log('   WhatsApp:', multiUpdateResponse.data.whatsapp);
    console.log('   Observations:', multiUpdateResponse.data.observations);

    console.log('\n=== All WhatsApp Tests Passed! ===');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testMemberUpdateWithWhatsapp();
