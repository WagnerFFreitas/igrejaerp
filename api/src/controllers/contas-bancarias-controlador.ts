/**
 * ============================================================================
 * CONTAS-BANCARIAS-CONTROLADOR.TS (NOVO)
 * ============================================================================
 *
 * Controller para Contas Bancárias, migrado para Firestore.
 */

import { Request, Response } from 'express';
import { db } from '../database';

// Mapeia um documento do Firestore para o formato de resposta da API
function mapAccountDocToApiResponse(doc: FirebaseFirestore.DocumentSnapshot) {
    const data = doc.data() || {};
    return {
        id: doc.id,
        ...data,
        saldo: data.saldo != null ? parseFloat(data.saldo) : 0,
        esta_ativo: data.esta_ativo ?? true,
        criado_em: data.criado_em?.toDate ? data.criado_em.toDate() : data.criado_em,
        atualizado_em: data.atualizado_em?.toDate ? data.atualizado_em.toDate() : data.atualizado_em,
    };
}

export class ContasBancariasController {

    async getAll(req: Request, res: Response) {
        try {
            const { idUnidade } = req.query;
            let query: FirebaseFirestore.Query = db.collection('bank_accounts').where('esta_ativo', '==', true);

            if (idUnidade) {
                query = query.where('id_unidade', '==', idUnidade as string);
            }

            const snapshot = await query.orderBy('nome_conta').get();
            const accounts = snapshot.docs.map(mapAccountDocToApiResponse);
            res.json(accounts);
        } catch (error: any) {
            console.error('Erro ao buscar contas bancárias:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const doc = await db.collection('bank_accounts').doc(id).get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Conta bancária não encontrada' } });
            }
            res.json(mapAccountDocToApiResponse(doc));
        } catch (error: any) {
            console.error('Erro ao buscar conta bancária:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const body = req.body || {};
            const newAccountData = {
                id_unidade: body.id_unidade || null,
                nome_conta: body.nome_conta,
                tipo_conta: body.tipo_conta || 'CORRENTE',
                nome_banco: body.nome_banco || null,
                agencia: body.agencia || null,
                numero_conta: body.numero_conta || null,
                moeda: body.moeda || 'BRL',
                saldo: 0, // Saldo inicializado em 0
                esta_ativo: true,
                criado_em: new Date(),
                atualizado_em: new Date(),
            };

            const docRef = await db.collection('bank_accounts').add(newAccountData);
            const newDoc = await docRef.get();
            res.status(201).json(mapAccountDocToApiResponse(newDoc));
        } catch (error: any) {
            console.error('Erro ao criar conta bancária:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const body = req.body || {};
            const docRef = db.collection('bank_accounts').doc(id);

            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Conta bancária não encontrada' } });
            }

            const updatedData = {
                ...body,
                atualizado_em: new Date(),
            };

            await docRef.update(updatedData);
            const updatedDoc = await docRef.get();
            res.json(mapAccountDocToApiResponse(updatedDoc));
        } catch (error: any) {
            console.error('Erro ao atualizar conta bancária:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async softDelete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const docRef = db.collection('bank_accounts').doc(id);

            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Conta bancária não encontrada' } });
            }

            await docRef.update({ esta_ativo: false, atualizado_em: new Date() });
            res.status(204).send();
        } catch (error: any) {
            console.error('Erro ao deletar conta bancária:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }
}
