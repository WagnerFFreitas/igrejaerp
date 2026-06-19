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

import apiClient from './apiService';

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
    concedido: boolean; 
  }) {
    return apiClient.post('/lgpd/consentimentos', data);
  }
  
  static async getConsents(memberId: string) {
    const response = await apiClient.get(`/lgpd/consentimentos/${memberId}`) as any;
    return response?.consents || [];
  }

  static async getUserConsents(memberId: string, _unitId?: string) {
    return this.getConsents(memberId);
  }
  
  static async getCurrentPolicy(unitId?: string) {
    // Normalizar unitId (converter u-sede para UUID se necessário)
    let normalizedUnitId = unitId;
    if (!unitId || unitId === 'undefined') {
      console.warn('⚠️ LGPDService.getCurrentPolicy: unitId inválido, usando padrão');
      return { version: '1.0', title: 'Política Padrão', isActive: true };
    }
    
    // Mapear aliases para UUIDs
    const UNIT_ALIASES: Record<string, string> = {
      'u-sede': '00000000-0000-0000-0000-000000000001',
      'u-matriz': '00000000-0000-0000-0000-000000000001',
    };
    
    const idToUse = UNIT_ALIASES[normalizedUnitId] || normalizedUnitId;
    
    return apiClient.get('/lgpd/politicas', { unitId: idToUse }) as any;
  }

  static async saveConsent(data: {
    memberId?: string;
    employeeId?: string;
    policyId?: string;
    consentType?: string;
    concedido?: boolean;
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
        concedido: data.concedido ?? true,
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
