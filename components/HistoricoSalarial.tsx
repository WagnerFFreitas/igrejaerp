import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, Calendar, User, Building, FileText, 
  Plus, Edit2, Trash2, Download, Search, Filter, CheckCircle, 
  XCircle, Clock, AlertCircle, BarChart3, PieChart, Eye
} from 'lucide-react';
import { SalaryHistory, SalaryAdjustmentRequest, Payroll, UserAuth } from '../types';
import SalaryHistoryService from '../services/salaryHistoryService';

interface HistoricoSalarialProps {
  employees: Payroll[];
  currentUnitId: string;
  user?: UserAuth;
  selectedEmployee?: Payroll;
}

export default function HistoricoSalarial({
  employees,
  currentUnitId,
  user,
  selectedEmployee
}: HistoricoSalarialProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'requests' | 'reports' | 'policies'>('history');
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([]);
  const [adjustmentRequests, setAdjustmentRequests] = useState<SalaryAdjustmentRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHistory, setEditingHistory] = useState<SalaryHistory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Dados mockados para demonstração
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simular carregamento de dados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockHistory: SalaryHistory[] = [
          {
            id: 'hist-001',
            employeeId: 'emp-001',
            employeeName: 'Ana Silva',
            employeeCargo: 'Gerente de Projetos',
            employeeDepartamento: 'TI',
            salarioAnterior: 8000,
            salarioNovo: 8800,
            percentualAumento: 10,
            diferencaValor: 800,
            moeda: 'BRL',
            tipoAlteracao: 'AUMENTO',
            motivoAlteracao: 'Excelente desempenho e conclusão de projetos críticos',
            dataAlteracao: '2024-03-15',
            dataVigencia: '2024-04-01',
            status: 'EFFECTIVE',
            solicitanteId: 'manager-001',
            solicitanteName: 'João Gestor',
            aprovadorId: 'hr-001',
            aprovadorName: 'RH Diretor',
            dataAprovacao: '2024-03-20',
            justificativaAprovacao: 'Aumento aprovado baseado em metas alcançadas',
            complianceChecklist: {
              aprovacaoDiretoria: true,
              verificacaoOrcamento: true,
              analiseComparativo: true,
              documentoAssinado: true
            },
            vinculadoDesempenho: true,
            avaliacaoId: 'eval-001',
            observacoes: 'Aumento vinculado à avaliação Q1/2024',
            anexos: [],
            unitId: currentUnitId,
            createdAt: '2024-03-15T10:00:00Z',
            updatedAt: '2024-03-20T14:30:00Z'
          },
          {
            id: 'hist-002',
            employeeId: 'emp-002',
            employeeName: 'Carlos Santos',
            employeeCargo: 'Desenvolvedor Senior',
            employeeDepartamento: 'TI',
            salarioAnterior: 6500,
            salarioNovo: 7150,
            percentualAumento: 10,
            diferencaValor: 650,
            moeda: 'BRL',
            tipoAlteracao: 'PROMOCAO',
            motivoAlteracao: 'Promoção para Senior após 2 anos de experiência',
            dataAlteracao: '2024-02-10',
            dataVigencia: '2024-02-15',
            status: 'EFFECTIVE',
            solicitanteId: 'manager-001',
            solicitanteName: 'João Gestor',
            aprovadorId: 'hr-001',
            aprovadorName: 'RH Diretor',
            dataAprovacao: '2024-02-12',
            justificativaAprovacao: 'Promoção justificada por crescimento e habilidades',
            complianceChecklist: {
              aprovacaoDiretoria: true,
              verificacaoOrcamento: true,
              analiseComparativo: true,
              documentoAssinado: true
            },
            vinculadoDesempenho: true,
            avaliacaoId: 'eval-002',
            observacoes: 'Promoção com base em avaliação de desempenho',
            anexos: [],
            unitId: currentUnitId,
            createdAt: '2024-02-10T09:00:00Z',
            updatedAt: '2024-02-12T16:00:00Z'
          },
          {
            id: 'hist-003',
            employeeId: 'emp-003',
            employeeName: 'Maria Oliveira',
            employeeCargo: 'Analista de RH',
            employeeDepartamento: 'RH',
            salarioAnterior: 4500,
            salarioNovo: 4770,
            percentualAumento: 6,
            diferencaValor: 270,
            moeda: 'BRL',
            tipoAlteracao: 'REAJUSTE_ANUAL',
            motivoAlteracao: 'Reajuste anual conforme política da empresa',
            dataAlteracao: '2024-01-05',
            dataVigencia: '2024-01-01',
            status: 'EFFECTIVE',
            solicitanteId: 'hr-001',
            solicitanteName: 'RH Diretor',
            aprovadorId: 'director-001',
            aprovadorName: 'Diretor Geral',
            dataAprovacao: '2024-01-06',
            justificativaAprovacao: 'Reajuste anual padrão aplicado',
            complianceChecklist: {
              aprovacaoDiretoria: true,
              verificacaoOrcamento: true,
              analiseComparativo: true,
              documentoAssinado: true
            },
            vinculadoDesempenho: false,
            observacoes: 'Reajuste anual aplicado a toda equipe',
            anexos: [],
            unitId: currentUnitId,
            createdAt: '2024-01-05T11:00:00Z',
            updatedAt: '2024-01-06T10:30:00Z'
          }
        ];

        const mockRequests: SalaryAdjustmentRequest[] = [
          {
            id: 'req-001',
            employeeId: 'emp-004',
            employeeName: 'João Pereira',
            salarioAtual: 5500,
            salarioProposto: 6050,
            percentualProposto: 10,
            justificativa: 'Ótimo desempenho em vendas Q1, superou metas em 25%',
            tipoAlteracao: 'AUMENTO',
            dataSolicitacao: '2024-03-25',
            dataVigenciaDesejada: '2024-04-01',
            analiseComparativo: {
              mediaCargo: 5800,
              mediaDepartamento: 5600,
              faixaSalarial: { min: 5000, max: 6500 },
              posicaoFaixa: 'ABAIXO'
            },
            status: 'UNDER_REVIEW',
            workflow: [
              {
                id: 'step-001',
                stepName: 'Aprovação Gerente',
                stepType: 'APPROVAL',
                responsibleId: 'manager-001',
                responsibleName: 'João Gestor',
                responsibleRole: 'Gerente Comercial',
                status: 'COMPLETED',
                completedAt: '2024-03-26T10:00:00Z',
                completedBy: 'manager-001',
                comments: 'Aprovo aumento baseado em metas alcançadas',
                order: 1,
                required: true,
                autoApprove: false,
                createdAt: '2024-03-25T09:00:00Z',
                updatedAt: '2024-03-26T10:00:00Z'
              },
              {
                id: 'step-002',
                stepName: 'Aprovação RH',
                stepType: 'APPROVAL',
                responsibleId: 'hr-001',
                responsibleName: 'RH Diretor',
                responsibleRole: 'Diretor de RH',
                status: 'PENDING',
                order: 2,
                required: true,
                autoApprove: false,
                createdAt: '2024-03-25T09:00:00Z',
                updatedAt: '2024-03-25T09:00:00Z'
              }
            ],
            documentos: {
              avaliacaoDesempenho: 'doc-001',
              comprovanteMetas: 'doc-002'
            },
            unitId: currentUnitId,
            createdAt: '2024-03-25T09:00:00Z',
            updatedAt: '2024-03-26T10:00:00Z'
          }
        ];

        setSalaryHistory(mockHistory);
        setAdjustmentRequests(mockRequests);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUnitId]);

  const filteredHistory = salaryHistory.filter(history => {
    const matchesSearch = history.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         history.employeeCargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         history.employeeDepartamento.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || history.status === filterStatus;
    const matchesType = filterType === 'all' || history.tipoAlteracao === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EFFECTIVE': return 'text-emerald-600 bg-emerald-50';
      case 'APPROVED': return 'text-blue-600 bg-blue-50';
      case 'PENDING': return 'text-amber-600 bg-amber-50';
      case 'REJECTED': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'EFFECTIVE': return 'Efetivado';
      case 'APPROVED': return 'Aprovado';
      case 'PENDING': return 'Pendente';
      case 'REJECTED': return 'Rejeitado';
      default: return status;
    }
  };

  const getAlteracaoColor = (tipo: string) => {
    switch (tipo) {
      case 'PROMOCAO': return 'text-purple-600 bg-purple-50';
      case 'AUMENTO': return 'text-emerald-600 bg-emerald-50';
      case 'REAJUSTE_ANUAL': return 'text-blue-600 bg-blue-50';
      case 'CORRECAO': return 'text-amber-600 bg-amber-50';
      case 'BONUS': return 'text-pink-600 bg-pink-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(filteredHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `historico-salarial-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600">Carregando histórico salarial...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Histórico Salarial</h1>
            <p className="text-sm text-slate-600">Gestão de alterações salariais e aprovações</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportHistory}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors"
          >
            <Download size={16} />
            Exportar
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} />
            Nova Alteração
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {[
          { id: 'history', label: 'Histórico', icon: Calendar },
          { id: 'requests', label: 'Solicitações', icon: FileText },
          { id: 'reports', label: 'Relatórios', icon: BarChart3 },
          { id: 'policies', label: 'Políticas', icon: Filter }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar histórico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">Todos os status</option>
          <option value="EFFECTIVE">Efetivado</option>
          <option value="APPROVED">Aprovado</option>
          <option value="PENDING">Pendente</option>
          <option value="REJECTED">Rejeitado</option>
        </select>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">Todos os tipos</option>
          <option value="AUMENTO">Aumento</option>
          <option value="PROMOCAO">Promoção</option>
          <option value="REAJUSTE_ANUAL">Reajuste Anual</option>
          <option value="CORRECAO">Correção</option>
          <option value="BONUS">Bônus</option>
        </select>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold mb-2">Nenhum histórico encontrado</h3>
              <p className="text-sm">Clique em "Nova Alteração" para começar.</p>
            </div>
          ) : (
            filteredHistory.map(history => (
              <div key={history.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{history.employeeName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(history.status)}`}>
                        {getStatusLabel(history.status)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlteracaoColor(history.tipoAlteracao)}`}>
                        {history.tipoAlteracao === 'PROMOCAO' && 'Promoção'}
                        {history.tipoAlteracao === 'AUMENTO' && 'Aumento'}
                        {history.tipoAlteracao === 'REAJUSTE_ANUAL' && 'Reajuste Anual'}
                        {history.tipoAlteracao === 'CORRECAO' && 'Correção'}
                        {history.tipoAlteracao === 'BONUS' && 'Bônus'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{history.employeeCargo}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building size={14} />
                        <span>{history.employeeDepartamento}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(history.dataAlteracao).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    {/* Valores */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Salário Anterior</p>
                        <p className="text-lg font-bold text-slate-900">{formatCurrency(history.salarioAnterior)}</p>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-xs text-emerald-600 mb-1">Salário Novo</p>
                        <p className="text-lg font-bold text-emerald-600">{formatCurrency(history.salarioNovo)}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 mb-1">Aumento</p>
                        <p className="text-lg font-bold text-blue-600">+{history.percentualAumento}%</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-600 mb-1">Diferença</p>
                        <p className="text-lg font-bold text-purple-600">{formatCurrency(history.diferencaValor)}</p>
                      </div>
                    </div>
                    
                    {/* Motivo */}
                    <div className="bg-slate-50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-medium text-slate-700 mb-1">Motivo da Alteração</p>
                      <p className="text-sm text-slate-600">{history.motivoAlteracao}</p>
                    </div>
                    
                    {/* Informações de Aprovação */}
                    {history.status === 'EFFECTIVE' && (
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <CheckCircle size={12} />
                          <span>Aprovado por: {history.aprovadorName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>Vigência: {new Date(history.dataVigencia).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          {adjustmentRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma solicitação encontrada</h3>
              <p className="text-sm">Nenhuma solicitação de ajuste salarial no momento.</p>
            </div>
          ) : (
            adjustmentRequests.map(request => (
              <div key={request.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{request.employeeName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'UNDER_REVIEW' ? 'text-amber-600 bg-amber-50' :
                        request.status === 'APPROVED' ? 'text-emerald-600 bg-emerald-50' :
                        request.status === 'REJECTED' ? 'text-red-600 bg-red-50' :
                        'text-slate-600 bg-slate-50'
                      }`}>
                        {request.status === 'UNDER_REVIEW' && 'Em Análise'}
                        {request.status === 'APPROVED' && 'Aprovado'}
                        {request.status === 'REJECTED' && 'Rejeitado'}
                        {request.status === 'SUBMITTED' && 'Enviado'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <p className="text-xs text-slate-500 mb-1">Salário Atual</p>
                        <p className="text-lg font-bold text-slate-900">{formatCurrency(request.salarioAtual)}</p>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-lg">
                        <p className="text-xs text-emerald-600 mb-1">Salário Proposto</p>
                        <p className="text-lg font-bold text-emerald-600">{formatCurrency(request.salarioProposto)}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 mb-1">Aumento Solicitado</p>
                        <p className="text-lg font-bold text-blue-600">+{request.percentualProposto}%</p>
                      </div>
                    </div>
                    
                    {/* Análise Comparativo */}
                    <div className="bg-slate-50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-medium text-slate-700 mb-2">Análise Comparativo</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Média Cargo:</span>
                          <span className="ml-2 font-medium">{formatCurrency(request.analiseComparativo.mediaCargo)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Média Departamento:</span>
                          <span className="ml-2 font-medium">{formatCurrency(request.analiseComparativo.mediaDepartamento)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Posição Faixa:</span>
                          <span className={`ml-2 font-medium ${
                            request.analiseComparativo.posicaoFaixa === 'ACIMA' ? 'text-emerald-600' :
                            request.analiseComparativo.posicaoFaixa === 'DENTRO' ? 'text-blue-600' :
                            'text-orange-600'
                          }`}>
                            {request.analiseComparativo.posicaoFaixa === 'ACIMA' && 'Acima'}
                            {request.analiseComparativo.posicaoFaixa === 'DENTRO' && 'Dentro'}
                            {request.analiseComparativo.posicaoFaixa === 'ABAIXO' && 'Abaixo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Workflow */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700">Workflow de Aprovação</p>
                      {request.workflow.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-3 text-sm">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
                            step.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                            step.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {step.status === 'COMPLETED' && <CheckCircle size={16} />}
                            {step.status === 'PENDING' && <Clock size={16} />}
                            {step.status === 'REJECTED' && <XCircle size={16} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{step.stepName}</span>
                              <span className="text-slate-500">{step.responsibleName}</span>
                            </div>
                            {step.comments && (
                              <p className="text-slate-600 text-xs mt-1">{step.comments}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <CheckCircle size={16} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <XCircle size={16} />
                    </button>
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="text-center py-12 text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold mb-2">Relatórios em Desenvolvimento</h3>
          <p className="text-sm">Relatórios analíticos de evolução salarial serão implementados em breve.</p>
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="text-center py-12 text-slate-500">
          <Filter className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold mb-2">Políticas Salariais</h3>
          <p className="text-sm">Configuração de políticas e faixas salariais serão implementadas em breve.</p>
        </div>
      )}
    </div>
  );
}
