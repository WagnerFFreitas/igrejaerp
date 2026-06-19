#!/usr/bin/env node

/**
 * IGREJAERP - Script de Verificação
 * Valida e exibe estatísticas do banco de dados após seed
 *
 * Uso: node verify.js
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'igrejaerp',
  user: process.env.DB_USER || 'desenvolvedor',
  password: process.env.DB_PASSWORD || '',
  max: 20,
});

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
  cyan: '\x1b[36m',
};

const queries = {
  // Tabelas de Base
  enderecos: { query: 'SELECT COUNT(*) as count FROM public.enderecos', section: 'Base' },
  unidades: { query: 'SELECT COUNT(*) as count FROM public.unidades', section: 'Base' },
  pessoas: { query: 'SELECT COUNT(*) as count FROM public.pessoas', section: 'Base' },
  contatos: { query: 'SELECT COUNT(*) as count FROM public.contatos', section: 'Base' },

  // Pessoas especializadas
  usuarios: { query: 'SELECT COUNT(*) as count FROM public.usuarios', section: 'Pessoas' },
  membros: { query: 'SELECT COUNT(*) as count FROM public.membros', section: 'Pessoas' },
  funcionarios: { query: 'SELECT COUNT(*) as count FROM public.funcionarios', section: 'Pessoas' },
  dados_bancarios: { query: 'SELECT COUNT(*) as count FROM public.dados_bancarios_pessoa', section: 'Pessoas' },

  // Financeiro
  contas_financeiras: { query: 'SELECT COUNT(*) as count FROM public.contas_financeiras', section: 'Financeiro' },
  contas_bancarias: { query: 'SELECT COUNT(*) as count FROM public.contas_bancarias', section: 'Financeiro' },
  plano_contas: { query: 'SELECT COUNT(*) as count FROM public.plano_contas', section: 'Financeiro' },
  fornecedores: { query: 'SELECT COUNT(*) as count FROM public.fornecedores', section: 'Financeiro' },
  transacoes: { query: 'SELECT COUNT(*) as count FROM public.transacoes', section: 'Financeiro' },
  lancamentos: { query: 'SELECT COUNT(*) as count FROM public.lancamentos_contabeis', section: 'Financeiro' },

  // RH
  folha_pagamento: { query: 'SELECT COUNT(*) as count FROM public.folha_pagamento', section: 'RH' },
  periodos_folha: { query: 'SELECT COUNT(*) as count FROM public.periodos_folha', section: 'RH' },
  afastamentos: { query: 'SELECT COUNT(*) as count FROM public.afastamentos_funcionarios', section: 'RH' },

  // Patrimônio
  patrimonios: { query: 'SELECT COUNT(*) as count FROM public.patrimonios', section: 'Patrimônio' },
  contagens_inventario: { query: 'SELECT COUNT(*) as count FROM public.contagens_inventario', section: 'Patrimônio' },
  itens_inventario: { query: 'SELECT COUNT(*) as count FROM public.itens_inventario', section: 'Patrimônio' },
  ajustes_inventario: { query: 'SELECT COUNT(*) as count FROM public.ajustes_inventario', section: 'Patrimônio' },

  // Igreja
  eventos: { query: 'SELECT COUNT(*) as count FROM public.eventos_igreja', section: 'Igreja' },
  escalas_voluntarios: { query: 'SELECT COUNT(*) as count FROM public.escalas_voluntarios', section: 'Igreja' },

  // Sistema
  modulos_permissao: { query: 'SELECT COUNT(*) as count FROM public.app_permission_modules', section: 'Sistema' },
  role_permissions: { query: 'SELECT COUNT(*) as count FROM public.app_role_permissions', section: 'Sistema' },
  user_permissions: { query: 'SELECT COUNT(*) as count FROM public.app_user_permissions', section: 'Sistema' },
  audit_logs: { query: 'SELECT COUNT(*) as count FROM public.app_audit_logs', section: 'Sistema' },

  // LGPD
  politicas_lgpd: { query: 'SELECT COUNT(*) as count FROM public.politicas_lgpd', section: 'LGPD' },
  logs_consentimento: { query: 'SELECT COUNT(*) as count FROM public.logs_consentimento_lgpd', section: 'LGPD' },
};

const detailedQueries = {
  usuarios_por_perfil: `
    SELECT perfil, COUNT(*) as count
    FROM public.usuarios
    GROUP BY perfil
    ORDER BY count DESC
  `,
  unidades_ativas: `
    SELECT nome, situacao, ativo
    FROM public.unidades
    ORDER BY nome
  `,
  transacoes_por_tipo: `
    SELECT tipo, COUNT(*) as count, SUM(valor) as total
    FROM public.transacoes
    GROUP BY tipo
  `,
  membros_por_ministerio: `
    SELECT ministerio, COUNT(*) as count
    FROM public.membros
    WHERE ministerio IS NOT NULL
    GROUP BY ministerio
    ORDER BY count DESC
  `,
  saldo_contas_financeiras: `
    SELECT nome, tipo, saldo
    FROM public.contas_financeiras
    ORDER BY saldo DESC
  `,
  funcionarios_salarios: `
    SELECT
      p.nome,
      f.cargo,
      f.salario_base,
      f.regime_trabalho
    FROM public.funcionarios f
    JOIN public.pessoas p ON f.id_pessoa = p.id_pessoa
    ORDER BY f.salario_base DESC
  `,
};

async function verifyData() {
  try {
    console.log(`\n${colors.bright}${colors.blue}📊 IGREJAERP - Verificação de Dados${colors.reset}\n`);

    // Conexão
    console.log(`${colors.cyan}Conectando ao banco de dados...${colors.reset}`);
    const client = await pool.connect();

    const sections = {};
    let totalRecords = 0;

    // Executar queries de contagem
    for (const [tableName, { query, section }] of Object.entries(queries)) {
      const result = await client.query(query);
      const count = parseInt(result.rows[0].count);

      if (!sections[section]) {
        sections[section] = [];
      }

      sections[section].push({
        name: tableName.replace(/_/g, ' ').toUpperCase(),
        count,
      });

      totalRecords += count;
    }

    // Exibir resultados organizados por seção
    console.log(`\n${colors.bright}Resumo por Seção:${colors.reset}`);
    console.log('─'.repeat(50));

    for (const [section, tables] of Object.entries(sections)) {
      const sectionTotal = tables.reduce((sum, t) => sum + t.count, 0);
      console.log(`\n${colors.bright}${section}${colors.reset}`);

      for (const table of tables) {
        const status = table.count > 0 ? colors.green : colors.yellow;
        console.log(`  ${status}✓${colors.reset} ${table.name.padEnd(30)} ${colors.bright}${table.count}${colors.reset} reg.`);
      }

      console.log(`  ${colors.blue}Subtotal: ${colors.green}${sectionTotal}${colors.reset}`);
    }

    console.log('\n' + '─'.repeat(50));
    console.log(`${colors.bright}Total de Registros: ${colors.green}${totalRecords}${colors.reset}`);
    console.log('─'.repeat(50));

    // Queries detalhadas
    console.log(`\n${colors.bright}📈 Análises Detalhadas:${colors.reset}\n`);

    // Usuários por perfil
    console.log(`${colors.bright}Usuários por Perfil:${colors.reset}`);
    const perfisResult = await client.query(detailedQueries.usuarios_por_perfil);
    for (const row of perfisResult.rows) {
      console.log(`  • ${row.perfil.padEnd(15)} ${colors.green}${row.count}${colors.reset} usuário(s)`);
    }

    // Unidades
    console.log(`\n${colors.bright}Unidades (Igrejas):${colors.reset}`);
    const unidadesResult = await client.query(detailedQueries.unidades_ativas);
    for (const row of unidadesResult.rows) {
      const status = row.situacao === 'ATIVO' ? colors.green : colors.yellow;
      console.log(`  • ${row.nome.padEnd(20)} ${status}${row.situacao}${colors.reset}`);
    }

    // Transações por tipo
    console.log(`\n${colors.bright}Transações Financeiras:${colors.reset}`);
    const transResult = await client.query(detailedQueries.transacoes_por_tipo);
    for (const row of transResult.rows) {
      const valor = parseFloat(row.total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      console.log(`  • ${row.tipo.padEnd(15)} ${colors.green}${row.count}${colors.reset} transação(ções) - Total: ${valor}`);
    }

    // Membros por ministério
    console.log(`\n${colors.bright}Membros por Ministério:${colors.reset}`);
    const ministeriosResult = await client.query(detailedQueries.membros_por_ministerio);
    for (const row of ministeriosResult.rows) {
      console.log(`  • ${row.ministerio.padEnd(20)} ${colors.green}${row.count}${colors.reset} membro(s)`);
    }

    // Saldo financeiro
    console.log(`\n${colors.bright}Saldo das Contas Financeiras:${colors.reset}`);
    const saldoResult = await client.query(detailedQueries.saldo_contas_financeiras);
    for (const row of saldoResult.rows) {
      const saldo = parseFloat(row.saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      console.log(`  • ${row.nome.padEnd(20)} (${row.tipo.padEnd(10)}) ${colors.green}${saldo}${colors.reset}`);
    }

    // Salários
    console.log(`\n${colors.bright}Folha de Pagamento:${colors.reset}`);
    const salarioResult = await client.query(detailedQueries.funcionarios_salarios);
    for (const row of salarioResult.rows) {
      const salario = parseFloat(row.salario_base).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      console.log(`  • ${row.nome.padEnd(25)} ${row.cargo.padEnd(20)} ${colors.green}${salario}${colors.reset}`);
    }

    console.log(`\n${colors.bright}✅ Verificação Concluída com Sucesso!${colors.reset}\n`);

    client.release();
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Erro durante verificação:${colors.reset} ${error.message}`);
    if (error.detail) console.error(`  Detalhes: ${error.detail}`);
    return false;
  }
}

async function main() {
  const success = await verifyData();
  process.exit(success ? 0 : 1);
}

process.on('unhandledRejection', (reason) => {
  console.error(`${colors.red}Erro não tratado:${colors.reset}`, reason);
  process.exit(1);
});

main();
