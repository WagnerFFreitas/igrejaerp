import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, Star, UserCheck, Plus, X, Save, ChevronDown, ChevronUp, FileText, Trophy } from 'lucide-react';
import { Payroll, PerformanceEvaluation } from '../types';
import AvaliacaoService from '../services/avaliacaoService';

interface RecursosHumanosProps {
  employees: Payroll[];
  currentUnitId: string;
  evaluations: Record<string, any[]>;
}

interface Avaliacao {
  id: string;
  data: string;
  pontuacao: number;
  observacoes: string;
}

interface PDI {
  id: string;
  meta: string;
  prazo: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO';
}

interface EmployeeRecord {
  employeeId: string;
  avaliacoes: Avaliacao[];
  pdis: PDI[];
}

export const RecursosHumanos: React.FC<RecursosHumanosProps> = ({ employees, currentUnitId, evaluations }) => {
  const [records, setRecords] = useState<Record<string, EmployeeRecord>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'avaliacao' | 'pdi' | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [avaliacaoForm, setAvaliacaoForm] = useState({ data: '', pontuacao: 3, observacoes: '' });
  const [pdiForm, setPdiForm] = useState({ meta: '', prazo: '', status: 'PENDENTE' as PDI['status'] });

  const getRecord = (id: string): EmployeeRecord =>
    records[id] || { employeeId: id, avaliacoes: [], pdis: [] };

  // Obter avaliações reais do funcionário do estado compartilhado
  const getEmployeeRealEvaluations = (employeeId: string): any[] => {
    return evaluations[employeeId] || [];
  };

  // Calcular média das avaliações reais
  const getAvgScore = (id: string) => {
    const realEvals = getEmployeeRealEvaluations(id);
    if (realEvals.length === 0) {
      // Fallback para avaliações locais se não houver reais
      const avs = getRecord(id).avaliacoes;
      if (!avs.length) return 0;
      return avs.reduce((s, a) => s + a.pontuacao, 0) / avs.length;
    }
    return realEvals.reduce((s, e) => s + e.overallScore, 0) / realEvals.length;
  };

  const handleSaveAvaliacao = () => {
    if (!selectedEmployeeId || !avaliacaoForm.data) return;
    const rec = getRecord(selectedEmployeeId);
    const nova: Avaliacao = { id: `av-${Date.now()}`, ...avaliacaoForm };
    setRecords(prev => ({ ...prev, [selectedEmployeeId]: { ...rec, avaliacoes: [...rec.avaliacoes, nova] } }));
    setAvaliacaoForm({ data: '', pontuacao: 3, observacoes: '' });
    setModalType(null);
  };

  const handleSavePDI = () => {
    if (!selectedEmployeeId || !pdiForm.meta) return;
    const rec = getRecord(selectedEmployeeId);
    const novo: PDI = { id: `pdi-${Date.now()}`, ...pdiForm };
    setRecords(prev => ({ ...prev, [selectedEmployeeId]: { ...rec, pdis: [...rec.pdis, novo] } }));
    setPdiForm({ meta: '', prazo: '', status: 'PENDENTE' });
    setModalType(null);
  };

  const totalAvaliacoesPendentes = employees.filter(e => {
    const realEvals = getEmployeeRealEvaluations(e.id);
    const localEvals = getRecord(e.id).avaliacoes;
    return realEvals.length === 0 && localEvals.length === 0;
  }).length;

  // Ranking calculado a partir das avaliações reais - Top 10 funcionários mais bem avaliados
  const ranking = useMemo(() => {
    console.log('🏆 Calculando ranking Top 10. Avaliações por funcionário:', evaluations);
    
    const result = employees
      .map(emp => {
        const realEvals = getEmployeeRealEvaluations(emp.id);
        const avg = realEvals.length > 0 
          ? realEvals.reduce((s, e) => s + e.overallScore, 0) / realEvals.length 
          : 0;
        const pdisAtivos = getRecord(emp.id).pdis.filter(p => p.status === 'EM_ANDAMENTO').length;
        console.log(`  - ${emp.employeeName}: ${realEvals.length} avaliações, média ${avg.toFixed(1)}`);
        return { emp, avg, total: realEvals.length, pdisAtivos };
      })
      .filter(r => r.total > 0) // Apenas funcionários com avaliações registradas
      .sort((a, b) => b.avg - a.avg) // Ordena por média decrescente
      .slice(0, 10); // Top 10
    
    console.log('🏆 Ranking Top 10 final:', result.length, 'funcionários qualificados');
    return result;
  }, [evaluations, employees, records]);

  const getRatingLabel = (avg: number) => {
    // avg está em escala 0-100 (das avaliações reais)
    if (avg >= 90) return { label: 'Excelente', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (avg >= 80) return { label: 'Bom', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (avg >= 70) return { label: 'Regular', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { label: 'Atenção', color: 'text-rose-600', bg: 'bg-rose-50' };
  };

  const getMedalIcon = (pos: number) => {
    if (pos === 0) return <Trophy size={16} className="text-yellow-500" />;
    if (pos === 1) return <Trophy size={16} className="text-slate-400" />;
    if (pos === 2) return <Trophy size={16} className="text-amber-700" />;
    return <span className="text-[11px] font-black text-slate-400 w-4 text-center">{pos + 1}º</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight italic font-serif">Recursos Humanos</h1>
          <p className="text-slate-500 font-medium text-[11px] uppercase tracking-widest mt-1">Desenvolvimento Ministerial e Gestão de Competências ADJPA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Colaboradores', val: employees.length, icon: <UserCheck size={18}/>, c: 'indigo' },
          { label: 'Avaliações Pendentes', val: totalAvaliacoesPendentes, icon: <Star size={18}/>, c: 'amber' },
          { label: 'PDIs Ativos', val: Object.values(records).reduce((s, r) => s + r.pdis.filter(p => p.status === 'EM_ANDAMENTO').length, 0), icon: <BookOpen size={18}/>, c: 'rose' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-xl bg-${s.c}-50 text-${s.c}-600`}>{s.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ranking de Avaliações - Top 10 Melhores Funcionários */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-gradient-to-r from-amber-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-xl"><Trophy size={16} className="text-amber-600"/></div>
            <div>
              <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.15em]">Top 10 - Melhores Funcionários</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Ranking baseado na média das avaliações de desempenho</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              {ranking.length} avaliado{ranking.length !== 1 ? 's' : ''}
            </span>
            <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
              TOP 10
            </span>
          </div>
        </div>

        {ranking.length === 0 ? (
          <div className="p-10 text-center">
            <Trophy size={32} className="text-slate-200 mx-auto mb-3"/>
            <p className="text-sm font-bold text-slate-400">Nenhuma avaliação registrada ainda.</p>
            <p className="text-[11px] text-slate-300 mt-1">Registre avaliações na lista abaixo para ver o ranking dos Top 10 melhores funcionários.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {ranking.map((r, idx) => {
              const rating = getRatingLabel(r.avg);
              const pct = r.avg; // avg já está em 0-100
              return (
                <div key={r.emp.id} className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/50 ${idx < 3 ? 'bg-gradient-to-r from-amber-50/50 to-transparent' : ''}`}>
                  {/* Posição com medalha */}
                  <div className="w-10 flex items-center justify-center flex-shrink-0">
                    {idx === 0 ? (
                      <div className="flex items-center gap-1">
                        <Trophy size={16} className="text-yellow-500"/>
                        <span className="text-[10px] font-black text-yellow-600">1º</span>
                      </div>
                    ) : idx === 1 ? (
                      <div className="flex items-center gap-1">
                        <Trophy size={16} className="text-slate-400"/>
                        <span className="text-[10px] font-black text-slate-600">2º</span>
                      </div>
                    ) : idx === 2 ? (
                      <div className="flex items-center gap-1">
                        <Trophy size={16} className="text-amber-700"/>
                        <span className="text-[10px] font-black text-amber-700">3º</span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-black text-slate-400 w-6 text-center">{idx + 1}º</span>
                    )}
                  </div>

                  {/* Avatar com gradiente para top 3 */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md flex-shrink-0 ${
                    idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-600' : 
                    idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500' : 
                    idx === 2 ? 'bg-gradient-to-br from-amber-500 to-amber-800' : 
                    'bg-indigo-500'
                  }`}>
                    {r.emp.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>

                  {/* Nome e cargo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-slate-900 text-[13px] truncate">{r.emp.employeeName}</p>
                      {idx === 0 && <span className="text-[8px] font-black text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">👑 MELHOR</span>}
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter truncate">{r.emp.cargo}{r.emp.departamento ? ` · ${r.emp.departamento}` : ''}</p>
                  </div>

                  {/* Barra de progresso melhorada */}
                  <div className="w-32 hidden lg:block">
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex-1">
                        <div
                          className={`h-full rounded-full transition-all ${pct >= 90 ? 'bg-emerald-500' : pct >= 70 ? 'bg-blue-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-black text-slate-400 w-8">{pct}%</span>
                    </div>
                  </div>

                  {/* Estrelas */}
                  <div className="flex gap-0.5 flex-shrink-0">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={13} className={s <= Math.round(r.avg / 20) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}/>
                    ))}
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0 w-16">
                    <p className="text-lg font-black text-slate-900">{r.avg.toFixed(1)}</p>
                    <p className="text-[8px] text-slate-400">{r.total} aval.</p>
                  </div>

                  {/* Badge */}
                  <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex-shrink-0 ${rating.bg} ${rating.color}`}>
                    {rating.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/20">
          <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
            <UserCheck size={14} className="text-indigo-600"/> Avaliação de Desempenho & PDI
          </h3>
        </div>        <div className="divide-y divide-slate-50">
          {employees.map(emp => {
            const rec = getRecord(emp.id);
            const avg = getAvgScore(emp.id);
            const isExpanded = expandedId === emp.id;
            return (
              <div key={emp.id}>
                <div
                  className="p-4 flex items-center justify-between hover:bg-slate-50/50 cursor-pointer transition-all"
                  onClick={() => setExpandedId(isExpanded ? null : emp.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md">
                      {emp.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-[12px]">{emp.employeeName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{emp.cargo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} className={s <= Math.round(avg) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{rec.avaliacoes.length} aval. • {rec.pdis.length} PDI</span>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 space-y-4 bg-slate-50/30">
                    {/* Avaliações */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Histórico de Avaliações</h4>
                        <button onClick={() => { setSelectedEmployeeId(emp.id); setModalType('avaliacao'); }}
                          className="flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase">
                          <Plus size={12}/> Nova
                        </button>
                      </div>
                      {rec.avaliacoes.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">Nenhuma avaliação registrada.</p>
                      ) : rec.avaliacoes.map(av => (
                        <div key={av.id} className="flex items-center justify-between py-2 border-t border-slate-50">
                          <div>
                            <p className="text-xs font-bold text-slate-700">{new Date(av.data).toLocaleDateString('pt-BR')}</p>
                            <p className="text-[10px] text-slate-500">{av.observacoes || '—'}</p>
                          </div>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => <Star key={s} size={11} className={s <= av.pontuacao ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}/>)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* PDI */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plano de Desenvolvimento (PDI)</h4>
                        <button onClick={() => { setSelectedEmployeeId(emp.id); setModalType('pdi'); }}
                          className="flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase">
                          <Plus size={12}/> Nova Meta
                        </button>
                      </div>
                      {rec.pdis.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic">Nenhuma meta cadastrada.</p>
                      ) : rec.pdis.map(pdi => (
                        <div key={pdi.id} className="flex items-center justify-between py-2 border-t border-slate-50">
                          <div>
                            <p className="text-xs font-bold text-slate-700">{pdi.meta}</p>
                            <p className="text-[10px] text-slate-500">Prazo: {pdi.prazo ? new Date(pdi.prazo).toLocaleDateString('pt-BR') : '—'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              pdi.status === 'CONCLUIDO' ? 'bg-emerald-50 text-emerald-600' :
                              pdi.status === 'EM_ANDAMENTO' ? 'bg-blue-50 text-blue-600' :
                              'bg-slate-100 text-slate-500'
                            }`}>{pdi.status === 'CONCLUIDO' ? 'Concluído' : pdi.status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Pendente'}</span>
                            <button onClick={() => {
                              const rec = getRecord(emp.id);
                              const updated = rec.pdis.map(p => p.id === pdi.id ? {
                                ...p, status: p.status === 'PENDENTE' ? 'EM_ANDAMENTO' : p.status === 'EM_ANDAMENTO' ? 'CONCLUIDO' : 'PENDENTE'
                              } as PDI : p);
                              setRecords(prev => ({ ...prev, [emp.id]: { ...rec, pdis: updated } }));
                            }} className="text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase">Avançar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Avaliação */}
      {modalType === 'avaliacao' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><Star size={18} className="text-amber-400"/> Nova Avaliação</h2>
              <button onClick={() => setModalType(null)}><X size={20} className="text-slate-400"/></button>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Data</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                value={avaliacaoForm.data} onChange={e => setAvaliacaoForm(p => ({ ...p, data: e.target.value }))} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-2">Pontuação</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setAvaliacaoForm(p => ({ ...p, pontuacao: s }))}
                    className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${s <= avaliacaoForm.pontuacao ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Observações</label>
              <textarea rows={3} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                value={avaliacaoForm.observacoes} onChange={e => setAvaliacaoForm(p => ({ ...p, observacoes: e.target.value }))} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModalType(null)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-bold text-sm">Cancelar</button>
              <button onClick={handleSaveAvaliacao} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                <Save size={14}/> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal PDI */}
      {modalType === 'pdi' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2"><FileText size={18} className="text-indigo-600"/> Nova Meta PDI</h2>
              <button onClick={() => setModalType(null)}><X size={20} className="text-slate-400"/></button>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Meta / Objetivo</label>
              <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                placeholder="Ex: Concluir curso de liderança"
                value={pdiForm.meta} onChange={e => setPdiForm(p => ({ ...p, meta: e.target.value }))} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Prazo</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                value={pdiForm.prazo} onChange={e => setPdiForm(p => ({ ...p, prazo: e.target.value }))} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Status</label>
              <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                value={pdiForm.status} onChange={e => setPdiForm(p => ({ ...p, status: e.target.value as PDI['status'] }))}>
                <option value="PENDENTE">Pendente</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDO">Concluído</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModalType(null)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-bold text-sm">Cancelar</button>
              <button onClick={handleSavePDI} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                <Save size={14}/> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
