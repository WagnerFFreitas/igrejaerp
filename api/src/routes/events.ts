/**
 * ============================================================================
 * EVENTS.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para events.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import { Router } from 'express';
import Database from '../database';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (events).
 */

const router = Router();
const db = Database.getInstance();

// Church Events
router.get('/', async (req, res) => {
  try {
    const { unitId, type } = req.query;
    
    let query = 'SELECT * FROM church_events WHERE 1=1';
    const params = [];
    let paramIndex = 1;
    
    if (unitId) {
      query += ` AND unit_id = $${paramIndex++}`;
      params.push(unitId);
    }
    
    if (type) {
      query += ` AND type = $${paramIndex++}`;
      params.push(type);
    }
    
    query += ' ORDER BY data_evento, hora_evento';
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500 } });
  }
});

export default router;
