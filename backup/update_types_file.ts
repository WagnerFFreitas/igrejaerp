import * as fs from 'fs';
import * as path from 'path';

const typesFile = path.join('e:\\igrejaerp', 'types.ts');

// Mapeamento de substituição
const replacements = [
  // PayrollPeriod
  { old: 'dataFim?: string;', new: 'dataFinal?: string;' },
  { old: 'dataInicio?: string;', new: 'dataInicio?: string;' }, // manter
  { old: 'processadoEm?: string;', new: 'processado?: string;' },
  { old: 'unidadeId?: string;', new: 'unitId?: string;' },
  
  // Asset
  { old: 'unidadeId: string;', new: 'unitId: string;' },
  { old: 'criadoEm: string;', new: 'criado: string;' },
  { old: 'atualizadoEm: string;', new: 'atualizado: string;' },
  
  // EmployeeLeave
  { old: 'unidadeId?: string;', new: 'unitId?: string;' },
  { old: 'funcionarioId?: string;', new: 'id_funcionario?: string;' },
  { old: 'dataFim?: string;', new: 'dataFinal?: string;' },
  
  // FinancialAccount
  { old: 'unidadeId: string;', new: 'unitId: string;' },
  
  // Transaction
  { old: 'unidadeId?: string;', new: 'unitId?: string;' },
  { old: 'contaId?: string;', new: 'idConta?: string;' },
  { old: 'membroId?: string;', new: 'idMembro?: string;' },
  { old: 'paiId?: string;', new: 'idTransacaoOrigem?: string;' },
  
  // Employee
  { old: 'unidadeId?: string;', new: 'unitId?: string;' },
  
  // PayrollCalculation
  { old: 'employeeId: string;', new: 'id_funcionario: string;' },
];

async function updateTypesFile() {
  try {
    console.log('=== Atualizando types.ts ===\n');
    
    let content = fs.readFileSync(typesFile, 'utf-8');
    let changes = 0;
    
    for (const { old, new: newText } of replacements) {
      if (content.includes(old)) {
        content = content.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newText);
        console.log(`✅ Substituído: ${old.trim()} → ${newText.trim()}`);
        changes++;
      }
    }
    
    if (changes > 0) {
      fs.writeFileSync(typesFile, content, 'utf-8');
      console.log(`\n✅ ${changes} substituições realizadas em types.ts!`);
    } else {
      console.log('⚠️  Nenhuma substituição necessária (ou padrões não encontrados).');
    }
    
  } catch (error: any) {
    console.error('Erro:', error.message);
  }
}

updateTypesFile();