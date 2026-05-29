require('dotenv').config();
const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({ host: process.env.DB_HOST, port: process.env.DB_PORT, database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });

async function run() {
  const r = await pool.query("SELECT id, name, situacao, cargo_igreja, ministerio, profile_data FROM members WHERE id = '8a9e0bf5-a6da-4e0e-bd94-225bbd394160'");
  const m = r.rows[0];
  console.log('=== Dados salvos no banco ===');
  console.log('name:', m.name);
  console.log('situacao:', m.situacao);
  console.log('cargo_igreja:', m.cargo_igreja);
  console.log('ministerio:', m.ministerio);
  console.log('\n=== profile_data (campos extras) ===');
  const pd = m.profile_data || {};
  console.log('fatherName:', pd.fatherName);
  console.log('motherName:', pd.motherName);
  console.log('bloodType:', pd.bloodType);
  console.log('emergencyContact:', pd.emergencyContact);
  console.log('conversionDate:', pd.conversionDate);
  console.log('baptismDate:', pd.baptismDate);
  console.log('discipleshipCourse:', pd.discipleshipCourse);
  console.log('biblicalSchool:', pd.biblicalSchool);
  console.log('mainMinistry:', pd.mainMinistry);
  console.log('ecclesiasticalPosition:', pd.ecclesiasticalPosition);
  console.log('bank:', pd.bank);
  console.log('bankAgency:', pd.bankAgency);
  console.log('specialNeeds:', pd.specialNeeds);
  console.log('talents:', pd.talents);
  await pool.end();
}
run().catch(e => { console.error(e.message); pool.end(); });
