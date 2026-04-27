/**
 * ============================================================================
 * PAYROLL.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para payroll.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import { Router, Request, Response } from 'express';
import Database from '../database';
import { randomUUID } from 'crypto';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (payroll).
 */

const router = Router();
const db = Database.getInstance();

/**
 * =====================================================
 * ROTAS DE FOLHA DE PAGAMENTO (PAYROLL)
 * =====================================================
 */

// 1. LISTAR PERÍODOS DE FOLHA
router.get('/periods', async (req: Request, res: Response) => {
  try {
    const { unitId } = req.query;
    let query = 'SELECT * FROM payroll_periods WHERE 1=1';
    const params: any[] = [];
    
    if (unitId) {
      query += ' AND unit_id = $1';
      params.push(unitId);
    }
    
    query += ' ORDER BY year DESC, month DESC';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Erro ao buscar períodos de folha:', error);
    res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
  }
});

// 2. CRIAR/ABRIR NOVO PERÍODO DE FOLHA
router.post('/periods', async (req: Request, res: Response) => {
  try {
    const { unit_id, month, year, start_date, end_date, created_by, notes } = req.body;
    
    const id = randomUUID();
    const result = await db.query(
      `INSERT INTO payroll_periods 
       (id, unit_id, month, year, start_date, end_date, created_by, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'OPEN')
       RETURNING *`,
      [id, unit_id, month, year, start_date, end_date, created_by, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Erro ao criar período de folha:', error);
    res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
  }
});

// 3. SALVAR CÁLCULO DE FOLHA DE UM FUNCIONÁRIO
router.post('/calculations', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = randomUUID();
    
    // Mapeamento para snake_case das colunas da tabela payroll_calculations
    const query = `
      INSERT INTO payroll_calculations (
        id, employee_id, competency_month, gross_salary,
        base_salary, overtime, night_shift, hazard_pay, commission, bonuses, family_salary, other_allowances,
        inss, irrf, fgts, health_insurance, dental_insurance, meal_allowance, meal_ticket, transport, 
        pharmacy, life_insurance, advance, consignado, coparticipation, absences, delays, alimony, other_deductions,
        total_allowances, total_deductions, net_salary, employer_cost,
        inss_base, inss_rate, inss_value, irrf_base, irrf_rate, irrf_deduction, irrf_value, fgts_base, fgts_rate, fgts_value
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43
      ) ON CONFLICT (employee_id, competency_month) 
      DO UPDATE SET
        gross_salary = EXCLUDED.gross_salary,
        base_salary = EXCLUDED.base_salary,
        overtime = EXCLUDED.overtime,
        inss = EXCLUDED.inss,
        irrf = EXCLUDED.irrf,
        net_salary = EXCLUDED.net_salary,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`;

    const params = [
      id, data.employeeId, data.competencyMonth, data.grossSalary,
      data.allowances.baseSalary, data.allowances.overtime, data.allowances.nightShift, data.allowances.hazardPay, data.allowances.commission, data.allowances.bonuses, data.allowances.familySalary, data.allowances.other,
      data.deductions.inss, data.deductions.irrf, data.deductions.fgts, data.deductions.healthInsurance, data.deductions.dentalInsurance, data.deductions.mealAllowance, data.deductions.mealTicket, data.deductions.transport,
      data.deductions.pharmacy, data.deductions.lifeInsurance, data.deductions.advance, data.deductions.consignado, data.deductions.coparticipation, data.deductions.absences, data.deductions.delays, data.deductions.alimony, data.deductions.other,
      data.totals.totalAllowances, data.totals.totalDeductions, data.totals.netSalary, data.totals.employerCost,
      data.calculationDetails.inssBase, data.calculationDetails.inssRate, data.calculationDetails.inssValue, data.calculationDetails.irrfBase, data.calculationDetails.irrfRate, data.calculationDetails.irrfDeduction, data.calculationDetails.irrfValue, data.calculationDetails.fgtsBase, data.calculationDetails.fgtsRate, data.calculationDetails.fgtsValue
    ];

    const result = await db.query(query, params);
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Erro ao salvar cálculo de folha:', error);
    res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
  }
});

// 4. BUSCAR CÁLCULOS DE UM PERÍODO
router.get('/calculations/:competencyMonth', async (req: Request, res: Response) => {
  try {
    const { competencyMonth } = req.params;
    const { unitId } = req.query;
    
    let query = `
      SELECT pc.*, e.employee_name as name 
      FROM payroll_calculations pc
      JOIN employees e ON e.id = pc.employee_id
      WHERE pc.competency_month = $1`;
    
    const params: any[] = [competencyMonth];
    
    if (unitId) {
      query += ' AND e.unit_id = $2';
      params.push(unitId);
    }
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    console.error('Erro ao buscar cálculos de folha:', error);
    res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
  }
});

export default router;
