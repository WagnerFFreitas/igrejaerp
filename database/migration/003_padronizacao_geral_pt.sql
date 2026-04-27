-- ============================================================================
-- MIGRAÇÃO: Padronização Geral (Sincronização Frontend <-> DB)
-- ============================================================================

BEGIN;

-- 1. TABELA: members (Membros)
-- Renomear colunas existentes para o padrão PT
ALTER TABLE members RENAME COLUMN name TO nome;
ALTER TABLE members RENAME COLUMN birth_date TO data_nascimento; -- Ajustar se estiver como birth_date
ALTER TABLE members RENAME COLUMN status TO situacao;
ALTER TABLE members RENAME COLUMN marital_status TO estado_civil;
ALTER TABLE members RENAME COLUMN gender TO sexo;
ALTER TABLE members RENAME COLUMN zip_code TO cep;
ALTER TABLE members RENAME COLUMN street TO logradouro;
ALTER TABLE members RENAME COLUMN number TO numero;
ALTER TABLE members RENAME COLUMN complement TO complemento;
ALTER TABLE members RENAME COLUMN neighborhood TO bairro;
ALTER TABLE members RENAME COLUMN city TO cidade;
ALTER TABLE members RENAME COLUMN state TO estado;

-- Adicionar colunas faltantes identificadas no Frontend
ALTER TABLE members ADD COLUMN IF NOT EXISTS matricula TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS profissao TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS nome_conjuge TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS data_casamento DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS nome_pai TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS nome_mae TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS tipo_sanguineo TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS contato_emergencia TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS data_conversao DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS local_conversao TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS data_batismo DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS igreja_batismo TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS pastor_batismo TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS batismo_espirito_santo BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS data_membro DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS igreja_origem TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS curso_discipulado TEXT; -- 'NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO'
ALTER TABLE members ADD COLUMN IF NOT EXISTS escola_biblica TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS ministerio_principal TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS funcao_ministerio TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS outros_ministerios JSONB DEFAULT '[]'::jsonb;
ALTER TABLE members ADD COLUMN IF NOT EXISTS cargo_eclesiastico TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS data_consagracao DATE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS eh_dizimista BOOLEAN DEFAULT TRUE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS eh_doador_regular BOOLEAN DEFAULT TRUE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS participa_campanhas BOOLEAN DEFAULT FALSE;
ALTER TABLE members ADD COLUMN IF NOT EXISTS banco TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS agencia_bancaria TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS conta_bancaria TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS chave_pix TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS necessidades_especiais TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS talentos TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE members ADD COLUMN IF NOT EXISTS familia_id UUID;
ALTER TABLE members ADD COLUMN IF NOT EXISTS dons_espirituais TEXT;
ALTER TABLE members ADD COLUMN IF NOT EXISTS celula_grupo TEXT;

-- 2. TABELA: users (Usuários/Autenticação)
ALTER TABLE users RENAME COLUMN name TO nome;
ALTER TABLE users RENAME COLUMN username TO nome_usuario;
ALTER TABLE users RENAME COLUMN role TO perfil;
ALTER TABLE users ADD COLUMN IF NOT EXISTS acesso_irrestrito BOOLEAN DEFAULT FALSE;

-- 3. TABELA: units (Unidades/Igrejas)
ALTER TABLE units RENAME COLUMN name TO nome;
ALTER TABLE units RENAME COLUMN is_headquarter TO eh_sede;
ALTER TABLE units RENAME COLUMN phone TO telefone;

-- 4. TABELA: employees (Funcionários / RH estendido)
ALTER TABLE employees RENAME COLUMN is_active TO ativo;
ALTER TABLE employees RENAME COLUMN employee_name TO nome_funcionario;
ALTER TABLE employees RENAME COLUMN admission_date TO data_admissao;
ALTER TABLE employees RENAME COLUMN salary TO salario_base;
ALTER TABLE employees RENAME COLUMN work_hours TO carga_horaria_semanal;
-- Novos campos baseados na interface Payroll do Frontend
ALTER TABLE employees ADD COLUMN IF NOT EXISTS pis TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS ctps TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS titulo_eleitor TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS reservista TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS data_exame_admissional DATE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS tipo_contrato TEXT; -- 'CLT', 'PJ', etc
ALTER TABLE employees ADD COLUMN IF NOT EXISTS regime_trabalho TEXT; -- 'PRESENCIAL', 'REMOTO'
ALTER TABLE employees ADD COLUMN IF NOT EXISTS cbo TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS banco TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS agencia TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS conta TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS chave_pix TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS vt_optante BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS va_optante BOOLEAN DEFAULT FALSE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS esocial_categoria TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS cnh_numero TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS cnh_vencimento DATE;

-- 5. TABELA: payroll_periods (Períodos de Folha)
ALTER TABLE payroll_periods RENAME COLUMN month TO mes;
ALTER TABLE payroll_periods RENAME COLUMN year TO ano;
ALTER TABLE payroll_periods RENAME COLUMN status TO situacao;
ALTER TABLE payroll_periods RENAME COLUMN start_date TO data_inicio;
ALTER TABLE payroll_periods RENAME COLUMN end_date TO data_fim;
ALTER TABLE payroll_periods RENAME COLUMN processed_at TO processado_em;
ALTER TABLE payroll_periods RENAME COLUMN total_employees TO total_funcionarios;
ALTER TABLE payroll_periods RENAME COLUMN total_payroll TO total_folha;
ALTER TABLE payroll_periods RENAME COLUMN created_by TO criado_por;

-- 6. TABELA: employee_leaves (Afastamentos)
ALTER TABLE employee_leaves RENAME COLUMN employee_id TO funcionario_id;
ALTER TABLE employee_leaves RENAME COLUMN start_date TO data_inicio;
ALTER TABLE employee_leaves RENAME COLUMN end_date TO data_fim;
ALTER TABLE employee_leaves RENAME COLUMN doctor_name TO nome_medico;
ALTER TABLE employee_leaves RENAME COLUMN status TO situacao;

-- 7. TABELA: transactions (Financeiro)
ALTER TABLE transactions RENAME COLUMN description TO descricao;
ALTER TABLE transactions RENAME COLUMN amount TO valor;
ALTER TABLE transactions RENAME COLUMN type TO tipo;
ALTER TABLE transactions RENAME COLUMN competency_date TO data_competencia;
ALTER TABLE transactions RENAME COLUMN account_id TO conta_id;
ALTER TABLE transactions RENAME COLUMN date TO data_transacao;
ALTER TABLE transactions RENAME COLUMN due_date TO data_vencimento;
ALTER TABLE transactions RENAME COLUMN payment_date TO data_pagamento;
ALTER TABLE transactions RENAME COLUMN status TO situacao;
ALTER TABLE transactions RENAME COLUMN payment_method TO forma_pagamento;
ALTER TABLE transactions RENAME COLUMN category TO categoria;
ALTER TABLE transactions RENAME COLUMN operation_nature TO natureza_operacao;
ALTER TABLE transactions RENAME COLUMN cost_center TO centro_custo;
ALTER TABLE transactions RENAME COLUMN member_id TO membro_id;
ALTER TABLE transactions RENAME COLUMN is_installment TO eh_parcelado;
ALTER TABLE transactions RENAME COLUMN installment_number TO numero_parcela;
ALTER TABLE transactions RENAME COLUMN total_installments TO total_parcelas;
ALTER TABLE transactions RENAME COLUMN parent_id TO pai_id;
ALTER TABLE transactions RENAME COLUMN is_conciliated TO conciliado;
ALTER TABLE transactions RENAME COLUMN project_id TO projeto_id;

-- 8. TABELA: financial_accounts (Contas Bancárias/Caixas)
ALTER TABLE financial_accounts RENAME COLUMN name TO nome;
ALTER TABLE financial_accounts RENAME COLUMN type TO tipo;
ALTER TABLE financial_accounts RENAME COLUMN current_balance TO saldo_atual;
ALTER TABLE financial_accounts RENAME COLUMN status TO situacao;
ALTER TABLE financial_accounts RENAME COLUMN bank_code TO codigo_banco;
ALTER TABLE financial_accounts RENAME COLUMN account_number TO numero_conta;

-- 4. TABELA: assets (Patrimônio)
ALTER TABLE assets RENAME COLUMN name TO nome;
ALTER TABLE assets RENAME COLUMN description TO descricao;
ALTER TABLE assets RENAME COLUMN category TO categoria;
ALTER TABLE assets RENAME COLUMN acquisition_date TO data_aquisicao;
ALTER TABLE assets RENAME COLUMN acquisition_value TO valor_aquisicao;
ALTER TABLE assets RENAME COLUMN location TO localizacao;
ALTER TABLE assets RENAME COLUMN status TO situacao;
-- Novos campos para depreciação e controle fino
ALTER TABLE assets ADD COLUMN IF NOT EXISTS valor_atual DECIMAL(12,2);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS fornecedor TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS numero_nota_fiscal TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS numero_serie TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS marca TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS modelo TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS responsavel TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS vida_util_meses INTEGER;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS taxa_depreciacao DECIMAL(5,2);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS metodo_depreciacao TEXT; -- 'LINEAR', etc
ALTER TABLE assets ADD COLUMN IF NOT EXISTS valor_contabil_atual DECIMAL(12,2);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS depreciacao_acumulada DECIMAL(12,2);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS data_ultimo_inventario DATE;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS numero_patrimonio TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS condicao TEXT; -- 'NOVO', 'BOM', etc

-- Adicionar campos de endereço detalhados no Patrimônio (conforme Recomendação 3 do Relatório de Auditoria)
ALTER TABLE assets ADD COLUMN IF NOT EXISTS cep TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS logradouro TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS numero TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS complemento TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS bairro TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS cidade TEXT;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS estado TEXT;

-- 10. TABELA: church_events (Agenda/Eventos)
ALTER TABLE church_events RENAME COLUMN title TO titulo;
ALTER TABLE church_events RENAME COLUMN description TO descricao;
ALTER TABLE church_events RENAME COLUMN date TO data;
ALTER TABLE church_events RENAME COLUMN time TO hora;
ALTER TABLE church_events RENAME COLUMN location TO local;
ALTER TABLE church_events RENAME COLUMN attendees_count TO qtd_participantes;
ALTER TABLE church_events RENAME COLUMN type TO tipo;
ALTER TABLE church_events RENAME COLUMN is_recurring TO eh_recorrente;
ALTER TABLE church_events RENAME COLUMN recurrence_pattern TO padrao_recorrencia;
ALTER TABLE church_events RENAME COLUMN parent_event_id TO evento_pai_id;
-- Escala de voluntários em JSONB para flexibilidade inicial
ALTER TABLE church_events ADD COLUMN IF NOT EXISTS escala_voluntarios JSONB DEFAULT '[]'::jsonb;

-- 11. TABELA: audit_logs (Auditoria)
ALTER TABLE audit_logs RENAME COLUMN user_id TO usuario_id;
ALTER TABLE audit_logs RENAME COLUMN user_name TO nome_usuario;
ALTER TABLE audit_logs RENAME COLUMN action TO acao;
ALTER TABLE audit_logs RENAME COLUMN entity TO entidade;
ALTER TABLE audit_logs RENAME COLUMN entity_id TO entidade_id;
ALTER TABLE audit_logs RENAME COLUMN entity_name TO nome_entidade;
ALTER TABLE audit_logs RENAME COLUMN date TO data;
ALTER TABLE audit_logs RENAME COLUMN error_message TO mensagem_erro;
ALTER TABLE audit_logs RENAME COLUMN previous_hash TO hash_anterior;
ALTER TABLE audit_logs RENAME COLUMN immutable TO imutavel;

-- 12. TABELAS DE CONTABILIDADE (Accounting)
ALTER TABLE chart_of_accounts RENAME COLUMN code TO codigo;
ALTER TABLE chart_of_accounts RENAME COLUMN name TO nome;
ALTER TABLE chart_of_accounts RENAME COLUMN nature TO natureza;
ALTER TABLE chart_of_accounts RENAME COLUMN type TO tipo;
ALTER TABLE chart_of_accounts RENAME COLUMN parent_id TO pai_id;
ALTER TABLE chart_of_accounts RENAME COLUMN is_active TO ativo;

-- 13. CAMPOS DE AUDITORIA PADRÃO (Aplicar em todas as tabelas principais)
-- Exemplo para uma tabela, replicar para as outras conforme necessário
-- ALTER TABLE members RENAME COLUMN created_at TO criado_em;
-- ALTER TABLE members RENAME COLUMN updated_at TO atualizado_em;

COMMIT;