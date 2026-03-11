/**
 * ============================================================================
 * GERADOR DE XML PARA ESOCIAL
 * ============================================================================
 * 
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Este utilitário gera XMLs no padrão oficial do eSocial (layout S-1.2)
 * para todos os tipos de eventos.
 * 
 * ESTRUTURA DO XML ESOCIAL:
 * -------------------------
 * <?xml version="1.0" encoding="UTF-8"?>
 * <eSocial xmlns="http://www.esocial.gov.br/schema/...">
 *   <evtXXXX Id="ID_DO_EVENTO">
 *     <ideEvento>
 *       <tpAmb>1</tpAmb>           <!-- 1=Produção, 2=Homologação -->
 *       <procEmi>1</procEmi>       <!-- 1=Emissor próprio -->
 *       <verProc>1.0</verProc>     <!-- Versão do emissor -->
 *     </ideEvento>
 *     <ideEmpregador>
 *       <tpInsc>1</tpInsc>         <!-- 1=CNPJ -->
 *       <nrInsc>00.000.000/0000-00</nrInsc>
 *     </ideEmpregador>
 *     <!-- DADOS ESPECÍFICOS DO EVENTO -->
 *   </evtXXXX>
 * </eSocial>
 * 
 * ANALOGIA:
 * ---------
 * Pense como um "tradutor de idioma":
 * - Entrada: Dados em JavaScript (objetos)
 * - Saída: XML no padrão governo (texto estruturado)
 */

import { ESocialEvent, ESocialConfig, ESocialWorker } from '../types';

/**
 * VERSÃO DO LAYOUT ESOCIAL
 * ========================
 */
const LAYOUT_VERSION = 'S-1.2';
const NAMESPACE_BASE = 'http://www.esocial.gov.br/schema/evt';

/**
 * GERAR XML DE EVENTO S-1000 (INFORMAÇÕES DO EMPREGADOR)
 * -----------------------------------------------------
 * 
 * O QUE FAZ?
 * Cria XML com dados cadastrais da igreja/empresa
 * 
 * PARÂMETROS:
 * - config: ESocialConfig → Configuração
 * - cnpj: string
 * - razaoSocial: string
 * - nomeFantasia: string
 * 
 * RETORNO:
 * string → XML formatado
 */
export function generateS1000(
  config: ESocialConfig,
  cnpj: string,
  razaoSocial: string,
  nomeFantasia: string
): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="${NAMESPACE_BASE}/tabGeral/v_${LAYOUT_VERSION.replace('.', '_')}">
  <evtTabInfo id="ID${config.cnpj}${Date.now()}">
    <ideEvento>
      <tpAmb>${config.environment === 'PRODUCAO' ? '1' : '2'}</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${cnpj.replace(/\D/g, '')}</nrInsc>
    </ideEmpregador>
    <infoCadastro>
      <classTrib>99</classTrib>
      <indCoop>0</indCoop>
      <indConstr>0</indConstr>
      <indDesFolha>0</indDesFolha>
      <indOpcCP></indOpcCP>
      <indPorte>${razaoSocial.includes('IGREJA') ? '5' : '3'}</indPorte>
      <indOptRegEletron>${config.environment === 'PRODUCAO' ? '1' : '0'}</indOptRegEletron>
      <dadosIsencao>
        <ideMinLei>Lei 9.532/1997</ideMinLei>
        <nrCertif></nrCertif>
        <dtEmis></dtEmis>
        <dtVenc></dtVenc>
        <orgEmissor></orgEmissor>
      </dadosIsencao>
      <infoEntFed></infoEntFed>
    </infoCadastro>
  </evtTabInfo>
</eSocial>`;

  return formatXML(xml);
}

/**
 * GERAR XML DE EVENTO S-2110 (ADMISSÃO DE TRABALHADOR)
 * ---------------------------------------------------
 * 
 * O QUE FAZ?
 * Cria XML de admissão no padrão eSocial
 * 
 * PARÂMETROS:
 * - config: ESocialConfig
 * - worker: ESocialWorker
 * 
 * RETORNO:
 * string → XML formatado
 */
export function generateS2110(
  config: ESocialConfig,
  worker: ESocialWorker
): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="${NAMESPACE_BASE}/admissaoPrelim/v_${LAYOUT_VERSION.replace('.', '_')}">
  <evtAdmissaoPrelim id="ID${config.cnpj}${Date.now()}">
    <ideEvento>
      <tpAmb>${config.environment === 'PRODUCAO' ? '1' : '2'}</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${config.cnpj.replace(/\D/g, '')}</nrInsc>
    </ideEmpregador>
    <trabalhador>
      <cpf>${worker.cpf.replace(/\D/g, '')}</cpf>
      <nisTrab>${worker.nis}</nisTrab>
      <nmTrab>${worker.name}</nmTrab>
      <sexo>${getSexoFromCPF(worker.cpf)}</sexo>
      <racaCor></racaCor>
      <estCiv></estCiv>
      <grauInstr></grauInstr>
      <nascCid></nascCid>
      <paisNac>105</paisNac>
      <endExtNao></endExtNao>
      <endereco>
        <tpLograd>RUA</tpLograd>
        <dscLograd>${worker.address.street}</dscLograd>
        <nrLograd>${worker.address.number}</nrLograd>
        <bairro>${worker.address.neighborhood}</bairro>
        <cep>${worker.address.zipCode.replace(/\D/g, '')}</cep>
        <codMunic>${getCidadeIBGE(worker.address.city, worker.address.state)}</codMunic>
        <uf>${worker.address.state}</uf>
      </endereco>
    </trabalhador>
    <vinculo>
      <matricula>${worker.employeeId}</matricula>
      <codCateg>101</codCateg>
      <remuneracao>
        <vrSalFx>${worker.salary.toFixed(2)}</vrSalFx>
        <undSalFixo>6</undSalFixo>
      </remuneracao>
      <infoContrato>
        <codCargo>${worker.jobCode}</codCargo>
        <funcao>${worker.jobTitle}</funcao>
        <codFuncao></codFuncao>
        <natAtiv>
          <principal>
            <codAtivPrincipal>8841000</codAtivPrincipal>
          </principal>
        </natAtiv>
        <cboClass></cboClass>
      </infoContrato>
      <duracao>
        <tpContr>1</tpContr>
        <dtTerm></dtTerm>
      </duracao>
      <localTrabalho>
        <localTrabGeral>
          <tpInsc>1</tpInsc>
          <nrInsc>${config.cnpj.replace(/\D/g, '')}</nrInsc>
          <descComp></descComp>
        </localTrabGeral>
      </localTrabalho>
      <horContratual>
        <qtdhrsSem>${worker.workHours}</qtdhrsSem>
        <qtdhrsDia>${(worker.workHours / 5).toFixed(2)}</qtdhrsDia>
        <dscVarjCic></dscVarjCic>
        <horaEntrada></horaEntrada>
        <horaSaida></horaSaida>
      </horContratual>
      <filiacaoSind>
        <indOpcSind>3</indOpcSind>
      </filiacaoSind>
      <observacoes>
        <obs>
          <codObs></codObs>
          <valorObs>Admissão preliminar eSocial</valorObs>
        </obs>
      </observacoes>
    </vinculo>
  </evtAdmissaoPrelim>
</eSocial>`;

  return formatXML(xml);
}

/**
 * GERAR XML DE EVENTO S-1200 (REMUNERAÇÃO)
 * ----------------------------------------
 * 
 * O QUE FAZ?
 * Cria XML de remuneração mensal
 * 
 * PARÂMETROS:
 * - config: ESocialConfig
 * - employeeId: string
 * - matricula: string
 * - month: string (YYYY-MM)
 * - salary: number
 * - inss: number
 * - irrf: number
 * 
 * RETORNO:
 * string → XML formatado
 */
export function generateS1200(
  config: ESocialConfig,
  employeeId: string,
  matricula: string,
  month: string,
  salary: number,
  inss: number,
  irrf: number
): string {
  const [year, monthNum] = month.split('-');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="${NAMESPACE_BASE}/cdPagamto/v_${LAYOUT_VERSION.replace('.', '_')}">
  <evtCdPagamto id="ID${config.cnpj}${Date.now()}">
    <ideEvento>
      <indApuracao>1</indApuracao>
      <perApur>${month}</perApur>
      <dataPagto>${month}-30</dataPagto>
      <tpAmb>${config.environment === 'PRODUCAO' ? '1' : '2'}</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${config.cnpj.replace(/\D/g, '')}</nrInsc>
    </ideEmpregador>
    <ideBenef>
      <cpf>${employeeId.replace(/\D/g, '')}</cpf>
    </ideBenef>
    <infoPgto>
      <matricula>${matricula}</matricula>
      <indPPob></indPPob>
      <detRubr>
        <perRef>
          <matricula>${matricula}</matricula>
          <ideRDVrr>
            <vrRubr>${salary.toFixed(2)}</vrRubr>
          </ideRDVrr>
        </perRef>
        <codRubr>SALARIO</codRubr>
        <ideTabRubr>001</ideTabRubr>
        <qtdRubr>1</qtdRubr>
        <fatorRubr>1</fatorRubr>
        <vrUnit>1</vrUnit>
        <vrRubr>${salary.toFixed(2)}</vrRubr>
      </detRubr>
      <detRubr>
        <perRef>
          <matricula>${matricula}</matricula>
          <ideRDVrr>
            <vrRubr>${inss.toFixed(2)}</vrRubr>
          </ideRDVrr>
        </perRef>
        <codRubr>INSS</codRubr>
        <ideTabRubr>002</ideTabRubr>
        <qtdRubr>1</qtdRubr>
        <fatorRubr>1</fatorRubr>
        <vrUnit>1</vrUnit>
        <vrRubr>${inss.toFixed(2)}</vrRubr>
      </detRubr>
      ${irrf > 0 ? `
      <detRubr>
        <perRef>
          <matricula>${matricula}</matricula>
          <ideRDVrr>
            <vrRubr>${irrf.toFixed(2)}</vrRubr>
          </ideRDVrr>
        </perRef>
        <codRubr>IRRF</codRubr>
        <ideTabRubr>003</ideTabRubr>
        <qtdRubr>1</qtdRubr>
        <fatorRubr>1</fatorRubr>
        <vrUnit>1</vrUnit>
        <vrRubr>${irrf.toFixed(2)}</vrRubr>
      </detRubr>` : ''}
    </infoPgto>
  </evtCdPagamto>
</eSocial>`;

  return formatXML(xml);
}

/**
 * GERAR XML DE EVENTO S-2130 (DESLIGAMENTO)
 * -----------------------------------------
 */
export function generateS2130(
  config: ESocialConfig,
  employeeId: string,
  terminationDate: string,
  terminationCode: string
): string {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="${NAMESPACE_BASE}/deslig/v_${LAYOUT_VERSION.replace('.', '_')}">
  <evtDeslig id="ID${config.cnpj}${Date.now()}">
    <ideEvento>
      <tpAmb>${config.environment === 'PRODUCAO' ? '1' : '2'}</tpAmb>
      <procEmi>1</procEmi>
      <verProc>1.0.0</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>1</tpInsc>
      <nrInsc>${config.cnpj.replace(/\D/g, '')}</nrInsc>
    </ideEmpregador>
    <infoDeslig>
      <cpf>${employeeId.replace(/\D/g, '')}</cpf>
      <matricula>${employeeId}</matricula>
      <dtDeslig>${terminationDate}</dtDeslig>
      <codCateg>101</codCateg>
      <mtvDeslig>
        <semJustificativa>S</semJustificativa>
      </mtvDeslig>
      <sucessaoVitima></sucessaoVitima>
      <trabSubstituido></trabSubstituido>
    </infoDeslig>
  </evtDeslig>
</eSocial>`;

  return formatXML(xml);
}

/**
 * FORMATAR XML
 * ------------
 * 
 * O QUE FAZ?
 * Aplica indentação ao XML para facilitar leitura
 * 
 * PARÂMETRO:
 * - xml: string
 * 
 * RETORNO:
 * string → XML formatado
 */
function formatXML(xml: string): string {
  // Remove espaços extras
  let formatted = xml.trim();
  
  // Adiciona quebras de linha e indentação
  formatted = formatted.replace(/></g, '>\n<');
  
  // Indenta tags filhas
  const lines = formatted.split('\n');
  let indentLevel = 0;
  const indentedLines: string[] = [];
  
  for (const line of lines) {
    if (line.trim().startsWith('</')) {
      indentLevel--;
    }
    
    indentedLines.push('  '.repeat(Math.max(0, indentLevel)) + line.trim());
    
    if (line.trim().startsWith('<') && !line.trim().startsWith('</') && !line.trim().endsWith('/>')) {
      indentLevel++;
    }
  }
  
  return indentedLines.join('\n');
}

/**
 * OBTER SEXO DO CPF
 * -----------------
 */
function getSexoFromCPF(cpf: string): 'M' | 'F' {
  // Simplificação: CPF termina com número par = feminino
  const lastDigit = parseInt(cpf.charAt(cpf.length - 2));
  return lastDigit % 2 === 0 ? 'F' : 'M';
}

/**
 * OBTER CÓDIGO IBGE DA CIDADE
 * ---------------------------
 */
function getCidadeIBGE(city: string, state: string): string {
  // Tabela simplificada - na prática precisaria de uma base completa
  const cidades: Record<string, Record<string, string>> = {
    'SP': {
      'SAO PAULO': '3550308',
      'CAMPINAS': '3509502',
    },
    'RJ': {
      'RIO DE JANEIRO': '3304557',
    },
    'MG': {
      'BELO HORIZONTE': '3106200',
    },
  };
  
  const cityUpper = city.toUpperCase();
  return cidades[state]?.[cityUpper] || '0000000';
}

/**
 * VALIDAR XML GERADO
 * ------------------
 */
export function validateGeneratedXML(xml: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validações básicas
  if (!xml.includes('<?xml')) {
    errors.push('XML não começa com declaração <?xml>');
  }
  
  if (!xml.includes('<eSocial')) {
    errors.push('XML não contém tag raiz <eSocial>');
  }
  
  if (!xml.includes('xmlns=')) {
    errors.push('XML não contém namespace do eSocial');
  }
  
  // Verifica se fecha todas as tags
  const openTags = (xml.match(/<[a-zA-Z][^>]*>/g) || []).length;
  const closeTags = (xml.match(/<\/[a-zA-Z][^>]*>/g) || []).length;
  const selfClosing = (xml.match(/<[^>]*\/>/g) || []).length;
  
  if (openTags !== closeTags + selfClosing) {
    errors.push(`XML desbalanceado: ${openTags} tags abertas, ${closeTags} fechadas, ${selfClosing} auto-fechadas`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
