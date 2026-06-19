/**
 * ============================================================================
 * LGPD-CONTROLADOR.TS (CORRIGIDO)
 * ============================================================================
 *
 * Controller para LGPD, agora utilizando Firestore como banco de dados.
 */

import { Request, Response } from 'express';
import { db } from '../database';
import { FieldValue } from 'firebase-admin/firestore';

export class LGPDController {

  /**
   * Busca a política de privacidade mais recente e ativa para uma unidade.
   */
  async getCurrentPolicy(req: Request, res: Response) {
    const { idUnidade, unitId } = req.query;
    const filtroUnidade = idUnidade || unitId as string;

    try {
      let query: FirebaseFirestore.Query = db.collection('lgpd_policies').where('esta_ativa', '==', true);

      if (filtroUnidade) {
        query = query.where('id_unidade', '==', filtroUnidade);
      }

      const snapshot = await query.orderBy('criado_em', 'desc').limit(1).get();

      if (snapshot.empty) {
        // Fallback para política padrão se não houver específica da unidade
        const fallbackSnapshot = await db.collection('lgpd_policies')
            .where('esta_ativa', '==', true)
            .where('id_unidade', '==', null) // Política global
            .orderBy('criado_em', 'desc').limit(1).get();
        
        if (fallbackSnapshot.empty) {
          return res.json(null); // Nenhuma política ativa encontrada
        }
        const doc = fallbackSnapshot.docs[0];
        return res.json({ id: doc.id, ...doc.data() });
      }
      
      const doc = snapshot.docs[0];
      res.json({ id: doc.id, ...doc.data() });

    } catch (error: any) {
      console.error('Erro ao buscar política LGPD:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }

  /**
   * Busca todos os consentimentos de um membro ou funcionário.
   */
  async getMemberConsents(req: Request, res: Response) {
    const { memberId, employeeId } = req.query;
    
    if (!memberId && !employeeId) {
        return res.status(400).json({ error: { message: 'ID do membro ou do funcionário é necessário' } });
    }

    try {
        let query: FirebaseFirestore.Query = db.collection('lgpd_consent_logs');

        if (memberId) {
            query = query.where('id_membro', '==', memberId as string);
        } else if (employeeId) {
            query = query.where('id_funcionario', '==', employeeId as string);
        }

        const snapshot = await query.orderBy('data_consentimento', 'desc').get();
        const consents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        res.json({ consents });

    } catch (error: any) {
      console.error('Erro ao buscar consentimentos:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }

  /**
   * Salva um novo registro de consentimento.
   */
  async saveConsent(req: Request, res: Response) {
    const { id_membro, id_funcionario, id_politica, tipo_consentimento, concedido } = req.body;

    if (!id_politica || concedido === undefined) {
        return res.status(400).json({ error: { message: 'ID da política e status do consentimento são obrigatórios' } });
    }

    try {
        // Busca a política para desnormalizar dados importantes (versão, título)
        const policyDoc = await db.collection('lgpd_policies').doc(id_politica).get();
        if (!policyDoc.exists) {
            return res.status(404).json({ error: { message: 'Política não encontrada' } });
        }
        const policyData = policyDoc.data()!;

        const consentData = {
            id_membro: id_membro || null,
            id_funcionario: id_funcionario || null,
            id_politica,
            versao_politica: policyData.versao,
            titulo_politica: policyData.titulo,
            tipo_consentimento: tipo_consentimento || 'geral',
            concedido: !!concedido,
            data_consentimento: FieldValue.serverTimestamp(),
            ip_address: req.ip,
            user_agent: req.headers['user-agent'] || null
        };

        const docRef = await db.collection('lgpd_consent_logs').add(consentData);
        res.status(201).json({ id: docRef.id, ...consentData });

    } catch (error: any) {
      console.error('Erro ao salvar consentimento:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }

  /**
   * Cria uma nova política de privacidade.
   */
  async savePolicy(req: Request, res: Response) {
    const { id_unidade, titulo, conteudo, versao } = req.body;

    if (!titulo || !conteudo || !versao) {
        return res.status(400).json({ error: { message: 'Título, conteúdo e versão são obrigatórios' } });
    }

    try {
      const policyData = {
        id_unidade: id_unidade || null,
        titulo,
        conteudo,
        versao,
        esta_ativa: true,
        criado_em: FieldValue.serverTimestamp(),
        atualizado_em: FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('lgpd_policies').add(policyData);

      // Opcional: Desativar políticas antigas para a mesma unidade
      if (id_unidade) {
        const oldPoliciesSnapshot = await db.collection('lgpd_policies')
          .where('id_unidade', '==', id_unidade)
          .where('esta_ativa', '==', true)
          .get();
        
        const batch = db.batch();
        oldPoliciesSnapshot.docs.forEach(doc => {
            if (doc.id !== docRef.id) { // Não desativa a que acabamos de criar
                batch.update(doc.ref, { esta_ativa: false, atualizado_em: FieldValue.serverTimestamp() });
            }
        });
        await batch.commit();
      }

      res.status(201).json({ id: docRef.id, ...policyData });

    } catch (error: any) {
      console.error('Erro ao salvar política LGPD:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }
}
