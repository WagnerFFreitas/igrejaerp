import * as fs from 'fs';
import * as path from 'path';

const srcDir = 'e:\\igrejaerp\\api\\src';

// Mapeamento de substituição para o backend
const replacements = [
  { old: 'unidade_id', new: 'id_unidade' },
  { old: 'conta_id', new: 'id_conta' },
  { old: 'membro_id', new: 'id_membro' },
  { old: 'funcionario_id', new: 'id_funcionario' },
  { old: 'pai_id', new: 'id_transacao_origem' },
  { old: 'profile_data', new: 'dados_perfil' },
  { old: 'eh_dizimista', new: 'dizimista' },
  { old: 'eh_parcelado', new: 'parcelado' },
  { old: 'data_fim', new: 'data_final' },
  { old: 'pode_ler', new: 'ler' },
  { old: 'pode_escrever', new: 'escrever' },
  { old: 'pode_excluir', new: 'excluir' },
  { old: 'pode_administrar', new: 'administrador' },
  { old: 'criado_em', new: 'criado' },
  { old: 'atualizado_em', new: 'atualizado' },
];

async function updateBackendFiles() {
  try {
    console.log('=== Atualizando arquivos do backend ===\n');
    
    // Buscar todos os arquivos .ts recursivamente
    const files = getAllTsFiles(srcDir);
    console.log(`Encontrados ${files.length} arquivos .ts\n`);
    
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
        console.log(`✅ ${path.relative(srcDir, file)}: ${fileChanges} substituições`);
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

function getAllTsFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = results.concat(getAllTsFiles(fullPath));
    } else if (file.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

updateBackendFiles();