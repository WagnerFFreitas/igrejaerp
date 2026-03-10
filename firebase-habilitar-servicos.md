# 🚀 Habilitar Serviços Firebase

## Após criar o projeto, siga estes passos:

### 1. Firestore Database
1. No menu lateral → "**Firestore Database**"
2. Clique "**Criar banco de dados**"
3. Escolha "**Iniciar em modo de teste**" (30 dias)
4. Região: **southamerica-east1** (São Paulo)
5. Clique "**Habilitar**"

### 2. Storage
1. No menu lateral → "**Storage**"
2. Clique "**Começar**"
3. Região: **southamerica-east1** (São Paulo)
4. Regras de segurança: **Permitir acesso público** (temporarily)
5. Clique "**Concluir**"

### 3. Authentication (Opcional)
1. No menu lateral → "**Authentication**"
2. Clique "**Começar**"
3. Habilite "**E-mail/senha**"
4. Clique "**Salvar**"

## ⚠️ Importante

O sistema funcionará **offline** mesmo sem configurar o Firebase.
Configure apenas quando quiser persistência na nuvem.

## 🔧 Regras de Segurança (Storage)

Cole estas regras em Storage → Regras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## 🔧 Regras de Segurança (Firestore)

Cole estas regras em Firestore → Regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
