import { dbService } from '../../services/databaseService';
import { Member, Payroll } from '../../types';

export const DataInitializer = {
  async initializeData(unitId: string) {
    try {
      const members = await dbService.getMembers(unitId);
      const employees = await dbService.getEmployees(unitId);

      if (members.length === 0) {
        console.log('🚀 Inicializando dados de membros...');
        const membersToCreate: any[] = [
          {
            unitId,
            name: 'Carlos Alberto Silva',
            cpf: '123.456.789-01',
            rg: 'MG-12.345.678',
            email: 'carlos.alberto@email.com',
            phone: '(31) 98765-4321',
            whatsapp: '(31) 98765-4321',
            profession: 'Engenheiro',
            role: 'LEADER',
            status: 'ACTIVE',
            matricula: 'M01/2026',
            fatherName: 'José Silva',
            motherName: 'Maria Silva',
            bloodType: 'O+',
            emergencyContact: '(31) 91234-5678',
            churchOfOrigin: 'Igreja Batista Central',
            mainMinistry: 'Conselho',
            ministryRole: 'Presidente',
            ecclesiasticalPosition: 'Pastor',
            birthDate: '1975-05-20',
            gender: 'M',
            maritalStatus: 'MARRIED',
            address: {
              zipCode: '30123-456',
              street: 'Avenida Principal',
              number: '1000',
              neighborhood: 'Centro',
              city: 'Belo Horizonte',
              state: 'MG'
            },
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
          },
          {
            unitId,
            name: 'Ana Paula Oliveira',
            cpf: '234.567.890-12',
            rg: 'SP-23.456.789',
            email: 'ana.paula@email.com',
            phone: '(11) 91234-5678',
            whatsapp: '(11) 91234-5678',
            profession: 'Advogada',
            role: 'STAFF',
            status: 'ACTIVE',
            matricula: 'M02/2026',
            fatherName: 'Pedro Oliveira',
            motherName: 'Lucia Oliveira',
            bloodType: 'A+',
            emergencyContact: '(11) 98765-4321',
            churchOfOrigin: 'Igreja Assembleia de Deus',
            mainMinistry: 'Secretaria',
            ministryRole: 'Secretária',
            ecclesiasticalPosition: 'Membro',
            birthDate: '1988-10-12',
            gender: 'F',
            maritalStatus: 'SINGLE',
            address: {
              zipCode: '01001-000',
              street: 'Praça da Sé',
              number: '1',
              neighborhood: 'Sé',
              city: 'São Paulo',
              state: 'SP'
            },
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana'
          }
        ];
        await Promise.all(membersToCreate.map(m => dbService.saveMember(m)));
      } else {
        // Verificar e corrigir "N/A" em membros existentes
        console.log('🔍 Verificando "N/A" em membros existentes...');
        for (const member of members) {
          let needsUpdate = false;
          const updatedMember = { ...member };
          
          // Garantir matrícula
          if (!updatedMember.matricula) {
            const year = updatedMember.membershipDate ? new Date(updatedMember.membershipDate).getFullYear() : 2026;
            const index = members.indexOf(member) + 1;
            updatedMember.matricula = `M${index.toString().padStart(2, '0')}/${year}`;
            needsUpdate = true;
          }

          const fields = Object.keys(updatedMember) as (keyof Member)[];
          for (const field of fields) {
            const value = updatedMember[field];
            if (value === 'N/A' || value === '' || value === null || value === undefined) {
              const realisticValue = this.getRealisticValue(field as string);
              if (realisticValue !== 'Informação Realista') {
                (updatedMember as any)[field] = realisticValue;
                needsUpdate = true;
              }
            }
          }

          if (updatedMember.address && typeof updatedMember.address === 'object') {
            const addrFields = Object.keys(updatedMember.address) as (keyof typeof updatedMember.address)[];
            for (const f of addrFields) {
              const val = updatedMember.address[f];
              if (val === 'N/A' || val === '' || val === null || val === undefined) {
                (updatedMember.address as any)[f] = this.getRealisticValue(f as string);
                needsUpdate = true;
              }
            }
          }

          if (needsUpdate) {
            await dbService.saveMember(updatedMember);
          }
        }
      }

      if (employees.length === 0) {
        console.log('🚀 Inicializando dados de funcionários...');
        const employeesToCreate: any[] = [
          {
            unitId,
            matricula: 'F01/2026',
            employeeName: 'Carlos Alberto Silva',
            cpf: '123.456.789-01',
            rg: 'MG-12.345.678',
            pis: '123.45678.90-1',
            ctps: '12345678901',
            cargo: 'Pastor Presidente',
            funcao: 'Pastor',
            departamento: 'Pastoral',
            cbo: '1234',
            data_admissao: '2010-01-01',
            birthDate: '1975-05-20',
            tipo_contrato: 'CLT',
            jornada_trabalho: '40h',
            regime_trabalho: 'PRESENCIAL',
            salario_base: 8500,
            tipo_salario: 'MENSAL',
            he50_qtd: 0,
            he100_qtd: 0,
            dsr_ativo: true,
            adic_noturno_qtd: 0,
            insalubridade_grau: 'NONE',
            periculosidade_ativo: false,
            comissoes: 0,
            gratificacoes: 0,
            premios: 0,
            ats_percentual: 0,
            auxilio_moradia: 0,
            arredondamento: 0,
            dependentes_qtd: 0,
            is_pcd: false,
            tipo_deficiencia: 'Nenhuma',
            banco: 'Banco do Brasil',
            codigo_banco: '001',
            agencia: '1234',
            conta: '12345-6',
            tipo_conta: 'CORRENTE',
            titular: 'Carlos Alberto Silva',
            chave_pix: 'carlos.alberto@email.com',
            vt_ativo: false,
            vale_transporte_total: 0,
            va_ativo: false,
            vale_alimentacao: 0,
            vr_ativo: false,
            vale_refeicao: 0,
            ps_ativo: false,
            plano_saude_colaborador: 0,
            po_ativo: false,
            plano_saude_dependentes: 0,
            vale_farmacia: 0,
            seguro_vida: 0,
            faltas: 0,
            atrasos: 0,
            adiantamento: 0,
            pensao_alimenticia: 0,
            consignado: 0,
            outros_descontos: 0,
            coparticipacoes: 0,
            inss: 0,
            fgts_retido: 0,
            irrf: 0,
            fgts_patronal: 0,
            inss_patronal: 0,
            rat: 0,
            terceiros: 0,
            month: '3',
            year: '2024',
            total_proventos: 0,
            total_descontos: 0,
            salario_liquido: 0,
            status: 'ACTIVE',
            address: {
              zipCode: '30123-456',
              street: 'Avenida Principal',
              number: '1000',
              neighborhood: 'Centro',
              city: 'Belo Horizonte',
              state: 'MG'
            }
          }
        ];
        await Promise.all(employeesToCreate.map(e => dbService.saveEmployee(e)));
      } else {
        // Verificar e corrigir "N/A" em funcionários existentes
        console.log('🔍 Verificando e preenchendo campos em funcionários existentes...');
        const essentialFields = [
          'matricula', 'employeeName', 'cpf', 'rg', 'pis', 'ctps', 'birthDate',
          'cargo', 'funcao', 'departamento', 'cbo', 'data_admissao', 'tipo_contrato',
          'jornada_trabalho', 'regime_trabalho', 'salario_base', 'tipo_salario',
          'banco', 'codigo_banco', 'agencia', 'conta', 'tipo_conta', 'titular', 'chave_pix',
          'sexo', 'estado_civil', 'nacionalidade', 'naturalidade', 'escolaridade',
          'raca_cor', 'nome_mae', 'nome_pai', 'email_pessoal', 'telefone', 'celular',
          'emergency_contact', 'blood_type', 'is_pcd', 'observacoes_saude',
          'sindicato', 'convencao_coletiva', 'forma_pagamento', 'dia_pagamento',
          'horario_entrada', 'horario_saida', 'inicio_intervalo', 'fim_intervalo',
          'duracao_intervalo', 'segunda_a_sexta', 'sabado', 'trabalha_feriados',
          'tipo_registro_ponto', 'tolerancia_ponto', 'codigo_horario',
          'titulo_eleitor', 'reservista', 'aso_data', 'cnh_numero', 'cnh_categoria', 'cnh_vencimento',
          'cep', 'numero', 'bairro', 'cidade', 'estado', 'vt_ativo', 'va_ativo', 'vr_ativo', 'ps_ativo', 'po_ativo'
        ];

        for (const emp of employees) {
          let needsUpdate = false;
          const updatedEmp = { ...emp };
          
          // Garantir matrícula
          if (!updatedEmp.matricula) {
            const year = updatedEmp.data_admissao ? new Date(updatedEmp.data_admissao).getFullYear() : 2026;
            const index = employees.indexOf(emp) + 1;
            updatedEmp.matricula = `F${index.toString().padStart(2, '0')}/${year}`;
            needsUpdate = true;
          }

          // 1. Verificar campos existentes
          const existingFields = Object.keys(updatedEmp) as (keyof Payroll)[];
          for (const field of existingFields) {
            const value = updatedEmp[field];
            if (value === 'N/A' || value === '' || value === null || value === undefined) {
              const realisticValue = this.getRealisticValue(field as string);
              if (realisticValue !== 'Informação Realista') {
                (updatedEmp as any)[field] = realisticValue;
                needsUpdate = true;
              }
            }
          }

          // 2. Garantir que campos essenciais existam
          for (const field of essentialFields) {
            if (!(field in updatedEmp)) {
              const realisticValue = this.getRealisticValue(field);
              if (realisticValue !== 'Informação Realista') {
                (updatedEmp as any)[field] = realisticValue;
                needsUpdate = true;
              }
            }
          }

          if (!updatedEmp.address || typeof updatedEmp.address !== 'object') {
            updatedEmp.address = {
              zipCode: this.getRealisticValue('zipCode'),
              street: this.getRealisticValue('street'),
              number: this.getRealisticValue('number'),
              neighborhood: this.getRealisticValue('neighborhood'),
              city: this.getRealisticValue('city'),
              state: this.getRealisticValue('state')
            };
            needsUpdate = true;
          } else {
            const addrFields = Object.keys(updatedEmp.address) as (keyof typeof updatedEmp.address)[];
            for (const f of addrFields) {
              const val = updatedEmp.address[f];
              if (val === 'N/A' || val === '' || val === null || val === undefined) {
                (updatedEmp.address as any)[f] = this.getRealisticValue(f as string);
                needsUpdate = true;
              }
            }
          }

          if (needsUpdate) {
            await dbService.saveEmployee(updatedEmp);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar dados:', error);
    }
  },

  getRealisticValue(field: string): any {
    const realisticData: Record<string, any> = {
      // Identificação
      name: 'Roberto Alves',
      employeeName: 'Roberto Alves',
      cpf: '333.444.555-66',
      rg: '00.000.000-0',
      pis: '000.00000.00-0',
      ctps: '00000/000',
      birthDate: '1990-01-01',
      data_nascimento: '1990-01-01',
      sexo: 'Masculino',
      gender: 'Masculino',
      estado_civil: 'Solteiro(a)',
      maritalStatus: 'Solteiro(a)',
      bloodType: 'A+',
      blood_type: 'A+',
      nacionalidade: 'Brasileiro(a)',
      nationality: 'Brasileira',
      naturalidade: 'Belo Horizonte/MG',
      naturalness: 'Belo Horizonte - MG',
      escolaridade: 'Ensino Superior',
      raca_cor: 'Parda',
      nome_mae: 'Maria Alves',
      motherName: 'Maria Alves',
      nome_pai: 'José Alves',
      fatherName: 'José Alves',
      email: 'roberto.alves@pessoal.com',
      email_pessoal: 'roberto.alves@pessoal.com',
      email_corporativo: 'roberto.alves@empresa.com',
      phone: '(31) 3333-4444',
      whatsapp: '(31) 99999-8888',
      telefone: '(31) 3333-4444',
      celular: '(31) 99999-8888',
      emergencyContact: 'Maria Alves - (31) 98888-7777',
      emergency_contact: 'Maria Alves - (31) 98888-7777',
      vinculo_membro_id: 'M001',
      is_pcd: false,
      observacoes_saude: 'Nenhuma observação relevante',
      
      // Profissional
      matricula: 'F003',
      cargo: 'Analista',
      funcao: 'Desenvolvedor',
      departamento: 'TI',
      cbo: '2124-05',
      data_admissao: '2024-01-01',
      data_demissao: '',
      tipo_contrato: 'CLT',
      regime_trabalho: 'PRESENCIAL',
      sindicato: 'Sindicato dos Trabalhadores em TI',
      convencao_coletiva: 'CCT 2024/2025',
      salario_base: 5000,
      tipo_salario: 'MENSAL',
      forma_pagamento: 'Transferência Bancária',
      dia_pagamento: '5',
      jornada_trabalho: '44h semanais',
      horario_trabalho: '08:00 às 18:00',
      horario_entrada: '08:00',
      horario_saida: '18:00',
      inicio_intervalo: '12:00',
      fim_intervalo: '13:00',
      duracao_intervalo: '01:00',
      segunda_a_sexta: '08:00 às 18:00',
      sabado: '08:00 às 12:00',
      trabalha_feriados: false,
      controla_intervalo: true,
      horas_extras_autorizadas: true,
      tipo_registro_ponto: 'Biometria',
      tolerancia_ponto: '10',
      codigo_horario: 'ESC01',
      bh_credito_total: '00:00',
      bh_debito_total: '00:00',
      bh_saldo_atual: '00:00',
      bh_periodo_apuracao: 'Mensal',
      bh_data_inicio_acordo: '2024-01-01',
      bh_data_fim_acordo: '2024-12-31',
      bh_limite_saldo: '40:00',
      bh_periodo_compensacao: '6 meses',
      bh_multiplicador_diurna: '1.5',
      bh_multiplicador_noturna: '2.0',
      
      // Documentos
      titulo_eleitor: '0000 0000 0000',
      reservista: '000000000000',
      aso_data: '2024-01-01',
      cnh_numero: '00000000000',
      cnh_categoria: 'AB',
      cnh_vencimento: '2029-01-01',
      
      // Endereço
      zipCode: '30123-456',
      cep: '30123-456',
      street: 'Avenida Principal',
      logradouro: 'Avenida Principal',
      number: '100',
      numero: '100',
      neighborhood: 'Centro',
      bairro: 'Centro',
      city: 'Belo Horizonte',
      cidade: 'Belo Horizonte',
      state: 'MG',
      estado: 'MG',
      country: 'Brasil',
      pais: 'Brasil',
      complemento: 'Apto 101',
      
      // Bancário
      banco: 'Banco do Brasil',
      codigo_banco: '001',
      agencia: '0000',
      conta: '00000-0',
      tipo_conta: 'CORRENTE',
      titular: 'Roberto Alves',
      chave_pix: '333.444.555-66',
      
      // Benefícios
      vt_ativo: true,
      vt_valor_diario: 10.00,
      vt_qtd_vales_dia: 2,
      vale_transporte_total: 440.00,
      va_ativo: true,
      va_operadora: 'Sodexo',
      vale_alimentacao: 600.00,
      vr_ativo: true,
      vr_operadora: 'Sodexo',
      vale_refeicao: 880.00,
      auxilio_moradia: 0,
      ps_ativo: true,
      plano_saude_colaborador: 300.00,
      po_ativo: true,
      plano_odontologico: 50.00,
      plano_saude_dependentes: 0,
      vale_farmacia: 0,
      seguro_vida: 50.00,
      auxilio_creche: 0,
      auxilio_educacao: 0,
      gympass_plano: 'Basic',
      
      // eSocial
      esocial_categoria: '101',
      esocial_matricula: '0000001',
      esocial_natureza_atividade: 'Urbana',
      esocial_tipo_regime_prev: 'RGPS',
      esocial_tipo_regime_trab: 'CLT',
      esocial_indicativo_admissao: 'Normal',
      esocial_tipo_jornada: 'Submetido a Horário',
      esocial_descricao_jornada: 'Segunda a Sexta das 08:00 às 18:00 com 1h de intervalo',
      esocial_contrato_parcial: false,
      esocial_teletrabalho: false,
      esocial_clausula_asseguratoria: false,
      esocial_sucessao_trab: false,
      esocial_tipo_admissao: 'Admissão',
      esocial_cnpj_anterior: '00.000.000/0000-00',
      esocial_matricula_anterior: '0000001',
      esocial_data_admissao_origem: '2024-01-01',
      
      // Outros
      dependentes_qtd: 0,
      he50_qtd: 0,
      he100_qtd: 0,
      adic_noturno_qtd: 0,
      dsr_ativo: true,
      insalubridade_grau: 'NONE',
      periculosidade_ativo: false,
      ats_percentual: 0,
      comissoes: 0,
      gratificacoes: 0,
      premios: 0,
      faltas: 0,
      atrasos: 0,
      adiantamento: 0,
      pensao_alimenticia: 0,
      consignado: 0,
      coparticipacoes: 0,
      outros_descontos: 0,
      inss: 0,
      fgts_retido: 0,
      irrf: 0,
      rat: 0,
      terceiros: 0
    };
    return realisticData[field] || 'Informação Realista';
  }
};
