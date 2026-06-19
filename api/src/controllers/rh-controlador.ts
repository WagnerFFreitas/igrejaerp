/**
 * ============================================================================
 * RH-CONTROLADOR.TS (NOVO)
 * ============================================================================
 *
 * Controller para o módulo de RH, focado em afastamentos de funcionários.
 */

import { Request, Response } from 'express';
import { db } from '../database';

const TIPOS_AFASTAMENTO = ['FERIAS', 'MEDICO', 'MATERNIDADE', 'PATERNIDADE', 'MILITAR', 'CASAMENTO', 'LUTO', 'NAO_REMUNERADO'];
const SITUACOES_AFASTAMENTO = ['AGENDADO', 'ATIVO', 'CONCLUIDO', 'CANCELADO'];

// Mapeia um documento do Firestore para o formato de resposta da API
function mapLeaveDocToApiResponse(doc: FirebaseFirestore.DocumentSnapshot) {
    const data = doc.data() || {};
    return {
        id: doc.id,
        ...data,
        // O nome do funcionário não é mais buscado diretamente via JOIN.
        // A aplicação cliente pode buscar essa informação se necessário.
        nomeFuncionario: data.nome_funcionario || null, 
        dataInicio: data.data_inicio?.toDate ? data.data_inicio.toDate() : data.data_inicio,
        dataFinal: data.data_final?.toDate ? data.data_final.toDate() : data.data_final,
        criadoEm: data.criado_em?.toDate ? data.criado_em.toDate() : data.criado_em,
        atualizadoEm: data.atualizado_em?.toDate ? data.atualizado_em.toDate() : data.atualizado_em,
    };
}

export class RhController {

    // --- AFASTAMENTOS (LEAVES) ---

    async listarAfastamentos(req: Request, res: Response) {
        try {
            const { idUnidade, idFuncionario } = req.query;
            let query: FirebaseFirestore.Query = db.collection('employee_leaves');

            if (idUnidade) {
                query = query.where('id_unidade', '==', idUnidade as string);
            }
            if (idFuncionario) {
                query = query.where('id_funcionario', '==', idFuncionario as string);
            }

            const snapshot = await query.orderBy('data_inicio', 'desc').get();
            const leaves = snapshot.docs.map(mapLeaveDocToApiResponse);
            res.json(leaves);
        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno ao listar afastamentos', details: error.message } });
        }
    }

    async salvarAfastamento(req: Request, res: Response) {
        try {
            const b = req.body;
            const tipo = (b.tipo || 'MEDICO').toUpperCase();
            const situacao = (b.situacao || 'AGENDADO').toUpperCase();

            if (!TIPOS_AFASTAMENTO.includes(tipo)) {
                return res.status(400).json({ error: { message: `Tipo de afastamento inválido: ${tipo}` } });
            }
            if (!SITUACOES_AFASTAMENTO.includes(situacao)) {
                return res.status(400).json({ error: { message: `Situação de afastamento inválida: ${situacao}` } });
            }

            const newLeaveData = {
                id_unidade: b.id_unidade || b.idUnidade,
                id_funcionario: b.id_funcionario || b.idFuncionario || b.employeeId,
                tipo: tipo,
                data_inicio: new Date(b.data_inicio || b.dataInicio || b.startDate),
                data_final: new Date(b.data_final  || b.dataFinal  || b.endDate),
                situacao: situacao,
                criado_em: new Date(),
                atualizado_em: new Date(),
            };

            const docRef = await db.collection('employee_leaves').add(newLeaveData);
            res.status(201).json({ id: docRef.id, ...newLeaveData });
        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno ao salvar afastamento', details: error.message } });
        }
    }

    async atualizarAfastamento(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const b = req.body;
            const docRef = db.collection('employee_leaves').doc(id);
            
            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Afastamento não encontrado' } });
            }

            const updatedData: Record<string, any> = { atualizado_em: new Date() };
            if (b.data_inicio || b.dataInicio || b.startDate) {
                updatedData.data_inicio = new Date(b.data_inicio || b.dataInicio || b.startDate);
            }
            if (b.data_final || b.dataFinal || b.endDate) {
                updatedData.data_final = new Date(b.data_final || b.dataFinal || b.endDate);
            }
            if (b.situacao || b.status) {
                const situacao = (b.situacao || b.status).toUpperCase();
                if (SITUACOES_AFASTAMENTO.includes(situacao)) {
                    updatedData.situacao = situacao;
                }
            }

            await docRef.update(updatedData);
            const updatedDoc = await docRef.get();
            res.json(mapLeaveDocToApiResponse(updatedDoc));
        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno ao atualizar afastamento', details: error.message } });
        }
    }

    async excluirAfastamento(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const docRef = db.collection('employee_leaves').doc(id);

            const doc = await docRef.get();
            if (!doc.exists) {
                return res.status(404).json({ error: { message: 'Afastamento não encontrado' } });
            }
            
            // Em vez de deletar, atualizamos a situação para 'CANCELADO' (soft delete)
            await docRef.update({ situacao: 'CANCELADO', atualizado_em: new Date() });
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ error: { message: 'Erro interno ao cancelar afastamento', details: error.message } });
        }
    }

    // --- PLACEHOLDERS PARA FUNCIONALIDADES NÃO IMPLEMENTADAS ---

    naoImplementado(req: Request, res: Response) {
        res.status(501).json({
            error: {
                message: 'Funcionalidade ainda não implementada.',
                status: 501,
            },
        });
    }

    listaVazia(req: Request, res: Response) {
        res.json([]);
    }
}
