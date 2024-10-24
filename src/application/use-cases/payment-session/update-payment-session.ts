import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { PaymentSessionRepository } from '@/infra/database/repositories/payment-session-repository';
import { UpdatePaymentSessionException } from './errors/update-payment-session-exception';

export class UpdatePaymentSessionUseCase {
  constructor(private paymentSessionRepository: PaymentSessionRepository) {}

  async execute(inputPaymentSession: PaymentSession): Promise<PaymentSession> {
    try {
      const paymentsession = PaymentSession.create({ ...inputPaymentSession.props });

      return await this.paymentSessionRepository.update(paymentsession);
    } catch (err) {
      throw new UpdatePaymentSessionException(err);
    }
  }
}
