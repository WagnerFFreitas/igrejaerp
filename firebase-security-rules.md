# 🔒 Firebase Security Rules - ADJPA ERP

## 📋 Visão Geral

Este documento descreve as regras de segurança do Firebase para o ADJPA ERP, garantindo acesso controlado aos dados.

## 🗂️ Estrutura de Regras

### **Firestore Database (`firestore.rules`)**

#### **🏛️ Unidades (Units)**
```
/units/{unitId}
```
- **Acesso**: Usuários autenticados da mesma unidade ou admin
- **Permissões**: read, write
- **Regra**: `request.auth.token.admin == true || request.auth.token.unitId == unitId`

#### **👥 Membros (Members)**
```
/units/{unitId}/members/{memberId}
```
- **Acesso**: Dono do dado, usuários da unidade ou admin
- **Permissões**: read, write
- **Regra**: `request.auth.token.admin == true || request.auth.token.unitId == unitId || request.auth.token.memberId == memberId`

#### **💼 Funcionários (Employees)**
```
/units/{unitId}/employees/{employeeId}
```
- **Acesso**: Próprio funcionário, usuários da unidade ou admin
- **Permissões**: read, write
- **Regra**: `request.auth.token.admin == true || request.auth.token.unitId == unitId || request.auth.token.employeeId == employeeId`

#### **💰 Financeiro**
```
/units/{unitId}/transactions/{transactionId}
/units/{unitId}/accounts/{accountId}
/units/{unitId}/categories/{categoryId}
/units/{unitId}/payables/{payableId}
/units/{unitId}/receivables/{receivableId}
```
- **Acesso**: Usuários da unidade ou admin
- **Permissões**: read, write
- **Regra**: `request.auth.token.admin == true || request.auth.token.unitId == unitId`

#### **📊 Folha de Pagamento**
```
/units/{unitId}/payroll/{payrollId}
/units/{unitId}/timebank/{timebankId}
```
- **Acesso**: Admin, usuários da unidade ou próprio funcionário
- **Permissões**: read, write
- **Regra**: `request.auth.token.admin == true || request.auth.token.unitId == unitId || request.auth.token.employeeId == employeeId`

#### **🏢 Patrimônio**
```
/units/{unitId}/assets/{assetId}
```
- **Acesso**: Usuários da unidade ou admin
- **Permissões**: read, write
- **Regra**: `request.auth.token.admin == true || request.auth.token.unitId == unitId`

#### **🏛️ Administração Global**
```
/users/{userId}
/settings/{settingId}
```
- **Acesso**: Apenas administradores
- **Permissões**: read, write
- **Regra**: `request.auth.token.admin == true`

### **Firebase Storage (`storage.rules`)**

#### **📸 Fotos de Perfil**
```
/profiles/{unitId}/{memberId}/{allPaths=**}
```
- **Acesso**: Usuários autenticados da unidade ou admin
- **Regra**: `request.auth != null && (request.auth.token.admin == true || request.auth.token.unitId == unitId)`

#### **📄 Documentos**
```
/employees/{unitId}/{employeeId}/{allPaths=**}
/members/{unitId}/{memberId}/{allPaths=**}
/financial/{unitId}/{allPaths=**}
/reports/{unitId}/{allPaths=**}
/backups/{unitId}/{allPaths=**}
```
- **Acesso**: Controlado por unidade e tipo de usuário
- **Proteção**: Autenticação obrigatória

## 🛡️ Níveis de Acesso

### **👑 Administrador (admin: true)**
- Acesso total a todas as unidades
- Gerenciamento de usuários
- Configurações globais
- Backup e restauração

### **👤 Usuário da Unidade (unitId: X)**
- Acesso apenas aos dados da sua unidade
- Operações normais do dia a dia
- Relatórios da sua unidade

### **🔒 Dono do Dado**
- Funcionários: acesso aos próprios dados
- Membros: acesso aos próprios dados
- Acesso limitado a informações pessoais

## 🔧 Como Aplicar as Regras

### **1. Via Firebase Console**
1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Firestore Database → Regras
4. Cole o conteúdo de `firestore.rules`
5. Publicar

5. Storage → Regras
6. Cole o conteúdo de `storage.rules`
7. Publicar

### **2. Via CLI**
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules

# Deploy todas as regras
firebase deploy --only firestore:rules,storage:rules
```

## 🧪 Teste de Regras

### **Simulador do Firebase Console**
1. Firestore → Regras → Testar
2. Storage → Regras → Testar
3. Configure o tipo de autenticação
4. Teste diferentes cenários

### **Testes Automáticos**
```javascript
// Exemplo de teste para Firestore
const firebase = require('firebase-admin');
const firestore = firebase.firestore();

// Teste de regra de membro
const testMemberAccess = async () => {
  const testAuth = {
    uid: 'test-user',
    token: {
      unitId: 'u-sede',
      admin: false
    }
  };
  
  // Testar leitura
  await firestore
    .collection('units')
    .doc('u-sede')
    .collection('members')
    .doc('member-123')
    .get();
};
```

## 🚨 Boas Práticas

### **✅ Segurança**
- Sempre exija autenticação
- Valide dados no cliente e servidor
- Use validações de dados nas regras
- Limite o tamanho de uploads

### **✅ Performance**
- Use índices compostos
- Evite consultas sem limites
- Cache de leituras frequentes
- Estrutura de dados otimizada

### **✅ Manutenção**
- Documente todas as regras
- Teste regularmente
- Monitore logs de acesso
- Atualize conforme necessário

## 🔄 Atualizações Recentes

- ✅ Corrigido erro de sintaxe em payables
- ✅ Adicionadas regras para accounts e categories
- ✅ Incluídas regras para timebank e reconciliation
- ✅ Melhorada documentação
- ✅ Adicionadas regras para logs e settings

---

**📞 Em caso de problemas, verifique o console do Firebase e os logs de segurança.**
