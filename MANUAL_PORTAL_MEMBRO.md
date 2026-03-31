# Manual do Portal do Membro - ADJPA ERP v5.0

## Visão Geral

O Portal do Membro é uma interface completa que permite aos membros da igreja acessar e gerenciar suas informações pessoais, histórico de contribuições e participação em ministérios.

## Acesso ao Portal

1. Faça login no sistema ADJPA ERP com suas credenciais
2. No menu lateral, clique em **"Portal do Membro"**
3. O portal será carregado com seus dados pessoais

## Estrutura da Interface

### 1. Cabeçalho Principal
- **Foto do perfil**: Imagem pessoal do membro
- **Nome completo**: Identificação do membro
- **Data de filiação**: Há quanto tempo é membro
- **Status**: Ativo/Inativo (indicado por cores)
- **Função**: MEMBER/VOLUNTEER/STAFF/LEADER
- **Botões de ação**:
  - **Editar**: Modificar dados pessoais
  - **Carteirinha**: Gerar carteirinha digital

### 2. Abas de Navegação
O portal está organizado em 4 abas principais:

#### 📋 **Dados Pessoais**
Visualização e edição de informações básicas:

**Campos disponíveis:**
- Email
- Telefone
- WhatsApp
- Profissão
- Endereço completo

**Como editar:**
1. Clique no botão **"Editar"** no cabeçalho
2. Modifique os campos desejados
3. Clique **"Salvar"** para confirmar ou **"Cancelar"** para abortar

#### 💳 **Contribuições**
Histórico financeiro do membro:

**Informações exibidas:**
- **Tipo**: Dízimo/Oferta/Campanha
- **Data**: Quando foi realizada
- **Valor**: Quantia contribuída
- **Descrição**: Detalhes adicionais (quando aplicável)

**Layout:** Lista cronológica com valores em destaque verde

#### ⛪ **Ministérios**
Participação em atividades da igreja:

**Seções:**
- **Ministério Principal**: Destaque em azul
- **Outros Ministérios**: Grid com ministérios secundários
- **Função**: Cargo ou papel exercido

**Caso não participe:** Mensagem informativa com ícone

#### 👥 **Grupos**
Informações sobre células e grupos pequenos:

**Exibe:**
- Nome do grupo/célula
- Status de participação

**Caso não esteja em grupo:** Mensagem orientativa

## Funcionalidades Detalhadas

### Edição de Dados
- **Campos editáveis**: Email, Telefone, WhatsApp, Profissão
- **Validação**: Formatos específicos para cada campo
- **Salvamento**: Atualização em tempo real
- **Cancelamento**: Reverte todas as alterações

### Visualização de Dados
- **Layout responsivo**: Adapta-se a diferentes telas
- **Ícones intuitivos**: Facilitam identificação
- **Cores consistentes**: Verde para positivo, azul para informações

## Fluxo de Uso Típico

### Para Consultar Dados
1. Acessar o Portal do Membro
2. Visualizar informações no cabeçalho
3. Navegar pelas abas conforme necessidade

### Para Atualizar Dados
1. Clicar em **"Editar"**
2. Modificar campos desejados
3. Clicar **"Salvar"**
4. Confirmar atualização

### Para Ver Contribuições
1. Acessar aba **"Contribuições"**
2. Analisar histórico por período
3. Identificar padrões de contribuição

## Status e Indicadores

### Cores Utilizadas
- **Verde**: Status ativo, valores positivos
- **Azul**: Informações principais, ministérios
- **Cinza**: Campos inativos, ausência de dados
- **Vermelho**: Erros, alertas (quando aplicável)

### Ícones Significado
- **User**: Dados pessoais
- **CreditCard**: Contribuições financeiras
- **Church**: Ministérios
- **Users**: Grupos e células
- **Edit**: Modo de edição
- **Download**: Geração de carteirinha

## Integrações Técnicas

### Banco de Dados
- **Fonte de dados**: DatabaseService
- **Storage**: IndexedDB local + Firebase backup
- **Atualizações**: Sincronização em tempo real

### Segurança
- **Controle de acesso**: Apenas dados do próprio membro
- **Validação**: Formatos específicos para cada campo
- **Privacidade**: LGPD compliance implementado

## Funcionalidades Futuras

### Planejado
- ✅ **Carteirinha digital** (estrutura pronta)
- 🔄 **Autenticação específica** para membros
- 📱 **Notificações** personalizadas
- 📊 **Relatórios** detalhados

### Em Desenvolvimento
- Geração de PDF para carteirinha
- Integração com sistema de pagamentos
- Histórico completo de atividades

## Troubleshooting

### Problemas Comuns

**Dados não carregam:**
- Verificar conexão com banco
- Recarregar a página
- Verificar permissões de acesso

**Edição não funciona:**
- Verificar campos obrigatórios
- Confirmar formato dos dados
- Tentar novamente após recarregar

**Contribuições não aparecem:**
- Aguardar sincronização
- Verificar se há dados no período
- Contactar administração

### Contato de Suporte
Para problemas técnicos ou dúvidas:
- **Email**: suporte@adjpa.com.br
- **Telefone**: (XX) XXXX-XXXX
- **Horário**: Seg-Sex 8h-18h

---

## Considerações Finais

O Portal do Membro foi desenvolvido para proporcionar autonomia e transparência aos membros da igreja, mantendo a segurança e privacidade dos dados conforme as diretrizes da LGPD.

A interface intuitiva e as funcionalidades abrangentes garantem uma experiência completa de gestão pessoal dentro do ecossistema ADJPA ERP.

**Versão:** 5.0  
**Atualização:** Março/2026  
**Desenvolvimento:** ADJPA Tech Team
