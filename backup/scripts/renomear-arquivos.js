#!/usr/bin/env node
/**
 * ============================================================================
 * RENOMEAR-ARQUIVOS.JS
 * ============================================================================
 *
 * SCRIPT DE MIGRAÇÃO: Renomeação de Arquivos (Inglês → Português)
 *
 * FUNCIONALIDADE:
 * - Renomeia arquivos conforme dicionário de mapeamento
 * - Atualiza todos os imports/referências nos arquivos do projeto
 * - Cria backup antes de cada renomeação
 * - Modo dry-run para simulação
 * - Relatório completo de alterações
 *
 * USO:
 *   node scripts/renomear-arquivos.js --dry-run    (simulação)
 *   node scripts/renomear-arquivos.js              (execução real)
 *   node scripts/renomear-arquivos.js --fase 1     (executa apenas fase 1)
 *
 * FASES:
 *   1 - Arquivos de services/ (raiz)
 *   2 - Arquivos de utils/ (raiz)
 *   3 - Arquivos de types/ (raiz)
 *   4 - Arquivos de components/
 *   5 - Arquivos de src/services/
 *   6 - Arquivos de src/hooks/ e src/utils/
 *   7 - Arquivos de api/scripts/
 *   8 - Arquivos de api/ (raiz)
 *   9 - Arquivos de configuração
 *  10 - Arquivos raiz (Readme, constants, types)
 *  11 - Atualização de imports
 *  12 - Validação final
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const DRY_RUN = process.argv.includes('--dry-run');
const faseIndex = process.argv.indexOf('--fase');
const FASE_ATUAL = (faseIndex !== -1 && process.argv[faseIndex + 1]) ? parseInt(process.argv[faseIndex + 1]) : null;

const DICT_PATH = path.join(__dirname, 'dicionario-renomeacao-arquivos.json');
let dict;
try {
  dict = JSON.parse(fs.readFileSync(DICT_PATH, 'utf8'));
} catch (e) {
  console.error('❌ Erro ao carregar dicionário:', e.message);
  process.exit(1);
}

const DIRETORIOS_EXCLUIDOS = dict.diretorios_excluidos || ['node_modules', 'dist', 'build', '.next', 'coverage', 'backup', '.git'];
const ARQUIVOS_EXCLUIDOS = dict.arquivos_excluidos || [];
const MAPEAMENTO_CONTEUDO = dict.mapeamento_conteudo_imports || {};

// ============================================================================
// ESTATÍSTICAS
// ============================================================================

const stats = {
  arquivosRenomeados: 0,
  importsAtualizados: 0,
  backupsCriados: 0,
  erros: 0,
  detalhes: []
};

// ============================================================================
// FUNÇÕES UTILITÁRIAS
// ============================================================================

function criarBackup(caminhoArquivo) {
  const backupPath = `${caminhoArquivo}.bak`;
  if (!DRY_RUN) {
    fs.copyFileSync(caminhoArquivo, backupPath);
    stats.backupsCriados++;
  }
  return backupPath;
}

function registrarDetalhe(tipo, arquivo, de, para, info = '') {
  stats.detalhes.push({ tipo, arquivo, de, para, info });
}

// ============================================================================
// FASE 1-10: RENOMEAÇÃO DE ARQUIVOS
// ============================================================================

function obterMapeamentosPorFase(fase) {
  const mapeamentos = dict.renomeacao || {};
  const chaves = Object.keys(mapeamentos);
  if (fase && fase >= 1 && fase <= 10) {
    const chave = chaves[fase - 1];
    return chave ? { [chave]: mapeamentos[chave] } : {};
  }
  return mapeamentos;
}

function renomearArquivos(diretorioBase, listaMapeamentos, nomeFase) {
  console.log(`\n📁 Fase: ${nomeFase}`);
  console.log(`   Diretório: ${diretorioBase}`);

  if (!fs.existsSync(diretorioBase)) {
    console.log(`   ⚠️  Diretório não encontrado, pulando...`);
    return;
  }

  let count = 0;
  listaMapeamentos.forEach(({ de, para }) => {
    const caminhoAntigo = path.join(diretorioBase, de);
    const caminhoNovo = path.join(diretorioBase, para);

    if (!fs.existsSync(caminhoAntigo)) {
      console.log(`   ⚠️  ${de} não encontrado, pulando...`);
      return;
    }

    if (fs.existsSync(caminhoNovo)) {
      console.log(`   ⚠️  ${para} já existe, pulando ${de}...`);
      return;
    }

    count++;
    if (DRY_RUN) {
      console.log(`   [DRY-RUN] ${de} → ${para}`);
      registrarDetalhe('renomeacao', diretorioBase, de, para, 'dry-run');
    } else {
      criarBackup(caminhoAntigo);
      fs.renameSync(caminhoAntigo, caminhoNovo);
      console.log(`   ✅ ${de} → ${para}`);
      registrarDetalhe('renomeacao', diretorioBase, de, para, 'concluido');
    }
  });

  stats.arquivosRenomeados += count;
  console.log(`   📊 ${count} arquivo(s) ${DRY_RUN ? 'será(ão) renomeado(s)' : 'renomeado(s)'}`);
}

function executarFasesRenomeacao() {
  const mapeamentos = dict.renomeacao || {};

  // Fase 1: services/ (raiz)
  if (!FASE_ATUAL || FASE_ATUAL === 1) {
    renomearArquivos(path.join(PROJECT_ROOT, 'services'), mapeamentos.services || [], 'Services (raiz)');
  }

  // Fase 2: utils/ (raiz)
  if (!FASE_ATUAL || FASE_ATUAL === 2) {
    renomearArquivos(path.join(PROJECT_ROOT, 'utils'), mapeamentos.utils_raiz || [], 'Utils (raiz)');
  }

  // Fase 3: types/ (raiz)
  if (!FASE_ATUAL || FASE_ATUAL === 3) {
    renomearArquivos(path.join(PROJECT_ROOT, 'types'), mapeamentos.types_raiz || [], 'Types (raiz)');
  }

  // Fase 4: components/
  if (!FASE_ATUAL || FASE_ATUAL === 4) {
    renomearArquivos(path.join(PROJECT_ROOT, 'components'), mapeamentos.components || [], 'Components');
  }

  // Fase 5: src/services/
  if (!FASE_ATUAL || FASE_ATUAL === 5) {
    renomearArquivos(path.join(PROJECT_ROOT, 'src', 'services'), mapeamentos.src_services || [], 'Services (frontend)');
  }

  // Fase 6: src/hooks/ e src/utils/
  if (!FASE_ATUAL || FASE_ATUAL === 6) {
    renomearArquivos(path.join(PROJECT_ROOT, 'src', 'hooks'), mapeamentos.src_hooks || [], 'Hooks (frontend)');
    renomearArquivos(path.join(PROJECT_ROOT, 'src', 'utils'), mapeamentos.src_utils || [], 'Utils (frontend)');
  }

  // Fase 7: api/scripts/
  if (!FASE_ATUAL || FASE_ATUAL === 7) {
    renomearArquivos(path.join(PROJECT_ROOT, 'api', 'scripts'), mapeamentos.api_scripts || [], 'Scripts (API)');
  }

  // Fase 8: api/ (raiz)
  if (!FASE_ATUAL || FASE_ATUAL === 8) {
    renomearArquivos(path.join(PROJECT_ROOT, 'api'), mapeamentos.api_raiz_scripts || [], 'Scripts (API raiz)');
    renomearArquivos(path.join(PROJECT_ROOT, 'api', 'src'), mapeamentos.api_src || [], 'API src');
    renomearArquivos(path.join(PROJECT_ROOT, 'api', 'src', 'database'), mapeamentos.api_src_database || [], 'Database');
  }

  // Fase 9: configuração
  if (!FASE_ATUAL || FASE_ATUAL === 9) {
    renomearArquivos(path.join(PROJECT_ROOT, 'config'), mapeamentos.config || [], 'Config');
    renomearArquivos(path.join(PROJECT_ROOT, 'constants'), mapeamentos.constants || [], 'Constants');
    renomearArquivos(path.join(PROJECT_ROOT, 'contexts'), mapeamentos.contexts || [], 'Contexts');
    renomearArquivos(path.join(PROJECT_ROOT, 'api'), mapeamentos.api_config || [], 'Config API');
  }

  // Fase 10: raiz
  if (!FASE_ATUAL || FASE_ATUAL === 10) {
    renomearArquivos(PROJECT_ROOT, mapeamentos.raiz || [], 'Raiz do projeto');
  }
}

// ============================================================================
// FASE 11: ATUALIZAÇÃO DE IMPORTS
// ============================================================================

function atualizarImportsEmArquivo(caminhoArquivo) {
  let conteudo;
  try {
    conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
  } catch {
    return false;
  }

  let original = conteudo;
  let alterado = false;

  // Substituir referências de import baseadas no mapeamento de conteúdo
  Object.entries(MAPEAMENTO_CONTEUDO).forEach(([antigo, novo]) => {
    // Padrão 1: from './antigo' ou from '../antigo'
    const regex1 = new RegExp(`from\\s+(['\"])(\\.\\/|\\.\\.\\/)*([^'\"\\/]*)${antigo}(['\"])`, 'g');
    const substituicao1 = conteudo.replace(regex1, (match, aspas1, caminho, antes, aspas2) => {
      return match.replace(antigo, novo);
    });
    if (substituicao1 !== conteudo) {
      conteudo = substituicao1;
      alterado = true;
    }

    // Padrão 2: import { Antigo } de './caminho'
    const regex2 = new RegExp(`(${antigo})`, 'g');
    if (conteudo.includes(antigo) && !conteudo.match(regex2)) {
      // Não substituir se for parte de uma palavra maior
    }
  });

  // Atualizar nomes de classe e interface
  // Mantém "Service" em inglês conforme regra do projeto
  const substituicoesClasse = {
    'EmployeeService': 'FuncionarioService',
    'MemberService': 'MembroService',
    'AccountService': 'ContaService',
    'TransactionService': 'TransacaoService',
    'AuditService': 'AuditoriaService',
    'AuthService': 'AutenticacaoService',
    'UserService': 'UsuarioService',
    'UnitService': 'UnidadeService',
    'PayrollService': 'FolhaService',
    'TreasuryService': 'TesourariaService',
    'DatabaseService': 'BancoDadosService',
    'ExportService': 'ExportacaoService',
    'AnalyticsService': 'AnaliticaService',
    'CommunicationService': 'ComunicacaoService',
    'LgpdService': 'LgpdService',
    'ReportsService': 'RelatoriosService',
    'GeminiService': 'GeminiService',
    'CryptoService': 'CriptografiaService',
    'StorageService': 'ArmazenamentoService',
    'LocalStorageService': 'LocalStorageService',
    'IndexedDBService': 'IndexedDBService',
    'ApiService': 'ApiService',
    'DataInitializer': 'InicializadorDados',
    'AccountingEngine': 'MotorContabil',
    'PayrollCalculator': 'CalculadoraFolha',
    'SalaryHistoryService': 'HistoricoSalarialService',
    'BankReconciliationService': 'ConciliacaoBancariaService',
    'ContasReceberService': 'ContasReceberService',
    'ProjecaoFluxoCaixaService': 'ProjecaoFluxoCaixaService',
    'AvaliacaoService': 'AvaliacaoService',
    'ImportacaoExtratoService': 'ImportacaoExtratoService'
  };

  Object.entries(substituicoesClasse).forEach(([antigo, novo]) => {
    if (conteudo.includes(antigo)) {
      const regex = new RegExp(`\\b${antigo}\\b`, 'g');
      conteudo = conteudo.replace(regex, novo);
      alterado = true;
    }
  });

  // Atualizar comentários de cabeçalho (nomes de arquivo)
  Object.entries(MAPEAMENTO_CONTEUDO).forEach(([antigo, novo]) => {
    const regexComentario = new RegExp(`\\*\\s+${antigo}\\.ts`, 'g');
    if (regexComentario.test(conteudo)) {
      conteudo = conteudo.replace(regexComentario, `* ${novo}.ts`);
      alterado = true;
    }
  });

  if (alterado && conteudo !== original) {
    if (DRY_RUN) {
      const relativo = path.relative(PROJECT_ROOT, caminhoArquivo);
      console.log(`   [DRY-RUN] Imports atualizados: ${relativo}`);
      registrarDetalhe('import', relativo, 'varios', 'varios', 'dry-run');
    } else {
      criarBackup(caminhoArquivo);
      fs.writeFileSync(caminhoArquivo, conteudo, 'utf8');
      const relativo = path.relative(PROJECT_ROOT, caminhoArquivo);
      console.log(`   ✅ Imports atualizados: ${relativo}`);
      registrarDetalhe('import', relativo, 'varios', 'varios', 'concluido');
    }
    stats.importsAtualizados++;
    return true;
  }
  return false;
}

function varrerEAtualizarImports(diretorio) {
  if (!fs.existsSync(diretorio)) return;

  const stat = fs.statSync(diretorio);
  if (stat.isFile()) {
    const ext = path.extname(diretorio);
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      atualizarImportsEmArquivo(diretorio);
    }
    return;
  }

  const itens = fs.readdirSync(diretorio, { withFileTypes: true });
  itens.forEach(item => {
    const caminhoCompleto = path.join(diretorio, item.name);

    if (DIRETORIOS_EXCLUIDOS.includes(item.name)) return;
    if (ARQUIVOS_EXCLUIDOS.includes(item.name)) return;

    if (item.isDirectory()) {
      varrerEAtualizarImports(caminhoCompleto);
      return;
    }

    const ext = path.extname(item.name);
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      atualizarImportsEmArquivo(caminhoCompleto);
    }
  });
}

function executarFaseImports() {
  console.log('\n🔗 Fase 11: Atualização de Imports');
  const alvos = ['src', 'services', 'utils', 'types', 'components', 'constants', 'contexts', 'config', 'App.tsx', 'constants.ts', 'types.ts'];
  alvos.forEach(alvo => {
    const caminho = path.join(PROJECT_ROOT, alvo);
    if (fs.existsSync(caminho)) {
      varrerEAtualizarImports(caminho);
    }
  });
}

// ============================================================================
// FASE 12: VALIDAÇÃO FINAL
// ============================================================================

function validarMigracao() {
  console.log('\n🔍 Fase 12: Validação Final');

  let problemas = 0;

  // Verificar se arquivos antigos ainda existem
  const todosMapeamentos = Object.values(dict.renomeacao || {}).flat();
  todosMapeamentos.forEach(({ de, para }) => {
    // Verificar em todos os diretórios possíveis
    const diretorios = [
      PROJECT_ROOT,
      path.join(PROJECT_ROOT, 'services'),
      path.join(PROJECT_ROOT, 'utils'),
      path.join(PROJECT_ROOT, 'types'),
      path.join(PROJECT_ROOT, 'components'),
      path.join(PROJECT_ROOT, 'constants'),
      path.join(PROJECT_ROOT, 'contexts'),
      path.join(PROJECT_ROOT, 'config'),
      path.join(PROJECT_ROOT, 'src', 'services'),
      path.join(PROJECT_ROOT, 'src', 'hooks'),
      path.join(PROJECT_ROOT, 'src', 'utils'),
      path.join(PROJECT_ROOT, 'api'),
      path.join(PROJECT_ROOT, 'api', 'src'),
      path.join(PROJECT_ROOT, 'api', 'src', 'database'),
      path.join(PROJECT_ROOT, 'api', 'scripts')
    ];

    diretorios.forEach(dir => {
      const caminhoAntigo = path.join(dir, de);
      if (fs.existsSync(caminhoAntigo)) {
        const relativo = path.relative(PROJECT_ROOT, caminhoAntigo);
        console.log(`   ⚠️  Arquivo antigo ainda existe: ${relativo}`);
        problemas++;
      }
    });
  });

  // Verificar imports quebrados
  console.log('\n   Verificando imports...');
  const arquivosVerificados = new Set();

  function verificarImportsDir(diretorio) {
    if (!fs.existsSync(diretorio)) return;
    const itens = fs.readdirSync(diretorio, { withFileTypes: true });
    itens.forEach(item => {
      const caminho = path.join(diretorio, item.name);
      if (DIRETORIOS_EXCLUIDOS.includes(item.name)) return;
      if (item.isDirectory()) return verificarImportsDir(caminho);
      if (!['.ts', '.tsx', '.js', '.jsx'].includes(path.extname(item.name))) return;
      if (arquivosVerificados.has(caminho)) return;
      arquivosVerificados.add(caminho);

      try {
        const conteudo = fs.readFileSync(caminho, 'utf8');
        const imports = conteudo.match(/from\s+['"]([^'"]+)['"]/g) || [];
        imports.forEach(imp => {
          const caminhoImport = imp.match(/from\s+['"]([^'"]+)['"]/)?.[1];
          if (!caminhoImport) return;
          if (caminhoImport.startsWith('.')) {
            const dirArquivo = path.dirname(caminho);
            const caminhoResolvido = path.resolve(dirArquivo, caminhoImport);
            const extensoes = ['', '.ts', '.tsx', '.js', '.jsx'];
            const existe = extensoes.some(ext => fs.existsSync(caminhoResolvido + ext));
            if (!existe) {
              const relativo = path.relative(PROJECT_ROOT, caminho);
              console.log(`   ❌ Import quebrado: ${relativo} → ${caminhoImport}`);
              problemas++;
            }
          }
        });
      } catch {}
    });
  }

  verificarImportsDir(path.join(PROJECT_ROOT, 'src'));
  verificarImportsDir(path.join(PROJECT_ROOT, 'services'));
  verificarImportsDir(path.join(PROJECT_ROOT, 'api', 'src'));

  if (problemas === 0) {
    console.log('   ✅ Nenhum problema encontrado!');
  } else {
    console.log(`   ⚠️  ${problemas} problema(s) encontrado(s)`);
  }

  return problemas;
}

// ============================================================================
// RELATÓRIO FINAL
// ============================================================================

function gerarRelatorio() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 RELATÓRIO DE MIGRAÇÃO');
  console.log('='.repeat(60));
  console.log(`Modo: ${DRY_RUN ? 'DRY-RUN (simulação)' : 'EXECUÇÃO REAL'}`);
  console.log(`Arquivos renomeados: ${stats.arquivosRenomeados}`);
  console.log(`Imports atualizados: ${stats.importsAtualizados}`);
  console.log(`Backups criados: ${stats.backupsCriados}`);
  console.log(`Erros: ${stats.erros}`);
  console.log('='.repeat(60));

  if (!DRY_RUN && stats.backupsCriados > 0) {
    console.log('\n📦 Backups criados com extensão .bak');
    console.log('   Valide o build antes de removê-los:');
    console.log('   find . -name "*.bak" -delete');
  }

  if (DRY_RUN) {
    console.log('\n💡 Para executar a migração real, run:');
    console.log('   node scripts/renomear-arquivos.js');
  }
}

// ============================================================================
// EXECUÇÃO PRINCIPAL
// ============================================================================

console.log('🔄 Iniciando migração de arquivos...');
console.log(`Modo: ${DRY_RUN ? 'DRY-RUN' : 'REAL'}`);
if (FASE_ATUAL) console.log(`Fase: ${FASE_ATUAL}`);

// Executar fases
executarFasesRenomeacao();

if (!FASE_ATUAL || FASE_ATUAL === 11) {
  executarFaseImports();
}

if (!FASE_ATUAL || FASE_ATUAL === 12) {
  validarMigracao();
}

gerarRelatorio();
