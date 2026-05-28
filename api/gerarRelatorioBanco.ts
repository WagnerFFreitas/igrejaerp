/**
 * ============================================================================
 * GENERATE_DB_REPORT.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Gera um relatório completo do banco de dados PostgreSQL com:
 * - Todas as tabelas
 * - Todas as colunas (nome, tipo, nullable, padrão)
 * - Chaves primárias
 * - Chaves estrangeiras (relacionamentos)
 * - Índices
 * - Comentários das tabelas
 *
 * ONDE É USADO?
 * -------------
 * Executado via terminal para documentação do banco de dados.
 *
 * COMO FUNCIONA?
 * --------------
 * Conecta no PostgreSQL usando as configurações do .env,
 * consulta o information_schema e pg_catalog, e gera
 * um arquivo Markdown com o relatório completo.
 */

import Database from './src/database';
import * as fs from 'fs';
import * as path from 'path';

async function generateReport() {
  const db = Database.getInstance();

  console.log('🔍 Iniciando geração do relatório do banco de dados...\n');

  // 1. Buscar todas as tabelas
  console.log('📋 Buscando tabelas...');
  const tablesResult = await db.query(`
    SELECT
      t.table_name,
      obj_description(c.oid) as table_comment
    FROM information_schema.tables t
    LEFT JOIN pg_class c ON c.relname = t.table_name
    WHERE t.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
    ORDER BY t.table_name
  `);

  const tables = tablesResult.rows;
  console.log(`   Encontradas ${tables.length} tabelas.\n`);

  let markdown = '# Relatório Completo do Banco de Dados PostgreSQL\n\n';
  markdown += `**Banco de Dados:** ${process.env.DB_NAME || 'igrejaerp'}\n`;
  markdown += `**Host:** ${process.env.DB_HOST || 'localhost'}\n`;
  markdown += `**Data da Geração:** ${new Date().toLocaleString('pt-BR')}\n\n`;
  markdown += '---\n\n';

  // 2. Resumo das tabelas
  markdown += '## 📊 Resumo\n\n';
  markdown += `| Tabela | Comentário |\n`;
  markdown += `|--------|------------|\n`;
  for (const table of tables) {
    const comment = table.table_comment || '-';
    markdown += `| **${table.table_name}** | ${comment} |\n`;
  }
  markdown += '\n---\n\n';

  // 3. Detalhes de cada tabela
  markdown += '## 📋 Detalhes das Tabelas\n\n';

  for (const table of tables) {
    const tableName = table.table_name;
    console.log(`   Processando tabela: ${tableName}`);

    markdown += `### Tabela: \`${tableName}\`\n\n`;

    if (table.table_comment) {
      markdown += `**Descrição:** ${table.table_comment}\n\n`;
    }

    // Colunas
    const columnsResult = await db.query(`
      SELECT
        c.column_name,
        c.data_type,
        c.character_maximum_length,
        c.is_nullable,
        c.column_default,
        col_description(pgc.oid, c.ordinal_position) as column_comment
      FROM information_schema.columns c
      LEFT JOIN pg_class pgc ON pgc.relname = c.table_name
      WHERE c.table_schema = 'public'
        AND c.table_name = $1
      ORDER BY c.ordinal_position
    `, [tableName]);

    markdown += '#### Colunas\n\n';
    markdown += '| Coluna | Tipo | Tamanho | Nullable | Padrão | Comentário |\n';
    markdown += '|--------|------|----------|----------|--------|------------|\n';

    for (const col of columnsResult.rows) {
      const colName = `**${col.column_name}**`;
      const dataType = col.data_type;
      const maxLen = col.character_maximum_length || '-';
      const nullable = col.is_nullable === 'YES' ? '✅ SIM' : '❌ NÃO';
      const defaultVal = col.column_default ? `\`${col.column_default}\`` : '-';
      const comment = col.column_comment || '-';

      markdown += `| ${colName} | ${dataType} | ${maxLen} | ${nullable} | ${defaultVal} | ${comment} |\n`;
    }
    markdown += '\n';

    // Chave Primária
    const pkResult = await db.query(`
      SELECT
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
       AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name = $1
      ORDER BY kcu.ordinal_position
    `, [tableName]);

    if (pkResult.rows.length > 0) {
      markdown += '#### Chave Primária\n\n';
      markdown += '| Coluna |\n';
      markdown += '|--------|\n';
      for (const pk of pkResult.rows) {
        markdown += `| **${pk.column_name}** |\n`;
      }
      markdown += '\n';
    }

    // Chaves Estrangeiras (Relacionamentos de saída)
    const fkResult = await db.query(`
      SELECT
        kcu.column_name,
        ccu.table_name AS referenced_table,
        ccu.column_name AS referenced_column,
        tc.constraint_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
       AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage ccu
        ON tc.constraint_name = ccu.constraint_name
       AND tc.table_schema = ccu.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name = $1
      ORDER BY kcu.ordinal_position
    `, [tableName]);

    if (fkResult.rows.length > 0) {
      markdown += '#### Chaves Estrangeiras (Relacionamentos)\n\n';
      markdown += '| Coluna | Tabela Referenciada | Coluna Referenciada | Constraint |\n';
      markdown += '|--------|---------------------|--------------------|------------|\n';
      for (const fk of fkResult.rows) {
        markdown += `| **${fk.column_name}** | \`${fk.referenced_table}\` | \`${fk.referenced_column}\` | \`${fk.constraint_name}\` |\n`;
      }
      markdown += '\n';
    }

    // Índices
    const indexesResult = await db.query(`
      SELECT
        i.relname as index_name,
        a.attname as column_name,
        ix.indisunique as is_unique,
        ix.indisprimary as is_primary
      FROM pg_class t
      JOIN pg_namespace n ON n.oid = t.relnamespace
      JOIN pg_index ix ON t.oid = ix.indrelid
      JOIN pg_class i ON i.oid = ix.indexrelid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
      WHERE t.relkind = 'r'
        AND n.nspname = 'public'
        AND t.relname = $1
      ORDER BY i.relname, a.attnum
    `, [tableName]);

    if (indexesResult.rows.length > 0) {
      // Agrupar índices por nome
      const indexMap: any = {};
      for (const idx of indexesResult.rows) {
        if (!indexMap[idx.index_name]) {
          indexMap[idx.index_name] = {
            name: idx.index_name,
            unique: idx.is_unique,
            primary: idx.is_primary,
            columns: []
          };
        }
        indexMap[idx.index_name].columns.push(idx.column_name);
      }

      markdown += '#### Índices\n\n';
      markdown += '| Índice | Colunas | Único | Primário |\n';
      markdown += '|--------|---------|--------|----------|\n';
      for (const idx of Object.values(indexMap)) {
        const i: any = idx;
        const cols = i.columns.map((c: string) => `\`${c}\``).join(', ');
        const unique = i.unique ? '✅ SIM' : '❌ NÃO';
        const primary = i.primary ? '✅ SIM' : '❌ NÃO';
        markdown += `| \`${i.name}\` | ${cols} | ${unique} | ${primary} |\n`;
      }
      markdown += '\n';
    }

    markdown += '---\n\n';
  }

  // 4. Relacionamentos (Visão Geral)
  markdown += '## 🔗 Relacionamentos (Visão Geral)\n\n';
  markdown += '| Tabela Origem | Coluna | Tabela Destino | Coluna Destino |\n';
  markdown += '|---------------|--------|----------------|------------------|\n';

  const allFKs = await db.query(`
    SELECT
      tc.table_name AS source_table,
      kcu.column_name AS source_column,
      ccu.table_name AS target_table,
      ccu.column_name AS target_column
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
     AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
     AND tc.table_schema = ccu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
    ORDER BY tc.table_name, kcu.ordinal_position
  `);

  for (const rel of allFKs.rows) {
    markdown += `| \`${rel.source_table}\` | **${rel.source_column}** | \`${rel.target_table}\` | **${rel.target_column}** |\n`;
  }
  markdown += '\n---\n\n';

  // 5. Estatísticas
  markdown += '## 📈 Estatísticas\n\n';
  const statsResult = await db.query(`
    SELECT
      relname as table_name,
      n_live_tup as row_count
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY n_live_tup DESC
  `);

  markdown += '| Tabela | Número de Linhas (aprox.) |\n';
  markdown += '|--------|---------------------------|\n';
  for (const stat of statsResult.rows) {
    markdown += `| \`${stat.table_name}\` | ${stat.row_count || 0} |\n`;
  }
  markdown += '\n---\n\n';

  markdown += '*Relatório gerado automaticamente.*\n';

  // Salvar arquivo
  const outputPath = path.join(__dirname, '..', 'docs', 'relatorio_banco_dados.md');

  // Garantir que a pasta docs existe
  const docsDir = path.join(__dirname, '..', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, markdown, 'utf-8');

  console.log(`\n✅ Relatório gerado com sucesso!`);
  console.log(`📄 Arquivo salvo em: ${outputPath}`);

  await db.close();
  process.exit(0);
}

generateReport().catch(err => {
  console.error('❌ Erro ao gerar relatório:', err);
  process.exit(1);
});
