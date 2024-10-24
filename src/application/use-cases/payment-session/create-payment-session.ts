import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { PaymentSessionRepository } from '@/infra/database/repositories/payment-session-repository';
import { CreatePaymentSessionException } from './errors/create-payment-session-exception';

export class CreatePaymentSessionUseCase {
  constructor(private paymentSessionRepository: PaymentSessionRepository) {}

  async execute(inputPaymentSession: PaymentSession): Promise<PaymentSession> {
    try {
      const paymentsession = PaymentSession.create({
        ...inputPaymentSession.props,
      });
      return await this.paymentSessionRepository.create(paymentsession);
    } catch (err) {
      throw new CreatePaymentSessionException(err);
    }
  }
}
