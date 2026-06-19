/**
 * ============================================================================
 * AUDITORIA-SERVICO.TS (REATORADO PARA FIRESTORE)
 * ============================================================================
 *
 * Serviço de backend para registrar e consultar logs de auditoria no Firestore.
 */

import { db } from '../database';
import { FieldValue } from 'firebase-admin/firestore';

export interface AuditLogRecord {
  id?: string;
  idUnidade: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  entityName?: string;
  timestamp: FieldValue | Date;
  ip: string;
  userAgent?: string;
  details?: any;
  success: boolean;
  errorMessage?: string;
  previousHash?: string | null;
  hash?: string;
}

// Função simples de hashing (não criptográfica)
function generateHash(payload: Record<string, unknown>): string {
    const str = JSON.stringify(payload);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Converte para um inteiro de 32 bits
    }
    return hash.toString(16);
}

// Busca o hash do último log de auditoria registrado
async function getLastAuditHash(): Promise<string | null> {
    const snapshot = await db.collection('audit_logs')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();

    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs[0].data().hash || null;
}

/**
 * Cria um novo registro de auditoria no Firestore.
 * A imutabilidade é garantida pela ausência de métodos de alteração ou exclusão.
 */
export async function createAuditLog(log: Omit<AuditLogRecord, 'id' | 'hash' | 'previousHash'>): Promise<AuditLogRecord> {
    const previousHash = await getLastAuditHash();

    const basePayload = {
        ...log,
        details: log.details ?? null, // Garante que o campo exista para o hash
        previousHash
    };
    
    // Remove o campo de timestamp do cálculo do hash para consistência
    const { timestamp, ...payloadForHash } = basePayload;
    const hash = generateHash(payloadForHash);

    const newLog: AuditLogRecord = {
        ...basePayload,
        timestamp: FieldValue.serverTimestamp(), // Usa o timestamp do servidor Firestore
        hash,
    };

    const docRef = await db.collection('audit_logs').add(newLog);
    return { id: docRef.id, ...newLog };
}

/**
 * Lista os logs de auditoria com base nos filtros fornecidos.
 */
export async function listAuditLogs(params: {
    idUnidade?: string;
    action?: string;
    entity?: string;
    limit?: number;
} = {}): Promise<AuditLogRecord[]> {
    
    let query: FirebaseFirestore.Query = db.collection('audit_logs');

    if (params.idUnidade) {
        query = query.where('idUnidade', '==', params.idUnidade);
    }
    if (params.action) {
        query = query.where('action', '==', params.action);
    }
    if (params.entity) {
        query = query.where('entity', '==', params.entity);
    }

    const limit = Math.min(Math.max(params.limit ?? 100, 1), 1000);
    query = query.orderBy('timestamp', 'desc').limit(limit);

    const snapshot = await query.get();

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp.toDate(), // Converte o timestamp para objeto Date
        } as AuditLogRecord;
    });
}
