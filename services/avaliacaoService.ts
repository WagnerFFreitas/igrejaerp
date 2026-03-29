import { 
  PerformanceEvaluation, 
  CompetencyEvaluation, 
  GoalEvaluation, 
  PDIPlan, 
  EvaluationCycle, 
  DevelopmentPlan,
  Feedback360,
  CompetencyTemplate,
  GoalTemplate
} from '../types';

class AvaliacaoService {
  private static readonly STORAGE_KEYS = {
    EVALUATIONS: 'performance_evaluations',
    CYCLES: 'evaluation_cycles',
    TEMPLATES: 'evaluation_templates',
    FEEDBACK_360: 'feedback_360',
    DEVELOPMENT_PLANS: 'development_plans'
  };

  /**
   * Salvar avaliação de desempenho
   */
  static async saveEvaluation(evaluation: PerformanceEvaluation): Promise<void> {
    try {
      const evaluations = await this.getEvaluations(evaluation.unitId);
      const existingIndex = evaluations.findIndex(e => e.id === evaluation.id);
      
      if (existingIndex >= 0) {
        evaluations[existingIndex] = {
          ...evaluation,
          updatedAt: new Date().toISOString()
        };
      } else {
        evaluations.push({
          ...evaluation,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.EVALUATIONS, evaluations);
      console.log('✅ Avaliação salva com sucesso:', evaluation.id);
    } catch (error) {
      console.error('❌ Erro ao salvar avaliação:', error);
      throw error;
    }
  }

  /**
   * Obter avaliações de uma unidade
   */
  static async getEvaluations(unitId: string): Promise<PerformanceEvaluation[]> {
    try {
      const evaluations = await this.getFromStorage(this.STORAGE_KEYS.EVALUATIONS) || [];
      return evaluations.filter((e: PerformanceEvaluation) => e.unitId === unitId);
    } catch (error) {
      console.error('❌ Erro ao obter avaliações:', error);
      return [];
    }
  }

  /**
   * Obter avaliação por ID
   */
  static async getEvaluationById(id: string, unitId: string): Promise<PerformanceEvaluation | null> {
    try {
      const evaluations = await this.getEvaluations(unitId);
      return evaluations.find(e => e.id === id) || null;
    } catch (error) {
      console.error('❌ Erro ao obter avaliação por ID:', error);
      return null;
    }
  }

  /**
   * Obter avaliações de um funcionário
   */
  static async getEmployeeEvaluations(employeeId: string, unitId: string): Promise<PerformanceEvaluation[]> {
    try {
      const evaluations = await this.getEvaluations(unitId);
      return evaluations.filter(e => e.employeeId === employeeId)
                      .sort((a, b) => new Date(b.evaluationDate).getTime() - new Date(a.evaluationDate).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter avaliações do funcionário:', error);
      return [];
    }
  }

  /**
   * Calcular score geral da avaliação
   */
  static calculateOverallScore(evaluation: PerformanceEvaluation): number {
    try {
      let totalWeightedScore = 0;
      let totalWeight = 0;

      // Calcular score das competências
      evaluation.competencies.forEach(comp => {
        totalWeightedScore += comp.score * comp.weight;
        totalWeight += comp.weight;
      });

      // Calcular score das metas (peso 30%)
      let goalScore = 0;
      if (evaluation.goals.length > 0) {
        goalScore = evaluation.goals.reduce((sum, goal) => sum + goal.achievementPercentage, 0) / evaluation.goals.length;
        totalWeightedScore += goalScore * 0.3;
        totalWeight += 0.3;
      }

      // Calcular score final
      const finalScore = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;
      return Math.round(finalScore);
    } catch (error) {
      console.error('❌ Erro ao calcular score geral:', error);
      return 0;
    }
  }

  /**
   * Determinar rating baseado no score
   */
  static getRatingByScore(score: number): PerformanceEvaluation['overallRating'] {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 80) return 'GOOD';
    if (score >= 70) return 'SATISFACTORY';
    if (score >= 60) return 'NEEDS_IMPROVEMENT';
    return 'UNSATISFACTORY';
  }

  /**
   * Salvar ciclo de avaliação
   */
  static async saveCycle(cycle: EvaluationCycle): Promise<void> {
    try {
      const cycles = await this.getCycles(cycle.unitId);
      const existingIndex = cycles.findIndex(c => c.id === cycle.id);
      
      if (existingIndex >= 0) {
        cycles[existingIndex] = {
          ...cycle,
          updatedAt: new Date().toISOString()
        };
      } else {
        cycles.push({
          ...cycle,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.CYCLES, cycles);
      console.log('✅ Ciclo salvo com sucesso:', cycle.id);
    } catch (error) {
      console.error('❌ Erro ao salvar ciclo:', error);
      throw error;
    }
  }

  /**
   * Obter ciclos de avaliação
   */
  static async getCycles(unitId: string): Promise<EvaluationCycle[]> {
    try {
      const cycles = await this.getFromStorage(this.STORAGE_KEYS.CYCLES) || [];
      return cycles.filter((c: EvaluationCycle) => c.unitId === unitId);
    } catch (error) {
      console.error('❌ Erro ao obter ciclos:', error);
      return [];
    }
  }

  /**
   * Obter ciclo ativo
   */
  static async getActiveCycle(unitId: string): Promise<EvaluationCycle | null> {
    try {
      const cycles = await this.getCycles(unitId);
      const now = new Date();
      
      return cycles.find(cycle => 
        cycle.status === 'ACTIVE' &&
        new Date(cycle.startDate) <= now &&
        new Date(cycle.endDate) >= now
      ) || null;
    } catch (error) {
      console.error('❌ Erro ao obter ciclo ativo:', error);
      return null;
    }
  }

  /**
   * Salvar template de competência
   */
  static async saveCompetencyTemplate(template: CompetencyTemplate): Promise<void> {
    try {
      const templates = await this.getCompetencyTemplates(template.unitId);
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = {
          ...template,
          updatedAt: new Date().toISOString()
        };
      } else {
        templates.push({
          ...template,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.TEMPLATES, templates);
      console.log('✅ Template de competência salvo com sucesso:', template.id);
    } catch (error) {
      console.error('❌ Erro ao salvar template de competência:', error);
      throw error;
    }
  }

  /**
   * Obter templates de competência
   */
  static async getCompetencyTemplates(unitId: string): Promise<CompetencyTemplate[]> {
    try {
      const templates = await this.getFromStorage(this.STORAGE_KEYS.TEMPLATES) || [];
      return templates.filter((t: CompetencyTemplate) => t.unitId === unitId && t.isActive);
    } catch (error) {
      console.error('❌ Erro ao obter templates de competência:', error);
      return [];
    }
  }

  /**
   * Salvar template de meta
   */
  static async saveGoalTemplate(template: GoalTemplate): Promise<void> {
    try {
      const templates = await this.getGoalTemplates(template.unitId);
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = {
          ...template,
          updatedAt: new Date().toISOString()
        };
      } else {
        templates.push({
          ...template,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.TEMPLATES, templates);
      console.log('✅ Template de meta salvo com sucesso:', template.id);
    } catch (error) {
      console.error('❌ Erro ao salvar template de meta:', error);
      throw error;
    }
  }

  /**
   * Obter templates de meta
   */
  static async getGoalTemplates(unitId: string): Promise<GoalTemplate[]> {
    try {
      const templates = await this.getFromStorage(this.STORAGE_KEYS.TEMPLATES) || [];
      return templates.filter((t: GoalTemplate) => t.unitId === unitId && t.isActive);
    } catch (error) {
      console.error('❌ Erro ao obter templates de meta:', error);
      return [];
    }
  }

  /**
   * Salvar plano de desenvolvimento
   */
  static async saveDevelopmentPlan(plan: DevelopmentPlan): Promise<void> {
    try {
      const plans = await this.getDevelopmentPlans(plan.unitId);
      const existingIndex = plans.findIndex(p => p.id === plan.id);
      
      if (existingIndex >= 0) {
        plans[existingIndex] = {
          ...plan,
          updatedAt: new Date().toISOString()
        };
      } else {
        plans.push({
          ...plan,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.DEVELOPMENT_PLANS, plans);
      console.log('✅ Plano de desenvolvimento salvo com sucesso:', plan.id);
    } catch (error) {
      console.error('❌ Erro ao salvar plano de desenvolvimento:', error);
      throw error;
    }
  }

  /**
   * Obter planos de desenvolvimento
   */
  static async getDevelopmentPlans(unitId: string): Promise<DevelopmentPlan[]> {
    try {
      const plans = await this.getFromStorage(this.STORAGE_KEYS.DEVELOPMENT_PLANS) || [];
      return plans.filter((p: DevelopmentPlan) => p.unitId === unitId);
    } catch (error) {
      console.error('❌ Erro ao obter planos de desenvolvimento:', error);
      return [];
    }
  }

  /**
   * Obter planos de um funcionário
   */
  static async getEmployeeDevelopmentPlans(employeeId: string, unitId: string): Promise<DevelopmentPlan[]> {
    try {
      const plans = await this.getDevelopmentPlans(unitId);
      return plans.filter(p => p.employeeId === employeeId)
                      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter planos do funcionário:', error);
      return [];
    }
  }

  /**
   * Salvar feedback 360
   */
  static async saveFeedback360(feedback: Feedback360): Promise<void> {
    try {
      const feedbacks = await this.getFeedback360(feedback.unitId);
      const existingIndex = feedbacks.findIndex(f => f.id === feedback.id);
      
      if (existingIndex >= 0) {
        feedbacks[existingIndex] = {
          ...feedback,
          updatedAt: new Date().toISOString()
        };
      } else {
        feedbacks.push({
          ...feedback,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.FEEDBACK_360, feedbacks);
      console.log('✅ Feedback 360 salvo com sucesso:', feedback.id);
    } catch (error) {
      console.error('❌ Erro ao salvar feedback 360:', error);
      throw error;
    }
  }

  /**
   * Obter feedbacks 360
   */
  static async getFeedback360(unitId: string): Promise<Feedback360[]> {
    try {
      const feedbacks = await this.getFromStorage(this.STORAGE_KEYS.FEEDBACK_360) || [];
      return feedbacks.filter((f: Feedback360) => f.unitId === unitId);
    } catch (error) {
      console.error('❌ Erro ao obter feedbacks 360:', error);
      return [];
    }
  }

  /**
   * Obter feedbacks de uma avaliação
   */
  static async getEvaluationFeedback360(evaluationId: string, unitId: string): Promise<Feedback360[]> {
    try {
      const feedbacks = await this.getFeedback360(unitId);
      return feedbacks.filter(f => f.evaluationId === evaluationId);
    } catch (error) {
      console.error('❌ Erro ao obter feedbacks da avaliação:', error);
      return [];
    }
  }

  /**
   * Gerar relatório de avaliações
   */
  static async generateEvaluationReport(unitId: string): Promise<{
    summary: any;
    evaluationsByRating: Record<string, number>;
    evaluationsByType: Record<string, number>;
    averageScore: number;
    topPerformers: PerformanceEvaluation[];
    improvementNeeded: PerformanceEvaluation[];
    developmentPlans: DevelopmentPlan[];
  }> {
    try {
      const evaluations = await this.getEvaluations(unitId);
      const plans = await this.getDevelopmentPlans(unitId);
      
      // Estatísticas gerais
      const totalEvaluations = evaluations.length;
      const averageScore = evaluations.length > 0 
        ? evaluations.reduce((sum, evaluation) => sum + evaluation.overallScore, 0) / evaluations.length 
        : 0;

      // Agrupar por rating
      const evaluationsByRating = evaluations.reduce((acc, evaluation) => {
        acc[evaluation.overallRating] = (acc[evaluation.overallRating] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Agrupar por tipo
      const evaluationsByType = evaluations.reduce((acc, evaluation) => {
        acc[evaluation.evaluationType] = (acc[evaluation.evaluationType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Top performers (score >= 85)
      const topPerformers = evaluations
        .filter(e => e.overallScore >= 85)
        .sort((a, b) => b.overallScore - a.overallScore)
        .slice(0, 10);

      // Precisam melhorar (score < 70)
      const improvementNeeded = evaluations
        .filter(e => e.overallScore < 70)
        .sort((a, b) => a.overallScore - b.overallScore)
        .slice(0, 10);

      return {
        summary: {
          totalEvaluations,
          averageScore: Math.round(averageScore),
          totalDevelopmentPlans: plans.length,
          activePlans: plans.filter(p => p.status === 'ACTIVE').length
        },
        evaluationsByRating,
        evaluationsByType,
        averageScore: Math.round(averageScore),
        topPerformers,
        improvementNeeded,
        developmentPlans: plans.filter(p => p.status === 'ACTIVE')
      };
    } catch (error) {
      console.error('❌ Erro ao gerar relatório de avaliações:', error);
      throw error;
    }
  }

  /**
   * Salvar no IndexedDB
   */
  private static async saveToStorage(key: string, data: any): Promise<void> {
    try {
      // Usar IndexedDB se disponível, senão localStorage
      if ('indexedDB' in window) {
        const request = indexedDB.open('avaliacao_db', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('avaliacao_data')) {
            db.createObjectStore('avaliacao_data');
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['avaliacao_data'], 'readwrite');
          const store = transaction.objectStore('avaliacao_data');
          store.put({ key, data, timestamp: Date.now() });
        };
      } else {
        // Fallback para localStorage
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error('❌ Erro ao salvar no storage:', error);
      // Fallback para localStorage
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  /**
   * Obter do IndexedDB
   */
  private static async getFromStorage(key: string): Promise<any> {
    try {
      // Usar IndexedDB se disponível, senão localStorage
      if ('indexedDB' in window) {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('avaliacao_db', 1);
          
          request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(['avaliacao_data'], 'readonly');
            const store = transaction.objectStore('avaliacao_data');
            const getRequest = store.get(key);
            
            getRequest.onsuccess = () => {
              resolve(getRequest.result?.data || null);
            };
            
            getRequest.onerror = () => {
              reject(getRequest.error);
            };
          };
          
          request.onerror = () => {
            reject(request.error);
          };
        });
      } else {
        // Fallback para localStorage
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error('❌ Erro ao obter do storage:', error);
      // Fallback para localStorage
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  }
}

export default AvaliacaoService;
