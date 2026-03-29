import { LGPDConsent, LGPDConsentHistory, LGPDPolicy } from '../types';

class LGPDService {
  private static readonly STORAGE_KEYS = {
    CONSENTS: 'lgpd_consents',
    POLICIES: 'lgpd_policies',
    HISTORY: 'lgpd_history',
    CURRENT_POLICY: 'lgpd_current_policy'
  };

  /**
   * Salvar consentimento LGPD
   */
  static async saveConsent(consent: LGPDConsent): Promise<void> {
    try {
      // Obter consentimentos existentes
      const existingConsents = await this.getConsents(consent.unitId);
      
      // Verificar se já existe consentimento do mesmo tipo para o mesmo usuário
      const existingIndex = existingConsents.findIndex(
        c => c.userId === consent.userId && 
             c.consentType === consent.consentType &&
             c.unitId === consent.unitId
      );

      if (existingIndex >= 0) {
        // Atualizar consentimento existente
        existingConsents[existingIndex] = {
          ...consent,
          updatedAt: new Date().toISOString()
        };
      } else {
        // Adicionar novo consentimento
        existingConsents.push(consent);
      }

      // Salvar no IndexedDB
      await this.saveToStorage(this.STORAGE_KEYS.CONSENTS, existingConsents);

      // Registrar no histórico
      await this.addToHistory({
        id: `HIST_${Date.now()}`,
        consentId: consent.id,
        action: consent.granted ? 'GRANTED' : 'REVOKED',
        actionDate: new Date().toISOString(),
        ipAddress: consent.ipAddress,
        userAgent: consent.userAgent,
        details: `Consentimento ${consent.granted ? 'concedido' : 'revogado'} para ${consent.consentType}`,
        unitId: consent.unitId,
        createdAt: new Date().toISOString()
      });

      console.log('✅ Consentimento LGPD salvo:', consent);
    } catch (error) {
      console.error('❌ Erro ao salvar consentimento LGPD:', error);
      throw error;
    }
  }

  /**
   * Obter todos os consentimentos de uma unidade
   */
  static async getConsents(unitId: string): Promise<LGPDConsent[]> {
    try {
      const consents = await this.getFromStorage(this.STORAGE_KEYS.CONSENTS) || [];
      return consents.filter((c: LGPDConsent) => c.unitId === unitId);
    } catch (error) {
      console.error('❌ Erro ao obter consentimentos:', error);
      return [];
    }
  }

  /**
   * Obter consentimentos de um usuário específico
   */
  static async getUserConsents(userId: string, unitId: string): Promise<LGPDConsent[]> {
    try {
      const consents = await this.getConsents(unitId);
      return consents.filter(c => c.userId === userId);
    } catch (error) {
      console.error('❌ Erro ao obter consentimentos do usuário:', error);
      return [];
    }
  }

  /**
   * Verificar se usuário tem consentimento específico
   */
  static async hasConsent(
    userId: string, 
    consentType: LGPDConsent['consentType'], 
    unitId: string
  ): Promise<boolean> {
    try {
      const userConsents = await this.getUserConsents(userId, unitId);
      const consent = userConsents.find(c => c.consentType === consentType);
      return consent?.granted || false;
    } catch (error) {
      console.error('❌ Erro ao verificar consentimento:', error);
      return false;
    }
  }

  /**
   * Revogar consentimento
   */
  static async revokeConsent(
    consentId: string, 
    reason: string, 
    unitId: string
  ): Promise<void> {
    try {
      const consents = await this.getConsents(unitId);
      const consentIndex = consents.findIndex(c => c.id === consentId);
      
      if (consentIndex >= 0) {
        const consent = consents[consentIndex];
        
        // Atualizar consentimento
        consents[consentIndex] = {
          ...consent,
          granted: false,
          revokedDate: new Date().toISOString(),
          revokedReason: reason,
          updatedAt: new Date().toISOString()
        };

        // Salvar alterações
        await this.saveToStorage(this.STORAGE_KEYS.CONSENTS, consents);

        // Registrar no histórico
        await this.addToHistory({
          id: `HIST_${Date.now()}`,
          consentId: consent.id,
          action: 'REVOKED',
          actionDate: new Date().toISOString(),
          ipAddress: await this.getClientIP(),
          userAgent: navigator.userAgent,
          details: `Consentimento revogado: ${reason}`,
          unitId: consent.unitId,
          createdAt: new Date().toISOString()
        });

        console.log('✅ Consentimento revogado:', consentId);
      }
    } catch (error) {
      console.error('❌ Erro ao revogar consentimento:', error);
      throw error;
    }
  }

  /**
   * Salvar política de privacidade
   */
  static async savePolicy(policy: LGPDPolicy): Promise<void> {
    try {
      const policies = await this.getPolicies(policy.unitId);
      
      // Desativar políticas anteriores
      const updatedPolicies = policies.map(p => ({
        ...p,
        isActive: false
      }));

      // Adicionar nova política
      updatedPolicies.push(policy);

      await this.saveToStorage(this.STORAGE_KEYS.POLICIES, updatedPolicies);
      
      // Definir como política atual
      await this.saveToStorage(this.STORAGE_KEYS.CURRENT_POLICY, {
        version: policy.version,
        unitId: policy.unitId
      });

      console.log('✅ Política de privacidade salva:', policy);
    } catch (error) {
      console.error('❌ Erro ao salvar política:', error);
      throw error;
    }
  }

  /**
   * Obter políticas de uma unidade
   */
  static async getPolicies(unitId: string): Promise<LGPDPolicy[]> {
    try {
      const policies = await this.getFromStorage(this.STORAGE_KEYS.POLICIES) || [];
      return policies.filter((p: LGPDPolicy) => p.unitId === unitId);
    } catch (error) {
      console.error('❌ Erro ao obter políticas:', error);
      return [];
    }
  }

  /**
   * Obter política atual de uma unidade
   */
  static async getCurrentPolicy(unitId: string): Promise<LGPDPolicy | null> {
    try {
      const policies = await this.getPolicies(unitId);
      const currentPolicyRef = await this.getFromStorage(this.STORAGE_KEYS.CURRENT_POLICY);
      
      if (currentPolicyRef && currentPolicyRef.unitId === unitId) {
        return policies.find(p => p.version === currentPolicyRef.version && p.isActive) || null;
      }
      
      // Retornar política mais recente ativa
      const activePolicies = policies.filter(p => p.isActive);
      return activePolicies.sort((a, b) => 
        new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
      )[0] || null;
    } catch (error) {
      console.error('❌ Erro ao obter política atual:', error);
      return null;
    }
  }

  /**
   * Obter histórico de consentimentos
   */
  static async getHistory(unitId: string): Promise<LGPDConsentHistory[]> {
    try {
      const history = await this.getFromStorage(this.STORAGE_KEYS.HISTORY) || [];
      return history.filter((h: LGPDConsentHistory) => h.unitId === unitId);
    } catch (error) {
      console.error('❌ Erro ao obter histórico:', error);
      return [];
    }
  }

  /**
   * Gerar relatório de consentimentos
   */
  static async generateConsentReport(unitId: string): Promise<{
    totalUsers: number;
    totalConsents: number;
    consentsByType: Record<string, number>;
    consentsByStatus: Record<string, number>;
    recentActivity: LGPDConsentHistory[];
  }> {
    try {
      const consents = await this.getConsents(unitId);
      const history = await this.getHistory(unitId);
      
      const uniqueUsers = new Set(consents.map(c => c.userId));
      const consentsByType: Record<string, number> = {};
      const consentsByStatus: Record<string, number> = {
        granted: 0,
        revoked: 0
      };

      // Agrupar por tipo
      consents.forEach(consent => {
        consentsByType[consent.consentType] = (consentsByType[consent.consentType] || 0) + 1;
        if (consent.granted) {
          consentsByStatus.granted++;
        } else {
          consentsByStatus.revoked++;
        }
      });

      // Atividade recente (últimos 7 dias)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentActivity = history.filter(h => 
        new Date(h.actionDate) >= sevenDaysAgo
      ).sort((a, b) => 
        new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime()
      ).slice(0, 10);

      return {
        totalUsers: uniqueUsers.size,
        totalConsents: consents.length,
        consentsByType,
        consentsByStatus,
        recentActivity
      };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório:', error);
      throw error;
    }
  }

  /**
   * Exportar dados de um usuário (LGPD - Direito de Portabilidade)
   */
  static async exportUserData(userId: string, unitId: string): Promise<{
    userConsents: LGPDConsent[];
    userHistory: LGPDConsentHistory[];
    exportDate: string;
  }> {
    try {
      const userConsents = await this.getUserConsents(userId, unitId);
      const allHistory = await this.getHistory(unitId);
      const userHistory = allHistory.filter(h => {
        const consent = userConsents.find(c => c.id === h.consentId);
        return consent;
      });

      return {
        userConsents,
        userHistory,
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erro ao exportar dados do usuário:', error);
      throw error;
    }
  }

  /**
   * Limpar dados de um usuário (LGPD - Direito ao Esquecimento)
   */
  static async deleteUserData(userId: string, unitId: string, reason: string): Promise<void> {
    try {
      // Obter consentimentos atuais
      const consents = await this.getConsents(unitId);
      const userConsents = consents.filter(c => c.userId === userId);

      // Revogar todos os consentimentos
      for (const consent of userConsents) {
        await this.revokeConsent(consent.id, `Exclusão de dados: ${reason}`, unitId);
      }

      // Registrar exclusão no histórico
      await this.addToHistory({
        id: `HIST_${Date.now()}`,
        consentId: '',
        action: 'REVOKED',
        actionDate: new Date().toISOString(),
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        details: `Todos os dados do usuário ${userId} foram excluídos: ${reason}`,
        unitId: unitId,
        createdAt: new Date().toISOString()
      });

      console.log('✅ Dados do usuário excluídos:', userId);
    } catch (error) {
      console.error('❌ Erro ao excluir dados do usuário:', error);
      throw error;
    }
  }

  /**
   * Adicionar entrada ao histórico
   */
  private static async addToHistory(entry: LGPDConsentHistory): Promise<void> {
    try {
      const history = await this.getFromStorage(this.STORAGE_KEYS.HISTORY) || [];
      history.push(entry);
      
      // Manter apenas últimos 1000 registros
      if (history.length > 1000) {
        history.splice(0, history.length - 1000);
      }
      
      await this.saveToStorage(this.STORAGE_KEYS.HISTORY, history);
    } catch (error) {
      console.error('❌ Erro ao adicionar ao histórico:', error);
    }
  }

  /**
   * Obter IP do cliente
   */
  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '0.0.0.0';
    }
  }

  /**
   * Salvar no IndexedDB
   */
  /**
   * Salvar no IndexedDB (Centralizado)
   */
  private static async saveToStorage(key: string, data: any): Promise<void> {
    try {
      const IndexedDBService = (await import('../src/services/indexedDBService')).default;
      await IndexedDBService.save('lgpd_data', { key, data, timestamp: Date.now() });
    } catch (error) {
      console.error('❌ Erro ao salvar no storage:', error);
      // Fallback para localStorage em caso de erro crítico
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  /**
   * Obter do IndexedDB
   */
  /**
   * Obter do IndexedDB (Centralizado)
   */
  private static async getFromStorage(key: string): Promise<any> {
    try {
      const IndexedDBService = (await import('../src/services/indexedDBService')).default;
      const result = await IndexedDBService.get('lgpd_data', key);
      return result?.data || null;
    } catch (error) {
      console.error('❌ Erro ao obter do storage:', error);
      // Fallback para localStorage
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  }
}

export default LGPDService;
