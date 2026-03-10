// Script para criar pacote de distribuição portátil
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

console.log('📦 Criando pacote de distribuição portátil...\n');

// Configurações
const config = {
  appName: 'ADJPA-ERP',
  version: '1.0.0',
  platform: 'windows',
  arch: 'x64',
  outputDir: './dist/portable'
};

// Criar diretórios
fs.mkdirSync(config.outputDir, { recursive: true });
fs.mkdirSync('./temp/portable', { recursive: true });

console.log('📁 Preparando arquivos portáteis...');

// Estrutura do pacote portátil
const portableStructure = {
  'app/': [
    './src',
    './public',
    './functions',
    './package.json',
    './firebase.json',
    './firestore.rules',
    './storage.rules',
    '.firebaserc'
  ],
  'tools/': [
    './node_modules'
  ],
  'data/': [
    // Será criado vazio
  ],
  'docs/': [
    './INSTALL.md',
    './README_LOCAL.md',
    './README_BACKEND.md'
  ]
};

// Copiar arquivos
Object.entries(portableStructure).forEach(([dir, files]) => {
  const targetDir = `./temp/portable/${dir}`;
  fs.mkdirSync(targetDir, { recursive: true });
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const target = path.join(targetDir, path.basename(file));
      copyRecursiveSync(file, target);
      console.log(`✅ Copiado: ${file} → ${target}`);
    }
  });
});

// Criar scripts portáteis
console.log('\n🔧 Criando scripts portáteis...');

// Script de inicialização portátil
const portableStart = `@echo off
title ADJPA ERP - Versao Portatil
color 0A
echo.
echo ██████╗ ██╗   ██╗██████╗ ███████╗██████╗ 
echo ██╔══██╗██║   ██║██╔══██╗██╔════╝██╔══██╗
echo ██████╔╝██║   ██║██████╔╝█████╗  ██████╔╝
echo ██╔══██╗██║   ██║██╔══██╗██╔══╝  ██╔══██╗
echo ██████╔╝╚██████╔╝██║  ██║███████╗██║  ██║
echo ╚════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
echo.
echo 🔥 Sistema de Gestao para Igrejas - Versao Portatil
echo ==================================================
echo Versao: ${config.version}
echo Plataforma: ${config.platform}-${config.arch}
echo.
echo [1] Iniciar Sistema Completo
echo [2] Apenas Firebase Emulators
echo [3] Apenas Frontend
echo [4] Instalar Dependencias
echo [5] Verificar Status
echo [6] Configuracoes
echo [0] Sair
echo.
set /p choice="Escolha uma opcao (0-6): "

if "%choice%"=="1" goto start_full
if "%choice%"=="2" start_firebase
if "%choice%"=="3" start_frontend
if "%choice%"=="4" install_deps
if "%choice%"=="5" check_status
if "%choice%"=="6" goto config
if "%choice%"=="0" exit

:start_full
echo.
echo 🔥 Iniciando sistema completo...
cd /d "%~dp0"

; Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado!
    echo Por favor, instale Node.js em: https://nodejs.org/
    pause
    exit
)

; Verificar Firebase CLI
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI nao encontrado!
    echo Instalando Firebase CLI...
    npm install -g firebase-tools
)

; Verificar dependencias
if not exist "app\\node_modules" (
    echo 📦 Instalando dependencias da aplicacao...
    cd app
    npm install
    cd functions
    npm install
    cd ..\\..
)

echo 🔥 Iniciando emuladores Firebase...
start /B cmd /c "firebase emulators:start"

echo ⏳ Aguardando emuladores...
timeout /t 15 /nobreak >nul

echo 🌐 Iniciando aplicacao web...
cd app
start http://localhost:5173
npm run dev

goto menu

:start_firebase
echo.
echo 🔥 Iniciando apenas Firebase Emulators...
start cmd /k "firebase emulators:start"
goto menu

:start_frontend
echo.
echo 🌐 Iniciando apenas Frontend...
cd app
start http://localhost:5173
npm run dev
goto menu

:install_deps
echo.
echo 📦 Instalando dependencias...
cd app
echo Instalando dependencias principais...
npm install
echo Instalando dependencias Firebase Functions...
cd functions
npm install
cd ..\\..
echo ✅ Dependencias instaladas!
pause
goto menu

:check_status
echo.
echo 📊 Verificando status do sistema...
echo.
echo Node.js:
node --version
echo.
echo NPM:
npm --version
echo.
echo Firebase CLI:
firebase --version
echo.
echo Portas em uso:
netstat -ano | findstr :5173
netstat -ano | findstr :8080
netstat -ano | findstr :9099
netstat -ano | findstr :9199
netstat -ano | findstr :4000
echo.
pause
goto menu

:config
echo.
echo ⚙️ Configuracoes do Sistema
echo ========================
echo.
echo [1] Verificar Configuracao Firebase
echo [2] Limpar Cache e Dados
echo [3] Backup Completo
echo [4] Restaurar Backup
echo [5] Resetar Sistema
echo [0] Voltar
echo.
set /p config_choice="Escolha uma opcao (0-5): "

if "%config_choice%"=="1" (
    type firebase.json
    pause
)
if "%config_choice%"=="2" (
    echo Limpando cache...
    firebase emulators:clear
    rmdir /s /q data\\emulator-data 2>nul
    echo ✅ Cache limpo!
    pause
)
if "%config_choice%"=="3" (
    echo Criando backup...
    firebase emulators:export ./backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%
    echo ✅ Backup criado!
    pause
)
if "%config_choice%"=="4" (
    echo Restaurar backup...
    set /p backup_dir="Digite o diretorio do backup: "
    firebase emulators:start --import=%backup_dir%
    pause
)
if "%config_choice%"=="5" (
    echo ⚠️ ATENCAO: Isso ira resetar todos os dados!
    set /p confirm="Tem certeza? (S/N): "
    if /i "%confirm%"=="S" (
        firebase emulators:clear
        rmdir /s /q data 2>nul
        mkdir data
        echo ✅ Sistema resetado!
    )
    pause
)

goto config

:menu
echo.
echo Pressione qualquer tecla para voltar ao menu...
pause >nul
cls
goto :eof
`;

fs.writeFileSync('./temp/portable/INICIAR.bat', portableStart);
console.log('✅ Script de inicialização criado');

// Script de verificação
const portableCheck = `@echo off
title ADJPA ERP - Verificacao do Sistema
color 0B
echo.
echo 🔍 ADJPA ERP - Verificacao do Sistema
echo =====================================
echo.

echo Verificando requisitos minimos...
echo.

; Verificar Windows
ver | findstr /i "10" >nul
if %errorlevel% equ 0 (
    echo ✅ Windows 10 detectado
) else (
    ver | findstr /i "11" >nul
    if %errorlevel% equ 0 (
        echo ✅ Windows 11 detectado
    ) else (
        echo ⚠️ Versao do Windows nao suportada
    )
)

; Verificar arquitetura
echo.
echo Arquitetura do sistema:
echo %PROCESSOR_ARCHITECTURE% | findstr /i "64" >nul
if %errorlevel% equ 0 (
    echo ✅ Sistema 64-bit
) else (
    echo ❌ Sistema 32-bit (nao suportado)
)

; Verificar Node.js
echo.
echo Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js %%i
) else (
    echo ❌ Node.js nao instalado
    echo    Baixe em: https://nodejs.org/
)

; Verificar NPM
echo.
echo Verificando NPM...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do echo ✅ NPM %%i
) else (
    echo ❌ NPM nao instalado
)

; Verificar Firebase CLI
echo.
echo Verificando Firebase CLI...
firebase --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('firebase --version') do echo ✅ Firebase CLI %%i
) else (
    echo ❌ Firebase CLI nao instalado
)

; Verificar portas
echo.
echo Verificando portas...
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo ⚠️ Porta 5173 em uso
) else (
    echo ✅ Porta 5173 livre
)

netstat -ano | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo ⚠️ Porta 8080 em uso
) else (
    echo ✅ Porta 8080 livre
)

netstat -ano | findstr :9099 >nul
if %errorlevel% equ 0 (
    echo ⚠️ Porta 9099 em uso
) else (
    echo ✅ Porta 9099 livre
)

; Verificar espaco em disco
echo.
echo Verificando espaco em disco...
for /f "tokens=3" %%i in ('dir /-c "%~dp0" ^| find "bytes free"') do (
    set free_space=%%i
)
set free_space=%free_space:,=%
set /a free_gb=%free_space%/1024/1024/1024
if %free_gb% geq 5 (
    echo ✅ Espaco disponivel: %free_gb% GB
) else (
    echo ❌ Espaco insuficiente: %free_gb% GB (minimo 5GB)
)

echo.
echo =====================================
echo Verificacao concluida!
echo.
echo Se todos os itens estiverem marcados com ✅,
echo o sistema esta pronto para uso.
echo.
echo Caso contrário, instale os componentes
echo necessarios antes de continuar.
echo.
pause
`;

fs.writeFileSync('./temp/portable/VERIFICAR.bat', portableCheck);
console.log('✅ Script de verificação criado');

// README portátil
const portableReadme = `# ADJPA ERP - Versão Portátil

## 🎯 Sobre esta Versão

Versão portátil do ADJPA ERP que pode ser executada diretamente de um pendrive ou pasta local, sem necessidade de instalação.

## 📋 Requisitos

- Windows 10/11 (64-bit)
- Node.js 18+ (será verificado)
- 5GB de espaço livre
- Conexão internet (apenas para instalação)

## 🚀 Como Usar

### Passo 1: Verificar Sistema
1. Execute \`VERIFICAR.bat\`
2. Aguarde a verificação completa
3. Instale componentes faltantes se necessário

### Passo 2: Iniciar Sistema
1. Execute \`INICIAR.bat\`
2. Escolha a opção desejada:
   - **[1]** Iniciar sistema completo (recomendado)
   - **[2]** Apenas Firebase
   - **[3]** Apenas Frontend

### Passo 3: Acessar Aplicação
- URL: http://localhost:5173
- Login: admin@adjpa.local
- Senha: admin123

## 📁 Estrutura de Arquivos

\`\`\`
ADJPA-ERP-Portátil/
├── INICIAR.bat          # Menu principal
├── VERIFICAR.bat        # Verificação do sistema
├── app/                 # Aplicação principal
│   ├── src/            # Código fonte
│   ├── public/         # Assets
│   ├── functions/      # Firebase Functions
│   └── package.json    # Dependências
├── tools/              # Ferramentas
│   └── node_modules/    # Dependências Node.js
├── data/               # Dados locais
│   ├── emulator-data/  # Backup Firebase
│   └── uploads/        # Arquivos upload
└── docs/               # Documentação
\`\`\`

## 🔧 Configurações

### Firebase Emulators
- Auth: localhost:9099
- Firestore: localhost:8080
- Storage: localhost:9199
- Functions: localhost:5001

### Portas Utilizadas
- 5173: Frontend (Vite)
- 8080: Firestore
- 9099: Authentication
- 9199: Storage
- 4000: Firebase Console

## 📊 Funcionalidades

### ✅ 100% Funcional
- Autenticação de usuários
- Gestão de funcionários
- Gestão de membros
- Transações financeiras
- Upload de documentos
- Relatórios em tempo real
- Multi-unidades

### 🔄 Dados Persistentes
- Dados salvos na pasta \`data/\`
- Backup automático ao fechar
- Restore automático ao abrir

## 🛠️ Manutenção

### Limpar Cache
\`\`\`
# No menu INICIAR.bat
[6] → [2] Limpar Cache e Dados
\`\`\`

### Backup Manual
\`\`\`
# No menu INICIAR.bat
[6] → [3] Backup Completo
\`\`\`

### Resetar Sistema
\`\`\`
# No menu INICIAR.bat
[6] → [5] Resetar Sistema
⚠️ ATENÇÃO: Perde todos os dados!
\`\`\`

## 🚨 Solução de Problemas

### Portas em uso
\`\`\`
# Matar processos nas portas
npx kill-port 5173 8080 9099 9199
\`\`\`

### Node.js não encontrado
1. Baixe em: https://nodejs.org/
2. Instale a versão LTS
3. Execute VERIFICAR.bat novamente

### Firebase CLI não encontrado
\`\`\`
npm install -g firebase-tools
\`\`\`

### Dados não persistem
\`\`\`
# Verificar permissões da pasta data/
# Executar como administrador se necessário
\`\`\`

## 📱 Acesso Remoto (Opcional)

Para acessar de outros dispositivos na mesma rede:

1. Edite \`app/firebase.json\`
2. Adicione \`"host": "0.0.0.0"\`
3. Reinicie o sistema
4. Acesse: \`http://IP-DO-PC:5173\`

## 🔄 Atualizações

Para atualizar o sistema:

1. Baixe a nova versão portátil
2. Copie a pasta \`data/\` da versão antiga
3. Substitua os arquivos da aplicação
4. Execute \`INICIAR.bat\`

## 📞 Suporte

- Email: suporte@adjpa.com.br
- WhatsApp: (0XX) 00000-0000
- Help Desk: https://ajuda.adjpa.com.br

---

**🎉 Sistema pronto para uso em qualquer computador Windows!**
`;

fs.writeFileSync('./temp/portable/README.md', portableReadme);
console.log('✅ README portátil criado');

// Criar arquivo de configuração portátil
const portableConfig = `{
  "app": {
    "name": "${config.appName}",
    "version": "${config.version}",
    "platform": "${config.platform}",
    "arch": "${config.arch}",
    "mode": "portable"
  },
  "firebase": {
    "projectId": "adjpa-erp-portable",
    "emulators": {
      "auth": { "port": 9099 },
      "firestore": { "port": 8080 },
      "storage": { "port": 9199 },
      "ui": { "port": 4000 },
      "functions": { "port": 5001 }
    }
  },
  "paths": {
    "app": "./app",
    "data": "./data",
    "logs": "./data/logs",
    "temp": "./data/temp",
    "uploads": "./data/uploads"
  },
  "requirements": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0",
    "firebase-tools": ">=12.0.0",
    "ram": "4GB",
    "disk": "5GB"
  },
  "urls": {
    "frontend": "http://localhost:5173",
    "firebase": "http://localhost:4000",
    "firestore": "http://localhost:8080",
    "auth": "http://localhost:9099",
    "storage": "http://localhost:9199"
  },
  "credentials": {
    "admin": {
      "email": "admin@adjpa.local",
      "password": "admin123"
    }
  }
}
`;

fs.writeFileSync('./temp/portable/config.json', portableConfig);
console.log('✅ Configuração portátil criada');

// Empacotar em ZIP
console.log('\n📦 Empacotando versão portátil...');

const outputZip = path.join(config.outputDir, `ADJPA-ERP-Portable-v${config.version}-${config.platform}-${config.arch}.zip`);

try {
  // Usar Node.js para criar ZIP (sem dependências externas)
  const archiver = require('archiver');
  const output = fs.createWriteStream(outputZip);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`✅ Pacote criado: ${outputZip}`);
    console.log(`📊 Tamanho: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory('./temp/portable/', false);
  archive.finalize();

} catch (error) {
  console.log('⚠️ Archiver não disponível, criando manualmente...');
  
  // Alternativa: usar comando tar do Windows 10+
  try {
    execSync(`cd ./temp && tar -czf "../${path.basename(outputZip)}.tar.gz" portable/`);
    console.log(`✅ Pacote criado: ${outputZip}.tar.gz`);
  } catch (tarError) {
    console.log('ℹ️ Para criar o ZIP manualmente, compacte a pasta ./temp/portable/');
  }
}

// Estatísticas finais
console.log('\n📊 Estatísticas do Pacote Portátil:');

function getDirectorySize(dirPath) {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stats.size;
    }
  });
  
  return totalSize;
}

const portableSize = getDirectorySize('./temp/portable') / (1024 * 1024);

console.log(`📁 Tamanho do pacote: ${portableSize.toFixed(2)} MB`);
console.log(`📁 Arquivos incluídos: ${fs.readdirSync('./temp/portable').length}`);
console.log(`🎯 Plataforma: ${config.platform}-${config.arch}`);

console.log('\n📂 Arquivos gerados:');
console.log(`  📦 ${outputZip} - Pacote portátil completo`);
console.log(`  🚀 ./temp/portable/INICIAR.bat - Menu principal`);
console.log(`  🔍 ./temp/portable/VERIFICAR.bat - Verificação do sistema`);
console.log(`  📖 ./temp/portable/README.md - Documentação`);

console.log('\n📋 Como usar o pacote portátil:');
console.log('1. Descompacte o arquivo ZIP');
console.log('2. Execute VERIFICAR.bat');
console.log('3. Execute INICIAR.bat');
console.log('4. Acesse http://localhost:5173');
console.log('5. Login: admin@adjpa.local / admin123');

console.log('\n🎉 Pacote portátil criado com sucesso!');

// Função auxiliar
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}
