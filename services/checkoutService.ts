
import { PlanLevel, GatewayType } from '../types';

/**
 * Este serviço simula a chamada para o seu backend que gera a sessão de pagamento real.
 * Em produção, você substituiria o fetch por sua URL do Vercel/Render/DigitalOcean.
 */
export const checkoutService = {
  createPaymentSession: async (plan: PlanLevel, gateway: GatewayType, email: string) => {
    console.log(`Iniciando checkout real via ${gateway} para o plano ${plan}`);
    
    // Simulação de chamada de API para o Backend
    // const response = await fetch('/api/create-checkout', { method: 'POST', body: JSON.stringify({ plan, gateway, email }) });
    // return await response.json(); 

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: 'https://checkout.stripe.com/pay/demo_session', // URL real retornada pelo seu backend
          id: 'pay_' + Math.random().toString(36).substr(2, 9)
        });
      }, 1000);
    });
  }
};
