-- EXTENSÃO UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------------------------------
-- FUNÇÃO GLOBAL: ATUALIZAÇÃO AUTOMÁTICA
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION atualizar_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
   NEW.data_atualizacao = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--------------------------------------------------------------------------------
-- 1. UNIDADES
--------------------------------------------------------------------------------

CREATE TABLE unidades (
    id_unidade UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(255),
    endereco VARCHAR(255),
    numero VARCHAR(20),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(15),
    pais VARCHAR(100) DEFAULT 'Brasil',
    situacao VARCHAR(20) DEFAULT 'Ativo',

    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_criacao UUID,
    usuario_atualizacao UUID,
    ativo BOOLEAN DEFAULT true,
    observacoes TEXT
);

--------------------------------------------------------------------------------
-- 2. PESSOAS
--------------------------------------------------------------------------------

CREATE TABLE pessoas (
    id_pessoa UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_unidade UUID REFERENCES unidades(id_unidade),

    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    rg VARCHAR(20),
    data_nascimento DATE,
    sexo VARCHAR(20),
    estado_civil VARCHAR(50),

    email VARCHAR(255),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    whatsapp BOOLEAN DEFAULT false,

    tipo_sanguineo VARCHAR(10),
    contato_emergencia VARCHAR(255),

    pcd BOOLEAN DEFAULT false,
    tipo_deficiencia VARCHAR(255),

    endereco VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(15),
    pais VARCHAR(100) DEFAULT 'Brasil',

    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_criacao UUID,
    usuario_atualizacao UUID,
    ativo BOOLEAN DEFAULT true,
    observacoes TEXT
);

--------------------------------------------------------------------------------
-- 3. MEMBROS
--------------------------------------------------------------------------------

CREATE TABLE membros (
    id_membro UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_pessoa UUID UNIQUE REFERENCES pessoas(id_pessoa) ON DELETE CASCADE,

    matricula VARCHAR(50) UNIQUE,
    data_conversao DATE,
    data_batismo DATE,
    data_ingresso DATE,

    situacao VARCHAR(20) DEFAULT 'Ativo',
    dizimista BOOLEAN DEFAULT true,
    ofertante BOOLEAN DEFAULT true,

    grupo_pequeno VARCHAR(100),
    dons_espirituais TEXT,
    talentos TEXT,

    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_criacao UUID,
    usuario_atualizacao UUID,
    ativo BOOLEAN DEFAULT true
);

--------------------------------------------------------------------------------
-- 4. FUNCIONARIOS
--------------------------------------------------------------------------------

CREATE TABLE funcionarios (
    id_funcionario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_pessoa UUID UNIQUE REFERENCES pessoas(id_pessoa) ON DELETE CASCADE,

    cargo VARCHAR(100),
    departamento VARCHAR(100),
    data_admissao DATE,
    data_rescisao DATE,
    salario NUMERIC(15,2),

    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_criacao UUID,
    usuario_atualizacao UUID,
    ativo BOOLEAN DEFAULT true,
    observacoes TEXT
);

--------------------------------------------------------------------------------
-- 5. USUARIOS (LOGIN)
--------------------------------------------------------------------------------

CREATE TABLE usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_pessoa UUID UNIQUE REFERENCES pessoas(id_pessoa) ON DELETE CASCADE,

    login VARCHAR(100) UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,

    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT true
);

--------------------------------------------------------------------------------
-- 6. RBAC
--------------------------------------------------------------------------------

CREATE TABLE perfis (
    id_perfil UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE permissoes (
    id_permissao UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE usuarios_perfis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_usuario UUID REFERENCES usuarios(id_usuario),
    id_perfil UUID REFERENCES perfis(id_perfil)
);

CREATE TABLE perfil_permissoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_perfil UUID REFERENCES perfis(id_perfil),
    id_permissao UUID REFERENCES permissoes(id_permissao)
);

--------------------------------------------------------------------------------
-- 7. FINANCEIRO
--------------------------------------------------------------------------------

CREATE TABLE contas_financeiras (
    id_conta UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_unidade UUID REFERENCES unidades(id_unidade),

    nome VARCHAR(100),
    tipo VARCHAR(50),
    saldo NUMERIC(15,2) DEFAULT 0,

    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transacoes (
    id_transacao UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_conta UUID REFERENCES contas_financeiras(id_conta),
    id_pessoa UUID REFERENCES pessoas(id_pessoa),

    descricao TEXT,
    valor NUMERIC(15,2) NOT NULL,
    tipo VARCHAR(10), -- entrada/saida

    data_pagamento DATE,

    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_criacao UUID,
    ativo BOOLEAN DEFAULT true
);

--------------------------------------------------------------------------------
-- 8. TRIGGER: VALIDA USUARIO
--------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION validar_usuario_pessoa()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM membros WHERE id_pessoa = NEW.id_pessoa)
       OR EXISTS (SELECT 1 FROM funcionarios WHERE id_pessoa = NEW.id_pessoa) THEN
        RETURN NEW;
    END IF;

    RAISE EXCEPTION 'Pessoa não autorizada para acesso';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_usuario
BEFORE INSERT ON usuarios
FOR EACH ROW
EXECUTE FUNCTION validar_usuario_pessoa();

--------------------------------------------------------------------------------
-- 9. TRIGGERS UPDATE
--------------------------------------------------------------------------------

CREATE TRIGGER trg_update_pessoas
BEFORE UPDATE ON pessoas
FOR EACH ROW EXECUTE FUNCTION atualizar_data_atualizacao();

CREATE TRIGGER trg_update_membros
BEFORE UPDATE ON membros
FOR EACH ROW EXECUTE FUNCTION atualizar_data_atualizacao();

CREATE TRIGGER trg_update_funcionarios
BEFORE UPDATE ON funcionarios
FOR EACH ROW EXECUTE FUNCTION atualizar_data_atualizacao();

--------------------------------------------------------------------------------
-- ÍNDICES
--------------------------------------------------------------------------------

CREATE INDEX idx_pessoa_cpf ON pessoas(cpf);
CREATE INDEX idx_membro_matricula ON membros(matricula);
CREATE INDEX idx_transacao_data ON transacoes(data_pagamento);
