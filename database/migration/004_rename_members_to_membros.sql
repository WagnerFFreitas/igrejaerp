-- =====================================================
-- MIGRAÇÃO IGREJAERP: members -> membros
-- Padronização da tabela de membros para o português
-- =====================================================

-- 1. Renomear a tabela principal
ALTER TABLE members RENAME TO membros;

-- 2. Renomear colunas para o português (snake_case)
ALTER TABLE membros RENAME COLUMN unit_id TO unidade_id;
-- matricula já está em PT
ALTER TABLE membros RENAME COLUMN name TO nome;
-- cpf, rg, email já estão OK/PT
ALTER TABLE membros RENAME COLUMN phone TO telefone;
-- whatsapp já está em PT
ALTER TABLE membros RENAME COLUMN profession TO profissao;
ALTER TABLE membros RENAME COLUMN role TO funcao;
-- status já está em PT
ALTER TABLE membros RENAME COLUMN birth_date TO data_nascimento;
ALTER TABLE membros RENAME COLUMN gender TO sexo;
ALTER TABLE membros RENAME COLUMN marital_status TO estado_civil;
ALTER TABLE membros RENAME COLUMN spouse_name TO nome_conjuge;
ALTER TABLE membros RENAME COLUMN marriage_date TO data_casamento;
ALTER TABLE membros RENAME COLUMN father_name TO nome_pai;
ALTER TABLE membros RENAME COLUMN mother_name TO nome_mae;
ALTER TABLE membros RENAME COLUMN blood_type TO tipo_sanguineo;
ALTER TABLE membros RENAME COLUMN emergency_contact TO contato_emergencia;
ALTER TABLE membros RENAME COLUMN zip_code TO cep;
ALTER TABLE membros RENAME COLUMN street TO logradouro;
ALTER TABLE membros RENAME COLUMN number TO numero;
ALTER TABLE membros RENAME COLUMN complement TO complemento;
ALTER TABLE membros RENAME COLUMN neighborhood TO bairro;
ALTER TABLE membros RENAME COLUMN city TO cidade;
ALTER TABLE membros RENAME COLUMN state TO estado;
ALTER TABLE membros RENAME COLUMN conversion_date TO data_conversao;
ALTER TABLE membros RENAME COLUMN conversion_place TO local_conversao;
ALTER TABLE membros RENAME COLUMN baptism_date TO data_batismo;
ALTER TABLE membros RENAME COLUMN baptism_church TO igreja_batismo;
ALTER TABLE membros RENAME COLUMN baptizing_pastor TO pastor_batizador;
ALTER TABLE membros RENAME COLUMN holy_spirit_baptism TO batismo_espirito_santo;
ALTER TABLE membros RENAME COLUMN membership_date TO data_membro;
ALTER TABLE membros RENAME COLUMN church_of_origin TO igreja_origem;
ALTER TABLE membros RENAME COLUMN discipleship_course TO curso_discipulado;
ALTER TABLE membros RENAME COLUMN biblical_school TO escola_biblica;
ALTER TABLE membros RENAME COLUMN main_ministry TO ministerio_principal;
ALTER TABLE membros RENAME COLUMN ministry_role TO funcao_ministerio;
ALTER TABLE membros RENAME COLUMN other_ministries TO outros_ministerios;
ALTER TABLE membros RENAME COLUMN ecclesiastical_position TO cargo_eclesiastico;
ALTER TABLE membros RENAME COLUMN consecration_date TO data_consagracao;
ALTER TABLE membros RENAME COLUMN is_tithable TO eh_dizimista;
ALTER TABLE membros RENAME COLUMN is_regular_giver TO eh_ofertante_regular;
ALTER TABLE membros RENAME COLUMN participates_campaigns TO participa_campanhas;
ALTER TABLE membros RENAME COLUMN bank TO banco;
ALTER TABLE membros RENAME COLUMN bank_agency TO agencia_bancaria;
ALTER TABLE membros RENAME COLUMN bank_account TO conta_bancaria;
ALTER TABLE membros RENAME COLUMN pix_key TO chave_pix;
ALTER TABLE membros RENAME COLUMN observations TO observacoes;
ALTER TABLE membros RENAME COLUMN special_needs TO necessidades_especiais;
ALTER TABLE membros RENAME COLUMN talents TO talentos;
-- tags já está OK/Universal
ALTER TABLE membros RENAME COLUMN family_id TO familia_id;
-- avatar já está OK/Universal
-- profile_data já está OK/Técnico
ALTER TABLE membros RENAME COLUMN created_at TO criado_em;
ALTER TABLE membros RENAME COLUMN updated_at TO atualizado_em;

-- 3. Atualizar Chaves Estrangeiras em outras tabelas (se existirem e não forem automáticas)
-- Dependents
ALTER TABLE dependents RENAME COLUMN member_id TO membro_id;
-- Member Contributions
ALTER TABLE member_contributions RENAME COLUMN member_id TO membro_id;

-- 4. Criar VIEW de Compatibilidade para código legado (EN)
CREATE OR REPLACE VIEW members AS
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
    criado_em AS created_at,
    atualizado_em AS updated_at
FROM membros;
