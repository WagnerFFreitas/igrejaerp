/**
 * ============================================================================
 * UNITCONTROLLER.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Controller que processa requisições relacionadas a unit controller.
 *
 * ONDE É USADO?
 * -------------
 * Usado pelo servidor backend para processar requisições.
 *
 * COMO FUNCIONA?
 * --------------
 * Executa lógica de backend e responde a chamadas externas.
 */

import { Request, Response } from 'express';
import Database from '../database';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (unit controller).
 */

function mapUnitToFrontend(row: any) {
  return {
    id: row.id_unidade,
    idUnidade: row.id_unidade,
    nome: row.nome,
    cnpj: row.cnpj,
    enderecoLinha1: row.logradouro,
    enderecoLinha2: row.numero,
    logradouro: row.logradouro,
    numero: row.numero,
    bairro: row.bairro,
    cidade: row.cidade,
    estado: row.estado,
    cep: row.cep,
    pais: row.pais,
    email: row.email || '',
    telefone: row.telefone || '',
    situacao: row.situacao,
    ativo: row.ativo,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}

const UNIT_SELECT = `
  SELECT
    u.*,
    e.logradouro,
    e.numero,
    e.complemento,
    e.bairro,
    e.cidade,
    e.estado,
    e.cep,
    e.pais,
    ce.valor AS email,
    ct.valor AS telefone
  FROM unidades u
  LEFT JOIN enderecos e ON e.id_endereco = u.id_endereco
  LEFT JOIN contatos ce ON ce.id_entidade = u.id_unidade AND ce.tipo_entidade = 'UNIDADE' AND ce.tipo_contato = 'EMAIL' AND ce.principal = true
  LEFT JOIN contatos ct ON ct.id_entidade = u.id_unidade AND ct.tipo_entidade = 'UNIDADE' AND ct.tipo_contato = 'TELEFONE' AND ct.principal = true
`;

async function upsertContatosUnidade(
  client: any,
  idUnidade: string,
  body: Record<string, any>
): Promise<void> {
  const contatos: Array<{ tipo: string; valor: string | null }> = [];

  if (body.email) contatos.push({ tipo: 'EMAIL', valor: body.email });
  if (body.telefone) contatos.push({ tipo: 'TELEFONE', valor: body.telefone });

  // Remover contatos antigos
  await client.query(
    'DELETE FROM contatos WHERE tipo_entidade = $1 AND id_entidade = $2',
    ['UNIDADE', idUnidade]
  );

  // Inserir novos contatos
  for (let i = 0; i < contatos.length; i++) {
    const c = contatos[i];
    if (!c.valor) continue;
    await client.query(
      `INSERT INTO contatos (tipo_entidade, id_entidade, tipo_contato, valor, principal)
       VALUES ($1, $2, $3, $4, $5)`,
      ['UNIDADE', idUnidade, c.tipo, c.valor, i === 0]
    );
  }
}

export class UnitController {
  static async getAll(req: Request, res: Response) {
    const db = Database.getInstance();
    try {
      const result = await db.query(`${UNIT_SELECT} ORDER BY u.nome`);
      const unidades = result.rows.map(mapUnitToFrontend);
      res.json({ unidades });
    } catch (error: any) {
      console.error('Erro ao buscar unidades:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  };

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const db = Database.getInstance();
    try {
      const result = await db.query(`${UNIT_SELECT} WHERE u.id_unidade = $1`, [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Unidade não encontrada' } });
      }
      res.json(mapUnitToFrontend(result.rows[0]));
    } catch (error: any) {
      console.error('Erro ao buscar unidade:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  };

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      nome,
      cnpj,
      telefone,
      email,
      logradouro,
      enderecoLinha1,
      numero,
      enderecoLinha2,
      bairro,
      cidade,
      estado,
      cep,
      pais,
      situacao,
      ativo,
    } = req.body;
    const db = Database.getInstance();
    try {
      const result = await db.transaction(async (client) => {
        const current = await client.query('SELECT id_endereco FROM unidades WHERE id_unidade = $1', [id]);
        if (current.rows.length === 0) return current;

        let idEndereco = current.rows[0].id_endereco;
        const hasAddressChange = [logradouro, enderecoLinha1, numero, enderecoLinha2, bairro, cidade, estado, cep, pais]
          .some(value => value !== undefined);

        if (hasAddressChange) {
          if (!idEndereco) {
            const inserted = await client.query(
              `INSERT INTO enderecos (logradouro, numero, bairro, cidade, estado, cep, pais)
               VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id_endereco`,
              [logradouro || enderecoLinha1 || null, numero || enderecoLinha2 || null, bairro || null, cidade || null, estado || null, cep || null, pais || 'Brasil']
            );
            idEndereco = inserted.rows[0].id_endereco;
          } else {
            await client.query(
              `UPDATE enderecos
               SET logradouro = COALESCE($1, logradouro),
                   numero = COALESCE($2, numero),
                   bairro = COALESCE($3, bairro),
                   cidade = COALESCE($4, cidade),
                   estado = COALESCE($5, estado),
                   cep = COALESCE($6, cep),
                   pais = COALESCE($7, pais),
                   atualizado_em = CURRENT_TIMESTAMP
               WHERE id_endereco = $8`,
              [logradouro || enderecoLinha1, numero || enderecoLinha2, bairro, cidade, estado, cep, pais, idEndereco]
            );
          }
        }

        await client.query(
          `UPDATE unidades
           SET nome = COALESCE($1, nome),
               cnpj = COALESCE($2, cnpj),
               id_endereco = COALESCE($3, id_endereco),
               situacao = COALESCE($4, situacao),
               ativo = COALESCE($5, ativo),
               atualizado_em = CURRENT_TIMESTAMP
           WHERE id_unidade = $6`,
          [nome, cnpj, idEndereco, situacao, ativo, id]
        );

        // Atualizar contatos
        await upsertContatosUnidade(client, id, req.body);

        return client.query(`${UNIT_SELECT} WHERE u.id_unidade = $1`, [id]);
      });
      if (result.rows.length === 0) {
        return res.status(404).json({ error: { message: 'Unidade não encontrada' } });
      }
      res.json(mapUnitToFrontend(result.rows[0]));
    } catch (error: any) {
      console.error('Erro ao atualizar unidade:', error);
      res.status(500).json({ error: { message: 'Erro interno', details: error.message } });
    }
  }
}
