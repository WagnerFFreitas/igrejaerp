-- =====================================================
-- MIGRAÇÃO COMPLETA PARA PORTUGUÊS
-- IgrejaERP - PostgreSQL
-- Data: 2026-04-25
-- =====================================================

-- Transactions: MISTURADO (parcial PT, parcial EN)
-- Renomear colunas EN para PT:
ALTER TABLE transactions RENAME COLUMN description TO descricao;
ALTER TABLE transactions RENAME COLUMN amount TO valor;
ALTER TABLE transactions RENAME COLUMN date TO data_transacao;
ALTER TABLE transactions RENAME COLUMN type TO tipo_transacao;
ALTER TABLE transactions RENAME COLUMN status TO situacao;
ALTER TABLE transactions RENAME COLUMN category TO categoria;
ALTER TABLE transactions RENAME COLUMN cost_center TO centro_custo;
ALTER TABLE transactions RENAME COLUMN operation_nature TO natureza_operacao;
ALTER TABLE transactions RENAME COLUMN account_id TO conta_id;
ALTER TABLE transactions RENAME COLUMN member_id TO membro_id;
ALTER TABLE transactions RENAME COLUMN payment_method TO forma_pagamento;
ALTER TABLE transactions RENAME COLUMN project_id TO projeto_id;
ALTER TABLE transactions RENAME COLUMN provider_name TO nome_fornecedor;
ALTER TABLE transactions RENAME COLUMN due_date TO data_vencimento;
ALTER TABLE transactions RENAME COLUMN payment_date TO data_pagamento;
ALTER TABLE transactions RENAME COLUMN paid_amount TO valor_pago;
ALTER TABLE transactions RENAME COLUMN remaining_amount TO valor_restante;
ALTER TABLE transactions RENAME COLUMN is_installment TO eh_parcelado;
ALTER TABLE transactions RENAME COLUMN installment_number TO numero_parcela;
ALTER TABLE transactions RENAME COLUMN total_installments TO total_parcelas;
ALTER TABLE transactions RENAME COLUMN parent_id TO pai_id;
ALTER TABLE transactions RENAME COLUMN is_conciliated TO conciliado;
ALTER TABLE transactions RENAME COLUMN conciliation_date TO data_conciliacao;
ALTER TABLE transactions RENAME COLUMN external_id TO id_externo;
ALTER TABLE transactions RENAME COLUMN competency_date TO data_competencia;

-- Financial Accounts: MISTURADO
ALTER TABLE financial_accounts RENAME COLUMN name TO nome;
ALTER TABLE financial_accounts RENAME COLUMN type TO tipo;
ALTER TABLE financial_accounts RENAME COLUMN current_balance TO saldo_atual;
ALTER TABLE financial_accounts RENAME COLUMN minimum_balance TO saldo_minimo;
ALTER TABLE financial_accounts RENAME COLUMN status TO situacao;
ALTER TABLE financial_accounts RENAME COLUMN bank_code TO codigo_banco;
ALTER TABLE financial_accounts RENAME COLUMN agency_number TO numero_agencia;
ALTER TABLE financial_accounts RENAME COLUMN account_number TO numero_conta;
ALTER TABLE financial_accounts RENAME COLUMN created_at TO criado_em;
ALTER TABLE financial_accounts RENAME COLUMN updated_at TO atualizado_em;

-- Employee Leaves: MISTURADO
ALTER TABLE employee_leaves RENAME COLUMN employee_id TO funcionario_id;
ALTER TABLE employee_leaves RENAME COLUMN start_date TO data_inicio;
ALTER TABLE employee_leaves RENAME COLUMN end_date TO data_fim;
ALTER TABLE employee_leaves RENAME COLUMN type TO tipo;
ALTER TABLE employee_leaves RENAME COLUMN status TO situacao;
ALTER TABLE employee_leaves RENAME COLUMN observations TO observacoes;
ALTER TABLE employee_leaves RENAME COLUMN url_attachment TO url_anexo;
ALTER TABLE employee_leaves RENAME COLUMN doctor_name TO nome_medico;
ALTER TABLE employee_leaves RENAME COLUMN created_at TO criado_em;
ALTER TABLE employee_leaves RENAME COLUMN updated_at TO atualizado_em;

-- Performance Evaluations: Misturado
ALTER TABLE performance_evaluations RENAME COLUMN employee_id TO funcionario_id;
ALTER TABLE performance_evaluations RENAME COLUMN employee_name TO nome_funcionario;
ALTER TABLE performance_evaluations RENAME COLUMN evaluation_date TO data_avaliacao;
ALTER TABLE performance_evaluations RENAME COLUMN evaluation_type TO tipo_avaliacao;
ALTER TABLE performance_evaluations RENAME COLUMN overall_score TO nota_geral;
ALTER TABLE performance_evaluations RENAME COLUMN overall_concept TO conceito_geral;
ALTER TABLE performance_evaluations RENAME COLUMN evaluator_id TO avaliado_por;
ALTER TABLE performance_evaluations RENAME COLUMN approved_by TO aprovado_por;
ALTER TABLE performance_evaluations RENAME COLUMN created_at TO criado_em;
ALTER TABLE performance_evaluations RENAME COLUMN updated_at TO atualizado_em;

-- Members (tabela legacy - manter ou migrar?)
-- Esta tabela tem colunas em INGLÊS que precisam migrar para PT
ALTER TABLE members RENAME COLUMN name TO nome;
ALTER TABLE members RENAME COLUMN cpf TO cpf;
ALTER TABLE members RENAME COLUMN rg TO rg;
ALTER TABLE members RENAME COLUMN email TO email;
ALTER TABLE members RENAME COLUMN phone TO telefone;
ALTER TABLE members RENAME COLUMN profession TO profissao;
ALTER TABLE members RENAME COLUMN role TO funcao;
ALTER TABLE members RENAME COLUMN birth_date TO data_nascimento;
ALTER TABLE members RENAME COLUMN gender TO sexo;
ALTER TABLE members RENAME COLUMN marital_status TO estado_civil;
ALTER TABLE members RENAME COLUMN spouse_name TO nome_conjuge;
ALTER TABLE members RENAME COLUMN marriage_date TO data_casamento;
ALTER TABLE members RENAME COLUMN father_name TO nome_pai;
ALTER TABLE members RENAME COLUMN mother_name TO nome_mae;
ALTER TABLE members RENAME COLUMN blood_type TO tipo_sanguineo;
ALTER TABLE members RENAME COLUMN emergency_contact TO contato_emergencia;
ALTER TABLE members RENAME COLUMN zip_code TO cep;
ALTER TABLE members RENAME COLUMN street TO logradouro;
ALTER TABLE members RENAME COLUMN number TO numero;
ALTER TABLE members RENAME COLUMN complement TO complemento;
ALTER TABLE members RENAME COLUMN neighborhood TO bairro;
ALTER TABLE members RENAME COLUMN city TO cidade;
ALTER TABLE members RENAME COLUMN state TO estado;
ALTER TABLE members RENAME COLUMN conversion_date TO data_conversao;
ALTER TABLE members RENAME COLUMN conversion_place TO local_conversao;
ALTER TABLE members RENAME COLUMN baptism_date TO data_batismo;
ALTER TABLE members RENAME COLUMN baptism_church TO igreja_batismo;
ALTER TABLE members RENAME COLUMN baptizing_pastor TO pastor_batizador;
ALTER TABLE members RENAME COLUMN holy_spirit_baptism TO batismo_espirito_santo;
ALTER TABLE members RENAME COLUMN membership_date TO data_membro;
ALTER TABLE members RENAME COLUMN church_of_origin TO igreja_origem;
ALTER TABLE members RENAME COLUMN discipleship_course TO curso_discipulado;
ALTER TABLE members RENAME COLUMN biblical_school TO escola_biblica;
ALTER TABLE members RENAME COLUMN main_ministry TO ministerio_principal;
ALTER TABLE members RENAME COLUMN ministry_role TO funcao_ministerio;
ALTER TABLE members RENAME COLUMN other_ministries TO outros_ministerios;
ALTER TABLE members RENAME COLUMN ecclesiastical_position TO cargo_eclesiastico;
ALTER TABLE members RENAME COLUMN consecration_date TO data_consagracao;
ALTER TABLE members RENAME COLUMN is_tithable TO eh_dizimista;
ALTER TABLE members RENAME COLUMN is_regular_giver TO eh_ofertante_regular;
ALTER TABLE members RENAME COLUMN participates_campaigns TO participa_campanhas;
ALTER TABLE members RENAME COLUMN bank TO banco;
ALTER TABLE members RENAME COLUMN bank_agency TO agencia_bancaria;
ALTER TABLE members RENAME COLUMN bank_account TO conta_bancaria;
ALTER TABLE members RENAME COLUMN pix_key TO chave_pix;
ALTER TABLE members RENAME COLUMN observations TO observacoes;
ALTER TABLE members RENAME COLUMN special_needs TO necessidades_especiais;
ALTER TABLE members RENAME COLUMN talents TO talentos;
ALTER TABLE members RENAME COLUMN family_id TO familia_id;
ALTER TABLE members RENAME COLUMN avatar TO avatar;
ALTER TABLE members RENAME COLUMN created_at TO criado_em;
ALTER TABLE members RENAME COLUMN updated_at TO atualizado_em;

-- Dependents
ALTER TABLE dependents RENAME COLUMN member_id TO membro_id;
ALTER TABLE dependents RENAME COLUMN name TO nome;
ALTER TABLE dependents RENAME COLUMN birth_date TO data_nascimento;
ALTER TABLE dependents RENAME COLUMN relationship TO parentesco;

-- Employee Dependents
ALTER TABLE employee_dependents RENAME COLUMN employee_id TO funcionario_id;
ALTER TABLE employee_dependents RENAME COLUMN name TO nome;
ALTER TABLE employee_dependents RENAME COLUMN birth_date TO data_nascimento;
ALTER TABLE employee_dependents RENAME COLUMN relationship TO parentesco;

-- Accounts (financial)
ALTER TABLE accounts RENAME COLUMN name TO nome;
ALTER TABLE accounts RENAME COLUMN balance TO saldo_atual;
ALTER TABLE accounts RENAME COLUMN created_at TO criado_em;
ALTER TABLE accounts RENAME COLUMN updated_at TO atualizado_em;

-- Audit Logs
ALTER TABLE audit_logs RENAME COLUMN user_id TO usuario_id;
ALTER TABLE audit_logs RENAME COLUMN action TO acao;
ALTER TABLE audit_logs RENAME COLUMN entity TO entidade;
ALTER TABLE audit_logs RENAME COLUMN entity_id TO entidade_id;
ALTER TABLE audit_logs RENAME COLUMN entity_name TO nome_entidade;
ALTER TABLE audit_logs RENAME COLUMN created_at TO criado_em;
ALTER TABLE audit_logs RENAME COLUMN updated_at TO atualizado_em;

-- System Logs
ALTER TABLE system_logs RENAME COLUMN user_id TO usuario_id;
ALTER TABLE system_logs RENAME COLUMN action TO acao;
ALTER TABLE system_logs RENAME COLUMN resource_type TO tipo_recurso;
ALTER TABLE system_logs RENAME COLUMN resource_id TO id_recurso;
ALTER TABLE system_logs RENAME COLUMN previous_values TO valores_anteriores;
ALTER TABLE system_logs RENAME COLUMN new_values TO valores_novos;
ALTER TABLE system_logs RENAME COLUMN ip_address TO endereco_ip;
ALTER TABLE system_logs RENAME COLUMN user_agent TO agente_usuario;
ALTER TABLE system_logs RENAME COLUMN created_at TO criado_em;

-- Payroll
ALTER TABLE payroll RENAME COLUMN employee_id TO funcionario_id;
ALTER TABLE payroll RENAME COLUMN reference_date TO data_referencia;
ALTER TABLE payroll RENAME COLUMN base_salary TO salario_base;
ALTER TABLE payroll RENAME COLUMN night_shift TO adicional_noturno;
ALTER TABLE payroll RENAME COLUMN hazard_pay TO insalubridade;
ALTER TABLE payroll RENAME COLUMN commissions TO comissoes;
ALTER TABLE payroll RENAME COLUMN bonuses TO gratificacoes;
ALTER TABLE payroll RENAME COLUMN other_allowances TO outros_proventos;
ALTER TABLE payroll RENAME COLUMN health_insurance TO plano_saude;
ALTER TABLE payroll RENAME COLUMN dental_insurance TO plano_odontologico;
ALTER TABLE payroll RENAME COLUMN meal_allowance TO vale_alimentacao;
ALTER TABLE payroll RENAME COLUMN meal_ticket TO vale_refeicao;
ALTER TABLE payroll RENAME COLUMN transport TO vale_transporte;
ALTER TABLE payroll RENAME COLUMN advance TO adiantamento;
ALTER TABLE payroll RENAME COLUMN absences TO faltas;
ALTER TABLE payroll RENAME COLUMN delays TO atrasos;
ALTER TABLE payroll RENAME COLUMN other_deductions TO outras_deducoes;
ALTER TABLE payroll RENAME COLUMN total_allowances TO total_proventos;
ALTER TABLE payroll RENAME COLUMN total_deductions TO total_deducoes;
ALTER TABLE payroll RENAME COLUMN net_salary TO salario_liquido;
ALTER TABLE payroll RENAME COLUMN employer_cost TO custo_empregador;
ALTER TABLE payroll RENAME COLUMN processed_by TO processado_por;
ALTER TABLE payroll RENAME COLUMN processed_at TO processado_em;
ALTER TABLE payroll RENAME COLUMN created_at TO criado_em;
ALTER TABLE payroll RENAME COLUMN updated_at TO atualizado_em;

-- Payroll Calculations
ALTER TABLE payroll_calculations RENAME COLUMN employee_id TO funcionario_id;
ALTER TABLE payroll_calculations RENAME COLUMN competency_month TO mes_competencia;
ALTER TABLE payroll_calculations RENAME COLUMN gross_salary TO salario_bruto;
ALTER TABLE payroll_calculations RENAME COLUMN base_salary TO salario_base;
ALTER TABLE payroll_calculations RENAME COLUMN overtime TO horas_extras;
ALTER TABLE payroll_calculations RENAME COLUMN night_shift TO adicional_noturno;
ALTER TABLE payroll_calculations RENAME COLUMN hazard_pay TO insalubridade;
ALTER TABLE payroll_calculations RENAME COLUMN commission TO comissao;
ALTER TABLE payroll_calculations RENAME COLUMN bonuses TO bonificacoes;
ALTER TABLE payroll_calculations RENAME COLUMN family_salary TO salario_familia;
ALTER TABLE payroll_calculations RENAME COLUMN other_allowances TO outros_proventos;
ALTER TABLE payroll_calculations RENAME COLUMN health_insurance TO plano_saude;
ALTER TABLE payroll_calculations RENAME COLUMN dental_insurance TO plano_odontologico;
ALTER TABLE payroll_calculations RENAME COLUMN meal_allowance TO vale_alimentacao;
ALTER TABLE payroll_calculations RENAME COLUMN meal_ticket TO vale_refeicao;
ALTER TABLE payroll_calculations RENAME COLUMN transport TO transporte;
ALTER TABLE payroll_calculations RENAME COLUMN advance TO adiantamento;
ALTER TABLE payroll_calculations RENAME COLUMN consignado TO consignado;
ALTER TABLE payroll_calculations RENAME COLUMN coparticipation TO coparticipacao;
ALTER TABLE payroll_calculations RENAME COLUMN absences TO faltas;
ALTER TABLE payroll_calculations RENAME COLUMN delays TO atrasos;
ALTER TABLE payroll_calculations RENAME COLUMN alimony TO pensao_alimenticia;
ALTER TABLE payroll_calculations RENAME COLUMN other_deductions TO outras_deducoes;
ALTER TABLE payroll_calculations RENAME COLUMN total_allowances TO total_proventos;
ALTER TABLE payroll_calculations RENAME COLUMN total_deductions TO total_descontos;
ALTER TABLE payroll_calculations RENAME COLUMN net_salary TO salario_liquido;
ALTER TABLE payroll_calculations RENAME COLUMN employer_cost TO custo_empregador;
ALTER TABLE payroll_calculations RENAME COLUMN inss_base TO base_inss;
ALTER TABLE payroll_calculations RENAME COLUMN inss_rate TO aliquota_inss;
ALTER TABLE payroll_calculations RENAME COLUMN inss_value TO valor_inss;
ALTER TABLE payroll_calculations RENAME COLUMN irrf_base TO base_irrf;
ALTER TABLE payroll_calculations RENAME COLUMN irrf_rate TO aliquota_irrf;
ALTER TABLE payroll_calculations RENAME COLUMN irrf_deduction TO deducao_irrf;
ALTER TABLE payroll_calculations RENAME COLUMN irrf_value TO valor_irrf;
ALTER TABLE payroll_calculations RENAME COLUMN fgts_base TO base_fgts;
ALTER TABLE payroll_calculations RENAME COLUMN fgts_rate TO aliquota_fgts;
ALTER TABLE payroll_calculations RENAME COLUMN fgts_value TO valor_fgts;

-- Payroll Periods
ALTER TABLE payroll_periods RENAME COLUMN start_date TO data_inicio;
ALTER TABLE payroll_periods RENAME COLUMN end_date TO data_fim;
ALTER TABLE payroll_periods RENAME COLUMN status TO situacao;
ALTER TABLE payroll_periods RENAME COLUMN processed_at TO processado_em;
ALTER TABLE payroll_periods RENAME COLUMN closed_at TO fechado_em;
ALTER TABLE payroll_periods RENAME COLUMN total_employees TO total_funcionarios;
ALTER TABLE payroll_periods RENAME COLUMN total_payroll TO total_folha;
ALTER TABLE payroll_periods RENAME COLUMN total_inss TO total_inss;
ALTER TABLE payroll_periods RENAME COLUMN total_fgts TO total_fgts;
ALTER TABLE payroll_periods RENAME COLUMN total_irrf TO total_irrf;
ALTER TABLE payroll_periods RENAME COLUMN created_by TO criado_por;
ALTER TABLE payroll_periods RENAME COLUMN created_at TO criado_em;
ALTER TABLE payroll_periods RENAME COLUMN updated_at TO atualizado_em;

-- PDI Plans
ALTER TABLE pdi_plans RENAME COLUMN employee_id TO funcionario_id;
ALTER TABLE pdi_plans RENAME COLUMN employee_name TO nome_funcionario;
ALTER TABLE pdi_plans RENAME COLUMN deadline TO prazo;
ALTER TABLE pdi_plans RENAME COLUMN status TO situacao;
ALTER TABLE pdi_plans RENAME COLUMN observations TO observacoes;
ALTER TABLE pdi_plans RENAME COLUMN created_at TO criado_em;
ALTER TABLE pdi_plans RENAME COLUMN updated_at TO atualizado_em;

-- Volunteer Schedules
ALTER TABLE volunteer_schedules RENAME COLUMN event_id TO evento_id;
ALTER TABLE volunteer_schedules RENAME COLUMN ministry TO ministerio;
ALTER TABLE volunteer_schedules RENAME COLUMN volunteer_id TO voluntario_id;
ALTER TABLE volunteer_schedules RENAME COLUMN volunteer_name TO nome_voluntario;
ALTER TABLE volunteer_schedules RENAME COLUMN volunteer_phone TO telefone_voluntario;
ALTER TABLE volunteer_schedules RENAME COLUMN volunteer_email TO email_voluntario;
ALTER TABLE volunteer_schedules RENAME COLUMN required_count TO quantidade_necessaria;
ALTER TABLE volunteer_schedules RENAME COLUMN assigned_count TO quantidade_atribuida;
ALTER TABLE volunteer_schedules RENAME COLUMN created_at TO criado_em;
ALTER TABLE volunteer_schedules RENAME COLUMN updated_at TO atualizado_em;

-- Permission Modules
ALTER TABLE permission_modules RENAME COLUMN code TO codigo;
ALTER TABLE permission_modules RENAME COLUMN name TO nome_modulo;
ALTER TABLE permission_modules RENAME COLUMN description TO descricao;
ALTER TABLE permission_modules RENAME COLUMN category TO categoria;
ALTER TABLE permission_modules RENAME COLUMN created_at TO criado_em;
ALTER TABLE permission_modules RENAME COLUMN updated_at TO atualizado_em;

-- Role Permissions
ALTER TABLE role_permissions RENAME COLUMN role TO funcao;
ALTER TABLE role_permissions RENAME COLUMN resource TO recurso;
ALTER TABLE role_permissions RENAME COLUMN module_code TO codigo_modulo;
ALTER TABLE role_permissions RENAME COLUMN can_read TO pode_ler;
ALTER TABLE role_permissions RENAME COLUMN can_write TO pode_escrever;
ALTER TABLE role_permissions RENAME COLUMN can_delete TO pode_excluir;
ALTER TABLE role_permissions RENAME COLUMN can_admin TO pode_administrar;
ALTER TABLE role_permissions RENAME COLUMN can_manage TO pode_gerenciar;

-- User Permissions
ALTER TABLE user_permissions RENAME COLUMN module_code TO codigo_modulo;

-- Inventory Counts
ALTER TABLE inventory_counts RENAME COLUMN count_date TO data_contagem;
ALTER TABLE inventory_counts RENAME COLUMN counted_by TO contagem_por;
ALTER TABLE inventory_counts RENAME COLUMN reviewed_by TO revisado_por;
ALTER TABLE inventory_counts RENAME COLUMN status TO situacao;
ALTER TABLE inventory_counts RENAME COLUMN total_assets TO total_ativos;
ALTER TABLE inventory_counts RENAME COLUMN total_expected TO total_esperado;
ALTER TABLE inventory_counts RENAME COLUMN total_found TO total_encontrado;
ALTER TABLE inventory_counts RENAME COLUMN difference TO diferenca;
ALTER TABLE inventory_counts RENAME COLUMN completion_percentage TO percentual_conclusao;
ALTER TABLE inventory_counts RENAME COLUMN started_at TO iniciado_em;
ALTER TABLE inventory_counts RENAME COLUMN completed_at TO concluido_em;

-- Inventory Items
ALTER TABLE inventory_items RENAME COLUMN inventory_count_id TO contagem_estoque_id;
ALTER TABLE inventory_items RENAME COLUMN asset_id TO ativo_id;
ALTER TABLE inventory_items RENAME COLUMN asset_name TO nome_ativo;
ALTER TABLE inventory_items RENAME COLUMN category TO categoria;
ALTER TABLE inventory_items RENAME COLUMN expected_quantity TO quantidade_esperada;
ALTER TABLE inventory_items RENAME COLUMN counted_quantity TO quantidade_contada;
ALTER TABLE inventory_items RENAME COLUMN difference TO diferenca;
ALTER TABLE inventory_items RENAME COLUMN condition TO condicao;
ALTER TABLE inventory_items RENAME COLUMN observations TO observacoes;

-- Inventory Adjustments
ALTER TABLE inventory_adjustments RENAME COLUMN inventory_count_id TO contagem_estoque_id;
ALTER TABLE inventory_adjustments RENAME COLUMN adjustment_type TO tipo_ajuste;
ALTER TABLE inventory_adjustments RENAME COLUMN quantity TO quantidade;
ALTER TABLE inventory_adjustments RENAME COLUMN reason TO motivo;
ALTER TABLE inventory_adjustments RENAME COLUMN justification TO justificativa;
ALTER TABLE inventory_adjustments RENAME COLUMN approved_by TO aprovado_por;
ALTER TABLE inventory_adjustments RENAME COLUMN accounting_entry TO lancamento_contabil;
ALTER TABLE inventory_adjustments RENAME COLUMN created_at TO criado_em;
ALTER TABLE inventory_adjustments RENAME COLUMN updated_at TO atualizado_em;

-- Assets
ALTER TABLE assets RENAME COLUMN name TO nome;
ALTER TABLE assets RENAME COLUMN description TO descricao;
ALTER TABLE assets RENAME COLUMN category TO categoria;
ALTER TABLE assets RENAME COLUMN acquisition_date TO data_aquisicao;
ALTER TABLE assets RENAME COLUMN acquisition_value TO valor_aquisicao;
ALTER TABLE assets RENAME COLUMN current_value TO valor_atual;
ALTER TABLE assets RENAME COLUMN depreciation_rate TO taxa_depreciacao;
ALTER TABLE assets RENAME COLUMN depreciation_method TO metodo_depreciacao;
ALTER TABLE assets RENAME COLUMN current_book_value TO valor_contabil_atual;
ALTER TABLE assets RENAME COLUMN accumulated_depreciation TO depreciacao_acumulada;
ALTER TABLE assets RENAME COLUMN useful_life_months TO vida_util_meses;
ALTER TABLE assets RENAME COLUMN location TO localizacao;
ALTER TABLE assets RENAME COLUMN address_zip_code TO cep;
ALTER TABLE assets RENAME COLUMN address_street TO logradouro;
ALTER TABLE assets RENAME COLUMN address_number TO numero;
ALTER TABLE assets RENAME COLUMN address_complement TO complemento;
ALTER TABLE assets RENAME COLUMN address_neighborhood TO bairro;
ALTER TABLE assets RENAME COLUMN address_city TO cidade;
ALTER TABLE assets RENAME COLUMN address_state TO estado;
ALTER TABLE assets RENAME COLUMN status TO situacao;
ALTER TABLE assets RENAME COLUMN condition TO condicao;
ALTER TABLE assets RENAME COLUMN asset_number TO numero_ativo;
ALTER TABLE assets RENAME COLUMN serial_number TO numero_serie;
ALTER TABLE assets RENAME COLUMN purchase_invoice TO nota_fiscal_aquisicao;
ALTER TABLE assets RENAME COLUMN responsible_employee_id TO responsavel_id;
ALTER TABLE assets RENAME COLUMN warranty_expiry TO validade_garantia;
ALTER TABLE assets RENAME COLUMN created_at TO criado_em;
ALTER TABLE assets RENAME COLUMN updated_at TO atualizado_em;

-- Asset Depreciations
ALTER TABLE asset_depreciations RENAME COLUMN asset_id TO ativo_id;
ALTER TABLE asset_depreciations RENAME COLUMN reference_month TO mes_referencia;
ALTER TABLE asset_depreciations RENAME COLUMN reference_year TO ano_referencia;
ALTER TABLE asset_depreciations RENAME COLUMN beginning_book_value TO valor_contabil_inicio;
ALTER TABLE asset_depreciations RENAME COLUMN depreciation_expense TO despesa_depreciacao;
ALTER TABLE asset_depreciations RENAME COLUMN accumulated_depreciation TO depreciacao_acumulada;
ALTER TABLE asset_depreciations RENAME COLUMN ending_book_value TO valor_contabil_fim;
ALTER TABLE asset_depreciations RENAME COLUMN created_at TO criado_em;

-- Asset Maintenances
ALTER TABLE asset_maintenances RENAME COLUMN maintenance_date TO data_manutencao;
ALTER TABLE asset_maintenances RENAME COLUMN maintenance_type TO tipo_manutencao;
ALTER TABLE asset_maintenances RENAME COLUMN description TO descricao;
ALTER TABLE asset_maintenances RENAME COLUMN provider TO fornecedor;
ALTER TABLE asset_maintenances RENAME COLUMN cost TO custo;
ALTER TABLE asset_maintenances RENAME COLUMN document_number TO numero_documento;
ALTER TABLE asset_maintenances RENAME COLUMN next_maintenance_date TO proxima_manutencao;
ALTER TABLE asset_maintenances RENAME COLUMN performed_by TO realizado_por;
ALTER TABLE asset_maintenances RENAME COLUMN status TO situacao;
ALTER TABLE asset_maintenances RENAME COLUMN created_at TO criado_em;
ALTER TABLE asset_maintenances RENAME COLUMN updated_at TO atualizado_em;

-- Asset Transfers
ALTER TABLE asset_transfers RENAME COLUMN asset_id TO ativo_id;
ALTER TABLE asset_transfers RENAME COLUMN from_unit_id TO unidade_origem_id;
ALTER TABLE asset_transfers RENAME COLUMN to_unit_id TO unidade_destino_id;
ALTER TABLE asset_transfers RENAME COLUMN transfer_date TO data_transferencia;
ALTER TABLE asset_transfers RENAME COLUMN reason TO motivo;
ALTER TABLE asset_transfers RENAME COLUMN responsible TO responsavel;
ALTER TABLE asset_transfers RENAME COLUMN authorized_by TO autorizado_por;
ALTER TABLE asset_transfers RENAME COLUMN observations TO observacoes;
ALTER TABLE asset_transfers RENAME COLUMN status TO situacao;
ALTER TABLE asset_transfers RENAME COLUMN created_at TO criado_em;
ALTER TABLE asset_transfers RENAME COLUMN updated_at TO atualizado_em;

-- Categories
ALTER TABLE categories RENAME COLUMN name TO nome;
ALTER TABLE categories RENAME COLUMN category_type TO tipo_categoria;
ALTER TABLE categories RENAME COLUMN icon TO icone;
ALTER TABLE categories RENAME COLUMN description TO descricao;
ALTER TABLE categories RENAME COLUMN is_active TO esta_ativa;

-- Chart of Accounts
ALTER TABLE chart_of_accounts RENAME COLUMN code TO codigo;
ALTER TABLE chart_of_accounts RENAME COLUMN name TO nome;
ALTER TABLE chart_of_accounts RENAME COLUMN nature TO natureza;
ALTER TABLE chart_of_accounts RENAME COLUMN account_type TO tipo_conta;
ALTER TABLE chart_of_accounts RENAME COLUMN normal_balance TO saldo_normal;
ALTER TABLE chart_of_accounts RENAME COLUMN is_active TO esta_ativo;

-- Treasury Alerts
ALTER TABLE treasury_alerts RENAME COLUMN tipo_alerta TO tipo_alerta;
ALTER TABLE treasury_alerts RENAME COLUMN titulo_alerta TO titulo_alerta;
ALTER TABLE treasury_alerts RENAME COLUMN descricao_alerta TO descricao_alerta;
ALTER TABLE treasury_alerts RENAME COLUMN severity_level TO nivel_gravidade;
ALTER TABLE treasury_alerts RENAME COLUMN conta_id TO conta_id;
ALTER TABLE treasury_alerts RENAME COLUMN investimento_id TO investimento_id;
ALTER TABLE treasury_alerts RENAME COLUMN emprestimo_id TO emprestimo_id;
ALTER TABLE treasury_alerts RENAME COLUMN valor_alerta TO valor_alerta;
ALTER TABLE treasury_alerts RENAME COLUMN data_limite_alerta TO data_limite_alerta;
ALTER TABLE treasury_alerts RENAME COLUMN acoes_sugeridas TO acoes_sugeridas;
ALTER TABLE treasury_alerts RENAME COLUMN created_by TO criado_por;

-- Treasury Cash Flows
ALTER TABLE treasury_cash_flows RENAME COLUMN data_movimento TO data_movimento;
ALTER TABLE treasury_cash_flows RENAME COLUMN descricao_movimento TO descricao_movimento;
ALTER TABLE treasury_cash_flows RENAME COLUMN categoria_movimento TO categoria_movimento;
ALTER TABLE treasury_cash_flows RENAME COLUMN valor_movimento TO valor_movimento;
ALTER TABLE treasury_cash_flows RENAME COLUMN tipo_movimento TO tipo_movimento;
ALTER TABLE treasury_cash_flows RENAME COLUMN observacoes_movimento TO observacoes_movimento;
ALTER TABLE treasury_cash_flows RENAME COLUMN created_by TO criado_por;

-- Treasury Investments
ALTER TABLE treasury_investments RENAME COLUMN nome TO nome;
ALTER TABLE treasury_investments RENAME COLUMN tipo TO tipo;
ALTER TABLE treasury_investments RENAME COLUMN instituicao TO instituicao;
ALTER TABLE treasury_investments RENAME COLUMN data_aplicacao TO data_aplicacao;
ALTER TABLE treasury_investments RENAME COLUMN data_vencimento TO data_vencimento;
ALTER TABLE treasury_investments RENAME COLUMN valor_aplicado TO valor_aplicado;
ALTER TABLE treasury_investments RENAME COLUMN valor_atual TO valor_atual;
ALTER TABLE treasury_investments RENAME COLUMN rentabilidade_anual TO rentabilidade_anual;
ALTER TABLE treasury_investments RENAME COLUMN indexador TO indexador;
ALTER TABLE treasury_investments RENAME COLUMN observacoes TO observacoes;
ALTER TABLE treasury_investments RENAME COLUMN created_at TO criado_em;
ALTER TABLE treasury_investments RENAME COLUMN updated_at TO atualizado_em;

-- Treasury Loans
ALTER TABLE treasury_loans RENAME COLUMN nome TO nome;
ALTER TABLE treasury_loans RENAME COLUMN credor TO credor;
ALTER TABLE treasury_loans RENAME COLUMN data_contratacao TO data_contratacao;
ALTER TABLE treasury_loans RENAME COLUMN data_vencimento TO data_vencimento;
ALTER TABLE treasury_loans RENAME COLUMN valor_original TO valor_original;
ALTER TABLE treasury_loans RENAME COLUMN valor_saldo TO valor_saldo;
ALTER TABLE treasury_loans RENAME COLUMN taxa_juros TO taxa_juros;
ALTER TABLE treasury_loans RENAME COLUMN tipo_juros TO tipo_juros;
ALTER TABLE treasury_loans RENAME COLUMN total_parcelas TO total_parcelas;
ALTER TABLE treasury_loans RENAME COLUMN parcelas_pagas TO parcelas_pagas;
ALTER TABLE treasury_loans RENAME COLUMN parcelas TO parcelas;
ALTER TABLE treasury_loans RENAME COLUMN observacoes TO observacoes;

-- Treasury Forecasts
ALTER TABLE treasury_forecasts RENAME COLUMN tipo TO tipo;
ALTER TABLE treasury_forecasts RENAME COLUMN saldo_inicial TO saldo_inicial;
ALTER TABLE treasury_forecasts RENAME COLUMN entradas_previstas TO entradas_previstas;
ALTER TABLE treasury_forecasts RENAME COLUMN saidas_previstas TO saidas_previstas;
ALTER TABLE treasury_forecasts RENAME COLUMN saldo_final_previsto TO saldo_final_previsto;
ALTER TABLE treasury_forecasts RENAME COLUMN entradas_realizadas TO entradas_realizadas;
ALTER TABLE treasury_forecasts RENAME COLUMN saidas_realizadas TO saidas_realizadas;
ALTER TABLE treasury_forecasts RENAME COLUMN saldo_final_real TO saldo_final_real;
ALTER TABLE treasury_forecasts RENAME COLUMN precisao TO precisao;
ALTER TABLE treasury_forecasts RENAME COLUMN detalhes TO detalhes;
ALTER TABLE treasury_forecasts RENAME COLUMN created_by TO criado_por;

-- Treasury Financial Positions (não migrar - derivadas)

-- Bank Reconciliations
ALTER TABLE bank_reconciliations RENAME COLUMN data_conciliacao TO data_conciliacao;
ALTER TABLE bank_reconciliations RENAME COLUMN saldo_inicial TO saldo_inicial;
ALTER TABLE bank_reconciliations RENAME COLUMN saldo_final TO saldo_final;
ALTER TABLE bank_reconciliations RENAME COLUMN total_creditos TO total_creditos;
ALTER TABLE bank_reconciliations RENAME COLUMN total_debitos TO total_debitos;
ALTER TABLE bank_reconciliations RENAME COLUMN divergencias TO divergencias;
ALTER TABLE bank_reconciliations RENAME COLUMN reconcilied_by TO conciliado_por;
ALTER TABLE bank_reconciliations RENAME COLUMN observacoes TO observacoes;

-- LGPD Policies
ALTER TABLE lgpd_policies RENAME COLUMN version TO versao;
ALTER TABLE lgpd_policies RENAME COLUMN title TO titulo;
ALTER TABLE lgpd_policies RENAME COLUMN content TO conteudo;
ALTER TABLE lgpd_policies RENAME COLUMN effective_date TO data_vigencia;
ALTER TABLE lgpd_policies RENAME COLUMN is_active TO esta_ativa;
ALTER TABLE lgpd_policies RENAME COLUMN required TO obrigatorio;
ALTER TABLE lgpd_policies RENAME COLUMN created_at TO criado_em;
ALTER TABLE lgpd_policies RENAME COLUMN updated_at TO atualizado_em;

-- LGPD Consent Logs
ALTER TABLE lgpd_consent_logs RENAME COLUMN member_id TO membro_id;
ALTER TABLE lgpd_consent_logs RENAME COLUMN policy_id TO politica_id;
ALTER TABLE lgpd_consent_logs RENAME COLUMN consent_type TO tipo_consentimento;
ALTER TABLE lgpd_consent_logs RENAME COLUMN ip_address TO endereco_ip;
ALTER TABLE lgpd_consent_logs RENAME COLUMN consent_date TO data_consentimento;
ALTER TABLE lgpd_consent_logs RENAME COLUMN created_at TO criado_em;

-- Events
ALTER TABLE events RENAME COLUMN title TO titulo;
ALTER TABLE events RENAME COLUMN description TO descricao;
ALTER TABLE events RENAME COLUMN event_date TO data_evento;
ALTER TABLE events RENAME COLUMN event_time TO hora_evento;
ALTER TABLE events RENAME COLUMN end_date TO data_fim;
ALTER TABLE events RENAME COLUMN end_time TO hora_fim;
ALTER TABLE events RENAME COLUMN local_evento TO local_evento;
ALTER TABLE events RENAME COLUMN event_type TO tipo_evento;
ALTER TABLE events RENAME COLUMN status TO situacao;
ALTER TABLE events RENAME COLUMN max_presentes TO maximo_presentes;
ALTER TABLE events RENAME COLUMN present_count TO quantidade_presentes;
ALTER TABLE events RENAME COLUMN is_public TO eh_publico;

-- Cash Movements
ALTER TABLE cash_movements RENAME COLUMN type TO tipo;
ALTER TABLE cash_movements RENAME COLUMN amount TO valor;
ALTER TABLE cash_movements RENAME COLUMN reason TO motivo;
ALTER TABLE cash_movements RENAME COLUMN document_number TO numero_documento;
ALTER TABLE cash_movements RENAME COLUMN responsible TO responsavel;
ALTER TABLE cash_movements RENAME COLUMN authorized_by TO autorizado_por;
ALTER TABLE cash_movements RENAME COLUMN created_at TO criado_em;
ALTER TABLE cash_movements RENAME COLUMN updated_at TO atualizado_em;

-- Cash Closings
ALTER TABLE cash_closings RENAME COLUMN account_id TO conta_id;
ALTER TABLE cash_closings RENAME COLUMN opening_balance TO saldo_inicial;
ALTER TABLE cash_closings RENAME COLUMN total_inflows TO total_entradas;
ALTER TABLE cash_closings RENAME COLUMN total_outflows TO total_saidas;
ALTER TABLE cash_closings RENAME COLUMN expected_balance TO saldo_esperado;
ALTER TABLE cash_closings RENAME COLUMN actual_balance TO saldo_real;
ALTER TABLE cash_closings RENAME COLUMN difference TO diferenca;
ALTER TABLE cash_closings RENAME COLUMN status TO situacao;
ALTER TABLE cash_closings RENAME COLUMN observations TO observacoes;
ALTER TABLE cash_closings RENAME COLUMN closed_by TO fechado_por;
ALTER TABLE cash_closings RENAME COLUMN closed_at TO fechado_em;
ALTER TABLE cash_closings RENAME COLUMN created_at TO criado_em;

-- Member Contributions
ALTER TABLE member_contributions RENAME COLUMN member_id TO membro_id;
ALTER TABLE member_contributions RENAME COLUMN value TO valor;
ALTER TABLE member_contributions RENAME COLUMN date TO data_contribuicao;
ALTER TABLE member_contributions RENAME COLUMN type TO tipo;
ALTER TABLE member_contributions RENAME COLUMN description TO descricao;

-- Member Dependents
ALTER TABLE member_dependents RENAME COLUMN member_id TO membro_id;
ALTER TABLE member_dependents RENAME COLUMN name TO nome;
ALTER TABLE member_dependents RENAME COLUMN birth_date TO data_nascimento;
ALTER TABLE member_dependents RENAME COLUMN relationship TO parentesco;
ALTER TABLE member_dependents RENAME COLUMN cpf TO cpf;

-- Accounting Entries
ALTER TABLE accounting_entries RENAME COLUMN entry_number TO numero_lancamento;
ALTER TABLE accounting_entries RENAME COLUMN date TO data_lancamento;
ALTER TABLE accounting_entries RENAME COLUMN document_number TO numero_documento;
ALTER TABLE accounting_entries RENAME COLUMN history TO historico;
ALTER TABLE accounting_entries RENAME COLUMN debit_value TO valor_debito;
ALTER TABLE accounting_entries RENAME COLUMN credit_value TO valor_credito;
ALTER TABLE accounting_entries RENAME COLUMN contra_account TO conta_contrapartida;
ALTER TABLE accounting_entries RENAME COLUMN created_at TO criado_em;
ALTER TABLE accounting_entries RENAME COLUMN created_by TO criado_por;
ALTER TABLE accounting_entries RENAME COLUMN reviewed_by TO revisado_por;

-- Accounting Configs
ALTER TABLE accounting_configs RENAME COLUMN fiscal_year TO ano_fiscal;
ALTER TABLE accounting_configs RENAME COLUMN start_month TO mes_inicio;
ALTER TABLE accounting_configs RENAME COLUMN end_month TO mes_fim;
ALTER TABLE accounting_configs RENAME COLUMN currency TO moeda;
ALTER TABLE accounting_configs RENAME COLUMN tax_regime TO regime_tributario;
ALTER TABLE accounting_configs RENAME COLUMN created_at TO criado_em;
ALTER TABLE accounting_configs RENAME COLUMN updated_at TO atualizado_em;

-- Account Balances
ALTER TABLE account_balances RENAME COLUMN account_id TO conta_id;
ALTER TABLE account_balances RENAME COLUMN entries_count TO quantidade_lancamentos;

-- Tax Configs
ALTER TABLE tax_configs RENAME COLUMN inss_brackets TO faixa_inss;
ALTER TABLE tax_configs RENAME COLUMN irrf_brackets TO faixa_irrf;
ALTER TABLE tax_configs RENAME COLUMN fgts_rate TO taxa_fgts;
ALTER TABLE tax_configs RENAME COLUMN patronal_rate TO taxa_patronal;
ALTER TABLE tax_configs RENAME COLUMN rat_rate TO taxa_rat;
ALTER TABLE tax_configs RENAME COLUMN terceros_rate TO taxa_terceiros;
ALTER TABLE tax_configs RENAME COLUMN default_va TO va_default;
ALTER TABLE tax_configs RENAME COLUMN default_vr TO vr_default;
ALTER TABLE tax_configs RENAME COLUMN third_party_entities TO entidades_terceiras;
ALTER TABLE tax_configs RENAME COLUMN created_at TO criado_em;
ALTER TABLE tax_configs RENAME COLUMN updated_at TO atualizado_em;

-- Bank Statement Transactions
ALTER TABLE bank_statement_transactions RENAME COLUMN date TO data;
ALTER TABLE bank_statement_transactions RENAME COLUMN description TO descricao;
ALTER TABLE bank_statement_transactions RENAME COLUMN value TO valor;
ALTER TABLE bank_statement_transactions RENAME COLUMN type TO tipo;
ALTER TABLE bank_statement_transactions RENAME COLUMN account_id TO conta_id;
ALTER TABLE bank_statement_transactions RENAME COLUMN reconcilied TO conciliado;
ALTER TABLE bank_statement_transactions RENAME COLUMN transaction_id TO transacao_id;
ALTER TABLE bank_statement_transactions RENAME COLUMN originating TO origem;
ALTER TABLE bank_statement_transactions RENAME COLUMN external_id TO id_externo;
ALTER TABLE bank_statement_transactions RENAME COLUMN created_at TO criado_em;

-- Migração concluída com sucesso!