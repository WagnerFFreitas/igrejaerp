/**
 * ============================================================================
 * CRYPTOSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para crypto service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

// Serviço de Criptografia para Backup e Dados Sensíveis

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (crypto service).
 */

export class CryptoService {
  // Mascara CPF mantendo apenas os primeiros 3 e últimos 2 dígitos
  static maskCPF(cpf: string): string {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2');
  }

  // Mascara telefone mantendo DDD e formato
  static maskPhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/(\(\d{2}\))\s*(\d{5})-(\d{4})/, '($1) *****-$3');
  }

  // Mascara celular mantendo DDD e formato
  static maskCellphone(celular: string): string {
    if (!celular) return '';
    return celular.replace(/(\(\d{2}\))\s*(\d{5})-(\d{4})/, '($1) *****-$3');
  }

  // Mascara email mantendo domínio básico
  static maskEmail(email: string): string {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (!domain) return '***@***.***';
    
    // Manter primeira letra do username e 2 primeiras letras do domínio
    const maskedUsername = username.charAt(0) + '***';
    const [domainName, domainExt] = domain.split('.');
    const maskedDomain = domainName ? domainName.substring(0, 2) + '***' : '***';
    
    return `${maskedUsername}@${maskedDomain}.${domainExt || '***'}`;
  }

  // Mascara CNPJ mantendo apenas os primeiros 2 e últimos 2 dígitos
  static maskCNPJ(cnpj: string): string {
    if (!cnpj) return '';
    return cnpj.replace(/(\d{2})\.*(\d{3})\.*(\d{3})\/(\d{4})-(\d{2})/, '$1.***.***/****-$5');
  }

  // Mascara RG completamente (muito sensível)
  static maskRG(rg: string): string {
    if (!rg) return '';
    return '***.***.**-**';
  }

  // Mascara PIS completamente
  static maskPIS(pis: string): string {
    if (!pis) return '';
    return '***.*****.**-*';
  }

  // Mascara CTPS mantendo apenas formato básico
  static maskCTPS(ctps: string): string {
    if (!ctps) return '';
    return '*****/*****';
  }

  // Mascara dados bancários
  static maskBankData(bank: string, agency: string, account: string): {
    bank?: string;
    agency?: string;
    account?: string;
  } {
    return {
      bank: bank ? bank.substring(0, 3) + '***' : undefined,
      agency: agency ? agency.replace(/(\d{3})-(\d)/, '$1-*') : undefined,
      account: account ? account.replace(/(\d{1,})-(\d)/, (match, p1, p2) => {
        const masked = p1.substring(0, Math.max(1, p1.length - 3)) + '***';
        return masked + '-' + p2;
      }) : undefined
    };
  }

  // Mascara chave PIX
  static maskPixKey(pixKey: string): string {
    if (!pixKey) return '';
    
    // Se for CPF
    if (/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(pixKey)) {
      return this.maskCPF(pixKey);
    }
    
    // Se for CNPJ
    if (/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(pixKey)) {
      return this.maskCNPJ(pixKey);
    }
    
    // Se for telefone
    if (/^\(\d{2}\)\s*\d{5}-\d{4}$/.test(pixKey)) {
      return this.maskPhone(pixKey);
    }
    
    // Se for email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixKey)) {
      return this.maskEmail(pixKey);
    }
    
    // Se for chave aleatória (UUID)
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pixKey)) {
      return pixKey.replace(/([0-9a-f]{4})-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-([0-9a-f]{4})/i, '$1-****-****-****-$2');
    }
    
    // Para outros formatos, mascarar parcialmente
    if (pixKey.length > 8) {
      return pixKey.substring(0, 4) + '***' + pixKey.substring(pixKey.length - 4);
    }
    
    return '***';
  }

  // Mascara valor monetário (mantém apenas se é > 0)
  static maskMonetaryValue(value: number | string): string {
    if (!value || value === 0) return '0.00';
    return '***.**';
  }

  // Remove todos os dados sensíveis de um objeto membro
  static sanitizeMember(member: any): any {
    return {
      ...member,
      cpf: this.maskCPF(member.cpf),
      rg: this.maskRG(member.rg),
      email: this.maskEmail(member.email),
      phone: this.maskPhone(member.phone),
      celular: this.maskCellphone(member.celular),
      // Mantém dados não sensíveis
      name: member.name,
      id: member.id,
      unitId: member.unitId,
      situacao: member.situacao,
      cargo_igreja: member.cargo_igreja,
      ministerio: member.ministerio,
      data_nascimento: member.data_nascimento,
      estado_civil: member.estado_civil,
      avatar: member.avatar // Pode ser base64, não é sensível
    };
  }

  // Remove todos os dados sensíveis de um objeto funcionário
  static sanitizeEmployee(employee: any): any {
    const bankData = this.maskBankData(employee.banco, employee.agencia, employee.conta);
    
    return {
      ...employee,
      cpf: this.maskCPF(employee.cpf),
      rg: this.maskRG(employee.rg),
      ctps: this.maskCTPS(employee.ctps),
      pis: this.maskPIS(employee.pis),
      email: this.maskEmail(employee.email),
      phone: this.maskPhone(employee.phone),
      celular: this.maskCellphone(employee.celular),
      // Dados bancários mascarados
      banco: bankData.bank,
      agencia: bankData.agency,
      conta: bankData.account,
      chave_pix: this.maskPixKey(employee.chave_pix),
      // Salário mascarado
      salario_base: this.maskMonetaryValue(employee.salario_base),
      // Mantém dados não sensíveis
      employee_name: employee.employee_name,
      id: employee.id,
      unitId: employee.unitId,
      cargo: employee.cargo,
      funcao: employee.funcao,
      departamento: employee.departamento,
      data_admissao: employee.data_admissao,
      tipo_contrato: employee.tipo_contrato,
      is_active: employee.is_active
    };
  }

  // Remove dados sensíveis de transações
  static sanitizeTransaction(transaction: any): any {
    return {
      ...transaction,
      provider_cnpj: this.maskCNPJ(transaction.provider_cnpj),
      provider_phone: this.maskPhone(transaction.provider_phone),
      // Mantém dados não sensíveis
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
      status: transaction.status,
      category_id: transaction.category_id,
      payment_method: transaction.payment_method
    };
  }

  // Remove dados sensíveis de folha de pagamento
  static sanitizePayroll(payroll: any): any {
    return {
      ...payroll,
      cpf: this.maskCPF(payroll.cpf),
      rg: this.maskRG(payroll.rg),
      pis: this.maskPIS(payroll.pis),
      ctps: this.maskCTPS(payroll.ctps),
      email: this.maskEmail(payroll.email),
      phone: this.maskPhone(payroll.phone),
      // Salário e valores financeiros mascarados
      salario_base: this.maskMonetaryValue(payroll.salario_base),
      comissoes: this.maskMonetaryValue(payroll.comissoes),
      gratificacoes: this.maskMonetaryValue(payroll.gratificacoes),
      premios: this.maskMonetaryValue(payroll.premios),
      auxilio_moradia: this.maskMonetaryValue(payroll.auxilio_moradia),
      salario_familia: this.maskMonetaryValue(payroll.salario_familia),
      // Mantém dados não sensíveis
      id: payroll.id,
      unitId: payroll.unitId,
      employeeName: payroll.employeeName,
      matricula: payroll.matricula,
      cargo: payroll.cargo,
      departamento: payroll.departamento,
      data_admissao: payroll.data_admissao
    };
  }

  // Gera hash simples para verificação de integridade
  static generateHash(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  // Verifica integridade dos dados
  static verifyIntegrity(data: any, expectedHash: string): boolean {
    const currentHash = this.generateHash(data);
    return currentHash === expectedHash;
  }
}

export default CryptoService;
