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
  unitId: string;
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
      unit_id UUID,
      usuario_id UUID,
      nome_usuario VARCHAR(255) NOT NULL,
      action VARCHAR(100) NOT NULL,
      entidade VARCHAR(100) NOT NULL,
      entidade_id VARCHAR(255),
      nome_entidade VARCHAR(255),
      data_evento TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      ip VARCHAR(100) NOT NULL,
      agente_usuario TEXT,
      details JSONB,
      success BOOLEAN NOT NULL DEFAULT TRUE,
      mensagem_erro TEXT,
      hash_anterior VARCHAR(255),
      hash VARCHAR(255) NOT NULL,
      imutavel BOOLEAN NOT NULL DEFAULT TRUE,
      criado TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_app_audit_logs_data_evento
    ON app_audit_logs (data_evento DESC)
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_app_audit_logs_unit_id
    ON app_audit_logs (unit_id)
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS idx_app_audit_logs_action
    ON app_audit_logs (action)
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
    unitId: log.unitId,
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
    unit_id: string | null;
    usuario_id: string | null;
    nome_usuario: string;
    action: string;
    entidade: string;
    entidade_id: string | null;
    nome_entidade: string | null;
    data_evento: string;
    ip: string;
    user_agent: string | null;
    details: any;
    success: boolean;
    error_message: string | null;
    previous_hash: string | null;
    hash: string;
    immutable: boolean;
    created_at: string;
  }>(
    `
      INSERT INTO app_audit_logs (
        unit_id, usuario_id, nome_usuario, action, entidade, entidade_id, nome_entidade,
        data_evento, ip, user_agent, details, success, error_message,
        previous_hash, hash, immutable
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13, $14, $15, true)
      RETURNING *
    `,
    [
      log.unitId || null,
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
  unitId?: string;
  action?: string;
  entidade?: string;
  limit?: number;
} = {}): Promise<AuditLogRecord[]> {
  const conditions: string[] = [];
  const values: any[] = [];

  if (params.unitId) {
    values.push(params.unitId);
    conditions.push(`unit_id = $${values.length}`);
  }

  if (params.action) {
    values.push(params.action);
    conditions.push(`action = $${values.length}`);
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
    unitId: row.unit_id,
    userId: row.usuario_id,
    userName: row.nome_usuario,
    action: row.action,
    entidade: row.entidade,
    entidadeId: row.entidade_id,
    entidadeName: row.nome_entidade,
    date: row.data_evento,
    ip: row.ip,
    userAgent: row.user_agent,
    details: row.details,
    success: row.success,
    errorMessage: row.error_message,
    previousHash: row.previous_hash,
    hash: row.hash,
    immutable: row.immutable,
    createdAt: row.criado,
  };
}
