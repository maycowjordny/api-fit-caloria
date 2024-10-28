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
            unit_price: 9.99,
          },
        ],
        payment_methods: {
          excluded_payment_types: [
            { id: 'credit_card' },
            { id: 'debit_card' },
            { id: 'ticket' },
            { id: 'atm' },
            { id: 'prepaid_card' },
          ],
        },
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
