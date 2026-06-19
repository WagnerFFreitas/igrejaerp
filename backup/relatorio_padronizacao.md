
# Relatório Consolidado de Padronização do Projeto IgrejaERP

**Versão:** 2.0
**Data:** 29/05/2026

## 1. Análise Geral e Contexto Histórico

Após uma análise detalhada do código-fonte e dos documentos de projeto (`relatorio_completo_190426.md`, `RESUMO_NORMALIZACAO.md`), confirmamos que a padronização do frontend para o português é o **próximo passo lógico e planejado** para a evolução do sistema.

*   **Banco de Dados (`database/igrejaerp.sql`):** **EXCELENTE.** O esquema já passou por um processo de normalização bem-sucedido (conforme `RESUMO_NORMALIZACAO.md`), eliminando redundâncias e estabelecendo um padrão claro em português.

*   **Código-Fonte (Frontend):** **INCONSISTENTE.** Conforme documentado em `relatorio_completo_190426.md`, existe um desalinhamento significativo entre as nomenclaturas do frontend (majoritariamente em inglês) e do backend (em português). O arquivo `tipos.ts` é o epicentro dessa inconsistência.

Este relatório, portanto, serve como um guia consolidado para **concluir o trabalho de padronização já iniciado**, alinhando o frontend com a estrutura do banco de dados.

---

## 2. O Dicionário de Tradução: `relatorio_completo_190426.md`

O arquivo `relatorio_completo_190426.md` é a fonte da verdade para a tradução. Ele fornece um mapeamento exato, campo a campo, que deve ser seguido durante a refatoração.

**Exemplo da Discrepância (Tabela `payroll_periods`):**

| Campo no Código (Inglês) | Campo no Banco (Português) |
| :----------------------- | :------------------------- |
| `month`                  | `mes`                      |
| `year`                   | `ano`                      |
| `start_date`             | `data_inicio`              |
| `end_date`               | `data_final`               |
| `created_by`             | `criado_por`               |

Este padrão se repete por todo o projeto e serve como base para o mapa de nomenclaturas abaixo.

---

## 3. Mapa de Nomenclaturas (Proposta de Padronização)

### 3.1. Estrutura de Arquivos e Pastas

| Estrutura Atual (Inglês) | Proposta (Português) |
| :----------------------- | :------------------- |
| `/components`            | `/componentes`       |
| `/hooks`                 | `/hooks` (manter)    |
| `/services`              | `/servicos`          |
| `/styles`                | `/estilos`           |
| `/utils`                 | `/utilitarios`       |

*Nota: A pasta `/hooks` pode ser mantida em inglês, pois `use` é uma convenção do React (ex: `useQuery`), e a tradução "usar" (`usarConsulta`) pode ser menos intuitiva.*

### 3.2. Tipos e Interfaces (de `tipos.ts`)

| Nome Atual (Inglês/Híbrido) | Proposta (Português)           |
| :-------------------------- | :----------------------------- |
| `UserRole`                  | `PerfilUsuario`                |
| `Asset`                     | `Patrimonio`                   |
| `EmployeeLeave`             | `AfastamentoFuncionario`       |
| `PayrollCalculation`        | `CalculoFolhaPagamento`        |
| `SocialChargesReport`       | `RelatorioEncargosSociais`     |
| `PaySlip`                   | `Holerite`                     |
| `ChartOfAccount`            | `PlanoDeContas`                |
| `AccountingEntry`           | `LancamentoContabil`           |
| `BankReconciliation`        | `ConciliacaoBancaria`          |
| `CashFlow`                  | `FluxoCaixa`                   |
| `LGPDConsent`               | `ConsentimentoLGPD`            |
| `PerformanceEvaluation`     | `AvaliacaoDesempenho`          |
| `SalaryHistory`             | `HistoricoSalarial`            |

### 3.3. Variáveis e Funções (Exemplos de `App.tsx`)

| Tipo      | Nome Atual      | Proposta (Português) |
| :-------- | :-------------- | :------------------- |
| Variável  | `user`          | `usuario`            |
| Setter    | `setMembers`    | `setMembros`         |
| Setter    | `setEmployees`  | `setFuncionarios`    |
| Setter    | `setTransactions` | `setTransacoes`      |
| Variável  | `isLoading`     | `carregando`         |
| Função    | `handleLogin`   | `realizarLogin`      |
| Função    | `fetchData`     | `buscarDados`        |

---

## 4. Plano de Ação para Padronização do Frontend

Este plano executa a etapa "**Frontend: Atualizar telas para usar as novas tabelas**", definida no arquivo `RESUMO_NORMALIZACAO.md`.

1.  **Etapa 1: Padronizar `tipos.ts` (A Fundação)**
    *   **Objetivo:** Criar uma única fonte da verdade para os tipos da aplicação, em português.
    *   **Ações:**
        *   Renomeie todas as interfaces e tipos para português (Ex: `Asset` -> `Patrimonio`).
        *   Utilizando `relatorio_completo_190426.md` como guia, remova todas as propriedades em inglês, mantendo apenas as versões em português (Ex: remova `name`, mantenha `nome`).
        *   Remova completamente o bloco de `ALIASES PARA COMPATIBILIDADE` no final do arquivo.

2.  **Etapa 2: Renomear Estrutura de Pastas**
    *   **Objetivo:** Organizar o projeto de forma coesa.
    *   **Ações:**
        *   Renomeie as pastas (`components` -> `componentes`, `services` -> `servicos`).
        *   Utilize a função de "pesquisar e substituir" da IDE para atualizar todos os caminhos de importação no projeto.

3.  **Etapa 3: Refatorar a Lógica da Aplicação**
    *   **Objetivo:** Conectar a aplicação aos novos tipos padronizados.
    *   **Ações:**
        *   **Serviços (`/servicos`):** Adapte os serviços para que façam uso das novas interfaces em português.
        *   **Componentes (`/componentes`):** Percorra os componentes (`App.tsx`, etc.) para traduzir variáveis, estados e funções.

4.  **Etapa 4: Validação com Dados de Teste (`Seed`)**
    *   **Objetivo:** Garantir a integridade funcional da aplicação após as mudanças.
    *   **Ações:**
        *   Utilize os scripts de seed documentados em `SEED-SUMMARY.md` para popular o banco de dados (`npm run db:seed:clean`).
        *   Execute testes de ponta a ponta, fazendo login com os usuários de teste (ex: `pastor_joao`, `carlos_tesoureiro`) e verificando todas as funcionalidades CRUD (Criar, Ler, Atualizar, Deletar) em cada módulo da aplicação.

A execução deste plano resultará em um projeto coeso, totalmente em português e alinhado com as melhores práticas de desenvolvimento, facilitando a manutenção e a evolução futura do sistema IgrejaERP.
