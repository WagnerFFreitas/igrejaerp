
import * as admin from 'firebase-admin';

// Nome único para a instância do app Firebase
const APP_NAME = 'igrejaerp-admin-final'; // Usando um novo nome para garantir que não haja colisões

// Caminho relativo para a chave da conta de serviço, ajustado para a nova localização
const serviceAccount = require('../../serviceAccountKey.json');

let app;

// Inicializa o app Firebase com um nome específico, se ainda não existir
if (admin.apps.find(a => a && a.name === APP_NAME)) {
    app = admin.app(APP_NAME);
} else {
    app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    }, APP_NAME);
}

// Obtenha os serviços a partir da instância nomeada
const db = app.firestore();
const auth = app.auth();

async function createUser(
    username: string,
    email: string,
    fullName: string,
    password: string,
    roles: string[]
) {
  console.log(`✨ Iniciando criação do usuário: ${username}`);

  const existingUserByEmail = await auth.getUserByEmail(email).catch(() => null);
  if (existingUserByEmail) {
    console.error(`\n❌ Erro: O e-mail '${email}' já está em uso no Firebase Authentication.`);
    return;
  }

  const usuariosRef = db.collection('usuarios');
  const existingUserByUsername = await usuariosRef.where('username', '==', username).get();
  if (!existingUserByUsername.empty) {
      console.error(`\n❌ Erro: O username '${username}' já existe na coleção 'usuarios'.`);
      return;
  }

  let userRecord;
  try {
    // 1. Criar o usuário no Firebase Authentication
    userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: fullName,
      emailVerified: true,
      disabled: false,
    });
    console.log(`  ✓ Usuário criado no Firebase Auth com UID: ${userRecord.uid}`);

    // 2. Criar o documento na coleção 'pessoas'
    const pessoaPayload = {
      nome: fullName,
      email: email,
      data_nascimento: null,
      telefone: null,
      endereco: null,
    };
    const pessoaRef = await db.collection('pessoas').add(pessoaPayload);
    console.log(`  ✓ Documento criado em 'pessoas' com ID: ${pessoaRef.id}`);

    // 3. Criar o documento na coleção 'usuarios'
    const usuarioPayload = {
      username: username,
      papeis: roles,
      pessoaId: pessoaRef.id,
      authUid: userRecord.uid,
      ativo: true,
      data_criacao: new Date(),
    };
    await db.collection('usuarios').doc(userRecord.uid).set(usuarioPayload);
    console.log(`  ✓ Documento criado em 'usuarios' (ID: ${userRecord.uid}) e vinculado com sucesso.`);

    console.log(`\n🎉 Usuário '${username}' criado e configurado com sucesso!\n`);

  } catch (error: any) {
    console.error(`\n❌ Erro durante a criação do usuário '${username}':`, error.message);

    if (userRecord) {
        console.log(`  ... Realizando rollback. Deletando usuário do Auth com UID: ${userRecord.uid}`);
        await auth.deleteUser(userRecord.uid);
        console.log(`  ... Usuário do Auth removido.`);
    }
  }
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 5) {
        console.error("Uso: node dist/scripts/createUser.js <username> <email> <fullName> <password> \"<roles,separadas,por,virgula>\"");
        process.exit(1);
    }
    const [username, email, fullName, password, rolesStr] = args;
    const roles = rolesStr.split(',').map(role => role.trim());

    await createUser(username, email, fullName, password, roles);
}

main().catch(console.error);
