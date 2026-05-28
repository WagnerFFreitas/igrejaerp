/**
 * ============================================================================
 * PERMISSIONSSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço backend para permissions service.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import Database from '../database';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (permissions service).
 */

export interface EffectivePermission {
  moduleCode: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canManage: boolean;
}

const db = Database.getInstance();

export const APP_PERMISSION_MODULES = [
  { code: 'dashboard', name: 'Dashboard', categoria: 'general', description: 'Acesso ao painel geral' },
  { code: 'members', name: 'Membros', categoria: 'people', description: 'Cadastro e gestão de membros' },
  { code: 'finance', name: 'Financeiro', categoria: 'finance', description: 'Lançamentos financeiros e tesouraria' },
  { code: 'treasury', name: 'Tesouraria', categoria: 'finance', description: 'Fluxo de caixa, investimentos e alertas' },
  { code: 'bank_reconciliation', name: 'Conciliação Bancária', categoria: 'finance', description: 'Importação e conciliação de extratos' },
  { code: 'bank_accounts', name: 'Contas Bancárias', categoria: 'finance', description: 'Gestão de contas bancárias e saldos' },
  { code: 'patrimonios', name: 'Patrimônio', categoria: 'patrimonios', description: 'Cadastro e controle de bens' },
  { code: 'hr', name: 'Recursos Humanos', categoria: 'hr', description: 'Avaliações, RH e desenvolvimento' },
  { code: 'funcionarios', name: 'Funcionários', categoria: 'hr', description: 'Cadastro de colaboradores' },
  { code: 'leaves', name: 'Afastamentos', categoria: 'hr', description: 'Férias e afastamentos' },
  { code: 'folha_pagamento', name: 'Folha de Pagamento', categoria: 'hr', description: 'Processamento de folha' },
  { code: 'eventos_igreja', name: 'Eventos', categoria: 'operations', description: 'Agenda e eventos da igreja' },
  { code: 'communication', name: 'Comunicação', categoria: 'operations', description: 'Envio de campanhas e notificações' },
  { code: 'reports', name: 'Relatórios', categoria: 'reports', description: 'Exportações e relatórios' },
  { code: 'audit', name: 'Auditoria', categoria: 'security', description: 'Logs e trilha de auditoria' },
  { code: 'portal', name: 'Portal do Membro', categoria: 'portal', description: 'Portal de autoatendimento do membro' },
  { code: 'settings', name: 'Configurações', categoria: 'admin', description: 'Parâmetros globais da aplicação' },
  { code: 'usuarios', name: 'Usuários', categoria: 'admin', description: 'Cadastro de usuários do sistema' },
  { code: 'permissions', name: 'Permissões', categoria: 'admin', description: 'Configuração de perfis e acessos' }
] as const;

const DEFAULT_ROLE_MATRIX: Record<string, { canRead: boolean; canWrite: boolean; canDelete: boolean; canManage: boolean }> = {
  DEVELOPER: { canRead: true, canWrite: true, canDelete: true, canManage: true },
  ADMIN: { canRead: true, canWrite: true, canDelete: true, canManage: true },
  TREASURER: { canRead: true, canWrite: true, canDelete: false, canManage: false },
  SECRETARY: { canRead: true, canWrite: true, canDelete: false, canManage: false },
  PASTOR: { canRead: true, canWrite: true, canDelete: false, canManage: false },
  RH: { canRead: true, canWrite: true, canDelete: false, canManage: false },
  DP: { canRead: true, canWrite: true, canDelete: false, canManage: false },
  FINANCEIRO: { canRead: true, canWrite: true, canDelete: false, canManage: false }
};

function resolveRolePermissions(role: string, moduleCode: string) {
  let permission = DEFAULT_ROLE_MATRIX[role] || { canRead: false, canWrite: false, canDelete: false, canManage: false };

  if (role === 'TREASURER' && !['dashboard', 'finance', 'treasury', 'bank_reconciliation', 'bank_accounts', 'reports'].includes(moduleCode)) {
    permission = { canRead: false, canWrite: false, canDelete: false, canManage: false };
  }

  if (role === 'SECRETARY' && !['dashboard', 'members', 'eventos_igreja', 'communication', 'reports', 'portal'].includes(moduleCode)) {
    permission = { canRead: false, canWrite: false, canDelete: false, canManage: false };
  }

  if (role === 'PASTOR' && !['dashboard', 'members', 'eventos_igreja', 'reports', 'portal', 'communication', 'hr'].includes(moduleCode)) {
    permission = { canRead: false, canWrite: false, canDelete: false, canManage: false };
  }

  if (role === 'RH' && !['dashboard', 'hr', 'funcionarios', 'leaves', 'folha_pagamento', 'reports'].includes(moduleCode)) {
    permission = { canRead: false, canWrite: false, canDelete: false, canManage: false };
  }

  if (role === 'DP' && !['dashboard', 'funcionarios', 'leaves', 'folha_pagamento', 'reports'].includes(moduleCode)) {
    permission = { canRead: false, canWrite: false, canDelete: false, canManage: false };
  }

  if (role === 'FINANCEIRO' && !['dashboard', 'finance', 'treasury', 'bank_reconciliation', 'bank_accounts', 'reports'].includes(moduleCode)) {
    permission = { canRead: false, canWrite: false, canDelete: false, canManage: false };
  }

  return permission;
}

export async function ensurePermissionTables(): Promise<void> {
  await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await db.query(`
    CREATE TABLE IF NOT EXISTS app_permission_modules (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      codigo VARCHAR(100) UNIQUE NOT NULL,
      nome_modulo VARCHAR(255) NOT NULL,
      categoria VARCHAR(100) NOT NULL,
      descricao TEXT,
      criado TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      atualizado TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS app_role_permissions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      role VARCHAR(50) NOT NULL,
      codigo_modulo VARCHAR(100) NOT NULL REFERENCES app_permission_modules(codigo) ON DELETE CASCADE,
      ler BOOLEAN DEFAULT FALSE,
      escrever BOOLEAN DEFAULT FALSE,
      excluir BOOLEAN DEFAULT FALSE,
      gerenciar BOOLEAN DEFAULT FALSE,
      administrador BOOLEAN DEFAULT FALSE,
      criado TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      atualizado TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(role, codigo_modulo)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS app_user_permissions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      usuario_id UUID NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
      codigo_modulo VARCHAR(100) NOT NULL REFERENCES app_permission_modules(codigo) ON DELETE CASCADE,
      ler BOOLEAN,
      escrever BOOLEAN,
      excluir BOOLEAN,
      gerenciar BOOLEAN,
      administrador BOOLEAN,
      criado TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      atualizado TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(usuario_id, codigo_modulo)
    )
  `);

  // Migration: renomear colunas se existirem com nomes antigos
  await migratePermissionColumns('app_role_permissions');
  await migratePermissionColumns('app_user_permissions');
  
  // Garantir que colunas necessárias existam
  await ensureColumn('app_role_permissions', 'gerenciar', 'BOOLEAN DEFAULT FALSE');
  await ensureColumn('app_role_permissions', 'administrador', 'BOOLEAN DEFAULT FALSE');
  await ensureColumn('app_user_permissions', 'gerenciar', 'BOOLEAN');
  await ensureColumn('app_user_permissions', 'administrador', 'BOOLEAN');
}

async function ensureColumn(table: string, column: string, type: string): Promise<void> {
  try {
    await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${type}`);
  } catch (e: any) {
    // Coluna já existe
  }
}

async function migratePermissionColumns(tableName: string): Promise<void> {
  try {
    const columnsToRename = [
      { old: 'can_read', new: 'ler' },
      { old: 'can_write', new: 'escrever' },
      { old: 'can_delete', new: 'excluir' },
      { old: 'can_manage', new: 'gerenciar' },
      { old: 'pode_gerenciar', new: 'gerenciar' },
      { old: 'is_admin', new: 'administrador' },
    ];
    
    for (const { old, new: newCol } of columnsToRename) {
      if (await permissionColumnExists(tableName, old) && !(await permissionColumnExists(tableName, newCol))) {
        await db.query(`ALTER TABLE ${tableName} RENAME COLUMN ${old} TO ${newCol}`);
        console.log(`✅ ${tableName}: ${old} → ${newCol}`);
      }
    }
  } catch (e) {
    // Tabela não existe
  }
}

async function permissionColumnExists(tableName: string, columnName: string): Promise<boolean> {
  const result = await db.query<{ exists: boolean }>(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
          AND column_name = $2
      ) AS exists
    `,
    [tableName, columnName]
  );

  return result.rows[0]?.exists ?? false;
}

export async function seedPermissionModules(): Promise<void> {
  for (const module of APP_PERMISSION_MODULES) {
    await db.query(
      `
        INSERT INTO app_permission_modules (codigo, nome_modulo, categoria, descricao)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (codigo) DO UPDATE
        SET nome_modulo = EXCLUDED.nome_modulo,
            categoria = EXCLUDED.categoria,
            descricao = EXCLUDED.descricao,
            atualizado = CURRENT_TIMESTAMP
      `,
      [module.code, module.name, module.categoria, module.description]
    );
  }
}

export async function seedRolePermissions(): Promise<void> {
  const roles = Object.keys(DEFAULT_ROLE_MATRIX);

  for (const role of roles) {
    for (const module of APP_PERMISSION_MODULES) {
      const permission = resolveRolePermissions(role, module.code);
      await db.query(
        `
          INSERT INTO app_role_permissions (role, codigo_modulo, ler, escrever, excluir, gerenciar, administrador)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (role, codigo_modulo) DO UPDATE
          SET ler = EXCLUDED.ler,
              escrever = EXCLUDED.escrever,
              excluir = EXCLUDED.excluir,
              gerenciar = EXCLUDED.gerenciar,
              administrador = EXCLUDED.administrador,
              atualizado = CURRENT_TIMESTAMP
        `,
        [role, module.code, permission.canRead, permission.canWrite, permission.canDelete, permission.canManage, permission.canManage]
      );
    }
  }
}

export async function getEffectivePermissions(userId: string, role: string): Promise<EffectivePermission[]> {
  if (role === 'DEVELOPER') {
    return APP_PERMISSION_MODULES.map(module => ({
      moduleCode: module.code,
      canRead: true,
      canWrite: true,
      canDelete: true,
      canManage: true
    }));
  }

  const result = await db.query<{
    codigo_modulo: string;
    ler: boolean;
    escrever: boolean;
    excluir: boolean;
    gerenciar: boolean;
  }>(
    `
      SELECT
        pm.codigo AS codigo_modulo,
        COALESCE(up.ler, rp.ler, false) AS ler,
        COALESCE(up.escrever, rp.escrever, false) AS escrever,
        COALESCE(up.excluir, rp.excluir, false) AS excluir,
        COALESCE(up.gerenciar, rp.gerenciar, false) AS gerenciar
      FROM app_permission_modules pm
      LEFT JOIN app_role_permissions rp
        ON rp.codigo_modulo = pm.codigo
       AND rp.role = $2
      LEFT JOIN app_user_permissions up
        ON up.codigo_modulo = pm.codigo
       AND up.usuario_id = $1
      ORDER BY pm.codigo
    `,
    [userId, role]
  );

  return result.rows.map(row => ({
    moduleCode: row.codigo_modulo,
    canRead: row.ler,
    canWrite: row.escrever,
    canDelete: row.excluir,
    canManage: row.gerenciar
  }));
}

export async function replaceUserPermissions(
  userId: string,
  permissions: Array<{
    moduleCode: string;
    canRead?: boolean;
    canWrite?: boolean;
    canDelete?: boolean;
    canManage?: boolean;
  }>
): Promise<void> {
  await db.query('DELETE FROM app_user_permissions WHERE usuario_id = $1', [userId]);

  for (const permission of permissions) {
    await db.query(
      `
        INSERT INTO app_user_permissions (usuario_id, codigo_modulo, ler, escrever, excluir, gerenciar)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        userId,
        permission.moduleCode,
        permission.canRead ?? false,
        permission.canWrite ?? false,
        permission.canDelete ?? false,
        permission.canManage ?? false
      ]
    );
  }
}
