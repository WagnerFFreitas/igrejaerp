# 🤖 Como Configurar a IA Gemini no ADJPA ERP

## 📋 Visão Geral

Para que o **Escritor IA** funcione corretamente, você precisa configurar uma chave de API do Google Gemini. O sistema já está preparado, mas precisa da autenticação.

## 🔧 Passo a Passo

### 1. Obter a Chave da API Gemini

1. **Acesse o Google AI Studio**
   - Vá para: https://makersuite.google.com/app/apikey
   - Faça login com sua conta Google

2. **Crie uma Nova Chave**
   - Clique em "**Create API Key**"
   - Dê um nome para sua chave (ex: "ADJPA ERP")
   - Copie a chave gerada

### 2. Configurar no Projeto

#### **Opção A: Criar arquivo .env (Recomendado)**

1. **Crie o arquivo** na raiz do projeto:
   ```
   e:\igrejaerp\.env
   ```

2. **Adicione sua chave**:
   ```
   GEMINI_API_KEY=COLE_SUA_CHAVE_AQUI
   ```

#### **Opção B: Variável de Ambiente do Sistema**

1. **Windows (PowerShell)**:
   ```powershell
   $env:GEMINI_API_KEY="COLE_SUA_CHAVE_AQUI"
   ```

2. **Windows (CMD)**:
   ```cmd
   set GEMINI_API_KEY=COLE_SUA_CHAVE_AQUI
   ```

### 3. Reiniciar o Sistema

1. **Reinicie o servidor** do projeto
2. **Recarregue a página** no navegador
3. **Teste o Escritor IA**

## 🎯 Como Testar

1. **Acesse** o menu **"Comunicação"**
2. **Selecione** a aba **"Escritor IA"**
3. **Digite** um tema (ex: "Fé e Esperança")
4. **Clique** em "**Gerar Mensagem IA**"

Se funcionar, você verá uma mensagem personalizada gerada pela IA!

## ⚠️ Solução de Problemas

### **"Serviço de IA não configurado"**
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme se a chave foi copiada corretamente
- Reinicie o servidor

### **"Erro ao conectar com o serviço IA"**
- Verifique sua conexão com a internet
- Confirme se a chave API está válida
- Tente gerar uma nova chave

### **Chave não funciona**
- Verifique se a chave tem permissões para a API Gemini
- Confirme se você não excedeu o limite de uso gratuito
- Tente criar uma nova chave no Google AI Studio

## 📊 Limites da API Gratuita

- **Modelo**: Gemini 3 Flash Preview
- **Limite**: 15 requisições por minuto
- **Custo**: Gratuito para uso pessoal
- **Renovação**: A cada minuto

## 🚀 Funcionalidades Disponíveis

Com a IA configurada, você terá acesso a:

### **✅ Tipos de Conteúdo**
- 🟣 **Devocional**: Versículo + reflexão + oração
- 🔵 **Sermão**: Esboço completo com 3 pontos
- 🟢 **Comunicado**: Mensagem informativa
- 🟡 **Oração**: Oração pastoral específica

### **✅ Recursos Extras**
- 📊 **Análise de saúde da igreja**
- 📧 **Envio direto** para WhatsApp
- 📧 **Envio por email** em massa
- 🔄 **Edição manual** do conteúdo

## 📞 Suporte

Se tiver dificuldades:
1. **Verifique** os logs no console do navegador
2. **Confirme** a configuração da API_KEY
3. **Teste** com um tema simples
4. **Consulte** a documentação do Google AI Studio

---

## 🎉 Benefícios

Com a IA configurada você terá:
- ⚡ **Geração instantânea** de conteúdo pastoral
- 🎯 **Conteúdo personalizado** para qualquer tema
- 📊 **Insights estratégicos** para a igreja
- 🤖 **Assistente IA** 24/7 disponível
- 💰 **Economia de tempo** na preparação

---

**Versão**: 1.0.0  
**Atualização**: 26/03/2026  
**Desenvolvido por**: ADJPA ERP Team
