import * as fs from 'fs';
import * as path from 'path';

const srcDir = 'e:\\igrejaerp\\api\\src';

// Substituições: de inglês/snake_case para português snake_case
const replacements = [
  { old: 'unit_id', new: 'id_unidade' },
  { old: 'Unit_id', new: 'Id_unidade' },
  { old: 'unitId', new: 'idUnidade' },
  { old: 'UnitId', new: 'IdUnidade' },
];

async function updateBackendUnitId() {
  try {
    console.log('=== Atualizando unit_id → id_unidade no backend ===\n');
    
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
    console.log(`\n⚠️  Agora o banco de dados também precisa ser atualizado!`);
    
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

updateBackendUnitId();