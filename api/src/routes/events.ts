/**
 * EVENTS.TS — Alinhado ao schema PT-BR
 * Tabela: eventos_igreja
 */

import { Router } from 'express';
import Database from '../database';
import { randomUUID } from 'crypto';

const router = Router();
const db = Database.getInstance();

const TIPOS_VALIDOS = ['CULTO', 'REUNIAO', 'EVENTO', 'TREINAMENTO', 'CONFERENCIA'];

const mapearEvento = (row: any) => ({
  id:          row.id,
  idUnidade:   row.id_unidade,
  titulo:      row.titulo,
  descricao:   row.descricao,
  dataEvento:  row.data_evento,
  horaEvento:  row.hora_evento,
  localEvento: row.local_evento,
  tipo:        row.tipo,
  recorrente:  row.recorrente ?? false,
  criadoEm:    row.criado_em,
  atualizadoEm: row.atualizado_em,
});

// GET /events
router.get('/', async (req, res) => {
  try {
    const { idUnidade, tipo } = req.query;
    let query = 'SELECT * FROM eventos_igreja WHERE 1=1';
    const params: any[] = [];
    let i = 1;

    if (idUnidade) { query += ` AND id_unidade = $${i++}`; params.push(idUnidade); }
    if (tipo)      { query += ` AND tipo = $${i++}`;       params.push(tipo); }
    query += ' ORDER BY data_evento ASC, hora_evento ASC';

    const result = await db.query(query, params);
    res.json(result.rows.map(mapearEvento));
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// GET /events/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM eventos_igreja WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Evento não encontrado', status: 404 } });
    res.json(mapearEvento(result.rows[0]));
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// POST /events
router.post('/', async (req, res) => {
  try {
    const b = req.body;
    const tipo = TIPOS_VALIDOS.includes((b.tipo || b.type || '').toUpperCase())
      ? (b.tipo || b.type).toUpperCase() : 'EVENTO';

    const result = await db.query(
      `INSERT INTO eventos_igreja (id, id_unidade, titulo, descricao, data_evento, hora_evento, local_evento, tipo, recorrente)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        randomUUID(),
        b.idUnidade || b.id_unidade,
        b.titulo || b.title,
        b.descricao || b.description || null,
        b.dataEvento || b.data_evento || b.date,
        b.horaEvento || b.hora_evento || b.time || '00:00',
        b.localEvento || b.local_evento || b.location || '',
        tipo,
        b.recorrente ?? b.recurrent ?? false,
      ]
    );
    res.status(201).json(mapearEvento(result.rows[0]));
  } catch (error: any) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// PUT /events/:id
router.put('/:id', async (req, res) => {
  try {
    const b = req.body;
    const tipo = TIPOS_VALIDOS.includes((b.tipo || b.type || '').toUpperCase())
      ? (b.tipo || b.type).toUpperCase() : undefined;

    const result = await db.query(
      `UPDATE eventos_igreja
       SET titulo=$1, descricao=$2, data_evento=$3, hora_evento=$4, local_evento=$5,
           tipo=COALESCE($6::tipo_evento, tipo), recorrente=$7, atualizado_em=CURRENT_TIMESTAMP
       WHERE id=$8 RETURNING *`,
      [
        b.titulo || b.title,
        b.descricao || b.description || null,
        b.dataEvento || b.data_evento || b.date,
        b.horaEvento || b.hora_evento || b.time || '00:00',
        b.localEvento || b.local_evento || b.location || '',
        tipo || null,
        b.recorrente ?? b.recurrent ?? false,
        req.params.id,
      ]
    );
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Evento não encontrado', status: 404 } });
    res.json(mapearEvento(result.rows[0]));
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

// DELETE /events/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM eventos_igreja WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: { message: 'Evento não encontrado', status: 404 } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: { message: 'Erro interno', status: 500, details: error.message } });
  }
});

export default router;
