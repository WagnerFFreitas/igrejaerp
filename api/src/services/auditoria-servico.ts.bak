/**
 * ============================================================================
 * AUDITSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço backend para audit service.
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
 * Define o bloco principal deste arquivo (audit service).
 */

const db = Database.getInstance();

export interface AuditLogRecord {
  id: string;
  idUnidade: string;
  userId: string;
  userName: string;
  action: string;
  entidade: string;
  entidadeId?: string;
  entidadeName?: string;
  date: string;
  ip: string;
  userAgent?: string;
  details?: any;
  success: boolean;
  errorMessage?: string;
  hash?: string;
  previousHash?: string | null;
  immutable?: boolean;
  createdAt?: string;
}

export async function ensureAuditTables(): Promise<void> {
  await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

  await db.query(`
    CREATE TABLE IF NOT EXISTS app_audit_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      id_unidade UUID,
      usuario_id UUID,
      nome_usuario VARCHAR(255) NOT NULL,
      acao VARCHAR(100) NOT NULL,
      entidade VARCHAR(100) NOT NULL,
      id_entidade VARCHAR(255),
      nome_entidade VARCHAR(255),
      data_evento TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ip VARCHAR(100) NOT NULL,
      agente_usuario TEXT,
      detalhes JSONB,
      sucesso BOOLEAN NOT NULL DEFAULT TRUE,
      mensagem_erro TEXT,
      hash_anterior VARCHAR(255),
      hash VARCHAR(255) NOT NULL,
      imutavel BOOLEAN NOT NULL DEFAULT TRUE,
      criado TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const columnsToRename = [
    ['entidade_id', 'id_entidade'],
    ['action', 'acao'],
    ['details', 'detalhes'],
    ['success', 'sucesso'],
    ['created_at', 'criado'],
  ];

  for (const [oldName, newName] of columnsToRename) {
    if (await auditColumnExists(oldName)) {
      await db.query(`ALTER TABLE app_audit_logs RENAME COLUMN ${oldName} TO ${newName}`);
    }
  }

  await db.query(`
    ALTER TABLE app_audit_logs
    ADD COLUMN IF NOT EXISTS hash_anterior VARCHAR(255)
  `);

  await db.query(`
    ALTER TABLE app_audit_logs
    ADD COLUMN IF NOT EXISTS hash VARCHAR(255)
  `);

  await db.query(`
    ALTER TABLE app_audit_logs
    ADD COLUMN IF NOT EXISTS nome_entidade VARCHAR(255)
  `);

  await db.query(`
    ALTER TABLE app_audit_logs
    ADD COLUMN IF NOT EXISTS agente_usuario TEXT
  `);

  await db.query(`
    ALTER TABLE app_audit_logs
    ADD COLUMN IF NOT EXISTS mensagem_erro TEXT
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_app_audit_logs_data_evento
    ON app_audit_logs (data_evento DESC)
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_app_audit_logs_id_unidade
    ON app_audit_logs (id_unidade)
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_app_audit_logs_acao
    ON app_audit_logs (acao)
  `);

  await db.query(`
    CREATE OR REPLACE FUNCTION prevent_app_audit_logs_mutation()
    RETURNS trigger AS $$
    BEGIN
      RAISE EXCEPTION 'app_audit_logs é imutável: alterações e exclusões não são permitidas pela aplicação';
    END;
    $$ LANGUAGE plpgsql;
  `);

  await db.query(`
    DROP TRIGGER IF EXISTS trg_prevent_app_audit_logs_update ON app_audit_logs;
  `);

  await db.query(`
    CREATE TRIGGER trg_prevent_app_audit_logs_update
    BEFORE UPDATE ON app_audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION prevent_app_audit_logs_mutation();
  `);

  await db.query(`
    DROP TRIGGER IF EXISTS trg_prevent_app_audit_logs_delete ON app_audit_logs;
  `);

  await db.query(`
    CREATE TRIGGER trg_prevent_app_audit_logs_delete
    BEFORE DELETE ON app_audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION prevent_app_audit_logs_mutation();
  `);
}

async function auditColumnExists(columnName: string): Promise<boolean> {
  const result = await db.query<{ exists: boolean }>(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'app_audit_logs'
          AND column_name = $1
      ) AS exists
    `,
    [columnName]
  );

  return result.rows[0]?.exists ?? false;
}

export function generateAuditHash(payload: Record<string, unknown>): string {
  const str = JSON.stringify(payload);
  let hash = 0;

  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }

  return hash.toString(16);
}

export async function getLastAuditHash(): Promise<string | null> {
  const result = await db.query<{ hash: string }>(
    `SELECT hash FROM app_audit_logs ORDER BY data_evento DESC, criado DESC LIMIT 1`
  );

  return result.rows[0]?.hash ?? null;
}

export async function createAuditLog(log: Omit<AuditLogRecord, 'id' | 'hash' | 'previousHash' | 'immutable' | 'createdAt'>): Promise<AuditLogRecord> {
  const previousHash = await getLastAuditHash();
  const basePayload = {
    idUnidade: log.idUnidade,
    userId: log.userId,
    userName: log.userName,
    action: log.action,
    entidade: log.entidade,
    entidadeId: log.entidadeId,
    entidadeName: log.entidadeName,
    date: log.date,
    ip: log.ip,
    userAgent: log.userAgent,
    details: log.details,
    success: log.success,
    errorMessage: log.errorMessage,
    previousHash
  };

  const hash = generateAuditHash(basePayload);

  const result = await db.query<{
    id: string;
    id_unidade: string | null;
    usuario_id: string | null;
    nome_usuario: string;
    acao: string;
    entidade: string;
    id_entidade: string | null;
    nome_entidade: string | null;
    data_evento: string;
    ip: string;
    agente_usuario: string | null;
    detalhes: any;
    sucesso: boolean;
    mensagem_erro: string | null;
    hash_anterior: string | null;
    hash: string;
    imutavel: boolean;
    criado: string;
  }>(
    `
      INSERT INTO app_audit_logs (
        id_unidade, usuario_id, nome_usuario, acao, entidade, id_entidade, nome_entidade,
        data_evento, ip, agente_usuario, detalhes, sucesso, mensagem_erro,
        hash_anterior, hash, imutavel
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13, $14, $15, true)
      RETURNING *
    `,
    [
      log.idUnidade || null,
      log.userId || null,
      log.userName,
      log.action,
      log.entidade,
      log.entidadeId || null,
      log.entidadeName || null,
      log.date,
      log.ip,
      log.userAgent || null,
      JSON.stringify(log.details ?? null),
      log.success,
      log.errorMessage || null,
      previousHash,
      hash
    ]
  );

  return mapAuditRow(result.rows[0]);
}

export async function listAuditLogs(params: {
  idUnidade?: string;
  action?: string;
  entidade?: string;
  limit?: number;
} = {}): Promise<AuditLogRecord[]> {
  const conditions: string[] = [];
  const values: any[] = [];

  if (params.idUnidade) {
    values.push(params.idUnidade);
    conditions.push(`id_unidade = $${values.length}`);
  }

  if (params.action) {
    values.push(params.action);
    conditions.push(`acao = $${values.length}`);
  }

  if (params.entidade) {
    values.push(params.entidade);
    conditions.push(`LOWER(entidade) = LOWER($${values.length})`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  values.push(Math.min(Math.max(params.limit ?? 500, 1), 5000));

  const result = await db.query(
    `
      SELECT *
      FROM app_audit_logs
      ${whereClause}
ORDER BY data_evento DESC, criado DESC
      LIMIT $${values.length}
    `,
    values
  );

  return result.rows.map(mapAuditRow);
}

function mapAuditRow(row: any): AuditLogRecord {
  return {
    id: row.id,
    idUnidade: row.id_unidade,
    userId: row.usuario_id,
    userName: row.nome_usuario,
    action: row.acao || row.action,
    entidade: row.entidade,
    entidadeId: row.id_entidade,
    entidadeName: row.nome_entidade,
    date: row.data_evento,
    ip: row.ip,
    userAgent: row.agente_usuario,
    details: row.detalhes ?? row.details,
    success: row.sucesso ?? row.success,
    errorMessage: row.mensagem_erro,
    previousHash: row.hash_anterior,
    hash: row.hash,
    immutable: row.imutavel,
    createdAt: row.criado || row.created_at,
  };
}
