/**
 * ============================================================================
 * COMUNICACAO.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para comunicacao.
 *
 * ONDE É USADO?
 * -------------
 * Usado na interface React como parte do frontend.
 *
 * COMO FUNCIONA?
 * --------------
 * Controla a apresentação e interações da interface com o usuário.
 */

import React, { useState, useEffect } from 'react';
import { 
  Mail, Send, MessageSquare, Users, Calendar, Search, Filter, Plus, X, CheckCircle, AlertCircle, 
  Clock, TrendingUp, Eye, Edit2, Trash2, MoreVertical, BarChart3, PieChart, Activity,
  Bell, Smartphone, Globe, Settings, RefreshCw, Download, Upload, Copy, Target, FileText,
  Sparkles, PencilLine, Eraser, History, Clock as ClockIcon, AlertTriangle
} from 'lucide-react';
import CommunicationService from '../services/communicationService';
import { geminiService } from '../services/geminiService';
import { 
  EmailCampaign, 
  SMSMessage, 
  CommunicationTemplate, 
  CommunicationGroup, 
  CommunicationStats,
  Notification,
  NotificationType,
  NotificationStatus
} from '../types/communication';
import { Member, Payroll } from '../types';

interface ComunicacaoProps {
  members?: Member[];
  employees?: Payroll[];
  currentUnitId?: string;
  user?: any;
}

/**
 * COMPONENTE HÍBRIDO DE COMUNICAÇÃO
 * =====================================
 * 
 * Combina o sistema de campanhas com o escritor IA e envio direto
 */
/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (comunicacao).
 */

export const Comunicacao: React.FC<ComunicacaoProps> = ({ 
  members = [], 
  employees = [], 
  currentUnitId = 'u-sede',
  user 
}) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'sms' | 'templates' | 'groups' | 'stats' | 'writer'>('writer');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados do sistema de campanhas
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [smsMessages, setSmsMessages] = useState<SMSMessage[]>([]);
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [groups, setGroups] = useState<CommunicationGroup[]>([]);
  const [stats, setStats] = useState<CommunicationStats | null>(null);
  const [statsPeriod, setStatsPeriod] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'>('MONTH');
  
  // Estados do escritor IA (mantidos do original)
  const [activeMode, setActiveMode] = useState<'IA' | 'MANUAL'>('IA');
  const [topic, setTopic] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<NotificationStatus | 'ALL'>('ALL');

  // Carregar dados das campanhas
  useEffect(() => {
    if (activeTab !== 'writer') {
      loadCampaignData();
    }
  }, [activeTab, currentUnitId]);

  // Carregar estatísticas quando o período mudar
  useEffect(() => {
    if (activeTab === 'stats') {
      loadStats();
    }
  }, [statsPeriod, currentUnitId]);

  const loadCampaignData = async () => {
    setIsLoading(true);
    try {
      const [
        campaignsData,
        smsData,
        templatesData,
        groupsData
      ] = await Promise.all([
        CommunicationService.getEmailCampaigns(currentUnitId),
        CommunicationService.getSMSMessages(currentUnitId),
        CommunicationService.getTemplates(currentUnitId),
        CommunicationService.getGroups(currentUnitId)
      ]);

      setCampaigns(campaignsData);
      setSmsMessages(smsData);
      setTemplates(templatesData);
      setGroups(groupsData);
      
    } catch (error) {
      console.error('Erro ao carregar dados de comunicação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await CommunicationService.generateStats(currentUnitId, statsPeriod);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  // Funções do escritor IA (melhoradas com base na referência)
  const generateMessage = async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    
    try {
      const result = await geminiService.generatePastoralResponse(topic);
      
      if (result.startsWith('LIMITE_EXCEDIDO') || result.startsWith('ERRO_') || result.includes('indisponível') || result.includes('Erro')) {
        const cleanMsg = result.includes(': ') ? result.split(': ')[1] : result;
        setError(cleanMsg);
      } else {
        setFinalMessage(result || '');
      }
    } catch (e) {
      setError("Falha crítica ao conectar com o serviço de inteligência.");
    } finally {
      setLoading(false);
    }
  };

  // Nova função para gerar diferentes tipos de conteúdo pastoral
  const generateSpecificMessage = async (type: 'devotional' | 'sermon' | 'announcement' | 'prayer') => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    
    try {
      const result = await geminiService.generateSpecificContent(topic, type);
      
      if (result.includes('indisponível') || result.includes('Erro')) {
        setError(result);
      } else {
        setFinalMessage(result);
      }
    } catch (e) {
      setError("Falha ao gerar conteúdo específico. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Função para analisar saúde da igreja (baseado na referência)
  const analyzeChurchHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular dados da igreja (em produção viriam do sistema)
      const churchData = {
        totalMembers: members.length,
        activeMembers: Math.floor(members.length * 0.7), // 70% ativos
        monthlyRevenue: 15000, // Simulação
        monthlyExpenses: 12000   // Simulação
      };
      
      const result = await geminiService.analyzeChurchHealth(churchData);
      
      // Adicionar insights ao final da mensagem atual
      const insightsSection = `\n\n--- 📊 INSIGHTS DA IGREJA ---\n${result}`;
      setFinalMessage(finalMessage + insightsSection);
    } catch (e) {
      setError("Não foi possível analisar a saúde da igreja.");
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

  // Funções do sistema de campanhas
  const handleSendCampaign = async (campaignId: string) => {
    try {
      await CommunicationService.sendEmailCampaign(campaignId, currentUnitId);
      await loadCampaignData();
      alert('Campanha enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar campanha:', error);
      alert('Erro ao enviar campanha. Tente novamente.');
    }
  };

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Renderizar aba do Escritor IA (melhorada com novos recursos)
  const renderWriterTab = () => (
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
                  
                  {/* Novos botões de conteúdo específico */}
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => generateSpecificMessage('devotional')} 
                      disabled={loading || !topic} 
                      className="bg-purple-600 text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1"
                    >
                      <Sparkles size={12} /> Devocional
                    </button>
                    <button 
                      onClick={() => generateSpecificMessage('sermon')} 
                      disabled={loading || !topic} 
                      className="bg-blue-600 text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1"
                    >
                      <Sparkles size={12} /> Sermão
                    </button>
                    <button 
                      onClick={() => generateSpecificMessage('announcement')} 
                      disabled={loading || !topic} 
                      className="bg-green-600 text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1"
                    >
                      <Sparkles size={12} /> Comunicado
                    </button>
                    <button 
                      onClick={() => generateSpecificMessage('prayer')} 
                      disabled={loading || !topic} 
                      className="bg-amber-600 text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-amber-700 disabled:opacity-50 transition-all flex items-center justify-center gap-1"
                    >
                      <Sparkles size={12} /> Oração
                    </button>
                  </div>
                  
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xl flex items-center gap-2 uppercase tracking-tighter"><PencilLine size={20} className="text-indigo-300" /> Revisão Pastoral</h3>
              <button
                onClick={analyzeChurchHealth}
                disabled={loading}
                className="px-3 py-1 bg-indigo-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-1"
                title="Analisar saúde da igreja"
              >
                <BarChart3 size={12} /> Saúde
              </button>
            </div>
            <textarea className="flex-1 w-full bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 text-indigo-100 leading-relaxed italic text-sm outline-none resize-none custom-scrollbar" value={finalMessage} onChange={(e) => setFinalMessage(e.target.value)} placeholder="Aguardando conteúdo..." />
            {finalMessage && (
              <div className="mt-8 space-y-4 animate-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={handleSendWhatsApp} className="bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all shadow-lg flex items-center justify-center gap-3"><MessageSquare size={18}/> WhatsApp</button>
                  <button onClick={handleSendEmail} className="bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-400 transition-all shadow-lg flex items-center justify-center gap-3"><Mail size={18}/> E-mail (BCC)</button>
                </div>
                
                {/* Indicadores de IA */}
                <div className="flex items-center justify-center gap-4 text-xs text-indigo-300">
                  <span className="flex items-center gap-1">
                    <Sparkles size={12} /> IA Gemini
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {members.length} membros
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={12} /> Pronto para envio
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar aba de Campanhas (simplificada)
  const renderCampaignsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campanhas de Email</h1>
            <p className="text-sm text-slate-600">Gerencie campanhas em massa</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadCampaignData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Total Campanhas</span>
            <Mail size={16} />
          </div>
          <div className="text-2xl font-bold">{campaigns.length}</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Enviadas</span>
            <Send size={16} />
          </div>
          <div className="text-2xl font-bold">
            {campaigns.filter(c => c.status === 'SENT').length}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Em Andamento</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-bold">
            {campaigns.filter(c => c.status === 'SENDING').length}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Taxa Abertura</span>
            <Eye size={16} />
          </div>
          <div className="text-2xl font-bold">
            {campaigns.length > 0 ? 
              Math.round(campaigns.reduce((sum, c) => sum + c.openedCount, 0) / 
              campaigns.reduce((sum, c) => sum + c.sentCount, 0) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Lista de Campanhas */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Campanhas Recentes</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Assunto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">Destinatários</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">Taxa Abertura</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {campaigns.slice(0, 10).map(campaign => (
                <tr key={campaign.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium">{campaign.name}</td>
                  <td className="px-4 py-3 text-sm">{campaign.subject}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'SENT' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'SENDING' ? 'bg-blue-100 text-blue-800' :
                      campaign.status === 'SCHEDULED' ? 'bg-amber-100 text-amber-800' :
                      campaign.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                      campaign.status === 'PAUSED' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">{campaign.totalRecipients}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    {campaign.sentCount > 0 ? 
                      Math.round((campaign.openedCount / campaign.sentCount) * 100) : 0}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {campaign.status === 'DRAFT' && (
                        <button
                          onClick={() => handleSendCampaign(campaign.id)}
                          className="p-1 text-green-600 hover:text-green-700 transition-colors"
                          title="Enviar Campanha"
                        >
                          <Send size={14} />
                        </button>
                      )}
                      <button className="p-1 text-blue-600 hover:text-blue-700 transition-colors" title="Ver">
                        <Eye size={14} />
                      </button>
                      <button className="p-1 text-slate-600 hover:text-slate-700 transition-colors" title="Editar">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {[
          { id: 'writer', label: 'Escritor IA', icon: Sparkles },
          { id: 'campaigns', label: 'Campanhas', icon: Mail },
          { id: 'sms', label: 'SMS', icon: MessageSquare },
          { id: 'stats', label: 'Estatísticas', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo das Tabs */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Carregando...</span>
        </div>
      ) : (
        <>
          {activeTab === 'writer' && renderWriterTab()}
          {activeTab === 'campaigns' && renderCampaignsTab()}
          {activeTab === 'sms' && (
            <div className="text-center py-12 text-slate-600">
              <MessageSquare size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold mb-2">SMS em Desenvolvimento</h3>
              <p>Funcionalidade de SMS será implementada em breve.</p>
            </div>
          )}
          {activeTab === 'stats' && (
            <div className="text-center py-12 text-slate-600">
              <BarChart3 size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold mb-2">Estatísticas em Desenvolvimento</h3>
              <p>Funcionalidade de estatísticas será implementada em breve.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
