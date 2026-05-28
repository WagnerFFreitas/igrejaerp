import * as fs from 'fs';
import * as path from 'path';

const srcDir = 'e:\\igrejaerp\\src';
const componentsDir = 'e:\\igrejaerp\\components';

// Mapeamento de substituição para o frontend
const replacements = [
  { old: 'unidadeId', new: 'unitId' },
  { old: 'unidade_id', new: 'id_unidade' },
  { old: 'funcionarioId', new: 'idFuncionario' },
  { old: 'funcionario_id', new: 'id_funcionario' },
  { old: 'membroId', new: 'idMembro' },
  { old: 'membro_id', new: 'id_membro' },
  { old: 'contaId', new: 'idConta' },
  { old: 'conta_id', new: 'id_conta' },
  { old: 'paiId', new: 'idTransacaoOrigem' },
  { old: 'pai_id', new: 'id_transacao_origem' },
  { old: 'profileData', new: 'dadosPerfil' },
  { old: 'profile_data', new: 'dados_perfil' },
  { old: 'ehDizimista', new: 'dizimista' },
  { old: 'eh_dizimista', new: 'dizimista' },
  { old: 'ehParcelado', new: 'parcelado' },
  { old: 'eh_parcelado', new: 'parcelado' },
  { old: 'dataFim', new: 'dataFinal' },
  { old: 'data_fim', new: 'data_final' },
  { old: 'podeLer', new: 'ler' },
  { old: 'pode_ler', new: 'ler' },
  { old: 'podeEscrever', new: 'escrever' },
  { old: 'pode_escrever', new: 'escrever' },
  { old: 'podeExcluir', new: 'excluir' },
  { old: 'pode_excluir', new: 'excluir' },
  { old: 'podeAdministrar', new: 'administrador' },
  { old: 'pode_administrar', new: 'administrador' },
  { old: 'criadoEm', new: 'criado' },
  { old: 'criado_em', new: 'criado' },
  { old: 'atualizadoEm', new: 'atualizado' },
  { old: 'atualizado_em', new: 'atualizado' },
  { old: 'processadoEm', new: 'processado' },
  { old: 'processado_em', new: 'processado' },
];

async function updateFrontendFiles() {
  try {
    console.log('=== Atualizando arquivos do frontend ===\n');
    
    // Buscar todos os arquivos .tsx e .ts recursivamente
    const files = getAllFiles(srcDir).concat(getAllFiles(componentsDir));
    console.log(`Encontrados ${files.length} arquivos .tsx/.ts\n`);
    
    let totalChanges = 0;
    let filesChanged = 0;
    
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf-8');
      let fileChanges = 0;
      
      for (const { old, new: newText } of replacements) {
        const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        const matches = content.match(regex);
        
        if (matches && matches.length > 0) {
          content = content.replace(regex, newText);
          fileChanges += matches.length;
        }
      }
      
      if (fileChanges > 0) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`✅ ${path.relative('e:\\igrejaerp', file)}: ${fileChanges} substituições`);
        totalChanges += fileChanges;
        filesChanged++;
      }
    }
    
    console.log(`\n=== Resumo ===`);
    console.log(`✅ ${filesChanged} arquivos alterados`);
    console.log(`✅ ${totalChanges} substituições realizadas`);
    
  } catch (error: any) {
    console.error('Erro:', error.message);
  }
}

function getAllFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

updateFrontendFiles();