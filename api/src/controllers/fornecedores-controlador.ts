/**
 * ============================================================================
 * FORNECEDORES-CONTROLADOR.TS (NOVO)
 * ============================================================================
 *
 * Controller para fornecedores, migrado para Firestore com separação de responsabilidades.
 */

import { Request, Response } from 'express';
import { db } from '../database';

/**
 * Mapeia um documento de fornecedor do Firestore para o formato da API.
 */
function mapSupplierDocToApiResponse(doc: FirebaseFirestore.DocumentSnapshot) {
    const data = doc.data() || {};
    return {
        id: doc.id,
        idFornecedor: doc.id,
        ...data,
        ativo: data.ativo ?? true,
        criadoEm: data.criado_em?.toDate ? data.criado_em.toDate() : data.criado_em,
        atualizadoEm: data.atualizado_em?.toDate ? data.atualizado_em.toDate() : data.atualizado_em,
    };
}

export class FornecedoresController {

    async getAll(req: Request, res: Response) {
        try {
            const { idUnidade, busca, page = 1, limit = 50 } = req.query;
            let query: FirebaseFirestore.Query = db.collection('suppliers');

            if (idUnidade) {
                query = query.where('id_unidade', '==', idUnidade as string);
            }

            if (busca) {
                const search = busca as string;
                query = query.where('nome', '>=', search).where('nome', '<=', search + '\uf8ff');
            }

            const pageNumber = Number(page);
            const limitNumber = Number(limit);
            const offset = (pageNumber - 1) * limitNumber;

            const snapshot = await query.orderBy('nome').limit(limitNumber).offset(offset).get();
            const suppliers = snapshot.docs.map(mapSupplierDocToApiResponse);

            res.json(suppliers);

        } catch (error: any) {
            console.error('Erro ao buscar fornecedores:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const doc = await db.collection('suppliers').doc(id).get();

            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Fornecedor não encontrado' } });
            }

            res.json(mapSupplierDocToApiResponse(doc));

        } catch (error: any) {
            console.error('Erro ao buscar fornecedor:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const body = req.body || {};

            if (!body.nome) {
                return res.status(400).json({ error: { message: 'Nome é obrigatório' } });
            }

            const newSupplierData = {
                ...body,
                ativo: body.ativo ?? true,
                criado_em: new Date(),
                atualizado_em: new Date(),
            };

            const docRef = await db.collection('suppliers').add(newSupplierData);
            const newDoc = await docRef.get();

            res.status(201).json(mapSupplierDocToApiResponse(newDoc));

        } catch (error: any) {
            console.error('Erro ao criar fornecedor:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const body = req.body || {};
            const docRef = db.collection('suppliers').doc(id);

            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Fornecedor não encontrado' } });
            }

            const updatedData = {
                ...body,
                atualizado_em: new Date(),
            };

            await docRef.update(updatedData);
            const updatedDoc = await docRef.get();

            res.json(mapSupplierDocToApiResponse(updatedDoc));

        } catch (error: any) {
            console.error('Erro ao atualizar fornecedor:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const docRef = db.collection('suppliers').doc(id);

            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Fornecedor não encontrado' } });
            }

            // "Soft delete": apenas marca como inativo
            await docRef.update({
                ativo: false,
                atualizado_em: new Date(),
            });

            res.status(204).send();

        } catch (error: any) {
            console.error('Erro ao remover fornecedor:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }
}
