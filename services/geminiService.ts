
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  constructor() {}

  // Helper para instanciar o SDK garantindo que a API_KEY atualizada seja usada
  // Fix: Initializing GoogleGenAI with named parameter apiKey using process.env.API_KEY directly.
  private getClient() {
    if (!process.env.API_KEY) {
      return null;
    }
    
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeChurchHealth(data: any) {
    const ai = this.getClient();
    if (!ai) return "Serviço de inteligência artificial indisponível.";

    const prompt = `Como um consultor especializado em crescimento de igrejas, analise os seguintes dados e forneça 3 insights estratégicos curtos (máximo 2 frases cada) em português:
    Membros: ${data.totalMembers}
    Ativos: ${data.activeMembers}
    Receita: R$ ${data.monthlyRevenue}
    Despesas: R$ ${data.monthlyExpenses}`;

    try {
      // Fix: Using ai.models.generateContent with model name and prompt string.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      // Fix: Accessing .text property directly from GenerateContentResponse instead of calling it as a method.
      return response.text || "Sem insights disponíveis no momento.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Erro ao processar insights de IA.";
    }
  }

  async generatePastoralResponse(topic: string) {
    const ai = this.getClient();
    if (!ai) return "Serviço de mensagens pastorais indisponível.";

    try {
      // Fix: Using ai.models.generateContent with model name and prompt string.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva um curto devocional ou mensagem pastoral sobre o tema: ${topic}. Seja encorajador e bíblico.`,
      });
      // Fix: Accessing .text property directly from GenerateContentResponse.
      return response.text || "Não foi possível gerar a mensagem pastoral.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Ocorreu um erro ao gerar a mensagem.";
    }
  }
}

export const geminiService = new GeminiService();
