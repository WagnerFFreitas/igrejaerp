/**
 * ============================================================================
 * FUNCIONARIOS-CONTROLADOR.TS (NOVO)
 * ============================================================================
 *
 * Controller para funcionários, migrado para Firestore e com separação de responsabilidades.
 */

import { Request, Response } from 'express';
import { db } from '../database';

// Funções auxiliares (semelhantes ao members-controller)
const toIsoDate = (value: any): string | null => {
  if (!value) return null;
  try {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
  } catch { return null; }
};

const toBoolean = (value: any, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const text = value.trim().toLowerCase();
    if (['true', '1', 'sim', 's'].includes(text)) return true;
    if (['false', '0', 'nao', 'n'].includes(text)) return false;
  }
  return fallback;
};

/**
 * Mapeia um documento do Firestore para o formato de resposta da API.
 */
function mapEmployeeDocToApiResponse(doc: FirebaseFirestore.DocumentSnapshot) {
    const data = doc.data() || {};
    const ativo = toBoolean(data.ativo, true);

    return {
        id: doc.id,
        id_funcionario: doc.id,
        ...data, // Inclui todos os dados do documento
        data_nascimento: toIsoDate(data.data_nascimento),
        data_admissao: toIsoDate(data.data_admissao),
        data_demissao: toIsoDate(data.data_demissao),
        salario_base: parseFloat(data.salario_base || 0),
        ativo,
        status: ativo ? 'ACTIVE' : 'INACTIVE',
        criado_em: data.criado_em?.toDate ? data.criado_em.toDate() : data.criado_em,
        atualizado_em: data.atualizado_em?.toDate ? data.atualizado_em.toDate() : data.atualizado_em,
    };
}


export class FuncionariosController {

    async getAll(req: Request, res: Response) {
        try {
            const { idUnidade } = req.query;
            let query: FirebaseFirestore.Query = db.collection('employees');

            if (idUnidade) {
                query = query.where('id_unidade', '==', idUnidade as string);
            }

            const snapshot = await query.orderBy('nome').get();
            const employees = snapshot.docs.map(mapEmployeeDocToApiResponse);

            res.json(employees);

        } catch (error: any) {
            console.error('Erro ao buscar funcionários:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const doc = await db.collection('employees').doc(id).get();

            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Funcionário não encontrado' } });
            }

            res.json(mapEmployeeDocToApiResponse(doc));

        } catch (error: any) {
            console.error('Erro ao buscar funcionário:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const body = req.body || {};

            if (!body.nome) {
                return res.status(400).json({ error: { message: 'Nome é obrigatório' } });
            }

            // Opcional: Validar CPF único
            if (body.cpf) {
                const cpfSnapshot = await db.collection('employees').where('cpf', '==', body.cpf).limit(1).get();
                if (!cpfSnapshot.empty) {
                    return res.status(409).json({ error: { message: 'CPF já cadastrado' } });
                }
            }

            const newEmployeeData = {
                ...body,
                ativo: toBoolean(body.ativo, true),
                criado_em: new Date(),
                atualizado_em: new Date(),
            };

            const docRef = await db.collection('employees').add(newEmployeeData);
            const newDoc = await docRef.get();

            res.status(201).json(mapEmployeeDocToApiResponse(newDoc));

        } catch (error: any) {
            console.error('Erro ao criar funcionário:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const body = req.body || {};
            const docRef = db.collection('employees').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Funcionário não encontrado' } });
            }
            
            // Opcional: Validar CPF único na atualização
            if (body.cpf && body.cpf !== doc.data()?.cpf) {
                const cpfSnapshot = await db.collection('employees').where('cpf', '==', body.cpf).limit(1).get();
                if (!cpfSnapshot.empty) {
                    return res.status(409).json({ error: { message: 'CPF já pertence a outro funcionário' } });
                }
            }

            const updatedData = {
                ...body,
                atualizado_em: new Date(),
            };

            await docRef.update(updatedData);
            const updatedDoc = await docRef.get();

            res.json(mapEmployeeDocToApiResponse(updatedDoc));

        } catch (error: any) {
            console.error('Erro ao atualizar funcionário:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const docRef = db.collection('employees').doc(id);
            const doc = await docRef.get();

            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Funcionário não encontrado' } });
            }

            // "Soft delete": apenas marca como inativo
            await docRef.update({
                ativo: false,
                data_demissao: new Date().toISOString().split('T')[0], // Define a data de demissão
                atualizado_em: new Date(),
            });

            res.status(200).json({ message: 'Funcionário desativado com sucesso' });

        } catch (error: any) {
            console.error('Erro ao remover funcionário:', error);
            res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
        }
    }
}
