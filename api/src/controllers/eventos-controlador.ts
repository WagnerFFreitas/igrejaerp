/**
 * ============================================================================
 * EVENTOS-CONTROLADOR.TS (NOVO)
 * ============================================================================
 *
 * Controller para Eventos, migrado para Firestore.
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

function mapEventDocToApiResponse(doc: FirebaseFirestore.DocumentSnapshot) {
    const data = doc.data() || {};
    return {
        id: doc.id,
        ...data,
        recorrente: data.recorrente ?? false,
        criadoEm: data.criado_em?.toDate ? data.criado_em.toDate() : data.criado_em,
        atualizadoEm: data.atualizado_em?.toDate ? data.atualizado_em.toDate() : data.atualizado_em,
    };
}

export class EventosController {

    async getAll(req: Request, res: Response) {
        try {
            const { idUnidade, tipo } = req.query;
            let query: FirebaseFirestore.Query = db.collection('events');

            if (idUnidade) query = query.where('id_unidade', '==', idUnidade as string);
            if (tipo) query = query.where('tipo', '==', tipo as string);

            const snapshot = await query.orderBy('data_evento').orderBy('hora_evento').get();
            const events = snapshot.docs.map(mapEventDocToApiResponse);

            res.json(events);
        } catch (error: any) {
            console.error('Erro ao buscar eventos:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const doc = await db.collection('events').doc(id).get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Evento não encontrado' } });
            }
            res.json(mapEventDocToApiResponse(doc));
        } catch (error: any) {
            console.error('Erro ao buscar evento:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const body = req.body || {};
            const newEventData = {
                ...body,
                data_evento: toIsoDate(body.data_evento),
                recorrente: body.recorrente ?? false,
                criado_em: new Date(),
                atualizado_em: new Date(),
            };

            const docRef = await db.collection('events').add(newEventData);
            const newDoc = await docRef.get();
            res.status(201).json(mapEventDocToApiResponse(newDoc));
        } catch (error: any) {
            console.error('Erro ao criar evento:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const body = req.body || {};
            const docRef = db.collection('events').doc(id);

            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Evento não encontrado' } });
            }

            const updatedData = {
                ...body,
                ...(body.data_evento && { data_evento: toIsoDate(body.data_evento) }),
                atualizado_em: new Date(),
            };

            await docRef.update(updatedData);
            const updatedDoc = await docRef.get();
            res.json(mapEventDocToApiResponse(updatedDoc));

        } catch (error: any) {
            console.error('Erro ao atualizar evento:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const docRef = db.collection('events').doc(id);
            
            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Evento não encontrado' } });
            }

            await docRef.delete();
            res.status(204).send();

        } catch (error: any) {
            console.error('Erro ao deletar evento:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }
}
