
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  Users, TrendingUp, DollarSign, Target, Sparkles, AlertTriangle, RotateCcw, Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { geminiService } from '../services/geminiService';
import { UserAuth, Member, Payroll } from '../types';

const chartData = [
  { name: 'Jan', revenue: 4000 }, { name: 'Fev', revenue: 3000 },
  { name: 'Mar', revenue: 2000 }, { name: 'Abr', revenue: 2780 },
  { name: 'Mai', revenue: 4890 },
];

interface PainelGeralProps {
  user: UserAuth;
  members: Member[];
  employees: Payroll[];
}

export const PainelGeral: React.FC<PainelGeralProps> = ({ user, members, employees }) => {
  const [insights, setInsights] = useState<string>('Consultando inteligência ministerial...');
  const [isError, setIsError] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const lastAnalyzedCount = useRef<number>(-1);

  // Efeito para gerenciar o contador de cooldown
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = geminiService.getBlockedTimeRemaining();
      setCooldown(remaining);
      if (remaining === 0 && isError && insights.includes('limite de uso')) {
        // Opcional: tentar carregar novamente ou resetar estado de erro
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isError, insights]);

  const fetchInsights = useCallback(async (force = false) => {
    if (geminiService.isQuotaBlocked()) return;
    if (!force && lastAnalyzedCount.current === members.length) return;
    
    setIsLoadingInsights(true);
    setIsError(false);
    setInsights('Sincronizando com a nuvem de IA...');
    
    try {
      const res = await geminiService.analyzeChurchHealth({
        totalMembers: members.length,
        activeMembers: members.filter(m => m.status === 'ACTIVE').length,
        monthlyRevenue: 25000,
        monthlyExpenses: 18000
      });

      if (res.includes('LIMITE_EXCEDIDO') || res.includes('ERRO_')) {
        setIsError(true);
        const cleanMsg = res.includes(': ') ? res.split(': ')[1] : res;
        setInsights(cleanMsg);
      } else {
        setInsights(res);
        lastAnalyzedCount.current = members.length;
      }
    } catch (err) {
      setIsError(true);
      setInsights('A conexão com a IA falhou. Verifique sua rede.');
    } finally {
      setIsLoadingInsights(false);
    }
  }, [members]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic font-serif">Painel Geral</h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter mt-0.5">Indicadores Críticos e Insights em Tempo Real</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-black text-indigo-600 uppercase">Status: Online</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: 'Total Membros', v: members.length, t: '+12%', i: <Users />, c: 'indigo' },
          { l: 'Arrecadação', v: 'R$ 25.4k', t: '+8%', i: <DollarSign />, c: 'emerald' },
          { l: 'Frequência Média', v: '312', t: '-2%', i: <Target />, c: 'amber' },
          { l: 'Novos Visitantes', v: '18', t: '+24%', i: <TrendingUp />, c: 'blue' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-[1.5rem] border border-slate-100 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between mb-2">
              <div className={`p-2 bg-${s.c}-50 text-${s.c}-600 rounded-xl`}>
                {React.cloneElement(s.i as React.ReactElement<{ size?: number }>, { size: 16 })}
              </div>
              <span className={`text-[9px] font-black ${s.t.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-2 py-0.5 rounded-full`}>{s.t}</span>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{s.v}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white p-6 rounded-[2rem] border border-slate-100 h-80 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 border-b pb-2 flex items-center gap-2">
            <TrendingUp size={14} className="text-indigo-600"/> Evolução da Arrecadação
          </h3>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize: 9, fontWeight: 700}} axisLine={false} />
              <YAxis tick={{fontSize: 9, fontWeight: 700}} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`lg:col-span-4 p-6 rounded-[2rem] shadow-xl relative overflow-hidden flex flex-col h-80 transition-colors duration-500 ${isError ? 'bg-rose-900' : 'bg-slate-900'}`}>
           <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={180}/></div>
           <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10 ${isError ? 'text-rose-200' : 'text-indigo-300'}`}>
              {isError ? <AlertTriangle size={14}/> : <Sparkles size={14}/>} 
              {isError ? 'Status da Inteligência' : 'Recomendações Estratégicas IA'}
           </h3>
           <div className={`flex-1 backdrop-blur-md rounded-[1.5rem] p-5 border relative z-10 overflow-y-auto custom-scrollbar ${isError ? 'bg-white/5 border-white/20' : 'bg-white/5 border-white/10'}`}>
              {isLoadingInsights ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-white/50 animate-pulse">
                  <RotateCcw size={20} className="animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando...</span>
                </div>
              ) : (
                <p className={`text-[12px] leading-relaxed italic font-medium ${isError ? 'text-rose-100' : 'text-indigo-50'}`}>
                  "{insights}"
                </p>
              )}
           </div>
           
           <div className="mt-4 flex items-center justify-between relative z-10">
              <div className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-2 ${isError ? 'text-rose-400' : 'text-indigo-400'}`}>
                 <span>Engine: Gemini 3.0 Flash</span>
                 {cooldown > 0 && (
                   <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full">
                     <Clock size={10}/> {cooldown}s
                   </span>
                 )}
              </div>
              {isError && (
                <button 
                  onClick={() => fetchInsights(true)}
                  disabled={cooldown > 0}
                  className={`p-2 rounded-lg text-white transition-all flex items-center gap-1.5 text-[9px] font-black uppercase shadow-sm ${cooldown > 0 ? 'bg-white/5 opacity-40 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 active:scale-95'}`}
                >
                  <RotateCcw size={12} className={isLoadingInsights ? 'animate-spin' : ''}/> 
                  {cooldown > 0 ? `Aguarde (${cooldown}s)` : 'Tentar Agora'}
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};
