import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DICT_PATH = path.join(__dirname, 'dicionario_nomenclaturas.json');
let dict;
try { dict = JSON.parse(fs.readFileSync(DICT_PATH, 'utf8')); } 
catch (e) { console.error('❌ Erro ao carregar dicionário:', e.message); process.exit(1); }

const COLUNAS_GENERICAS = new Set([
  'role',
  'status',
  'type',
  'name',
  'description',
  'action',
  'success',
  'details',
  'period',
  'key',
  'value',
  'order',
  'month',
  'year'
]);

const REGRAS_AUTOMATICAS = [
  ...Object.entries(dict.mapeamento_rotas_api || {}).map(([antigo, novo]) => ({ antigo, novo, tipo: 'rota' })),
  ...Object.entries(dict.mapeamento_tabelas || {}).map(([antigo, novo]) => ({ antigo, novo, tipo: 'tabela' })),
  ...Object.entries(dict.mapeamento_colunas_criticas || {})
    .filter(([antigo]) => antigo.includes('_') || !COLUNAS_GENERICAS.has(antigo))
    .map(([antigo, novo]) => ({ antigo, novo, tipo: 'coluna' }))
].sort((a, b) => b.antigo.length - a.antigo.length);

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
const IGNORAR = ['node_modules', 'dist', 'build', '.next', 'coverage', 'scripts', 'backup'];
const IGNORAR_ARQUIVOS = ['package.json', 'package-lock.json', 'db_full_inspect.json'];
const EXT = ['.ts', '.tsx', '.js', '.jsx', '.sql', '.md', '.json'];
const DRY_RUN = process.argv.includes('--dry-run');
let modificados = 0;

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
    if (EXT.includes(path.extname(dir))) processar(dir);
    return;
  }
  const arquivos = fs.readdirSync(dir, { withFileTypes: true });
  arquivos.forEach(f => {
    const completo = path.join(dir, f.name);
    if (IGNORAR.includes(f.name)) return;
    if (IGNORAR_ARQUIVOS.includes(f.name)) return;
    if (f.isDirectory()) return varrer(completo);
    if (EXT.includes(path.extname(f.name))) processar(completo);
  });
}

function processar(arquivo) {
  let conteudo = fs.readFileSync(arquivo, 'utf8');
  let original = conteudo;
  
  REGRAS_AUTOMATICAS.forEach(({ antigo, novo, tipo }) => {
    const regex = criarRegex(antigo, tipo);
    conteudo = conteudo.replace(regex, novo);
  });

  if (conteudo !== original) {
    const relativo = path.relative(PROJECT_ROOT, arquivo);
    modificados++;
    if (DRY_RUN) {
      console.log(`[DRY-RUN] Seria alterado: ${relativo}`);
    } else {
      const backup = `${arquivo}.bak`;
      fs.writeFileSync(backup, original, 'utf8');
      fs.writeFileSync(arquivo, conteudo, 'utf8');
      console.log(`✅ Atualizado: ${relativo}`);
    }
  }
}

console.log(`🔄 Iniciando substituição ${DRY_RUN ? '[DRY-RUN]' : ''}...`);
ALVOS.forEach(alvo => varrer(path.join(PROJECT_ROOT, alvo)));
console.log(`✨ Concluído. ${modificados} arquivo(s) modificado(s).`);
if (!DRY_RUN) console.log('📦 Backups criados com extensão .bak. Valide o build antes de removê-los.');
console.log('ℹ️  Interfaces TypeScript em PascalCase são validadas, mas não substituídas automaticamente para evitar colisões com imports externos como lucide-react/User.');
console.log('ℹ️  Colunas genéricas como name/type/status/key/value ficam fora da substituição automática; use a validação para revisão manual.');
