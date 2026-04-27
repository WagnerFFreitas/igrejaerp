-- Compatibilidade nao destrutiva para nomes legados ainda referenciados no codigo

BEGIN;

CREATE OR REPLACE VIEW dependentes AS
SELECT
  id,
  membro_id,
  nome,
  data_nascimento,
  parentesco,
  cpf,
  criado
FROM dependents;

CREATE OR REPLACE VIEW contribuicoes_membros AS
SELECT
  id,
  membro_id,
  valor,
  data_contribuicao AS data,
  tipo,
  descricao,
  criado
FROM member_contributions;

COMMIT;
