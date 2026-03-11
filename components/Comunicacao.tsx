
import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, PencilLine, Eraser, History, Clock, AlertTriangle, Mail } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Member, Payroll } from '../types';

interface ComunicacaoProps {
  members?: Member[];
  employees?: Payroll[];
}

export const Comunicacao: React.FC<ComunicacaoProps> = ({ members = [], employees = [] }) => {
  const [activeMode, setActiveMode] = useState<'IA' | 'MANUAL'>('IA');
  const [topic, setTopic] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMessage = async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    
    try {
      const result = await geminiService.generatePastoralResponse(topic);
      
      if (result.startsWith('LIMITE_EXCEDIDO') || result.startsWith('ERRO_')) {
        const cleanMsg = result.includes(': ') ? result.split(': ')[1] : result;
        setError(cleanMsg);
        // Não apaga a mensagem anterior se houver erro
      } else {
        setFinalMessage(result || '');
      }
    } catch (e) {
      setError("Falha crítica ao conectar com o serviço de inteligência.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!finalMessage) return;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(finalMessage)}`, '_blank');
  };

  const handleSendEmail = () => {
    if (!finalMessage) return;
    
    // Coleta emails únicos de membros (e funcionários se tivessem o campo)
    const memberEmails = members.map(m => m.email).filter(Boolean);
    const employeeEmails = employees.map(e => e.email).filter(Boolean);
    const allEmails = Array.from(new Set([...memberEmails, ...employeeEmails]));
    
    const bcc = allEmails.join(',');
    const subject = encodeURIComponent("Informativo ADJPA");
    const body = encodeURIComponent(finalMessage);
    
    // Abre o gerenciador de e-mail padrão com BCC
    window.location.href = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight uppercase tracking-tight italic font-serif">Comunicação Inteligente</h1>
          <p className="text-slate-500 font-medium text-sm">Escritor Pastoral via IA e Gestão de Avisos ADJPA.</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-3">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Base Integrada: {members.length + employees.length} contatos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex p-2 gap-2 bg-slate-50 rounded-[2.2rem] mb-4">
               <button onClick={() => setActiveMode('IA')} className={`flex-1 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'IA' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-400'}`}><Sparkles size={14} className="inline mr-2"/> Escritor IA</button>
               <button onClick={() => setActiveMode('MANUAL')} className={`flex-1 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all ${activeMode === 'MANUAL' ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-400'}`}><PencilLine size={14} className="inline mr-2"/> Texto Livre</button>
            </div>
            <div className="p-6">
              {activeMode === 'IA' ? (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tema para Inspiração IA</label>
                  <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-32 focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm" placeholder="Ex: Palavra de ânimo para jovens..." value={topic} onChange={(e) => setTopic(e.target.value)} />
                  
                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-[11px] font-bold text-rose-600 animate-in fade-in">
                      <AlertTriangle size={14} /> {error}
                    </div>
                  )}
                  
                  <button 
                    onClick={generateMessage} 
                    disabled={loading || !topic} 
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase shadow-xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Sparkles size={18}/>} 
                    {loading ? 'Consultando IA...' : 'Gerar Mensagem IA'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Editor de Texto</label>
                   <textarea className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl h-[280px] focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm leading-relaxed" placeholder="Escreva sua mensagem aqui..." value={finalMessage} onChange={(e) => setFinalMessage(e.target.value)} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-indigo-900 text-white p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><MessageSquare size={200} /></div>
          <div className="relative z-10 flex flex-col h-full">
            <h3 className="font-black text-xl flex items-center gap-2 uppercase tracking-tighter mb-6"><PencilLine size={20} className="text-indigo-300" /> Revisão Pastoral</h3>
            <textarea className="flex-1 w-full bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 text-indigo-100 leading-relaxed italic text-sm outline-none resize-none custom-scrollbar" value={finalMessage} onChange={(e) => setFinalMessage(e.target.value)} placeholder="Aguardando conteúdo..." />
            {finalMessage && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4">
                <button onClick={handleSendWhatsApp} className="bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all shadow-lg flex items-center justify-center gap-3"><MessageSquare size={18}/> WhatsApp</button>
                <button onClick={handleSendEmail} className="bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-400 transition-all shadow-lg flex items-center justify-center gap-3"><Mail size={18}/> E-mail (BCC)</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
