import { CreateCheckoutPixUseCase } from '@/application/use-cases/checkout/pix/create-pix-checkout-use-case';
import { MercadoPagoPaymentService } from '@/infra/mercadopago/mercadopago-payment-service';

export function makeCreateCheckoutPix() {
  const checkoutPixRepository = new MercadoPagoPaymentService();
  const createCheckoutPixUseCase = new CreateCheckoutPixUseCase(checkoutPixRepository);

  return createCheckoutPixUseCase;
}
