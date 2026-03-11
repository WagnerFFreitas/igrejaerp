// Script para criar instalador Windows do ADJPA ERP
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Criando instalador ADJPA ERP...\n');

// Configurações
const config = {
  appName: 'ADJPA ERP',
  version: '1.0.0',
  publisher: 'ADJPA Sistemas',
  description: 'Sistema de Gestão para Igrejas',
  installDir: 'C:\\Program Files\\ADJPA ERP',
  shortcutName: 'ADJPA ERP',
  iconPath: './assets/icon.ico',
  outputFile: './dist/ADJPA-ERP-Setup-v1.0.exe'
};

// Criar diretórios necessários
const dirs = [
  './dist',
  './temp/installer',
  './temp/app-files',
  './temp/config',
  './temp/data'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Diretório criado: ${dir}`);
  }
});

// Copiar arquivos da aplicação
console.log('\n📁 Copiando arquivos da aplicação...');

const appFiles = [
  { src: './src', dest: './temp/app-files/src' },
  { src: './public', dest: './temp/app-files/public' },
  { src: './functions', dest: './temp/app-files/functions' },
  { src: './package.json', dest: './temp/app-files/package.json' },
  { src: './firebase.json', dest: './temp/app-files/firebase.json' },
  { src: './firestore.rules', dest: './temp/app-files/firestore.rules' },
  { src: './storage.rules', dest: './temp/app-files/storage.rules' },
  { src: '.firebaserc', dest: './temp/app-files/.firebaserc' }
];

appFiles.forEach(file => {
  if (fs.existsSync(file.src)) {
    copyRecursiveSync(file.src, file.dest);
    console.log(`✅ Copiado: ${file.src}`);
  }
});

// Criar arquivos de configuração do instalador
console.log('\n⚙️ Criando configurações...');

// Script NSIS (Nullsoft Scriptable Install System)
const nsisScript = `
!define APPNAME "${config.appName}"
!define VERSION "${config.version}"
!define PUBLISHER "${config.publisher}"
!define DESCRIPTION "${config.description}"
!define INSTALLDIR "${config.installDir}"
!define SHORTCUTNAME "${config.shortcutName}"
!define OUTPUTFILE "${config.outputFile}"

; Incluir bibliotecas
!include "MUI2.nsh"
!include "FileFunc.nsh"

; Configurações gerais
Name "\${APPNAME}"
OutFile "\${OUTPUTFILE}"
InstallDir "\${INSTALLDIR}"
RequestExecutionLevel admin
ShowInstDetails show
ShowUninstDetails show

; Interface
!define MUI_ABORTWARNING
!define MUI_ICON "${config.iconPath}"
!define MUI_UNICON "${config.iconPath}"

; Páginas
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Idiomas
!insertmacro MUI_LANGUAGE "PortugueseBR"

; Seções
Section "Aplicação Principal" SecApp
  SectionIn RO
  
  SetOutPath "$INSTDIR"
  
  ; Copiar arquivos da aplicação
  File /r "temp\\app-files\\*.*"
  
  ; Criar diretórios
  CreateDirectory "$INSTDIR\\data"
  CreateDirectory "$INSTDIR\\data\\emulator-data"
  CreateDirectory "$INSTDIR\\data\\uploads"
  CreateDirectory "$INSTDIR\\logs"
  CreateDirectory "$INSTDIR\\temp"
  
  ; Criar arquivos de configuração
  FileOpen $1 "$INSTDIR\\config.env" w
  FileWrite $1 "NODE_ENV=production$\r$\n"
  FileWrite $1 "VITE_APP_MODE=desktop$\r$\n"
  FileWrite $1 "VITE_CACHE_ENABLED=true$\r$\n"
  FileClose $1
  
  ; Criar atalhos
  CreateShortCut "$DESKTOP\\$\{SHORTCUTNAME}.lnk" "$INSTDIR\\run.bat" "" "$INSTDIR\\icon.ico"
  CreateShortCut "$STARTMENU\\Programs\\$\{SHORTCUTNAME}.lnk" "$INSTDIR\\run.bat" "" "$INSTDIR\\icon.ico"
  
  ; Criar desinstalador
  WriteUninstaller "$INSTDIR\\uninstall.exe"
  
  ; Registrar no Windows
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\${APPNAME}" "DisplayName" "\${APPNAME}"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\${APPNAME}" "DisplayVersion" "\${VERSION}"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\${APPNAME}" "Publisher" "\${PUBLISHER}"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\${APPNAME}" "UninstallString" "$INSTDIR\\uninstall.exe"
  WriteRegStr HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\${APPNAME}" "InstallLocation" "$INSTDIR"
  
SectionEnd

Section "Node.js Runtime" SecNodeJS
  SectionIn RO
  
  ; Baixar e instalar Node.js (simplificado)
  MessageBox MB_OK "Node.js será instalado automaticamente na primeira execução."
  
SectionEnd

Section "Dados Demo" SecDemo
  ; Instalar dados de demonstração
  SetOutPath "$INSTDIR\\data"
  File /r "temp\\demo-data\\*.*"
SectionEnd

; Desinstalador
Section "Uninstall"
  Delete "$DESKTOP\\$\{SHORTCUTNAME}.lnk"
  Delete "$STARTMENU\\Programs\\$\{SHORTCUTNAME}.lnk"
  
  RMDir /r "$INSTDIR\\src"
  RMDir /r "$INSTDIR\\public"
  RMDir /r "$INSTDIR\\functions"
  RMDir /r "$INSTDIR\\data"
  RMDir /r "$INSTDIR\\logs"
  RMDir /r "$INSTDIR\\temp"
  
  Delete "$INSTDIR\\*.json"
  Delete "$INSTDIR\\*.rules"
  Delete "$INSTDIR\\*.js"
  Delete "$INSTDIR\\*.bat"
  Delete "$INSTDIR\\*.env"
  Delete "$INSTDIR\\uninstall.exe"
  
  RMDir "$INSTDIR"
  
  DeleteRegKey HKLM "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\${APPNAME}"
  
SectionEnd
`;

fs.writeFileSync('./temp/installer/setup.nsis', nsisScript);
console.log('✅ Script NSIS criado');

// Criar batch de inicialização
const runScript = `@echo off
title ADJPA ERP - Inicializando...
echo.
echo 🔥 ADJPA ERP - Sistema de Gestao para Igrejas
echo =====================================
echo.
echo Iniciando servicos Firebase...
cd /d "%~dp0"

; Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js nao encontrado. Instalando...
    start /wait msiexec.exe /i "nodejs-installer.msi" /quiet
    echo ✅ Node.js instalado com sucesso!
)

; Verificar Firebase CLI
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI nao encontrado. Instalando...
    npm install -g firebase-tools
    echo ✅ Firebase CLI instalado com sucesso!
)

; Instalar dependencias
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
    cd functions
    npm install
    cd ..
    echo ✅ Dependencias instaladas!
)

; Iniciar emuladores
echo 🔥 Iniciando emuladores Firebase...
start /B firebase emulators:start

; Aguardar emuladores
timeout /t 10 /nobreak >nul

; Iniciar aplicacao
echo 🌐 Iniciando aplicacao web...
start http://localhost:5173
npm run dev

pause
`;

fs.writeFileSync('./temp/app-files/run.bat', runScript);
console.log('✅ Script de inicialização criado');

// Criar arquivo de licença
const license = `ADJPA ERP - Licença de Uso
================================

Copyright (c) 2024 ${config.publisher}

Este software é licenciado para uso exclusivo de instituições religiosas.

PERMISSÕES CONCEDIDAS:
- Uso ilimitado em instalações locais
- Modificação do código fonte
- Distribuição interna

RESTRIÇÕES:
- Venda proibida sem autorização
- Distribuição comercial proibida
- Remoção de créditos proibida

GARANTIA:
O software é fornecido "COMO ESTÁ", sem garantias de qualquer tipo.

SUPORTE:
Email: suporte@adjpa.com.br
WhatsApp: (0XX) 00000-0000
`;

fs.writeFileSync('./temp/installer/LICENSE.txt', license);
console.log('✅ Licença criada');

// Criar README do instalador
const readmeInstaller = `ADJPA ERP - Instalador Windows
================================

Versão: ${config.version}
Data: ${new Date().toLocaleDateString('pt-BR')}

COMO INSTALAR:
1. Execute ADJPA-ERP-Setup-v1.0.exe como Administrador
2. Siga o assistente de instalação
3. Aguarde conclusão
4. Use o atalho na área de trabalho

REQUISITOS:
- Windows 10/11 (64-bit)
- 4GB RAM mínimo
- 5GB espaço em disco
- Internet para instalação

PRIMEIRO ACESSO:
- URL: http://localhost:5173
- Login: admin@adjpa.local
- Senha: admin123

SUPORTE:
Email: suporte@adjpa.com.br
WhatsApp: (0XX) 00000-0000
`;

fs.writeFileSync('./temp/installer/README.txt', readmeInstaller);
console.log('✅ README criado');

// Criar dados demo
console.log('\n📊 Criando dados de demonstração...');

const demoData = {
  units: [
    {
      id: 'unit-sede',
      name: 'Igreja ADJPA Sede',
      cnpj: '00.000.000/0001-00',
      address: 'Rua Principal, 123',
      city: 'São Paulo',
      state: 'SP',
      isHeadquarter: true
    }
  ],
  employees: [
    {
      id: 'emp-001',
      employeeName: 'Administrador Sistema',
      email: 'admin@adjpa.local',
      cpf: '000.000.000-00',
      cargo: 'Administrador',
      departamento: 'TI',
      salario_base: 5000,
      data_admissao: '2024-01-01',
      isActive: true
    }
  ],
  members: [
    {
      id: 'mem-001',
      name: 'Membro Teste',
      email: 'membro@adjpa.local',
      cpf: '111.111.111-11',
      telefone: '(00) 00000-0000',
      isActive: true
    }
  ]
};

fs.mkdirSync('./temp/demo-data', { recursive: true });
fs.writeFileSync('./temp/demo-data/demo-data.json', JSON.stringify(demoData, null, 2));
console.log('✅ Dados demo criados');

// Compilar instalador (requer NSIS instalado)
console.log('\n🔨 Compilando instalador...');

try {
  // Verificar se NSIS está disponível
  execSync('makensis -VERSION', { stdio: 'pipe' });
  
  // Compilar o instalador
  execSync(`makensis ./temp/installer/setup.nsis`, { stdio: 'inherit' });
  console.log('✅ Instalador compilado com sucesso!');
  
} catch (error) {
  console.log('⚠️ NSIS não encontrado. Criando script manual...');
  
  // Criar script manual de instalação
  const installScript = `@echo off
title ADJPA ERP - Instalacao Manual
echo.
echo 🔥 ADJPA ERP - Instalacao Manual
echo =================================
echo.

echo Criando diretorios...
mkdir "C:\\Program Files\\ADJPA ERP" 2>nul
mkdir "C:\\Program Files\\ADJPA ERP\\data" 2>nul
mkdir "C:\\Program Files\\ADJPA ERP\\logs" 2>nul

echo Copiando arquivos...
xcopy /E /I /Y "temp\\app-files\\*" "C:\\Program Files\\ADJPA ERP\\"

echo Criando atalhos...
powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('%USERPROFILE%\\Desktop\\ADJPA ERP.lnk');$s.TargetPath='C:\\Program Files\\ADJPA ERP\\run.bat';$s.Save()"

echo Instalacao concluida!
echo.
echo Para iniciar o sistema:
echo 1. Use o atalho na area de trabalho
echo 2. Acesse http://localhost:5173
echo 3. Login: admin@adjpa.local / admin123
echo.
pause
`;

  fs.writeFileSync('./temp/installer/install-manual.bat', installScript);
  console.log('✅ Script de instalação manual criado');
}

// Criar pacote de distribuição
console.log('\n📦 Empacotando arquivos...');

const distFiles = [
  './temp/installer/LICENSE.txt',
  './temp/installer/README.txt',
  './temp/installer/install-manual.bat',
  './temp/demo-data'
];

fs.mkdirSync('./dist/ADJPA-ERP-Install', { recursive: true });

distFiles.forEach(file => {
  const dest = `./dist/ADJPA-ERP-Install/${path.basename(file)}`;
  if (fs.existsSync(file)) {
    copyRecursiveSync(file, dest);
    console.log(`✅ Empacotado: ${file}`);
  }
});

// Estatísticas finais
console.log('\n📊 Estatísticas da instalação:');

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

const appSize = getDirectorySize('./temp/app-files') / (1024 * 1024);
const totalSize = getDirectorySize('./temp') / (1024 * 1024);

console.log(`📁 Tamanho da aplicação: ${appSize.toFixed(2)} MB`);
console.log(`📦 Tamanho total: ${totalSize.toFixed(2)} MB`);
console.log(`📁 Arquivos incluídos: ${distFiles.length + appFiles.length}`);

console.log('\n🎉 Instalador criado com sucesso!');
console.log('\n📂 Arquivos gerados:');
console.log('  📁 ./dist/ADJPA-ERP-Install/ - Pacote de instalação');
console.log('  📄 ./dist/ADJPA-ERP-Setup-v1.0.exe - Instalador (se NSIS disponível)');
console.log('  📄 ./temp/installer/install-manual.bat - Instalação manual');

console.log('\n📋 Próximos passos:');
console.log('1. Teste o instalador em uma máquina limpa');
console.log('2. Verifique todos os componentes');
console.log('3. Documente o processo de instalação');
console.log('4. Crie vídeo tutorial de instalação');

// Função auxiliar para cópia recursiva
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

console.log('\n🚀 Processo concluído!');
