import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DICT_PATH = path.join(__dirname, 'dicionario_nomenclaturas.json');
let dict;
try { dict = JSON.parse(fs.readFileSync(DICT_PATH, 'utf8')); } 
catch (e) { console.error('❌ Erro ao carregar dicionário:', e.message); process.exit(1); }

const REGRAS = [
  ...Object.entries(dict.mapeamento_rotas_api || {}).map(([antigo, novo]) => ({ antigo, novo, tipo: 'rota' })),
  ...Object.entries(dict.mapeamento_colunas_criticas || {}).map(([antigo, novo]) => ({ antigo, novo, tipo: 'coluna' })),
  ...Object.entries(dict.mapeamento_tabelas || {}).map(([antigo, novo]) => ({ antigo, novo, tipo: 'tabela' })),
  ...Object.entries(dict.mapeamento_interfaces_ts || {}).map(([antigo, novo]) => ({ antigo, novo, tipo: 'interface' }))
].sort((a, b) => b.antigo.length - a.antigo.length);

const EXCLUIR = ['node_modules', '.git', 'dist', 'build', 'coverage', 'scripts', 'backup', '.next'];
const EXCLUIR_ARQUIVOS = ['package.json', 'package-lock.json', 'db_full_inspect.json'];
const EXT = ['.ts', '.tsx', '.js', '.jsx', '.sql', '.md', '.json'];
const ALVOS = [
  'src',
  'api',
  'components',
  'config',
  'constants',
  'contexts',
  'database',
  'services',
  'types',
  'utils',
  'App.tsx',
  'constants.ts',
  'types.ts',
  'index.tsx'
];
let total = 0;

function escaparRegex(valor) {
  return valor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function criarRegex(antigo, tipo) {
  const escaped = escaparRegex(antigo);
  if (tipo === 'rota') return new RegExp(escaped, 'g');
  return new RegExp(`\\b${escaped}\\b`, 'g');
}

function varrer(dir) {
  if (!fs.existsSync(dir)) return;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    if (EXT.includes(path.extname(dir))) verificar(dir);
    return;
  }
  const arquivos = fs.readdirSync(dir, { withFileTypes: true });
  arquivos.forEach(f => {
    const completo = path.join(dir, f.name);
    if (EXCLUIR.includes(f.name)) return;
    if (EXCLUIR_ARQUIVOS.includes(f.name)) return;
    if (f.isDirectory()) return varrer(completo);
    if (EXT.includes(path.extname(f.name))) verificar(completo);
  });
}

function verificar(arquivo) {
  try {
    const conteudo = fs.readFileSync(arquivo, 'utf8');
    const linhas = conteudo.split('\n');
    linhas.forEach((linha, i) => {
      REGRAS.forEach(({ antigo, novo, tipo }) => {
        const regex = criarRegex(antigo, tipo);
        if (regex.test(linha)) {
          const relativo = path.relative(PROJECT_ROOT, arquivo);
          console.warn(`⚠️  ${relativo}:${i + 1} | ${tipo} "${antigo}" → "${novo}"`);
          total++;
        }
      });
    });
  } catch {}
}

console.log('🔍 Validando nomenclatura no projeto...');
ALVOS.forEach(alvo => varrer(path.join(PROJECT_ROOT, alvo)));
console.log(`✅ Concluído. ${total} ocorrência(s) antiga(s) encontrada(s).`);
if (total > 0) {
  console.log('💡 Execute `node scripts/substituir-nomenclatura.js --dry-run` para ver correções automáticas seguras. Interfaces e termos genéricos devem ser revisados.');
  process.exit(1); // Retorna erro para CI/CD
}
