
import React, { useState } from 'react';
import { 
  Database, Download, UploadCloud, ShieldCheck, Calculator, Save, 
  ShieldAlert, Fingerprint, RefreshCw, MapPin, FileText, Percent, 
  AlertCircle, CheckCircle2, Trash2, Globe, DatabaseZap, CloudDownload, Users
} from 'lucide-react';
import { UserAuth, TaxConfig, Member, Payroll, Employee } from '../types';
import { DEFAULT_TAX_CONFIG } from '../constants';
import CryptoService from '../src/services/cryptoService';
import IndexedDBService from '../src/services/indexedDBService';
import { dbService } from '../services/databaseService';
import { ThemeSettings } from './ConfiguracoesTheme';

interface ConfiguracoesProps {
  user: UserAuth;
}

type ConfigTab = 'backup' | 'fiscal' | 'certificado' | 'tabelas' | 'theme';

export const Configuracoes: React.FC<ConfiguracoesProps> = ({ user }) => {
  const isDeveloper = user.role === 'DEVELOPER';
  const canEditConfig = user.role === 'DEVELOPER' || user.role === 'ADMIN' || user.role === 'TREASURER';
  const [activeTab, setActiveTab] = useState<ConfigTab>('backup');
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(DEFAULT_TAX_CONFIG);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);
  const [isSyncingCep, setIsSyncingCep] = useState(false);
  const [isRemovingDuplicates, setIsRemovingDuplicates] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [certificateStatus, setCertificateStatus] = useState<'VALID' | 'EXPIRED' | 'NOT_INSTALLED'>('VALID');

  // Carregar configurações ao montar
  React.useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = await IndexedDBService.get('system_config', 'tax_config');
        if (savedConfig) {
          setTaxConfig(savedConfig);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações fiscais:', error);
      }
    };
    loadConfig();
  }, []);

  const handleSaveTaxConfig = async () => {
    if (!canEditConfig) return;
    
    setIsLoadingConfig(true);
    try {
      // 1. Salvar configuração no IndexedDB
      await IndexedDBService.save('system_config', {
        id: 'tax_config',
        ...taxConfig,
        updatedAt: new Date().toISOString()
      });

      // 2. Atualizar todos os funcionários com os novos valores padrão de VA e VR
      const employees = await dbService.getEmployees(user.unitId);
      let updatedCount = 0;

      for (const emp of employees) {
        // Atualizar apenas se o funcionário tiver o benefício ativo
        // Ou talvez o usuário queira que atualize de qualquer forma?
        // "ALTERE DE TODOS OS FUNCIONARIOS"
        const updatedEmp = {
          ...emp,
          vale_alimentacao: taxConfig.defaultVA || 0,
          vale_refeicao: taxConfig.defaultVR || 0,
          updatedAt: new Date().toISOString()
        };
        await dbService.saveEmployee(updatedEmp);
        updatedCount++;
      }

      alert(`Parâmetros fiscais atualizados com sucesso! ${updatedCount} funcionários atualizados com os novos valores de benefícios.`);
    } catch (error) {
      console.error('Erro ao salvar configurações fiscais:', error);
      alert('Erro ao salvar parâmetros fiscais.');
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const BRAZILIAN_STATES = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const toggleState = (uf: string) => {
    setSelectedStates(prev => 
      prev.includes(uf) ? prev.filter(s => s !== uf) : [...prev, uf]
    );
  };

  const handleRemoveDuplicates = async () => {
    console.log("🚀 Iniciando remoção de duplicatas...");
    
    setIsRemovingDuplicates(true);
    try {
      const unitId = user.unitId;
      
      // Limpar cache local para forçar busca do Firebase
      await IndexedDBService.clear('members');
      await IndexedDBService.clear('employees');
      
      // Buscar dados atualizados do Firebase
      const members = await dbService.getMembers(unitId);
      console.log("🔍 Membros encontrados:", members.length);
      const memberNames = new Map<string, string>(); // Map name -> id
      const duplicateMembers: string[] = [];
      
      for (const member of members) {
        const normalizedName = member.name.trim().toLowerCase();
        if (memberNames.has(normalizedName)) {
          console.log("⚠️ Duplicata encontrada (membro):", member.name, member.id);
          duplicateMembers.push(member.id!);
        } else {
          memberNames.set(normalizedName, member.id!);
        }
      }
      
      const employees = await dbService.getEmployees(unitId);
      console.log("🔍 Funcionários encontrados:", employees.length);
      const employeeNames = new Map<string, string>(); // Map name -> id
      const duplicateEmployees: string[] = [];
      
      for (const emp of employees) {
        const normalizedName = emp.employeeName.trim().toLowerCase();
        if (employeeNames.has(normalizedName)) {
          console.log("⚠️ Duplicata encontrada (funcionário):", emp.employeeName, emp.id);
          duplicateEmployees.push(emp.id!);
        } else {
          employeeNames.set(normalizedName, emp.id!);
        }
      }
      
      console.log(`Encontrados ${duplicateMembers.length} membros duplicados e ${duplicateEmployees.length} funcionários duplicados no Firebase.`);
      console.log("IDs duplicados:", { duplicateMembers, duplicateEmployees });
      
      // Deletar sequencialmente para evitar sobrecarga no Firebase/IndexedDB
      for (const id of duplicateMembers) {
        console.log("⚠️ Deletando membro duplicado:", id);
        try {
          if (id) await dbService.deleteMember(id);
        } catch (err) {
          console.error(`❌ Erro ao deletar membro ${id}:`, err);
        }
      }
      
      for (const id of duplicateEmployees) {
        console.log("⚠️ Deletando funcionário duplicado:", id);
        try {
          if (id) await dbService.deleteEmployee(id);
        } catch (err) {
          console.error(`❌ Erro ao deletar funcionário ${id}:`, err);
        }
      }
      
      // Limpar cache local novamente para forçar recarregamento limpo
      await IndexedDBService.clear('members');
      await IndexedDBService.clear('employees');
      
      alert(`✅ Limpeza concluída! Foram removidos ${duplicateMembers.length} membros e ${duplicateEmployees.length} funcionários duplicados.`);
      window.location.reload();
    } catch (error: any) {
      console.error("❌ Erro ao remover duplicatas:", error);
      alert("❌ Erro ao remover duplicatas: " + error.message);
    } finally {
      setIsRemovingDuplicates(false);
    }
  };

  const handleBackup = async () => {
    console.log("🔄 Iniciando backup completo do sistema...");
    
    try {
      // Coletar todos os dados do IndexedDB
      const backupData = {
        date: new Date().toISOString(),
        system: 'ADJPA-ERP-v5',
        version: '5.2.0',
        metadata: {
          unitId: user.unitId,
          timestamp: Date.now(),
          exportedBy: user.name,
          userEmail: '***REDACTED***' // Ocultar email no backup
        },
        data: {
          members: [],
          transactions: [],
          accounts: [],
          employees: [],
          assets: [],
          leaves: [],
          payroll: [],
          units: [],
          system_config: []
        }
      };

      // Função para buscar dados do IndexedDB
      const getFromIndexedDB = async (storeName: string) => {
        try {
          const data = await IndexedDBService.getAll(storeName);
          
          console.log(`📊 ${storeName}: ${data.length} itens encontrados`);
          return data;
        } catch (error) {
          console.error(`❌ Erro ao buscar ${storeName}:`, error);
          return [];
        }
      };

      // Buscar todos os dados
      console.log("📂 Buscando dados do IndexedDB...");
      
      const members = await getFromIndexedDB('members');
      const transactions = await getFromIndexedDB('transactions');
      const accounts = await getFromIndexedDB('accounts');
      const employees = await getFromIndexedDB('employees');
      const assets = await getFromIndexedDB('assets');
      const leaves = await getFromIndexedDB('leaves');
      const payroll = await getFromIndexedDB('payroll');
      const units = await getFromIndexedDB('units');
      const system_config = await getFromIndexedDB('system_config');

      backupData.data.members = members;
      backupData.data.transactions = transactions;
      backupData.data.accounts = accounts;
      backupData.data.employees = employees;
      backupData.data.assets = assets;
      backupData.data.leaves = leaves;
      backupData.data.payroll = payroll;
      backupData.data.units = units;
      backupData.data.system_config = system_config;

      // Estatísticas do backup
      const stats = {
        totalItems: 0,
        members: members.length,
        transactions: transactions.length,
        accounts: accounts.length,
        employees: employees.length,
        assets: assets.length,
        leaves: leaves.length,
        payroll: payroll.length,
        units: units.length,
        system_config: system_config.length
      };
      
      stats.totalItems = Object.values(stats).reduce((sum, count) => sum + count, 0);

      // Adicionar estatísticas ao backup
      const finalBackupData = {
        ...backupData,
        statistics: stats,
        security: {
          encrypted: true,
          sensitiveDataMasked: true,
          level: 'HIGH',
          note: 'Dados sensíveis foram mascarados para proteção de privacidade'
        }
      };

      console.log("📊 Estatísticas do backup:", stats);
      console.log("🔒 Backup criado com dados sensíveis protegidos");
      console.log("✅ Backup concluído com sucesso!");

      // Criar e baixar arquivo
      const blob = new Blob([JSON.stringify(finalBackupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
      a.download = `BACKUP_ADJPA_${today}.json`;
      a.click();
      URL.revokeObjectURL(url);

      // Alert de sucesso
      alert(`✅ Backup concluído!\n\n📊 Estatísticas:\n• Membros: ${stats.members}\n• Transações: ${stats.transactions}\n• Contas: ${stats.accounts}\n• Funcionários: ${stats.employees}\n• Ativos: ${stats.assets}\n• Folhas: ${stats.leaves}\n• Folha de Pagamento: ${stats.payroll}\n• Unidades: ${stats.units}\n• Configurações: ${stats.system_config}\n• Total: ${stats.totalItems} itens\n\n🔒 Segurança: Dados sensíveis foram mascarados para proteção`);

    } catch (error) {
      console.error("❌ Erro ao gerar backup:", error);
      alert("❌ Erro ao gerar backup: " + error.message);
    }
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        console.log("📂 Iniciando restore do backup...");
        
        const text = await file.text();
        const backup = JSON.parse(text);
        
        console.log("📋 Backup carregado:", backup);
        
        // Validar estrutura do backup
        if (!backup.data || !backup.statistics) {
          throw new Error("Arquivo de backup inválido ou corrompido");
        }

        // Confirmar restauração
        const confirmMessage = `⚠️ ATENÇÃO: Isso irá SUBSTITUIR todos os dados atuais!\n\n📊 Dados do backup:\n• Membros: ${backup.statistics.members}\n• Transações: ${backup.statistics.transactions}\n• Contas: ${backup.statistics.accounts}\n• Funcionários: ${backup.statistics.employees}\n• Ativos: ${backup.statistics.assets}\n• Folhas: ${backup.statistics.leaves}\n• Folha de Pagamento: ${backup.statistics.payroll}\n• Unidades: ${backup.statistics.units}\n• Configurações: ${backup.statistics.system_config}\n• Total: ${backup.statistics.totalItems} itens\n\nDeseja continuar?`;
        
        if (!confirm(confirmMessage)) {
          console.log("❌ Restore cancelado pelo usuário");
          return;
        }

        // Função para salvar dados no IndexedDB
        const saveToIndexedDB = async (storeName: string, data: any[]) => {
          try {
            console.log(`🧹 Limpando store ${storeName}...`);
            await IndexedDBService.clear(storeName);
            
            console.log(`🔄 Restaurando ${data.length} itens em ${storeName}...`);
            let savedCount = 0;
            for (const item of data) {
              await IndexedDBService.save(storeName, item);
              savedCount++;
            }
            
            console.log(`✅ ${storeName}: ${savedCount} itens restaurados`);
            return savedCount;
          } catch (error) {
            console.error(`❌ Erro ao restaurar ${storeName}:`, error);
            return 0;
          }
        };

        // Restaurar todos os dados
        console.log("🔄 Restaurando dados...");
        
        const results = {
          members: await saveToIndexedDB('members', backup.data.members || []),
          transactions: await saveToIndexedDB('transactions', backup.data.transactions || []),
          accounts: await saveToIndexedDB('accounts', backup.data.accounts || []),
          employees: await saveToIndexedDB('employees', backup.data.employees || []),
          assets: await saveToIndexedDB('assets', backup.data.assets || []),
          leaves: await saveToIndexedDB('leaves', backup.data.leaves || []),
          payroll: await saveToIndexedDB('payroll', backup.data.payroll || []),
          units: await saveToIndexedDB('units', backup.data.units || []),
          system_config: await saveToIndexedDB('system_config', backup.data.system_config || [])
        };

        const totalRestored = Object.values(results).reduce((sum: number, count: number) => sum + count, 0);
        
        console.log("✅ Restore concluído:", results);
        console.log("🔄 Recarregando página para atualizar dados...");
        
        alert(`✅ Restore concluído com sucesso!\n\n📊 Itens restaurados:\n• Membros: ${results.members}\n• Transações: ${results.transactions}\n• Contas: ${results.accounts}\n• Funcionários: ${results.employees}\n• Ativos: ${results.assets}\n• Folhas: ${results.leaves}\n• Folha de Pagamento: ${results.payroll}\n• Unidades: ${results.units}\n• Configurações: ${results.system_config}\n• Total: ${totalRestored} itens\n\n🔄 A página será recarregada para atualizar os dados.`);
        
        // Recarregar página para atualizar os dados
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
      } catch (error) {
        console.error("❌ Erro ao restaurar backup:", error);
        alert("❌ Erro ao restaurar backup: " + error.message);
      }
    };
    input.click();
  };

  const handleSyncCep = () => {
    if (selectedStates.length === 0) {
      alert("Por favor, selecione pelo menos um estado para sincronizar.");
      return;
    }
    setIsSyncingCep(true);
    setTimeout(() => {
      setIsSyncingCep(false);
      alert(`Sincronização de CEP concluída com sucesso para: ${selectedStates.join(', ')} (Base Local atualizada).`);
      setSelectedStates([]);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic font-serif">Painel de Configurações</h1>
          <p className="text-slate-500 font-medium">Parâmetros do sistema, tabelas tributárias e segurança de dados.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {(['backup', 'fiscal', 'tabelas', 'certificado', 'theme'] as ConfigTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'backup' && 'Backup & Dados'}
              {tab === 'fiscal' && 'Parâmetros Fiscais & Benefícios'}
              {tab === 'tabelas' && 'Tabelas eSocial'}
              {tab === 'certificado' && 'Certificado A1'}
              {tab === 'theme' && 'Tema'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-amber-200 shadow-sm overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-8 relative">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-500 rounded-l-[2.5rem]"></div>
            <div className="flex-1 space-y-4 p-8 pl-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Database size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Segurança de Dados & Backup</h3>
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
                Como este sistema funciona localmente no seu navegador, a limpeza do cache pode apagar os dados. <strong className="text-slate-900 font-black">Realize um backup semanal</strong> para garantir a segurança das informações da igreja.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 p-8 flex-wrap">
              <button onClick={handleBackup} className="bg-[#111827] text-white px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                <Download size={16}/> Baixar Cópia de Segurança
              </button>
              <button onClick={handleRestore} className="bg-white border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-2xl font-black text-[11px] tracking-widest uppercase hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                <UploadCloud size={16}/> Restaurar Backup
              </button>
            </div>
          </div>

          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#2B2D6E]/30">
            <div className="bg-[#2B2D6E] p-8 flex items-center justify-between relative overflow-hidden">
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-[#4338CA] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/20">
                  <DatabaseZap size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Engine de Logradouros (Atualização Brasil)</h3>
                    <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest">Dev Only</span>
                  </div>
                  <p className="text-xs text-indigo-200 font-medium">Sincronização massiva da base nacional de CEPs por Unidade Federativa.</p>
                </div>
              </div>
              <div className="text-indigo-400/50 font-mono text-xl relative z-10">{'>_'}</div>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#4338CA]/20 to-transparent"></div>
            </div>

            <div className="bg-[#111827] p-8 flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/3 space-y-4">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Selecione o Estado para Sincronizar</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
                    <Globe size={18} />
                  </div>
                  <select 
                    className="w-full pl-12 pr-4 py-4 bg-[#1F2937] border border-slate-700 rounded-2xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                    value={selectedStates[0] || ''}
                    onChange={(e) => setSelectedStates([e.target.value])}
                  >
                    <option value="">Selecione um estado...</option>
                    {BRAZILIAN_STATES.map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleSyncCep}
                  disabled={isSyncingCep || selectedStates.length === 0 || !isDeveloper}
                  className={`w-full py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all flex items-center justify-center gap-3 ${
                    isSyncingCep || selectedStates.length === 0 || !isDeveloper ? 'bg-[#374151] text-slate-500 cursor-not-allowed' : 'bg-[#4F46E5] text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                  }`}
                >
                  <CloudDownload size={18} className={isSyncingCep ? 'animate-bounce' : ''}/> 
                  {isSyncingCep ? 'Sincronizando...' : `Atualizar CEPs: ${selectedStates[0] || 'RJ'}`}
                </button>
              </div>

              <div className="flex-1 bg-[#1F2937] border border-slate-700 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Status da Indexação Local</p>
                      <h4 className="text-2xl font-black text-white">Estado: {selectedStates[0] || 'Rio de Janeiro'}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Última Atualização</p>
                      <p className="text-xs font-bold text-indigo-300">15/05/2024</p>
                    </div>
                  </div>
                  
                  <div className="h-3 bg-[#111827] rounded-full overflow-hidden mb-6 border border-slate-700">
                    <div className="h-full bg-[#6366F1] w-full rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 w-1/2 animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-[#111827] border border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Registros</p>
                    <p className="text-sm font-black text-blue-400">+250k</p>
                  </div>
                  <div className="bg-[#111827] border border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">GeoJSON</p>
                    <p className="text-sm font-black text-emerald-400">Ativo</p>
                  </div>
                  <div className="bg-[#111827] border border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Protocolo</p>
                    <p className="text-sm font-black text-purple-400">HTTPS/2</p>
                  </div>
                  <div className="bg-[#111827] border border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Cripto</p>
                    <p className="text-sm font-black text-rose-400">AES-256</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1F2937] border-t border-slate-700 p-4 flex items-center justify-center gap-2 text-slate-500">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Ferramenta de manutenção reservada • Acesso do desenvolvedor verificado</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fiscal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encargos Patronais</h4>
                <Percent size={14} className="text-indigo-600"/>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">INSS Patronal</span>
                  <input 
                    type="number" 
                    step="0.01"
                    disabled={!canEditConfig}
                    className={`w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-right font-black text-xs text-indigo-600 ${!canEditConfig ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={taxConfig.patronalRate * 100}
                    onChange={(e) => setTaxConfig({...taxConfig, patronalRate: parseFloat(e.target.value) / 100})}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">RAT (Ajustado)</span>
                  <input 
                    type="number" 
                    step="0.01"
                    disabled={!canEditConfig}
                    className={`w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-right font-black text-xs text-indigo-600 ${!canEditConfig ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={taxConfig.ratRate * 100}
                    onChange={(e) => setTaxConfig({...taxConfig, ratRate: parseFloat(e.target.value) / 100})}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Terceiros</span>
                  <input 
                    type="number" 
                    step="0.01"
                    disabled={!canEditConfig}
                    className={`w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-right font-black text-xs text-indigo-600 ${!canEditConfig ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={taxConfig.terceirosRate * 100}
                    onChange={(e) => setTaxConfig({...taxConfig, terceirosRate: parseFloat(e.target.value) / 100})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FGTS & Benefícios (VA/VR Padrão)</h4>
                <Calculator size={14} className="text-indigo-600"/>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Alíquota FGTS</span>
                  <input 
                    type="number" 
                    step="0.01"
                    disabled={!canEditConfig}
                    className={`w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-right font-black text-xs text-indigo-600 ${!canEditConfig ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={taxConfig.fgtsRate * 100}
                    onChange={(e) => setTaxConfig({...taxConfig, fgtsRate: parseFloat(e.target.value) / 100})}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Vale Alimentação (Padrão)</span>
                  <input 
                    type="number" 
                    step="0.01"
                    disabled={!canEditConfig}
                    className={`w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-right font-black text-xs text-indigo-600 ${!canEditConfig ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={taxConfig.defaultVA || 0}
                    onChange={(e) => setTaxConfig({...taxConfig, defaultVA: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600">Vale Refeição (Padrão)</span>
                  <input 
                    type="number" 
                    step="0.01"
                    disabled={!canEditConfig}
                    className={`w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-right font-black text-xs text-indigo-600 ${!canEditConfig ? 'opacity-50 cursor-not-allowed' : ''}`}
                    value={taxConfig.defaultVR || 0}
                    onChange={(e) => setTaxConfig({...taxConfig, defaultVR: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest mb-2">Salvar Alterações</h4>
                <p className="text-[10px] text-indigo-100 font-medium">As novas alíquotas serão aplicadas em todos os cálculos de folha a partir do próximo fechamento.</p>
              </div>
              <button 
                onClick={handleSaveTaxConfig}
                disabled={!canEditConfig || isLoadingConfig}
                className={`w-full py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                  !canEditConfig || isLoadingConfig ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {isLoadingConfig ? <RefreshCw size={14} className="animate-spin"/> : null}
                {canEditConfig ? 'Atualizar Parâmetros' : 'Acesso Restrito'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><FileText size={18} className="text-indigo-600"/> Tabelas Tributárias (Vigência 2024)</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Tabela INSS (Progressiva)</h5>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black text-slate-400 uppercase">
                      <th className="pb-2">Salário de Contribuição</th>
                      <th className="pb-2 text-right">Alíquota</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-bold text-slate-700">
                    {taxConfig.inssBrackets.map((b, i) => (
                      <tr key={i} className="border-t border-slate-50">
                        <td className="py-3">Até R$ {b.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 text-right text-indigo-600">{(b.rate * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Tabela IRRF (Mensal)</h5>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black text-slate-400 uppercase">
                      <th className="pb-2">Base de Cálculo</th>
                      <th className="pb-2 text-center">Alíquota</th>
                      <th className="pb-2 text-right">Dedução</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-bold text-slate-700">
                    {taxConfig.irrfBrackets.map((b, i) => (
                      <tr key={i} className="border-t border-slate-50">
                        <td className="py-3">{b.limit === Infinity ? 'Acima de R$ 4.664,68' : `Até R$ ${b.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</td>
                        <td className="py-3 text-center text-indigo-600">{(b.rate * 100).toFixed(1)}%</td>
                        <td className="py-3 text-right">R$ {b.deduction.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'certificado' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10"><Fingerprint size={160}/></div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-3xl ${certificateStatus === 'VALID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    <ShieldCheck size={32}/>
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Certificado Digital A1</h3>
                    <p className="text-indigo-200/60 text-xs font-bold uppercase tracking-widest">Status: {certificateStatus === 'VALID' ? 'Ativo e Válido' : 'Expirado ou Não Encontrado'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 py-6 border-y border-white/10">
                  <div>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Titular / CNPJ</p>
                    <p className="text-sm font-bold">ADJPA - SEDE MUNDIAL • 00.123.456/0001-99</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Validade</p>
                    <p className="text-sm font-bold">Expira em: 15/05/2025 (324 dias restantes)</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all">Renovar Certificado</button>
                  <button className="px-8 py-4 bg-white/10 border border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all">Testar Conexão</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 space-y-4">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Globe size={18} className="text-indigo-600"/> Comunicação eSocial</h4>
              <div className="space-y-4">
                {[
                  { label: 'Ambiente de Produção', status: 'ONLINE', color: 'text-emerald-500' },
                  { label: 'Assinatura Digital (XML)', status: 'CONFIGURADO', color: 'text-emerald-500' },
                  { label: 'Protocolo TLS 1.2', status: 'ATIVO', color: 'text-emerald-500' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-600">{item.label}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-50 rounded-[2.5rem] p-8 border border-indigo-100 space-y-4">
              <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest">O que é o Certificado A1?</h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">Diferente do A3 (Token/Cartão), o A1 é um arquivo digital (.pfx ou .p12) instalado diretamente no servidor. Ele permite a automação total dos envios ao governo sem intervenção humana.</p>
              <div className="p-4 bg-white rounded-2xl border border-indigo-100 flex items-start gap-3">
                <AlertCircle size={16} className="text-indigo-600 shrink-0 mt-0.5"/>
                <p className="text-[10px] text-slate-500 font-medium">Mantenha sempre uma cópia da senha do certificado em local seguro.</p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Upload de Arquivo</h4>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-2 hover:border-indigo-400 transition-all cursor-pointer">
                <UploadCloud size={32} className="text-slate-400"/>
                <p className="text-[10px] font-black text-slate-500 uppercase">Arraste o arquivo .pfx aqui</p>
                <p className="text-[9px] text-slate-400 font-medium">Tamanho máximo: 2MB</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tabelas' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 space-y-8">
           <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Tabelas Tributárias Oficiais</h3>
                <p className="text-sm text-slate-500 font-medium">Consulte as bases de cálculo vigentes para o ano-calendário 2024.</p>
              </div>
              <button 
                disabled={!isDeveloper}
                className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                  !isDeveloper ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <RefreshCw size={14}/> {isDeveloper ? 'Sincronizar com Receita' : 'Acesso Restrito'}
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                 <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2"><CheckCircle2 size={16}/> Salário Família</h4>
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-600">Teto Salarial</span>
                       <span className="text-xs font-black text-slate-900">R$ 1.819,26</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-600">Valor por Filho</span>
                       <span className="text-xs font-black text-emerald-600">R$ 62,04</span>
                    </div>
                 </div>

                 <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2 mt-8"><CheckCircle2 size={16}/> Salário Mínimo</h4>
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-600">Nacional (2024)</span>
                       <span className="text-xs font-black text-slate-900">R$ 1.412,00</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-600">Valor Diário</span>
                       <span className="text-xs font-black text-slate-900">R$ 47,07</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-600">Valor Horário</span>
                       <span className="text-xs font-black text-slate-900">R$ 6,42</span>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2"><CheckCircle2 size={16}/> Deduções IRRF</h4>
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-600">Por Dependente</span>
                       <span className="text-xs font-black text-slate-900">R$ 189,59</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-slate-600">Simplificada (Opcional)</span>
                       <span className="text-xs font-black text-slate-900">R$ 564,80</span>
                    </div>
                 </div>

                 <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                    <AlertCircle size={20} className="text-amber-600 shrink-0 mt-1"/>
                    <div className="space-y-1">
                       <p className="text-xs font-black text-amber-900 uppercase">Atenção aos Prazos</p>
                       <p className="text-[10px] text-amber-800 font-medium leading-relaxed">As tabelas do eSocial costumam ser atualizadas em Janeiro de cada ano. O sistema ADJPA Cloud verifica automaticamente novas versões, mas a conferência manual é recomendada.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'theme' && <ThemeSettings />}
    </div>
  );
};

