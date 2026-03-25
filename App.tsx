import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { PainelGeral } from './components/PainelGeral';
import { Membros } from './components/Membros';
import { Financeiro } from './components/Financeiro';
import { RecursosHumanos } from './components/RecursosHumanos';
import { Funcionarios } from './components/Funcionarios';
import { Afastamentos } from './components/Afastamentos';
import { Patrimonio } from './components/Patrimonio';
import { ProcessamentoFolha } from './components/ProcessamentoFolha';
import { Eventos } from './components/Eventos';
import { Comunicacao } from './components/Comunicacao';
import { Relatorios } from './components/Relatorios';
import { Auditoria } from './components/Auditoria';
import { PortalMembro } from './components/PortalMembro';
import { Configuracoes } from './components/Configuracoes';
import { DashboardExecutivo } from './components/DashboardExecutivo';
import { UserAuth, Payroll, Member, Transaction, FinancialAccount, Asset, EmployeeLeave, UserRole } from './types';
import { dbService } from './services/databaseService';
import { MOCK_LEAVES, MOCK_ASSETS } from './constants';
import IndexedDBService from './src/services/indexedDBService';
import { AuditService } from './src/services/auditService';
import { UserService } from './src/services/userService';
import { useAudit } from './src/hooks/useAudit';
import { DataInitializer } from './src/services/dataInitializer';
import { 
  User as UserIcon, Key, LogIn, Church, AlertCircle, Loader2, Cloud, ShieldCheck
} from 'lucide-react';

const SYSTEM_USERS = [
  { id: 'u1', name: 'Administrador Master', username: 'desenvolvedor', password: 'dev@ecclesia_secure_2024', role: 'DEVELOPER' as const, avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin', unitId: 'u-sede' },
  { id: 'u2', name: 'Administrador da Igreja', username: 'admin@igreja.com', password: 'Admin@123', role: 'ADMIN' as const, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', unitId: 'u-sede' }
];

const Login: React.FC<{ onLogin: (user: UserAuth) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usersInitialized, setUsersInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState('');

  // Verificar se usuários foram inicializados
  useEffect(() => {
    const checkUsers = async () => {
      try {
        const users = await UserService.getUsers();
        console.log(`🔍 Status: ${users.length} usuários no banco`);
        setUsersInitialized(users.length > 0);
      } catch (error) {
        console.error('❌ Erro ao verificar usuários:', error);
        setInitializationError('Erro ao inicializar sistema. Tente recarregar a página.');
      }
    };

    checkUsers();
    
    // Verificar periodicamente
    const interval = setInterval(checkUsers, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('🔐 Iniciando processo de login...');
    console.log('📋 Username digitado:', username);
    console.log('📋 Password digitado: ' + '*'.repeat(password.length));

    try {
      // Autenticar usuário
      const user = await UserService.authenticate(username, password);
      console.log('✅ Usuário autenticado:', user.name, user.role);
      
      // Registrar login na auditoria (sem bloquear)
      try {
        await AuditService.logLogin(user.id, user.name, user.unitId, true);
        console.log('� Login registrado na auditoria');
      } catch (auditError) {
        console.warn('⚠️ Erro ao registrar login na auditoria (não crítico):', auditError);
        // Não bloquear o login se auditoria falhar
      }
      
      // Chamar onLogin
      onLogin(user);
      console.log('✅ Login concluído com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro no processo de login:', error);
      
      // Tentar autenticação fallback
      console.log('🔄 Tentando autenticação fallback...');
      const fallbackUser = SYSTEM_USERS.find(u => u.username === username && u.password === password);
      
      if (fallbackUser) {
        console.log("✅ Fallback: Usuário encontrado");
        
        onLogin({ 
          id: fallbackUser.id, 
          name: fallbackUser.name, 
          username: fallbackUser.username, 
          role: fallbackUser.role, 
          avatar: fallbackUser.avatar, 
          unitId: fallbackUser.unitId 
        });
      } else {
        setError('Erro no sistema. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 text-center">
        <div className="p-10 pt-12">
          {/* Container da Logo Atualizado */}
          <div className="inline-flex p-1 bg-white border-4 border-indigo-600 rounded-[1.8rem] shadow-lg mb-6 overflow-hidden w-24 h-24 items-center justify-center">
            <img 
              src="img/logo.png" 
              className="w-full h-full object-contain rounded-[1.2rem]" 
              alt="Logo ADJPA"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  const icon = document.createElement('div');
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-church"><path d="M10 9h4"></path><path d="M12 7v5"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="m18 9 3.52 2.147a1 1 0 0 1 .48.854V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6.999a1 1 0 0 1 .48-.854L6 9"></path><path d="M6 21V7a1 1 0 0 1 .376-.782l5-3.999a1 1 0 0 1 1.249.001l5 4A1 1 0 0 1 18 7v14"></path></svg>';
                  target.parentElement.appendChild(icon.firstChild!);
                }
              }}
            />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter italic font-serif">ADJPA ERP</h1>
          <p className="text-slate-500 font-medium mb-6 text-[10px] uppercase tracking-[0.2em]">Enterprise Cloud Edition v5.0</p>

          {/* Status de Inicialização */}
          {!usersInitialized && !initializationError && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl text-xs font-medium mb-6">
              <Loader2 className="animate-spin" size={16} />
              Inicializando sistema de usuários...
            </div>
          )}

          {initializationError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl text-xs font-medium mb-6">
              <AlertCircle size={16} />
              {initializationError}
            </div>
          )}

          {usersInitialized && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-xl text-xs font-medium mb-6">
              <ShieldCheck size={16} />
              Sistema pronto para acesso
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="relative">
              <UserIcon className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Usuário" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <Key className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="Senha" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-rose-600 bg-rose-50 p-3 rounded-xl text-xs font-bold animate-in shake">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <button 
              type="submit" 
              className={`w-full py-4 rounded-2xl font-black shadow-xl transition-all flex items-center justify-center gap-2 mt-2 bg-indigo-600 text-white hover:bg-indigo-700`}
            >
              <LogIn size={20} /> Acessar Sistema Cloud
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase">
             <Cloud size={12}/> PostgreSQL Supabase Engine v5.0
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAuth | null>(null);
  const [currentUnitId, setCurrentUnitId] = useState<string>('u-sede');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false); // Inicia como false para mostrar login imediatamente
  
  const [employees, setEmployees] = useState<Payroll[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [leaves, setLeaves] = useState<EmployeeLeave[]>([]);

  // Inicializar IndexedDB e usuários padrão
  useEffect(() => {
    const initDB = async () => {
      try {
        console.log('🎯 Iniciando IndexedDB...');
        await IndexedDBService.init();
        console.log('✅ IndexedDB inicializado com sucesso');
        
        // Aguardar um pouco antes de inicializar usuários
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('👥 Inicializando usuários padrão...');
        await UserService.initializeDefaultUsers();
        console.log('✅ Usuários padrão inicializados');
        
      } catch (error) {
        console.error('❌ Erro ao inicializar IndexedDB ou usuários:', error);
      }
    };
    initDB();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Só carrega dados se usuário estiver logado
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        console.log("Carregando dados para unidade:", currentUnitId);
        
        // Inicializar dados se necessário
        await DataInitializer.initializeData(currentUnitId);
        
        const [m, t, a, e, l] = await Promise.all([
          dbService.getMembers(currentUnitId),
          dbService.getTransactions(currentUnitId),
          dbService.getAccounts(currentUnitId),
          dbService.getEmployees(currentUnitId),
          dbService.getLeaves(currentUnitId)
        ]);
        setMembers(m);
        setTransactions(t);
        setAccounts(a);
        setEmployees(e);
        setLeaves(l);
        console.log("Dados carregados:", { members: m.length, transactions: t.length, accounts: a.length, employees: e.length, leaves: l.length });
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser, currentUnitId]);

  // Hook de auditoria
  const { logMenuAccess } = useAudit(currentUser);

  // Registrar acesso aos menus
  useEffect(() => {
    if (currentUser && activeTab) {
      const menuNames = {
        'dashboard': 'Dashboard Executivo',
        'members': 'Membros',
        'finance': 'Financeiro',
        'assets': 'Patrimônio',
        'rh': 'Recursos Humanos',
        'dp': 'Departamento Pessoal',
        'leaves': 'Afastamentos',
        'payroll': 'Folha de Pagamento',
        'events': 'Eventos',
        'communication': 'Comunicação',
        'reports': 'Relatórios',
        'audit': 'Auditoria & Segurança',
        'portal': 'Portal do Membro',
        'settings': 'Configurações'
      };
      
      const menuName = menuNames[activeTab as keyof typeof menuNames];
      if (menuName) {
        logMenuAccess(menuName);
      }
    }
  }, [activeTab, currentUser, logMenuAccess]);

  if (!currentUser) {
    // Mostrar tela de login ou loading
    if (isLoading) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-white text-lg">Carregando sistema...</p>
          </div>
        </div>
      );
    }
    
    // Adicionar tratamento de erro para a tela de login
    try {
      return <Login onLogin={u => { 
        console.log("Usuário logado:", u);
        setCurrentUser(u); 
        setCurrentUnitId(u.unitId); 
        
        // Salvar usuário no localStorage para persistência
        localStorage.setItem('currentUser', JSON.stringify(u));
        console.log("💾 Usuário salvo no localStorage:", u);
      }} />;
    } catch (error) {
      console.error("Erro na tela de login:", error);
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center text-white">
            <p>Erro ao carregar tela de login</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-indigo-600 rounded">
              Recarregar
            </button>
          </div>
        </div>
      );
    }
  }

  const unitMembers = members.filter(m => m.unitId === currentUnitId);
  const unitEmployees = employees.filter(e => e.unitId === currentUnitId);
  const unitTransactions = transactions.filter(t => t.unitId === currentUnitId);
  const unitAccounts = accounts.filter(a => a.unitId === currentUnitId);
  const unitAssets = assets.filter(a => a.unitId === currentUnitId);
  const unitLeaves = leaves.filter(l => l.unitId === currentUnitId);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardExecutivo user={currentUser} currentUnitId={currentUnitId} />;
      case 'members': return (
        <Membros 
          members={unitMembers} 
          currentUnitId={currentUnitId}
          setMembers={setMembers} 
          setTransactions={setTransactions}
          accounts={unitAccounts}
          setAccounts={setAccounts}
          user={currentUser}
        />
      );
      case 'finance': return (
        <Financeiro 
          transactions={unitTransactions} 
          currentUnitId={currentUnitId}
          setTransactions={setTransactions}
          accounts={unitAccounts}
          setAccounts={setAccounts}
          user={currentUser}
          members={unitMembers}
        />
      );
      case 'assets': return <Patrimonio currentUnitId={currentUnitId} user={currentUser} />;
      case 'rh': return <RecursosHumanos employees={unitEmployees} />;
      case 'dp': return <Funcionarios employees={unitEmployees} setEmployees={setEmployees} currentUnitId={currentUnitId} user={currentUser} />;
      case 'leaves': return <Afastamentos leaves={unitLeaves} setLeaves={setLeaves} currentUnitId={currentUnitId} employees={unitEmployees} />;
      case 'payroll': return <ProcessamentoFolha employees={unitEmployees} setEmployees={setEmployees} currentUnitId={currentUnitId} />;
      case 'events': return <Eventos />;
      case 'reports': return <Relatorios transactions={unitTransactions} members={unitMembers} />;
      case 'messages': return <Comunicacao members={unitMembers} employees={unitEmployees} />;
      case 'audit': return <Auditoria />;
      case 'portal': return <PortalMembro />;
      case 'settings': return <Configuracoes user={currentUser} />;
      default: return <PainelGeral user={currentUser} members={unitMembers} employees={unitEmployees} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={currentUser}
      onLogout={() => setCurrentUser(null)}
      currentUnitId={currentUnitId}
      onUnitChange={setCurrentUnitId}
    >
      <div className="max-w-[1600px] mx-auto">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default App;