/**
 * ============================================================================
 * NOTIFICACOES.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para notificacoes.
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
  Bell, Smartphone, Globe, Settings, RefreshCw, Download, Upload, Copy, Target, FileText
} from 'lucide-react';
import CommunicationService from '../services/communicationService';
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

interface NotificacoesProps {
  currentUnitId: string;
  user?: any;
}

/**
 * COMPONENTE DE COMUNICAÇÃO E NOTIFICAÇÕES
 * =========================================
 * 
 * Sistema completo para gerenciar comunicação com membros
 */
/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (notificacoes).
 */

export const Notificacoes: React.FC<NotificacoesProps> = ({ currentUnitId, user }) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'sms' | 'templates' | 'groups' | 'stats'>('campaigns');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados para Campanhas
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<EmailCampaign | null>(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  
  // Estados para SMS
  const [smsMessages, setSmsMessages] = useState<SMSMessage[]>([]);
  const [selectedSMS, setSelectedSMS] = useState<SMSMessage | null>(null);
  const [showSMSModal, setShowSMSModal] = useState(false);
  
  // Estados para Templates
  const [templates, setTemplates] = useState<CommunicationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // Estados para Grupos
  const [groups, setGroups] = useState<CommunicationGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<CommunicationGroup | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  
  // Estados para Estatísticas
  const [stats, setStats] = useState<CommunicationStats | null>(null);
  const [statsPeriod, setStatsPeriod] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'>('MONTH');
  
  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<NotificationStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'ALL'>('ALL');

  // Carregar dados iniciais
  useEffect(() => {
    loadAllData();
  }, [currentUnitId]);

  // Carregar estatísticas quando o período mudar
  useEffect(() => {
    if (activeTab === 'stats') {
      loadStats();
    }
  }, [statsPeriod, currentUnitId]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Carregar todos os dados em paralelo
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

  // Enviar campanha
  const handleSendCampaign = async (campaignId: string) => {
    try {
      await CommunicationService.sendEmailCampaign(campaignId, currentUnitId);
      await loadAllData();
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

  // Renderizar aba de Campanhas
  const renderCampaignsTab = () => (
    <div className="space-y-6">
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

      {/* Filtros e Ações */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar campanhas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="ALL">Todos Status</option>
            <option value="DRAFT">Rascunho</option>
            <option value="SCHEDULED">Agendado</option>
            <option value="SENDING">Enviando</option>
            <option value="SENT">Enviado</option>
            <option value="PAUSED">Pausado</option>
          </select>
        </div>
        
        <button
          onClick={() => setShowCampaignModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Nova Campanha
        </button>
      </div>

      {/* Lista de Campanhas */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Campanhas de Email</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Assunto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">Destinatários</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">Enviados</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">Taxa Abertura</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">Data</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {campaigns
                .filter(c => searchTerm === '' || c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter(c => statusFilter === 'ALL' || c.status === statusFilter)
                .slice(0, 10)
                .map(campaign => (
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
                    <td className="px-4 py-3 text-sm text-center">{campaign.sentCount}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      {campaign.sentCount > 0 ? 
                        Math.round((campaign.openedCount / campaign.sentCount) * 100) : 0}%
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {campaign.createdAt ? formatDate(campaign.createdAt) : '-'}
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
                        <button className="p-1 text-red-600 hover:text-red-700 transition-colors" title="Excluir">
                          <Trash2 size={14} />
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

  // Renderizar aba de SMS
  const renderSMSTab = () => (
    <div className="space-y-6">
      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Total SMS</span>
            <MessageSquare size={16} />
          </div>
          <div className="text-2xl font-bold">{smsMessages.length}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Enviados</span>
            <Smartphone size={16} />
          </div>
          <div className="text-2xl font-bold">
            {smsMessages.filter(m => m.status === 'DELIVERED').length}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Pendentes</span>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-bold">
            {smsMessages.filter(m => m.status === 'PENDING').length}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium opacity-90">Custo Total</span>
            <TrendingUp size={16} />
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(smsMessages.reduce((sum, m) => sum + (m.cost || 0), 0))}
          </div>
        </div>
      </div>

      {/* Lista de SMS */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Mensagens SMS</h3>
          <button
            onClick={() => setShowSMSModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={14} />
            Nova SMS
          </button>
        </div>
        
        <div className="space-y-4 p-4">
          {smsMessages.slice(0, 10).map(message => (
            <div key={message.id} className="bg-slate-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      message.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      message.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                      message.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                      message.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {message.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      {message.createdAt ? formatDate(message.createdAt) : '-'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-700 mb-2">{message.message}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>📱 {message.recipientPhone}</span>
                    {message.cost && <span>💰 {formatCurrency(message.cost)}</span>}
                    {message.segments && <span>📄 {message.segments} segmentos</span>}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <Eye size={14} />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Renderizar aba de Estatísticas
  const renderStatsTab = () => (
    <div className="space-y-6">
      {/* Controles do Período */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={statsPeriod}
            onChange={(e) => setStatsPeriod(e.target.value as any)}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="TODAY">Hoje</option>
            <option value="WEEK">Esta Semana</option>
            <option value="MONTH">Este Mês</option>
            <option value="YEAR">Este Ano</option>
          </select>
        </div>
        
        <button
          onClick={loadStats}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      {stats && (
        <>
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium opacity-90">Total Enviados</span>
                <Send size={16} />
              </div>
              <div className="text-2xl font-bold">{stats.totalSent}</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium opacity-90">Taxa Entrega</span>
                <CheckCircle size={16} />
              </div>
              <div className="text-2xl font-bold">{stats.deliveryRate.toFixed(1)}%</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium opacity-90">Taxa Abertura</span>
                <Eye size={16} />
              </div>
              <div className="text-2xl font-bold">{stats.openRate.toFixed(1)}%</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium opacity-90">Custo Total</span>
                <TrendingUp size={16} />
              </div>
              <div className="text-2xl font-bold">{formatCurrency(stats.cost)}</div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Por Tipo */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Comunicações por Tipo</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Email</span>
                    <span className="text-sm font-medium">{stats.byType.email.sent}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(stats.byType.email.sent / stats.totalSent) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">SMS</span>
                    <span className="text-sm font-medium">{stats.byType.sms.sent}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(stats.byType.sms.sent / stats.totalSent) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Campanhas Recentes */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Campanhas Recentes</h3>
              <div className="space-y-3">
                {stats.byCampaign.slice(0, 5).map(campaign => (
                  <div key={campaign.campaignId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{campaign.campaignName}</div>
                      <div className="text-xs text-slate-600">{campaign.sent} enviados</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">{campaign.delivered}</div>
                      <div className="text-xs text-slate-600">entregues</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Comunicação e Notificações</h1>
            <p className="text-sm text-slate-600">Gerencie comunicação com os membros</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {[
          { id: 'campaigns', label: 'Campanhas', icon: Mail },
          { id: 'sms', label: 'SMS', icon: MessageSquare },
          { id: 'templates', label: 'Templates', icon: FileText },
          { id: 'groups', label: 'Grupos', icon: Users },
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
          {activeTab === 'campaigns' && renderCampaignsTab()}
          {activeTab === 'sms' && renderSMSTab()}
          {activeTab === 'templates' && (
            <div className="text-center py-12 text-slate-600">
              <FileText size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold mb-2">Templates em Desenvolvimento</h3>
              <p>Funcionalidade de templates será implementada em breve.</p>
            </div>
          )}
          {activeTab === 'groups' && (
            <div className="text-center py-12 text-slate-600">
              <Users size={48} className="mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold mb-2">Grupos em Desenvolvimento</h3>
              <p>Funcionalidade de grupos será implementada em breve.</p>
            </div>
          )}
          {activeTab === 'stats' && renderStatsTab()}
        </>
      )}
    </div>
  );
};
