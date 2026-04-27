/**
 * ============================================================================
 * GEMINISERVICE.TS
 * ============================================================================
 *
 * O QUE ESTE ARQUIVO FAZ?
 * ------------------------
 * Serviço do frontend para gemini service.
 *
 * ONDE É USADO?
 * -------------
 * Usado por outros arquivos para lógica de negócio ou utilidades.
 *
 * COMO FUNCIONA?
 * --------------
 * Ajuda o sistema com uma funcionalidade específica.
 */


import { GoogleGenAI } from "@google/genai";

/**
 * BLOCO PRINCIPAL
 * ===============
 *
 * Define o bloco principal deste arquivo (gemini service).
 */

export class GeminiService {
  private quotaBlockedUntil: number = 0;
  private retryCount: number = 0;
  private readonly MAX_RETRIES = 2;
  private readonly QUOTA_BLOCK_DURATION = 60000; // 1 minute

  constructor() {}

  // Helper para instanciar o SDK garantindo que a API_KEY atualizada seja usada
  // Agora ele busca primeiro por GEMINI_API_KEY (padrão local)
  private getClient() {
    // Em ambiente Vite usamos import.meta.env, mas o SDK do GoogleGenAI pode precisar da chave direta
    // @ts-ignore
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || process.env?.GEMINI_API_KEY || process.env?.API_KEY;
    
    if (!apiKey) {
      console.warn("Gemini API Key não encontrada.");
      return null;
    }
    
    return new GoogleGenAI({ apiKey });
  }

  async analyzeChurchHealth(data: any): Promise<string> {
    // Check if currently blocked by quota
    if (Date.now() < this.quotaBlockedUntil) {
      const remainingTime = Math.ceil((this.quotaBlockedUntil - Date.now()) / 1000);
      return `Insights indisponíveis. Tente novamente em ${remainingTime} segundos.`;
    }

    const ai = this.getClient();
    if (!ai) return "Serviço de inteligência artificial indisponível.";

    const prompt = `Como um consultor especializado em crescimento de igrejas, analise os seguintes dados e forneça 3 insights estratégicos curtos (máximo 2 frases cada) em português:
    Membros: ${data.totalMembers}
    Ativos: ${data.activeMembers}
    Receita: R$ ${data.monthlyRevenue}
    Despesas: R$ ${data.monthlyExpenses}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });
      this.retryCount = 0; // Reset retry count on success
      return response.text || "Sem insights disponíveis no momento.";
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.status === 429) {
        this.quotaBlockedUntil = Date.now() + this.QUOTA_BLOCK_DURATION;
        console.warn("⚠️ Gemini API: Quota excedida (429). Bloqueado por 1 minuto.");
        
        if (this.retryCount < this.MAX_RETRIES) {
          this.retryCount++;
          console.log(`Tentativa ${this.retryCount}/${this.MAX_RETRIES} - Aguardando para retry...`);
          await new Promise(resolve => setTimeout(resolve, 2000 * this.retryCount));
          return this.analyzeChurchHealth(data);
        }
        
        return "Insights temporariamente indisponíveis devido ao limite de uso da API gratuita. Tente novamente em alguns minutos.";
      }
      // Chave expirada ou inválida — não logar repetidamente
      const msg = error?.message || '';
      if (msg.includes('API_KEY_INVALID') || msg.includes('expired') || msg.includes('API key')) {
        return "ERRO_API_KEY: Chave da API Gemini expirada. Configure uma nova chave em GEMINI_API_KEY.";
      }
      console.error("Gemini Error:", error);
      return "Erro ao processar insights de IA.";
    }
  }

  async generatePastoralResponse(topic: string) {
    const ai = this.getClient();
    if (!ai) {
      return "⚠️ **Serviço de IA não configurado**\n\nPara habilitar o Escritor IA, você precisa:\n1. Criar um arquivo `.env` na raiz do projeto\n2. Adicionar sua chave: `GEMINI_API_KEY=sua_chave_aqui`\n3. Obter a chave em: https://makersuite.google.com/app/apikey\n\n**Modo Demonstração**\n\nTema: " + topic + "\n\n📝 *Mensagem pastoral gerada automaticamente*:\n\n\"Que a graça e a paz do nosso Senhor Jesus Cristo estejam com todos vocês. Hoje refletimos sobre '" + topic + "', um tema que nos convida a meditar na profundidade do amor divino e no propósito que Deus tem para cada um de nós.\n\nA Bíblia nos ensina em Jeremias 29:11: 'Porque eu bem sei os pensamentos que tenho a vosso favor, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.'\n\nQue esta palavra traga esperança ao seu coração e força para sua jornada de fé. Amém!\"\n\n🤖 *Esta é uma mensagem de demonstração. Configure a API Gemini para gerar conteúdo personalizado.*";
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: `Escreva um curto devocional ou mensagem pastoral sobre o tema: ${topic}. Seja encorajador e bíblico.`,
      });
      return response.text || "Não foi possível gerar a mensagem pastoral.";
    } catch (error: any) {
      if (error?.message?.includes('429') || error?.status === 429) {
        console.warn("⚠️ Gemini API: Quota excedida (429).");
        return "⚠️ **Limite de uso da API atingido**\n\nVocê atingiu o limite de requisições da conta gratuita. Por favor, tente novamente em um minuto.\n\n**Devocional de Backup**:\n\n\"Confie no Senhor de todo o seu coração e não se estribe no seu próprio entendimento; reconheça-o em todos os seus caminhos, e ele endireitará as suas veredas.\" - Provérbios 3:5-6";
      }
      console.error("Gemini Error:", error);
      return "⚠️ **Erro ao conectar com o serviço IA**\n\nVerifique sua conexão e a configuração da API_KEY.\n\n**Mensagem de Backup**\n\n\"O Senhor é o meu pastor; nada me faltará.\" - Salmo 23:1";
    }
  }

  // Novo método para gerar conteúdo específico (baseado na referência)
  async generateSpecificContent(topic: string, type: 'devotional' | 'sermon' | 'announcement' | 'prayer') {
    const ai = this.getClient();
    if (!ai) {
      let demoContent = "";
      
      switch (type) {
        case 'devotional':
          demoContent = "⚠️ **Serviço de IA não configurado**\n\nPara habilitar o Escritor IA, configure sua API_KEY.\n\n**Devocional Demonstração**\n\nTema: " + topic + "\n\n📖 **Versículo Chave**\n\"Porque eu bem sei os pensamentos que tenho a vosso favor, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.\" - Jeremias 29:11\n\n📝 **Reflexão**\nHoje meditamos sobre '" + topic + "'. Esta palavra nos lembra que Deus tem um plano maravilhoso para cada um de nós. Mesmo quando não entendemos os caminhos que percorremos, podemos confiar que Sua mão nos guia com amor e propósito.\n\n🙏 **Oração**\nSenhor Deus, obrigado pelo Teu plano perfeito para nossas vidas. Aumenta nossa fé para confiar em Ti mesmo nos momentos difíceis. Que possamos encontrar esperança e força em Tua palavra. Em nome de Jesus, amém.\n\n🤖 *Configure a API Gemini para conteúdo personalizado.*";
          break;
        case 'sermon':
          demoContent = "⚠️ **Serviço de IA não configurado**\n\nPara habilitar o Escritor IA, configure sua API_KEY.\n\n**Esboço de Sermão Demonstração**\n\nTema: " + topic + "\n\n1) **Introdução**\nIrmãos e irmãs, hoje vamos refletir sobre '" + topic + "', um tema que ressoa profundamente em nossos corações e nos desafia a crescer em nossa fé.\n\n2) **Três Pontos Principais**\n\n**a) A Promessa de Deus**\n- Base: Jeremias 29:11\n- Deus tem pensamentos de paz para nós\n- Seus planos são sempre bons\n\n**b) A Confiança em Meio às Dificuldades**\n- Mesmo no sofrimento, Deus está no controle\n- Nossa esperança está em Suas promessas\n- A fé nos sustenta nos momentos de incerteza\n\n**c) O Propósito Eterno**\n- Tudo contribui para nosso bem (Romanos 8:28)\n- Deus transforma provações em bênçãos\n- Nosso destino final é a glória eterna\n\n3) **Aplicação Prática**\n- Confie em Deus mesmo quando não entender\n- Ore buscando direção divina\n- Compartilhe esperança com outros\n\n4) **Conclusão**\nQue possamos viver com a certeza de que Deus tem o melhor para nós, e que Seus planos se cumprirão em nossas vidas.\n\n🤖 *Configure a API Gemini para esboços personalizados.*";
          break;
        case 'announcement':
          demoContent = "⚠️ **Serviço de IA não configurado**\n\nPara habilitar o Escritor IA, configure sua API_KEY.\n\n**Comunicado Demonstração**\n\n📢 **AVISO À COMUNIDADE**\n\n**Assunto:** " + topic + "\n\n**Data:** [Inserir data]\n**Local:** [Inserir local]\n**Horário:** [Inserir horário]\n\n**Descrição:**\nQueridos irmãos e irmãs,\n\nTemos a alegria de convidar a todos para participar do nosso evento especial sobre '" + topic + "'. Será um momento de comunhão, aprendizado e renovo espiritual.\n\n**Informações Importantes:**\n- Cheguem com 15 minutos de antecedência\n- Tragam sua Bíblia\n- Convidem amigos e familiares\n- Haverá espaço para crianças\n\n**Contato:**\nPara mais informações, fale com a secretaria ou ligue para [telefone].\n\nEsperamos contar com sua presença!\n\nCom amor em Cristo,\n\n[Nome da igreja]\n\n🤖 *Configure a API Gemini para comunicados personalizados.*";
          break;
        case 'prayer':
          demoContent = "⚠️ **Serviço de IA não configurado**\n\nPara habilitar o Escritor IA, configure sua API_KEY.\n\n**Oração Demonstração**\n\n🙏 **Oração por '" + topic + "'**\n\nPai Celestial,\n\n**Adoração**\nNós Te adoramos, ó Deus soberano, Criador dos céus e da terra. Tu és digno de toda honra, glória e poder. Teu nome é santo e maravilhoso.\n\n**Confissão**\nSenhor, reconhecemos nossas falhas e pecados. Pedimos Teu perdão pelas vezes em que duvidamos de Tua bondade e não confiamos plenamente em Teus planos. Lava-nos no sangue de Jesus e restaura nossa comunhão contigo.\n\n**Ação de Graças**\nObrigado, Pai, por Tuo amor infinito e por '" + topic + "'. Agradecemos por Tua misericórdia que se renova a cada manhã e pela esperança que colocaste em nossos corações.\n\n**Súplicas**\nSenhor, Te pedimos especificamente por '" + topic + "'. Que Tua vontade seja feita nesta área de nossas vidas. Dá-nos sabedoria para entender Teus planos, força para perseverar nas dificuldades e fé para confiar em Teu timing.\n\n**Intercessão**\nOramos por nossos irmãos e irmãs que estão passando por desafios relacionados a '" + topic + ". Que Teu consolo e Tua força estejam sobre cada um deles.\n\n**Encerramento**\nTudo isso Te pedimos em nome de Jesus Cristo, nosso Senhor e Salvador, que vive e reina para todo o sempre. Amém!\n\n🤖 *Configure a API Gemini para orações personalizadas.*";
          break;
      }
      
      return demoContent;
    }

    try {
      let prompt = '';
      
      switch (type) {
        case 'devotional':
          prompt = `Escreva um devocional bíblico sobre: ${topic}. Inclua uma versículo chave, reflexão breve e oração final. Seja pastoral e encorajador.`;
          break;
        case 'sermon':
          prompt = `Prepare um esboço de sermão sobre: ${topic}. Inclua: 1) Introdução, 2) 3 pontos principais com versículos, 3) Aplicação prática, 4) Conclusão. Use linguagem acessível.`;
          break;
        case 'announcement':
          prompt = `Crie um comunicado para a igreja sobre: ${topic}. Seja claro, informativo e acolhedor. Inclua data, local e informações práticas se aplicável.`;
          break;
        case 'prayer':
          prompt = `Escreva uma oração pastoral sobre: ${topic}. Seja bíblica, específica e cheia de fé. Inclui adoração, confissão, gratidão e súplicas.`;
          break;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });
      
      return response.text || "Não foi possível gerar o conteúdo.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "⚠️ **Erro ao gerar conteúdo específico**\n\nVerifique sua conexão e a configuração da API_KEY.\n\nTente novamente em alguns minutos.";
    }
  }

  // Métodos para compatibilidade com a UI
  isQuotaBlocked(): boolean {
    return Date.now() < this.quotaBlockedUntil;
  }

  getBlockedTimeRemaining(): number {
    const remaining = this.quotaBlockedUntil - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  }
}

export const geminiService = new GeminiService();
