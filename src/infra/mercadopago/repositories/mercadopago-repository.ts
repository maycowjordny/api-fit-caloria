import { PreferenceResponse } from 'mercadopago/dist/clients/preference/commonTypes';

export interface MercadoPagoRepository {
  createCheckoutPixSession(email: string): Promise<PreferenceResponse>;
}
