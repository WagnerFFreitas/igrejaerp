-- =====================================================
-- MIGRAÇÃO IGREJAERP: Padronização Final de Membros
-- Renomear tabelas relacionadas e colunas residuais
-- =====================================================

BEGIN;

-- 1. Renomear Tabelas Relacionadas
ALTER TABLE dependents RENAME TO dependentes;
ALTER TABLE member_contributions RENAME TO contribuicoes_membros;

-- 2. Padronizar Colunas na Tabela 'membros'
ALTER TABLE membros RENAME COLUMN cell_group TO celula;
ALTER TABLE membros RENAME COLUMN is_pcd TO eh_pcd;
ALTER TABLE membros RENAME COLUMN lgpd_consent TO consentimento_lgpd;

-- 3. Criar Views de Compatibilidade (Garante que o sistema não quebre)
CREATE OR REPLACE VIEW dependents AS SELECT * FROM dependentes;
CREATE OR REPLACE VIEW member_contributions AS SELECT * FROM contribuicoes_membros;

-- 4. Atualizar a View principal 'members' para refletir as novas colunas
DROP VIEW IF EXISTS members;
CREATE OR REPLACE VIEW members AS
SELECT
    id, unidade_id AS unit_id, matricula, nome AS name, cpf, rg, email, telefone AS phone, whatsapp,
    profissao AS profession, funcao AS role, status, data_nascimento AS birth_date, sexo AS gender,
    estado_civil AS marital_status, nome_conjuge AS spouse_name, data_casamento AS marriage_date,
    nome_pai AS father_name, nome_mae AS mother_name, tipo_sanguineo AS blood_type,
    contato_emergencia AS emergency_contact, cep AS zip_code, logradouro AS street,
    numero AS number, complemento AS complement, bairro AS neighborhood, cidade AS city,
    estado AS state, data_conversao AS conversion_date, local_conversao AS conversion_place,
    data_batismo AS baptism_date, igreja_batismo AS baptism_church, pastor_batizador AS baptizing_pastor,
    batismo_espirito_santo AS holy_spirit_baptism, data_membro AS membership_date,
    igreja_origem AS church_of_origin, curso_discipulado AS discipleship_course,
    escola_biblica AS biblical_school, ministerio_principal AS main_ministry,
    funcao_ministerio AS ministry_role, outros_ministerios AS other_ministries,
    cargo_eclesiastico AS ecclesiastical_position, data_consagracao AS consecration_date,
    eh_dizimista AS is_tithable, eh_ofertante_regular AS is_regular_giver,
    participa_campanhas AS participates_campaigns, banco AS bank,
    agencia_bancaria AS bank_agency, conta_bancaria AS bank_account, chave_pix AS pix_key,
    observacoes AS observations, necessidades_especiais AS special_needs, talentos AS talents,
    tags, familia_id AS family_id, avatar, profile_data, dons_espirituais, escolaridade,
    eh_pcd AS is_pcd, tipo_deficiencia, celular, consentimento_lgpd AS lgpd_consent,
    celula AS cell_group, criado_em AS created_at, atualizado_em AS updated_at
FROM membros;

COMMIT;
