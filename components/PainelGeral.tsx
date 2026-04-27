/**
 * ============================================================================
 * PAINELGERAL.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para painel geral.
 *
 * ONDE É USADO?
 * -------------
 * Usado na interface React como parte do frontend.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */


import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  Users, TrendingUp, DollarSign, Target, Sparkles, AlertTriangle, AlertCircle, RotateCcw, Clock, Cake,
  BarChart3, Activity, Award, Brain, Zap, Car, KeyRound, TrendingDown, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { geminiService } from '../services/geminiService';
import { UserAuth, Member, Payroll, Transaction, FinancialAccount } from '../types';
import UserPermissionsPanel from './UserPermissionsPanel';
import AuthService from '../src/services/authService';

interface PainelGeralProps {
  user: UserAuth;
  members: Member[];
  employees: Payroll[];
  transactions?: Transaction[];
  accounts?: FinancialAccount[];
}

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (painel geral).
 */

export const PainelGeral: React.FC<PainelGeralProps> = ({ user, members, employees, transactions = [], accounts = [] }) => {
  console.log('PainelGeral recebido:', { members, membersLength: members.length, employees, employeesLength: employees.length });

  // ── KPIs calculados a partir dos dados reais ──────────────────────────────
  const kpis = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const paidIncome = transactions.filter(t => (t.tipoTransacao === 'INCOME' || t.tipoTransacao === 'RECEITA') && t.situacao === 'PAGO');
    const paidExpense = transactions.filter(t => (t.tipoTransacao === 'EXPENSE' || t.tipoTransacao === 'DESPESA') && t.situacao === 'PAGO');

    const incomeThisMonth = paidIncome
      .filter(t => { const d = new Date(t.dataTransacao || t.data); return d.getMonth() === thisMonth && d.getFullYear() === thisYear; })
      .reduce((s, t) => s + (t.valor || t.amount || 0), 0);

    const incomeLastMonth = paidIncome
      .filter(t => { const d = new Date(t.dataTransacao || t.data); return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear; })
      .reduce((s, t) => s + (t.valor || t.amount || 0), 0);

    const incomeGrowth = incomeLastMonth > 0
      ? ((incomeThisMonth - incomeLastMonth) / incomeLastMonth * 100).toFixed(0)
      : null;

    const membersThisMonth = members.filter(m => {
      const d = new Date((m as any).criadoEm || (m as any).created_at || '');
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    const membersLastMonth = members.filter(m => {
      const d = new Date((m as any).criadoEm || (m as any).created_at || '');
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    }).length;

    const memberGrowth = membersLastMonth > 0
      ? ((membersThisMonth - membersLastMonth) / membersLastMonth * 100).toFixed(0)
      : null;

    const saldoContas = accounts.reduce((s, a) => s + (a.saldoAtual || a.currentBalance || 0), 0);

    return { incomeThisMonth, incomeGrowth, membersThisMonth, memberGrowth, saldoContas };
  }, [transactions, members, accounts]);

  // ── Gráfico: receita dos últimos 6 meses ─────────────────────────────────
  const chartData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      const revenue = transactions
        .filter(t => (t.tipoTransacao === 'INCOME' || t.tipoTransacao === 'RECEITA') && t.situacao === 'PAGO' && (() => { const td = new Date(t.dataTransacao || t.data); return td.getMonth() === month && td.getFullYear() === year; })())
        .reduce((s, t) => s + (t.valor || t.amount || 0), 0);
      const expense = transactions
        .filter(t => (t.tipoTransacao === 'EXPENSE' || t.tipoTransacao === 'DESPESA') && t.situacao === 'PAGO' && (() => { const td = new Date(t.dataTransacao || t.data); return td.getMonth() === month && td.getFullYear() === year; })())
        .reduce((s, t) => s + (t.valor || t.amount || 0), 0);
      return {
        name: d.toLocaleString('pt-BR', { month: 'short' }),
        receita: revenue,
        despesa: expense,
      };
    });
  }, [transactions]);
  
  const [insights, setInsights] = useState<string>('Consultando inteligência ministerial...');
  const [isError, setIsError] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [lastAnalyzedCount, setLastAnalyzedCount] = useState(-1);
  
  // Novos estados para funcionalidades avançadas de IA
  const [detailedInsights, setDetailedInsights] = useState<string>('');
  const [isGeneratingDetailed, setIsGeneratingDetailed] = useState(false);
  const [predictions, setPredictions] = useState<string>('');
  const [isGeneratingPredictions, setIsGeneratingPredictions] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'predictions' | 'access'>('overview');
  const canManageUsers = AuthService.canManageUsers(user);

  // Efeito para gerenciar o contador de cooldown
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = geminiService.getBlockedTimeRemaining();
      setCooldown(remaining);
      if (remaining === 0 && isError && insights.includes('limite de uso')) {
        // Tentar carregar novamente automaticamente
        fetchInsights(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isError, insights]);

  // Análise básica de saúde da igreja
  const fetchInsights = useCallback(async (force = false) => {
    if (geminiService.isQuotaBlocked()) return;
    if (!force && lastAnalyzedCount === members.length) return;
    
    setIsLoadingInsights(true);
    setIsError(false);
    setInsights('Sincronizando com a nuvem de IA...');
    
    try {
      const activeMembersCount = members.filter(m => m.situacao === 'ATIVO' || m.status === 'ACTIVE').length;
      const totalRevenue = 25000;
      const totalExpenses = 18000;
      
      const res = await geminiService.analyzeChurchHealth({
        totalMembers: members.length,
        activeMembers: activeMembersCount,
        monthlyRevenue: totalRevenue,
        monthlyExpenses: totalExpenses
      });

      if (res.includes('LIMITE_EXCEDIDO') || res.includes('ERRO_') || res.includes('indisponível')) {
        setIsError(true);
        const cleanMsg = res.includes(': ') ? res.split(': ')[1] : res;
        setInsights(cleanMsg);
      } else if (res.includes('ERRO_API_KEY')) {
        setIsError(true);
        setInsights('Chave da API Gemini expirada. Configure uma nova chave GEMINI_API_KEY para ativar os insights de IA.');
      } else {
        setInsights(res);
        setLastAnalyzedCount(members.length);
      }
    } catch (err) {
      setIsError(true);
      setInsights('A conexão com a IA falhou. Verifique sua rede.');
    } finally {
      setIsLoadingInsights(false);
    }
  }, [members]);

  // Análise detalhada com IA
  const generateDetailedInsights = async () => {
    setIsGeneratingDetailed(true);
    setDetailedInsights('Gerando análise detalhada...');
    
    try {
      const activeMembersCount = members.filter(m => m.situacao === 'ATIVO' || m.status === 'ACTIVE').length;
      const newMembersCount = members.filter(m => {
        const joinDate = new Date(m.criadoEm || m.createdAt || '');
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinDate > thirtyDaysAgo;
      }).length;
      
      const prompt = `Como consultor pastoral experiente, analise em detalhes a situação desta igreja e forneça recomendações estratégicas específicas:
      
      **Dados Atuais:**
      - Total de membros: ${members.length}
      - Membros ativos: ${activeMembersCount} (${Math.round((activeMembersCount/members.length)*100)}%)
      - Novos membros (últimos 30 dias): ${newMembersCount}
      - Funcionários: ${employees.length}
      - Receita mensal: R$ 25.000
      - Despesas mensais: R$ 18.000
      - Saúde financeira: ${(25000-18000)/25000*100}% de margem positiva
      
      **Forneça:**
      1. Diagnóstico detalhado da saúde espiritual e organizacional
      2. 3 oportunidades de crescimento específicas
      3. 2 áreas de atenção imediata
      4. Estratégia para os próximos 90 dias
      5. Indicadores para monitoramento
      
      Seja pastoral, prático e acionável.`;

      // Usar a GeminiService centralizada para evitar duplicação e vazar chaves
      const response = await geminiService.generateSpecificContent(prompt, 'devotional');
      setDetailedInsights(response);
    } catch (error) {
      setDetailedInsights('Erro ao gerar análise detalhada. Verifique sua conexão.');
    } finally {
      setIsGeneratingDetailed(false);
    }
  };

  // Previsões e projeções com IA
  const generatePredictions = async () => {
    setIsGeneratingPredictions(true);
    setPredictions('Gerando projeções futuras...');
    
    try {
      const growthRate = 0.12; // 12% de crescimento anual
      const currentMembers = members.length;
      const projectedMembers = Math.round(currentMembers * (1 + growthRate/12));
      const projectedRevenue = 25000 * 1.08; // 8% de crescimento
      
      const prompt = `Como analista de dados eclesiásticos, projete o cenário desta igreja para os próximos 6 meses e forneça:
      
      **Cenário Atual:**
      - Membros atuais: ${currentMembers}
      - Crescimento mensal: ${growthRate*100}%
      - Receita atual: R$ 25.000
      - Margem financeira: 28%
      
      **Projeções solicitadas:**
      1. Número projetado de membros em 6 meses
      2. Receita projetada considerando crescimento
      3. 3 tendências que impactarão a igreja
      4. 2 oportunidades para novos ministérios
      5. 1 alerta preventivo
      6. 3 métricas para acompanhar
      
      Seja otimista mas realista, baseando-se em padrões de crescimento de igrejas saudáveis.`;

      const response = await geminiService.analyzeChurchHealth({
        totalMembers: members.length,
        activeMembers: members.filter(m => m.situacao === 'ATIVO' || m.status === 'ACTIVE').length,
        monthlyRevenue: 25000,
        monthlyExpenses: 18000
      });
      setPredictions(response);
    } catch (error) {
      setPredictions('Erro ao gerar projeções. Verifique sua conexão.');
    } finally {
      setIsGeneratingPredictions(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  const birthdaysThisMonth = useMemo(() => {
    const all = [
      ...members.filter(m => m.birthDate).map(m => ({
        name: m.name,
        avatar: m.avatar,
        date: new Date(m.birthDate + 'T00:00:00'),
        type: 'membro'
      })),
      ...employees.filter(e => e.birthDate).map(e => ({
        name: e.employeeName,
        avatar: e.avatar,
        date: new Date(e.birthDate + 'T00:00:00'),
        type: 'funcionário'
      }))
    ];
    return all
      .filter(p => p.date.getMonth() === currentMonth)
      .sort((a, b) => a.date.getDate() - b.date.getDate());
  }, [members, employees, currentMonth]);

  // Verificar CNH vencidas ou quase vencendo
  const cnhAlerts = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(today.getDate() + 15);

    return employees
      .filter(e => e.cnh_vencimento)
      .map(e => {
        const vencimentoDate = new Date(e.cnh_vencimento);
        const daysUntilExpiration = Math.ceil((vencimentoDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          id: e.id,
          nome: e.employeeName,
          categoria: e.cnh_categoria || 'N/A',
          vencimento: e.cnh_vencimento,
          daysUntilExpiration,
          status: 
            daysUntilExpiration < 0 ? 'expired' :
            daysUntilExpiration <= 15 ? 'critical' :
            daysUntilExpiration <= 30 ? 'warning' :
            'ok'
        };
      })
      .filter(alert => alert.status !== 'ok')
      .sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);
  }, [employees]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic font-serif">Painel Geral</h1>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-tighter mt-0.5">Indicadores Críticos e Insights em Tempo Real</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-sm font-black text-indigo-600 uppercase">Status: Online</div>
           <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-lg text-sm font-black text-emerald-600 uppercase flex items-center gap-1">
             <Brain size={12} /> IA Ativa
           </div>
        </div>
      </div>

      {/* Tabs de Navegação do Painel */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
          { id: 'insights', label: 'Análise IA', icon: Sparkles },
          { id: 'predictions', label: 'Projeções', icon: Target },
          ...(canManageUsers ? [{ id: 'access', label: 'Usuários & Permissões', icon: KeyRound }] : [])
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors text-base font-medium ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Visão Geral */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                l: 'Total Membros',
                v: members.length,
                sub: `${members.filter(m => m.status === 'ACTIVE').length} ativos`,
                t: kpis.memberGrowth !== null ? `${Number(kpis.memberGrowth) >= 0 ? '+' : ''}${kpis.memberGrowth}%` : '—',
                positive: kpis.memberGrowth === null || Number(kpis.memberGrowth) >= 0,
                i: <Users />, c: 'indigo'
              },
              {
                l: 'Receita do Mês',
                v: `R$ ${kpis.incomeThisMonth.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
                sub: 'entradas pagas',
                t: kpis.incomeGrowth !== null ? `${Number(kpis.incomeGrowth) >= 0 ? '+' : ''}${kpis.incomeGrowth}%` : '—',
                positive: kpis.incomeGrowth === null || Number(kpis.incomeGrowth) >= 0,
                i: <DollarSign />, c: 'emerald'
              },
              {
                l: 'Saldo em Contas',
                v: `R$ ${kpis.saldoContas.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`,
                sub: `${accounts.length} conta(s)`,
                t: '—',
                positive: kpis.saldoContas >= 0,
                i: <TrendingUp />, c: kpis.saldoContas >= 0 ? 'blue' : 'rose'
              },
              {
                l: 'Funcionários',
                v: employees.length,
                sub: 'colaboradores',
                t: '—',
                positive: true,
                i: <Target />, c: 'amber'
              },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-3">
                  <div className={`p-3 bg-${s.c}-50 text-${s.c}-600 rounded-xl`}>
                    {React.cloneElement(s.i as React.ReactElement<{ size?: number }>, { size: 20 })}
                  </div>
                  {s.t !== '—' && (
                    <span className={`text-sm font-black ${s.positive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-3 py-1 rounded-full flex items-center gap-1`}>
                      {s.positive ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}{s.t}
                    </span>
                  )}
                </div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-2">{s.v}</h3>
                <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-100 h-96 shadow-sm">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-widest mb-6 border-b pb-2 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600"/> Receita vs Despesa — Últimos 6 Meses
              </h3>
              <div className="h-[calc(100%-2rem)] min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDesp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontSize: 12, fontWeight: 700}} axisLine={false} />
                  <YAxis tick={{fontSize: 11, fontWeight: 700}} axisLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`} />
                  <Area type="monotone" dataKey="receita" name="Receita" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRec)" />
                  <Area type="monotone" dataKey="despesa" name="Despesa" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorDesp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
              {transactions.length === 0 && (
                <p className="text-center text-xs text-slate-400 mt-2">Nenhuma transação registrada ainda.</p>
              )}
            </div>

            <div className={`lg:col-span-4 p-8 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col h-96 transition-colors duration-500 ${isError ? 'bg-rose-900' : 'bg-slate-900'}`}>
               <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={180}/></div>
               <h3 className={`text-base font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10 ${isError ? 'text-rose-200' : 'text-indigo-300'}`}>
                  {isError ? <AlertTriangle size={18}/> : <Sparkles size={18}/>} 
                  {isError ? 'Status da Inteligência' : 'Recomendações Estratégicas IA'}
               </h3>
               <div className={`flex-1 backdrop-blur-md rounded-[1.5rem] p-6 border relative z-10 overflow-y-auto custom-scrollbar ${isError ? 'bg-white/5 border-white/20' : 'bg-white/5 border-white/10'}`}>
                  {isLoadingInsights ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-white/50 animate-pulse">
                      <RotateCcw size={24} className="animate-spin" />
                      <span className="text-sm font-black uppercase tracking-widest">Sincronizando...</span>
                    </div>
                  ) : (
                    <p className={`text-base leading-relaxed italic font-medium ${isError ? 'text-rose-100' : 'text-indigo-50'}`}>
                      "{insights}"
                    </p>
                  )}
               </div>
               
               <div className="mt-6 flex items-center justify-between relative z-10">
                  <div className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${isError ? 'text-rose-400' : 'text-indigo-400'}`}>
                     <span>Engine: Gemini 3.0 Flash</span>
                     {cooldown > 0 && (
                       <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                         <Clock size={12}/> {cooldown}s
                       </span>
                     )}
                  </div>
                  {isError && (
                    <button 
                      onClick={() => fetchInsights(true)}
                      disabled={cooldown > 0}
                      className={`p-3 rounded-lg text-white transition-all flex items-center gap-1.5 text-sm font-black uppercase shadow-sm ${cooldown > 0 ? 'bg-white/5 opacity-40 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 active:scale-95'}`}
                    >
                      <RotateCcw size={16} className={isLoadingInsights ? 'animate-spin' : ''}/> 
                      {cooldown > 0 ? `Aguarde (${cooldown}s)` : 'Tentar Agora'}
                    </button>
                  )}
               </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'access' && canManageUsers && (
        <UserPermissionsPanel currentUser={user} />
      )}

      {/* Tab Análise IA Detalhada */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Brain size={18} className="text-indigo-600"/> Análise Detalhada da Igreja
              </h3>
              <button
                onClick={generateDetailedInsights}
                disabled={isGeneratingDetailed}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-black uppercase hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isGeneratingDetailed ? <RotateCcw size={16} className="animate-spin" /> : <Zap size={16} />}
                {isGeneratingDetailed ? 'Analisando...' : 'Gerar Análise'}
              </button>
            </div>
            
            <div className="h-80 overflow-y-auto custom-scrollbar">
              {isGeneratingDetailed ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400 animate-pulse">
                  <Brain size={32} className="animate-pulse" />
                  <span className="text-sm font-black uppercase tracking-widest">Processando análise profunda...</span>
                </div>
              ) : detailedInsights ? (
                <div className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {detailedInsights}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-12">
                  <Brain size={64} className="mx-auto mb-6 opacity-50" />
                  <p className="text-base">Clique em "Gerar Análise" para insights detalhados</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity size={18} className="text-emerald-600"/> Métricas em Tempo Real
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <span className="text-base font-medium text-slate-700">Taxa de Atividade</span>
                <span className="text-base font-bold text-indigo-600">
                  {Math.round((members.filter(m => m.status === 'ACTIVE').length / members.length) * 100)}%
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <span className="text-base font-medium text-slate-700">Crescimento Mensal</span>
                <span className="text-base font-bold text-emerald-600">+12%</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <span className="text-base font-medium text-slate-700">Margem Financeira</span>
                <span className="text-base font-bold text-blue-600">28%</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                <span className="text-base font-medium text-slate-700">Eficiência Operacional</span>
                <span className="text-base font-bold text-amber-600">85%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Projeções Futuras */}
      {activeTab === 'predictions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Target size={18} className="text-emerald-600"/> Projeções Estratégicas
              </h3>
              <button
                onClick={generatePredictions}
                disabled={isGeneratingPredictions}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-black uppercase hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {isGeneratingPredictions ? <RotateCcw size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                {isGeneratingPredictions ? 'Projetando...' : 'Gerar Projeções'}
              </button>
            </div>
            
            <div className="h-80 overflow-y-auto custom-scrollbar">
              {isGeneratingPredictions ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-400 animate-pulse">
                  <Target size={32} className="animate-pulse" />
                  <span className="text-sm font-black uppercase tracking-widest">Calculando cenários futuros...</span>
                </div>
              ) : predictions ? (
                <div className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {predictions}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-12">
                  <Target size={64} className="mx-auto mb-6 opacity-50" />
                  <p className="text-base">Clique em "Gerar Projeções" para previsões futuras</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Award size={18} className="text-amber-600"/> Metas e Objetivos
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-bold text-indigo-700">Meta de Membros</span>
                  <span className="text-sm text-indigo-600">6 meses</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-3">
                  <div className="bg-indigo-600 h-3 rounded-full" style={{width: '65%'}}></div>
                </div>
                <p className="text-sm text-indigo-600 mt-1">65% alcançado</p>
              </div>
              
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-bold text-emerald-700">Meta de Arrecadação</span>
                  <span className="text-sm text-emerald-600">Anual</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-3">
                  <div className="bg-emerald-600 h-3 rounded-full" style={{width: '78%'}}></div>
                </div>
                <p className="text-sm text-emerald-600 mt-1">78% alcançado</p>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-bold text-amber-700">Novos Ministérios</span>
                  <span className="text-sm text-amber-600">Trimestre</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-3">
                  <div className="bg-amber-600 h-3 rounded-full" style={{width: '40%'}}></div>
                </div>
                <p className="text-sm text-amber-600 mt-1">2 de 5 iniciados</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Widget Aniversariantes do Mês (visível em todas as tabs) */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
            <Cake size={18} className="text-rose-500"/> Aniversariantes — {today.toLocaleString('pt-BR', { month: 'long' })}
          </h3>
          <span className="text-sm font-black text-slate-400">{birthdaysThisMonth.length} pessoa(s)</span>
        </div>
        {birthdaysThisMonth.length === 0 ? (
          <p className="text-sm text-slate-400 font-medium text-center py-8">Nenhum aniversariante este mês.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {birthdaysThisMonth.map((p, i) => {
              const isToday = p.date.getDate() === currentDay;
              return (
                <div key={i} className={`flex items-center gap-4 px-8 py-4 ${isToday ? 'bg-rose-50' : 'hover:bg-slate-50/50'} transition-colors`}>
                  <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    {p.avatar ? <img src={p.avatar} className="w-full h-full object-cover" alt="" /> : <span className="text-lg font-black text-slate-500">{p.name[0]}</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-slate-800">{p.name} {isToday && <span className="text-rose-500">🎂 Hoje!</span>}</p>
                    <p className="text-sm text-slate-400 uppercase font-bold">{p.type} • dia {p.date.getDate()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Widget Alertas de CNH (visível em todas as tabs) */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
            <Car size={18} className="text-amber-500"/> Alertas CNH — Vencimento
          </h3>
          <span className={`text-sm font-bold ${
            cnhAlerts.some(a => a.status === 'expired') ? 'text-red-600 bg-red-50' :
            cnhAlerts.some(a => a.status === 'critical') ? 'text-amber-600 bg-amber-50' :
            cnhAlerts.length > 0 ? 'text-yellow-600 bg-yellow-50' :
            'text-emerald-600 bg-emerald-50'
          } px-3 py-1 rounded-full`}>
            {cnhAlerts.some(a => a.status === 'expired') ? `${cnhAlerts.filter(a => a.status === 'expired').length} Vencida(s)` :
             cnhAlerts.some(a => a.status === 'critical') ? `${cnhAlerts.filter(a => a.status === 'critical').length} Crítica(s)` :
             cnhAlerts.length > 0 ? `${cnhAlerts.length} Alerta(s)` :
             'Sem Alertas'}
          </span>
        </div>
        {cnhAlerts.length === 0 ? (
          <p className="text-sm text-slate-400 font-medium text-center py-8">Nenhuma CNH com vencimento próximo.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {cnhAlerts.map((alert, i) => (
              <div key={i} className={`flex items-center gap-4 px-8 py-4 ${
                alert.status === 'expired' ? 'bg-red-50' :
                alert.status === 'critical' ? 'bg-amber-50' :
                'bg-yellow-50'
              } transition-colors`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  alert.status === 'expired' ? 'bg-red-200 text-red-600' :
                  alert.status === 'critical' ? 'bg-amber-200 text-amber-600' :
                  'bg-yellow-200 text-yellow-600'
                }`}>
                  {alert.status === 'expired' ? <AlertCircle size={20} /> : <Car size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-slate-800">{alert.nome}</p>
                  <p className="text-sm text-slate-400 uppercase font-bold">
                    CNH {alert.categoria} • Vence: {new Date(alert.vencimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    alert.status === 'expired' ? 'bg-red-100 text-red-700' :
                    alert.status === 'critical' ? 'bg-amber-100 text-amber-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {alert.status === 'expired' ? 'VENCIDA' :
                     alert.status === 'critical' ? `${alert.daysUntilExpiration} dias` :
                     `${alert.daysUntilExpiration} dias`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
