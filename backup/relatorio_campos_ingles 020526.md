# Relatório de Padronização: Tabelas, Colunas e Campos em Inglês

Abaixo está o levantamento detalhado das estruturas no banco de dados PostgreSQL e nos arquivos do projeto que ainda possuem nomenclaturas em inglês, bem como seus respectivos mapeamentos.

## 1. Banco de Dados (PostgreSQL)

A grande maioria das tabelas criadas no sistema, exceto as tabelas `membros`, `pessoas`, `unidades`, `usuarios`, `perfis` (e suas tabelas de junção), estão com nomes em inglês.

### 1.1. Tabelas em Inglês
As seguintes tabelas foram criadas com nomenclaturas em inglês no banco de dados:
* `church_events`
* `dependents` (Dependente de membros)
* `employees` (Funcionários) e suas tabelas filhas: `employee_benefits`, `employee_certifications`, `employee_documents`, `employee_evaluations`, `employee_history`, `employee_schedules`
* `event_attendees`
* `financial_accounts`, `financial_budgets`, `financial_categories`, `financial_cost_centers`, `financial_transactions`
* `leaves`
* `member_contributions`
* `payroll_calculations`, `payroll_periods` (Folha de Pagamento)
* `pdi_plans`, `performance_evaluations`
* `permission_modules`, `role_permissions`, `user_permissions`
* `schema_migrations`
* `system_logs`
* `tax_configs`
* `transactions`
* `treasury_alerts`, `treasury_cash_flows`, `treasury_financial_positions`, `treasury_forecasts`, `treasury_investments`, `treasury_loans`
* `units` (Tabela de Unidades da Igreja)
* `users` (Tabela de Usuários, diferente da tabela legada `usuarios`)
* `volunteer_schedules`

### 1.2. Colunas em Inglês (em tabelas em Português)
Na tabela `membros` (que já teve grande parte de seus campos convertida para português), ainda restaram algumas colunas com nomes em inglês:
* `membros.role`
* `membros.status`
* `membros.cell_group`
* `membros.is_pcd`
* `membros.lgpd_consent`
* `membros.avatar`

---

## 2. Código-Fonte do Projeto

Para não quebrar o frontend React (que foi construído inicialmente enviando propriedades em inglês), foi criada uma camada de tradução (De-Para) no servidor Backend. Diversos campos em inglês ainda circulam pelo projeto e são traduzidos no controller de membros antes de salvar no banco de dados em português.

### Arquivo Mapeador: `api/src/controllers/membersController.ts`
Neste arquivo, a função `sanitizeMemberPayload` captura o envio em inglês/camelCase e traduz para as colunas em português no banco.

| Campo em Inglês no Código (`req.body`) | Tabela Destino | Coluna Destino em Português (`membros`) |
| :--- | :--- | :--- |
| `name` | `membros` | `nome` |
| `birthDate` | `membros` | `data_nascimento` |
| `maritalStatus` | `membros` | `estado_civil` |
| `spouseName` | `membros` | `nome_conjuge` |
| `marriageDate` | `membros` | `data_casamento` |
| `fatherName` | `membros` | `nome_pai` |
| `motherName` | `membros` | `nome_mae` |
| `bloodType` | `membros` | `tipo_sanguineo` |
| `emergencyContact` | `membros` | `contato_emergencia` |
| `zipCode` | `membros` | `cep` |
| `street` | `membros` | `logradouro` |
| `number` | `membros` | `numero` |
| `complement` | `membros` | `complemento` |
| `neighborhood` | `membros` | `bairro` |
| `city` | `membros` | `cidade` |
| `state` | `membros` | `estado` |
| `conversionDate` | `membros` | `data_conversao` |
| `conversionPlace` | `membros` | `local_conversao` |
| `baptismDate` | `membros` | `data_batismo` |
| `baptismChurch` | `membros` | `igreja_batismo` |
| `baptizingPastor` | `membros` | `pastor_batizador` |
| `holySpiritBaptism` | `membros` | `batismo_espirito_santo` |
| `membershipDate` | `membros` | `data_membro` |
| `churchOfOrigin` | `membros` | `igreja_origem` |
| `discipleshipCourse` | `membros` | `curso_discipulado` |
| `biblicalSchool` | `membros` | `escola_biblica` |
| `mainMinistry` | `membros` | `ministerio_principal` |
| `ministryRole` | `membros` | `funcao_ministerio` |
| `otherMinistries` | `membros` | `outros_ministerios` |
| `ecclesiasticalPosition` | `membros` | `cargo_eclesiastico` |
| `consecrationDate` | `membros` | `data_consagracao` |
| `isTithable` | `membros` | `dizimista` |
| `isRegularGiver` | `membros` | `ofertante_regular` |
| `participatesCampaigns` | `membros` | `participa_campanhas` |
| `bankAgency` | `membros` | `agencia_bancaria` |
| `bankAccount` | `membros` | `conta_bancaria` |
| `pixKey` | `membros` | `chave_pix` |
| `specialNeeds` | `membros` | `necessidades_especiais` |
| `familyId` | `membros` | `familia_id` |
| `phone` | `membros` | `telefone` |

### Arquivo Mapeador: `api/src/controllers/unitController.ts`
Da mesma forma que em membros, a tradução dos campos da tabela em inglês (`units`) ocorre para devolver dados em português ao frontend (na função `mapUnitToFrontend`).

| Campo devolvido para a API | Tabela Banco | Coluna Original no Banco (`units`) |
| :--- | :--- | :--- |
| `nome` | `units` | `nome_unidade` |
| `enderecoLinha1` | `units` | `endereco_linha1` |
| `enderecoLinha2` | `units` | `endereco_linha2` |
| `criadoEm` | `units` | `criado` |
| `atualizadoEm` | `units` | `atualizado` |

### Arquivo de Seed de Dados: `src/services/dataInitializer.ts` (Frontend)
Este arquivo envia dados em lote contendo atributos misturados em inglês:
- `maritalStatus`
- `birthDate`
- `employeeName`
Esses campos são enviados pela API e interpretados no backend com o mesmo mapeamento demonstrado na tabela do `membersController.ts`.
