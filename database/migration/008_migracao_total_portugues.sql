-- ============================================================================
-- MIGRAÇÃO GLOBAL V4: APLICAÇÃO FINAL E LIMPEZA DE LEGADO
-- ============================================================================

BEGIN;

-- 1. UNIDADES (Units -> unidades)
ALTER TABLE IF EXISTS units RENAME TO unidades;
ALTER TABLE unidades RENAME COLUMN name TO nome;
ALTER TABLE unidades RENAME COLUMN is_headquarter TO eh_sede;
ALTER TABLE unidades RENAME COLUMN phone TO telefone;

-- 2. USUÁRIOS (Users -> usuarios)
ALTER TABLE IF EXISTS users RENAME TO usuarios;
ALTER TABLE usuarios RENAME COLUMN name TO nome;
ALTER TABLE usuarios RENAME COLUMN username TO nome_usuario;
ALTER TABLE usuarios RENAME COLUMN role TO perfil;
ALTER TABLE usuarios RENAME COLUMN unit_id TO unidade_id;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS acesso_irrestrito BOOLEAN DEFAULT FALSE;

-- 3. MEMBROS (Members -> membros)
ALTER TABLE IF EXISTS members RENAME TO membros;
ALTER TABLE membros RENAME COLUMN unit_id TO unidade_id;
ALTER TABLE membros RENAME COLUMN name TO nome;
ALTER TABLE membros RENAME COLUMN birth_date TO data_nascimento;
ALTER TABLE membros RENAME COLUMN status TO situacao;
ALTER TABLE membros RENAME COLUMN marital_status TO estado_civil;
ALTER TABLE membros RENAME COLUMN gender TO sexo;
ALTER TABLE membros RENAME COLUMN zip_code TO cep;
ALTER TABLE membros RENAME COLUMN street TO logradouro;
ALTER TABLE membros RENAME COLUMN number TO numero;
ALTER TABLE membros RENAME COLUMN complement TO complemento;
ALTER TABLE membros RENAME COLUMN neighborhood TO bairro;
ALTER TABLE membros RENAME COLUMN city TO cidade;
ALTER TABLE membros RENAME COLUMN state TO estado; -- Corrigido para consistência

-- Remover colunas não utilizadas (conforme Plano de Correção 19/04/2026)
ALTER TABLE membros DROP COLUMN IF EXISTS grupo_pequeno;
ALTER TABLE membros DROP COLUMN IF EXISTS cargo_igreja;
ALTER TABLE membros DROP COLUMN IF EXISTS ministerio;
ALTER TABLE membros DROP COLUMN IF EXISTS data_membro; 
ALTER TABLE membros DROP COLUMN IF EXISTS "cellGroup"; -- Removendo campo legado case-sensitive

-- Adicionar campos de Membros faltantes no DB
ALTER TABLE membros ADD COLUMN IF NOT EXISTS matricula TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS profissao TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS nome_pai TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS nome_mae TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS tipo_sanguineo TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS contato_emergencia TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS data_conversao DATE;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS data_batismo DATE;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS eh_dizimista BOOLEAN DEFAULT TRUE;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS dons_espirituais TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS eh_ofertante_regular BOOLEAN DEFAULT TRUE;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS participa_campanhas BOOLEAN DEFAULT FALSE;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS curso_discipulado TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS escola_biblica TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS ministerio_principal TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS funcao_ministerio TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS outros_ministerios JSONB DEFAULT '[]'::jsonb;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS cargo_eclesiastico TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS data_consagracao DATE;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS celula TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS lgpd_consentimento JSONB; -- Alinhado com interface
ALTER TABLE membros ADD COLUMN IF NOT EXISTS eh_pcd BOOLEAN DEFAULT FALSE;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS tipo_deficiencia TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS talentos TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS necessidades_especiais TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS nome_conjuge TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS data_casamento DATE;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS batismo_espirito_santo BOOLEAN DEFAULT FALSE;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS igreja_origem TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS dons_espirituais TEXT;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS espiritual_gifts TEXT; -- Removido se duplicado, mas mantendo para mapeamento
ALTER TABLE membros DROP COLUMN IF EXISTS espiritual_gifts;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS whatsapp TEXT;

-- 4. FUNCIONÁRIOS (Employees -> funcionarios)
ALTER TABLE IF EXISTS employees RENAME TO funcionarios;
ALTER TABLE funcionarios RENAME COLUMN unit_id TO unidade_id;
ALTER TABLE funcionarios RENAME COLUMN name TO nome;
ALTER TABLE funcionarios RENAME COLUMN admission_date TO data_admissao;
ALTER TABLE funcionarios RENAME COLUMN salary TO salario_base;
ALTER TABLE funcionarios RENAME COLUMN work_hours TO carga_horaria_semanal;
ALTER TABLE funcionarios RENAME COLUMN active TO ativo;
-- Remover campos legados ou redundantes
ALTER TABLE funcionarios DROP COLUMN IF EXISTS employee_name;

-- Criar tabela de cálculos de folha se não existir (essencial para persistência do motor de cálculo)
CREATE TABLE IF NOT EXISTS calculos_folha (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funcionario_id UUID REFERENCES funcionarios(id),
    mes_competencia VARCHAR(7), -- YYYY-MM
    salario_bruto DECIMAL(15,2),
    total_proventos DECIMAL(15,2),
    total_descontos DECIMAL(15,2),
    salario_liquido DECIMAL(15,2),
    detalhes_calculo JSONB,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar campos detalhados de RH (vistos na interface Payroll do Frontend)
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS pis TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS ctps TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS titulo_eleitor TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS reservista TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS cbo TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS tipo_contrato TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS regime_trabalho TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS banco TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS agencia TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS conta TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS chave_pix TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS vt_optante BOOLEAN DEFAULT FALSE;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS va_optante BOOLEAN DEFAULT FALSE;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS esocial_categoria TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS cnh_numero TEXT;
ALTER TABLE funcionarios ADD COLUMN IF NOT EXISTS cnh_vencimento DATE;

-- 5. FINANCEIRO (Transactions/Financial Accounts)
ALTER TABLE IF EXISTS financial_accounts RENAME TO contas_financeiras;
ALTER TABLE contas_financeiras RENAME COLUMN unit_id TO unidade_id;
ALTER TABLE contas_financeiras RENAME COLUMN name TO nome;
ALTER TABLE contas_financeiras RENAME COLUMN type TO tipo;
ALTER TABLE contas_financeiras RENAME COLUMN current_balance TO saldo_atual;
ALTER TABLE contas_financeiras RENAME COLUMN status TO situacao;

ALTER TABLE IF EXISTS transactions RENAME TO transacoes;
ALTER TABLE transacoes RENAME COLUMN unit_id TO unidade_id;
ALTER TABLE transacoes RENAME COLUMN description TO descricao;
ALTER TABLE transacoes RENAME COLUMN amount TO valor;
ALTER TABLE transacoes RENAME COLUMN date TO data_transacao;
ALTER TABLE transacoes RENAME COLUMN competency_date TO data_competencia;
ALTER TABLE transacoes RENAME COLUMN type TO tipo;
ALTER TABLE transacoes RENAME COLUMN category TO categoria;
ALTER TABLE transacoes RENAME COLUMN cost_center TO centro_custo;
ALTER TABLE transacoes RENAME COLUMN account_id TO conta_id;
ALTER TABLE transacoes RENAME COLUMN status TO situacao;
ALTER TABLE transacoes RENAME COLUMN is_conciliated TO conciliado;
ALTER TABLE transacoes RENAME COLUMN operation_nature TO natureza_operacao;
ALTER TABLE transacoes RENAME COLUMN project_id TO projeto_id;
ALTER TABLE transacoes RENAME COLUMN payment_method TO forma_pagamento;
ALTER TABLE transacoes RENAME COLUMN due_date TO data_vencimento;
ALTER TABLE transacoes RENAME COLUMN paid_amount TO valor_pago;
ALTER TABLE transacoes RENAME COLUMN remaining_amount TO valor_restante;
ALTER TABLE transacoes RENAME COLUMN is_installment TO eh_parcelado;
ALTER TABLE transacoes RENAME COLUMN installment_number TO numero_parcela;
ALTER TABLE transacoes RENAME COLUMN total_installments TO total_parcelas;
ALTER TABLE transacoes RENAME COLUMN parent_id TO pai_id;
ALTER TABLE transacoes ADD COLUMN IF NOT EXISTS conciliado_em TIMESTAMP;
ALTER TABLE transacoes ADD COLUMN IF NOT EXISTS data_conciliacao DATE;
ALTER TABLE transacoes ADD COLUMN IF NOT EXISTS id_externo TEXT;
ALTER TABLE transacoes ADD COLUMN IF NOT EXISTS observacoes TEXT;

-- 6. PATRIMÔNIO (Assets -> patrimonio)
ALTER TABLE IF EXISTS assets RENAME TO patrimonio;
ALTER TABLE patrimonio RENAME COLUMN unit_id TO unidade_id;
ALTER TABLE patrimonio RENAME COLUMN category TO categoria;
ALTER TABLE patrimonio RENAME COLUMN name TO nome;
ALTER TABLE patrimonio RENAME COLUMN description TO descricao;
ALTER TABLE patrimonio RENAME COLUMN acquisition_date TO data_aquisicao;
ALTER TABLE patrimonio RENAME COLUMN acquisition_value TO valor_aquisicao;
ALTER TABLE patrimonio RENAME COLUMN current_value TO valor_atual;
ALTER TABLE patrimonio RENAME COLUMN location TO localizacao;
ALTER TABLE patrimonio RENAME COLUMN responsible TO responsavel;
ALTER TABLE patrimonio RENAME COLUMN status TO situacao;
ALTER TABLE patrimonio RENAME COLUMN asset_number TO numero_patrimonio;
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS vida_util_meses INTEGER;
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS taxa_depreciacao DECIMAL(5,2);
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS metodo_depreciacao TEXT;
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS valor_contabil_atual DECIMAL(15,2);
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS depreciacao_acumulada DECIMAL(15,2);
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS condicao TEXT;

-- Campos de endereço para Patrimônio (conforme Relatório de Auditoria)
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS cep TEXT;
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS logradouro TEXT;
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS numero TEXT;
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS complemento TEXT;
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS bairro TEXT;
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS cidade TEXT;
ALTER TABLE patrimonio ADD COLUMN IF NOT EXISTS estado TEXT;

-- 7. EVENTOS E AGENDA (Church Events -> eventos)
ALTER TABLE IF EXISTS church_events RENAME TO eventos;
ALTER TABLE eventos RENAME COLUMN unit_id TO unidade_id;
ALTER TABLE eventos RENAME COLUMN title TO titulo;
ALTER TABLE eventos RENAME COLUMN description TO descricao;
ALTER TABLE eventos RENAME COLUMN date TO data;
ALTER TABLE eventos RENAME COLUMN time TO hora;
ALTER TABLE eventos RENAME COLUMN location TO local;
ALTER TABLE eventos RENAME COLUMN attendees_count TO qtd_participantes;
ALTER TABLE eventos RENAME COLUMN type TO tipo;
ALTER TABLE eventos RENAME COLUMN is_recurring TO eh_recorrente;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS escala_voluntarios JSONB DEFAULT '[]'::jsonb;

-- 8. AFASTAMENTOS (Employee Leaves -> afastamentos)
ALTER TABLE IF EXISTS employee_leaves RENAME TO afastamentos;
ALTER TABLE afastamentos RENAME COLUMN unit_id TO unidade_id;
ALTER TABLE afastamentos RENAME COLUMN employee_id TO funcionario_id;
ALTER TABLE afastamentos RENAME COLUMN start_date TO data_inicio;
ALTER TABLE afastamentos RENAME COLUMN end_date TO data_fim;
ALTER TABLE afastamentos RENAME COLUMN status TO situacao;

-- 9. FOLHA DE PAGAMENTO (Payroll Periods)
ALTER TABLE IF EXISTS payroll_periods RENAME TO periodos_folha;
ALTER TABLE periodos_folha RENAME COLUMN month TO mes;
ALTER TABLE periodos_folha RENAME COLUMN year TO ano;
ALTER TABLE periodos_folha RENAME COLUMN status TO situacao;
ALTER TABLE periodos_folha RENAME COLUMN start_date TO data_inicio;
ALTER TABLE periodos_folha RENAME COLUMN end_date TO data_fim;
ALTER TABLE periodos_folha RENAME COLUMN processed_at TO processado_em;

-- 10. AUDITORIA (Audit Logs -> logs_auditoria)
ALTER TABLE IF EXISTS audit_logs RENAME TO logs_auditoria;
ALTER TABLE logs_auditoria RENAME COLUMN unit_id TO unidade_id;
ALTER TABLE logs_auditoria RENAME COLUMN user_id TO usuario_id;
ALTER TABLE logs_auditoria RENAME COLUMN user_name TO nome_usuario;
ALTER TABLE logs_auditoria RENAME COLUMN action TO acao;
ALTER TABLE logs_auditoria RENAME COLUMN entity TO entidade;
ALTER TABLE logs_auditoria RENAME COLUMN entity_id TO entidade_id;
ALTER TABLE logs_auditoria RENAME COLUMN date TO data;
ALTER TABLE logs_auditoria RENAME COLUMN ip TO endereco_ip;
ALTER TABLE logs_auditoria RENAME COLUMN user_agent TO agente_usuario;
ALTER TABLE logs_auditoria ADD COLUMN IF NOT EXISTS sucesso BOOLEAN;
ALTER TABLE logs_auditoria ADD COLUMN IF NOT EXISTS mensagem_erro TEXT;
ALTER TABLE logs_auditoria ADD COLUMN IF NOT EXISTS hash_anterior TEXT;

-- 11. CONTABILIDADE (Chart of Accounts -> plano_contas)
ALTER TABLE IF EXISTS chart_of_accounts RENAME TO plano_contas;
ALTER TABLE plano_contas RENAME COLUMN code TO codigo;
ALTER TABLE plano_contas RENAME COLUMN name TO nome;
ALTER TABLE plano_contas RENAME COLUMN nature TO natureza;
ALTER TABLE plano_contas RENAME COLUMN type TO tipo;
ALTER TABLE plano_contas RENAME COLUMN parent_id TO pai_id;
ALTER TABLE plano_contas RENAME COLUMN is_active TO ativo;

COMMIT;