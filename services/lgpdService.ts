/**
 * ============================================================================
 * LGPDSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para lgpd service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import apiClient from '../src/services/apiService';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (lgpd service).
 */

export default class LGPDService {
  static async consent(data: { 
    memberId?: string; 
    employeeId?: string; 
    policyId: string; 
    consentType: string; 
    granted: boolean; 
  }) {
    return apiClient.post('/lgpd/consent', data);
  }
  
  static async getConsents(memberId: string) {
    const response = await apiClient.get(`/lgpd/consents/${memberId}`) as any;
    return response?.consents || [];
  }

  static async getUserConsents(memberId: string, _unitId?: string) {
    return this.getConsents(memberId);
  }
  
  static async getCurrentPolicy(unitId: string) {
    return apiClient.get('/lgpd/policy', { unitId }) as any;
  }

  static async saveConsent(data: {
    memberId?: string;
    employeeId?: string;
    policyId?: string;
    consentType?: string;
    granted?: boolean;
    id?: string;
    userId?: string;
    userType?: string;
    dataProcessing?: boolean;
    communication?: boolean;
    marketing?: boolean;
    financial?: boolean;
  }) {
    if ('policyId' in data && data.policyId) {
      return this.consent({
        memberId: data.memberId,
        employeeId: data.employeeId,
        policyId: data.policyId,
        consentType: data.consentType || 'DATA_PROCESSING',
        granted: data.granted ?? true,
      });
    }

    return data;
  }

  static async generateConsentReport(unitId: string) {
    // Para simplificar agora, retorna os dados básicos
    // Futuramente pode ser um PDF gerado no backend
    return {
      unitId,
      timestamp: new Date().toISOString(),
      summary: "Relatório gerado via API"
    };
  }
}
