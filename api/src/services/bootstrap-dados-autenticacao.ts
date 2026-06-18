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
import { ensurePermissionTables, seedPermissionModules, seedRolePermissions } from './permissoes-servico';
import { ensureAuditTables } from './auditoria-servico';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (bootstrap auth data).
 */

const db = Database.getInstance();

const ID_UNIDADE_PADRAO = '00000000-0000-0000-0000-000000000001';

const ROLE_TO_PERFIL: Record<string, string> = {
  DEVELOPER: 'DESENVOLVEDOR',
  ADMIN: 'ADMIN',
  SECRETARY: 'SECRETARIO',
  TREASURER: 'TESOUREIRO',
  PASTOR: 'PASTOR',
  RH: 'RH',
  FINANCEIRO: 'FINANCEIRO',
  MEMBER: 'MEMBRO',
};

export async function bootstrapAuthData(): Promise<void> {
  await ensurePermissionTables();
  await ensureAuditTables();
  await ensureMembersExtraFields();
  await seedPermissionModules();
  await seedRolePermissions();
  await ensureAdminUsers();
}

async function ensureMembersExtraFields(): Promise<void> {
  await db.query(`
    ALTER TABLE membros
    ADD COLUMN IF NOT EXISTS dados_perfil JSONB DEFAULT '{}'::jsonb
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
      INSERT INTO unidades (id_unidade, nome, cnpj, situacao, ativo, criado_em, atualizado_em)
      VALUES ($1, $2, $3, 'ATIVO', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (id_unidade) DO NOTHING
    `,
    [
      ID_UNIDADE_PADRAO,
      'Igreja ADJPA Sede',
      '00.000.000/0001-00'
    ]
  );
}

async function upsertSystemUser(params: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<void> {
  const perfil = ROLE_TO_PERFIL[params.role] || params.role;
  const existing = await db.query<{
    id_usuario: string;
    id_pessoa: string;
    email: string;
    perfil: string;
    senha_hash: string;
    esta_ativo: boolean;
  }>(
    `
      SELECT u.id_usuario, u.id_pessoa, ce.valor AS email, u.perfil, u.senha_hash, u.esta_ativo
      FROM usuarios u
      JOIN pessoas p ON p.id_pessoa = u.id_pessoa
      LEFT JOIN contatos ce ON ce.id_entidade = p.id_pessoa AND ce.tipo_entidade = 'PESSOA' AND ce.tipo_contato = 'EMAIL' AND ce.principal = true
      WHERE LOWER(ce.valor) = LOWER($1) OR LOWER(u.login) = LOWER($1)
      LIMIT 1
    `,
    [params.email]
  );

  const passwordHash = await bcrypt.hash(params.password, 10);

  if (existing.rows.length === 0) {
    const pessoa = await ensureSystemPerson(params.name, params.email);
    await ensureSystemEmployee(pessoa.id_pessoa, params.name);

    await db.query(
      `
        INSERT INTO usuarios (id_pessoa, login, senha_hash, perfil, esta_ativo)
        VALUES ($1, $2, $3, $4::perfil_usuario, true)
      `,
      [pessoa.id_pessoa, params.email.toLowerCase(), passwordHash, perfil]
    );
    return;
  }

  const current = existing.rows[0];
  const samePassword = await bcrypt.compare(params.password, current.senha_hash).catch(() => false);
  await ensureSystemEmployee(current.id_pessoa, params.name);

  if (!samePassword || current.perfil !== perfil || !current.esta_ativo) {
    await db.query(
      `
        UPDATE pessoas
        SET nome = $2,
            id_unidade = $3,
            atualizado_em = CURRENT_TIMESTAMP
        WHERE id_pessoa = $1
      `,
      [current.id_pessoa, params.name, ID_UNIDADE_PADRAO]
    );

    await db.query(
      `
        UPDATE usuarios
        SET senha_hash = $2,
            perfil = $3::perfil_usuario,
            esta_ativo = true,
            atualizado_em = CURRENT_TIMESTAMP
        WHERE id_usuario = $1
      `,
      [current.id_usuario, passwordHash, perfil]
    );
  }
}

async function ensureSystemPerson(name: string, email: string): Promise<{ id_pessoa: string }> {
  const existingPessoa = await db.query<{ id_pessoa: string }>(
    `SELECT p.id_pessoa FROM pessoas p
     LEFT JOIN contatos ce ON ce.id_entidade = p.id_pessoa AND ce.tipo_entidade = 'PESSOA' AND ce.tipo_contato = 'EMAIL' AND ce.principal = true
     WHERE LOWER(ce.valor) = LOWER($1) LIMIT 1`,
    [email]
  );

  if (existingPessoa.rows.length > 0) {
    await db.query(
      `UPDATE pessoas
       SET nome = $2,
           id_unidade = $3,
           ativo = true,
           atualizado_em = CURRENT_TIMESTAMP
       WHERE id_pessoa = $1`,
      [existingPessoa.rows[0].id_pessoa, name, ID_UNIDADE_PADRAO]
    );
    return existingPessoa.rows[0];
  }

  const created = await db.query<{ id_pessoa: string }>(
    `INSERT INTO pessoas (id_unidade, nome, ativo)
     VALUES ($1, $2, true)
     RETURNING id_pessoa`,
    [ID_UNIDADE_PADRAO, name]
  );

  const idPessoa = created.rows[0].id_pessoa;

  // Criar contato de email
  await db.query(
    `INSERT INTO contatos (tipo_entidade, id_entidade, tipo_contato, valor, principal)
     VALUES ('PESSOA', $1, 'EMAIL', $2, true)`,
    [idPessoa, email]
  );

  return created.rows[0];
}

async function ensureSystemEmployee(idPessoa: string, name: string): Promise<void> {
  const existingEmployee = await db.query(
    `SELECT id_funcionario FROM funcionarios WHERE id_pessoa = $1 LIMIT 1`,
    [idPessoa]
  );

  if (existingEmployee.rows.length > 0) {
    return;
  }

  const matricula = `SYS-${Date.now().toString().slice(-8)}`;
  await db.query(
    `INSERT INTO funcionarios (
       id_pessoa, id_unidade, matricula, cargo, departamento,
       data_admissao, regime_trabalho, ativo
     )
     VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, 'CLT', true)`,
    [idPessoa, ID_UNIDADE_PADRAO, matricula, name, 'Sistema']
  );
}
