import React, { useState, useEffect } from 'react';
import { 
  Trophy, TrendingUp, Users, Star, Award, Target, AlertCircle, 
  ChevronRight, BarChart3, Filter, Search, Eye, Download
} from 'lucide-react';
import { Payroll, UserAuth } from '../types';

interface AvaliacaoDashboardWidgetProps {
  employees: Payroll[];
  currentUnitId: string;
  user?: UserAuth;
}

interface EmployeeRanking {
  id: string;
  name: string;
  cargo: string;
  departamento: string;
  score: number;
  rating: string;
  evaluationCount: number;
  lastEvaluation: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'active' | 'inactive';
}

export default function AvaliacaoDashboardWidget({
  employees,
  currentUnitId,
  user
}: AvaliacaoDashboardWidgetProps) {
  const [rankings, setRankings] = useState<EmployeeRanking[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'top10' | 'needsAttention'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Dados mockados para demonstração
  useEffect(() => {
    const loadRankings = async () => {
      setIsLoading(true);
      
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRankings: EmployeeRanking[] = [
        {
          id: 'emp-001',
          name: 'Ana Silva',
          cargo: 'Gerente de Projetos',
          departamento: 'TI',
          score: 95,
          rating: 'EXCELLENT',
          evaluationCount: 4,
          lastEvaluation: '2024-03-15',
          trend: 'up',
          trendValue: 5.2,
          status: 'active'
        },
        {
          id: 'emp-002',
          name: 'Carlos Santos',
          cargo: 'Desenvolvedor Senior',
          departamento: 'TI',
          score: 92,
          rating: 'EXCELLENT',
          evaluationCount: 3,
          lastEvaluation: '2024-03-20',
          trend: 'up',
          trendValue: 3.8,
          status: 'active'
        },
        {
          id: 'emp-003',
          name: 'Maria Oliveira',
          cargo: 'Analista de RH',
          departamento: 'RH',
          score: 88,
          rating: 'GOOD',
          evaluationCount: 5,
          lastEvaluation: '2024-03-10',
          trend: 'stable',
          trendValue: 0.0,
          status: 'active'
        },
        {
          id: 'emp-004',
          name: 'João Pereira',
          cargo: 'Coordenador de Vendas',
          departamento: 'Comercial',
          score: 85,
          rating: 'GOOD',
          evaluationCount: 4,
          lastEvaluation: '2024-03-18',
          trend: 'up',
          trendValue: 2.1,
          status: 'active'
        },
        {
          id: 'emp-005',
          name: 'Patricia Costa',
          cargo: 'Designer UX',
          departamento: 'Marketing',
          score: 82,
          rating: 'GOOD',
          evaluationCount: 2,
          lastEvaluation: '2024-03-22',
          trend: 'down',
          trendValue: -1.5,
          status: 'active'
        },
        {
          id: 'emp-006',
          name: 'Roberto Almeida',
          cargo: 'Analista Financeiro',
          departamento: 'Financeiro',
          score: 78,
          rating: 'GOOD',
          evaluationCount: 3,
          lastEvaluation: '2024-03-12',
          trend: 'stable',
          trendValue: 0.0,
          status: 'active'
        },
        {
          id: 'emp-007',
          name: 'Fernanda Lima',
          cargo: 'Assistente Administrativo',
          departamento: 'Administração',
          score: 72,
          rating: 'SATISFACTORY',
          evaluationCount: 2,
          lastEvaluation: '2024-03-25',
          trend: 'up',
          trendValue: 4.5,
          status: 'active'
        },
        {
          id: 'emp-008',
          name: 'Marcos Souza',
          cargo: 'Técnico de Suporte',
          departamento: 'TI',
          score: 68,
          rating: 'SATISFACTORY',
          evaluationCount: 1,
          lastEvaluation: '2024-03-08',
          trend: 'down',
          trendValue: -3.2,
          status: 'active'
        },
        {
          id: 'emp-009',
          name: 'Lucia Mendes',
          cargo: 'Auxiliar de Limpeza',
          departamento: 'Operações',
          score: 65,
          rating: 'SATISFACTORY',
          evaluationCount: 2,
          lastEvaluation: '2024-03-14',
          trend: 'stable',
          trendValue: 0.0,
          status: 'active'
        },
        {
          id: 'emp-010',
          name: 'Pedro Henrique',
          cargo: 'Estagiário de Marketing',
          departamento: 'Marketing',
          score: 58,
          rating: 'NEEDS_IMPROVEMENT',
          evaluationCount: 1,
          lastEvaluation: '2024-03-20',
          trend: 'down',
          trendValue: -2.8,
          status: 'active'
        }
      ];
      
      setRankings(mockRankings);
      setIsLoading(false);
    };

    loadRankings();
  }, [currentUnitId]);

  const filteredRankings = rankings.filter(ranking => {
    const matchesSearch = ranking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ranking.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ranking.departamento.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'top10') {
      return matchesSearch && ranking.score >= 85;
    }
    if (filterType === 'needsAttention') {
      return matchesSearch && ranking.score < 70;
    }
    
    return matchesSearch;
  });

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'EXCELLENT': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'GOOD': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'SATISFACTORY': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'NEEDS_IMPROVEMENT': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'UNSATISFACTORY': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getRatingLabel = (rating: string) => {
    switch (rating) {
      case 'EXCELLENT': return 'Excelente';
      case 'GOOD': return 'Bom';
      case 'SATISFACTORY': return 'Satisfatório';
      case 'NEEDS_IMPROVEMENT': return 'Precisa Melhorar';
      case 'UNSATISFACTORY': return 'Insatisfatório';
      default: return 'Sem Classificação';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp size={12} className="text-emerald-600" />;
      case 'down': return <TrendingUp size={12} className="text-red-600 rotate-180" />;
      case 'stable': return <div className="w-3 h-0.5 bg-slate-400 rounded-full" />;
    }
  };

  const getRankingIcon = (position: number) => {
    if (position === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (position === 2) return <Trophy className="w-5 h-5 text-slate-400" />;
    if (position === 3) return <Trophy className="w-5 h-5 text-orange-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-slate-600">{position}</span>;
  };

  const exportRanking = () => {
    const dataStr = JSON.stringify(filteredRankings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ranking-avaliacoes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: rankings.length,
    excellent: rankings.filter(r => r.rating === 'EXCELLENT').length,
    good: rankings.filter(r => r.rating === 'GOOD').length,
    needsAttention: rankings.filter(r => r.score < 70).length,
    averageScore: rankings.length > 0 ? Math.round(rankings.reduce((sum, r) => sum + r.score, 0) / rankings.length) : 0
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-slate-600">Carregando ranking...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Ranking de Avaliações</h2>
            <p className="text-sm text-slate-600">Desempenho geral dos funcionários</p>
          </div>
        </div>
        
        <button
          onClick={exportRanking}
          className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Download size={16} />
          Exportar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-4 h-4 text-slate-600" />
            <span className="text-xs text-slate-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-emerald-500">Excelente</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats.excellent}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-500">Bom</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.good}</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-orange-500">Atenção</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.needsAttention}</p>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span className="text-xs text-indigo-500">Média</span>
          </div>
          <p className="text-2xl font-bold text-indigo-600">{stats.averageScore}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar funcionário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('top10')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'top10' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Top 10%
          </button>
          <button
            onClick={() => setFilterType('needsAttention')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'needsAttention' 
                ? 'bg-orange-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Atenção
          </button>
        </div>
      </div>

      {/* Ranking List */}
      <div className="space-y-3">
        {filteredRankings.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-sm">Nenhum funcionário encontrado com os filtros atuais.</p>
          </div>
        ) : (
          filteredRankings.map((ranking, index) => (
            <div 
              key={ranking.id} 
              className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {/* Position */}
              <div className="flex items-center justify-center w-8">
                {getRankingIcon(index + 1)}
              </div>

              {/* Employee Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-semibold text-slate-900">{ranking.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRatingColor(ranking.rating)}`}>
                    {getRatingLabel(ranking.rating)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>{ranking.cargo}</span>
                  <span>•</span>
                  <span>{ranking.departamento}</span>
                  <span>•</span>
                  <span>{ranking.evaluationCount} avaliações</span>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-indigo-600">{ranking.score}</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(ranking.trend)}
                    <span className={`text-xs font-medium ${
                      ranking.trend === 'up' ? 'text-emerald-600' : 
                      ranking.trend === 'down' ? 'text-red-600' : 'text-slate-600'
                    }`}>
                      {ranking.trendValue > 0 ? '+' : ''}{ranking.trendValue}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  Última: {new Date(ranking.lastEvaluation).toLocaleDateString('pt-BR')}
                </div>
              </div>

              {/* Action */}
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                <Eye size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Mostrando {filteredRankings.length} de {rankings.length} funcionários
          </p>
          <button className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Ver detalhes completos
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
