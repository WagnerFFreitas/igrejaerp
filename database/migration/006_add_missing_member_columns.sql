-- =====================================================
-- MIGRAÇÃO IGREJAERP: Adicionar colunas faltantes (PT)
-- =====================================================

ALTER TABLE membros ADD COLUMN IF NOT EXISTS dons_espirituais VARCHAR(255);
ALTER TABLE membros ADD COLUMN IF NOT EXISTS escolaridade VARCHAR(100);
ALTER TABLE membros ADD COLUMN IF NOT EXISTS is_pcd BOOLEAN DEFAULT false;
ALTER TABLE membros ADD COLUMN IF NOT EXISTS tipo_deficiencia VARCHAR(100);
ALTER TABLE membros ADD COLUMN IF NOT EXISTS celular VARCHAR(20);
ALTER TABLE membros ADD COLUMN IF NOT EXISTS lgpd_consent JSONB DEFAULT '{}'::jsonb;

-- Atualizar a view de compatibilidade para incluir os novos campos
DROP VIEW IF EXISTS members;
CREATE VIEW members AS
SELECT
    id,
    unidade_id AS unit_id,
    matricula,
    nome AS name,
    cpf,
    rg,
    email,
    telefone AS phone,
    whatsapp,
    profissao AS profession,
    funcao AS role,
    status,
    data_nascimento AS birth_date,
    sexo AS gender,
    estado_civil AS marital_status,
    nome_conjuge AS spouse_name,
    data_casamento AS marriage_date,
    nome_pai AS father_name,
    nome_mae AS mother_name,
    tipo_sanguineo AS blood_type,
    contato_emergencia AS emergency_contact,
    cep AS zip_code,
    logradouro AS street,
    numero AS number,
    complemento AS complement,
    bairro AS neighborhood,
    cidade AS city,
    estado AS state,
    data_conversao AS conversion_date,
    local_conversao AS conversion_place,
    data_batismo AS baptism_date,
    igreja_batismo AS baptism_church,
    pastor_batizador AS baptizing_pastor,
    batismo_espirito_santo AS holy_spirit_baptism,
    data_membro AS membership_date,
    igreja_origem AS church_of_origin,
    curso_discipulado AS discipleship_course,
    escola_biblica AS biblical_school,
    ministerio_principal AS main_ministry,
    funcao_ministerio AS ministry_role,
    outros_ministerios AS other_ministries,
    cargo_eclesiastico AS ecclesiastical_position,
    data_consagracao AS consecration_date,
    eh_dizimista AS is_tithable,
    eh_ofertante_regular AS is_regular_giver,
    participa_campanhas AS participates_campaigns,
    banco AS bank,
    agencia_bancaria AS bank_agency,
    conta_bancaria AS bank_account,
    chave_pix AS pix_key,
    observacoes AS observations,
    necessidades_especiais AS special_needs,
    talentos AS talents,
    tags,
    familia_id AS family_id,
    avatar,
    profile_data,
    dons_espirituais,
    escolaridade,
    is_pcd,
    tipo_deficiencia,
    celular,
    lgpd_consent,
    criado_em AS created_at,
    atualizado_em AS updated_at
FROM membros;
