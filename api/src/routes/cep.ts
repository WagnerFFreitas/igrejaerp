/**
 * ============================================================================
 * CEP.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Rotas de API para cep.
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
import https from 'https';

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (cep).
 */

const router = Router();

router.get('/:cep', async (req, res) => {
  const cep = req.params.cep.replace(/\D/g, '');
  if (cep.length !== 8) {
    return res.status(400).json({ error: 'CEP inválido' });
  }

  try {
    const data = await new Promise<any>((resolve, reject) => {
      https.get(`https://viacep.com.br/ws/${cep}/json/`, (response) => {
        let raw = '';
        response.on('data', chunk => raw += chunk);
        response.on('end', () => {
          try { resolve(JSON.parse(raw)); }
          catch { reject(new Error('Resposta inválida do ViaCEP')); }
        });
      }).on('error', reject);
    });

    if (data.erro) {
      return res.status(404).json({ error: 'CEP não encontrado' });
    }
    res.json(data);
  } catch (error: any) {
    console.error('Erro ao consultar CEP:', error.message);
    res.status(500).json({ error: 'Erro ao consultar CEP' });
  }
});

export default router;
