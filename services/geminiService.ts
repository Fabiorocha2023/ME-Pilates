
import { GoogleGenAI } from "@google/genai";
import { STUDIO_INFO } from "../constants";

export class GeminiService {
  private cleanResponse(text: string): string {
    if (!text) return '';
    // Removes the specific intro requested by the user and common AI-generated preambles
    return text
      .replace(/Aqui está uma sugestão de mensagem curta, clara e acolhedora:\s*---?\s*/gi, '')
      .replace(/^Aqui está uma sugestão de mensagem.*:?\s*/i, '')
      .replace(/^Aqui está a sua mensagem.*:?\s*/i, '')
      .replace(/^Certamente! Aqui está.*:?\s*/i, '')
      .trim();
  }

  async generateWelcomeMessage(studentName: string, accessLink: string): Promise<string> {
    const prompt = `Gere uma mensagem curta e calorosa de boas-vindas para o WhatsApp do novo aluno(a) ${studentName} do estúdio de pilates da Roberta Chote. 
    Mencione que o acesso ao App é feito pelo link: ${accessLink}. 
    Explique que no App ele(a) poderá trocar horários, ver pagamentos e gerenciar seu perfil. 
    Tom de saúde e bem-estar. Não use termos complexos. Emojis: ✨🌿.
    IMPORTANTE: Retorne APENAS o texto da mensagem final, sem nenhuma introdução ou frase explicativa. A frase de abertura deve ser "Seja muito bem-vindo(a) ao estúdio de pilates".`;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return this.cleanResponse(response.text || `Seja muito bem-vindo(a) ao estúdio de pilates, ${studentName}! 🌿 Acesse sua área individual aqui: ${accessLink}. Estamos felizes em ter você conosco!`);
    } catch (e) {
      return `Seja muito bem-vindo(a) ao estúdio de pilates, ${studentName}! 🌿 Acesse sua área individual aqui: ${accessLink} para gerenciar suas aulas e financeiro. ✨`;
    }
  }

  async generateFarewellMessage(studentName: string): Promise<string> {
    const prompt = `Gere uma mensagem de despedida carinhosa para o WhatsApp do aluno(a) ${studentName} que está deixando o estúdio de pilates. Agradeça pelo tempo juntos e diga que as portas estarão sempre abertas. Tom profissional porém acolhedor. Emojis: ✨🙏.
    IMPORTANTE: Retorne APENAS o texto da mensagem final, sem nenhuma introdução ou frase explicativa.`;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return this.cleanResponse(response.text || `Até breve, ${studentName}! 🙏 Foi um prazer ter você conosco no estúdio de pilates. ✨`);
    } catch (e) {
      return `Até breve, ${studentName}! 🙏 Agradecemos por confiar no nosso trabalho e estaremos sempre aqui quando quiser voltar. ✨`;
    }
  }

  async generatePaymentReminder(studentName: string, amount: number, dueDate: string): Promise<string> {
    const prompt = `Gere uma mensagem para WhatsApp para o aluno(a) ${studentName} do estúdio de pilates. Valor: R$${amount}, vencimento em ${dueDate}. O tom deve ser polido, focado em saúde. Termine com o endereço ${STUDIO_INFO.address}. Use emojis como ✨ e 🌿.
    IMPORTANTE: Retorne APENAS o texto da mensagem final.`;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return this.cleanResponse(response.text || 'Lembrete de pagamento.');
    } catch (error) {
      return `Olá, ${studentName}! 🌿 Passando para lembrar que o vencimento da sua mensalidade no estúdio de pilates está próximo (${dueDate}). ✨`;
    }
  }

  async summarizeSchedule(classes: any[]): Promise<string> {
    const prompt = `Resuma a agenda de hoje para Roberta Chote do estúdio de pilates. Use um tom motivacional. Agenda: ${JSON.stringify(classes)}.
    IMPORTANTE: Retorne APENAS o texto do resumo.`;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return this.cleanResponse(response.text || 'Sem resumo disponível.');
    } catch (error) {
      return 'Roberta, seu estúdio de pilates está pronto para transformar vidas hoje!';
    }
  }
}

export const geminiService = new GeminiService();
