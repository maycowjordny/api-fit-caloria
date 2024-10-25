import { preference } from '@/lib/mercadopago/mercadopago';
import { randomUUID } from 'crypto';
import { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';
import { MercadoPagoRepository } from './repositories/mercadopago-repository';

export class MercadoPagoPaymentService implements MercadoPagoRepository {
  async createCheckoutPixSession(email: string): Promise<PreferenceResponse> {
    return preference.create({
      body: {
        items: [
          {
            id: randomUUID(),
            title: 'Página Fit-caloria',
            description: 'Crie sua dieta personalizada',
            quantity: 1,
            unit_price: 4.99,
          },
        ],
        external_reference: randomUUID(),
        notification_url: 'https://api-fit-caloria.onrender.com/webhooks/mercadopago',
        back_urls: {
          success: 'https://www.fit-caloria.com.br',
          failure: 'https://www.fit-caloria.com.br',
          pending: 'https://www.fit-caloria.com.br',
        },
        auto_return: 'approved',
        payer: {
          email: email,
        },
      },
    });
  }
}
