/**
 * ============================================================================
 * APP.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Ponto de entrada da interface React e componente raiz da aplicação.
 *
 * ONDE É USADO?
 * -------------
 * Parte do projeto usada em runtime ou build.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */

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
import { UserAuth, Payroll, Member, Transaction, FinancialAccount, Asset, EmployeeLeave, UserRole } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import { MemberService } from './src/services/memberService';
import { EmployeeService, TransactionService } from './src/services/employeeService';
import { accountService } from './services/accountService';
import AuthService from './src/services/authService';
import AuditService from './src/services/auditService';
import apiClient from './src/services/apiService';
import { useAudit } from './src/hooks/useAudit';
import { dbService } from './services/databaseService';
import { 
  User as UserIcon, Key, LogIn, Church, AlertCircle, Loader2, Cloud, ShieldCheck, Lock
} from 'lucide-react';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (app).
 */

const Login: React.FC<{ onLogin: (user: UserAuth) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usersInitialized, setUsersInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState('');

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at top, #1e293b 0%, #0f172a 55%, #020617 100%)',
    } as React.CSSProperties,
    card: {
      width: '100%',
      maxWidth: '460px',
      background: '#ffffff',
      borderRadius: '32px',
      padding: '40px 36px 28px',
      boxShadow: '0 30px 80px rgba(15, 23, 42, 0.35)',
      border: '1px solid rgba(148, 163, 184, 0.16)',
      textAlign: 'center',
    } as React.CSSProperties,
    logoBox: {
      width: '148px',
      height: '148px',
      margin: '0 auto 20px',
      borderRadius: '28px',
      border: '4px solid #4f46e5',
      padding: '8px',
      overflow: 'hidden',
      background: '#fff',
      boxShadow: '0 16px 36px rgba(79, 70, 229, 0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties,
    logoImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      borderRadius: '20px',
    } as React.CSSProperties,
    title: {
      fontSize: '44px',
      lineHeight: 1,
      fontWeight: 900,
      color: '#0f172a',
      margin: '0 0 8px',
      letterSpacing: '-0.04em',
      fontStyle: 'italic',
    } as React.CSSProperties,
    subtitle: {
      margin: '0 0 24px',
      color: '#64748b',
      fontSize: '11px',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.22em',
    } as React.CSSProperties,
    status: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 14px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: 700,
      marginBottom: '20px',
      textAlign: 'left',
    } as React.CSSProperties,
    form: {
      display: 'grid',
      gap: '14px',
      textAlign: 'left',
    } as React.CSSProperties,
    fieldWrap: {
      position: 'relative',
    } as React.CSSProperties,
    fieldIcon: {
      position: 'absolute',
      left: '16px',
      top: '16px',
      color: '#94a3b8',
    } as React.CSSProperties,
    input: {
      width: '100%',
      padding: '15px 16px 15px 48px',
      background: '#f8fafc',
      border: '1px solid #cbd5e1',
      borderRadius: '18px',
      outline: 'none',
      fontSize: '14px',
      fontWeight: 700,
      color: '#0f172a',
      boxSizing: 'border-box',
    } as React.CSSProperties,
    button: {
      width: '100%',
      padding: '15px 18px',
      borderRadius: '18px',
      border: 'none',
      background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
      color: '#fff',
      fontSize: '15px',
      fontWeight: 900,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      cursor: 'pointer',
      boxShadow: '0 20px 36px rgba(79, 70, 229, 0.24)',
      marginTop: '4px',
    } as React.CSSProperties,
    footer: {
      marginTop: '18px',
      paddingTop: '14px',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      color: '#94a3b8',
      fontSize: '10px',
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
    } as React.CSSProperties,
  };

  // Verificar se usuários foram inicializados
  useEffect(() => {
    const checkUsers = async () => {
      try {
        await apiClient.healthCheck();
        console.log('🔍 Status: Sistema pronto para login');
        setUsersInitialized(true);
        setInitializationError('');
      } catch (error) {
        console.error('❌ Erro ao verificar usuários:', error);
        setUsersInitialized(false);
        setInitializationError('API ou PostgreSQL indisponível. Verifique se o backend está rodando.');
      }
    };

    checkUsers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    console.log('🔐 Iniciando processo de login...');
    console.log('📋 Username digitado:', username);
    console.log('📋 Password digitado: ' + '*'.repeat(password.length));

    try {
      const response = await AuthService.login(username, password);
      const authUser = response.user;
      const user: UserAuth = {
        id: authUser.id,
        name: authUser.name,
        username: authUser.username || authUser.email,
        role: authUser.role,
        avatar: undefined,
        unitId: authUser.unitId,
        permissions: authUser.permissions,
        unrestrictedAccess: authUser.unrestrictedAccess
      };
      
      console.log('✅ Usuário autenticado:', user.name, user.role);
      
      // Chamar onLogin
      onLogin(user);
      console.log('✅ Login concluído com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro no processo de login:', error);
      const message = error instanceof Error ? error.message : 'Erro no sistema. Tente novamente mais tarde.';
      setError(message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
          {/* Container da Logo Atualizado */}
          <div style={styles.logoBox}>
            <img 
              src="img/logo.png" 
              style={styles.logoImage}
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
          <h1 style={styles.title}>ADJPA ERP</h1>
          <p style={styles.subtitle}>Enterprise Cloud Edition v5.0</p>

          {/* Status de Inicialização */}
          {!usersInitialized && !initializationError && (
            <div style={{ ...styles.status, color: '#b45309', background: '#fffbeb' }}>
              <Loader2 className="animate-spin" size={16} />
              Inicializando sistema de usuários...
            </div>
          )}

          {initializationError && (
            <div style={{ ...styles.status, color: '#dc2626', background: '#fef2f2' }}>
              <AlertCircle size={16} />
              {initializationError}
            </div>
          )}

          {usersInitialized && (
            <div style={{ ...styles.status, color: '#059669', background: '#ecfdf5' }}>
              <ShieldCheck size={16} />
              Sistema pronto para acesso
            </div>
          )}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.fieldWrap}>
              <UserIcon style={styles.fieldIcon} size={18} />
              <input 
                type="text" 
                placeholder="Usuário" 
                style={styles.input}
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div style={styles.fieldWrap}>
              <Key style={styles.fieldIcon} size={18} />
              <input 
                type="password" 
                placeholder="Senha" 
                style={styles.input}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div style={{ ...styles.status, color: '#e11d48', background: '#fff1f2', marginBottom: 0 }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}
            <button 
              type="submit" 
              style={styles.button}
            >
              <LogIn size={20} /> Acessar Sistema Cloud
            </button>
          </form>

          <div style={styles.footer}>
             <Cloud size={12}/> PostgreSQL Supabase Engine v5.0
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
  const [evaluations, setEvaluations] = useState<Record<string, any[]>>({});
  const accessibleTabs = AuthService.getAccessibleTabs(currentUser as any);
  const canAccessTab = (tabId: string) => AuthService.canAccessTab(currentUser as any, tabId);

  // Inicializar sistema
  useEffect(() => {
    const initSystem = async () => {
      try {
        console.log('🎯 Iniciando sistema...');

        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as UserAuth;
            const tokenCheck = await AuthService.verifyToken();
            if (tokenCheck.valid && tokenCheck.user) {
              setCurrentUser({
                id: tokenCheck.user.id,
                name: tokenCheck.user.name,
                username: tokenCheck.user.username || tokenCheck.user.email,
                role: tokenCheck.user.role,
                unitId: tokenCheck.user.unitId,
                permissions: tokenCheck.user.permissions,
                unrestrictedAccess: tokenCheck.user.unrestrictedAccess
              });
              setCurrentUnitId(tokenCheck.user.unitId);
            } else {
              localStorage.removeItem('currentUser');
              setCurrentUser(null);
            }
          } catch {
            localStorage.removeItem('currentUser');
          }
        }

        console.log('✅ Sistema inicializado com sucesso');
      } catch (error) {
        console.error('❌ Erro ao inicializar sistema:', error);
      }
    };
    initSystem();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    if (accessibleTabs.length === 0) {
      if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
      }
      return;
    }

    if (!canAccessTab(activeTab)) {
      setActiveTab(accessibleTabs[0]);
    }
  }, [currentUser, activeTab, accessibleTabs.join('|')]);

  useEffect(() => {
    const fetchData = async (isPolling = false) => {
      // Só carrega dados se usuário estiver logado
      if (!currentUser) return;
      
      // Não mostra o spinner de loading durante o polling em segundo plano
      if (!isPolling) {
        setIsLoading(true);
      }
      try {
        if (!isPolling) console.log("Carregando dados para unidade:", currentUnitId);
        else console.log("🔄 Polling: Atualizando dados em segundo plano...");
        
        // Mapear unitId do sistema para UUID do PostgreSQL
        const unitIdMap: Record<string, string> = {
          'u-sede': '00000000-0000-0000-0000-000000000001',
          'u-matriz': '00000000-0000-0000-0000-000000000001',
        };
        
        const apiUnitId = unitIdMap[currentUnitId] || currentUnitId;
        if (!isPolling) console.log("UnitId mapeado para API:", apiUnitId);
        
        // Carregar dados da API REST
        if (!isPolling) console.log("Fazendo requisição para API com unitId:", apiUnitId);
        const membersResponse = await MemberService.getMembers({ unitId: apiUnitId });
        if (!isPolling) console.log("Resposta da API:", membersResponse);
        
        const members = (membersResponse.members || []) as any[];
        if (!isPolling) {
          console.log("Members extraídos:", members);
          console.log("Número de membros:", members.length);
        }
        
        // Carregar dados de funcionários, transações, contas bancárias e avaliações
        const [employeesResponse, transactionsResponse, accountsData, evaluationsData, leavesData] = await Promise.all([
          EmployeeService.getEmployees({ unitId: apiUnitId }),
          TransactionService.getTransactions({ unitId: apiUnitId }),
          accountService.getAccounts(apiUnitId),
          // Carregar avaliações do banco para o Top 10 e RecursosHumanos
          fetch(`/api/rh/evaluations?unitId=${apiUnitId}`).then(r => r.ok ? r.json() : []).catch(() => []),
          dbService.getLeaves(apiUnitId),
        ]);
        
        const employees = (employeesResponse.employees || []) as any[];
        const transactions = (transactionsResponse.transactions || []) as any[];
        const accounts = (accountsData || []) as FinancialAccount[];
        const leaves = (leavesData || []) as EmployeeLeave[];

        // Agrupar avaliações por employeeId para o estado compartilhado
        const evalsByEmployee: Record<string, any[]> = {};
        (evaluationsData as any[]).forEach((ev: any) => {
          const empId = ev.employee_id || ev.employeeId;
          if (empId) {
            if (!evalsByEmployee[empId]) evalsByEmployee[empId] = [];
            evalsByEmployee[empId].push({
              ...ev,
              overallScore: parseFloat(ev.overall_score || ev.overallScore) || 0,
            });
          }
        });
        if (Object.keys(evalsByEmployee).length > 0) {
          setEvaluations(evalsByEmployee);
        }
        
        setMembers(members as any);
        setTransactions(transactions as any);
        setAccounts(accounts);
        setEmployees(employees as any);
        setLeaves(leaves);
        if (!isPolling) {
          console.log("Dados carregados:", { 
            members: members.length, 
            memberNames: members.map(m => m.name),
            transactions: transactions.length, 
            accounts: accounts.length, 
            employees: employees.length, 
            leaves: leaves.length 
          });
        } else {
          console.log("✅ Polling: Dados atualizados com sucesso.");
        }
      } catch (err) {
        if (!isPolling) console.error("Erro ao carregar dados:", err);
        else console.error("Erro durante o polling:", err);
      } finally {
        if (!isPolling) {
          setIsLoading(false);
        }
      }
    };
    
    // Carrega os dados imediatamente na primeira vez
    fetchData();

    // Configura o polling para buscar dados periodicamente
    const intervalId = setInterval(() => {
      fetchData(true); // Passa true para indicar que é uma chamada de polling
    }, 120000); // 120000 ms = 2 minutos

    // Limpa o intervalo quando o componente é desmontado ou as dependências mudam
    return () => clearInterval(intervalId);
  }, [currentUser, currentUnitId]);

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
        logMenuAccess(menuName).catch((error) => {
          console.error('❌ Erro ao registrar acesso ao menu:', error);
        });
      }
    }
  }, [activeTab, currentUser]);

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

  // Usar o mesmo mapeamento de unitId para filtrar dados
  const unitIdMap: Record<string, string> = {
    'u-sede': '00000000-0000-0000-0000-000000000001',
    'u-matriz': '00000000-0000-0000-0000-000000000001',
  };
  
  const mappedUnitId = unitIdMap[currentUnitId] || currentUnitId;
  
  const unitMembers = members.filter((m: any) => (m.unidadeId || m.unitId || m.unit_id) === mappedUnitId);
  const unitEmployees = employees.filter(e => e.unitId === mappedUnitId);
  const unitTransactions = transactions.filter(t => t.unitId === mappedUnitId);
  const unitAccounts = accounts.filter(a => a.unitId === mappedUnitId);
  const unitAssets = assets.filter(a => a.unitId === mappedUnitId);
  const unitLeaves = leaves.filter(l => l.unitId === mappedUnitId);

  console.log('Filtros de dados:', {
    frontendUnitId: currentUnitId,
    mappedUnitId: mappedUnitId,
    totalMembers: members.length,
    unitMembers: unitMembers.length,
    totalEmployees: employees.length,
    unitEmployees: unitEmployees.length,
    totalTransactions: transactions.length,
    unitTransactions: unitTransactions.length
  });

  const renderContent = () => {
    if (!canAccessTab(activeTab)) {
      return (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} />
          </div>
          <h2 className="text-lg font-black text-slate-900 mb-2">Acesso bloqueado</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Este usuário não possui permissão para acessar este módulo. As permissões são controladas no PostgreSQL e podem ser ajustadas por um administrador ou pelo desenvolvedor.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <PainelGeral user={currentUser} members={unitMembers} employees={unitEmployees} transactions={unitTransactions} accounts={unitAccounts} />;
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
      case 'rh': return <RecursosHumanos employees={unitEmployees} currentUnitId={currentUnitId} evaluations={evaluations} user={currentUser} />;
      case 'dp': return <Funcionarios employees={unitEmployees} setEmployees={setEmployees} currentUnitId={currentUnitId} user={currentUser} evaluations={evaluations} setEvaluations={setEvaluations} />;
      case 'leaves': return <Afastamentos leaves={unitLeaves} setLeaves={setLeaves} currentUnitId={currentUnitId} employees={unitEmployees} user={currentUser} />;
      case 'payroll': return <ProcessamentoFolha employees={unitEmployees} setEmployees={setEmployees} currentUnitId={currentUnitId} user={currentUser} />;
      case 'events': return <Eventos currentUnitId={currentUnitId} members={unitMembers} user={currentUser} />;
      case 'reports': return <Relatorios transactions={unitTransactions} members={unitMembers} employees={unitEmployees} />;
      case 'messages': return <Comunicacao members={unitMembers} employees={unitEmployees} currentUnitId={currentUnitId} user={currentUser} />;
      case 'audit': return <Auditoria />;
      case 'portal': return <PortalMembro />;
      case 'settings': return <Configuracoes user={currentUser} />;
      default: return <PainelGeral user={currentUser} members={unitMembers} employees={unitEmployees} transactions={unitTransactions} accounts={unitAccounts} />;
    }
  };

  return (
    <ThemeProvider>
        <Layout 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          user={currentUser}
          allowedTabs={accessibleTabs}
          onLogout={() => {
            AuditService.logLogout(currentUser.id, currentUser.name, currentUser.unitId).catch(console.error);
            AuthService.logout().catch(console.error);
            localStorage.removeItem('currentUser');
            setCurrentUser(null);
          }}
          currentUnitId={currentUnitId}
          onUnitChange={setCurrentUnitId}
        >
        <div className="max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
