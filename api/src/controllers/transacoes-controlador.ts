/**
 * ============================================================================
 * TRANSACOES-CONTROLADOR.TS (NOVO)
 * ============================================================================
 *
 * Controller para transações, migrado para Firestore com arquitetura desacoplada.
 */

import { Request, Response } from 'express';
import { db } from '../database';

// Função auxiliar para garantir que a data esteja no formato ISO YYYY-MM-DD
const toIsoDate = (value: any): string | null => {
    if (!value) return null;
    try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return null;
        return date.toISOString().split('T')[0];
    } catch {
        return null;
    }
};

/**
 * Mapeia um documento de transação do Firestore para o formato de resposta da API.
 */
function mapTransactionDocToApiResponse(doc: FirebaseFirestore.DocumentSnapshot) {
    const data = doc.data() || {};
    return {
        id: doc.id,
        idTransacao: doc.id,
        ...data,
        valor: parseFloat(data.valor) || 0,
        conciliado: data.conciliado ?? false,
        criadoEm: data.criado_em?.toDate ? data.criado_em.toDate() : data.criado_em,
        atualizadoEm: data.atualizado_em?.toDate ? data.atualizado_em.toDate() : data.atualizado_em,
    };
}

export class TransacoesController {

    async getAll(req: Request, res: Response) {
        try {
            const { idUnidade, tipo, situacao, page = 1, limit = 50 } = req.query;
            let query: FirebaseFirestore.Query = db.collection('transactions');

            if (idUnidade) query = query.where('id_unidade', '==', idUnidade as string);
            if (tipo) query = query.where('tipo', '==', tipo as string);
            if (situacao) query = query.where('situacao', '==', situacao as string);

            // Paginação
            const pageNumber = Number(page);
            const limitNumber = Number(limit);
            const offset = (pageNumber - 1) * limitNumber;

            const snapshot = await query.orderBy('data_transacao', 'desc').limit(limitNumber).offset(offset).get();
            const transactions = snapshot.docs.map(mapTransactionDocToApiResponse);

            res.json(transactions);

        } catch (error: any) {
            console.error('Erro ao buscar transações:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const doc = await db.collection('transactions').doc(id).get();

            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Transação não encontrada' } });
            }

            res.json(mapTransactionDocToApiResponse(doc));

        } catch (error: any) {
            console.error('Erro ao buscar transação:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const body = req.body || {};
            
            const newTransactionData = {
                ...body,
                data_transacao: toIsoDate(body.data_transacao) || new Date().toISOString().split('T')[0],
                data_vencimento: toIsoDate(body.data_vencimento),
                data_pagamento: toIsoDate(body.data_pagamento),
                criado_em: new Date(),
                atualizado_em: new Date(),
            };

            const docRef = await db.collection('transactions').add(newTransactionData);
            const newDoc = await docRef.get();

            res.status(201).json(mapTransactionDocToApiResponse(newDoc));

        } catch (error: any) {
            console.error('Erro ao criar transação:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const body = req.body || {};
            const docRef = db.collection('transactions').doc(id);
            
            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Transação não encontrada' } });
            }

            const updatedData = {
                ...body,
                atualizado_em: new Date(),
                // Garante que as datas sejam formatadas corretamente, se fornecidas
                ...(body.data_transacao && { data_transacao: toIsoDate(body.data_transacao) }),
                ...(body.data_vencimento && { data_vencimento: toIsoDate(body.data_vencimento) }),
                ...(body.data_pagamento && { data_pagamento: toIsoDate(body.data_pagamento) }),
            };

            await docRef.update(updatedData);
            const updatedDoc = await docRef.get();

            res.json(mapTransactionDocToApiResponse(updatedDoc));

        } catch (error: any) {
            console.error('Erro ao atualizar transação:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const docRef = db.collection('transactions').doc(id);

            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Transação não encontrada' } });
            }

            // "Soft delete": atualiza a situação para 'CANCELADO'
            await docRef.update({
                situacao: 'CANCELADO',
                atualizado_em: new Date(),
            });

            res.status(200).json({ message: 'Transação cancelada com sucesso' });

        } catch (error: any) {
            console.error('Erro ao cancelar transação:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }
}
