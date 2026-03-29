import { 
  SalaryHistory, 
  SalaryAdjustmentRequest, 
  WorkflowStep, 
  SalaryReport, 
  SalaryPolicy,
  Payroll 
} from '../types';

class SalaryHistoryService {
  private static readonly STORAGE_KEYS = {
    SALARY_HISTORY: 'salary_history',
    ADJUSTMENT_REQUESTS: 'salary_adjustment_requests',
    POLICIES: 'salary_policies',
    REPORTS: 'salary_reports'
  };

  /**
   * Salvar histórico salarial
   */
  static async saveSalaryHistory(history: SalaryHistory): Promise<void> {
    try {
      const histories = await this.getSalaryHistory(history.unitId);
      const existingIndex = histories.findIndex(h => h.id === history.id);
      
      if (existingIndex >= 0) {
        histories[existingIndex] = {
          ...history,
          updatedAt: new Date().toISOString()
        };
      } else {
        histories.push({
          ...history,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      await this.saveToStorage(this.STORAGE_KEYS.SALARY_HISTORY, histories);
      console.log('✅ Histórico salarial salvo com sucesso:', history.id);
    } catch (error) {
      console.error('❌ Erro ao salvar histórico salarial:', error);
      throw error;
    }
  }

  /**
   * Obter histórico salarial de uma unidade
   */
  static async getSalaryHistory(unitId: string): Promise<SalaryHistory[]> {
    try {
      const histories = await this.getFromStorage(this.STORAGE_KEYS.SALARY_HISTORY) || [];
      return histories.filter((h: SalaryHistory) => h.unitId === unitId)
                      .sort((a: SalaryHistory, b: SalaryHistory) => new Date(b.dataAlteracao).getTime() - new Date(a.dataAlteracao).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter histórico salarial:', error);
      return [];
    }
  }

  /**
   * Obter histórico de um funcionário
   */
  static async getEmployeeSalaryHistory(employeeId: string, unitId: string): Promise<SalaryHistory[]> {
    try {
      const histories = await this.getSalaryHistory(unitId);
      return histories.filter(h => h.employeeId === employeeId)
                      .sort((a: SalaryHistory, b: SalaryHistory) => new Date(b.dataAlteracao).getTime() - new Date(a.dataAlteracao).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter histórico do funcionário:', error);
      return [];
    }
  }

  /**
   * Criar solicitação de ajuste salarial
   */
  static async createAdjustmentRequest(request: SalaryAdjustmentRequest): Promise<void> {
    try {
      const requests = await this.getAdjustmentRequests(request.unitId);
      
      requests.push({
        ...request,
        id: request.id || Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await this.saveToStorage(this.STORAGE_KEYS.ADJUSTMENT_REQUESTS, requests);
      console.log('✅ Solicitação de ajuste criada com sucesso:', request.id);
    } catch (error) {
      console.error('❌ Erro ao criar solicitação de ajuste:', error);
      throw error;
    }
  }

  /**
   * Obter solicitações de ajuste
   */
  static async getAdjustmentRequests(unitId: string): Promise<SalaryAdjustmentRequest[]> {
    try {
      const requests = await this.getFromStorage(this.STORAGE_KEYS.ADJUSTMENT_REQUESTS) || [];
      return requests.filter((r: SalaryAdjustmentRequest) => r.unitId === unitId)
                      .sort((a: SalaryAdjustmentRequest, b: SalaryAdjustmentRequest) => new Date(b.dataSolicitacao).getTime() - new Date(a.dataSolicitacao).getTime());
    } catch (error) {
      console.error('❌ Erro ao obter solicitações de ajuste:', error);
      return [];
    }
  }

  /**
   * Aprovar solicitação de ajuste
   */
  static async approveAdjustment(requestId: string, unitId: string, approverId: string, approverName: string, comments?: string): Promise<void> {
    try {
      const requests = await this.getAdjustmentRequests(unitId);
      const requestIndex = requests.findIndex(r => r.id === requestId);
      
      if (requestIndex === -1) {
        throw new Error('Solicitação não encontrada');
      }

      const request = requests[requestIndex];
      
      // Atualizar workflow
      const currentStep = request.workflow.find(step => step.status === 'PENDING');
      if (currentStep) {
        currentStep.status = 'COMPLETED';
        currentStep.completedAt = new Date().toISOString();
        currentStep.completedBy = approverId;
        currentStep.comments = comments;
      }

      // Verificar se todos os steps estão completos
      const allStepsCompleted = request.workflow.every(step => step.status === 'COMPLETED' || step.status === 'SKIPPED');
      
      if (allStepsCompleted) {
        request.status = 'APPROVED';
        
        // Criar histórico salarial a partir da solicitação aprovada
        const salaryHistory: SalaryHistory = {
          id: Math.random().toString(36).substr(2, 9),
          employeeId: request.employeeId,
          employeeName: request.employeeName,
          employeeCargo: '', // Preencher com dados do funcionário
          employeeDepartamento: '',
          
          salarioAnterior: request.salarioAtual,
          salarioNovo: request.salarioProposto,
          percentualAumento: request.percentualProposto,
          diferencaValor: request.salarioProposto - request.salarioAtual,
          moeda: 'BRL',
          
          tipoAlteracao: request.tipoAlteracao,
          motivoAlteracao: request.justificativa,
          dataAlteracao: new Date().toISOString().split('T')[0],
          dataVigencia: request.dataVigenciaDesejada,
          
          status: 'EFFECTIVE',
          solicitanteId: 'system',
          solicitanteName: 'Sistema',
          aprovadorId: approverId,
          aprovadorName: approverName,
          dataAprovacao: new Date().toISOString(),
          justificativaAprovacao: comments,
          
          complianceChecklist: {
            aprovacaoDiretoria: true,
            verificacaoOrcamento: true,
            analiseComparativo: true,
            documentoAssinado: true
          },
          
          vinculadoDesempenho: false,
          
          observacoes: `Solicitação aprovada via workflow. ${comments || ''}`,
          anexos: [],
          
          unitId: unitId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await this.saveSalaryHistory(salaryHistory);
      }

      requests[requestIndex] = {
        ...request,
        updatedAt: new Date().toISOString()
      };

      await this.saveToStorage(this.STORAGE_KEYS.ADJUSTMENT_REQUESTS, requests);
      console.log('✅ Solicitação aprovada com sucesso:', requestId);
    } catch (error) {
      console.error('❌ Erro ao aprovar solicitação:', error);
      throw error;
    }
  }

  /**
   * Rejeitar solicitação de ajuste
   */
  static async rejectAdjustment(requestId: string, unitId: string, approverId: string, approverName: string, reason: string): Promise<void> {
    try {
      const requests = await this.getAdjustmentRequests(unitId);
      const requestIndex = requests.findIndex(r => r.id === requestId);
      
      if (requestIndex === -1) {
        throw new Error('Solicitação não encontrada');
      }

      const request = requests[requestIndex];
      request.status = 'REJECTED';
      
      // Atualizar workflow
      const currentStep = request.workflow.find(step => step.status === 'PENDING');
      if (currentStep) {
        currentStep.status = 'REJECTED';
        currentStep.completedAt = new Date().toISOString();
        currentStep.completedBy = approverId;
        currentStep.comments = reason;
      }

      requests[requestIndex] = {
        ...request,
        updatedAt: new Date().toISOString()
      };

      await this.saveToStorage(this.STORAGE_KEYS.ADJUSTMENT_REQUESTS, requests);
      console.log('✅ Solicitação rejeitada com sucesso:', requestId);
    } catch (error) {
      console.error('❌ Erro ao rejeitar solicitação:', error);
      throw error;
    }
  }

  /**
   * Calcular análise comparativo salarial
   */
  static async calculateSalaryAnalysis(employeeId: string, unitId: string): Promise<{
    mediaCargo: number;
    mediaDepartamento: number;
    faixaSalarial: { min: number; max: number };
    posicaoFaixa: 'ABAIXO' | 'DENTRO' | 'ACIMA';
  }> {
    try {
      const histories = await this.getSalaryHistory(unitId);
      const employeeHistories = histories.filter(h => h.employeeId === employeeId);
      
      if (employeeHistories.length === 0) {
        throw new Error('Funcionário não possui histórico salarial');
      }

      const currentSalary = employeeHistories[0].salarioNovo;
      const employee = employeeHistories[0];
      
      // Calcular médias (simulação - em produção usaria dados reais)
      const sameRoleHistories = histories.filter(h => h.employeeCargo === employee.employeeCargo);
      const sameDeptHistories = histories.filter(h => h.employeeDepartamento === employee.employeeDepartamento);
      
      const mediaCargo = sameRoleHistories.length > 0 
        ? sameRoleHistories.reduce((sum, h) => sum + h.salarioNovo, 0) / sameRoleHistories.length 
        : currentSalary;
      
      const mediaDepartamento = sameDeptHistories.length > 0 
        ? sameDeptHistories.reduce((sum, h) => sum + h.salarioNovo, 0) / sameDeptHistories.length 
        : currentSalary;
      
      // Definir faixa salarial (simulação)
      const faixaSalarial = {
        min: mediaCargo * 0.8,
        max: mediaCargo * 1.2
      };
      
      // Determinar posição na faixa
      let posicaoFaixa: 'ABAIXO' | 'DENTRO' | 'ACIMA';
      if (currentSalary < faixaSalarial.min) {
        posicaoFaixa = 'ABAIXO';
      } else if (currentSalary > faixaSalarial.max) {
        posicaoFaixa = 'ACIMA';
      } else {
        posicaoFaixa = 'DENTRO';
      }

      return {
        mediaCargo,
        mediaDepartamento,
        faixaSalarial,
        posicaoFaixa
      };
    } catch (error) {
      console.error('❌ Erro ao calcular análise salarial:', error);
      throw error;
    }
  }

  /**
   * Gerar relatório de evolução salarial
   */
  static async generateSalaryReport(
    reportType: SalaryReport['reportType'],
    dataInicio: string,
    dataFim: string,
    unitId: string
  ): Promise<SalaryReport> {
    try {
      const histories = await this.getSalaryHistory(unitId);
      const filteredHistories = histories.filter(h => 
        h.dataAlteracao >= dataInicio && h.dataAlteracao <= dataFim
      );

      // Calcular métricas
      const totalFuncionarios = new Set(histories.map(h => h.employeeId)).size;
      const currentSalaries = histories.filter(h => h.status === 'EFFECTIVE')
        .map(h => ({ id: h.employeeId, salary: h.salarioNovo }));
      
      const uniqueCurrentSalaries = currentSalaries.filter((salary, index, self) =>
        index === self.findIndex(s => s.id === salary.id)
      );
      
      const massaSalarialAtual = uniqueCurrentSalaries.reduce((sum, s) => sum + s.salary, 0);
      const mediaSalarial = uniqueCurrentSalaries.length > 0 ? massaSalarialAtual / uniqueCurrentSalaries.length : 0;
      
      const approvedHistories = filteredHistories.filter(h => h.status === 'APPROVED' || h.status === 'EFFECTIVE');
      const totalAumentos = approvedHistories.length;
      const percentualMedioAumento = totalAumentos > 0 
        ? approvedHistories.reduce((sum, h) => sum + h.percentualAumento, 0) / totalAumentos 
        : 0;
      
      const maiorAumento = totalAumentos > 0 
        ? Math.max(...approvedHistories.map(h => h.percentualAumento))
        : 0;
      
      const menorAumento = totalAumentos > 0 
        ? Math.min(...approvedHistories.map(h => h.percentualAumento))
        : 0;

      // Agrupar dados
      const distribuicaoPorDepartamento = this.groupByDepartment(filteredHistories);
      const aumentosPorTipo = this.groupByAlterationType(approvedHistories);
      
      const report: SalaryReport = {
        id: Math.random().toString(36).substr(2, 9),
        reportType,
        dataInicio,
        dataFim,
        
        filtros: {
          departamentos: [...new Set(histories.map(h => h.employeeDepartamento))],
          cargos: [...new Set(histories.map(h => h.employeeCargo))],
          faixasSalariais: [],
          tiposAlteracao: [...new Set(histories.map(h => h.tipoAlteracao))]
        },
        
        metricas: {
          totalFuncionarios,
          massaSalarialAtual,
          mediaSalarial: Math.round(mediaSalarial),
          medianaSalarial: Math.round(mediaSalarial), // Simplificado
          totalAumentos,
          percentualMedioAumento: Math.round(percentualMedioAumento * 100) / 100,
          maiorAumento: Math.round(maiorAumento * 100) / 100,
          menorAumento: Math.round(menorAumento * 100) / 100
        },
        
        dados: {
          evolucaoMensal: this.generateMonthlyEvolution(filteredHistories),
          distribuicaoPorDepartamento,
          aumentosPorTipo
        },
        
        analises: {
          tendenciaAumentos: percentualMedioAumento > 5 ? 'CRESCENTE' : 'ESTAVEL',
          pontosCriticos: [],
          recomendacoes: ['Monitorar distribuição salarial', 'Revisar políticas anualmente'],
          projecaoOrcamento: {
            proximoAno: Math.round(massaSalarialAtual * 1.05),
            proximos6Meses: Math.round(massaSalarialAtual * 1.025)
          }
        },
        
        geradoPor: 'system',
        dataGeracao: new Date().toISOString(),
        formato: 'JSON',
        
        unitId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return report;
    } catch (error) {
      console.error('❌ Erro ao gerar relatório salarial:', error);
      throw error;
    }
  }

  /**
   * Agrupar por departamento
   */
  private static groupByDepartment(histories: SalaryHistory[]) {
    const grouped = histories.reduce((acc, h) => {
      const dept = h.employeeDepartamento;
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(h);
      return acc;
    }, {} as Record<string, SalaryHistory[]>);

    return Object.entries(grouped).map(([departamento, items]) => {
      const uniqueEmployees = new Set(items.map(h => h.employeeId)).size;
      const totalSalary = items
        .filter(h => h.status === 'EFFECTIVE')
        .reduce((sum, h) => sum + h.salarioNovo, 0);
      
      return {
        departamento,
        massaSalarial: totalSalary,
        numeroFuncionarios: uniqueEmployees,
        mediaSalarial: uniqueEmployees > 0 ? totalSalary / uniqueEmployees : 0,
        percentualTotal: 0 // Calcularia com base no total geral
      };
    });
  }

  /**
   * Agrupar por tipo de alteração
   */
  private static groupByAlterationType(histories: SalaryHistory[]) {
    const grouped = histories.reduce((acc, h) => {
      const type = h.tipoAlteracao;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(h);
      return acc;
    }, {} as Record<string, SalaryHistory[]>);

    return Object.entries(grouped).map(([tipo, items]) => ({
      tipo,
      quantidade: items.length,
      valorTotal: items.reduce((sum, h) => sum + h.diferencaValor, 0),
      percentualMedio: items.length > 0 
        ? items.reduce((sum, h) => sum + h.percentualAumento, 0) / items.length 
        : 0
    }));
  }

  /**
   * Gerar evolução mensal
   */
  private static generateMonthlyEvolution(histories: SalaryHistory[]) {
    // Simplificado - em produção agruparia corretamente por mês
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map(mes => ({
      mes,
      massaSalarial: Math.random() * 100000 + 50000,
      numeroFuncionarios: Math.floor(Math.random() * 20) + 10,
      mediaSalarial: Math.random() * 5000 + 3000
    }));
  }

  /**
   * Salvar no IndexedDB
   */
  private static async saveToStorage(key: string, data: any): Promise<void> {
    try {
      if ('indexedDB' in window) {
        const request = indexedDB.open('salary_history_db', 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('salary_data')) {
            db.createObjectStore('salary_data');
          }
        };

        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['salary_data'], 'readwrite');
          const store = transaction.objectStore('salary_data');
          store.put({ key, data, timestamp: Date.now() });
        };
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (error) {
      console.error('❌ Erro ao salvar no storage:', error);
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  /**
   * Obter do IndexedDB
   */
  private static async getFromStorage(key: string): Promise<any> {
    try {
      if ('indexedDB' in window) {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('salary_history_db', 1);
          
          request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(['salary_data'], 'readonly');
            const store = transaction.objectStore('salary_data');
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
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (error) {
      console.error('❌ Erro ao obter do storage:', error);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  }
}

export default SalaryHistoryService;
