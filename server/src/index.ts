import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import pool from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes Placeholder
app.get('/', (req: Request, res: Response) => {
  res.send('API ADJPA ERP Rodando!');
});

// Heath Check / DB Check
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'OK', time: result.rows[0].now });
  } catch (error) {
    console.error('Erro no healthcheck:', error);
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

// Authentication System placeholder
app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: 'Email e senha são obrigatórios' });
    return;
  }

  try {
    // This is a simple login, no bcrypt check yet for DEMO
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      res.status(401).json({ error: 'Usuário não encontrado' });
      return;
    }

    // In a real scenario, use bcrypt.compare(password, user.password_hash)
    // For now, since we're migrating, we'll allow it or use a default
    
    res.json({
      token: 'mock-jwt-token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        unitId: user.unit_id
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// Members Routes
app.get('/api/members', async (req: Request, res: Response): Promise<void> => {
  try {
    const { unitId } = req.query;
    let queryText = 'SELECT * FROM members';
    const params = [];

    if (unitId) {
      queryText += ' WHERE unit_id = $1';
      params.push(unitId);
    }

    const result = await pool.query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar membros:', error);
    res.status(500).json({ error: 'Erro ao buscar membros' });
  }
});

// Initialize Server
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
