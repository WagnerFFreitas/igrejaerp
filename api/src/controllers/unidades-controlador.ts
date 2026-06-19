/**
 * ============================================================================
 * UNIDADES-CONTROLADOR.TS (CORRIGIDO)
 * ============================================================================
 *
 * Controller que processa requisições relacionadas a unidades, usando Firestore.
 */

import { Request, Response } from 'express';
import { db } from '../database';

/**
 * Mapeia um documento de unidade do Firestore para o formato de resposta da API.
 */
function mapUnitDocToApiResponse(doc: FirebaseFirestore.DocumentSnapshot) {
    const data = doc.data() || {};
    return {
        id: doc.id,
        idUnidade: doc.id,
        ...data,
        ativo: data.ativo ?? true,
        criadoEm: data.criado_em?.toDate ? data.criado_em.toDate() : data.criado_em,
        atualizadoEm: data.atualizado_em?.toDate ? data.atualizado_em.toDate() : data.atualizado_em,
    };
}

export class UnitController {
    async getAll(req: Request, res: Response) {
        try {
            const snapshot = await db.collection('units').orderBy('nome').get();
            const unidades = snapshot.docs.map(mapUnitDocToApiResponse);
            // A resposta original era { unidades }, mantendo o padrão.
            res.json({ unidades });
        } catch (error: any) {
            console.error('Erro ao buscar unidades:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const doc = await db.collection('units').doc(id).get();

            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Unidade não encontrada' } });
            }
            res.json(mapUnitDocToApiResponse(doc));
        } catch (error: any) {
            console.error('Erro ao buscar unidade:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const body = req.body || {};
            const docRef = db.collection('units').doc(id);

            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Unidade não encontrada' } });
            }

            // Os dados de endereço e contato agora fazem parte do mesmo documento,
            // então a atualização é muito mais simples.
            const updatedData = {
                ...body,
                // Unifica os campos de endereço para consistência
                logradouro: body.logradouro || body.enderecoLinha1,
                numero: body.numero || body.enderecoLinha2,
                atualizado_em: new Date(),
            };

            // Remove campos que não devem ser persistidos diretamente
            delete updatedData.enderecoLinha1;
            delete updatedData.enderecoLinha2;
            delete updatedData.id;
            delete updatedData.idUnidade;


            await docRef.update(updatedData);
            const updatedDoc = await docRef.get();

            res.json(mapUnitDocToApiResponse(updatedDoc));

        } catch (error: any) {
            console.error('Erro ao atualizar unidade:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }
    
    // O método de criação não existia, mas pode ser adicionado se necessário.
    // async create(req: Request, res: Response) { ... }
}
