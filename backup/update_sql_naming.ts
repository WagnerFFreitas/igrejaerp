import * as fs from 'fs';
import * as path from 'path';

const sqlFile = path.join('e:\\igrejaerp\\database', 'migracao_portugues_completa.sql');

// Mapeamento de substituição final
const replacements = [
  // De (antigo no SQL) → Para (novo padronizado)
  { old: 'conta_id', new: 'id_conta' },
  { old: 'membro_id', new: 'id_membro' },
  { old: 'eh_parcelado', new: 'parcelado' },
  { old: 'pai_id', new: 'id_transacao_origem' },
  { old: 'criado_em', new: 'criado' },
  { old: 'atualizado_em', new: 'atualizado' },
  { old: 'funcionario_id', new: 'id_funcionario' },
  { old: 'data_fim', new: 'data_final' },
  { old: 'eh_dizimista', new: 'dizimista' },
  { old: 'profile_data', new: 'dados_perfil' },
  { old: 'unidade_id', new: 'id_unidade' },
  { old: 'entidade_id', new: 'id_entidade' },
  { old: 'pode_ler', new: 'ler' },
  { old: 'pode_escrever', new: 'escrever' },
  { old: 'pode_excluir', new: 'excluir' },
  { old: 'pode_administrar', new: 'administrador' },
  { old: 'processado_em', new: 'processado' },
];

async function updateSqlFile() {
  try {
    console.log('=== Atualizando arquivo SQL ===\n');
    
    let content = fs.readFileSync(sqlFile, 'utf-8');
    let changes = 0;
    
    for (const { old, new: newText } of replacements) {
      const regex = new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      
      if (matches && matches.length > 0) {
        content = content.replace(regex, newText);
        console.log(`✅ ${old} → ${newText} (${matches.length}x)`);
        changes += matches.length;
      }
    }
    
    if (changes > 0) {
      fs.writeFileSync(sqlFile, content, 'utf-8');
      console.log(`\n✅ ${changes} substituições realizadas no SQL!`);
    } else {
      console.log('⚠️  Nenhuma substituição necessária.');
    }
    
  } catch (error: any) {
    console.error('Erro:', error.message);
  }
}

updateSqlFile();