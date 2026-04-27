/**
 * ============================================================================
 * AVALIACAOSERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para avaliacao service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */

import apiClient from '../src/services/apiService';
import { PerformanceEvaluation, DevelopmentPlan } from '../types';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (avaliacao service).
 */

class AvaliacaoService {

  // ─── AVALIAÇÕES ────────────────────────────────────────────────────────────

  static async saveEvaluation(evaluation: PerformanceEvaluation): Promise<void> {
    try {
      if (evaluation.id && !evaluation.id.startsWith('tmp-')) {
        await apiClient.put(`/rh/evaluations/${evaluation.id}`, evaluation);
      } else {
        await apiClient.post('/rh/evaluations', evaluation);
      }
    } catch (e) {
      console.error('❌ saveEvaluation:', e);
      throw e;
    }
  }

  static async getEvaluations(unitId: string): Promise<PerformanceEvaluation[]> {
    try {
      const data = await apiClient.get<PerformanceEvaluation[]>('/rh/evaluations', { unitId });
      return data || [];
    } catch (e) {
      console.error('❌ getEvaluations:', e);
      return [];
    }
  }

  static async getEmployeeEvaluations(employeeId: string, unitId: string): Promise<PerformanceEvaluation[]> {
    try {
      const data = await apiClient.get<PerformanceEvaluation[]>('/rh/evaluations', { unitId, employeeId });
      return data || [];
    } catch (e) {
      console.error('❌ getEmployeeEvaluations:', e);
      return [];
    }
  }

  static async getEvaluationById(id: string, unitId: string): Promise<PerformanceEvaluation | null> {
    const evals = await this.getEvaluations(unitId);
    return evals.find(e => e.id === id) || null;
  }

  static calculateOverallScore(evaluation: PerformanceEvaluation): number {
    try {
      let totalWeightedScore = 0;
      let totalWeight = 0;
      (evaluation.competencies || []).forEach((comp: any) => {
        totalWeightedScore += (comp.score || 0) * (comp.weight || 1);
        totalWeight += (comp.weight || 1);
      });
      const goals = evaluation.goals || [];
      if (goals.length > 0) {
        const goalScore = goals.reduce((s: number, g: any) => s + (g.achievementPercentage || 0), 0) / goals.length;
        totalWeightedScore += goalScore * 0.3;
        totalWeight += 0.3;
      }
      return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0;
    } catch { return 0; }
  }

  static getRatingByScore(score: number): string {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 80) return 'GOOD';
    if (score >= 70) return 'SATISFACTORY';
    if (score >= 60) return 'NEEDS_IMPROVEMENT';
    return 'UNSATISFACTORY';
  }

  // ─── PDI ───────────────────────────────────────────────────────────────────

  static async saveDevelopmentPlan(plan: DevelopmentPlan): Promise<void> {
    try {
      if (plan.id && !plan.id.startsWith('tmp-')) {
        await apiClient.put(`/rh/pdi/${plan.id}`, plan);
      } else {
        await apiClient.post('/rh/pdi', plan);
      }
    } catch (e) {
      console.error('❌ saveDevelopmentPlan:', e);
      throw e;
    }
  }

  static async getDevelopmentPlans(unitId: string): Promise<DevelopmentPlan[]> {
    try {
      const data = await apiClient.get<DevelopmentPlan[]>('/rh/pdi', { unitId });
      return data || [];
    } catch (e) {
      console.error('❌ getDevelopmentPlans:', e);
      return [];
    }
  }

  static async getEmployeeDevelopmentPlans(employeeId: string, unitId: string): Promise<DevelopmentPlan[]> {
    try {
      const data = await apiClient.get<DevelopmentPlan[]>('/rh/pdi', { unitId, employeeId });
      return data || [];
    } catch (e) {
      console.error('❌ getEmployeeDevelopmentPlans:', e);
      return [];
    }
  }

  // Stubs para compatibilidade
  static async saveCycle(cycle: any): Promise<void> { /* TODO */ }
  static async getCycles(unitId: string): Promise<any[]> { return []; }
  static async getActiveCycle(unitId: string): Promise<any | null> { return null; }
  static async saveCompetencyTemplate(t: any): Promise<void> { /* TODO */ }
  static async getCompetencyTemplates(unitId: string): Promise<any[]> { return []; }
  static async saveGoalTemplate(t: any): Promise<void> { /* TODO */ }
  static async getGoalTemplates(unitId: string): Promise<any[]> { return []; }
  static async saveFeedback360(f: any): Promise<void> { /* TODO */ }
  static async getFeedback360(unitId: string): Promise<any[]> { return []; }
  static async getEvaluationFeedback360(evaluationId: string, unitId: string): Promise<any[]> { return []; }

  static async generateEvaluationReport(unitId: string) {
    const evaluations = await this.getEvaluations(unitId);
    const plans = await this.getDevelopmentPlans(unitId);
    const avg = evaluations.length > 0
      ? evaluations.reduce((s, e) => s + (e.overallScore || 0), 0) / evaluations.length : 0;
    return {
      summary: { totalEvaluations: evaluations.length, averageScore: Math.round(avg), totalDevelopmentPlans: plans.length, activePlans: (plans as any[]).filter(p => p.status === 'ACTIVE').length },
      evaluationsByRating: {},
      evaluationsByType: {},
      averageScore: Math.round(avg),
      topPerformers: evaluations.filter(e => (e.overallScore || 0) >= 85).slice(0, 10),
      improvementNeeded: evaluations.filter(e => (e.overallScore || 0) < 70).slice(0, 10),
      developmentPlans: plans,
    };
  }
}

export default AvaliacaoService;
