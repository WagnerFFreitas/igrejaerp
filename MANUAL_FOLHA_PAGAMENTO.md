# Manual Completo - Sistema de Folha de Pagamento

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Acesso e Navegação](#acesso-e-navegação)
3. [Funcionalidades Principais](#funcionalidades-principais)
4. [Controle de Período](#controle-de-período)
5. [Relatórios Avançados](#relatórios-avançados)
6. [Processamento da Folha](#processamento-da-folha)
7. [Edição de Dados](#edição-de-dados)
8. [Dicas e Boas Práticas](#dicas-e-boas-práticas)
9. [Solução de Problemas](#solução-de-problemas)

---

## 🎯 Visão Geral

O sistema de folha de pagamento foi desenvolvido para atender pequenas, médias e grandes igrejas, oferecendo:

### ✅ Recursos Principais
- **Processamento mensal** automático de folha
- **Cálculo automático** de INSS, IRRF e encargos
- **Relatórios avançados** para auditoria
- **Controle de período** para segurança dos dados
- **Interface intuitiva** e profissional
- **Exportação em PDF** para impressão

### 🏢 Para Quem é Indicado
- **Pequenas Igrejas**: Até 50 funcionários
- **Médias Igrejas**: 50-200 funcionários  
- **Grandes Igrejas**: 200+ funcionários

---

## 🖥️ Acesso e Navegação

### 1. Acessando o Sistema
1. **Faça login** no sistema ERP
2. **No menu lateral**, clique em **"Folha de Pagamento"**
3. **Aguarde o carregamento** dos dados dos funcionários

### 2. Layout da Interface
```
┌─────────────────────────────────────────────────────────────────┐
│ [PERÍODO: ABERTO] [RELATÓRIOS] [HOLERITES] [PROCESSAR] │
├─────────────────────────────────────────────────────────────────┤
│ 📊 CARDS DE RESUMO                                      │
│ Total Proventos    Total Descontos    Custo Patronal      │
├─────────────────────────────────────────────────────────────────┤
│ 📋 TABELA DE FUNCIONÁRIOS                              │
│ ☐  Matrícula  Nome        Salário   Proventos  Descontos  │
│ ☐  F001/2025    João Silva  R$2.500   R$2.500   R$300     │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Funcionalidades Principais

### 1. Cards de Resumo Financeiro
- **Total Proventos**: Soma de todos os salários e benefícios
- **Total Descontos**: Soma de INSS, IRRF e outros descontos
- **Custo Patronal Estimado**: Proventos + 28% de encargos

### 2. Tabela de Funcionários
- **Seleção individual**: Checkbox para cada funcionário
- **Seleção em lote**: Checkbox no cabeçalho para selecionar todos
- **Ordenação automática**: Por matrícula (F001, F002, etc.)
- **Dados exibidos**:
  - Matrícula formatada
  - Nome completo
  - Cargo
  - Salário base
  - Total de proventos
  - Total de descontos
  - Salário líquido

### 3. Botões de Ação
- **🔓 Período**: Abre/fecha períodos de processamento
- **📊 Relatórios**: Gera relatórios avançados
- **🖨️ Holerites**: Imprime holerites individuais
- **⚙️ Processar Mês Atual**: Executa cálculos da folha

---

## 📅 Controle de Período

### O que é o Controle de Período?
Sistema de segurança que **impede alterações indevidas** na folha já processada.

### Como Funciona
1. **Período ABERTO**: ✅ Permite processamento e edições
2. **Período FECHADO**: 🚫 Bloqueia alterações

### Operações

#### 🟢 Abrir Novo Período
1. Clique em **"Período: Aberto/Fechado"**
2. Se estiver fechado, clique em **"Abrir Novo Período"**
3. Confirme a abertura
4. **Resultado**: Período aberto para processamento

#### 🔴 Fechar Período
1. **Processe a folha** do mês atual
2. Clique em **"Período: Aberto"**
3. Clique em **"Fechar Período"**
4. Confirme o fechamento
5. **Resultado**: Período fechado e seguro

### 📋 Informações do Período
- **Mês/Ano**: Período atual de processamento
- **Status**: Aberto/Fechado
- **Total Funcionários**: Quantidade na folha
- **Total Folha**: Valor bruto processado

---

## 📊 Relatórios Avançados

O sistema oferece **3 tipos de relatórios profissionais** em formato PDF:

### 1. 📋 Folha Analítica Completa
**O que contém:**
- Lista detalhada de todos os funcionários
- Matrícula, nome, salário base
- Proventos, descontos, salário líquido
- INSS e IRRF individuais
- Totais gerais

**Quando usar:**
- Auditoria interna
- Análise detalhada da folha
- Conferência de valores

**Como gerar:**
1. Clique em **"Relatórios"**
2. Selecione **"Folha Analítica"**
3. Escolha a faixa de funcionários
4. Clique em **"Gerar"**
5. **PDF automaticamente baixado**

### 2. 💰 Resumo Financeiro da Folha
**O que contém:**
- Total de funcionários
- Folha bruta total
- Total de descontos
- Total líquido
- Encargos sociais (INSS, IRRF, FGTS)
- Médias salariais

**Quando usar:**
- Relatórios para diretoria
- Análise financeira rápida
- Planejamento orçamentário

**Como gerar:**
1. Clique em **"Relatórios"**
2. Selecione **"Resumo Financeiro"**
3. Escolha a faixa de funcionários
4. Clique em **"Gerar"**
5. **PDF automaticamente baixado**

### 3. 🛡️ Relatório de Encargos Sociais
**O que contém:**
- Encargos retidos (INSS, IRRF)
- Encargos da empresa (20% INSS, 8% FGTS, 1% RAT, 2.8% outros)
- Custo total real
- Análise de custos trabalhistas

**Quando usar:**
- Cálculo de custos reais
- Planejamento tributário
- Análise de impacto financeiro

**Como gerar:**
1. Clique em **"Relatórios"**
2. Selecione **"Encargos Sociais"**
3. Escolha a faixa de funcionários
4. Clique em **"Gerar"**
5. **PDF automaticamente baixado**

### 📋 Seleção de Faixa
Para todos os relatórios, você pode selecionar:
- **Funcionário inicial**: Matrícula de início
- **Funcionário final**: Matrícula final
- **Todos**: Leave em branco para incluir todos

---

## ⚙️ Processamento da Folha

### O que é o "Processar Mês Atual"?
Função que **executa todos os cálculos** da folha do mês para os funcionários selecionados.

### Cálculos Realizados
1. **Salário base** + benefícios = **Proventos**
2. **Cálculo de INSS** (alíquotas progressivas)
3. **Cálculo de IRRF** (base de cálculo e alíquotas)
4. **Outros descontos** (se aplicável)
5. **Salário líquido** = Proventos - Descontos

### Como Processar
1. **Verifique o período**: Deve estar **ABERTO**
2. **Selecione os funcionários**:
   - Individual: Marque os checkboxes desejados
   - Todos: Use o checkbox do cabeçalho
3. **Clique em "Processar Mês Atual"**
4. **Confirme a faixa** no modal
5. **Aguarde o processamento**
6. **Confirme o sucesso** na mensagem

### ⚠️ Importante
- **Só funciona com período ABERTO**
- **Processa apenas selecionados**
- **Atualiza dados no banco**
- **Calcula automaticamente** todos os impostos

---

## ✏️ Edição de Dados

### Quando Editar?
- **Correção de dados** cadastrais
- **Ajustes manuais** em cálculos
- **Atualização de salários**
- **Mudança de benefícios**

### Como Editar
1. **Na tabela**, clique no **ícone de edição** (🖊️) na linha do funcionário
2. **Modal de edição** será aberto com:
   - Dados pessoais
   - Dados salariais
   - Benefícios (VT, VA, VR, etc.)
   - Cálculos automáticos
3. **Faça as alterações** necessárias
4. **Clique em "Salvar"**
5. **Confirme a atualização**

### Campos Editáveis
- **Dados Pessoais**: Nome, cargo, departamento
- **Salário Base**: Valor do salário mensal
- **Benefícios**: VT, VA, VR, PS, PO
- **Horas Extras**: 50% e 100%
- **Adicionais**: Noturno, insalubridade, periculosidade
- **Cálculos**: INSS, IRRF (recalculados automaticamente)

---

## 💡 Dicas e Boas Práticas

### 📅 Antes do Processamento
1. **Verifique dados cadastrais** dos funcionários
2. **Confirme salários** e benefícios
3. **Verifique se período está aberto**
4. **Faça backup** dos dados atuais

### ⚙️ Durante o Processamento
1. **Selecione apenas funcionários necessários**
2. **Monitore mensagens** de erro
3. **Aguarde conclusão** antes de fechar
4. **Verifique totais** após processamento

### 📊 Após o Processamento
1. **Gere relatórios** para auditoria
2. **Feche o período** para segurança
3. **Arquive os PDFs** por mês/ano
4. **Compare com meses anteriores**

### 🖨️ Impressão de Holerites
1. **Selecione funcionários** desejados
2. **Clique em "Holerites"**
3. **Escolha faixa** no modal
4. **PDFs individuais** gerados

---

## 🚨 Solução de Problemas

### Problema: Botão "Processar Mês Atual" desabilitado
**Causa**: Período está **FECHADO**
**Solução**:
1. Clique em **"Período: Fechado"**
2. Clique em **"Abrir Novo Período"**
3. Tente processar novamente

### Problema: Dados não aparecem na tabela
**Causa**: Nenhum funcionário cadastrado
**Solução**:
1. Vá para **"Funcionários"** no menu
2. **Cadastre os funcionários** primeiro
3. **Volte para folha** de pagamento

### Problema: Relatório em branco
**Causa**: Nenhum funcionário na faixa selecionada
**Solução**:
1. **Verifique as matrículas** inicial e final
2. **Deixe em branco** para incluir todos
3. **Confirme a seleção**

### Problema: Valores incorretos
**Causa**: Dados desatualizados
**Solução**:
1. **Edite o funcionário** específico
2. **Atualize salários** e benefícios
3. **Processe novamente** a folha

### Problema: PDF não baixa
**Causa**: Bloqueador de pop-up
**Solução**:
1. **Permita downloads** no navegador
2. **Desabilite bloqueador** para o site
3. **Tente gerar novamente**

---

## 📞 Suporte Técnico

### 🆘 Em Caso de Dificuldades
1. **Verifique este manual** detalhadamente
2. **Tente as soluções** indicadas
3. **Reinicie o sistema** se necessário
4. **Contate o suporte** técnico

### 📝 Informações para Suporte
Ao contatar suporte, informe:
- **Versão do sistema**
- **Navegador utilizado**
- **Mensagem de erro** (se houver)
- **Passo a passo** do que foi feito
- **Prints** das telas de erro

---

## 🎓 Treinamento Recomendado

### 👥 Para Novos Usuários
1. **Estude este manual** completamente
2. **Pratique com dados de teste**
3. **Faça processamentos simulados**
4. **Gere todos os relatórios**
5. **Explore todas as funcionalidades**

### 👥 Para Usuários Avançados
1. **Explore configurações** avançadas
2. **Personalize relatórios** se necessário
3. **Crie rotinas** de processamento
4. **Integre com outros sistemas**

---

## 📈 Melhorias Futuras

O sistema está em constante evolução! Próximas funcionalidades:
- **Integração com eSocial**
- **App móvel para funcionários**
- **Relatórios customizados**
- **Exportação Excel**
- **Agendamento de processamento**

---

## 📚 Glossário

- **INSS**: Instituto Nacional do Seguro Social
- **IRRF**: Imposto de Renda Retido na Fonte
- **FGTS**: Fundo de Garantia do Tempo de Serviço
- **RAT**: Riscos Ambientais do Trabalho
- **Holerite**: Contracheque/Recibo de pagamento
- **Folha**: Relatório mensal de pagamentos

---

**Versão do Manual**: 1.0  
**Data**: Março/2026  
**Sistema**: ERP Igreja v2.0

---

*Para mais informações ou dúvidas, consulte nosso suporte técnico.*
