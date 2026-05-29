/**********************************************************************
*                               APP.TSX                               *
***********************************************************************
* Interface inicial do React e componente raiz da aplicação.          *
* O projeto usada em runtime ou build.                                *
* Controla a apresentação e interações da interface com o usuário.    * 
***********************************************************************/

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
import { Usuario, Funcionario, Membro, Transacao, FinancialAccount, Asset, EmployeeLeave, UserRole, Unidade } from './tipos';
import { ThemeProvider } from './contexts/temaContext';
import { MembroService } from './src/services/membroService';
import { FuncionarioService, TransacaoService } from './src/services/funcionarioService';
import { accountService } from './services/contasService';
import AutenticacaoService from './src/services/autenticacaoService';
import AuditoriaService from './src/services/auditoria-servico';
import apiClient from './src/services/apiService';
import { useAudit } from './src/hooks/useAuditoria';
import { dbService } from './services/bancoDadosService';
import { 
  User as UserIcon, Key, LogIn, Church, AlertCircle, Loader2, Cloud, ShieldCheck, Lock
} from 'lucide-react';

// O bloco abaixo e o principal ao qual define os arquivos (app).
const Login: React.FC<{ onLogin: (user: Usuario) => void }> = ({ onLogin }) => {
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
      const response = await AutenticacaoService.login(username, password);
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
      
      console.log('✅ Usuário autenticado:', authUser.nome, authUser.role);
      
      // Chamar onLogin
      onLogin(authUser);
      console.log('✅ Login bem-sucedido!', authUser.nome);
      
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
  const [currentUnitId, setCurrentUnitId] = useState<string>(() => {
    // Tenta recuperar do localStorage ou usa 'u-sede' como padrão
    const saved = localStorage.getItem('currentUnitId');
    return saved && saved !== 'undefined' ? saved : 'u-sede';
  });
  const [user, setUser] = useState<Usuario | null>(AutenticacaoService.getCurrentUser());
  // Alias para compatibilidade com JSX que usa currentUser
  const currentUser = user;
  const setCurrentUser = setUser;
  const [activeTab, setActiveTab] = useState('dashboard');
  const [members, setMembers] = useState<Membro[]>([]);
  const [funcionarios, setEmployees] = useState<Funcionario[]>([]);
  const [transacoes, setTransactions] = useState<Transacao[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('u-sede');
  const [unidades, setUnits] = useState<Unidade[]>([]);
  const [contas_bancarias, setAccounts] = useState<FinancialAccount[]>([]);
  const [patrimonios, setAssets] = useState<Asset[]>([]);
  const [leaves, setLeaves] = useState<EmployeeLeave[]>([]);
  const [evaluations, setEvaluations] = useState<Record<string, any[]>>({});
  const [isLoading, setIsLoading] = useState(false); 
  
  const ALL_TABS = ['dashboard', 'members', 'finance', 'patrimonios', 'rh', 'dp', 'leaves', 'folha_pagamento', 'eventos_igreja', 'reports', 'messages', 'audit', 'portal', 'settings'];
  const accessibleTabs = (!user || user.role === 'DEVELOPER' || (user as any).unrestrictedAccess)
    ? ALL_TABS
    : (user as any).permissions
      ? ALL_TABS.filter(tab => (user as any).permissions?.[tab] !== false)
      : ALL_TABS;

  const canAccessTab = (tabId: string) => {
    if (!user) return false;
    if (user.role === 'DEVELOPER' || (user as any).unrestrictedAccess) return true;
    return true; // Simplified for now
  };

  // Inicializar sistema
  useEffect(() => {
    const initSystem = async () => {
      try {
        console.log('🎯 Iniciando sistema...');

        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser) as Usuario;
            const tokenCheck = await AutenticacaoService.verifyToken();
            if (tokenCheck.valid && tokenCheck.user) {
              setUser(tokenCheck.user);
              if (tokenCheck.user.id_unidade && tokenCheck.user.id_unidade !== 'undefined') {
                setCurrentUnitId(tokenCheck.user.id_unidade);
                localStorage.setItem('currentUnitId', tokenCheck.user.id_unidade);
              }
            } else {
              localStorage.removeItem('currentUser');
              setUser(null);
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
    if (!user) return;

    if (accessibleTabs.length === 0) {
      if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
      }
      return;
    }

    if (!canAccessTab(activeTab)) {
      setActiveTab(accessibleTabs[0]);
    }
  }, [user, activeTab, accessibleTabs.join('|')]);

  useEffect(() => {
    const fetchData = async (isPolling = false) => {
      // Só carrega dados se usuário estiver logado
      if (!user) return;
      
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
        const membersResponse = await MembroService.getMembers({ idUnidade: apiUnitId });
        if (!isPolling) console.log("Resposta da API:", membersResponse);
        
        const members = (membersResponse.members || []) as any[];
        if (!isPolling) {
          console.log("Members extraídos:", members);
          console.log("Número de membros:", members.length);
        }
        
        // Carregar dados de funcionários, transações, contas bancárias e avaliações
        const [employeesResponse, transactionsResponse, accountsData, evaluationsData, leavesData] = await Promise.all([
          FuncionarioService.getEmployees({ idUnidade: apiUnitId }),
          TransacaoService.getTransactions({ idUnidade: apiUnitId }),
          accountService.getAccounts(apiUnitId),
          // Carregar avaliações do banco para o Top 10 e RecursosHumanos
          fetch(`/api/rh/evaluations?unitId=${apiUnitId}`).then(r => r.ok ? r.json() : []).catch(() => []),
          dbService.getLeaves(apiUnitId),
        ]);
        
        const funcionarios = (employeesResponse.funcionarios || []) as any[];
        const transacoes = (transactionsResponse.transacoes || []) as any[];
        const contas_bancarias = (accountsData || []) as FinancialAccount[];
        const leaves = (leavesData || []) as EmployeeLeave[];

        // Agrupar avaliações por employeeId para o estado compartilhado
        const evalsByEmployee: Record<string, any[]> = {};
        (evaluationsData as any[]).forEach((ev: any) => {
          const empId = ev.id_funcionario || ev.employeeId;
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
        setTransactions(transacoes as any);
        setAccounts(contas_bancarias);
        setEmployees(funcionarios as any);
        setLeaves(leaves);
        if (!isPolling) {
          console.log("Dados carregados:", { 
            members: members.length, 
            memberNames: members.map(m => m.nome),
            transacoes: transacoes.length, 
            contas_bancarias: contas_bancarias.length, 
            funcionarios: funcionarios.length, 
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
  }, [user, currentUnitId]);

  const { logMenuAccess } = useAudit(user);

  // Registrar acesso aos menus
  useEffect(() => {
    if (user && activeTab) {
      const menuNames = {
        'dashboard': 'Dashboard Executivo',
        'members': 'Membros',
        'finance': 'Financeiro',
        'patrimonios': 'Patrimônio',
        'rh': 'Recursos Humanos',
        'dp': 'Departamento Pessoal',
        'leaves': 'Afastamentos',
        'folha_pagamento': 'Folha de Pagamento',
        'eventos_igreja': 'Eventos',
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
  }, [activeTab, user]);

  if (!user) {
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
        // Mapear dados da unidade do usuário logado se necessário
        if (user && !selectedUnit) {
          setSelectedUnit(user.id_unidade);
        }
        setUser(u);
        setCurrentUnitId(u.id_unidade);
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
  
  const unitMembers = members.filter((m: any) => (m.id_unidade || m.unidadeId || m.unitId || m.id_unidade) === mappedUnitId);
  const unitEmployees = funcionarios.filter((e: any) => (e.id_unidade || e.unitId || e.id_unidade) === mappedUnitId);
  const unitTransactions = transacoes.filter((t: any) => (t.id_unidade || t.unitId || t.id_unidade) === mappedUnitId);
  const unitAccounts = contas_bancarias.filter((a: any) => (a.id_unidade || a.unitId || a.id_unidade) === mappedUnitId);
  const unitAssets = patrimonios.filter((a: any) => (a.id_unidade || a.unitId || a.id_unidade) === mappedUnitId);
  const unitLeaves = leaves.filter((l: any) => (l.id_unidade || l.unitId || l.id_unidade) === mappedUnitId);

  console.log('Filtros de dados:', {
    frontendUnitId: currentUnitId,
    mappedUnitId: mappedUnitId,
    totalMembers: members.length,
    unitMembers: unitMembers.length,
    totalEmployees: funcionarios.length,
    unitEmployees: unitEmployees.length,
    totalTransactions: transacoes.length,
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
      case 'dashboard': return <PainelGeral user={currentUser} members={unitMembers} funcionarios={unitEmployees} transacoes={unitTransactions} contas_bancarias={unitAccounts} />;
      case 'members': 
        console.log('🔍 Renderizando Membros com currentUnitId:', currentUnitId);
        return (
        <Membros 
          members={unitMembers} 
          currentUnitId={currentUnitId || 'u-sede'}
          setMembers={setMembers} 
          setTransactions={setTransactions}
          contas_bancarias={unitAccounts}
          setAccounts={setAccounts}
          user={currentUser}
        />
      );
      case 'finance': return (
        <Financeiro 
          transacoes={unitTransactions} 
          currentUnitId={currentUnitId}
          setTransactions={setTransactions}
          contas_bancarias={unitAccounts}
          setAccounts={setAccounts}
          user={currentUser}
          members={unitMembers}
        />
      );
      case 'patrimonios': return <Patrimonio currentUnitId={currentUnitId} user={currentUser} />;
      case 'rh': return <RecursosHumanos funcionarios={unitEmployees} currentUnitId={currentUnitId} evaluations={evaluations} user={currentUser} />;
      case 'dp': return <Funcionarios funcionarios={unitEmployees} setEmployees={setEmployees} currentUnitId={currentUnitId} user={currentUser} evaluations={evaluations} setEvaluations={setEvaluations} />;
      case 'leaves': return <Afastamentos leaves={unitLeaves} setLeaves={setLeaves} currentUnitId={currentUnitId} funcionarios={unitEmployees} user={currentUser} />;
      case 'folha_pagamento': return <ProcessamentoFolha funcionarios={unitEmployees} setEmployees={setEmployees} currentUnitId={currentUnitId} user={currentUser} />;
      case 'eventos_igreja': return <Eventos currentUnitId={currentUnitId} members={unitMembers} user={currentUser} />;
      case 'reports': return <Relatorios transacoes={unitTransactions} members={unitMembers} funcionarios={unitEmployees} />;
      case 'messages': return <Comunicacao members={unitMembers} funcionarios={unitEmployees} currentUnitId={currentUnitId} user={currentUser} />;
      case 'audit': return <Auditoria />;
      case 'portal': return <PortalMembro />;
      case 'settings': return <Configuracoes user={currentUser} />;
      default: return <PainelGeral user={currentUser} members={unitMembers} funcionarios={unitEmployees} transacoes={unitTransactions} contas_bancarias={unitAccounts} />;
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
            AuditoriaService.logLogout(currentUser.id, currentUser.name, currentUser.unitId).catch(console.error);
            AutenticacaoService.logout().catch(console.error);
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
