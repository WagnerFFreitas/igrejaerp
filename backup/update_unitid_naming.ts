import * as fs from 'fs';
import * as path from 'path';

const srcDir = 'e:\\igrejaerp\\src';
const componentsDir = 'e:\\igrejaerp\\components';

// Substituições: de inglês para português
const replacements = [
  { old: 'unitId', new: 'idUnidade' },
  { old: 'unit_id', new: 'id_unidade' },
  { old: 'UnitId', new: 'IdUnidade' },
  { old: 'Unit_id', new: 'Id_unidade' },
];

async function updateUnitIdNaming() {
  try {
    console.log('=== Atualizando unitId → idUnidade ===\n');
    
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
    console.log(`\n⚠️  Agora o backend também precisa ser atualizado para usar id_unidade em vez de unit_id`);
    
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

updateUnitIdNaming();