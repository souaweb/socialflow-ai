
import { generateSalesResponse } from './geminiService';
import { dbService } from './dbService';

/**
 * Este Worker simula o que aconteceria em uma Supabase Edge Function ou um Servidor Node.js.
 * Ele 'escuta' eventos externos e dispara a inteligência artificial.
 */
export const automationWorker = {
  processIncomingMessage: async (platform: string, user: string, content: string, businessId: string) => {
    console.log(`[Worker] Nova mensagem detectada no ${platform}: de ${user}`);
    
    // Busca o contexto do negócio no banco de dados
    const businesses = await dbService.getBusinesses();
    const activeBusiness = businesses.find(b => b.id === businessId);
    
    if (!activeBusiness) return;

    // Dispara a IA para gerar a resposta de vendas
    const aiResponse = await generateSalesResponse(
      platform,
      content,
      activeBusiness.knowledgeBase
    );

    // Registra a interação no histórico (Activity Log)
    const logs = JSON.parse(localStorage.getItem('socialflow_logs') || '[]');
    logs.unshift({
      id: 'log_' + Date.now(),
      businessId,
      platform,
      user,
      timestamp: new Date(),
      content,
      aiResponse
    });
    localStorage.setItem('socialflow_logs', JSON.stringify(logs));

    // Aqui seria onde o código chamaria a API oficial (WhatsApp/Instagram) para enviar o texto
    console.log(`[Worker] Resposta IA enviada via API oficial: ${aiResponse}`);
    
    return aiResponse;
  }
};
