/**
 * ============================================================================
 * MEMBERSCONTROLLER.TS (REESCRITO PARA FIREBASE)
 * ============================================================================
 *
 * Controller para membros, adaptado para o Firestore.
 * A estrutura de dados foi denormalizada para um único documento por membro.
 */

import { Request, Response } from 'express';
import { db } from '../database';

// Tipos de situação para consistência da API
type SituacaoApi = 'ACTIVE' | 'INACTIVE' | 'PENDING';

// Converte a situação do banco para o formato da API
function toApiSituacao(value: any): SituacaoApi {
  const text = String(value ?? '').trim().toUpperCase();
  if (['ACTIVE', 'ATIVO'].includes(text)) return 'ACTIVE';
  if (['PENDING', 'PENDENTE'].includes(text)) return 'PENDING';
  return 'INACTIVE';
}

// Converte a situação da API para o formato do banco
function fromApiSituacao(value: any): string {
    const text = String(value ?? '').trim().toUpperCase();
    if (['ACTIVE', 'ATIVO'].includes(text)) return 'ATIVO';
    if (['INACTIVE', 'INATIVO'].includes(text)) return 'INATIVO';
    if (['PENDING', 'PENDENTE'].includes(text)) return 'PENDENTE';
    return 'ATIVO';
}


// Função auxiliar para converter valores para booleano
function toBoolean(value: any, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const text = value.trim().toLowerCase();
    if (['true', '1', 'sim', 's', 'yes', 'y'].includes(text)) return true;
    if (['false', '0', 'nao', 'não', 'n', 'no'].includes(text)) return false;
  }
  return fallback;
}

// Converte um valor para data no formato ISO (YYYY-MM-DD)
function toIsoDate(value: any): string | null {
  if (!value) return null;
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
  } catch (e) {
    return null;
  }
}

/**
 * Mapeia um documento do Firestore para o formato de resposta da API.
 */
function mapMemberDocToApiResponse(doc: FirebaseFirestore.DocumentSnapshot) {
  const data = doc.data() || {};
  const situacaoApi = toApiSituacao(data.situacao);

  return {
    id: doc.id,
    id_membro: doc.id,
    id_pessoa: data.id_pessoa, // Mantido para referência, se necessário
    id_unidade: data.id_unidade,
    nome: data.nome || '',
    cpf: data.cpf || '',
    rg: data.rg || '',
    email: data.email || '',
    telefone: data.telefone || '',
    celular: data.celular || '',
    whatsapp: data.whatsapp || '',
    data_nascimento: toIsoDate(data.data_nascimento),
    sexo: data.sexo || 'OTHER',
    estado_civil: data.estado_civil || 'SINGLE',
    data_conversao: toIsoDate(data.data_conversao),
    data_batismo: toIsoDate(data.data_batismo),
    data_membro: toIsoDate(data.data_membro),
    situacao: situacaoApi,
    status: situacaoApi,
    dizimista: toBoolean(data.dizimista),
    ofertante: toBoolean(data.ofertante),
    observacoes: data.observacoes || null,
    // Adiciona outros campos que possam estar no documento
    ...data,
    ativo: situacaoApi === 'ACTIVE',
    criado: data.criado_em?.toDate ? data.criado_em.toDate() : data.criado_em,
    atualizado: data.atualizado_em?.toDate ? data.atualizado_em.toDate() : data.atualizado_em,
  };
}

export class MembersController {

  async getAll(req: Request, res: Response) {
    try {
      const { idUnidade, search, situacao, page = 1, limit = 50 } = req.query;
      let query: FirebaseFirestore.Query = db.collection('members');

      if (idUnidade) {
        query = query.where('id_unidade', '==', idUnidade as string);
      }
      if (situacao) {
        query = query.where('situacao', '==', fromApiSituacao(situacao as string));
      }
      if (search) {
        // Firestore não suporta busca textual complexa (ILIKE) nativamente.
        // Uma solução simples é buscar pelo nome.
        // Para buscas mais complexas, seria necessário um serviço como Algolia ou ElasticSearch.
        query = query.where('nome', '>=', search as string).where('nome', '<=', search + '\uf8ff');
      }

      const totalSnapshot = await query.get();
      const total = totalSnapshot.size;

      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const offset = (pageNumber - 1) * limitNumber;

      const snapshot = await query.orderBy('nome').limit(limitNumber).offset(offset).get();
      const members = snapshot.docs.map(mapMemberDocToApiResponse);

      res.json({
        members,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber),
        },
      });

    } catch (error: any) {
      console.error('Erro ao buscar membros:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const doc = await db.collection('members').doc(id).get();

      if (!doc.exists) {
        return res.status(404).json({ error: { message: 'Membro não encontrado' } });
      }

      res.json(mapMemberDocToApiResponse(doc));

    } catch (error: any) {
      console.error('Erro ao buscar membro:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { ...body } = req.body;

      if (!body.nome || !body.cpf) {
        return res.status(400).json({ error: { message: 'Nome e CPF são obrigatórios' } });
      }

      // Validação de CPF único
      const cpfSnapshot = await db.collection('members').where('cpf', '==', body.cpf).limit(1).get();
      if (!cpfSnapshot.empty) {
        return res.status(409).json({ error: { message: 'CPF já cadastrado' } });
      }

      const newMemberData = {
        ...body,
        situacao: fromApiSituacao(body.situacao || 'ACTIVE'),
        criado_em: new Date(),
        atualizado_em: new Date(),
      };

      const docRef = await db.collection('members').add(newMemberData);
      const newDoc = await docRef.get();

      res.status(201).json(mapMemberDocToApiResponse(newDoc));

    } catch (error: any) {
      console.error('Erro ao criar membro:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { ...body } = req.body;
      const docRef = db.collection('members').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: { message: 'Membro não encontrado' } });
      }

      // Validação de CPF único na atualização
      if (body.cpf && body.cpf !== doc.data()?.cpf) {
        const cpfSnapshot = await db.collection('members').where('cpf', '==', body.cpf).limit(1).get();
        if (!cpfSnapshot.empty && cpfSnapshot.docs[0].id !== id) {
          return res.status(409).json({ error: { message: 'CPF já pertence a outro membro' } });
        }
      }

      const updatedData = {
        ...body,
        situacao: body.situacao ? fromApiSituacao(body.situacao) : doc.data()?.situacao,
        atualizado_em: new Date(),
      };

      await docRef.update(updatedData);
      const updatedDoc = await docRef.get();

      res.json(mapMemberDocToApiResponse(updatedDoc));

    } catch (error: any) {
      console.error('Erro ao atualizar membro:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const docRef = db.collection('members').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: { message: 'Membro não encontrado' } });
      }

      // "Soft delete": apenas marca como inativo
      await docRef.update({
        situacao: 'INATIVO',
        atualizado_em: new Date(),
      });

      res.status(200).json({ message: 'Membro marcado como inativo com sucesso' });

    } catch (error: any) {
      console.error('Erro ao remover membro:', error);
      res.status(500).json({ error: { message: 'Erro interno do servidor', details: error.message } });
    }
  }
}
