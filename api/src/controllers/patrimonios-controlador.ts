/**
 * ============================================================================
 * PATRIMONIOS-CONTROLADOR.TS (NOVO)
 * ============================================================================
 *
 * Controller para Patrimônios (Ativos) e Inventário, migrado para Firestore.
 */

import { Request, Response } from 'express';
import { db } from '../database';

const toIsoDate = (value: any): string | null => {
    if (!value) return null;
    try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
    } catch { return null; }
};


function mapAssetDocToApiResponse(doc: FirebaseFirestore.DocumentSnapshot) {
    const data = doc.data() || {};
    return {
        id: doc.id,
        ...data,
        valorAquisicao: parseFloat(data.valor_aquisicao) || 0,
        depreciacaoAcumulada: parseFloat(data.depreciacao_acumulada) || 0,
        criadoEm: data.criado_em?.toDate ? data.criado_em.toDate() : data.criado_em,
        atualizadoEm: data.atualizado_em?.toDate ? data.atualizado_em.toDate() : data.atualizado_em,
    };
}

export class PatrimoniosController {

    // ========================================================================
    // CRUD de Patrimônios (Assets)
    // ========================================================================

    async getAllAssets(req: Request, res: Response) {
        try {
            const { idUnidade, categoria, situacao } = req.query;
            let query: FirebaseFirestore.Query = db.collection('assets');

            if (idUnidade) query = query.where('id_unidade', '==', idUnidade as string);
            if (categoria) query = query.where('categoria', '==', categoria as string);
            if (situacao) query = query.where('situacao', '==', situacao as string);

            const snapshot = await query.orderBy('nome').get();
            const assets = snapshot.docs.map(mapAssetDocToApiResponse);

            res.json(assets);
        } catch (error: any) {
            console.error('Erro ao buscar patrimônios:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async getAssetById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const doc = await db.collection('assets').doc(id).get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Patrimônio não encontrado' } });
            }
            res.json(mapAssetDocToApiResponse(doc));
        } catch (error: any) {
            console.error('Erro ao buscar patrimônio:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async createAsset(req: Request, res: Response) {
        try {
            const newAssetData = {
                ...req.body,
                data_aquisicao: toIsoDate(req.body.data_aquisicao),
                criado_em: new Date(),
                atualizado_em: new Date(),
            };

            const docRef = await db.collection('assets').add(newAssetData);
            const newDoc = await docRef.get();
            res.status(201).json(mapAssetDocToApiResponse(newDoc));
        } catch (error: any) {
            console.error('Erro ao criar patrimônio:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async updateAsset(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const docRef = db.collection('assets').doc(id);

            const updatedData = {
                ...req.body,
                ...(req.body.data_aquisicao && { data_aquisicao: toIsoDate(req.body.data_aquisicao) }),
                atualizado_em: new Date(),
            };

            await docRef.update(updatedData);
            const updatedDoc = await docRef.get();
            res.json(mapAssetDocToApiResponse(updatedDoc));
        } catch (error: any) {
            console.error('Erro ao atualizar patrimônio:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async deleteAsset(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await db.collection('assets').doc(id).update({
                situacao: 'BAIXADO',
                atualizado_em: new Date(),
            });
            res.status(204).send();
        } catch (error: any) {
            console.error('Erro ao remover patrimônio:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    // ========================================================================
    // Fluxo de Inventário
    // ========================================================================

    async getAllInventoryCounts(req: Request, res: Response) {
        try {
            const { idUnidade } = req.query;
            if (!idUnidade) {
                return res.status(400).json({ error: { message: 'O idUnidade é obrigatório' } });
            }
            const snapshot = await db.collection('inventoryCounts')
                                     .where('id_unidade', '==', idUnidade as string)
                                     .orderBy('data_contagem', 'desc')
                                     .get();
            const counts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.json(counts);
        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async startInventoryCount(req: Request, res: Response) {
        try {
            const { idUnidade } = req.body;
            if (!idUnidade) {
                return res.status(400).json({ error: { message: 'O idUnidade é obrigatório' } });
            }

            // 1. Busca os ativos da unidade
            const assetsSnapshot = await db.collection('assets')
                                             .where('id_unidade', '==', idUnidade)
                                             .where('situacao', '==', 'ATIVO')
                                             .get();

            // 2. Cria a nova contagem de inventário
            const newCountRef = db.collection('inventoryCounts').doc();
            await newCountRef.set({
                id_unidade: idUnidade,
                data_contagem: new Date().toISOString().split('T')[0],
                situacao: 'EM_ANDAMENTO',
                total_itens: assetsSnapshot.size, // Armazena o total
                criado_em: new Date(),
            });

            // 3. Adiciona os itens em lote (batch)
            const batch = db.batch();
            assetsSnapshot.forEach(assetDoc => {
                const itemRef = newCountRef.collection('items').doc();
                batch.set(itemRef, {
                    id_patrimonio: assetDoc.id,
                    nome_patrimonio: assetDoc.data().nome,
                    quantidade_esperada: 1,
                    quantidade_contada: 0,
                    diferenca: -1,
                    condicao: 'NAO_VERIFICADO',
                });
            });
            await batch.commit();

            res.status(201).json({ id: newCountRef.id, totalPatrimonios: assetsSnapshot.size });

        } catch (error: any) {
            console.error('Erro ao iniciar contagem:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async getInventoryItems(req: Request, res: Response) {
        try {
            const { countId } = req.params;
            const snapshot = await db.collection('inventoryCounts').doc(countId).collection('items').get();
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.json(items);
        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async updateInventoryItem(req: Request, res: Response) {
        try {
            const { countId, itemId } = req.params;
            const { quantidade_contada, condicao } = req.body;

            const docRef = db.collection('inventoryCounts').doc(countId).collection('items').doc(itemId);
            const itemDoc = await docRef.get();
            if(!itemDoc.exists) {
                return res.status(404).json({ error: { message: 'Item de inventário não encontrado' }});
            }
            
            const quantidadeEsperada = itemDoc.data()?.quantidade_esperada || 1;
            const diferenca = quantidade_contada - quantidadeEsperada;

            await docRef.update({
                quantidade_contada,
                condicao: condicao || 'BOM',
                diferenca,
                atualizado_em: new Date(),
            });

            res.json({ ok: true });
        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async closeInventoryCount(req: Request, res: Response) {
        try {
            const { countId } = req.params;
            await db.collection('inventoryCounts').doc(countId).update({
                situacao: 'CONCLUIDO',
                concluido_em: new Date(),
            });
            res.json({ ok: true });
        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }
}
