import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Save, Award, Target, TrendingUp, Calendar, User, 
  Star, CheckCircle, AlertCircle, Lightbulb
} from 'lucide-react';

interface AvaliacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avaliacao: any) => void;
  employeeId?: string;
  employeeName?: string;
  editingAvaliacao?: any;
}

export default function AvaliacaoModal({
  isOpen,
  onClose,
  onSave,
  employeeId,
  employeeName,
  editingAvaliacao
}: AvaliacaoModalProps) {
  const [formData, setFormData] = useState({
    evaluationPeriod: '',
    evaluationDate: new Date().toISOString().split('T')[0],
    evaluationType: 'QUARTERLY' as const,
    overallScore: 0,
    overallRating: 'GOOD' as const,
    status: 'DRAFT' as const,
    evaluatorName: '',
    comments: '',
    strengths: [] as string[],
    improvementAreas: [] as string[],
    competencies: [] as any[],
    goals: [] as any[],
    pdiPlan: [] as any[]
  });

  const [newStrength, setNewStrength] = useState('');
  const [newImprovement, setNewImprovement] = useState('');
  const [newCompetency, setNewCompetency] = useState({ name: '', score: 0 as number, category: 'TECHNICAL' });
  const [newGoal, setNewGoal] = useState({ title: '', targetValue: '', category: 'PRODUCTIVITY' });
  const [newPDI, setNewPDI] = useState({ action: '', priority: 'MEDIUM' as const, deadline: '' });

  useEffect(() => {
    if (editingAvaliacao) {
      setFormData({
        evaluationPeriod: editingAvaliacao.evaluationPeriod || '',
        evaluationDate: editingAvaliacao.evaluationDate || new Date().toISOString().split('T')[0],
        evaluationType: editingAvaliacao.evaluationType || 'QUARTERLY',
        overallScore: editingAvaliacao.overallScore || 0,
        overallRating: editingAvaliacao.overallRating || 'GOOD',
        status: editingAvaliacao.status || 'DRAFT',
        evaluatorName: editingAvaliacao.evaluatorName || '',
        comments: editingAvaliacao.comments || '',
        strengths: editingAvaliacao.strengths || [],
        improvementAreas: editingAvaliacao.improvementAreas || [],
        competencies: editingAvaliacao.competencies || [],
        goals: editingAvaliacao.goals || [],
        pdiPlan: editingAvaliacao.pdiPlan || []
      });
    }
  }, [editingAvaliacao]);

  const addStrength = () => {
    if (newStrength.trim()) {
      setFormData(prev => ({
        ...prev,
        strengths: [...prev.strengths, newStrength.trim()]
      }));
      setNewStrength('');
    }
  };

  const removeStrength = (index: number) => {
    setFormData(prev => ({
      ...prev,
      strengths: prev.strengths.filter((_, i) => i !== index)
    }));
  };

  const addImprovement = () => {
    if (newImprovement.trim()) {
      setFormData(prev => ({
        ...prev,
        improvementAreas: [...prev.improvementAreas, newImprovement.trim()]
      }));
      setNewImprovement('');
    }
  };

  const removeImprovement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      improvementAreas: prev.improvementAreas.filter((_, i) => i !== index)
    }));
  };

  const addCompetency = () => {
    const scoreValue = Number(newCompetency.score);
    if (newCompetency.name.trim() && scoreValue > 0) {
      setFormData(prev => ({
        ...prev,
        competencies: [...prev.competencies, {
          id: Math.random().toString(36).substr(2, 9),
          name: newCompetency.name,
          score: scoreValue,
          category: newCompetency.category,
          level: scoreValue >= 90 ? 'EXPERT' : scoreValue >= 70 ? 'ADVANCED' : scoreValue >= 50 ? 'INTERMEDIATE' : 'BEGINNER',
          weight: 0.25,
          description: '',
          evidence: [],
          comments: ''
        }]
      }));
      setNewCompetency({ name: '', score: 0 as number, category: 'TECHNICAL' });
      calculateOverallScore();
    }
  };

  const removeCompetency = (index: number) => {
    setFormData(prev => ({
      ...prev,
      competencies: prev.competencies.filter((_, i) => i !== index)
    }));
    calculateOverallScore();
  };

  const addGoal = () => {
    if (newGoal.title.trim()) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, {
          id: Math.random().toString(36).substr(2, 9),
          title: newGoal.title,
          targetValue: newGoal.targetValue,
          actualValue: '',
          category: newGoal.category,
          achievementPercentage: 0,
          status: 'NOT_STARTED',
          dueDate: '',
          comments: ''
        }]
      }));
      setNewGoal({ title: '', targetValue: '', category: 'PRODUCTIVITY' });
    }
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const addPDI = () => {
    if (newPDI.action.trim() && newPDI.deadline) {
      setFormData(prev => ({
        ...prev,
        pdiPlan: [...prev.pdiPlan, {
          id: Math.random().toString(36).substr(2, 9),
          area: 'Desenvolvimento',
          action: newPDI.action,
          responsible: 'EMPLOYEE',
          priority: newPDI.priority,
          deadline: newPDI.deadline,
          status: 'PENDING',
          resources: [],
          progress: 0,
          notes: ''
        }]
      }));
      setNewPDI({ action: '', priority: 'MEDIUM', deadline: '' });
    }
  };

  const removePDI = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pdiPlan: prev.pdiPlan.filter((_, i) => i !== index)
    }));
  };

  const calculateOverallScore = () => {
    const competencies = formData.competencies;
    if (competencies.length === 0) {
      setFormData(prev => ({ ...prev, overallScore: 0 }));
      return;
    }

    const totalScore = competencies.reduce((sum, comp) => sum + comp.score, 0);
    const averageScore = totalScore / competencies.length;
    setFormData(prev => ({
      ...prev,
      overallScore: Math.round(averageScore)
    }));
  };

  useEffect(() => {
    calculateOverallScore();
  }, [formData.competencies]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const avaliacaoData = {
      id: editingAvaliacao?.id || Math.random().toString(36).substr(2, 9),
      employeeId: employeeId || '',
      employeeName: employeeName || '',
      evaluatorId: 'current-user',
      evaluatorName: formData.evaluatorName,
      evaluationPeriod: formData.evaluationPeriod,
      evaluationDate: formData.evaluationDate,
      evaluationType: formData.evaluationType,
      status: formData.status,
      overallScore: formData.overallScore,
      overallRating: formData.overallScore >= 90 ? 'EXCELLENT' : 
                    formData.overallScore >= 80 ? 'GOOD' : 
                    formData.overallScore >= 70 ? 'SATISFACTORY' : 
                    formData.overallScore >= 60 ? 'NEEDS_IMPROVEMENT' : 'UNSATISFACTORY',
      strengths: formData.strengths,
      improvementAreas: formData.improvementAreas,
      comments: formData.comments,
      competencies: formData.competencies,
      goals: formData.goals,
      pdiPlan: formData.pdiPlan,
      unitId: 'current-unit',
      createdAt: editingAvaliacao?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(avaliacaoData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingAvaliacao ? 'Editar Avaliação' : 'Nova Avaliação'}
              </h2>
              <p className="text-sm text-slate-600">{employeeName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informações Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Período de Avaliação</label>
              <input
                type="text"
                value={formData.evaluationPeriod}
                onChange={(e) => setFormData(prev => ({ ...prev, evaluationPeriod: e.target.value }))}
                placeholder="Ex: 2024-Q1"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data da Avaliação</label>
              <input
                type="date"
                value={formData.evaluationDate}
                onChange={(e) => setFormData(prev => ({ ...prev, evaluationDate: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Avaliação</label>
              <select
                value={formData.evaluationType}
                onChange={(e) => setFormData(prev => ({ ...prev, evaluationType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="QUARTERLY">Trimestral</option>
                <option value="SEMESTRAL">Semestral</option>
                <option value="ANNUAL">Anual</option>
                <option value="PROBATION">Experiência</option>
                <option value="ADHOC">Ad hoc</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Avaliador</label>
              <input
                type="text"
                value={formData.evaluatorName}
                onChange={(e) => setFormData(prev => ({ ...prev, evaluatorName: e.target.value }))}
                placeholder="Nome do avaliador"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Score Geral */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Score Geral</label>
              <span className="text-2xl font-bold text-indigo-600">{formData.overallScore}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all"
                style={{ width: `${formData.overallScore}%` }}
              />
            </div>
          </div>

          {/* Pontos Fortes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" />
              Pontos Fortes
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStrength}
                  onChange={(e) => setNewStrength(e.target.value)}
                  placeholder="Adicionar ponto forte..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStrength())}
                />
                <button
                  type="button"
                  onClick={addStrength}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-1">
                {formData.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center justify-between bg-emerald-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-slate-700">{strength}</span>
                    <button
                      type="button"
                      onClick={() => removeStrength(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Áreas de Melhoria */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <AlertCircle size={16} className="text-orange-600" />
              Áreas de Melhoria
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImprovement}
                  onChange={(e) => setNewImprovement(e.target.value)}
                  placeholder="Adicionar área de melhoria..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImprovement())}
                />
                <button
                  type="button"
                  onClick={addImprovement}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-1">
                {formData.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between bg-orange-50 px-3 py-2 rounded-lg">
                    <span className="text-sm text-slate-700">{area}</span>
                    <button
                      type="button"
                      onClick={() => removeImprovement(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competências */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Star size={16} className="text-blue-600" />
              Competências Avaliadas
            </label>
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={newCompetency.name}
                  onChange={(e) => setNewCompetency(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome da competência"
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="number"
                  value={newCompetency.score || ''}
                  onChange={(e) => setNewCompetency(prev => ({ ...prev, score: parseInt(e.target.value) || 0 }))}
                  placeholder="Score (0-100)"
                  min="0"
                  max="100"
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select
                  value={newCompetency.category}
                  onChange={(e) => setNewCompetency(prev => ({ ...prev, category: e.target.value }))}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="TECHNICAL">Técnica</option>
                  <option value="BEHAVIORAL">Comportamental</option>
                  <option value="LEADERSHIP">Liderança</option>
                  <option value="COMMUNICATION">Comunicação</option>
                </select>
                <button
                  type="button"
                  onClick={addCompetency}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-1">
                {formData.competencies.map((comp, index) => (
                  <div key={index} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-700">{comp.name}</span>
                      <span className="text-sm text-slate-600">{comp.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${comp.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-700">{comp.score}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCompetency(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comentários */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Comentários Gerais</label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Comentários adicionais sobre a avaliação..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              {editingAvaliacao ? 'Atualizar' : 'Salvar'} Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
