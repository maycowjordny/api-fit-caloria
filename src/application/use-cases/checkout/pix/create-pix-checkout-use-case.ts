import { MercadoPagoRepository } from '@/infra/mercadopago/repositories/mercadopago-repository';
import { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';
import { CreateCheckoutPixException } from '../errors/create-checkout-pix-exception';
import { EmailNotProvidedException } from '../errors/email-not-provided-exception';

export class CreateCheckoutPixUseCase {
  constructor(private mercadopagoRepository: MercadoPagoRepository) {}

  async execute(email: string): Promise<PreferenceResponse> {
    try {
      if (!email) throw new EmailNotProvidedException();
      return this.mercadopagoRepository.createCheckoutPixSession(email);
    } catch (err) {
      throw new CreateCheckoutPixException(err);
    }
  }
}
