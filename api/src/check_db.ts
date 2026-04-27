/**
 * ============================================================================
 * CHECK_DB.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Arquivo relacionado a check db.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */


import { Database } from './database';
import * as fs from 'fs';
import * as path from 'path';

// Definições de campos para cada tabela, extraídas dos arquivos de rota/serviço
/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (check db).
 */

const tableDefinitions: Record<string, string[]> = {
  membros: [
    'id', 'unidade_id', 'matricula', 'nome', 'cpf', 'rg', 'email', 'telefone', 'whatsapp', 'profissao',
    'funcao', 'status', 'data_nascimento', 'sexo', 'estado_civil', 'nome_conjuge', 'data_casamento',
    'nome_pai', 'nome_mae', 'tipo_sanguineo', 'contato_emergencia', 'cep', 'logradouro',
    'numero', 'complemento', 'bairro', 'cidade', 'estado', 'data_conversao', 'local_conversao',
    'data_batismo', 'igreja_batismo', 'pastor_batizador', 'batismo_espirito_santo', 'data_membro',
    'igreja_origem', 'curso_discipulado', 'escola_biblica', 'ministerio_principal', 'funcao_ministerio',
    'outros_ministerios', 'cargo_eclesiastico', 'data_consagracao', 'dizimista', 'ofertante_regular',
    'participa_campanhas', 'banco', 'agencia_bancaria', 'conta_bancaria', 'chave_pix', 'observacoes',
    'necessidades_especiais', 'talentos', 'tags', 'familia_id', 'avatar', 'cell_group',
    'dons_espirituais', 'escolaridade', 'is_pcd', 'tipo_deficiencia', 'celular',
    'lgpd_consent', 'criado', 'atualizado', 'profile_data'
  ],
  transactions: [
    'id', 'unidade_id', 'descricao', 'valor', 'data_transacao', 'tipo_transacao', 'situacao', 'data_competencia', 'categoria',
    'centro_custo', 'natureza_operacao', 'conta_id', 'membro_id', 'forma_pagamento', 'projeto_id',
    'nome_fornecedor', 'data_vencimento', 'data_pagamento', 'valor_pago', 'valor_restante', 'parcelado',
    'numero_parcela', 'total_parcelas', 'pai_id', 'conciliado', 'conciliation_date',
    'notes', 'external_id', 'criado', 'atualizado'
  ],
  employees: [
    'id', 'unit_id', 'nome', 'cpf', 'rg', 'ctps', 'ctps_serie', 'pis',
    'birth_date', 'sexo', 'estado_civil', 'blood_type', 'email', 'telefone', 'celular',
    'emergency_contact', 'naturalidade', 'escolaridade', 'raca_cor',
    'nome_mae', 'nome_pai', 'deficiencia', 'deficiencia_obs', 'avatar', 'observacoes_saude',
    'cep', 'logradouro', 'numero', 'complemento',
    'bairro', 'cidade', 'estado', 'address_country',
    'matricula', 'cargo', 'funcao', 'departamento', 'cbo',
    'data_admissao', 'data_demissao', 'tipo_contrato', 'regime_trabalho',
    'sindicato', 'convencao_coletiva', 'salario_base', 'tipo_salario',
    'forma_pagamento', 'dia_pagamento', 'jornada_trabalho', 'escala_trabalho',
    'horario_entrada', 'horario_saida', 'inicio_intervalo', 'fim_intervalo',
    'duracao_intervalo', 'segunda_a_sexta', 'sabado',
    'trabalha_feriados', 'controla_intervalo', 'horas_extras_autorizadas',
    'tipo_registro_ponto', 'tolerancia_ponto', 'codigo_horario',
    'banco', 'codigo_banco', 'agencia', 'conta', 'tipo_conta', 'titular', 'chave_pix',
    'vt_ativo', 'vt_valor_diario', 'vt_qtd_vales_dia', 'vale_transporte_total',
    'va_ativo', 'va_operadora', 'vale_alimentacao',
    'vr_ativo', 'vr_operadora', 'vale_refeicao',
    'ps_ativo', 'ps_operadora', 'ps_tipo_plano', 'ps_carteirinha',
    'plano_saude_colaborador', 'ps_dependentes_ativo', 'plano_saude_dependentes',
    'po_ativo', 'po_operadora', 'po_carteirinha', 'plano_odontologico',
    'auxilio_moradia', 'vale_farmacia', 'seguro_vida', 'auxilio_creche',
    'auxilio_educacao', 'gympass_plano',
    'titulo_eleitor', 'titulo_eleitor_zona', 'titulo_eleitor_secao', 'reservista',
    'cnh_numero', 'cnh_categoria', 'cnh_vencimento', 'aso_data',
    'esocial_categoria', 'esocial_matricula', 'esocial_natureza_atividade',
    'esocial_tipo_regime_prev', 'esocial_tipo_regime_trab', 'esocial_indicativo_admissao',
    'esocial_tipo_jornada', 'esocial_descricao_jornada', 'esocial_contrato_parcial',
    'esocial_teletrabalho', 'esocial_clausula_asseguratoria', 'esocial_sucessao_trab',
    'esocial_tipo_admissao', 'esocial_cnpj_anterior', 'esocial_matricula_anterior',
    'esocial_data_admissao_origem',
    'ativo', 'criado', 'atualizado', 'profile_data'
  ],
  payroll_periods: ['id', 'unit_id', 'month', 'year', 'start_date', 'end_date', 'criado_por', 'notes', 'status'],
  payroll_calculations: [
    'id', 'employee_id', 'competency_month', 'gross_salary',
    'base_salary', 'overtime', 'night_shift', 'hazard_pay', 'commission', 'bonuses', 'family_salary', 'other_allowances',
    'inss', 'irrf', 'fgts', 'health_insurance', 'dental_insurance', 'meal_allowance', 'meal_ticket', 'transport', 
    'pharmacy', 'life_insurance', 'advance', 'consignado', 'coparticipation', 'absences', 'delays', 'alimony', 'other_deductions',
    'total_allowances', 'total_deductions', 'net_salary', 'employer_cost',
    'inss_base', 'inss_rate', 'inss_value', 'irrf_base', 'irrf_rate', 'irrf_deduction', 'irrf_value', 'fgts_base', 'fgts_rate', 'fgts_value'
  ],
  assets: [
    'id', 'unit_id', 'nome', 'descricao', 'categoria', 'data_aquisicao', 'valor_aquisicao', 'valor_atual',
    'taxa_depreciacao', 'metodo_depreciacao', 'valor_contabil_atual', 'depreciacao_acumulada', 'vida_util_meses',
    'localizacao', 'cep', 'logradouro', 'numero', 'complemento', 'bairro',
    'cidade', 'estado', 'situacao', 'condicao', 'numero_ativo', 'numero_serie', 'nota_fiscal_aquisicao',
    'marca', 'modelo', 'fornecedor', 'responsavel', 'criado', 'atualizado'
  ],
  inventory_counts: ['id', 'unit_id', 'count_date', 'counted_by', 'status', 'total_assets', 'total_expected', 'started_at', 'completed_at', 'total_found', 'completion_percentage'],
  inventory_items: ['id', 'inventory_count_id', 'asset_id', 'asset_name', 'category', 'expected_quantity', 'counted_quantity', 'difference', 'condition', 'observations'],
  church_events: ['id', 'unit_id', 'titulo', 'descricao', 'data_evento', 'hora_evento', 'local_evento', 'quantidade_presentes', 'type', 'eh_recorrente', 'padrao_recorrencia', 'data_fim_recorrencia', 'evento_pai_id', 'eh_evento_gerado', 'criado', 'atualizado'],
  app_audit_logs: ['id', 'unit_id', 'usuario_id', 'nome_usuario', 'action', 'entidade', 'entidade_id', 'nome_entidade', 'data_evento', 'ip', 'agente_usuario', 'details', 'success', 'mensagem_erro', 'hash_anterior', 'hash', 'imutavel', 'criado'],
  app_permission_modules: ['id', 'codigo', 'name', 'categoria', 'descricao', 'criado', 'atualizado'],
  app_role_permissions: ['id', 'role', 'codigo_modulo', 'pode_ler', 'pode_escrever', 'pode_excluir', 'pode_gerenciar', 'criado', 'atualizado'],
  app_user_permissions: ['id', 'usuario_id', 'codigo_modulo', 'pode_ler', 'pode_escrever', 'pode_excluir', 'pode_gerenciar', 'criado', 'atualizado'],
};

async function checkDatabase() {
  const db = Database.getInstance();
  let report = '## Relatório Completo de Verificação do Banco de Dados\n\n';

  try {
    console.log('Conectando ao banco de dados...');
    const client = await db.getPool().connect();
    console.log('Conexão bem-sucedida!');

    for (const tableName of Object.keys(tableDefinitions)) {
      console.log(`Verificando tabela: ${tableName}...`);
      report += `### Tabela: \`${tableName}\`\n\n`;

      const columnsResult = await client.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1;
      `, [tableName]);

      if (columnsResult.rowCount === 0) {
        report += `**Aviso:** A tabela \`${tableName}\` não foi encontrada no banco de dados.\n\n`;
        continue;
      }

      const columnsInDB = columnsResult.rows.map(row => row.column_name);
      const fieldsInCode = tableDefinitions[tableName];

      report += '**Campos no Código vs. Banco de Dados:**\n';
      fieldsInCode.forEach(field => {
        if (columnsInDB.includes(field)) {
          report += `- [x] \`${field}\`\n`;
        } else {
          report += `- [ ] \`${field}\` (Não encontrado no DB)\n`;
        }
      });

      report += '\n**Campos no Banco de Dados vs. Código:**\n';
      const extraColumns = columnsInDB.filter(column => !fieldsInCode.includes(column));
      if (extraColumns.length > 0) {
        extraColumns.forEach(column => {
          report += `- [!] \`${column}\` (Extra no DB, não definido no código)\n`;
        });
      } else {
        report += 'Nenhum campo extra encontrado no banco de dados.\n';
      }
      report += '\n---\n\n';
    }

    client.release();
  } catch (error) {
    console.error('Erro ao verificar o banco de dados:', error);
    report += `\n**ERRO DURANTE A EXECUÇÃO:**\n\`\`\`\n${error}\n\`\`\`\n`;
  } finally {
    await db.close();
    const outputPath = path.join(__dirname, '..', '..', 'docs', 'relatorio_completo_190426.md');
    fs.writeFileSync(outputPath, report);
    console.log(`Relatório completo salvo em ${outputPath}`);
  }
}

checkDatabase();