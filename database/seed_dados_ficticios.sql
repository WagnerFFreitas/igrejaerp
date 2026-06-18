-- ============================================================================
-- IGREJAERP - SCRIPT DE SEED COM DADOS FICTÍCIOS REALISTAS
-- Data: 2026-05-31
-- Descrição: Popula todas as tabelas com dados de exemplo para testes e demo
-- ============================================================================

-- Desabilitar constraints temporariamente para facilitar inserts
SET CONSTRAINTS ALL DEFERRED;

-- ============================================================================
-- 1. ENDEREÇOS
-- ============================================================================
INSERT INTO public.enderecos (logradouro, numero, complemento, bairro, cidade, estado, cep, pais) VALUES
('Avenida Principal', '1000', 'Prédio Principal', 'Centro', 'São Paulo', 'SP', '01310-100', 'Brasil'),
('Rua da Paz', '250', 'Apto 201', 'Vila Mariana', 'São Paulo', 'SP', '04016-000', 'Brasil'),
('Rua do Comércio', '500', 'Sala 305', 'Consolação', 'São Paulo', 'SP', '01310-100', 'Brasil'),
('Rua das Flores', '123', '', 'Higienópolis', 'São Paulo', 'SP', '01238-000', 'Brasil'),
('Avenida Paulista', '900', 'Apto 1502', 'Bela Vista', 'São Paulo', 'SP', '01311-100', 'Brasil'),
('Rua Augusta', '2500', 'Casa 05', 'Consolação', 'São Paulo', 'SP', '01305-100', 'Brasil'),
('Rua Oscar Freire', '1800', '', 'Cerqueira César', 'São Paulo', 'SP', '01426-100', 'Brasil'),
('Alameda Santos', '2000', 'Apto 1000', 'Cerqueira César', 'São Paulo', 'SP', '01418-100', 'Brasil'),
('Rua Vergueiro', '3100', 'Sala 401', 'Liberdade', 'São Paulo', 'SP', '01504-000', 'Brasil'),
('Rua Professor Arthur Ramos', '500', '', 'Bom Retiro', 'São Paulo', 'SP', '01235-000', 'Brasil'),
('Avenida Brasil', '3000', 'Bloco A', 'Brás', 'São Paulo', 'SP', '03040-040', 'Brasil'),
('Rua Tatuapé', '1500', '', 'Tatuapé', 'São Paulo', 'SP', '03081-010', 'Brasil'),
('Avenida Imigrantes', '2800', '', 'Vila Carioca', 'São Paulo', 'SP', '04050-000', 'Brasil'),
('Rua Itamonte', '250', 'Casa 10', 'Perdizes', 'São Paulo', 'SP', '05005-000', 'Brasil'),
('Rua Voluntários da Pátria', '500', '', 'Santana', 'São Paulo', 'SP', '02010-000', 'Brasil');

-- ============================================================================
-- 2. UNIDADES (IGREJAS)
-- ============================================================================
INSERT INTO public.unidades (nome, cnpj, id_endereco, situacao, ativo) VALUES
('Igreja Central', '12.345.678/0001-90', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 0), 'ATIVO', true),
('Igreja Norte', '12.345.679/0001-91', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 1), 'ATIVO', true),
('Igreja Sul', '12.345.680/0001-92', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 2), 'ATIVO', true),
('Igreja Leste', '12.345.681/0001-93', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 3), 'INATIVO', true),
('Igreja Oeste', '12.345.682/0001-94', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 4), 'ATIVO', true);

-- ============================================================================
-- 3. PESSOAS
-- ============================================================================
INSERT INTO public.pessoas (id_unidade, nome, cpf, rg, data_nascimento, sexo, estado_civil, id_endereco, tipo_sanguineo, contato_emergencia, pcd, ativo) VALUES
-- Pastor e liderança
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Pastor João Silva', '123.456.789-01', '12.345.678', '1970-03-15', 'Masculino', 'Casado', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 0), 'O+', 'Ana Silva', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Pastora Ana Silva', '234.567.890-12', '23.456.789', '1972-07-22', 'Feminino', 'Casada', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 0), 'A+', 'João Silva', false, true),

-- Funcionários
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Carlos Santos', '345.678.901-23', '34.567.890', '1980-05-10', 'Masculino', 'Solteiro', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 1), 'O-', 'Maria Santos', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Beatriz Oliveira', '456.789.012-34', '45.678.901', '1985-11-20', 'Feminino', 'Solteira', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 2), 'B+', 'João Oliveira', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 'Pedro Mendes', '567.890.123-45', '56.789.012', '1975-08-30', 'Masculino', 'Casado', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 3), 'AB+', 'Carla Mendes', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 'Francisca Costa', '678.901.234-56', '67.890.123', '1988-02-14', 'Feminino', 'Divorciada', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 4), 'A-', 'Roberto Costa', false, true),

-- Membros
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Marcos Ferreira', '789.012.345-67', '78.901.234', '1990-01-25', 'Masculino', 'Casado', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 5), 'O+', 'Julieta Ferreira', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Julieta Ferreira', '890.123.456-78', '89.012.345', '1992-06-18', 'Feminino', 'Casada', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 5), 'B+', 'Marcos Ferreira', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Gabriel Lima', '901.234.567-89', '90.123.456', '2000-09-10', 'Masculino', 'Solteiro', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 6), 'O+', 'Rita Lima', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Rita Lima', '012.345.678-90', '01.234.567', '1965-04-05', 'Feminino', 'Viúva', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 6), 'A+', 'Gabriel Lima', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 'Tiago Santos', '123.456.790-11', '12.345.679', '1988-12-03', 'Masculino', 'Solteiro', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 7), 'B-', 'Denise Santos', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 'Denise Santos', '234.567.891-22', '23.456.790', '1991-10-17', 'Feminino', 'Solteira', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 7), 'O+', 'Tiago Santos', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 2), 'Leonardo Rocha', '345.678.902-33', '34.567.891', '1982-07-12', 'Masculino', 'Casado', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 8), 'A+', 'Cristina Rocha', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 2), 'Cristina Rocha', '456.789.013-44', '45.678.902', '1984-03-29', 'Feminino', 'Casada', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 8), 'AB-', 'Leonardo Rocha', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 2), 'Valeria Santos', '567.890.124-55', '56.789.013', '1995-11-21', 'Feminino', 'Solteira', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 9), 'O+', 'Paulo Santos', false, true),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 4), 'Thiago Costa', '678.901.235-66', '67.890.124', '1986-05-08', 'Masculino', 'Casado', (SELECT id_endereco FROM public.enderecos LIMIT 1 OFFSET 10), 'B+', 'Vanessa Costa', false, true);

-- ============================================================================
-- 4. CONTATOS
-- ============================================================================
INSERT INTO public.contatos (tipo_entidade, id_entidade, tipo_contato, valor, principal, ativo) VALUES
-- Contatos de Pessoas
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pastor João Silva' LIMIT 1), 'EMAIL', 'joao.silva@igrejacentral.com.br', true, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pastor João Silva' LIMIT 1), 'CELULAR', '11-98765-4321', false, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pastora Ana Silva' LIMIT 1), 'EMAIL', 'ana.silva@igrejacentral.com.br', true, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pastora Ana Silva' LIMIT 1), 'WHATSAPP', '11-99876-5432', false, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Carlos Santos' LIMIT 1), 'EMAIL', 'carlos.santos@igrejacentral.com.br', true, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Carlos Santos' LIMIT 1), 'TELEFONE', '11-3456-7890', false, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Beatriz Oliveira' LIMIT 1), 'EMAIL', 'beatriz.oliveira@igrejacentral.com.br', true, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Beatriz Oliveira' LIMIT 1), 'CELULAR', '11-97654-3210', false, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Marcos Ferreira' LIMIT 1), 'EMAIL', 'marcos.ferreira@email.com', true, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Marcos Ferreira' LIMIT 1), 'WHATSAPP', '11-98123-4567', false, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Gabriel Lima' LIMIT 1), 'EMAIL', 'gabriel.lima@email.com', true, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Gabriel Lima' LIMIT 1), 'CELULAR', '11-99234-5678', false, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Tiago Santos' LIMIT 1), 'EMAIL', 'tiago.s@email.com', true, true),
((SELECT tipo_entidade FROM (SELECT 'PESSOA' AS tipo_entidade) t), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Tiago Santos' LIMIT 1), 'TELEFONE', '11-3987-6543', false, true);

-- ============================================================================
-- 5. USUÁRIOS DO SISTEMA
-- ============================================================================
INSERT INTO public.usuarios (id_pessoa, login, senha_hash, perfil, esta_ativo) VALUES
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pastor João Silva' LIMIT 1), 'pastor_joao', '$2b$10$DKKKK4/5z8z8z8z8z8z8u2N3O4P5Q6R7S8T9U0V1W2', 'PASTOR', true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pastora Ana Silva' LIMIT 1), 'pastora_ana', '$2b$10$DKKKK4/5z8z8z8z8z8z8u2N3O4P5Q6R7S8T9U0V1W2', 'ADMIN', true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Carlos Santos' LIMIT 1), 'carlos_tesoureiro', '$2b$10$DKKKK4/5z8z8z8z8z8z8u2N3O4P5Q6R7S8T9U0V1W2', 'TESOUREIRO', true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Beatriz Oliveira' LIMIT 1), 'beatriz_secretaria', '$2b$10$DKKKK4/5z8z8z8z8z8z8u2N3O4P5Q6R7S8T9U0V1W2', 'SECRETARIO', true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pedro Mendes' LIMIT 1), 'pedro_rh', '$2b$10$DKKKK4/5z8z8z8z8z8z8u2N3O4P5Q6R7S8T9U0V1W2', 'RH', true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Marcos Ferreira' LIMIT 1), 'marcos_membro', '$2b$10$DKKKK4/5z8z8z8z8z8z8u2N3O4P5Q6R7S8T9U0V1W2', 'MEMBRO', true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Gabriel Lima' LIMIT 1), 'gabriel_dev', '$2b$10$DKKKK4/5z8z8z8z8z8z8u2N3O4P5Q6R7S8T9U0V1W2', 'DESENVOLVEDOR', true);

-- ============================================================================
-- 6. MEMBROS
-- ============================================================================
INSERT INTO public.membros (id_pessoa, id_unidade, data_conversao, data_batismo, data_membro, situacao, ministerio, grupo_pequeno, dizimista, ofertante, cargo_eclesiastico) VALUES
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pastor João Silva' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1), '1995-03-15', '1995-05-20', '1995-06-01', 'ATIVO', 'Pastoral', 'Liderança', true, true, 'Pastor Presidente'),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pastora Ana Silva' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1), '1996-07-22', '1996-08-15', '1996-09-01', 'ATIVO', 'Pastoral', 'Liderança', true, true, 'Pastora'),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Marcos Ferreira' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1), '2010-01-10', '2010-05-15', '2010-06-01', 'ATIVO', 'Música', 'Grupo 1', true, true, 'Músico'),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Julieta Ferreira' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1), '2010-02-14', '2010-06-20', '2010-07-01', 'ATIVO', 'Diaconia', 'Grupo 1', true, true, ''),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Gabriel Lima' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1), '2018-09-10', '2018-11-25', '2018-12-01', 'ATIVO', 'Jovens', 'Grupo Jovens', true, false, ''),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Rita Lima' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1), '2005-04-05', '2005-06-12', '2005-07-01', 'ATIVO', 'Intercessão', 'Grupo Oração', true, true, ''),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Tiago Santos' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), '2015-12-03', '2016-03-20', '2016-04-01', 'ATIVO', 'Administrativo', 'Grupo 2', true, true, 'Diácono'),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Denise Santos' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), '2016-10-17', '2017-01-15', '2017-02-01', 'ATIVO', 'Educação', 'Grupo 2', true, true, ''),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Leonardo Rocha' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 2), '2012-07-12', '2012-10-20', '2012-11-01', 'ATIVO', 'Evangelismo', 'Grupo 3', true, true, 'Presbítero'),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Cristina Rocha' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 2), '2013-03-29', '2013-06-15', '2013-07-01', 'ATIVO', 'Diaconia', 'Grupo 3', true, true, 'Diaconisa'),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Valeria Santos' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 2), '2020-11-21', '2021-03-14', '2021-04-01', 'ATIVO', 'Juvenil', 'Grupo Jovens', false, true, ''),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Thiago Costa' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 4), '2015-05-08', '2015-08-30', '2015-09-01', 'ATIVO', 'Técnica', 'Grupo 5', true, true, 'Técnico');

-- ============================================================================
-- 7. FUNCIONÁRIOS
-- ============================================================================
INSERT INTO public.funcionarios (id_pessoa, id_unidade, matricula, cargo, departamento, data_admissao, regime_trabalho, salario_base, ativo) VALUES
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pastor João Silva' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1), 'MAT001', 'Pastor Presidente', 'Pastoral', '1995-06-01', 'PRO_LABORE', 3500.00, true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pastora Ana Silva' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1), 'MAT002', 'Pastora', 'Pastoral', '1996-09-01', 'PRO_LABORE', 3000.00, true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Carlos Santos' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1), 'MAT003', 'Tesoureiro', 'Financeiro', '2015-03-15', 'CLT', 2800.00, true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Beatriz Oliveira' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1), 'MAT004', 'Secretária', 'Administrativo', '2016-01-10', 'CLT', 2500.00, true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pedro Mendes' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 'MAT005', 'Gerente RH', 'Recursos Humanos', '2018-02-01', 'CLT', 3200.00, true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Francisca Costa' LIMIT 1), (SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 'MAT006', 'Assistente Administrativo', 'Administrativo', '2019-05-20', 'CLT', 2200.00, true);

-- ============================================================================
-- 8. DADOS BANCÁRIOS
-- ============================================================================
INSERT INTO public.dados_bancarios_pessoa (id_pessoa, banco, agencia, conta, tipo_conta, chave_pix, principal, ativo) VALUES
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Carlos Santos' LIMIT 1), 'Caixa Econômica', '0001', '123456-0', 'Corrente', 'carlos.santos@email.com', true, true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Beatriz Oliveira' LIMIT 1), 'Banco do Brasil', '0002', '987654-3', 'Corrente', '11-97654-3210', true, true),
((SELECT id_pessoa FROM public.pessoas WHERE nome = 'Pedro Mendes' LIMIT 1), 'Itaú', '0003', '555555-8', 'Corrente', 'pedro.mendes@email.com', true, true);

-- ============================================================================
-- 9. CONTAS FINANCEIRAS E BANCÁRIAS
-- ============================================================================
INSERT INTO public.contas_financeiras (id_unidade, nome, tipo, saldo) VALUES
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Caixa Principal', 'CAIXA', 15000.00),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Banco Caixa Econômica', 'BANCO', 45000.00),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 'Caixa Principal', 'CAIXA', 8000.00),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 2), 'Caixa Principal', 'CAIXA', 12000.00);

INSERT INTO public.contas_bancarias (id_unidade, nome_conta, tipo_conta, nome_banco, agencia, numero_conta, moeda, esta_ativo) VALUES
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Conta Principal', 'Corrente', 'Caixa Econômica Federal', '0001', '0123456-0', 'BRL', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Conta Poupança', 'Poupança', 'Banco do Brasil', '0002', '0987654-3', 'BRL', true),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 'Conta Operacional', 'Corrente', 'Itaú', '0003', '0555555-8', 'BRL', true);

-- ============================================================================
-- 10. PLANO DE CONTAS
-- ============================================================================
INSERT INTO public.plano_contas (id_unidade, codigo, nome, natureza, tipo, id_conta_pai, saldo_normal, esta_ativo) VALUES
-- Contas Sintéticas
((SELECT id_unidade FROM public.unidades LIMIT 1), '1', 'ATIVO', 'ATIVO', 'SINTETICO', NULL, 'DEBITO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), '2', 'PASSIVO', 'PASSIVO', 'SINTETICO', NULL, 'CREDITO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), '3', 'PATRIMÔNIO LÍQUIDO', 'PATRIMONIO_LIQUIDO', 'SINTETICO', NULL, 'CREDITO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), '4', 'RECEITAS', 'RECEITA', 'SINTETICO', NULL, 'CREDITO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), '5', 'DESPESAS', 'DESPESA', 'SINTETICO', NULL, 'DEBITO', true),
-- Contas Analíticas - Ativo
((SELECT id_unidade FROM public.unidades LIMIT 1), '1.1', 'Caixa', 'ATIVO', 'ANALITICO', (SELECT id FROM public.plano_contas WHERE codigo = '1'), 'DEBITO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), '1.2', 'Banco', 'ATIVO', 'ANALITICO', (SELECT id FROM public.plano_contas WHERE codigo = '1'), 'DEBITO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), '1.3', 'Imóveis', 'ATIVO', 'ANALITICO', (SELECT id FROM public.plano_contas WHERE codigo = '1'), 'DEBITO', true),
-- Contas Analíticas - Receitas
((SELECT id_unidade FROM public.unidades LIMIT 1), '4.1', 'Dízimos', 'RECEITA', 'ANALITICO', (SELECT id FROM public.plano_contas WHERE codigo = '4'), 'CREDITO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), '4.2', 'Ofertas', 'RECEITA', 'ANALITICO', (SELECT id FROM public.plano_contas WHERE codigo = '4'), 'CREDITO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), '4.3', 'Outros Rendimentos', 'RECEITA', 'ANALITICO', (SELECT id FROM public.plano_contas WHERE codigo = '4'), 'CREDITO', true),
-- Contas Analíticas - Despesas
((SELECT id_unidade FROM public.unidades LIMIT 1), '5.1', 'Salários', 'DESPESA', 'ANALITICO', (SELECT id FROM public.plano_contas WHERE codigo = '5'), 'DEBITO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), '5.2', 'Manutenção', 'DESPESA', 'ANALITICO', (SELECT id FROM public.plano_contas WHERE codigo = '5'), 'DEBITO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), '5.3', 'Utilidades', 'DESPESA', 'ANALITICO', (SELECT id FROM public.plano_contas WHERE codigo = '5'), 'DEBITO', true);

-- ============================================================================
-- 11. FORNECEDORES
-- ============================================================================
INSERT INTO public.fornecedores (id_unidade, nome, cnpj_cpf, tipo_pessoa, email, telefone, observacoes, ativo) VALUES
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Limpeza e Higiene LTDA', '98.765.432/0001-01', 'JURIDICA', 'contato@limpezahigiene.com.br', '11-3456-7890', 'Fornecedora de produtos de limpeza', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Manutenção e Reparo', '87.654.321/0001-02', 'JURIDICA', 'contato@manutencao.com.br', '11-3210-5678', 'Serviços de manutenção predial', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Distribuidora de Alimentos', '76.543.210/0001-03', 'JURIDICA', 'vendas@alimentacao.com.br', '11-2345-6789', 'Fornecedora de alimentos e bebidas', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Impressão e Gráfica', '65.432.109/0001-04', 'JURIDICA', 'vendas@grafica.com.br', '11-1234-5678', 'Serviços de impressão e design gráfico', true),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 'Consultoria Financeira', '54.321.098/0001-05', 'JURIDICA', 'contato@consultoria.com.br', '11-9876-5432', 'Consultoria em assuntos financeiros', true);

-- ============================================================================
-- 12. TRANSAÇÕES FINANCEIRAS
-- ============================================================================
INSERT INTO public.transacoes (id_unidade, id_pessoa, id_fornecedor, descricao, valor, tipo, id_conta, data_transacao, data_vencimento, data_pagamento, situacao, forma_pagamento, conciliado, nome_fornecedor, criado_por) VALUES
-- Receitas
((SELECT id_unidade FROM public.unidades LIMIT 1), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Marcos Ferreira' LIMIT 1), NULL, 'Dízimo - Marcos Ferreira', 500.00, 'RECEITA', (SELECT id FROM public.contas_bancarias LIMIT 1), '2026-05-15', '2026-05-15', '2026-05-15', 'PAGO', 'Transferência', true, NULL, (SELECT id_usuario FROM public.usuarios WHERE perfil = 'TESOUREIRO' LIMIT 1)),
((SELECT id_unidade FROM public.unidades LIMIT 1), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Gabriel Lima' LIMIT 1), NULL, 'Oferta', 200.00, 'RECEITA', (SELECT id FROM public.contas_bancarias LIMIT 1), '2026-05-16', '2026-05-16', '2026-05-16', 'PAGO', 'Dinheiro', true, NULL, (SELECT id_usuario FROM public.usuarios WHERE perfil = 'TESOUREIRO' LIMIT 1)),
((SELECT id_unidade FROM public.unidades LIMIT 1), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Tiago Santos' LIMIT 1), NULL, 'Dízimo - Tiago Santos', 450.00, 'RECEITA', (SELECT id FROM public.contas_bancarias LIMIT 1), '2026-05-17', '2026-05-17', '2026-05-17', 'PAGO', 'PIX', true, NULL, (SELECT id_usuario FROM public.usuarios WHERE perfil = 'TESOUREIRO' LIMIT 1)),
((SELECT id_unidade FROM public.unidades LIMIT 1), (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Leonardo Rocha' LIMIT 1), NULL, 'Dízimo - Leonardo Rocha', 600.00, 'RECEITA', (SELECT id FROM public.contas_bancarias LIMIT 1), '2026-05-18', '2026-05-18', '2026-05-18', 'PAGO', 'Débito', true, NULL, (SELECT id_usuario FROM public.usuarios WHERE perfil = 'TESOUREIRO' LIMIT 1)),

-- Despesas
((SELECT id_unidade FROM public.unidades LIMIT 1), NULL, (SELECT id_fornecedor FROM public.fornecedores WHERE nome = 'Limpeza e Higiene LTDA' LIMIT 1), 'Compra de produtos de limpeza', 350.00, 'DESPESA', (SELECT id FROM public.contas_bancarias LIMIT 1), '2026-05-10', '2026-05-20', '2026-05-20', 'PAGO', 'Boleto', true, 'Limpeza e Higiene LTDA', (SELECT id_usuario FROM public.usuarios WHERE perfil = 'TESOUREIRO' LIMIT 1)),
((SELECT id_unidade FROM public.unidades LIMIT 1), NULL, (SELECT id_fornecedor FROM public.fornecedores WHERE nome = 'Manutenção e Reparo' LIMIT 1), 'Manutenção do telhado', 800.00, 'DESPESA', (SELECT id FROM public.contas_bancarias LIMIT 1), '2026-05-08', '2026-05-25', '2026-05-25', 'PAGO', 'Cheque', true, 'Manutenção e Reparo', (SELECT id_usuario FROM public.usuarios WHERE perfil = 'TESOUREIRO' LIMIT 1)),
((SELECT id_unidade FROM public.unidades LIMIT 1), NULL, (SELECT id_fornecedor FROM public.fornecedores WHERE nome = 'Distribuidora de Alimentos' LIMIT 1), 'Alimentos para evento', 600.00, 'DESPESA', (SELECT id FROM public.contas_bancarias LIMIT 1), '2026-05-12', '2026-05-30', NULL, 'PENDENTE', 'Crédito', false, 'Distribuidora de Alimentos', (SELECT id_usuario FROM public.usuarios WHERE perfil = 'TESOUREIRO' LIMIT 1)),
((SELECT id_unidade FROM public.unidades LIMIT 1), NULL, (SELECT id_fornecedor FROM public.fornecedores WHERE nome = 'Impressão e Gráfica' LIMIT 1), 'Impressão de boletins', 200.00, 'DESPESA', (SELECT id FROM public.contas_bancarias LIMIT 1), '2026-05-14', '2026-05-22', NULL, 'ATRASADO', 'Boleto', false, 'Impressão e Gráfica', (SELECT id_usuario FROM public.usuarios WHERE perfil = 'TESOUREIRO' LIMIT 1)),

-- Transferências
((SELECT id_unidade FROM public.unidades LIMIT 1), NULL, NULL, 'Transferência para Fundo de Emergência', 1000.00, 'TRANSFERENCIA', (SELECT id FROM public.contas_bancarias LIMIT 1), '2026-05-20', '2026-05-20', '2026-05-20', 'PAGO', 'Transferência', true, NULL, (SELECT id_usuario FROM public.usuarios WHERE perfil = 'TESOUREIRO' LIMIT 1));

-- ============================================================================
-- 13. LANÇAMENTOS CONTÁBEIS
-- ============================================================================
INSERT INTO public.lancamentos_contabeis (id_unidade, numero_lancamento, data_lancamento, historico, valor_debito, valor_credito, id_transacao, criado_por, situacao) VALUES
((SELECT id_unidade FROM public.unidades LIMIT 1), 1, '2026-05-15', 'Recebimento Dízimo Marcos Ferreira', 500.00, 0, (SELECT id_transacao FROM public.transacoes WHERE descricao = 'Dízimo - Marcos Ferreira' LIMIT 1), 'carlos_tesoureiro', 'CONCLUIDO'),
((SELECT id_unidade FROM public.unidades LIMIT 1), 2, '2026-05-16', 'Recebimento Oferta Gabriel Lima', 200.00, 0, (SELECT id_transacao FROM public.transacoes WHERE descricao = 'Oferta' LIMIT 1), 'carlos_tesoureiro', 'CONCLUIDO'),
((SELECT id_unidade FROM public.unidades LIMIT 1), 3, '2026-05-10', 'Pagamento Produtos Limpeza', 0, 350.00, (SELECT id_transacao FROM public.transacoes WHERE descricao = 'Compra de produtos de limpeza' LIMIT 1), 'carlos_tesoureiro', 'CONCLUIDO'),
((SELECT id_unidade FROM public.unidades LIMIT 1), 4, '2026-05-08', 'Pagamento Manutenção Telhado', 0, 800.00, (SELECT id_transacao FROM public.transacoes WHERE descricao = 'Manutenção do telhado' LIMIT 1), 'carlos_tesoureiro', 'CONCLUIDO');

-- ============================================================================
-- 14. FOLHA DE PAGAMENTO
-- ============================================================================
INSERT INTO public.folha_pagamento (id_unidade, id_funcionario, mes, ano, data_referencia, salario_base, sindicato_taxa, farmacia, seguro_vida, inss, irrf, fgts, salario_liquido, situacao) VALUES
((SELECT id_unidade FROM public.unidades LIMIT 1), (SELECT id_funcionario FROM public.funcionarios WHERE matricula = 'MAT001' LIMIT 1), 5, 2026, '2026-05-31', 3500.00, 0, 0, 0, 0, 0, 280.00, 3500.00, 'PROCESSADO'),
((SELECT id_unidade FROM public.unidades LIMIT 1), (SELECT id_funcionario FROM public.funcionarios WHERE matricula = 'MAT002' LIMIT 1), 5, 2026, '2026-05-31', 3000.00, 0, 0, 0, 0, 0, 240.00, 3000.00, 'PROCESSADO'),
((SELECT id_unidade FROM public.unidades LIMIT 1), (SELECT id_funcionario FROM public.funcionarios WHERE matricula = 'MAT003' LIMIT 1), 5, 2026, '2026-05-31', 2800.00, 0, 75.00, 30.00, 315.00, 200.00, 224.00, 2056.00, 'PROCESSADO'),
((SELECT id_unidade FROM public.unidades LIMIT 1), (SELECT id_funcionario FROM public.funcionarios WHERE matricula = 'MAT004' LIMIT 1), 5, 2026, '2026-05-31', 2500.00, 0, 50.00, 25.00, 281.25, 100.00, 200.00, 1843.75, 'PROCESSADO'),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), (SELECT id_funcionario FROM public.funcionarios WHERE matricula = 'MAT005' LIMIT 1), 5, 2026, '2026-05-31', 3200.00, 0, 60.00, 30.00, 360.00, 250.00, 256.00, 2334.00, 'PROCESSADO'),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), (SELECT id_funcionario FROM public.funcionarios WHERE matricula = 'MAT006' LIMIT 1), 5, 2026, '2026-05-31', 2200.00, 0, 40.00, 20.00, 247.50, 0, 176.00, 1912.50, 'PROCESSADO');

-- ============================================================================
-- 15. PERÍODOS DE FOLHA
-- ============================================================================
INSERT INTO public.periodos_folha (id_unidade, mes, ano, situacao, data_inicio, data_final, criado_por) VALUES
((SELECT id_unidade FROM public.unidades LIMIT 1), 5, 2026, 'FECHADO', '2026-05-01', '2026-05-31', (SELECT id_usuario FROM public.usuarios WHERE perfil = 'RH' LIMIT 1)),
((SELECT id_unidade FROM public.unidades LIMIT 1), 4, 2026, 'FECHADO', '2026-04-01', '2026-04-30', (SELECT id_usuario FROM public.usuarios WHERE perfil = 'RH' LIMIT 1)),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 5, 2026, 'FECHADO', '2026-05-01', '2026-05-31', (SELECT id_usuario FROM public.usuarios WHERE perfil = 'RH' LIMIT 1));

-- ============================================================================
-- 16. AFASTAMENTOS DE FUNCIONÁRIOS
-- ============================================================================
INSERT INTO public.afastamentos_funcionarios (id_unidade, id_funcionario, tipo, data_inicio, data_final, situacao) VALUES
((SELECT id_unidade FROM public.unidades LIMIT 1), (SELECT id_funcionario FROM public.funcionarios WHERE matricula = 'MAT004' LIMIT 1), 'FERIAS', '2026-06-01', '2026-06-15', 'AGENDADO'),
((SELECT id_unidade FROM public.unidades LIMIT 1), (SELECT id_funcionario FROM public.funcionarios WHERE matricula = 'MAT003' LIMIT 1), 'MEDICO', '2026-05-25', '2026-05-27', 'CONCLUIDO'),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), (SELECT id_funcionario FROM public.funcionarios WHERE matricula = 'MAT005' LIMIT 1), 'FERIAS', '2026-07-01', '2026-07-20', 'AGENDADO');

-- ============================================================================
-- 17. PATRIMÔNIOS
-- ============================================================================
INSERT INTO public.patrimonios (id_unidade, nome, descricao, categoria, data_aquisicao, valor_aquisicao, situacao, depreciacao_acumulada) VALUES
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Templo Principal', 'Edifício principal da igreja', 'IMOVEIS', '2000-01-15', 250000.00, 'ATIVO', 37500.00),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Veículo Pastoral', 'Van branca para transporte', 'VEICULOS', '2018-05-10', 45000.00, 'ATIVO', 13500.00),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Computador Administrativo', 'Desktop para secretaria', 'COMPUTADORES', '2022-03-01', 3500.00, 'ATIVO', 1050.00),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Projetor Multimídia', 'Projetor para apresentações', 'EQUIPAMENTOS', '2019-08-20', 5000.00, 'ATIVO', 1500.00),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Mesa Diretoria', 'Mesa de madeira maciça', 'MOVEIS', '2015-02-14', 2000.00, 'ATIVO', 200.00),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Cadeiras Auditório', 'Conjunto de 100 cadeiras', 'MOVEIS', '2016-11-01', 5000.00, 'ATIVO', 500.00),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 'Sala de Reuniões', 'Sala de reunião climatizada', 'IMOVEIS', '2005-06-15', 80000.00, 'ATIVO', 12000.00),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 2), 'Equipamento Áudio', 'Sistema de som completo', 'EQUIPAMENTOS', '2020-09-10', 12000.00, 'ATIVO', 2400.00);

-- ============================================================================
-- 18. CONTAGENS DE INVENTÁRIO
-- ============================================================================
INSERT INTO public.contagens_inventario (id_unidade, data_contagem, situacao, iniciado, concluido) VALUES
((SELECT id_unidade FROM public.unidades LIMIT 1), '2026-05-20', 'CONCLUIDA', '2026-05-20 08:00:00', '2026-05-20 16:00:00'),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), '2026-05-22', 'CONCLUIDA', '2026-05-22 09:00:00', '2026-05-22 17:00:00'),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 2), '2026-05-25', 'EM_ANDAMENTO', '2026-05-25 08:00:00', NULL);

-- ============================================================================
-- 19. ITENS DE INVENTÁRIO
-- ============================================================================
INSERT INTO public.itens_inventario (id_contagem_estoque, id_patrimonio, quantidade_esperada, quantidade_contada, diferenca, condicao) VALUES
((SELECT id FROM public.contagens_inventario WHERE id_unidade = (SELECT id_unidade FROM public.unidades LIMIT 1) LIMIT 1), (SELECT id FROM public.patrimonios WHERE nome = 'Computador Administrativo' LIMIT 1), 1, 1, 0, 'Excelente'),
((SELECT id FROM public.contagens_inventario WHERE id_unidade = (SELECT id_unidade FROM public.unidades LIMIT 1) LIMIT 1), (SELECT id FROM public.patrimonios WHERE nome = 'Projetor Multimídia' LIMIT 1), 1, 1, 0, 'Bom'),
((SELECT id FROM public.contagens_inventario WHERE id_unidade = (SELECT id_unidade FROM public.unidades LIMIT 1) LIMIT 1), (SELECT id FROM public.patrimonios WHERE nome = 'Mesa Diretoria' LIMIT 1), 1, 1, 0, 'Bom'),
((SELECT id FROM public.contagens_inventario WHERE id_unidade = (SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1) LIMIT 1), (SELECT id FROM public.patrimonios WHERE nome = 'Equipamento Áudio' LIMIT 1), 1, 1, 0, 'Excelente');

-- ============================================================================
-- 20. AJUSTES DE INVENTÁRIO
-- ============================================================================
INSERT INTO public.ajustes_inventario (id_contagem_estoque, id_patrimonio, tipo_ajuste, quantidade, motivo) VALUES
((SELECT id FROM public.contagens_inventario WHERE id_unidade = (SELECT id_unidade FROM public.unidades LIMIT 1) LIMIT 1), (SELECT id FROM public.patrimonios WHERE nome = 'Cadeiras Auditório' LIMIT 1), 'SAIDA', 5, 'Cadeiras danificadas - descarte'),
((SELECT id FROM public.contagens_inventario WHERE id_unidade = (SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1) LIMIT 1), (SELECT id FROM public.patrimonios WHERE nome = 'Computador Administrativo' LIMIT 1), 'ENTRADA', 1, 'Novo computador adquirido');

-- ============================================================================
-- 21. EVENTOS DA IGREJA
-- ============================================================================
INSERT INTO public.eventos_igreja (id_unidade, titulo, descricao, data_evento, hora_evento, local_evento, tipo, recorrente) VALUES
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Culto Dominical', 'Culto principal da semana', '2026-06-07', '10:00:00', 'Templo Principal', 'CULTO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Estudo Bíblico', 'Estudo em grupo da Palavra', '2026-06-03', '19:30:00', 'Sala de Reuniões', 'REUNIAO', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Conferência Anual', 'Encontro de liderança 2026', '2026-08-15', '08:00:00', 'Auditório', 'CONFERENCIA', false),
((SELECT id_unidade FROM public.unidades LIMIT 1), 'Treinamento Diaconal', 'Treinamento de novos diáconos', '2026-06-20', '14:00:00', 'Sala de Treinamento', 'TREINAMENTO', false),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), 'Culto Dominical', 'Culto principal da semana', '2026-06-07', '09:30:00', 'Templo Norte', 'CULTO', true);

-- ============================================================================
-- 22. ESCALAS DE VOLUNTÁRIOS
-- ============================================================================
INSERT INTO public.escalas_voluntarios (id_evento, ministerio, funcao, id_voluntario, confirmado, quantidade_necessaria) VALUES
((SELECT id FROM public.eventos_igreja WHERE titulo = 'Culto Dominical' LIMIT 1), 'Música', 'Organista', (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Marcos Ferreira' LIMIT 1), true, 1),
((SELECT id FROM public.eventos_igreja WHERE titulo = 'Culto Dominical' LIMIT 1), 'Diaconia', 'Porteiro', (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Gabriel Lima' LIMIT 1), true, 2),
((SELECT id FROM public.eventos_igreja WHERE titulo = 'Estudo Bíblico' LIMIT 1), 'Educação', 'Facilitador', (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Leonardo Rocha' LIMIT 1), true, 1),
((SELECT id FROM public.eventos_igreja WHERE titulo = 'Conferência Anual' LIMIT 1), 'Administrativo', 'Recepcionista', (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Beatriz Oliveira' LIMIT 1), false, 3),
((SELECT id FROM public.eventos_igreja WHERE titulo = 'Treinamento Diaconal' LIMIT 1), 'Pastoral', 'Instrutor', (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Tiago Santos' LIMIT 1), true, 1);

-- ============================================================================
-- 23. MÓDULOS DE PERMISSÃO
-- ============================================================================
INSERT INTO public.app_permission_modules (codigo, nome_modulo, categoria, descricao) VALUES
('DASHBOARD', 'Dashboard', 'Sistema', 'Acesso ao painel de controle principal'),
('PESSOAS', 'Gerenciamento de Pessoas', 'Administrativo', 'Criar, editar, visualizar e deletar registros de pessoas'),
('MEMBROS', 'Gerenciamento de Membros', 'Igreja', 'Gerenciar dados de membros, batismos e conversões'),
('FUNCIONARIOS', 'Gerenciamento de Funcionários', 'RH', 'Gerenciar dados de funcionários, contratações e demissões'),
('USUARIOS', 'Gerenciamento de Usuários', 'Sistema', 'Criar e gerenciar contas de usuários do sistema'),
('TRANSACOES', 'Gerenciamento de Transações', 'Financeiro', 'Criar, editar e aprovar transações financeiras'),
('FOLHA_PAGAMENTO', 'Folha de Pagamento', 'RH', 'Gerenciar folha de pagamento e cálculos de salários'),
('RELATORIOS', 'Relatórios', 'Administrativo', 'Gerar e visualizar relatórios do sistema'),
('PATRIMONIOS', 'Gerenciamento de Patrimônios', 'Administrativo', 'Gerenciar imóveis, equipamentos e bens'),
('EVENTOS', 'Gerenciamento de Eventos', 'Igreja', 'Criar e gerenciar eventos da igreja'),
('PERMISSOES', 'Gerenciamento de Permissões', 'Sistema', 'Configurar permissões e acessos do sistema'),
('AUDITORIA', 'Auditoria e Logs', 'Sistema', 'Acessar logs de auditoria e histórico de alterações');

-- ============================================================================
-- 24. PERMISSÕES POR PERFIL
-- ============================================================================
INSERT INTO public.app_role_permissions (role, codigo_modulo, ler, escrever, excluir, gerenciar, administrador) VALUES
-- ADMIN
('ADMIN', 'DASHBOARD', true, true, true, true, true),
('ADMIN', 'PESSOAS', true, true, true, true, true),
('ADMIN', 'MEMBROS', true, true, true, true, true),
('ADMIN', 'FUNCIONARIOS', true, true, true, true, true),
('ADMIN', 'USUARIOS', true, true, true, true, true),
('ADMIN', 'TRANSACOES', true, true, true, true, true),
('ADMIN', 'FOLHA_PAGAMENTO', true, true, true, true, true),
('ADMIN', 'RELATORIOS', true, true, true, true, true),
('ADMIN', 'PATRIMONIOS', true, true, true, true, true),
('ADMIN', 'EVENTOS', true, true, true, true, true),
('ADMIN', 'PERMISSOES', true, true, true, true, true),
('ADMIN', 'AUDITORIA', true, true, true, true, true),

-- PASTOR
('PASTOR', 'DASHBOARD', true, false, false, false, false),
('PASTOR', 'PESSOAS', true, false, false, false, false),
('PASTOR', 'MEMBROS', true, true, false, true, false),
('PASTOR', 'EVENTOS', true, true, true, false, false),
('PASTOR', 'RELATORIOS', true, false, false, false, false),

-- TESOUREIRO
('TESOUREIRO', 'DASHBOARD', true, false, false, false, false),
('TESOUREIRO', 'TRANSACOES', true, true, false, false, false),
('TESOUREIRO', 'RELATORIOS', true, true, false, false, false),
('TESOUREIRO', 'PESSOAS', true, false, false, false, false),

-- SECRETARIO
('SECRETARIO', 'DASHBOARD', true, false, false, false, false),
('SECRETARIO', 'PESSOAS', true, true, false, false, false),
('SECRETARIO', 'MEMBROS', true, true, false, false, false),
('SECRETARIO', 'EVENTOS', true, true, false, false, false),
('SECRETARIO', 'RELATORIOS', true, false, false, false, false),

-- RH
('RH', 'DASHBOARD', true, false, false, false, false),
('RH', 'FUNCIONARIOS', true, true, false, false, false),
('RH', 'FOLHA_PAGAMENTO', true, true, false, false, false),
('RH', 'RELATORIOS', true, true, false, false, false),
('RH', 'PESSOAS', true, true, false, false, false),

-- DESENVOLVEDOR
('DESENVOLVEDOR', 'DASHBOARD', true, false, false, false, false),
('DESENVOLVEDOR', 'PESSOAS', true, true, false, false, false),
('DESENVOLVEDOR', 'TRANSACOES', true, true, false, false, false),
('DESENVOLVEDOR', 'AUDITORIA', true, false, false, false, false),

-- MEMBRO
('MEMBRO', 'DASHBOARD', true, false, false, false, false),
('MEMBRO', 'PESSOAS', true, false, false, false, false);

-- ============================================================================
-- 25. POLÍTICAS LGPD
-- ============================================================================
INSERT INTO public.politicas_lgpd (id_unidade, versao, titulo, conteudo, esta_ativa) VALUES
((SELECT id_unidade FROM public.unidades LIMIT 1), '1.0', 'Política de Privacidade e Proteção de Dados',
'A Igreja Central está comprometida com a proteção dos dados pessoais de seus membros, funcionários e visitantes em conformidade com a Lei Geral de Proteção de Dados (LGPD) de 2018. Esta política descreve como coletamos, usamos, armazenamos e protegemos informações pessoais. Seus dados serão usados exclusivamente para fins administrativos, pastorais e comunicação de atividades da igreja. Você tem direito ao acesso, correção e exclusão de seus dados pessoais.', true),
((SELECT id_unidade FROM public.unidades LIMIT 1), '1.0', 'Política de Consentimento',
'Todo processamento de dados pessoais requer consentimento prévio, informado e específico do titular dos dados. O consentimento será obtido através de formulário claro e acessível, especificando o tipo de dado coletado e a finalidade do uso. O consentimento pode ser revogado a qualquer momento.', true),
((SELECT id_unidade FROM public.unidades LIMIT 1 OFFSET 1), '1.0', 'Política de Segurança da Informação',
'Implementamos medidas técnicas e administrativas para garantir a segurança dos dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Todos os dados são armazenados em servidores seguros com criptografia de ponta a ponta.', true);

-- ============================================================================
-- 26. LOGS DE CONSENTIMENTO LGPD
-- ============================================================================
INSERT INTO public.logs_consentimento_lgpd (id_membro, id_politica, tipo_consentimento, concedido, endereco_ip) VALUES
((SELECT id FROM public.membros WHERE id_pessoa = (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Marcos Ferreira' LIMIT 1) LIMIT 1), (SELECT id FROM public.politicas_lgpd LIMIT 1), 'EMAIL', true, '192.168.1.1'),
((SELECT id FROM public.membros WHERE id_pessoa = (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Gabriel Lima' LIMIT 1) LIMIT 1), (SELECT id FROM public.politicas_lgpd LIMIT 1), 'TRATAMENTO_DADOS', true, '192.168.1.2'),
((SELECT id FROM public.membros WHERE id_pessoa = (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Tiago Santos' LIMIT 1) LIMIT 1), (SELECT id FROM public.politicas_lgpd LIMIT 1), 'COMUNICACAO', true, '192.168.1.3'),
((SELECT id FROM public.membros WHERE id_pessoa = (SELECT id_pessoa FROM public.pessoas WHERE nome = 'Leonardo Rocha' LIMIT 1) LIMIT 1), (SELECT id FROM public.politicas_lgpd LIMIT 1 OFFSET 1), 'TRATAMENTO_DADOS', true, '192.168.1.4');

-- ============================================================================
-- REABILITAR CONSTRAINTS
-- ============================================================================
SET CONSTRAINTS ALL IMMEDIATE;

-- ============================================================================
-- RESUMO
-- ============================================================================
-- ✓ Endereços: 15 registros
-- ✓ Unidades: 5 registros (igrejas)
-- ✓ Pessoas: 15 registros (pastores, funcionários, membros)
-- ✓ Contatos: 14 registros (emails, telefones, WhatsApp)
-- ✓ Usuários: 7 registros (com perfis diferenciados)
-- ✓ Membros: 12 registros
-- ✓ Funcionários: 6 registros
-- ✓ Dados Bancários: 3 registros
-- ✓ Contas Financeiras: 4 registros
-- ✓ Contas Bancárias: 3 registros
-- ✓ Plano de Contas: 14 registros (sintéticas e analíticas)
-- ✓ Fornecedores: 5 registros
-- ✓ Transações: 9 registros (receitas, despesas, transferências)
-- ✓ Lançamentos Contábeis: 4 registros
-- ✓ Folha de Pagamento: 6 registros
-- ✓ Períodos de Folha: 3 registros
-- ✓ Afastamentos: 3 registros
-- ✓ Patrimônios: 8 registros
-- ✓ Contagens de Inventário: 3 registros
-- ✓ Itens de Inventário: 4 registros
-- ✓ Ajustes de Inventário: 2 registros
-- ✓ Eventos: 5 registros
-- ✓ Escalas de Voluntários: 5 registros
-- ✓ Módulos de Permissão: 12 registros
-- ✓ Permissões por Perfil: 30+ registros
-- ✓ Políticas LGPD: 3 registros
-- ✓ Logs de Consentimento LGPD: 4 registros
-- ============================================================================
