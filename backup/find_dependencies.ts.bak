import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || 'dev@ecclesia_secure_2024'
});

async function findDependencies() {
  try {
    console.log('=== Procurando dependências da coluna eh_dizimista ===\n');
    
    // Buscar todas as views, índices, etc que referenciam a coluna
    const result = await pool.query(`
      SELECT 
        c.relname as object_name,
        c.relkind as object_type,
        n.nspname as schema_name
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.oid IN (
        SELECT DISTINCT d.classid::oid
        FROM pg_depend d
        JOIN pg_class cl ON cl.oid = d.refobjid
        JOIN pg_attribute attr ON attr.attrelid = cl.oid AND attr.attnum = d.refobjsubid
        WHERE cl.relname = 'membros'
        AND attr.attname = 'eh_dizimista'
      )
    `);
    
    if (result.rows.length === 0) {
      console.log('Nenhuma dependência encontrada via pg_depend.');
      
      // Tentar buscar views que usam a coluna
      const views = await pool.query(`
        SELECT viewname 
        FROM pg_views 
        WHERE schemaname = 'public' 
        AND definition LIKE '%eh_dizimista%'
      `);
      
      if (views.rows.length > 0) {
        console.log('\nViews que referenciam eh_dizimista:');
        views.rows.forEach(v => console.log(`  - ${v.viewname}`));
      } else {
        console.log('Nenhuma view encontrada.');
      }
      
    } else {
      console.log('Objetos que dependem de eh_dizimista:');
      result.rows.forEach(row => {
        const type = row.object_type === 'v' ? 'VIEW' : 
                     row.object_type === 'i' ? 'INDEX' : 
                     row.object_type === 'r' ? 'TABLE' : row.object_type;
        console.log(`  - ${row.object_name} (${type})`);
      });
    }
    
    // Verificar se há alguma trigger ou regra
    const triggers = await pool.query(`
      SELECT tgname, pg_get_triggerdef(oid) as def
      FROM pg_trigger 
      WHERE tgrelid = 'membros'::regclass
      AND pg_get_triggerdef(oid) LIKE '%eh_dizimista%'
    `);
    
    if (triggers.rows.length > 0) {
      console.log('\nTriggers que referenciam eh_dizimista:');
      triggers.rows.forEach(t => console.log(`  - ${t.tgname}: ${t.def}`));
    }
    
  } catch (error: any) {
    console.error('Erro:', error.message);
  } finally {
    await pool.end();
  }
}

findDependencies();