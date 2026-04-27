/**
 * ============================================================================
 * AVALIACAODESEMPENHO.TSX
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Componente visual do frontend para avaliacao desempenho.
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
  Star, TrendingUp, Target, Award, Calendar, User, CheckCircle, 
  AlertCircle, Plus, Edit2, Trash2, Download, Filter, Search,
  BarChart3, Users, Clock, Flag, BookOpen, Lightbulb, MessageSquare
} from 'lucide-react';
import { 
  PerformanceEvaluation, CompetencyEvaluation, GoalEvaluation, 
  PDIPlan, EvaluationCycle, DevelopmentPlan, Payroll, UserAuth 
} from '../types';

interface AvaliacaoDesempenhoProps {
  employees: Payroll[];
  currentUnitId: string;
  user?: UserAuth;
}

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (avaliacao desempenho).
 */

export default function AvaliacaoDesempenho({ 
  employees, 
  currentUnitId, 
  user 
}: AvaliacaoDesempenhoProps) {
  const [activeTab, setActiveTab] = useState<'evaluations' | 'cycles' | 'templates' | 'reports'>('evaluations');
  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>([]);
  const [cycles, setCycles] = useState<EvaluationCycle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<PerformanceEvaluation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    setEvaluations([]);
    setCycles([]);
  }, [currentUnitId, user]);

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesSearch = evaluation.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         evaluation.evaluatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || evaluation.status === filterStatus;
    const matchesType = filterType === 'all' || evaluation.evaluationType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'EXCELLENT': return 'text-emerald-600 bg-emerald-50';
      case 'GOOD': return 'text-blue-600 bg-blue-50';
      case 'SATISFACTORY': return 'text-yellow-600 bg-yellow-50';
      case 'NEEDS_IMPROVEMENT': return 'text-orange-600 bg-orange-50';
      case 'UNSATISFACTORY': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-emerald-600 bg-emerald-50';
      case 'SUBMITTED': return 'text-blue-600 bg-blue-50';
      case 'DRAFT': return 'text-slate-600 bg-slate-50';
      case 'REJECTED': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      // Simular geração de relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        generatedAt: new Date().toISOString(),
        unitId: currentUnitId,
        totalEvaluations: evaluations.length,
        averageScore: evaluations.reduce((sum, evaluation) => sum + evaluation.overallScore, 0) / evaluations.length,
        evaluationsByRating: {
          EXCELLENT: evaluations.filter(e => e.overallRating === 'EXCELLENT').length,
          GOOD: evaluations.filter(e => e.overallRating === 'GOOD').length,
          SATISFACTORY: evaluations.filter(e => e.overallRating === 'SATISFACTORY').length,
          NEEDS_IMPROVEMENT: evaluations.filter(e => e.overallRating === 'NEEDS_IMPROVEMENT').length,
          UNSATISFACTORY: evaluations.filter(e => e.overallRating === 'UNSATISFACTORY').length,
        },
        evaluationsByType: {
          QUARTERLY: evaluations.filter(e => e.evaluationType === 'QUARTERLY').length,
          SEMESTRAL: evaluations.filter(e => e.evaluationType === 'SEMESTRAL').length,
          ANNUAL: evaluations.filter(e => e.evaluationType === 'ANNUAL').length,
          PROBATION: evaluations.filter(e => e.evaluationType === 'PROBATION').length,
          ADHOC: evaluations.filter(e => e.evaluationType === 'ADHOC').length,
        },
        evaluations: evaluations
      };

      // Download do relatório
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-avaliacao-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Avaliação de Desempenho</h1>
            <p className="text-sm text-slate-600">Gestão de avaliações, metas e desenvolvimento profissional</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={generateReport}
            disabled={isGeneratingReport}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {isGeneratingReport ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Download size={16} />
                Relatório
              </>
            )}
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Nova Avaliação
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {[
          { id: 'evaluations', label: 'Avaliações', icon: BarChart3 },
          { id: 'cycles', label: 'Ciclos', icon: Calendar },
          { id: 'templates', label: 'Templates', icon: BookOpen },
          { id: 'reports', label: 'Relatórios', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
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
            placeholder="Buscar avaliações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Todos os status</option>
          <option value="DRAFT">Rascunho</option>
          <option value="SUBMITTED">Enviado</option>
          <option value="APPROVED">Aprovado</option>
          <option value="REJECTED">Rejeitado</option>
        </select>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Todos os tipos</option>
          <option value="QUARTERLY">Trimestral</option>
          <option value="SEMESTRAL">Semestral</option>
          <option value="ANNUAL">Anual</option>
          <option value="PROBATION">Experiência</option>
          <option value="ADHOC">Ad hoc</option>
        </select>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'evaluations' && (
        <div className="space-y-4">
          {filteredEvaluations.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Award className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma avaliação encontrada</h3>
              <p className="text-sm">Clique em "Nova Avaliação" para começar.</p>
            </div>
          ) : (
            filteredEvaluations.map(evaluation => (
              <div key={evaluation.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{evaluation.employeeName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(evaluation.status)}`}>
                        {evaluation.status === 'DRAFT' && 'Rascunho'}
                        {evaluation.status === 'SUBMITTED' && 'Enviado'}
                        {evaluation.status === 'APPROVED' && 'Aprovado'}
                        {evaluation.status === 'REJECTED' && 'Rejeitado'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(evaluation.overallRating)}`}>
                        {evaluation.overallRating === 'EXCELLENT' && 'Excelente'}
                        {evaluation.overallRating === 'GOOD' && 'Bom'}
                        {evaluation.overallRating === 'SATISFACTORY' && 'Satisfatório'}
                        {evaluation.overallRating === 'NEEDS_IMPROVEMENT' && 'Precisa Melhorar'}
                        {evaluation.overallRating === 'UNSATISFACTORY' && 'Insatisfatório'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{evaluation.evaluationPeriod}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>Avaliador: {evaluation.evaluatorName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{new Date(evaluation.evaluationDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    
                    {/* Score */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">Score:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                              style={{ width: `${evaluation.overallScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-indigo-600">{evaluation.overallScore}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Pontos Fortes e Áreas de Melhoria */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-600 mb-2 flex items-center gap-1">
                          <CheckCircle size={14} />
                          Pontos Fortes
                        </h4>
                        <ul className="space-y-1">
                          {evaluation.strengths.slice(0, 3).map((strength, index) => (
                            <li key={index} className="text-sm text-slate-600 flex items-start gap-1">
                              <span className="text-emerald-500 mt-1">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-orange-600 mb-2 flex items-center gap-1">
                          <AlertCircle size={14} />
                          Áreas de Melhoria
                        </h4>
                        <ul className="space-y-1">
                          {evaluation.improvementAreas.slice(0, 3).map((area, index) => (
                            <li key={index} className="text-sm text-slate-600 flex items-start gap-1">
                              <span className="text-orange-500 mt-1">•</span>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* PDI */}
                    {evaluation.pdiPlan.length > 0 && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="text-sm font-semibold text-blue-600 mb-2 flex items-center gap-1">
                          <Target size={14} />
                          Plano de Desenvolvimento ({evaluation.pdiPlan.length} ações)
                        </h4>
                        <div className="space-y-2">
                          {evaluation.pdiPlan.slice(0, 2).map((plan, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-slate-700">{plan.action}</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                plan.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                plan.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {plan.status === 'COMPLETED' && 'Concluído'}
                                {plan.status === 'IN_PROGRESS' && 'Em andamento'}
                                {plan.status === 'PENDING' && 'Pendente'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingEvaluation(evaluation)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'cycles' && (
        <div className="space-y-4">
          {cycles.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold mb-2">Nenhum ciclo cadastrado</h3>
              <p className="text-sm">Configure ciclos de avaliação para automatizar o processo.</p>
            </div>
          ) : (
            cycles.map(cycle => (
              <div key={cycle.id} className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{cycle.name}</h3>
                    <p className="text-sm text-slate-600 mb-4">{cycle.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Período:</span>
                        <div className="font-medium">
                          {new Date(cycle.startDate).toLocaleDateString('pt-BR')} - {new Date(cycle.endDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Prazo Avaliação:</span>
                        <div className="font-medium">{new Date(cycle.evaluationDeadline).toLocaleDateString('pt-BR')}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Status:</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block mt-1 ${
                          cycle.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                          cycle.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {cycle.status === 'COMPLETED' && 'Concluído'}
                          {cycle.status === 'ACTIVE' && 'Ativo'}
                          {cycle.status === 'PLANNED' && 'Planejado'}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Progresso:</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${(cycle.completedEvaluations / cycle.totalEmployees) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {cycle.completedEvaluations}/{cycle.totalEmployees}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="text-center py-12 text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold mb-2">Templates em Desenvolvimento</h3>
          <p className="text-sm">Configuração de templates de competências e metas será implementada em breve.</p>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="text-center py-12 text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold mb-2">Relatórios Detalhados</h3>
          <p className="text-sm">Relatórios analíticos e dashboards serão implementados em breve.</p>
        </div>
      )}
    </div>
  );
}
