/**
 * ============================================================================
 * BOOTSTRAPAUTHDATA.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço backend para bootstrap auth data.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import bcrypt from 'bcryptjs';
import Database from '../database';
import { ensurePermissionTables, seedPermissionModules, seedRolePermissions } from './permissionsService';
import { ensureAuditTables } from './auditService';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (bootstrap auth data).
 */

const db = Database.getInstance();

const DEFAULT_UNIT_ID = '00000000-0000-0000-0000-000000000001';

export async function bootstrapAuthData(): Promise<void> {
  await ensurePermissionTables();
  await ensureAuditTables();
  await ensureMembersExtraFields();
  await ensureEmployeesSchema();
  await seedPermissionModules();
  await seedRolePermissions();
  await ensureAdminUsers();
}

async function ensureMembersExtraFields(): Promise<void> {
  await db.query(`
    ALTER TABLE membros
    ADD COLUMN IF NOT EXISTS profile_data JSONB DEFAULT '{}'::jsonb
  `);
}

async function ensureEmployeesSchema(): Promise<void> {
  await db.query(`
    ALTER TABLE employees
    ADD COLUMN IF NOT EXISTS profile_data JSONB DEFAULT '{}'::jsonb
  `);

  await db.query(`
    ALTER TABLE employees
    DROP CONSTRAINT IF EXISTS employees_matricula_check
  `);

  await db.query(`
    ALTER TABLE employees
    ADD CONSTRAINT employees_matricula_check
    CHECK (
      matricula IS NULL
      OR matricula ~ '^[0-9]{4,}$'
      OR matricula ~ '^F[0-9]{2,}/[0-9]{4}$'
    )
  `);
}

async function ensureAdminUsers(): Promise<void> {
  await ensureDefaultUnit();

  await upsertSystemUser({
    name: 'Desenvolvedor Master',
    email: 'desenvolvedor@igrejaerp.com.br',
    password: 'dev@ecclesia_secure_2024',
    role: 'DEVELOPER'
  });

  await upsertSystemUser({
    name: 'Administrador do Sistema',
    email: 'admin@igrejaerp.com.br',
    password: 'Admin@123',
    role: 'ADMIN'
  });
}

async function ensureDefaultUnit(): Promise<void> {
  await db.query(
    `
      INSERT INTO units (id, nome_unidade, cnpj, endereco, cidade, estado, sede, status, criado, atualizado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CAST($8 AS unit_status), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO NOTHING
    `,
    [
      DEFAULT_UNIT_ID,
      'Igreja ADJPA Sede',
      '00.000.000/0001-00',
      'Endereço não informado',
      'São Paulo',
      'SP',
      true,
      'ACTIVE'
    ]
  );
}

async function upsertSystemUser(params: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<void> {
  const existing = await db.query<{
    id: string;
    email: string;
    role: string;
    hash_senha: string;
    esta_ativo: boolean;
  }>(
    `
      SELECT id, email, role, hash_senha, esta_ativo
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `,
    [params.email]
  );

  const passwordHash = await bcrypt.hash(params.password, 10);

  if (existing.rows.length === 0) {
    await db.query(
      `
        INSERT INTO users (nome_usuario, email, hash_senha, role, unit_id, esta_ativo, criado, atualizado)
        VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      [params.name, params.email, passwordHash, params.role, DEFAULT_UNIT_ID]
    );
    return;
  }

  const current = existing.rows[0];
  const samePassword = await bcrypt.compare(params.password, current.hash_senha).catch(() => false);

  if (!samePassword || current.role !== params.role || !current.esta_ativo) {
    await db.query(
      `
        UPDATE users
        SET nome_usuario = $2,
            hash_senha = $3,
            role = $4,
            unit_id = $5,
            esta_ativo = true,
            atualizado = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
      [current.id, params.name, passwordHash, params.role, DEFAULT_UNIT_ID]
    );
  }
}
