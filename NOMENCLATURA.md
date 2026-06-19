# Mapa de Nomenclaturas e Dicionário de Dados

Este documento serve como um guia de referência para as nomenclaturas usadas no projeto, mapeando as entidades do banco de dados (PostgreSQL) aos seus respectivos controladores e rotas na API, e detalhando os campos e suas transformações.

## 1. Membros (`membros`)

A entidade `Membros` representa os membros da organização. Ela é central para o sistema e se relaciona com várias outras tabelas.

-   **Tabela Principal:** `membros`
-   **Tabelas Relacionadas:** `pessoas`, `enderecos`, `contatos`, `unidades`
-   **Arquivo de Rotas:** `api/src/routes/membros.ts`
-   **Arquivo de Controlador:** `api/src/controllers/membros-controlador.ts`

### Mapeamento de Campos (API vs. Banco de Dados)

A função `mapMemberRow` no controlador é responsável por transformar os dados do banco de dados em um formato consistente para a API. A lógica de criação (`create`) e atualização (`update`) faz o caminho inverso.

| Campo na API (camelCase/Inglês) | Tabela.Coluna no DB (snake_case/Português) | Lógica de Mapeamento/Transformação |
| :--- | :--- | :--- |
| `id` / `id_membro` | `membros.id` / `membros.id_membro` | UUID do membro. |
| `id_pessoa` | `membros.id_pessoa` / `pessoas.id_pessoa` | Chave estrangeira para a tabela `pessoas`. |
| `id_unidade` | `membros.id_unidade` / `unidades.id_unidade` | Chave estrangeira para a tabela `unidades`. |
| `matricula` | `membros.matricula` | Campo de matrícula do membro. |
| `nome` | `pessoas.nome` | Nome completo da pessoa. |
| `cpf` | `pessoas.cpf` | CPF da pessoa. |
| `rg` | `pessoas.rg` | RG da pessoa. |
| `email` | `contatos.valor` (onde `tipo_contato` = 'EMAIL') | E-mail principal da pessoa. |
| `telefone` | `contatos.valor` (onde `tipo_contato` = 'TELEFONE') | Telefone principal da pessoa. |
| `celular` | `contatos.valor` (onde `tipo_contato` = 'CELULAR') | Celular principal da pessoa. |
| `whatsapp` | `contatos.valor` (onde `tipo_contato` = 'WHATSAPP') | Número de WhatsApp da pessoa. |
| `data_nascimento` | `pessoas.data_nascimento` | Data de nascimento (formato `YYYY-MM-DD`). |
| `sexo` | `pessoas.sexo` | Sexo da pessoa ('MASCULINO', 'FEMININO', 'OUTRO'). |
| `estado_civil` | `pessoas.estado_civil` | Estado civil da pessoa. |
| `data_conversao` | `membros.data_conversao` | Data de conversão (formato `YYYY-MM-DD`). |
| `data_batismo` | `membros.data_batismo` | Data de batismo (formato `YYYY-MM-DD`). |
| `data_membro` | `membros.data_membro` | Data de ingresso como membro. |
| `situacao` / `status`| `membros.situacao` | `normalizeSituacao`: 'ACTIVE'/'ATIVO' -> 'ATIVO'; 'INACTIVE'/'INATIVO' -> 'INATIVO'; etc. |
| `dizimista` | `membros.dizimista` | `boolFrom`: Converte `true`, '1', 'sim' para `true`. |
| `ofertante` | `membros.ofertante` | `boolFrom`: Converte `true`, '1', 'sim' para `true`. |
| `dados_perfil` | `membros.dados_perfil` | Campo JSONB para armazenar dados adicionais. |
| (Campos de Endereço) | `enderecos.*` | Mapeados a partir da tabela `enderecos` via `pessoas.id_endereco`. |

---

## 2. Funcionários (`funcionarios`)

A entidade `Funcionários` gerencia as informações de colaboradores contratados.

-   **Tabela Principal:** `funcionarios`
-   **Tabelas Relacionadas:** `pessoas`, `dados_bancarios_pessoa`, `enderecos`, `contatos`, `unidades`
-   **Arquivo de Rotas (e Controlador):** `api/src/routes/funcionarios.ts`

### Mapeamento de Campos (API vs. Banco de Dados)

A lógica está contida diretamente no arquivo de rotas. A função `mapRow` monta o objeto de resposta da API, e as funções `buildPessoaData` e `buildFuncionarioData` preparam os dados para inserção/atualização no banco.

| Campo na API (camelCase/Inglês) | Tabela.Coluna no DB (snake_case/Português) | Lógica de Mapeamento/Transformação |
| :--- | :--- | :--- |
| `id` / `id_funcionario` | `funcionarios.id_funcionario` | UUID do funcionário. |
| `id_pessoa` | `funcionarios.id_pessoa` / `pessoas.id_pessoa` | Chave estrangeira para a tabela `pessoas`. |
| `id_unidade` | `funcionarios.id_unidade` / `unidades.id_unidade`| Vínculo com a unidade. |
| `employeeName` / `nome` | `pessoas.nome` | Nome do funcionário. |
| `birthDate` / `data_nascimento` | `pessoas.data_nascimento` | Data de nascimento (formato `YYYY-MM-DD`). |
| `admissionDate` / `data_admissao` | `funcionarios.data_admissao` | Data de admissão (formato `YYYY-MM-DD`). |
| `department` / `departamento` | `funcionarios.departamento` | Departamento do funcionário. |
| `salary` / `salario_base` | `funcionarios.salario_base` | Salário base. |
| `status` / `ativo` | `funcionarios.ativo` | `boolFrom`: `true` -> 'ACTIVE', `false` -> 'INACTIVE'. |
| `banco` | `dados_bancarios_pessoa.banco` | Informações bancárias para pagamento. |
| `agencia` | `dados_bancarios_pessoa.agencia` | Informações bancárias para pagamento. |
| `conta` | `dados_bancarios_pessoa.conta` | Informações bancárias para pagamento. |
| (Outros campos de `pessoas`) | `pessoas.*` | `cpf`, `rg`, `sexo`, etc., seguem o mesmo padrão. |
| (Campos de `enderecos`) | `enderecos.*` | `logradouro`, `cidade`, etc., aninhados no objeto `address`. |

---

## 3. Unidades (`unidades`)

A entidade `Unidades` representa as diferentes localizações ou filiais da organização (igrejas, campos, etc.).

-   **Tabela Principal:** `unidades`
-   **Tabelas Relacionadas:** `enderecos`, `contatos`
-   **Arquivo de Rotas:** `api/src/routes/unidades.ts`
-   **Arquivo de Controlador:** `api/src/controllers/unidades-controlador.ts`

### Mapeamento de Campos (API vs. Banco de Dados)

O controlador `UnitController` usa métodos estáticos e a função `mapUnitToFrontend` para formatar a resposta da API.

| Campo na API (camelCase/Inglês) | Tabela.Coluna no DB (snake_case/Português) | Lógica de Mapeamento/Transformação |
| :--- | :--- | :--- |
| `id` / `idUnidade` | `unidades.id_unidade` | UUID da unidade. |
| `nome` | `unidades.nome` | Nome da unidade. |
| `cnpj` | `unidades.cnpj` | CNPJ da unidade. |
| `email` | `contatos.valor` (onde `tipo_contato` = 'EMAIL') | E-mail principal da unidade. |
| `telefone` | `contatos.valor` (onde `tipo_contato` = 'TELEFONE') | Telefone principal da unidade. |
| `logradouro` / `enderecoLinha1` | `enderecos.logradouro` | Parte do endereço. |
| `numero` / `enderecoLinha2` | `enderecos.numero` | Parte do endereço. |
| `bairro` | `enderecos.bairro` | Parte do endereço. |
| `cidade` | `enderecos.cidade` | Parte do endereço. |
| `estado` | `enderecos.estado` | Parte do endereço. |
| `cep` | `enderecos.cep` | Parte do endereço. |
| `situacao` | `unidades.situacao` | Situação cadastral da unidade (e.g., 'Ativo'). |
| `ativo` | `unidades.ativo` | Status booleano da unidade. |

---

## 4. Autenticação e Permissões

Este sistema gerencia o acesso de usuários, seus perfis e permissões de forma granular.

-   **Tabelas Principais:** `usuarios`, `app_role_permissions`, `app_user_permissions`, `app_permission_modules`
-   **Tabelas de Apoio:** `pessoas`, `contatos`, `unidades`
-   **Arquivo de Rotas:** `api/src/routes/autenticacao.ts`
-   **Arquivo de Controlador:** `api/src/controllers/autenticacao-controlador.ts`
-   **Arquivo de Serviço:** `api/src/services/permissoes-servico.ts`

### Mapeamento de Nomenclaturas

| Conceito | Nomenclatura na API (Inglês) | Nomenclatura no DB (Português) | Descrição |
| :--- | :--- | :--- | :--- |
| Perfil/Papel | `role` | `perfil` | Perfil do usuário (e.g., 'DEVELOPER' na API corresponde a 'DESENVOLVEDOR' no DB). O mapeamento é feito no `autenticacao-controlador`. |
| Usuário Ativo | `status: 'ACTIVE'` | `esta_ativo: true` | Indica se o usuário pode acessar o sistema. |
| Permissão | `canRead`, `canWrite`... | `ler`, `escrever`... | As permissões são booleanas e seguem o padrão de nomenclatura `can[Action]` na API e o verbo em português no banco de dados. |

### Estrutura de Permissões

O sistema de permissões é composto por três níveis:

1.  **Módulos (`app_permission_modules`):** Define as áreas funcionais do sistema que podem ter acesso controlado (e.g., `members`, `finance`).
2.  **Permissões por Perfil (`app_role_permissions`):** Define as permissões padrão para um determinado `role` (perfil) em cada módulo.
3.  **Permissões por Usuário (`app_user_permissions`):** Permite sobrescrever as permissões padrão de um perfil para um usuário específico em um determinado módulo.

A função `getEffectivePermissions` no `permissoes-servico.ts` consolida essas três fontes para determinar o acesso final de um usuário a um recurso.

---

## 5. Transações (Financeiro)

A entidade `Transações` é o núcleo do sistema financeiro, registrando todas as entradas e saídas.

-   **Tabela Principal:** `transacoes`
-   **Tabelas Relacionadas:** `unidades`, `pessoas` (para doadores), `fornecedores`, `contas_bancarias`
-   **Arquivo de Rotas (e Controlador):** `api/src/routes/transacoes.ts`

### Mapeamento de Campos (API vs. Banco de Dados)

As funções `normalizarTransacao` e `mapearTransacao` no arquivo de rotas fazem a ponte entre o frontend e o banco de dados.

| Campo na API (camelCase/Inglês) | Tabela.Coluna no DB (snake_case/Português) | Lógica de Mapeamento/Transformação |
| :--- | :--- | :--- |
| `id` / `idTransacao` | `transacoes.id_transacao` | UUID da transação. |
| `idUnidade` | `transacoes.id_unidade` | Chave estrangeira para a tabela `unidades`. |
| `idPessoa` / `memberId` | `transacoes.id_pessoa` | ID da pessoa (doador/membro). |
| `idFornecedor` / `supplierId` | `transacoes.id_fornecedor` | ID do fornecedor (para despesas). |
| `description` | `transacoes.descricao` | Descrição do lançamento. |
| `amount` | `transacoes.valor` | Valor da transação. |
| `type` | `transacoes.tipo` | Tipo: 'RECEITA' ou 'DESPESA'. |
| `accountId` | `transacoes.id_conta` | ID da conta bancária associada. |
| `date` / `dataTransacao` | `transacoes.data_transacao` | Data em que a transação ocorreu (formato `YYYY-MM-DD`). |
| `dueDate` / `dataVencimento` | `transacoes.data_vencimento` | Data de vencimento (para contas a pagar/receber). |
| `paymentDate` / `dataPagamento` | `transacoes.data_pagamento` | Data em que o pagamento foi efetivado. |
| `status` | `transacoes.situacao` | Situação: 'PENDENTE', 'PAGO', 'VENCIDO', 'CANCELADO'. |
| `paymentMethod` | `transacoes.forma_pagamento` | Forma de Pagamento: 'PIX', 'CARTAO', 'BOLETO', etc. |
| `isConciliated` | `transacoes.conciliado` | Booleano que indica se foi conciliado com o extrato bancário. |

---

## 6. Plano de Contas (Contabilidade)

O Plano de Contas é a espinha dorsal da organização financeira e contábil. Ele estrutura como cada transação (receita ou despesa) é classificada dentro de uma hierarquia contábil padronizada.

-   **Tabela Principal:** `plano_de_contas` (ou estrutura similar; gerenciado via `contabilUtils.ts`)
-   **Arquivo de Lógica:** `utils/contabilUtils.ts`

### Estrutura do Plano de Contas

O plano de contas é definido no arquivo `contabilUtils.ts` e segue uma estrutura contábil tradicional. Cada conta possui os seguintes atributos:

| Atributo na API/Código | Nomenclatura no DB (implícito) | Descrição |
| :--- | :--- | :--- |
| `id` | `id` | Identificador único (e.g., 'acc-1'). |
| `code` | `codigo_conta` | Código contábil hierárquico (e.g., '4.1.01.001' para Dízimos). |
| `name` | `nome_conta` | Nome descritivo da conta (e.g., 'Dízimos'). |
| `nature` | `natureza` | Natureza da conta (`ASSET`, `LIABILITY`, `EQUITY`, `INCOME`, `EXPENSE`). |
| `type` | `tipo_conta` | Tipo da conta, geralmente 'ANALYTIC' (analítica), onde os lançamentos são feitos. |
| `normalBalance` | `saldo_normal` | Saldo normal da conta ('DEBIT' ou 'CREDIT'). |

### Mapeamento: Categoria de Transação -> Conta Contábil

Para simplificar a entrada de dados, o sistema mapeia categorias amigáveis (usadas na API de `transacoes`) para as contas contábeis formais. Essa lógica reside na função `mapCategoryToAccount`.

**Exemplo (Receitas):**

| `category` na transação | Código da Conta Contábil | Nome da Conta |
| :--- | :--- | :--- |
| 'DIZIMO' | '4.1.01.001' | Dízimos |
| 'OFFERING' | '4.2.01.001' | Ofertas |
| 'EVENT' | '4.3.01.001' | Contribuições para Eventos |

**Exemplo (Despesas):**

| `category` na transação | Código da Conta Contábil | Nome da Conta |
| :--- | :--- | :--- |
| 'SALARY' | '5.1.01.001' | Salários |
| 'MAINTENANCE' | '5.2.01.001' | Manutenção Predial |
| 'UTILITIES' | '5.3.01.001' | Energia Elétrica |

### Mapeamento: Natureza da Conta

A nomenclatura da natureza da conta também é mapeada entre o inglês (usado na lógica) e o português.

| `nature` (Inglês) | `getNatureName()` (Português) |
| :--- | :--- |
| `ASSET` | Ativo |
| `LIABILITY` | Passivo |
| `EQUITY` | Patrimônio Líquido |
| `INCOME` | Receita |
| `EXPENSE` | Despesa |

Esta estrutura garante que, embora os usuários e o frontend interajam com termos simples como "Oferta" ou "Aluguel", cada transação seja registrada de forma contábilmente correta, permitindo a geração de balancetes e relatórios financeiros precisos.
