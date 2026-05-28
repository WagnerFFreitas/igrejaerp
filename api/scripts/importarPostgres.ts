/**
 * ============================================================================
 * IMPORT-POSTGRES.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Arquivo relacionado a import-postgres.
 *
 * ONDE É USADO?
 * -------------
 * Parte do projeto usada em runtime ou build.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';
import Database from '../src/database';

// Configuração para ES modules
/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (import-postgres).
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do banco de dados
const db = Database.getInstance();

interface MigrationData {
  [key: string]: any[];
}

// Mapeamento de campos do Firebase para PostgreSQL
const fieldMappings: { [key: string]: { [key: string]: string } } = {
  members: {
    birthDate: 'birth_date',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    unitId: 'unit_id',
    cpf: 'cpf',
    rg: 'rg',
    email: 'email',
    phone: 'phone',
    whatsapp: 'whatsapp',
    profession: 'profession',
    role: 'role',
    status: 'status',
    maritalStatus: 'marital_status',
    spouseName: 'spouse_name',
    marriageDate: 'marriage_date',
    fatherName: 'father_name',
    motherName: 'mother_name',
    bloodType: 'blood_type',
    emergencyContact: 'emergency_contact',
    conversionDate: 'conversion_date',
    conversionPlace: 'conversion_place',
    baptismDate: 'baptism_date',
    baptismChurch: 'baptism_church',
    baptizingPastor: 'baptizing_pastor',
    holySpiritBaptism: 'holy_spirit_baptism',
    membershipDate: 'membership_date',
    churchOfOrigin: 'church_of_origin',
    discipleshipCourse: 'discipleship_course',
    biblicalSchool: 'biblical_school',
    mainMinistry: 'main_ministry',
    ministryRole: 'ministry_role',
    otherMinistries: 'other_ministries',
    ecclesiasticalPosition: 'ecclesiastical_position',
    consecrationDate: 'consecration_date',
    isTithable: 'is_tithable',
    isRegularGiver: 'is_regular_giver',
    participatesCampaigns: 'participates_campaigns',
    bank: 'bank',
    bankAgency: 'bank_agency',
    bankAccount: 'bank_account',
    pixKey: 'pix_key',
    observations: 'observations',
    specialNeeds: 'special_needs',
    talents: 'talents',
    tags: 'tags',
    familyId: 'family_id',
    avatar: 'avatar'
  },
  employees: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    unitId: 'unit_id',
    cpf: 'cpf',
    rg: 'rg',
    pis: 'pis',
    matricula: 'matricula',
    cargo: 'cargo',
    departamento: 'departamento',
    regime: 'regime',
    admissionDate: 'admission_date',
    terminationDate: 'termination_date',
    workHours: 'work_hours',
    active: 'active',
    observations: 'observations',
    bank: 'bank',
    agency: 'agency',
    account: 'account'
  },
  transactions: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    unitId: 'unit_id',
    memberId: 'member_id',
    accountId: 'account_id',
    projectId: 'project_id',
    parentId: 'parent_id',
    competencyDate: 'competency_date',
    transactionDate: 'transaction_date',
    dueDate: 'due_date',
    paymentMethod: 'payment_method',
    providerName: 'provider_name',
    paidAmount: 'paid_amount',
    remainingAmount: 'remaining_amount',
    isInstallment: 'is_installment',
    installmentNumber: 'installment_number',
    totalInstallments: 'total_installments',
    conciliationDate: 'conciliation_date',
    externalId: 'external_id',
    isConciliated: 'is_conciliated',
    operationNature: 'operation_nature'
  },
  assets: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    unitId: 'unit_id',
    acquisitionDate: 'acquisition_date',
    acquisitionValue: 'acquisition_value',
    currentValue: 'current_value',
    invoiceNumber: 'invoice_number',
    serialNumber: 'serial_number',
    assetNumber: 'asset_number',
    usefulLifeMonths: 'useful_life_months',
    depreciationRate: 'depreciation_rate',
    depreciationMethod: 'depreciation_method',
    currentBookValue: 'current_book_value',
    accumulatedDepreciation: 'accumulated_depreciation',
    residualValue: 'residual_value',
    lastInventoryDate: 'last_inventory_date',
    inventoryCount: 'inventory_count'
  },
  church_events: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    unitId: 'unit_id',
    eventId: 'event_id',
    parentEventId: 'parent_event_id',
    isRecurring: 'is_recurring',
    recurrencePattern: 'recurrence_pattern',
    recurrenceEndDate: 'recurrence_end_date',
    isGeneratedEvent: 'is_generated_event',
    attendeesCount: 'attendees_count'
  }
};

async function loadExportedData(): Promise<MigrationData> {
  const exportDir = path.join(__dirname, '../exports');
  const data: MigrationData = {};
  
  console.log('📂 Carregando dados exportados...');
  
  const files = fs.readdirSync(exportDir);
  const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'export-summary.json');
  
  for (const file of jsonFiles) {
    const collectionName = file.replace('.json', '');
    const filePath = path.join(exportDir, file);
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      data[collectionName] = JSON.parse(fileContent);
      console.log(`✅ ${collectionName}: ${data[collectionName].length} registros`);
    } catch (error) {
      console.error(`❌ Erro ao carregar ${file}:`, error);
    }
  }
  
  return data;
}

function transformFields(collectionName: string, data: any): any {
  const mapping = fieldMappings[collectionName];
  if (!mapping) return data;
  
  const transformed: any = {};
  
  // Copiar campos mapeados
  for (const [firebaseField, postgresField] of Object.entries(mapping)) {
    if (data[firebaseField] !== undefined) {
      transformed[postgresField] = data[firebaseField];
    }
  }
  
  // Copiar campos não mapeados
  for (const [key, value] of Object.entries(data)) {
    if (!mapping[key] && key !== 'id') {
      transformed[key] = value;
    }
  }
  
  // Tratar campos especiais
  if (data.address && typeof data.address === 'object') {
    transformed.zip_code = data.address.zipCode;
    transformed.street = data.address.street;
    transformed.number = data.address.number;
    transformed.complement = data.address.complement;
    transformed.neighborhood = data.address.neighborhood;
    transformed.city = data.address.city;
    transformed.state = data.address.state;
  }
  
  // Converter arrays para JSON
  ['other_ministries', 'tags', 'photos', 'documents'].forEach(field => {
    if (transformed[field] && Array.isArray(transformed[field])) {
      transformed[field] = JSON.stringify(transformed[field]);
    }
  });
  
  return transformed;
}

async function importCollection(collectionName: string, data: any[]): Promise<void> {
  if (!data || data.length === 0) {
    console.log(`⏭️  ${collectionName}: sem dados para importar`);
    return;
  }
  
  console.log(`📥 Importando ${collectionName}: ${data.length} registros`);
  
  try {
    await db.transaction(async (client: any) => {
      for (const item of data) {
        const transformed = transformFields(collectionName, item);
        
        // Construir query dinâmica
        const fields = Object.keys(transformed);
        const values = Object.values(transformed);
        const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
        
        const query = `
          INSERT INTO ${collectionName} (${fields.join(', ')}, id) 
          VALUES (${placeholders}, $${fields.length + 1})
          ON CONFLICT (id) DO UPDATE SET
          ${fields.map((field, index) => `${field} = EXCLUDED.${field}`).join(', ')}
        `;
        
        await client.query(query, [...values, item.id]);
      }
    });
    
    console.log(`✅ ${collectionName}: ${data.length} registros importados`);
  } catch (error) {
    console.error(`❌ Erro ao importar ${collectionName}:`, error);
    throw error;
  }
}

async function importRelatedData(data: MigrationData): Promise<void> {
  console.log('🔗 Importando dados relacionados...');
  
  try {
    // Importar dependentes
    if (data.member_dependents && data.member_dependents.length > 0) {
      console.log(`📥 Importando member_dependents: ${data.member_dependents.length} registros`);
      
      await db.transaction(async (client: any) => {
        for (const dependent of data.member_dependents) {
          const query = `
            INSERT INTO dependents (id, member_id, name, birth_date, relationship, cpf, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
            member_id = EXCLUDED.member_id,
            name = EXCLUDED.name,
            birth_date = EXCLUDED.birth_date,
            relationship = EXCLUDED.relationship,
            cpf = EXCLUDED.cpf
          `;
          
          await client.query(query, [
            dependent.id,
            dependent.member_id,
            dependent.name,
            dependent.birthDate,
            dependent.relationship,
            dependent.cpf,
            dependent.createdAt || new Date().toISOString()
          ]);
        }
      });
      
      console.log('✅ member_dependents importados');
    }
    
    // Importar contribuições
    if (data.member_contributions && data.member_contributions.length > 0) {
      console.log(`📥 Importando member_contributions: ${data.member_contributions.length} registros`);
      
      await db.transaction(async (client: any) => {
        for (const contribution of data.member_contributions) {
          const query = `
            INSERT INTO member_contributions (id, member_id, value, contribution_date, type, description, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
            member_id = EXCLUDED.member_id,
            value = EXCLUDED.value,
            contribution_date = EXCLUDED.contribution_date,
            type = EXCLUDED.type,
            description = EXCLUDED.description
          `;
          
          await client.query(query, [
            contribution.id,
            contribution.member_id,
            contribution.value,
            contribution.date,
            contribution.type,
            contribution.description,
            contribution.createdAt || new Date().toISOString()
          ]);
        }
      });
      
      console.log('✅ member_contributions importados');
    }
    
  } catch (error) {
    console.error('❌ Erro ao importar dados relacionados:', error);
    throw error;
  }
}

async function validateImportation(): Promise<void> {
  console.log('\n🔍 Validando importação...');
  
  try {
    // Contar registros em cada tabela
    const tables = ['members', 'employees', 'transactions', 'assets', 'church_events', 'units'];
    
    for (const table of tables) {
      const result = await db.query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = parseInt(result.rows[0].count);
      console.log(`📊 ${table}: ${count} registros`);
    }
    
    console.log('✅ Validação concluída');
  } catch (error) {
    console.error('❌ Erro na validação:', error);
  }
}

async function main() {
  try {
    console.log('🚀 Iniciando importação para PostgreSQL...');
    
    // Carregar dados exportados
    const data = await loadExportedData();
    
    // Importar coleções principais
    const importOrder = [
      'units',
      'users', 
      'members',
      'employees',
      'financial_accounts',
      'transactions',
      'assets',
      'church_events',
      'employee_leaves',
      'tax_configs',
      'accounting_configs'
    ];
    
    for (const collection of importOrder) {
      await importCollection(collection, data[collection]);
    }
    
    // Importar dados relacionados
    await importRelatedData(data);
    
    // Validar importação
    await validateImportation();
    
    console.log('\n🎉 Importação concluída com sucesso!');
    
  } catch (error) {
    console.error('\n💥 Falha na importação:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as importToPostgres };
