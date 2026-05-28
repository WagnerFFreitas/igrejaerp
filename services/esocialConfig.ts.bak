/**
 * ============================================================================
 * CONFIGURAÇÃO E GERENCIAMENTO ESOCIAL
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este service gerencia toda a configuração necessária para
 * comunicação com o eSocial, incluindo:
 * - Credenciais e certificados
 * - URLs de produção/homologação
 * - Versões do layout
 * - Parâmetros de conexão
 * 
 * AMBIENTES ESOCIAL:
 * ------------------
 * PRODUCAO:    https://portal.esocial.gov.br/servicos/webservice/producao
 * HOMOLOGACAO: https://portal.esocial.gov.br/servicos/webservice/homologacao
 * 
 * URLS ALTERNATIVAS:
 * - Desenvolvimento: localhost ou servidores de teste
 * - Staging: Ambiente de homologação interna
 * 
 * ANALOGIA:
 * ---------
 * Pense como um "painel de controle de conexão":
 * - Configura credenciais (certificado)
 * - Escolhe ambiente (produção/teste)
 * - Define versão do layout
 * - Gerencia timeouts e retries
 */

import { ESocialConfig, ESocialEnvironment } from '../types';

/**
 * URLs OFICIAIS DO ESOCIAL
 * ========================
 */
const ESOCIAL_URLS = {
  PRODUCAO: 'https://portal.esocial.gov.br/servicos/webservice/producao',
  HOMOLOGACAO: 'https://portal.esocial.gov.br/servicos/webservice/homologacao',
};

/**
 * VERSÕES SUPORTADAS
 * ==================
 */
const SUPPORTED_VERSIONS = ['S-1.0', 'S-1.1', 'S-1.2'] as const;

/**
 * CLASSE DE CONFIGURAÇÃO ESOCIAL
 * ==============================
 */
export class ESocialConfigManager {

  /**
   * OBTER CONFIGURAÇÃO PADRÃO
   * -------------------------
   * 
   * O QUE FAZ?
   * Cria configuração inicial para eSocial
   * 
   * PARÂMETROS:
   * - unitId: string
   * - cnpj: string
   * - environment?: ESocialEnvironment
   * 
   * RETORNO:
   * ESocialConfig → Configuração pronta
   */
  getDefaultConfig(
    unitId: string,
    cnpj: string,
    environment: ESocialEnvironment = 'HOMOLOGACAO'
  ): ESocialConfig {
    return {
      unitId,
      environment,
      cnpj,
      layoutVersion: 'S-1.2',
      productionUrl: ESOCIAL_URLS.PRODUCAO,
      homologationUrl: ESOCIAL_URLS.HOMOLOGACAO,
    };
  }

  /**
   * VALIDAR CONFIGURAÇÃO
   * --------------------
   * 
   * O QUE FAZ?
   * Verifica se configuração está completa e válida
   * 
   * PARÂMETRO:
   * - config: ESocialConfig
   * 
   * RETORNO:
   * { valid: boolean, errors: string[] }
   */
  validateConfig(config: ESocialConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // 1. Valida CNPJ
    if (!config.cnpj) {
      errors.push('CNPJ é obrigatório');
    } else if (!this.isValidCNPJ(config.cnpj)) {
      errors.push('CNPJ inválido');
    }
    
    // 2. Valida versão do layout
    if (!SUPPORTED_VERSIONS.includes(config.layoutVersion)) {
      errors.push(`Versão do layout deve ser uma de: ${SUPPORTED_VERSIONS.join(', ')}`);
    }
    
    // 3. Valida URLs
    if (config.environment === 'PRODUCAO' && !config.productionUrl) {
      errors.push('URL de produção é obrigatória para ambiente de produção');
    }
    
    if (config.environment === 'HOMOLOGACAO' && !config.homologationUrl) {
      errors.push('URL de homologação é obrigatória para ambiente de homologação');
    }
    
    // 4. Valida certificado (se necessário)
    if (config.environment === 'PRODUCAO' && !config.certificate) {
      errors.push('Certificado digital é obrigatório para produção');
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * OBTER URL DO WEB SERVICE
   * ------------------------
   * 
   * O QUE FAZ?
   * Retorna URL correta baseada no ambiente
   * 
   * PARÂMETRO:
   * - config: ESocialConfig
   * 
   * RETORNO:
   * string → URL do web service
   */
  getWebServiceUrl(config: ESocialConfig): string {
    if (config.environment === 'PRODUCAO') {
      return config.productionUrl || ESOCIAL_URLS.PRODUCAO;
    } else {
      return config.homologationUrl || ESOCIAL_URLS.HOMOLOGACAO;
    }
  }

  /**
   * OBTER NAMESPACE DO LAYOUT
   * -------------------------
   * 
   * O QUE FAZ?
   * Gera namespace XML baseado na versão
   * 
   * PARÂMETRO:
   * - version: string
   * 
   * RETORNO:
   * string → Namespace formatado
   */
  getLayoutNamespace(version: string): string {
    const versionNumber = version.replace('S-', '').replace('.', '_');
    return `http://www.esocial.gov.br/schema/evt/tabGeral/v${versionNumber}`;
  }

  /**
   * ATUALIZAR CONFIGURAÇÃO
   * ----------------------
   * 
   * O QUE FAZ?
   * Atualiza campos específicos da configuração
   * 
   * PARÂMETROS:
   * - config: ESocialConfig
   * - updates: Partial<ESocialConfig>
   * 
   * RETORNO:
   * ESocialConfig → Nova configuração atualizada
   */
  updateConfig(
    config: ESocialConfig,
    updates: Partial<ESocialConfig>
  ): ESocialConfig {
    const updated = { ...config, ...updates };
    
    // Atualiza timestamp
    updated.lastUpdate = new Date().toISOString();
    
    return updated;
  }

  /**
   * OBTER CABEÇALHO SOAP
   * --------------------
   * 
   * O QUE FAZ?
   * Gera cabeçalho SOAP para requisições
   * 
   * PARÂMETRO:
   * - config: ESocialConfig
   * 
   * RETORNO:
   * string → Header SOAP
   */
  getSOAPHeader(config: ESocialConfig): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:esocial="http://www.esocial.gov.br/schema/lote/eventos/envio/v_${config.layoutVersion.replace('.', '_')}">
  <soapenv:Header/>
  <soapenv:Body>
    <esocial:EnviarLoteEventos>
      <loteEventos>
        <!-- XMLs dos eventos aqui -->
      </loteEventos>
    </esocial:EnviarLoteEventos>
  </soapenv:Body>
</soapenv:Envelope>`;
  }

  /**
   * VALIDAR CNPJ
   * ------------
   */
  private isValidCNPJ(cnpj: string): boolean {
    // Remove caracteres não numéricos
    const clean = cnpj.replace(/\D/g, '');
    
    // Verifica tamanho
    if (clean.length !== 14) return false;
    
    // Verifica se todos dígitos são iguais
    if (/^(\d)\1+$/.test(clean)) return false;
    
    // Validação por módulo 11
    const calcDigit = (base: number) => {
      let sum = 0;
      let weight = 2;
      
      for (let i = base - 1; i >= 0; i--) {
        sum += parseInt(clean.charAt(i)) * weight;
        weight = weight === 9 ? 2 : weight + 1;
      }
      
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };
    
    const digit1 = calcDigit(12);
    const digit2 = calcDigit(13);
    
    return clean.charAt(12) === digit1.toString() && 
           clean.charAt(13) === digit2.toString();
  }

  /**
   * EXPORTAR CONFIGURAÇÃO PARA JSON
   * --------------------------------
   */
  exportToJSON(config: ESocialConfig): string {
    // Remove dados sensíveis
    const safeConfig = {
      ...config,
      certificate: undefined,
      certificatePassword: undefined,
      clientSecret: undefined,
    };
    
    return JSON.stringify(safeConfig, null, 2);
  }

  /**
   * IMPORTAR CONFIGURAÇÃO DE JSON
   * -----------------------------
   */
  importFromJSON(jsonString: string): ESocialConfig {
    try {
      const config = JSON.parse(jsonString);
      
      // Valida estrutura básica
      if (!config.unitId || !config.cnpj || !config.environment) {
        throw new Error('Configuração inválida');
      }
      
      return config as ESocialConfig;
    } catch (error: any) {
      throw new Error(`Erro ao importar configuração: ${error.message}`);
    }
  }

  /**
   * TESTAR CONEXÃO
   * --------------
   * 
   * O QUE FAZ?
   * Simula teste de conectividade com eSocial
   * 
   * PARÂMETRO:
   * - config: ESocialConfig
   * 
   * RETORNO:
   * Promise<{ success: boolean, message: string }>
   */
  async testConnection(config: ESocialConfig): Promise<{ success: boolean; message: string }> {
    try {
      const url = this.getWebServiceUrl(config);
      
      // Simulação (na prática faria uma requisição real)
      console.log(`Testando conexão com: ${url}`);
      
      return {
        success: true,
        message: `Conexão bem-sucedida com ambiente ${config.environment}`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro de conexão: ${error.message}`,
      };
    }
  }
}

/**
 * EXPORTAR INSTÂNCIA PRONTA
 * =========================
 */
export const esocialConfigManager = new ESocialConfigManager();
