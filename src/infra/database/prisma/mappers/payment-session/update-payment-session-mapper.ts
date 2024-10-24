import { PaymentSession } from '@/domain/entities/payment-session-entity';
import { Prisma } from '@prisma/client';
import { PaymentSessionMapper } from './payment-session-mapper';

export class UpdatePaymentSessionMapper extends PaymentSessionMapper {
  static toPrisma(paymentsession: PaymentSession): Prisma.PaymentSessionUpdateInput {
    return {
      sessionId: paymentsession.sessionId,
      email: paymentsession.email!,
      isPaid: paymentsession.isPaid,
      paymentType: paymentsession.paymentType,
    };
  }
}
