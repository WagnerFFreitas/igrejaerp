const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const targetDirs = [
  'components',
  'api/src',
  'services',
  'utils',
  'types',
  'contexts',
  'src'
];
const allowedExtensions = ['.ts', '.tsx'];

function readDirRecursive(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return readDirRecursive(fullPath);
    }
    return fullPath;
  });
}

function prettyName(fileName) {
  const base = fileName.replace(/\.(ts|tsx)$/, '').replace(/([A-Z])/g, ' $1').trim();
  return base
    .replace(/\s+/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\bTsx\b/i, '')
    .replace(/\bTs\b/i, '')
    .replace(/\bApi\b/i, 'API')
    .trim();
}

function getDescription(filePath, baseName) {
  if (filePath.includes(`${path.sep}components${path.sep}`)) {
    return `Componente visual do frontend para ${baseName.toLowerCase()}.`;
  }
  if (filePath.includes(`${path.sep}api${path.sep}src${path.sep}routes${path.sep}`)) {
    return `Rotas de API para ${baseName.toLowerCase()}.`;
  }
  if (filePath.includes(`${path.sep}api${path.sep}src${path.sep}services${path.sep}`)) {
    return `Serviço backend para ${baseName.toLowerCase()}.`;
  }
  if (filePath.includes(`${path.sep}api${path.sep}src${path.sep}controllers${path.sep}`)) {
    return `Controller que processa requisições relacionadas a ${baseName.toLowerCase()}.`;
  }
  if (filePath.includes(`${path.sep}services${path.sep}`)) {
    return `Serviço do frontend para ${baseName.toLowerCase()}.`;
  }
  if (filePath.includes(`${path.sep}utils${path.sep}`)) {
    return `Funções utilitárias para ${baseName.toLowerCase()}.`;
  }
  if (filePath.includes(`${path.sep}types${path.sep}`) || baseName.toLowerCase().includes('types')) {
    return `Definições de tipos e interfaces usadas no projeto.`;
  }
  if (filePath.includes(`${path.sep}contexts${path.sep}`)) {
    return `Contexto React usado para ${baseName.toLowerCase()}.`;
  }
  if (filePath.endsWith('App.tsx')) {
    return 'Ponto de entrada da interface React e componente raiz da aplicação.';
  }
  if (filePath.endsWith('index.tsx')) {
    return 'Arquivo que renderiza a aplicação React na página web.';
  }
  if (filePath.endsWith('vite.config.ts')) {
    return 'Configuração do Vite para build e desenvolvimento.';
  }
  if (filePath.endsWith('vite-env.d.ts')) {
    return 'Declarações de tipos para o ambiente Vite.';
  }

  return `Arquivo relacionado a ${baseName.toLowerCase()}.`;
}

function getUsage(filePath) {
  if (filePath.includes(`${path.sep}components${path.sep}`)) {
    return 'Usado na interface React como parte do frontend.';
  }
  if (filePath.includes(`${path.sep}api${path.sep}src${path.sep}`)) {
    return 'Usado pelo servidor backend para processar requisições.';
  }
  if (filePath.includes(`${path.sep}services${path.sep}`) || filePath.includes(`${path.sep}utils${path.sep}`)) {
    return 'Usado por outros arquivos para lógica de negócio ou utilidades.';
  }
  if (filePath.includes(`${path.sep}types${path.sep}`)) {
    return 'Importado em vários locais para garantir tipos consistentes.';
  }
  return 'Parte do projeto usada em runtime ou build.';
}

function getSummary(filePath) {
  if (filePath.includes(`${path.sep}components${path.sep}`) || filePath.endsWith('App.tsx')) {
    return 'Controla a apresentação e interações da interface com o usuário.';
  }
  if (filePath.includes(`${path.sep}api${path.sep}src${path.sep}`)) {
    return 'Executa lógica de backend e responde a chamadas externas.';
  }
  return 'Ajuda o sistema com uma funcionalidade específica.';
}

function buildHeaderComment(fileName, description, usage, summary) {
  return `/**
 * ============================================================================
 * ${fileName.toUpperCase()}
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * ${description}
 *
 * ONDE É USADO?
 * -------------
 * ${usage}
 *
 * COMO FUNCIONA?
 * --------------
 * ${summary}
 */\n\n`;
}

function buildBlockComment(kind, description) {
  return `/**
 * ${kind.toUpperCase()}
 * ${'='.repeat(kind.length)}
 *
 * ${description}
 */\n`;
}

function hasHeaderComment(content) {
  const trimmed = content.trimStart();
  return trimmed.startsWith('/**') || trimmed.startsWith('/*');
}

function insertCommentIntoFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (hasHeaderComment(content)) {
    return false;
  }

  const ext = path.extname(filePath);
  if (!allowedExtensions.includes(ext)) {
    return false;
  }

  const fileName = path.basename(filePath);
  const baseName = prettyName(fileName);
  const description = getDescription(filePath, baseName);
  const usage = getUsage(filePath);
  const summary = getSummary(filePath);
  const headerComment = buildHeaderComment(fileName, description, usage, summary);

  let newContent = headerComment + content;

  const lines = newContent.split('\n');
  const importEndIndex = lines.findIndex(line => !line.trim().startsWith('import ') && !line.trim().startsWith('export ') && !line.trim().startsWith('type ') && !line.trim().startsWith('interface ') && !line.trim().startsWith('//') && !line.trim().startsWith('/*') && !line.trim().startsWith('*') && line.trim() !== '');

  if (importEndIndex >= 0) {
    const exportLineIndex = lines.findIndex((line, idx) => idx >= importEndIndex && /^(export\s+default|export\s+const|export\s+function|export\s+class|export\s+interface|export\s+type|const\s+|function\s+|class\s+)/.test(line.trim()));
    if (exportLineIndex >= 0) {
      const blockComment = buildBlockComment('bloco principal', `Define o bloco principal deste arquivo (${baseName.toLowerCase()}).`);
      lines.splice(exportLineIndex, 0, blockComment);
      newContent = lines.join('\n');
    }
  }

  fs.writeFileSync(filePath, newContent, 'utf8');
  return true;
}

const allFiles = targetDirs.flatMap(dir => readDirRecursive(path.join(root, dir)));
const targetFiles = allFiles.filter(file => allowedExtensions.includes(path.extname(file)));
let modifiedCount = 0;
let skippedCount = 0;

for (const file of targetFiles) {
  const changed = insertCommentIntoFile(file);
  if (changed) modifiedCount += 1;
  else skippedCount += 1;
}

console.log(`Processo concluído. Arquivos modificados: ${modifiedCount}. Arquivos ignorados: ${skippedCount}.`);
