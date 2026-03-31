import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://desenvolvedor:dev@ecclesia_secure_2024@localhost:5432/igrejaerp',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL com sucesso');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente PostgreSQL', err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
