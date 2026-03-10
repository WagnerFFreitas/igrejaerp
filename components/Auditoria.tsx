import React, { useState, useEffect } from 'react';
import { ShieldCheck, Filter, BarChart3, Clock, User, Terminal, AlertCircle, Plus, Edit2, Trash2, Eye, LogIn, LogOut, Menu, XCircle, CheckCircle, Activity, Users, Settings, CreditCard, FileText, UserCheck } from 'lucide-react';
import { AuditLog } from '../types';
import { AuditService } from '../src/services/auditService';

export const Auditoria: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [auditStats, setAuditStats] = useState({
    totalLogs: 0,
    cretes: 0,
    updates: 0,
    deletes: 0,
    logins: 0,
    recentActivities: [] as string[]
  });

  // Carregar usuário atual do localStorage
  useEffect(() => {
    try {
      const userString = localStorage.getItem('currentUser');
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUser(user);
        setIsDeveloper(user.role === 'DEVELOPER');
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  }, []);

  // Carregar logs de auditoria
  const loadLogs = async () => {
    if (!isDeveloper) return;
    
    try {
      setIsLoading(true);
      const logs = await AuditService.getLogs();
      setAuditLogs(logs);
      
      // Calcular estatísticas
      const stats = {
        totalLogs: logs.length,
        cretes: logs.filter(log => log.action === 'CREATE').length,
        updates: logs.filter(log => log.action === 'UPDATE').length,
        deletes: logs.filter(log => log.action === 'DELETE').length,
        logins: logs.filter(log => log.action === 'USER_LOGIN').length,
        recentActivities: logs.slice(0, 5).map(log => 
          `${log.userName} ${getActionDescription(log.action)} ${log.entity}`
        )
      };
      setAuditStats(stats);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDeveloper) {
      loadLogs();
    }
  }, [isDeveloper]);

  // Funções auxiliares
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <Plus size={14} className="text-green-600" />;
      case 'UPDATE': return <Edit2 size={14} className="text-blue-600" />;
      case 'DELETE': return <Trash2 size={14} className="text-red-600" />;
      case 'USER_LOGIN': return <LogIn size={14} className="text-indigo-600" />;
      case 'USER_LOGOUT': return <LogOut size={14} className="text-orange-600" />;
      case 'MENU_ACCESS': return <Menu size={14} className="text-purple-600" />;
      default: return <Eye size={14} className="text-slate-600" />;
    }
  };

  const getActionName = (action: string) => {
    switch (action) {
      case 'CREATE': return 'Criação';
      case 'UPDATE': return 'Atualização';
      case 'DELETE': return 'Exclusão';
      case 'USER_LOGIN': return 'Login';
      case 'USER_LOGOUT': return 'Logout';
      case 'MENU_ACCESS': return 'Acesso';
      default: return action;
    }
  };

  const getActionDescription = (action: string) => {
    switch (action) {
      case 'CREATE': return 'criou';
      case 'UPDATE': return 'atualizou';
      case 'DELETE': return 'excluiu';
      case 'USER_LOGIN': return 'fez login';
      case 'USER_LOGOUT': return 'fez logout';
      case 'MENU_ACCESS': return 'acessou';
      default: return 'realizou ação';
    }
  };

  const getStatusIcon = (success?: boolean) => {
    return success ? (
      <CheckCircle size={14} className="text-green-600" />
    ) : (
      <XCircle size={14} className="text-red-600" />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrar logs
  const filteredLogs = auditLogs.filter(log => {
    if (filterAction && log.action !== filterAction) return false;
    if (filterEntity && !log.entity.toLowerCase().includes(filterEntity.toLowerCase())) return false;
    
    if (filterPeriod) {
      const logDate = new Date(log.date);
      const now = new Date();
      const diffTime = now.getTime() - logDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (filterPeriod) {
        case 'today': return diffDays <= 1;
        case 'week': return diffDays <= 7;
        case 'month': return diffDays <= 30;
        default: return true;
      }
    }
    
    return true;
  });

  if (!isDeveloper) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck size={24} className="text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-800 mb-2">🚫 Acesso Restrito</h3>
                <p className="text-red-700 mb-3">
                  Esta área é restrita ao desenvolvedor do sistema. Apenas o usuário com privilégios de desenvolvedor pode acessar os logs de auditoria.
                </p>
                <div className="bg-red-100 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-600 font-medium">
                    <strong>Usuário atual:</strong> {currentUser?.name} ({currentUser?.role})
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    <strong>Permissão necessária:</strong> DEVELOPER
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic font-serif">Auditoria & Segurança</h1>
            <p className="text-slate-500 font-medium text-sm">
              Sistema de auditoria imutável e seguro.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 flex items-center gap-2">
              <ShieldCheck size={20}/>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Conformidade LGPD v2.1</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Activity size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Total de Logs</p>
                  <p className="text-2xl font-black text-slate-900">{auditStats.totalLogs}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Hoje</p>
                  <p className="text-2xl font-black text-slate-900">{auditStats.recentActivities.filter(a => a.includes('fez login')).length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <XCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">Falhas</p>
                  <p className="text-2xl font-black text-slate-900">{auditStats.recentActivities.filter(a => a.includes('erro')).length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Terminal size={20} className="text-white" />
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="opacity-90">Total de Logs:</span>
                    <span className="font-black">{auditStats.totalLogs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Criações:</span>
                    <span className="font-black">{auditStats.cretes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Atualizações:</span>
                    <span className="font-black">{auditStats.updates}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Exclusões:</span>
                    <span className="font-black">{auditStats.deletes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Logins:</span>
                    <span className="font-black">{auditStats.logins}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e Lista */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Filter size={16} />
                Filtros
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Ação</label>
                  <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="">Todas as ações</option>
                    <option value="CREATE">Criação</option>
                    <option value="UPDATE">Atualização</option>
                    <option value="DELETE">Exclusão</option>
                    <option value="USER_LOGIN">Login</option>
                    <option value="USER_LOGOUT">Logout</option>
                    <option value="MENU_ACCESS">Acesso ao Menu</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Entidade</label>
                  <select
                    value={filterEntity}
                    onChange={(e) => setFilterEntity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="">Todas as entidades</option>
                    <option value="User">Usuários</option>
                    <option value="Member">Membros</option>
                    <option value="Employee">Funcionários</option>
                    <option value="Transaction">Transações</option>
                    <option value="Menu">Menus</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block mb-1">Período</label>
                  <select
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="">Todos os períodos</option>
                    <option value="today">Hoje</option>
                    <option value="week">Últimos 7 dias</option>
                    <option value="month">Últimos 30 dias</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lista de logs */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Logs de Auditoria (Imutáveis)</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {filteredLogs.length} registros
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  ⚠️ Logs são permanentes e não podem ser excluídos pelo sistema. Apenas o desenvolvedor pode remover diretamente do banco.
                </p>
              </div>
              
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-500 text-sm">Carregando logs...</p>
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className="p-8 text-center">
                    <UserCheck size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm">Nenhum log encontrado</p>
                    <p className="text-slate-400 text-xs mt-1">Os logs aparecerão aqui conforme as ações forem realizadas</p>
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          {getActionIcon(log.action)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900 text-sm">{log.userName}</span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">{getActionName(log.action)}</span>
                            {getStatusIcon(log.success)}
                            {log.hash && (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                🔒 Imutável
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mb-2">
                            {log.entity}: {log.entityName}
                          </p>
                          
                          {/* Mensagem customizada ou detalhes resumidos */}
                          {log.details?.action ? (
                            <p className="text-xs text-indigo-600 mb-2 font-medium">
                              {log.details.action}
                            </p>
                          ) : log.details?.changedFields && log.details.changedFields.length > 0 ? (
                            <p className="text-xs text-indigo-600 mb-2 font-medium">
                              Alterou: {log.details.changedFields.join(', ')}
                            </p>
                          ) : null}
                          
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatDate(log.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <User size={12} />
                              {log.unitId}
                            </span>
                            <span className="flex items-center gap-1">
                              <ShieldCheck size={12} />
                              {log.ip}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-800 mb-1">🔒 Informações de Auditoria</p>
                <p className="text-xs text-amber-700">
                  Todos os logs são armazenados com hash de verificação e mantidos por 30 dias. 
                  Os logs são imutáveis e não podem ser excluídos pelo sistema. 
                  Apenas o desenvolvedor pode remover logs diretamente do banco de dados (IndexedDB).
                  O sistema registra automaticamente login, logout, criação, atualização e exclusão de registros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auditoria;
