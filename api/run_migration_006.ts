import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

async function run() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'desenvolvedor',
    database: process.env.DB_NAME || 'igrejaerp',
    password: process.env.DB_PASSWORD || 'Dev@123',
    port: parseInt(process.env.DB_PORT || '5432')
  });

  const sqlPath = path.join(__dirname, '../database/migration/006_add_missing_member_columns.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    await pool.query(sql);
    console.log('Migration 006 applied successfully.');
  } catch (err) {
    console.error('Error applying migration:', err);
  } finally {
    await pool.end();
  }
}

run();
