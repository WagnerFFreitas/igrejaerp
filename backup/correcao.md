# Correcao e melhoria do IgrejaERP

## Objetivo

Organizar o processo de correcao do banco de dados, backend e frontend para reduzir duplicidades, alinhar contratos de API e evitar que o sistema grave ou leia campos inconsistentes.

---

## Processo de correcao utilizado

### Metodologia

Cada correcao segue o mesmo ciclo de 6 etapas:

1. **Diagnostico**: Mapear todas as tabelas, colunas e rotas afetadas.
2. **Schema**: Criar novas tabelas e colunas no `igrejaerp.sql`.
3. **Backend**: Atualizar controllers/routes para usar as novas tabelas via JOIN.
4. **Migracao**: Criar script SQL separado (`migracao_*.sql`) para migrar dados existentes.
5. **Build**: Rodar `npm run build` no `api/` para validar compilacao.
6. **Documentacao**: Atualizar este arquivo (`correcao.md`) com o status.

### Regras seguidas

- Nunca remover colunas antigas sem antes criar as novas e ajustar o backend.
- Scripts de migracao sao idempotentes (podem ser executados mais de uma vez).
- Colunas antigas sao comentadas nos scripts de migracao para execucao manual apos validacao.
- Views que dependem de colunas antigas sao atualizadas junto com o schema.
- Triggers de timestamp sao criados para todas as tabelas novas.
- O backend mantem o mesmo formato de resposta para o frontend (compatibilidade).

---

## Mapeamento completo de alteracoes

### Arquivos modificados

| Arquivo | Alteracao | Fase |
|---------|-----------|------|
| `database/igrejaerp.sql` | Schema principal atualizado | Todas |
| `database/migracao_enderecos.sql` | Script de migracao criado | 1 |
| `database/migracao_contatos.sql` | Script de migracao criado | 2 |
| `database/migracao_dados_bancarios.sql` | Script de migracao criado | 3 |
| `api/src/controllers/membros-controlador.ts` | JOIN enderecos + contatos | 1, 2 |
| `api/src/routes/funcionarios.ts` | JOIN enderecos + contatos + dados_bancarios_pessoa | 1, 2, 3 |
| `api/src/controllers/unidades-controlador.ts` | JOIN enderecos + contatos | 1, 2 |
| `api/src/routes/transacoes.ts` | JOIN fornecedores, normalizacao | 4, 5 |
| `api/src/routes/fornecedores.ts` | Rota CRUD criada | 5 |
| `api/src/services/bootstrap-dados-autenticacao.ts` | Ajuste para nova estrutura | 6 |
| `api/src/controllers/autenticacao-controlador.ts` | JOIN contatos para email no login/register | 6 |
| `api/src/index.ts` | Mount de fornecedores adicionado | 5 |
| `correcao.md` | Documentacao atualizada | Todas |

---

## Tabelas do banco de dados

### Tabelas originais (mantidas)

| Tabela | Descricao | Status |
|--------|-----------|--------|
| `pessoas` | Dados pessoais | Normalizada (16 colunas) |
| `unidades` | Unidades da igreja | Normalizada (8 colunas) |
| `membros` | Cadastro de membros | Mantida |
| `funcionarios` | Cadastro de funcionarios | Normalizada (13 colunas) |
| `usuarios` | Usuarios do sistema | Mantida |
| `transacoes` | Contas a pagar/receber | Atualizada (+id_fornecedor, +nome_fornecedor) |
| `contas_bancarias` | Contas bancarias da igreja | Mantida |
| `contas_financeiras` | Contas financeiras | Mantida |
| `plano_contas` | Plano de contas | Mantida |
| `lancamentos_contabeis` | Lancamentos contabeis | Mantida |
| `folha_pagamento` | Folha de pagamento | Atualizada (+sindicato_taxa, +farmacia, +seguro_vida) |
| `calculos_folha` | Calculos da folha | REMOVIDA (mesclada em folha_pagamento) |
| `periodos_folha` | Periodos da folha | Mantida |
| `afastamentos_funcionarios` | Afastamentos | Mantida |
| `patrimonios` | Patrimonios | Mantida |
| `contagens_inventario` | Contagens de inventario | Mantida |
| `itens_inventario` | Itens de inventario | Mantida |
| `ajustes_inventario` | Ajustes de inventario | Mantida |
| `eventos_igreja` | Eventos da igreja | Mantida |
| `escalas_voluntarios` | Escalas de voluntarios | Mantida |
| `app_permission_modules` | Modulos de permissao | Mantida |
| `app_role_permissions` | Permissoes por perfil | Mantida |
| `app_user_permissions` | Permissoes por usuario | Mantida |
| `app_audit_logs` | Logs de auditoria | Mantida |
| `politicas_lgpd` | Politicas LGPD | Mantida |
| `logs_consentimento_lgpd` | Logs de consentimento LGPD | Mantida |

### Tabelas novas (criadas)

| Tabela | Descricao | Colunas |
|--------|-----------|---------|
| `enderecos` | Enderecos normalizados | id_endereco, logradouro, numero, complemento, bairro, cidade, estado, cep, pais, criado_em, atualizado_em |
| `contatos` | Contatos normalizados | id_contato, tipo_entidade, id_entidade, tipo_contato, valor, principal, ativo, criado_em, atualizado_em |
| `dados_bancarios_pessoa` | Dados bancarios de pessoas | id_dado_bancario, id_pessoa, banco, agencia, conta, tipo_conta, chave_pix, principal, ativo, criado_em, atualizado_em |
| `fornecedores` | Cadastro de fornecedores | id_fornecedor, id_unidade, nome, cnpj_cpf, tipo_pessoa, email, telefone, observacoes, ativo, criado_em, atualizado_em |

### Tabelas removidas

| Tabela | Descricao | Motivo |
|--------|-----------|--------|
| `calculos_folha` | Calculos da folha | Mesclada em `folha_pagamento` (campos duplicados) |

---

## Colunas removidas

### De `pessoas` (11 colunas removidas)

| Coluna | Tipo | Tabela destino |
|--------|------|----------------|
| logradouro | varchar(255) | enderecos |
| numero | varchar(20) | enderecos |
| complemento | varchar(100) | enderecos |
| bairro | varchar(100) | enderecos |
| cidade | varchar(100) | enderecos |
| estado | varchar(2) | enderecos |
| cep | varchar(15) | enderecos |
| pais | varchar(100) | enderecos |
| email | varchar(255) | contatos |
| telefone | varchar(20) | contatos |
| celular | varchar(20) | contatos |

### De `unidades` (9 colunas removidas)

| Coluna | Tipo | Tabela destino |
|--------|------|----------------|
| logradouro | varchar(255) | enderecos |
| numero | varchar(20) | enderecos |
| bairro | varchar(100) | enderecos |
| cidade | varchar(100) | enderecos |
| estado | varchar(2) | enderecos |
| cep | varchar(15) | enderecos |
| pais | varchar(100) | enderecos |
| telefone | varchar(20) | contatos |
| email | varchar(255) | contatos |

### De `funcionarios` (5 colunas removidas)

| Coluna | Tipo | Tabela destino |
|--------|------|----------------|
| banco | varchar(100) | dados_bancarios_pessoa |
| agencia | varchar(20) | dados_bancarios_pessoa |
| conta | varchar(50) | dados_bancarios_pessoa |
| tipo_conta | varchar(20) | dados_bancarios_pessoa |
| chave_pix | varchar(100) | dados_bancarios_pessoa |

---

## Colunas adicionadas

### Em `pessoas`

| Coluna | Tipo | Referencia |
|--------|------|------------|
| id_endereco | uuid | enderecos(id_endereco) |

### Em `unidades`

| Coluna | Tipo | Referencia |
|--------|------|------------|
| id_endereco | uuid | enderecos(id_endereco) |

### Em `transacoes`

| Coluna | Tipo | Referencia |
|--------|------|------------|
| id_fornecedor | uuid | fornecedores(id_fornecedor) |
| nome_fornecedor | varchar(255) | - |

### Em `folha_pagamento`

| Coluna | Tipo | Referencia |
|--------|------|------------|
| sindicato_taxa | numeric(15,2) | - |
| farmacia | numeric(15,2) | - |
| seguro_vida | numeric(15,2) | - |

---

## Chaves estrangeiras

| Tabela | Coluna | Referencia |
|--------|--------|------------|
| pessoas | id_endereco | enderecos(id_endereco) |
| unidades | id_endereco | enderecos(id_endereco) |
| dados_bancarios_pessoa | id_pessoa | pessoas(id_pessoa) |
| transacoes | id_fornecedor | fornecedores(id_fornecedor) |
| fornecedores | id_unidade | unidades(id_unidade) |

---

## Triggers

| Trigger | Tabela | Funcao |
|---------|--------|--------|
| trg_enderecos | enderecos | atualizar_timestamp |
| trg_contatos | contatos | atualizar_timestamp |
| trg_dados_bancarios_pessoa | dados_bancarios_pessoa | atualizar_timestamp |
| trg_fornecedores | fornecedores | atualizar_timestamp |

---

## Views

| View | Colunas selecionadas |
|------|---------------------|
| `funcionarios_ativos` | f.*, p.nome, p.cpf, ce.valor AS email, ct.valor AS telefone, cc.valor AS celular, cw.valor AS whatsapp, e.logradouro, e.bairro, e.cidade, e.estado, e.cep, u.nome AS nome_unidade |
| `membros_ativos` | m.*, p.nome, p.cpf, ce.valor AS email, ct.valor AS telefone, cc.valor AS celular, cw.valor AS whatsapp, e.logradouro, e.bairro, e.cidade, e.estado, e.cep, u.nome AS nome_unidade |

---

## APIs e Rotas

### Membros (`api/src/controllers/membros-controlador.ts`)

| Metodo | Rota | Descricao | JOINs |
|--------|------|-----------|-------|
| GET | /api/membros | Listar membros | enderecos, contatos (email, telefone, celular, whatsapp), unidades |
| GET | /api/membros/:id | Buscar membro por ID | enderecos, contatos, unidades |
| POST | /api/membros | Criar membro | Cria em pessoas, enderecos, contatos, membros |
| PUT | /api/membros/:id | Atualizar membro | Atualiza pessoas, enderecos, contatos, membros |
| DELETE | /api/membros/:id | Desativar membro | Soft delete em membros |

### Funcionarios (`api/src/routes/funcionarios.ts`)

| Metodo | Rota | Descricao | JOINs |
|--------|------|-----------|-------|
| GET | /api/funcionarios | Listar funcionarios | dados_bancarios_pessoa, enderecos, contatos, unidades |
| GET | /api/funcionarios/:id | Buscar funcionario por ID | dados_bancarios_pessoa, enderecos, contatos, unidades |
| POST | /api/funcionarios | Criar funcionario | Cria em pessoas, enderecos, contatos, dados_bancarios_pessoa, funcionarios |
| PUT | /api/funcionarios/:id | Atualizar funcionario | Atualiza pessoas, enderecos, contatos, dados_bancarios_pessoa, funcionarios |
| DELETE | /api/funcionarios/:id | Desativar funcionario | Soft delete em funcionarios |

### Unidades (`api/src/controllers/unidades-controlador.ts`)

| Metodo | Rota | Descricao | JOINs |
|--------|------|-----------|-------|
| GET | /api/unidades | Listar unidades | enderecos, contatos (email, telefone) |
| GET | /api/unidades/:id | Buscar unidade por ID | enderecos, contatos |
| PUT | /api/unidades/:id | Atualizar unidade | Atualiza enderecos, contatos, unidades |

### Transacoes (`api/src/routes/transacoes.ts`)

| Metodo | Rota | Descricao | JOINs |
|--------|------|-----------|-------|
| GET | /api/transacoes | Listar transacoes | fornecedores |
| GET | /api/transacoes/:id | Buscar transacao por ID | fornecedores |
| POST | /api/transacoes | Criar transacao | Insere em transacoes |
| PUT | /api/transacoes/:id | Atualizar transacao | Atualiza transacoes |
| DELETE | /api/transacoes/:id | Cancelar transacao | Soft delete (situacao=CANCELADO) |

### Fornecedores (`api/src/routes/fornecedores.ts`)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | /api/fornecedores | Listar fornecedores |
| GET | /api/fornecedores/:id | Buscar fornecedor por ID |
| POST | /api/fornecedores | Criar fornecedor |
| PUT | /api/fornecedores/:id | Atualizar fornecedor |
| DELETE | /api/fornecedores/:id | Desativar fornecedor (soft delete) |

---

## Normalizacao de dados (contatos)

| Tipo Entidade | Tipo Contato | Exemplo de valor |
|---------------|--------------|------------------|
| PESSOA | EMAIL | joao@email.com |
| PESSOA | TELEFONE | (11) 3333-4444 |
| PESSOA | CELULAR | (11) 99999-8888 |
| PESSOA | WHATSAPP | (11) 99999-8888 |
| UNIDADE | EMAIL | igreja@adjpa.com |
| UNIDADE | TELEFONE | (11) 3333-4444 |

---

## Dados migrados

| Tabela | Registros migrados |
|--------|-------------------|
| enderecos | 25 (24 de pessoas, 1 de unidades) |
| contatos | 80 (23 pessoas: 21 CELULAR, 23 EMAIL, 15 TELEFONE, 21 WHATSAPP) |
| dados_bancarios_pessoa | 10 (de funcionarios) |
| fornecedores | 0 (nova) |

---

## Backend - Funcoes auxiliares

### membros-controlador.ts

| Funcao | Descricao |
|--------|-----------|
| buildPessoaInsert(body) | Monta dados para INSERT em pessoas (sem endereco/contato) |
| buildEnderecoInsert(body) | Monta dados para INSERT em enderecos |
| upsertContatos(client, tipoEntidade, idEntidade, body) | Cria ou atualiza contatos na tabela contatos |
| getContatos(client, tipoEntidade, idEntidade) | Busca contatos de uma entidade |
| mapMemberRow(row) | Mapeia resultado do JOIN para formato da API |

### funcionarios.ts

| Funcao | Descricao |
|--------|-----------|
| buildPessoaData(body) | Monta dados para INSERT em pessoas (sem endereco/contato/banco) |
| buildEnderecoData(body) | Monta dados para INSERT em enderecos |
| buildFuncionarioData(body, idPessoa) | Monta dados para INSERT em funcionarios (sem banco) |
| upsertContatos(client, tipoEntidade, idEntidade, body) | Cria ou atualiza contatos |
| upsertDadosBancarios(client, idPessoa, body) | Cria ou atualiza dados bancarios |
| mapRow(row) | Mapeia resultado do JOIN para formato da API |

### unidades-controlador.ts

| Funcao | Descricao |
|--------|-----------|
| mapUnitToFrontend(row) | Mapeia resultado do JOIN para formato da API |
| upsertContatosUnidade(client, idUnidade, body) | Cria ou atualiza contatos da unidade |

---

## Status das fases

| Fase | Descricao | Status |
|------|-----------|--------|
| 1 | Enderecos | CONCLUIDA |
| 2 | Contatos | CONCLUIDA |
| 3 | Dados bancarios | CONCLUIDA |
| 4 | Financeiro (transacoes) | CONCLUIDA |
| 5 | Fornecedores | CONCLUIDA |
| 6 | Remocao de colunas antigas | CONCLUIDA |
| 7 | Fusao de folha de pagamento | CONCLUIDA |

---

## Verificacao de Duplicidades Restantes

Apos analise completa, as duplicidades restantes sao **legitimas**:

| Coluna | Tabelas | Justificativa |
|--------|---------|---------------|
| `nome` | pessoas, unidades, fornecedores, patrimonios, etc. | Cada tabela representa uma entidade diferente |
| `descricao` | transacoes, eventos, patrimonios, etc. | Descricao contextual de cada entidade |
| `tipo` | transacoes, eventos, afastamentos, etc. | Tipo especifico de cada entidade |
| `ano`, `mes` | folha_pagamento, periodos_folha | Periodos diferentes (folha vs periodos) |
| `salario_base` | funcionarios, folha_pagamento | Salario atual vs salario no periodo da folha (historico) |
| `agencia` | contas_bancarias, dados_bancarios_pessoa | Contas da igreja vs contas pessoais |

**Conclusao:** Nao ha mais normalizacoes necessarias no banco de dados.

---

## Diagnostico inicial

### Banco de dados

O banco ja usa uma boa base relacional para pessoas:

- `pessoas` concentra dados pessoais, contato e endereco.
- `membros`, `funcionarios` e `usuarios` referenciam `pessoas` por `id_pessoa`.
- `transacoes` concentra contas a pagar e receber, usando `tipo`, `valor`, `data_vencimento`, `data_pagamento`, `situacao` e `id_pessoa`.

Foram encontradas duplicidades funcionais em auditoria e permissoes:

- `logs_auditoria` duplicava parcialmente `app_audit_logs`.
- `modulos_permissao` duplicava parcialmente `app_permission_modules`.
- `permissoes_perfil` duplicava parcialmente `app_role_permissions`.

Essas tabelas legadas estavam vazias no banco local. Elas foram substituidas por views de compatibilidade apontando para as tabelas canonicas `app_*`.

### Backend

Foram encontrados desalinhamentos de rotas:

- `/api/afastamentos` chamava um router que so respondia em `/leaves`.
- `/api/lgpd/politicas` estava montado duplicando o prefixo interno.
- `/api/rh/evaluations` retornava 501 mesmo quando a tela so precisava de lista vazia.

Tambem havia desalinhamento no cadastro de membros:

- Frontend enviava `id_membro` temporario em criacao.
- Servico decidia entre `POST` e `PUT` usando `id`, mas o objeto real usa `id_membro`.
- Frontend validava apenas `nome`, enquanto backend exige `nome` e `cpf`.

### Frontend

O frontend ainda usa uma mistura de nomenclaturas:

- PT-BR: `data_vencimento`, `id_pessoa`, `id_membro`, `nome_fornecedor`.
- EN/camelCase: `dueDate`, `memberId`, `providerName`, `dataVencimento`.

---

## Correcoes ja realizadas

### Banco de dados

1. `logs_auditoria` deixou de ser tabela base e virou view sobre `app_audit_logs`.
2. `modulos_permissao` deixou de ser tabela base e virou view sobre `app_permission_modules`.
3. `permissoes_perfil` deixou de ser tabela base e virou view sobre `app_role_permissions`.
4. O arquivo `database/igrejaerp.sql` foi atualizado para preservar essa estrutura em restauracoes futuras.
5. O schema foi validado em um banco temporario.
6. **Tabela `enderecos` criada** com campos: id_endereco, logradouro, numero, complemento, bairro, cidade, estado, cep, pais.
7. **Coluna `id_endereco` adicionada** em `pessoas` e `unidades`.
8. **Views `funcionarios_ativos` e `membros_ativos` atualizadas** para usar JOIN com enderecos, contatos e dados_bancarios_pessoa.
9. **Triggers criados**: `trg_enderecos`, `trg_contatos`, `trg_dados_bancarios_pessoa`, `trg_fornecedores`.
10. **Scripts de migracao criados**: `migracao_enderecos.sql`, `migracao_contatos.sql`, `migracao_dados_bancarios.sql`.
11. **Tabela `contatos` criada** com campos: id_contato, tipo_entidade, id_entidade, tipo_contato, valor, principal, ativo.
12. **Colunas de contato removidas** de `pessoas` (email, telefone, celular, whatsapp) e `unidades` (email, telefone).
13. **Tabela `dados_bancarios_pessoa` criada** com campos: id_dado_bancario, id_pessoa, banco, agencia, conta, tipo_conta, chave_pix, principal, ativo.
14. **Colunas bancarias removidas** de `funcionarios` (banco, agencia, conta, tipo_conta, chave_pix).
15. **Campo `nome_fornecedor` adicionado** em `transacoes` para armazenar nome do fornecedor.
16. **Tabela `fornecedores` criada** com campos: id_fornecedor, id_unidade, nome, cnpj_cpf, tipo_pessoa, email, telefone, observacoes, ativo.
17. **Coluna `id_fornecedor` adicionada** em `transacoes`.

### Fusao de folha de pagamento (Fase 7)

18. **Tabela `calculos_folha` removida** - dados mesclados em `folha_pagamento`.
19. **Colunas adicionadas em `folha_pagamento`**: sindicato_taxa, farmacia, seguro_vida.

**Justificativa:** As tabelas `folha_pagamento` e `calculos_folha` representavam o mesmo conceito (folha de pagamento por funcionario/mes) com campos parcialmente duplicados (inss, irrf, fgts, salario_liquido). A fusao eliminou a duplicacao e manteve todos os calculos em um so lugar.

### Backend

1. Ajustado mount de LGPD para `/api/lgpd`.
2. Criados aliases diretos para `/api/afastamentos`.
3. `GET /api/rh/evaluations` e `GET /api/rh/pdi` passam a retornar `[]` enquanto nao houver tabelas modeladas.
4. API compila com `npm run build` dentro de `api`.
5. **`membros-controlador.ts` atualizado**: queries usam JOIN enderecos + contatos, INSERT/UPDATE criam/atualizam enderecos e contatos nas tabelas corretas.
6. **`funcionarios.ts` atualizado**: queries usam JOIN enderecos + contatos + dados_bancarios_pessoa, INSERT/UPDATE criam/atualizam enderecos, contatos e dados bancarios nas tabelas corretas.
7. **`unidades-controlador.ts` atualizado**: queries usam JOIN enderecos + contatos, UPDATE cria/atualiza contatos na tabela correta.
8. **`transacoes.ts` atualizado**: normaliza `nome_fornecedor`/`providerName`/`supplierName`, retorna `nomeFornecedor`, queries usam JOIN com fornecedores.
9. **`fornecedores.ts` criado**: rota completa CRUD para fornecedores.
10. **`bootstrap-dados-autenticacao.ts` atualizado**: usa contatos para buscar email, nao usa mais colunas removidas de unidades/pessoas.
11. **`autenticacao-controlador.ts` atualizado**: AUTH_USER_SELECT usa JOIN contatos para email, login e register usam contatos em vez de p.email.

### Frontend

1. Cadastro de membro agora valida CPF antes de chamar a API.
2. Edicao de membro usa `PUT` com `id_membro`.
3. Criacao de membro nao envia ID temporario como UUID real.
4. Coluna de acoes em membros recebeu opcao `Excluir`.
5. `npm run dev:full` passou a usar script proprio para evitar warning `DEP0060` do `concurrently`.

---

## Checks recomendados

### Banco

```sql
SELECT column_name, COUNT(*) AS qtd_tabelas, string_agg(table_name, ', ' ORDER BY table_name) AS tabelas
FROM information_schema.columns c
JOIN information_schema.tables t
  ON t.table_schema = c.table_schema
 AND t.table_name = c.table_name
WHERE c.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
GROUP BY column_name
HAVING COUNT(*) > 1
ORDER BY qtd_tabelas DESC, column_name;
```

### Backend

```bash
cd api
npm run build
```

### Frontend

```bash
npm run dev:full
```

Observacao: `npm run lint` global ainda possui muitos erros antigos de tipagem/nomenclatura. Deve ser tratado como uma frente propria de saneamento TypeScript.

---

## Build Final

```bash
cd api && npm run build  # ✅ PASSOU SEM ERROS
```

---

## Proximos Passos Recomendados

1. **Frontend**: Atualizar telas para usar as novas tabelas (enderecos, contatos, dados_bancarios_pessoa, fornecedores)
2. **Testes**: Validar todas as funcionalidades do sistema (membros, funcionarios, unidades, transacoes, fornecedores)
3. **Deploy**: Publicar as alteracoes em producao
4. **Documentacao**: Atualizar API docs com as nova